// Элементы DOM
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

// Состояние приложения
let currentContinent = 'Europe';
let currentCards = [];
let currentIndex = 0;
let userAnswers = [];
let testSubmitted = false;

// Инициализация приложения
function init() {
    loadContinent(currentContinent);
    initEventHandlers();
}

// Инициализация обработчиков событий
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

// Загрузка вопросов для континента
function loadContinent(continent) {
    currentContinent = continent;
    
    // Фильтруем страны по выбранному континенту
    currentCards = allCountries.filter(country => 
        country.continent.toLowerCase() === continent.toLowerCase()
    ).map(country => ({
        country: country.country,
        capital: country.capital
    }));
    
    currentIndex = 0;
    userAnswers = Array(currentCards.length).fill(null);
    testSubmitted = false;
    
    // Скрыть результаты и показать карточку теста
    resultContainer.style.display = 'none';
    testCard.style.display = 'block';
    
    updateQuestionDisplay();
    updateNavigationButtons();
    updateTotalQuestions();
    resetAnswerFeedback();
    updateProgressBar();
}

// Обновление отображения вопроса
function updateQuestionDisplay() {
    if (currentCards.length === 0) {
        countryName.textContent = 'Нет доступных стран';
        resetAnswerFeedback();
        return;
    }
    
    const currentCountry = currentCards[currentIndex];
    countryName.textContent = currentCountry.country;
    
    // Сброс ввода и обратной связи
    answerInput.value = userAnswers[currentIndex]?.answer || '';
    answerInput.disabled = userAnswers[currentIndex] !== null;
    submitBtn.disabled = userAnswers[currentIndex] !== null;

    resetAnswerFeedback();
    
    // Показать обратную связь, если ответ существует
    if (userAnswers[currentIndex] !== null) {
        showAnswerFeedback(userAnswers[currentIndex]);
    }
    
    // Обновление счетчика текущего вопроса
    currentCardSpan.textContent = currentIndex + 1;
}

// Проверка ответа пользователя
function checkAnswer() {
    if (testSubmitted || currentCards.length === 0) return;
    
    const userAnswer = answerInput.value.trim();

    if (!userAnswer) {
        emptyAnswerDiv.style.display = 'block';
        return;
    }

    const correctAnswer = currentCards[currentIndex].capital;
    const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    
    // Сохранить ответ пользователя
    userAnswers[currentIndex] = {
        answer: userAnswer,
        isCorrect: isCorrect,
        correctAnswer: correctAnswer
    };
    
    // Показать обратную связь
    showAnswerFeedback(userAnswers[currentIndex]);
    
    // Отключить ввод и кнопку отправки
    answerInput.disabled = true;
    submitBtn.disabled = true;
    
    // Обновить индикатор прогресса
    updateProgressBar();
    
    // Проверить, все ли вопросы отвечены
    if (userAnswers.every(answer => answer !== null)) {
        showResults();
    }
}

// Показать обратную связь по ответу
function showAnswerFeedback(answer) {
    resetAnswerFeedback();
    
    if (answer.isCorrect) {
        correctAnswerDiv.style.display = 'block';
    } else {
        incorrectAnswerDiv.style.display = 'block';
        correctAnswerText.textContent = answer.correctAnswer;
    }
}

// Сбросить обратную связь по ответу
function resetAnswerFeedback() {
    correctAnswerDiv.style.display = 'none';
    incorrectAnswerDiv.style.display = 'none';
    answerInput.classList.remove('correct', 'incorrect');
}

// Показать предыдущий вопрос
function showPreviousQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        updateQuestionDisplay();
        updateNavigationButtons();
    }
}

// Показать следующий вопрос
function showNextQuestion() {
    if (currentIndex < currentCards.length - 1) {
        currentIndex++;
        updateQuestionDisplay();
        updateNavigationButtons();
    }
}

// Обновить состояние кнопок навигации
function updateNavigationButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === currentCards.length - 1;
}

// Обновить отображение общего количества вопросов
function updateTotalQuestions() {
    totalCardsSpan.textContent = currentCards.length;
}

// Обновить индикатор прогресса
function updateProgressBar() {
    const answeredCount = userAnswers.filter(answer => answer !== null).length;
    const progress = (answeredCount / currentCards.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Показать результаты теста
function showResults() {
    const correctCount = userAnswers.filter(answer => answer.isCorrect).length;
    const totalQuestions = currentCards.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    scoreDisplay.textContent = correctCount;
    totalQuestionsDisplay.textContent = totalQuestions;
    
    // Установить сообщение результата в зависимости от производительности
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
    
    // Скрыть карточку теста и показать результаты
    testCard.style.display = 'none';
    resultContainer.style.display = 'block';
    testSubmitted = true;
}

// Перезапустить тест
function restartTest() {
    loadContinent(currentContinent);
}

// Обработчик изменения континента
function handleContinentChange(e) {
    loadContinent(e.target.value);
}

// Инициализировать приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', init);