const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const app = express();
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json())
app.use(cors());

var mysql = require("mysql");


//create connection with AWS relational database service
// var con = mysql.createConnection({
//     host:"database-fos.ccqunrf6tzpd.ap-southeast-2.rds.amazonaws.com",
//     user:"admin",
//     port:"3306",
//     password:"admin12345",
//     database:"fosDatabase"
// });

// con.connect(function(err) {
//     if (err) throw err;
//     else{
//         console.log("database connected")
//     }
// });

app.get("/", (req, res) =>{
    res.json({ message: "Connected to RDS"});
});

app.post("/payment", cors(), async (req, res) => {
    let {amount,id,item} = req.body
    try{
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "Food Ordering System FYP",
            payment_method: id,
            item: item,
            confirm: true
        })
        console.log("Payment", payment)
        res.json({
            message: "payment succesful",
            success: true
        })
    }catch (error){
        console.log("tempe3")
        res.json({
            message: "Payment failed",
            success: false
        })
    }
})

const RDS = process.env.PORT || 3306;
const PAYMENT = process.env.PORT || 4000;

app.listen(RDS, () => {
        console.log(`server is running on port ${RDS}`)
})

app.listen(PAYMENT, () => {
        console.log(`server is running on port ${PAYMENT}`)
})
