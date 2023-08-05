const express = require('express');
const asyncHandler = require('express-async-handler');
const Testimonials = require('../models/testimonialsModel');
//const TestimonialsModel = require('../models/testimonialsModel')


//add new testimony
const addTestimony = asyncHandler(async(req, res) => {
    const {name, image, testimony} = req.body;


    if(!name || !testimony){
        res.status(400)
        throw new Error ('please fill in all the required fields')
    }

    try {
    
        const message = await TestimonialsModel.create({
            //user: req.user.id,
            name,
            image,
            testimony
        })
        res.status(201).json(message)
    } catch (error) {
        res.status(400)
        throw new Error ('Invalid data!')
    }
})

//get all testimonials

const testimonials = asyncHandler(async(req, res) => {
    const testimonies  = await Testimonials.find()
    if(!testimonies){
        res.status(404)
        throw new Error('no testimonials found')
    }
    res.status(200).json(testimonies)
})

//get a particular user
const testimony = asyncHandler(async(req, res) => {
    const id = req.params.id
    try {
        const testimony = await Testimonials.findById(id)
        res.status(200).json(testimony)

    } catch (error) {
        res.status(404)
        throw new Error('Testimony not found')
    }
})

//update a testimony
const updateTestimony = asyncHandler(async(req, res) => {
    const id = req.params.id
    try {
        const updated = await Testimonials.findById(id)
        Object.assign(updated, req.body)
        updated.save()
        res.status(201).json(updated)
    } catch (error) {
        res.status(404)
        throw new Error('Testimony not found')
    }
})

//delete a particular testimony
const deleteTestimony = asyncHandler(async(req,res) => {
    const id = req.params.id
    try {
        const deleted = await Testimonials.findById(id)
        await deleted.delete()
        res.status(200).json({message: 'Testimonials deleted successfully'})
    } catch (error) {
        res.status(404)
        throw new Error('testimonial not found')
    }
})
module.exports = {
    addTestimony,
    testimonials,
    testimony,
    updateTestimony,
    deleteTestimony
}