const express = require('express')
const { readAllStudyProgram, readDetailStudyProgram, addStudyProgram, updateDetailStudyProgram, deleteStudyProgram} = require("../controllers/studyProgramControllers")

const router = express.Router()

router.get('/read/all', readAllStudyProgram);

router.get('/read/:study_program_id', readDetailStudyProgram);

router.post('/create',addStudyProgram);

router.patch('/update/:study_program_id', updateDetailStudyProgram);

router.delete('/delete/:study_program_id', deleteStudyProgram);

module.exports = {
    routes: router
}