const express = require('express')
const { readAllReview, readDetailReview, addReview, updateDetailReview, deleteReview} = require("../controllers/reviewControllers")

const router = express.Router()

router.get('/read/all', readAllReview);

router.get('/read/:review_id', readDetailReview);

router.post('/create',addReview);

router.patch('/update/:review_id', updateDetailReview);

router.delete('/delete/:review_id', deleteReview);

module.exports = {
    routes: router
}