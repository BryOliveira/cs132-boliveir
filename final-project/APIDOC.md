# Comeback E-Commerce API Documentation

This document describes the API endpoints for the Comeback injury equipment e-commerce project.

---

## Table of Contents

- [Products](#products)
- [Items](#items)
- [FAQs](#faqs)
- [Feedback](#feedback)
- [Loyalty Program](#loyalty-program)

---

## Products

### Get All Products

**GET** `/products`

- **Description:** Returns all products.
- **Response:** `200 OK`  
  ```json
  [ { "id": "0", "name": "...", ... }, ... ]
  ```

---

### Get Products by Category

**GET** `/products/:category`

- **Description:** Returns all products in a category.
- **Params:**  
  - `category` (string): Category name (e.g. "rehab")
- **Response:** `200 OK`  
  ```json
  [ { "id": "0", "name": "...", "category": "rehab", ... }, ... ]
  ```

---

### Get Products by Category and Subcategory

**GET** `/products/:category/:subcategory`

- **Description:** Returns all products in a category and subcategory.
- **Params:**  
  - `category` (string)
  - `subcategory` (string)
- **Response:** `200 OK`  
  ```json
  [ { "id": "0", "name": "...", "category": "rehab", "subcategory": "Resistance Training", ... }, ... ]
  ```

---

## Items

### Get Single Item

**GET** `/item/:category/:subcategory/:id`

- **Description:** Returns a single product by id, category, and subcategory.
- **Params:**  
  - `category` (string)
  - `subcategory` (string)
  - `id` (string)
- **Response:** `200 OK`  
  ```json
  { "id": "0", "name": "...", ... }
  ```
- **Errors:**  
  - `400 Bad Request` if not found

---

## FAQs

### Get All FAQs

**GET** `/faqs`

- **Description:** Returns all frequently asked questions.
- **Response:** `200 OK`  
  ```json
  [ { "question": "...", "answer": "..." }, ... ]
  ```

---

## Feedback

### Submit Feedback

**POST** `/feedback`

- **Description:** Submits user feedback.
- **Request Body:**  
  ```json
  {
    "name": "string",
    "email": "string",
    "subject": "string",
    "message": "string"
  }
  ```
- **Response:** `200 OK`  
  ```json
  { "success": true }
  ```
- **Errors:**  
  - `400 Bad Request` if any field is missing

---

## Loyalty Program

### Sign Up

**POST** `/loyalty/signup`

- **Description:** Registers a new loyalty program user.
- **Request Body:**  
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string"
  }
  ```
- **Response:** `200 OK`  
  ```json
  { "success": true }
  ```
- **Errors:**  
  - `400 Bad Request` if any field is missing or email is already registered

---

### Login

**POST** `/loyalty/login`

- **Description:** Logs in a loyalty program user by email.
- **Request Body:**  
  ```json
  {
    "email": "string"
  }
  ```
- **Response:** `200 OK`  
  ```json
  { "success": true, "user": { "name": "...", "email": "...", "phone": "...", ... } }
  ```
- **Errors:**  
  - `400 Bad Request` if email is missing or not found

---

### Get All Loyalty Users

**GET** `/loyalty`

- **Description:** Returns all loyalty program users.
- **Response:** `200 OK`  
  ```json
  [ { "name": "...", "email": "...", "phone": "...", ... }, ... ]
  ```

---

## Error Handling

- All endpoints return `500 Internal Server Error` for unexpected server errors.
- All endpoints return `400 Bad Request` for missing or invalid parameters.

---

## Data Files

- `data/products.json` — Product data
- `data/faqs.json` — FAQ data
- `data/feedback.json` — Feedback submissions
- `data/loyalty.json` — Loyalty program users

---

## Notes

- All POST requests require `Content-Type: application/json`.
- All endpoints are relative to the server root (e.g. `http://localhost:8000/`).

---