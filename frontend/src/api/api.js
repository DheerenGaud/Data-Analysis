import axios from "axios"
const BACKEND_URL="http://localhost:9000"

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

export const studentByAcdmicYear= async(data)=>{
   try{
        return await axios.post(`${BACKEND_URL}/studentByAcdmicYear`,data)
   }
   catch(err){
       console.log(err);
         console.log("error is occur in adding new acdemic year by api")
   }
}

export const ediAcdmicyear= async(data)=>{
   try{
        return await axios.post(`${BACKEND_URL}/semesterData`,data)
   }
   catch(err){
       console.log(err);
         console.log("error is occur in adding new acdemic year by api")
   }
}