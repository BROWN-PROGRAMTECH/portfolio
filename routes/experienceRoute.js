const express = require('express');

const { 
    experiences, 
    addExperience,
    experience,
    updateExperience,
    deleteExperience,

 } = require("../controllers/experienceController");

const router = express.Router();

router.get('/experiences', experiences)
router.post('/experience', addExperience)
router.get('/experience/:id', experience)
router.patch('/updateExperience/:id', updateExperience)
router.delete('/deleteExperience/:id', deleteExperience)

module.exports = router