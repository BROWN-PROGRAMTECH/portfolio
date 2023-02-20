
const asyncHandler = require('express-async-handler');
const Project = require('../models/projectModel');
const cloudinary = require('../utils/cloudinary');
//const {fileSizeFormatter} = require('../utils/fileUpload');

//create a new project
const createProject = asyncHandler(async(req, res) => {
    const {title, description,  demo_link, github_link, image} = req.body;
    //const file = req.files.image
    

        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "Project Image",
                resource_type: "image",
              });
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

    //match project to user
    if(project.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('Not authorized')
    }

    res.status(200).json(project)
});

//delete project
const deleteProject = asyncHandler(async(req, res) => {
    const project = await project.findById(req.params.id);

    if(!project){
        res.status(404)
        throw new Error('Project not found')
    }

    if(project.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('Not authorized')
    }

    await project.remove();
    res.status(200).json({message: 'Project deleted successfully'})
})

//update project

const updateProject = asyncHandler(async (req, res) => {
    //destructuring of the data coming from the client for modification
    const {title, description, image, demo_link, github_link} = req.body;
    const {id} = req.params; //Needed parameter for the update

    const project = await project.findById(id)

    if(!project){
        res.status(404)
        throw new Error('project not found')
    }

    if(project.user.toString !== req.user.id){
        res.status(401)
        throw new Error('not authorized')
    }

    //Handle image uploads

    let fileData = {}
    let fileUpload
    try {
        fileUpload = await cloudinary.uploader.uploadFile(req.file.path, {
            filePath: 'project images',
            resource_type: 'image',
        })
    } catch (error) {
        res.status(500)
        throw new Error('image not uploaded')
    }

  

    const updateProject = await project.fineByIdAndUpdate(
         {_id : id},
         {
        title,
        description,
        image: Object.keys.length(fileData) === 0 ? project.image : fileData,
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