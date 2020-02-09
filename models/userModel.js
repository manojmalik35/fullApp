const mongoose = require("mongoose")
const validator = require("validator")
const crypto = require("crypto");

mongoose.connect(process.env.DB,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then((conn)=>{
    console.log("User DB connected");
    // console.log(conn);
})

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please enter name of the user"]
    },
    password : {
        type : String,
        minlength : 8,
        required : [true, "Please enter your password"]
    },
    confirmPassword : {
        type : String,
        minlength : 8,
        validate : function(){
            return this.password == this.confirmPassword;//this refers to the current document jo user hum bana re h
        },
        required : [true, "Please re-enter your password"]//compulsory for validator to run
    },
    email : {
        type : String,
        unique : true,
        validate : validator.isEmail
    },
    phone : {
        type : Number
    },
    role : {
        type : String,
        enum : ["Admin", "User", "Restaraunt Owner", "Delivery boy"],
        default : "User"
    },
    photo : {
        type : String,
        default : "default.png"
    },
    token : String,
    userBookingsId : String
})

userSchema.pre("save",function(){
    //encrypt password

    //remove confirmPassword from database
    this.confirmPassword = undefined;
})

userSchema.method("generateToken", function(){
    //DB
    this.token = crypto.randomBytes(32).toString("hex");

    //to client
    return this.token;
})

//model
const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;