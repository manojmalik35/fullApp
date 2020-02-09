const planModel = require("../models/planModel");

module.exports.checkInput = function (req, res, next) {
    if (Object.keys(req.body).length == 0) {
        res.json({
            data: "Please enter data in POST request"
        })
    } else
        next();//jo router me agla function h vo chal jayga
}

module.exports.queryAdder = function(req, res, next){
    req.query = {
        price : {
            gte : "30"
        },
        sort : "-rating",
        limit : "5"
    }
    next();
}


module.exports.getAllPlans = async function (req, res) {
    try {
        // console.log(req.query);
        //exclude special words like sort, page, limit, select

        let oquery = { ...req.query };//isse naya object ban jata h
        //jb req.query me change krenge to oquery me change ni hoga

        //exclude special words like select, sort, limit, page
        var excarr = ["select", "page", "sort", "limit"];
        for(var i = 0; i < excarr.length; i++)
            delete req.query[excarr[i]];

        
        let str = JSON.stringify(req.query);
        // console.log(str);

        //replace k andar pehla parameter regular expression h
        str = str.replace(/gt|gte|lt|lte/g, function (match) {
            return "$" + match;
        })
        const data = JSON.parse(str);

        //query build
        const plans = planModel.find(data);//Model.find() returns an instance of the query class
        //so now we can do chaining on that query to apply filtering eg model.find().find().select()
        if(oquery.sort){
            let sortString = oquery.sort.split("%").join(" ");
            plans.sort(sortString);
        }
        
        if(oquery.select){
            let selectString = oquery.select.split("%").join(" ");
            plans.select(selectString);
        }

        const page = Number(oquery.page) || 1;
        const limit = Number(oquery.limit) || 2;
        const toSkip = (page - 1) * limit;//starting index
        plans.skip(toSkip).limit(limit);

        const newPlans = await plans;
        res.json({
            newPlans
        });

    } catch (err) {
        console.log(err)
        res.json({ err})
    }
}

module.exports.createPlan = async function (req, res) {
    try {
        const plan = req.body;
        // console.log(plan);
        const newPlan = await planModel.create(plan);

        res.json({
            newPlan
        });
    }
    catch (err) {
        res.json({
            err
        })
    }
}

module.exports.updatePlan = async function (req, res) {
    try {
        var id = req.params.id;
        // console.log(req.files);
        // console.log(req.files.cover[0])
        // console.log(req.files.pictures)
        if(req.files.cover)
            req.body.cover = req.files.cover[0].filename;
        var photos = req.files.pictures.map((picture)=>{
            return picture.filename;
        })
        req.body.pictures = photos;
        var values = req.body;
        var updatedPlan = await planModel.findByIdAndUpdate(id, values, { new: true });
        res.json({
            success : "Plan updated",
            updatedPlan
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            err
        })
    }
}

//read a particular plan
module.exports.getPlan = async function (req, res) {
    try {
        var id = req.params.id;
        var ans = await planModel.findById(id);
        res.json({
            plan: ans
        })
    }
    catch (err) {
        res.json({
            err
        })
    }
}

module.exports.deletePlan = async function (req, res) {
    try {
        var id = req.params.id;
        var nplans = await planModel.findByIdAndDelete(id);

        res.json({
            nplans
        })
    }
    catch (err) {
        res.json({ err })
    }

}