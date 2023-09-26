const mongoose = require("mongoose");

const UserSecham = mongoose.Schema({

  Fname: {
    type: String,
    required: true,
  },
  Lname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  Dob: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  varified: {
    type: Boolean,
    default:false,
  },
});
// Ac_model: {
//   type: String,
//   required: true,
//   enum: ["AcademicYear", "dceAcademicYear"], 
// },
module.exports = mongoose.model("User", UserSecham);
