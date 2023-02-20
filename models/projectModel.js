const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    title:{
        type : String, 
        require : [true, 'please add a title']
    },

    description: {
        type: String,
        required: [true, "Please add a description"],
        trim: true,
      },

    image : {
        
        type : Object,
        default: {}
    },
    cloudinary_id:{
        type: String
    }, 

    demo_link : {
        type : String,
        require : [true, 'please add a demo link'] 
    },

    github_link : {
        type : String,
        require : [true, 'please add a github link']
    },
},
{
    timestamp:true 
}

)

const Project = mongoose.model('Project', projectSchema)
module.exports = Project