import React, { useState ,useRef} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import SemesterSelect from '../components/Selectsemester';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import MonthYearSelect from '../components/Selectmonthyear';



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
    id: 'gender',
    numeric: false,
    disablePadding: false,
    label: '',
  },
  {
    id: 'sgpi',
    numeric: true,
    disablePadding: false,
    label: 'SGPI',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'Kt_Count',
    numeric: false,
    disablePadding: false,
    label: 'Kt Count',
  },
  {
    id: 'Kt_Count',
    numeric: false,
    disablePadding: false,
    label: 'Internal Year',
  },
  {
    id: 'Kt_Count',
    numeric: false,
    disablePadding: false,
    label: 'External Year',
  },
];

const studentsData = [
  { id: 1, name: 'Student 1', rollNo: '101', gender: 'Male', sgpi: '', status: '' },
  { id: 2, name: 'Student 2', rollNo: '102', gender: 'Female', sgpi: '', status: '' },
  // Add more student data
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort,allStudent} = props;

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
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
        ))}
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
  const { allStudent,data} = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSemester, setSelectedSemester] = useState('');
  const addNewAtributeStudents = allStudent.map(student => ({
    ...student,
    sgpi: -1,     // You can set the default value for sgpi here
    status: true,  // You can set the default value for status here
    InternalYear:'',
    ExternalYear:'',
    NoOfKts:0,
  }));
  
  const [students, setStudents] = useState(addNewAtributeStudents);

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

  const handleSemesterChange = (event) => {
    const newSemester = event.target.value;
    setSelectedSemester(newSemester);
  };

  const handleSGPIChange = (studentId, value) => {
    const updatedStudents = students.map((student) =>
      student.Roll_No === studentId ? { ...student, sgpi: value } : student
    );
    setStudents(updatedStudents);
  };

  const handleStatusChange = (studentId, value) => {
    console.log(value);
    const updatedStudents = students.map((student) =>
      student.Roll_No === studentId ? { ...student, status: !value } : student
    );
   
    setStudents(updatedStudents);
  };

  const handleSaveData = () => {
    
    const p={ Departname:data.Departname,
    End_Year: data.End_Year,
  students:students,
  SemNo:selectedSemester}
  console.log(p);
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
    <Box sx={{ width: '100%' }}>
      <SemesterSelect value={selectedSemester} onChange={handleSemesterChange} />
      <Paper sx={{ width: '100%', mb: 2, pl: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((student) => (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={student.Name}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell align="left">{student.Name}</TableCell>
                  <TableCell align="left">{student.Roll_No}</TableCell>
                  <TableCell align="left">{student.gender}</TableCell>
                  {selectedSemester && (
                    <>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          value={student.sgpi}
                          onChange={(e) =>
                            handleSGPIChange(student.Roll_No, e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        {/* <TextField
                          type="text"
                          value={student.status}
                          onChange={(e) =>
                            handleStatusChange(student.Roll_No, e.target.value)
                          }
                        /> */}
                      <Radio    checked={student.status}  onClick={() =>
                            handleStatusChange(student.Roll_No, student.status)
                       }/>
                      { student.status==true?
                        <label>Pass</label>: <label>Fail</label>
                      } 
                      </TableCell>
                      { student.status==true?
                        <label></label>: 
                     <> <TableCell align="center">
                        <TextField
                          type="number"
                          value={student.NoOfKts}
                          onChange={(e) =>
                            handleSGPIChange(student.Roll_No, e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                      <MonthYearSelect value={data.startYear}  />
                      </TableCell>
                      <TableCell align="center">
                      <MonthYearSelect value={data.startYear}  />
                      </TableCell></>
                      } 

                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Button onClick={handleSaveData}>Save Data</Button>
    </Box>
  );
}
