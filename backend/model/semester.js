const mongoose = require("mongoose");

const semesterSchema = mongoose.Schema({
  st_key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentData",
    required: true,
  },
  Sem: [{
    Number: {
      type: String,
      required: true,
    },
    Sgpi: {
      type: Number,
      required: true,
      default:0.00,
    },
    Status: {
      type: Boolean,
      required: true,
      default:false,
    },
  }],
  Kt_count: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Semester", semesterSchema);
