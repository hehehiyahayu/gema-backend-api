const admin = require('firebase-admin')
const firebase = require('firebase/app')
const credentials = require("../../key.json")

const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth')

require('dotenv').config

// const firebaseConfig = {
//     apiKey: process.env.API_KEY,
//     authDomain: process.env.AUTH_DOMAIN,
//     databaseURL: process.env.DATABASE_URL,
//     projectId: process.env.PROJECT_ID,
//     storageBucket: process.env.NEW_DATABASE_URL,
//     messagingSenderId: process.env.MESSAGING_SENDER_ID,
//     appId: process.env.APP_ID,
//     measurementId: process.env.MEASUREMENT_ID
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
}

const db = admin.firestore()
const bucket = admin.storage().bucket()

const signUp = async (req, res) => {
    const { email, password } = req.body

    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
        res.status(200).send(`User ${userCredential.uid} registered successfully`)
    }).catch(error => {
        res.status(400).send(`Registration failed: ${error.message}`)
    })

}

const signIn = async (req, res) => {
    const { email, password } = req.body

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
    })

}

const signOut = async  (req, res) => {
    const auth = getAuth();

    await signOut().then(() => {
        res.status(200).send("Sign Out Successfully")
        console.log('Sign Out');
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        res.status(400).send(`Sign Out failed: ${errorMessage}`)
    })
}

module.exports = {
    signUp,
    signIn,
    signOut
}