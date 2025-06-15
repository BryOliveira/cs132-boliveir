/**
 * @file cart.js
 * @author Bryan Oliveira
 * @date 06/14/2025
 * @description Handles the shopping cart logic for the Comeback e-commerce site.
 * 
 * This script manages the cart page, including rendering cart items from localStorage,
 * removing items, resetting the cart, and handling checkout.
 */

/**
 * Initializes the cart page by rendering the cart and setting up the checkout button event listener.
 * @function
 */
(function() {
    "use strict";
    function init() {
        renderCart();
        const checkoutBtn = qs('#checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', handleCheckout);
        }
    }

    /**
     * Renders all items in the cart, updates the total, and handles the empty cart state.
     * @function
     */
    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartList = qs('#cart-list');
        const cartTotal = qs('#cart-total');
        cartList.innerHTML = '';
        
        if (cart.length === 0) {
            resetCart();
        }

        let total = 0;
        cart.forEach((item, idx) => {
            const itemDiv = gen("div");
            itemDiv.className = "cart-item";

            // Product image (if available)
            if (item.image_url) {
                const img = gen("img");
                img.src = item.image_url;
                img.alt = item.name;
                img.style.width = "60px";
                img.style.height = "60px";
                img.style.objectFit = "cover";
                itemDiv.appendChild(img);
            }

            // Name and price
            const infoDiv = gen("div");
            infoDiv.style.display = "inline-block";
            infoDiv.style.marginLeft = "1rem";
            const nameSpan = gen("span");
            nameSpan.textContent = item.name;
            infoDiv.appendChild(nameSpan);
            infoDiv.appendChild(gen("br"));
            const priceSpan = gen("span");
            priceSpan.textContent = `$${item.price.toFixed(2)}`;
            infoDiv.appendChild(priceSpan);
            itemDiv.appendChild(infoDiv);

            // Remove button
            const removeBtn = gen("button");
            removeBtn.textContent = "Remove";
            removeBtn.className = "remove-btn";
            removeBtn.style.marginLeft = "1rem";
            removeBtn.addEventListener("click", () => removeFromCart(idx));
            itemDiv.appendChild(removeBtn);

            cartList.appendChild(itemDiv);
            total += item.price;
        })

        cartTotal.textContent = `${total.toFixed(2)}`;
    }

    /**
     * Removes an item from the cart by index and updates the display.
     * @param {number} idx - The index of the item to remove.
     * @function
     */
    function removeFromCart(idx) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        if (cart.length === 0) {
            resetCart();
        }
    }

    /**
     * Clears the cart display and localStorage, and shows an empty cart message.
     * @function
     */
    function resetCart() {
        const cartList = qs('#cart-list');
        cartList.innerHTML = '';
        const emptyMsg = gen('p');
        emptyMsg.textContent = "Your cart is empty.";
        cartList.appendChild(emptyMsg);
        qs('#cart-total').textContent = "0.00";
        localStorage.removeItem('cart');
    }

    /**
     * Handles the checkout process, clears the cart, and shows a thank-you message.
     * @function
     */
    function handleCheckout() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartList = qs('#cart-list');
        if (cart.length === 0) {
            resetCart();
            return;
        }
        cartList.innerHTML = '';
        const thankYou = gen('p');
        thankYou.textContent = "Thank you for your purchase! Your order has been placed.";
        cartList.appendChild(thankYou);
        qs('#cart-total').textContent = "0.00";
        localStorage.removeItem('cart');
    }

    init();
})();