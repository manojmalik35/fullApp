
const userModel = require("../models/userModel");

module.exports.updateUser = async function(req, res){

    try{
        const id = req.params.id;
        // console.log(req.body);
        // console.log(req.file);
        const photo = req.file.filename;
        req.body.photo = photo;
        const user = await userModel.findByIdAndUpdate(id, req.body, {new : true});
        // console.log(user);
        res.redirect("/me");
    }catch(err){
        res.json({err});
    }
}

