const admin = require('firebase-admin')
const { getStorage } = require("firebase/storage")
const chatModel = require("../models/chatModel")
const credentials = require("../../key.json")

try {
    admin.initializeApp({
        credential: admin.credential.cert(credentials)
    })
} catch (error) {
    admin.app()
}

const db = admin.firestore()

const readAllChat = async (req, res) => {
    try {
        const chatsRef = db.collection("chats")
        const response = await chatsRef.get()
        let chatsList = [];
        if(response.empty){
            res.status(400).send("No Data Available")
        } else {
            response.forEach(doc => {
                const chats = new chatModel(
                    doc.id,
                    doc.data().ad_id,
                    doc.data().chat_id,
                    doc.data().message,
                    doc.data().receiver_id,
                    doc.data().sender_id,
                    doc.data().status_id
                )
                chatsList.push(doc.data())
            })
            res.send(chatsList)
        }
    } catch (e) {
        res.send(e)
    }
}

const readDetailChat = async (req, res) => {
    try {
        const chatRef = db.collection("chats").doc(req.params.chat_id)
        const response = await chatRef.get()
        res.send(response.data())
    } catch (e) {
        res.send(e)
    }
}

const unreadChat = async (req, res) => {
    // try{
    //     // const chatRef = db.collection
    // }
}

const addChat = async (req, res) => {
    try {
        const date = new Date();
        const jakartaTimezone = 'Asia/Jakarta';
        const options = {
            timeZone: jakartaTimezone,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',  
            second: '2-digit'
        };
        const dateString = date.toLocaleString('en-US', options);
        const chatJson = {
            ad_id : req.body.ad_id,
            message : req.body.message,
            receiver_id : req.body.receiver_id,
            sender_id : req.body.sender_id,
            status_id : req.body.status_id,
            date: dateString.toString()
        };
        const docRef = await db.collection("chats").doc();
        const response = await docRef.set(chatJson);
        res.send(response);
    } catch (e) {
        res.send(e);
    }
}

const updateDetailChat = async (req, res) => {
    try {
        const id = req.params.chat_id
        console.log(id)
        const chatRef = await db.collection("chats").doc(id)
        .update({
            ad_id : req.body.ad_id,
            chat_id : req.body.chat_id,
            message : req.body.message,
            receiver_id : req.body.receiver_id,
            sender_id : req.body.sender_id,
            status_id : req.body.status_id
        })
        res.send(chatRef)
    } catch (e) {
        res.send(e)
    }
}

const deleteChat = async (req, res) => {
    try {
        const response = await db.collection("chats").doc(req.params.chat_id).delete()
        res.send(response)
    } catch (e) {
        res.send(e)
    }
}

const contactList = async(req, res) => {
    try {
        db.collection('chats').get().then((querySnapshot) => {
            const pairs = [];
            querySnapshot.forEach((doc) => {
                const sender_id = doc.data().sender_id;
                const receiver_id = doc.data().receiver_id;
                const pair = {
                    sender_id: sender_id,
                    receiver_id: receiver_id
                    };
                    if (!pairs.some(p => p.sender_id === sender_id && p.receiver_id === receiver_id)) {
                    pairs.push(pair);
                    }
                });
                const userPromises = pairs.map(pair => {
                    return db.collection("users").where('nim', '==', pair.receiver_id).get();
                    });
                
                    Promise.all(userPromises)
                    .then((userSnapshots) => {
                        const contacts = [];
                        userSnapshots.forEach((userSnapshot, i) => {
                        const userData = userSnapshot.docs[0].data();
                        const contact = {
                            nim: userData.nim,
                            full_name: userData.full_name,
                            avatar: userData.avatar,
                        };
                        contacts.push(contact);
                        });
                        console.log(contacts);
                        res.send(contacts);
                    })
            })
            .catch((error) => {
            console.log('Error getting documents: ', error);
            });
        
        
    } catch (e) {
        res.send(e)
    }
}

module.exports = {
    readAllChat,
    readDetailChat,
    addChat,
    updateDetailChat,
    deleteChat,
    contactList
}