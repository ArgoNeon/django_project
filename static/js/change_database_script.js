const allCountries = {};

countriesData.forEach(country => {
    const continent = country.continent;
    if (!allCountries[continent]) {
        allCountries[continent] = [];
    }
    allCountries[continent].push({
        country: country.country,
        capital: country.capital
    });
});

const countryForm = document.getElementById('country-form');
const continentSelect = document.getElementById('continent-select');
const countryInput = document.getElementById('country-input');
const capitalInput = document.getElementById('capital-input');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const countryError = document.getElementById('country-error');
const capitalError = document.getElementById('capital-error');
const countryExistsMsg = document.getElementById('country-exists');
const capitalExistsMsg = document.getElementById('capital-exists');

const deleteForm = document.getElementById('delete-country-form');
const deleteContinentSelect = document.getElementById('delete-continent-select');
const deleteCountrySelect = document.getElementById('delete-country-select');
const submitDeleteBtn = document.getElementById('submit-delete-btn');
const resetDeleteBtn = document.getElementById('reset-delete-btn');

function init() {
    countryForm.addEventListener('submit', handleFormSubmit);
    resetBtn.addEventListener('click', resetForm);
    countryInput.addEventListener('input', validateCountryName);
    capitalInput.addEventListener('input', validateCapitalName);

    deleteContinentSelect.addEventListener('change', updateCountrySelect);
    deleteForm.addEventListener('submit', handleDeleteSubmit);
    resetDeleteBtn.addEventListener('click', resetDeleteForm);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const isCountryValid = validateCountryName();
    const isCapitalValid = validateCapitalName();
    const isContinentValid = continentSelect.value !== '';
    
    if (!isContinentValid) {
        continentSelect.classList.add('is-invalid');
        return;
    } else {
        continentSelect.classList.remove('is-invalid');
    }
    
    if (!isCountryValid || !isCapitalValid) return;
    
    const countryExists = checkCountryExists(countryInput.value.trim());
    if (countryExists) {
        countryInput.classList.remove('is-valid', 'is-invalid');
        capitalInput.classList.remove('is-valid', 'is-invalid');
        countryExistsMsg.style.display = 'block';
        countryExistsMsg.textContent = 'Страна с таким названием уже существует';
        return;
    }
    
    const capitalExists = checkCapitalExists(capitalInput.value.trim());
    if (capitalExists) {
        countryInput.classList.remove('is-valid', 'is-invalid');
        capitalInput.classList.remove('is-valid', 'is-invalid');
        capitalExistsMsg.style.display = 'block';
        capitalExistsMsg.textContent = 'Страна с таким названием столицы уже существует';
        return;
    }
    
    await saveCountryData();
}

async function saveCountryData() {
    const continent = continentSelect.value;
    const country = countryInput.value.trim();
    const capital = capitalInput.value.trim();
    
    try {
        const response = await fetch('add_country', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                country: country,
                capital: capital,
                continent: continent
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(`Страна "${country}" успешно добавлена!`);
            allCountries[continent].push({ country, capital });
            resetForm();
            updateDeleteCountrySelect();
        } else {
            countryExistsMsg.style.display = 'block';
            countryInput.classList.add('is-invalid');
            alert('Ошибка: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Произошла ошибка при добавлении страны');
    }
}

function validateCountryName() {
    const value = countryInput.value.trim();
    const isValid = /^[А-Я][а-яА-Я\s\-']+$/.test(value) && value.length >= 2;
    
    if (value === '') {
        countryInput.classList.remove('is-valid', 'is-invalid');
        countryError.textContent = 'Пожалуйста, введите название страны';
        return false;
    }
    
    if (!isValid) {
        countryInput.classList.add('is-invalid');
        countryInput.classList.remove('is-valid');
        countryError.textContent = 'Название страны должно быть на русском и не содержать цифр';
        return false;
    }
    
    countryInput.classList.add('is-valid');
    countryInput.classList.remove('is-invalid');
    countryExistsMsg.style.display = 'none';
    return true;
}

function validateCapitalName() {
    const value = capitalInput.value.trim();
    const isValid = /^[А-Я][а-яА-Я\s\-,']+$/.test(value) && value.length >= 2;
    
    if (value === '') {
        capitalInput.classList.remove('is-valid', 'is-invalid');
        capitalError.textContent = 'Пожалуйста, введите название столицы';
        return false;
    }
    
    if (!isValid) {
        capitalInput.classList.add('is-invalid');
        capitalInput.classList.remove('is-valid');
        capitalError.textContent = 'Название столицы должно быть на русском и не содержать цифр';
        return false;
    }
    
    capitalInput.classList.add('is-valid');
    capitalInput.classList.remove('is-invalid');
    return true;
}

function checkCountryExists(countryName) {
for (const continent in allCountries) {
    if (allCountries[continent].some(
        country => country.country.toLowerCase() === countryName.toLowerCase()
    )) {
        return true;
    }
}
return false;
}

function checkCapitalExists(capitalName) {
for (const continent in allCountries) {
    if (allCountries[continent].some(
        country => country.capital.toLowerCase() === capitalName.toLowerCase()
    )) {
        return true;
    }
}
return false;
}

function resetForm() {
    countryForm.reset();
    countryInput.classList.remove('is-valid', 'is-invalid');
    capitalInput.classList.remove('is-valid', 'is-invalid');
    continentSelect.classList.remove('is-invalid');
    countryExistsMsg.style.display = 'none';
    capitalExistsMsg.style.display = 'none';
}

function updateCountrySelect() {
    const continent = deleteContinentSelect.value;
    deleteCountrySelect.innerHTML = '<option value="" selected disabled>Выберите страну</option>';
    
    if (!continent || !allCountries[continent]) {
        deleteCountrySelect.disabled = true;
        return;
    }

    const sortedCountries = [...allCountries[continent]].sort((a, b) => {
        return a.country.localeCompare(b.country, 'ru');
    });
    
    sortedCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.country;
        option.textContent = country.country;
        deleteCountrySelect.appendChild(option);
    });
    
    deleteCountrySelect.disabled = false;
}

function updateDeleteCountrySelect() {
    if (deleteContinentSelect.value) {
        updateCountrySelect();
    }
}

async function handleDeleteSubmit(e) {
    e.preventDefault();
    
    const continent = deleteContinentSelect.value;
    const country = deleteCountrySelect.value;
    
    if (!continent || !country) return;
    
    if (!confirm(`Вы уверены, что хотите удалить страну "${country}"?`)) {
        return;
    }
    
    try {
        const response = await fetch('delete_country', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                country: country,
                continent: continent
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(`Страна "${country}" успешно удалена!`);
            allCountries[continent] = allCountries[continent].filter(
                item => item.country !== country
            );
            updateCountrySelect();
            resetDeleteForm();
        } else {
            alert('Ошибка: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Произошла ошибка при удалении страны');
    }
}

function resetDeleteForm() {
    deleteForm.reset();
    deleteCountrySelect.innerHTML = '<option value="" selected disabled>Сначала выберите континент</option>';
    deleteCountrySelect.disabled = true;
}

document.addEventListener('DOMContentLoaded', init);