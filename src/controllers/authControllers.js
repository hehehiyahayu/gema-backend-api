const admin = require('firebase-admin')
const firebase = require('firebase/app')
const credentials = require("../../key.json")

// const { initializeApp } = require('firebase/app')
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth')
// const { UserRecord } = require('firebase-admin/lib/auth/user-record')

// require('firebase/auth')

// const firebaseConfig = {
//     apiKey: process.env.API_KEY,
//     authDomain: process.env.AUTH_DOMAIN,
//     projectId: process.env.PROJECT_ID,
//     storageBucket: process.env.NEW_DATABASE_URL,
//     messagingSenderId: process.env.MESSAGING_SENDER_ID,
//     appId: process.env.APP_ID
// };

const firebaseConfig = {
    apiKey: "AIzaSyD9jXcNqK_lfSvsf1Vv3RN9_tJp17CLjek",
    authDomain: "geraimahasiswa-8d67b.firebaseapp.com",
    databaseURL: "https://geraimahasiswa-8d67b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "geraimahasiswa-8d67b",
    storageBucket: "geraimahasiswa-8d67b.appspot.com",
    messagingSenderId: "548929566086",
    appId: "1:548929566086:web:4fc78131a731fdff422807",
    measurementId: "G-05D9ZJRYZ3"
};

try{
    firebase.initializeApp(firebaseConfig)
}catch(e){
    firebase.app()
}

try {
    admin.initializeApp({
        credential: admin.credential.cert(credentials),
        storageBucket: 'gs://geraimahasiswa-8d67b.appspot.com'
    })

} catch (e) {
    admin.app()
    // firebase.app()
}

require('dotenv').config
const db = admin.firestore()
const bucket = admin.storage().bucket()

const signUp = async (req, res) => {
    const { email, password } = req.body
    
    // getAuth().createUser({
    //     email: email,
    //     password: password,
    // }).then(userRecord => {
    //     res.status(200).send(`User ${userRecord.uid} registered successfully`)
    // }).catch(error => {
    //     res.status(400).send(`Registration failed: ${error.message}`)
    // })

    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
        res.status(200).send(`User ${userCredential.uid} registered successfully`)
    }).catch(error => {
        res.status(400).send(`Registration failed: ${error.message}`)
    })

    // firebase.auth().createUserWithEmailAndPassword(email, password)
    //     .then(userCredential => {
    //         res.status(200).send('User registered successfully')
    //     })
    //     .catch(error => {
    //         res.status(400).send(`Registration failed: ${error.message}`)
    //     })
}

const signIn = async (req, res) => {
    const { email, password } = req.body

    // const auth = firebase.auth();

    // console.log()

    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => { 
        const user = userCredential.user;
        res.status(200).send(user)
        console.log('Logged In');
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        res.status(400).send(`Sign In failed: ${errorMessage}`)
    });

    // firebase.auth().signInWithEmailAndPassword(email, password)
    // .then((userCredential) => {
    //   var user = userCredential.user;
    //   console.log(user)
    // })
    // .catch((error) => {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   console.log(errorCode)
    // });

    // firebase.auth.Auth.signInWithEmailAndPassword(email, password)
    // .then((userCredential) => {
    //   // Signed in
    //   const user = userCredential.user;
    //   console.log(user.uid);
    // })
    // .catch((error) => {
    //   // Error signing in
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   console.log(errorMessage);
    // });

    // firebase.auth().getUserByEmail(email)
    //     .then(userRecord => {
    //         // console.log(userRecord)
    //         return firebase.auth().signInWithEmailAndPassword(userRecord.email, password)
    //     })
    //     .then(userCredential => {
    //         // console.log(userCredential)
    //         res.status(200).send('User logged in successfully')
    //     })
    //     .catch(error => {
    //         res.status(400).send(`Login failed: ${error.message}`)
    //     })

    // firebase.auth().signInWithEmailAndPassword(email, password)
    //     .then(userCredential => {
    //         res.status(200).send('User logged in successfully')
    //     })
    //     .catch(error => {
    //         res.status(400).send(`Login failed: ${error.message}`)
    //     })
}

module.exports = {
    signUp,
    signIn,
}