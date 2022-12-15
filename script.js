const endGame = (text) => { //ENDS THE GAME
    console.log('Game Over ' + text);
    let winner;
    text == 'player win'? winner = 'You won!' : winner = 'You Lose!';
    let userInput = window.prompt(`Game Over! ${winner} would you like to play again?`);
    if (userInput == 'yes') {
        console.log('replay game');
    } else {
        console.log('quit game')
    }
}

const playerShip = { //PLAYER SHIP OBJECT
    hull:20,
    firePower:5,
    accuracy:.7,
    attack(enemyHull) {
        if(Math.random() <= this.accuracy) {
            return enemyHull - this.firePower;
        } else {
            return enemyHull;
        }
    }
}

class AlienShip { 
    constructor() { //ALIEN SHIP PROPERTIES
        this.hull = Math.floor(Math.random()*(6 - 3 + 1))+3; //RANDOM HULL
        this.firePower = Math.floor(Math.random()*(4 - 2 + 1))+2; //RANDOM FIREPOWER
        this.accuracy = Number.parseFloat(Math.random()*(.8 - .6 )+.6).toFixed(1); //RANDOM ACCURACY
        this.destroyed = false;
    }
    attack(playerHull) {
        if(Math.random() <= this.accuracy) {
            return playerHull - this.firePower;
        } else {
            return playerHull;
        }
    }
}

class AlienShipFactory {
    constructor(){
        this.alienShipArray = [];
    }
    createShip(number) {
        const alienShip = new AlienShip();
        this.alienShipArray.push(alienShip);

        let alienDiv = document.createElement('div');
        alienDiv.setAttribute('class', 'alienShip')
        let divContent = `<img class="alienShipPicture" src="galaga-bee.png" alt="alien ship"></img> <br> <h3>Hull : <span class="alienShipHull">${alienShip.hull}</span></h3>`;
        alienDiv.innerHTML = divContent;
        document.getElementById('alienShips').appendChild(alienDiv);

        
        // let hull = 0;
        // document.querySelectorAll(".alienShipHull").textContent = hull; //------------
    }
}

const alienShipFactory = new AlienShipFactory(); //make alien ship factory

const numberOfShips = 6;
for (let i=0; i<numberOfShips; i++) {
    alienShipFactory.createShip(i);
}

// alienShipFactory.createShip(); //make alien ship 1
// alienShipFactory.createShip(); //make alien ship 2
// alienShipFactory.createShip(); //make alien ship 3
// alienShipFactory.createShip(); //make alien ship 4
// alienShipFactory.createShip(); //make alien ship 5
// alienShipFactory.createShip(); //make alien ship 6

// alienShipFactory.alienShipArray.forEach((alien) => {
//     alien.findI
// })


//BATTLE ZONE


console.log(`Players starting hull: ${playerShip.hull}`);



const startGame = () => {
    let retreat = false;
    loop1:
    for(let i = 0;i < alienShipFactory.alienShipArray.length;i++) {
        let alien = alienShipFactory.alienShipArray[i];
        while(alien.destroyed == false) {
                
            alien.hull = playerShip.attack(alien.hull); //PLAYER ATTACKS
            console.log(`You attack the alien ship! It's hull is at: ${alien.hull}`);
                if(alien.hull <= 0) {
                    alien.destroyed = true;
                    console.log(`Alien ship number ${i} was destroyed!`);
                    // let userInput = window.prompt(`You destroyed an alien ship! Your hull is at ${playerShip.hull}, would you like to retreat?`);
                    // if(userInput == 'yes') {
                    //     endGame('player retreat');
                    //     retreat = true;
                    //     break loop1;
                    // }
                    break;
                }
    
            playerShip.hull = alien.attack(playerShip.hull); //ALIEN ATTACKS
            console.log(`The alien attacks! Hull at: ${playerShip.hull}`);
            document.getElementById('shipHull').textContent = playerShip.hull;
                if(playerShip.hull <= 0) {
                    setTimeout(() => {endGame('player lose')}, 5000);
                    break loop1;
                }
        }
    }
    
    
    if(playerShip.hull > 0 && retreat == false) {
        setTimeout(() => {endGame('player win')}, 5000); //-----------------
    }
}

document.getElementById('startGameButton').addEventListener('click', () => {
    document.getElementById('startGameButton').style.display = 'none'; //hide start button
    setTimeout(() => {startGame();}, 1000); //delay of 1 second so button has time to vanish
});




