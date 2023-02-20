const express = require('express')
const router = express.Router();
const { 
        createProject, 
        allProjects, 
        oneProject, 
        updateProject, 
        deleteProject } = require('../controllers/projectController')
const protect = require('../middlewares/authMiddleware')
const  upload  = require("../utils/fileUpload");


router.post('/newProject', protect, upload.single('image'), createProject)
router.get('/projects', protect, allProjects)
router.get('/project/:id', protect, oneProject)
router.patch('/project/:id', protect, upload.single('image'), updateProject)
router.delete('/project/id', protect, deleteProject)

module.exports = router