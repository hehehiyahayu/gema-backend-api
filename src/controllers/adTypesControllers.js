const admin = require('firebase-admin')
const { getStorage } = require("firebase/storage")
const adTypesModel = require("../models/adTypesModel")
const credentials = require("../../key.json")

try {
    admin.initializeApp({
        credential: admin.credential.cert(credentials)
    })
} catch (error) {
    admin.app()
}

const db = admin.firestore()

const readAllAdType = async (req, res) => {
    try {
        const adTypesRef = db.collection("ad_types")
        const response = await adTypesRef.get()
        let adTypesList = [];
        if(response.empty){
            res.status(400).send("No Data Available")
        } else {
            response.forEach(doc => {
                const adTypes = new adTypesModel(
                    doc.id,
                    doc.data().ad_type_id,
                    doc.data().ad_type_name,
                )
                adTypesList.push(doc.data())
            })
            res.send(adTypesList)
        }
    } catch (e) {
        res.send(e)
    }
}

const readDetailAdType = async (req, res) => {
    try {
        const adTypesRef = db.collection("ad_types").doc(req.params.ad_type_id)
        const response = await adTypesRef.get()
        res.send(response.data())
    } catch (e) {
        res.send(e)
    }
}

const addAdType = async (req, res) => {
    try{
        console.log(req.body)
        const id = req.body.ad_type_id
        const adTypeJson = {
            ad_type_id : req.body.ad_type_id,
            ad_type_name : req.body.ad_type_name,
        }
        const response = await db.collection("ad_types").doc(id).set(adTypeJson)
        res.send(response)
    } catch(e) {
        res.send(e)
    }
}

const updateDetailAdType = async (req, res) => {
    try {
        const id = req.params.ad_type_id
        console.log(id)
        const adTypesRef = await db.collection("ad_types").doc(id)
        .update({
            ad_type_id : req.body.ad_type_id,
            ad_type_name : req.body.ad_type_name,
        })
        res.send(adTypesRef)
    } catch (e) {
        res.send(e)
    }
}

const deleteAdType = async (req, res) => {
    try {
        const response = await db.collection("ad_types").doc(req.params.ad_type_id).delete()
        res.send(response)
    } catch (e) {
        res.send(e)
    }
}

module.exports = {
    readAllAdType,
    readDetailAdType,
    addAdType,
    updateDetailAdType,
    deleteAdType
}