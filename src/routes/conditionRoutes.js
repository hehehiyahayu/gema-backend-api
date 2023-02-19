const express = require('express')
const { readAllCondition, readDetailCondition, addCondition, updateDetailCondition, deleteCondition} = require("../controllers/conditionControllers")

const router = express.Router()

router.get('/read/all', readAllCondition);

router.get('/read/:condition_id', readDetailCondition);

router.post('/create',addCondition);

router.patch('/update/:condition_id', updateDetailCondition);

router.delete('/delete/:condition_id', deleteCondition);

module.exports = {
    routes: router
}