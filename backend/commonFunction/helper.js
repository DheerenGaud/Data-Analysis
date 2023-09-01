const AcademicYear = require('../model/acdemicYear');
const StudentData = require('../model/studentData');
const Semester = require('../model/semester');


exports.AddStudent = async (jsonData, Ac_key) => {
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
          Sem: Array(8).fill({ Sgpi: -1, Status: false, InternalYear: new Date(),ExternalYear: new Date() }),
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

exports.GetAllStudentData = async (Ac_key) => {

  try {
      const students=await StudentData.find({Ac_key:Ac_key});
      const simplifiedArray = students.map(item => {
        return {
            Name: item.Name,
            Roll_No: item.Roll_No
        };
    });
      return simplifiedArray
  } catch (error) {
    console.log('Error occurred while finding student:', error);
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

exports.UpdateSem = async (students,index) => {
  const errors = [];
  // console.log(students);
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
        const NOkt= data.NoOfKts
       
        

        const bol=studentSem.Sem[index].Status
        if(!Status){
           if(ktVal==-1){
            studentSem.Kt_count =NOkt;
            studentSem.Sem[index].NoOfKts=NOkt;
           }
           else if(studentSem.Sem[index].NoOfKts>NOkt){
             studentSem.Kt_count=ktVal-(studentSem.Sem[index].NoOfKts-NOkt);
             studentSem.Sem[index].NoOfKts=NOkt;
           }
           else{
            studentSem.Sem[index].NoOfKts=NOkt;
            studentSem.Kt_count =  studentSem.Kt_count+NOkt;
           }
        }
        else{
           if(ktVal!==-1){  
            if(!bol){
              studentSem.Kt_count =  studentSem.Kt_count-studentSem.Sem[index].NoOfKts;
              studentSem.Sem[index].NoOfKts=0
            }
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


