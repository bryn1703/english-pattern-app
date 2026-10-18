// === V4 State Management & Data ===
const PROGRESS_KEY = `english-pattern-${COURSE_ID}-progress-v4`;
const STARS_KEY = `english-pattern-total-stars`;

let progress = loadProgress();
let userStars = parseInt(localStorage.getItem(STARS_KEY) || '0');

let currentLessonIndex = 0;
let currentSentenceIndex = 0;

// Review State
let isReviewMode = false;
let reviewSentences = [];
let currentReviewIndex = 0;

// Quiz State
let shuffledBlocks = [];
let selectedBlockIds = [];
let answerHidden = false;

// DOM Elements
const starCountEl = document.getElementById('star-count');
const dayMenu = document.getElementById('day-menu');
const lessonCard = document.getElementById('lesson-card');
const reviewCard = document.getElementById('review-card');
const diffCard = document.getElementById('difficulty-card');

const dayLabel = document.getElementById('day-label');
const diffBadge = document.getElementById('diff-badge');
const lessonTitle = document.getElementById('lesson-title');
const lessonFocus = document.getElementById('lesson-focus');
const lessonGuide = document.getElementById('lesson-guide');
const mainSentence = document.getElementById('main-sentence');
const mainMeaning = document.getElementById('main-meaning');
const sentenceChoices = document.getElementById('sentence-choices');

const listenBtn = document.getElementById('listen-button');
const statusEl = document.getElementById('status');
const quizKoreanPrompt = document.getElementById('quiz-korean-prompt');
const answerZone = document.getElementById('answer-zone');
const wordBank = document.getElementById('word-bank');
const toggleAnswerBtn = document.getElementById('toggle-answer-button');
const resetQuizBtn = document.getElementById('reset-quiz-button');
const checkAnswerBtn = document.getElementById('check-answer-button');
const quizFeedback = document.getElementById('quiz-feedback');

const completionReqs = document.getElementById('completion-reqs');
const completeLessonBtn = document.getElementById('complete-lesson-button');
const completionMessage = document.getElementById('completion-message');
const prevBtn = document.getElementById('previous-button');
const nextBtn = document.getElementById('next-button');

// Gamification: Stars
function addStars(amount) {
  userStars += amount;
  localStorage.setItem(STARS_KEY, userStars);
  starCountEl.textContent = userStars;

  // Animate the star icon
  const icon = document.querySelector('.star-icon');
  icon.style.animation = 'none';
  setTimeout(() => icon.style.animation = 'popIn 0.5s ease', 10);
}

// Confetti Effect
function showConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#FF7B89', '#3B82F6', '#34D399', '#FBBF24', '#A78BFA'];
  for(let i=0; i<50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
    piece.style.animationDelay = (Math.random() * 0.5) + 's';
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}

// Data Management
function loadProgress() {
  const defaultProgress = {
    completedDays: [],
    lessons: {}, // e.g., { 1: { listened: [...], solved: [...] } }
    difficulty: { days4to7: null, days8to30: null }
  };
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY));
    if (saved && Array.isArray(saved.completedDays)) {
      return saved;
    }
    // Migration from v3 if exists
    const v3 = JSON.parse(localStorage.getItem(`english-pattern-${COURSE_ID}-progress-v3`));
    if(v3 && Array.isArray(v3.completedDays)) return v3;
  } catch(e) {}
  return defaultProgress;
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function getLessonRecord(day) {
  if (!progress.lessons[day]) {
    progress.lessons[day] = { listened: [], solved: [] };
  }
  return progress.lessons[day];
}

// Navigation Logic
function getStartingLessonIndex() {
  for(let i=0; i<30; i++) {
    if(!progress.completedDays.includes(i+1)) return i;
  }
  return 29;
}

function initApp() {
  starCountEl.textContent = userStars;
  currentLessonIndex = getStartingLessonIndex();
  startLessonFlow();
}

function startLessonFlow() {
  const day = currentLessonIndex + 1;
  const isCompleted = progress.completedDays.includes(day);

  // 1. Difficulty Check
  if (!isCompleted && day === 4 && !progress.difficulty.days4to7) {
    showDifficultySelection(4);
    return;
  }
  if (!isCompleted && day === 8 && !progress.difficulty.days8to30) {
    showDifficultySelection(8);
    return;
  }

  // 2. Review Check
  if (!isCompleted && day > 1) {
    const prevDay = day - 1;
    const prevData = getLessonData(prevDay);
    if (prevData && prevData.sentences.length > 0) {
      startReviewMode(prevData.sentences);
      return;
    }
  }

  // 3. Normal Lesson
  showMainLesson();
}

function getLessonData(day) {
  let diff = "basic";
  if (day >= 4 && day <= 7 && progress.difficulty.days4to7 === "advanced") diff = "advanced";
  if (day >= 8 && progress.difficulty.days8to30 === "advanced") diff = "advanced";
  return lessonData[diff].find(l => l.day === day);
}

// === Difficulty Selection ===
function showDifficultySelection(startDay) {
  lessonCard.style.display = 'none';
  reviewCard.style.display = 'none';
  diffCard.style.display = 'block';
  dayMenu.innerHTML = ''; // Clear menu during selection

  const titleEl = document.getElementById('diff-title');
  const descEl = document.getElementById('diff-desc');
  const basicBtn = document.getElementById('btn-diff-basic');
  const advBtn = document.getElementById('btn-diff-advanced');

  if(startDay === 4) {
    titleEl.textContent = "4일차부터 더 복잡한 문장을 배워 볼까요?";
    descEl.innerHTML = "<b>기본:</b> I want to read this book.<br><b>심화:</b> When did she decide that she wanted to read this book?";
    basicBtn.textContent = "아니요, 현재 난이도 유지";
    advBtn.textContent = "네, 심화 난이도로 학습 🔥";
  } else {
    const prevDiff = progress.difficulty.days4to7;
    if(prevDiff === 'advanced') {
      titleEl.textContent = "8일차부터 현재 심화 난이도를 계속할까요?";
      descEl.textContent = "계속해서 복잡한 시제와 긴 문장을 학습합니다.";
      basicBtn.textContent = "기본 난이도로 변경";
      advBtn.textContent = "네, 심화 난이도 유지 🔥";
    } else {
      titleEl.textContent = "8일차부터 더 복잡한 문장을 학습할까요?";
      descEl.textContent = "시제 변형(과거형)과 긴 문장이 추가됩니다.";
      basicBtn.textContent = "아니요, 현재 난이도 유지";
      advBtn.textContent = "네, 심화 난이도로 변경 🔥";
    }
  }

  basicBtn.onclick = () => setDifficulty(startDay, 'basic');
  advBtn.onclick = () => setDifficulty(startDay, 'advanced');
}

function setDifficulty(startDay, level) {
  if(startDay === 4) progress.difficulty.days4to7 = level;
  if(startDay === 8) progress.difficulty.days8to30 = level;
  saveProgress();
  diffCard.style.display = 'none';
  startLessonFlow();
}

// === Review Mode ===
function startReviewMode(sentences) {
  isReviewMode = true;
  reviewSentences = sentences;
  currentReviewIndex = 0;

  lessonCard.style.display = 'none';
  diffCard.style.display = 'none';
  reviewCard.style.display = 'block';

  createDayMenu();
  renderReviewCard();
}

function renderReviewCard() {
  if(currentReviewIndex >= reviewSentences.length) {
    // Review Done
    isReviewMode = false;
    reviewCard.style.display = 'none';
    showMainLesson();
    return;
  }

  const sen = reviewSentences[currentReviewIndex];
  document.getElementById('review-progress-text').textContent = `${currentReviewIndex + 1} / ${reviewSentences.length}`;
  document.getElementById('review-korean').textContent = sen.korean;
  document.getElementById('review-english').textContent = sen.english;

  const engContainer = document.getElementById('review-english-container');
  const toggleBtn = document.getElementById('toggle-review-english-btn');
  engContainer.classList.add('hidden');
  toggleBtn.textContent = "영어 정답 보기";

  toggleBtn.onclick = () => {
    if(engContainer.classList.contains('hidden')) {
      engContainer.classList.remove('hidden');
      toggleBtn.textContent = "영어 다시 가리기";
    } else {
      engContainer.classList.add('hidden');
      toggleBtn.textContent = "영어 정답 보기";
    }
  };

  document.getElementById('next-review-btn').onclick = () => {
    addStars(1); // Give a star for review!
    currentReviewIndex++;
    renderReviewCard();
  };
}

// === Main Lesson Flow ===
function showMainLesson() {
  lessonCard.style.display = 'block';
  currentSentenceIndex = 0;
  updateLessonScreen();
  lessonCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateLessonScreen() {
  const data = getLessonData(currentLessonIndex + 1);
  const currentSentence = data.sentences[currentSentenceIndex];
  const record = getLessonRecord(data.day);

  // Headers
  dayLabel.textContent = `${data.day}일차 / 30일`;
  lessonTitle.textContent = data.title;
  lessonFocus.textContent = data.focus;
  lessonGuide.textContent = data.guide;

  // Difficulty Badge
  const isAdv = (data.day >= 4 && data.day <=7 && progress.difficulty.days4to7 === 'advanced') || 
                (data.day >= 8 && progress.difficulty.days8to30 === 'advanced');
  diffBadge.style.display = isAdv ? 'inline-block' : 'none';

  mainSentence.textContent = currentSentence.english;
  mainMeaning.textContent = currentSentence.korean;

  // Progress Bar
  const totalCompleted = record.listened.length + record.solved.length;
  const maxTotal = data.sentences.length * 2;
  const pct = (totalCompleted / maxTotal) * 100;
  document.getElementById('daily-progress-bar').style.width = pct + '%';
  document.getElementById('daily-progress-text').textContent = `진행도: ${totalCompleted} / ${maxTotal}`;

  answerHidden = data.day >= 28;

  createDayMenu();
  createSentenceButtons(data, record);
  createQuiz(currentSentence);
  updateAnswerVisibility();
  updateCompletionArea(data, record);
  updateNavigationButtons();
}

function createDayMenu() {
  dayMenu.innerHTML = "";
  for(let i=1; i<=30; i++) {
    const btn = document.createElement('button');
    btn.className = 'day-button';
    const completed = progress.completedDays.includes(i);
    const unlocked = completed || (i === getStartingLessonIndex() + 1);

    let stateText = "잠김";
    if(completed) { btn.classList.add('completed'); stateText = "완료"; }
    else if(unlocked) { btn.classList.add('current'); stateText = "학습 중"; }
    else { btn.classList.add('locked'); }

    if(i - 1 === currentLessonIndex && !isReviewMode && diffCard.style.display === 'none') {
      btn.classList.add('selected');
    }

    btn.innerHTML = `<span>${i}일차</span><span class="day-state">${stateText}</span>`;
    if(unlocked) btn.onclick = () => { currentLessonIndex = i-1; startLessonFlow(); };
    dayMenu.appendChild(btn);
  }
}

function createSentenceButtons(data, record) {
  sentenceChoices.innerHTML = "";
  data.sentences.forEach((sen, idx) => {
    const btn = document.createElement('button');
    btn.className = 'sentence-button';
    if(idx === currentSentenceIndex) btn.classList.add('selected');

    const listened = record.listened.includes(idx);
    const solved = record.solved.includes(idx);
    if(listened && solved) btn.classList.add('completed-choice');

    let stText = [];
    if(listened) stText.push("🔊 듣기 완료");
    if(solved) stText.push("🧩 퀴즈 완료");

    btn.innerHTML = `
      <span class="choice-english">${sen.english}</span>
      <span class="choice-korean">${sen.korean}</span>
      <span class="choice-status">${stText.length > 0 ? stText.join(' | ') : '미완료'}</span>
    `;
    btn.onclick = () => { currentSentenceIndex = idx; updateLessonScreen(); };
    sentenceChoices.appendChild(btn);
  });
}

// === Audio ===
listenBtn.onclick = () => {
  const data = getLessonData(currentLessonIndex + 1);
  const sen = data.sentences[currentSentenceIndex];
  const record = getLessonRecord(data.day);

  if(!("speechSynthesis" in window)) {
    statusEl.textContent = "브라우저에서 음성 지원이 안 됩니다.";
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(sen.english);
  u.lang = "en-US";
  u.rate = 0.75;
  u.onstart = () => statusEl.textContent = "🔊 재생 중...";
  u.onend = () => {
    statusEl.textContent = "✔️ 듣기 완료! 따라 말해보세요.";
    if(!record.listened.includes(currentSentenceIndex)) {
      record.listened.push(currentSentenceIndex);
      saveProgress();
      updateLessonScreen();
    }
  };
  window.speechSynthesis.speak(u);
};

// === Quiz Logic ===
function normalizeWord(w) { return w.toLowerCase().replace(/[.,?!]/g, ""); }
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
  if (words.includes("he")) d.push("She", "They");
  return d;
}

function shuffleArray(arr) {
  const c = [...arr];
  for(let i=c.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

function createQuiz(sen) {
  quizKoreanPrompt.textContent = sen.korean;
  const cw = sen.english.split(/\s+/);
  const cb = cw.map((w,i) => ({id:`c-${i}`, text:w}));
  const ad = createAutomaticDistractors(sen.english);
  const cd = sen.distractors || [];
  const uniq = [...new Set([...ad, ...cd])];
  const lowerCw = cw.map(w=>w.toLowerCase());
  const fd = uniq.filter(d => !lowerCw.includes(d.toLowerCase()));
  const db = shuffleArray(fd).slice(0,6).map((w,i)=>({id:`d-${i}`, text:w}));

  shuffledBlocks = shuffleArray([...cb, ...db]);
  selectedBlockIds = [];
  quizFeedback.textContent = "";
  quizFeedback.className = "quiz-feedback";
  renderQuiz();
}

function renderQuiz() {
  answerZone.innerHTML = "";
  wordBank.innerHTML = "";
  if(selectedBlockIds.length===0) answerZone.innerHTML = "<p class='answer-placeholder'>단어를 순서대로 누르세요.</p>";

  selectedBlockIds.forEach(id => {
    const b = shuffledBlocks.find(x=>x.id===id);
    const btn = document.createElement('button');
    btn.className = "word-block answer-block";
    btn.textContent = b.text;
    btn.onclick = () => { selectedBlockIds.splice(selectedBlockIds.indexOf(id), 1); renderQuiz(); };
    answerZone.appendChild(btn);
  });

  shuffledBlocks.forEach(b => {
    if(!selectedBlockIds.includes(b.id)) {
      const btn = document.createElement('button');
      btn.className = "word-block";
      btn.textContent = b.text;
      btn.onclick = () => { selectedBlockIds.push(b.id); renderQuiz(); };
      wordBank.appendChild(btn);
    }
  });
}

checkAnswerBtn.onclick = () => {
  const data = getLessonData(currentLessonIndex + 1);
  const sen = data.sentences[currentSentenceIndex];
  const record = getLessonRecord(data.day);
  const ans = selectedBlockIds.map(id => shuffledBlocks.find(x=>x.id===id).text).join(" ");

  if(selectedBlockIds.length===0) {
    quizFeedback.textContent = "단어를 선택하세요!";
    quizFeedback.className = "quiz-feedback incorrect";
    return;
  }

  if(ans === sen.english) {
    quizFeedback.textContent = "🎉 정답입니다!";
    quizFeedback.className = "quiz-feedback correct";
    answerHidden = false;
    updateAnswerVisibility();

    if(!record.solved.includes(currentSentenceIndex)) {
      record.solved.push(currentSentenceIndex);
      addStars(1); // Gamification!
      saveProgress();
      updateLessonScreen();
    }
  } else {
    quizFeedback.textContent = "오답입니다. 다시 시도해보세요.";
    quizFeedback.className = "quiz-feedback incorrect";
  }
};

resetQuizBtn.onclick = () => {
  createQuiz(getLessonData(currentLessonIndex + 1).sentences[currentSentenceIndex]);
};

// === Visibility ===
function updateAnswerVisibility() {
  lessonCard.classList.toggle("answer-hidden", answerHidden);
  toggleAnswerBtn.textContent = answerHidden ? "영어 정답 보기" : "영어 문장 가리기";
}
toggleAnswerBtn.onclick = () => {
  answerHidden = !answerHidden;
  updateAnswerVisibility();
};

// === Completion ===
function updateCompletionArea(data, record) {
  const totalSentences = data.sentences.length;
  const missingListen = totalSentences - record.listened.length;
  const missingQuiz = totalSentences - record.solved.length;
  const completed = progress.completedDays.includes(data.day);

  if(completed) {
    completionReqs.innerHTML = "✅ 이미 완료된 학습입니다. 자유롭게 복습하세요.";
    completeLessonBtn.disabled = true;
    completeLessonBtn.textContent = "학습 완료됨";
    completionMessage.textContent = "";
  } else {
    if(missingListen === 0 && missingQuiz === 0) {
      completionReqs.innerHTML = "🎉 모든 조건을 달성했습니다! 아래 버튼을 누르세요.";
      completeLessonBtn.disabled = false;
      completeLessonBtn.textContent = "학습 완료하기 🚀";
    } else {
      completionReqs.innerHTML = `아직 완료할 수 없습니다.<br> 남은 듣기: ${missingListen}개 | 남은 퀴즈: ${missingQuiz}개`;
      completeLessonBtn.disabled = true;
      completeLessonBtn.textContent = "조건을 모두 달성해주세요";
    }
  }
}

completeLessonBtn.onclick = () => {
  const day = currentLessonIndex + 1;
  if(!progress.completedDays.includes(day)) {
    progress.completedDays.push(day);
    addStars(10); // Bonus stars
    saveProgress();
    showConfetti();

    setTimeout(() => {
      if(day === 30) {
        if(COURSE_ID === "month1") {
          alert("1개월차를 모두 완료했습니다! 2개월차로 이동합니다.");
          window.location.href = "month2.html";
        } else {
          alert("2개월차 학습을 모두 완료했습니다! 훌륭합니다!");
          currentLessonIndex = 29;
          startLessonFlow();
        }
      } else {
        currentLessonIndex = day; // Next day
        startLessonFlow();
      }
    }, 2500);
  }
};

// Navigation
function updateNavigationButtons() {
  prevBtn.disabled = currentLessonIndex === 0;
  nextBtn.disabled = !progress.completedDays.includes(currentLessonIndex + 1) && (currentLessonIndex + 1 > getStartingLessonIndex());
}

prevBtn.onclick = () => { currentLessonIndex--; startLessonFlow(); };
nextBtn.onclick = () => { currentLessonIndex++; startLessonFlow(); };

// Boot
initApp();
