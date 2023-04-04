//------------------Global Variables - Game Creation-------------------------------//

// let gridDimensions = 5;
let gridDimensions;
// let totalGridSquares = gridDimensions * gridDimensions;
let totalGridSquares;
let sabersArr;
const difficultyBtn = document.createElement('button');
const optionList = document.createElement('select');
let difficultyLevel = 'low';
const introContainer = document.createElement('div');
const allContainer = document.getElementById('board-container');
const body = document.querySelector('body')
// const board = document.querySelector('div.container div.grid') //yes
// const square_one = document.querySelector('[index="1"]'); //yes
let board;
let square_one;
const diceContainer = document.querySelector('.dice.flex'); 
const rollDiceButton = document.getElementById('roll-dice');
const diceImage = document.querySelector('.dice-spin');
let diceMessage = document.getElementById('dice-message');
let playerSelection = document.getElementById('characters');
let charSelectionImg = document.getElementById('character-image');
const charSubmitButton = document.getElementById('char-selection-submit');
const clearSelectionButton = document.getElementById('clear-selection-submit');
const choosePlayerContainer = document.querySelector('.player-settings .players');
const selectedPlayersContainer = document.getElementById('selected-players-container');
const gameControlButtons = document.getElementById('game-control-buttons-container');
const startGameButton = document.getElementById('start-game');
const resetGameButton = document.getElementById('reset-game');
const winnerMsg = 'Congratulations! You\'re the winner! 🥳🥳🥳🥳';
let charSelectionLabel = document.getElementById('char-selection-label');
let selectedPlayer;
let selectedPlayerMsg;

///---------------Difficulty Level Selection-------------------//

const createIntroSection = () => {
    allContainer.style.display = 'none';
    introContainer.setAttribute('id', 'introContainer');
    let titleImg = document.createElement('img');
    titleImg.setAttribute('src', './Images/starwarstitletext.png');
    titleImg.setAttribute('alt', 'Title text');
    let optionsContainer = document.createElement('div');
    optionsContainer.setAttribute('id', 'optionsContainer');
    let optionsLabel = document.createElement('label');
    optionsLabel.setAttribute('for', 'difficultyLevels');
    optionsLabel.textContent = 'Select a difficulty level...';
    optionList.setAttribute('id', 'difficultyLevels');
    optionList.setAttribute('name', 'difficultyLevels');
    let low = document.createElement("option");
    low.value = 'low';
    low.text = 'Low';
    let medium = document.createElement("option");
    medium.value = 'medium';
    medium.text = 'Medium';
    let high = document.createElement("option");
    high.value = 'high';
    high.text = 'High';
    optionList.add(high);
    optionList.add(medium);
    optionList.add(low);
    difficultyBtn.setAttribute('id', 'difficulty-selection-submit');
    difficultyBtn.textContent = 'Submit';
    optionsContainer.appendChild(optionsLabel);
    optionsContainer.appendChild(optionList);
    optionsContainer.appendChild(difficultyBtn);
    introContainer.appendChild(titleImg);
    introContainer.appendChild(optionsContainer);
    document.querySelector('body').appendChild(introContainer);
}

///---------------Set Up The Game-------------------//

let gameParams = {
    gridDimensions: () => {
        if (difficultyLevel === 'low') {
            gridDimensions = 5;
        } else if (difficultyLevel === 'medium') {
            gridDimensions = 7;
        } else gridDimensions = 9; 
        totalGridSquares = gridDimensions * gridDimensions;
    },
    nrSabers: () => {
            if (difficultyLevel === 'low') nrSabers = gridDimensions;
            else if (difficultyLevel === 'medium') nrSabers = gridDimensions * 2;
            else nrSabers = gridDimensions * 3; 
            return nrSabers;  
    },
    saberPositions: (nrSabers) => {
            //Function generates an array of objects. Each object represents a saber to be inserted on the board.
            //Each object gets populated with a unique random number within the range of the board -> 'num'.
            //The number of objects to be generated is determined by nrSabers paramter -> based on difficulty level.
            let sabers = [];
            let numExists;
            let num;
            for (let i = 0; i < nrSabers; i++) {
                numExists = false;
                num = Math.floor(Math.random() * (totalGridSquares - gridDimensions) + gridDimensions + 1);
                //Check if num is already in an object in the array......
                for (let i = 0; i < sabers.length; i++) {
                    if (sabers[i]['num'] === num) {
                        //No need for the num exists variable here....
                        numExists = true;
                        break;
                    }
                }
                //If num is already in the array decrement the index and repeat the iteration
                if (numExists) {
                    i--;
                    continue;
                } else {
                    let saber = {'num':num};
                    sabers.push(saber);
                }
            }
            return sabers;
    },
    firstLastColIndexes: () => {
            let firstCol = [];
            let lastCol = [];
            for (let i = gridDimensions; i >= 1; i--) {
                let firstColVal;
                let lastColVal;
                if (i % 2 !== 0) {
                    //Even Row
                    lastColVal = i * gridDimensions;
                    firstColVal = lastColVal - (gridDimensions - 1);
        
                } else {
                    //Odd Row
                    firstColVal = i * gridDimensions;
                    lastColVal = firstColVal - (gridDimensions - 1);
                }
                firstCol.push(firstColVal);
                lastCol.push(lastColVal);
            }
            return {firstCol, lastCol};
    },
    randomSaberColors: (nrSabers) => {
            let colors = []; 
            let red, green, blue;
            //Set number of sabers per color based on difficulty level selected..
            switch (difficultyLevel) {
                case 'high':
                    red = Math.ceil(nrSabers * 0.8);
                    blue = Math.ceil(nrSabers * 0.1);
                    green = Math.ceil(nrSabers * 0.1);
                    break;
                case 'medium':
                    red = Math.ceil(nrSabers * 0.6);
                    blue = Math.ceil(nrSabers * 0.2);
                    green = Math.ceil(nrSabers * 0.2);
                    break;
                case 'low':
                    red = Math.ceil(nrSabers * 0.3);
                    blue = Math.ceil(nrSabers * 0.4);
                    green = Math.ceil(nrSabers * 0.3);
                    break;
            }
            let i = 0;
            while ( i < nrSabers) {
                if (i < red) colors.push('red');
                else if (i >= red && i <= (nrSabers - green)) colors.push('blue');
                else colors.push('green');
                i ++;
            }
             //shuffle the colors so they're assigned randomly
             colors.sort(() => Math.random() - 0.5);
             console.log(colors);
            return colors;
    },
    moveCharOddRow: () => {
        let ref = -1;
        //For a given column index and tilt position (for odd rows) - this object shows how many spaces to move a character
        let oddCells = {};
        for (let i = 1; i <= gridDimensions; i++) {
            oddCells[i] = {};
            oddCells[i]['none'] = ref;
            oddCells[i]['leftTilt'] = ref + 1;
            oddCells[i]['rightTilt'] = ref - 1;
            ref -= 2;
        }
        return oddCells;
    },
    moveCharEvenRow: () => {
        //For a given column index and tilt position (for even rows) - this object shows how many spaces to move a character
        let ref = -1;
        let evenCells = {};
        for (let i = gridDimensions; i >= 1; i--) {
            evenCells[i] = {};
            evenCells[i]['none'] = ref;
            evenCells[i]['leftTilt'] = ref - 1;
            evenCells[i]['rightTilt'] = ref + 1;
            ref -= 2;
        }
        return evenCells;
    },
    populateSabersObj: () => {
        gameParams.gridDimensions();
        let nrSabers = gameParams.nrSabers();
        sabersArr = gameParams.saberPositions(nrSabers);
        console.log('SABER POSITIONS ON THE BOARD', sabersArr);
        let saberColors = gameParams.randomSaberColors(nrSabers);
        let sabersIndexPos = gameParams.firstLastColIndexes();
        let evenRowMove = gameParams.moveCharEvenRow();
        let oddRowMove = gameParams.moveCharOddRow();
        const tilt = ['leftTilt', 'rightTilt', 'none'];

        for (let i = 0; i < sabersArr.length; i++) {
            //Assign Colors
            sabersArr[i]['color'] = saberColors[i];
            //Assign Tilts
            if (sabersIndexPos.firstCol.includes(parseInt(sabersArr[i]['num']))) {
                //This saber is in the first column, it must be tilted right
                sabersArr[i]['tilt'] = 'rightTilt';
            } else if (sabersIndexPos.lastCol.includes(parseInt(sabersArr[i]['num']))) {
                //This saber is in the last column, it must be tilted left
                sabersArr[i]['tilt'] = 'leftTilt';
            } else {
                //This saber is not in first or last col so assign a random tilt
                let rand = Math.floor((Math.random() * tilt.length));
                sabersArr[i]['tilt'] = tilt[rand];
            }

            //Assign Column Index Numbers & Positions To Move
            if ((Math.ceil(sabersArr[i]['num'] / gridDimensions)) % 2 !== 0) {
                //For Odd Rows
                sabersArr[i]['colIndex'] = sabersArr[i]['num'] % gridDimensions === 0 ? gridDimensions : sabersArr[i]['num'] % gridDimensions;
                sabersArr[i]['movePos'] = oddRowMove[sabersArr[i]['colIndex']][sabersArr[i]['tilt']];
            } else {
                //For Even Rows
                for (let j = sabersIndexPos.firstCol.length-2; j >= 1; j-= 2) {
                    if (sabersArr[i]['num'] <= sabersIndexPos.firstCol[j]) {
                        sabersArr[i]['colIndex'] = sabersIndexPos.firstCol[j]-sabersArr[i]['num'] + 1;
                        sabersArr[i]['movePos'] = evenRowMove[sabersArr[i]['colIndex']][sabersArr[i]['tilt']];
                        break;
                    }
                }
            }
            //Assign Start and Stop Positions
            if (sabersArr[i]['color'] === 'red') {
                sabersArr[i]['startPos'] = sabersArr[i]['num'];
                sabersArr[i]['endPos'] = sabersArr[i]['num'] + sabersArr[i]['movePos'];
            } else {
                //Green or blue
                sabersArr[i]['startPos'] = sabersArr[i]['num'] + sabersArr[i]['movePos']
                sabersArr[i]['endPos'] = sabersArr[i]['num'];
            }
        }
    return sabersArr;
    },
    generateSaberImages: (arr) => {
        let lightSaberImages = [];
        let lightSaberPositions = [];
        let lightSaber;
        let pos;
        for (let i = 0; i < arr.length; i++) {
            pos = arr[i]['num'];
            lightSaberPositions.push(pos)
            lightSaber = document.createElement('img');
            lightSaber.classList.add('lightsaber', arr[i]['tilt']);
            lightSaber.setAttribute('src', `./Images/Star-Wars-Characters/lightsaber-${arr[i]['color']}.png`);
            lightSaberImages.push(lightSaber);
        }
        return {lightSaberImages, lightSaberPositions};
    },
    generateBoardSquare: (index, saberImages) => {
        //Index contains the number of that square on a given row.....
        let gridItem = document.createElement('div');
        gridItem.setAttribute('class', 'grid');
        gridItem.setAttribute('class', 'square');
        gridItem.setAttribute('index', index);
        let gridNum = document.createElement('p');
        gridNum.textContent = String(index);
        gridItem.appendChild(gridNum);
        //Check if there should be a lightsaber image on this board position
        let saberIndex = saberImages.lightSaberPositions.indexOf(index);
        if (saberIndex !== -1) gridItem.appendChild(saberImages.lightSaberImages[saberIndex]);
        return gridItem;
    },
    generateBoard: () => {
        sabersArr = gameParams.populateSabersObj();
        let myGrid = document.createElement('div');
        let saberImages = gameParams.generateSaberImages(sabersArr);
        let rowTracker = -1;
        let gridSquare;
        for (let i = gridDimensions; i >= 1; i--) {
            let startPos;
            let endPos;
            //If the row is odd....
            if (i % 2 !== 0) {
                //decrement the rowTracker by 2
                rowTracker += 2;
                //Set start and ending positions
                startPos = gridDimensions * (gridDimensions - rowTracker) + 1;
                endPos = startPos + (gridDimensions - 1);
                //Populate the row by incrementing from the starting position
                for (let j = startPos; j <= endPos; j++) {
                    gridSquare = gameParams.generateBoardSquare(j, saberImages);
                    myGrid.appendChild(gridSquare);
                }
            } else {
                //Otherwise the row must be even...
                startPos = gridDimensions * (gridDimensions - rowTracker);
                endPos = startPos - (gridDimensions - 1);
                for (let k = startPos; k >= endPos; k--) {
                    gridSquare = gameParams.generateBoardSquare(k, saberImages);
                    myGrid.appendChild(gridSquare);
                }
            }
        }
        myGrid.setAttribute('class', 'grid');
        myGrid.style.gridTemplateColumns = "1fr ".repeat(gridDimensions);
        myGrid.style.gridTemplateRows = "1fr ".repeat(gridDimensions);
        allContainer.prepend(myGrid); 
    }
}

window.addEventListener('load', () => {
    createIntroSection();
  });



difficultyBtn.addEventListener('click', 
  () => {
    difficultyLevel = optionList[optionList.selectedIndex].value;
    console.log(difficultyLevel);
    introContainer.style.display = 'none';
    allContainer.style.display = 'flex';
    body.style.backgroundImage = "url('./Images/Backgrounds/82395.jpg')";
    gameParams.generateBoard();
    board = document.querySelector('div.container div.grid'); //yes
    square_one = document.querySelector('[index="1"]'); //yes
  }
)

//------------------Global Variables - Game Play-------------------------------//

//Disable/hide buttons on page load
charSubmitButton.disabled = true;
rollDiceButton.disabled = true;
gameControlButtons.style.visibility = 'hidden';
resetGameButton.style.display = 'none';
diceContainer.style.display = 'none';
document.querySelector('.section.flex,section.player-settings').style.justifyContent = 'space-around';


let activePlayerInstances;
let selectedPlayerCount = 0;

//------------------Select Player Functionality-------------------------------//


const sendCharsToBoard = (playerVal) => {
    let newChar = document.createElement('img');
    newChar.setAttribute('src', `./Images/Star-Wars-Characters/${playerVal.value}.png`);
    newChar.setAttribute('height', `70%`);
    newChar.setAttribute('width', `70%`);
    newChar.setAttribute('player', `${selectedPlayerCount + 1}`);
    if (selectedPlayerCount + 1 == 1) newChar.classList.add('activePlayer');
    square_one.appendChild(newChar);
}

const insertSelectedPlayer = (playerVal) => {
    //Select container div for players
    let selectedPlayersContainer = document.querySelector('#selected-players-container');
    //Create the h3, img, and msg div for each player
    let playerContainer = document.createElement('div')
    playerContainer.setAttribute('class', 'flex');
    playerContainer.setAttribute('player', `${selectedPlayerCount + 1}`);
    if (selectedPlayerCount + 1 == 1) playerContainer.classList.add('activePlayer');
    playerContainer.style.flex = '1 1 0px';
    let playerHeader = document.createElement('h3')
    playerHeader.textContent = `Player ${selectedPlayerCount + 1}`;
    let playerImg = document.createElement('img')
    playerImg.setAttribute('src', `./Images/Star-Wars-Characters/${playerVal.value}.png`);
    selectedPlayerMsg = document.createElement('p')
    selectedPlayerMsg.textContent = '';
    playerContainer.appendChild(playerHeader);
    playerContainer.appendChild(playerImg);
    playerContainer.appendChild(selectedPlayerMsg);
    selectedPlayersContainer.appendChild(playerContainer);  
}


const displayCharImg = (playerVal) => {
    charSelectionImg.setAttribute('src', `./Images/Star-Wars-Characters/${playerVal}.png`)
}

charSubmitButton.addEventListener('click', 
    () => {
        //Temporarily disable the button and selector whilst transitions take place
        // playerSelection.setAttribute('disabled','');
        playerSelection.disabled = true;
        charSubmitButton.disabled = true;
        clearSelectionButton.disabled = true;
        //Remove the player the user selected as an option
        selectedPlayer.setAttribute('disabled', '');
        //Reset selections to default choice only after transition completed...
        setTimeout(
            () => {
                charSelectionImg.setAttribute('src', './Images/Star-Wars-Characters/choice.png')
                playerSelection.value = 'choice';
                playerSelection.disabled = false;
                clearSelectionButton.disabled = false;
            },
            200
        );
        //This function will run in the interim    
        sendCharsToBoard(selectedPlayer);
        insertSelectedPlayer(selectedPlayer);
         //Enable game control buttons if 2 players have been selected
        selectedPlayerCount ++;
        selectedPlayerCount >= 2 ? gameControlButtons.style.visibility = 'visible' : gameControlButtons.style.visibility = 'hidden';
        if (selectedPlayerCount === 4) {
            charSubmitButton.disabled = true;
            charSelectionLabel.textContent = 'You have selected the maximum number of players!';
        }

       
    }
)

playerSelection.addEventListener('click',
    () => {
        playerSelection.firstElementChild.setAttribute('disabled','');
        if (selectedPlayerCount !== 4) charSubmitButton.disabled = false;
    }
)

playerSelection.addEventListener('change', () => {
    selectedPlayer = playerSelection[playerSelection.selectedIndex];
    let selectedPlayerVal = selectedPlayer.value;
    displayCharImg(selectedPlayerVal);
})


const clearGame = () => {
        //Renable all options aside from first one
        for (let i = 1; i < playerSelection.length; i++) {
            playerSelection[i].disabled = false;
        }
        let players = document.querySelectorAll('[player]');
        console.log(players);
        for (let i = 0; i < players.length; i++) {
            players[i].parentNode.removeChild(players[i]);
        }
        selectedPlayerCount = 0;
        charSubmitButton.disabled = true;
        charSelectionLabel.textContent = 'Choose between 2 & 4 characters..';
        gameControlButtons.style.visibility = 'hidden';
}

clearSelectionButton.addEventListener('click', clearGame);
    

//------------------Roll Dice Functionality-------------------------------//

const movePlayerOnBoard = (index, currentPos) => {
     //Physically move the player by removing element then appending to new square
     let newPos = document.querySelector(`[index="${index}"]`);
     currentPos.removeChild(activePlayerInstances[0]);
     newPos.appendChild(activePlayerInstances[0]);
     console.log('NEWWWW POS!', newPos);
     return newPos;
}

const setPlayerMsg = (num) => {
    let msg;
    let currentPos = activePlayerInstances[0].parentElement;
    let index = parseInt(currentPos.getAttribute('index'));
    index += num;
    console.log('INDEX', index);
    //If current index = a saber position, the object for the saber is returned, otherwise undefined
    let saberMove = sabersArr.find(saberMove => saberMove.startPos === index);
    console.log(saberMove);
    //If the number moves the player off the board then return the message and don't move player
    if (index > totalGridSquares) {
        index -= num;
        msg = 'Unlucky! Your number was too high! 😂😂😂';
        return {msg: msg};
    }
    else if (index === totalGridSquares) {
        msg = winnerMsg;
        return {msg: msg};
    } //Check if the player landed on a lightsaber move position
    else if (saberMove) {
        console.log(activePlayerInstances[0]);
        switch (saberMove['color']) {
            case 'red':
                msg = [[`Oh No! You landed on a red lightsaber 😂😂!`],[`Move back ${String(saberMove['movePos']).slice(1)} spaces!`]];
                break;
            case 'blue':
                msg = [[`You landed on a blue lightsaber 🥳🥳!`],[`Move forward ${String(saberMove['movePos']).slice(1)} spaces & roll the dice again!`]];
                break;
            case 'green':
                msg = [[`You landed on a green lightsaber 🥳🥳!`],[`Move forward ${String(saberMove['movePos']).slice(1)} spaces!`]];
                break;
        }
        if (index === totalGridSquares) msg.push(winnerMsg);
    } else {
        msg = 'Your Turn!! 👍 👍';
    }
    currentPos = activePlayerInstances[0].parentElement;
    console.log('CURRENT POS AFTER INDEX CHANGED', currentPos, 'INDEX', index);
    let newPos = movePlayerOnBoard(index, currentPos)
    return {msg: msg, saber: saberMove, index: index, pos: newPos};
}

const displayUserMsg = (msg, saberColor) => {
    activePlayerInstances[1].lastElementChild.textContent = msg;
    if (saberColor) activePlayerInstances[1].classList.add(`player-animation-${saberColor}`);
    if (msg === winnerMsg) {
        setTimeout(
            () => {
                window.location.reload();
            }, 2000
        );
    }
}

const setNextActivePlayer = () => {
      //Reset Prev Active Player
       let playerNum = parseInt(activePlayerInstances[0].getAttribute('player'));
       activePlayerInstances[0].classList.remove('activePlayer');
       activePlayerInstances[1].classList.remove('activePlayer');
       activePlayerInstances[1].lastElementChild.textContent = '';
      //If active player is the last player, move to player 1. Otherwise increment the player number
       if (playerNum === selectedPlayerCount) {
           playerNum = 1;
       } else {
          playerNum ++;
       }
       //Set the new active player
        activePlayerInstances = document.querySelectorAll(`[player="${playerNum}"]`);
        activePlayerInstances[0].classList.add('activePlayer');
        activePlayerInstances[1].classList.add('activePlayer');
 }

//Get currently Active Player
const getCurrentActivePlayer = () => {
    activePlayerInstances = document.querySelectorAll(`.activePlayer`)
}

const spinTheDice = () => {
    rollDiceButton.disabled = true;
    diceImage.setAttribute('src', `./Images/Dice/dice.png`)
    diceMessage.textContent = 'You rolled the dice......'
    let num = Math.floor(Math.random() * 6) + 1;
    diceImage.classList.add('dice-animation');
    return num;
}


const displayRolledNum = (num) => {
    diceImage.setAttribute('src', `./Images/Dice/dice${num}.png`);
    diceMessage.textContent = `You rolled a ${num}`;
    diceImage.classList.remove('dice-animation');
    getCurrentActivePlayer();
    console.log('FIRST! DISPLAY ROLLED NUMBER AFTER 2 SECS');
}

 const landedOnSaber = (msg) => {
    console.log('OLD POS', msg.index, msg.saber, msg.pos);
    //Do an animation based on the color of saber
    let saberColor = msg.saber['color'];
    //Change the index number to get players new position....
    if (saberColor === 'red') {
        msg.index += msg.saber['movePos'];
    } else {
        msg.index -= msg.saber['movePos'];
    }
    movePlayerOnBoard(msg.index, msg.pos);
 }


const moveToNextPlayer = (color) => {
    diceImage.setAttribute('src', `./Images/Dice/dice.png`);
    diceMessage.textContent = '';
    //If saber blue skip this line - player gets an additional turn....
    if (color !== 'blue') setNextActivePlayer();
    displayUserMsg('Your Turn!! 👍 👍');
    rollDiceButton.disabled = false;
}


const controlTheGame = () => {
    let num = spinTheDice();
    //Wait until dice rolled before displaying number
    setTimeout (
        () => {
            displayRolledNum(num);
            //Wait until number has displayed before physically moving player
            setTimeout(
                () => {
                    let msg = setPlayerMsg(num);
                    if (msg.saber) {
                        //Repeat this block of code so long as the user continues to land on sabers....
                        // while (msg.saber) {
                            //If the user landed on a saber.. perform 2 additional actions.......
                            setTimeout(
                                () => {
                                    //Pause to alert the user that they landed on a lightsaber & pass extra arg containing color for animation class
                                    activePlayerInstances[1].lastElementChild.classList.add('message-focus');
                                    displayUserMsg(msg.msg[0], msg.saber['color']);
                                    //Pause to tell the user how many spaces they move up or down....
                                    setTimeout(
                                        () => {
                                            displayUserMsg(msg.msg[1]);
                                            //Pause before moving player to new saber position
                                            setTimeout(
                                                () => {
                                                    landedOnSaber(msg);
                                                    //Pause before Moving to the next player
                                                    setTimeout(
                                                        () => {
                                                            activePlayerInstances[1].lastElementChild.classList.remove('message-focus');
                                                            activePlayerInstances[1].classList.remove(`player-animation-${msg.saber['color']}`);
                                                            //Call setplayer msg again to test if another saber was landed on
                                                            //0 passed as argument since dice hasn't been rolled again
                                                            // msg = setPlayerMsg(0);
                                                            moveToNextPlayer(msg.saber['color']);
                                                        }, 2000
                                                    );
                                                }, 2000
                                            );
                                        }, 2000
                                    );
                                }, 2000
                            );
                        // }
                    } else {
                        setTimeout(
                            () => {
                                displayUserMsg(msg.msg);
                                setTimeout(
                                    () => {
                                        moveToNextPlayer();
                                    }, 2000
                                );
                            }, 1000
                        );
                    } 
                }, 2000
            );
        }, 2000
    );
}






rollDiceButton.addEventListener('click', controlTheGame);

//Start the game
startGameButton.addEventListener('click', 
    () => {
        choosePlayerContainer.style.display = 'none';
        diceContainer.style.display = 'flex';
        document.querySelector('.section.flex,section.player-settings').style.justifyContent = 'space-around';
        rollDiceButton.disabled = false;
        resetGameButton.style.display = 'inline';
        startGameButton.style.display = 'none';
        getCurrentActivePlayer();
        displayUserMsg('Your Turn!! 👍 👍');
    }
)

//Reset the game
resetGameButton.addEventListener('click', 
    () => {
        choosePlayerContainer.style.display = 'flex';
        diceContainer.style.display = 'none';
        document.querySelector('.section.flex,section.player-settings').style.justifyContent = 'space-around';
        rollDiceButton.disabled = true;
        startGameButton.style.display = 'inline';
        resetGameButton.style.display = 'none';
        rollDiceButton.disabled = true;
        diceImage.setAttribute('src', `./Images/Dice/dice.png`);
        diceMessage.textContent = '';
        clearGame();
    }
)

