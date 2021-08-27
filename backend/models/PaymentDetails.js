const mongoose = require("mongoose");

const PaymentDetailsSchema = mongoose.Schema({
    reazorpayDetails:{
        orderId:String,
        paymentId:String,
        signature:String
    },
    success:Boolean,
});

module.exports= mongoose.model("PaymentDetail",PaymentDetailsSchema)
// const PaymentDetails= mongoose.model("PaymentDetail",PaymentDetailsSchema)