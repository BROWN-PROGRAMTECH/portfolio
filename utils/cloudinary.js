const { moduleIds } = require('babel-core/lib/transformation/file/options/config')

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME, 
    api_key : process.env.CLOUD_API_KEY, 
    api_secrett : process.env.CLOUD_API_SECRET
})

module.exports = cloudinary