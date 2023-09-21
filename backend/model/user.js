const mongoose = require("mongoose");

const UserSecham = mongoose.Schema({
 
  Name: {
    type: String,
    required: true,
  },
  Surname: {
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
  Email: {
    type: String,
    required: true,
  },
});
// Ac_model: {
//   type: String,
//   required: true,
//   enum: ["AcademicYear", "dceAcademicYear"], 
// },
module.exports = mongoose.model("User", UserSecham);
