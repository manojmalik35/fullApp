const nodemailer = require("nodemailer");

module.exports = async function (options) {
    //1. Create transport (copy code from mailtrap.io)
    try{
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD
        }
    });

    //2. Options
    //3. Send the mail
    await transport.sendMail(options);
    }catch(err){
        console.log(err);
    }
}