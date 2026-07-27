'use strict';

var secretPlayer = null;
var attemptsLeft = 8;
var timerInterval = null;
var secondsElapsed = 0;
var isGameOver = false;
var humanPlayerName = '';
var guessedPlayersIds = [];
var winSound = new Audio('sounds/win.mp3');
var loseSound = new Audio('sounds/lose.mp3');
var attributeSound = new Audio('sounds/correct.mp3');
var startSound = new Audio('sounds/start.mp3')

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
    guessedPlayersIds = [];
    
    resetBoardUI();
    stopTimer();

    getRandomPlayer(
        function (playerData) {
            secretPlayer = playerData;
            startTimer();
            console.log('Secret player:', secretPlayer.name);
        },
        function (error) {
            showModal('Connection error', 'It is not possible to get the secret player. Check your internet connection.', true);
        }
    );
}

showWelcomeModal();

startGameBtn.addEventListener('click', function () {
    var name = humanNameInput.value.trim();
    if (name.length < 3) {
        modalError.textContent = 'Name must have at least 3 letters.';
        return;
    }
    humanPlayerName = name;
    humanNameInput.classList.add('hidden');
    startGameBtn.classList.add('hidden');
    modalError.textContent = '';
    startSound.play()
    
    hideModal();
    initGame();
});


restartGameBtn.addEventListener('click', function () {
    hideModal();
    initGame();
});

inGameRestartBtn.addEventListener('click', function () {
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
    if (guessedPlayersIds.indexOf(guessedPlayer.id) !== -1) {
        return;
    }
    guessedPlayersIds.push(guessedPlayer.id);
    attemptsLeft--;
    updateAttemptsCounter(attemptsLeft);
    var comparisons = comparePlayers(guessedPlayer, secretPlayer);
    renderAttemptRow(guessedPlayer, comparisons);
    var hasCorrect = (comparisons.nationalityClass === 'correct' || comparisons.clubClass === 'correct' || comparisons.positionClass === 'correct' || comparisons.ageClass === 'correct' || comparisons.overallClass === 'correct' || comparisons.heightClass === 'correct');
    if (hasCorrect && guessedPlayer.id !== secretPlayer.id) {
        attributeSound.play();
    }
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
        winSound.play();
        var timeStr = formatTime(secondsElapsed);
        var attemptsUsed = 8 - attemptsLeft;
        showModal('¡You won!', 'Guessed it in ' + attemptsUsed + ' attempts. Time: ' + timeStr, true);
    } else if (attemptsLeft === 0) {
        isGameOver = true;
        stopTimer();
        loseSound.play();
        showModal('¡You lost!', 'You ran off of attempts. The player was ' + secretPlayer.name + '.', true);
    }
}