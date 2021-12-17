import { createRealtime, enterChannel, publishMessage } from './ably.js';
import { cleanupRooms, cleanupUsers, createRoom, createUser, 
    getRooms, getUsers, joinRoom, renameUser} from './firebase.js';
import { checkGuess, Player, startGame } from './game.js';

// holds ID for current user
let currentUser = new Player(null, null, null, false, null);

// global database data
let users;
let rooms;
let realtime;
let roomID;

// DOM ------------------------------------------------------------------------

// manages user lobby DOM
function userLobbyDOM() {
    let $userLobbyDiv = $('#user-lobby');
    let $createUserInput = $('#create-user-text');
    let $createUserButton = $('#create-user');

    let $renameLabel = $('#rename-name-label');

    // create user button
    $createUserButton.on('click', async function(event) {
        event.preventDefault();
        if ($createUserInput.val() === '') {
            alert('You must enter a name to create a user!');
        }
        else {
            $renameLabel.text($createUserInput.val());
            roomLobbyDOM($userLobbyDiv, $renameLabel);
            currentUser.id = await createUser($createUserInput.val());
            currentUser.name = $createUserInput.val();
            realtime = createRealtime(currentUser.id);
            $createUserInput.val('');
            users = await getUsers();
        }
    });
}

// manages room lobby DOM
function roomLobbyDOM(userLobby, label) {
    let $roomLobbyDiv = $('#room-lobby');
    let $createRoomButton = $('#create-room');
    let $joinRoomInput = $('#join-room-text');
    let $joinRoomButton = $('#join-room');

    // switch view to room lobby
    userLobby.addClass('hidden');
    $roomLobbyDiv.removeClass('hidden');

    renamePopupDOM(label);

    // create room button
    $createRoomButton.on('click', async function(event) {
        event.preventDefault();
        if (currentUser.id === null) {
            alert('Must create a user before creating a room!');
        }
        else {
            roomID = await createRoom(currentUser.id);
            roomDOM($roomLobbyDiv);
            // update db
            rooms = await getRooms();
        }
    });

    // join room button
    $joinRoomButton.on('click', async function(event) {
        event.preventDefault();
        if (currentUser.id === null) {
            alert('Must create a user before joining a room!');
        }
        else {
            rooms = await getRooms();
            if (rooms.some(function(room) {
                return room.id === $joinRoomInput.val();
            })) {
                roomID = $joinRoomInput.val();
                joinRoom(currentUser.id, $joinRoomInput.val());
                roomDOM($roomLobbyDiv);
                $joinRoomInput.val('');
                users = await getUsers();

            }
            else if ($joinRoomInput.val() === '') {
                alert('You must enter a room value!');
            }
            else {            
                alert(`Room ${$joinRoomInput.val()} doesn't exist!`);
                $joinRoomInput.val('');
            }
        }
    });
}

// manage rename popup DOM
function renamePopupDOM(label) {
    let $footer = $('#footer');
    let $popupButton = $('#popup-button');

    let $renameDiv = $('#rename-popup');
    let $renameUserInput = $('#rename-user-text');
    let $renameUserButton = $('#rename-user');

    $footer.removeClass('hidden');

    // popup button
    $popupButton.on('click', function(event) {
        event.preventDefault();
        $renameDiv.toggleClass('hidden');
    });

    // rename user button
    $renameUserButton.on('click', async function(event) {
        event.preventDefault();
        if (currentUser.id === null) {
            alert('Must have a user to rename!');
        }
        else {
            if ($renameUserInput.val() === '') {
                alert('You must enter a name to rename a user!');
            }
            else {
                label.text($renameUserInput.val());
                renameUser($renameUserInput.val(), currentUser.id);
                currentUser.name = $renameUserInput.val();
                $renameUserInput.val('');

                // manage multiuser 
                publishMessage(realtime, roomID, `${currentUser.id} rename ${currentUser.name}`);
                
                /*
                currentUser.listDOM.text(currentUser.name);

                let $redCodemasterLabel = $('#red-codemaster-label');
                let $blueCodemasterLabel = $('#blue-codemaster-label');

                if (currentUser.isCodemaster) {
                    if (currentUser.team === 'red') {
                        $redCodemasterLabel.text(`Codemaster: ${currentUser.name}`);
                    }
                    else {
                        $blueCodemasterLabel.text(`Codemaster: ${currentUser.name}`);
                    }
                } */

                users = await getUsers();
            }
        }
    });
}

// manage room DOM
async function roomDOM(roomLobby) {
    enterChannel(realtime, roomID, currentUser);

    let $header = $('#header');
    let $chosenRoomDiv = $('#chosen-room-lobby');

    roomLobby.addClass('hidden');
    $chosenRoomDiv.removeClass('hidden');

    $header.text(`ROOM ${roomID}`);

    // buttons
    let $redTeamButton = $('#red-team-button');
    let $blueTeamButton = $('#blue-team-button');

    let $codemasterButton = $('#codemaster-button');
    let $startButton = $('#start-button');

    $redTeamButton.on('click', function(event) {
        event.preventDefault();
        //changeTeam(currentUser.id, 'red');
        publishMessage(realtime, roomID, `${currentUser.id} red`);
    });

    $blueTeamButton.on('click', function(event) {
        event.preventDefault();
        //changeTeam(currentUser.id, 'blue');
        publishMessage(realtime, roomID, `${currentUser.id} blue`);
    });

    $codemasterButton.on('click', function(event) {
        event.preventDefault();
        publishMessage(realtime, roomID, `${currentUser.id} codemaster`);
    });

    $startButton.on('click', function(event) {
        event.preventDefault();
        startGame(realtime, roomID, currentUser);
    });

}

// manage game room DOM
export function gameRoomDOM() {
    let $chosenRoomDiv = $('#chosen-room-lobby');
    let $gameRoomDiv = $('#room');
    let $guesserDiv = $('#guesser');
    let $cluegiverDiv = $('#cluegiver');

    $chosenRoomDiv.addClass('hidden');
    $gameRoomDiv.removeClass('hidden');

    // set view for CM or guesser
    if (currentUser.isCodemaster) {
        $guesserDiv.addClass('hidden');
    }
    else {
        $cluegiverDiv.addClass('hidden');
        $guesserDiv.addClass('hidden');
    }

    // buttons
    let $cluegiverButton = $('#cluegiver-button');
    let $cluegiverInput = $('#cluegiver-text');
    let $cluegiverNumber = $('#cluegiver-number');

    $cluegiverButton.on('click', function(event) {
        event.preventDefault();
        if ($cluegiverInput.val() === '') {
            alert('You must enter a clue!');
        }
        else {
            publishMessage(realtime, roomID, `${currentUser.id} clue ${$cluegiverNumber.val()} ${$cluegiverInput.val()}`);
            //giveClue($cluegiverInput.val(), $cluegiverNumber.val());
            $cluegiverInput.val('');
            $cluegiverNumber.val('1');
        }
    });

    let $guessButton = $('#guess-button');
    $guessButton.on('click', function(event) {
        event.preventDefault();
        if (checkGuess()) {
            publishMessage(realtime, roomID, `${currentUser.id} guess`);
        }
    });

    let $passButton = $('#pass-button');
    $passButton.on('click', function(event) {
        event.preventDefault();
        publishMessage(realtime, roomID, `${currentUser.id} pass`);
    });

}

async function onLoadHandler() {
    // get database data
    cleanupRooms();
    cleanupUsers(); 
    rooms = await getRooms();
    users = await getUsers();

    // get DOM
    userLobbyDOM();
}
// Wait for DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onLoadHandler);
  } else {
    onLoadHandler();
  }