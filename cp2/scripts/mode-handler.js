/**
 * CS 132
 * Author: Bryan Oliveira
 * Date: 05/03/2025
 * 
 * @file mode-handler.js
 * @description This file contains the logic for switching between dark and light mode
 * and to react to a time at the bottom of the homepage.
 */

/**
 * Initializes the mode toggle and time-based theme adjustment functionality.
 * Sets the icon and theme based on saved preferences or time input.
 */
function init() {
    const modeButton = qs('#mode-btn');
    const timeInput = qs('#time');
    const icon = qs('#mode-btn i');

    if (modeButton && icon) {
        modeButton.addEventListener('click', function () { switchModes(icon); });

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setTheme('dark', icon);
        } else if (savedTheme === 'light') {
            setTheme('light', icon);
        }

        timeInput.addEventListener('change', function () {
            const timeValue = timeInput.value;
            if (timeValue) {
                const parts = timeValue.split(':');
                const hours = parseInt(parts[0], 10);

                if (hours >= 6 && hours < 18) {
                    setTheme('light', icon);
                    localStorage.setItem('theme', 'light');
                } else {
                    setTheme('dark', icon);
                    localStorage.setItem('theme', 'dark');
                }
            }
        });
    }
}

/**
 * Toggles between light and dark themes, updates the corresponding icon,
 * and stores the selected theme in local storage.
 * @param {HTMLElement} icon - The icon element inside the mode button
 */
function switchModes(icon) {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        setTheme('light', icon);
        localStorage.setItem('theme', 'light');
    } else {
        setTheme('dark', icon);
        localStorage.setItem('theme', 'dark');
    }
}

/**
 * Sets the site’s visual theme and updates the mode toggle icon accordingly.
 * @param {string} theme - Either 'light' or 'dark'; any other value is ignored
 * @param {HTMLElement} icon - The icon element to update the class on
 */
function setTheme(theme, icon) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    if (theme === 'dark') {
        icon.className = 'iconoir-sun-light';
    } else {
        icon.className = 'iconoir-half-moon';
    }
}

init();