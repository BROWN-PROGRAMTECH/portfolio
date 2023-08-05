const mongoose = require('mongoose')

const serviceSchema = mongoose.Schema({
    title : {
        type: String,
        unique:[true, 'title is already exists']
    },
    description: {
        type: String,
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