const countryName = document.getElementById('country-name');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const correctAnswerDiv = document.getElementById('correct-answer');
const incorrectAnswerDiv = document.getElementById('incorrect-answer');
const correctAnswerText = document.getElementById('correct-answer-text');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const continentSelect = document.getElementById('continent-select');
const testCard = document.getElementById('test-card');
const resultContainer = document.getElementById('result-container');
const scoreDisplay = document.getElementById('score');
const totalQuestionsDisplay = document.getElementById('total-questions');
const resultMessage = document.getElementById('result-message');
const restartBtn = document.getElementById('restart-btn');
const currentCardSpan = document.getElementById('current-card');
const totalCardsSpan = document.getElementById('total-cards');
const progressBar = document.getElementById('progress-bar');

let currentContinent = 'Europe';
let currentCards = [];
let currentIndex = 0;
let userAnswers = [];
let testSubmitted = false;

function init() {
    loadContinent(currentContinent);
    initEventHandlers();
}

function initEventHandlers() {
    continentSelect.addEventListener('change', handleContinentChange);
    submitBtn.addEventListener('click', checkAnswer);
    prevBtn.addEventListener('click', showPreviousQuestion);
    nextBtn.addEventListener('click', showNextQuestion);
    restartBtn.addEventListener('click', restartTest);
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
}

function loadContinent(continent) {
    currentContinent = continent;
    
    currentCards = allCountries.filter(country => 
        country.continent.toLowerCase() === continent.toLowerCase()
    ).map(country => ({
        country: country.country,
        capital: country.capital
    }));
    
    currentIndex = 0;
    userAnswers = Array(currentCards.length).fill(null);
    testSubmitted = false;
    
    resultContainer.style.display = 'none';
    testCard.style.display = 'block';
    
    updateQuestionDisplay();
    updateNavigationButtons();
    updateTotalQuestions();
    resetAnswerFeedback();
    updateProgressBar();
}

function updateQuestionDisplay() {
    if (currentCards.length === 0) {
        countryName.textContent = 'Нет доступных стран';
        resetAnswerFeedback();
        return;
    }
    
    const currentCountry = currentCards[currentIndex];
    countryName.textContent = currentCountry.country;
    
    answerInput.value = userAnswers[currentIndex]?.answer || '';
    answerInput.disabled = userAnswers[currentIndex] !== null;
    submitBtn.disabled = userAnswers[currentIndex] !== null;

    resetAnswerFeedback();
    
    if (userAnswers[currentIndex] !== null) {
        showAnswerFeedback(userAnswers[currentIndex]);
    }
    
    currentCardSpan.textContent = currentIndex + 1;
}

function checkAnswer() {
    if (testSubmitted || currentCards.length === 0) return;
    
    const userAnswer = answerInput.value.trim();

    if (!userAnswer) {
        emptyAnswerDiv.style.display = 'block';
        return;
    }

    const correctAnswer = currentCards[currentIndex].capital;
    const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    
    userAnswers[currentIndex] = {
        answer: userAnswer,
        isCorrect: isCorrect,
        correctAnswer: correctAnswer
    };
    
    showAnswerFeedback(userAnswers[currentIndex]);
    
    answerInput.disabled = true;
    submitBtn.disabled = true;
    
    updateProgressBar();
    
    if (userAnswers.every(answer => answer !== null)) {
        showResults();
    }
}

function showAnswerFeedback(answer) {
    resetAnswerFeedback();
    
    if (answer.isCorrect) {
        correctAnswerDiv.style.display = 'block';
    } else {
        incorrectAnswerDiv.style.display = 'block';
        correctAnswerText.textContent = answer.correctAnswer;
    }
}

function resetAnswerFeedback() {
    correctAnswerDiv.style.display = 'none';
    incorrectAnswerDiv.style.display = 'none';
    answerInput.classList.remove('correct', 'incorrect');
}

function showPreviousQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        updateQuestionDisplay();
        updateNavigationButtons();
    }
}

function showNextQuestion() {
    if (currentIndex < currentCards.length - 1) {
        currentIndex++;
        updateQuestionDisplay();
        updateNavigationButtons();
    }
}

function updateNavigationButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === currentCards.length - 1;
}

function updateTotalQuestions() {
    totalCardsSpan.textContent = currentCards.length;
}

function updateProgressBar() {
    const answeredCount = userAnswers.filter(answer => answer !== null).length;
    const progress = (answeredCount / currentCards.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function showResults() {
    const correctCount = userAnswers.filter(answer => answer.isCorrect).length;
    const totalQuestions = currentCards.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    scoreDisplay.textContent = correctCount;
    totalQuestionsDisplay.textContent = totalQuestions;
    
    if (percentage === 100) {
        resultMessage.textContent = "Идеально! Вы знаете все столицы!";
    } else if (percentage >= 80) {
        resultMessage.textContent = "Отлично! Вы знаете большинство столиц!";
    } else if (percentage >= 60) {
        resultMessage.textContent = "Хорошая работа! Продолжайте практиковаться!";
    } else if (percentage >= 40) {
        resultMessage.textContent = "Неплохо! Повторите столицы, которые пропустили.";
    } else {
        resultMessage.textContent = "Продолжайте практиковаться! Со временем вы станете лучше!";
    }
    
    testCard.style.display = 'none';
    resultContainer.style.display = 'block';
    testSubmitted = true;
}

function restartTest() {
    loadContinent(currentContinent);
}

function handleContinentChange(e) {
    loadContinent(e.target.value);
}

document.addEventListener('DOMContentLoaded', init);