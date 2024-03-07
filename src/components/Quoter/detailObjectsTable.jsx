import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import "../../styles/moddalForm.scss";
import "../../styles/detailQuoter.scss";
import CloseIcon from "@mui/icons-material/Close";
import CurrencyInput from "../../utils/currencyInput";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ProtectionDetailTable from "./protectionDetailTable";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import {
  LS_PRODUCTO,
  LS_RAMO,
  LS_CLASIFICACIONAMPARO,
  LS_TABLAAMPARO,
  LS_TABLASECCIONES,
} from "../../utils/constantes";
import IncendioService from "../../services/IncencioService/IncendioService";

import { isNumber } from "@mui/x-data-grid/internals";
import Swal from "sweetalert2";

function createData(
  id,
  cobertura,
  monto,
  tasa,
  prima,
  titulo,
  sumaCapital,
  objCheck,
  disableCheck,
  tasaMinima,
  amparo,
  grupoAmparo,
  montoFijo,
  valMaximo,
  inventario,
  tasaReadOnly,
  montoReadOnly,
  primaFija,
  primaminima
) {
  return {
    id,
    cobertura,
    monto,
    tasa,
    prima,
    titulo,
    sumaCapital,
    objCheck,
    disableCheck,
    tasaMinima,
    amparo,
    grupoAmparo,
    montoFijo,
    valMaximo,
    inventario,
    tasaReadOnly,
    montoReadOnly,
    primaFija,
    primaminima,
  };
}

const rows = [];

const headCells = [
  {
    id: "accion",
    numeric: false,
    disablePaadding: false,
    label: "Acción",
  },
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "#",
  },
  {
    id: "cobertura",
    numeric: false,
    disablePadding: false,
    label: "Cobertura",
  },
  {
    id: "monto",
    numeric: true,
    disablePadding: false,
    label: "Monto",
  },
  {
    id: "tasa",
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

export default function DetailObjectsTable({ closeModalDetail, idSeccion }) {
  const [order] = React.useState("asc");
  const [orderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(30);
  const [openModal, setOpenModal] = React.useState(false);
  const [currentId, setCurrentId] = React.useState(null);
  const [editableRows, setEditableRows] = React.useState(rows);
  const [rows1, setRows] = React.useState(rows);
  const producto = JSON.parse(localStorage.getItem(LS_PRODUCTO));
  const [openBackdrop2, setOpenBackdrop] = React.useState(false);
  const ramo = JSON.parse(localStorage.getItem(LS_RAMO));
  const clasificacionAmparo = JSON.parse(
    localStorage.getItem(LS_CLASIFICACIONAMPARO)
  );
  const idSelected = idSeccion;
  // Nuevo estado para rastrear los valores editables
  const [editableValues, setEditableValues] = React.useState(
    rows1.map((row) => ({ monto: row.monto, tasa: row.tasa, prima: row.prima }))
  );

  const [jsonData, setJsonData] = React.useState(rows1); // Estado para los datos
  const [totalMonto, setTotalMonto] = React.useState(0);
  const [totalPrima, setTotalPrima] = React.useState(0);

  React.useEffect(() => {
    console.log("Id Seccion: " + idSelected);
    printClasificacionAmparo(ramo, producto, clasificacionAmparo);
    setEditableValues(
      rows1.map((row) => ({
        monto: row.monto,
        tasa: row.tasa,
        prima: row.prima,
      }))
    );
  }, []);

  React.useEffect(() => {
    console.log(rows1);
    if (rows1 && rows1.length > 0) {
      setEditableValues(
        rows1.map((row) => ({
          monto: row.monto,
          tasa: row.tasa,
          prima: row.prima,
        }))
      );
    }
    setEditableRows(rows1);
  }, [rows1]);

  React.useEffect(() => {
    const totalMonto = jsonData.reduce(
      (acc, item) => acc + parseFloat(item.monto),
      0
    );
    const totalPrima = jsonData.reduce(
      (acc, item) => acc + parseFloat(item.prima),
      0
    );
    // Actualiza el estado totalMonto
    setTotalMonto(totalMonto);
    setTotalPrima(totalPrima);
  }, [jsonData]); // Observa cambios en jsonData

  React.useEffect(() => {
    if (jsonData && jsonData.length > 0) {
      const newJsonData = jsonData.map((value, index) => {
        if (value.inventarioDetalleAmparo) {
          // Asegúrate de que protectionDetailMonto está correctamente definido
          const inventarioDetalleAmparo = value.inventarioDetalleAmparo; // Debes obtener este valor de alguna parte
          return {
            ...value,
            monto: inventarioDetalleAmparo.MontoDetalleAmparo,
          };
        } else {
          return value;
        }
      });

      // Solo actualiza el estado si realmente hay un cambio para evitar bucles infinitos
      if (JSON.stringify(newJsonData) !== JSON.stringify(jsonData)) {
        setJsonData(newJsonData);
      }
    }
    calculaTblAmparos();
  }, [jsonData]);

  // function createData(id, ramo, descripcion, monto, tasa, prima)
  const printClasificacionAmparo = async (ramo, producto, amparo) => {
    let result = [];
    try {
      let clasificacionAmparo = [];
      let count = 0;
      let tablaAmparo = [];

      let tablaA = JSON.parse(localStorage.getItem(LS_TABLASECCIONES));

      tablaA = tablaA.find((row) => row.id === amparo);
      console.log(tablaA);

      if (Array.isArray(tablaA.Amparo)) {
        tablaAmparo = tablaA.Amparo;
      }

      clasificacionAmparo = await IncendioService.fetchAmparoIncendios(
        ramo,
        producto,
        amparo
      );

      if (tablaAmparo.length !== 0) {
        result = tablaAmparo;
      } else {
        console.log(clasificacionAmparo);
        if (clasificacionAmparo.codigo === 500) {
          Swal.fire({
            title: "Error!",
            text: clasificacionAmparo.message,
            icon: "error",
            confirmButtonText: "Ok",
          });
          closeModalDetail("true");
          return;
        }

        Object.keys(clasificacionAmparo.data[0]).forEach((key) => {
          const tituloObj = createData(
            count++,
            key.replace("&nbsp;", " ").trim(),
            0,
            "",
            0,
            true,
            "",
            false,
            false,
            0,
            "",
            "",
            "",
            0,
            false,
            false,
            false
          );
          result.push(tituloObj);
          console.log(key);
          if (clasificacionAmparo.data[0][key]) {
            const items = clasificacionAmparo.data[0][key].map(
              (item, index) => {
                const montoValue =
                  item.inpMonto && isNaN(item.inpMonto.value)
                    ? parseFloat(item.inpMonto.value.replace(/,/g, ""))
                    : 0.0;
                const montoSumaCapitalValue = item.inpMonto.sumacapital;
                const tasaValue =
                  item.inpTasa && !isNaN(item.inpTasa.value)
                    ? item.inpTasa.value === ""
                      ? (0).toFixed(2)
                      : item.inpTasa.value
                    : item.inpTasa.value;
                const primaValue = item.inpPrima
                  ? parseFloat(item.inpPrima.value.replace(/,/g, ""))
                  : 0.0;
                const tasaMinimaValue =
                  item.inpTasa &&
                  isNaN(item.inpTasa.valoriginal) &&
                  item.inpTasa === "Sin Costo"
                    ? parseFloat(item.inpTasa.valoriginal.replace(/,/g, ""))
                    : 0.0;
                const objectCheck = item.inpCheck.checked;
                const disabledCheck = item.inpCheck.disabled;
                const amparo = item.inpMonto.amparo;
                const grupoAmparo = item.inpMonto.grupoamparo;
                const montoFijo = item.inpMonto.montofijo;
                const valMaximo = item.inpMonto.valmaximo;
                const inventario = item.Inventario === "true" ? true : false;
                const montoReadOnly =
                  item.inpMonto.readonly === "true" ? true : false;
                const tasaReadOnly =
                  item.inpTasa.readonly === "true" ? true : false;
                const primaFija =
                  item.inpPrima.primafija === "S" ? true : false;
                const primaminima = item.inpPrima.primaminima;

                console.log(item.inpPrima.value);
                console.log(isNaN(item.inpPrima.value));
                console.log(primaValue);

                return createData(
                  count++,
                  item.inpDetalle.value,
                  montoValue,
                  tasaValue,
                  primaValue,
                  false,
                  montoSumaCapitalValue,
                  objectCheck,
                  disabledCheck,
                  tasaMinimaValue,
                  amparo,
                  grupoAmparo,
                  montoFijo,
                  valMaximo,
                  inventario,
                  tasaReadOnly,
                  montoReadOnly,
                  primaFija,
                  primaminima
                );
              }
            );
            result.push(...items);
          }
        });
      }

      console.log(result);
      const newResult = [...result]; // Para arrays
      //Mapear result al id de la seccion actual
      setEditableValues(
        newResult.map((row) => ({
          monto: row.monto,
          tasa: row.tasa,
          prima: row.prima,
        }))
      );

      setRows(result);
      setJsonData(result);
      const newTotalMonto = result.reduce(
        (sum, row) => sum + parseFloat(row.monto),
        0
      );
      setTotalMonto(newTotalMonto);
      const newTotalPrima = result.reduce(
        (sum, row) => sum + (parseFloat(row.prima) || 0),
        0
      );
      setTotalPrima(newTotalPrima);
      return;
    } catch (error) {
      console.error("Error al obtener Amparo Incendio:", error);
    }
  };

  function tablaSeccionesMap() {
    const tablaSecciones = JSON.parse(localStorage.getItem(LS_TABLASECCIONES));
    console.log(tablaSecciones);
    //mapear id seccion con tabla secciones

    const newTablaAmparo = tablaSecciones.map((amparo, index) => {
      const newJsonData = jsonData.map((item, index) => ({
        ...item,
        monto: editableValues[index].monto,
        tasa: editableValues[index].tasa,
        prima: editableValues[index].prima,
      }));

      if (tablaSecciones[index].id === idSelected) {
        return {
          ...amparo,
          monto: String(totalMonto),
          prima: String(totalPrima),
          Amparo: newJsonData,
        };
      } else
        return {
          ...amparo,
        };
    });
    console.log(newTablaAmparo);
    const amparo = newTablaAmparo.find((row) => row.id === clasificacionAmparo);
    localStorage.setItem(LS_TABLASECCIONES, JSON.stringify(newTablaAmparo));
    if (amparo.Amparo) {
      localStorage.setItem(LS_TABLAAMPARO, JSON.stringify(amparo.Amparo));
    }

    const newTotalMonto = newTablaAmparo.reduce(
      (sum, row) => sum + parseFloat(row.monto),
      0
    );
    setTotalMonto(newTotalMonto);
    const newTotalPrima = newTablaAmparo.reduce(
      (sum, row) => sum + parseFloat(row.prima),
      0
    );
    setTotalPrima(newTotalPrima);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const closeModal = () => {
    handleSaveChanges();
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Función para manejar clics en las casillas de verificación de las filas
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

    // Actualiza el estado de objCheck para la fila seleccionada
    setJsonData((currentJsonData) => {
      return currentJsonData.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            objCheck: !row.objCheck, // Cambia el estado de objCheck
          };
        }
        return row;
      });
    });

    setEditableValues((currentJsonData) => {
      return currentJsonData.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            objCheck: !row.objCheck, // Cambia el estado de objCheck
          };
        }
        return row;
      });
    });

    setEditableRows((currentJsonData) => {
      return currentJsonData.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            objCheck: !row.objCheck, // Cambia el estado de objCheck
          };
        }
        return row;
      });
    });

    setRows((currentJsonData) => {
      return currentJsonData.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            objCheck: !row.objCheck, // Cambia el estado de objCheck
          };
        }
        return row;
      });
    });
  };

  const obtenerTasa = async (amparo, ramo, newMonto) => {
    try {
      return await IncendioService.getValTasaAmparoIncendio(amparo, newMonto);
    } catch (error) {
      return "Error al obtener tasa";
    }
  };

  const handleCellValueChange = async (event, index, field) => {
    handleOpenBackdrop();
    if (field === "monto") {
      await handleMontoChange(event, index, field);
      handleCloseBackdrop();
    }
  };

  const handleMontoChange = async (event, index, field) => {
    const amparo = event.target.getAttribute("data-amparo");
    const grupoAmparo = event.target.getAttribute("data-grupo-amparo");
    const montofijo = event.target.getAttribute("data-montofijo");
    const valmaximo = parseFloat(event.target.getAttribute("data-valmaximo"));
    const newValue = event.target.value;
    let numericValue = parseFloat(newValue.replace(/[^\d.-]/g, ""));

    // Asegúrate de que newMonto no es NaN
    if (isNaN(numericValue)) {
      numericValue = 0;
    }

    let montoPrincipal = 0;
    let permitirCambio = true;
    let newTasa = 0;
    if (amparo === grupoAmparo) {
      // Lógica si el amparo es el mismo que el grupo de amparo

      const tasa = await obtenerTasa(amparo, ramo, numericValue);
      console.log(tasa);
      newTasa = tasa.data;
      console.log("Tasa de fetch:" + newTasa);

      permitirCambio = true;
    } else if (montofijo === "N" && valmaximo > 0) {
      if (grupoAmparo !== "") {
        const montoPrincipalRow = editableRows.find(
          (row) => row.amparo === grupoAmparo
        );
        montoPrincipal = montoPrincipalRow
          ? parseFloat(montoPrincipalRow.monto)
          : 0;
      }
      console.log(grupoAmparo);
      console.log(amparo);
      if (grupoAmparo === "") {
        if (numericValue > valmaximo) {
          Swal.fire({
            title: "Error!",
            text: `El monto no puede ser mayor a ${valmaximo.toFixed(2)}`,
            icon: "error",
            confirmButtonText: "Ok",
          });
          permitirCambio = true;
          numericValue = valmaximo;
          console.log(`El monto no puede ser mayor a ${valmaximo.toFixed(2)}`);
        }
      } else if (montoPrincipal === 0) {
        console.log("El valor principal es 0.00");

        Swal.fire({
          title: "Error!",
          text: `El valor principal es 0.00`,
          icon: "error",
          confirmButtonText: "Ok",
        });

        permitirCambio = false;
      } else {
        const valMaximoCalculado = montoPrincipal * (valmaximo / 100);
        if (numericValue > valMaximoCalculado) {
          console.log(
            `El monto no puede superar el ${valmaximo}% del cobertura principal`
          );

          Swal.fire({
            title: "Error!",
            text: `El monto no puede superar el ${valmaximo}% del cobertura principal`,
            icon: "error",
            confirmButtonText: "Ok",
          });

          permitirCambio = false;
        }
      }
    }

    if (permitirCambio) {
      setEditableValues((currentValues) => {
        const newValues = [...currentValues];
        newValues[index][field] = numericValue;
        newValues[index]["tasa"] = newTasa;
        setJsonData((currentJsonData) => {
          const newJsonData = [...currentJsonData];
          newJsonData[index][field] = numericValue;
          newJsonData[index]["tasa"] = newTasa;
          // Puedes poner aquí tus console.log para verificar los datos actualizados
          setEditableRows((currentEditableRows) => {
            const newEditableRows = [...currentEditableRows];
            newEditableRows[index][field] = numericValue;
            newEditableRows[index]["tasa"] = newTasa;
            return newEditableRows;
          });
          return newJsonData;
        });
        return newValues;
      });

      const newEditableValues = [...editableValues];
      // Llamar a calculaTblAmparos para recalcular los totales
      calculaTblAmparos();

      setEditableRows(newEditableValues);
      const total = jsonData.reduce(
        (acc, item) => parseFloat(acc) + parseFloat(item.monto),
        0
      );
      setTotalMonto(total);
      const totalPrima = jsonData.reduce(
        (acc, item) => parseFloat(acc) + parseFloat(item.prima),
        0
      );
      setTotalPrima(totalPrima);
      console.log("*****************");
      console.log(jsonData);

      const campoTasa = document.getElementById("idTasa" + index);
      const eventoSimulado = {
        target: campoTasa,
      };

      handleTasaBlur(eventoSimulado, index);
    } else {
      const newEditableValues = [...editableValues];
      newEditableValues[index][field] = 0;
      setEditableValues(newEditableValues);
    }
  };

  React.useEffect(() => {
    if (!openModal && currentId) {
      console.log("*************************");
      const campoMonto = document.getElementById("idMonto" + currentId);
      const eventoSimulado = {
        target: campoMonto,
      };
      console.log(campoMonto);
      console.log(eventoSimulado);
      handleMontoChange(eventoSimulado, currentId, "monto");
    }
  }, [openModal, currentId]);

  const handleTasaBlur = (event, index) => {
    handleOpenBackdrop();
    let newTasa = parseFloat(event.target.value);
    if (isNaN(newTasa)) {
      newTasa = 0;
    }
    if (jsonData[index].tasa === "Sin Costo") {
      handleCloseBackdrop();
      return;
    }

    const tasaMinima = parseFloat(
      event.target.getAttribute("data-tasa-minima")
    );
    const amparo = event.target.getAttribute("data-amparo");
    const grupoAmparo = event.target.getAttribute("data-grupo-amparo");
    console.log("New Tasa: " + newTasa);
    console.log("Tasa minima: " + tasaMinima);
    // Verificar si la nueva tasa es menor que la tasa mínima
    if (newTasa < tasaMinima && tasaMinima) {
      Swal.fire({
        title: "Error!",
        text: `La tasa no puede ser menor que ${tasaMinima.toFixed(2)}`,
        icon: "error",
        confirmButtonText: "Ok",
      });
      alert(`La tasa no puede ser menor que ${tasaMinima.toFixed(2)}`);
      newTasa = tasaMinima; // Asegúrate de que la tasa no sea menor que la mínima
      handleCloseBackdrop();
      return;
    }

    // Actualizar la tasa en el estado para la fila actual
    const newEditableValues = [...editableValues];
    newEditableValues[index].tasa = newTasa;

    // Si el amparo de la fila actual es el mismo que el grupo de amparo, actualiza todas las filas correspondientes
    if (amparo === grupoAmparo) {
      newEditableValues.forEach((value, idx) => {
        if (
          editableRows[idx].grupoAmparo === grupoAmparo &&
          editableRows[idx].tasa !== "Sin Costo" &&
          editableRows[idx].grupoAmparo !== ""
        ) {
          value.tasa = newTasa; // Actualiza la tasa de todas las filas relacionadas
        }
      });
    }

    setEditableValues(newEditableValues); // Actualiza el estado de los valores editables
    setEditableValues((currentValues) => {
      const newValues = [...currentValues];
      newValues[index].tasa = newTasa;
      if (amparo === grupoAmparo) {
        newValues.forEach((value, idx) => {
          if (
            currentValues[idx].grupoAmparo === grupoAmparo &&
            editableRows[idx].tasa !== "Sin Costo"
          ) {
            value.tasa = newTasa;
          }
        });
      }
      setJsonData((currentJsonData) => {
        const newJsonData = [...currentJsonData];
        newJsonData[index].tasa = newTasa;
        if (amparo === grupoAmparo) {
          newJsonData.forEach((item, idx) => {
            if (
              item.grupoAmparo === grupoAmparo &&
              editableRows[idx].tasa !== "Sin Costo"
            ) {
              item.tasa = newTasa;
            }
          });
        }
        return newJsonData;
      });
      return newValues;
    });
    calculaTblAmparos();
    handleCloseBackdrop();
  };

  const calculaTblAmparos = () => {
    let newTotalMonto = 0;
    let newTotalPrima = 0;

    const newJsonData = jsonData.map((row) => {
      let { monto, tasa, prima, objCheck, primaFija } = row;


      // Calcular la prima solo si objCheck es true
      let calculatedPrima = 0;

      tasa !== "Sin Costo"
        ? (calculatedPrima =
            objCheck && !primaFija ? (parseFloat(monto) * tasa) / 100 : prima)
        : (calculatedPrima = 0);

      // Actualizar totalMonto y totalPrima solo si objCheck es true
      if (objCheck) {
        newTotalMonto += monto;
        newTotalPrima += calculatedPrima;
      }

    

      if (primaFija) {
        return {
          ...row,
          prima: prima,
        };
      }

      // Devolver la fila actualizada con la prima calculada
      return {
        ...row,
        prima: calculatedPrima,
      };
    });

    // Actualiza el estado con los nuevos datos y totales
    setTotalMonto(newTotalMonto);
    setTotalPrima(newTotalPrima);
    setEditableRows(newJsonData);

    // También actualiza editableValues si es necesario para reflejar las primas calculadas
    setEditableValues(
      newJsonData.map((row) => ({
        monto: row.monto,
        tasa: row.tasa,
        prima: row.prima,
      }))
    );
  };

  const handleTasaChange = (event, index) => {
    handleOpenBackdrop();
    let numericValue = parseFloat(event.target.value.replace(/[^\d.-]/g, ""));
    if (isNaN(numericValue)) {
      numericValue = 0;
    }

    if (jsonData[index].tasa === "Sin Costo") {
      handleCloseBackdrop();
      return;
    }

    const newTasa = event.target.value; // Add validation if needed
    setEditableValues((currentValues) => {
      const newValues = [...currentValues];
      newValues[index].tasa = newTasa;
      return newValues;
    });
    handleCloseBackdrop();
  };

  const handleOpenModal = (id) => {
    localStorage.setItem(LS_TABLAAMPARO, JSON.stringify(jsonData));
    setCurrentId(id);
    setOpenModal(true);
  };

  const handleSaveChanges = () => {
    // Actualizar los valores editables en el estado principal (editableRows)
    const newEditableRows = editableRows.map((row, index) => ({
      ...row,
      monto: editableValues[index].monto,
      tasa: editableValues[index].tasa,
      prima: (editableValues[index].monto * editableValues[index].tasa) / 100,
    }));
    setEditableRows(newEditableRows);
    console.log(newEditableRows);
    const newJsonData = jsonData.map((item, index) => ({
      ...item,
      monto: editableValues[index].monto,
      tasa: editableValues[index].tasa,
      prima: (editableValues[index].monto * editableValues[index].tasa) / 100,
    }));
    console.log(newJsonData);
    tablaSeccionesMap();
    closeModalDetail("true");
  };

  // Manejador para cerrar el modal
  const handleCloseModal = async () => {
  
    const tablaAmparoModal = JSON.parse(localStorage.getItem(LS_TABLAAMPARO));
    await setJsonData(tablaAmparoModal);
    await setEditableRows(tablaAmparoModal);
    await setEditableValues(tablaAmparoModal);
   
    setOpenModal(false);
  };

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows1, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows1] // Asegúrate de incluir rows1 aquí
  );

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

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
          style={{ overflow: "hidden", padding: "0px", paddingBottom: "20px" }}
          className="dialog-height-content"
        >
          {/* Componente del formulario */}
          <ProtectionDetailTable
            closeModalDetail={handleCloseModal}
            idProtectionDetail={currentId}
            style={{ width: "80%" }}
          />
        </DialogContent>
      </Dialog>
      <Backdrop sx={{ color: "#fff", zIndex: "9000" }} open={openBackdrop2}>
        <CircularProgress color="inherit" />
      </Backdrop>
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
        <div>Detalle de Amparo</div>
        <div onClick={closeModal}>
          {" "}
          <CloseIcon />
        </div>
      </div>
      <TableContainer
        style={{ overflow: "auto", height: "100%", padding: "20px" }}
      >
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size="small"
          style={{ height: 50 }}
        >
          <EnhancedTableHead rowCount={rows.length} />
          <TableBody>
            {visibleRows.map((row, index) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return !row.titulo ? (
                <StyledTableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  selected={isItemSelected}
                  sx={{ cursor: "pointer" }}
                  key={row.id}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      onClick={(event) => handleClick(event, row.id)}
                      color="primary"
                      checked={row.objCheck}
                      disabled={row.disableCheck}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                      key={row.id}
                    />
                  </TableCell>
                  <TableCell align="left">
                    {row.inventario ? (
                      <EditIcon onClick={() => handleOpenModal(row.id)} />
                    ) : null}
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

                  <TableCell align="right">
                    {/* Campo editable con CurrencyInput */}
                    <CurrencyInput
                      className="input-table inpTblAmpIncBscMonto"
                      value={
                        editableValues[index].monto
                          ? editableValues[index].monto.toFixed(2)
                          : 0
                      }
                      // value={editableValues[index].monto.toFixed(2)}
                      id={"idMonto" + index}
                      onBlur={(event) =>
                        handleCellValueChange(event, index, "monto")
                      }
                      disabled={row.objCheck && !row.inventario ? false : true}
                      data-amparo={row.amparo}
                      data-grupo-amparo={row.grupoAmparo}
                      data-montofijo={row.montoFijo}
                      data-valmaximo={row.valMaximo}
                      readOnly={row.montoReadOnly}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {/* Campo editable con CurrencyInput */}
                    <input
                      type="text"
                      className="input-table"
                      id={"idTasa" + index}
                      data-tasa-minima={row.tasaMinima}
                      data-amparo={row.amparo}
                      data-grupo-amparo={row.grupoAmparo}
                      value={
                        editableValues[index].tasa !== "Sin Costo" &&
                        isNumber(editableValues[index].tasa)
                          ? editableValues[index].tasa.toFixed(2)
                          : editableValues[index].tasa
                      }
                      onBlur={(event) => handleTasaBlur(event, index)}
                      onChange={(event) => handleTasaChange(event, index)}
                      disabled={row.objCheck && !row.inventario ? false : true}
                      readOnly={row.tasaReadOnly}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {/* Campo editable con CurrencyInput */}
                    <CurrencyInput
                      className="input-table"
                      id={"idPrima" + index}
                      value={
                        editableValues[index].prima
                          ? editableValues[index].prima
                          : 0
                      }
                      disabled
                      data-prima-fija={row.primaFija}
                      data-prima-minima={row.primaminima}
                      onChange={(event) =>
                        handleCellValueChange(event, index, "prima")
                      }
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
      </TableContainer>
      <div
        className="paginationResponsive"
        style={{ justifyContent: "space-between", gap: "15px" }}
      >
        <TablePagination
          style={{ justifySelf: "flex-start" }}
          rowsPerPageOptions={[10, 25, 30]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          labelRowsPerPage="Filas por pagina"
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <div
          style={{ display: "flex", justifyContent: "end", flexWrap: "wrap" }}
        >
          <div className="elementsModal" style={{ marginRight: "10px" }}>
            <div>Monto: </div>
            <div>
              <CurrencyInput
                style={{ width: "105px" }}
                className="input-table"
                value={totalMonto.toFixed(2)}
              />
            </div>
          </div>
          <div className="elementsModal elementRight">
            <div>Prima:</div>
            <div>
              <CurrencyInput
                style={{ width: "105px" }}
                className="input-table"
                value={totalPrima.toFixed(2)}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginLeft: "5px",
          marginRight: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button variant="contained" color="primary" onClick={closeModal}>
          Aceptar
        </Button>
      </div>
    </div>
  );
}
