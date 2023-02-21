import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const ref = {
  countryInfo: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
  searchBox: document.querySelector('#search-box'),
};

function countriesInfo(countries) {
  const markup = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `
        <img src="${flags.svg}" alt="flag" width="40px">
        <h1 class="country-name">${name.official}</h1>
        <p class="country-text"><b>Capital:</b> ${capital}</p>
        <p class="country-text"><b>Population:</b> ${population}</p>
        <p class="country-text"><b>Languages:</b> ${Object.values(
          languages
        )}</p>`;
    })
    .join('');
  return markup;
}

function countriesList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `
         <li>
        <img src="${flags.svg}" alt="flag" width="30px">
        <h2 class="country-name">${name.official}</h2>
        </li>
     `;
    })
    .join('');
  return markup;
}

function search() {
  const searchName = ref.searchBox.value.trim();
  if (searchName === '') {
    ref.countryList.innerHTML = '';
    ref.countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(searchName)
    .then(countries => {
      ref.countryList.innerHTML = '';
      ref.countryInfo.innerHTML = '';
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (countries.length > 1 && countries.length <= 10) {
        ref.countryList.innerHTML = countriesList(countries);
        ref.countryInfo.innerHTML = '';
      }

      if (countries.length === 1) {
        ref.countryInfo.innerHTML = countriesInfo(countries);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      ref.countryList.innerHTML = '';
      ref.countryInfo.innerHTML = '';
      return error;
    });
}

ref.searchBox.addEventListener('input', debounce(search, DEBOUNCE_DELAY));
