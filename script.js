const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const timerDisplay = document.getElementById('timer');
const yearSelect = document.getElementById('year-select');
const startQuizButton = document.getElementById('start-quiz');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const progressBar = document.getElementById('progress');
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');

let timeLeft = 3600; // 1 hour in seconds
let timer;
let quizData = [];
let currentQuestionIndex = 0; // Track the current question

// Sample JSON data for questions (replace with your data)
const allQuizData = {
  "2021": [
    {
      question: "Q1: 1.මානව හෘදය අයත් වන්නේ පහත සඳහන් කුමන සංවිධාන මට්ටමටද?",
      options: ["Option පටක", "Option අවයව", "Option පද්ධති", "Option සෛලය"],
      answer: "Option පද්ධති"
    },
    {
      question: "Q2: 2021 ප්‍රශ්න 2",
      image: "images/2021_q2.png",
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "Option B"
    },
    // Add more questions for 2021
  ],
  "2022": [
    {
      question: "Q1: 1.මානව හෘදය අයත් වන්නේ පහත සඳහන් කුමන සංවිධාන මට්ටමටද?",
      options: ["පටක", "අවයව", "පද්ධති", "සෛලය"],
      answer: "Option A"
    },
    {
      question: "Q2: 2022 ප්‍රශ්න 2",
      image: "images/2022_q2.png",
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
      <img src="${currentQuestion.image}" alt="Question Image">
      <div class="options">
        ${currentQuestion.options.map((option, index) => `
          <label>
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
  showQuestion();
  startTimer();
});

// Event listener for option selection
quizContainer.addEventListener('change', (e) => {
  if (e.target.type === 'radio') {
    const questionIndex = currentQuestionIndex;
    const selectedAnswer = e.target.value;
    saveAnswer(questionIndex, selectedAnswer);
    updateProgressBar();
  }
});

// Update progress bar
function updateProgressBar() {
  const totalQuestions = quizData.length;
  const answeredQuestions = Object.keys(localStorage).length;
  const progress = (answeredQuestions / totalQuestions) * 100;
  progressBar.style.width = `${progress}%`;
}

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');

  if (currentTheme === 'dark') {
    body.setAttribute('data-theme', 'light');
    darkModeToggle.textContent = '🌙 Dark Mode';
  } else {
    body.setAttribute('data-theme', 'dark');
    darkModeToggle.textContent = '☀️ Light Mode';
  }
});
