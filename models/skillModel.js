
const mongoose = require('mongoose')

const skillsSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter a skill name'],
        unique: [true, 'this skill exists already']
    },
    level: {
        type: String,
        required: [true, 'eg: starter, junior, intermediate, expert']
    },
},
    {timestamp:true}
)
const Skills = mongoose.model('Skills', skillsSchema);
module.exports = Skills