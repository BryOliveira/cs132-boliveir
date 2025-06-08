# Languages Galore API Documentation

---

## GET /languages

**Description:**  
Returns all programming languages as a JSON object. Optionally filter by paradigm using a query parameter.

**Method:**  
`GET`

**Query Parameters:**

- **Optional:**
  - `paradigm=[string]`  
    Filter results to only include languages that support the given paradigm (case-insensitive).  
    Example: `/languages?paradigm=functional`

**Success Response:**

- **Code:** 200  
- **Content:**  
    ```json
    {
      "python": {
        "formattedName": "Python",
        "paradigm": ["interpreted", "object-oriented", "procedural"],
        "releaseDate": "1991",
        "commonUses": ["web development", "data science", "scripting", "automation"],
        "wikiLink": "https://en.wikipedia.org/wiki/Python_(programming_language)"
      },
      ...
    }
    ```

**Error Response:**

- **Code:** 500  
  **Content:** `"Server error reading languages data."`

**Sample Call:**

```bash
curl http://localhost:8000/languages
curl http://localhost:8000/languages?paradigm=object-oriented
```

---

## GET /languages/:name

**Description:**  
Returns plain text information about a specific programming language.

**Method:**  
`GET`

**URL Parameters:**

- **Required:**
  - `name=[string]`  
    The key name of the language (e.g., `python`, `java`, `ocaml`).

**Success Response:**

- **Code:** 200  
- **Content:**  
    ```
    Python (1991)
    Paradigms: interpreted, object-oriented, procedural
    Common uses: web development, data science, scripting, automation
    ```

**Error Response:**

- **Code:** 404  
  **Content:** `Language 'xyz' not found.`

- **Code:** 500  
  **Content:** `"Server error reading languages data."`

**Sample Call:**

```bash
curl http://localhost:8000/languages/python
```

---

## Notes

- All endpoints are read-only (`GET`).
- The `/languages` endpoint supports filtering by paradigm using the `paradigm` query parameter.
- The `/languages/:name` endpoint returns plain text, not JSON.
- Paradigm names and language names are case-insensitive.
- If you request a language that does not exist, you will receive a 404 error with a descriptive message.