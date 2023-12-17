const express = require('express')
const router = express.Router();
const { 
        createProject, 
        allProjects, 
        oneProject, 
        updateProject, 
        deleteProject } = require('../controllers/projectController')
// const protect = require('../middlewares/authMiddleware')
const  upload  = require("../utils/fileUpload");


router.post('/newProject',  upload.single('image'), createProject)
router.get('/projects', allProjects)
router.get('/project/:id',  oneProject)
router.patch('/project/:id', upload.single('image'), updateProject)
router.delete('/project/:id',  deleteProject)

module.exports = router
