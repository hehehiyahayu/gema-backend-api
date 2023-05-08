const express = require('express')
const { readAllWishlist, readDetailWishlist, addWishlist, updateDetailWishlist, deleteWishlist} = require("../controllers/wishlistControllers")

const router = express.Router()

router.get('/read/all/:user_id', readAllWishlist);

router.get('/read/:wishlist_id', readDetailWishlist);

router.post('/create',addWishlist);

router.patch('/update/:wishlist_id', updateDetailWishlist);

router.delete('/delete/:wishlist_id', deleteWishlist);

module.exports = {
    routes: router
}