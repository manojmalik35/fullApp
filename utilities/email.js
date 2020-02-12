const nodemailer = require("nodemailer");
const PASS = process.env.PASS;

// module.exports = async function (options) {
//     //1. Create transport (copy code from mailtrap.io)
//     try{
//     var transport = nodemailer.createTransport({
//         host: "smtp.mailtrap.io",
//         port: 2525,
//         auth: {
//             user: process.env.MAILTRAP_USERNAME,
//             pass: process.env.MAILTRAP_PASSWORD
//         }
//     });

//     //2. Options
//     //3. Send the mail
//     await transport.sendMail(options);
//     }catch(err){
//         console.log(err);
//     }
// }



module.exports = async function (options) {
    // 1.  create  setting
    try {
        var transport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: "malik.manoj35@gmail.com",
                pass: PASS
            }
        });
        // 2. Email options
        const emailOptions = {
            from: '"Manoj" <admin@jarvis.com>', // sender address
            to: options.to, // list of receivers
            subject: options.subject, // Subject line
            text: options.text,
            html: options.html // html body
        };
        // "<h1>Reset Token:</h1><p>token</p>"
        // 3. Send your mail
        await transport.sendMail(emailOptions);
    } catch (err) {
        throw new Error(err);
    }
};