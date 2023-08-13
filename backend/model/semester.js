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
<<<<<<< HEAD
      default:0.00,
=======
      default: -1,
>>>>>>> 07091f7145ba67f265ab3e8570992bbf196fbc93
    },
    Status: {
      type: Boolean,
      required: true,
      default:false,
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
