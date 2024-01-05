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
import DescriptionIcon from '@mui/icons-material/Description';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import '../../styles/moddalForm.scss';
import '../../styles/detailQuoter.scss';
import CloseIcon from '@mui/icons-material/Close';
import CurrencyInput from '../../utils/currencyInput';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ProtectionDetailTable from './protectionDetailTable';


function createData(id, cobertura, monto, tasa, prima, titulo) {
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
  createData(1, 'Edificio con todas sus instalaciones fijas y permanentes (Estructuras)', 950000.00, 3.7, 67, false),
  createData(2, 'Maquinarias y equipos', 452, 25.0, 51, false),
  createData(3, 'Muebles, enseres y equipos de oficina', 262, 16.0, 24, false),
  createData(4, 'Equipo electrónico fijo y portátil', 159, 6.0, 24, false),
  createData(5, 'AMPAROS ADICIONALES QUE SUMAN CAPITAL', 356, 16.0, 49, true),
  createData(6, 'Remocion de escombros', 408, 3.2, 87, false),
  createData(7, 'Honorarios de Ingenieros Arquitectos y topografos', 237, 9.45, 4, false),
  createData(8, 'Documentos y modelos', 375, 0.0, 94, false),
  createData(9, 'AMPAROS ADICIONALES CON COSTOS', 518, 26.0, 65, true),
  createData(10, 'Terrorismo y/o sabotaje', 392, 0.2, 98, false),
  createData(11, 'Responsabilidad civil Extracontractual', 318, 0, 81, false),

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





export default function DetailObjectsTable({ closeModalDetail }) {
  const [order,] = React.useState('asc');
  const [orderBy,] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [openModal, setOpenModal] = React.useState(false);
  // const [editableRows, setEditableRows] = React.useState(rows);

  // Nuevo estado para rastrear los valores editables
  const [editableValues, setEditableValues] = React.useState(
    rows.map((row) => ({ monto: row.monto, tasa: row.tasa, prima: row.prima }))
  );


  const [jsonData, setJsonData] = React.useState(rows); // Estado para los datos
  const [totalMonto, setTotalMonto] = React.useState(0);
  const [totalPrima, setTotalPrima] = React.useState(0);

  React.useEffect(() => {
    setEditableValues(
      rows.map((row) => ({
        monto: row.monto, tasa: row.tasa, prima: row.prima
      }))
    );
  }, []);

  React.useEffect(() => {
    // Calcula el total del monto desde el estado jsonData
    const totalMonto = jsonData.reduce((acc, item) => acc + parseFloat(item.monto), 0);
    const totalPrima = jsonData.reduce((acc, item) => acc + parseFloat(item.prima), 0);
    // Actualiza el estado totalMonto
    setTotalMonto(totalMonto);
    setTotalPrima(totalPrima);
  }, [jsonData]); // Observa cambios en jsonData


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const closeModal = () => {
    closeModalDetail('true');
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
    const numericValue = parseFloat(newValue.replace(/[^\d.-]/g, ''));
    const newEditableValues = [...editableValues];
    isNaN(numericValue) ? newEditableValues[index][field] = newValue : newEditableValues[index][field] = numericValue;
    setEditableValues(newEditableValues);
    const newJsonData = [...jsonData];
    newJsonData[index][field] = numericValue;
    setJsonData(newJsonData);
    const total = jsonData.reduce((acc, item) => parseFloat(acc) + parseFloat(item.monto), 0);
    setTotalMonto(total);
    const totalPrima = jsonData.reduce((acc, item) => parseFloat(acc) + parseFloat(item.prima), 0);
    setTotalPrima(totalPrima)
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // const handleSaveChanges = () => {
  //   // Actualizar los valores editables en el estado principal (editableRows)
  //   const newEditableRows = editableRows.map((row, index) => ({
  //     ...row,
  //     monto: editableValues[index].monto,
  //     tasa: editableValues[index].tasa,
  //     prima: editableValues[index].prima,
  //   }));
  //   setEditableRows(newEditableRows);
  //   console.log(newEditableRows);
  // };


  // Manejador para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
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
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', gap: '5px' }}>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xl" className='dialog-height'
        PaperProps={{
          style: {
            backgroundColor: '#ffffff',
            boxShadow: 'none',

            overflow: 'hidden',
            zIndex: '2000'
          },
        }}>
        <DialogContent style={{ overflow: 'hidden', padding: '0px', paddingBottom: '20px' }} className='dialog-height-content'>
          {/* Componente del formulario */}
          <ProtectionDetailTable closeModalDetail={handleCloseModal} style={{ width: '80%' }} />
        </DialogContent>
      </Dialog>


      <div style={{ backgroundColor: '#00a99e', color: 'white', paddingTop: '5px', paddingLeft: '15px', paddingRight: '15px', display: 'flex', justifyContent: 'space-between' }}>
        <div>Detalle de Amparo</div>
        <div onClick={closeModal}> <CloseIcon /></div>
      </div>
      <TableContainer style={{ overflow: 'auto', height: '100%', padding: '20px' }}>
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
                      {isItemSelected ? (<DescriptionIcon onClick={handleOpenModal} />) : (<div></div>)}
                    </TableCell>
                    <TableCell align="right">
                      {/* Campo editable con CurrencyInput */}
                      <CurrencyInput
                        className='input-table'
                        value={editableValues[index].monto.toFixed(2)}
                        onChange={(event) =>
                          handleCellValueChange(event, index, 'monto')
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      {/* Campo editable con CurrencyInput */}
                      <CurrencyInput
                        className='input-table'
                        value={editableValues[index].tasa.toFixed(2)}
                        onChange={(event) =>
                          handleCellValueChange(event, index, 'tasa')
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      {/* Campo editable con CurrencyInput */}
                      <CurrencyInput
                        className='input-table'
                        value={editableValues[index].prima.toFixed(2)}
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
      <div className='paginationResponsive' style={{ justifyContent: 'space-between', gap: '15px' }}>
        <TablePagination
          style={{ justifySelf: 'flex-start' }}
          rowsPerPageOptions={[10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <div style={{display:'flex',justifyContent:'end'}}>
          <div className='elementsModal' style={{ marginRight: '10px' }}>
            <div>Monto: </div>
            <div>
            <CurrencyInput style={{width:'105px'}}
                        className='input-table'
                        value={totalMonto.toFixed(2)} />
            </div>
          </div>
          <div className='elementsModal elementRight'>
            <div>
              Prima:
            </div>
            <div>
            <CurrencyInput style={{width:'105px'}}
                        className='input-table'
                        value= {totalPrima.toFixed(2)} />
            </div>
          </div>
          <div style={{ display: 'flex', marginLeft: '5px', marginRight: '20px', alignItems: 'center', justifyContent: 'end' }}>
            {/* <button className='btnAceptar' onClick={handleSaveChanges}>Aceptar</button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
