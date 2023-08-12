const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const Router1=require("./Router/router1")
const mongoose = require("mongoose");
// const connected = require("./db/db")

app = express();

app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST"] }));
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

const connected = async () => {
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/DataAnalsis", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          console.log("database is connected...");
        } catch (error) {
            console.log("some error in connecting database");
       }
  };
        
        connected();

app.use("/",Router1);


app.listen(9000,()=>{
  console.log(" server is listen on port 9000")
})


