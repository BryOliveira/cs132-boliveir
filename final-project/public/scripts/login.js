/**
 * CS 132
 * Author: Bryan Oliveira
 * Date: 06/14/2025
 * 
 * @file login.js
 * @description This file handles the client-side interface with the API for creating
 * the login/signup page.
 */

(function() {
    "use strict";

    /**
     * Initializes the login page by setting up event listeners for
     * showing the signup/login forms and handling form submissions.
     */
    function init() {
        const signupForm = qs("#signup-form");
        const loginForm = qs("#login-form");
        const showSignupBtn = qs("#show-signup");
        const showLoginBtn = qs("#show-login");
        const msgDiv = qs("#login-message");
        
        showSignupBtn.addEventListener("click", () => {
            signupForm.style.display = "block";
            loginForm.style.display = "none";
            msgDiv.textContent = "";
        });

        showLoginBtn.addEventListener("click", () => {
            loginForm.style.display = "block";
            signupForm.style.display = "none";
            msgDiv.textContent = "";
        });

        /**
         * Handles the signup form submission, sends user data to the server,
         * and displays a success or error message.
         * @param {Event} evt - The form submission event.
         */
        signupForm.addEventListener("submit", async function(evt) {
            evt.preventDefault();
            const name = qs("#signup-name").value.trim();
            const email = qs("#signup-email").value.trim();
            const phone = qs("#signup-phone").value.trim();

            try {
                const res = await fetch("/loyalty/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, phone })
                });
                if (!res.ok) throw new Error("Signup failed.");
                msgDiv.textContent = "Thank you for joining our loyalty program!";
                signupForm.reset();
                signupForm.style.display = "none";
            } catch (err) {
                msgDiv.textContent = "There was an error signing up. Please try again.";
            }
        });

        /**
         * Handles the login form submission, checks user credentials with the server,
         * stores user info locally, and displays a welcome or error message.
         * @param {Event} evt - The form submission event.
         */
        loginForm.addEventListener("submit", async function(evt) {
            evt.preventDefault();
            const email = qs("#login-email").value.trim();
            try {
                const res = await fetch("/loyalty/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });
                if (!res.ok) {
                    const errMsg = await res.json();
                    msgDiv.textContent = errMsg.error || "Login error. Please try again.";
                    return;
                }
                const data = await res.json();
                localStorage.setItem("loyalUser", JSON.stringify(data.user));
                msgDiv.textContent = `Welcome back, ${data.user.name}!`;
                loginForm.reset();
                loginForm.style.display = "none";
            } catch (err) {
                msgDiv.textContent = "There was an error logging in. Please try again.";
            }
        });
    }

    init();
})();