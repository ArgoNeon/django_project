
const flashcard = document.getElementById('flashcard');
const countryName = document.getElementById('country-name');
const capitalName = document.getElementById('capital-name');
const continentSelect = document.getElementById('continent-select');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const flipBtn = document.getElementById('flip-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const currentCardSpan = document.getElementById('current-card');
const totalCardsSpan = document.getElementById('total-cards');
const loadingMessage = document.getElementById('loading-message');
const content = document.getElementById('content');

let currentContinent = 'Europe';
let currentCards = [];
let currentIndex = 0;

function init() {
    loadingMessage.style.display = 'none';
    
    loadContinent(currentContinent);
    
    initEventHandlers();
}

function loadContinent(continent) {
    currentCards = allCountries.filter(country => 
        country.continent.toLowerCase() === continent.toLowerCase()
    );
    
    if (currentCards.length > 0) {
        currentIndex = 0;
        updateCardDisplay();
        updateNavigationButtons();
        updateTotalCards();
    } else {
        countryName.textContent = 'Нет данных для выбранного континента';
        capitalName.textContent = '';
        totalCardsSpan.textContent = '0';
    }
}

function initEventHandlers() {
    flashcard.addEventListener('click', flipCard);
    flipBtn.addEventListener('click', flipCard);
    continentSelect.addEventListener('change', handleContinentChange);
    prevBtn.addEventListener('click', showPreviousCard);
    nextBtn.addEventListener('click', showNextCard);
    shuffleBtn.addEventListener('click', shuffleCards);
    
    document.addEventListener('keydown', handleKeyPress);
}

function updateCardDisplay() {
    if (currentCards.length === 0) {
        countryName.textContent = 'Нет доступных стран';
        capitalName.textContent = '';
        return;
    }
    
    const currentCountry = currentCards[currentIndex];
    countryName.textContent = currentCountry.country;
    capitalName.textContent = currentCountry.capital;
    
    flashcard.classList.remove('flipped');
    
    currentCardSpan.textContent = currentIndex + 1;
}

function flipCard() {
    if (currentCards.length === 0) return;
    flashcard.classList.toggle('flipped');
}

function handleContinentChange(e) {
    currentContinent = e.target.value;
    loadContinent(currentContinent);
}

function showPreviousCard() {
    if (currentIndex > 0) {
        currentIndex--;
        updateCardDisplay();
        updateNavigationButtons();
    }
}

function showNextCard() {
    if (currentIndex < currentCards.length - 1) {
        currentIndex++;
        updateCardDisplay();
        updateNavigationButtons();
    }
}

function shuffleCards() {
    if (currentCards.length === 0) return;
    
    for (let i = currentCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentCards[i], currentCards[j]] = [currentCards[j], currentCards[i]];
    }
    
    currentIndex = 0;
    updateCardDisplay();
    updateNavigationButtons();
}

function updateNavigationButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === currentCards.length - 1;
}

function updateTotalCards() {
    totalCardsSpan.textContent = currentCards.length;
}

function handleKeyPress(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        flipCard();
    } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        showPreviousCard();
    } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        showNextCard();
    }
}

document.addEventListener('DOMContentLoaded', init);