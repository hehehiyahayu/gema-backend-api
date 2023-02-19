const express = require('express')
const { readAllStatus, readDetailStatus, addStatus, updateDetailStatus, deleteStatus} = require("../controllers/statusControllers")

const router = express.Router()

router.get('/read/all', readAllStatus);

router.get('/read/:status_id', readDetailStatus);

router.post('/create',addStatus);

router.patch('/update/:status_id', updateDetailStatus);

router.delete('/delete/:status_id', deleteStatus);

module.exports = {
    routes: router
}