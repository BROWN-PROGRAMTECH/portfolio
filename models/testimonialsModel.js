
const mongoose = require('mongoose');

const testimonialsSchema = mongoose.Schema({
/* 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      }, */
    name:{
        type: String,
        required: [true, 'please add your name '],
    },
    image:{
        type: String,
        required: false,
        default:'default image'
    },
    testimony:{
        type: String,
        maxLength: 1000,
        require:[true, 'please enter your testimony'],
        default:'Please enter a testimony to let us know our limits'
    }

})
const Testimonials = mongoose.model('Testimonials', testimonialsSchema)
module.exports = Testimonials