/**
 * CS 132
 * Author: Bryan Oliveira
 * Date: 06/06/2025
 * 
 * @file interface.js
 * @description This file contains the fetching of the programming language API as well as 
 * populating the table, and providing the information from the parsed JSON object.
 */

(function () {
    "use strict";
    let allLanguages = {};
    let paradigms = new Set();

    /**
     * Simply calls fetchLanguages on initialization
     */
    function init() {
        const url = "/languages";
        fetchLanguages(url);
    }

    /**
     * Fetches details for a specific language by name and displays the result in an alert.
     * If the fetch fails, displays an error message.
     *
     * @async
     * @function
     * @param {string} name - The name of the language to fetch details for.
     * @returns {Promise<void>} Resolves when the operation is complete.
     */
    async function getLanguage(name) {
        try {
            const resp = await fetch(`/languages/${encodeURIComponent(name)}`);
            checkStatus(resp);
            const text = await resp.text();
            alert(text);
        } catch (err) {
            showError("Could not fetch language details.");
        }
    }

    /**
     * Fetches programming languages data from the specified URL and updates the UI accordingly.
     *
     * @async
     * @function fetchLanguages
     * @param {string} url - The endpoint URL to fetch the languages data from.
     * @returns {Promise<void>} Resolves when the data has been fetched and UI updated.
     * @throws Will handle errors via handleError if the fetch or processing fails.
     */
    async function fetchLanguages(url) {
        try {
            const resp = await fetch(url);
            checkStatus(resp);
            const data = await resp.json();
            allLanguages = data;
            parseParadigms(data);
            populateParadigmFilters();
            populateTable(data);
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Displays a user-friendly error message on the page.
     * @param {Error} error - The error object.
     */
    function handleError(error) {
        const body = qs("body");
        const footer = qs("footer");
        const warning = document.createElement("h3");
        warning.textContent = `Could not load languages due to ${error}`;
        body.insertBefore(warning, footer);
        setTimeout(() => {
            body.removeChild(warning);
        }, 10000);
    }

    /**
     * Extracts and adds all paradigms from the provided data object to the global 'paradigms' set.
     * 
     * @param {Object} data - An object where each key maps to an object containing a 'paradigm' array.
     */
    function parseParadigms(data) {
        for (let key in data) {
            data[key].paradigm.forEach(p => paradigms.add(p));
        }
    }

    /**
     * Populates the paradigm filter section with checkboxes for each paradigm.
     * Each checkbox allows the user to filter results based on the selected paradigms.
     * Assumes the existence of a global `paradigms` array and a `filterResults` function.
     */
    function populateParadigmFilters() {
        const filtersDiv = qs("#filters");
        const label = document.createElement("p");
        label.textContent = "Filter by Paradigm:";
        filtersDiv.appendChild(document.createElement("br"));
        paradigms.forEach(paradigm => {
            const paradigmLabel = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = paradigm;
            checkbox.addEventListener("change", filterResults);
            paradigmLabel.appendChild(checkbox);
            paradigmLabel.appendChild(document.createTextNode(" " + paradigm));
            filtersDiv.appendChild(paradigmLabel);
            filtersDiv.appendChild(document.createElement("br"));
        })
    }

    /**
     * Filters the list of programming languages based on the checked paradigms in the filter UI.
     * If no paradigms are selected, displays all languages.
     * Otherwise, only displays languages that include all selected paradigms.
     */
    function filterResults() {
        const checked = Array.from(qsa("#filters input[type=checkbox]:checked")).map(cb => cb.value);
        if (checked.length == 0) {
            populateTable(allLanguages);
            return;
        }
        const filtered = {};
        for (let key in allLanguages) {
            const lang = allLanguages[key];
            const langParadigms = lang.paradigm.map(p => p.toLowerCase());
            if (checked.every(p => langParadigms.includes(p.toLowerCase()))) {
                filtered[key] = lang;
            }
        }
        populateTable(filtered);
    }

    /**
     * Populates an HTML table with programming language data.
     * 
     * This function replaces the current <tbody> of the table with a new one,
     * where each row represents a programming language and displays its name,
     * release date, paradigms, common uses, and a Wikipedia link.
     * 
     * @param {Object} data - An object where each key is a language identifier and each value is an object containing:
     *   @param {string} data[*].formattedName - The display name of the language.
     *   @param {string} data[*].releaseDate - The release date of the language.
     *   @param {string[]} data[*].paradigm - An array of programming paradigms.
     *   @param {string[]} data[*].commonUses - An array of common use cases.
     *   @param {string} data[*].wikiLink - A URL to the language's Wikipedia page.
     */
    function populateTable(data) {
        const table = qs("table");
        const oldTbody = qs("tbody");
        if (oldTbody) {
            table.removeChild(oldTbody);
        }
        const tbody = document.createElement("tbody");
        for (let key in data) {
            const lang = data[key];
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            const link = document.createElement("a");
            link.href = '#';
            link.textContent = lang.formattedName;
            link.addEventListener("click", () => getLanguage(key));
            nameCell.appendChild(link);
            row.appendChild(nameCell);

            const dateCell = document.createElement("td");
            dateCell.textContent = lang.releaseDate;
            row.appendChild(dateCell);

            const paradigmCell = document.createElement("td");
            const paradigmList = document.createElement("ul");
            lang.paradigm.forEach(p => {
                const li = document.createElement("li");
                li.textContent = p;
                paradigmList.appendChild(li);
            });
            paradigmCell.appendChild(paradigmList);
            row.appendChild(paradigmCell);

            const usesCell = document.createElement("td");
            const usesList = document.createElement("ul");
            lang.commonUses.forEach(u => {
                const li = document.createElement("li");
                li.textContent = u;
                usesList.appendChild(li);
            });
            usesCell.appendChild(usesList);
            row.appendChild(usesCell);

            const infoCell = document.createElement("td");
            const infoLink = document.createElement("a");
            infoLink.href = lang.wikiLink;
            infoLink.textContent = `${lang.formattedName} Wikipedia Link`;
            infoCell.appendChild(infoLink);
            row.appendChild(infoCell);

            tbody.appendChild(row);
        }
        table.appendChild(tbody);
    }

    init();
})();