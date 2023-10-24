import axios from "axios"
const BACKEND_URL="http://localhost:9000"

export const singin= async(data)=>{
  console.log(data)
  try{
      
      return await axios.post(`${BACKEND_URL}/auth/login-user`,data)
  }
  catch(err){
        console.log("error in finding user for login by api")
  }
}

export const newuser= async(data)=>{
  console.log(data)
  try{
      return await axios.post(`${BACKEND_URL}/auth/singUp`,data)
  }
  catch(err){
        console.log("error is occur in adding user by api")
  }
}
export const UserVarification= async(data)=>{
  let {userId,uniqueString}=data;
  console.log(userId);

  try{
      return await axios.get(`${BACKEND_URL}/auth/verify/${userId}/${uniqueString}`);
  }
  catch(err){
        console.log("error in finding user vertifivation  by api")
  }
}
export const forgetPassword= async(data)=>{
  try{
      return await axios.post(`${BACKEND_URL}/auth/forgotpassword`,data)
  }
  catch(err){
        console.log("error in finding userData for login by api")
  }
}
export const resetPassword= async(data)=>{
  try{
      return await axios.post(`${BACKEND_URL}/auth/resetPassword`,data)
  }
  catch(err){
        console.log("error in finding userData for login by api")
  }
}
export const newAcdmicyear= async(data)=>{
   try{
        return await axios.post(`${BACKEND_URL}/newAcdemicYear`,data,{
         headers: {
           'Content-Type': 'multipart/form-data',
         },
       })
   }
   catch(err){
       console.log(err);
         console.log("error is occur in adding new acdemic year by api")
   }
}
export const newDseAcdmicyear= async(data)=>{
   try{
        return await axios.post(`${BACKEND_URL}/newDCEAcdemicYear`,data,{
         headers: {
           'Content-Type': 'multipart/form-data',
         },
       })
   }
   catch(err){
       console.log(err);
         console.log("error is occur in adding new acdemic year by api")
   }
}

export const studentByAcdmicYear= async(data)=>{
   try{
        return await axios.post(`${BACKEND_URL}/studentByAcdmicYear`,data)
   }
   catch(err){
       console.log(err);
         console.log("error is occur in adding new acdemic year by api")
   }
}


export const UpdateSem= async(data)=>{
   try{
        return await axios.post(`${BACKEND_URL}/semesterData`,data)
   }
   catch(err){
       console.log(err);
       console.log("error is occur in adding new acdemic year by api")
   }
}


export const DownlodExcel = async (data) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/generate-excel`,
      data,
      {
        responseType: 'blob', // Specify that the response is a binary blob
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header
        },
      }
    );

    // Create a Blob from the response data
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary <a> element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_marks.xlsx';

    // Trigger a click on the <a> element to start the download
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading Excel file:', error);
  }
};


export const downloadGetData =async(data)=>{
  console.log(data);
  return await axios.post(`${BACKEND_URL}/${data.document}`,data, {
    responseType: 'blob', // Set the response type to 'blob' to handle binary data (i.e., the PDF file)
  });

}