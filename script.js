const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const timerDisplay = document.getElementById('timer');
const yearSelect = document.getElementById('year-select');
const startQuizButton = document.getElementById('start-quiz');

let timeLeft = 3600; // 1 hour in seconds
let timer;
let quizData = [];

// Sample JSON data for questions (replace with your data)
const allQuizData = {
  "2021": [
    {
      question: "Q1: 2021 ප්‍රශ්න 1",
      image: "images/2021_q1.png",
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "Option A"
    },
    // Add more questions for 2021
  ],
  "2022": [
    {
      question: "Q1: 2022 ප්‍රශ්න 1",
      image: "images/2022_q1.png",
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "Option A"
    },
    // Add more questions for 2022
  ],
  // Add data for 2023, 2024, 2025
};

// Display quiz questions
function buildQuiz() {
  const output = [];
  quizData.forEach((currentQuestion, questionNumber) => {
    const options = [];
    for (let i in currentQuestion.options) {
      options.push(
        `<label>
          <input type="radio" name="question${questionNumber}" value="${currentQuestion.options[i]}">
          ${currentQuestion.options[i]}
        </label>`
      );
    }
    output.push(
      `<div class="question">
        <div>${currentQuestion.question}</div>
        <img src="${currentQuestion.image}" alt="Question Image">
        <div class="options">${options.join('')}</div>
      </div>`
    );
  });
  quizContainer.innerHTML = output.join('');
}

// Show results
function showResults() {
  const answerContainers = quizContainer.querySelectorAll('.question');
  let score = 0;
  quizData.forEach((currentQuestion, questionNumber) => {
    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=question${questionNumber}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {};
    if (userAnswer.value === currentQuestion.answer) {
      score += 2;
    }
  });
  resultsContainer.innerHTML = `You scored ${score} out of ${quizData.length * 2}`;
}

// Timer function
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerHTML = `Time Left: ${hours}:${minutes}:${seconds}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showResults();
    }
  }, 1000);
}

// Start quiz for selected year
startQuizButton.addEventListener('click', () => {
  const selectedYear = yearSelect.value;
  quizData = allQuizData[selectedYear];
  buildQuiz();
  startTimer();
});

// Event listeners
submitButton.addEventListener('click', showResults);
