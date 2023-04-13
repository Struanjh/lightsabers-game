

///---------------Set Up The Game-------------------//

export let gameParams = {
    gridDimensions: () => {
        if (difficultyLevel === 'low') {
            gridDimensions = 5;
        } else if (difficultyLevel === 'medium') {
            gridDimensions = 7;
        } else gridDimensions = 9; 
        totalGridSquares = gridDimensions * gridDimensions;
    },
    nrSabers: () => {
            if (difficultyLevel === 'low') return gridDimensions;
            else if (difficultyLevel === 'medium') return gridDimensions * 2;
            else return gridDimensions * 3;  
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
                //This saber is in the first column, it must be tilted right (to avoid moving off the board)
                sabersArr[i]['tilt'] = 'rightTilt';
            } else if (sabersIndexPos.lastCol.includes(parseInt(sabersArr[i]['num']))) {
                //This saber is in the last column, it must be tilted left (to avoid moving off the board)
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
        difficultyLevel = optionList[optionList.selectedIndex].value;
        introContainer.style.display = 'none';
        allContainer.style.display = 'flex';
        body.style.backgroundImage = "url('./Images/Backgrounds/82395.jpg')"; 
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
        board = document.querySelector('div.container div.grid'); 
        square_one = document.querySelector('[index="1"]');
    }
}

