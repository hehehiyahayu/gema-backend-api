const express = require('express')
const { readAllUser, readDetailUser, addUser, updateDetailUser, deleteUser} = require("../controllers/userControllers")

const router = express.Router()

router.get('/read/all', readAllUser);

router.get('/read/:nim', readDetailUser);

router.post('/create',addUser);

router.patch('/update/:nim', updateDetailUser);

router.delete('/delete/:nim', deleteUser);

module.exports = {
    routes: router
}