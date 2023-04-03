const express = require('express')
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const { readAllUser, readDetailUser, addUser, updateDetailUser, deleteUser} = require("../controllers/userControllers")

const router = express.Router()

router.get('/read/all', readAllUser);

router.get('/read/:nim', readDetailUser);

router.post('/create', upload.single('avatar'), addUser);

router.patch('/update/:nim', upload.single('avatar'), updateDetailUser);

router.delete('/delete/:nim', deleteUser);

module.exports = {
    routes: router
}