const asyncHandler = require('express-async-handler')
const Service = require('../models/serviceModel')


const addService = asyncHandler(async(req, res) => {
    const {title, description, image} = req.body;

    const service = await Service.create({
        title,
        description,
        image
    })

    if(service){
        const {title, description, image} = service
        res.status(200).json({
            title, description, image
        })
    } else{
        res.status(400)
        throw new Error('invalid date')
    }
})


module.exports = {
    addService,
}