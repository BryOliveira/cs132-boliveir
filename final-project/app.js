/**
 * CS 132
 * Author: Bryan Oliveira
 * Date: 06/10/2025
 * 
 * @file app.js
 * @description Node.js/Express server handling API endpoints for the Comeback e-commerce project.
 */

"use strict";
const path = require("path");
const express = require('express');
const app = express();
const fs = require("fs/promises");

app.use(express.json()); // Parse JSON bodies
app.use(express.static("public"));

const PORT = process.env.PORT || 8000;
const PRODUCTS_FILE = path.join(__dirname, "data", "products.json");
const FAQS_FILE = path.join(__dirname, "data", "faqs.json");
const FEEDBACK_FILE = path.join(__dirname, "data", "feedback.json");
const LOYALTY_FILE = path.join(__dirname, "data", "loyalty.json");
const SERVER_ERROR = 500;
const CLIENT_ERROR = 400;

/**
 * Reads and parses the products JSON file.
 * @param {string} filePath - Path to products file.
 * @returns {Promise<Array>} Array of product objects.
 */
async function getProducts(filePath) {
    try {
        const products = JSON.parse(await fs.readFile(filePath, "utf8"));
        return products;
    } catch (err) {
        throw err;
    }
}

/**
 * Reads and parses the FAQs JSON file.
 * @param {string} filePath - Path to faqs file.
 * @returns {Promise<Array>} Array of FAQ objects.
 */
async function getFAQs(filePath) {
    try {
        const faqs = JSON.parse(await fs.readFile(filePath, "utf8"));
        return faqs;
    } catch (err) { 
        throw err;
    }
}

/**
 * GET /products
 * Returns all products.
 */
app.get("/products", async (req, res) => {
    try {
        const products = await getProducts(PRODUCTS_FILE);
        res.json(products);
    } catch (err) {
        res.status(SERVER_ERROR).json({ error: "Could not read products." });
    }
});

/**
 * GET /products/:category
 * Returns all products in a given category.
 */
app.get("/products/:category", async (req, res) => {
    try {
        const products = await getProducts(PRODUCTS_FILE);
        const category = req.params.category;
        const filteredProducts = products.filter(product => product.category === category);
        res.json(filteredProducts);
    } catch (err) {
        res.status(SERVER_ERROR).json({ error: "Could not read products." });
    }
});

/**
 * GET /products/:category/:subcategory
 * Returns all products in a given category and subcategory.
 */
app.get("/products/:category/:subcategory", async (req, res) => {
    try {
        const products = await getProducts(PRODUCTS_FILE);
        const category = req.params.category;
        const subcategory = req.params.subcategory;
        const filteredProducts = products.filter(product => product.category === category && product.subcategory === subcategory);
        res.json(filteredProducts);
    } catch (err) {
        res.status(SERVER_ERROR).json({ error: "Could not read products." });
    }
});

/**
 * GET /item/:category/:subcategory/:id
 * Returns a single product by id, category, and subcategory.
 */
app.get("/item/:category/:subcategory/:id", async (req, res) => {
    try {
        const products = await getProducts(PRODUCTS_FILE);
        const id = req.params.id;
        const item = products[id];
        if (item) {
            res.json(item);
        } else {
            res.status(CLIENT_ERROR).json({ error: "Product not found" });
        }
    } catch (err) {
        res.status(SERVER_ERROR).json({ error: "Could not read products." });
    }
});

/**
 * GET /faqs
 * Returns all FAQs.
 */
app.get("/faqs", async (req, res) => {
    try {
        const faqs = await getFAQs(FAQS_FILE);
        res.json(faqs);
    } catch (err) {
        res.status(SERVER_ERROR).json({ error: "Could not read FAQs." });
    }
});

/**
 * POST /loyalty/signup
 * Registers a new loyalty program user.
 * Expects: { name, email, phone }
 */
app.post("/loyalty/signup", async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            return res.status(CLIENT_ERROR).json({ error: "All fields required." });
        }
        let users = [];
        try {
            const fileData = await fs.readFile(LOYALTY_FILE, "utf8");
            if (fileData.trim()) users = JSON.parse(fileData);
        } catch (err) {
            users = [];
            console.error("Error reading loyalty file:", err);
            return res.status(SERVER_ERROR).json({ error: "Could not read loyalty data." });
        }
        // Prevent duplicate emails
        if (users.some(u => u.email === email)) {
            return res.status(CLIENT_ERROR).json({ error: "Email already registered." });
        }
        users.push({ name, email, phone, joined: new Date().toISOString() });
        await fs.writeFile(LOYALTY_FILE, JSON.stringify(users, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(SERVER_ERROR).json({ error: "Could not save loyalty user." });
    }
});

/**
 * POST /loyalty/login
 * Logs in a loyalty user by email.
 * Expects: { email }
 */
app.post("/loyalty/login", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(CLIENT_ERROR).json({ error: "Email required." });
        }
        let users = [];
        try {
            const fileData = await fs.readFile(LOYALTY_FILE, "utf8");
            if (fileData.trim()) users = JSON.parse(fileData);
        } catch (err) {
            users = [];
            console.error("Error reading loyalty file:", err);
            return res.status(SERVER_ERROR).json({ error: "Could not read loyalty data." });
        }
        const found = users.find(u => u.email === email);
        if (found) {
            res.json({ success: true, user: found });
        } else {
            res.status(CLIENT_ERROR).json({ error: "No account found with that email." });
        }
    } catch (err) {
        res.status(SERVER_ERROR).json({ error: "Login error." });
    }
});

/**
 * POST /feedback
 * Submits user feedback.
 * Expects: { name, email, subject, message }
 */
app.post("/feedback", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(CLIENT_ERROR).json({ error: "All fields are required." });
        }
        let feedbackArr = [];
        try {
            const fileData = await fs.readFile(FEEDBACK_FILE, "utf8");
            if (fileData.trim()) {
                feedbackArr = JSON.parse(fileData);
            }
        } catch (err) {
            feedbackArr = [];
            console.error("Error reading feedback file:", err);
            return res.status(SERVER_ERROR).json({ error: "Could not read feedback data." });
        }
        feedbackArr.push({
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        });
        await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbackArr, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(SERVER_ERROR).json({ error: "Could not save feedback." });
    }
});

/**
 * Starts the server.
 */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});