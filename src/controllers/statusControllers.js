const admin = require('firebase-admin')
const { getStorage } = require("firebase/storage")
const statusesModel = require("../models/statusesModel")
const credentials = require("../../key.json")

try {
    admin.initializeApp({
        credential: admin.credential.cert(credentials)
    })
} catch (error) {
    admin.app()
}

const db = admin.firestore()

const readAllStatus = async (req, res) => {
    try {
        const statusesRef = db.collection("statuses")
        const response = await statusesRef.get()
        let statusesList = [];
        if(response.empty){
            res.status(400).send("No Data Available")
        } else {
            response.forEach(doc => {
                const statuses = new statusesModel(
                    doc.id,
                    doc.data().status_id,
                    doc.data().status_name,
                    doc.data().status_type
                )
                statusesList.push(doc.data())
            })
            res.send(statusesList)
        }
    } catch (e) {
        res.send(e)
    }
}

const readDetailStatus = async (req, res) => {
    try {
        const statusRef = db.collection("statuses").doc(req.params.status_id)
        const response = await statusRef.get()
        res.send(response.data())
    } catch (e) {
        res.send(e)
    }
}

const addStatus = async (req, res) => {
    try{
        console.log(req.body)
        const id = req.body.status_id
        const userJson = {
            status_id : req.body.status_id,
            status_name : req.body.status_name,
            status_type : req.body.status_type
        }
        const response = await db.collection("statuses").doc(id).set(userJson)
        res.send(response)
    } catch(e) {
        res.send(e)
    }
}

const updateDetailStatus = async (req, res) => {
    try {
        const id = req.params.status_id
        console.log(id)
        const userRef = await db.collection("statuses").doc(id)
        .update({
            status_id : req.body.status_id,
            status_name : req.body.status_name,
            status_type : req.body.status_type
        })
        res.send(userRef)
    } catch (e) {
        res.send(e)
    }
}

const deleteStatus = async (req, res) => {
    try {
        const response = await db.collection("statuses").doc(req.params.status_id).delete()
        res.send(response)
    } catch (e) {
        res.send(e)
    }
}

module.exports = {
    readAllStatus,
    readDetailStatus,
    addStatus,
    updateDetailStatus,
    deleteStatus
}