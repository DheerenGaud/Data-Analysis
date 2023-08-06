const express =require("express");
const Router=express.Router();
const xlsx =require("xlsx")
const multer =require("multer")
const ExcelJS = require('exceljs');
const AcademicYear =require("../model/acdemicYear")
const StudentData=require("../model/studentData")
const storage = multer.memoryStorage();
const uploade = multer({ storage: storage });

Router.get("",(req,res)=>{
    res.send("hello")
});

Router.post("/newAcdemicYear", uploade.single("file"), async (req, res) => { 
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
  for (const data of jsonData) {
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
    try {
      const newAcademicYear = await AcademicYear.create({
        Departname,
        Start_Year,
        End_Year,
        No_of_student,
      });

        for (const data of jsonData) {
          const { Name, Roll_No } = data;
          console.log(data)
          const newStudent = {
            Name: Name,
            Roll_No: Roll_No,
            Ac_key: newAcademicYear._id,
          };
          try {
            await StudentData.create(newStudent);
          //   console.log("Student added successfully");
          } catch (error) {
            console.log("Error occurred while adding student",error);
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
      console.log(jsonData);
      try {
          for (const data of jsonData) {
              const { Name, Roll_No } = data;
              const newStudent = {
                Name: Name,
                Roll_No: Roll_No,
                Ac_key: existingAcademicYear._id,
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
      } catch (error) {
          console.log("error => " + error);
          return res.json({ status: "error", data: "Error while saving students from excel sheet in Alredy Macked Accedmic year" });
      }
    return res.json({ status: "ok", data: " Successfully Added New Sutudent !!" });
  }
} catch (error) {
  return res.status(500).json({ error: "Internal server error." });
}
});
  
// Router.post('/upload', uploade.single('file'), async (req, res) => {
//     try {
//       const workbook = xlsx.read(req.file.buffer, { type: 'buffer'} );
//       const sheetName = workbook.SheetNames[2];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = xlsx.utils.sheet_to_json(sheet);

//         const students = [];

//         for (const row of jsonData) {
//             if (row['Sr.No.']) {
//                 console.log(row)
//                 const { 'Sr.No.': sr_no, 'Roll No.': roll_no, 'NAME': name, 'CGPI': cgpi, 'Result': result } = row;
//                 students.push({ sr_no, roll_no, name, cgpi, result });
//               }
//             }
//         console.log("mathew")
//         console.log(students)
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'An error occurred' });
//     }
//   });

Router.post('/semone',async (req, res) => {

      try {
        const { rollNo, semNumber, sgpi, status, ktCount } = req.body;

        // Find the student by RollNo
        const student = await StudentData.findOne({ RollNo: rollNo });

        if (!student) {
          return res.status(404).json({ error: "Student not found" });
        }

        // Create a new semester entry
        const newSemesterEntry = {
          Number: semNumber,
          Sgpi: sgpi,
          Status: status,
        };

        // Create a new Semester document using the Semester model
        const newSemester = new Semester({
          st_key: student._id, // Associate the semester with the student
          Sem: [newSemesterEntry], // Add the semester entry to the Sem array
          Kt_count: ktCount || 0,
        });

        await newSemester.save();

        res.status(201).json({ message: "Semester details submitted successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while submitting semester details" });
      }

  });

  


   
module.exports= Router
