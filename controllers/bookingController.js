const planModel = require("../models/planModel");
const userModel = require("../models/userModel")
const bookingModel = require("../models/bookingModel")
const SK = process.env.SK;
const END_POINT_SECRET = process.env.END_POINT_SECRET;
const stripe = require('stripe')(SK);

module.exports.createCheckoutSession = async function (req, res) {

    try {

        //1. id => planModel.findbyid(id)
        //2. session => npm install stripe
        const id = req.params.id;
        const plan = await planModel.findById(id);
        const user = req.user;
        // const userId = user["_id"];


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email : user.email,
            line_items: [{
                name: plan.name,
                description: plan.description,
                amount: plan.price * 100,
                currency: 'inr',
                quantity: 1,
            }],
            success_url: `${req.protocol}://${req.get("host")}/me`,
            cancel_url: `${req.protocol}://${req.get("host")}/login`,
        });

        res.json({
            session
        })
    } catch (err) {
        console.log(err)
        res.json({ err })
    }

}

module.exports.createNewBooking = async function(userEmail, planName){

    const user = await userModel.findOne({email : userEmail});
    const plan = await planModel.findOne({name : planName});
    const planId = plan["_id"];
    const userId = user["_id"];

    const order = {
        userId : userId,
        bookedPlans : [
            {
                planId : planId,
                name : plan.name,
                currentPrice : plan.price
            }
        ]
    }

    if(user.userBookingsId == undefined){//New user

        const newOrder = await bookingModel.create(order);
        user.userBookingsId = newOrder["_id"];
        await user.save({validateBeforeSave : false});
        return res.json({
            success : "New booking added",
            newOrder
        })
    }else{//Previous user
        const newPlan = {
            planId : planId,
            name : plan.name,
            currentPrice : plan.price
        }
        const booking = await bookingModel.findById(user.userBookingsId);
        booking.bookedPlans.push(newPlan);
        const newBooking = await bookingModel.findByIdAndUpdate(booking["_id"],{
            bookedPlans : booking.bookedPlans
        },{new : true});  
        return res.json({
            success : "Bookings updated",
            newBooking
        })
    }
}

module.exports.createBooking = async function(req, res){
    const sig = req.headers['stripe-signature'];

    let event;
    const endpointSecret = END_POINT_SECRET;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        if(event.type == "payment_intent.succeeded"){
            const userEmail = event.data.object.customer_email;
            const planName = event.data.object.line_items[0].name;
            await createNewBooking(userEmail, planName);
            //payment complete
            res.json({received : true});
        }
    }
    catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }
}