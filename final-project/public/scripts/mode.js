/**
 * CS 132
 * Author: Bryan Oliveira
 * Date: 06/14/2025
 * 
 * @file mode.js
 * @description This file handles switching between dark and light theme and stores it across pages.
 */

(function () {
    "use strict";
    /**
     * Initializes the mode toggle and time-based theme adjustment functionality.
     * Sets the icon and theme based on saved preferences or time input.
     */
    function init() {
        const modeButton = qs('#mode-btn');
        const icon = qs('#mode-btn i');

        if (modeButton && icon) {
            modeButton.addEventListener('click', function() { switchModes(icon); });
            
            const currTheme = localStorage.getItem('theme');
            if (currTheme === 'dark') {
                setTheme('dark', icon);
            } else {
                setTheme('light', icon);
            }
        }
    }

    /**
     * Toggles between light and dark themes, updates the corresponding icon,
     * and stores the selected theme in local storage.
     * @param {HTMLElement} icon - The icon element inside the mode button
     */
    function switchModes(icon) {
        const root = document.documentElement;
        const currTheme = root.getAttribute('data-theme');

        if (currTheme === 'light') {
            setTheme('dark', icon);
            localStorage.setItem('theme', 'dark');
        } else {
            setTheme('light', icon);
            localStorage.setItem('theme', 'light');
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
})();