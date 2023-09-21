const express =require("express");
const Router=express.Router();

const User=require("../model/user");

Router.post("singUp",(req,res)=>{
    const {Name,SurName,Password,Dob,Email}=req.body;
         
})