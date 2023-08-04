const mongoose = require("mongoose")

const studentSchema=mongoose.Schema({
    RollNo:String,
    Name:String,
    Date_of_Addmision:Date
})

module.exports=mongoose.model("StudentData",studentSchema)