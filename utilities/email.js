const nodemailer = require("nodemailer");
const { MAILTRAP_USERNAME, MAILTRAP_PASSWORD } = require("../configs/config")

module.exports = async function (options) {
    //1. Create transport (copy code from mailtrap.io)
    try{
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: MAILTRAP_USERNAME,
            pass: MAILTRAP_PASSWORD
        }
    });

    //2. Options
    //3. Send the mail
    await transport.sendMail(options);
    }catch(err){
        console.log(err);
    }
}