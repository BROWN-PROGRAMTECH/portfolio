const mongoose = require('mongoose')

const experienceSchema = mongoose.Schema({
    title:{
        type: String,
        required: [true, 'add a title to the experience']
    },
      skills:[{
        name: String,
        level: String
      }], 
      description:{
        type: String,
        required: [true, 'add a description to the experience']
      },
}, 
{
    timestamp:true
})

const Experience = mongoose.model('Experience',experienceSchema);
module.exports = Experience;