const express = require("express");
const Experience = require("../models/experienceModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const addExperience = asyncHandler(async (req, res) => {
  const { title, description, skills } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("add experience");
  }

  const experience = await Experience.create({
    title,
    description,
    skills
  });

  if (experience) {
    res.status(200).json({ experience });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

//find all Experience

const experiences = asyncHandler(async (req, res) => {
  const experience = await Experience.find().sort("-createdAt");
  res.status(201).json({ experience });
});

//get a specific experience
const experience = asyncHandler(async (req, res) => {

  try {
    const experience = await Experience.findById(req.params.id);
    res.status(200).json(experience);
    
  } catch (error) {
    res.status(404);
    throw new Error("experience not found");
    
  }
});

//update experience

const updateExperience = asyncHandler(async (req, res) => {
  const id = req.params.id
 
  try {
    const experience = await Experience.findById(id);
    Object.assign(experience, req.body)
    experience.save()
    res.status(201).json(experience)
    
  } catch (error) {
    res.status(404);
    throw new Error("Experience not found");
  }

});

//delete experience

const deleteExperience = asyncHandler(async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
   await experience.deleteOne();
    res.status(200).json({
    message: "Experience deleted successfully",
  });

  } catch (error) {
    res.status(404);
    throw new Error("no experience found");
  }

});

module.exports = {
  addExperience,
  experiences,
  experience,
  updateExperience,
  deleteExperience,
};
