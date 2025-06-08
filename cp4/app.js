/**
 * CS 132
 * Author: Bryan Oliveira
 * Date: 06/06/2025
 * 
 * @file app.js
 * @description This file is the node file initalizing the languages API.
 */
"use strict";
const path = require("path");
const express = require('express');
const app = express();
const fs = require("fs/promises");

app.use(express.static("public"));

const PORT = process.env.PORT || 8000;
const LANGUAGES_FILE = path.join(__dirname, "api", "languages.json");

/**
 * Helper function to format language info as plain text.
 * @param {Object} info - The information object for the programming language.
 * @returns {string} A formatted string with the language's name, release date, paradigms, and common uses.
 */
function formatLanguageText(info) {
    return `${info.formattedName} (${info.releaseDate})\n` +
           `Paradigms: ${info.paradigm.join(", ")}\n` +
           `Common uses: ${info.commonUses.join(", ")}`;
}

app.get("/languages", async (req, res) => {
    /**
     * Reads the contents of LANGUAGES_FILE asynchronously and parses it as JSON.
     * @type {Object}
     * @constant
     * @throws {SyntaxError} If the file content is not valid JSON.
     * @throws {Error} If there is an error reading the file.
     */
    try {
        const data = JSON.parse(await fs.readFile(LANGUAGES_FILE, "utf8"));
        let result = data;
        if (req.query.paradigm) {
            const paradigm = req.query.paradigm.toLowerCase();
            result = {};
            for (let key in data) {
                if (data[key].paradigm.map(p => p.toLowerCase()).includes(paradigm)) {
                    result[key] = data[key];
                }
            }
        }
        res.json(result);
    } catch (err) {
        res.status(500).type("text").send("Server error reading languages data.");
    }
});

app.get("/languages/:name", async (req, res) => {
    /**
     * Constructs a formatted string containing information about a programming language.
     *
     * @param {Object} info - The information object for the programming language.
     * @param {string} info.formattedName - The formatted name of the language.
     * @param {string} info.releaseDate - The release date of the language.
     * @param {string[]} info.paradigm - The paradigms associated with the language.
     * @param {string[]} info.commonUses - The common uses of the language.
     * @returns {string} A formatted string with the language's name, release date, paradigms, and common uses.
     */
    try {
        const data = JSON.parse(await fs.readFile(LANGUAGES_FILE, "utf8"));
        const lang = req.params.name.toLowerCase();
        if (!data[lang]) {
            res.status(404).type("text").send(`Language '${req.params.name}' not found.`);
            return;
        }
        const info = data[lang];
        let text = formatLanguageText(info);
        res.type("text").send(text);
    } catch (err) {
        res.status(500).type("text").send("Server error reading languages data.");
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});