document.getElementById('startGameButton').addEventListener('click', () => { //listens for click of start button
    document.getElementById('startGameButton').style.display = 'none'; //hide start button
    var theme = document.getElementById('theme');
    theme.play();
    setTimeout(() => {startGame()}, 4000); //starts game
});

let currentRound = 1; //sets default round
let currentPoints = 0; //sets default points

const endGame = (text, hullFromLastRound, missilesFromLastRound, shieldFromLastRound) => { //Handles game ends and round ends
    if (text == 'player lose') {
        let userInputLost = window.prompt(`Game Over! You Lose! would you like to play again?`);
        if (userInputLost == 'yes') {
            document.getElementById('shipHull').textContent = 20; //resets user hull in dom
            document.getElementById('shipHull').style.color = 'green';
            document.getElementById('shields').textContent = 5; //resets user shields in dom
            document.getElementById('missiles').textContent = 3; //resets user shields in dom
            currentPoints = 0;
            document.getElementById('currentPoints').textContent = currentPoints;
            currentRound = 1;
            document.getElementById('currentRound').textContent = currentRound;
            setTimeout(() => {startGame()}, 2000);
        } else {
            console.log('quit game')
            location.reload();
        }
    } else { //if players won the round
        if (currentRound == 4) { //and if on the final round
            let userInputWon = window.prompt(`Game Over! You Win! would you like to play again?`);
            if (userInputWon == 'yes') {
                document.getElementById('shipHull').textContent = 20; //resets user hull in html
                document.getElementById('shipHull').style.color = 'green';
                document.getElementById('shields').textContent = 5; //resets user shields in dom
                document.getElementById('missiles').textContent = 3; //resets user shields in dom
                currentPoints = 0;
                document.getElementById('currentPoints').textContent = currentPoints;
                currentRound = 1;
                document.getElementById('currentRound').textContent = currentRound;
                setTimeout(() => {startGame()}, 2000);
            } else {
                console.log('quit game')
                location.reload();
            }
        } else { //round won but not yet on final round-continue to next round
            let newRoundSound = document.getElementById('newRound');
            newRoundSound.play();
            currentRound++
            console.log('advance to next round');
            document.getElementById('form2').reset(); //reset form data
            document.getElementById('pop-up-container2').style.display = 'block'; //show popup 
            document.getElementById('submitButton2').addEventListener('click', () => { //when button clicked
                document.getElementById('pop-up-container2').style.display = 'none'; //hide popup
                if (document.getElementById('recharge').checked == true) {
                    let rechargeSound = document.getElementById('rechargeSound');
                        rechargeSound.play();
                        console.log('current points' + currentPoints);
                    if (currentPoints >= 5) {
                        //recharge shields
                        console.log('shields recharged!');
                        shieldFromLastRound = 5;
                        currentPoints -= 10;
                    }
                }
                console.log('THIS SHOULD BE 5 :' + shieldFromLastRound);
                setTimeout(() => {startGame(hullFromLastRound, missilesFromLastRound, shieldFromLastRound)}, 1000);
            },{once : true});
        }
    }
}

//---------------------------------------------GAME START/ROUND START
const startGame = (hullFromLastRound, missilesFromLastRound, shieldFromLastRound) => {

document.getElementById('currentPoints').textContent = currentPoints; //updates points in dom if any spent between rounds
document.getElementById('currentRound').textContent = currentRound;

let playerShip = { //PLAYER SHIP OBJECT
    hull:20,
    firePower:5,
    accuracy:.7,
    missiles:5,
    shields:5,
    attack(enemyHull, useMissiles) { //attack enemy method
        console.log('useMissiles: ' + useMissiles);
        if(Math.random() <= this.accuracy) {
            if (useMissiles == true && this.missiles > 0) {
                this.missiles -= 1;
                document.getElementById('missiles').textContent = this.missiles;
                console.log('missile used');
                return enemyHull - (this.firePower + 5);
            } else {
                return enemyHull - this.firePower;
            }
        } else {
            return enemyHull;
        }
    }
}

if (hullFromLastRound != undefined) { //if not a new game, import the hull data from last round
    playerShip.hull = hullFromLastRound;
    console.log('player hull set to hullFromLastRound');
}

if (missilesFromLastRound != undefined) { //if not a new game, import the missile data from last round
    playerShip.missiles = missilesFromLastRound;
    console.log('player misiles set to missilesFromLastRound');
}

if (shieldFromLastRound != undefined) {//if not a new game, import the shield data from last round
    playerShip.shields = shieldFromLastRound;
    document.getElementById('shields').textContent = shieldFromLastRound;
    console.log('player shields set to shieldsFromLastRound');
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
            if (playerShip.shields > 0) {
                let randomDeduction = Math.floor(Math.random()*(6 - 2 + 1))+2;
                console.log('shield deflects' + randomDeduction);
                playerShip.shields--;
                document.getElementById('shields').textContent = playerShip.shields;
                if (randomDeduction > this.firePower) {
                    randomDeduction = this.firePower;
                }
                return playerHull - (this.firePower - randomDeduction);
            } else {
                return playerHull - this.firePower;
            }
        } else {
            console.log('alien misses attack');
            return playerHull;
        }
    }
}

class MotherShip {
    constructor() { //ALIEN MOTHER SHIP PROPERTIES
        this.id = 'Mother Ship';
        this.hull = 20;
        this.guns = 4;
        this.gun1Hull = 6;
        this.gun2Hull = 6;
        this.gun3Hull = 6;
        this.gun4Hull = 6;
        this.accuracy = .6;
        this.destroyed = false;
    }
    attack(playerHull) { //attack player method
        if(Math.random() <= this.accuracy) {
            if (playerShip.shields > 0) {
                let randomDeduction = Math.floor(Math.random()*(6 - 2 + 1))+2;
                console.log('shield deflects' + randomDeduction);
                playerShip.shields--;
                document.getElementById('shields').textContent = playerShip.shields;
                if (randomDeduction > (this.guns*4)+4) {
                    randomDeduction = (this.guns*4)+4;
                }
                return playerHull - (((this.guns*4)+4) - randomDeduction);
            } else {
                return playerHull - ((this.guns*4)+4);
            }
        } else {
            console.log('alien mother ship misses attack');
            return playerHull;
        }
    }
}

class AlienShipFactory {
    constructor(){
        this.alienShipArray = []; //contains all generated alien ships in the round
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
        accuracyData.textContent = 'Accuracy: 60%';

        alienDiv.appendChild(idTag);//mk id child of div
        alienDiv.appendChild(image); //mk img child of div
        alienDiv.appendChild(hullData); //mk hullData child of div
        alienDiv.appendChild(firePowerData); //mk firePowerData child of div
        alienDiv.appendChild(accuracyData); //mk accuracyData child of div

        document.getElementById('alienShipsContainer').appendChild(alienDiv);  //mk div child of container
    }
    createMotherShip() {
        const alienShip = new MotherShip(); //calls class to make new randomized ship
        this.alienShipArray.push(alienShip); //pushes new ship to array

        let alienDiv = document.createElement('div'); //mk div
        alienDiv.setAttribute('id', 'alienMotherShip');
        alienDiv.setAttribute('class','alienDiv');
        alienDiv.setAttribute('display', 'flex');

        let image = document.createElement('img'); //mk img
        image.src = 'spider_boss_ship.png';
        image.alt = 'alien mother ship';
        image.classList.add('alienMotherShipPicture');

        let hullData = document.createElement('div') //mk hullData
        hullData.setAttribute('id', 'alienMotherShipHull');
        hullData.innerHTML = `Hull: ${alienShip.hull}`;
        
        let idTag = document.createElement('div'); //mk id tag
        idTag.innerHTML = 'Alien Mother Ship';
        
        let firePowerData = document.createElement('div'); //mk firePowerData
        firePowerData.textContent = 'Firepower: 20';
        firePowerData.setAttribute('id', 'alienMotherShipFirePower');

        let accuracyData = document.createElement('div'); //mk accuracyData
        accuracyData.textContent = 'Accuracy: ' + alienShip.accuracy;

        let guns = document.createElement('div'); //mk gun group div
        guns.setAttribute('id', 'bossGuns');
            let gun1 = document.createElement('div'); //mk gun1 div
                gun1.setAttribute('id', 'gun1');
                let gun1Hull = 6;
                gun1.innerHTML = 'Gun 1<br/>hull:' + gun1Hull;
                guns.appendChild(gun1);
            let gun2 = document.createElement('div'); //mk gun2 div
                gun2.setAttribute('id', 'gun2');
                let gun2Hull = 6;
                gun2.innerHTML = 'Gun 2<br/>hull:' + gun2Hull;
                guns.appendChild(gun2);
            let gun3 = document.createElement('div'); //mk gun3 div
                gun3.setAttribute('id', 'gun3');
                let gun3Hull = 6;
                gun3.innerHTML = 'Gun 3<br/>hull:' + gun3Hull;
                guns.appendChild(gun3);
            let gun4 = document.createElement('div'); //mk gun4 div
                gun4.setAttribute('id', 'gun4');
                let gun4Hull = 6;
                gun4.innerHTML = 'Gun 4<br/>hull:' + gun4Hull;
                guns.appendChild(gun4);

        alienDiv.appendChild(idTag);//mk id child of div
        alienDiv.appendChild(image); //mk img child of div
        alienDiv.appendChild(hullData); //mk hullData child of div
        alienDiv.appendChild(firePowerData); //mk firePowerData child of div
        alienDiv.appendChild(accuracyData); //mk accuracyData child of div
        alienDiv.appendChild(guns);
            document.getElementById('alienShipsContainer').appendChild(alienDiv);  //mk div child of container
    }
}

let alienShipFactory = new AlienShipFactory(); //make alien ship factory

alienShipFactory.alienShipArray = []; //reset array
document.getElementById('alienShipsContainer').innerHTML = "";//resets alienShip divs

let numberOfShips = Math.floor(Math.random()*(6 - 4 + 1))+4; //determine how many ships to make(random amount in a range)
if (currentRound == 4) {
    alienShipFactory.createMotherShip();
} else {
    for (let i=1; i<=numberOfShips; i++) { //also give ships number id
        alienShipFactory.createShip(i);
    }
}

const updateAlienHullCounter = (ship) => { //function to update an aliens ship hull display when called
    let id = ship.id
    if (id == 'Mother Ship') {
        id = 'alienMotherShipHull';
    }
    let currentHull = ship.hull;
    document.getElementById(id).innerHTML = `Hull: ${currentHull}`;
}

//BATTLE function

const battle = (alien, useMissiles, targetGun) => {
    console.log('battle function starting' + 'useMissiles: ' + useMissiles);

    while(alien.hull > 0) {
        if (currentRound == 4 && alien.guns > 0) {
            let gunHull = 6; //default
            switch(targetGun){ //PLAYER ATTACKS GUN
                case 'gun1':
                    gunHull = alien.gun1Hull
                    gunHull = playerShip.attack(gunHull, useMissiles);
                    alien.gun1Hull = gunHull;
                    break;
                case 'gun2':
                    gunHull = alien.gun2Hull
                    gunHull = playerShip.attack(gunHull, useMissiles);
                    alien.gun2Hull = gunHull;
                    break;
                case 'gun3':
                    gunHull = alien.gun3Hull
                    gunHull = playerShip.attack(gunHull, useMissiles);
                    alien.gun3Hull = gunHull;
                    break;
                case 'gun4':
                    gunHull = alien.gun4Hull
                    gunHull = playerShip.attack(gunHull, useMissiles);
                    alien.gun4Hull = gunHull;
                    break;
            }
        
            document.getElementById(targetGun).innerHTML = 'Gun 1<br/>hull:' + gunHull; //update hull of targetgun
            
            console.log('%c player attacks gun!', 'color: green');
            console.log('gun hull at ' + gunHull);
            if (gunHull <= 0) {
                console.log('gun hull at 0 or less');
                alien.guns--;
                console.log('remaining guns: ' + alien.guns);
                document.getElementById('alienMotherShipFirePower').textContent = 'Firepower: ' + (alien.guns*4+4); //update fire power
                let blasterSound = document.getElementById('blaster');
                blasterSound.play();
                currentPoints += 5; //add points for every destroyed gun
                document.getElementById('currentPoints').textContent = currentPoints; //update point counter in dom
                console.log('current points:' + currentPoints);
                if (alien.guns <= 0 && alien.hull <= 0) { //-----------------
                    setTimeout(() => {endGame('player win', playerShip.hull, playerShip.missiles, playerShip.shields)},1000);
                    console.log('PLAYER WIN CONDITION MET');
                } else {
                    console.log('choose new target');
                    setTimeout(() => {chooseTarget(alien.guns)},1000);
                    break;
                }
            }
            setTimeout(() => {playerShip.hull = alien.attack(playerShip.hull)},1000); //MOTHERSHIP ATTACKS
            console.log(`%c The alien attacks! Hull at: ${playerShip.hull}`, 'color: red');
            document.getElementById('shipHull').textContent = playerShip.hull;
            if (playerShip.hull < 20 && playerShip.hull > 10) {
                document.getElementById('shipHull').style.color = 'rgb(255, 133, 32)';
            } else if (playerShip.hull < 20) {
                document.getElementById('shipHull').style.color = 'red';
            }
            if(playerShip.hull <= 0) {
                console.log('player hull is now <= 0, player lose condition met');
                let playerDeathSound = document.getElementById('playerDeathSound');
                    playerDeathSound.play();
                setTimeout(() => {endGame('player lose')}, 1000); //delay so ship hull value may update
                break;
            }
        } else {
            alien.hull = playerShip.attack(alien.hull, useMissiles); //PLAYER ATTACKS
            useMissiles = false; //disable rocket usage
            updateAlienHullCounter(alien);
            console.log('%c player attacks!', 'color: green');
            if(alien.hull <= 0) {
                let blasterSound = document.getElementById('blaster');
                    blasterSound.play();
                alien.destroyed = true;
                currentPoints += 5; //add points for every kill
                document.getElementById('currentPoints').textContent = currentPoints; //update point counter in dom
                console.log(alien.id + ' destroyed');
                console.log('current points:' + currentPoints);
                if (alienShipFactory.alienShipArray.every((ship) => {if (ship.destroyed == true) {return true}})) {
                    setTimeout(() => {endGame('player win', playerShip.hull, playerShip.missiles, playerShip.shields)},1000);
                    console.log('PLAYER WIN CONDITION MET');
                } else {
                    console.log('choose new target');
                    setTimeout(() => {chooseTarget()},1000);
                }
            } else {
                playerShip.hull = alien.attack(playerShip.hull); //ALIEN ATTACKS
                console.log(`%c The alien attacks! Hull at: ${playerShip.hull}`, 'color: red');
                document.getElementById('shipHull').textContent = playerShip.hull;
                if (playerShip.hull < 20 && playerShip.hull > 10) {
                    document.getElementById('shipHull').style.color = 'rgb(255, 133, 32)';
                } else if (playerShip.hull < 20) {
                    document.getElementById('shipHull').style.color = 'red';
                }
                if(playerShip.hull <= 0) {
                    console.log('player hull is now <= 0, player lose condition met');
                    let playerDeathSound = document.getElementById('playerDeathSound');
                        playerDeathSound.play();
                    setTimeout(() => {endGame('player lose')}, 1000); //delay so ship hull value may update
                    break;
                }
            }
        }
    }
    console.log('exits while loop');
}

const chooseTarget = (gunsLeft) => { //gets user input on what to target then calls battle loop
    console.log('%c choose target function starting', 'font-size: 15px');
    if (currentRound == 4 && gunsLeft > 0 || currentRound == 4 && gunsLeft == undefined) { //If boss round, run custom choose target function for mother ships guns
        document.getElementById('formBoss').reset(); //reset form data
        document.getElementById('pop-up-container-boss').style.display = 'block'; //show popup
        document.getElementById('submitButtonBoss').addEventListener('click', () => { //when button clicked
        
            document.getElementById('pop-up-container-boss').style.display = 'none'; //hide popup
            let targetGunId = undefined;
            let useMissiles = false;
            let motherShip = alienShipFactory.alienShipArray[0];
            
            targetGunId = document.getElementById('selectGun').value; //set user input as var
            if (targetGunId == undefined) {
                window.alert('invalid target')
                chooseTarget();
            }
            if (document.getElementById('useMissilesBoss').checked == true) {
                useMissiles = true;
                console.log('%c use missiles', 'font-style: italic');
            }
            console.log('current target gun ' + targetGunId);

            let targetGun = `gun${targetGunId}`

            if (motherShip.destroyed == false) {
                console.log('motherShip.destroyed == false');
                battle(motherShip, useMissiles, targetGun);
            }
        }, {once : true});

    } else {
        document.getElementById('form1').reset(); //reset form data
        document.getElementById('pop-up-container1').style.display = 'block'; //show popup
        document.getElementById('submitButton1').addEventListener('click', () => { //when button clicked
        
            document.getElementById('pop-up-container1').style.display = 'none'; //hide popup
            let targetShipId = undefined;
            let targetShip = undefined;
            let useMissiles = false;
            
            targetShipId = document.getElementById('selectShip').value; //set user input as var
            targetShip = alienShipFactory.alienShipArray[targetShipId-1];
            if (targetShip == undefined) {
                window.alert('invalid target')
                chooseTarget();
            }
            if (document.getElementById('useMissiles').checked == true) {
                useMissiles = true;
                console.log('%c use missiles', 'font-style: italic');
            }
            console.log('current target ship id ' + targetShipId);
            if (targetShip.destroyed == false) {
                console.log('targetShip.destroyed == false');
                battle(targetShip, useMissiles);
            } else {
                console.log('targetShip.destroyed == true');
                window.alert('Target already destroyed');
                chooseTarget();
            }
        }, {once : true});
    }
}

setTimeout(()=> {chooseTarget()},1000); //call chooseTarget
}