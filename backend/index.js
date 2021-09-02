const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const pinRoute = require("./routes/pins");
const paymentRoute = require("./routes/payment");
const cors = require("cors")

dotenv.config();

app.use(express.json());




app.use(
    function (req,res, next){
        res.setHeader("Access-Control-Allow-Origin","*"); /// sites with port
        res.setHeader("Access-Control-Allow-Headers","X-Requested-With,content-type");
        res.setHeader("Access-Control-Allow-Methoods","GET,POST")
        // res.setHeader("Access-Control-Allow-Credentials","True")
        next();
      }
);



const corsOption={
    origin:"http://localhost:3000",
    optionsSuccessStatus:200
}


mongoose 
 .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,   })   
 .then(() => console.log("MongoDB connected!"))
 .catch(err => console.log(err));


app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);
app.use("/api/payment", paymentRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});

