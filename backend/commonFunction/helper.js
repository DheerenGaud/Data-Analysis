const AcademicYear = require('../model/acdemicYear');
const StudentData = require('../model/studentData');
const Semester = require('../model/semester');


exports.AddStudent = async (jsonData, Ac_key) => {
  const errors = [];
  // console.log(jsonData);
  try {
    for (const data of jsonData) {
      const { Name, Roll_No } = data;
      const newStudent = {
        Name: Name,
        Roll_No: Roll_No,
        Ac_key: Ac_key,
      };
      try {
        const semesterData = {
          st_key: Roll_No,
          Sem: Array(8).fill({ Sgpi: 0, Status: true,attempt:true,InternalYear:" ",ExternalYear: " "}),
          Kt_count: -1,
        };
        await StudentData.create(newStudent);
        await Semester.create(semesterData);
      } catch (error) {
        console.log('Error occurred while adding student');
        await StudentData.deleteMany({ Ac_key: Ac_key });
        // await AcademicYear.deleteOne({ Departname: Departname, End_Year: End_Year });
        errors.push('Error occurred while adding student ' + newStudent.Roll_No);
      }
    }
    if (errors.length > 0) {
       throw new Error(errors.join('\n')); // Throw an error instead of sending a response
    }
  } catch (error) {
    console.log('Error occurred while adding student:', error);
    throw new Error('Error occurred while adding student');
  }
};

exports.DeleteStudent = async (students) => {
  
  try {
    for (const data of students) {
      const { Roll_No } = data;
      console.log(Roll_No);
      try {
          await StudentData.deleteOne({Roll_No});
          await Semester.deleteOne({st_key:Roll_No});
      } catch (error) {
        throw new Error('Error occurred while deleting  student ');
      }
    }
  } catch (error) {
    console.log('Error occurred while Dleting student:', error);
    throw new Error('Error occurred while adding student');
  }
};



exports.GetAllStudentData = async (Ac_key, index) => {
  try {
    // Find all students with the given Ac_key
    const students = await StudentData.find({ Ac_key: Ac_key });

    const promises = students.map(async (item) => {
      try {
        // Find the semester data for the student
        const result = await Semester.findOne({ st_key: item.Roll_No });
        if (result) {
          // Check if the semester data and the index exist before accessing them
          if (result.Sem && result.Sem[index]) {
            return {
              Name: item.Name,
              ADC:item.ADC,
              Roll_No: item.Roll_No,
              Sgpi: result.Sem[index].Sgpi,
              Status: result.Sem[index].Status,
              InternalYear: result.Sem[index].InternalYear,
              ExternalYear: result.Sem[index].ExternalYear,
              InternalKt: result.Sem[index].InternalKt,
              ExternalKt: result.Sem[index].ExternalKt,
              attempt: result.Sem[index].attempt,
            };
          } else {
            console.error('Semester data or index not found for', item.Roll_No);
            return null;
          }
        } else {
          console.error('Semester data not found for', item.Roll_No);
          return null;
        }
      } catch (error) {
        console.error('Error occurred while finding semester:', error);
        return null; // Return null or a default value for failed fetches
      }
    });

    const simplifiedArray = await Promise.all(promises);
    // console.log(simplifiedArray);
    return simplifiedArray;
  } catch (error) {
    console.error('Error occurred while finding students:', error);
    throw new Error('Error occurred while adding students');
  }
};

exports.CheckUnqueStudent = async (jsonData) => {
  try {
    const RepetdRollNos = new Set();
    for (const data of jsonData) {
      const isAvailable = await StudentData.findOne({ Roll_No: data.Roll_No });
      if (isAvailable) {
        RepetdRollNos.add(data.Roll_No);
      }
    }
    // if (RepetdRollNos.size !== 0) {
    return RepetdRollNos
      // throw new Error('These students are already in the database'); // Throw an error instead of sending a response
    // }
  } catch (err) {
    console.log(err);
    throw new Error('Error occurred while checking unique students');
  }
};

exports.FindAll = async (jsonData) => {
  try {
    const NotFound = new Set();
    for (const data of jsonData) {
      const isAvailable = await StudentData.findOne({ Roll_No: data.Roll_No });
      if (!isAvailable) {
        NotFound.add(data.Roll_No);
      }
    }
    // if (RepetdRollNos.size !== 0) {
    return NotFound
      // throw new Error('These students are already in the database'); // Throw an error instead of sending a response
    // }
  } catch (err) {
    console.log(err);
    throw new Error('Error occurred while checking All students');
  }
};

exports.UpdateSem = async (students,semNo,InternalYear,ExternalYear,final_Eval_Back,final_eval_front,_id,current_sem,update_Kt) => {
  const errors = [];
  const index = semNo-1;
  const a=InternalYear;
  const b=ExternalYear;
  
  try {
    for (const data of students) {
      const st_key = data.Roll_No
      // console.log(data);
      // const studentSem = await StudentData.findOne(st_key);
      const studentSem = await Semester.findOne({st_key});
      const {Sgpi,Status}=data;
      InternalYear=a;
      ExternalYear=b;
      
      if(data.InternalYear!==" "){
        InternalYear=data.InternalYear;
      }
      if(data.ExternalYear!==" "){
        ExternalYear=data.ExternalYear;
      }

      if (studentSem) {
    
        const ktVal= studentSem.Kt_count
        const inteKt=data.InternalKt;
        const extrKt=data.ExternalKt;
        const NOkt= inteKt+extrKt;
        const bol=studentSem.Sem[index].Status
        const sum=studentSem.Sem[index].InternalKt+ studentSem.Sem[index].ExternalKt;
        const attempt=studentSem.Sem[index].attempt
        if(sum===-2){
             console.log(sum);
        }
        else{
        if(!Status){

            // console.log("attemp");
           if(attempt==true){
            studentSem.Sem[index].attempt=false
           }

           if(ktVal==-1){
            studentSem.Kt_count =NOkt;
            studentSem.Sem[index].InternalKt=inteKt;
            studentSem.Sem[index].ExternalKt=extrKt;
           }
           else if(sum>NOkt){
             studentSem.Kt_count=ktVal-( studentSem.Sem[index].ExternalKt+studentSem.Sem[index].InternalKt-NOkt);
             studentSem.Sem[index].InternalKt=inteKt;
             studentSem.Sem[index].ExternalKt=extrKt;
           }
           else{
             if(sum==0){
               studentSem.Kt_count =  studentSem.Kt_count+NOkt;
             }
             studentSem.Sem[index].InternalKt=inteKt;
             studentSem.Sem[index].ExternalKt=extrKt;
           }

           if(inteKt===0){
            studentSem.Sem[index].InternalYear=InternalYear;
           }
           else{
            studentSem.Sem[index].InternalYear=" ";
           }
           if(extrKt===0){
            studentSem.Sem[index].ExternalYear=ExternalYear;
           }
           else{
            studentSem.Sem[index].ExternalYear=" ";
           }
        }
        else{
          // evalution mai pass huaa hai
          if(final_eval_front&&!final_Eval_Back&&!attempt||!final_eval_front){
       
            studentSem.Sem[index].attempt=true;

            if(ktVal-sum===0){
              console.log("mathew");
              studentSem.Kt_count=-1;
            }
            else{
             studentSem.Kt_count =  studentSem.Kt_count-sum;
            }
            studentSem.Sem[index].InternalKt=0;
            studentSem.Sem[index].ExternalKt=0; 
          }
         else if(ktVal!==-1){  
            if(!bol){
              studentSem.Kt_count =  studentSem.Kt_count-sum; 
              studentSem.Sem[index].InternalKt=inteKt;
              studentSem.Sem[index].ExternalKt=extrKt; 
            }
          }             
            
          // if(studentSem.Sem[index].ExternalYear===" "){
            //   studentSem.Sem[index].InternalYear = InternalYear;
            // }
            // if(studentSem.Sem[index].ExternalYear===" "){
              //   studentSem.Sem[index].ExternalYear = ExternalYear; 
              // }

          if(!final_eval_front||update_Kt&&final_eval_front){
              studentSem.Sem[index].InternalYear = InternalYear;
              studentSem.Sem[index].ExternalYear = ExternalYear; 
          }
          
        }     
         studentSem.Sem[index].Status = Status;
         studentSem.Sem[index].Sgpi = Sgpi;
         await studentSem.save()   
        }
      }
      else{
        errors.push('this student is not exsist  ' +st_key);
      }

      
    }
    if (semNo-current_sem<=1&&!final_Eval_Back) {
      // console.log(semNo)
      GenerateReportFirstAttempt(_id,semNo,true,update_Kt);
    }
   if(update_Kt){
      // Update the With Kt sudunt data
      console.log("shkjefhdjkkjfhljgjh");
      GenerateReportFirstAttempt(_id,semNo,false,update_Kt);
    }
    
    if(final_eval_front&&!final_Eval_Back){
      try {
            GenerateReportFirstAttempt(_id,semNo,true,update_Kt);
            GenerateReportFirstAttempt(_id,semNo,false,update_Kt);
            await AcademicYear.updateOne(
            {
             _id:_id
            },
            {
              $set: {
                [`final_Revaluation.${semNo-1}`]: true,
              },
            },
          );
      
        } catch (err) {
          console.error(err);
        }
    }
    if (errors.length > 0) {
      throw new Error(errors.join('\n')); 
    }
  } catch (err) {
    console.log(err);
    throw new Error('Error occurred while checking unique students');
  }
};


// exports.UpdateADC=async(students,semNo,_id)=>{
//   try { 
//     let count=0;
//     for (const data of students) {
//       const Roll_No = data.Roll_No;
      
//       const ADC=data.ADC;
//       const student = await StudentData.findOne({Roll_No:Roll_No});
//       if(student.ADC!==ADC){
//         const semData= await Semester.findOne({st_key:Roll_No})
//         // console.log(semData);    
//         for (let index = semNo-1; index <8; index++) {
//           semData.Sem[index].ExternalKt=-1;
//           semData.Sem[index].InternalKt=-1;
//           semData.Sem[index].InternalYear="ADC";
//           semData.Sem[index].InternalKt="ADC";
//           semData.Sem[index].Status=false;
//           semData.Sem[index].attempt=false;
//         }
//         semData.save();
//         count+=1;
//         student.ADC=ADC
//         await student.save();
//       }
//     }
//     const acdemicYear= await AcademicYear.findOne(_id);
//     acdemicYear.No_of_ADC_Student+=count;
//     acdemicYear.No_of_student-=count;
//     await acdemicYear.save();

//   } catch (error) {
//     // console.log(error);
//     throw new Error('Error occurred while ADC Update');
//   }

// }
exports.UpdateADC = async (students, semNo, _id) => {
  try {
    let count = 0;
    for (const data of students) {
      const Roll_No = data.Roll_No;
      const ADC = data.ADC;
      const student = await StudentData.findOne({ Roll_No: Roll_No });

      if (student.ADC != ADC) {
        const semData = await Semester.findOne({ st_key: Roll_No });
        
        // Reset the values for Sem[index] to appropriate numeric values
        for (let index = semNo - 1; index < 8; index++) {
          semData.Sem[index].ExternalKt = -1;
          semData.Sem[index].InternalKt = -1;
          semData.Sem[index].InternalYear =" ADS"; 
          semData.Sem[index].ExternalYear =" ADS"; 
          semData.Sem[index].Status = false;
          semData.Sem[index].attempt = false;
        }
        semData.save();
        count += 1;
        
        student.ADC = ADC;
        await student.save();
      }
    }
    
    const academicYear = await AcademicYear.findOne({ _id });
    academicYear.No_of_ADC_Student += count;
    academicYear.No_of_student -= count;
    await academicYear.save();
  } catch (error) {
    // Handle the error
    console.error(error);
    throw new Error('Error occurred while ADC Update');
  }
};


const GenerateReportFirstAttempt = async (_id,semNo,fistAttemp,update_Kt) => {
  
  if(semNo%2!==0&&!update_Kt){
       return ;
  }
  const index=semNo/2;

  const existingAcademicYear = await AcademicYear.findOne({ _id });
  const dse_key = existingAcademicYear.dse_key;
  const branch_change_key = existingAcademicYear.branch_change_key;

  const student = await GetStudentData(_id, index,fistAttemp);
  const dseStudent = await GetStudentData(dse_key,index,fistAttemp);
  const branchChangeStudent = await GetStudentData(branch_change_key,index,fistAttemp);

  console.log("student");
  
    const updatedData = {
      pass_student: student,
      pass_student_dse: dseStudent,
      pass_branch_Change_stu:branchChangeStudent,
    };
    try {
      if(fistAttemp){
        const updatedAcademicYear = await AcademicYear.findOneAndUpdate(
          { _id: _id },
          {
            $set: {
              [`without_kt.${index-1}`]: updatedData,
            },
          },
          { new: true, useFindAndModify: false }
        );
        // console.log(updatedAcademicYear);
      }
      else{
        const updatedAcademicYear = await AcademicYear.findOneAndUpdate(
          { _id: _id },
          {
            $set: {
              [`with_kt.${index-1}`]: updatedData,
            },
          },
          { new: true, useFindAndModify: false }
        );
        // console.log(updatedAcademicYear);
      }
      
    } catch (error) {
      console.log(error);
    }
    

}

// year whit sem Analisis
// 1=2=>2-2=0,2-1=1
// 2=4=>4-2=2,4-1=3
// 3=6=>6-2=4,6-1=5
// 4=8=>8-2=6,8-1=7

const GetStudentData = async (_id, year,fistAttemp) => {
  let count = 0;
  const TotalSem=year*2;
  const start=TotalSem-2;
  const end=TotalSem-1;
  const students = await StudentData.find({ Ac_key: _id });


  await Promise.all(students.map(async (item) => {
    try {
      const result = await Semester.findOne({ st_key: item.Roll_No });
      if(fistAttemp){
        for (let i = start; i <=end; i=i+2) {
          if (result.Sem[i].attempt && result.Sem[i + 1].attempt) {
              count = count+ 1;
          }
        }
      }
      else{
        for (let i = start; i <=end; i=i+2) {
          if (result.Sem[i].Status && result.Sem[i + 1].Status) {
              count = count+ 1;
          }
        }
      }
    } catch (error) {
      console.error('Error occurred while finding semester:', error);
      return null;
    }
  }));
  return count;
}


