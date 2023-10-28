const mongoose = require("mongoose");

const academicSchema = mongoose.Schema({
  Departname: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
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
  },
  dse_key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "dceAcademicYear",
  },
  branch_change_key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "branchChange",
  },
  No_of_dse: {
    type:Number,
    default:-1
  },
  No_of_tfws: {
    type:Number,
    default:-1
  }, 
  No_of_j_k: {
    type:Number,
    default:-1
  },
 No_of_ADC_Student:{
  type:Number,
  default:0
 },
  No_of_Branch_Student: {
    type:Number,
    default:-1
  },
  current_sem:{
    type: Number,
    default: -1,
  },
  final_Revaluation:{
    type:[Boolean],
    default: [false, false, false, false, false, false, false, false]
  },
  without_kt:[{
       pass_student:Number,
       pass_student_dse:Number,
       pass_branch_Change_stu:Number
  }],
  with_kt:[{
    pass_student:Number,
    pass_student_dse:Number,
    pass_branch_Change_stu:Number
}]
});

module.exports = mongoose.model("AcademicYear", academicSchema);
