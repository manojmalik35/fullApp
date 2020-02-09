const planModel = require("../models/planModel");

module.exports.getHomePage = async function(req, res){
    const user = req.user;
    console.log(user);
    const plans = await planModel.find();
    // console.log(plans);
    res.render("home.pug", {
        title : "Home Page",
        plans : plans,
        user : user
    });
}

module.exports.getPlansPage = async function(req, res){
    const user = req.user;
    const plans = await planModel.find();
    res.render("plans.pug",{plans : plans, user : user});
}

module.exports.getPlanDetailPage = async function(req, res){
    const user = req.user;
    const id = req.params.id;
    const plan = await planModel.findById(id);
    res.render("planDetail.pug", {plan, user});
}

module.exports.getLoginPage = async function(req, res){
    const user = req.user;
    res.render("login.pug", {user : user});
}

module.exports.getSignUpPage = async function(req, res){
    const user = req.user;
    res.render("signup.pug", {user : user});
}

module.exports.getProfilePage = async function(req, res){
    const user = req.user;
    if(user)
        res.render("profile.pug", {user : user})
    else
        res.redirect("/");
}

module.exports.getUpdatePage = async function(req, res){
    const user = req.user;
    res.render("updateUser.pug", {user});   
}