const admin = require('firebase-admin')
const { getStorage } = require("firebase/storage")
const conditionsModel = require("../models/conditionsModel")
const credentials = require("../../key.json")

try {
    admin.initializeApp({
        credential: admin.credential.cert(credentials)
    })
} catch (error) {
    admin.app()
}

const db = admin.firestore()

const readAllCondition = async (req, res) => {
    try {
        const conditionsRef = db.collection("conditions")
        const response = await conditionsRef.get()
        let usersList = [];
        if(response.empty){
            res.status(400).send("No Data Available")
        } else {
            response.forEach(doc => {
                const conditions = new conditionsModel(
                    doc.id,
                    doc.data().condition_id,
                    doc.data().condition_name,
                    doc.data().condition_type
                )
                usersList.push(doc.data())
            })
            res.send(usersList)
        }
    } catch (e) {
        res.send(e)
    }
}

const readDetailCondition = async (req, res) => {
    try {
        const conditionRef = db.collection("conditions").doc(req.params.condition_id)
        const response = await conditionRef.get()
        res.send(response.data())
    } catch (e) {
        res.send(e)
    }
}

const addCondition = async (req, res) => {
    try{
        console.log(req.body)
        const id = req.body.condition_id
        const conditionJson = {
            condition_id : req.body.condition_id,
            condition_name : req.body.condition_name,
            condition_type : req.body.condition_type
        }
        const response = await db.collection("conditions").doc(id).set(conditionJson)
        res.send(response)
    } catch(e) {
        res.send(e)
    }
}

const updateDetailCondition = async (req, res) => {
    try {
        const id = req.params.condition_id
        console.log(id)
        const conditionRef = await db.collection("conditions").doc(id)
        .update({
            condition_id : req.body.condition_id,
            condition_name : req.body.condition_name,
            condition_type : req.body.condition_type
        })
        res.send(conditionRef)
    } catch (e) {
        res.send(e)
    }
}

const deleteCondition = async (req, res) => {
    try {
        const response = await db.collection("conditions").doc(req.params.condition_id).delete()
        res.send(response)
    } catch (e) {
        res.send(e)
    }
}

module.exports = {
    readAllCondition,
    readDetailCondition,
    addCondition,
    updateDetailCondition,
    deleteCondition
}