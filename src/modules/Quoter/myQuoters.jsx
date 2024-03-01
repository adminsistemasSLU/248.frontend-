import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CurrencyInput from "../../utils/currencyInput";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { visuallyHidden } from "@mui/utils";
import "../../styles/dialogForm.scss";
import EditIcon from "@mui/icons-material/Edit";
import { LS_COTIZACION, LS_PRODUCTO, LS_RAMO, USER_STORAGE_KEY } from "../../utils/constantes";
import QuoterService from "../../services/QuoterService/QuoterService";
import Swal from "sweetalert2";

function createData(
  id,
  number,
  ramo,
  producto,
  cliente,
  amount,
  prima,
  rate,
  state,
  createdDate,
  productoId,
  ramoId
) {
  return {
    id,
    number,
    ramo,
    producto,
    cliente,
    amount,
    prima,
    rate,
    state,
    createdDate,
    productoId,
    ramoId
  };
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
  return order === "desc"
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
    id: "number",
    numeric: false,
    disablePadding: true,
    label: "#",
  },
  {
    id: "ramo",
    numeric: false,
    disablePadding: false,
    label: "Ramo",
  },
  {
    id: "producto",
    numeric: false,
    disablePadding: false,
    label: "Producto",
  },
  {
    id: "cliente",
    numeric: false,
    disablePadding: false,
    label: "Cliente",
  },
  // {
  //   id: 'risk',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'T.Riesgo',
  // },
  {
    id: "amount",
    numeric: true,
    disablePadding: false,
    label: "Monto",
  },
  {
    id: "rate",
    numeric: true,
    disablePadding: false,
    label: "Tasa",
  },
  {
    id: "prima",
    numeric: true,
    disablePadding: false,
    label: "Prima",
  },
  {
    id: "fechaCreacion",
    numeric: true,
    disablePadding: false,
    label: "Fecha Creacion",
  },
  {
    id: "state",
    numeric: true,
    disablePadding: false,
    label: "Estado",
  },
  {
    id: "action",
    numeric: true,
    disablePadding: false,
    label: "Acción",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell padding="checkbox"></StyledTableCell>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
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
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;
  let user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
      style={{
        borderBottom: "2px solid #00a99e ",
        height: "40px",
        minHeight: "0px",
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
        style={{ textAlign: "start", fontSize: "14px", color: "#00a99e" }}
      >
        Usuario: {user.des_usuario}
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
    borderBottom: "1px solid black",
  },
  [`&.${tableCellClasses.body}`]: {
    borderBottom: "1px solid black",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    borderBottom: "1px solid black",
  },
}));

export default function MyQuoters() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [rows, setRows] = React.useState([]);
  const [selectedId, setselectedId] = React.useState(-1);
  const [cotizacion, setCotizacion] = React.useState([]);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [totalMonto, setTotalMonto] = React.useState(0);
  const [totalPrima, setTotalPrima] = React.useState(0);

  useEffect(() => {
    cargarTabla();
  }, []);

  async function cargarTabla() {
    handleOpenBackdrop();

    const objetoSeguro = await cargarCotizacion();

    if (objetoSeguro) {
      let number = 1;
      const rowsObjetoAmparo = [];
      console.log(objetoSeguro);
      for (let item of objetoSeguro) {
        let tasa = parseFloat(
          (item.total_prima / item.total_monto) * 100
        ).toFixed(2);
        tasa = isNaN(tasa) ? 0.0 : tasa;
        const row = createData(
          item.id,
          number++,
          item.nomram || "",
          item.descripcion || "",
          item.clinombre + " " + item.cliapellido,
          item.total_monto || 0.0,
          item.total_prima || 0.0,
          tasa,
          item.estado,
          item.created_at,
          item.producto,
          item.ramo
        );
        rowsObjetoAmparo.push(row);
      }

      setRows(rowsObjetoAmparo);

      setCotizacion(objetoSeguro);
      const newTotalMonto = objetoSeguro.reduce(
        (sum, row) => sum + parseFloat(row.monto),
        0
      );
      setTotalMonto(newTotalMonto);
      const newTotalPrima = objetoSeguro.reduce(
        (sum, row) => sum + parseFloat(row.prima),
        0
      );
      setTotalPrima(newTotalPrima);
      console.log(totalMonto);
      console.log(totalPrima);
    }

    handleCloseBackdrop();
  }

  const handleOpenQuoter = (id,product,ramo) => {
    localStorage.setItem(LS_COTIZACION, id);
    localStorage.setItem(LS_PRODUCTO, product);
    localStorage.setItem(LS_RAMO, ramo);
    window.location.href = `/quoter/pymes/`;
  };

  const handleDeleteQuoter = async (id) => {
    await eliminarCotizacion(id);
  };

  const cargarCotizacion = async () => {
    let userId = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    let dato = {
      usuario: userId.id,
    };
    try {
      const cotizacion = await QuoterService.fetchConsultarCotizacionGeneral(
        dato
      );

      if (cotizacion && cotizacion.data) {
        return cotizacion.data;
      }
    } catch (error) {
      console.error("Error al obtener Consultar Cotizacion General:", error);
    }
  };

  const eliminarCotizacion = async (id) => {
    const result = await Swal.fire({
      title: "¿Está seguro que desea eliminar la cotización?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    });

    try {
      if (result.isConfirmed) {
        handleOpenBackdrop();
        const cotizacion = await QuoterService.fetchEliminarCotizacionGeneral(
          id
        );

        if (cotizacion && cotizacion.data) {
          await cargarTabla();
          return cotizacion.data;
        }

        handleCloseBackdrop();
      }
    } catch (error) {
      console.error("Error al Eliminar Cotizacion General:", error);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
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
        page * rowsPerPage + rowsPerPage
      ),
    [rows, order, orderBy, page, rowsPerPage]
  );

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  return (
    <div style={{ width: "100%" }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* Modal */}

      <h2 style={{ color: "#00a99e" }}>Mis Cotizaciones</h2>

      <Box style={{ width: "100%" }} sx={{ width: "100%", marginTop: "12px" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          {visibleRows.length === 0 ? (
            <Typography variant="body2" style={{ padding: "16px" }}>
              No hay registros en la tabla.
            </Typography>
          ) : (
            <TableContainer
              style={{ overflow: "auto", height: 300, padding: "20px" }}
            >
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={"small"}
                style={{ height: 50 }}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
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
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.number}
                        </TableCell>
                        <TableCell align="left">{row.ramo}</TableCell>
                        <TableCell align="left">{row.producto}</TableCell>
                        <TableCell align="left">{row.cliente}</TableCell>

                        <TableCell align="right">
                          <CurrencyInput
                            value={row.amount}
                            className="input-table"
                            disabled
                          />
                        </TableCell>
                        <TableCell align="right">
                          <input
                            value={(parseFloat(row.rate).toFixed(2) || 0) + "%"}
                            className="input-table"
                            disabled
                          />
                        </TableCell>
                        <TableCell align="right">
                          <CurrencyInput
                            value={row.prima}
                            className="input-table"
                            disabled
                          />
                        </TableCell>
                        <TableCell align="right">
                          <input
                            value={row.createdDate}
                            className="input-table"
                            disabled
                          />
                        </TableCell>
                        <TableCell align="right">
                          <input
                            value={row.state}
                            className="input-table"
                            disabled
                          />
                        </TableCell>
                        <TableCell align="right">
                          {row.state !== "Cancelado" && (
                            <div
                              style={{ display: "flex", justifyContent: "end" }}
                            >
                              <IconButton
                                onClick={() => handleOpenQuoter(row.id,row.productoId,row.ramoId)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteQuoter(row.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          )}
                        </TableCell>
                      </StyledTableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: 33 * emptyRows,
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
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por pagina"
          />
        </Paper>
      </Box>
    </div>
  );
}
