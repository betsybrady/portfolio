import { addPlayer, beCodemaster, cardsDOM, changeTeam, giveClue, guessCard, 
    initPlayers, renamePlayer, selectCard, switchTurn } from './game.js';
import { ablyKey } from './keys.js';
import { gameRoomDOM } from './main.js';

// connects to multiuser with user id
export function createRealtime(id) {
    let realtime = new Ably.Realtime({key: ablyKey, clientId: id});
    return realtime;
}

// enters channel for room
export async function enterChannel(realtime, id, currentUser) {
    let channel = realtime.channels.get(id);
    channel.attach(async function(err) {
        if(err) { 
            return console.error('Error attaching to the channel'); 
        }
        channel.presence.enter('enter', function(err) {
            if(err) { 
                return console.error('Error entering presence'); 
            }
            subscribeChannel(realtime, id, currentUser);
            publishMessage(realtime, id, `${currentUser.id} joined`);
        });
    });
}

// exits channel for room
export function exitChannel(realtime, id) {
    let channel = realtime.channels.get(id);
    channel.presence.leave();
}

export function subscribeChannel(realtime, id, currentUser) {
    let channel = realtime.channels.get(id);
    channel.subscribe(function(msg) {
        let message = JSON.stringify(msg.data);
        message = message.substring(1, message.length - 1);

        let commands = message.split(' ');
        let commandID = commands[0];

        // join room
        if (commands[1] === 'joined') {
            if (commandID === currentUser.id) {
                //let memberIDs = [];

                channel.presence.get(function(err, members) {
                    if(err) { 
                        return console.error('Error fetching presence data'); 
                    }
                    let memberIDs = members.map(function(member) {
                        return member.clientId;
                    });
                    initPlayers(currentUser,  memberIDs);
                });
            }
            else {
                addPlayer(commandID);
            }
        }

        // switch team
        if (commands[1] === 'red') {
            changeTeam(commandID, 'red');
        }

        if (commands[1] === 'blue') {
            changeTeam(commandID, 'blue');
        }

        // be CM
        if (commands[1] === 'codemaster') {
            beCodemaster(commandID);
        }

        // rename
        if (commands[1] === 'rename') {
            let name = '';
            for (let i = 2; i <= commands.length; i++) {
                name += commands[i];
            }
            renamePlayer(commandID, commands[2]);
        }

        // start game
        if (commands[1] === 'start') {
            gameRoomDOM();
        }

        // cards DOM
        if (commands[1] === 'cards') {
            let cardsJSON = '';
            for (let i = 3; i < commands.length; i++) {
                cardsJSON += (' ' + commands[i]);
            }
            cardsJSON = cardsJSON.replace(/\\/g, '');
            let cards = JSON.parse(cardsJSON);
            cardsDOM(cards, commands[2], realtime, id, currentUser);
        }

        // select card
        if (commands[1] === 'selected') {
            selectCard(commands[2]);
        }

        // give clue
        if (commands[1] === 'clue') {
            let clue = '';
            for (let i = 3; i < commands.length; i++) {
                clue += (' ' + commands[i]);
            }
            giveClue(clue, commands[2], currentUser);
        }

        // guess card
        if (commands[1] === 'guess') {
            guessCard(currentUser);
        }

        // pass turn
        if (commands[1] === 'pass') {
            switchTurn(currentUser);
        }

    });    
}


export function publishMessage(realtime, id, message) {
    let channel = realtime.channels.get(id);
    channel.publish('test', message);
}

export async function attachAndInit(realtime, id, currentUser) {
    let channel = realtime.channels.get(id);
    channel.attach(async function(err) {
        if(err) { 
            return console.error('Error attaching to the channel'); 
        }
        channel.presence.enter('enter', function(err) {
            if(err) { 
                return console.error('Error entering presence'); 
            }
        });
    });
    channel.presence.get(async function(err, members) {
        if(err) { 
            return console.error('Error fetching presence data'); 
        }
        let memberArr = initPlayers(currentUser, members);
        return memberArr;
    });
}
