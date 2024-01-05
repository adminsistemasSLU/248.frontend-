import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CurrencyInput from '../../utils/currencyInput';
import { visuallyHidden } from '@mui/utils';
import '../../styles/moddalForm.scss';
import '../../styles/detailQuoter.scss';
import CloseIcon from '@mui/icons-material/Close';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DetailObjectsTable from './detailObjectsTable';

function createData(id, ramo, descripcion, monto, prima) {
  return {
    id,
    ramo,
    descripcion,
    monto,
    prima
  };
}

const rows = [
  createData(1, 'Incendio', '', 950000., 300),
  createData(2, 'Robo', '', 7800, 135),
  createData(3, 'Componentes electronicos', '', 9000, 60),
];

const headCells = [
  {
    id: 'seccion',
    numeric: false,
    disablePadding: false,
    label: 'Sección',
    visible: true,
  },
  // {
  //   id: 'descripcion',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Descripción',
  //   visible: false,
  // } 
  {
    id: 'monto',
    numeric: true,
    disablePadding: false,
    label: 'Monto',
    visible: true,
  }
  ,
  {
    id: 'prima',
    numeric: true,
    disablePadding: false,
    label: 'Prima',
    visible: true,
  }
  ,
  {
    id: 'accion',
    numeric: true,
    disablePadding: false,
    label: 'Acción',
    visible: true,
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


export default function BranchInsurance({ closeModalDetail }) {
  const [order,] = React.useState('asc');
  const [orderBy,] = React.useState('calories');
  const [selected,] = React.useState([]);
  const [page,] = React.useState(0);
  const [rowsPerPage,] = React.useState(10);
  const [openModal, setOpenModal] = React.useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Manejador para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Nuevo estado para rastrear los valores editables
  // const [editableValues, setEditableValues] = React.useState(
  //   rows.map((row) => ({ descripcion: row.descripcion }))
  // );

  const closeModal = () => {
    closeModalDetail('true');
  };


  const isSelected = (id) => selected.indexOf(id) !== -1;

  // const handleCellValueChange = (event, index, field) => {
  //   const newValue = event.target.value;
  //   const newEditableValues = [...editableValues];
  //   newEditableValues[index][field] = newValue;
  //   setEditableValues(newEditableValues);
  // };

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
      <div style={{ backgroundColor: '#00a99e', color: 'white', paddingTop: '5px', paddingLeft: '15px', paddingRight: '15px', display: 'flex', justifyContent: 'space-between' }}>
        <div>Descripcion de Sección</div>
        <div onClick={closeModal}> <CloseIcon /></div>
      </div>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xl" className='dialog-height'
        PaperProps={{
          style: {
            backgroundColor: '#ffffff',
            boxShadow: 'none',
            overflow: 'hidden',
            zIndex: '2000'
          },
        }}>
        <DialogContent style={{ overflow: 'scroll', padding: '0px', paddingBottom: '20px' }} className='dialog-height-content'>
          {/* Componente del formulario */}
          <DetailObjectsTable closeModalDetail={handleCloseModal} style={{ width: '80%' }} />
        </DialogContent>
      </Dialog>


      <TableContainer style={{ overflow: 'auto', height: '100%', padding: '20px' }}>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={'small'}
          style={{ height: 150 }}
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
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    sx={{ cursor: 'pointer' }}
                    key={row.id}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.id}
                    </TableCell>
                    <TableCell align="left">
                      {/* Campo editable con CurrencyInput */}
                      <div className='input-table' style={{ textAlign: 'left' }}>
                        {row.ramo}
                      </div>
                    </TableCell>
                    {/* <TableCell align="left">
                      <input
                        className='input-table'
                        style={{textAlign:'left'}}
                        value={editableValues[index].descripcion}
                        onChange={(event) =>
                        handleCellValueChange(event, index, 'descripcion')
                        }
                      />
                    </TableCell> */}
                    <TableCell align="right"
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                     <CurrencyInput className='input-table' disabled value={row.monto.toFixed(2)} />
                    </TableCell>
                    <TableCell align="right"
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      <CurrencyInput className='input-table' disabled value={row.prima.toFixed(2)} />
                    </TableCell>
                    <TableCell align="right">
                      <EventAvailableIcon
                        onClick={handleOpenModal}
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
        <div className='' style={{ display:'flex',justifyContent:'end'}}>
            <div className='elementsModal' style={{ marginRight: '10px', gap: '5px' }}>
              <div>Monto: </div>
              <div>
              <CurrencyInput style={{width:'105px'}} className='input-table' disabled value={(958000).toFixed(2)} />
              </div>
            </div>
            <div className='elementsModal elementRight' style={{ gap: '5px' }}>
              <div>
                Prima:
              </div>
              <div>
              <CurrencyInput style={{width:'105px'}} className='input-table' disabled value={(495).toFixed(2)} />
              </div>
            </div>
          </div>
      </TableContainer>
            
    </div>
  );
}
