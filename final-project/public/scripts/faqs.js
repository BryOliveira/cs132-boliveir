/**
 * CS 132
 * Author: Bryan Oliveira
 * Date: 06/14/2025
 * 
 * @file faqs.js
 * @description This file handles the client-side interface with the API for creating
 * the FAQs page.
 * 
 * This script fetches FAQ data from the server and dynamically displays it on the page.
 * It populates the .faqs container with each FAQ's question and answer.
 * If there is an error fetching the data, an error message is displayed.
 *
 * - init(): Initializes the FAQ page by fetching and displaying FAQs.
 * - fetchAndDisplayFAQs(): Fetches FAQs from the API and renders them in the DOM.
 */

(function () {
    "use strict";
    function init() {
        fetchAndDisplayFAQs();
    }
    async function fetchAndDisplayFAQs() {
        try {
            const res = await fetch('/faqs');
            const data = await res.json();  
            const faqsDiv = qs('.faqs');
            faqsDiv.innerHTML = '';
            data.forEach(faq => {
                const faqItem = gen('div');
                faqItem.classList.add('faq-item');
                
                const question = gen('h3');
                question.textContent = faq.question;
                faqItem.appendChild(question);
                
                const answer = gen('p');
                answer.textContent = faq.answer;
                faqItem.appendChild(answer);
                
                faqsDiv.appendChild(faqItem);
            });
        } catch (err) {
            const faqsDiv = qs('.faqs');
            const errorMsg = gen('p');
            errorMsg.textContent = `${err.message}. Please try again later.`;
            faqsDiv.appendChild(errorMsg);
        }
    }
    init();
})();