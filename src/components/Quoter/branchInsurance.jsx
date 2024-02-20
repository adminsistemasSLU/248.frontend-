import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CurrencyInput from "../../utils/currencyInput";
import { visuallyHidden } from "@mui/utils";
import "../../styles/moddalForm.scss";
import "../../styles/detailQuoter.scss";
import CloseIcon from "@mui/icons-material/Close";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DetailObjectsTable from "./detailObjectsTable";
import IncendioService from "../../services/IncencioService/IncendioService";
import {
  LS_PRODUCTO,
  LS_RAMO,
  LS_CLASIFICACIONAMPARO,
  LS_TABLASECCIONES,
} from "../../utils/constantes";

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "#",
    visible: true,
  },
  {
    id: "seccion",
    numeric: false,
    disablePadding: false,
    label: "Sección",
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
    id: "monto",
    numeric: true,
    disablePadding: false,
    label: "Monto",
    visible: true,
  },
  {
    id: "tasa",
    numeric: true,
    disablePadding: false,
    label: "Tasa",
    visible: true,
  },
  {
    id: "prima",
    numeric: true,
    disablePadding: false,
    label: "Prima",
    visible: true,
  },
  {
    id: "accion",
    numeric: true,
    disablePadding: false,
    label: "Acción",
    visible: true,
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
            style={{ visibility: "hidden" }}
          />
        </StyledTableCell>
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#00A99D",
    color: "#fff",
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
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function BranchInsurance({ closeModalDetail, isEditMode }) {
  const [order] = useState("asc");
  const [orderBy] = useState("");
  const [selected, setSelected] = useState([]);
  const [page] = useState(0);
  const [rowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [editableRows, setEditableRows] = useState([]);
  const [rows1, setRows] = useState([]);
  const [totalMonto, setTotalMonto] = useState(0);
  const [totalPrima, setTotalPrima] = useState(0);
  const [idSelectedSeccion, setSelectedSeccion] = useState(0);
  const producto = JSON.parse(localStorage.getItem(LS_PRODUCTO));
  const ramo = JSON.parse(localStorage.getItem(LS_RAMO));
  const editMode = isEditMode;
  useEffect(() => {
    printDetalleAsegurado();
  }, []);

  useEffect(() => {
    const newTotalMonto = editableRows.reduce((sum, row) => {
      return row.checked ? sum + parseFloat(row.monto) : sum;
    }, 0);
    setTotalMonto(newTotalMonto);

    // Calcular el total de Prima
    const newTotalPrima = editableRows.reduce((sum, row) => {
      return row.checked ? sum + parseFloat(row.prima) : sum;
    }, 0);
    setTotalPrima(newTotalPrima);
  }, [editableRows]);

  // function createData(id, ramo, descripcion, monto, tasa, prima)
  const printDetalleAsegurado = async () => {
    try {
      let detalleAsegurado = [];
      let newItems = [];
      if (editMode) {
        newItems = JSON.parse(localStorage.getItem(LS_TABLASECCIONES));
      }
      if (newItems.length === 0) {
        detalleAsegurado = await IncendioService.fetchDetalleAsegurado(
          ramo,
          producto
        );
        console.log(detalleAsegurado);
      } else {
        detalleAsegurado.codigo = 200;
        detalleAsegurado.data = newItems;
      }

      if (detalleAsegurado && detalleAsegurado.data) {
        newItems = detalleAsegurado.data.map((detalleAsegurado) => {
          console.log(detalleAsegurado);
          return {
            id: detalleAsegurado.codigo,
            ramo: detalleAsegurado.descripcion,
            descripcion: detalleAsegurado.descripcion,
            monto: detalleAsegurado.monto,
            tasa: detalleAsegurado.tasa,
            prima: detalleAsegurado.prima,
            codigo: detalleAsegurado.codigo,
            checked: editMode ? detalleAsegurado.checked : false,
            Amparo: detalleAsegurado.Amparo || [],
          };
        });
        console.log(newItems);

        newItems = calcularPrima(newItems);

        setRows(newItems);
        setEditableRows(newItems);
        const newTotalMonto = newItems.reduce((sum, row) => {
          return row.checked ? sum + parseFloat(row.monto) : sum;
        }, 0);
        setTotalMonto(newTotalMonto);

        // Calcular el total de Prima
        const newTotalPrima = newItems.reduce((sum, row) => {
          return row.checked ? sum + parseFloat(row.prima) : sum;
        }, 0);
        setTotalPrima(newTotalPrima);
        localStorage.setItem(LS_TABLASECCIONES, JSON.stringify(newItems));
      }
    } catch (error) {
      console.error("Error al obtener Detalle Asegurado:", error);
    }
  };

  const calcularPrima = (tablaSecciones) => {
    const newEditableRows = tablaSecciones.map((row) => {
      return {
        ...row,
        tasa: ((row.prima / row.monto) * 100).toFixed(2),
      };
    });
    return newEditableRows;
  };

  const handleOpenModal = (codigo) => {
    console.log(codigo);
    setSelectedSeccion(codigo);
    localStorage.setItem(LS_CLASIFICACIONAMPARO, codigo);
    const tablaSecciones = JSON.parse(localStorage.getItem(LS_TABLASECCIONES));
    console.log(tablaSecciones);
    localStorage.setItem(LS_TABLASECCIONES, JSON.stringify(editableRows));

    setOpenModal(true);
  };

  // Manejador para cerrar el modal
  const handleCloseModal = () => {
    tablaSeccionesMap();
    setOpenModal(false);
  };

  function tablaSeccionesMap() {
    let tablaSecciones = JSON.parse(localStorage.getItem(LS_TABLASECCIONES));
    console.log(tablaSecciones);
    tablaSecciones = tablaSecciones.map((seccion)=>{
      return{
        ...seccion,
        tasa: (parseFloat(seccion.prima)/parseFloat(seccion.monto)).toFixed(2)
      }
    }
    )

    const newTotalMonto = tablaSecciones.reduce((sum, row) => {
      return row.checked ? sum + parseFloat(row.monto) : sum;
    }, 0);
    setTotalMonto(newTotalMonto);

    // Calcular el total de Prima
    const newTotalPrima = tablaSecciones.reduce((sum, row) => {
      return row.checked ? sum + parseFloat(row.prima) : sum;
    }, 0);
    setTotalPrima(newTotalPrima);
    //mapear id seccion con tabla secciones
    setEditableRows(tablaSecciones);
    setEditableValues(tablaSecciones);
    setRows(tablaSecciones);
    //Validar que se haya seleccionado un objeto
    const existeSeleccion = tablaSecciones.some(
      (seccion) => seccion.checked === true
    );
    console.log(existeSeleccion);
  }

  // Nuevo estado para rastrear los valores editables
  const [editableValues, setEditableValues] = React.useState(
    rows1.map((rows1) => ({ checked: rows1.checked }))
  );

  const handleSaveChanges = () => {
    const tablaSecciones = JSON.parse(localStorage.getItem(LS_TABLASECCIONES));
    console.log(tablaSecciones);
    tablaSecciones.map((item, index) => {
      if (index < editableValues.length && editableValues[index] != null) {
        return {
          ...item,
          checked: editableValues[index].checked,
          Amparo: item.Amparo,
        };
      }
      return item; // Retorna el item sin cambios si no hay un valor correspondiente en editableValues
    });

    const updatedSecciones = tablaSecciones.map((item, index) => {
      return {
        ...item,
        checked: rows1[index].checked,
        monto: rows1[index].monto,
        tasa: rows1[index].tasa,
        prima: rows1[index].prima,
      };
    });

    localStorage.setItem(LS_TABLASECCIONES, JSON.stringify(updatedSecciones));
    closeModalDetail("true");
  };

  React.useEffect(() => {
    setEditableValues(
      rows1.map((rows1) => ({
        monto: rows1.monto,
        tasa: rows1.tasa,
        prima: rows1.prima,
        checked: rows1.checked,
      }))
    );
  }, []);

  const closeModal = () => {
    handleSaveChanges();
    closeModalDetail("true");
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
    // Encuentra la fila correspondiente y actualiza 'checked'
    const newEditableRows = editableRows.map((row) =>
      row.id === id ? { ...row, checked: !row.checked } : row
    );
    setEditableRows(newEditableRows);

    const newEditableValues = editableValues.map((value, index) =>
      newEditableRows[index].id === id
        ? { ...value, checked: !value.checked }
        : value
    );
    setEditableValues(newEditableValues);
    setRows(newEditableRows);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows1, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows1] // Asegúrate de incluir rows1 aquí
  );

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      <div
        style={{
          backgroundColor: "#00a99e",
          color: "white",
          paddingTop: "5px",
          paddingLeft: "15px",
          paddingRight: "15px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>Descripcion de Sección</div>
        <div onClick={closeModal}>
          {" "}
          <CloseIcon />
        </div>
      </div>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="xl"
        className="dialog-height"
        PaperProps={{
          style: {
            backgroundColor: "#ffffff",
            boxShadow: "none",
            overflow: "hidden",
            zIndex: "2000",
          },
        }}
      >
        <DialogContent
          style={{ overflow: "scroll", padding: "0px", paddingBottom: "20px" }}
          className="dialog-height-content"
        >
          {/* Componente del formulario */}
          <DetailObjectsTable
            closeModalDetail={handleCloseModal}
            idSeccion={idSelectedSeccion}
            style={{ width: "80%" }}
          />
        </DialogContent>
      </Dialog>

      <TableContainer
        style={{ overflow: "auto", height: "100%", padding: "20px" }}
      >
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size="small"
          style={{ height: 150 }}
        >
          <EnhancedTableHead rowCount={rows1.length} />
          <TableBody>
            {visibleRows.map((row, index) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return !row.titulo ? (
                <StyledTableRow
                  hover
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  sx={{ cursor: "pointer" }}
                  key={row.id}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      onChange={(event) => handleClick(event, row.id)}
                      color="primary"
                      checked={row.checked}
                      inputProps={{
                        "aria-labelledby": labelId,
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
                  <TableCell align="left">
                    {/* Campo editable con CurrencyInput */}
                    <div className="input-table" style={{ textAlign: "left" }}>
                      {row.ramo}
                    </div>
                  </TableCell>
                  <TableCell
                    align="right"
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    <CurrencyInput
                      className="input-table"
                      disabled
                      value={parseFloat(row.monto).toFixed(2)}
                    />
                  </TableCell>
                  <TableCell
                    align="right"
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    <input
                      className="input-table"
                      disabled
                      value={row.tasa + "%"}
                    />
                  </TableCell>
                  <TableCell
                    align="right"
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    <CurrencyInput
                      className="input-table"
                      disabled
                      value={row.prima}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <EventAvailableIcon
                      onClick={() => handleOpenModal(row.codigo)}
                    />
                  </TableCell>
                </StyledTableRow>
              ) : (
                <StyledTableRow>
                  <TableCell
                    colSpan={7}
                    style={{ backgroundColor: "#00A99D", color: "#fff" }}
                  >
                    {row.cobertura}
                  </TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          {/* ... (resto del código de tu componente) */}

          <div className="" style={{ display: "flex", justifyContent: "end" }}>
            <div
              className="elementsModal"
              style={{ marginRight: "10px", gap: "5px" }}
            >
              <div>Monto: </div>
              <div>
                <CurrencyInput
                  style={{ width: "105px" }}
                  className="input-table"
                  disabled
                  value={totalMonto.toFixed(2)}
                />
              </div>
            </div>
            <div className="elementsModal elementRight" style={{ gap: "5px" }}>
              <div>Prima:</div>
              <div>
                <CurrencyInput
                  style={{ width: "105px" }}
                  className="input-table"
                  disabled
                  value={totalPrima.toFixed(2)}
                />
              </div>
            </div>
          </div>
        </div>
      </TableContainer>
      <div
        style={{
          display: "flex",
          marginLeft: "5px",
          marginRight: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
          Aceptar
        </Button>
      </div>
    </div>
  );
}
