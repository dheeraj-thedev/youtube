import React from "react";
import axios from "axios";



function App(){
    
    let logo ="";
    function loadScript(src){
            return new Promise((resolved)=>{
                const script = document.createElement("script");
                script.src=src;
                script.onload=()=>{
                    resolved(true);
                }
                script.onerror=()=>{
                    resolved(false);
                }
                document.body.appendChild(script);
            })
    }


    async function displayRazorpay(){
        const res=await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res){
            alert("Failed to load razorpay sdk. you must be online to perform this transaction");
            return;
        }

        // create the order now by calling the backend 

        const result = await axios.post("http://localhost:8800/api/payment/orders");

        if(!result){
            alert("Server Error, Please check the connection you have  ");
            return;
        }

        const {amount,id:order_id,currency}=result.data;
        const options={
            key:"rzp_test_bc3YYLvn8W8GhG",
            amount : amount.toString(),
            currency:currency,
            name:"studnets corp",
            description:"Testing The razorpay",
            image:{logo},
            order_id:order_id,
            handler: async function(response){
                const data= {
                    orderCreationId: order_id,
                    razorpayPaymentId:response.razorpay_payment_id,
                    razorpayOrderId:response.razorpay_order_id,
                    razorpaySignature:response.razorpay_signature,
                };
                const result = await axios.post("http://localhost:8800/api/payment/success",data);
                alert(result.data.msg);
            },
            prefill:{
                    name: "DHeeraj Singh",
                    email:"Dheeraj@gmail.com",
                    contact:"9718910927",
            },
            notes:{
                address:"dheeraj singh residence address"
            },
            theme:{
                    color:"#61daff",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }


//
//

    return(
        <>
        <div className="App">
            <header className="App-header">
                <img src={logo}></img>
                <p>Buy this product Now</p>
                <button className="anchor-link" onClick={displayRazorpay}>
                    Pay 500 Rupya
                </button>
            </header>
            </div>
        </>
    );
}


export default App;