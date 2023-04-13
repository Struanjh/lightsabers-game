

//------------------Global Variables - DOM Elements-------------------------------//
const optionList = document.createElement('select');
let difficultyLevel = 'low';
const introContainer = document.createElement('div');
const allContainer = document.getElementById('board-container');
const body = document.querySelector('body')
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
const difficultyBtn = document.createElement('button');


//------------------Global Variables - Game Play-------------------------------//
let gridDimensions;
let totalGridSquares;
let sabersArr;
let board;
let square_one;
let selectedPlayer;
let selectedPlayerMsg;
let activePlayerInstances;
let selectedPlayerCount = 0;