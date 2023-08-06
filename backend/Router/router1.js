const express =require("express");
const Router=express.Router();
const xlsx =require("xlsx")
const multer =require("multer")
const AcademicYear =require("../model/acdemicYear")
const StudentData=require("../model/studentData")
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


// Router.post("/newAcdemicYear", uplode.single("file"), async (req, res) => { 
//     try {
//       const { Departname, Start_Year, End_Year, No_of_student } = req.body;
//       const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = xlsx.utils.sheet_to_json(sheet, { range: 4 });
//       // const RepetdRollNos = new Set();
      
//     const existingAcademicYear = await AcademicYear.findOne({
//       Departname: Departname,
//       End_Year: End_Year,
//     });

//     await CheckUnqueStudent(jsonData,Departname,End_Year,res);
//     // for (const data of jsonData) {
//     //     try {
//     //       const isAvailable = await StudentData.findOne({ Roll_No: data.Roll_No });
//     //       if (isAvailable) {
//     //         // console.log("is there");
//     //         RepetdRollNos.add(data.Roll_No);
//     //       }
//     //     } catch (err) {
//     //         console.log(err);
//     //       //return res.json({ status: "error", data: "Error occurred while Finding student" });
//     //       }
//     //   }
      // if(RepetdRollNos.size !== 0) {
      //   await AcademicYear.deleteOne({ Departname: Departname, End_Year: End_Year });
      //   return res.json({ status: "error", data: "These students are already in the database", value: [...RepetdRollNos] });
      // }

//     if (!existingAcademicYear) {
//       try {
//         const newAcademicYear = await AcademicYear.create({
//           Departname,
//           Start_Year,
//           End_Year,
//           No_of_student,
//         });

//         await AddStudent(jsonData,newAcademicYear._id,Departname,End_Year,res);
          
//           // for (const data of jsonData) {
//           //   const { Name, Roll_No } = data;
//           //   const newStudent = {
//           //     Name: Name,
//           //     Roll_No: Roll_No,
//           //     Ac_key: newAcademicYear._id,
//           //   };
//           //   try {
//           //     await StudentData.create(newStudent);
//           //   //   console.log("Student added successfully");
//           //   } catch (error) {
//           //     console.log("Error occurred while adding student");
//           //     await StudentData.deleteMany({Ac_key:newAcademicYear._id})
//           //     await AcademicYear.deleteOne({ Departname: Departname, End_Year: End_Year });
//           //     return res.json({ status: "error", data: "Error occurred while adding student" });
//           //   }
//           // }
//           return res.json({ status: "ok", data: "All student data entered successfully" });

//         // }

//       } catch (error) {
//         console.log("error => " + error);
//         return res.json({ status: "error", data: "Error while saving students from excel sheet or crating new Acdmic year" });
//       }
//     } else {
//         console.log(jsonData);
//         try {
//           await AddStudent(jsonData,existingAcademicYear._id,Departname,End_Year,res);
//             // for (const data of jsonData) {
//             //     const { Name, Roll_No } = data;
//             //     const newStudent = {
//             //       Name: Name,
//             //       Roll_No: Roll_No,
//             //       Ac_key: existingAcademicYear._id,
//             //     };
//             //     try {
//             //       await StudentData.create(newStudent);
//             //     //   console.log("Student added successfully");
//             //     } catch (error) {
//             //       console.log("Error occurred while adding student");
//             //       await StudentData.deleteMany({Ac_key:existingAcademicYear._id})
//             //       await AcademicYear.deleteOne({ Departname: Departname, End_Year: End_Year });
//             //       return res.json({ status: "error", data: "Error occurred while adding student" });
//             //     }
//             //   }
//         } catch (error) {
//             console.log("error => " + error);
//             return res.json({ status: "error", data: "Error while saving students from excel sheet in Alredy Macked Accedmic year" });
//         }
//       return res.json({ status: "ok", data: " Successfully Added New Sutudent !!" });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: "Internal server error." });
//   }
// });

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


   
module.exports= Router