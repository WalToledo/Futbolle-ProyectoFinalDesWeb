'use strict';

var contactForm = document.getElementById('contact-form');
var nameInput = document.getElementById('contact-name');
var emailInput = document.getElementById('contact-email');
var messageInput = document.getElementById('contact-message');
var feedbackMessage = document.getElementById('contact-feedback');
var feedbackTimeout = null;

function hideFeedback() {
    feedbackMessage.textContent = '';
    feedbackMessage.classList.add('hidden');
}

function showFeedback(text) {
    feedbackMessage.textContent = text;
    feedbackMessage.classList.remove('hidden');
    if (feedbackTimeout) {
        clearTimeout(feedbackTimeout);
    }
    feedbackTimeout = setTimeout(hideFeedback, 4000);
}

function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidName(nameValue){
    var alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
    return alphanumericRegex.test(nameValue);
}

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var nameValue = nameInput.value.trim();
    var emailValue = emailInput.value.trim();
    var messageValue = messageInput.value.trim();
    if (nameValue === '' || emailValue === '' || messageValue === '') {
        showFeedback('Please, fulfill all camps');
        return;
    }
    if (!isValidName(nameValue)) {
        showFeedback('Please, insert a valid name (only letters and numbers).');
        return;
    }
    if (!isValidEmail(emailValue)) {
        showFeedback('Please, insert a correct email.');
        return;
    }
    if (messageValue.length < 5) {
        showFeedback('Message is too short. Has to be of minimum 5 characters.');
        return;
    }
    var subject = encodeURIComponent('Contact from Futbolle of ' + nameValue);
    var body = encodeURIComponent(messageValue);
    window.location.href = 'mailto:' + emailValue + '?subject=' + subject + '&body=' + body;
    contactForm.reset();
});