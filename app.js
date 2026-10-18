(() => {
  "use strict";

  const courseData = window.COURSE_DATA;
  if (!courseData || !Array.isArray(courseData.lessons)) {
    document.body.innerHTML = "<p style='padding:24px;font-size:20px;'>학습 자료(month-data.js)를 불러오지 못했습니다. 파일이 같은 폴더에 있는지 확인해 주세요.</p>";
    return;
  }

  const courseId = courseData.courseId || (typeof COURSE_ID !== "undefined" ? COURSE_ID : "month1");
  const TOTAL_DAYS = courseData.lessons.length;

  const PROGRESS_KEY_V4 = `english-pattern-${courseId}-progress-v4`;
  const PROGRESS_KEY_V3 = `english-pattern-${courseId}-progress-v3`;
  const LEGACY_KEY = `english-pattern-${courseId}-completed-days`;
  const STARS_KEY = "english-pattern-total-stars";

  // DOM Elements
  const starCountEl = document.getElementById("star-count");
  const dayMenu = document.getElementById("day-menu");
  const lessonCard = document.getElementById("lesson-card");
  const reviewCard = document.getElementById("review-card");
  const diffCard = document.getElementById("difficulty-card");

  const dayLabel = document.getElementById("day-label");
  const diffBadge = document.getElementById("diff-badge");
  const lessonTitle = document.getElementById("lesson-title");
  const lessonFocus = document.getElementById("lesson-focus");
  const lessonGuide = document.getElementById("lesson-guide");

  const listenProgressEl = document.getElementById("listen-progress");
  const quizProgressEl = document.getElementById("quiz-progress");
  const dailyProgressBar = document.getElementById("daily-progress-bar");
  const dailyProgressText = document.getElementById("daily-progress-text");

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

  // State
  let userStars = parseInt(localStorage.getItem(STARS_KEY) || "0", 10);
  if (Number.isNaN(userStars) || userStars < 0) userStars = 0;

  let progress = loadProgress();
  let currentLessonIndex = getStartingLessonIndex();
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
      lessons: {},
      reviewDoneDays: [],
      difficulty: { days4to7: null, days8to30: null }
    };
  }

  function normalizeProgressObject(raw) {
    const clean = createDefaultProgress();
    if (!raw || typeof raw !== "object") return clean;

    if (Array.isArray(raw.completedDays)) {
      clean.completedDays = [...new Set(
        raw.completedDays.filter((d) => Number.isInteger(d) && d >= 1 && d <= TOTAL_DAYS)
      )].sort((a, b) => a - b);
    }

    if (Array.isArray(raw.reviewDoneDays)) {
      clean.reviewDoneDays = [...new Set(
        raw.reviewDoneDays.filter((d) => Number.isInteger(d) && d >= 1 && d <= TOTAL_DAYS)
      )];
    }

    // Difficulty normalization (supports both v3 stage1/stage2 and v4 days4to7/days8to30)
    if (raw.difficulty && typeof raw.difficulty === "object") {
      clean.difficulty.days4to7 = raw.difficulty.days4to7 || raw.difficulty.stage1 || null;
      clean.difficulty.days8to30 = raw.difficulty.days8to30 || raw.difficulty.stage2 || null;
    }

    // Per-day lesson record normalization (supports both v3 lessonProgress and v4 lessons)
    const srcLessons = raw.lessons || raw.lessonProgress || {};
    if (srcLessons && typeof srcLessons === "object") {
      Object.keys(srcLessons).forEach((dayKey) => {
        const rec = srcLessons[dayKey];
        if (!rec || typeof rec !== "object") return;
        const normalizeIndices = (arr) => {
          if (!Array.isArray(arr)) return [];
          const indices = arr.map((item) => {
            if (Number.isInteger(item)) return item;
            if (typeof item === "string") {
              const parts = item.split("-");
              const last = parseInt(parts[parts.length - 1], 10);
              return Number.isInteger(last) ? last : -1;
            }
            return -1;
          }).filter((idx) => idx >= 0 && idx < 10);
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
        return normalizeProgressObject(savedV4);
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
        fallback.completedDays = [...new Set(
          legacy.filter((d) => Number.isInteger(d) && d >= 1 && d <= TOTAL_DAYS)
        )].sort((a, b) => a - b);
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
    if (!Array.isArray(progress.lessons[day].listened)) progress.lessons[day].listened = [];
    if (!Array.isArray(progress.lessons[day].solved)) progress.lessons[day].solved = [];
    return progress.lessons[day];
  }

  // === Gamification ===
  function addStars(amount) {
    userStars += amount;
    localStorage.setItem(STARS_KEY, String(userStars));
    if (starCountEl) starCountEl.textContent = String(userStars);

    const icon = document.querySelector(".star-icon");
    if (icon) {
      icon.style.animation = "none";
      setTimeout(() => {
        icon.style.animation = "popIn 0.5s ease";
      }, 10);
    }
  }

  function showConfetti() {
    const container = document.getElementById("confetti-container");
    if (!container) return;
    const colors = ["#FF7B89", "#3B82F6", "#34D399", "#FBBF24", "#A78BFA"];
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (Math.random() * 2 + 2) + "s";
      piece.style.animationDelay = (Math.random() * 0.5) + "s";
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 4500);
    }
  }

  // === Helpers for Lesson & Difficulty ===
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
    const rawLesson = courseData.lessons.find((l) => l.day === day) || courseData.lessons[0];
    const diff = getDifficultyForDay(day);
    const useAdvanced =
      diff === "advanced" &&
      Array.isArray(rawLesson.advancedSentences) &&
      rawLesson.advancedSentences.length > 0;

    return {
      day: rawLesson.day,
      title: rawLesson.title,
      focus: useAdvanced && rawLesson.advancedFocus ? rawLesson.advancedFocus : rawLesson.focus,
      guide: useAdvanced && rawLesson.advancedGuide ? rawLesson.advancedGuide : rawLesson.guide,
      difficulty: useAdvanced ? "advanced" : "basic",
      sentences: useAdvanced ? rawLesson.advancedSentences : rawLesson.sentences
    };
  }

  // === Navigation & Flow ===
  function initApp() {
    if (starCountEl) starCountEl.textContent = String(userStars);
    currentLessonIndex = getStartingLessonIndex();
    startLessonFlow(false);
  }

  function startLessonFlow(shouldScroll = true) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const day = currentLessonIndex + 1;
    const completed = isDayCompleted(day);

    // 1. Check Difficulty Selection (for days 4-7 or days 8-30)
    if (!completed && day >= 4 && day <= 7 && !progress.difficulty.days4to7) {
      showDifficultySelection(4);
      return;
    }
    if (!completed && day >= 8 && !progress.difficulty.days8to30) {
      showDifficultySelection(8);
      return;
    }

    // 2. Check Previous Day Review Card (only if not completed and not yet reviewed today)
    if (!completed && day > 1 && !progress.reviewDoneDays.includes(day)) {
      const prevData = getLessonData(day - 1);
      if (prevData && prevData.sentences.length > 0) {
        startReviewMode(day, prevData.sentences, shouldScroll);
        return;
      }
    }

    // 3. Normal Lesson View
    showMainLesson(shouldScroll);
  }

  // === Difficulty Selection ===
  function showDifficultySelection(stageStartDay) {
    lessonCard.style.display = "none";
    reviewCard.style.display = "none";
    diffCard.style.display = "block";
    createDayMenu();

    const titleEl = document.getElementById("diff-title");
    const descEl = document.getElementById("diff-desc");
    const examplesEl = document.getElementById("diff-examples");
    const basicBtn = document.getElementById("btn-diff-basic");
    const advBtn = document.getElementById("btn-diff-advanced");

    const basicEx = courseData.basicExample || "I like reading books.";
    const advEx = courseData.advancedExample || "When did she start to like reading at the library?";

    if (stageStartDay === 4) {
      titleEl.textContent = "🌟 4일차부터 더 복잡한 문장을 배워 볼까요?";
      descEl.textContent = "심화 난이도를 선택하면 시제 변형(현재·과거), 질문·부정문, when·where 같은 표현이 함께 나옵니다. 4~7일차 동안 비슷한 수준으로 유지됩니다.";
      basicBtn.textContent = "아니요, 현재 난이도 유지";
      advBtn.textContent = "네, 심화 난이도로 학습 🔥";
    } else {
      const prevDiff = progress.difficulty.days4to7 || "basic";
      if (prevDiff === "advanced") {
        titleEl.textContent = "🌟 8일차부터도 지금 레벨의 문제를 계속 풀까요?";
        descEl.textContent = "심화 난이도를 유지하면 시제 변형과 when·where 등이 포함된 문장을 계속 연습합니다.";
        basicBtn.textContent = "기본 난이도로 낮추기";
        advBtn.textContent = "네, 지금 심화 레벨 유지 🔥";
      } else {
        titleEl.textContent = "🌟 8일차부터는 더 복잡한 문장에 도전해 볼까요?";
        descEl.textContent = "심화 난이도로 바꾸면 과거형과 의문사(when, where 등)가 들어간 문장을 연습할 수 있어요.";
        basicBtn.textContent = "아니요, 현재 난이도 유지";
        advBtn.textContent = "네, 심화 난이도로 변경 🔥";
      }
    }

    if (examplesEl) {
      examplesEl.innerHTML =
        `<div><strong>🌱 기본 문장 예시:</strong> ${basicEx}</div>` +
        `<div style="margin-top:8px;"><strong>🔥 심화 문장 예시:</strong> ${advEx}</div>`;
    }

    basicBtn.onclick = () => setDifficulty(stageStartDay, "basic");
    advBtn.onclick = () => setDifficulty(stageStartDay, "advanced");
    diffCard.scrollIntoView({ behavior: "smooth", block: "start" });
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
      statusEl.textContent = "👏 어제 문장 복습을 마쳤어요! 이제 오늘 학습을 시작해 볼까요?";
      return;
    }

    const sen = reviewSentences[currentReviewIndex];
    document.getElementById("review-progress-text").textContent =
      `복습 카드 ${currentReviewIndex + 1} / ${reviewSentences.length}`;
    document.getElementById("review-korean").textContent = sen.korean;
    document.getElementById("review-english").textContent = sen.english;

    const engContainer = document.getElementById("review-english-container");
    const toggleBtn = document.getElementById("toggle-review-english-btn");
    engContainer.classList.add("hidden");
    toggleBtn.textContent = "영어 확인하기 👀";

    toggleBtn.onclick = () => {
      if (engContainer.classList.contains("hidden")) {
        engContainer.classList.remove("hidden");
        toggleBtn.textContent = "영어 다시 가리기 🙈";
      } else {
        engContainer.classList.add("hidden");
        toggleBtn.textContent = "영어 확인하기 👀";
      }
    };

    document.getElementById("next-review-btn").onclick = () => {
      addStars(1);
      currentReviewIndex++;
      renderReviewCard(day);
    };
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

    renderFullLesson();
    if (shouldScroll) {
      lessonCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderFullLesson() {
    const data = getLessonData(currentLessonIndex + 1);
    const currentSentence = data.sentences[currentSentenceIndex];
    const record = getLessonRecord(data.day);

    dayLabel.textContent = `${data.day}일차 / ${TOTAL_DAYS}일`;
    lessonTitle.textContent = data.title;
    lessonFocus.textContent = data.focus;
    lessonGuide.textContent = data.guide;

    diffBadge.style.display = data.difficulty === "advanced" ? "inline-block" : "none";

    mainSentence.textContent = currentSentence.english;
    mainMeaning.textContent = currentSentence.korean;

    createDayMenu();
    updateProgressUI(data, record);
    createSentenceButtons(data, record);
    createQuiz(currentSentence);
    updateAnswerVisibility();
    updateCompletionArea(data, record);
    updateNavigationButtons();
  }

  function updateProgressUI(data, record) {
    const totalSentences = data.sentences.length;
    const listenedCount = record.listened.length;
    const solvedCount = record.solved.length;
    const totalCompleted = listenedCount + solvedCount;
    const maxTotal = totalSentences * 2;
    const pct = Math.min(100, Math.round((totalCompleted / maxTotal) * 100));

    if (listenProgressEl) listenProgressEl.textContent = `🔊 듣기: ${listenedCount} / ${totalSentences}`;
    if (quizProgressEl) quizProgressEl.textContent = `🧩 퀴즈: ${solvedCount} / ${totalSentences}`;
    if (dailyProgressBar) dailyProgressBar.style.width = pct + "%";
    if (dailyProgressText) {
      dailyProgressText.textContent = `오늘의 진행도: ${totalCompleted} / ${maxTotal} (${pct}%)`;
    }
  }

  function createDayMenu() {
    dayMenu.innerHTML = "";
    const nextIncompleteDay = getStartingLessonIndex() + 1;

    for (let day = 1; day <= TOTAL_DAYS; day++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-button";

      const completed = isDayCompleted(day);
      const unlocked = isDayUnlocked(day);

      let stateText = "잠김 🔒";
      if (completed) {
        btn.classList.add("completed");
        stateText = "완료 ⭐";
      } else if (day === nextIncompleteDay) {
        btn.classList.add("current");
        stateText = "학습 중 📖";
      } else {
        btn.classList.add("locked");
      }

      if (day - 1 === currentLessonIndex) {
        btn.classList.add("selected");
      }

      btn.innerHTML = `<span>${day}일차</span><span class="day-state">${stateText}</span>`;

      if (unlocked) {
        btn.onclick = () => {
          currentLessonIndex = day - 1;
          startLessonFlow(true);
        };
      } else {
        btn.disabled = true;
      }

      dayMenu.appendChild(btn);
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

      const statusParts = [
        listened ? "🔊 듣기 완료" : "🔊 듣기 전",
        solved ? "🧩 퀴즈 완료" : "🧩 퀴즈 전"
      ];

      btn.innerHTML = `
        <span class="choice-english">${idx + 1}. ${sen.english}</span>
        <span class="choice-korean">${sen.korean}</span>
        <span class="choice-status">${statusParts.join(" · ")}</span>
      `;

      btn.onclick = () => {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        currentSentenceIndex = idx;
        const currentDay = currentLessonIndex + 1;
        answerHidden = currentDay >= 28;
        statusEl.textContent = `${idx + 1}번 문장을 선택했어요.`;
        renderFullLesson();
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
      statusEl.textContent = "이 브라우저에서는 음성 기능이 지원되지 않아 듣기 완료로 처리합니다.";
      if (!record.listened.includes(currentSentenceIndex)) {
        record.listened.push(currentSentenceIndex);
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
    if (words.includes("he")) d.push("She", "We");
    if (words.includes("we")) d.push("She", "He");
    if (words.includes("they")) d.push("She", "I");
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
      return;
    }

    const userAns = selectedBlockIds
      .map((id) => {
        const b = shuffledBlocks.find((x) => x.id === id);
        return b ? b.text : "";
      })
      .join(" ");

    if (userAns === sen.english) {
      const firstTimeSolve = !record.solved.includes(currentSentenceIndex);
      if (firstTimeSolve) {
        record.solved.push(currentSentenceIndex);
        addStars(1);
        saveProgress();
        quizFeedback.textContent = "🎉 정답이에요! (별 1개 획득 ⭐)";
      } else {
        quizFeedback.textContent = "🎉 정답이에요! 완벽하게 기억하고 있네요!";
      }
      quizFeedback.className = "quiz-feedback correct";

      answerHidden = false;
      updateAnswerVisibility();
      updateProgressUI(data, record);
      createSentenceButtons(data, record);
      updateCompletionArea(data, record);
    } else {
      quizFeedback.textContent = "아직 문장이 정확하지 않아요. 주어와 시제(do/does/did)를 다시 확인해 볼까요? 🤔";
      quizFeedback.className = "quiz-feedback incorrect";
    }
  };

  resetQuizBtn.onclick = () => {
    const data = getLessonData(currentLessonIndex + 1);
    createQuiz(data.sentences[currentSentenceIndex]);
  };

  // === Answer Visibility ===
  function updateAnswerVisibility() {
    lessonCard.classList.toggle("answer-hidden", answerHidden);
    toggleAnswerBtn.textContent = answerHidden ? "영어 정답 보기 👀" : "영어 문장 가리기 🙈";
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

    if (completed) {
      completionReqs.innerHTML = "✅ 이미 완료된 일차입니다! 언제든 자유롭게 다시 듣고 풀어볼 수 있어요.";
      completeLessonBtn.disabled = true;
      completeLessonBtn.textContent = `${data.day}일차 학습 완료됨 ⭐`;
      completionMessage.textContent = "완료 기록은 새로고침해도 계속 유지됩니다.";
    } else if (missingListen.length === 0 && missingQuiz.length === 0) {
      completionReqs.innerHTML = "🎉 5개 문장 듣기와 블록 퀴즈를 모두 완료했어요! 아래 버튼을 눌러 오늘 학습을 마치세요.";
      completeLessonBtn.disabled = false;
      completeLessonBtn.textContent = `🎉 ${data.day}일차 학습 완료하기 (+10⭐)`;
      completionMessage.textContent = "완료 버튼을 누르면 다음 학습으로 자동 이동합니다.";
    } else {
      const reasons = [];
      if (missingListen.length > 0) {
        reasons.push(`🔊 아직 끝까지 듣지 않은 문장 (${missingListen.length}개): <b>${missingListen.join(", ")}</b>`);
      }
      if (missingQuiz.length > 0) {
        reasons.push(`🧩 아직 맞히지 않은 블록 퀴즈 (${missingQuiz.length}개): <b>${missingQuiz.join(", ")}</b>`);
      }
      completionReqs.innerHTML =
        `<div>⚠️ <b>아직 완료 버튼을 누를 수 없어요:</b></div>` +
        `<div style="margin-top:6px;line-height:1.6;">${reasons.join("<br>")}</div>`;
      completeLessonBtn.disabled = true;
      completeLessonBtn.textContent = "남은 문장 듣기와 퀴즈를 먼저 완료해 주세요";
      completionMessage.textContent = "";
    }
  }

  completeLessonBtn.onclick = () => {
    const day = currentLessonIndex + 1;
    const data = getLessonData(day);
    const record = getLessonRecord(day);

    if (record.listened.length < data.sentences.length || record.solved.length < data.sentences.length) {
      updateCompletionArea(data, record);
      return;
    }

    if (!isDayCompleted(day)) {
      progress.completedDays.push(day);
      progress.completedDays.sort((a, b) => a - b);
      addStars(10);
      saveProgress();
      showConfetti();
      createDayMenu();
      updateCompletionArea(data, record);
      updateNavigationButtons();

      statusEl.textContent = `🎊 축하합니다! ${day}일차 학습을 완료했어요! 잠시 후 다음 학습으로 이동합니다...`;

      setTimeout(() => {
        if (day === TOTAL_DAYS) {
          if (courseData.nextCourseUrl) {
            window.location.href = courseData.nextCourseUrl;
          } else {
            statusEl.textContent = "🏆 2개월차 30일 학습까지 모두 완료했습니다! 정말 대단해요!";
            lessonCard.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else {
          currentLessonIndex = day; // Move to next day (0-indexed: day is index of day+1)
          startLessonFlow(true);
        }
      }, 1800);
    }
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
      startLessonFlow(true);
    }
  };

  nextBtn.onclick = () => {
    const nextDay = currentLessonIndex + 2;
    if (nextDay <= TOTAL_DAYS && isDayUnlocked(nextDay)) {
      currentLessonIndex++;
      startLessonFlow(true);
    }
  };

  initApp();
})();
