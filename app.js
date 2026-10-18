(() => {
  "use strict";

  const courseData = window.COURSE_DATA;
  if (!courseData || !Array.isArray(courseData.lessons)) {
    document.body.innerHTML =
      "<p style='padding:24px;font-size:20px;'>학습 자료를 불러오지 못했습니다. 페이지를 새로고침 해주세요.</p>";
    return;
  }

  const courseId =
    courseData.courseId ||
    (typeof COURSE_ID !== "undefined" ? COURSE_ID : "month1");
  const allLessons = courseData.lessons;
  const TOTAL_DAYS = allLessons.length;
  const DAYS_PER_WEEK = 7;
  const TOTAL_WEEKS = Math.ceil(TOTAL_DAYS / DAYS_PER_WEEK);

  const PROGRESS_KEY_V4 = `english-pattern-${courseId}-progress-v4`;
  const PROGRESS_KEY_V3 = `english-pattern-${courseId}-progress-v3`;
  const LEGACY_KEY = `english-pattern-${courseId}-completed-days`;
  const STARS_KEY = "english-pattern-total-stars";

  // DOM Elements
  const starCountEl = document.getElementById("star-count");
  const levelBadgeEl = document.getElementById("level-badge");

  const prevWeekBtn = document.getElementById("prev-week-btn");
  const nextWeekBtn = document.getElementById("next-week-btn");
  const weekBadgeEl = document.getElementById("week-badge");
  const weekTitleEl = document.getElementById("week-title");
  const weekSubcountEl = document.getElementById("week-subcount");
  const dayMenu = document.getElementById("day-menu");
  const completedSummaryEl = document.getElementById("completed-summary-text");
  const goThisWeekBtn = document.getElementById("go-this-week-btn");
  const toggleAllDaysBtn = document.getElementById("toggle-all-days-btn");

  const lessonCard = document.getElementById("lesson-card");
  const reviewCard = document.getElementById("review-card");
  const diffCard = document.getElementById("difficulty-card");

  const dayLabel = document.getElementById("day-label");
  const diffBadge = document.getElementById("diff-badge");
  const completedDateBadge = document.getElementById("completed-date-badge");
  const openReviewBtn = document.getElementById("open-review-btn");

  const lessonTitle = document.getElementById("lesson-title");
  const lessonFocus = document.getElementById("lesson-focus");
  const lessonGuide = document.getElementById("lesson-guide");

  const listenStatEl = document.getElementById("listen-stat");
  const quizStatEl = document.getElementById("quiz-stat");
  const dailyProgressBar = document.getElementById("daily-progress-bar");
  const dailyProgressText = document.getElementById("daily-progress-text");

  const mainEmoji = document.getElementById("main-emoji");
  const mainSentence = document.getElementById("main-sentence");
  const mainMeaning = document.getElementById("main-meaning");
  const sentenceChoices = document.getElementById("sentence-choices");

  const listenBtn = document.getElementById("listen-button");
  const statusEl = document.getElementById("status");
  const quizKoreanPrompt = document.getElementById("quiz-korean-prompt");
  const answerZone = document.getElementById("answer-zone");
  const wordBank = document.getElementById("word-bank");
  const toggleAnswerBtn = document.getElementById("toggle-answer-button");
  const resetQuizBtn = document.getElementById("reset-quiz-button");
  const checkAnswerBtn = document.getElementById("check-answer-button");
  const quizFeedback = document.getElementById("quiz-feedback");

  const completionReqs = document.getElementById("completion-reqs");
  const completeLessonBtn = document.getElementById("complete-lesson-button");
  const completionMessage = document.getElementById("completion-message");
  const prevBtn = document.getElementById("previous-button");
  const nextBtn = document.getElementById("next-button");

  // Date Helpers
  function getTodayIsoString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function formatShortDate(isoStr) {
    if (!isoStr || typeof isoStr !== "string") return "기록됨";
    const parts = isoStr.split("-");
    if (parts.length === 3) {
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (!Number.isNaN(m) && !Number.isNaN(d)) {
        return `${m}월 ${d}일`;
      }
    }
    return isoStr;
  }

  function formatFullKoreanDate(isoStr) {
    if (!isoStr || typeof isoStr !== "string") return "";
    const parts = isoStr.split("-");
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
        const dt = new Date(y, m - 1, d);
        const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
        const w = weekdays[dt.getDay()];
        return `${y}년 ${m}월 ${d}일(${w})`;
      }
    }
    return isoStr;
  }

  // State
  let userStars = parseInt(localStorage.getItem(STARS_KEY) || "0", 10);
  if (Number.isNaN(userStars) || userStars < 0) userStars = 0;

  let progress = loadProgress();
  let currentLessonIndex = getStartingLessonIndex();
  let displayedWeekIndex = Math.floor(currentLessonIndex / DAYS_PER_WEEK);
  let showAllDays = false;
  let currentSentenceIndex = 0;

  let isReviewMode = false;
  let reviewSentences = [];
  let currentReviewIndex = 0;

  let shuffledBlocks = [];
  let selectedBlockIds = [];
  let answerHidden = false;

  // === Storage & Migration ===
  function createDefaultProgress() {
    return {
      completedDays: [],
      completedDates: {},
      lessons: {},
      reviewDoneDays: [],
      difficulty: { days4to7: null, days8to30: null }
    };
  }

  function normalizeProgressObject(raw) {
    const clean = createDefaultProgress();
    if (!raw || typeof raw !== "object") return clean;

    if (Array.isArray(raw.completedDays)) {
      clean.completedDays = [
        ...new Set(
          raw.completedDays.filter(
            (d) => Number.isInteger(d) && d >= 1 && d <= TOTAL_DAYS
          )
        )
      ].sort((a, b) => a - b);
    }

    if (raw.completedDates && typeof raw.completedDates === "object") {
      Object.keys(raw.completedDates).forEach((k) => {
        const val = raw.completedDates[k];
        if (typeof val === "string" && val.trim()) {
          clean.completedDates[k] = val.trim();
        }
      });
    }

    // Legacy completed days without a saved date get a default date so they immediately display
    const todayIso = getTodayIsoString();
    clean.completedDays.forEach((d) => {
      if (!clean.completedDates[d]) {
        clean.completedDates[d] = todayIso;
      }
    });

    if (Array.isArray(raw.reviewDoneDays)) {
      clean.reviewDoneDays = [
        ...new Set(
          raw.reviewDoneDays.filter(
            (d) => Number.isInteger(d) && d >= 1 && d <= TOTAL_DAYS
          )
        )
      ];
    }

    if (raw.difficulty && typeof raw.difficulty === "object") {
      clean.difficulty.days4to7 =
        raw.difficulty.days4to7 || raw.difficulty.stage1 || null;
      clean.difficulty.days8to30 =
        raw.difficulty.days8to30 || raw.difficulty.stage2 || null;
    }

    const srcLessons = raw.lessons || raw.lessonProgress || {};
    if (srcLessons && typeof srcLessons === "object") {
      Object.keys(srcLessons).forEach((dayKey) => {
        const rec = srcLessons[dayKey];
        if (!rec || typeof rec !== "object") return;
        const normalizeIndices = (arr) => {
          if (!Array.isArray(arr)) return [];
          const indices = arr
            .map((item) => {
              if (Number.isInteger(item)) return item;
              if (typeof item === "string") {
                const parts = item.split("-");
                const last = parseInt(parts[parts.length - 1], 10);
                return Number.isInteger(last) ? last : -1;
              }
              return -1;
            })
            .filter((idx) => idx >= 0 && idx < 10);
          return [...new Set(indices)];
        };
        clean.lessons[dayKey] = {
          listened: normalizeIndices(rec.listened),
          solved: normalizeIndices(rec.solved)
        };
      });
    }

    return clean;
  }

  function loadProgress() {
    try {
      const savedV4 = JSON.parse(localStorage.getItem(PROGRESS_KEY_V4) || "null");
      if (savedV4 && typeof savedV4 === "object") {
        const norm = normalizeProgressObject(savedV4);
        localStorage.setItem(PROGRESS_KEY_V4, JSON.stringify(norm));
        return norm;
      }
    } catch (e) {}

    try {
      const savedV3 = JSON.parse(localStorage.getItem(PROGRESS_KEY_V3) || "null");
      if (savedV3 && typeof savedV3 === "object") {
        const migrated = normalizeProgressObject(savedV3);
        localStorage.setItem(PROGRESS_KEY_V4, JSON.stringify(migrated));
        return migrated;
      }
    } catch (e) {}

    const fallback = createDefaultProgress();
    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "[]");
      if (Array.isArray(legacy)) {
        fallback.completedDays = [
          ...new Set(
            legacy.filter((d) => Number.isInteger(d) && d >= 1 && d <= TOTAL_DAYS)
          )
        ].sort((a, b) => a - b);
        const todayIso = getTodayIsoString();
        fallback.completedDays.forEach((d) => {
          fallback.completedDates[d] = todayIso;
        });
      }
    } catch (e) {}

    return fallback;
  }

  function saveProgress() {
    localStorage.setItem(PROGRESS_KEY_V4, JSON.stringify(progress));
  }

  function getLessonRecord(day) {
    if (!progress.lessons[day]) {
      progress.lessons[day] = { listened: [], solved: [] };
    }
    if (!Array.isArray(progress.lessons[day].listened)) {
      progress.lessons[day].listened = [];
    }
    if (!Array.isArray(progress.lessons[day].solved)) {
      progress.lessons[day].solved = [];
    }
    return progress.lessons[day];
  }

  // === Gamification (Stars, Level Badge, Sound, Confetti) ===
  function getLevelTitle(stars) {
    if (stars >= 150) return "👑 영어 마스터";
    if (stars >= 90) return "🦄 패턴 마법사";
    if (stars >= 45) return "🐬 영어 모험가";
    if (stars >= 15) return "🐣 문장 어린이";
    return "🌱 새싹 탐험가";
  }

  function updateScoreboard() {
    if (starCountEl) starCountEl.textContent = String(userStars);
    if (levelBadgeEl) levelBadgeEl.textContent = getLevelTitle(userStars);
  }

  function addStars(amount) {
    userStars += amount;
    localStorage.setItem(STARS_KEY, String(userStars));
    updateScoreboard();

    const icon = document.querySelector(".star-icon");
    if (icon) {
      icon.style.animation = "none";
      setTimeout(() => {
        icon.style.animation = "popIn 0.5s ease";
      }, 10);
    }
  }

  function playEffect(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const tone = (freq, start, duration, vol = 0.08) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + start);
        gain.gain.setValueAtTime(vol, now + start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + duration);
      };

      if (type === "correct") {
        tone(523.25, 0, 0.12);
        tone(659.25, 0.1, 0.12);
        tone(783.99, 0.2, 0.22);
      } else if (type === "wrong") {
        tone(240, 0, 0.18, 0.06);
        tone(190, 0.15, 0.22, 0.06);
      } else if (type === "complete") {
        tone(523.25, 0, 0.12);
        tone(659.25, 0.12, 0.12);
        tone(783.99, 0.24, 0.12);
        tone(1046.5, 0.36, 0.35);
      }
    } catch (e) {}
  }

  function showConfetti() {
    const container = document.getElementById("confetti-container");
    if (!container) return;
    const colors = ["#FF7B89", "#3B82F6", "#34D399", "#FBBF24", "#A78BFA"];
    for (let i = 0; i < 48; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = Math.random() * 2 + 2 + "s";
      piece.style.animationDelay = Math.random() * 0.5 + "s";
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 4500);
    }
  }

  function getEmojiForSentence(english) {
    const s = (english || "").toLowerCase();
    if (s.includes("apple")) return "🍎";
    if (s.includes("pizza")) return "🍕";
    if (s.includes("strawberr")) return "🍓";
    if (s.includes("banana")) return "🍌";
    if (s.includes("orange")) return "🍊";
    if (s.includes("juice")) return "🧃";
    if (s.includes("water")) return "💧";
    if (s.includes("milk")) return "🥛";
    if (s.includes("cookie")) return "🍪";
    if (s.includes("lunch") || s.includes("dinner") || s.includes("food") || s.includes("eat")) return "🍽️";
    if (s.includes("cat")) return "🐱";
    if (s.includes("dog")) return "🐶";
    if (s.includes("bird")) return "🐦";
    if (s.includes("spider")) return "🕷️";
    if (s.includes("animal")) return "🐾";
    if (s.includes("soccer")) return "⚽";
    if (s.includes("baseball")) return "⚾";
    if (s.includes("sport")) return "🏅";
    if (s.includes("swim") || s.includes("pool") || s.includes("beach")) return "🏊";
    if (s.includes("bike")) return "🚲";
    if (s.includes("run")) return "🏃";
    if (s.includes("draw") || s.includes("picture")) return "🎨";
    if (s.includes("dance")) return "💃";
    if (s.includes("sing") || s.includes("music") || s.includes("song")) return "🎵";
    if (s.includes("movie") || s.includes("cartoon") || s.includes("tv")) return "🎬";
    if (s.includes("game")) return "🎮";
    if (s.includes("cook")) return "👩‍🍳";
    if (s.includes("clean")) return "🧹";
    if (s.includes("book") || s.includes("read") || s.includes("library")) return "📚";
    if (s.includes("pencil") || s.includes("notebook") || s.includes("write")) return "✏️";
    if (s.includes("backpack") || s.includes("bag")) return "🎒";
    if (s.includes("shoe")) return "👟";
    if (s.includes("park") || s.includes("outside") || s.includes("walk")) return "🌳";
    if (s.includes("school") || s.includes("class") || s.includes("english")) return "🏫";
    if (s.includes("home") || s.includes("room") || s.includes("bed")) return "🏠";
    if (s.includes("camp")) return "⛺";
    if (s.includes("rain")) return "🌧️";
    if (s.includes("snow") || s.includes("winter")) return "⛄";
    if (s.includes("summer") || s.includes("sunny")) return "☀️";
    if (s.includes("spring") || s.includes("flower")) return "🌸";
    if (s.includes("birthday") || s.includes("present") || s.includes("gift") || s.includes("party")) return "🎁";
    if (s.includes("friend") || s.includes("together") || s.includes("play")) return "🤝";
    if (s.includes("sleep") || s.includes("early")) return "😴";
    if (s.includes("help")) return "💛";
    return "🌟";
  }

  // === Lesson & Difficulty Helpers ===
  function isDayCompleted(day) {
    return progress.completedDays.includes(day);
  }

  function getStartingLessonIndex() {
    for (let i = 0; i < TOTAL_DAYS; i++) {
      if (!isDayCompleted(i + 1)) return i;
    }
    return TOTAL_DAYS - 1;
  }

  function isDayUnlocked(day) {
    if (day < 1 || day > TOTAL_DAYS) return false;
    if (isDayCompleted(day)) return true;
    const nextIncompleteDay = getStartingLessonIndex() + 1;
    return day === nextIncompleteDay;
  }

  function getDifficultyForDay(day) {
    if (day <= 3) return "basic";
    if (day <= 7) return progress.difficulty.days4to7 || "basic";
    return progress.difficulty.days8to30 || progress.difficulty.days4to7 || "basic";
  }

  function getLessonData(day) {
    const rawLesson =
      allLessons.find((l) => l.day === day) || allLessons[0];
    const diff = getDifficultyForDay(day);
    const useAdvanced =
      diff === "advanced" &&
      Array.isArray(rawLesson.advancedSentences) &&
      rawLesson.advancedSentences.length > 0;

    return {
      day: rawLesson.day,
      title: rawLesson.title,
      focus:
        useAdvanced && rawLesson.advancedFocus
          ? rawLesson.advancedFocus
          : rawLesson.focus,
      guide:
        useAdvanced && rawLesson.advancedGuide
          ? rawLesson.advancedGuide
          : rawLesson.guide,
      difficulty: useAdvanced ? "advanced" : "basic",
      sentences: useAdvanced
        ? rawLesson.advancedSentences
        : rawLesson.sentences
    };
  }

  // === Weekly Menu & Completed Dates UI ===
  function getActiveWeekIndex() {
    const activeDayIndex = getStartingLessonIndex();
    return Math.floor(activeDayIndex / DAYS_PER_WEEK);
  }

  function createDayMenu() {
    if (!dayMenu) return;
    dayMenu.innerHTML = "";

    const nextIncompleteDay = getStartingLessonIndex() + 1;
    const activeWeekIdx = getActiveWeekIndex();

    if (displayedWeekIndex < 0) displayedWeekIndex = 0;
    if (displayedWeekIndex >= TOTAL_WEEKS) displayedWeekIndex = TOTAL_WEEKS - 1;

    const weekStartDay = showAllDays ? 1 : displayedWeekIndex * DAYS_PER_WEEK + 1;
    const weekEndDay = showAllDays
      ? TOTAL_DAYS
      : Math.min(TOTAL_DAYS, (displayedWeekIndex + 1) * DAYS_PER_WEEK);

    // Count completed in this range
    let completedInRange = 0;
    for (let d = weekStartDay; d <= weekEndDay; d++) {
      if (isDayCompleted(d)) completedInRange++;
    }
    const totalInRange = weekEndDay - weekStartDay + 1;

    if (weekBadgeEl) {
      if (showAllDays) {
        weekBadgeEl.textContent = "전체 일정";
        weekBadgeEl.className = "week-badge";
      } else if (displayedWeekIndex === activeWeekIdx) {
        weekBadgeEl.textContent = "📅 이번 주 학습";
        weekBadgeEl.className = "week-badge this-week";
      } else {
        weekBadgeEl.textContent = `${displayedWeekIndex + 1}주차 보기`;
        weekBadgeEl.className = "week-badge";
      }
    }

    if (weekTitleEl) {
      if (showAllDays) {
        weekTitleEl.textContent = `1일차 ~ ${TOTAL_DAYS}일차 전체`;
      } else {
        weekTitleEl.textContent = `${displayedWeekIndex + 1}주차 (${weekStartDay}일차 ~ ${weekEndDay}일차)`;
      }
    }

    if (weekSubcountEl) {
      weekSubcountEl.textContent = `${completedInRange} / ${totalInRange}일 완료`;
    }

    if (prevWeekBtn) {
      prevWeekBtn.disabled = showAllDays || displayedWeekIndex <= 0;
    }
    if (nextWeekBtn) {
      nextWeekBtn.disabled = showAllDays || displayedWeekIndex >= TOTAL_WEEKS - 1;
    }

    if (goThisWeekBtn) {
      goThisWeekBtn.style.display =
        !showAllDays && displayedWeekIndex !== activeWeekIdx
          ? "inline-block"
          : "none";
    }

    if (toggleAllDaysBtn) {
      toggleAllDaysBtn.textContent = showAllDays
        ? "📅 이번 주만 보기"
        : "📋 30일 전체 보기";
    }

    for (let day = weekStartDay; day <= weekEndDay; day++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-button";

      const completed = isDayCompleted(day);
      const unlocked = isDayUnlocked(day);
      const savedDate = progress.completedDates[day];

      let stateText = "🔒 대기";
      let dateText = "-";

      if (completed) {
        btn.classList.add("completed");
        stateText = "✅ 완료";
        dateText = savedDate ? formatShortDate(savedDate) : "완료됨";
      } else if (day === nextIncompleteDay) {
        btn.classList.add("current");
        stateText = "🔥 오늘 학습";
        dateText = "진행 중";
      } else {
        btn.classList.add("locked");
      }

      if (day - 1 === currentLessonIndex) {
        btn.classList.add("selected");
      }

      btn.innerHTML = `
        <span class="day-num">${day}일차</span>
        <span class="day-state">${stateText}</span>
        <span class="day-date">${dateText}</span>
      `;

      if (unlocked) {
        btn.onclick = () => {
          currentLessonIndex = day - 1;
          displayedWeekIndex = Math.floor(currentLessonIndex / DAYS_PER_WEEK);
          startLessonFlow(true);
        };
      } else {
        btn.disabled = true;
      }

      dayMenu.appendChild(btn);
    }

    renderCompletedSummary();
  }

  function renderCompletedSummary() {
    if (!completedSummaryEl) return;
    const totalDone = progress.completedDays.length;
    if (totalDone === 0) {
      completedSummaryEl.innerHTML =
        `🗓️ <strong>완료한 날 (총 0일 / ${TOTAL_DAYS}일):</strong> 아직 완료한 일차가 없어요. 오늘 첫 학습을 완료하면 날짜가 기록됩니다!`;
      return;
    }

    const recentDays = progress.completedDays.slice(-6);
    const chipsHtml = recentDays
      .map((d) => {
        const dt = progress.completedDates[d]
          ? formatShortDate(progress.completedDates[d])
          : "완료";
        return `<span class="completed-day-chip">✅ ${d}일차 (${dt})</span>`;
      })
      .join("");

    const moreCount = totalDone - recentDays.length;
    const moreHtml =
      moreCount > 0
        ? `<span style="font-size:13px;color:#6B7280;">외 ${moreCount}일 완료</span>`
        : "";

    completedSummaryEl.innerHTML =
      `🗓️ <strong>완료한 날 (총 ${totalDone}일 / ${TOTAL_DAYS}일):</strong> ${chipsHtml} ${moreHtml}`;
  }

  if (prevWeekBtn) {
    prevWeekBtn.onclick = () => {
      if (displayedWeekIndex > 0) {
        displayedWeekIndex--;
        createDayMenu();
      }
    };
  }

  if (nextWeekBtn) {
    nextWeekBtn.onclick = () => {
      if (displayedWeekIndex < TOTAL_WEEKS - 1) {
        displayedWeekIndex++;
        createDayMenu();
      }
    };
  }

  if (goThisWeekBtn) {
    goThisWeekBtn.onclick = () => {
      showAllDays = false;
      displayedWeekIndex = Math.floor(currentLessonIndex / DAYS_PER_WEEK);
      createDayMenu();
    };
  }

  if (toggleAllDaysBtn) {
    toggleAllDaysBtn.onclick = () => {
      showAllDays = !showAllDays;
      if (!showAllDays) {
        displayedWeekIndex = Math.floor(currentLessonIndex / DAYS_PER_WEEK);
      }
      createDayMenu();
    };
  }

  // Allow editing completion date when clicking the completed date badge
  if (completedDateBadge) {
    completedDateBadge.onclick = () => {
      const day = currentLessonIndex + 1;
      if (!isDayCompleted(day)) return;
      const currentIso = progress.completedDates[day] || getTodayIsoString();
      const input = window.prompt(
        `${day}일차 완료 날짜를 입력해 주세요 (예: 2026-10-18):`,
        currentIso
      );
      if (input && /^\d{4}-\d{2}-\d{2}$/.test(input.trim())) {
        progress.completedDates[day] = input.trim();
        saveProgress();
        renderFullLesson(false);
      }
    };
  }

  // === Flow Control ===
  function startLessonFlow(shouldScroll = true) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    displayedWeekIndex = Math.floor(currentLessonIndex / DAYS_PER_WEEK);
    const day = currentLessonIndex + 1;
    const completed = isDayCompleted(day);

    if (!completed && day >= 4 && day <= 7 && !progress.difficulty.days4to7) {
      showDifficultySelection(4, shouldScroll);
      return;
    }
    if (!completed && day >= 8 && !progress.difficulty.days8to30) {
      showDifficultySelection(8, shouldScroll);
      return;
    }

    if (!completed && day > 1 && !progress.reviewDoneDays.includes(day)) {
      const prevData = getLessonData(day - 1);
      if (prevData && prevData.sentences.length > 0) {
        startReviewMode(day, prevData.sentences, shouldScroll);
        return;
      }
    }

    showMainLesson(shouldScroll);
  }

  function showDifficultySelection(stageStartDay, shouldScroll = true) {
    lessonCard.style.display = "none";
    reviewCard.style.display = "none";
    diffCard.style.display = "block";
    createDayMenu();

    const titleEl = document.getElementById("diff-title");
    const descEl = document.getElementById("diff-desc");
    const examplesEl = document.getElementById("diff-examples");
    const basicBtn = document.getElementById("btn-diff-basic");
    const advBtn = document.getElementById("btn-diff-advanced");

    const sampleLesson =
      allLessons.find((l) => l.day === stageStartDay) || allLessons[3];
    const basicEx =
      sampleLesson && sampleLesson.sentences && sampleLesson.sentences[0]
        ? sampleLesson.sentences[0]
        : { english: "I like reading books.", korean: "나는 책 읽는 것을 좋아해요." };
    const advEx =
      sampleLesson &&
      sampleLesson.advancedSentences &&
      sampleLesson.advancedSentences[0]
        ? sampleLesson.advancedSentences[0]
        : {
            english: "When did she start to like reading at the library?",
            korean: "그녀는 언제부터 도서관에서 책 읽는 것을 좋아하기 시작했나요?"
          };

    if (stageStartDay === 4) {
      titleEl.textContent = "🌟 4일차부터 더 복잡한 문장을 배워 볼까요?";
      descEl.textContent =
        "심화 난이도를 선택하면 시제 변형(현재·과거), 질문·부정문, when·where 같은 표현이 함께 나옵니다. 4~7일차 동안 유지됩니다.";
      basicBtn.textContent = "아니요, 현재 난이도 유지";
      advBtn.textContent = "네, 심화 난이도로 학습 🔥";
    } else {
      const prevDiff = progress.difficulty.days4to7 || "basic";
      if (prevDiff === "advanced") {
        titleEl.textContent = "🌟 8일차부터도 지금 레벨의 문제를 계속 풀까요?";
        descEl.textContent =
          "심화 난이도를 유지하면 시제 변형과 when·where 등이 포함된 문장을 계속 연습합니다.";
        basicBtn.textContent = "기본 난이도로 낮추기";
        advBtn.textContent = "네, 지금 심화 레벨 유지 🔥";
      } else {
        titleEl.textContent = "🌟 8일차부터는 더 복잡한 문장에 도전해 볼까요?";
        descEl.textContent =
          "심화 난이도로 바꾸면 과거형과 의문사(when, where 등)가 들어간 문장을 연습할 수 있어요.";
        basicBtn.textContent = "아니요, 현재 난이도 유지";
        advBtn.textContent = "네, 심화 난이도로 변경 🔥";
      }
    }

    if (examplesEl) {
      examplesEl.innerHTML = `
        <div class="diff-example-item basic-box">
          <span class="diff-example-tag">🌱 기본 난이도 예시</span>
          <p class="diff-example-eng">${basicEx.english}</p>
          <p class="diff-example-kor">${basicEx.korean}</p>
        </div>
        <div class="diff-example-item adv-box">
          <span class="diff-example-tag">🔥 심화 난이도 예시</span>
          <p class="diff-example-eng">${advEx.english}</p>
          <p class="diff-example-kor">${advEx.korean}</p>
        </div>
      `;
    }

    basicBtn.onclick = () => setDifficulty(stageStartDay, "basic");
    advBtn.onclick = () => setDifficulty(stageStartDay, "advanced");

    if (shouldScroll) {
      diffCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function setDifficulty(stageStartDay, level) {
    if (stageStartDay === 4) {
      progress.difficulty.days4to7 = level;
    } else {
      progress.difficulty.days8to30 = level;
    }
    saveProgress();
    diffCard.style.display = "none";
    startLessonFlow(true);
  }

  // === Review Mode (Card News Style) ===
  function startReviewMode(day, sentences, shouldScroll) {
    isReviewMode = true;
    reviewSentences = sentences;
    currentReviewIndex = 0;

    lessonCard.style.display = "none";
    diffCard.style.display = "none";
    reviewCard.style.display = "block";

    createDayMenu();
    renderReviewCard(day);
    if (shouldScroll) {
      reviewCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderReviewCard(day) {
    if (currentReviewIndex >= reviewSentences.length) {
      isReviewMode = false;
      if (!progress.reviewDoneDays.includes(day)) {
        progress.reviewDoneDays.push(day);
        saveProgress();
      }
      reviewCard.style.display = "none";
      showMainLesson(true);
      statusEl.textContent =
        "👏 어제 문장 복습을 마쳤어요! 이제 오늘 학습을 시작해 볼까요?";
      return;
    }

    const sen = reviewSentences[currentReviewIndex];
    const progText = document.getElementById("review-progress-text");
    const emojiEl = document.getElementById("review-emoji");
    const korEl = document.getElementById("review-korean");
    const engEl = document.getElementById("review-english");
    const engContainer = document.getElementById("review-english-container");
    const toggleBtn = document.getElementById("toggle-review-english-btn");
    const listenRevBtn = document.getElementById("listen-review-btn");
    const nextRevBtn = document.getElementById("next-review-btn");

    if (progText) {
      progText.textContent = `복습 ${currentReviewIndex + 1} / ${reviewSentences.length}`;
    }
    if (emojiEl) emojiEl.textContent = getEmojiForSentence(sen.english);
    if (korEl) korEl.textContent = sen.korean;
    if (engEl) engEl.textContent = sen.english;

    if (engContainer) engContainer.classList.add("hidden");
    if (toggleBtn) {
      toggleBtn.textContent = "👀 영어 정답 확인";
      toggleBtn.onclick = () => {
        if (!engContainer) return;
        if (engContainer.classList.contains("hidden")) {
          engContainer.classList.remove("hidden");
          toggleBtn.textContent = "🙈 영어 다시 가리기";
        } else {
          engContainer.classList.add("hidden");
          toggleBtn.textContent = "👀 영어 정답 확인";
        }
      };
    }

    if (listenRevBtn) {
      listenRevBtn.onclick = () => {
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(sen.english);
        u.lang = "en-US";
        u.rate = 0.78;
        window.speechSynthesis.speak(u);
      };
    }

    if (nextRevBtn) {
      nextRevBtn.onclick = () => {
        playEffect("correct");
        addStars(1);
        currentReviewIndex++;
        renderReviewCard(day);
      };
    }
  }

  // === Main Lesson View ===
  function showMainLesson(shouldScroll = true) {
    isReviewMode = false;
    reviewCard.style.display = "none";
    diffCard.style.display = "none";
    lessonCard.style.display = "block";

    currentSentenceIndex = 0;
    const day = currentLessonIndex + 1;
    answerHidden = day >= 28;

    renderFullLesson(true);
    if (shouldScroll) {
      lessonCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderFullLesson(rebuildQuiz = true) {
    const data = getLessonData(currentLessonIndex + 1);
    if (currentSentenceIndex >= data.sentences.length) {
      currentSentenceIndex = 0;
    }
    const currentSentence = data.sentences[currentSentenceIndex];
    const record = getLessonRecord(data.day);

    dayLabel.textContent = `${data.day}일차 / ${TOTAL_DAYS}일`;
    lessonTitle.textContent = data.title;
    lessonFocus.textContent = `핵심 패턴: ${data.focus}`;
    lessonGuide.textContent = data.guide;

    diffBadge.style.display =
      data.difficulty === "advanced" ? "inline-flex" : "none";

    if (completedDateBadge) {
      if (isDayCompleted(data.day)) {
        const dtIso = progress.completedDates[data.day] || getTodayIsoString();
        completedDateBadge.style.display = "inline-flex";
        completedDateBadge.textContent = `🗓️ ${formatShortDate(dtIso)} 완료 ✏️`;
      } else {
        completedDateBadge.style.display = "none";
      }
    }

    if (openReviewBtn) {
      if (data.day > 1) {
        openReviewBtn.style.display = "inline-flex";
        openReviewBtn.onclick = () => {
          const prevData = getLessonData(data.day - 1);
          if (prevData && prevData.sentences.length > 0) {
            startReviewMode(data.day, prevData.sentences, true);
          }
        };
      } else {
        openReviewBtn.style.display = "none";
      }
    }

    if (mainEmoji) {
      mainEmoji.textContent = getEmojiForSentence(currentSentence.english);
    }
    mainSentence.textContent = currentSentence.english;
    mainMeaning.textContent = currentSentence.korean;

    createDayMenu();
    updateProgressUI(data, record);
    createSentenceButtons(data, record);
    if (rebuildQuiz) {
      createQuiz(currentSentence);
    }
    updateAnswerVisibility();
    updateCompletionArea(data, record);
    updateNavigationButtons();
  }

  function updateProgressUI(data, record) {
    const totalSentences = data.sentences.length;
    const listenedCount = record.listened.filter(
      (i) => i >= 0 && i < totalSentences
    ).length;
    const solvedCount = record.solved.filter(
      (i) => i >= 0 && i < totalSentences
    ).length;
    const totalCompleted = listenedCount + solvedCount;
    const maxTotal = totalSentences * 2;
    const pct = Math.min(100, Math.round((totalCompleted / maxTotal) * 100));

    if (listenStatEl) {
      listenStatEl.textContent = `🔊 듣기: ${listenedCount} / ${totalSentences}`;
      listenStatEl.classList.toggle("done", listenedCount === totalSentences);
    }
    if (quizStatEl) {
      quizStatEl.textContent = `🧩 퀴즈: ${solvedCount} / ${totalSentences}`;
      quizStatEl.classList.toggle("done", solvedCount === totalSentences);
    }
    if (dailyProgressBar) dailyProgressBar.style.width = pct + "%";
    if (dailyProgressText) {
      dailyProgressText.textContent = `달성률 ${pct}% (${totalCompleted}/${maxTotal})`;
    }
  }

  function createSentenceButtons(data, record) {
    sentenceChoices.innerHTML = "";

    data.sentences.forEach((sen, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sentence-button";
      if (idx === currentSentenceIndex) btn.classList.add("selected");

      const listened = record.listened.includes(idx);
      const solved = record.solved.includes(idx);
      if (listened && solved) btn.classList.add("completed-choice");

      const emoji = getEmojiForSentence(sen.english);

      btn.innerHTML = `
        <div class="choice-left">
          <span class="choice-emoji">${emoji}</span>
          <div class="choice-text-group">
            <span class="choice-english">${idx + 1}. ${sen.english}</span>
            <span class="choice-korean">${sen.korean}</span>
          </div>
        </div>
        <div class="choice-badges">
          <span class="status-chip ${listened ? "done" : ""}">${listened ? "🔊 듣기완료" : "🔈 듣기전"}</span>
          <span class="status-chip ${solved ? "done" : ""}">${solved ? "🧩 퀴즈완료" : "✏️ 퀴즈전"}</span>
        </div>
      `;

      btn.onclick = () => {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        currentSentenceIndex = idx;
        const currentDay = currentLessonIndex + 1;
        answerHidden = currentDay >= 28;
        statusEl.textContent = `${idx + 1}번 문장을 선택했어요.`;
        renderFullLesson(true);
      };
      sentenceChoices.appendChild(btn);
    });
  }

  // === Audio (Wait for end event, do NOT reset quiz) ===
  listenBtn.onclick = () => {
    const data = getLessonData(currentLessonIndex + 1);
    const sen = data.sentences[currentSentenceIndex];
    const record = getLessonRecord(data.day);

    if (!("speechSynthesis" in window)) {
      statusEl.textContent =
        "이 브라우저에서는 음성 기능이 지원되지 않아 듣기 완료로 처리합니다.";
      if (!record.listened.includes(currentSentenceIndex)) {
        record.listened.push(currentSentenceIndex);
        addStars(1);
        saveProgress();
        updateProgressUI(data, record);
        createSentenceButtons(data, record);
        updateCompletionArea(data, record);
      }
      return;
    }

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(sen.english);
    u.lang = "en-US";
    u.rate = 0.75;
    u.onstart = () => {
      statusEl.textContent = "🔊 영어 문장을 끝까지 듣고 있어요...";
    };
    u.onend = () => {
      statusEl.textContent = "✔️ 끝까지 듣기 완료! 이제 큰 소리로 따라 말해 보세요.";
      if (!record.listened.includes(currentSentenceIndex)) {
        record.listened.push(currentSentenceIndex);
        addStars(1);
        playEffect("correct");
        saveProgress();
        updateProgressUI(data, record);
        createSentenceButtons(data, record);
        updateCompletionArea(data, record);
      }
    };
    u.onerror = () => {
      statusEl.textContent = "음성 재생 중 문제가 발생했어요. 다시 한 번 눌러 주세요.";
    };
    window.speechSynthesis.speak(u);
  };

  // === Quiz Logic ===
  function normalizeWord(w) {
    return w.toLowerCase().replace(/[.,?!]/g, "");
  }

  function createAutomaticDistractors(eng) {
    const words = eng.split(/\s+/).map(normalizeWord);
    const d = [];
    if (words.includes("do")) d.push("Does", "Did");
    if (words.includes("does")) d.push("Do", "Did");
    if (words.includes("did")) d.push("Do", "Does");
    if (words.includes("don't")) d.push("doesn't", "didn't");
    if (words.includes("doesn't")) d.push("don't", "didn't");
    if (words.includes("didn't")) d.push("don't", "doesn't");
    if (words.includes("like")) d.push("likes", "liked");
    if (words.includes("likes")) d.push("like", "liked");
    if (words.includes("liked")) d.push("like", "likes");
    if (words.includes("want")) d.push("wants", "wanted");
    if (words.includes("wants")) d.push("want", "wanted");
    if (words.includes("wanted")) d.push("want", "wants");
    if (words.includes("i")) d.push("She", "They");
    if (words.includes("she")) d.push("I", "They");
    if (words.includes("he")) d.push("I", "We");
    if (words.includes("we")) d.push("She", "He");
    if (words.includes("they")) d.push("She", "He");
    if (words.includes("when")) d.push("Where", "What");
    if (words.includes("where")) d.push("When", "Who");
    return d;
  }

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function createQuiz(sentenceObj) {
    quizKoreanPrompt.textContent = sentenceObj.korean;

    const correctWords = sentenceObj.english.split(/\s+/);
    const correctBlocks = correctWords.map((w, i) => ({
      id: `c-${i}`,
      text: w
    }));

    const autoD = createAutomaticDistractors(sentenceObj.english);
    const customD = sentenceObj.distractors || [];
    const lowerCorrect = correctWords.map((w) => w.toLowerCase());

    const uniqueD = [...new Set([...autoD, ...customD])].filter(
      (d) => !lowerCorrect.includes(d.toLowerCase())
    );

    const distractorBlocks = shuffleArray(uniqueD)
      .slice(0, 6)
      .map((w, i) => ({
        id: `d-${i}`,
        text: w
      }));

    shuffledBlocks = shuffleArray([...correctBlocks, ...distractorBlocks]);
    selectedBlockIds = [];
    quizFeedback.textContent = "";
    quizFeedback.className = "quiz-feedback";

    renderQuiz();
  }

  function renderQuiz() {
    answerZone.innerHTML = "";
    wordBank.innerHTML = "";

    if (selectedBlockIds.length === 0) {
      answerZone.innerHTML = `<p class="answer-placeholder">아래 단어 블록을 순서대로 눌러 문장을 완성해 보세요!</p>`;
    } else {
      selectedBlockIds.forEach((id) => {
        const b = shuffledBlocks.find((x) => x.id === id);
        if (!b) return;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "word-block answer-block";
        btn.textContent = b.text;
        btn.onclick = () => {
          selectedBlockIds = selectedBlockIds.filter((x) => x !== id);
          quizFeedback.textContent = "";
          quizFeedback.className = "quiz-feedback";
          renderQuiz();
        };
        answerZone.appendChild(btn);
      });
    }

    shuffledBlocks.forEach((b) => {
      if (!selectedBlockIds.includes(b.id)) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "word-block";
        btn.textContent = b.text;
        btn.onclick = () => {
          selectedBlockIds.push(b.id);
          quizFeedback.textContent = "";
          quizFeedback.className = "quiz-feedback";
          renderQuiz();
        };
        wordBank.appendChild(btn);
      }
    });
  }

  checkAnswerBtn.onclick = () => {
    const data = getLessonData(currentLessonIndex + 1);
    const sen = data.sentences[currentSentenceIndex];
    const record = getLessonRecord(data.day);

    if (selectedBlockIds.length === 0) {
      quizFeedback.textContent = "먼저 아래 영어 블록을 눌러 문장을 만들어 보세요!";
      quizFeedback.className = "quiz-feedback incorrect";
      playEffect("wrong");
      return;
    }

    const userAns = selectedBlockIds
      .map((id) => {
        const b = shuffledBlocks.find((x) => x.id === id);
        return b ? b.text : "";
      })
      .join(" ");

    if (userAns === sen.english) {
      const firstSolve = !record.solved.includes(currentSentenceIndex);
      if (firstSolve) {
        record.solved.push(currentSentenceIndex);
        addStars(2);
        saveProgress();
        quizFeedback.textContent =
          "🎉 정답입니다! 영어 블록을 정확하게 조립했어요! (+2⭐)";
      } else {
        quizFeedback.textContent = "🎉 정답입니다! 정말 잘했어요!";
      }
      quizFeedback.className = "quiz-feedback correct";
      playEffect("correct");
      updateProgressUI(data, record);
      createSentenceButtons(data, record);
      updateCompletionArea(data, record);
    } else {
      quizFeedback.textContent =
        "아직 문장이 정확하지 않아요. 주어와 시제(do/does/did)를 다시 확인해 볼까요? 🤔";
      quizFeedback.className = "quiz-feedback incorrect";
      playEffect("wrong");
    }
  };

  resetQuizBtn.onclick = () => {
    const data = getLessonData(currentLessonIndex + 1);
    createQuiz(data.sentences[currentSentenceIndex]);
  };

  // === Answer Visibility ===
  function updateAnswerVisibility() {
    lessonCard.classList.toggle("answer-hidden", answerHidden);
    toggleAnswerBtn.textContent = answerHidden
      ? "👀 영어 정답 보기"
      : "🙈 영어 문장 가리기";
  }

  toggleAnswerBtn.onclick = () => {
    answerHidden = !answerHidden;
    updateAnswerVisibility();
  };

  // === Completion Check & Next Day Transition ===
  function updateCompletionArea(data, record) {
    const totalSentences = data.sentences.length;
    const missingListen = [];
    const missingQuiz = [];

    for (let i = 0; i < totalSentences; i++) {
      if (!record.listened.includes(i)) missingListen.push(`${i + 1}번`);
      if (!record.solved.includes(i)) missingQuiz.push(`${i + 1}번`);
    }

    const completed = isDayCompleted(data.day);
    const savedIso = progress.completedDates[data.day];
    const fullDateText = savedIso ? formatFullKoreanDate(savedIso) : "";

    if (completed) {
      completionReqs.innerHTML = `<div class="req-ready-box">✅ <strong>이미 완료된 일차입니다!</strong><br>🗓️ 완료한 날: <strong>${fullDateText || "완료 기록됨"}</strong></div>`;
      completeLessonBtn.disabled = true;
      completeLessonBtn.textContent = `${data.day}일차 학습 완료됨 ⭐ (${savedIso ? formatShortDate(savedIso) : "완료"})`;
      completionMessage.textContent =
        "언제든 문장을 다시 듣고 퀴즈를 풀어 복습할 수 있어요.";
    } else if (missingListen.length === 0 && missingQuiz.length === 0) {
      completionReqs.innerHTML =
        `<div class="req-ready-box">🎉 <strong>5개 문장 듣기와 블록 퀴즈를 모두 완료했어요!</strong><br>아래 버튼을 누르면 오늘 날짜(${formatFullKoreanDate(getTodayIsoString())})로 완료 기록이 저장됩니다.</div>`;
      completeLessonBtn.disabled = false;
      completeLessonBtn.textContent = `🎉 ${data.day}일차 학습 완료하기 (+10⭐)`;
      completionMessage.textContent =
        "완료 버튼을 누르면 오늘 완료 날짜가 기록되고 다음 학습으로 이동합니다.";
    } else {
      const reasons = [];
      if (missingListen.length > 0) {
        reasons.push(
          `🔊 아직 끝까지 듣지 않은 문장 (${missingListen.length}개): <b>${missingListen.join(", ")}</b>`
        );
      }
      if (missingQuiz.length > 0) {
        reasons.push(
          `🧩 아직 맞히지 않은 블록 퀴즈 (${missingQuiz.length}개): <b>${missingQuiz.join(", ")}</b>`
        );
      }
      completionReqs.innerHTML =
        `<div class="req-missing-box"><div>⚠️ <b>아직 완료 버튼을 누를 수 없어요:</b></div>` +
        `<div style="margin-top:6px;line-height:1.6;">${reasons.join("<br>")}</div></div>`;
      completeLessonBtn.disabled = true;
      completeLessonBtn.textContent =
        "남은 문장 듣기와 퀴즈를 먼저 완료해 주세요";
      completionMessage.textContent = "";
    }
  }

  completeLessonBtn.onclick = () => {
    const day = currentLessonIndex + 1;
    const data = getLessonData(day);
    const record = getLessonRecord(day);

    if (
      record.listened.length < data.sentences.length ||
      record.solved.length < data.sentences.length
    ) {
      updateCompletionArea(data, record);
      return;
    }

    const todayIso = getTodayIsoString();
    if (!isDayCompleted(day)) {
      progress.completedDays.push(day);
      progress.completedDays.sort((a, b) => a - b);
      progress.completedDates[day] = todayIso;
      addStars(10);
      saveProgress();
    } else if (!progress.completedDates[day]) {
      progress.completedDates[day] = todayIso;
      saveProgress();
    }

    playEffect("complete");
    showConfetti();
    createDayMenu();
    updateCompletionArea(data, record);
    updateNavigationButtons();

    if (completedDateBadge) {
      completedDateBadge.style.display = "inline-flex";
      completedDateBadge.textContent = `🗓️ ${formatShortDate(todayIso)} 완료 ✏️`;
    }

    statusEl.textContent = `🎊 축하합니다! ${day}일차 학습 완료 (${formatFullKoreanDate(todayIso)})! 잠시 후 다음 학습으로 이동합니다...`;

    setTimeout(() => {
      if (day === TOTAL_DAYS) {
        if (courseData.nextCourseUrl) {
          window.location.href = courseData.nextCourseUrl;
        } else {
          statusEl.textContent =
            "🏆 2개월차 30일 학습까지 모두 완료했습니다! 정말 대단해요!";
          lessonCard.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        currentLessonIndex = day;
        displayedWeekIndex = Math.floor(currentLessonIndex / DAYS_PER_WEEK);
        startLessonFlow(true);
      }
    }, 1800);
  };

  // === Previous / Next Navigation ===
  function updateNavigationButtons() {
    prevBtn.disabled = currentLessonIndex === 0;
    const nextDay = currentLessonIndex + 2;
    nextBtn.disabled = nextDay > TOTAL_DAYS || !isDayUnlocked(nextDay);
  }

  prevBtn.onclick = () => {
    if (currentLessonIndex > 0) {
      currentLessonIndex--;
      displayedWeekIndex = Math.floor(currentLessonIndex / DAYS_PER_WEEK);
      startLessonFlow(true);
    }
  };

  nextBtn.onclick = () => {
    const nextDay = currentLessonIndex + 2;
    if (nextDay <= TOTAL_DAYS && isDayUnlocked(nextDay)) {
      currentLessonIndex++;
      displayedWeekIndex = Math.floor(currentLessonIndex / DAYS_PER_WEEK);
      startLessonFlow(true);
    }
  };

  function initApp() {
    updateScoreboard();
    currentLessonIndex = getStartingLessonIndex();
    displayedWeekIndex = Math.floor(currentLessonIndex / DAYS_PER_WEEK);
    startLessonFlow(false);
  }

  try {
    initApp();
  } catch (err) {
    console.error("초기화 중 오류 복구 실행:", err);
    try {
      const backupCompleted =
        progress && Array.isArray(progress.completedDays)
          ? progress.completedDays
          : [];
      const backupDates =
        progress && progress.completedDates ? progress.completedDates : {};
      progress = createDefaultProgress();
      progress.completedDays = backupCompleted;
      progress.completedDates = backupDates;
      currentLessonIndex = getStartingLessonIndex();
      displayedWeekIndex = Math.floor(currentLessonIndex / DAYS_PER_WEEK);
      currentSentenceIndex = 0;
      saveProgress();
      initApp();
    } catch (err2) {
      console.error("복구 실패:", err2);
    }
  }
})();
