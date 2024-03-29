const express =require("express");
const Router=express.Router();
const xlsx =require("xlsx")
const fs = require('fs');
const ExcelJS = require("exceljs");
const multer =require("multer")
const { jsPDF } = require('jspdf');
const dayjs = require('dayjs');
require('jspdf-autotable');

const AcademicYear =require("../model/acdemicYear")
const Semester =require("../model/semester")
const StudentData=require("../model/studentData")
const DceAcademicYear =require("../model/dseAcdmicyr")
const BranchChangeAcademicY =require("../model/brranch_chnage")
const {AddStudent,CheckUnqueStudent,DeleteStudent,UpdateSem,FindAll,GetAllStudentData,UpdateADC}=require("../commonFunction/helper");
const acdemicYear = require("../model/acdemicYear");
const uplode =multer()


Router.get("",(req,res)=>{
    res.send("hello")
});

Router.post("/newAcdemicYear", uplode.single("file"), async (req, res) => {
  try {
    const { Departname, Start_Year, End_Year,No_of_tfws,No_of_j_k} = req.body;
     console.log(req.body);
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];// my class 
    // const sheetName = workbook.SheetNames[2]; // congraculation
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
    console.log(jsonData.length);

    if (!existingAcademicYear){
      const year = dayjs(End_Year,'MMMM YYYY').year();
      const newAcademicYear = await AcademicYear.create({
        Departname,
        Start_Year,
        End_Year,
        No_of_student:jsonData.length,
        current_sem:1,
        year:year,
        No_of_tfws,
        No_of_j_k,
      });
      await AddStudent(jsonData, newAcademicYear._id);
      return res.json({ status: "ok", data: "All student data entered successfully" });
    } else {
    
      existingAcademicYear.No_of_student += jsonData.length;
      await existingAcademicYear.save();
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
    const sheetName = workbook.SheetNames[0];
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
      const AcdmicYearExixt = await AcademicYear.findOne({
        Departname: Departname,
        End_Year: End_Year,
      });
      if(AcdmicYearExixt){
        const newAcademicYear = await DceAcademicYear.create({
          Departname,
          Start_Year,
          End_Year,
        });
        await AcademicYear.updateOne({Departname,End_Year},{No_of_dse:jsonData.length,dse_key:newAcademicYear._id})
  
        await AddStudent(jsonData, newAcademicYear._id);
        return res.json({ status: "ok", data: "All student data entered successfully" });
      }else{
        return res.json({ status: "error", data: "Acdemic Year is Not Exsit" });
      }
  
    } else {
      const academicYear = await AcademicYear.findOne({ Departname, End_Year });
      if (academicYear) {
        academicYear.No_of_dse += jsonData.length;
      }
      await academicYear.save();
      await AddStudent(jsonData, existingAcademicYear._id);
      return res.json({ status: "ok", data: "Successfully Added New Student!!" });
    }
  } catch (error) {
    console.log('error => ' + error);
    return res.status(500).json({ status: 'error', data: 'Internal server error.' });
  }
});

Router.post("/branchChange", uplode.single("file"), async (req, res) => {
  try {
    const { Departname, Start_Year, End_Year,Previous_Departname} = req.body;
    
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[2];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet, { range: 4 });

    const existingAcademicYear = await BranchChangeAcademicY.findOne({
      Departname: Departname,
      End_Year: End_Year,
    });

    const duplicates = await BranchChangeAcademicY(jsonData);

    if (duplicates.size !== 0) {
      return res.json({
        status: 'error',
        data :`These students Allready  in ${Departname} Departname of Acadmic Year - ${End_Year-12000} to ${End_Year}`,
        value: Array.from(duplicates),
      });
    }
     
    if (!existingAcademicYear) {
       
      const data=jsonData.map((stu)=>{
          return {Roll_No:stu.Roll_No,Departname:Previous_Departname}
      })

      const newAcademicYear = await BranchChangeAcademicY.create({
        Departname,
        Start_Year,
        End_Year,
        Previous_Departname:data
      });

      await AcademicYear.updateOne({Departname,End_Year},{No_of_Branch_Student:jsonData.length,branch_change_key:newAcademicYear._id})
      await AddStudent(jsonData, newAcademicYear._id);
      return res.json({ status: "ok", data: "All student data entered successfully" });
    } else {
      // const =
      const academicYear = await AcademicYear.findOne({ Departname, End_Year });
      const data=jsonData.map((stu)=>{
        return {Roll_No:stu.Roll_No,Departname:Previous_Departname}
    })
      existingAcademicYear.Previous_Departname=[...existingAcademicYear.Previous_Departname,...data]
      await existingAcademicYear.save();
      if (academicYear) {
        academicYear.No_of_Branch_Student += jsonData.length;
      }
      await academicYear.save();
      await AddStudent(jsonData, existingAcademicYear._id);
      return res.json({ status: "ok", data: "Successfully Added New Student!!" });
    }
  } catch (error) {
    console.log('error => ' + error);
    return res.status(500).json({ status: 'error', data: 'Internal server error.' });
  }
});

Router.post("/Individual/normal",async(req,res)=>{
    const {Departname,Start_Year,End_Year,students,No_of_tfws,No_of_j_k}=req.body;
    console.log(req.body);
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
            // const AcdmicYearExixt = await AcademicYear.findOne({
            //   Departname: Departname,
            //   End_Year: End_Year,
            // });
            // if(AcdmicYearExixt){
              const year = dayjs(End_Year,'MMMM YYYY').year();
              const newAcademicYear = await AcademicYear.create({
                Departname,
                Start_Year,
                End_Year,
                No_of_student:1,
                year,
                current_sem:1,
                No_of_tfws,
                No_of_j_k,
              });
              await AddStudent(students, newAcademicYear._id);
              return res.json({ status: "ok", data: "All student data entered successfully"});
            }
            // else{
            //   return res.json({ status: "error", data: "Acdemic Year is Not Exsit" });

            // }     
          // }
          else{
            existingAcademicYear.No_of_student += 1;
            await existingAcademicYear.save();
            await AddStudent(students, existingAcademicYear._id);
            return res.json({ status: "ok", data: "Successfully Added New Student!!" });
          } 
    } catch (error) {
      console.log('error => ' + error);
      return res.status(500).json({ status: 'error', data: 'Internal server error.' });
    }
   
})

Router.post("/Individual/dse",async(req,res)=>{
  const {Departname,Start_Year,End_Year,students}=req.body;
  const duplicates = await CheckUnqueStudent(students);
  try {
       const existingAcademicYear = await DceAcademicYear.findOne({
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
          const AcdmicYearExixt = await AcademicYear.findOne({
            Departname: Departname,
            End_Year: End_Year,
          });
          if(AcdmicYearExixt){
            const newAcademicYear = await DceAcademicYear.create({
              Departname,
              Start_Year,
              End_Year,
            });
            await AcademicYear.updateOne({Departname,End_Year},{No_of_dse:1,dse_key:newAcademicYear._id})
  
            await AddStudent(students, newAcademicYear._id);
            return res.json({ status: "ok", data: "All student data entered successfully"});
          }
          else{
            return res.json({ status: "error", data: "Acdemic Year is Not Exsit" });
          }     
        }
        else{
          const academicYear = await AcademicYear.findOne({ Departname, End_Year });
          if (academicYear) {
            academicYear.No_of_dse += 1;
          }
          await academicYear.save();
          await AddStudent(students, existingAcademicYear._id);
          return res.json({ status: "ok", data: "Successfully Added New Student!!" });
        } 
  } catch (error) {
    console.log('error => ' + error);
    return res.status(500).json({ status: 'error', data: 'Internal server error.' });
  }
 
})

Router.post("/Individual/branchChange",async(req,res)=>{
  const {Departname,Start_Year,End_Year,students,Previous_Departname,Previous_Roll_No}=req.body;

  if(Departname===Previous_Departname){
    return res.json({ status: "error", data: "Both Deparment are same" });
  }

  const duplicates = await CheckUnqueStudent(students);
  try {
       const existingAcademicYear = await BranchChangeAcademicY.findOne({
        Departname,
        End_Year,
        });
        if (duplicates.size !== 0) {
          return res.json({
            status: 'error',
            data :`These students Allready  in ${Departname} Departname of Acadmic Year - ${End_Year-12000} to ${End_Year}`,
            value: Array.from(duplicates),
          });
        } 
        

       const priStudent=await StudentData.findOne({Roll_No:Previous_Roll_No});

       if(priStudent){
        const PriAcdmicYear = await AcademicYear.findOne({
          Departname: Previous_Departname,
          End_Year: End_Year,
        });
        if(PriAcdmicYear&&PriAcdmicYear._id.toString()==priStudent.Ac_key.toString()){
               /// delete student from priveous brach
          
               const AcdmicYearExixt = await AcademicYear.findOne({
                 Departname: Departname,
                 End_Year: End_Year,
               });

               if(AcdmicYearExixt){
                const prevSemData= await Semester.findOne({st_key:Previous_Roll_No})
                prevSemData.st_key=students[0].Roll_No;
                PriAcdmicYear.No_of_student-=1; // remove
                priStudent.Roll_No=students[0].Roll_No;
                await prevSemData.save();
                await PriAcdmicYear.save();
                await priStudent.save();
               if (!existingAcademicYear) {
                  const data=[{Roll_No:students[0].Roll_No,Departname:Previous_Departname}]
                  const newAcademicYear = await BranchChangeAcademicY.create({
                    Departname,
                    Start_Year,
                    End_Year,
                    Previous_Departname:data
                  });
                  priStudent.Ac_key=newAcademicYear._id;
                  await AcademicYear.updateOne({Departname,End_Year},{No_of_Branch_Student:1,branch_change_key:newAcademicYear._id})// add 
                  await priStudent.save();
                  return res.json({ status: "ok", data: "All student data entered successfully"});
                }
                else{
                  priStudent.Ac_key=existingAcademicYear._id;
                  AcdmicYearExixt.No_of_Branch_Student += 1;
                  const data=[{Roll_No:students[0].Roll_No,Departname:Previous_Departname}]
                  existingAcademicYear.Previous_Departname=[...existingAcademicYear.Previous_Departname,...data]
                  await existingAcademicYear.save();
                  await AcdmicYearExixt.save();
                  await priStudent.save();
                  return res.json({ status: "ok", data: "Successfully Added New Student!!" });
                } 
              }
              else{
                return res.json({ status: "error", data: "Acdemic Year is Not Exsit" });
              }     
              }
        else{
          return res.json({ status: "error", data: "Previous Departname not contain this roll no "+Previous_Roll_No });
        }   
       }else{
        return res.json({ status: "error", data: "Roll no is not Exist "+Previous_Roll_No });
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
  const {Departname,End_Year,students,SemNo,InternalYear,ExternalYear,final_Revaluation,update_Kt,add_Adc}=req.body;
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
          if(existingAcademicYear.final_Revaluation[SemNo-1]&&!update_Kt){
             return res.json({ status: "ok", data: "Final Revaluation is Alredy Done !!!! If you Want to Update KtStudent then Select KtUpdate so Data can't update "});
           }
          else if(existingAcademicYear.current_sem!==SemNo&&!existingAcademicYear.final_Revaluation[existingAcademicYear.current_sem-1]){
            return res.json({ status: "error", data: `the Sem(${existingAcademicYear.current_sem}) is not Reevaluated`});
          }
          else if(existingAcademicYear.current_sem-SemNo<-1){
            return res.json({ status: "error", data: `First update sem(${existingAcademicYear.current_sem+1})`});
          }
         else if(existingAcademicYear.current_sem<SemNo){
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
          

           if(add_Adc){
             await UpdateADC(students,SemNo,existingAcademicYear._id)
           }
           else{
             await UpdateSem(students,SemNo,InternalYear,ExternalYear,existingAcademicYear.final_Revaluation[SemNo-1],final_Revaluation,existingAcademicYear._id,existingAcademicYear.current_sem,update_Kt);
           }
           var data=  await GetAllStudentData(existingAcademicYear._id,SemNo-1);
           if(existingAcademicYear.dse_key){
             const dseData= await GetAllStudentData(existingAcademicYear.dse_key,SemNo-1);
            data=[...data,...dseData];
           }
           if(existingAcademicYear.branch_change_key){
            const dseData= await GetAllStudentData(existingAcademicYear.branch_change_key,SemNo-1);
           data=[...data,...dseData];
          }
          return res.json({ status: "ok", data: "All student Semester updated successfully",value:data});
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
  // console.log(req.body)
  try {
    const existingAcademicYear = await AcademicYear.findOne({
      Departname: Departname,
      End_Year: End_Year,
    });

    if (existingAcademicYear) {
      let AllStudent = await StudentData.find({ Ac_key: existingAcademicYear._id });
      const AllStudentDSE = await StudentData.find({ Ac_key: existingAcademicYear.dse_key });
      const AllStudentBRAchChange = await StudentData.find({ Ac_key: existingAcademicYear.branch_change_key });
   
      AllStudent=[...AllStudent,...AllStudentDSE,...AllStudentBRAchChange]

      const worksheetData = AllStudent.map((Student, index) => ({
        S_no: index + 1,
        Roll_No: Student.Roll_No,
        Name: Student.Name,
        Gender: Student.Gender,
      }));
    
   
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
            // console.log(semester);
            if(semester.InternalYear===' '){
              rowData.push(semester.InternalKt);
            }
            else{
              rowData.push(semester.InternalYear);
            }

            if(semester.ExternalYear===' '){
              // console.log(semester.ExternalKt);
              rowData.push(semester.ExternalKt);
            }
            else{
              rowData.push(semester.ExternalYear);
            }
          }
        });
      
        // Add Kt_count and RESULT values
        // rowData.push(stude.Kt_count);
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
     var data=  await GetAllStudentData(existingAcademicYear._id,index-1);

     if(existingAcademicYear.dse_key){
      // console.log(existingAcademicYear.dse_key);
       const dseData= await GetAllStudentData(existingAcademicYear.dse_key,index-1);
      data=[...data,...dseData];
     }

     if(existingAcademicYear.branch_change_key){
      const branchChange= await GetAllStudentData(existingAcademicYear.branch_change_key,index-1);
      data=[...data,...branchChange];
     }
     const x={data:data,final_Revaluation:existingAcademicYear.final_Revaluation[index-1]}
     return res.json({ status: "ok", data:x,});    
   }
   else{
     return res.json({ status: "error", data: "Acdemic Year is Not Exsit" });
   } 
        
  } catch (error) {
    console.log('error => ' + error);
    return res.status(500).json({ status: 'error', data: 'Internal server error.' });
  }
})

Router.post('/generate-pdf-withoutKt', async (req, res) => {
  const { Departname, End_Year } = req.body;
    
  try {
    const academicYearsData = [];

    const previousYear = dayjs(End_Year,'MMMM YYYY').year();
    const academicYear = await AcademicYear.findOne({
      Departname,
      year : previousYear,
    }).exec();


    if (academicYear) {
      academicYearsData.push(academicYear);
    }

    const previousAcademicYears = await AcademicYear.find({
      Departname,
      year : { $lt: previousYear },
    })
      .sort({ End_Year: -1 })
      .limit(4)
      .exec();

    academicYearsData.push(...previousAcademicYears);

    if (!academicYear) {
      console.log("Academic year not found for the given department name and start year.");
      return res.status(404).json({ status: 'error', message: 'Academic year not found for the given department name and start year' });
    }

    const doc = new jsPDF();

    doc.setProperties({
      title: 'Academic Report',
      author: 'Your Name',
      subject: 'Academic Report',
      keywords: 'academic, report, data',
    });

    const tableData = [['Year of Entry', 'Admitted student (Normal Student + DSE student + Branch-Change)', 'I Year', 'II Year', 'III Year', 'IV Year']];

    academicYearsData.forEach((academicYear) => {
      const entryYear = `${academicYear.Start_Year}-${academicYear.End_Year}`;
      const withoutKtArray = academicYear.without_kt;

      const normalStudentCount = academicYear.No_of_student || 0;
      let dseStudent = academicYear.No_of_dse || 0;
      let BarchStu = academicYear.No_of_Branch_Student || 0;

      if (dseStudent === -1) {
        dseStudent = 0;
      }

      const yearRow = [entryYear];
      
      if(BarchStu===-1){
        yearRow.push(`${normalStudentCount} + ${dseStudent}`);
        withoutKtArray.forEach((withoutKt) => {
          yearRow.push(`${withoutKt.pass_student} + ${withoutKt.pass_student_dse}`);
        });
      }
      else{
        yearRow.push(`${normalStudentCount} + ${dseStudent} + ${BarchStu}`);
        withoutKtArray.forEach((withoutKt) => {
          yearRow.push(`${withoutKt.pass_student} + ${withoutKt.pass_student_dse} + ${withoutKt.pass_branch_Change_stu}`);
        });
      }


      tableData.push(yearRow);
    });

    const tableWidth = 190;
    const columnWidth = tableWidth / tableData[0].length;

    doc.autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: 20,
      margin: { top: 20, left: 10, right: 10 },
      styles: { overflow: 'linebreak' },
      columnStyles: { 0: { cellWidth: columnWidth } },
    });



    const filename = `${Departname}_${End_Year}_academic-report-withoutKT.pdf`;

    // Save or download the PDF
    const pdfBuffer = doc.output();
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  

  } catch (error) {
    console.log('error => ' + error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

Router.post('/generate-pdf-withKt', async (req, res) => {

  const { Departname, End_Year } = req.body;

  try {
    const academicYearsData = [];
    const previousYear = dayjs(End_Year, 'MMMM YYYY').year();
    const academicYear = await AcademicYear.findOne({
      Departname,
      year: previousYear,
    }).exec();

    // console.log(previousYear);
    // console.log(academicYear);

    if (academicYear) {
      academicYearsData.push(academicYear);
    }

    const previousAcademicYears = await AcademicYear.find({
      Departname,
      year: { $lt: previousYear },
    })
      .sort({ End_Year: -1 })
      .limit(4)
      .exec();

    academicYearsData.push(...previousAcademicYears);

    if (!academicYear) {
      console.log("Academic year not found for the given department name and start year.");
      return res.status(404).json({ status: 'error', message: 'Academic year not found for the given department name and start year' });
    }
  // const academicYears = await AcademicYear.find({});

  const doc = new jsPDF();

  doc.setProperties({
    title: 'Academic Report',
    author: 'Your Name',
    subject: 'Academic Report',
    keywords: 'academic, report, data',
  });

  const tableData = [['Year of Entry', 'Admitted student (Normal Student + DSE student + Branch-Change)', 'I Year', 'II Year', 'III Year', 'IV Year']];

  const academicYearData = [];

  academicYearsData.forEach((academicYear) => {
    const entryYear = `${academicYear.Start_Year}-${academicYear.End_Year}`;
    const withKt = academicYear.with_kt;
    const normalStudentCount = academicYear.No_of_student || 0; 
    let dsestudent = academicYear.No_of_dse || 0; 
    let BarchStu = academicYear.No_of_Branch_Student || 0;
  
    if (dsestudent === -1) {
      dsestudent = 0;
    }
    const yearRow = [entryYear];

    
    if(BarchStu===-1){
      yearRow.push(`${normalStudentCount} + ${dsestudent}`);
      withKt.forEach((withoutKt) => {
        yearRow.push(`${withoutKt.pass_student} + ${withoutKt.pass_student_dse}`);
      });
    }
    else{
      yearRow.push(`${normalStudentCount} + ${dsestudent} + ${BarchStu}`);
      withKt.forEach((withoutKt) => {
        yearRow.push(`${withoutKt.pass_student} + ${withoutKt.pass_student_dse} + ${withoutKt.pass_branch_Change_stu}`);
      });
    }

    tableData.push(yearRow);

    academicYearData.push({
      entryYear,
      withKt,
    });
  });

  const tableWidth = 190;
  const columnWidth = tableWidth / tableData[0].length;

  doc.autoTable({
    head: [tableData[0]],
    body: tableData.slice(1),
    startY: 20,
    margin: { top: 20, left: 10, right: 10 },
    styles: { overflow: 'linebreak' },
    columnStyles: { 0: { cellWidth: columnWidth } }, // Use cellWidth instead of columnWidth
  });
  
  // const filename = `${Departname}_${End_Year}_academic-report-withKT.pdf`;

  // Save or download the PDF
  // console.log(filename);
  // const pdfBuffer = doc.output();
  // res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  // res.setHeader('Content-Type', 'application/pdf');
  // res.send(pdfBuffer);
  const filename = `${Departname}_${End_Year}_academic-report-withKT.pdf`;

  // Save or download the PDF
  const pdfBuffer = doc.output();
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${filename}`);
  res.setHeader('Content-Type', 'application/pdf');
  res.send(pdfBuffer);
  
}catch(error) {
  console.log('error => ' + error);
  return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
}
});

module.exports= Router