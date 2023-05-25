const express = require('express')

const { signUp, signIn, signOut } = require("../controllers/authControllers")

const router = express.Router()

router.post('/signup', signUp);

router.post('/signin', signIn);

router.get('/signout', signOut);

module.exports = {
    routes: router
}