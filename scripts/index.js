
import * as createIntro from './createIntroScreen.js';
import * as inGame from './inGamePlay.js';
import { gameParams } from './initializeGame.js';
import * as selectChars from './selectChars.js';


window.addEventListener('load', createIntro.createIntroSection);
difficultyBtn.addEventListener('click', gameParams.generateBoard)
charSubmitButton.addEventListener('click', selectChars.selectChar)
playerSelection.addEventListener('change', selectChars.togglePlayerImg)
playerSelection.addEventListener('click', selectChars.controlPlayerSelection)
startGameButton.addEventListener('click', inGame.startGame)
resetGameButton.addEventListener('click', inGame.resetGame)
clearSelectionButton.addEventListener('click', inGame.clearGame);
rollDiceButton.addEventListener('click', inGame.controlTheGame);


