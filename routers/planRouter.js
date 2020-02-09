const express = require("express")
const planRouter = express.Router();
const { checkInput, getAllPlans, createPlan, updatePlan, getPlan, deletePlan, queryAdder } = require("../controllers/planController")
const { protectRoute, isAuthorized } = require("../controllers/authController");

const multer = require("multer");

var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + ".jpeg")
    },
    destination: function (req, file, cb) {
        cb(null, 'public');
    }
})

function fileFilter(req, file, cb) {
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted

    // To accept the file pass `true`, like so:
    if (file.mimetype.startsWith("image"))
        cb(null, true)
    else
        cb(null, false)
    // To reject this file pass `false`, like so:

    // You can always pass an error if something goes wrong:
    // cb(new Error('I don\'t have a clue!'))
}

var upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

planRouter.route("")
    .get(protectRoute, isAuthorized(["Admin"]), getAllPlans)
    .post(checkInput, createPlan);//pehle checkInput chalega or fr createPlan ise chaining kehte h

planRouter.route("/best-5-plans")
    .get(queryAdder, getAllPlans);

planRouter.post("/:id", upload.fields([
    {
        name: "cover", maxCount: 1
    },
    {
        name: "pictures", maxCount: 3
    }
]),updatePlan);

planRouter.route("/:id")
    .patch(updatePlan)
    .get(getPlan)
    .delete(protectRoute, isAuthorized(["Admin", "Restaurant Owner"]), deletePlan);

module.exports = planRouter;