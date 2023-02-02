
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

    demoLink : {
        type : String,
        require : [true, 'please enter a demo link']
    },

    githubLink : {
        type : String,
        require : [true, 'please enter a github link']
    },
},
{
        timestamp:true
}

)