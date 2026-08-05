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
var historyBtn = document.getElementById('history-btn');
var sortDateBtn = document.getElementById('sort-date-btn');
var sortAttemptsBtn = document.getElementById('sort-attempts-btn');
var currentSort = 'date';
var currentHistory = [];
var currentDifficulty = 'easy';

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
            extraCluesSection.classList.remove('hidden');
            mediumCluesContainer.innerHTML = '';
            secretPlayerPhoto.src = secretPlayer.photo;
            secretPlayerPhoto.className = 'secret-photo blur-8';
            if (currentDifficulty === 'easy') {
                secretPlayerPhoto.classList.remove('hidden');
                mediumCluesContainer.classList.add('hidden');
            } else if (currentDifficulty === 'medium') {
                secretPlayerPhoto.classList.add('hidden');
                mediumCluesContainer.classList.remove('hidden');
            } else {
                extraCluesSection.classList.add('hidden');
            }
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
    currentDifficulty = difficultySelect.value;
    humanNameInput.classList.add('hidden');
    difficultySelect.classList.add('hidden');
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

function processGuess(guessedPlayer) {
    if (isGameOver || !secretPlayer) return;
    if (guessedPlayersIds.indexOf(guessedPlayer.id) !== -1) {
        return;
    }
    guessedPlayersIds.push(guessedPlayer.id);
    if (timerInterval === null) {
        startTimer();
    }
    attemptsLeft--;
    updateAttemptsCounter(attemptsLeft);
    if (currentDifficulty === 'easy' && guessedPlayer.id !== secretPlayer.id) {
        secretPlayerPhoto.className = 'secret-photo blur-' + attemptsLeft;
    } else if (currentDifficulty === 'medium' && guessedPlayer.id !== secretPlayer.id) {
        var attemptsUsed = 8 - attemptsLeft;
        if (attemptsUsed === 2) { addMediumClue('Age: ' + secretPlayer.age); }
        if (attemptsUsed === 4) { addMediumClue('Overall: ' + secretPlayer.overall); }
        if (attemptsUsed === 6) { addMediumClue('Height: ' + secretPlayer.heightCm + 'cm'); }
    }
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
        var attemptsUsed = 8 - attemptsLeft;
        var finalScore = calculateScore(true, attemptsUsed, secondsElapsed, currentDifficulty);
        saveMatchResult('Won', finalScore);
        var timeStr = formatTime(secondsElapsed);
        showModal('¡You won!', 'Guessed it in ' + attemptsUsed + ' attempts. Time: ' + timeStr + '. Score: ' + finalScore, true);
    } else if (attemptsLeft === 0) {
        isGameOver = true;
        stopTimer();
        loseSound.play();
        var finalScore = calculateScore(false, 8, secondsElapsed, currentDifficulty);
        saveMatchResult('Lost', finalScore);
        showModal('¡You lost!', 'You ran off of attempts. The player was ' + secretPlayer.name + '.', true);
    }
}

function saveMatchResult(matchResult, matchScore) {
    var attemptsUsed = 8 - attemptsLeft;
    var timeStr = formatTime(secondsElapsed);
    var currentDate = new Date();
    var dateStr = currentDate.toLocaleDateString() + ' ' + currentDate.toLocaleTimeString();
    var matchRecord = {
        playerName: humanPlayerName,
        result: matchResult,
        score: matchScore,
        attempts: attemptsUsed,
        date: dateStr,
        duration: timeStr,
        timestamp: currentDate.getTime()
    };
    var history = localStorage.getItem('futbolle_history');
    var historyArray = history ? JSON.parse(history) : [];
    historyArray.push(matchRecord);
    localStorage.setItem('futbolle_history', JSON.stringify(historyArray));
}

function loadHistory() {
    var history = localStorage.getItem('futbolle_history');
    currentHistory = history ? JSON.parse(history) : [];
}
function sortHistory() {
    if (currentSort === 'attempts') {
        currentHistory.sort(function(a, b) {
            return a.attempts - b.attempts;
        });
    } else {
        currentHistory.sort(function(a, b) {
            return b.timestamp - a.timestamp;
        });
    }
}
if (historyBtn) {
    historyBtn.addEventListener('click', function() {
        loadHistory();
        sortHistory();
        renderHistoryTable(currentHistory);
        showHistoryModal();
    });
}
if (sortDateBtn) {
    sortDateBtn.addEventListener('click', function() {
        currentSort = 'date';
        sortHistory();
        renderHistoryTable(currentHistory);
    });
}
if (sortAttemptsBtn) {
    sortAttemptsBtn.addEventListener('click', function() {
        currentSort = 'attempts';
        sortHistory();
        renderHistoryTable(currentHistory);
    });
}

function calculateScore(isWin, attemptsUsed, timeSeconds, difficulty) {
    if (!isWin) {
        return 0;
    }
    var basePoints = 0;
    if (difficulty === 'easy') {
        basePoints = 60;
    } else if (difficulty === 'medium') {
        basePoints = 80;
    } else if (difficulty === 'hard') {
        basePoints = 100;
    }
    var penalty = (attemptsUsed - 1) * 10;
    var timeBonus = 0;
    if (timeSeconds < 60) {
        timeBonus = 20;
    } else if (timeSeconds < 120) {
        timeBonus = 10;
    }
    var finalScore = basePoints - penalty + timeBonus;
    if (finalScore < 10) {
        finalScore = 10;
    }
    return finalScore;
}