const express =require("express");
const Router=express.Router();
const xlsx =require("xlsx")
const multer =require("multer")
const AcademicYear =require("../model/acdemicYear")
const StudentData=require("../model/studentData")

const uplode =multer()

Router.get("",(req,res)=>{
    res.send("hello")
});

Router.post("/newAcdemicYear",(req,res)=>{
   const {Departname,Start_Year,End_Year,No_of_student} =req.body

   try {
       AcademicYear.findOne({
        Departname,
        End_Year,
       })
       .then(result=>{
           if(!result){
              //creating new AcademicYear for depatment
              AcademicYear
              .create({Departname,Start_Year,End_Year,No_of_student})
              .then(()=>{
                res.json({ status: "ok" ,data:"Succesfully Created new deparment with this End-year" });
              })
              .catch(err=>{
                console.log("error => "+err);
                res.json({ status: "error" ,data:"error while Creating new deparment with this End-year" });
              }) 
           }
           else{
            //alred exist this deparment with this End-year
            res.json({ status: "error" ,data:"Deparment with this End-year Alredy exist !!!!" });
           }
       })
       .catch((err)=>{
           console.log("error => "+err);
           res.json({ status: "error" ,data:"error while finding  deparment with this End-year" });
       }); 
   } catch (error) {
    res.status(500).json({ error: "Internal server error." });
   }
});

Router.post("/newStudentByExcel",uplode.single("file"),(req,res)=>{

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    //  for (i = 0; i < sheetData.length; i++) {
    //     const { Name, RollNo } = sheetData[i];
    
    //     const newStudent = {
    //       Name: Name,
    //       RollNo: RollNo,
    //     };
    
    //     StudentData.create(newStudent)
    //       .then()
    //       .catch((error) => {
    //         console.log("Error occurred while adding student");
    //         res.json({ status: "error", data: "Error occurred while adding student" });
    //       });
    //   }
    // console.log(MOB)

    
    res.json({ status: "ok" ,data:sheetData });

 });
   

    
module.exports= Router
