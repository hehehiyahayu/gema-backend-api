const admin = require('firebase-admin')
const { getStorage } = require("firebase/storage")
const wishlistsModel = require("../models/wishlistsModel")
const credentials = require("../../key.json")

try {
    admin.initializeApp({
        credential: admin.credential.cert(credentials)
    })
} catch (error) {
    admin.app()
}

const db = admin.firestore()

const readAllWishlist = async (req, res) => {
    try {
        const userId = req.params.user_id;
        const wishlistsListRef = db.collection("wishlists")
        const response = await wishlistsListRef.where('nim', '==', userId).get()
        let wishlistsList = [];
        if(response.empty){
            res.status(400).send("No Data Available")
        } else {
            response.forEach(doc => {
                const wishlists = new wishlistsModel(
                    doc.id,
                    doc.data().ad_id, 
                    doc.data().nim, 
                    doc.data().wishlist_id
                )
                wishlistsList.push(doc.data())
            })
            res.send(wishlistsList)
        }
    } catch (e) {
        res.send(e)
    }
}

const readDetailWishlist = async (req, res) => {
    try {
        const wishlistRef = db.collection("wishlists").doc(req.params.wishlist_id)
        const response = await wishlistRef.get()
        res.send(response.data())
    } catch (e) {
        res.send(e)
    }
}

const addWishlist = async (req, res) => {
    try{
        const id = req.body.wishlist_id
        const wishlistJson = {
            ad_id : req.body.ad_id,
            nim : req.body.nim,
            wishlist_id : req.body.wishlist_id
        }
        const response = await db.collection("wishlists").doc(id).set(wishlistJson)
        res.send(response)
    } catch(e) {
        res.send(e)
    }
}

const updateDetailWishlist = async (req, res) => {
    try {
        const id = req.params.wishlist_id
        console.log(id)
        const wishlistRef = await db.collection("wishlists").doc(id)
        .update({
            ad_id : req.body.ad_id,
            nim : req.body.nim,
            wishlist_id : req.body.wishlist_id
        })
        res.send(wishlistRef)
    } catch (e) {
        res.send(e)
    }
}

const deleteWishlist = async (req, res) => {
    try {
        const response = await db.collection("wishlists").doc(req.params.wishlist_id).delete()
        res.send(response)
    } catch (e) {
        res.send(e)
    }
}

module.exports = {
    readAllWishlist,
    readDetailWishlist,
    addWishlist,
    updateDetailWishlist,
    deleteWishlist
}