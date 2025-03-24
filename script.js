const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const timerDisplay = document.getElementById('timer');
const yearSelect = document.getElementById('year-select');
const startQuizButton = document.getElementById('start-quiz');
const progressBar = document.getElementById('progress');
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');
const scoreSummary = document.getElementById('score-summary');
const checkbox = document.getElementById('checkbox');

let timeLeft = 3600; // 1 hour in seconds
let timer;
let quizData = [];
let currentQuestionIndex = 0; // Track the current question
let correctAnswers = 0;
let incorrectAnswers = 0;

// Sample JSON data for questions (replace with your data)
const allQuizData = {
  "2021": [
    {
      question: "Q1: 2021 ප්‍රශ්න 1",
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "Option A"
    },
    {
      question: "Q2: 2021 ප්‍රශ්න 2",
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "Option B"
    },
    // Add more questions for 2021
  ],
  "2022": [
    {
      question: "Q1: 2022 ප්‍රශ්න 1",
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "Option A"
    },
    {
      question: "Q2: 2022 ප්‍රශ්න 2",
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "Option B"
    },
    // Add more questions for 2022
  ],
  // Add data for 2023, 2024, 2025
};

// Display the current question
function showQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];
  const output = `
    <div class="question">
      <div>${currentQuestion.question}</div>
      <div class="options">
        ${currentQuestion.options.map((option, index) => `
          <label class="${getOptionClass(option, currentQuestion.answer)}">
            <input type="radio" name="question${currentQuestionIndex}" value="${option}" ${isOptionSelected(option) ? 'checked' : ''} ${isQuestionAnswered(currentQuestionIndex) ? 'disabled' : ''}>
            ${option}
          </label>
        `).join('')}
      </div>
    </div>
  `;
  quizContainer.innerHTML = output;

  // Update navigation buttons
  previousButton.disabled = currentQuestionIndex === 0;
  nextButton.disabled = currentQuestionIndex === quizData.length - 1;
}

// Automatically move to the next question after answering
function autoNextQuestion() {
  if (currentQuestionIndex < quizData.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  }
}

// Get the class for the option (correct or incorrect)
function getOptionClass(option, correctAnswer) {
  const selectedAnswer = localStorage.getItem(`question${currentQuestionIndex}`);
  if (selectedAnswer === option) {
    return option === correctAnswer ? 'correct' : 'incorrect';
  }
  return '';
}

// Check if an option is selected
function isOptionSelected(option) {
  const selectedAnswer = localStorage.getItem(`question${currentQuestionIndex}`);
  return selectedAnswer === option;
}

// Check if a question is answered
function isQuestionAnswered(questionIndex) {
  return localStorage.getItem(`question${questionIndex}`) !== null;
}

// Save the selected answer
function saveAnswer(questionIndex, answer) {
  localStorage.setItem(`question${questionIndex}`, answer);
}

// Navigate to the previous question
previousButton.addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
});

// Navigate to the next question
nextButton.addEventListener('click', () => {
  if (currentQuestionIndex < quizData.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  }
});

// Start quiz for selected year
startQuizButton.addEventListener('click', () => {
  const selectedYear = yearSelect.value;
  quizData = allQuizData[selectedYear];
  currentQuestionIndex = 0; // Reset to the first question
  localStorage.clear(); // Clear previous answers
  correctAnswers = 0;
  incorrectAnswers = 0;
  timeLeft = 3600; // Reset timer to 1 hour
  showQuestion();
  startTimer(); // Start the timer
});

// Event listener for option selection
quizContainer.addEventListener('change', (e) => {
  if (e.target.type === 'radio') {
    const questionIndex = currentQuestionIndex;
    const selectedAnswer = e.target.value;
    saveAnswer(questionIndex, selectedAnswer);
    updateProgressBar();
    autoNextQuestion(); // Automatically move to the next question
  }
});

// Update progress bar
function updateProgressBar() {
  const totalQuestions = quizData.length;
  const answeredQuestions = Object.keys(localStorage).length;
  const progress = (answeredQuestions / totalQuestions) * 100;
  progressBar.style.width = `${progress}%`;
}

// Timer function
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerHTML = `Time Left: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // If time runs out, stop the timer and show results
    if (timeLeft <= 0) {
      clearInterval(timer);
      showResults();
    }
  }, 1000);
}

// Show results
function showResults() {
  correctAnswers = 0;
  incorrectAnswers = 0;

  quizData.forEach((currentQuestion, questionIndex) => {
    const selectedAnswer = localStorage.getItem(`question${questionIndex}`);
    if (selectedAnswer === currentQuestion.answer) {
      correctAnswers++;
    } else {
      incorrectAnswers++;
    }
  });

  resultsContainer.innerHTML = `You scored ${correctAnswers} out of ${quizData.length}`;
  scoreSummary.innerHTML = `Correct: ${correctAnswers} | Incorrect: ${incorrectAnswers}`;
}

// Submit quiz
submitButton.addEventListener('click', showResults);

// Dark Mode Toggle
checkbox.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
});
