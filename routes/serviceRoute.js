const express = require('express');
const router = express.Router();

const {
    addService, 
    services,
    service,
    updateService,
    deleteService,
} = require('../controllers/serviceController')


router.post('/newServices', addService)
router.get('/services', services)
router.get('/service/:id',service )
router.patch('/service/:id', updateService)
router.delete('/service/:id', deleteService)

module.exports = router