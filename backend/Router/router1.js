const express =require("express");
const Router=express.Router();
const xlsx =require("xlsx")
const multer =require("multer")
const AcademicYear =require("../model/acdemicYear")
const StudentData=require("../model/studentData")
const Semester = require("../model/semester")
const {AddStudent,CheckUnqueStudent}=require("../commonFunction/helper")
const uplode =multer()

Router.get("",(req,res)=>{
    res.send("hello")
});

Router.post("/newAcdemicYear", uplode.single("file"), async (req, res) => {
  try {
    const { Departname, Start_Year, End_Year, No_of_student } = req.body;
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[2];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet, { range: 4 });

    const existingAcademicYear = await AcademicYear.findOne({
      Departname: Departname,
      End_Year: End_Year,
    });

    const duplicates = await CheckUnqueStudent(jsonData, Departname, End_Year);
    if (duplicates.size !== 0) {
      return res.json({
        status: 'error',
        data: 'These students are already in the database',
        value: Array.from(duplicates),
      });
    }

    if (!existingAcademicYear) {
      const newAcademicYear = await AcademicYear.create({
        Departname,
        Start_Year,
        End_Year,
        No_of_student,
      });
      await AddStudent(jsonData, newAcademicYear._id, Departname, End_Year, res);
      return res.json({ status: "ok", data: "All student data entered successfully" });
    } else {
      await AddStudent(jsonData, existingAcademicYear._id, Departname, End_Year, res);
      return res.json({ status: "ok", data: "Successfully Added New Student!!" });
    }
  } catch (error) {
    console.log('error => ' + error);
    return res.status(500).json({ status: 'error', data: 'Internal server error.' });
  }
});

Router.post("/Individual",async(req,res)=>{
  
    const {Departname,Start_Year,End_Year,No_of_student,students}=req.body;
    const RepetdRollNos = new Set();
     
    try {
        const existingAcademicYear = await AcademicYear.findOne({
            Departname: Departname,
            End_Year: End_Year,
          });
         for (const data of students) {
            try {
              const isAvailable = await StudentData.findOne({ Roll_No: data.Roll_No });
              if (isAvailable) {
                // console.log("is there");
                RepetdRollNos.add(data.Roll_No);
              }
            } catch (err) {
                console.log(err);
              //return res.json({ status: "error", data: "Error occurred while Finding student" });
              }
          }
          if(RepetdRollNos.size !== 0) {
            await AcademicYear.deleteOne({ Departname: Departname, End_Year: End_Year });
            return res.json({ status: "error", data: "These students are already in the database", value: [...RepetdRollNos] });
          }
          if (!existingAcademicYear) {
               
          }
          else{

          }
         
    } catch (error) {
        
    }
   
})

// POST route to submit student semester details
Router.post("/semone", async (req, res) => {
  try {
    const { st_key, semDetails, ktCount } = req.body;

    // Find the student by student ID
    const student = await StudentData.findOne({ Roll_No: st_key });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find the existing semester entry for the student
    const existingSemester = await Semester.findOne({ st_key: student._id });

    if (existingSemester) {
      // Update the existing semester details
      existingSemester.Sem = semDetails; // Update the entire array of semester details
      existingSemester.Kt_count = ktCount || 0;

      await existingSemester.save();
    } else {
      // Create a new semester entry if none exists
      const newSemester = new Semester({
        st_key: student._id, // Associate the semester with the student
        Sem: semDetails, // Set the entire array of semester details
        Kt_count: ktCount || 0,
      });

      // Save the new Semester document
      await newSemester.save();
    }

    res.status(201).json({ message: "Semester details updated/added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating/adding semester details" });
  }
});

Router.get("/semesters/:st_key", async (req, res) => {
  try {
    const studentId = req.params.st_key;

    // Find the student by student ID
    const student = await StudentData.findOne({ Roll_No: studentId });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find all semester entries associated with the student
    const semesters = await Semester.find({ st_key: student._id });

    res.status(200).json({ semesters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching semester details" });
  }
});







   
module.exports= Router