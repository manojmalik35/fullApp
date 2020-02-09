const mongoose = require("mongoose")

mongoose.connect(process.env.DB,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then((conn)=>{
    console.log("Plan DB connected");
    // console.log(conn);
})

const planSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please enter name of the plan"],
        unique : true
    },
    rating : {
        type : Number,
        default : 5
    },
    averageRating : {
        type : Number,
        default : 5
    },
    description : {
        type : String,
        default : "Good Plan"
    },
    delivery : {
        type : Boolean,
        default : false
    },
    meals : {
        type : Number
    },
    price : {
        type : Number,
        min : 40
    },
    duration : {
        type : Number,
        default : 30
    },
    preference : {
        type : String,
        enum : ["Vegan", "Non-Veg", "Vegetarian", "Eggitarian", "Organic"]
    },
    cover : {
       type : String
    },
    pictures : {
        type : [String]
    }
})

const planModel = mongoose.model("planModel",planSchema);

module.exports = planModel;