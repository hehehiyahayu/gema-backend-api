const admin = require('firebase-admin')
const { getStorage } = require("firebase/storage")
const reviewsModel = require("../models/reviewsModel")
const credentials = require("../../key.json")

try {
    admin.initializeApp({
        credential: admin.credential.cert(credentials)
    })
} catch (error) {
    admin.app()
}

const db = admin.firestore()

const readAllReview = async (req, res) => {
    try {
        const usersRef = db.collection("reviews")
        const response = await usersRef.get()
        let usersList = [];
        if(response.empty){
            res.status(400).send("No Data Available")
        } else {
            response.forEach(doc => {
                const reviews = new reviewsModel(
                    doc.id,
                    doc.data().review_id,
                    doc.data().ad_id,
                    doc.data().description,
                    doc.data().image,
                    doc.data().nim,
                    doc.data().rating
                )
                usersList.push(doc.data())
            })
            res.send(usersList)
        }
    } catch (e) {
        res.send(e)
    }
}

const readDetailReview = async (req, res) => {
    try {
        const reviewRef = db.collection("reviews").doc(req.params.review_id)
        const response = await reviewRef.get()
        res.send(response.data())
    } catch (e) {
        res.send(e)
    }
}

const addReview = async (req, res) => {
    try{
        console.log(req.body)
        const id = req.body.review_id
        const reviewJson = {
            review_id : req.body.review_id,
            ad_id : req.body.ad_id,
            description : req.body.description,
            image : req.body.image,
            nim : req.body.nim,
            rating : req.body.rating
        }
        const response = await db.collection("reviews").doc(id).set(reviewJson)
        res.send(response)
    } catch(e) {
        res.send(e)
    }
}

const updateDetailReview = async (req, res) => {
    try {
        const id = req.params.review_id
        console.log(id)
        const reviewRef = await db.collection("reviews").doc(id)
        .update({
            review_id : req.body.review_id,
            ad_id : req.body.ad_id,
            description : req.body.description,
            image : req.body.image,
            nim : req.body.nim,
            rating : req.body.rating
        })
        res.send(reviewRef)
    } catch (e) {
        res.send(e)
    }
}

const deleteReview = async (req, res) => {
    try {
        const response = await db.collection("reviews").doc(req.params.review_id).delete()
        res.send(response)
    } catch (e) {
        res.send(e)
    }
}

module.exports = {
    readAllReview,
    readDetailReview,
    addReview,
    updateDetailReview,
    deleteReview
}