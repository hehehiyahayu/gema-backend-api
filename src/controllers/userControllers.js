const admin = require('firebase-admin')
const { getStorage } = require("firebase/storage")
const userModel = require("../models/userModel")
const credentials = require("../../key.json")

try {
    admin.initializeApp({
        credential: admin.credential.cert(credentials)
    })
} catch (error) {
    admin.app()
}

const db = admin.firestore()

const readAllUser = async (req, res) => {
    try {
        const usersRef = db.collection("users")
        const response = await usersRef.get()
        let usersList = [];
        if(response.empty){
            res.status(400).send("No Data Available")
        } else {
            response.forEach(doc => {
                const users = new userModel(
                    doc.id,
                    doc.data().avatar,
                    doc.data().avatar,
                    doc.data().email,
                    doc.data().full_name,
                    doc.data().ktm_image,
                    doc.data().nim,
                    doc.data().password,
                    doc.data().phone_number,
                    doc.data().token,
                    doc.data().username
                )
                usersList.push(doc.data())
            })
            res.send(usersList)
        }
    } catch (e) {
        res.send(e)
    }
}

const readDetailUser = async (req, res) => {
    try {
        const userRef = db.collection("users").doc(req.params.nim)
        const response = await userRef.get()
        res.send(response.data())
    } catch (e) {
        res.send(e)
    }
}

const addUser = async (req, res) => {
    try{
        console.log(req.body)
        const id = req.body.nim
        const userJson = {
            avatar: req.body.avatar,
            email: req.body.email,
            full_name : req.body.full_name,
            ktm_image : req.body.ktm_image,
            nim : req.body.nim,
            password : req.body.password,
            phone_number : req.body.phone_number,
            token : req.body.token,
            username : req.body.username,
        }
        const response = await db.collection("users").doc(id).set(userJson)
        res.send(response)
    } catch(e) {
        res.send(e)
    }
}

const updateDetailUser = async (req, res) => {
    try {
        const id = req.params.nim
        console.log(id)
        const userRef = await db.collection("users").doc(id)
        .update({
            avatar: req.body.avatar,
            email: req.body.email,
            full_name : req.body.full_name,
            ktm_image : req.body.ktm_image,
            nim : req.body.nim,
            password : req.body.password,
            phone_number : req.body.phone_number,
            token : req.body.token,
            username : req.body.username,
        })
        res.send(userRef)
    } catch (e) {
        res.send(e)
    }
}

const deleteUser = async (req, res) => {
    try {
        const response = await db.collection("users").doc(req.params.nim).delete()
        res.send(response)
    } catch (e) {
        res.send(e)
    }
}

module.exports = {
    readAllUser,
    readDetailUser,
    addUser,
    updateDetailUser,
    deleteUser
}