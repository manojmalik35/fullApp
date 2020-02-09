const mongoose = require("mongoose")

mongoose.connect(process.env.DB,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then((conn)=>{
    console.log("Booking DB connected");
    // console.log(conn);
})


const bookedPlanSchema = mongoose.Schema({
    planId : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : [true, "Please enter name of the plan"],
        unique : true
    },
    currentPrice : {
        type : Number,
        min : 40
    },
    bookedOn : {
        type : String,
        default : Date.now()
    }
})

const bookingSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    bookedPlans : {
        type : [bookedPlanSchema],//embedding
        required : true
    }
})

const bookingModel = mongoose.model("bookingModel",bookingSchema);

module.exports = bookingModel;