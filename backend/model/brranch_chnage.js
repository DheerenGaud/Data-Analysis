const mongoose = require("mongoose")

const branchChangeSchema=mongoose.Schema({
    Departname: {
        type: String,
        required: true,
      },
      Start_Year: {
        type: String,
        required: true,
      },
      End_Year: {
        type: String,
        required: true,
      },
     Previous_Departname:[{
        Departname: String,
        Roll_No: Number,
     }]
})
module.exports=mongoose.model("branchChange",branchChangeSchema)