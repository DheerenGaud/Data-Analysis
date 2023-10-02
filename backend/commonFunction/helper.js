const AcademicYear = require('../model/acdemicYear');
const StudentData = require('../model/studentData');
const Semester = require('../model/semester');


exports.AddStudent = async (jsonData, Ac_key) => {
  const errors = [];
  console.log(jsonData);
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
          Sem: Array(8).fill({ Sgpi: 0, Status: true, InternalYear:" ",ExternalYear: " "}),
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

exports.GetAllStudentData = async (Ac_key,index) => {

  try {
    const students = await StudentData.find({ Ac_key: Ac_key });
    const promises = students.map(async (item) => {
      try {
        const result = await Semester.findOne({ st_key: item.Roll_No });
        return {
          Name: item.Name,
          Roll_No: item.Roll_No,
          Sgpi: result.Sem[index].Sgpi,
          Status: result.Sem[index].Status,
          InternalYear: result.Sem[index].InternalYear,
          ExternalYear: result.Sem[index].ExternalYear,
          InternalKt: result.Sem[index].InternalKt,
          ExternalKt: result.Sem[index].ExternalKt,
        
        };
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

exports.UpdateSem = async (students,index,InternalYear,ExternalYear) => {
  const errors = [];

  const a=InternalYear;
  const b=ExternalYear;
  try {
    for (const data of students) {
      const st_key = data.Roll_No
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
        if(!Status){
           
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

           if(data.InternalYear!==" "){
            studentSem.Sem[index].InternalYear=InternalYear;
           }
           if(data.ExternalYear!==" "){
            studentSem.Sem[index].ExternalYear=ExternalYear;
           }
        }
        else{
           if(ktVal!==-1){  
            if(!bol){
              studentSem.Kt_count =  studentSem.Kt_count-sum;
              studentSem.Sem[index].InternalKt=inteKt;
              studentSem.Sem[index].ExternalKt=extrKt;
            }
          }             
            
          if(studentSem.Sem[index].ExternalYear===" "){
            studentSem.Sem[index].InternalYear = InternalYear;
          }
          if(studentSem.Sem[index].ExternalYear===" "){
            studentSem.Sem[index].ExternalYear = ExternalYear; 
          }
          
        }     
         studentSem.Sem[index].Status = Status;
         studentSem.Sem[index].Sgpi = Sgpi;
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


