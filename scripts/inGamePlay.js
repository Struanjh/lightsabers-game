
export { movePlayerOnBoard, setPlayerMsg, displayUserMsg, setNextActivePlayer, getCurrentActivePlayer, spinTheDice, displayRolledNum, landedOnSaber, moveToNextPlayer, controlTheGame, clearGame, startGame, resetGame};

//------------------Roll Dice Functionality-------------------------------//

const movePlayerOnBoard = (index, currentPos) => {
    //Physically move the player by removing element then appending to new square
    let newPos = document.querySelector(`[index="${index}"]`);
    currentPos.removeChild(activePlayerInstances[0]);
    newPos.appendChild(activePlayerInstances[0]);
    return newPos;
}

const setPlayerMsg = (num) => {
   let msg;
   let currentPos = activePlayerInstances[0].parentElement;
   let index = parseInt(currentPos.getAttribute('index'));
   index += num;
   //If current index = a saber position, the object for the saber is returned, otherwise undefined
   let saberMove = sabersArr.find(saberMove => saberMove.startPos === index);
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
}

const landedOnSaber = (msg) => {
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

const clearGame = () => {
    //Renable all options aside from first one
    for (let i = 1; i < playerSelection.length; i++) {
        playerSelection[i].disabled = false;
    }
    let players = document.querySelectorAll('[player]');
    for (let i = 0; i < players.length; i++) {
        players[i].parentNode.removeChild(players[i]);
    }
    selectedPlayerCount = 0;
    charSubmitButton.disabled = true;
    charSelectionLabel.textContent = 'Choose between 2 & 4 characters..';
    gameControlButtons.style.visibility = 'hidden';
}

const startGame = () => {
    choosePlayerContainer.style.display = 'none';
    diceContainer.style.display = 'flex';
    document.querySelector('.section.flex,section.player-settings').style.justifyContent = 'space-around';
    rollDiceButton.disabled = false;
    resetGameButton.style.display = 'inline';
    startGameButton.style.display = 'none';
    // inGame.getCurrentActivePlayer();
    // inGame.displayUserMsg('Your Turn!! 👍 👍');
    getCurrentActivePlayer();
    displayUserMsg('Your Turn!! 👍 👍');
}

const resetGame = () => {
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

const wait = (secs) => {
    return new Promise((resolve) => {
        setTimeout(
            resolve,
            secs * 1000
        );
    });
}

const controlTheGame = () => {
    let num = spinTheDice();
    wait(2)
    .then(() => {
        displayRolledNum(num);
        return wait(2);
    }) 
    .then(()=> {
        let msg = setPlayerMsg(num);
        if (msg.saber) {
            wait(2)
            .then(() => {
                  //Pause to alert the user that they landed on a lightsaber & pass extra arg containing color for animation class
                  activePlayerInstances[1].lastElementChild.classList.add('message-focus');
                  displayUserMsg(msg.msg[0], msg.saber['color']);
                  return wait(2)
                  .then(() => {
                    //Tell the user how many spaces they move up or down
                    displayUserMsg(msg.msg[1]);
                    return wait(2)
                  })
                  .then(() => {
                    landedOnSaber(msg);
                    return wait(2)
                  })
                  .then(() => {
                    activePlayerInstances[1].lastElementChild.classList.remove('message-focus');
                    activePlayerInstances[1].classList.remove(`player-animation-${msg.saber['color']}`);
                    moveToNextPlayer(msg.saber['color']);
                  })
            })
        } else {
            wait(1)
            .then(() => {
                displayUserMsg(msg.msg);
                return wait(2)
            })
            .then(() => {
                moveToNextPlayer();
            })
        }
    })
}