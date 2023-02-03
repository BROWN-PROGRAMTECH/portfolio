const mongoose = require('mongoose')

const serviceSchema = mongoose.Schema({
    title : {
        type: String,
        required: [true, 'please enter the title']
    },
    description: {
        type: String,
        required: [true, 'please enter the description']
    },
    image : {
        type: String,
        required: false,
        default:'default image'
    }
},
{
    timestamp:true
})
const Service = mongoose.model('Service', serviceSchema)

module.exports = Service