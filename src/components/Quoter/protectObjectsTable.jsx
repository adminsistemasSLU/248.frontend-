import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AddObjectInsurance from './addObjectInsurance';
import '../../styles/dialogForm.scss';
import EditIcon from '@mui/icons-material/Edit';

function createData(number, province, city, direction, risk, amount, prima, rate) {
  return {
    number,
    province,
    city,
    direction,
    risk,
    amount,
    prima,
    rate
  };
}

const rows = [
  createData(1, 'Guayas', 'Guayaquil', 'Av 9 de Octubre', '20%', 4.3, 3.7, 67),
  createData(2, 'Pichincha', 'Quito', 'Sangolqui', '15%', 4.9, 3.7, 67),

];

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
    id: 'number',
    numeric: false,
    disablePadding: true,
    label: '#',
  },
  {
    id: 'province',
    numeric: true,
    disablePadding: false,
    label: 'Provincia',
  },
  {
    id: 'city',
    numeric: true,
    disablePadding: false,
    label: 'Ciudad',
  },
  {
    id: 'direction',
    numeric: true,
    disablePadding: false,
    label: 'Dirección',
  },
  {
    id: 'risk',
    numeric: true,
    disablePadding: false,
    label: 'T.Riesgo',
  },
  {
    id: 'amount',
    numeric: true,
    disablePadding: false,
    label: 'Monto',
  },
  {
    id: 'rate',
    numeric: true,
    disablePadding: false,
    label: 'Tasa',
  },
  {
    id: 'prima',
    numeric: true,
    disablePadding: false,
    label: 'Prima',
  },
  {
    id: 'action',
    numeric: true,
    disablePadding: false,
    label: 'Acción',
  },
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

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
      style={{ borderBottom: '2px solid #00a99e ', height: '40px', minHeight: '0px' }}
    >

      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
        style={{ textAlign: 'start', fontSize: '14px', color: '#00a99e' }}
      >
        Objeto del Seguro
      </Typography>

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
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

export default function ProtectObjectsTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openModal, setOpenModal] = React.useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Manejador para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.number);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );



  return (
    <div style={{ width: '100%' }}>

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xl"
        className='outerDialog'
        PaperProps={{
          style: {
            backgroundColor: '#ffffff00',
            boxShadow: 'none',
            overflow: 'hidden',
            width: '100%'
          },
        }}>
        <DialogContent className='dialog-content'>
          {/* Componente del formulario */}
          <AddObjectInsurance closeModal={handleCloseModal} />
        </DialogContent>

      </Dialog>

      <Box style={{ width: '100%' }} sx={{ width: '100%', marginTop: '12px' }}>
        <Paper sx={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
          <Button variant="contained" onClick={handleOpenModal} sx={{ marginRight: '20px' }}>
            Nuevo
          </Button>
        </Paper>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          {visibleRows.length === 0 ? (
            <Typography variant="body2" style={{ padding: '16px' }}>
              No hay registros en la tabla.
            </Typography>
          ) : (
            <TableContainer style={{ overflow: 'auto', height: 300, padding: '20px' }}>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={'small'}
                style={{ height: 150 }}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody

                >
                  {visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row.number);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <StyledTableRow
                        hover
                        
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.number}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                         
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.number}
                        </TableCell>
                        <TableCell align="right">{row.province}</TableCell>
                        <TableCell align="right">{row.city}</TableCell>
                        <TableCell align="right">{row.direction}</TableCell>
                        <TableCell align="right">{row.risk}</TableCell>
                        <TableCell align="right">{row.amount}</TableCell>
                        <TableCell align="right">{row.rate}</TableCell>
                        <TableCell align="right">{row.prima}</TableCell>
                        <TableCell align="right">
                          <div  style={{display: 'flex', justifyContent:'end'}}>
                          <IconButton>
                            <EditIcon  onClick={handleOpenModal} />
                          </IconButton>
                          <IconButton>
                            <DeleteIcon />
                          </IconButton>
                          </div>
                          
                        </TableCell>
                      </StyledTableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (33) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage ='Filas por pagina'
          />
        </Paper>

      </Box>
    </div>
  );
}