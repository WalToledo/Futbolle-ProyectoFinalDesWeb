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


//autocomplete

function clearAutocomplete(){
    autocompleteList.innerHTML = '';
    autocompleteList.classList.add('hidden');
}

function renderAutocomplete(players, onSelectPlayer){
    clearAutocomplete();

    if(!players || players.lenght === 0){
        return;
    }

    players.forEach(function (player) {
        var li = document.createElement('li');
        li.className = 'autocomplete-item'; 
        li.textContent = player.name;
        
        li.addEventListener('click', function () {
            searchInput.value = '';
            clearAutocomplete();
            onSelectPlayer(player);
        });
        
        autocompleteList.appendChild(li);
    });
    
    autocompleteList.classList.remove('hidden');
}

// game and timer

function createAttributeBox(textValue, cssClass) {
    var box = document.createElement('div');

    box.className = 'attribute-box ' + cssClass;
    box.textContent = textValue;
    return box;
}

function renderAttemptRow(playerDetails, comparisons) {
    var row = document.createElement('div');
    row.className = 'attempt-row';
    
    row.appendChild(createAttributeBox(playerDetails.name, 'name-box'));
    row.appendChild(createAttributeBox(playerDetails.nationality, comparisons.nationalityClass));
    row.appendChild(createAttributeBox(playerDetails.club, comparisons.clubClass));
    row.appendChild(createAttributeBox(playerDetails.position, comparisons.positionClass));
    
    row.appendChild(createAttributeBox(comparisons.ageText, comparisons.ageClass));
    row.appendChild(createAttributeBox(comparisons.overallText, comparisons.overallClass));
    row.appendChild(createAttributeBox(comparisons.heightText, comparisons.heightClass));

    attemptsBoard.appendChild(row);
}

function updateAttemptsCounter(count) {
    attemptsCounter.textContent = count;
}

function updateTimerDisplay(timeString) {
    timerDisplay.textContent = timeString;
}

function resetBoardUI() {
    attemptsBoard.innerHTML = '';
    updateAttemptsCounter(8);
    updateTimerDisplay('00:00');
    searchInput.value = '';
    clearAutocomplete();
}