const express = require("express");
const app = express();
const planRouter = require("./routers/planRouter")
const userRouter = require("./routers/userRouter")
const viewRouter = require("./routers/viewRouter");
const bookingRouter = require("./routers/bookingRouter");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { createBooking } = require("./controllers/bookingController");

app.post('/webhook-checkout', bodyParser.raw({ type: 'application/json' }), createBooking);
app.use(express.json());//used to convert buffer to json

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
// for static files

app.use(express.static("public"));
app.use("/plans", express.static("public"));//kyuki plans k route ek se zyada h id vale b h

app.set("view engine", "pug");
app.set("views", "views");

app.use("/", viewRouter);
app.use("/api/plans", planRouter);
app.use("/api/users", userRouter);
app.use("/api/booking", bookingRouter);

// app.use(function (req, res, next) {
//     console.log(req.cookies);
//     next();
// })
//users

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is listening at port 3000")
})