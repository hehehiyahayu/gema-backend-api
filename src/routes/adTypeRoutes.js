const express = require('express')
const { readAllAdType, readDetailAdType, addAdType, updateDetailAdType, deleteAdType} = require("../controllers/adTypesControllers")

const router = express.Router()

router.get('/read/all', readAllAdType);

router.get('/read/:ad_type_id', readDetailAdType);

router.post('/create',addAdType);

router.patch('/update/:ad_type_id', updateDetailAdType);

router.delete('/delete/:ad_type_id', deleteAdType);

module.exports = {
    routes: router
}