/**
 * CS 132
 * Author: Bryan Oliveira
 * Date: 06/10/2025
 * 
 * @file app.js
 * @description This file is the node file handling the endpoints of the products 
 * for the e-commerce Comeback page.
 */
"use strict";
const path = require("path");
const express = require('express');
const app = express();
const fs = require("fs/promises");

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
const PRODUCTS_FILE = path.join(__dirname, "data", "products.json");

