const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const KEY = process.env.KEY;
const Email = require("../utilities/email")

module.exports.signup = async function (req, res) {
    try {
        // Steps
        // 1. Create user
        const user = await userModel.create(req.body);

        // 2. Create token
        const id = user["_id"];//payload
        const token = await jwt.sign({id}, KEY);

        // 3. Send the token
        res.cookie("jwt", token, {httpOnly : true})
        res.json({
            success : "Successfull login"
        })
    } catch (err) {
        res.json({ err })
    }
}

module.exports.isUserAuthorized = async function (req, res, next) {
    try {
        //1. Get the token
        const headers = req.headers;
        if ((headers && headers.authorization) || (req.cookies && req.cookies.jwt)) {
            const token = req.cookies.jwt || headers.authorization.split(" ")[1];
            // console.log(clientToken);

            //2. Verify the token
            var ans = await jwt.verify(token, KEY);// return type = string = _id
            //3. If verified, call next
            //4. find user
            // console.log(ans);
            // console.log("sfsdfjsdf");
            if(ans){
                const user = await userModel.findById(ans.id);
                req.user = user;
                next();
            }else
                next();
        }    else
            next();

    } catch (err) {
        console.log(err);
        res.json({ err })
    }
}

//Login
module.exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        const dbPassword = user.password;
        console.log(password);
        if (dbPassword == password) {
            const id = user["_id"];
            const token = await jwt.sign({id}, KEY);
            res.cookie("jwt", token, {httpOnly : true})
            res.json({
                success : "Successfull login"
            })
        } else {
            res.json({ data: "Something went wrong" })
        }
    }
    catch (err) {
        res.json({ err })
    }
}

module.exports.protectRoute = async function (req, res, next) {
    try {
        //1. Get the token
        const headers = req.headers;
        if ((headers && headers.authorization) || (req.cookies && req.cookies.jwt)) {
            const token = req.cookies.jwt || headers.authorization.split(" ")[1];
            // console.log(clientToken);

            //2. Verify the token
            var ans = await jwt.verify(token, KEY);// return type = string = _id
            //3. If verified, call next
            //4. find user
            // console.log(result);
            if(ans){
                const user = await userModel.findById(ans.id);
                // req.user = user;
                next();
            }else
                res.json({ data: "Your token is tampered" });
        } else
            res.json({ data: "Something went wrong" })

    } catch (err) {
        // console.log(err);
        res.json({ err })
    }
}

module.exports.isAuthorized = function (arr) {//for plan
    return function(req, res, next){
        const { role } = req.user;
        // console.log(role);
        if (arr.includes(role))
            next();
        else {
            res.json({
                data: "You are not authorized."
            })
        }
    }
}

module.exports.forgotPassword = async function (req, res) {
    try {
        if (req.body.email) {
            //1. Take email
            const { email } = req.body;

            //2. Find user
            let user = await userModel.findOne({ email });

            //3. Generate randomToken and store in DB
            const token = user.generateToken();
            // console.log(user);
            // await user.save();
            await user.save({ validateBeforeSave: false });

            //4. Send the token to client => email
            const options = {
                from: '"Fred Foo 👻" <foo@example.com>', // sender address yha pe sender to mailtrap.io hai isliye abhi daalne ki jrurt nhi h
                to: user.email, // list of receivers
                subject: "Reset Password", // Subject line
                text: token, // plain text body
                html: "<b>Your reset token is </b> " + `${token}` // html body
            }

            await Email(options);

            res.json({
                data: "Email has been sent."
            })
        }
        else
            res.json({ data: "Please enter the email" })

    } catch (err) {
        res.json({ err })
    }
}

module.exports.resetPassword = async function (req, res) {
    try {
        //1. Get token, password, confirmPassword
        if (req.body.token) {
            const token = req.body.token;

            let user = await userModel.findOne({ token });
            //2. Find user on basis of token
            if (user) {
                user.password = req.body.password;
                user.confirmPassword = req.body.confirmPassword;

                //3. update user
                await user.save();
                res.json({ data: "Password Updated" })
            } else {
                res.json({ data: "Your token is tampered." })
            }
        }
    } catch (err) {
        res.json({ err })
    }
}


module.exports.logOut = function(req, res){
    try{
        res.cookie("jwt","dfjdskfjsdkl",
        {
            httpOnly : true,
            expires : new Date(Date.now())
        })
        res.redirect("/");
    }catch(err){
        res.json({err})
    }
}