/**
 * CS 132
 * Author: Bryan Oliveira
 * Date: 05/03/2025
 * 
 * @file project-handler.js
 * @description This file contains the logic for adding project
 * cards to the projects page.
 */

/**
 * Initializes event listeners for the "Add Card" button. 
 * When the button is clicked, a new project card is
 * added to the project grid. 
 */
function init() {
  const button = qs('#add-card-btn');
  if (button) {
    button.addEventListener('click', () => {
      addProjectCard({
        title: "New Cool Project",
        description: "This is a new project added dynamically with JavaScript!",
        imageUrl: "https://images.pexels.com/photos/330771/pexels-photo-330771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        tags: ["JavaScript", "Frontend", "Dynamic"]
      });
    });
  }
}

/**
 * Creates and appends a new project card to the grid using provided project details.
 * All parameters are required for proper rendering. 
 * @param {Object} Object containing card details
 * @param {string} title - Title of the project
 * @param {string} description - Short description of the project
 * @param {string} imageUrl - URL for the project image
 * @param {string[]} tags - Array of tag strings to label the project
 */
function addProjectCard({ title, description, imageUrl, tags }) {
  const grid = qs('.project-grid');

  const card = document.createElement('div');
  card.classList.add('project-card');

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = title;
  card.appendChild(img);

  const h2 = document.createElement('h2');
  h2.textContent = title;
  card.appendChild(h2);

  const p = document.createElement('p');
  p.textContent = description;
  card.appendChild(p);

  const ul = document.createElement('ul');
  ul.classList.add('filter-tags');
  tags.forEach(tag => {
    const li = document.createElement('li');
    li.textContent = tag;
    ul.appendChild(li);
  });
  card.appendChild(ul);

  grid.appendChild(card);
}

init();