import React, { useState ,useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import SemesterSelect from '../components/Selectsemester';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import dayjs from 'dayjs';
import { UpdateSem } from '../api/api';
import MonthYearSelect from '../components/Selectmonthyear';
import { Box, Grid, Button, Typography, Paper } from '@mui/material';




function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Students Name',
  },
  {
    id: 'rollno',
    numeric: true,
    disablePadding: false,
    label: 'Roll No.',
  },
 
  {
    id: 'Sgpi',
    numeric: true,
    disablePadding: false,
    label: 'Sgpi',
  },
  {
    id: 'Status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'Internal_Year',
    numeric: false,
    disablePadding: false,
    label: 'Internal_Year',
  },
  {
    id: 'External_Year',
    numeric: false,
    disablePadding: false,
    label: 'External_Year',
  },
  {
    id: 'Internal_Kt',
    numeric: false,
    disablePadding: false,
    label: 'Internal_Kt',
  },
  {
    id: 'External_Kt',
    numeric: false,
    disablePadding: false,
    label: 'External_Kt',
  },
];


const UpdateADC = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Students Name',
  },
  {
    id: 'rollno',
    numeric: true,
    disablePadding: false,
    label: 'Roll No.',
  },
  {
    id: 'ADC',
    numeric: true,
    disablePadding: false,
    label: 'ADC ',
  },
 
 
  
];



function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort,add_Adc} = props;

  return (
    <TableHead>
      <TableRow>
        {
          !add_Adc?
          (headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={'center'}
              width={'5vw'}
             
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={() => onRequestSort(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))):(
           UpdateADC.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={'center'}
              width={'5vw'}
             
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={() => onRequestSort(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))
          )
        }
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default function EnhancedTable(props) {
  const { allStudent,data,onChange,Final_Revaluation ,refresh} = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const kt_student = allStudent.filter((stu) => stu.Status === false);
  const [genderCount,setGnderCount]=useState({
    F:0,//female
    M:0,// male
    O:0,// other
    T:0,// total student
  })
  const [semData,setSemData]= useState({ 
    Departname:data.Departname,
    End_Year:data.End_Year,
    students:allStudent,
    SemNo:1,
    InternalYear:" ",
    ExternalYear:" ",
    final_Revaluation:Final_Revaluation,
    update_Kt:false,
    add_Adc:false
  })


  useEffect(()=>{
    // console.log(allStudent);

    semDataRef.current.final_Revaluation = Final_Revaluation;
    setSemData({ ...semDataRef.current });
  },[Final_Revaluation])

  const [students, setStudents] = useState([]);
  const [studentsADc, setStudentsADc] = useState([]);



  useEffect(() => {
    if (semData.update_Kt) {
      setStudents(kt_student);
     const x= CountGender(kt_student)
      setGnderCount({
        F: x.f,
        M: x.m,
        O:x.o,
        T: kt_student.length,
      });
    } else {
      setStudents(allStudent);
      const x= CountGender(allStudent)
      setGnderCount({
        F: x.f,
        M: x.m,
        O:x.o,
        T: allStudent.length,
      });
    }
    console.log(genderCount);
  }, [allStudent, semData.update_Kt]);
  
  const semDataRef = useRef(semData);
  

const CountGender=(array)=>{
  let f=0,m=0,o=0;
  if(semData.update_Kt){
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(element.Gender==="F"){
        f++;
      }
      else if(element.Gender==="M"){
       m++;
      }
      else{
       o++;
      }
    }
  }
  else{
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(element.Status){
        if(element.Gender==="F"){
          f++;
        }
        else if(element.Gender==="M"){
         m++;
        }
        else{
         o++;
        }
      }
    }
  }
  return {f,m,o};
}
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSemesterChange =async (e) => {
    semDataRef.current.SemNo = e.target.value;
      setSemData({ ...semDataRef.current });
      await onChange(e.target.value);
  };
  const onChangeintrY = (date) => {
    const formattedDate = dayjs(date).format('MMMM YYYY'); // Format the date as "Month Year"
    semDataRef.current.InternalYear = formattedDate;
    setSemData({ ...semDataRef.current });
   
  };
  const onChangeextrY = (date) => {
    const formattedDate = dayjs(date).format('MMMM YYYY'); // Format the date as "Month Year"
    semDataRef.current.ExternalYear = formattedDate;
    setSemData({ ...semDataRef.current });
  };

  const handleSgpiChange = (studentId, value,name) => {
    const numericValue = parseFloat(value);
  const updatedStudents = students.map((student) =>
    student.Roll_No === studentId ? { ...student, [name]: numericValue } : student
  );
  setStudents(updatedStudents);
  };

  const handleStatusChange = (studentId, value) => {
    const updatedStudents = students.map((student) =>
      student.Roll_No === studentId ? { ...student, Status: !value } : student
    );
    setStudents(updatedStudents);
  };

  const handleAdcChange = (studentId, value,i) => {
   
   console.log(studentId);
   console.log(value);


    const updatedStudents = students.map((student) =>
    student.Roll_No === studentId ? { ...student, ADC : !value } : student
    );
    setStudents(updatedStudents);
    setStudentsADc(updatedStudents);
  };

  ////
  const onchangeUpdateKt = (e) => {
    if(!semData.update_Kt){
      var x= window.confirm('Do you really want to Update Kt-Student');
    }
    if(x){
      semDataRef.current.update_Kt = !semData.update_Kt;
      semDataRef.current.students = kt_student;
      setSemData({ ...semDataRef.current });
    }
    else{
      semDataRef.current.update_Kt = e.target.value;
      semDataRef.current.students = allStudent;
      setSemData({ ...semDataRef.current });
    }
    // console.log(semDataRef.current);
  };
  const add_Adc_student = (e) => {
    if(!semData.add_Adc){
      var x= window.confirm('Do you really want to Add ADC');
    }
    if(x){
      semDataRef.current.add_Adc = !semData.add_Adc;
      setSemData({ ...semDataRef.current });
      setStudentsADc(allStudent)
    }
    else{
      semDataRef.current.add_Adc = e.target.value;
      setSemData({ ...semDataRef.current });
    }
    // console.log(semDataRef.current);
  };



  const onchangeFinalREval = (e) => {
    if(!semData.final_Revaluation){
      var x= window.confirm('Do you really want to do Final Reevaluation?');
    }
    if(x){
      // setStudents(allStudent);
      semDataRef.current.final_Revaluation = !semData.final_Revaluation;
      setSemData({ ...semDataRef.current });
      handleSaveData()
    }
    else{
      semDataRef.current.final_Revaluation = semData.final_Revaluation;
      setSemData({ ...semDataRef.current });
    }
  };
  
  const handlDateChangeIn = (studentId, date) => {
    const formattedDate = dayjs(date).format('MMMM YYYY'); // Format the date as "Month Year"
  const updatedStudents = students.map((student) =>
  student.Roll_No === studentId ? { ...student, InternalYear: formattedDate,InternalKt:0} : student
   );

setStudents(updatedStudents);
  };
  const handlDateChangeEx = (studentId, date) => {
    const formattedDate = dayjs(date).format('MMMM YYYY'); // Format the date as "Month Year"
  const updatedStudents = students.map((student) =>
  student.Roll_No === studentId ? { ...student, ExternalYear: formattedDate,ExternalKt:0} : student
   );

setStudents(updatedStudents);
  };
  
  const handleRefresh =()=>{
    if(!semData.update_Kt){
      setStudents(allStudent)
    }
    else{
      setStudents(kt_student)
 }
  }
  
  const handleSaveData = async () => {
    const x= window.confirm('Do you really want to change in the Data?');
  
    if(x){
      if(semData.add_Adc){
        semDataRef.current.students = studentsADc;
      }else{
        semDataRef.current.students = students;
      }
      setStudentsADc(studentsADc);
      // console.log(semDataRef.current);
       setSemData({ ...semDataRef.current });  
      try {
        const x = await UpdateSem(semDataRef.current);
        // console.log(x.data);
        if(x.data.status==="ok"){
           refresh();
           alert(x.data.data)
        }
        else{
          alert(x.data.data)
        }
      } catch (error) {
        console.log(error);
      }
    }

  };
  
  const visibleRows = React.useMemo(
    () =>
      stableSort(students, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, students]
  );


return (
  <>
    <Box sx={{ width: '100%', justifyContent: 'flex-start' }}>
      <Box sx={{ display: 'flex'}}>
       
          <SemesterSelect
            value={semData.SemNo}
            onChange={handleSemesterChange}
            intrY={semData.InternalYear}
            onChangeintrY={onChangeintrY}
            onchangeFinalREval={onchangeFinalREval}
            extrY={semData.ExternalYear}
            onChangeextrY={onChangeextrY}
            alignContent="flex-start"
            Final_Revaluation={semData.final_Revaluation}
            Update_Kt_student={onchangeUpdateKt}
            update_Kt={semData.update_Kt}
            add_Adc_student={add_Adc_student}
            add_Adc={semData.add_Adc}
            genderCount={genderCount}
          />
       
      </Box>
    </Box>

    <Box sx={{ width: '100%', justifyContent: 'flex-start' }}>
      <Paper>
        <Box sx={{ width: '100%' }}>
          <TableContainer>
            <Table sx={{ minWidth: 750, width: '80vw'}}  aria-labelledby="tableTitle">      
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              add_Adc={semData.add_Adc}
            />
            <TableBody>
              {visibleRows.map((student,i) => (
                <>
                  <TableRow 
                  hover
                  tabIndex={-1}
                  key={student.Name}
                  sx={{ cursor: 'pointer', pointerEvents:student.ADC?'none':"auto" , backgroundColor:student.ADC?'#ffa07a':"inherit"}}
                >
                  <TableCell align="left">{student.Gender==="F"?<>/ {student.Name}</>:<>{student.Name}</>}</TableCell>
                  <TableCell align="left" sx={{ position: "relative", left: "1vw"}}>{student.Roll_No}</TableCell>
                  {/* <TableCell align="left">{student.gender}</TableCell> */}
                
                  {!semData.add_Adc?
                       <>
                      <TableCell align="center">
                        <TextField
                          name='Sgpi'
                          type="number"
                          value={student.Sgpi}
                          onChange={(e) =>
                            handleSgpiChange(student.Roll_No,e.target.value,e.target.name)
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                      <Radio    checked={student.Status}  onClick={() =>
                            handleStatusChange(student.Roll_No,student.Status)
                       }/>
                      { student.Status==true?
                        <label>Pass</label>: <label>Fail</label>
                      } 
                      </TableCell>
                      <TableCell align="center">
                      <MonthYearSelect value={student.InternalYear} onChange={(date)=>handlDateChangeIn(student.Roll_No,date)}  />
                      </TableCell>
                      <TableCell align="center">
                      <MonthYearSelect value={student.ExternalYear}   onChange={(date)=>handlDateChangeEx(student.Roll_No,date)}/>
                      </TableCell>
                      { student.Status==true?
                        <label></label>: 
                     <> 
                      <TableCell align="center">
                        <TextField
                          name='InternalKt'
                          type="number"
                          value={student.InternalKt}
                          onChange={(e) =>
                            handleSgpiChange(student.Roll_No,e.target.value,e.target.name)
                          }
                        />
                      </TableCell>
                     <TableCell align="center">
                        <TextField
                          name='ExternalKt'
                          type="number"
                          value={student.ExternalKt}
                          onChange={(e) =>
                            handleSgpiChange(student.Roll_No,e.target.value,e.target.name)
                          }
                        />
                      </TableCell>
                      </>
                      } 
                    </>:<>
                
                    
                    {/* <TableCell key={i} align="center">
                      <Radio    checked={studentsADc[i].ADC}  onClick={(e) =>
                            handleAdcChange(student.Roll_No,studentsADc[i].ADC,i)
                       }/>
                    </TableCell> */}
                    
                    <TableCell key={i} align="center">
                      <Radio    checked={student.ADC}  onClick={(e) =>
                            handleAdcChange(student.Roll_No,student.ADC,i)
                       }/>
                    </TableCell>
                    </>
              }      
                </TableRow>
                </>

              ))}
            </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
          rowsPerPageOptions={[5,10,25,50,100]}
          component="div"
          count={students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Box>
      </Paper>
      <Button onClick={handleSaveData}>Save Data</Button>
      <Button onClick={handleRefresh}>Refresh</Button>
    </Box>
  </>
);
}