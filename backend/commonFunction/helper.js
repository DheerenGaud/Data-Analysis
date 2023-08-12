const AcademicYear = require('../model/acdemicYear');
const StudentData = require('../model/studentData');
const Semester = require('../model/semester');

exports.AddStudent = async (jsonData, Ac_key, Departname, End_Year, res) => {
  const errors = [];
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
          Sem: Array(8).fill({ Sgpi: -1, Status: false, InternalYear: new Date() ,ExternalYear: new Date() }),
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
exports.DeleteStudent = async (students, Ac_key, Departname) => {
  const errors = [];
  
  try {
    for (const data of students) {
      const { Roll_No } = data;
      
      try {
        const isStudentExist=await students.findOne(Roll_No)
        if(isStudentExist){
          await StudentData.deleteOne(Roll_No);
        }
        else{
          errors.push('this student is not exsist in this acdemic year ' +Roll_No);
        }
      } catch (error) {
        console.log('Error occurred while deleting  student');
        // await AcademicYear.deleteOne({ Departname: Departname, End_Year: End_Year });
      }
    }
    if (errors.length > 0) {
      throw new Error(errors.join('\n')); // Throw an error instead of sending a response
    }
  } catch (error) {
    console.log('Error occurred while Dleting student:', error);
    throw new Error('Error occurred while adding student');
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
exports.UpdateSem = async (students,index) => {
  const errors = [];
  console.log(students);
  try {
    for (const data of students) {
      const st_key = data.Roll_No
      // const studentSem = await StudentData.findOne(st_key);
      const studentSem = await Semester.findOne({st_key});
      const {Sgpi,Status,InternalYear,ExternalYear}=data;
      console.log(Sgpi);
      if (studentSem) {
        // console.log(studentSem);
        const ktVal= studentSem.Kt_count
        if(!Status){
           const x=  studentSem.Sem[index].Sgpi
           if(ktVal==-1){
            studentSem.Kt_count = 1;
           }
           else if(x===-1){
            console.log("hello");
            studentSem.Kt_count =  studentSem.Kt_count+1;
           }
        }
        else{
           if(ktVal!==-1){
            studentSem.Kt_count =  studentSem.Kt_count-1;
           }
        }
        
         studentSem.Sem[index].Sgpi = Sgpi;
         studentSem.Sem[index].Status = Status;
         studentSem.Sem[index].InternalYear = InternalYear;
         studentSem.Sem[index].ExternalYear = ExternalYear;
         await studentSem.save()
      }
      else{
        errors.push('this student is not exsist  ' +st_key);
      }
    }
    if (errors.length > 0) {
      throw new Error(errors.join('\n')); // Throw an error instead of sending a response
    }
  } catch (err) {
    console.log(err);
    throw new Error('Error occurred while checking unique students');
  }
};