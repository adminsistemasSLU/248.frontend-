import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel"
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Grid, Snackbar, Alert, AlertTitle } from '@mui/material';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tooltip from "@mui/material/Tooltip";
import CurrencyInput from "../../utils/currencyInput";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import Backdrop from "@mui/material/Backdrop";
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from "@mui/material/CircularProgress";
import { visuallyHidden } from "@mui/utils";
import "../../styles/dialogForm.scss";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from '@mui/icons-material/Download';
import BaldosasService from "../../services/BaldosasService/BaldosasService"
import ComboService from "../../services/ComboService/ComboService";

import {
  DATOS_PERSONALES_STORAGE_KEY,
  LS_COTIZACION,
  LS_PRODUCTO,
  LS_RAMO,
  USER_STORAGE_KEY,
  DATOS_PAGO_STORAGE_KEY,
  LS_IDCOTIZACIONVIDA,
  LS_PREGUNTASVIDA,
  LS_DOCUMENTOSVIDA,
  LS_FPAGO,
  LS_PREGRESPONDIDAS,
  LS_TPRESTAMO,
  LS_DATAVIDASEND,
  DATOS_AGENTES,
  USERS_FEATURES_STORAGE_KEY,

} from "../../utils/constantes";
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
  ramoId,
  reason,
  fechaExportacion,
  identificacion,
  usuario,
  broker,
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
    ramoId,
    reason,
    fechaExportacion,
    identificacion,
    usuario,
    broker,
  };
}

function descendingComparator(a, b, orderBy) {
  const valueA = a[orderBy];
  const valueB = b[orderBy];

  // Intentar parsear como fechas
  const dateA = Date.parse(valueA);
  const dateB = Date.parse(valueB);

  if (!isNaN(dateA) && !isNaN(dateB)) {
    // Si ambos son fechas válidas, compararlas
    return dateB - dateA;
  }

  // Si uno es fecha válida y el otro no, tratar la fecha como mayor
  if (!isNaN(dateA) && isNaN(dateB)) {
    return -1;
  }
  if (isNaN(dateA) && !isNaN(dateB)) {
    return 1;
  }

  // Si no son fechas, manejar como números o cadenas
  if (valueB < valueA) {
    return -1;
  }
  if (valueB > valueA) {
    return 1;
  }

  // Igualdad
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


function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, headCells } = props;
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
            sx={{ width: headCell.width || '130px' }}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
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
            ) : (
              headCell.label // Solo el texto sin `TableSortLabel`
            )}
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
  headCells: PropTypes.array.isRequired,
};

const EnhancedTableToolbar = React.memo(({ filter, setFilter }) => {
  const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },

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
        Usuario: <span style={{ color: 'black' }}>{user.des_usuario} </span>
      </Typography>
      <Tooltip title="Filter list" style={{ display: 'flex', alignContent: 'center' }}>
        <TextField
          type="text"
          size="small"
          variant="standard"
          style={{ height: '15px', visibility: 'hidden' }}
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Buscar..."

          sx={{ marginLeft: "16px", marginTop: '5px', borderRadius: "4px", height: '15px' }}
        />
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
});



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
  const [agentes, setAgentes] = React.useState([]);

  const [apruebaCotizacion, setApruebaCotizacion] = React.useState([]);

  const [openSnack, setOpenSnack] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const RAMOINCENDIO = "1";
  // const RAMOVEHICULO = "3";
  const RAMOVIDA = "9";
  const [usuarioInterno, setUsuarioInterno] = React.useState([]);
  const [estado, setEstado] = React.useState([]);
  const [ramo, setRamo] = React.useState([]);
  const [producto, setProducto] = React.useState([]);
  const [usuarioBusqueda, setUsuarioBusqueda] = React.useState([]);
  const [filters, setFilters] = React.useState({
    estado: '',
    producto: '',
    ramo: '',
    cliente: '',
    usuarioBusq: null,
    broker: null,
  });

  //Filtrar tabla
  const [filter, setFilter] = React.useState("");
  const getHeadCells = (rows = []) => {
    const isRamo3 = rows.some(row => row.ramoId != 3);

    const commonHeadCells = [
      {
        id: "number",
        numeric: false,
        disablePadding: true,
        label: "#",
        sortable: true
      },
      {
        id: "codigo",
        numeric: false,
        disablePadding: true,
        label: isRamo3 ? "Nro de Certificado" : "Nro de Cotización",
        sortable: false
      },
      { id: "identificacion", numeric: false, disablePadding: false, label: "Identificación", sortable: true },
      { id: "ramo", numeric: false, disablePadding: false, label: "Ramo", sortable: false },
      { id: "producto", numeric: false, disablePadding: false, label: "Producto", sortable: true },
      { id: "cliente", numeric: false, disablePadding: false, label: "Cliente", sortable: true },
      { id: "amount", numeric: true, disablePadding: false, label: "Monto", sortable: false },
    ];

    if (isRamo3) {
      commonHeadCells.push(
        { id: "rate", numeric: true, disablePadding: false, label: "Tasa", sortable: false }
      );
    }

    commonHeadCells.push(
      { id: "prima", numeric: true, disablePadding: false, label: "Prima", sortable: false },
      { id: "fechaCreacion", numeric: true, disablePadding: false, label: "Fecha Creación", width: '170px', sortable: true }
    );

    if (isRamo3) {
      commonHeadCells.push(
        { id: "fechaExportacion", numeric: true, disablePadding: false, label: "Fecha Exportación", width: '170px', sortable: false },
      );
    }

    commonHeadCells.push(
      { id: "state", numeric: true, disablePadding: false, label: "Estado", sortable: true },
    );

    if (isRamo3) {
      commonHeadCells.push(
        { id: "reason", numeric: false, disablePadding: false, label: "Motivo", sortable: true },
      );
    }
    commonHeadCells.push(
      { id: "broker", numeric: true, disablePadding: false, label: "Broker", sortable: true },
      { id: "usuario", numeric: true, disablePadding: false, label: "Usuario", sortable: true },
      { id: "action", numeric: true, disablePadding: false, label: "Acción", sortable: false },
    );

    return commonHeadCells;
  };


  const headCells = getHeadCells(rows);
  const cargarRamo = async () => {
    try {
      const baldosas = await BaldosasService.fetchBaldosas();

      if (baldosas && baldosas.data) {
        setRamo(baldosas.data.BaldosaServisios);
      }
    } catch (error) {
      console.error("Error al obtener baldosas:", error);
    }
  };

  const cargarProducto = async (ramo) => {
    try {
      const subbaldosas = await BaldosasService.fetchSubBaldosas(ramo, '');
      if (subbaldosas && subbaldosas.data) {
        setProducto(subbaldosas.data.BaldosaSubServisios);
      }
    } catch (error) {
      console.error("Error al obtener subbaldosas:", error);
    }
  };

  const cargarEstado = async () => {
    try {
      const estado = await ComboService.fetchComboEstado();
      if (estado && estado.data) {
        setEstado(estado.data);
      }
    } catch (error) {
      console.error("Error al obtener baldosas:", error);
    }
  };

  const cargarUsuarioBusqueda = async () => {
    try {
      const usuarioBusqueda = await ComboService.fetchComboUsuarioBusqueda();
      if (usuarioBusqueda && usuarioBusqueda.data) {
        setUsuarioBusqueda(usuarioBusqueda.data);
      }

      let usuario = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
      if (usuario.tip_usuario == "B") {
        setFilters((prevFilters) => ({
          ...prevFilters,
          usuarioBusqueda: usuario.id,
        }));
      }
    } catch (error) {
      console.error("Error al obtener Usuario busqueda:", error);
    }
  };

  const filteredRows = rows.filter((row) => {
    return (
      row.ramo.toLowerCase().includes(filter.toLowerCase()) ||
      row.producto.toLowerCase().includes(filter.toLowerCase()) ||
      row.cliente.toLowerCase().includes(filter.toLowerCase()) ||
      row.state.toLowerCase().includes(filter.toLowerCase()) ||
      row.createdDate.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const handleSetFilter = React.useCallback((value) => {

    setFilter(value);
  }, []);


  useEffect(() => {
    let usuario = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    setUsuarioInterno(usuario.tip_usuario);
    const cargarOpciones = async () => {
      
      await cargarEstado();
      await cargarRamo();
      await cargarUsuarioBusqueda();
      cargarAgentesDesdeLocalStorage()
    };

    let usuarioAtributo = JSON.parse(localStorage.getItem(USERS_FEATURES_STORAGE_KEY) || "[]");
    const containsAprobarEmision = usuarioAtributo.some(item => item.tipo === "aprobar_emision") && usuario.tip_usuario=='I';
    setApruebaCotizacion(containsAprobarEmision);

    cargarOpciones();
    eliminardatos();
  }, []);

  function eliminardatos() {
    sessionStorage.removeItem(LS_PREGUNTASVIDA);
    sessionStorage.removeItem(LS_DOCUMENTOSVIDA);
    sessionStorage.removeItem(LS_FPAGO);
    sessionStorage.removeItem(LS_PREGRESPONDIDAS);
    sessionStorage.removeItem(LS_TPRESTAMO);
    sessionStorage.removeItem(LS_DATAVIDASEND);
    sessionStorage.removeItem(LS_COTIZACION);
    sessionStorage.removeItem(LS_PRODUCTO);
    sessionStorage.removeItem(LS_RAMO);
  }

  async function cargarTabla() {
    handleOpenBackdrop();
    await cargarEstado();
    await cargarRamo();
    await cargarUsuarioBusqueda();
    const objetoSeguro = await cargarCotizacion(filters.ramo, filters.producto, filters.estado, filters.broker, filters.usuarioBusq);

    if (objetoSeguro) {
      let number = 1;
      const rowsObjetoAmparo = [];

      for (let item of objetoSeguro) {
        let tasa = 0;
        if (item.ramo === "9") {
          tasa = '-';
        } else {
          tasa = parseFloat(
            (item.total_prima / item.total_monto) * 100
          ).toFixed(2);

          tasa = isNaN(tasa) ? 0.0 : tasa;
          tasa = '%' + tasa;
        }

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
          item.ramo,
          item.motivo || "",
          item.fechaExportacion,
          item.clicedula,
          item.usuCodigo,
          item.agente,
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
    }

    handleCloseBackdrop();
  }

  const handleOpenQuoter = async (id, product, ramo, aplicacion = '') => {
    localStorage.setItem(LS_COTIZACION, id);
    localStorage.setItem(LS_PRODUCTO, product);
    localStorage.setItem(LS_RAMO, ramo);
    if (ramo == 9) {
      sessionStorage.setItem(LS_COTIZACION, id);
      sessionStorage.setItem(LS_PRODUCTO, product);
      sessionStorage.setItem(LS_RAMO, ramo);
    }

    if (aplicacion !== '') {
      sessionStorage.setItem(LS_IDCOTIZACIONVIDA, aplicacion);
    }
    const resultadoFiltrado = cotizacion.filter((item) => item.id === id);

    const dataFormaPago = resultadoFiltrado.map((item) => ({
      numpagos: item.numpagos,
      tipfacturacion: item.tipfacturacion,
      valentrada: item.valentrada,
      formapago: item.formapago,
      id: item.id,
    }));

    //Datos de pago de existir
    localStorage.setItem(
      DATOS_PAGO_STORAGE_KEY,
      JSON.stringify(dataFormaPago)
    );

    const data = cotizacion.map((item) => ({
      correo: item.clicorreo,
      apellido: item.cliapellido,
      identificacion: item.clicedula,
      nombre: item.clinombre,
      id: item.id,
    }));
    let datosPersonales = data.length > 0 ? data[0] : null;
    //Datos de personales obligatorios para coti vida
    if (datosPersonales) {
      localStorage.setItem(
        DATOS_PERSONALES_STORAGE_KEY,
        JSON.stringify(datosPersonales)
      );
    }

    if (ramo === RAMOVIDA) {
      //OPCIONES PARA ABRIR EL MODAL DE VIDA 
      window.location.href = `/quoter/life`;
    }

    if (ramo === RAMOINCENDIO) {
      //OPCIONES PARA ABRIR EL MODAL DE INCENDIO 
      window.location.href = `/quoter/pymes/`;
    }

  };

  const aprobarSolicitud = async (id) => {
    await aprobarCotizacion(id);
  };

  const aprobarCotizacion = async (id) => {
    const result = await Swal.fire({
      title: "¿Está seguro que desea aprobar la cotización?",
      text: "Por favor, ingrese un comentario antes de confirmar.",
      icon: "info",
      input: "textarea",  // Agrega un campo de texto para comentarios
      inputPlaceholder: "Escribe tu comentario aquí...",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "Debe ingresar un comentario";
        }
      },
    });

    try {
      if (result.isConfirmed) {
        const comentario = result.value;
        const idUsuario = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
        handleOpenBackdrop();
        const cotizacion = await QuoterService.fetchActualizaCotizacionGeneral(
          id,
          idUsuario.id,
          comentario
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

  const handleDeleteQuoter = async (id) => {
    await eliminarCotizacion(id);
  };

  const cargarCotizacion = async (ramo = '', producto = "", estado = '', idBroker = null, usuarioBusq = null) => {
    let userId = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    let dato = {
      usuario: userId.id,
      ramo: ramo,
      producto: producto,
      estado: estado,
      idBroker: idBroker,
      usuarioBusq: usuarioBusq,
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
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [filteredRows, order, orderBy, page, rowsPerPage]
  );

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const handleChange = (e) => {

    if (e.target.name === "ramo") {
      cargarProducto(e.target.value);
    }

    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });


  };

  const handleSearch = () => {
    if (!filters.ramo) {
      setErrorMessage("Se deben ingresar un filtro de ramo");
      setOpenSnack(true);
      return;
    }
    cargarTabla();
  };

  const handleExport = () => {
    let validar = true;
    if (!filters.ramo || filters.ramo === "") {
      setErrorMessage("Se deben ingresar un filtro de ramo");
      setOpenSnack(true);
      validar = false;
      return;
    }

    // if (filters.ramo != "3" && filters.estado == "S") {
    //   if (!filters.producto || filters.producto === "") {
    //     setErrorMessage("Se deben ingresar un filtro en producto");
    //     setOpenSnack(true);
    //     validar = false;
    //     return;
    //   }
    // }

    if (validar) {
      exportarTabla();
    }
  };

  async function exportarTabla() {
    if (filters.estado && filters.estado === 'S') {
      Swal.fire({
        title: "Información",
        text: 'Desea exportar las cotizaciones Aprobadas',
        icon: "info",
        confirmButtonText: "Ok",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
      }).then(async (result) => {
        if (result.isConfirmed) {
          handleOpenBackdrop();
          let userId = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
          let dato = {
            usuario: userId.id,
            ramo: filters.ramo,
            producto: filters.ramo != "3" ? filters.producto : 99999,
            estado: filters.estado
          };

          await QuoterService.fetchExportExcel(dato, filters.estado);

          handleCloseBackdrop();
          Swal.fire(
            "Exportado!",
            "Las cotizaciones han sido exportadas correctamente.",
            "success"
          ).then(() => {
            cargarTabla();
          });
          return;
        } else {
          Swal.fire(
            "Cancelado",
            "La exportación fue cancelada.",
            "error"
          );
        }
      });
    } else {
      handleOpenBackdrop();
      let userId = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
      let dato = {
        usuario: userId.id,
        ramo: filters.ramo,
        producto: filters.ramo != "3" ? filters.producto : 99999,
        estado: filters.estado
      };

      // Esperar la exportación normalmente
      await QuoterService.fetchExportExcel(dato, filters.estado);

      handleCloseBackdrop();
    }
  }

  const cargarAgentesDesdeLocalStorage = () => {
    const datosAgentes = localStorage.getItem(DATOS_AGENTES);
    if (datosAgentes) {
      try {
        const agentesGuardados = JSON.parse(datosAgentes);
        if (Array.isArray(agentesGuardados)) {
          setAgentes(agentesGuardados);
        }
      } catch (error) {
        console.error("Error al parsear DATOS_AGENTES:", error);
      }
    }
  };

  const handleComparativo = async (id) => {
    const link = document.createElement('a');
    console.log(`${process.env.PUBLIC_URL}/api/cotizacion_pdf/` + id);

    link.href = `${process.env.PUBLIC_URL}/api/cotizacion_pdf/` + id;
    link.download = 'comparativo.pdf';
    link.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ color: "#00a99e", mb: 2 }} xs={{ fontSize: 10 }}>Mis Cotizaciones</Typography>

      <Grid style={{ width: '90%', display: 'flex', justifyContent: 'center' }} spacing={2}>

        <Grid container spacing={2} justifyContent="center" sx={{ width: '90%' }}>
          <Grid item xs={8} md={2}>
            <TextField
              fullWidth
              id="cliente"
              name="cliente"
              label="Cliente"
              variant="standard"

              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            />
          </Grid>

          <Grid item xs={8} md={2}>
            <FormControl fullWidth>
              <InputLabel id="ramo-label">Ramo</InputLabel>
              <Select
                labelId="ramo-label"
                id="ramo"
                name="ramo"
                variant="standard"
                fullWidth
                value={filters.ramo}
                onChange={handleChange}
                label="Ramo"
              >
                <MenuItem value=""><em>Ninguno</em></MenuItem>
                {ramo.map((rm, index) => (
                  <MenuItem key={index} value={rm.ramo}>
                    {rm.titulo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* {filters.ramo != "3" && (
            <Grid item xs={8} md={2}>
              <FormControl fullWidth>
                <InputLabel id="producto-label">Producto</InputLabel>
                <Select
                  labelId="producto-label"
                  id="producto"
                  name="producto"
                  variant="standard"
                  fullWidth
                  value={filters.producto}
                  onChange={handleChange}
                  label="Producto"
                >
                  <MenuItem value=""><em>Ninguno</em></MenuItem>
                  {producto.map((pro, index) => (
                    <MenuItem key={index} value={pro.producto}>
                      {pro.titulo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )} */}

          <Grid item xs={8} md={2}>
            <FormControl fullWidth>
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                id="estado"
                name="estado"
                variant="standard"
                fullWidth
                value={filters.estado}
                onChange={handleChange}
                label="Estado"
              >
                <MenuItem value=""><em>Ninguno</em></MenuItem>
                {estado.map((est, index) => (
                  <MenuItem key={index} value={est.Codigo}>
                    {est.Nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {agentes.length > 0 && (
            <>
              <Grid item xs={8} md={2}>
                <FormControl fullWidth>
                  <InputLabel id="usuario-label">
                    {(usuarioInterno !== "B") && (
                      "Usuario"
                    )}
                  </InputLabel>
                  <Select
                    labelId="usuario-label"
                    id="usuario"
                    name="usuarioBusq"
                    variant="standard"
                    fullWidth
                    value={filters.usuarioBusq}
                    onChange={handleChange}
                    label="usuario"
                    disabled={usuarioInterno === "B"}
                  >
                    <MenuItem value=""><em>Ninguno</em></MenuItem>
                    {usuarioBusqueda.map((usu, index) => (
                      <MenuItem key={index} value={usu.id}>
                        {usu.usu_descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={8} md={2}>
                <FormControl fullWidth>
                  <InputLabel id="broker-label">Broker</InputLabel>
                  <Select
                    labelId="broker-label"
                    id="broker"
                    name="broker"
                    variant="standard"
                    fullWidth
                    value={filters.broker}
                    onChange={handleChange}
                    label="broker"
                  >
                    <MenuItem value={null}>
                      TODOS
                    </MenuItem>
                    {agentes.map((broker, index) => (
                      <MenuItem key={index} value={broker.clave}>
                        {`${broker.nombre}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>

      </Grid>

      <Grid style={{ width: '90%', paddingTop: '20px', display: 'flex', justifyContent: 'center' }} spacing={2}>
        <Grid item xs={8} md={2} style={{ paddingRight: '20px' }}>
          <Button variant="contained"
            style={{ top: "20%", backgroundColor: '#0099a8', color: "white", borderRadius: "5px" }}
            onClick={handleSearch}
            startIcon={<SearchIcon />}
          >
            Buscar</Button>
        </Grid>

        {usuarioInterno === "I" && (
          <Grid item xs={8} md={2}>
            <Button variant="contained"
              style={{ top: "20%", backgroundColor: '#0099a8', color: "white", borderRadius: "5px" }}
              onClick={handleExport}
              startIcon={<SaveAltIcon />}
            >
              Exportar
            </Button>
          </Grid>
        )}
      </Grid>
      <div style={{ width: "100%" }}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {/* Modal */}


        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={openSnack}
          autoHideDuration={5000}
          onClose={() => setOpenSnack(false)}
        >
          <Alert style={{ fontSize: "1em" }} severity="error">
            <AlertTitle style={{ textAlign: "left" }}>Error</AlertTitle>
            {errorMessage}
          </Alert>
        </Snackbar>

        <Box style={{ width: "100%" }} sx={{ width: "100%", marginTop: "12px" }}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <EnhancedTableToolbar filter={filter} setFilter={handleSetFilter} />
            {visibleRows.length === 0 ? (
              <Typography variant="body2" style={{ padding: "16px" }}>
                No hay registros en la tabla.
              </Typography>
            ) : (

              <TableContainer
                style={{ overflow: "auto", height: 300 }}
              >
                <Table stickyHeader
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
                    headCells={headCells}
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
                          <TableCell component="th" id={labelId} scope="row" padding="none">
                            {row.number}
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row" padding="none">
                            {row.id}
                          </TableCell>
                          <TableCell align="left">{row.identificacion}</TableCell>
                          <TableCell align="left">{row.ramo}</TableCell>
                          <TableCell align="left">{row.producto}</TableCell>
                          <TableCell align="left">{row.cliente}</TableCell>
                          <TableCell align="right">
                            {row.amount
                              ? (row.amount.includes('$')
                                ? row.amount
                                : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.amount))
                              : '$0.00'}

                          </TableCell>

                          {/* Renderizar "Tasa" y "Prima" solo si ramoId es 3 */}
                          {row.ramoId == 3 && (
                            <>
                              <TableCell align="right">
                                {row.prima}
                              </TableCell>
                            </>
                          )}
                          {row.ramoId != 3 && (
                            <>
                              <TableCell align="right">
                                {(row.rate || 0)}

                              </TableCell>
                              <TableCell align="right">
                                {row.prima ?
                                  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.prima)
                                  : '$0.00'}
                              </TableCell>
                            </>
                          )}

                          <TableCell align="right" sx={{ width: '140px' }}>
                            {row.createdDate}
                          </TableCell>
                          {row.ramoId != 3 && (
                            <>
                              <TableCell align="right">
                                {row.fechaExportacion}
                              </TableCell>
                            </>
                          )}
                          <TableCell align="center">
                            {row.state}
                          </TableCell>
                          {row.ramoId != 3 && (
                            <TableCell align="left">
                              <>
                                <Tooltip title={row.reason && row.reason.length > 50 ? row.reason : ""}>
                                  <span>
                                    {row.reason ? (row.reason.length > 50 ? `${row.reason.slice(0, 50)}...` : row.reason) : ""}
                                  </span>
                                </Tooltip>
                              </>
                            </TableCell>
                          )}


                          <TableCell align="right">{row.broker}</TableCell>
                          <TableCell align="right">{row.usuario}</TableCell>

                          <TableCell align="right">
                            {row.state !== "Cancelado" && row.state !== "Emitida" && row.ramoId != 3 && row.state !== 'Exportada' && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "end",
                                }}
                              >
                                <IconButton
                                  onClick={() =>
                                    handleOpenQuoter(row.id, row.productoId, row.ramoId, row.aplicacion)
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteQuoter(row.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </div>
                            )}

                            {row.ramoId == 3 && (
                              <IconButton onClick={() => handleComparativo(row.id)}>
                                <DownloadIcon />
                              </IconButton>
                            )}

                            {apruebaCotizacion && row.state == 'No Aprobado' && row.ramoId == 9 && (
                              <IconButton onClick={() => aprobarSolicitud(row.id)}>
                                <CheckCircleIcon />
                              </IconButton>
                            )}

                          </TableCell>
                        </StyledTableRow>
                      );
                    })}
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
    </div>
  );
}
