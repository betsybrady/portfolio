import { getName } from './firebase.js';
import { publishMessage } from './ably.js';

// global
let players = [];
let cards = [];
let currentTeam = 'red';
let guesses = 0;

let redCards = 8;
let blueCards = 8;

let selected = null;

export class Player {
    constructor(name, id, team, isCodemaster, listDOM) {
        this.name = name;
        this.id = id;
        this.team = team;
        this.isCodemaster = isCodemaster;
        this.listDOM = listDOM;
    }
}

class Card {
    constructor(word, color, buttonDOM) {
        this.word = word;
        this.color = color;
        this.buttonDOM = buttonDOM;
    }
}

// adds player to lobby display
function addPlayerDOM(id) {
    let player = players.find(function(x) {
        if (x.id === id) {
            return x;
        }
    });
    let $listElem = $('<li>');
    $listElem.text(player.name);
    player.listDOM = $listElem;
}

// initializes lobby display
function initDOM() {
    let $redTeamList = $('#red-team-list');
    let $blueTeamList = $('#blue-team-list');
    let $redLabel = $('#red-codemaster-label');
    let $blueLabel = $('#blue-codemaster-label');

    for (let i = 0; i < players.length; i++) {
        if (players[i].team === 'red') {
            $redTeamList.append(players[i].listDOM);
            if (players[i].isCodemaster) {
                $redLabel.text(`CODEMASTER: ${player.name}`);
            }
        }
        else {
            $blueTeamList.append(players[i].listDOM);
            if (players[i].isCodemaster) {
                $blueLabel.text(`CODEMASTER: ${player.name}`);
            }
        }
    }
}

// updates player display in lobby
function updateDOM(player) {
    let $redTeamList = $('#red-team-list');
    let $blueTeamList = $('#blue-team-list');

    player.listDOM.detach();
    if (player.team === 'red') {
        $redTeamList.append(player.listDOM);
    }
    else {
        $blueTeamList.append(player.listDOM);
    }
}

// initialize player array
export async function initPlayers(currentUser, rawData) {
    for (let i = 0; i < rawData.length; i++) {
        if (rawData[i] === currentUser.id) {
            currentUser.team = (i % 2 === 0) ? 'red' : 'blue';
            players.push(currentUser);
            addPlayerDOM(currentUser.id);
        }
        else {
            players.push(new Player(await getName(rawData[i]), rawData[i], 
            ((i % 2 === 0) ? 'red' : 'blue'), false, null));
            addPlayerDOM(rawData[i]);
        }
    }
    initDOM();
}

// adds player to array
export async function addPlayer(id) {
    let player = new Player(await getName(id), id, 
    ((players.length % 2 === 0) ? 'red' : 'blue'), false, null);
    players.push(player);
    addPlayerDOM(id);
    updateDOM(player);
}

// changes player team
export function changeTeam(id, newTeam) {
    let player = players.find(function(x) {
        if (x.id === id) {
            return x;
        }
    });
    if (player.team === newTeam) {
        return;
    }
    else {
        player.team = newTeam;
        updateDOM(player);

        // update CM info
        if (player.isCodemaster) {
            player.isCodemaster = false;

            let $redLabel = $('#red-codemaster-label');
            let $blueLabel = $('#blue-codemaster-label');
    
            if (player.team === 'red') {
                $blueLabel.text('CODEMASTER: ');
            }
            else {
                $redLabel.text('CODEMASTER: ');
            }
        }

    }
}

// sets player to codemaster
export function beCodemaster(id) {
    let player = players.find(function(x) {
        if (x.id === id) {
            return x;
        }
    });

    // remove old codemaster
    let oldCM = players.find(function(x) {
        if ((x.team === player.team) && x.isCodemaster) {
            return x;
        }
    });

    if (oldCM) {
        oldCM.isCodemaster = false;
    }

    player.isCodemaster = true;

    // update DOM
    let $redLabel = $('#red-codemaster-label');
    let $blueLabel = $('#blue-codemaster-label');

    if (player.team === 'red') {
        $redLabel.text(`CODEMASTER: ${player.name}`);
    }
    else {
        $blueLabel.text(`CODEMASTER: ${player.name}`);
    }
}

// renames player
export function renamePlayer(id, newName) {
    let player = players.find(function(x) {
        if (x.id === id) {
            return x;
        }
    });

    player.name = newName;

    player.listDOM.text(player.name);

    let $redCodemasterLabel = $('#red-codemaster-label');
    let $blueCodemasterLabel = $('#blue-codemaster-label');

    if (player.isCodemaster) {
        if (player.team === 'red') {
            $redCodemasterLabel.text(`CODEMASTER: ${player.name}`);
        }
        else {
            $blueCodemasterLabel.text(`CODEMASTER: ${player.name}`);
        }
    }
}

// checks start conditions
function checkStart() {
    // override
    if (players.some(function(x) {
        return x.name === 'test';
    })) {
        return true;
    }

    // check red team
    let redNum = 0;
    let blueNum = 0;
    let redCM = false;
    let blueCM = false;
    players.forEach(function(x) {
        if (x.team === 'red') {
            redNum++;
            if (x.isCodemaster) {
                redCM = true;
            }
        }
        else {
            blueNum++;
            if (x.isCodemaster) {
                blueCM = true;
            }
        }
    });
    if (redNum < 2 || blueNum < 2) {
        alert('Each team must have at least 2 players!');
        return false;
    }
    if (!redCM || !blueCM) {
        alert('Each team must have a codemaster!');
        return false;
    }
    return true;
}

// starts game
export async function startGame(realtime, roomID, currentUser) {
    if (checkStart()) {
        publishMessage(realtime, roomID, `${currentUser.id} start`);
    }
    cards = await generateCards();
    publishMessage(realtime, roomID, `${currentUser.id} cards ${currentTeam} ` + JSON.stringify(cards));
}

// generate cards
async function generateCards() {
    // generate colors
    let colors = [];
    for (let i = 1; i <= 9; i++) {
        if (i === 1) {
            colors.push('black');
            if (Math.random() < 0.5) {
                colors.push('red');
                currentTeam = 'red';
            }
            else {
                colors.push('blue');
                currentTeam = 'blue';
            }
        }
        if (i <= 7) {
            colors.push('gray');
        }
        if (i <= 8) {
            colors.push('blue');
            colors.push('red');
        }
    }

    colors = colors
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);


    // generate words
    let wordFile = './js/words.txt';

    let txt = await $.get(wordFile, function(txt){
        return txt;
    }); 

    let words = txt.split('\n');

    words = words
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let card = new Card(words[(i * 5) + j], colors[(i * 5) + j], `#button-r${i+1}c${j+1}`);
            cards.push(card);
        }
    }
    return cards;
}

// displays game room
export function cardsDOM(cardsJSON, team, realtime, roomID, currentUser) {
    currentTeam = team;
    if (currentTeam === 'red') {
        redCards++;
    }
    else {
        blueCards++;
    }

    let $gridDiv = $('#grid');
    cards = cardsJSON;
    for (let i = 0; i < 25; i++) {
        cards[i].buttonDOM = $(cards[i].buttonDOM);
        cards[i].buttonDOM.text(cards[i].word);

        cards[i].buttonDOM.on('click', function(event) {
            event.preventDefault();
            if (currentUser.isCodemaster || (currentUser.team !== currentTeam)) {
                return;
            }
            else {
                publishMessage(realtime, roomID, `${currentUser.id} selected ${i}`);
            }
        });

        if (currentUser.isCodemaster) {
            cards[i].buttonDOM.addClass(`${cards[i].color}-hint`);
            cards[i].buttonDOM.addClass('cm-unrevealed');
        }
        else {
            cards[i].buttonDOM.addClass('unrevealed');
            $gridDiv.addClass('no-guess');
        }
    }

    let $topDiv = $('#top');
    let $turnInfo = $('#turn-info');
    let $clueDOM = $('#clue');

    $turnInfo.text(`${currentTeam.toUpperCase()} TEAM IS GIVING A CLUE`);
    $topDiv.addClass(`${currentTeam}-text`);
    $clueDOM.addClass('hidden');

    let $cluegiverDiv = $('#cluegiver');

    if (currentTeam != currentUser.team) {
        $cluegiverDiv.addClass('hidden');
    }


}

// selects card
export function selectCard(cardIndex) {
    let card = cards[cardIndex];
    if (card.buttonDOM.hasClass('red') || card.buttonDOM.hasClass('blue') || 
    card.buttonDOM.hasClass('gray') || card.buttonDOM.hasClass('black')) {
        return;
    }

    if (selected === card) {
        card.buttonDOM.removeClass('selected');
        selected = null;
    }
    else {
        if (selected) {
            selected.buttonDOM.removeClass('selected');
        }
        selected = card;
        card.buttonDOM.addClass('selected');
    }
}

// give clue
export function giveClue(clue, number, currentUser) {
    let $clueDOM = $('#clue');
    let $turnInfo = $('#turn-info');

    $clueDOM.removeClass('hidden');
    $clueDOM.text(`CLUE: ${clue}, ${(number === '-1') ? '∞' : number}`);

    guesses = parseInt(number);
    if (guesses === 0 || guesses === -1) {
        guesses = Infinity;
    }
    else {
        guesses++;
    }

    $turnInfo.text(`${currentTeam.toUpperCase()} TEAM IS GUESSING WITH ${(guesses === Infinity) ? '∞' : 
    guesses} ${(guesses === 1) ? 'GUESS' : 'GUESSES'} REMAINING`);

    // set for guesses
    let $guesserDiv = $('#guesser');
    let $cluegiverDiv = $('#cluegiver');
    let $gridDiv = $('#grid');


    if (currentUser.team === currentTeam) {
        if (currentUser.isCodemaster) {
            $cluegiverDiv.addClass('hidden');
        }
        else {
            $guesserDiv.removeClass('hidden');
            $gridDiv.removeClass('no-guess');
        }
    }
}

// checks if card is selected
export function checkGuess() {
    if (selected) {
        return true;
    }
    else {
        alert('You must select a card before guessing!');
        return false;
    }
}

// ends game
export function gameOver(winner) {
    let $gridDiv = $('#grid');
    let $guesserDiv = $('#guesser');
    let $cluegiverDiv = $('#cluegiver');
    $gridDiv.addClass('no-guess');
    $cluegiverDiv.addClass('hidden');
    $guesserDiv.addClass('hidden');

    for (let i = 0; i < cards.length; i++) {
        cards[i].buttonDOM.addClass(cards[i].color);
    }

    let $clueDOM = $('#clue');
    let $turnInfo = $('#turn-info');

    $clueDOM.addClass('hidden');
    $turnInfo.text(`GAME OVER! ${winner.toUpperCase()} TEAM WON`);

    let $topDiv = $('#top');
    if (winner !== currentTeam) {
        $topDiv.removeClass(`${currentTeam}-text`); 
    }
    $topDiv.addClass(`${winner}-text`);
}

// switches turn to other team
export function switchTurn(currentUser) {
    guesses = 0;

    let $topDiv = $('#top');
    let $turnInfo = $('#turn-info');
    let $clueDOM = $('#clue');

    $topDiv.removeClass(`${currentTeam}-text`);
    if (currentTeam === 'red') {
        currentTeam = 'blue';
    }
    else {
        currentTeam = 'red';
    }

    $turnInfo.text(`${currentTeam.toUpperCase()} TEAM IS GIVING A CLUE`);
    $topDiv.addClass(`${currentTeam}-text`);
    $clueDOM.addClass('hidden');

    let $cluegiverDiv = $('#cluegiver');
    let $guesserDiv = $('#guesser');

    if (currentTeam != currentUser.team) {
        if (currentUser.isCodemaster) {
            $cluegiverDiv.addClass('hidden');
        }
        else {
            $guesserDiv.addClass('hidden');
        }
    }
    else {
        if (currentUser.isCodemaster) {
            $cluegiverDiv.removeClass('hidden');
        }
    }
}

// guess
export function guessCard(currentUser) {
    let $turnInfo = $('#turn-info');

    selected.buttonDOM.addClass(selected.color);

    if (selected.color === 'black') {
        gameOver((currentTeam === 'red') ? 'blue' : 'red');
    }
    else if (selected.color === currentTeam) {
        if (currentTeam === 'red') {
            redCards--;
            if (redCards === 0) {
                gameOver(currentTeam);
                return;
            }
        }
        else {
            blueCards--;
            if (blueCards === 0) {
                gameOver(currentTeam);
                return;
            }
        }

        if (guesses !== Infinity) {
            guesses--;

            if (guesses === 0) {
                switchTurn(currentUser);
            }
            else {
                $turnInfo.text(`${currentTeam.toUpperCase()} TEAM IS GUESSING WITH ${guesses} ${(guesses === 1) ? 'GUESS' : 'GUESSES'} REMAINING`);
            }
        }
    }
    else {
        switchTurn(currentUser);
    }

    // remove selected
    selected.buttonDOM.removeClass('selected');
    selected = null;
}

