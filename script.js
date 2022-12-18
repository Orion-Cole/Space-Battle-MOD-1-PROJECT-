document.getElementById('startGameButton').addEventListener('click', () => { //listens for click of start button
    document.getElementById('startGameButton').style.display = 'none'; //hide start button
    setTimeout(() => {startGame();}, 1000); //delay of 1 second so button has time to vanish
});



const endGame = (text) => { //ENDS THE GAME
    //console.log('Game Over ' + text);
    let winner;
    text == 'player win'? winner = 'You won!' : winner = 'You Lose!';
    let userInput = window.prompt(`Game Over! ${winner} would you like to play again?`);
    if (userInput == 'yes') {
        //console.log('replay game');
        document.getElementById('shipHull').textContent = 20; //resets user hull in html
        setTimeout(() => {startGame()}, 1000);
    } else {
        console.log('quit game')
        location.reload();
    }
}


const startGame = () => {

const playerShip = { //PLAYER SHIP OBJECT
    hull:20,
    firePower:5,
    accuracy:.7,
    attack(enemyHull) { //attack enemy method
        if(Math.random() <= this.accuracy) {
            return enemyHull - this.firePower;
        } else {
            return enemyHull;
        }
    }
}


class AlienShip { 
    constructor(number) { //ALIEN SHIP PROPERTIES
        this.id = number;
        this.hull = Math.floor(Math.random()*(6 - 3 + 1))+3; //RANDOM HULL
        this.firePower = Math.floor(Math.random()*(4 - 2 + 1))+2; //RANDOM FIREPOWER
        this.accuracy = Number.parseFloat(Math.random()*(.8 - .6 )+.6).toFixed(1); //RANDOM ACCURACY
        this.destroyed = false;
    }
    attack(playerHull) { //attack player method
        if(Math.random() <= this.accuracy) {
            return playerHull - this.firePower;
        } else {
            return playerHull;
        }
    }
}

class AlienShipFactory {
    constructor(){
        this.alienShipArray = []; //contains all generated alien ships
    }
    createShip(number) {
        const alienShip = new AlienShip(number); //calls class to make new randomized ship
        this.alienShipArray.push(alienShip); //pushes new ship to array

        let alienDiv = document.createElement('div'); //mk div
        alienDiv.setAttribute('id', 'x' + number);
        alienDiv.setAttribute('class','alienDiv');
        alienDiv.setAttribute('display', 'flex');

        let image = document.createElement('img'); //mk img
        image.src = 'galaga-bee.png';
        image.alt = 'alien ship';
        image.classList.add('alienShipPicture');

        let hullData = document.createElement('div') //mk hullData
        hullData.setAttribute('id', number);
        hullData.innerHTML = `Hull: ${alienShip.hull}`;
        
        let idTag = document.createElement('div'); //mk id tag
        idTag.innerHTML = 'Alien ' + number;
        
        let firePowerData = document.createElement('div'); //mk firePowerData
        firePowerData.textContent = 'Firepower: ' + alienShip.firePower;

        let accuracyData = document.createElement('div'); //mk accuracyData
        accuracyData.textContent = 'Accuracy: ' + alienShip.accuracy;

        alienDiv.appendChild(idTag);//mk id child of div
        alienDiv.appendChild(image); //mk img child of div
        alienDiv.appendChild(hullData); //mk hullData child of div
        alienDiv.appendChild(firePowerData); //mk firePowerData child of div
        alienDiv.appendChild(accuracyData); //mk accuracyData child of div

        document.getElementById('alienShipsContainer').appendChild(alienDiv);  //mk div child of container
    }
}

const alienShipFactory = new AlienShipFactory(); //make alien ship factory

alienShipFactory.alienShipArray = []; //reset array
document.getElementById('alienShipsContainer').innerHTML = "";//resets alienShip divs


const numberOfShips = 6; //determine how many ships to make
for (let i=1; i<=numberOfShips; i++) { //also give ships number id
    alienShipFactory.createShip(i);
}



const updateAlienHullCounter = (ship) => { //function to update an aliens ship hull display when called
    let id = ship.id
    let currentHull = ship.hull;
    document.getElementById(id).innerHTML = `Hull: ${currentHull}`;
}



//BATTLE LOOP

const battle = (alien) => {
//console.log(`Players hull: ${playerShip.hull}`);


        while(alien.hull > 0) {
            alien.hull = playerShip.attack(alien.hull); //PLAYER ATTACKS
                updateAlienHullCounter(alien);
            
            if(alien.hull <= 0) {
                alien.destroyed = true;
                //console.log(alien.id + ' destroyed');
                if (alienShipFactory.alienShipArray.every((ship) => {if (ship.destroyed == true) {return true}})) {
                    setTimeout(() => {endGame('player win')},1000);
                    //console.log('PLAYER WIN CONDITION MET');
                } else {
                    setTimeout(() => {chooseTarget()},1000);
                    //console.log('choose new target');
                }
            } else {
                playerShip.hull = alien.attack(playerShip.hull); //ALIEN ATTACKS
                //console.log(`The alien attacks! Hull at: ${playerShip.hull}`);
                document.getElementById('shipHull').textContent = playerShip.hull;
                if(playerShip.hull <= 0) {
                    setTimeout(() => {endGame('player lose')}, 1000); //delay so ship hull value may update
                }
            }
    
            
        }
}



const chooseTarget = () => { //gets user input on what to target then calls battle loop
    let targetShipId = window.prompt('Which ship do you want to attack?');
    let targetShip = alienShipFactory.alienShipArray[targetShipId-1];
    if (targetShip.destroyed == false) {
        battle(targetShip);
    } else {
        targetShipId = window.prompt('Ship already destroyed. Which ship do you want to attack?');
        targetShip = alienShipFactory.alienShipArray[targetShipId-1];
        battle(targetShip);
    }
}

setTimeout(()=> {chooseTarget()},3000); //call chooseTarget
}