const express =require("express");
const Router=express.Router();
const xlsx =require("xlsx")

const ExcelJS = require("exceljs");
const multer =require("multer")

const AcademicYear =require("../model/acdemicYear")
const Semester =require("../model/semester")
const StudentData=require("../model/studentData")
const {AddStudent,CheckUnqueStudent,DeleteStudent,UpdateSem,FindAll,GetAllStudentData}=require("../commonFunction/helper")
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

<<<<<<< HEAD
    const duplicates = await CheckUnqueStudent(jsonData, Departname, End_Year);
    if (duplicates.size !== 0) {
      return res.json({
        status: 'error',
        data: 'These students are already in the database',
=======
    const duplicates = await CheckUnqueStudent(jsonData);

    if (duplicates.size !== 0) {
      return res.json({
        status: 'error',
        data :`These students Allready  in ${Departname} Departname of Acadmic Year - ${End_Year-12000} to ${End_Year}`,
>>>>>>> 07091f7145ba67f265ab3e8570992bbf196fbc93
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
<<<<<<< HEAD
      await AddStudent(jsonData, newAcademicYear._id, Departname, End_Year, res);
      return res.json({ status: "ok", data: "All student data entered successfully" });
    } else {
      await AddStudent(jsonData, existingAcademicYear._id, Departname, End_Year, res);
=======
      await AddStudent(jsonData, newAcademicYear._id);
      return res.json({ status: "ok", data: "All student data entered successfully" });
    } else {
      await AddStudent(jsonData, existingAcademicYear._id);
>>>>>>> 07091f7145ba67f265ab3e8570992bbf196fbc93
      return res.json({ status: "ok", data: "Successfully Added New Student!!" });
    }
  } catch (error) {
    console.log('error => ' + error);
    return res.status(500).json({ status: 'error', data: 'Internal server error.' });
  }
});
<<<<<<< HEAD

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





=======
Router.post("/newDCEAcdemicYear", uplode.single("file"), async (req, res) => {
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
  const {Departname,End_Year,students,SemNo, InternalYear,ExternalYear}=req.body;
  console.log(InternalYear);
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
           await UpdateSem(students,SemNo-1,InternalYear,ExternalYear);
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

Router.post("/generate-excel", async(req, res) => {
  const {Departname,End_Year}=req.body;
  console.log(req.body)
  try {
    const existingAcademicYear = await AcademicYear.findOne({
      Departname: Departname,
      End_Year: End_Year,
    });

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
          rowData.push(months[semester.InternalYear.getMonth()-1] + " "+ semester.InternalYear.getFullYear()); // Add internal year
          rowData.push(months[semester.ExternalYear.getMonth()-1] + " "+ semester.ExternalYear.getFullYear()); // Add external year
        } else {
          
          rowData.push("Kt "+stude.Kt_count);
          rowData.push("Kt "+stude.Kt_count); // If status is not pass, leave cells empty
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
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

Router.post("/studentByAcdmicYear",async(req,res)=>{
  console.log(req.body);
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