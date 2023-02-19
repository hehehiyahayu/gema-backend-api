const express = require('express')
const { readAllAd, readDetailAd, addAd, updateDetailAd, deleteAd} = require("../controllers/adsControllers")

const router = express.Router()

router.get('/read/all', readAllAd);

router.get('/read/:ad_id', readDetailAd);

router.post('/create',addAd);

router.patch('/update/:ad_id', updateDetailAd);

router.delete('/delete/:ad_id', deleteAd);

module.exports = {
    routes: router
}