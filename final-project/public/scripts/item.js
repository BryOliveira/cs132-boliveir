/**
 * CS 132
 * Author: Bryan Oliveira
 * Date: 06/14/2025
 * 
 * @file item.js
 * @description This file handles the client-side interface with the API for creating
 * the item page.
 */

(function () {
    "use strict";
    const CATEGORIES = {
        'prevention': [
            'Prevention',
            ['Bracing + Supports', 'Compression Gear', 'Protective Equipment', 'Warm-up + Mobility Tools', 'Tape + Wrapping']
        ],
        'recovery': [
            'Recovery',
            ['Massage Tools', 'Cold + Heat Therapy', 'Sleep Aids', 'Hydration + Nutrition']
        ], 
        'rehab': [
            'Rehabilitation',
            ['Resistance Training', 'Balance Training', 'Range of Motion Tools', 'Rehab Monitoring Tools', 'PT Kits']
        ]
    };

    /**
     * Initializes the item page by extracting the product ID from the URL
     * and fetching the product details if an ID is present.
     */
    function init() {
        const params = getQueryParams();
        const productId = params.id || null;
        if (productId) {
            fetchAndDisplayItem(productId);
        }
    }

    /**
     * Parses the query parameters from the current window URL.
     * @returns {Object} An object containing all query parameters as key-value pairs.
     */
    function getQueryParams() {
        const params = {};
        const urlParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        return params;
    }

    /**
     * Fetches product data from the server and displays it on the item page.
     * Also populates breadcrumbs for navigation.
     * @param {string} productId - The ID of the product to fetch and display.
     */
    async function fetchAndDisplayItem(productId) {
        const params = getQueryParams();
        const category = params.category || null;
        const subcategory = params.subcategory || null;
        populateBreadCrumbs(category, subcategory, productId, CATEGORIES);
        
        try {
            const res = await fetch(`/item/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}/${encodeURIComponent(productId)}`);
            const data = await res.json();

            const itemDiv = qs('.item');
            itemDiv.innerHTML = '';

            const img = gen('img');
            img.src = data.image_url;
            img.alt = data.name;
            itemDiv.appendChild(img);

            const wrapperDiv = gen('div');
            wrapperDiv.id = 'item-info';

            const name = gen('h2');
            name.textContent = data.name;
            wrapperDiv.appendChild(name);

            const desc = gen('p');
            desc.textContent = data.description;
            wrapperDiv.appendChild(desc);

            const price = gen('p');
            price.textContent = `Price: $${data.price}`;
            wrapperDiv.appendChild(price);

            const addButton = gen('button');
            addButton.textContent = 'Add to cart';
            addButton.addEventListener('click', addToCart);
            wrapperDiv.appendChild(addButton);
            itemDiv.appendChild(wrapperDiv);
        } catch (err) {
            const itemDiv = qs('.item');
            const errorMsg = gen('p');
            errorMsg.textContent = `${err.message}. Please try again later.`;
            itemDiv.appendChild(errorMsg);
        }
    }
    
    init();
})();