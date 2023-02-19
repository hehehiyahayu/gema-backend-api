const express = require('express')
const { readAllMajor, readDetailMajor, addMajor, updateDetailMajor, deleteMajor} = require("../controllers/majorsControllers")

const router = express.Router()

router.get('/read/all', readAllMajor);

router.get('/read/:major_id', readDetailMajor);

router.post('/create',addMajor);

router.patch('/update/:major_id', updateDetailMajor);

router.delete('/delete/:major_id', deleteMajor);

module.exports = {
    routes: router
}