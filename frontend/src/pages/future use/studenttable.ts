import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import SemesterSelect from '../components/Selectsemester';
import TextField from '@mui/material/TextField';

// Function to fetch data from the backend (replace with your actual API call)
async function fetchData() {
  try {
    const response = await fetch('your_backend_api_url_here');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
}

function EnhancedTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sgpiValues, setSgpiValues] = useState({});
  const [statusValues, setStatusValues] = useState({});
  const [data, setData] = useState({
    semester: '', // Initialize with your default value
  });

  const [tableData, setTableData] = useState([]); // State to store table data

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    fetchData().then((result) => {
      setTableData(result);
    });
  }, []);

  // ... rest of your code ...

  return (
    <Box sx={{ width: '100%' }}>
      <SemesterSelect value={data.semester} onChange={handleSemesterChange} />
      <Paper sx={{ width: '100%', mb: 2 }}>
        {/* ... rest of your code ... */}
        <TableBody>
          {tableData.map((row, index) => {
            return (
              <TableRow
                hover
                tabIndex={-1}
                key={row.name}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell component="th" scope="row" padding="none">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.rollno}</TableCell>
                <TableCell align="right">{row.gender}</TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    value={sgpiValues[row.name] || ''}
                    onChange={(event) => handleSgpiChange(event, row)}
                  />
                </TableCell>
                <TableCell align="right">
                  <TextField
                    type="text"
                    value={statusValues[row.name] || ''}
                    onChange={(event) => handleStatusChange(event, row)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        {/* ... rest of your code ... */}
      </Paper>
    </Box>
  );
}

// ... rest of your code ...

export default EnhancedTable;
