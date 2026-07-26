'use strict';

var secretPlayer = null;
var attemptsLeft = 8;
var timerInterval = null;
var secondsElapsed = 0;
var isGameOver = false;

function formatTime(totalSeconds) {
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    
    var minutesStr = minutes < 10 ? '0' + minutes : minutes;
    var secondsStr = seconds < 10 ? '0' + seconds : seconds;
    
    return minutesStr + ':' + secondsStr;
}

function startTimer() {
    stopTimer(); 
    timerInterval = setInterval(function () {
        secondsElapsed++;
        updateTimerDisplay(formatTime(secondsElapsed));
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// game inicialization

function initGame() {
    isGameOver = false;
    attemptsLeft = 8;
    secondsElapsed = 0;
    secretPlayer = null;
    
    resetBoardUI();
    stopTimer();

    getRandomPlayer(
        function (playerData) {
            secretPlayer = playerData;
            startTimer();
            console.log('El jugador secreto es:', secretPlayer.name);
        },
        function (error) {
            showModal('Error de Conexión', 'No se pudo obtener el jugador secreto. Revisa tu internet.', true);
        }
    );
}

initGame();

restartGameBtn.addEventListener('click', function () {
    hideModal();
    initGame();
});

// search

var searchTimeout = null;

searchInput.addEventListener('input', function (e) {
    var query = e.target.value.trim();

    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    if (query.length < 2) {
        clearAutocomplete();
        return;
    }

    searchTimeout = setTimeout(function () {
        searchPlayers(
            query,
            8,
            function (players) {
                renderAutocomplete(players, processGuess);
            },
            function (error) {
                clearAutocomplete();
            }
        );
    }, 300);
});

document.addEventListener('click', function (e) {
    if (!searchInput.contains(e.target) && !autocompleteList.contains(e.target)) {
        clearAutocomplete();
    }
});

