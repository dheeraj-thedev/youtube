require('dotenv').config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose=require("mongoose");
const PaymentDetails = require('../models/PaymentDetails');
const router = express.Router();
//orders



router.post("/orders", async(req,resp)=>{
    try {

        //         RAZORPAY_SECRET=P1l9xwWRZlvBIo731x6BlLco
        // RAZORPAY_KEY_ID=rzp_test_rf35C5bbIcONRx
        // MAke Razorpay s instance by passing your keys 
        const instance = new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_SECRET
        });
        /// later will put values from request after testing it 
        var options = {
            amount: 50000,  // amount in the smallest currency unit  {paisa}
            currency: "INR",
            receipt: "order_rcptid_11"
          };

        const order= await instance.orders.create(options, function(err, order) {
            console.log(order);
            if(! order) return resp.status(500).send("Some error occured try again");
            resp.json(order)
          });

             } catch (error) {
        resp.status(500).send(error);
    }
});

// bodyParser ?


router.post('/success', async (req,resp)=>{
    try {
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature
        }= req.body;

        // shaSum  == cryptographic puzzle that needd to be created in order to maintian security

        const shasum = crypto.createHmac("sha256","Bo24iY7SIYxAT0B8UefHMnEx");
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`)
        const digest = shasum.digest("hex");

        if(digest!==razorpaySignature)
        {
            const newPayment = PaymentDetails({
                //  orderId:orderCreationId+"-"+razorpayOrderId,
                // paymentId:razorpayPaymentId,
                // signature:razorpaySignature,
                reazorpayDetails:{
                    orderId:orderCreationId+"-"+razorpayOrderId,
                    paymentId:razorpayPaymentId,
                    signature:razorpaySignature
                },
                success:false,
            });

            await newPayment.save();
            return resp.status(400).json({mesg:'Transaction is not valid or secured '});
        }

            const newPayment = PaymentDetails({
                //  orderId:orderCreationId+"-"+razorpayOrderId,
                // paymentId:razorpayPaymentId,
                // signature:razorpaySignature,
                reazorpayDetails:{
                    orderId:orderCreationId+"-"+razorpayOrderId,
                    paymentId:razorpayPaymentId,
                    signature:razorpaySignature
                },
                success:true,
            });

            await newPayment.save();

            resp.json({
                msg:"Success",
                orderId:razorpayOrderId,
                paymentId:razorpayPaymentId,
            });
             

    } catch (error) {
        resp.status(500).send(error);
    }
});

module.exports = router;
