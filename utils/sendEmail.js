const nodemailer = require('nodemailer'); 


const sendEmail = async(subject, message, sent_to, sent_from, reply_to) => {
    const transporter = nodemailer.createTransport({

        host: process.env.EMAIL_HOST,
        port:587,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls:{
            rejectUnauthorized: false,
            ciphers:'SSLv3',
        }


    })

    //option to sending message
    const options = {
        subject: subject,
        from: sent_from,
        to: sent_to,
        replyTo: reply_to,
        html: message
    }

    //send the message

    transporter.sendMail(options,function(err, info){
        if (err){
            console.log(err)
        }else{
            console.log(info)}
    } )

}

module.exports = sendEmail;
