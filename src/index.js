import './css/styles.css';
import fetchCountries from "./js/fetchCountries";
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const input = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");
const DEBOUNCE_DELAY = 300;

input.addEventListener("input", debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(evt) {
    evt.preventDefault();

    if (!evt.target.value) {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        return;
    }

    const name = evt.target.value.trim();

    fetchCountries(name).then(getCountries).catch(errorMessage)
}

function getCountries(country) {
    if (country.length === 1) {
        countryList.innerHTML = '';
        createCardCountry(country);
    } else if (country.length >= 2 && country.length <= 10) {
        countryInfo.innerHTML = '';
        createListCountries(country);
        refineRequestMessage();
    } else {
        countryInfo.innerHTML = '';
        errorMessage();
    }
}

function createListCountries(countries) {
    const markupListCountries = countries
        .map(({ name, flags }) => {
            `<li>
                <img src="${flags.svg}" alt="${flags.alt}" width="50", height="25">
                ${name.official}
            </li>`;
        }).join("");
    countryList.innerHTML = markupListCountries;
}

function createCardCountry(country) {
    const markupCardCountry = country.map(({ name, capital, population, flags, languages }) => {
        `<div class="card-country">
            <img src="${flags.svg}" alt="${flags.alt}" width="50", height="28">
            <h1 class="name-country">${name.official}</h1>
        </div>
        <div class="card-country-container">
            <p><b>Capital: </b>${capital}</p>
            <p><b>Population: </b>${population}</p>
            <p><b>Languages: </b>${languages}</p>
        </div>`
        }).join();
    countryInfo.innerHTML = markupCardCountry;
}

function refineRequestMessage() {
    Notify.info("Too many matches found. Please enter a more specific name.",{
        timeout: 5000,
        width: "400px",
        fontSize: "18px",
        position: "right-top"
    },);
}

function errorMessage() {
    Notify.failure("Oops, there is no country with that name.",{
        timeout: 5000,
        width: "400px",
        fontSize: "18px",
        position: "right-top"
    },);
}
