const admin = require('firebase-admin')
const { getStorage } = require("firebase/storage")
const studyProgramsModel = require("../models/studyProgramsModel")
const credentials = require("../../key.json")

try {
    admin.initializeApp({
        credential: admin.credential.cert(credentials)
    })
} catch (error) {
    admin.app()
}

const db = admin.firestore()

const readAllStudyProgram = async (req, res) => {
    try {
        const studyProgramsRef = db.collection("study_programs")
        const response = await studyProgramsRef.get()
        let studyProgramsList = [];
        if(response.empty){
            res.status(400).send("No Data Available")
        } else {
            response.forEach(doc => {
                const studyPrograms = new studyProgramsModel(
                    doc.id,
                    doc.data().study_program_id,
                    doc.data().study_program_name,
                    doc.data().major_id
                )
                studyProgramsList.push(doc.data())
            })
            res.send(studyProgramsList)
        }
    } catch (e) {
        res.send(e)
    }
}

const readDetailStudyProgram = async (req, res) => {
    try {
        const studyProgramRef = db.collection("study_programs").doc(req.params.study_program_id)
        const response = await studyProgramRef.get()
        res.send(response.data())
    } catch (e) {
        res.send(e)
    }
}

const addStudyProgram = async (req, res) => {
    try{
        console.log(req.body)
        const id = req.body.study_program_id
        const studyProgramJson = {
            study_program_id : req.body.study_program_id,
            study_program_name : req.body.study_program_name,
            major_id : req.body.major_id
        }
        const response = await db.collection("study_programs").doc(id).set(studyProgramJson)
        res.send(response)
    } catch(e) {
        res.send(e)
    }
}

const updateDetailStudyProgram = async (req, res) => {
    try {
        const id = req.params.study_program_id
        console.log(id)
        const studyProgramRef = await db.collection("study_programs").doc(id)
        .update({
            study_program_id : req.body.study_program_id,
            study_program_name : req.body.study_program_name,
            major_id : req.body.major_id
        })
        res.send(studyProgramRef)
    } catch (e) {
        res.send(e)
    }
}

const deleteStudyProgram = async (req, res) => {
    try {
        const response = await db.collection("study_programs").doc(req.params.study_program_id).delete()
        res.send(response)
    } catch (e) {
        res.send(e)
    }
}

module.exports = {
    readAllStudyProgram,
    readDetailStudyProgram,
    addStudyProgram,
    updateDetailStudyProgram,
    deleteStudyProgram
}