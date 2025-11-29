
const quizQuestions = [
  {
    id: 1,
    question: "Which HTML tag is used to define the largest heading?",
    options: ["<h1>", "<heading>", "<h6>", "<head>"],
    answer: 0,
    tags: ["html"]
  },
  {
    id: 2,
    question: "What does CSS stand for?",
    options: [
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Colorful Style Sheets"
    ],
    answer: 1,
    tags: ["css"]
  },
  {
    id: 3,
    question: "Which property is used to change the background color in CSS?",
    options: ["color", "bgcolor", "background-color", "background"],
    answer: 2,
    tags: ["css"]
  },
  {
    id: 4,
    question: "Which HTML element is used for inserting a line break?",
    options: ["<break>", "<br>", "<lb>", "<line>"],
    answer: 1,
    tags: ["html"]
  },
  {
    id: 5,
    question: "In JavaScript, which keyword is used to declare a variable?",
    options: ["var", "let", "const", "All of the above"],
    answer: 3,
    tags: ["javascript"]
  },
  {
    id: 6,
    question: "Which attribute is used in HTML to provide a unique name to an element?",
    options: ["class", "id", "style", "name"],
    answer: 1,
    tags: ["html"]
  },
  {
    id: 7,
    question: "Which of the following is NOT a valid CSS unit?",
    options: ["px", "em", "pt", "dp"],
    answer: 3,
    tags: ["css"]
  },
  {
    id: 8,
    question: "What does DOM stand for?",
    options: [
      "Document Object Model",
      "Display Object Management",
      "Digital Ordinance Model",
      "Desktop Oriented Mode"
    ],
    answer: 0,
    tags: ["javascript"]
  },
  {
    id: 9,
    question: "Which Bootstrap class is used to make an element responsive?",
    options: ["img-fixed", "img-responsive", "image-fluid", "img-fluid"],
    answer: 3,
    tags: ["bootstrap"]
  },
  {
    id: 10,
    question: "Which HTML attribute is used to specify inline CSS styles?",
    options: ["font", "style", "css", "design"],
    answer: 1,
    tags: ["html"]
  },
  {
    id: 11,
    question: "Which CSS property controls the text size?",
    options: ["font-style", "text-size", "font-size", "text-style"],
    answer: 2,
    tags: ["css"]
  },
  {
    id: 12,
    question: "Which JavaScript method is used to write HTML output?",
    options: ["document.write()", "console.log()", "window.write()", "document.output()"],
    answer: 0,
    tags: ["javascript"]
  },
  {
    id: 13,
    question: "Which tag is used to link an external CSS file?",
    options: ["<style>", "<link>", "<script>", "<css>"],
    answer: 1,
    tags: ["html"]
  },
  {
    id: 14,
    question: "What is the default display value of a <div> element?",
    options: ["inline", "block", "flex", "grid"],
    answer: 1,
    tags: ["css"]
  },
  {
    id: 15,
    question: "Which symbol is used for comments in JavaScript?",
    options: ["//", "/*", "#", "<!-- -->"],
    answer: 0,
    tags: ["javascript"]
  }
];

// ---------- STATE ----------
let currentIndex = 0;
let selectedAnswers = new Array(quizQuestions.length).fill(null); // 1..4
let timerSeconds = 600; // 10 minutes
let timerId = null;

// ---------- DOM ELEMENTS ----------
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const retakeBtn = document.getElementById("retake-btn");

const questionText = document.getElementById("question-text");
const questionCounter = document.getElementById("question-counter");
const timerSpan = document.getElementById("timer");

const optText1 = document.getElementById("optText1");
const optText2 = document.getElementById("optText2");
const optText3 = document.getElementById("optText3");
const optText4 = document.getElementById("optText4");

const optionsForm = document.getElementById("options-form");

const resultScore = document.getElementById("result-score");
const resultSummary = document.getElementById("result-summary");
const resultDetails = document.getElementById("result-details");

const pillAttempted = document.getElementById("pill-attempted");
const pillCorrect = document.getElementById("pill-correct");
const pillWrong = document.getElementById("pill-wrong");
const pillPercent = document.getElementById("pill-percent");

// ---------- EVENT LISTENERS ----------
startBtn.addEventListener("click", startQuiz);
prevBtn.addEventListener("click", showPreviousQuestion);
nextBtn.addEventListener("click", showNextQuestion);
submitBtn.addEventListener("click", submitQuiz);
retakeBtn.addEventListener("click", () => window.location.reload());

optionsForm.addEventListener("change", (e) => {
  if (e.target.name === "option") {
    selectedAnswers[currentIndex] = parseInt(e.target.value, 10); // store 1..4
  }
});

// ---------- FUNCTIONS ----------
function startQuiz() {
  currentIndex = 0;
  selectedAnswers = new Array(quizQuestions.length).fill(null);

  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  renderQuestion();
  startTimer();
}

function renderQuestion() {
  const q = quizQuestions[currentIndex];

  questionText.textContent = q.question;
  questionCounter.textContent = `Question ${currentIndex + 1} of ${quizQuestions.length}`;

  optText1.textContent = q.options[0];
  optText2.textContent = q.options[1];
  optText3.textContent = q.options[2];
  optText4.textContent = q.options[3];

  const radios = optionsForm.elements["option"];
  for (let i = 0; i < 4; i++) {
    radios[i].checked = false;
  }

  const saved = selectedAnswers[currentIndex];
  if (saved !== null && saved !== undefined) {
    radios[saved - 1].checked = true; // saved is 1..4
  }

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === quizQuestions.length - 1;
}

function showPreviousQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}

function showNextQuestion() {
  if (currentIndex < quizQuestions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
}

function submitQuiz() {
  if (!confirm("Are you sure you want to submit the test?")) return;

  clearInterval(timerId);

  const total = quizQuestions.length;
  let attempted = 0;
  let correct = 0;

  for (let i = 0; i < total; i++) {
    const userAns = selectedAnswers[i]; // 1..4
    const correctIndex = quizQuestions[i].answer; // 0..3

    if (userAns !== null && userAns !== undefined) {
      attempted++;
      if (userAns - 1 === correctIndex) {
        correct++;
      }
    }
  }

  const wrong = attempted - correct;
  const percentage = ((correct / total) * 100).toFixed(2);

  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  resultScore.textContent = `${correct} / ${total}`;
  resultSummary.textContent = `You scored ${correct} out of ${total} questions.`;
  resultDetails.textContent = `Your percentage is ${percentage}%.`;

  pillAttempted.textContent = `Attempted: ${attempted}`;
  pillCorrect.textContent = `Correct: ${correct}`;
  pillWrong.textContent = `Wrong: ${wrong}`;
  pillPercent.textContent = `Score: ${percentage}%`;
}

// ---------- TIMER ----------
function startTimer() {
  timerSeconds = 600;
  updateTimerDisplay();

  timerId = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();

    if (timerSeconds <= 0) {
      clearInterval(timerId);
      alert("Time is over! Test will be submitted automatically.");
      submitQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  timerSpan.textContent =
    `Time left: ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
