import { firebaseConfig } from './keys.js';

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();

// Rooms ----------------------------------------------------------------------

// returns existing rooms from database
export async function getRooms() {
    const data = await db.collection('rooms').get();

    const rooms = data.docs.map((doc) => {
        return {
          id: doc.id,
          timeCreated: doc.data().timeCreated.toDate()
        };
      });

    return rooms;
}

// adds new room to database and returns its ID
export async function createRoom(user) {
    let data = await getRooms();

    let newID = Math.floor(Math.random() * 10000);
    newID = (newID.toString()).padStart(4, '0');

    while(data.some(function(room) {
        return room.id === newID;
    })) {
        newID = (parseInt(newID) + 1) % 1000;
        newID = (newID.toString()).padStart(4, '0');
    }

    // creates room with custom id
    await db.collection('rooms').doc(newID).set({
        timeCreated: new Date()
    });

    // add user to room
    joinRoom(user, newID);
    db.collection('users').doc(user).update({
        isHost: true
    });

    return newID;
}

// adds room ID to user in database
export async function joinRoom(userID, roomID) {
    return db.collection('users').doc(userID).update({
        roomID: roomID
    });
}


// deletes a room from the database, takes an ID as input
export async function deleteRoom(id) {
    await db.collection('rooms').doc(id).delete();
    // delete all users in room
    let users = await getUsers();
    users = users.filter(function(user) {
        if (user.roomID === id) {
            return user;
        }
    });

    for (let i = 0; i < users.length; i++) {
        deleteUser(users[i].id);
    }
}

// deletes all rooms older than 1 day old
export async function cleanupRooms() {
    // find 2 days ago - cutoff for deleting rooms
    let cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 2);

    // find rooms created before cutoff
    let data = await getRooms();
    data = data.filter(function(room) {
        if (room.timeCreated < cutoffDate) {
            return room;
        }
    });

    for (let i = 0; i < data.length; i++) {
        deleteRoom(data[i].id);
    }
}

// Users ----------------------------------------------------------------------

// returns existing users from database
export async function getUsers() {
    const data = await db.collection('users').get();

    const rooms = data.docs.map((doc) => {
        return {
          id: doc.id,
          isHost: doc.data().isHost,
          roomID: doc.data().roomID,
          timeCreated: doc.data().timeCreated.toDate(),
          userName: doc.data().userName,
          team: doc.data().team
        };
      });

    return rooms;
}

// creates a user and returns its ID
export async function createUser(name) {
    // creates user
    let user = await db.collection('users').add({
        isHost: false,
        roomID: 'null',
        timeCreated: new Date(),
        userName: name,
        team: 'null'
    });
    return await user.id;
}

// updates name of user in database
export async function renameUser(name, id) {
    await db.collection('users').doc(id).update({
        userName: name
    });
}

// updates team of user in database
export async function changeUserTeam(team, id) {
    await db.collection('users').doc(id).update({
        team: team
    });
}

// deletes a user form the database, taking an ID as input
export async function deleteUser(id) {
    await db.collection('users').doc(id).delete();
}

// deletes all users older than 1 day old
export async function cleanupUsers() {
    // find 2 days ago - cutoff for deleting users
    let cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 2);

    // find user created before cutoff
    let data = await getUsers();
    data = data.filter(function(user) {
        if (user.timeCreated < cutoffDate) {
            return user;
        }
    });

    for (let i = 0; i < data.length; i++) {
        deleteUser(data[i].id);
    }
}

export async function getCurrentRoom(id) {
    let user = await db.collection('users').doc(id).get();
    return await user.data().roomID;
}

export async function getName(id) {
    let user = await db.collection('users').doc(id).get();
    return await user.data().userName;
}