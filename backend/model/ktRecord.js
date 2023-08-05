const mongoose = require("mongoose")

const semesterSchema=mongoose.Schema({
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
        },
        Status: {
          type: Boolean,
          required: true,
        },
        RepetedAt: {
            type: Date,
            required: true,
          },
      }],
})

module.exports=mongoose.model("Smester",semesterSchema)