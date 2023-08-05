const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  RollNo: {
    type: String,
    required: true,
    unique: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Date_of_Addmision: {
    type: Date,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  Cgpi: {
    type: Number,
    required: true,
  },
  Ac_key: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "Ac_model",
  },
  Ac_model: {
    type: String,
    required: true,
    enum: ["AcademicYear", "dceAcademicYear"], 
  },
});
module.exports = mongoose.model("StudentData", studentSchema);
