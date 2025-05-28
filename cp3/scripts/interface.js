/**
 * CS 132
 * Author: Bryan Oliveira
 * Date: 05/27/2025
 * 
 * @file interface.js
 * @description This file contains the REST API calling and parsing of the Countries API.
 */

(function () {
    "use strict";
    let listDiv;
    let allCountries = [];
    const API_URL = "https://restcountries.com/v3.1/all/?fields=name,region,subregion,capital,currencies,languages,flags";
    
    /**
     * Initializes the page by fetching country data and setting up the filter dropdown event.
     */
    function init() {
        listDiv = document.getElementById("list");
        const filterDropdown = document.getElementById("filter-dropdown");
        fetch(API_URL)
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
                allCountries = data;
                displayGroupedCountries("region");
            })
            .catch(handleError);
        
        if (filterDropdown) {
            filterDropdown.addEventListener("change", () => {
                displayGroupedCountries(filterDropdown.value);
            });
        }
    }

    /**
     * Displays a user-friendly error message on the page.
     * @param {Error} error - The error object.
     */
    function handleError(error) {
        if (!listDiv) {
            listDiv = document.getElementById("list");
        }
        listDiv.innerHTML = "";
        const msg = document.createElement("p");
        msg.textContent = "Sorry, we couldn't load country data at this time. Please try again later.";
        msg.style.color = "red";
        msg.style.fontWeight = "bold";
        listDiv.appendChild(msg);
    }

    /**
     * Groups and displays countries based on the selected filter.
     * @param {string} filter - The filter type (region, subregion, currency, language).
     */
    function displayGroupedCountries(filter) {
        let grouped, sorted;
        if (filter === "subregion") {
            grouped = groupByRegionAndSubregion(allCountries);
            displayRegionsWithSubregions(grouped);
            return;
        }
        switch (filter) {
            case "region":
                grouped = groupBySingleKey(allCountries, "region");
                break;
            case "currency":
                grouped = groupByCurrency(allCountries);
                break;
            case "language":
                grouped = groupByLanguage(allCountries);
                break;
            default:
                grouped = groupBySingleKey(allCountries, "region");
        }
        sorted = sortGroupsByCount(grouped);
        displayRegions(sorted);
    }

    /**
     * Groups countries by region and subregion.
     * @param {Array} data - Array of country objects.
     * @returns {Object} Nested object mapping regions to subregions to country arrays.
     */
    function groupByRegionAndSubregion(data) {
        const map = {};
        data.forEach(country => {
            const region = country.region;
            const subregion = country.subregion;
            if (!map[region]) {
                map[region] = {};
            }
            if (!map[region][subregion]) {
                map[region][subregion] = [];
            }
            map[region][subregion].push(country);
        });
        return map;
    }

    /**
     * Groups countries by a single key (region, etc).
     * @param {Array} data - Array of country objects.
     * @param {string} key - The key to group by.
     * @returns {Object} Object mapping key values to arrays of countries.
     */
    function groupBySingleKey(data, key) {
        const map = {};
        data.forEach(country => {
            const value = country[key];
            if (!map[value]) {
                map[value] = [];
            }
            map[value].push(country);
        });
        return map;
    }

    /**
     * Groups countries by each currency name.
     * @param {Array} data - Array of country objects.
     * @returns {Object} Object mapping currency names to arrays of countries.
     */
    function groupByCurrency(data) {
        const map = {};
        data.forEach(country => {
            const currencyArr = Object.values(country.currencies);
            for (let i = 0; i < currencyArr.length; i++) {
                const code = currencyArr[i];
                const currencyName = code.name;
                if (!map[currencyName]) {
                    map[currencyName] = [];
                }
                map[currencyName].push(country);
            }
        });
        return map;
    }

    /**
     * Groups countries by each language.
     * @param {Array} data - Array of country objects.
     * @returns {Object} Object mapping language names to arrays of countries.
     */
    function groupByLanguage(data) {
        const map = {};
        data.forEach(country => {
            const langArr = Object.values(country.languages);
            for (let i = 0; i < langArr.length; i++) {
                const lang = langArr[i];
                if (!map[lang]) {
                    map[lang] = [];
                }
                map[lang].push(country);
            }
        });
        return map;
    }

    /**
     * Sorts grouped country arrays by descending group size.
     * @param {Object} grouped - Object mapping group names to arrays of countries.
     * @returns {Array} Array of [groupName, countriesArray] sorted by length.
     */
    function sortGroupsByCount(grouped) {
        return Object.entries(grouped).sort(function(a, b) {
            return b[1].length - a[1].length;
        });
    }

    /**
     * Displays regions and their countries in the DOM.
     * @param {Array} sortedRegions - Array of [region, countries] pairs.
     */
    function displayRegions(sortedRegions) {
        listDiv.innerHTML = "";
        sortedRegions.forEach(function([region, countries]) {
            const regionDiv = createRegionDiv(region, countries);
            listDiv.appendChild(regionDiv);
        });
    }

    /**
     * Displays regions with their subregions and countries in the DOM.
     * @param {Object} regionMap - Nested object mapping regions to subregions to country arrays.
     */
    function displayRegionsWithSubregions(regionMap) {
        listDiv.innerHTML = "";
        const sortedRegions = Object.entries(regionMap).sort(function(a, b) {
            const aCount = Object.values(a[1]).reduce(function(sum, arr) { return sum + arr.length; }, 0);
            const bCount = Object.values(b[1]).reduce(function(sum, arr) { return sum + arr.length; }, 0);
            return bCount - aCount;
        });
        sortedRegions.forEach(function([region, subregions]) {
            const regionDiv = document.createElement("div");
            regionDiv.className = "region";
            const h3 = document.createElement("h3");
            h3.textContent = region;
            regionDiv.appendChild(h3);

            const sortedSubregions = Object.entries(subregions).sort(function(a, b) {
                return b[1].length - a[1].length;
            });
            sortedSubregions.forEach(function([subregion, countries]) {
                regionDiv.appendChild(createSubregionDiv(subregion, countries));
            });

            listDiv.appendChild(regionDiv);
        });
    }

    /**
     * Creates a region div containing a header and a grid of country cards.
     * @param {string} region - The region name.
     * @param {Array} countries - Array of country objects in the region.
     * @returns {HTMLElement} The region div element.
     */
    function createRegionDiv(region, countries) {
        const regionDiv = document.createElement("div");
        regionDiv.className = "region";
        const h3 = document.createElement("h3");
        h3.textContent = region;
        regionDiv.appendChild(h3);

        const grid = document.createElement("div");
        grid.className = "country-grid";
        countries
            .sort(function(a, b) {
                return a.name.common.localeCompare(b.name.common);
            })
            .forEach(function(country) {
                grid.appendChild(createCountryCard(country));
            });
        regionDiv.appendChild(grid);

        return regionDiv;
    }

    /**
     * Creates a subregion div containing a header and a grid of country cards.
     * @param {string} subregion - The subregion name.
     * @param {Array} countries - Array of country objects in the subregion.
     * @returns {HTMLElement} The subregion div element.
     */
    function createSubregionDiv(subregion, countries) {
        const subregionDiv = document.createElement("div");
        subregionDiv.className = "subregion";
        const h4 = document.createElement("h4");
        h4.textContent = subregion;
        subregionDiv.appendChild(h4);

        const grid = document.createElement("div");
        grid.className = "country-grid";
        countries
            .sort(function(a, b) {
                return a.name.common.localeCompare(b.name.common);
            })
            .forEach(function(country) {
                grid.appendChild(createCountryCard(country));
            });
        subregionDiv.appendChild(grid);

        return subregionDiv;
    }

    /**
     * Creates a country card element displaying country information.
     * @param {Object} country - The country object.
     * @returns {HTMLElement} The country card div element.
     */
    function createCountryCard(country) {
        const name = country.name.common;
        const flagUrl = country.flags.svg;

        let region = country.region;

        let capital = "N/A";
        if (country.capital && Array.isArray(country.capital)) {
            capital = country.capital.join(", ");
        } else if (country.capital) {
            capital = country.capital;
        }

        let currencies = "N/A";
        if (country.currencies) {
            const currencyArr = Object.values(country.currencies);
            const currencyNames = [];
            for (let i = 0; i < currencyArr.length; i++) {
                currencyNames.push(currencyArr[i].name);
            }
            if (currencyNames.length > 0) {
                currencies = currencyNames.join(", ");
            }
        }

        let languages = "N/A";
        if (country.languages) {
            const langArr = Object.values(country.languages);
            if (langArr.length > 0) {
                languages = langArr.join(", ");
            }
        }

        const countryCard = document.createElement("div");
        countryCard.className = "country-card";

        const nameHeader = document.createElement("h5");
        nameHeader.textContent = name;

        const img = document.createElement("img");
        img.src = flagUrl;
        img.alt = name + " flag";

        const info = document.createElement("div");
        info.className = "country-info";

        const regionP = document.createElement("p");
        const regionLabel = document.createElement("strong");
        regionLabel.textContent = "Region: ";
        regionP.appendChild(regionLabel);
        regionP.appendChild(document.createTextNode(region));
        info.appendChild(regionP);

        const capitalP = document.createElement("p");
        const capitalLabel = document.createElement("strong");
        capitalLabel.textContent = "Capital: ";
        capitalP.appendChild(capitalLabel);
        capitalP.appendChild(document.createTextNode(capital));
        info.appendChild(capitalP);

        const currenciesP = document.createElement("p");
        const currenciesLabel = document.createElement("strong");
        currenciesLabel.textContent = "Currencies: ";
        currenciesP.appendChild(currenciesLabel);
        currenciesP.appendChild(document.createTextNode(currencies));
        info.appendChild(currenciesP);

        const languagesP = document.createElement("p");
        const languagesLabel = document.createElement("strong");
        languagesLabel.textContent = "Languages: ";
        languagesP.appendChild(languagesLabel);
        languagesP.appendChild(document.createTextNode(languages));
        info.appendChild(languagesP);

        countryCard.appendChild(nameHeader);
        countryCard.appendChild(img);
        countryCard.appendChild(info);
        return countryCard;
    }

    init();
})();