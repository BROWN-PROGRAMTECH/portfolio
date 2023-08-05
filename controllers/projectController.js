
const asyncHandler = require('express-async-handler');
const Project = require('../models/projectModel');
const cloudinary = require('../utils/cloudinary');
//const {fileSizeFormatter} = require('../utils/fileUpload');

//create a new project
const createProject = asyncHandler(async(req, res) => {
    const {title, description,  demo_link, github_link} = req.body;
    //const file = req.files.image
    if(!title ||!description ||!demo_link || !github_link){
        res.status(400)
        throw new Error('All the fields are required!')
    }

    //check for existing project
    const existingProject = await Project.findOne({title})
    if(existingProject){
        res.status(409)
        throw new Error('Project already exists')
    }

        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "Project Image",
                resource_type: "image",
              });
              console.log(result)
            const newProject = await Project.create({
                title,
                description,
                demo_link,
                github_link,
                image: req.secure_url, 
                cloudinary_id: result.public_id,
            });
            res.status(201).json(newProject)
        }
        catch (err){
            res.status(500);
            throw new Error('Invalid data');
        }
});

//Get all projects
const allProjects = asyncHandler(async(req, res) => {
    const projects = await Project.find().sort("-createdAt");
    if(projects.length ===0){
        res.status(404);
        throw new Error('No projects found');
    }else{
        res.status(201).json(projects)
    }
});

//Find one project
const oneProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    
    if(!project){
        res.status(404)
        throw new Error('project not found')
    }

    res.status(200).json(project)
});

//delete project
const deleteProject = asyncHandler(async(req, res) => {
    const project = await Project.findById(req.params.id);
    if(!project){
        res.status(404)
        throw new Error('Project not found')
    }

/*     if(project.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('Not authorized')
    } */

    await cloudinary.uploader.destroy(project.cloudinary_id)
    await project.remove();
    res.status(200).json({message: 'Project deleted successfully'})
})

//update project

const updateProject = asyncHandler(async (req, res) => {
    //destructuring of the data coming from the client for modification
    const {title, description, demo_link, github_link} = req.body;
    const {id} = req.params; //Needed parameter for the update

    const project = await Project.findById(id)

    if(!project){
        res.status(404)
        throw new Error('project not found')
    }

/*     if(project.user.toString !== req.user.id){
        res.status(401)
        throw new Error('not authorized')
    } */

    //Handle image uploads

    //delete the previous image from cloudinary
    await cloudinary.uploader.destroy(project.cloudinary_id)
    const result = await cloudinary.uploader.upload(req.file.path,{
        folder: 'project image',
        resource_type: 'image'
    })

    const updateProject = await Project.findByIdAndUpdate(
         {_id : id},
         {
        title,
        description,
        image:result.secure_url,
        cloudinary_id: result.cloudinary_id,
        github_link,
        demo_link
    },
    {
        new: true,
        runValidator: true,
    }
    )
    res.status(200).json(updateProject)
})

module.exports = {
    createProject, 
    oneProject,
    allProjects,
    deleteProject,
    updateProject
}