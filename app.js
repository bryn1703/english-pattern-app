(() => {
  "use strict";

  const data = window.COURSE_DATA;
  if (!data || !Array.isArray(data.lessons)) {
    document.body.textContent = "학습 자료를 불러오지 못했습니다.";
    return;
  }

  const STORAGE_KEY = `english-pattern-${data.courseId}-progress-v3`;
  const LEGACY_KEY = `english-pattern-${data.courseId}-completed-days`;
  const TOTAL = data.lessons.length;

  const $ = (selector) => document.querySelector(selector);
  const elements = {
    dayMenu: $("#day-menu"), lessonView: $("#lesson-view"), dayLabel: $("#day-label"),
    lessonTitle: $("#lesson-title"), lessonFocus: $("#lesson-focus"), lessonGuide: $("#lesson-guide"),
    reviewPanel: $("#review-panel"), reviewCount: $("#review-count"), reviewKorean: $("#review-korean"),
    reviewEnglish: $("#review-english"), reviewRevealButton: $("#review-reveal-button"), reviewNextButton: $("#review-next-button"),
    lessonBody: $("#lesson-body"), listenProgress: $("#listen-progress"), quizProgress: $("#quiz-progress"),
    mainSentence: $("#main-sentence"), mainMeaning: $("#main-meaning"), sentenceChoices: $("#sentence-choices"),
    listenButton: $("#listen-button"), status: $("#status"), quizKoreanPrompt: $("#quiz-korean-prompt"),
    answerZone: $("#answer-zone"), wordBank: $("#word-bank"), toggleAnswerButton: $("#toggle-answer-button"),
    resetQuizButton: $("#reset-quiz-button"), checkAnswerButton: $("#check-answer-button"), quizFeedback: $("#quiz-feedback"),
    completeButton: $("#complete-lesson-button"), completionMessage: $("#completion-message"),
    previousButton: $("#previous-button"), nextButton: $("#next-button"), difficultyModal: $("#difficulty-modal"),
    difficultyTitle: $("#difficulty-title"), difficultyCopy: $("#difficulty-copy"), basicExample: $("#basic-example"),
    advancedExample: $("#advanced-example"), difficultyBasicButton: $("#difficulty-basic-button"),
    difficultyAdvancedButton: $("#difficulty-advanced-button")
  };

  function defaultState() {
    return { completedDays: [], lessonProgress: {}, reviewDoneDays: [], difficulty: { stage1: null, stage2: null } };
  }

  function loadState() {
    const fallback = defaultState();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && typeof saved === "object") {
        return {
          completedDays: Array.isArray(saved.completedDays) ? saved.completedDays : [],
          lessonProgress: saved.lessonProgress && typeof saved.lessonProgress === "object" ? saved.lessonProgress : {},
          reviewDoneDays: Array.isArray(saved.reviewDoneDays) ? saved.reviewDoneDays : [],
          difficulty: saved.difficulty && typeof saved.difficulty === "object"
            ? { stage1: saved.difficulty.stage1 || null, stage2: saved.difficulty.stage2 || null }
            : { stage1: null, stage2: null }
        };
      }
    } catch (error) {
      console.warn("새 진행 기록을 읽지 못했습니다.", error);
    }
    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "[]");
      if (Array.isArray(legacy)) {
        fallback.completedDays = legacy.filter((day) => Number.isInteger(day) && day >= 1 && day <= TOTAL);
      }
    } catch (error) {
      console.warn("이전 완료 기록을 읽지 못했습니다.", error);
    }
    return fallback;
  }

  let state = loadState();
  let currentLessonIndex = getNextIncompleteIndex();
  if (currentLessonIndex === -1) currentLessonIndex = TOTAL - 1;
  let currentSentenceIndex = 0;
  let shuffledBlocks = [];
  let selectedBlockIds = [];
  let answerHidden = false;
  let reviewIndex = 0;
  let difficultyContinuation = null;

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function isCompleted(day) {
    return state.completedDays.includes(day);
  }

  function getNextIncompleteIndex() {
    return data.lessons.findIndex((lesson) => !isCompleted(lesson.day));
  }

  function isUnlocked(index) {
    if (index < 0 || index >= TOTAL) return false;
    if (isCompleted(data.lessons[index].day)) return true;
    const next = getNextIncompleteIndex();
    return next === -1 || index === next;
  }

  function modeForDay(day) {
    if (day <= 3) return "basic";
    if (day <= 7) return state.difficulty.stage1 || "basic";
    return state.difficulty.stage2 || state.difficulty.stage1 || "basic";
  }

  function getLesson(index = currentLessonIndex) {
    return data.lessons[index];
  }

  function getSentences(index = currentLessonIndex) {
    const lesson = getLesson(index);
    const mode = modeForDay(lesson.day);
    if (mode === "advanced" && Array.isArray(lesson.advancedSentences) && lesson.advancedSentences.length === 5) {
      return lesson.advancedSentences;
    }
    return lesson.sentences;
  }

  function sentenceId(day, mode, index) {
    return `${day}-${mode}-${index}`;
  }

  function progressKey(day, mode) {
    return `${day}-${mode}`;
  }

  function getDayProgress(day, mode) {
    const key = progressKey(day, mode);
    if (!state.lessonProgress[key]) state.lessonProgress[key] = { listened: [], solved: [] };
    return state.lessonProgress[key];
  }

  function currentContext() {
    const lesson = getLesson();
    const mode = modeForDay(lesson.day);
    const sentences = getSentences();
    const progress = getDayProgress(lesson.day, mode);
    return { lesson, mode, sentences, progress };
  }

  function uniquePush(array, value) {
    if (!array.includes(value)) array.push(value);
  }

  function scrollToLesson() {
    requestAnimationFrame(() => elements.lessonView.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function renderDayMenu() {
    elements.dayMenu.innerHTML = "";
    const next = getNextIncompleteIndex();
    data.lessons.forEach((lesson, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "day-button";
      const dayText = document.createElement("span");
      dayText.textContent = `${lesson.day}일차`;
      const stateText = document.createElement("span");
      stateText.className = "day-state";
      if (isCompleted(lesson.day)) {
        button.classList.add("completed");
        stateText.textContent = "완료";
      } else if (index === next) {
        button.classList.add("current");
        stateText.textContent = "학습 중";
      } else {
        button.classList.add("locked");
        stateText.textContent = "잠김";
      }
      if (index === currentLessonIndex) button.classList.add("selected");
      button.append(dayText, stateText);
      button.disabled = !isUnlocked(index);
      if (!button.disabled) button.addEventListener("click", () => selectLesson(index, true));
      elements.dayMenu.appendChild(button);
    });
  }

  function shouldShowReview() {
    const lesson = getLesson();
    return lesson.day > 1 && !isCompleted(lesson.day) && !state.reviewDoneDays.includes(lesson.day);
  }

  function renderReview() {
    if (!shouldShowReview()) {
      elements.reviewPanel.classList.add("hidden");
      elements.lessonBody.classList.remove("hidden");
      return;
    }
    const previousSentences = getSentences(currentLessonIndex - 1);
    reviewIndex = Math.min(reviewIndex, previousSentences.length - 1);
    const item = previousSentences[reviewIndex];
    elements.reviewPanel.classList.remove("hidden");
    elements.lessonBody.classList.add("hidden");
    elements.reviewCount.textContent = `복습 ${reviewIndex + 1} / ${previousSentences.length}`;
    elements.reviewKorean.textContent = item.korean;
    elements.reviewEnglish.textContent = "";
    elements.reviewRevealButton.textContent = "영어 확인하기";
    elements.reviewNextButton.textContent = reviewIndex === previousSentences.length - 1 ? "말했어요 · 복습 완료" : "말했어요 · 다음";
  }

  function revealReviewAnswer() {
    const item = getSentences(currentLessonIndex - 1)[reviewIndex];
    const visible = elements.reviewEnglish.textContent !== "";
    elements.reviewEnglish.textContent = visible ? "" : item.english;
    elements.reviewRevealButton.textContent = visible ? "영어 확인하기" : "영어 다시 가리기";
  }

  function advanceReview() {
    const count = getSentences(currentLessonIndex - 1).length;
    if (reviewIndex < count - 1) {
      reviewIndex += 1;
      renderReview();
      return;
    }
    uniquePush(state.reviewDoneDays, getLesson().day);
    saveState();
    reviewIndex = 0;
    elements.status.textContent = "어제의 문장 복습을 마쳤습니다. 오늘의 5문장을 시작하세요.";
    renderReview();
    updateCompletionArea();
    scrollToLesson();
  }

  function renderLesson() {
    const { lesson, mode, sentences } = currentContext();
    if (currentSentenceIndex >= sentences.length) currentSentenceIndex = 0;
    const current = sentences[currentSentenceIndex];
    elements.dayLabel.textContent = `${lesson.day}일차 / ${TOTAL}일`;
    elements.lessonTitle.textContent = lesson.title;
    if (mode === "advanced") {
      const badge = document.createElement("span");
      badge.className = "difficulty-badge";
      badge.textContent = "심화";
      elements.lessonTitle.appendChild(badge);
    }
    elements.lessonFocus.textContent = mode === "advanced" ? "시제·주어·의문사 통합 연습" : lesson.focus;
    elements.lessonGuide.textContent = mode === "advanced"
      ? `${lesson.guide} 현재형과 과거형, 질문과 부정, when·where 표현을 함께 구별합니다.`
      : lesson.guide;
    elements.mainSentence.textContent = current.english;
    elements.mainMeaning.textContent = current.korean;
    answerHidden = lesson.day >= 28;
    updateAnswerVisibility();
    renderSentenceChoices();
    createQuiz();
    renderProgress();
    renderReview();
    renderDayMenu();
    updateNavigation();
    updateCompletionArea();
  }

  function renderSentenceChoices() {
    const { lesson, mode, sentences, progress } = currentContext();
    elements.sentenceChoices.innerHTML = "";
    sentences.forEach((item, index) => {
      const id = sentenceId(lesson.day, mode, index);
      const listened = progress.listened.includes(id);
      const solved = progress.solved.includes(id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sentence-button" + (index === currentSentenceIndex ? " selected" : "");
      const english = document.createElement("span");
      english.className = "choice-english";
      english.textContent = item.english;
      const korean = document.createElement("span");
      korean.className = "choice-korean";
      korean.textContent = item.korean;
      const stateLine = document.createElement("span");
      stateLine.className = "choice-state" + (listened && solved ? " done" : "");
      stateLine.textContent = `듣기 ${listened ? "완료" : "미완료"} · 퀴즈 ${solved ? "완료" : "미완료"}`;
      button.append(english, korean, stateLine);
      button.addEventListener("click", () => {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        currentSentenceIndex = index;
        elements.status.textContent = `${index + 1}번 문장을 선택했습니다.`;
        renderLesson();
      });
      elements.sentenceChoices.appendChild(button);
    });
  }

  function renderProgress() {
    const { lesson, mode, sentences, progress } = currentContext();
    const ids = sentences.map((_, index) => sentenceId(lesson.day, mode, index));
    const listened = ids.filter((id) => progress.listened.includes(id)).length;
    const solved = ids.filter((id) => progress.solved.includes(id)).length;
    elements.listenProgress.textContent = `${listened} / ${sentences.length}`;
    elements.quizProgress.textContent = `${solved} / ${sentences.length}`;
  }

  function speakCurrentSentence() {
    if (!("speechSynthesis" in window)) {
      elements.status.textContent = "이 브라우저에서는 음성 재생을 사용할 수 없습니다.";
      return;
    }
    const { lesson, mode, sentences, progress } = currentContext();
    const id = sentenceId(lesson.day, mode, currentSentenceIndex);
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(sentences[currentSentenceIndex].english);
    speech.lang = "en-US";
    speech.rate = 0.72;
    speech.onstart = () => { elements.status.textContent = "문장을 끝까지 듣고 있습니다."; };
    speech.onend = () => {
      uniquePush(progress.listened, id);
      saveState();
      elements.status.textContent = "듣기 완료로 기록했습니다. 소리 내어 따라 말해 보세요.";
      renderSentenceChoices();
      renderProgress();
      updateCompletionArea();
    };
    speech.onerror = (event) => {
      if (event.error !== "canceled" && event.error !== "interrupted") {
        elements.status.textContent = "음성을 끝까지 재생하지 못했습니다. 다시 시도하세요.";
      }
    };
    window.speechSynthesis.speak(speech);
  }

  function normalizeWord(word) {
    return word.toLowerCase().replace(/[.,?!]/g, "");
  }

  function automaticDistractors(sentence) {
    const words = sentence.split(/\s+/).map(normalizeWord);
    const result = [];
    const add = (...items) => result.push(...items);
    if (words.includes("do")) add("Does", "Did");
    if (words.includes("does")) add("Do", "Did");
    if (words.includes("did")) add("Do", "Does");
    if (words.includes("don't")) add("doesn't", "didn't");
    if (words.includes("doesn't")) add("don't", "didn't");
    if (words.includes("didn't")) add("don't", "doesn't");
    if (words.includes("like")) add("likes", "liked");
    if (words.includes("likes")) add("like", "liked");
    if (words.includes("liked")) add("like", "likes");
    if (words.includes("want")) add("wants", "wanted");
    if (words.includes("wants")) add("want", "wanted");
    if (words.includes("wanted")) add("want", "wants");
    if (words.includes("i")) add("She", "They");
    if (words.includes("she")) add("I", "They");
    if (words.includes("he")) add("She", "They");
    if (words.includes("we")) add("I", "She");
    if (words.includes("they")) add("She", "I");
    if (words.includes("what")) add("When", "Where");
    if (words.includes("when")) add("What", "Where");
    if (words.includes("where")) add("What", "When");
    if (words.includes("always")) add("usually", "never");
    if (words.includes("usually")) add("always", "sometimes");
    if (words.includes("often")) add("always", "rarely");
    if (words.includes("never")) add("always", "sometimes");
    return result;
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const random = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[random]] = [copy[random], copy[index]];
    }
    return copy;
  }

  function createQuiz() {
    const current = getSentences()[currentSentenceIndex];
    elements.quizKoreanPrompt.textContent = current.korean;
    const correctWords = current.english.split(/\s+/);
    const correct = correctWords.map((text, index) => ({ id: `correct-${index}`, text }));
    const correctNormalized = new Set(correctWords.map(normalizeWord));
    const custom = Array.isArray(current.distractors) ? current.distractors : [];
    const distractorWords = [...new Set([...automaticDistractors(current.english), ...custom])]
      .filter((word) => !correctNormalized.has(normalizeWord(word)));
    const distractors = shuffle(distractorWords).slice(0, 8)
      .map((text, index) => ({ id: `distractor-${index}`, text }));
    shuffledBlocks = shuffle([...correct, ...distractors]);
    selectedBlockIds = [];
    elements.quizFeedback.textContent = "";
    elements.quizFeedback.className = "quiz-feedback";
    renderQuiz();
  }

  function renderQuiz() {
    elements.answerZone.innerHTML = "";
    elements.wordBank.innerHTML = "";
    if (selectedBlockIds.length === 0) {
      const placeholder = document.createElement("p");
      placeholder.className = "answer-placeholder";
      placeholder.textContent = "필요한 블록을 문장 순서대로 누르세요.";
      elements.answerZone.appendChild(placeholder);
    }
    selectedBlockIds.forEach((id) => {
      const block = shuffledBlocks.find((item) => item.id === id);
      if (block) elements.answerZone.appendChild(makeBlock(block, true));
    });
    shuffledBlocks.forEach((block) => {
      if (!selectedBlockIds.includes(block.id)) elements.wordBank.appendChild(makeBlock(block, false));
    });
  }

  function makeBlock(block, selected) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "word-block" + (selected ? " answer-block" : "");
    button.textContent = block.text;
    button.addEventListener("click", () => {
      if (selected) selectedBlockIds = selectedBlockIds.filter((id) => id !== block.id);
      else selectedBlockIds.push(block.id);
      elements.quizFeedback.textContent = "";
      elements.quizFeedback.className = "quiz-feedback";
      renderQuiz();
    });
    return button;
  }

  function userAnswer() {
    return selectedBlockIds.map((id) => shuffledBlocks.find((item) => item.id === id)?.text || "").join(" ");
  }

  function checkAnswer() {
    const { lesson, mode, sentences, progress } = currentContext();
    if (userAnswer() === sentences[currentSentenceIndex].english) {
      const id = sentenceId(lesson.day, mode, currentSentenceIndex);
      uniquePush(progress.solved, id);
      saveState();
      elements.quizFeedback.textContent = "정답입니다. 헷갈리는 블록도 잘 구별했습니다.";
      elements.quizFeedback.className = "quiz-feedback correct";
      answerHidden = false;
      updateAnswerVisibility();
      renderSentenceChoices();
      renderProgress();
      updateCompletionArea();
    } else {
      elements.quizFeedback.textContent = "아직 정확하지 않습니다. 주어, 시제, 조동사와 동사 형태를 다시 살펴보세요.";
      elements.quizFeedback.className = "quiz-feedback incorrect";
    }
  }

  function updateAnswerVisibility() {
    elements.lessonView.classList.toggle("answer-hidden", answerHidden);
    elements.toggleAnswerButton.textContent = answerHidden ? "영어 정답 보기" : "영어 문장 가리기";
  }

  function completionStatus() {
    const { lesson, mode, sentences, progress } = currentContext();
    const ids = sentences.map((_, index) => sentenceId(lesson.day, mode, index));
    return {
      missingListen: ids.filter((id) => !progress.listened.includes(id)).length,
      missingQuiz: ids.filter((id) => !progress.solved.includes(id)).length,
      reviewMissing: shouldShowReview()
    };
  }

  function updateCompletionArea() {
    const lesson = getLesson();
    if (isCompleted(lesson.day)) {
      elements.completeButton.disabled = true;
      elements.completeButton.textContent = `${lesson.day}일차 학습 완료됨`;
      elements.completionMessage.textContent = "완료 기록이 저장되어 있습니다. 다시 듣고 풀어도 완료 상태는 유지됩니다.";
      return;
    }
    const missing = completionStatus();
    const ready = !missing.reviewMissing && missing.missingListen === 0 && missing.missingQuiz === 0;
    elements.completeButton.disabled = !ready;
    elements.completeButton.textContent = ready ? `${lesson.day}일차 학습 완료하기` : "아직 학습을 완료할 수 없습니다";
    const reasons = [];
    if (missing.reviewMissing) reasons.push("어제의 문장 복습을 먼저 마쳐야 합니다.");
    if (missing.missingListen) reasons.push(`끝까지 듣지 않은 문장: ${missing.missingListen}개`);
    if (missing.missingQuiz) reasons.push(`맞히지 않은 블록 퀴즈: ${missing.missingQuiz}개`);
    elements.completionMessage.textContent = ready
      ? "5개 문장을 모두 듣고 5개 퀴즈를 모두 맞혔습니다."
      : reasons.join("\n");
  }

  function updateNavigation() {
    elements.previousButton.disabled = currentLessonIndex === 0 || !isUnlocked(currentLessonIndex - 1);
    elements.nextButton.disabled = currentLessonIndex >= TOTAL - 1 || !isUnlocked(currentLessonIndex + 1);
  }

  function selectLesson(index, shouldScroll = false) {
    if (!isUnlocked(index)) return;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    currentLessonIndex = index;
    currentSentenceIndex = 0;
    reviewIndex = 0;
    renderLesson();
    elements.status.textContent = isCompleted(getLesson().day)
      ? `${getLesson().day}일차는 완료한 학습입니다. 자유롭게 복습하세요.`
      : `${getLesson().day}일차 학습을 시작합니다.`;
    if (shouldScroll) scrollToLesson();
  }

  function showDifficultyChoice(stage, continuation) {
    difficultyContinuation = continuation;
    const current = stage === "stage2" ? (state.difficulty.stage1 || "basic") : "basic";
    if (stage === "stage1") {
      elements.difficultyTitle.textContent = "4일차부터 더 복잡한 문장을 배워 볼까요?";
      elements.difficultyCopy.textContent = "4~7일차는 선택한 난이도로 비슷한 수준을 유지합니다.";
    } else if (current === "advanced") {
      elements.difficultyTitle.textContent = "8일차부터 현재 심화 난이도를 계속할까요?";
      elements.difficultyCopy.textContent = "기본 난이도로 돌아가거나, 현재의 시제·의문사 통합 수준을 유지할 수 있습니다.";
    } else {
      elements.difficultyTitle.textContent = "8일차부터 더 복잡한 문장을 학습할까요?";
      elements.difficultyCopy.textContent = "현재 난이도를 유지하거나 심화 난이도로 바꿀 수 있습니다.";
    }
    elements.basicExample.textContent = data.basicExample;
    elements.advancedExample.textContent = data.advancedExample;
    elements.difficultyBasicButton.textContent = stage === "stage2" && current === "advanced" ? "기본 난이도로 변경" : "아니요, 현재 난이도 유지";
    elements.difficultyAdvancedButton.textContent = stage === "stage2" && current === "advanced" ? "네, 심화 난이도 유지" : "네, 심화 난이도로 학습";
    elements.difficultyModal.classList.remove("hidden");
    elements.difficultyModal.dataset.stage = stage;
  }

  function chooseDifficulty(mode) {
    const stage = elements.difficultyModal.dataset.stage;
    state.difficulty[stage] = mode;
    saveState();
    elements.difficultyModal.classList.add("hidden");
    const continuation = difficultyContinuation;
    difficultyContinuation = null;
    if (typeof continuation === "function") continuation();
    else renderLesson();
  }

  function completeLesson() {
    const lesson = getLesson();
    const missing = completionStatus();
    if (missing.reviewMissing || missing.missingListen || missing.missingQuiz) {
      updateCompletionArea();
      return;
    }
    uniquePush(state.completedDays, lesson.day);
    state.completedDays.sort((a, b) => a - b);
    saveState();

    if (lesson.day === TOTAL) {
      if (data.nextCourseUrl) {
        elements.status.textContent = "이번 달 학습을 완료했습니다. 다음 달 학습으로 이동합니다.";
        setTimeout(() => { window.location.href = data.nextCourseUrl; }, 900);
      } else {
        renderLesson();
        elements.status.textContent = "2개월차 30일 학습을 모두 완료했습니다.";
      }
      return;
    }

    const goNext = () => selectLesson(currentLessonIndex + 1, true);
    if (lesson.day === 3 && !state.difficulty.stage1) {
      renderDayMenu();
      showDifficultyChoice("stage1", goNext);
      return;
    }
    if (lesson.day === 7 && !state.difficulty.stage2) {
      renderDayMenu();
      showDifficultyChoice("stage2", goNext);
      return;
    }
    goNext();
  }

  function checkPendingDifficulty() {
    const day = getLesson().day;
    if (!isCompleted(day) && day >= 4 && day <= 7 && !state.difficulty.stage1) {
      showDifficultyChoice("stage1", () => renderLesson());
    } else if (!isCompleted(day) && day >= 8 && !state.difficulty.stage2) {
      showDifficultyChoice("stage2", () => renderLesson());
    }
  }

  elements.reviewRevealButton.addEventListener("click", revealReviewAnswer);
  elements.reviewNextButton.addEventListener("click", advanceReview);
  elements.listenButton.addEventListener("click", speakCurrentSentence);
  elements.toggleAnswerButton.addEventListener("click", () => { answerHidden = !answerHidden; updateAnswerVisibility(); });
  elements.resetQuizButton.addEventListener("click", createQuiz);
  elements.checkAnswerButton.addEventListener("click", checkAnswer);
  elements.completeButton.addEventListener("click", completeLesson);
  elements.previousButton.addEventListener("click", () => selectLesson(currentLessonIndex - 1, true));
  elements.nextButton.addEventListener("click", () => selectLesson(currentLessonIndex + 1, true));
  elements.difficultyBasicButton.addEventListener("click", () => chooseDifficulty("basic"));
  elements.difficultyAdvancedButton.addEventListener("click", () => chooseDifficulty("advanced"));

  renderLesson();
  elements.status.textContent = isCompleted(getLesson().day)
    ? "모든 학습을 완료했습니다. 원하는 일차를 선택해 복습하세요."
    : `${getLesson().day}일차 학습을 이어서 진행합니다.`;
  checkPendingDifficulty();
})();
