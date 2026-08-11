/* =========================================================
   APP.JS — CSC Professional: Exam Protocol (core engine)
   =========================================================
   This file contains ALL of the app's logic: state management,
   the quiz engine, sound effects, the narrator, confetti/fail
   effects, and every screen-rendering function. It does NOT
   contain any question data — that lives in separate files so
   individual exams can be edited without touching this file.

   LOAD ORDER MATTERS. This file expects the following globals
   to already exist by the time it runs (see the <script> tags
   at the bottom of the HTML file, which load these BEFORE
   app.js):
     - BANK              (from data/bank.js)
     - FINAL_BANK_RAW    (from data/final-exam.js)
     - MOCK_BANK_1 ... MOCK_BANK_9  (from data/mock-1.js ... mock-9.js)

   FILE MAP — where to make common changes:
     - Add/edit/remove a question in Exams 1-20  → data/bank.js
     - Add/edit/remove a question in the Final Exam → data/final-exam.js
     - Add/edit/remove a question in a Mock Exam  → data/mock-N.js
     - Change colors, fonts, spacing, animations   → styles.css
     - Change exam rules (timer length, pass %,
       number of lives, number of exams, etc.)     → the CONFIG
       constants right below this header
     - Change wording on buttons/screens            → search this
       file for the text you want to change (it's all in the
       render...() functions, in plain template strings)
   ========================================================= */


/* =========================================================
   QUESTION BANK
   ========================================================= */


/* =========================================================
   FINAL EXAM — comprehensive 170-item capstone assessment
   ========================================================= */

const CAT_MAP = {"Verbal":"verbal", "Numerical":"numerical", "General Information":"general", "Analytical":"analytical"};
const FINAL_HEARTS = 5;
/* =========================================================
   MOCK EXAMS 1-3 — supplemental full-length practice sets
   ========================================================= */

const MOCK_TITLES = {1:"Mock Exam 1", 2:"Mock Exam 2", 3:"Mock Exam 3", 4:"Mock Exam 4", 5:"Mock Exam 5", 6:"Mock Exam 6", 7:"Mock Exam 7", 8:"Mock Exam 8", 9:"Mock Exam 9"};
const MOCK_HEARTS = 4;

// Reassembles the 9 individually-loaded Mock Exam data files
// (data/mock-1.js ... data/mock-9.js, each defining a global
// MOCK_BANK_N) into the single lookup object the rest of the app
// uses. If you add a Mock Exam 10 later: create data/mock-10.js
// defining MOCK_BANK_10, add its <script src> in the HTML (before
// app.js), add "10: MOCK_BANK_10" below, and add its title to
// MOCK_TITLES above.
const MOCK_BANKS = {
  1: MOCK_BANK_1, 2: MOCK_BANK_2, 3: MOCK_BANK_3,
  4: MOCK_BANK_4, 5: MOCK_BANK_5, 6: MOCK_BANK_6,
  7: MOCK_BANK_7, 8: MOCK_BANK_8, 9: MOCK_BANK_9
};


const CATEGORY_LABELS = {numerical:"Numerical Ability", analytical:"Analytical Ability", verbal:"Verbal Ability", general:"General Information"};
const CATEGORY_ORDER = ["numerical","analytical","verbal","general"];
const TOTAL_EXAMS = 20;
const ITEMS_PER_EXAM = 20;
const ITEMS_PER_CATEGORY = 5;
const TIME_PER_Q = 45;
const PASS_THRESHOLD = 0.8;
const STORAGE_KEY = "csc_exam_protocol_progress_v1";

/* ---------- seeded RNG helpers ---------- */
// Seeded pseudo-random number generator (so shuffles are reproducible
// per seed instead of relying on Math.random()).
function mulberry32(seed){
  return function(){
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Fisher-Yates shuffle driven by mulberry32() above — used to randomize
// question order and answer-choice order differently on every attempt.
function seededShuffle(arr, seed){
  const rng = mulberry32(seed);
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(rng()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* ---------- exam builder ---------- */
// Builds the 20-question set for one of the leveled exams (Exam 1-20)
// by sampling data/bank.js and shuffling. examIndex is 0-based here
// (Exam 1 on the dashboard = examIndex 0).
function buildExam(examIndex){
  let pool = [];
  CATEGORY_ORDER.forEach(cat=>{
    const bank = BANK[cat];
    for(let i=0;i<ITEMS_PER_CATEGORY;i++){
      const idx = (examIndex*ITEMS_PER_CATEGORY + i) % bank.length;
      const src = bank[idx];
      pool.push({category:cat, question:src.q, options:src.o.slice(), correct:src.a, explanation:src.e});
    }
  });
  pool = seededShuffle(pool, examIndex*7 + 13);
  pool = pool.map((q, i)=>{
    const seed = examIndex*1000 + i*17 + 3;
    const order = seededShuffle(q.options.map((_,idx)=>idx), seed);
    const newOptions = order.map(idx=>q.options[idx]);
    const newCorrect = order.indexOf(q.correct);
    return {category:q.category, question:q.question, options:newOptions, correct:newCorrect, explanation:q.explanation};
  });
  return pool;
}

// Builds the full 170-question Final Exam from data/final-exam.js,
// with a fresh shuffle of question order and answer choices every attempt.
function buildFinalExam(){
  let pool = FINAL_BANK_RAW.map(item=>({
    category: CAT_MAP[item.cat] || "general",
    question: item.q,
    options: item.opts.slice(),
    correct: item.correct,
    explanation: item.exp
  }));
  const seed = Math.floor(Math.random()*1000000) + 1;
  pool = seededShuffle(pool, seed);
  pool = pool.map((q, i)=>{
    const s = seed + i*17 + 5;
    const order = seededShuffle(q.options.map((_,idx)=>idx), s);
    const newOptions = order.map(idx=>q.options[idx]);
    const newCorrect = order.indexOf(q.correct);
    return {category:q.category, question:q.question, options:newOptions, correct:newCorrect, explanation:q.explanation};
  });
  return pool;
}

// Builds a specific Mock Exam's full question set from its
// data/mock-N.js array (MOCK_BANKS[mockId]), shuffled fresh every attempt.
function buildMockExam(mockId){
  let pool = MOCK_BANKS[mockId].map(item=>({
    category: item.cat,
    question: item.q,
    options: item.opts.slice(),
    correct: item.correct,
    explanation: item.exp
  }));
  const seed = Math.floor(Math.random()*1000000) + 1;
  pool = seededShuffle(pool, seed);
  pool = pool.map((q, i)=>{
    const s = seed + i*17 + 5;
    const order = seededShuffle(q.options.map((_,idx)=>idx), s);
    const newOptions = order.map(idx=>q.options[idx]);
    const newCorrect = order.indexOf(q.correct);
    return {category:q.category, question:q.question, options:newOptions, correct:newCorrect, explanation:q.explanation};
  });
  return pool;
}

/* =========================================================
   STATE & PERSISTENCE
   ========================================================= */
let progress = loadProgress();
let state = {view:"dashboard"};

// Returns a blank progress object for a first-time user
// (used when localStorage has no saved data yet).
function defaultProgress(){
  return {unlockedUpTo:1, scores:{}, finalScore:null, mockScores:{}}; // scores: {1:{percent, stars}}
}
// Reads saved progress from localStorage, falling back to
// defaultProgress() if there's nothing saved or the data is corrupt.
function loadProgress(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultProgress();
    const p = JSON.parse(raw);
    if(!p.unlockedUpTo) p.unlockedUpTo = 1;
    if(!p.scores) p.scores = {};
    if(p.finalScore === undefined) p.finalScore = null;
    if(!p.mockScores) p.mockScores = {};
    return p;
  }catch(e){ return defaultProgress(); }
}
// Writes the current in-memory `progress` object back to localStorage.
// Call this any time `progress` changes and the change should persist.
// Wrapped in try/catch: localStorage can throw (quota exceeded, private
// browsing mode, or storage disabled entirely by device policy on some
// Android WebViews) — without this, an uncaught exception here would
// silently break whatever quiz action triggered the save.
function saveProgress(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }catch(e){
    // Progress just won't persist this run — the app keeps working
    // in-memory for the current session either way.
  }
}

/* =========================================================
   ICONS
   ========================================================= */
const ICON_LOCK = `<svg class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`;
const ICON_GO = `<svg class="go-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;
// Returns the SVG markup for one heart icon — filled (red) if the life
// is still available, or an empty outline if it's been lost.
function heartIcon(filled){
  return `<svg class="heart" viewBox="0 0 24 24" fill="${filled ? 'var(--red)' : 'none'}" stroke="${filled ? 'var(--red)' : 'var(--border)'}" stroke-width="2"><path d="M12 21s-6.7-4.35-9.3-8.28C1.02 10.4 1.6 6.9 4.6 5.4c2.1-1.05 4.4-.4 5.9 1.4l1.5 1.8 1.5-1.8c1.5-1.8 3.8-2.45 5.9-1.4 3 1.5 3.58 5 1.9 7.32C18.7 16.65 12 21 12 21z"/></svg>`;
}
// Builds the full row of heart icons for the current quiz's life count
// (quiz.hearts out of quiz.maxHearts).
function buildHeartsHtml(){
  let h = "";
  for(let i=0;i<quiz.maxHearts;i++) h += heartIcon(i < quiz.hearts);
  return h;
}

/* =========================================================
   SOUND ENGINE (synthesized — no external audio files)
   ========================================================= */
let audioCtx = null;
// Lazily creates (or reuses) the browser's AudioContext. Every
// synthesized sound effect in this file goes through this.
function getAudioCtx(){
  if(!audioCtx){
    try{ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){ return null; }
  }
  if(audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
// Low-level helper that schedules a single oscillator tone.
// Every playXxx() sound effect below is built from one or more calls
// to this function with different pitches/timings.
function tone(freq, startTime, duration, type, gainPeak, ctx){
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || "sine";
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(gainPeak || 0.18, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}
// Correct-answer chime (short two-note rise).
function playCorrect(){
  const ctx = getAudioCtx(); if(!ctx) return;
  const t = ctx.currentTime;
  tone(880, t, 0.14, "triangle", 0.16, ctx);
  tone(1318.5, t + 0.09, 0.18, "triangle", 0.14, ctx);
}
// Wrong-answer / timeout buzz (short two-note descent).
function playWrong(){
  const ctx = getAudioCtx(); if(!ctx) return;
  const t = ctx.currentTime;
  tone(220, t, 0.18, "sawtooth", 0.14, ctx);
  tone(164.8, t + 0.1, 0.22, "sawtooth", 0.12, ctx);
}
// Ascending 4-note arpeggio played when an exam is passed.
function playPass(){
  const ctx = getAudioCtx(); if(!ctx) return;
  const t = ctx.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i)=> tone(f, t + i*0.12, 0.3, "triangle", 0.15, ctx));
}
// Descending 4-note tone played when an exam is failed.
function playFail(){
  const ctx = getAudioCtx(); if(!ctx) return;
  const t = ctx.currentTime;
  [392, 349.2, 293.7, 246.9].forEach((f, i)=> tone(f, t + i*0.14, 0.32, "sawtooth", 0.13, ctx));
}
// Small clap sound played on every correct answer.
function playClap(){
  const ctx = getAudioCtx(); if(!ctx) return;
  const t = ctx.currentTime;
  for(let i=0;i<3;i++){
    const start = t + i*0.09;
    const bufferSize = Math.floor(ctx.sampleRate * 0.05);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let j=0;j<bufferSize;j++){ data[j] = (Math.random()*2-1) * Math.pow(1 - j/bufferSize, 2); }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200 + Math.random()*900;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.32, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(start);
    noise.stop(start + 0.16);
  }
}
// Bigger crowd-applause burst played at 10-correct-in-a-row streak
// milestones (and every +10 after that).
function playBigClap(){
  const ctx = getAudioCtx(); if(!ctx) return;
  const t = ctx.currentTime;
  for(let i=0;i<9;i++){
    const start = t + i*0.07 + Math.random()*0.02;
    const bufferSize = Math.floor(ctx.sampleRate * 0.06);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let j=0;j<bufferSize;j++){ data[j] = (Math.random()*2-1) * Math.pow(1 - j/bufferSize, 1.5); }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1000 + Math.random()*1300;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(start);
    noise.stop(start + 0.2);
  }
}
// Soft ascending chime played when lives are restored after hitting
// a 3-correct-answer streak.
function playHeal(){
  const ctx = getAudioCtx(); if(!ctx) return;
  const t = ctx.currentTime;
  tone(660, t, 0.18, "sine", 0.14, ctx);
  tone(880, t + 0.12, 0.22, "sine", 0.14, ctx);
  tone(1108.73, t + 0.24, 0.3, "sine", 0.13, ctx);
}
// Two-beep alert tone played after 2 consecutive wrong answers.
function playWarningTone(){
  const ctx = getAudioCtx(); if(!ctx) return;
  const t = ctx.currentTime;
  tone(600, t, 0.15, "square", 0.12, ctx);
  tone(600, t + 0.22, 0.15, "square", 0.12, ctx);
}
// Whoosh sound played when swiping/transitioning to the next question.
function playSwipe(){
  const ctx = getAudioCtx(); if(!ctx) return;
  const t = ctx.currentTime;
  const dur = 0.44;
  const bufferSize = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++){ data[i] = Math.random()*2 - 1; }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 0.7;
  filter.frequency.setValueAtTime(280, t);
  filter.frequency.exponentialRampToValueAtTime(3400, t + dur*0.42);
  filter.frequency.exponentialRampToValueAtTime(200, t + dur);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.22, t + dur*0.3);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(t);
  noise.stop(t + dur + 0.02);
}

/* =========================================================
   NARRATOR & VOICE LINES (Web Speech API)
   ========================================================= */
let narratorEnabled = true;
let cachedVoices = [];
if(typeof window !== "undefined" && "speechSynthesis" in window){
  const loadVoices = ()=>{ cachedVoices = window.speechSynthesis.getVoices(); };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}
// Picks the best available female-sounding voice from the browser's
// installed speech synthesis voices (best-effort — voice availability
// varies a lot by device/browser).
function pickFemaleVoice(){
  if(!cachedVoices.length && "speechSynthesis" in window) cachedVoices = window.speechSynthesis.getVoices();
  const preferred = ["female","zira","samantha","victoria","susan","karen","moira","tessa","fiona","google us english","google uk english female","joanna","salli"];
  let v = cachedVoices.find(v => preferred.some(name => v.name.toLowerCase().includes(name)));
  if(!v) v = cachedVoices.find(v => v.lang && v.lang.toLowerCase().startsWith("en"));
  return v || cachedVoices[0] || null;
}
// Speaks a line of text aloud via the Web Speech API, respecting the
// narrator on/off toggle (narratorEnabled). Does nothing if narration
// is off or the browser has no speech synthesis support.
function speak(text, rate){
  if(!narratorEnabled) return;
  if(typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try{
    const u = new SpeechSynthesisUtterance(text);
    const v = pickFemaleVoice();
    if(v) u.voice = v;
    u.rate = rate || 1;
    u.pitch = 1.05;
    u.volume = 1;
    window.speechSynthesis.speak(u);
  }catch(e){
    // No TTS engine available on this device, or speechSynthesis
    // misbehaving — narration just silently doesn't happen this time.
  }
}
// Immediately stops any speech currently being narrated.
function cancelSpeech(){
  if(typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}
// Cleans text before narration — e.g. converts runs of underscores
// ("___") into the spoken word "blank" instead of being read literally.
function sanitizeForSpeech(text){
  return text.replace(/_+/g, " blank ").replace(/\s{2,}/g, " ");
}
// Reads the current question and its answer choices aloud. For
// reading-comprehension questions, skips re-reading a passage that
// was already narrated earlier in the same attempt (tracked in
// quiz.narratedPassages).
function narrateQuestion(q){
  if(!narratorEnabled || !q) return;
  cancelSpeech();
  const letters = ["A","B","C","D"];
  let questionPart = q.question;
  const passageMatch = q.question.match(/^Passage:\s*"([\s\S]*?)"\s*([\s\S]*)$/);
  if(passageMatch){
    const passageText = passageMatch[1];
    const restText = passageMatch[2];
    if(quiz && quiz.narratedPassages){
      if(quiz.narratedPassages.has(passageText)){
        questionPart = restText;
      }else{
        quiz.narratedPassages.add(passageText);
      }
    }
  }
  let text = questionPart + ". ";
  q.options.forEach((opt, i)=> text += `Option ${letters[i]}: ${opt}. `);
  speak(sanitizeForSpeech(text), 0.98);
}
// Turns the narrator on/off via the 🔊/🔇 HUD button.
function toggleNarrator(){
  narratorEnabled = !narratorEnabled;
  const btn = document.getElementById("narratorBtn");
  if(btn) btn.textContent = narratorEnabled ? "🔊" : "🔇";
  if(!narratorEnabled) cancelSpeech();
  else if(quiz) narrateQuestion(quiz.questions[quiz.qIndex]);
}
// Speaks "Correct!" plus a bonus phrase at combo milestones
// (3 = "Good job!", 5 = "Amazing!", 10+ = "Fantastic!").
function speakCorrectLine(combo){
  let phrase = "Correct!";
  if(combo === 3) phrase = "Correct! Good job!";
  else if(combo === 5) phrase = "Correct! Amazing!";
  else if(combo >= 10 && combo % 10 === 0) phrase = "Correct! Fantastic!";
  speak(phrase, 1.05);
}
// Fires the two-wrong-in-a-row warning: tone + toast + spoken line.
function triggerWarning(){
  playWarningTone();
  speak("Careful — two wrong in a row!", 1);
  showWarningToast();
}
// Displays the red "Careful — two wrong in a row!" toast banner.
function showWarningToast(){
  const body = document.querySelector(".quiz-body");
  if(!body) return;
  const toast = document.createElement("div");
  toast.className = "warning-toast";
  toast.innerHTML = `⚠ <span>Careful — two wrong in a row!</span>`;
  body.prepend(toast);
  requestAnimationFrame(()=> toast.classList.add("show"));
  setTimeout(()=>{
    toast.classList.remove("show");
    setTimeout(()=> toast.remove(), 300);
  }, 2200);
}
// Displays the green "lives restored" toast banner.
function showLifeRestoredToast(){
  const body = document.querySelector(".quiz-body");
  if(!body) return;
  const toast = document.createElement("div");
  toast.className = "life-toast";
  toast.innerHTML = `❤️ <span>3 in a row — lives restored!</span>`;
  body.prepend(toast);
  requestAnimationFrame(()=> toast.classList.add("show"));
  setTimeout(()=>{
    toast.classList.remove("show");
    setTimeout(()=> toast.remove(), 300);
  }, 2200);
}
// Refills hearts to full when a 3-correct-answer streak is reached.
// No-ops (silently) if hearts are already at max, so it won't spam
// sound/toast on longer streaks.
function restoreLivesIfEligible(){
  if(!quiz || quiz.hearts >= quiz.maxHearts) return;
  quiz.hearts = quiz.maxHearts;
  playHeal();
  const wrap = document.getElementById("heartsWrap");
  if(wrap){
    wrap.innerHTML = buildHeartsHtml();
    wrap.classList.add("heal-pulse");
    setTimeout(()=> wrap.classList.remove("heal-pulse"), 700);
  }
  showLifeRestoredToast();
  speak("Lives restored!", 1.05);
}

/* =========================================================
   CONFETTI ENGINE (canvas-based)
   ========================================================= */
// Canvas-based confetti burst shown when an exam is passed.
// `intensity` controls the particle count.
function fireConfetti(intensity){
  intensity = intensity || 90;
  let canvas = document.getElementById("confettiCanvas");
  if(canvas) canvas.remove();
  canvas = document.createElement("canvas");
  canvas.id = "confettiCanvas";
  document.body.appendChild(canvas);
  const rect = document.getElementById("app").getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  if(!ctx){ canvas.remove(); return; }
  const colors = ["#7C6CF0", "#12e0a0", "#ffb020", "#ff4d6d", "#f5f2ff"];
  const pieces = [];
  for(let i=0;i<intensity;i++){
    pieces.push({
      x: Math.random()*canvas.width,
      y: -20 - Math.random()*canvas.height*0.5,
      w: 5 + Math.random()*5,
      h: 8 + Math.random()*6,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*360,
      rotSpeed: (Math.random()-0.5)*10,
      vy: 2 + Math.random()*3,
      vx: (Math.random()-0.5)*2.2,
      tilt: Math.random()*Math.PI
    });
  }
  let frame = 0;
  const maxFrames = 260;
  function draw(){
    frame++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    if(frame < maxFrames){
      requestAnimationFrame(draw);
    }else{
      canvas.remove();
    }
  }
  draw();
}

// Canvas-based "shatter" particle burst shown when an exam is failed
// (pairs with the FLUNKED/FAILED stamp's crack animation in CSS).
function fireFailEffect(){
  let canvas = document.getElementById("confettiCanvas");
  if(canvas) canvas.remove();
  canvas = document.createElement("canvas");
  canvas.id = "confettiCanvas";
  document.body.appendChild(canvas);
  const rect = document.getElementById("app").getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  if(!ctx){ canvas.remove(); return; }
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.32;
  const shardColors = ["#ff4d6d", "#c22a44", "#e9edf7", "#5b6690"];
  const shards = [];
  for(let i=0;i<42;i++){
    const angle = Math.random()*Math.PI*2;
    const speed = 2.5 + Math.random()*5;
    shards.push({
      x: cx, y: cy,
      w: 3 + Math.random()*5,
      h: 10 + Math.random()*20,
      color: shardColors[Math.floor(Math.random()*shardColors.length)],
      rot: Math.random()*360,
      rotSpeed: (Math.random()-0.5)*16,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed*0.6 - 1,
      gravity: 0.22 + Math.random()*0.08
    });
  }
  let frame = 0;
  const maxFrames = 90;
  function draw(){
    frame++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const fade = Math.max(0, 1 - frame/maxFrames);
    shards.forEach(p=>{
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    if(frame < maxFrames){
      requestAnimationFrame(draw);
    }else{
      canvas.remove();
    }
  }
  draw();
}

/* =========================================================
   RENDER: DASHBOARD
   ========================================================= */
// Renders the home/dashboard screen: header, stats strip, the 20
// leveled exams, Mock Exams section, and the Final Exam row —
// each gated/unlocked based on the current `progress` state.
function renderDashboard(){
  const app = document.getElementById("app");
  const totalStars = Object.values(progress.scores).reduce((s,v)=>s+(v.stars||0),0);
  const passedCount = Object.values(progress.scores).filter(v=>v.percent>=PASS_THRESHOLD*100).length;

  let rows = "";
  for(let i=1;i<=TOTAL_EXAMS;i++){
    const unlocked = i <= progress.unlockedUpTo;
    const record = progress.scores[i];
    const passed = record && record.percent >= PASS_THRESHOLD*100;
    const isCurrentTarget = unlocked && !passed;
    let cls = "ledger-row " + (unlocked ? "unlocked" : "locked");
    if(passed) cls += " passed";
    else if(isCurrentTarget) cls += " current";

    rows += `
      <div class="${cls}" data-exam="${i}" ${unlocked ? `onclick="startExam(${i})"` : ""}>
        ${passed ? `<div class="passed-tag">PASSED</div>` : ""}
        <div class="stamp"><span class="stamp-num">${i}</span></div>
        <div class="ledger-info">
          <div class="lvl">Exam ${i}: Level ${i}</div>
          <div class="meta">${ITEMS_PER_EXAM} items · ${TIME_PER_Q}s per item · 3 lives</div>
          ${record ? `<div class="best">Best score: ${record.percent}% ${passed ? "· Eligible" : ""}</div>` : ""}
        </div>
        ${unlocked ? ICON_GO : ICON_LOCK}
      </div>`;
  }

  const exam20Passed = progress.scores[TOTAL_EXAMS] && progress.scores[TOTAL_EXAMS].percent >= PASS_THRESHOLD*100;
  const MOCK_IDS = Object.keys(MOCK_BANKS).map(Number).sort((a,b)=>a-b);
  const LAST_MOCK_ID = MOCK_IDS[MOCK_IDS.length - 1];

  let mockRows = "";
  let prevMockPassed = exam20Passed;
  MOCK_IDS.forEach(id=>{
    const record = progress.mockScores[id];
    const passed = record && record.percent >= PASS_THRESHOLD*100;
    const unlocked = prevMockPassed;
    let cls = "ledger-row final-row " + (unlocked ? "unlocked" : "locked");
    if(passed) cls += " passed";
    const lockNote = id === MOCK_IDS[0] ? "Unlocks after passing Exam 20" : `Unlocks after passing ${MOCK_TITLES[id-1]}`;
    mockRows += `
      <div class="${cls}" ${unlocked ? `onclick="startMockExam(${id})"` : ""}>
        ${passed ? `<div class="passed-tag">PASSED</div>` : ""}
        <div class="stamp"><span class="stamp-num">M${id}</span></div>
        <div class="ledger-info">
          <div class="lvl">${MOCK_TITLES[id]}</div>
          <div class="meta">${MOCK_BANKS[id].length} items · ${TIME_PER_Q}s per item · ${MOCK_HEARTS} lives</div>
          ${record ? `<div class="best">Best score: ${record.percent}% ${passed ? "· Eligible" : ""}</div>` : `<div class="meta">${unlocked ? "Unlocked — practice anytime." : lockNote}</div>`}
        </div>
        ${unlocked ? ICON_GO : ICON_LOCK}
      </div>`;
    prevMockPassed = passed;
  });
  const mockSection = `<div class="ledger-divider">Mock Exams</div>${mockRows}`;

  const lastMockPassed = progress.mockScores[LAST_MOCK_ID] && progress.mockScores[LAST_MOCK_ID].percent >= PASS_THRESHOLD*100;
  const finalUnlocked = lastMockPassed;
  const finalPassed = progress.finalScore && progress.finalScore.percent >= PASS_THRESHOLD*100;
  let finalCls = "ledger-row final-row " + (finalUnlocked ? "unlocked" : "locked");
  if(finalPassed) finalCls += " passed";
  const finalRow = `
    <div class="ledger-divider">Capstone Assessment</div>
    <div class="${finalCls}" ${finalUnlocked ? `onclick="startFinalExam()"` : ""}>
      ${finalPassed ? `<div class="passed-tag">PASSED</div>` : ""}
      <div class="stamp"><span class="stamp-num">★</span></div>
      <div class="ledger-info">
        <div class="lvl">Final Exam: Comprehensive Assessment</div>
        <div class="meta">${FINAL_BANK_RAW.length} items · ${TIME_PER_Q}s per item · ${FINAL_HEARTS} lives</div>
        ${progress.finalScore ? `<div class="best">Best score: ${progress.finalScore.percent}% ${finalPassed ? "· Eligible" : ""}</div>` : `<div class="meta">${finalUnlocked ? "Unlocked — every topic, one exam." : `Unlocks after passing ${MOCK_TITLES[LAST_MOCK_ID]}`}</div>`}
      </div>
      ${finalUnlocked ? ICON_GO : ICON_LOCK}
    </div>`;

  app.innerHTML = `
    <div class="screen">
      <div class="dash-header">
        <div class="dash-eyebrow">Republic of the Philippines · CSC Prep</div>
        <h1 class="dash-title">Exam <span>Protocol</span></h1>
        <div class="dash-sub">20 sequential mock exams. Score 80% or higher to unlock the next level. Three lives per attempt — good luck.</div>
      </div>
      <div class="stats-strip">
        <div class="stat-chip"><div class="num mono">${progress.unlockedUpTo}/20</div><div class="lbl">Unlocked</div></div>
        <div class="stat-chip"><div class="num mono">${passedCount}</div><div class="lbl">Passed</div></div>
        <div class="stat-chip"><div class="num mono">${totalStars}</div><div class="lbl">Stars</div></div>
      </div>
      <div class="ledger">${rows}${mockSection}${finalRow}</div>
    </div>
  `;
}

/* =========================================================
   QUIZ LOGIC
   ========================================================= */
let quiz = null; // {examIndex, questions, qIndex, hearts, score, combo, maxCombo, catStats, answered, timer, timeLeft}

// Initializes quiz state and starts one of the 20 leveled exams.
// examIndex here is 1-based (matches the exam number shown on screen).
function startExam(examIndex){
  quiz = {
    examIndex,
    questions: buildExam(examIndex-1),
    qIndex: 0,
    hearts: 3,
    maxHearts: 3,
    score: 0,
    combo: 0,
    maxCombo: 0,
    wrongStreak: 0,
    narratedPassages: new Set(),
    catStats: {numerical:{c:0,t:0}, analytical:{c:0,t:0}, verbal:{c:0,t:0}, general:{c:0,t:0}},
    answered: false,
    timeLeft: TIME_PER_Q,
    timerHandle: null
  };
  renderQuiz();
}

// Initializes quiz state and starts the Final Exam.
function startFinalExam(){
  quiz = {
    examIndex: "final",
    questions: buildFinalExam(),
    qIndex: 0,
    hearts: FINAL_HEARTS,
    maxHearts: FINAL_HEARTS,
    score: 0,
    combo: 0,
    maxCombo: 0,
    wrongStreak: 0,
    narratedPassages: new Set(),
    catStats: {numerical:{c:0,t:0}, analytical:{c:0,t:0}, verbal:{c:0,t:0}, general:{c:0,t:0}},
    answered: false,
    timeLeft: TIME_PER_Q,
    timerHandle: null
  };
  renderQuiz();
}

// Initializes quiz state and starts a specific Mock Exam (1-9).
function startMockExam(mockId){
  quiz = {
    examIndex: "mock" + mockId,
    mockId,
    questions: buildMockExam(mockId),
    qIndex: 0,
    hearts: MOCK_HEARTS,
    maxHearts: MOCK_HEARTS,
    score: 0,
    combo: 0,
    maxCombo: 0,
    wrongStreak: 0,
    narratedPassages: new Set(),
    catStats: {numerical:{c:0,t:0}, analytical:{c:0,t:0}, verbal:{c:0,t:0}, general:{c:0,t:0}},
    answered: false,
    timeLeft: TIME_PER_Q,
    timerHandle: null
  };
  renderQuiz();
}

// Returns a human-readable label for whichever exam is currently
// active — e.g. "Exam 5", "Mock Exam 3", "the Final Exam" — used in
// game-over/retry button text.
function examLabel(){
  if(quiz.examIndex === "final") return "the Final Exam";
  if(quiz.mockId) return MOCK_TITLES[quiz.mockId];
  return `Exam ${quiz.examIndex}`;
}
// Restarts whichever exam type is currently active (leveled / mock /
// final), routing to the right start function.
function retryCurrentExam(){
  if(quiz.examIndex === "final") startFinalExam();
  else if(quiz.mockId) startMockExam(quiz.mockId);
  else startExam(quiz.examIndex);
}

// Renders the current question screen: HUD (hearts, combo, timer),
// the question card, and answer options. Called for every new question.
function renderQuiz(){
  const app = document.getElementById("app");
  const q = quiz.questions[quiz.qIndex];

  let dots = "";
  if(quiz.questions.length > 40){
    const donePct = Math.round((quiz.qIndex / quiz.questions.length) * 100);
    dots = `<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${donePct}%"></div></div>`;
  }else{
    for(let i=0;i<quiz.questions.length;i++){
      let dcls = "dot";
      if(i < quiz.qIndex) dcls += quiz.questions[i]._wrong ? " wrong" : " done";
      dots += `<div class="${dcls}"></div>`;
    }
    dots = `<div class="progress-dots">${dots}</div>`;
  }

  const heartsHtml = buildHeartsHtml();

  let optionsHtml = "";
  q.options.forEach((opt, idx)=>{
    optionsHtml += `<button class="option" data-idx="${idx}" onclick="selectAnswer(${idx})">
      <span class="letter">${String.fromCharCode(65+idx)}</span><span>${opt}</span>
    </button>`;
  });

  const totalChars = q.question.length + q.options.reduce((s,o)=>s+o.length, 0);
  const isCompact = totalChars > 260 || q.options.length > 4;
  const cardClass = "q-card slide-in-right" + (isCompact ? " compact" : "");

  app.innerHTML = `
    <div class="screen">
      <div class="quiz-hud">
        <div class="hud-top">
          <div class="hud-left">
            <button class="exit-btn" onclick="confirmExit()">EXIT</button>
            <button class="narrator-btn" id="narratorBtn" onclick="toggleNarrator()">${narratorEnabled ? "🔊" : "🔇"}</button>
          </div>
          <div class="hearts" id="heartsWrap">${heartsHtml}</div>
          <div class="combo-chip" id="comboChip">🔥 x<span id="comboVal">${quiz.combo}</span></div>
        </div>
        ${dots}
        <div class="timer-track"><div class="timer-fill" id="timerFill"></div></div>
      </div>
      <div class="quiz-body">
        <div class="${cardClass}" id="qCard">
          <div class="q-eyebrow">${CATEGORY_LABELS[q.category]} · Item ${quiz.qIndex+1} of ${quiz.questions.length}</div>
          <div class="q-text">${q.question}</div>
          <div class="options" id="optionsWrap">${optionsHtml}</div>
        </div>
      </div>
      <div class="rationale" id="rationale">
        <div class="rationale-head">
          <span class="rationale-badge" id="rBadge"></span>
        </div>
        <div class="rationale-title">Rationale</div>
        <div class="rationale-text" id="rText"></div>
        <button class="btn btn-primary next-btn" onclick="nextQuestion()" id="nextBtn">Next</button>
      </div>
    </div>
  `;

  if(quiz.combo > 0) document.getElementById("comboChip").classList.add("show");
  quiz.answered = false;
  startTimer();
  setTimeout(()=> narrateQuestion(q), 250);
}

// Starts the 45-second per-question countdown timer.
function startTimer(){
  clearInterval(quiz.timerHandle);
  quiz.timeLeft = TIME_PER_Q;
  updateTimerBar();
  quiz.timerHandle = setInterval(()=>{
    quiz.timeLeft--;
    updateTimerBar();
    if(quiz.timeLeft <= 0){
      clearInterval(quiz.timerHandle);
      if(!quiz.answered) handleTimeout();
    }
  }, 1000);
}

// Updates the visual timer bar's width and color (green → gold → red)
// each second as time runs down.
function updateTimerBar(){
  const fill = document.getElementById("timerFill");
  if(!fill) return;
  const pct = Math.max(0, (quiz.timeLeft / TIME_PER_Q) * 100);
  fill.style.width = pct + "%";
  fill.classList.remove("warn","danger");
  if(quiz.timeLeft <= 10) fill.classList.add("danger");
  else if(quiz.timeLeft <= 20) fill.classList.add("warn");
}

// Handles what happens when the per-question timer reaches zero —
// counts as a wrong answer, costs a life, and shows the rationale.
function handleTimeout(){
  quiz.answered = true;
  cancelSpeech();
  playWrong();
  const q = quiz.questions[quiz.qIndex];
  q._wrong = true;
  quiz.combo = 0;
  quiz.hearts--;
  quiz.wrongStreak = (quiz.wrongStreak || 0) + 1;
  quiz.catStats[q.category].t++;
  revealAnswer(-1);
  document.getElementById("qCard").classList.add("shake");
  animateHeartLoss();
  showRationalePanel(false);
  setTimeout(()=> speak("Wrong.", 1), 200);
  if(quiz.wrongStreak === 2) setTimeout(()=> triggerWarning(), 400);
  if(quiz.hearts <= 0){
    setTimeout(()=> triggerGameOver(), 900);
  }
}

// Handles the user tapping an answer choice: scoring, sound effects,
// streak/combo tracking, life gain/loss, and showing the rationale panel.
// `idx` is the index of the option that was tapped.
function selectAnswer(idx){
  if(quiz.answered) return;
  quiz.answered = true;
  clearInterval(quiz.timerHandle);
  cancelSpeech();
  const q = quiz.questions[quiz.qIndex];
  const correct = idx === q.correct;
  quiz.catStats[q.category].t++;

  if(correct){
    playCorrect();
    playClap();
    quiz.catStats[q.category].c++;
    quiz.combo++;
    quiz.wrongStreak = 0;
    quiz.maxCombo = Math.max(quiz.maxCombo, quiz.combo);
    const multiplier = 1 + Math.floor(quiz.combo/3)*0.5;
    quiz.score += Math.round(10 * multiplier);
    document.getElementById("qCard").classList.add("flash-green");
    const chip = document.getElementById("comboChip");
    chip.classList.add("show","pop");
    document.getElementById("comboVal").textContent = quiz.combo;
    setTimeout(()=>chip.classList.remove("pop"), 350);
    setTimeout(()=> speakCorrectLine(quiz.combo), 200);
    if(quiz.combo === 10 || (quiz.combo > 10 && quiz.combo % 10 === 0)){
      setTimeout(()=> playBigClap(), 150);
    }
    if(quiz.combo === 3){
      setTimeout(()=> restoreLivesIfEligible(), 500);
    }
  }else{
    playWrong();
    q._wrong = true;
    quiz.combo = 0;
    quiz.hearts--;
    quiz.wrongStreak = (quiz.wrongStreak || 0) + 1;
    document.getElementById("qCard").classList.add("shake");
    animateHeartLoss();
    setTimeout(()=> speak("Wrong.", 1), 200);
  }

  revealAnswer(idx);
  showRationalePanel(correct);

  if(!correct && quiz.wrongStreak === 2) setTimeout(()=> triggerWarning(), 400);
  if(!correct && quiz.hearts <= 0){
    setTimeout(()=> triggerGameOver(), 900);
  }
}

// Plays the heart-lost pop animation on the HUD when a life is lost.
function animateHeartLoss(){
  const hearts = document.querySelectorAll(".heart");
  const idx = quiz.hearts; // the heart that just got lost (0-indexed from the right side conceptually)
  if(hearts[idx]) hearts[idx].classList.add("lost");
}

// Highlights the correct answer (and the wrong one picked, if any)
// after the user answers or the timer runs out.
function revealAnswer(selectedIdx){
  const q = quiz.questions[quiz.qIndex];
  const opts = document.querySelectorAll("#optionsWrap .option");
  opts.forEach((el, idx)=>{
    el.classList.add("disabled");
    if(idx === q.correct) el.classList.add("correct");
    else if(idx === selectedIdx) el.classList.add("wrong");
    else el.classList.add("dim");
  });
}

// Slides up the explanation panel after answering, with the
// correct/incorrect badge and the question's explanation text.
function showRationalePanel(correct){
  const q = quiz.questions[quiz.qIndex];
  const badge = document.getElementById("rBadge");
  badge.textContent = correct ? "✓ CORRECT" : (quiz.answered && quiz.timeLeft <= 0 ? "⏱ TIME'S UP" : "✕ INCORRECT");
  badge.className = "rationale-badge " + (correct ? "correct" : "wrong");
  document.getElementById("rText").textContent = q.explanation;
  const isLast = quiz.qIndex === quiz.questions.length - 1;
  document.getElementById("nextBtn").textContent = isLast ? "See Results" : "Next";
  setTimeout(()=> document.getElementById("rationale").classList.add("show"), 150);
}

// Advances to the next question (with the swipe-out/swipe-in
// transition), or calls endExam() if that was the last question.
function nextQuestion(){
  document.getElementById("rationale").classList.remove("show");
  if(quiz.hearts <= 0) return; // game over already handling
  const outgoingCard = document.getElementById("qCard");
  if(outgoingCard) outgoingCard.classList.add("slide-out-left");
  playSwipe();
  quiz.qIndex++;
  if(quiz.qIndex >= quiz.questions.length){
    endExam();
  }else{
    setTimeout(renderQuiz, 400);
  }
}

// Confirms and handles exiting an exam mid-attempt, returning to
// the dashboard without saving that attempt's progress.
function confirmExit(){
  clearInterval(quiz.timerHandle);
  cancelSpeech();
  if(confirm("Exit this exam? Your progress on this attempt will be lost.")){
    quiz = null;
    renderDashboard();
  }else{
    startTimer();
  }
}

/* =========================================================
   GAME OVER / RESULTS
   ========================================================= */
// Renders the "FLUNKED" screen shown when all lives are lost
// before finishing the exam.
function triggerGameOver(){
  clearInterval(quiz.timerHandle);
  cancelSpeech();
  playFail();
  const app = document.getElementById("app");
  const answeredCount = quiz.qIndex + 1;

  app.innerHTML = `
    <div class="result-screen shake-fail">
      <div class="stamp-big fail">FLUNKED</div>
      <h2 style="font-size:19px; margin-bottom:6px;">Out of Lives</h2>
      <div class="result-sub">You lost all ${quiz.maxHearts} lives on ${examLabel()} after ${answeredCount} of ${quiz.questions.length} items. Review the topics below and try again.</div>
      <div class="breakdown">${renderBreakdown()}</div>
      <div class="result-actions">
        <button class="btn btn-primary" onclick="retryCurrentExam()">Retry ${examLabel()}</button>
        <button class="btn btn-ghost" onclick="backToDashboard()">Back to Dashboard</button>
      </div>
    </div>
  `;
  fireFailEffect();
}

// Called when the last question has been answered. Computes the
// final score, updates `progress` (best score, unlocks), saves it,
// and renders the results screen.
function endExam(){
  const totalItems = quiz.questions.length;
  const correctCount = Object.values(quiz.catStats).reduce((s,v)=>s+v.c,0);
  const percent = Math.round((correctCount/totalItems)*100);
  const passed = percent >= PASS_THRESHOLD*100;
  const stars = percent >= 95 ? 3 : percent >= 80 ? 2 : percent >= 50 ? 1 : 0;

  if(quiz.examIndex === "final"){
    if(!progress.finalScore || percent > progress.finalScore.percent){
      progress.finalScore = {percent, stars};
    }
    saveProgress();
    renderResults(percent, passed, false, correctCount, totalItems, false, true);
    return;
  }

  if(quiz.mockId){
    const prevMock = progress.mockScores[quiz.mockId];
    if(!prevMock || percent > prevMock.percent){
      progress.mockScores[quiz.mockId] = {percent, stars};
    }
    saveProgress();
    renderResults(percent, passed, false, correctCount, totalItems, false, false, true);
    return;
  }

  const prevBest = progress.scores[quiz.examIndex];
  if(!prevBest || percent > prevBest.percent){
    progress.scores[quiz.examIndex] = {percent, stars};
  }
  let justUnlocked = false;
  if(passed && quiz.examIndex === progress.unlockedUpTo && progress.unlockedUpTo < TOTAL_EXAMS){
    progress.unlockedUpTo = quiz.examIndex + 1;
    justUnlocked = true;
  }
  saveProgress();
  const allPassed = Object.keys(progress.scores).length === TOTAL_EXAMS &&
    Object.values(progress.scores).every(v => v.percent >= PASS_THRESHOLD*100);
  renderResults(percent, passed, justUnlocked, correctCount, totalItems, allPassed, false);
}

// Renders the per-category score breakdown bars shown on both the
// results screen and the FLUNKED screen. Skips categories with zero
// questions asked (relevant for Mock Exams that don't cover all 4).
function renderBreakdown(){
  let html = "";
  CATEGORY_ORDER.forEach(cat=>{
    const s = quiz.catStats[cat];
    if(s.t === 0) return;
    const pct = Math.round((s.c/s.t)*100);
    html += `
      <div class="bd-row">
        <div class="bd-top"><span class="cat">${CATEGORY_LABELS[cat]}</span><span class="val mono">${s.c}/${s.t} · ${pct}%</span></div>
        <div class="bd-track"><div class="bd-fill" style="width:${pct}%; background:${pct>=80?'var(--green)':pct>=50?'var(--gold)':'var(--red)'}"></div></div>
      </div>`;
  });
  return html;
}

// Renders the pass/fail results screen: score ring, PASS/FAIL stamp,
// category breakdown, and the appropriate next-step button (Start
// Next Level / Retry) depending on exam type and outcome.
function renderResults(percent, passed, justUnlocked, correctCount, totalItems, allPassed, isFinal, isMock){
  cancelSpeech();
  const app = document.getElementById("app");
  const circumference = 2 * Math.PI * 76;
  const offset = circumference * (1 - percent/100);
  const ringColor = passed ? "var(--green)" : "var(--red)";

  const statusText = isFinal
    ? (passed ? "FINAL CERTIFICATION: PASSED" : "FINAL CERTIFICATION: FAILED")
    : (passed ? "STATUS: PASSED" : "STATUS: FAILED");
  const subLabel = isFinal
    ? (passed ? "(Civil Service Professional — Eligible)" : "(Retake the Final Exam)")
    : isMock
      ? (passed ? "(Strong practice result)" : "(Keep practicing)")
      : (passed ? "(Eligible)" : "(Retake Required)");
  const subLine = isFinal
    ? `Final Exam: Comprehensive Assessment · Max combo x${quiz.maxCombo} · Score ${quiz.score} pts<br>Passing mark is 80%.`
    : isMock
      ? `${MOCK_TITLES[quiz.mockId]} · Max combo x${quiz.maxCombo} · Score ${quiz.score} pts<br>Passing mark is 80%.`
      : `Exam ${quiz.examIndex}: Level ${quiz.examIndex} · Max combo x${quiz.maxCombo} · Score ${quiz.score} pts<br>Passing mark is 80%.`;

  let actionButtons = "";
  if(isFinal){
    actionButtons = !passed ? `<button class="btn btn-primary" onclick="startFinalExam()">Retry Final Exam</button>` : "";
  }else if(isMock){
    if(passed){
      const nextMockId = quiz.mockId + 1;
      actionButtons = MOCK_BANKS[nextMockId]
        ? `<button class="btn btn-primary" onclick="startMockExam(${nextMockId})">Start ${MOCK_TITLES[nextMockId]}</button>`
        : `<button class="btn btn-primary" onclick="startFinalExam()">Start Final Exam</button>`;
    }else{
      actionButtons = `<button class="btn btn-primary" onclick="startMockExam(${quiz.mockId})">Retry ${MOCK_TITLES[quiz.mockId]}</button>`;
    }
  }else{
    if(passed){
      actionButtons = quiz.examIndex < TOTAL_EXAMS
        ? `<button class="btn btn-primary" onclick="startExam(${quiz.examIndex+1})">Start Exam ${quiz.examIndex+1}</button>`
        : `<button class="btn btn-primary" onclick="startMockExam(1)">Start Mock Exam 1</button>`;
    }else{
      actionButtons = `<button class="btn btn-primary" onclick="startExam(${quiz.examIndex})">Retry Exam ${quiz.examIndex}</button>`;
    }
  }

  app.innerHTML = `
    <div class="result-screen ${!passed ? 'shake-fail' : ''}">
      <div class="stamp-big ${passed ? 'pass':'fail'}">${statusText}</div>
      <div style="font-size:12.5px; color:var(--text-faint); margin-bottom:18px; letter-spacing:.5px;">${subLabel}</div>

      <div class="ring-wrap">
        <svg width="172" height="172" viewBox="0 0 172 172">
          <circle cx="86" cy="86" r="76" fill="none" stroke="var(--surface-3)" stroke-width="12"/>
          <circle cx="86" cy="86" r="76" fill="none" stroke="${ringColor}" stroke-width="12" stroke-linecap="round"
            stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" id="ringCircle"/>
        </svg>
        <div class="ring-pct">
          <div class="n mono" style="color:${ringColor}">${percent}%</div>
          <div class="l">${correctCount}/${totalItems} correct</div>
        </div>
      </div>
      <div class="result-sub">${subLine}</div>

      ${justUnlocked ? `<div class="unlock-banner">🔓 Exam ${quiz.examIndex+1} is now unlocked!</div>` : ""}
      ${allPassed ? `<div class="grand-banner"><div class="gt">🏆 ALL 20 EXAMS CLEARED</div><div class="gs">The Final Exam is now unlocked on the dashboard.</div></div>` : ""}
      ${isFinal && passed ? `<div class="grand-banner"><div class="gt">🎓 CERTIFICATION EARNED</div><div class="gs">You've completed the full CSC Professional Exam Protocol.</div></div>` : ""}

      <div class="breakdown">${renderBreakdown()}</div>

      <div class="result-actions">
        ${actionButtons}
        <button class="btn btn-ghost" onclick="backToDashboard()">Back to Dashboard</button>
      </div>
    </div>
  `;

  requestAnimationFrame(()=>{
    setTimeout(()=>{
      const c = document.getElementById("ringCircle");
      if(c) c.style.transition = "stroke-dashoffset 1s cubic-bezier(.2,.9,.3,1)";
      if(c) c.style.strokeDashoffset = offset;
    }, 100);
  });

  if(passed){
    playPass();
    const bigCelebration = allPassed || isFinal;
    fireConfetti(bigCelebration ? 220 : 100);
    if(bigCelebration){
      setTimeout(()=> fireConfetti(180), 500);
      setTimeout(()=> fireConfetti(140), 1000);
    }
  }else{
    playFail();
    fireFailEffect();
  }
}

// Returns to the dashboard screen from anywhere in the app.
function backToDashboard(){
  cancelSpeech();
  quiz = null;
  renderDashboard();
}

/* =========================================================
   INIT
   ========================================================= */
renderDashboard();
