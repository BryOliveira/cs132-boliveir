/**
 * CS 132
 * Author: Bryan Oliveira
 * Date: 05/03/2025
 * 
 * @file dl-handler.js
 * @description This file contains the logic for switching files formats for 
 * my resume.
 */


/** 
 * Returns nothing.
 * Initializes event handlers to change the file format based
 * on user selection
 * @param {void}
 * @returns {void}
 */
function init() {
    const fileButton = qs('#file-btn');
    const formatSelect = qs('#format-dropdown');

    if (fileButton && formatSelect) {
        fileButton.addEventListener('click', () => {
            const handler = dropdownChecker(formatSelect.value);
            handler();
        });
    }
}
/** 
 * Takes in the value of the dropdown to return the proper function to be called
 * @param {object} dropdown value attribute
 * @returns {function} the function that will be called by the handler 
 */
function dropdownChecker(val) {
    if (val == 'pdf') {
        return newTabFile;
    } 
    return downloadFile;
}

/**
 * Returns nothing.
 * Opens the pdf in a new tab
 * @param {void}
 * @returns {void}
 */
function newTabFile() {
    window.open('./files/boliveir.pdf', '_blank').focus();
}

/**
 * Returns nothing.
 * Downloads the tex file
 * @param {void}
 * @returns {void}
 */
function downloadFile() {
    window.open('./files/boliveir.tex');
}

init();