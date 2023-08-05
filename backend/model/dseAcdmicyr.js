const mongoose = require("mongoose")

const dceAcademicYearSchema=mongoose.Schema({
    Departname: {
        type: String,
        required: true,
      },
      Start_Year: {
        type: Date,
        required: true,
      },
      End_Year: {
        type: Date,
        required: true,
      },
      No_of_student: {
        type: Number,
        required: true,
      },
})

module.exports=mongoose.model("dceAcademicYear",dceAcademicYearSchema)