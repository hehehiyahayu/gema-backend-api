const admin = require('firebase-admin')
const { getStorage } = require("firebase/storage")
const userModel = require("../models/userModel")
const credentials = require("../../key.json")
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' })

try {
    admin.initializeApp({
        credential: admin.credential.cert(credentials),
        storageBucket: 'gs://geraimahasiswa-8d67b.appspot.com'
    })
} catch (e) {
    admin.app()
}

const db = admin.firestore()
const bucket = admin.storage().bucket();

function getDayPlusOne(){
    let today = new Date();
    let dd = String(today.getDate() + 1).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;

    return today
}

async function getAvatarIcon(nim) {
    try {
        let avatarUserName = `userAvatar/avatar_${nim}`
        let avatarUserFile = bucket.file(avatarUserName)
        let [url] = await avatarUserFile.getSignedUrl({
            action: 'read',
            expires: getDayPlusOne()
        })

        return url
    } catch (e) {
        console.error('Error reading photo:', e);
    }
}

const readAllUser = async (req, res) => {
    try{
        const userRef = db.collection("users")
        const response = await userRef.get()
        let usersList = [];
        if(response.empty){
            res.status(400).send("No Data Available")
        } else {
            response.forEach((doc) => {
                let avatarUserName = `userAvatar/avatar_${doc.data().nim}`
                let avatarUserFile = bucket.file(avatarUserName)
                try {
                    let [url] = avatarUserFile.getSignedUrl({
                        action: 'read',
                        expires: getDayPlusOne()
                    })

                    console.log(url)
                    try {
                        let updateUserRef = db.collection("users").doc(doc.data().nim).update({
                            avatar: url
                        })
                        console.log(updateUserRef)
                    } catch (e) {
                        console.log(e)
                    }
                } catch (e) {
                    console.log(e)
                }
            })

            response.forEach(doc => {
                try {
                    const users = new userModel(
                        doc.data().avatar,
                        doc.data().email,
                        doc.data().full_name,
                        doc.data().nim,
                        doc.data().password,
                        doc.data().phone_number,
                        doc.data().token,
                        doc.data().username
                    )
                    usersList.push(users)
                } catch (e) {
                    console.log(e)
                }
            })
            res.send(usersList)
        }
    } catch(e){
        res.send(e)
    }
    
    // try {
    //     const userRef = db.collection("users")
    //     const response = await userRef.get()
    //     let usersList = [];
    //     if(response.empty){
    //         res.status(400).send("No Data Available")
    //     } else {
    //         response.forEach(doc => {
    //             const users = new userModel(
    //                 doc.data().avatar,
    //                 doc.data().email,
    //                 doc.data().full_name,
    //                 doc.data().nim,
    //                 doc.data().password,
    //                 doc.data().phone_number,
    //                 doc.data().token,
    //                 doc.data().username
    //             )
    //             usersList.push(doc.data())
    //         })
    //         res.send(usersList)
    //     }
    // } catch (e) {
    //     res.send(e)
    // }
}

const readDetailUser = async (req, res) => {
    try {
        try {
            const avatarUserName = `userAvatar/avatar_${req.params.nim}`
            const avatarUserFile = bucket.file(avatarUserName)
            const [url] = await avatarUserFile.getSignedUrl({
                action: 'read',
                expires: getDayPlusOne()
            })

            const userRef = db.collection("users").doc(req.params.nim)

            const updateUserRef = userRef.update({
                avatar : url
            })
    
            const response = await userRef.get()
            res.send(response.data())
        } catch (e) {
            console.error('Error reading photo:', e);
            res.status(500).send('Error reading photo.');
        }
    } catch (e) {
        res.send(e)
    }
}

const getDetailUser = async (req, res) => {
    try {
        const userData = await db.collection("users").where('email', '==', req.params.email).get()

        const nim = userData.docs[0].data().nim

        try {
            const avatarUserName = `userAvatar/avatar_${nim}`
            const avatarUserFile = bucket.file(avatarUserName)
            const [url] = await avatarUserFile.getSignedUrl({
                action: 'read',
                expires: getDayPlusOne()
            })

            const userRef = db.collection("users").doc(nim)

            const updateUserRef = userRef.update({
                avatar : url
            })
    
            const response = await userRef.get()
            res.send(response.data())
        } catch (e) {
            console.error('Error reading photo:', e);
            res.status(500).send('Error reading photo.');
        }
    } catch (e) {
        res.send(e)
    }
}

const addUser = async (req, res) => {
    try{
        try {
            if(!req.file) {
                return res.status(400).send('No file uploaded')
            }
        
            if(req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/jpg' && req.file.mimetype !== 'image/png') {
                return res.status(400).send('Invalid file type')
            }
    
            if(req.file.size > 1000000){
                return res.status(400).send('File is too large')
            }
    
            const folderName = "userAvatar"
            const file = req.file
            const fileName = `${folderName}/avatar_${req.body.nim}`
    
            bucket.upload(file.path, {
                destination: fileName,
                metadata: {
                    contentType: `${req.file.mimetype}`,
                    metadata: {
                        originalName: fileName,
                        size: file.size
                    }
                }
            })

            try {
                const avatarUserName = `userAvatar/avatar_${req.body.nim}`
                const avatarUserFile = bucket.file(avatarUserName)
                const [url] = await avatarUserFile.getSignedUrl({
                    action: 'read',
                    expires: getDayPlusOne()
                })

                console.log(req.body)
                const id = req.body.nim
                const userJson = {
                    avatar: url,
                    email: req.body.email,
                    full_name : req.body.full_name,
                    nim : req.body.nim,
                    password : req.body.password,
                    phone_number : req.body.phone_number,
                    token : req.body.token,
                    username : req.body.username,
                }
                const response = await db.collection("users").doc(id).set(userJson)
                res.send(response)
            } catch (e) {
                console.error('Error reading photo:', e);
                res.status(500).send('Error reading photo.');
            }
        } catch (e) {
            console.error('Error uploading photo:', e);
            res.status(500).send('Error uploading photo.');
        }
    } catch(e) {
        res.send(e)
    }
}

const updateDetailUser = async (req, res) => {
    try {
        const id = req.params.nim
        try{
            if(req.file){
                if(req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/jpg' && req.file.mimetype !== 'image/png') {
                    return res.status(400).send('Invalid file type')
                }
        
                if(req.file.size > 1000000){
                    return res.status(400).send('File is too large')
                }
            }

            const folderName = "userAvatar"
            const file = req.file
            const fileName = `${folderName}/avatar_${id}`

            bucket.upload(file.path, {
                destination: fileName,
                metadata: {
                    contentType: `${req.file.mimetype}`,
                    metadata: {
                        originalName: fileName,
                        size: file.size
                    }
                }
            })

            try{
                const avatarUserName = `userAvatar/avatar_${req.params.nim}`
                const avatarUserFile = bucket.file(avatarUserName)
                const [url] = await avatarUserFile.getSignedUrl({
                    action: 'read',
                    expires: getDayPlusOne()
                })
    
                // console.log(id)
                const userRef = await db.collection("users").doc(id)
                .update({
                    avatar: url,
                    email: req.body.email,
                    full_name : req.body.full_name,
                    nim : req.body.nim,
                    password : req.body.password,
                    phone_number : req.body.phone_number,
                    token : req.body.token,
                    username : req.body.username,
                })
                res.send(userRef)
            }catch(e){
                console.error('Error reading photo:', e);
                res.status(500).send('Error reading photo.');
            }
            
        }catch(e){
            console.error('Error uploading photo:', e);
            res.status(500).send('Error uploading photo.');
        }
    } catch (e) {
        res.send(e)
    }
}

const deleteUser = async (req, res) => {
    try {
        const photoName = `userAvatar/avatar_${req.params.nim}`

        bucket.file(photoName).delete()
            .then(() => {
                console.log('Photo deleted successfully.');
            })
            .catch((e) => {
                console.error('Error deleting photo:', e);
                res.status(500).send('Error deleting photo.');
            })

        const responseUser = await db.collection("users").doc(req.params.nim).delete()
        res.send(responseUser)
    } catch (e) {
        res.send(e)
    }
}

module.exports = {
    readAllUser,
    readDetailUser,
    getDetailUser,
    addUser,
    updateDetailUser,
    deleteUser
}