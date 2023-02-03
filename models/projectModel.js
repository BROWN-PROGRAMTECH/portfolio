const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    title:{
        type : String, 
        require : [true, 'please enter a title']
    },

    description : {
        type : String,
        require : [true, 'please enter a description']
    },

    image : {
        type : String,
        require : [true, 'please enter an image project']
    },

    demo_link : {
        type : String,
        require : [true, 'please enter a demo link']
    },

    github_link : {
        type : String,
        require : [true, 'please enter a github link']
    },
},
{
    timestamp:true
}

)

const Project = mongoose.model('Project', projectSchema)
module.exports = Project