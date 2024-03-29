const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  Roll_No: {
    type: Number,
    required: true,
    unique: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    default:"null",
    required: true,
  },
  Cgpi: {
    type: Number,
    default:0,
    required: true,
  },
  Ac_key:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "Ac_model",
  },
  ADC:{
    type:Boolean,
    default:false
  },
});
// Ac_model: {
//   type: String,
//   required: true,
//   enum: ["AcademicYear", "dceAcademicYear"], 
// },
module.exports = mongoose.model("StudentData", studentSchema);
