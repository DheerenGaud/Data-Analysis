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
    },
    InternalYear:{
      type: Date,
      required: true,
    },
    ExternalYear:{
      type: Date,
      required: true,
    }
  }],
  Kt_count: {
    type: Number,
    required: true,
    default: -1,
  },
});

module.exports = mongoose.model("Semester", semesterSchema);
