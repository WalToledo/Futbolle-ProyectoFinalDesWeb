'use strict';
var themeToggleBtn = document.getElementById('theme-toggle-btn');
var currentBody = document.body;
var savedTheme = localStorage.getItem('futbolle_theme');
if (savedTheme === 'light') {
    currentBody.classList.add('light-mode');
    if (themeToggleBtn) {
        themeToggleBtn.textContent = 'Dark Mode';
    }
}
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
        currentBody.classList.toggle('light-mode');
        if (currentBody.classList.contains('light-mode')) {
            localStorage.setItem('futbolle_theme', 'light');
            themeToggleBtn.textContent = 'Dark Mode';
        } else {
            localStorage.setItem('futbolle_theme', 'dark');
            themeToggleBtn.textContent = 'Light Mode';
        }
    });
}