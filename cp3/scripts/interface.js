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
    
    function init() {
        const apiURL = "https://restcountries.com/v3.1/all/?fields=name,region,subregion,capital,currencies,languages,flags";
        listDiv = document.getElementById("list");
        const filterDropdown = document.getElementById("filter-dropdown");
        fetch(apiURL)
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
                allCountries = data;
                displayGroupedCountries("region");
            })
            .catch(error => console.error("Error fetching data:", error));
        
        if (filterDropdown) {
            filterDropdown.addEventListener("change", () => {
                displayGroupedCountries(filterDropdown.value);
            });
        }
    }

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

    function sortGroupsByCount(grouped) {
        return Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);
    }

    function displayRegions(sortedRegions) {
        listDiv.innerHTML = "";
        sortedRegions.forEach(([region, countries]) => {
            const regionDiv = createRegionDiv(region, countries);
            listDiv.appendChild(regionDiv);
        });
    }

    function displayRegionsWithSubregions(regionMap) {
        listDiv.innerHTML = "";
        const sortedRegions = Object.entries(regionMap).sort((a, b) => {
            const aCount = Object.values(a[1]).reduce((sum, arr) => sum + arr.length, 0);
            const bCount = Object.values(b[1]).reduce((sum, arr) => sum + arr.length, 0);
            return bCount - aCount;
        });
        sortedRegions.forEach(([region, subregions]) => {
            const regionDiv = document.createElement("div");
            regionDiv.className = "region";
            const h3 = document.createElement("h3");
            h3.textContent = region;
            regionDiv.appendChild(h3);

            const sortedSubregions = Object.entries(subregions).sort((a, b) => b[1].length - a[1].length);
            sortedSubregions.forEach(([subregion, countries]) => {
                regionDiv.appendChild(createSubregionDiv(subregion, countries));
            });

            listDiv.appendChild(regionDiv);
        });
    }

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