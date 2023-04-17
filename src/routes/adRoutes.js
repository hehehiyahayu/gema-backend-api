const express = require('express')
const { readAllAd, readDetailAd, addAd, updateDetailAd, deleteAd, readDetail} = require("../controllers/adsControllers")

const router = express.Router()

router.get('/read/all', readAllAd);

router.get('/read/detail/:ad_id', readDetail);

router.get('/read/:ad_id', readDetailAd);

router.post('/create', upload.single('image'), addAd);

router.patch('/update/:ad_id', upload.single('image'), updateDetailAd);

router.delete('/delete/:ad_id', deleteAd);

module.exports = {
    routes: router
}