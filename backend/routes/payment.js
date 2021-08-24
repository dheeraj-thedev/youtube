require('dotenv').config();
const express = require("express");
const Razorpay = require("razorpay");

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
            amount: 50000,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
          };

        const order= await instance.orders.create(options, function(err, order) {
            console.log(order);
          });

          if(! order) return resp.status(500).send("Some error occured try again");

          resp.json(order)

    } catch (error) {
        resp.status(500).send(error);
    }
});