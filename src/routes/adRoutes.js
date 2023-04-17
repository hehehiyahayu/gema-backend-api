const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/adsPhotos' })

const { readAllAd, readDetailAd, addAd, updateDetailAd, deleteAd} = require("../controllers/adsControllers")

const router = express.Router()

router.get('/read/all', readAllAd);

router.get('/read/:ad_id', readDetailAd);

router.post('/create', upload.single('image'), addAd);

router.patch('/update/:ad_id', upload.single('image'), updateDetailAd);

router.delete('/delete/:ad_id', deleteAd);

module.exports = {
    routes: router
}