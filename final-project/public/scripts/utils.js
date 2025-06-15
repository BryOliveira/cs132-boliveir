/**
 * CS 132
 * Provided global DOM accessor aliases.
 * These are the ONLY functions that should be global in your submissions.
 * Author: Prof. Hovik
 */

/**
 * Returns the first element that matches the given CSS selector.
 * @param {string} selector - CSS query selector string.
 * @returns {object} first element matching the selector in the DOM tree (null if none)
 */
function qs(selector) {
    return document.querySelector(selector);
}

/**
 * Returns the array of elements that match the given CSS selector.
 * @param {string} selector - CSS query selector
 * @returns {object[]} array of DOM objects matching the query (empty if none).
 */
function qsa(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Returns a new element with the given tagname
 * @param {string} tagName - name of element to create and return
 * @returns {object} new DOM element with the given tagname
 */
function gen(tagName) {
    return document.createElement(tagName);
}

/**
 * (New) Lecture 11: Helper function to return the Response data if successful, otherwise
 * returns an Error that needs to be caught.
 * @param {object} response - response with status to check for success/error.
 * @returns {object} - The Response object if successful, otherwise an Error that
 * needs to be caught.
 */
function checkStatus(response) {
    if (!response.ok) { // response.status >= 200 && response.status < 300
        throw Error(`Error in request: ${response.statusText}`);
    } // else, we got a response back with a good status code (e.g. 200)
    return response; // A resolved Response object.
}

// Utility function (used by item.js and products.js) to populate the
// breadcrumb navigation bar.
function populateBreadCrumbs(category = null, subcategory = null, item = null, categoriesList = null) {
    const crumbNav = qs('.crumbs ul');
    if (!crumbNav) return;
    crumbNav.innerHTML = '';

    const homeLi = gen('li');
    const homeLink = gen('a');
    homeLink.href = "index.html";
    homeLink.textContent = "Home";
    homeLi.appendChild(homeLink);
    crumbNav.appendChild(homeLi);

    const productsLi = gen('li');
    const productsLink = gen('a');
    productsLink.href = "products.html";
    productsLink.textContent = "Products";
    productsLi.appendChild(productsLink);
    crumbNav.appendChild(productsLi);

    if (category) {
        const catLi = gen('li');
        const catLink = gen('a');
        catLink.href = `products.html?category=${encodeURIComponent(category)}`;
        catLink.textContent = categoriesList[category][0];
        catLi.appendChild(catLink);
        crumbNav.appendChild(catLi);
    }

    if (subcategory) {
        const subcatLi = gen('li');
        const subcatLink = gen('a');
        subcatLink.href = `products.html?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`;
        subcatLink.textContent = subcategory;
        subcatLi.appendChild(subcatLink);
        crumbNav.appendChild(subcatLi);
    }
}

function addToCart() {
    const btn = this;
    let itemId = btn.id;
    let category;
    let subcategory;
    const params = new URLSearchParams(window.location.search);

    if (!itemId && params.has) {
        itemId = params.get('id');
        category = params.get('category');
        subcategory = params.get('subcategory');
        if (!itemId || !category || !subcategory) return;
    } else if (itemId) {
        const productDiv = btn.closest('.product');
        category = productDiv.dataset.category;
        subcategory = productDiv.dataset.subcategory;
    }

    fetch(`/item/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}/${encodeURIComponent(itemId)}`)
    .then(res => res.json())
    .then(product => {
        if (!product || !product.name || product.price === undefined) return;

        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));

        btn.textContent = 'Added!';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Add to cart';
            btn.disabled = false;
        }, 1000);
    });
}