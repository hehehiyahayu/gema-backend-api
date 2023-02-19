const express = require('express')
const { readAllChat, readDetailChat, addChat, updateDetailChat, deleteChat} = require("../controllers/chatControllers")

const router = express.Router()

router.get('/read/all', readAllChat);

router.get('/read/:chat_id', readDetailChat);

router.post('/create',addChat);

router.patch('/update/:chat_id', updateDetailChat);

router.delete('/delete/:chat_id', deleteChat);

module.exports = {
    routes: router
}