const mongoose = require("mongoose");

const academicSchema = mongoose.Schema({
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
  No_of_student: {
    type: Number,
    required: true,
  },
});
// dse_key: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "dceAcademicYear",
// },
module.exports = mongoose.model("AcademicYear", academicSchema);
