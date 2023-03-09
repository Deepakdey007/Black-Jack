let blackjackGame = {
    'you' : {'scoreSpan' : '#your-blackjack-result', 'div' : '#your-box', 'score' : 0},
    'dealer' : {'scoreSpan' : '#dealer-blackjack-result', 'div' : '#dealer-box', 'score' : 0},
    'cards' : ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
    'cardMap' : {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10, 'K':10, 'J':10, 'Q':10, 'A':[1,11]},
    'wins' : 0,
    'losses' : 0,
    'draws' : 0,
    'isStand' : false,
    'turnsOver' : false,
}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click',blackjackHit); // (event , function)
document.querySelector('#blackjack-stand-button').addEventListener('click',dealerLogin); 
document.querySelector('#blackjack-deal-button').addEventListener('click',blackjackDeal); 

function blackjackHit() {
    if(blackjackGame['isStand'] === false) {
        let card = randomCard();
        console.log(card);
        showCard(card, YOU);
        updateScore(card,YOU);
        // console.log(YOU['score'])
        showScore(YOU);
    }
}

function showCard(card, activePlayer) {
    if(activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal() {

    if(blackjackGame['turnsOver'] === true) {

        blackjackGame['isStand'] = false;

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        // console.log(yourImages); and array or images
    
        // to delete all images at a time we use for loop
    
        for(i=0;i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        
        for(i=0;i<dealerImages.length; i++) {
            dealerImages[i].remove();
        }
        YOU['score'] = 0;
        DEALER['score'] = 0;
    
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
    
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';
    
        document.querySelector('#blackjack-result').textContent = "Let's Play";  // again set the text to its original
        document.querySelector('#blackjack-result').style.color = 'black'; 

        blackjackGame['turnsOver'] = true;  // helps to restart when game complete
    }

}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function updateScore(card, activePlayer) {
    // If adding 11 keeps me below 21, add 11. Otherwise add 1.
    if(card === 'A') {
        if(activePlayer['score'] + blackjackGame['cardMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardMap'][card][1];
        } 
        else {
            activePlayer['score'] += blackjackGame['cardMap'][card][0];
        }
    }
    else{
        activePlayer['score'] += blackjackGame['cardMap'][card];
    }
}

function showScore(activePlayer) {
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent = "BUST!";
        document.querySelector(activePlayer['scoreSpan']).style.color = "red";
    }
    else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function dealerLogin() {
    blackjackGame['isStand'] = true;  // change the stand mode 

    // adding bot logic by while loop
    // start
    while(DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(card,DEALER);
        updateScore(card,DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    // end

    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
    
}

// computer winner and return who just win

//update the wins, draws, losses

function computeWinner() {
    let winner;

    if(YOU['score'] <= 21) {
        //condition: higher score than dealer or when dealer busts but you're 21 or under
        if(YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            blackjackGame['wins']++;
            winner = YOU;
        }
        else if(YOU['score'] < DEALER['score']){
            console.log('You lost!')
            blackjackGame['looses']++;
            winner = DEALER;
        }
        else if(YOU['score'] === DEALER['score']) {
            console.log("You drew!");
            blackjackGame['draws']++;
        }
    }
    // condition : when user busts but dealer dosen't
    else if(YOU['score'] > 21 && DEALER['score'] <= 21) {
        console.log('You lost!');
        blackjackGame['losses']++;
        winner = DEALER;
    }
    
    // condition : when you and the dealer busts 
    else if(YOU['score'] > 21 && DEALER['score'] > 21) {
        console.log("You drew!");
        blackjackGame['draws']++;
    }

    console.log('winner is :', winner);

    return winner;
}

function showResult(winner) {
    let message, messageColor;

    // it check all the turns are over before running and showing the result
    // we should'nt see the result untill all the turns are over 

    if(blackjackGame['turnsOver'] === true){
        if(winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins']; // for update in table content
    
            message = 'You Won!';
            messageColor = 'green';
            winSound.play();
        }
        else if(winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses']; // for update in table content
    
            message = "You lost!";
            messageColor = 'red';
            lossSound.play();
        }
        else {
            document.querySelector('#draws').textContent = blackjackGame['draws']; // for update in table content
    
            message = 'You drew!';
            messageColor = 'black';
        }
    
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor; 
    }
}  