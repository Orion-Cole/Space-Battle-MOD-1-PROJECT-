document.getElementById('startGameButton').addEventListener('click', () => { //listens for click of start button
    document.getElementById('startGameButton').style.display = 'none'; //hide start button
    startGame(); //starts game
});

let currentRound = 1; //sets default round
let currentPoints = 0; //sets default points

const endGame = (text, hullFromLastRound) => { //Handles game ends and round ends

    if (text == 'player lose') {
        let userInputLost = window.prompt(`Game Over! You Lose! would you like to play again?`);
        if (userInputLost == 'yes') {
            document.getElementById('shipHull').textContent = 20; //resets user hull in html
            currentRound = 1;
            setTimeout(() => {startGame()}, 2000);
        } else {
            console.log('quit game')
            location.reload();
        }
    } else { //if players won the round
        if (currentRound == 3) { //and if on the final round
            let userInputWon = window.prompt(`Game Over! You Win! would you like to play again?`);
            if (userInputWon == 'yes') {
                document.getElementById('shipHull').textContent = 20; //resets user hull in html
                currentRound = 1;
                setTimeout(() => {startGame()}, 2000);
            } else {
                console.log('quit game')
                location.reload();
            }
        } else { //round won but not yet on final round-continue to next round
            currentRound++
            console.log('advance to next round');
            setTimeout(() => {startGame(hullFromLastRound)}, 1000);
        }
    }
}


//---------------------------------------------GAME START/ROUND START
const startGame = (hullFromLastRound) => {

console.log(currentRound);
document.getElementById('currentRound').textContent = currentRound; //update currentRound dom counter

let playerShip = { //PLAYER SHIP OBJECT
    hull:20,
    firePower:5,
    accuracy:.7,
    missiles:3,
    attack(enemyHull) { //attack enemy method
        if(Math.random() <= this.accuracy) {
            return enemyHull - this.firePower;
        } else {
            return enemyHull;
        }
    }
}
if (hullFromLastRound != undefined) { //if not a new game, import the hull data from last round
    playerShip.hull = hullFromLastRound;
    console.log('player hull set to hullFromLastRound');
}

if (currentRound == 1) { //reset points at game start
    console.log('RESET POINTS');
    currentPoints = 0;
    document.getElementById('currentPoints').textContent = currentPoints;
} else {
    console.log("DON'T RESET POINTS");
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

let alienShipFactory = new AlienShipFactory(); //make alien ship factory

alienShipFactory.alienShipArray = []; //reset array
document.getElementById('alienShipsContainer').innerHTML = "";//resets alienShip divs

let numberOfShips = Math.floor(Math.random()*(6 - 4 + 1))+4; //determine how many ships to make(random amount in a range)
for (let i=1; i<=numberOfShips; i++) { //also give ships number id
    alienShipFactory.createShip(i);
}


const updateAlienHullCounter = (ship) => { //function to update an aliens ship hull display when called
    let id = ship.id
    let currentHull = ship.hull;
    document.getElementById(id).innerHTML = `Hull: ${currentHull}`;
}

//BATTLE

const battle = (alien) => {
console.log('battle function starting');

    while(alien.hull > 0) {
        alien.hull = playerShip.attack(alien.hull); //PLAYER ATTACKS
            updateAlienHullCounter(alien);
            console.log('player attacks!');
        if(alien.hull <= 0) {
            alien.destroyed = true;
            currentPoints += 5; //add points for every kill
            document.getElementById('currentPoints').textContent = currentPoints; //update point counter in dom
            console.log('cuurent points:' + currentPoints);
            console.log(alien.id + ' destroyed');
            if (alienShipFactory.alienShipArray.every((ship) => {if (ship.destroyed == true) {return true}})) {
                setTimeout(() => {endGame('player win', playerShip.hull)},1000);
                console.log('PLAYER WIN CONDITION MET');
            } else {
                setTimeout(() => {chooseTarget()},1000);
                console.log('choose new target');
            }
        } else {
            playerShip.hull = alien.attack(playerShip.hull); //ALIEN ATTACKS
            console.log(`The alien attacks! Hull at: ${playerShip.hull}`);
            document.getElementById('shipHull').textContent = playerShip.hull;
            if(playerShip.hull <= 0) {
                console.log('player hull is now <= 0, player lose condition met');
                setTimeout(() => {endGame('player lose')}, 1000); //delay so ship hull value may update
                break;
            }
        }
    }
}


const chooseTarget = () => { //gets user input on what to target then calls battle loop
    console.log('choose target function starting');
    let targetShipId = window.prompt('Which ship do you want to attack?');
    let targetShip = alienShipFactory.alienShipArray[targetShipId-1];
    if (targetShip.destroyed == false) {
        console.log('targetShip.destroyed == false');
        battle(targetShip);
    } else {
        console.log('targetShip.destroyed == true');
        targetShipId = window.prompt('Ship already destroyed. Which ship do you want to attack?');
        targetShip = alienShipFactory.alienShipArray[targetShipId-1];
        battle(targetShip);
    }
}

setTimeout(()=> {chooseTarget()},3000); //call chooseTarget
}