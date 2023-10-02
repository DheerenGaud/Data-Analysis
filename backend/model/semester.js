const mongoose = require("mongoose");

const semesterSchema = mongoose.Schema({
  st_key: {
    type: Number,
    required: true,
  },
  Sem: [{
    Sgpi: {
      type: Number,
      required: true,
      default: -1,
    },
    Status: {
      type: Boolean,
      required: true,
      default: false,
    },
    InternalYear:{
      type: String,
      required: true,
    },
    ExternalYear:{
      type: String,
      required: true,
    },
    InternalKt:{
      type: Number,
      required: true,
      default: 0,
    },
    ExternalKt:{
      type: Number,
      required: true,
      default: 0,
    }
  }],
  Kt_count: {
    type: Number,
    required: true,
    default: -1,
  },
});

module.exports = mongoose.model("Semester", semesterSchema);
