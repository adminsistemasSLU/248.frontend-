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
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import CurrencyInput from "../../utils/currencyInput";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { visuallyHidden } from "@mui/utils";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import AddObjectInsurance from "./addObjectInsurance";
import "../../styles/dialogForm.scss";
import EditIcon from "@mui/icons-material/Edit";
import {
  DATOS_PERSONALES_STORAGE_KEY,
  LS_RAMO,
  LS_PRODUCTO,
  LS_COTIZACION,
  LS_TABLAOBJETOSEGURO,
  USER_STORAGE_KEY
} from "../../utils/constantes";
import IncendioService from "../../services/IncencioService/IncendioService";
import ComboService from "../../services/ComboService/ComboService";
import Swal from "sweetalert2";

function createData(
  id,
  number,
  province,
  city,
  direction,
  amount,
  prima,
  rate
) {
  return {
    id,
    number,
    province,
    city,
    direction,
    amount,
    prima,
    rate,
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
    id: "province",
    numeric: false,
    disablePadding: false,
    label: "Provincia",
  },
  {
    id: "city",
    numeric: false,
    disablePadding: false,
    label: "Ciudad",
  },
  {
    id: "direction",
    numeric: false,
    disablePadding: false,
    label: "Dirección",
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

export default function ProtectObjectsTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [openModal, setOpenModal] = React.useState(false);
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
    const provincias = await cargarProvincias();
    const objetoSeguro = await cargarObjetoSeguro();

    if (provincias && objetoSeguro) {
      let number = 1;
      const rowsObjetoAmparo = [];

      for (let item of objetoSeguro) {
        let ciudades = await cargarCiudades(item.zona);
        item.arrMontos = JSON.parse(item.arrMontos);
        let ciud;
        let prov;

        if (item.zona) {
          prov = provincias.find((provincia) => provincia.Codigo === item.zona);
        }


        if (ciudades && item.ciudad) {
          ciud = ciudades.find((ciudad) => ciudad.Codigo === item.ciudad);
        }


        const row = createData(
          item.id,
          number++,
          prov?.Nombre || "",
          ciud?.Nombre || "",
          item.direccion,
          item.monto || 0.0,
          item.tasa || 0.0,
          item.prima || 0.0
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

  const cargarObjetoSeguro = async () => {
    let ramo = localStorage.getItem(LS_RAMO);
    let producto = localStorage.getItem(LS_PRODUCTO);
    let idCotizacion = localStorage.getItem(LS_COTIZACION);
    try {
      const cotizacion = await IncendioService.consultaCotizacionIncendio(
        ramo,
        producto,
        idCotizacion
      );

      if (cotizacion && cotizacion.data) {
        return cotizacion.data;
      }
    } catch (error) {
      console.error("Error al obtener antiguedad:", error);
    }
  };

  const cargarProvincias = async () => {
    let ramo = localStorage.getItem(LS_RAMO);
    let producto = localStorage.getItem(LS_PRODUCTO);
    try {
      const provincias = await ComboService.fetchComboProvincias(
        ramo,
        producto
      );

      if (provincias && provincias.data) {

        return provincias.data;
      }
    } catch (error) {
      console.error("Error al obtener provincias:", error);
    }
  };

  const cargarCiudades = async (provincia) => {
    let ramo = localStorage.getItem(LS_RAMO);
    let producto = localStorage.getItem(LS_PRODUCTO);
    try {
      const ciudades = await ComboService.fetchComboCiudad(
        ramo,
        producto,
        provincia
      );

      if (ciudades && ciudades.data) {

        return ciudades.data;
      }
    } catch (error) {
      console.error("Error al obtener ciudad:", error);
    }
  };

  const handleOpenModal = async (id) => {
    setselectedId(id);
    if (id !== "") {
      setselectedId(id);
      const element = cotizacion.find((item) => {
        return item.id === id;
      });
      localStorage.setItem(LS_TABLAOBJETOSEGURO, JSON.stringify(element));
    }

    const idCotizacion = localStorage.getItem(LS_COTIZACION);

    if (idCotizacion) {
      setOpenModal(true);
      return;
    }

    let personalData = JSON.parse(
      localStorage.getItem(DATOS_PERSONALES_STORAGE_KEY)
    );
    let ramo = localStorage.getItem(LS_RAMO);
    let producto = localStorage.getItem(LS_PRODUCTO);
    let userId = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    personalData = {
      ...personalData,
      producto: producto,
      ramo: ramo,
      tippoliza: 1,
      usuario: userId.id
    };

    if (id === "" && (idCotizacion === null || idCotizacion === "")) {
      try {
        handleOpenBackdrop();
        const response = await IncendioService.guardarCotizacion(personalData);
        if (response.codigo === 200) {
          localStorage.setItem(LS_COTIZACION, response.data); // Asumiendo que se recibe una clave
          handleCloseBackdrop();
          setOpenModal(true);
        } else {
          // Manejar la respuesta de error
          handleCloseBackdrop();
          console.error(
            "Error en la respuesta del servidor:",
            response.message
          );
        }
      } catch (error) {
        // Manejar errores de red/otros errores
        handleCloseBackdrop();
        console.error("Error al realizar la solicitud:", error);
      }
    }
    setOpenModal(true);
  };

  const handleDeleteCotizacion = async (id) => {
    setselectedId(id);
  
    // Verifica que el ID sea válido.
    if (id !== "" && id !== null) {
      try {
        // Mostrar diálogo de confirmación.
        const result = await Swal.fire({
          title: "¿Está seguro que desea eliminar la cotización?",
          text: "",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirmar"
        });
  
        if (result.isConfirmed) {
          handleOpenBackdrop();
          const response = await IncendioService.eliminarCotizacionIncendio(id);
  
          handleCloseBackdrop();
  
          if (response.codigo === 200) {
            // Cotización eliminada con éxito.
            await cargarTabla();
            Swal.fire(
              "La cotización se ha eliminado correctamente.",
              "",
              "success"
            );
            // Recargar la tabla después de eliminar la cotización.
            
          } else {
            console.error("Error en la respuesta del servidor:", response.message);
            await cargarTabla();
            Swal.fire(
              "Error en la respuesta del servidor:", response.message,
              "",
              "error"
            );
          }
        }
      } catch (error) {
        handleCloseBackdrop();
        console.error("Error al realizar la solicitud:", error);
      }
    }
  };

  // Manejador para cerrar el modal
  const handleCloseModal = () => {
    cargarTabla();
    setOpenModal(false);
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
        selected.slice(selectedIndex + 1)
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
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="xl"
        className="outerDialog"
        PaperProps={{
          style: {
            backgroundColor: "#ffffff00",
            boxShadow: "none",
            overflow: "hidden",
            width: "100%",
          },
        }}
      >
        <DialogContent className="dialog-content">
          {/* Componente del formulario */}
          <AddObjectInsurance
            idObjectSelected={selectedId}
            closeModal={handleCloseModal}
          />
        </DialogContent>
      </Dialog>

      <Box style={{ width: "100%" }} sx={{ width: "100%", marginTop: "12px" }}>
        <Paper sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
          <Button
            variant="contained"
            onClick={() => handleOpenModal("")}
            sx={{ marginRight: "20px" }}
          >
            Nuevo
          </Button>
        </Paper>
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
                        <TableCell align="left">{row.province}</TableCell>
                        <TableCell align="left">{row.city}</TableCell>
                        <TableCell align="left">{row.direction}</TableCell>

                        <TableCell align="right">
                          <CurrencyInput
                            value={row.amount}
                            className="input-table"
                            disabled
                          />
                        </TableCell>
                        <TableCell align="right">
                          <input
                            value={(parseFloat(row.prima).toFixed(2)||0) + "%"}
                            className="input-table"
                            disabled
                          />
                        </TableCell>
                        <TableCell align="right">
                          <CurrencyInput
                            value={row.rate}
                            className="input-table"
                            disabled
                          />
                        </TableCell>
                        <TableCell align="right">
                          <div
                            style={{ display: "flex", justifyContent: "end" }}
                          >
                            <IconButton onClick={() => handleOpenModal(row.id)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteCotizacion(row.id)}>
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

      <div className="" style={{ display: "flex", justifyContent: "end", marginRight:'1%',gap: "20px"  }}>
            <div
              className="elementsModal"
              style={{ marginRight: "10px", gap: "30px" }}
            >
              <div>Monto: </div>
              <div>
                <CurrencyInput
                  style={{ width: "150px" }}
                  className="input-table"
                  disabled
                  value={totalMonto.toFixed(2)}
                />
              </div>
            </div>
            <div className="elementsModal elementRight" style={{ gap: "30px" }}>
              <div>Prima:</div>
              <div>
                <CurrencyInput
                  style={{ width: "150px" }}
                  className="input-table"
                  disabled
                  value={totalPrima.toFixed(2)}
                />
              </div>
            </div>
          </div>
    </div>
  );
}
