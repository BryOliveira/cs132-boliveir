/**
 * CS 132
 * Author: Bryan Oliveira
 * Date: 06/14/2025
 * 
 * @file product.js
 * @description This file handles the client-side interface with the API of the products page and
 * breadcrumbs navigation.
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
     * Initializes the products page by setting up filters, populating items,
     * and adding event listeners for sorting and browser navigation.
     */
    function init() {
        const params = getQueryParams();
        const category = params.category || null;
        const subcategory = params.subcategory || null;
        const sortSelect = qs('#product-sort');
        
        if (qs('#filters')) {
            populateFilter();
            populateItems(category, subcategory);
        }
        if (sortSelect) {
            sortSelect.addEventListener('change', sortItems);
        }

        window.addEventListener('popstate', () => {
            const params = getQueryParams();
            const category = params.category || null;
            const subcategory = params.subcategory || null;
            populateFilter(category, subcategory);
            populateItems(category, subcategory);
        });
    }

    /**
     * Parses the query parameters from the current window URL.
     * @returns {Object} An object containing all query parameters as key-value pairs.
     */
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        return params;
    }

    /**
     * Creates a list of filter items (subcategories) for a given category.
     * @param {string} category - The category to create filter items for.
     * @returns {HTMLElement} The list element containing subcategory links.
     */
    function createFilterItems(category) {
        const filterList = gen('ul');
        const subcategories = CATEGORIES[category][1];
        subcategories.forEach(subcat => {
            const li = gen('li');
            const link = gen('a');
            link.href = `products.html?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcat)}`;
            link.textContent = subcat;
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const newUrl = `products.html?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcat)}`;
                window.history.pushState({}, '', newUrl);
                populateFilter(category, subcat);
                await populateItems(category, subcat);
            });
            li.appendChild(link);
            filterList.appendChild(li);
        });
        return filterList;
    }

    /**
     * Populates the filter sidebar with categories and subcategories.
     */
    function populateFilter() {
        const filter = qs('#filters');
        filter.innerHTML = '';
        const h1 = gen('h1');
        const productLink = gen('a');
        productLink.href = 'products.html';
        productLink.textContent = 'Products';
        h1.appendChild(productLink);
        const h2 = gen('h2');
        h2.textContent = 'Filters';
        filter.appendChild(h1);
        filter.appendChild(h2);

        for (const category in CATEGORIES) {
            const headerLink = gen('a');
            headerLink.href = `products.html?category=${encodeURIComponent(category)}`;
            headerLink.textContent = CATEGORIES[category][0];
            headerLink.addEventListener('click', async (e) => {
                e.preventDefault();
                const newUrl = `products.html?category=${encodeURIComponent(category)}`;
                window.history.pushState({}, '', newUrl);
                populateFilter(category, null);
                await populateItems(category, null);
            });
            const header = gen('h3');
            header.appendChild(headerLink);
            filter.appendChild(header);
            const filterList = createFilterItems(category);
            filter.appendChild(filterList);
        }
    }

    /**
     * Fetches product items from the server based on category and subcategory.
     * @param {string|null} category - The category to filter by.
     * @param {string|null} subcategory - The subcategory to filter by.
     * @returns {Promise<Array>} The array of product objects.
     */
    async function fetchItems(category = null, subcategory = null) {
        let url = '/products';
        if (category && subcategory) {
            url += `/${category}/${encodeURIComponent(subcategory)}`;
        } else if (category) {
            url += `/${encodeURIComponent(category)}`;
        }
        try {
            const res = await fetch(url);
            const data = await res.json();
            return data;
        } catch (err) {
            const items = qs('#product-results');
            const errorMsg = gen('p');
            errorMsg.textContent = `${err.message}. Please try again later.`;
            items.appendChild(errorMsg);
            return [];
        }
    }

    /**
     * Creates a DOM element for a single product item.
     * @param {Object} productData - The product data object.
     * @returns {HTMLElement} The product DOM element.
     */
    function createProductItem(productData) {
        const product = gen('div');
        product.className = 'product';

        product.dataset.category = productData.category;
        product.dataset.subcategory = productData.subcategory;

        product.addEventListener('click', function (e) {
            if (e.target.tagName.toLowerCase() !== 'button') {
                const newUrl = `item.html?category=${encodeURIComponent(productData.category)}&subcategory=${encodeURIComponent(productData.subcategory)}&id=${encodeURIComponent(productData.id)}`;
                window.location.href = newUrl;
            }
        });

        const img = gen('img');
        img.src = productData.image_url;
        img.alt = productData.name;
        product.appendChild(img);

        const name = gen('span');
        name.id = 'name';
        name.textContent = productData.name;
        product.appendChild(name);

        const priceAdd = gen('div');
        priceAdd.id = 'price-add';

        const price = gen('span');
        price.id = 'cost';
        price.textContent = `\$${productData.price}`;
        priceAdd.appendChild(price);

        const addButton = gen('button');
        addButton.textContent = 'Add to cart';
        addButton.addEventListener('click', addToCart);
        addButton.id = productData.id;
        priceAdd.appendChild(addButton);
        product.appendChild(priceAdd);

        return product;
    }

    /**
     * Populates the product results area with product items based on filters.
     * @param {string|null} category - The category to filter by.
     * @param {string|null} subcategory - The subcategory to filter by.
     */
    async function populateItems(category = null, subcategory = null) {
        const items = qs('#product-results');
        if (!items) return;
        items.innerHTML = '';
        const products = await fetchItems(category, subcategory);
        if (products.length === 0) {
            items.textContent = "No products found.";
            populateBreadCrumbs(category, subcategory, null, CATEGORIES);
            return;
        }
        products.forEach(product => {
            if (product.name && product.price !== undefined) {
                const productItem = createProductItem(product);
                items.appendChild(productItem);
            }
        });
        populateBreadCrumbs(category, subcategory, null, CATEGORIES);
        const sortSelect = qs('#product-sort');
        if (sortSelect) {
            sortSelect.value = 'default';
        }
    }

    /**
     * Sorts the displayed product items based on the selected sort option.
     */
    function sortItems() {
        const sortSelect = qs('#product-sort');
        const sortBy = sortSelect.value;
        const itemsContainer = qs('#product-results');
        const items = Array.from(itemsContainer.children);
        items.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('#cost').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('#cost').textContent.replace('$', ''));
            if (sortBy === 'price-asc') {
                return priceA - priceB;
            } else if (sortBy === 'price-desc') {
                return priceB - priceA;
            } else if (sortBy === 'alpha') {
                return a.querySelector('#name').textContent.localeCompare(b.querySelector('#name').textContent);
            } 
        });
        items.forEach(item => itemsContainer.appendChild(item));
    }

    init();
})();