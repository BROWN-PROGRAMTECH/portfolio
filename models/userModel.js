const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'please add a name']
    },
    email:{
        type: String,
        required: [true, 'please add an email'], 
            unique:true, 
            trim:true, //to remove any spaces
            match:[
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please enter a valid email address'
            ]
    },
    password:{
        type: String,
        required: [true, 'please add a password'],
        MinLength:[8, "password must be at least 8 characters"],

    },
    photo:{
        type: String,
        required: [true, 'please add a photo'],
        default: 'default image',
    },
    phone:{
        type: String,
        default: '+237',
        required: [false]
    },
    bio:{
        type: String,
        MaxLength:[250, "bio should not be more than 250 characters"],
        default:'bio'
    },
},
{
    timestamp:true
});

//function to encrypt the password and modify any data in this schema model
//it is better to write this function here to avoid repeating the same portion of code 
//when we want to modify and attribute

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }

//password encryption each time there is an action on the password field
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(this.password, salt);
this.password = hashedPassword;
})

const User = mongoose.model('User', userSchema)
module.exports = User 