/**
 * CS 132
 * Author: Bryan Oliveira
 * Date: 06/14/2025
 * 
 * @file contact.js
 * @description Handles the contact form submission and sends feedback to the server.
 *
 */

(function () {
  "use strict";
  function init() {
      const form = qs('#contact-form');
      if (form) {
          form.addEventListener('submit', handleSubmit);
      }
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const name = qs('#name').value.trim();
    const email = qs('#email').value.trim();
    const subject = qs('#subject').value.trim();
    const message = qs('#message').value.trim();

    const feedback = { name, email, subject, message };

    try {
        const res = await fetch('/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedback)
        });
        checkStatus(res);
        const successMsg = gen('p');
        successMsg.textContent = "Thank you for your feedback!";
        qs('#form-response').appendChild(successMsg);
        qs('#contact-form').reset();
    } catch (err) {
        const errorMsg = gen('p');
        errorMsg.textContent = `Error: ${err.message}. Please try again later.`;
        qs('#form-response').appendChild(errorMsg);
    }
  }

  init();
})();