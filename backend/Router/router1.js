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



Router.post("/newAcdemicYear", uplode.single("file"), async (req, res) => {
    
    try {
      const { Departname, Start_Year, End_Year, No_of_student } = req.body;
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[2];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet, { range: 4 });
      const RepetdRollNos = new Set();
      


    const existingAcademicYear = await AcademicYear.findOne({
      Departname: Departname,
      End_Year: End_Year,
    });



    if (!existingAcademicYear) {
   
      try {

        for (const data of jsonData) {
            try {
              const isAvailable = await StudentData.findOne({ Roll_No: data.Roll_No });
              if (isAvailable) {
                console.log("is there");
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
         
        const newAcademicYear = await AcademicYear.create({
          Departname,
          Start_Year,
          End_Year,
          No_of_student,
        });

          for (const data of jsonData) {
            const { Name, Roll_No } = data;
            const newStudent = {
              Name: Name,
              Roll_No: Roll_No,
              Ac_key: newAcademicYear._id,
            };
            try {
              await StudentData.create(newStudent);
            //   console.log("Student added successfully");
            } catch (error) {
              console.log("Error occurred while adding student");
              await StudentData.deleteMany({Ac_key:newAcademicYear._id})
              await AcademicYear.deleteOne({ Departname: Departname, End_Year: End_Year });
              return res.json({ status: "error", data: "Error occurred while adding student" });
            }
          }
          return res.json({ status: "ok", data: "All student data entered successfully" });

        // }

      } catch (error) {
        console.log("error => " + error);
        return res.json({ status: "error", data: "Error while saving students from excel sheet or crating new Acdmic year" });
      }
    } else {
      // Department with this End-year already exists
      return res.json({ status: "error", data: "Department with this End-year already exists!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
});

   
module.exports= Router
