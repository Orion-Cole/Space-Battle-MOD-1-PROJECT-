const endGame = (text) => { //ENDS THE GAME
    console.log('Game Over ' + text);
    let winner;
    text == 'player win'? winner = 'You won!' : winner = 'You Lose!';
    let userInput = window.prompt(`Game Over! ${winner} would you like to play again?`);
    if (userInput == 'yes') {
        console.log('replay game');
        document.getElementById('shipHull').textContent = 20; //resets user hull in html
        setTimeout(() => {startGame()}, 1000);
    } else {
        console.log('quit game')
        location.reload();
    }
}


const startGame = () => {
//prompt 'which ship do you wan to attack?'
// let targetShip = window.prompt('Which ship do you want to attack?');




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
    constructor(number) { //ALIEN SHIP PROPERTIES
        this.id = number;
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
        const alienShip = new AlienShip(number);
        this.alienShipArray.push(alienShip);

        let alienDiv = document.createElement('div'); //mk div
        alienDiv.setAttribute('id', 'x' + number);
        alienDiv.setAttribute('display', 'flex');

        let image = document.createElement('img'); //mk img
        image.src = 'galaga-bee.png';
        image.alt = 'alien ship';
        image.classList.add('alienShipPicture');

        let hullData = document.createElement('div') //mk hullData
        hullData.setAttribute('id', number);
        hullData.innerHTML = `Hull: ${alienShip.hull}`;
        
        let idTag = document.createElement('p');//mk id tag
        idTag.innerHTML = number;
        
        alienDiv.appendChild(image); //mk img child of div
        alienDiv.appendChild(hullData); //mk hullData child of div
        alienDiv.appendChild(idTag);//mk id child of div

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




// const updateAlienHullCounter = (index) => {
//     let id = index + 1;
//     let currentHull = alienShipFactory.alienShipArray[index].hull;
//     document.getElementById(id).innerHTML = `Hull: ${currentHull}`;
//     setTimeout(() => {return},3000);
// }



//BATTLE ZONE

const battle = () => {
console.log(`Players starting hull: ${playerShip.hull}`);

    loop1:
    for(let i = 0;i < alienShipFactory.alienShipArray.length;i++) {
        let alien = alienShipFactory.alienShipArray[i];
        while(alien.destroyed == false) {
            alien.hull = playerShip.attack(alien.hull); //PLAYER ATTACKS
                console.log(`You attack the alien ship! It's hull is at: ${alien.hull}`);
                document.getElementById(i+1).innerHTML = `Hull: ${alien.hull}`; //display alien hull after attack
                //updateAlienHullCounter(i);
            
            if(alien.hull <= 0) {
                alien.destroyed = true;
                //console.log(`Alien ship number ${i+1} was destroyed!`);
                break;
            }
    
            playerShip.hull = alien.attack(playerShip.hull); //ALIEN ATTACKS
            //console.log(`The alien attacks! Hull at: ${playerShip.hull}`);
            document.getElementById('shipHull').textContent = playerShip.hull;
                if(playerShip.hull <= 0) {
                    setTimeout(() => {endGame('player lose')}, 1000); //delay so ship hull value may update
                    break loop1;
                }
        }
    }
    
    
    if(playerShip.hull > 0) {
        setTimeout(() => {endGame('player win')}, 1000); //-----------------
    }
}




setTimeout(()=> {battle()},3000);



}

//-----------------------------------


document.getElementById('startGameButton').addEventListener('click', () => {
    document.getElementById('startGameButton').style.display = 'none'; //hide start button
    setTimeout(() => {startGame();}, 1000); //delay of 1 second so button has time to vanish
});