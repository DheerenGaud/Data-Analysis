const express =require("express");
const Router=express.Router();
const xlsx =require("xlsx")
const fs = require('fs');
const ExcelJS = require("exceljs");
const multer =require("multer")

const AcademicYear =require("../model/acdemicYear")
const Semester =require("../model/semester")
const StudentData=require("../model/studentData")
const DceAcademicYear =require("../model/dseAcdmicyr")
const {AddStudent,CheckUnqueStudent,DeleteStudent,UpdateSem,FindAll,GetAllStudentData}=require("../commonFunction/helper")
const uplode =multer()

Router.get("",(req,res)=>{
    res.send("hello")
});

Router.post("/newAcdemicYear", uplode.single("file"), async (req, res) => {
  try {
    const { Departname, Start_Year, End_Year } = req.body;
    
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
        data :`These students Allready  in ${Departname} Departname of Acadmic Year - ${End_Year-12000} to ${End_Year}`,
        value: Array.from(duplicates),
      });
    }

    if (!existingAcademicYear) {
      const newAcademicYear = await AcademicYear.create({
        Departname,
        Start_Year,
        End_Year,
        No_of_student:jsonData.length,
      });
      await AddStudent(jsonData, newAcademicYear._id);
      return res.json({ status: "ok", data: "All student data entered successfully" });
    } else {
      await AddStudent(jsonData, existingAcademicYear._id);
      return res.json({ status: "ok", data: "Successfully Added New Student!!" });
    }
  } catch (error) {
    console.log('error => ' + error);
    return res.status(500).json({ status: 'error', data: 'Internal server error.' });
  }
});
Router.post("/newDCEAcdemicYear", uplode.single("file"), async (req, res) => {
  try {
    const { Departname, Start_Year, End_Year } = req.body;
    
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[2];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet, { range: 4 });

    const existingAcademicYear = await DceAcademicYear.findOne({
      Departname: Departname,
      End_Year: End_Year,
    });

    const duplicates = await CheckUnqueStudent(jsonData);

    if (duplicates.size !== 0) {
      return res.json({
        status: 'error',
        data :`These students Allready  in ${Departname} Departname of Acadmic Year - ${End_Year-12000} to ${End_Year}`,
        value: Array.from(duplicates),
      });
    }

    if (!existingAcademicYear) {
      const newAcademicYear = await DceAcademicYear.create({
        Departname,
        Start_Year,
        End_Year,
      });

      await AcademicYear.updateOne({Departname,End_Year},{No_of_dse:jsonData.length,dse_key:newAcademicYear._id})

      await AddStudent(jsonData, newAcademicYear._id);
      return res.json({ status: "ok", data: "All student data entered successfully" });
    } else {
      await AddStudent(jsonData, existingAcademicYear._id);
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
              data :`These students Allready  in ${Departname} Departname of Acadmic Year - ${End_Year-12000} to ${End_Year}`,
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
            await AddStudent(students, newAcademicYear._id);
            return res.json({ status: "ok", data: "All student data entered successfully"});
          }
          else{
            await AddStudent(students, existingAcademicYear._id);
            return res.json({ status: "ok", data: "Successfully Added New Student!!" });
          } 
    } catch (error) {
      console.log('error => ' + error);
      return res.status(500).json({ status: 'error', data: 'Internal server error.' });
    }
   
})

Router.delete("/deleteStudent",async(req,res)=>{
  const {Departname,End_Year,students}=req.body;
  const NotFound = await FindAll(students);
  try {

    if(NotFound.size!==0){
      return res.json({
        status: 'error',
        data :`These students are NotFound in ${Departname} Departname of Acadmic Year - ${End_Year-12000} to ${End_Year}`,
        value: Array.from(NotFound),
      });
     }
        const existingAcademicYear = await AcademicYear.findOne({
          Departname: Departname,
          End_Year: End_Year,
        });

       
        if (existingAcademicYear) {
            await DeleteStudent(students);
          return res.json({ status: "ok", data: "All student deleted successfully"});
        }
        else{
          return res.json({ status: "error", data: "Acdemic Year is Not Exsit" });
        } 
  } catch (error) {
    console.log('error => ' + error);
    return res.status(500).json({ status: 'error', data: 'Internal server error.' });
  }
})

Router.post("/semesterData",async(req,res)=>{
  const {Departname,End_Year,students,SemNo, InternalYear,ExternalYear,final_Revaluation}=req.body;
   console.log(req.body);
  const NotFound = await FindAll(students);

  try {

    if(NotFound.size!==0){
      return res.json({
        status: 'error',
        data :`These students are NotFound in ${Departname} Departname of Acadmic Year - ${End_Year-12000} to ${End_Year}`,
        value: Array.from(NotFound),
      });
     }
        const existingAcademicYear = await AcademicYear.findOne({
          Departname: Departname,
          End_Year: End_Year,
        });

        
        
        if (existingAcademicYear) {

          if (!existingAcademicYear.final_Revaluation && final_Revaluation) {
            try {
                await AcademicYear.updateOne(
                {
                  Departname: Departname,
                  End_Year: End_Year,
                },
                { final_Revaluation: final_Revaluation }
              );
          
            } catch (err) {
              console.error(err);
            }
          }
          
         if(existingAcademicYear.current_sem<SemNo){
          try {
            await AcademicYear.updateOne({
             Departname: Departname,
             End_Year: End_Year,
           },
           { current_sem: SemNo })
          } catch (error) {
            console.log(error);
          }
         } 

       

           await UpdateSem(students,SemNo-1,InternalYear,ExternalYear,existingAcademicYear.final_Revaluation,final_Revaluation,existingAcademicYear._id);
          return res.json({ status: "ok", data: "All student Semester updated successfully"});
        }
        else{
          return res.json({ status: "error", data: "Acdemic Year is Not Exsit" });
        } 
        
  } catch (error) {
    console.log('error => ' + error);
    return res.status(500).json({ status: 'error', data: 'Internal server error.' });
  }
})

// Router.post("/generate-excel", async(req, res) => {
//   const {Departname,End_Year}=req.body;
//   console.log(req.body)
//   try {
//     const existingAcademicYear = await AcademicYear.findOne({
//       Departname: Departname,
//       End_Year: End_Year,
//     });

//     const AllStudent = await StudentData.find({ Ac_key: existingAcademicYear._id });

//     const worksheetData = AllStudent.map((Student, index) => ({
//       S_no: index + 1,
//       Roll_No: Student.Roll_No,
//       Name: Student.Name,
//       Gender: Student.Gender,
//     }));
//     const months = [
//       "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//     ];

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Student Details");
//       // Merge cells for the first two custom header rows
//   worksheet.mergeCells("A1:Q1");
//   worksheet.mergeCells("A2:Q2");

//   // Set values for the custom header rows
//   worksheet.getCell("A1").value = "FR.C.RODRIGUES INSTITUTE OF TECHNOLOGY, VASHI.";
//   worksheet.getCell("A2").value = "COURSE : INFORMATION TECHNOLOGY (2020-2021)";

//   // Add an empty row for spacing
//   worksheet.addRow([]);


//     const headers = [
//       "ROLL NO",
//       "NAME",
//       "SEM1 IA/O/P",
//       "SEM1 THEORY",
//       "SEM2 IA/O/P",
//       "SEM2 THEORY",
//       "SEM3 IA/O/P",
//       "SEM3 THEORY",
//       "SEM4 IA/O/P",
//       "SEM4 THEORY",
//       "SEM5 IA/O/P",
//       "SEM5 THEORY",
//       "SEM6 IA/O/P",
//       "SEM6 THEORY",
//       "SEM7 IA/O/P",
//       "SEM7 THEORY",
//       "SEM8 IA/O/P",
//       "SEM8 THEORY",
//     ];

//     worksheet.addRow(headers);
    
//     // console.log(students)
//     // Add data rows for each student
//     for (const student of worksheetData) {
//                 const stude = await Semester.findOne({
//                  st_key: student.Roll_No,
//        });
    
//       const rowData = [
//         student.Roll_No,
//         student.Name
//       ];
    
      // stude.Sem.forEach(semester => {
      //   if (semester.Status === true) {
      //     rowData.push(semester.InternalYear); // Add internal year
      //     rowData.push(semester.ExternalYear); // Add external year
      //   } else {
      //     if(semester.InternalYear!==" "){
      //       rowData.push(semester.InternalYear);
      //     }
      //     else{
      //       rowData.push("Kt "+stude.Kt_count);
      //     }
      //     if(semester.ExternalYear!==" "){
      //       rowData.push(semester.ExternalYear);
      //     }
      //     else{
      //       rowData.push("Kt "+stude.Kt_count); // If status is not pass, leave cells empty
      //     }
      //   }
      // });


//       rowData.push(""); // Leave RESULT cell empty for now
    
//       worksheet.addRow(rowData);
//     }

//     // Save the workbook to a buffer
//     const excelFilename = 'student_marks.xlsx';
//     await workbook.xlsx.writeFile(excelFilename);
  
//     // Set response headers
//     res.setHeader('Content-Disposition', `attachment; filename=${excelFilename}`);
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
//     // Stream the saved file to the response
//     const fileStream = fs.createReadStream(excelFilename);
//     fileStream.pipe(res);
  
//     // Delete the local file after streaming it
//     fs.unlinkSync(excelFilename);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

Router.post("/generate-excel", async(req, res) => {
  const {Departname,End_Year}=req.body;
  console.log(req.body)
  try {
    const existingAcademicYear = await AcademicYear.findOne({
      Departname: Departname,
      End_Year: End_Year,
    });

    if (existingAcademicYear) {
   



      const AllStudent = await StudentData.find({ Ac_key: existingAcademicYear._id });
   
      const worksheetData = AllStudent.map((Student, index) => ({
        S_no: index + 1,
        Roll_No: Student.Roll_No,
        Name: Student.Name,
        Gender: Student.Gender,
      }));
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
   
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Student Details");
        // Merge cells for the first two custom header rows
    worksheet.mergeCells("A1:Q1");
    worksheet.mergeCells("A2:Q2");
   
    // Set values for the custom header rows
    worksheet.getCell("A1").value = "FR.C.RODRIGUES INSTITUTE OF TECHNOLOGY, VASHI.";
    worksheet.getCell("A2").value = "COURSE : INFORMATION TECHNOLOGY (2020-2021)";
   
    // Add an empty row for spacing
    worksheet.addRow([]);
   
   
      const headers = [
        "ROLL NO",
        "NAME",
        "SEM1 IA/O/P",
        "SEM1 THEORY",
        "SEM2 IA/O/P",
        "SEM2 THEORY",
        "SEM3 IA/O/P",
        "SEM3 THEORY",
        "SEM4 IA/O/P",
        "SEM4 THEORY",
        "SEM5 IA/O/P",
        "SEM5 THEORY",
        "SEM6 IA/O/P",
        "SEM6 THEORY",
        "SEM7 IA/O/P",
        "SEM7 THEORY",
        "SEM8 IA/O/P",
        "SEM8 THEORY",
        "RESULT"
      ];
   
      worksheet.addRow(headers);
      
      // console.log(students)
      // Add data rows for each student
      for (const student of worksheetData) {
                  const stude = await Semester.findOne({
                   st_key: student.Roll_No,
         });
      
        const rowData = [
          student.Roll_No,
          student.Name
        ];
      
        stude.Sem.forEach(semester => {
          if (semester.Status === true) {
            rowData.push(semester.InternalYear); // Add internal year
            rowData.push(semester.ExternalYear); // Add external year
          } else {
            if(semester.InternalYear!==" "){
              rowData.push(semester.InternalYear);
            }
            else{
              rowData.push("Kt "+stude.Kt_count);
            }
            if(semester.ExternalYear!==" "){
              rowData.push(semester.ExternalYear);
            }
            else{
              rowData.push("Kt "+stude.Kt_count); // If status is not pass, leave cells empty
            }
          }
        });
      
        // Add Kt_count and RESULT values
        rowData.push(stude.Kt_count);
        rowData.push(""); // Leave RESULT cell empty for now
      
        worksheet.addRow(rowData);
      }
   
      // Save the workbook to a buffer
      const excelBuffer = await workbook.xlsx.writeBuffer();
   
      // Set response headers
      res.setHeader("Content-Disposition", "attachment; filename=student_marks.xlsx");
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
   
      // Send the Excel buffer as the response
      res.send(excelBuffer);
   }
   else{
     return res.json({ status: "error", data: "Acdemic Year is Not Exsit" });
   } 



    // res.download("","student_marks.xlsx")
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});




Router.post("/studentByAcdmicYear",async(req,res)=>{
 
  const {Departname,End_Year,index}=req.body;
  try {
    const existingAcademicYear = await AcademicYear.findOne({
      Departname: Departname,
      End_Year: End_Year,
    });

    if (existingAcademicYear) {
     const data=  await GetAllStudentData(existingAcademicYear._id,index-1);
     return res.json({ status: "ok", data:data});
   }
   else{
     return res.json({ status: "error", data: "Acdemic Year is Not Exsit" });
   } 
        
  } catch (error) {
    console.log('error => ' + error);
    return res.status(500).json({ status: 'error', data: 'Internal server error.' });
  }
})

module.exports= Router