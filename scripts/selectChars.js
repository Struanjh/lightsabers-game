
export {sendCharsToBoard, insertSelectedPlayer, displayCharImg, selectChar, togglePlayerImg, controlPlayerSelection}

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

const togglePlayerImg = () => {
    selectedPlayer = playerSelection[playerSelection.selectedIndex];
    let selectedPlayerVal = selectedPlayer.value;
    displayCharImg(selectedPlayerVal);
}

const controlPlayerSelection = () => {
    playerSelection.firstElementChild.setAttribute('disabled','');
    if (selectedPlayerCount !== 4) charSubmitButton.disabled = false;
}

const selectChar = () => {
    //Temporarily disable the button and selector whilst transitions take place
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