const express =require("express");
const Router=express.Router();
const xlsx =require("xlsx")
const multer =require("multer")
const AcademicYear =require("../model/acdemicYear")
const StudentData=require("../model/studentData")
const {AddStudent,CheckUnqueStudent,DeleteStudent,UpdateSem}=require("../commonFunction/helper")
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

    const duplicates = await CheckUnqueStudent(jsonData);

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
    const duplicates = await CheckUnqueStudent(students);
    try {
         const existingAcademicYear = await AcademicYear.findOne({
            Departname: Departname,
            End_Year: End_Year,
          });
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
            await AddStudent(students, newAcademicYear._id, Departname, End_Year, res);
            return res.json({ status: "ok", data: "All student data entered successfully"});
          }
          else{
            await AddStudent(students, existingAcademicYear._id, Departname, End_Year, res);
            return res.json({ status: "ok", data: "Successfully Added New Student!!" });
          } 
    } catch (error) {
      console.log('error => ' + error);
      return res.status(500).json({ status: 'error', data: 'Internal server error.' });
    }
   
})

Router.post("/deleteStudent",async(req,res)=>{
  const {Departname,End_Year,students}=req.body;
  const duplicates = await CheckUnqueStudent(students);
  try {
        const existingAcademicYear = await AcademicYear.findOne({
          Departname: Departname,
          End_Year: End_Year,
        });
        if (duplicates.size === 0) {
          return res.json({
            status: 'error',
            data: 'No students Found  database',
            value: Array.from(duplicates),
          });
        }
        else{
        if (existingAcademicYear) {
            await DeleteStudent(students, existingAcademicYear._id, Departname);
          return res.json({ status: "ok", data: "All student deleted successfully"});
        }
        else{
          return res.json({ status: "error", data: "Acdemic Year is Not Exsit" });
        } 
        }
  } catch (error) {
    console.log('error => ' + error);
    return res.status(500).json({ status: 'error', data: 'Internal server error.' });
  }
})

Router.put("/semesterData",async(req,res)=>{
  const {Departname,End_Year,students,SemNo}=req.body;
  const duplicates = await CheckUnqueStudent(students);
  try {
        const existingAcademicYear = await AcademicYear.findOne({
          Departname: Departname,
          End_Year: End_Year,
        });

        if (duplicates.size === 0) {
          return res.json({
            status: 'error',
            data: 'No students Found  database',
            value: Array.from(duplicates),
          });
        }
        else{
        if (existingAcademicYear) {
           await UpdateSem(students,SemNo-1);
          return res.json({ status: "ok", data: "All student Semester updated successfully"});
        }
        else{
          return res.json({ status: "error", data: "Acdemic Year is Not Exsit" });
        } 
        }
  } catch (error) {
    console.log('error => ' + error);
    return res.status(500).json({ status: 'error', data: 'Internal server error.' });
  }
})
   
module.exports= Router