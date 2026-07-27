'use strict';

var contactForm = document.getElementById('contact-form');
var nameInput = document.getElementById('contact-name');
var emailInput = document.getElementById('contact-email');
var messageInput = document.getElementById('contact-message');
var feedbackMessage = document.createElement('p');
feedbackMessage.style.marginTop = '1rem';
feedbackMessage.style.textAlign = 'center';
feedbackMessage.style.fontWeight = '600';
contactForm.appendChild(feedbackMessage);

function showFeedback(text, color) {
    feedbackMessage.textContent = text;
    feedbackMessage.style.color = color;
    setTimeout(function() {
        feedbackMessage.textContent = '';
    }, 4000);
}

function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var nameValue = nameInput.value.trim();
    var emailValue = emailInput.value.trim();
    var messageValue = messageInput.value.trim();

    if (nameValue === '' || emailValue === '' || messageValue === '') {
        showFeedback('Please, fulfill all camps', '#c62828');
        return;
    }

    if (!isValidEmail(emailValue)) {
        showFeedback('Please, insert a correct email.', '#c62828');
        return;
    }

    if (messageValue.length < 15) {
        showFeedback('Message is too short. Has to be of minimum 15 characters.', '#c62828');
        return;
    }

    var subject = encodeURIComponent('Contact from Futbolle of ' + nameValue);
    var body = encodeURIComponent(messageValue);
    
    var subject = encodeURIComponent('Contact from Futbolle of ' + nameValue);
    var body = encodeURIComponent(messageValue);
    window.location.href = 'mailto:' + emailValue + '?subject=' + subject + '&body=' + body;
    
    contactForm.reset();
});