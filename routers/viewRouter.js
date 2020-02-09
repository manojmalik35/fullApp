const viewRouter = require("express").Router();
const {getHomePage, getPlansPage, getPlanDetailPage, getLoginPage, getSignUpPage, getProfilePage, getUpdatePage} = require("../controllers/viewController");
const {protectRoute, isUserAuthorized, logOut} = require("../controllers/authController")

viewRouter.use(isUserAuthorized);
viewRouter.route("").get(getHomePage);
viewRouter.route("/plans").get(protectRoute, getPlansPage);
viewRouter.route("/plans/:id").get(protectRoute, getPlanDetailPage);
viewRouter.route("/login").get(getLoginPage);
viewRouter.route("/signup").get(getSignUpPage);
viewRouter.route("/logout").get(logOut);
viewRouter.route("/me").get(protectRoute, getProfilePage);
viewRouter.route("/updateUser").get(getUpdatePage);
module.exports = viewRouter;
