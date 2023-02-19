const admin = require('firebase-admin')
const { getStorage } = require("firebase/storage")
const categoriesModel = require("../models/categoriesModel")
const credentials = require("../../key.json")

try {
    admin.initializeApp({
        credential: admin.credential.cert(credentials)
    })
} catch (error) {
    admin.app()
}

const db = admin.firestore()

const readAllCategory = async (req, res) => {
    try {
        const categoriesRef = db.collection("categories")
        const response = await categoriesRef.get()
        let categoriesList = [];
        if(response.empty){
            res.status(400).send("No Data Available")
        } else {
            response.forEach(doc => {
                const categories = new categoriesModel(
                    doc.id,
                    doc.data().category_id,
                    doc.data().category_name
                )
                categoriesList.push(doc.data())
            })
            res.send(categoriesList)
        }
    } catch (e) {
        res.send(e)
    }
}

const readDetailCategory = async (req, res) => {
    try {
        const categoryRef = db.collection("categories").doc(req.params.category_id)
        const response = await categoryRef.get()
        res.send(response.data())
    } catch (e) {
        res.send(e)
    }
}

const addCategory = async (req, res) => {
    try{
        console.log(req.body)
        const id = req.body.category_id
        const categoryJson = {
            "category_id" : req.body.category_id,
            "category_name" : req.body.category_name
        }
        const response = await db.collection("categories").doc(id).set(categoryJson)
        res.send(response)
    } catch(e) {
        res.send(e)
    }
}

const updateDetailCategory = async (req, res) => {
    try {
        const id = req.params.category_id
        console.log(id)
        const categoryRef = await db.collection("categories").doc(id)
        .update({
            "category_id" : req.body.category_id,
            "category_name" : req.body.category_name
        })
        res.send(categoryRef)
    } catch (e) {
        res.send(e)
    }
}

const deleteCategory = async (req, res) => {
    try {
        const response = await db.collection("categories").doc(req.params.category_id).delete()
        res.send(response)
    } catch (e) {
        res.send(e)
    }
}

module.exports = {
    readAllCategory,
    readDetailCategory,
    addCategory,
    updateDetailCategory,
    deleteCategory
}