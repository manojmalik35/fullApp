const express = require("express");
const bookingRouter = express.Router();

const {createCheckoutSession, createNewBooking} = require("../controllers/bookingController");
const {isUserAuthorized} = require("../controllers/authController")
bookingRouter.use(isUserAuthorized);
bookingRouter.get("/:id", createCheckoutSession)
bookingRouter.post("/createNewBooking", createNewBooking);

module.exports = bookingRouter;