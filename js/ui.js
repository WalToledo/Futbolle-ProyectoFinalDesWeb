'use strict';

var modalContainer = document.getElementById('modal-container');
var modalTitle = document.getElementById('modal-title');
var modalMessage = document.getElementById('modal-message');
var modalCloseBtn = document.getElementById('modal-close-btn');
var restartGameBtn = document.getElementById('restart-game-btn');

var searchInput = document.getElementById('player-search-input');
var autocompleteList = document.getElementById('autocomplete-list');

var attemptsBoard = document.getElementById('attempts-board');
var attemptsCounter = document.getElementById('attempts-counter');
var timerDisplay = document.getElementById('timer-display');


function showModal(title, message, showRestart){
    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modalContainer.classList.remove('hidden');

    if(showRestart){
        restartGameBtn.classList.remove('hidden');
        modalCloseBtn.classList.add('hidden');

    }else{
        restartGameBtn.classList.add('hidden');
        modalCloseBtn.classList.remove('hidden');
    }
}

function hideModal() {
    modalContainer.classList.add('hidden');
}

modalCloseBtn.addEventListener('click', hideModal);

