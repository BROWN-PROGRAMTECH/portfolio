const express = require('express');
const router = express.Router();
const {
    addTestimony, 
    testimonials,
    testimony,
    updateTestimony,
    deleteTestimony, 
} = require('../controllers/testimonialsController')


router.post('/newTestimony', addTestimony)
router.get('/testimonies', testimonials)
router.get('/testimony/:id', testimony)
router.patch('/updateTestimony/:id', updateTestimony)
router.delete('/deleteTestimony/:id', deleteTestimony) 

module.exports = router 