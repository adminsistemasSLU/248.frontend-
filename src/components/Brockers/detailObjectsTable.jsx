import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import CurrencyInput from '../currencyInput';
import { styled } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { visuallyHidden } from '@mui/utils';
import '../../styles/moddalForm.scss';
import '../../styles/detailQuoter.scss';


function createData(id, cobertura, monto, tasa, prima,titulo) {
  return {
    id,
    cobertura,
    monto,
    tasa,
    prima,
    titulo
  };
}

const rows = [
  createData(1, 'Edificio con todas sus instalaciones fijas y permanentes (Estructuras)', 305, 3.7, 67 ,false),
  createData(2, 'Maquinarias y equipos', 452, 25.0, 51 ,false),
  createData(3, 'Muebles, enseres y equipos de oficina', 262, 16.0, 24 ,false),
  createData(4, 'Equipo electrónico fijo y portátil', 159, 6.0, 24 ,false),
  createData(5, 'Targaryen', 356, 16.0, 49 ,true),
  createData(6, 'Melisandre', 408, 3.2, 87 ,false),
  createData(7, 'Ice cream sandwich', 237, 9.45, 4 ,false),
  createData(8, 'Jelly Bean', 375, 0.0, 94 ,false),
  createData(9, 'KitKat', 518, 26.0, 65 ,false),
  createData(10, 'Lollipop', 392, 0.2, 98 ,false),
  createData(11, 'Marshmallow', 318, 0, 81 ,false),
  createData(12, 'Nougat', 360, 19.0, 9, false),
  createData(13, 'Oreo', 437, 18.0, 63 ,false),
];

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: '#',
  },
  {
    id: 'cobertura',
    numeric: false,
    disablePadding: false,
    label: 'cobertura',
  },
  {
    id: 'accion',
    numeric: false,
    disablePadding: false,
    label: 'accion',
  },
  {
    id: 'monto',
    numeric: true,
    disablePadding: false,
    label: 'monto',
  },
  {
    id: 'tasa',
    numeric: true,
    disablePadding: false,
    label: 'tasa',
  },
  {
    id: 'prima',
    numeric: true,
    disablePadding: false,
    label: 'prima',
  }
];



function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead >
      <TableRow >
        <StyledTableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
            style={{ visibility: 'hidden' }}
          />
        </StyledTableCell>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#00A99D",
    color: '#fff',
    borderBottom: '1px solid black'
  },
  [`&.${tableCellClasses.body}`]: {
    borderBottom: '1px solid black'
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({

  '&:last-child td, &:last-child th': {
    borderBottom: '1px solid black'
  },
}));

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





export default function DetailObjectsTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [editableRows, setEditableRows] = React.useState(rows);

  // Nuevo estado para rastrear los valores editables
  const [editableValues, setEditableValues] = React.useState(
    rows.map((row) => ({ monto: row.monto, tasa: row.tasa, prima: row.prima }))
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

 

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    
  };

  const handleCellValueChange = (event, index, field) => {
    const newValue = event.target.value;
    const newEditableValues = [...editableValues];
    newEditableValues[index][field] = newValue;
    setEditableValues(newEditableValues);
  };

  const handleSaveChanges = () => {
    // Actualizar los valores editables en el estado principal (editableRows)
    const newEditableRows = editableRows.map((row, index) => ({
      ...row,
      monto: editableValues[index].monto,
      tasa: editableValues[index].tasa,
      prima: editableValues[index].prima,
    }));
    setEditableRows(newEditableRows);
    console.log(newEditableRows);
  };

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <TableContainer style={{overflow:'auto',height: 300 }}>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={'small'}
          style={{ height: 400 }}
        >
          <EnhancedTableHead

            rowCount={rows.length}
          />
          <TableBody>
            {visibleRows.map((row, index) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;
             

              return (
                !row.titulo ? (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                    key={row.id}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        onClick={(event) => handleClick(event, row.id)}
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                        key={row.id}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.cobertura}</TableCell>
                    <TableCell align="left">
                      {isItemSelected ? (<VisibilityIcon />) : (<div></div>)}
                    </TableCell>
                    <TableCell align="right">
                      {/* Campo editable con CurrencyInput */}
                      <CurrencyInput
                        className='input-table'
                        value={editableValues[index].monto}
                        onChange={(event) =>
                          handleCellValueChange(event, index, 'monto')
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      {/* Campo editable con CurrencyInput */}
                      <CurrencyInput
                        className='input-table'
                        value={editableValues[index].tasa}
                        onChange={(event) =>
                          handleCellValueChange(event, index, 'tasa')
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      {/* Campo editable con CurrencyInput */}
                      <CurrencyInput
                        className='input-table'
                        value={editableValues[index].prima}
                        onChange={(event) =>
                          handleCellValueChange(event, index, 'prima')
                        }
                      />
                    </TableCell>
                  </StyledTableRow>
                ) : (
                  <StyledTableRow>
                    <TableCell colSpan={7} style={{ backgroundColor: '#00A99D', color: '#fff' }}>
                      {row.cobertura}
                    </TableCell>
                  </StyledTableRow>
                )
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{display:'flex',justifyContent:'end', gap:'15px'}}>
      <div style={{display:'flex',justifyContent:'end', alignItems:'center', gap:'50px'}}>
            <p>Monto: </p>
            <div>
            $305
            </div>
      </div>
      <div style={{display:'flex',justifyContent:'end', alignItems:'center', gap:'50px'}}>
            <p>
              Prima:
            </p>
            <div>
            $67
            </div>
      </div>
      <button className='btnAceptar' onClick={handleSaveChanges}>Aceptar</button>

      </div>
     

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
