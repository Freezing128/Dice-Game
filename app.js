/* Dice game based on KCD variant
 * JS aimed at basics & DOM manipulation
 * @Author: Freezing
 * @Date: 13/05/2020
 */
/*---------------------------------------------------------------------------------------------*/
// Variables
/*---------------------------------------------------------------------------------------------*/
var scores, roundScore, activePlayer, finished, winningScore, diceDOM, diceBoard, dicePicked, rolled,
isOne, isFive, timesPicked, diceValue, originalScore, pickedCounter, comboActive, fullHouse, jackpot,
preComboScore, timesRolled, prevRollScore;
finished = true;
diceDOM = [document.getElementById('dice-0'), document.getElementById('dice-1'),
           document.getElementById('dice-2'), document.getElementById('dice-3'),
           document.getElementById('dice-4')];
diceBoard = [0, 0, 0, 0, 0];
dicePicked = [false, false, false, false, false];
diceGroups = [0, 0, 0, 0, 0, 0]; 
pickedCounter = 0;
comboActive = false;
// Possible combos
fullHouse = [1, 2, 3, 4, 5, 0, 1500, false];
jackpot = [2, 3, 4, 5, 6, 0, 2000, false];
/*---------------------------------------------------------------------------------------------*/
// Events
/*---------------------------------------------------------------------------------------------*/
// Start / Reset the game
document.querySelector('.btn-start').addEventListener('click', init);
// Hold the current score
document.querySelector('.btn-hold').addEventListener('click', function() {
    // Check whether the game is still going and if the round score is higher than 0
    if (finished || !rolled || roundScore === 0) { 
        return; 
    }
    // Reset application's state variables
    isOne = false;
    isFive = false;
    rolled = false;
    timesPicked = 0;
    timesRolled = 0;
    prevRollScore = 0;
    diceGroups = [0, 0, 0, 0, 0, 0];
    // Remove picked dice from the last roll
    clearPicks();
    // Add current score to the global score
    scores[activePlayer] += roundScore;
    originalScore = scores[activePlayer];
    // Update the UI
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
    // Check if the player won the game
    if(scores[activePlayer] >= winningScore) 
    {
        hideDice();
        document.querySelector('#turn-info').textContent = 'Hráč ' + (activePlayer + 1) + ' vítězí!';
        document.querySelector('#name-' + activePlayer).textContent = 'Vítěz';
        document.querySelector('#name-' + activePlayer).style.color = '#fcd46f';
        document.querySelector('#name-' + activePlayer).style.fontWeight = '400';
        finished = true;
    }
    else // Switch to the next player
    {
        hideDice();
        switchPlayer();
    }
});
// Roll the dice
document.querySelector('.btn-roll').addEventListener('click',function() {
    // Check whether the game is still going
    if (finished) { 
        return; 
    }
    if (rolled === true) {
        timesPicked = 0;
        diceGroups = [0, 0, 0, 0, 0, 0];
    }
    if (timesRolled >= 1) {
        prevRollScore = roundScore;
    }
    // Initial setup
    rolled = true;
    timesRolled++;
    document.querySelector('#turn-info').textContent = 'Na tahu je Hráč ' + (activePlayer + 1);
    document.querySelector('#turn-info').style.color = '#fff';
    // Remove picked dice from previous rolls
    clearPicks();
    // Roll all dice in a loop
    var diceValue;
    for (var i = 0; i < 5; i++)
    {
        diceValue = Math.floor((Math.random() * 6) + 1);
        document.getElementById('dice-' + i).src = 'dice-' + diceValue + '.png';
        diceBoard[i] = diceValue;
        diceDOM[i].style.cursor = 'pointer';
        diceDOM[i].style.width = '100px';

        // If there's at least once "one" or "five", the turn is surely scoreable
        if (!(isOne) && diceValue === 1) { 
            isOne = true;
        }
        if (!(isFive) && diceValue === 5) {
             isFive = true; 
        }
    }
    // No ones or fives have been rolled, but that doesn't have to mean that it's not scoreable
    if(!(isOne) && !(isFive)) 
    {
        // Needs to check for other scoreable combinations - 3 or more twos, threes, fours and sixes
        var twos, threes, fours, sixes, minCount;
        twos = 0;
        threes = 0;
        fours = 0;
        sixes = 0;
        minCount = 3;
        // Checking for combinations
        for (var i = 0; i < diceBoard.length; i++)
        {
            if (diceBoard[i] === 2) { 
                twos++; 
            } else if (diceBoard[i] === 3) { 
                threes++; 
            } else if (diceBoard[i] === 4) { 
                fours++; 
            } else { 
                sixes++; 
            }
        }
        // No scoreable options were found, so the player switches
        if((twos < minCount) && (threes < minCount) && (fours < minCount) && (sixes < minCount)) {
            switchPlayer();
            document.querySelector('#turn-info').textContent = 'Smůla! Hráč ' + (activePlayer + 1) + ' přebírá tah';
            document.querySelector('#turn-info').style.color = '#fcd46f';
            rolled = false;
            timesRolled = 0;
        }
    } 
    // Reset the state variables in order to make them work properly again in the next rolls
    isOne = false;
    isFive = false;
});
// Clear picked dice
function clearPicks() {
    for(var i = 0; i < 5; i++) 
    {
        document.getElementById('dice-' + i).classList.remove('picked-dice');
        dicePicked[i] = false;
    }
    pickedCounter = 0;
}
// Pick the dice - functions for all
function pickDice (dice) {
    // Check whether the game is still going or if the dice were rolled
    if (finished || !rolled) { return; }
    switch(dice.id) 
    {
        case 'dice-0':
            scoreLogic (dice, 0);
            break;
        case 'dice-1':
            scoreLogic (dice, 1);
            break;
        case 'dice-2':
            scoreLogic (dice, 2);
            break;
        case 'dice-3':
            scoreLogic (dice, 3);
            break;
        default:
            scoreLogic (dice, 4);
    }
}
// Scoring logic
function scoreLogic (dice, idx) {
    diceValue = diceBoard[idx];
    originalScore = scores[activePlayer];
    // Dice is picked
    if (dicePicked[idx] === false)
    {
        pickedCounter++;
        dicePicked[idx] = true;
        dice.classList.add('picked-dice');
        timesPicked = diceGroups[diceValue - 1];
        diceGroups[diceValue - 1] += 1;
        // Add score for picked dice
        if (timesPicked > 0)
        {
            roundScore += assignScore(diceValue, timesPicked + 1) - assignScore(diceValue, timesPicked);
        }
        else // Normal score for ones or fives
        {
            roundScore += assignScore(diceValue, timesPicked + 1);
        }
        // Special combos check
        if (pickedCounter === 5)
        {
            preComboScore = roundScore;
            comboChecker();
        }
        // Reset times picked variable for another pick
        timesPicked = 0;
        // Update the UI
        document.querySelector('#score-' + activePlayer).textContent = parseInt(originalScore) + roundScore;
        // Change the color of numbers
        if(roundScore > 0) { 
            document.querySelector('#score-' + activePlayer).style.color = '#fcd46f'; 
        }
    }
    else // Dice is not picked
    {
        pickedCounter--;
        dicePicked[idx] = false;
        dice.classList.remove('picked-dice');
        diceGroups[diceValue - 1] -= 1;
        timesPicked =  diceGroups[diceValue - 1];
        // Three or more dice of the same value
        if (timesPicked > 0) 
        {
            roundScore -= assignScore(diceValue, timesPicked + 1) - assignScore(diceValue, timesPicked);
        }
        else // Normal score for ones or fives
        {
            roundScore -= assignScore(diceValue, timesPicked + 1);
        }
        // Special combos check
        if (pickedCounter === 4)
        {
            if(comboActive) {
                if(fullHouse[fullHouse.length - 1]) {
                    console.log('round score: ' + roundScore, 'preComboScore: ' + preComboScore, 'hodnota komba: ' + fullHouse[fullHouse.length - 2],
                    preComboScore - fullHouse[fullHouse.length - 2], timesRolled, originalScore);
                    if(timesRolled === 1) {
                        roundScore -= (fullHouse[fullHouse.length - 2] - preComboScore);
                    } else {
                        roundScore -= fullHouse[fullHouse.length - 2] - ((preComboScore - ((timesRolled - 1) * fullHouse[fullHouse.length - 2])));
                    }
                }
                if(jackpot[jackpot.length - 1]) {
                    if(timesRolled === 1) {
                        roundScore -= (jackpot[jackpot.length - 2] - preComboScore);
                    } else {
                        roundScore -= jackpot[jackpot.length - 2] - ((preComboScore - ((timesRolled - 1) * jackpot[jackpot.length - 2])));
                    }
                }
            }
        }
        // Reset times picked variable for another pick
        timesPicked = 0;
        // Update the UI
        document.querySelector('#score-' + activePlayer).textContent = parseInt(originalScore) + roundScore;
        // Change the color of numbers
        if (roundScore === 0) 
        { 
            document.querySelector('#score-' + activePlayer).style.color = '#fff';
            document.querySelector('#score-' + activePlayer).textContent = originalScore;
         }
    }
}
// Assign score in case of special combo picks
function comboChecker() {
    // Reset combo counters to default (to prevent bugs)
    fullHouse[fullHouse.length - 3] = 0;
    fullHouse[fullHouse.length - 1] = false;
    jackpot[jackpot.length - 3] = 0;
    jackpot[jackpot.length - 3] = false;
    // Sort the dice array in order to use binary search
    bsort(diceBoard, diceBoard.length);
    // Find all members of the combo
    for (var i = 0; i < diceBoard.length; i++)
    {
        // Found member of fullHouse combo
        if (binarySearch(diceBoard, fullHouse[i], 0, (fullHouse.length - 3)) === true) {
            fullHouse[fullHouse.length - 3] += 1;
        }
        // Found member of jackpot combo
        if (binarySearch(diceBoard, jackpot[i], 0, (jackpot.length - 3)) === true) {
             jackpot[jackpot.length - 3] += 1;
        }
    }
    // Combo Checker
    if (fullHouse[fullHouse.length - 3] === (fullHouse.length - 3)) {
        comboActive = true;
        fullHouse[fullHouse.length - 1] = true;
        if(timesRolled === 0) {
            roundScore += fullHouse[fullHouse.length - 2] - preComboScore;
        } else {
            roundScore += fullHouse[fullHouse.length - 2] - preComboScore + prevRollScore;
        }
    }
    if (jackpot[jackpot.length - 3] === (jackpot.length - 3)) {
        comboActive = true;
        jackpot[jackpot.length - 1] = true;
        if(timesRolled === 0) {
            roundScore += jackpot[jackpot.length - 2] - preComboScore;
        } else {
            roundScore += jackpot[jackpot.length - 2] - preComboScore + prevRollScore;
        }
    }
}
// Assign score for the picked dice
function assignScore (diceValue, timesPicked) {
    // Logic for assigning score when there are 1 or 2 Ones or Fives
    if( timesPicked < 3)
    {
        if (diceValue === 1) { // 100, 200
            return 100 * timesPicked; 
        } else if (diceValue === 5) { // 50, 100
            return 50 * timesPicked; 
        } else { // No other values are being considered
             return 0; 
        }
    }
    else // Logic for assigning score when there are three or more dice of the same value
    {   // Special formula for ones
        if (diceValue === 1) { // 100, 200, 1000, 2000, 3000
            return 100 * (10 * (timesPicked - 2)); 
        } else { // Calculate the geometric sequence for the other values
            return seq(diceValue, (timesPicked - 2));
        }
    }
}
// Assign score based on geometric sequence for 3 or more picked dice of the same value
function seq (base, steps) {
    var sum = 0;
    for (var i = 0; i < steps; i++)
    {   // Combination of Three
        if (steps === 1) // First and only iteration 
        {   // 200 (2x3); 300 (3x3); 400 (4x3); 600 (6x3) 
            sum = base * 100; 
        } 
        else  // Combination of Four or Five
        {
            if (i === 0) { // First iteration
                sum = base * 100; // 200 (2x3); 300 (3x3); 400 (4x3); 600 (6x3)
            } else {  // Next iterations = double the previous value
                 sum *= 2;  // 400, 800 (2); 600, 1200 (3); 800, 1600 (4); 1200, 2400 (6)
            }
        }
    }
    return sum;
}
// Simple Bubble Sort for sorting the dice array in ascending order
function bsort (array, len) {
    var temp, sorted;
    for (var i = 0 ; i < len; i++) {
        sorted = true;
        for (var j; j < (len - i); j++) {
            if (array[j] > array[j + 1]) {
                temp = array[j + 1];
                array[j + 1] = array[j];
                array[j] = temp;
                sorted = false;
            }
        }
        if (sorted === true) {
            return;
        }
    }
}
// Binary search applicable for sorted dice array
function binarySearch (array, x, startIdx, endIdx) {
    // Base condition
    if (startIdx > endIdx) {
        return false;
    }
    // Middle index
    var middleIdx = Math.floor((startIdx + endIdx) / 2);
    // If x is in the middle, x was found
    if (array[middleIdx] === x) {
        return true;
    }
    // If x is greater than the value in the middle, search the left side of the array
    if (array[middleIdx] > x) {
        return binarySearch(array, x, startIdx, middleIdx - 1);
    } else { // Or else search the right side of the array
        return binarySearch(array, x, middleIdx + 1, endIdx);
    }
}
// Switch to the next player
function switchPlayer() {
    // Reset round score and update the UI
    roundScore = 0;     
    // Bug fix for the scenario when one player holds and the other fails on the first roll   
    if (!rolled) {  
        originalScore = scores[activePlayer];
    }
    document.querySelector('#score-' + activePlayer).textContent = parseInt(originalScore);
    document.querySelector('#score-' + activePlayer).style.color = '#fff';
    // Switch to the other player - usage of ternary operator here
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    if (activePlayer === 1) // UI Update - Active Player Highlighting
    {
        document.querySelector('.player-0-panel').classList.remove('active');
        document.querySelector('.player-1-panel').classList.add('active');
    }
    else 
    {
        document.querySelector('.player-1-panel').classList.remove('active');
        document.querySelector('.player-0-panel').classList.add('active');
    }
    // UI Update - Turn Info Text
    document.querySelector('#turn-info').textContent = 'Na tahu je Hráč ' + (activePlayer + 1);
    document.querySelector('#turn-info').style.color = '#fff';
}
// Initialization of default starting values and settings
function init() {
    scores = [0,0];
    roundScore = 0;
    activePlayer = 0;
    finished = false;
    rolled = false;
    isOne = false;
    isFive = false;
    timesPicked = 0;
    timesRolled = 0;
    originalScore = 0;
    prevRollScore = 0;
    // Read the final score from an input or use the default value if it's not possible
    if (document.getElementById('set-score').value === "" || isNaN(document.getElementById('set-score').value)) {
        winningScore = document.getElementById('set-score').defaultValue;
    } else {
        winningScore = document.getElementById('set-score').value;
    }
    hideDice();
    // UI Initial Setup - Turn Info Text
    document.getElementById('turn-info').style.display = 'block';
    document.querySelector('#turn-info').textContent = 'Na tahu je Hráč ' + (activePlayer + 1);
    document.querySelector('#turn-info').style.color = '#fff';
    // UI Initial Setup - New Game button
    document.querySelector('.btn-start').innerHTML = 'Nová hra';
    // UI Initial Setup - Player Scores
    document.querySelector('.player-0-score').textContent = '0';
    document.querySelector('.player-1-score').textContent = '0';
    // UI Initial Setup - Player Names
    document.querySelector('#name-0').textContent = 'Hráč 1';
    document.querySelector('#name-1').textContent = 'Hráč 2';
    document.querySelector('#name-0').style.color = '#fff';
    document.querySelector('#name-1').style.color = '#fff';
    document.querySelector('#name-0').style.fontWeight = '200';
    document.querySelector('#name-1').style.fontWeight = '200';
    // UI Initial Setup - Active Player Highlighting
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');
}
// Hide the dice from the screen
function hideDice() {
    for(var i = 0; i < diceDOM.length; i++)
    {
        diceDOM[i].src = '';
        diceDOM[i].style.width = '0';
    }
}
/*
Dice values:

SINGLE
one - 100
five - 50

THREE
ones - 1000
twos - 200
threes - 300
fours - 400
fives - 500
sixes - 600

FOUR:
ones - 2000
twos - 400
threes - 600
fours - 800
fives - 1000
sixes - 1200

FIVE:
ones - 3000
twos - 800
threes - 1200
fours - 1600
fives - 2000
sixes - 2400

*/
