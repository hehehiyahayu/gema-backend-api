const express = require('express')
const { readAllCategory,readCategoryByType, readDetailCategory, addCategory, updateDetailCategory, deleteCategory} = require("../controllers/categoriesControllers")

const router = express.Router()

router.get('/read/all', readAllCategory);
router.get('/read/all/:id', readCategoryByType);

router.get('/read/:category_id', readDetailCategory);

router.post('/create',addCategory);

router.patch('/update/:category_id', updateDetailCategory);

router.delete('/delete/:category_id', deleteCategory);

module.exports = {
    routes: router
}