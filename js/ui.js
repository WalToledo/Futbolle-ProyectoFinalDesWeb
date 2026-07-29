'use strict';

var modalContainer = document.getElementById('modal-container');
var modalTitle = document.getElementById('modal-title');
var modalMessage = document.getElementById('modal-message');
var modalCloseBtn = document.getElementById('modal-close-btn');
var restartGameBtn = document.getElementById('restart-game-btn');
var humanNameInput = document.getElementById('human-name-input');
var modalError = document.getElementById('modal-error');
var startGameBtn = document.getElementById('start-game-btn');
var searchInput = document.getElementById('player-search-input');
var autocompleteList = document.getElementById('autocomplete-list');
var attemptsBoard = document.getElementById('attempts-board');
var attemptsCounter = document.getElementById('attempts-counter');
var timerDisplay = document.getElementById('timer-display');
var inGameRestartBtn = document.getElementById('in-game-restart-btn');
var historyModal = document.getElementById('history-modal');
var historyTbody = document.getElementById('history-tbody');
var closeHistoryBtn = document.getElementById('close-history-btn');
var difficultySelect = document.getElementById('difficulty-select');
var extraCluesSection = document.getElementById('extra-clues-section');
var secretPlayerPhoto = document.getElementById('secret-player-photo');
var mediumCluesContainer = document.getElementById('medium-clues-container');

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

function showWelcomeModal() {
    modalTitle.textContent = 'Welcome to Futbolle';
    modalMessage.textContent = 'Please enter your name to start playing.';
    modalError.textContent = '';
    humanNameInput.value = '';
    humanNameInput.classList.remove('hidden');
    startGameBtn.classList.remove('hidden');
    modalCloseBtn.classList.add('hidden');
    restartGameBtn.classList.add('hidden');
    modalContainer.classList.remove('hidden');
}

function hideModal() {
    modalContainer.classList.add('hidden');
}

modalCloseBtn.addEventListener('click', hideModal);

function clearAutocomplete(){
    autocompleteList.innerHTML = '';
    autocompleteList.classList.add('hidden');
}

function renderAutocomplete(players, onSelectPlayer){
    clearAutocomplete();
    if(!players || players.length === 0){
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

function createAttributeBox(textValue, cssClass) {
    var box = document.createElement('div');
    box.className = 'attribute-box ' + cssClass;
    box.textContent = textValue;
    return box;
}

function renderAttemptRow(playerDetails, comparisons) {
    var row = document.createElement('div');
    row.className = 'attempt-row';
    var isHardMode = (typeof currentDifficulty !== 'undefined' && currentDifficulty === 'hard');
    var displayedClub = isHardMode ? '???' : playerDetails.club;
    var clubCss = isHardMode ? 'hidden-hard-mode' : comparisons.clubClass;
    row.appendChild(createAttributeBox(playerDetails.name, 'name-box'));
    row.appendChild(createAttributeBox(playerDetails.nationality, comparisons.nationalityClass));
    row.appendChild(createAttributeBox(displayedClub, clubCss));
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

function showHistoryModal() {
    historyModal.classList.remove('hidden');
}

function hideHistoryModal() {
    historyModal.classList.add('hidden');
}

if (closeHistoryBtn) {
    closeHistoryBtn.addEventListener('click', hideHistoryModal);
}

function renderHistoryTable(historyArray) {
    historyTbody.innerHTML = '';
    if (!historyArray || historyArray.length === 0) {
        var trEmpty = document.createElement('tr');
        var tdEmpty = document.createElement('td');
        tdEmpty.colSpan = 6;
        tdEmpty.textContent = 'No matches played yet.';
        tdEmpty.className = 'empty-history';
        trEmpty.appendChild(tdEmpty);
        historyTbody.appendChild(trEmpty);
        return;
    }
    historyArray.forEach(function(record) {
        var tr = document.createElement('tr');
        var tdName = document.createElement('td');
        tdName.textContent = record.playerName;
        var tdResult = document.createElement('td');
        tdResult.textContent = record.result;
        var tdScore = document.createElement('td');
        tdScore.textContent = record.score !== undefined ? record.score : '-';
        var tdAttempts = document.createElement('td');
        tdAttempts.textContent = record.attempts;
        var tdDuration = document.createElement('td');
        tdDuration.textContent = record.duration;
        var tdDate = document.createElement('td');
        tdDate.textContent = record.date;
        tr.appendChild(tdName);
        tr.appendChild(tdResult);
        tr.appendChild(tdScore);
        tr.appendChild(tdAttempts);
        tr.appendChild(tdDuration);
        tr.appendChild(tdDate);
        historyTbody.appendChild(tr);
    });
}

function addMediumClue(clueText) {
    var badge = document.createElement('div');
    badge.className = 'clue-badge';
    badge.textContent = clueText;
    mediumCluesContainer.appendChild(badge);
}