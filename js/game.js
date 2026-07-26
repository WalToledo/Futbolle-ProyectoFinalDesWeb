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

//comparations

function processGuess(guessedPlayer) {
    if (isGameOver || !secretPlayer) return;

    attemptsLeft--;
    updateAttemptsCounter(attemptsLeft);

    var comparisons = comparePlayers(guessedPlayer, secretPlayer);
    renderAttemptRow(guessedPlayer, comparisons);

    checkWinCondition(guessedPlayer.id);
}

function comparePlayers(guess, secret) {
    var result = {};

    result.nationalityClass = (guess.nationality === secret.nationality) ? 'correct' : 'incorrect';
    result.clubClass = (guess.club === secret.club) ? 'correct' : 'incorrect';
    result.positionClass = (guess.position === secret.position) ? 'correct' : 'incorrect';

    result.ageText = formatNumberWithArrow(guess.age, secret.age);
    result.ageClass = (parseInt(guess.age) === parseInt(secret.age)) ? 'correct' : 'incorrect';

    result.overallText = formatNumberWithArrow(guess.overall, secret.overall);
    result.overallClass = (parseInt(guess.overall) === parseInt(secret.overall)) ? 'correct' : 'incorrect';

    result.heightText = formatNumberWithArrow(guess.heightCm, secret.heightCm);
    result.heightClass = (parseInt(guess.heightCm) === parseInt(secret.heightCm)) ? 'correct' : 'incorrect';

    return result;
}

function formatNumberWithArrow(guessValue, secretValue) {
    var gVal = parseInt(guessValue, 10);
    var sVal = parseInt(secretValue, 10);

    if (gVal === sVal) {
        return String(gVal);
    } else if (gVal < sVal) {
        return gVal + ' ↑'; 
    } else {
        return gVal + ' ↓'; 
    }
}

function checkWinCondition(guessedId) {
    if (guessedId === secretPlayer.id) {
        isGameOver = true;
        stopTimer();
        var timeStr = formatTime(secondsElapsed);
        var attemptsUsed = 8 - attemptsLeft;
        showModal('¡Ganaste!', 'Adivinaste en ' + attemptsUsed + ' intentos. Tiempo: ' + timeStr, true);
    } else if (attemptsLeft === 0) {
        isGameOver = true;
        stopTimer();
        showModal('¡Perdiste!', 'Te quedaste sin intentos. El jugador era ' + secretPlayer.name + '.', true);
    }
}