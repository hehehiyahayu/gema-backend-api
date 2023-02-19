const admin = require('firebase-admin')
const { getStorage } = require("firebase/storage")
const majorModel = require("../models/majorsModel")
const credentials = require("../../key.json")

try {
    admin.initializeApp({
        credential: admin.credential.cert(credentials)
    })
} catch (error) {
    admin.app()
}

const db = admin.firestore()

const readAllMajor = async (req, res) => {
    try {
        const majorsRef = db.collection("majors")
        const response = await majorsRef.get()
        let majorsListst = [];
        if(response.empty){
            res.status(400).send("No Data Available")
        } else {
            response.forEach(doc => {
                const majors = new majorModel(
                    doc.id,
                    doc.data().major_id,
                    doc.data().major_name,
                )
                majorsListst.push(doc.data())
            })
            res.send(majorsListst)
        }
    } catch (e) {
        res.send(e)
    }
}

const readDetailMajor = async (req, res) => {
    try {
        const majorRef = db.collection("majors").doc(req.params.major_id)
        const response = await majorRef.get()
        res.send(response.data())
    } catch (e) {
        res.send(e)
    }
}

const addMajor = async (req, res) => {
    try{
        console.log(req.body)
        const id = req.body.major_id
        const majorJson = {
            major_id : req.body.major_id,
            major_name : req.body.major_name
        }
        const response = await db.collection("majors").doc(id).set(majorJson)
        res.send(response)
    } catch(e) {
        res.send(e)
    }
}

const updateDetailMajor = async (req, res) => {
    try {
        const id = req.params.major_id
        console.log(id)
        const majorRef = await db.collection("majors").doc(id)
        .update({
            major_id : req.body.major_id,
            major_name : req.body.major_name
        })
        res.send(majorRef)
    } catch (e) {
        res.send(e)
    }
}

const deleteMajor = async (req, res) => {
    try {
        const response = await db.collection("majors").doc(req.params.major_id).delete()
        res.send(response)
    } catch (e) {
        res.send(e)
    }
}

module.exports = {
    readAllMajor,
    readDetailMajor,
    addMajor,
    updateDetailMajor,
    deleteMajor
}