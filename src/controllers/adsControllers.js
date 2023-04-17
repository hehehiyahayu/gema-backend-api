const admin = require('firebase-admin')
const { getStorage } = require("firebase/storage")
const adsModel = require("../models/adsModel")

const credentials = require("../../key.json")

try {
    admin.initializeApp({
        credential: admin.credential.cert(credentials)
    })
} catch (error) {
    admin.app()
}

const db = admin.firestore()

const readAllAd = async (req, res) => {
    try {
        const adsRef = db.collection("ads")
        const response = await adsRef.get()
        let adsList = [];
        if(response.empty){
            res.status(400).send("No Data Available")
        } else {
            response.forEach(doc => {
                const ads = new adsModel(
                    doc.id,
                    doc.data().ad_id,
                    doc.data().category_id,
                    doc.data().condition_id,
                    doc.data().description,
                    doc.data().image,
                    doc.data().nim,
                    doc.data().price,
                    doc.data().status_id,
                    doc.data().title,
                    doc.data().type_id
                )
                adsList.push(doc.data())
            })
            res.send(adsList)
        }
    } catch (e) {
        res.send(e)
    }
}

const readDetailAd = async (req, res) => {
    try {
        const adsRef = db.collection("ads").doc(req.params.ad_id)
        const response = await adsRef.get()
        res.send(response.data())
    } catch (e) {
        res.send(e)
    }
}

const readDetail = async (req, res) => {
    try {
        const adId = req.params.ad_id;
        const adDoc = await db.collection("ads").doc(adId).get()
        const adData = adDoc.data();
        
        // Get the category document
        const categoryId = adData.category_id;
        const categoryQuerySnapshot = await db.collection('categories').where('category_id', '==', categoryId).get();
        const categoryDoc = categoryQuerySnapshot.docs[0];
        const categoryData = categoryDoc.data();

        // Get the ad type document
        const adTypeId = adData.ad_type_id;
        const adTypeDoc = await db.collection('ad_types').doc(adTypeId).get();
        const adTypeData = adTypeDoc.data();

        const result = {
            ad_id: adData.ad_id,
            ad_type_id: adTypeData.ad_type_name,
            category_id: categoryData.category_name,
            condition_id: adData.condition_id,
            description: adData.description,
            image: adData.image,
            nim: adData.nim,
            price: adData.price,
            status_id: adData.status_id,
            title: adData.title,
        };

        res.send([result])
    } catch (e) {
        res.send(e)
    }
}

const addAd = async (req, res) => {
    try{
        // console.log(req.body.ad_id)
        const id = req.body.ad_id
        console.log(id);
        const adJson = {
            ad_id : req.body.ad_id,
            category_id : req.body.category_id,
            condition_id : req.body.condition_id,
            description : req.body.description,
            image : req.body.image,
            nim : req.body.nim,
            price : req.body.price,
            status_id : req.body.status_id,
            title : req.body.title,
            type_id : req.body.type_id,
        }
        const response = await db.collection("ads").doc(id).set(adJson)
        console.log('test');
        res.send(response)
    } catch(e) {
        res.send(e)
    }
}

const updateDetailAd = async (req, res) => {
    try {
        const id = req.params.ad_id
        console.log(id)
        const adsRef = await db.collection("ads").doc(id)
        .update({
            ad_id : req.body.ad_id,
            category_id : req.body.category_id,
            condition_id : req.body.condition_id,
            description : req.body.description,
            image : req.body.image,
            nim : req.body.nim,
            price : req.body.price,
            status_id : req.body.status_id,
            title : req.body.title,
            type_id : req.body.type_id,
        })
        res.send(adsRef)
    } catch (e) {
        res.send(e)
    }
}

const deleteAd = async (req, res) => {
    try {
        const response = await db.collection("ads").doc(req.params.ad_id).delete()
        res.send(response)
    } catch (e) {
        res.send(e)
    }
}

module.exports = {
    readAllAd,
    readDetailAd,
    readDetail,
    addAd,
    updateDetailAd,
    deleteAd
}