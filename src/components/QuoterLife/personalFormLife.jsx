import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef, useMemo
} from "react";
import dayjs, { Ls } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TextField, Grid, Alert, Snackbar, AlertTitle } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

//Tablas y estilos
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { Table, TableBody, TableContainer, TableHead, TableRow, useMediaQuery, useTheme } from '@mui/material';
import { styled } from "@mui/material/styles";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ComboService from "../../services/ComboService/ComboService";
import "../../styles/form.scss";
import ValidationUtils from "../../utils/ValiationsUtils";
import UsuarioService from "../../services/UsuarioService/UsuarioService";

import {
  LS_COTIZACION,
  USER_STORAGE_KEY,
  LS_PRODUCTO,
  LS_RAMO,
  LS_PREGUNTASVIDA,
  LS_DOCUMENTOSVIDA,
  LS_TABLACALC,
  LS_VIDAPOLIZA,
  LS_TABLAACTUALIZDA,
  PARAMETROS_STORAGE_KEY,
  LS_VIDACOBERTURA,
  LS_PROCESODATOSVIDA,
  DATOS_PERSONALES_STORAGE_KEY,
  LS_POLVIDAEDIT,
  LS_IDCOTIZACIONVIDA,
  LS_DATAVIDASEND,
  LS_DATOSPAGO,
  LS_FPAGO,
  LS_TPRESTAMO,
  API_SUBBALDOSAS
} from "../../utils/constantes";
import QuoterService from "../../services/QuoterService/QuoterService";
import { Button } from "@mui/base";
import LifeService from '../../services/LifeService/LifeService';
import QuestionModalLife from "./questionModalLife";
import CurrencyInput from "../../utils/currencyInput";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

let producto = localStorage.getItem(LS_PRODUCTO);
let ramo = JSON.parse(localStorage.getItem(LS_RAMO));

const StyledTableRow = styled(({ ...props }) => <TableRow {...props} />)(({ theme }) => ({
  "td, &:last-child th": {
    borderBottom: "1px solid black",
    padding: '0px',
  },
}));

const MemoizedStyledTableRow = React.memo(StyledTableRow);


const areEqual = (prevProps, nextProps) => {
  return prevProps.item === nextProps.item &&
    prevProps.index === nextProps.index &&
    prevProps.handleTableChange === nextProps.handleTableChange;
};
function formatedInput(numero) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numero);
}
const MemoizedMontoCell = React.memo(({ value, onChange }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <TableCell>
      <CurrencyInput
        className="input-table"
        onChange={onChange}
        value={(value) || ''}
        style={{
          border: '1px solid #ccc',
          width: '96%',
          height: '29px',
          borderRadius: '5px',
          fontSize: '16px',
        }}
      />
      {/* <TextField
        fullWidth
        value={(value) || ''}
        onChange={onChange}
        size={isSmallScreen ? 'small' : 'medium'}
        sx={{
          input: {
            padding: '4.5px 14px',
          }
        }}
      /> */}
    </TableCell>
  );
});

const MemoizedRow = React.memo(({ item, index, handleTableChange }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  function formatedInput(numero) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numero);
  }
  return (
    <MemoizedStyledTableRow key={index} sx={{ padding: 0 }}>
      <TableCell>
        <TextField
          fullWidth
          value={index + 1 || ''}
          readOnly
          disabled
          size={isSmallScreen ? 'small' : 'medium'}
          sx={{
            input: {
              padding: '4.5px 14px',
            }
          }}
        />
      </TableCell>
      <MemoizedMontoCell
        value={ValidationUtils.Valida_moneda(item.monto)}
        onChange={(e) => handleTableChange(e, index, 'monto')}
      />
      <TableCell>
        <TextField
          fullWidth
          value={item.tasa || ''}
          readOnly
          disabled
          size={isSmallScreen ? 'small' : 'medium'}
          sx={{
            input: {
              padding: '4.5px 14px',
            }
          }}
        />
      </TableCell>
      <TableCell>
        <TextField
          fullWidth
          value={formatedInput(item.prima) || ''}
          readOnly
          disabled
          size={isSmallScreen ? 'small' : 'medium'}
          sx={{
            input: {
              padding: '4.5px 14px',
            }
          }}
        />
      </TableCell>
    </MemoizedStyledTableRow>
  );
}, areEqual);

const PersonalFormLife = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    documentType: "C",
    identification: "",
    age: "",
    address: "",
    province: "",
    city: "",
    status: "",
    genero: 'M',
    country: '',
    ageCalculated: '',

    conyugetipo: "C",
    conyugenumero: "",
    conyugeapellido: "",
    conyugenombre: "",
    conyugefecha: "",
    conyugesexo: "",
    conyugeestadocivil: "",
    ageConyugueCalculated: '',
    countryConyugue: '',

    tipoProducto: "Z",
    inicioVigencia: "",
    finVigencia: "",
    vigencia: "",
    numPrestamo: "",
    prestamo: "",
    montodesempleo: "",

    primaTotal: "",
    prima: "",
    primaMensual: "",
    impuesto: "",
  });


  const [formDataTouched, setFormDataTouched] = useState({
    name: false,
    lastname: false,
    email: false,
    phone: false,
    documentType: false,
    identification: false,
    age: false,
    address: false,
    province: false,
    city: false,
    status: false,
    country: false,

    conyugetipo: false,
    conyugenumero: false,
    conyugeapellido: false,
    conyugenombre: false,
    conyugefecha: false,
    conyugesexo: false,
    conyugeestadocivil: false,

    tipoProducto: false,
    inicioVigencia: false,
    finVigencia: false,
    vigencia: false,
    numPrestamo: false,
    prestamo: false,
    montodesempleo: false,

    primaTotal: false,
    prima: false,
    primaMensual: false,
    impuesto: false,
  });
  const [formDataTabla, setFormDataTabla] = useState([
    { monto: '', tasa: '', prima: '', estado: '' }
  ]);

  const memoizedFormDataTabla = useMemo(() => formDataTabla, [formDataTabla]);

  const [openSnack, setOpenSnack] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openModal, setOpenModal] = React.useState(false);

  const [calculado, setCalculado] = useState([]);
  //Tabla para calculos
  const [tablecalc, setTablecalc] = useState([]);

  const [datosFactura, setDatosFactura] = useState([]);

  const maxDate = dayjs().subtract(18, "years");
  const [error, setError] = useState("");
  const [messageError, setmessageError] = useState("");
  const [errorCedula, setErrorCedula] = useState(false);
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState(maxDate);
  const [conyugueage, setConyugueAge] = useState("");
  const [inicioVigencia, setInicioVigencia] = useState(dayjs());
  const [finVigencia, setFinVigencia] = useState(dayjs());
  const [openBackdrop, setOpenBackdrop] = React.useState(true);
  const [NomnbreProducto, setNomnbreProducto] = useState("");

  const isMounted = useRef(false);
  //Combos
  const [estadoCivil, setEstadoCivil] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [country, setCountry] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [vigencia, setVigencia] = useState([]);
  const [t_prestamo, setTipoprestamo] = useState([]);
  //Constantes
  const CodigoComboCasado = "02";
  const CodigoComboUnionLibre = "05";
  const [datosCargados, setDatosCargados] = useState(false);
  const [cargarDataInicial, setcargarDataInicial] = useState(false);

  const calculateAge = (birthDate) => {
    const parsedDate = dayjs(birthDate);

    // Asegurarse de que parsedDate sea válido
    if (!parsedDate.isValid()) {
      console.error('Fecha inválida:', birthDate);
      return;
    }

    const birth = dayjs(birthDate);  // Parsear la fecha de nacimiento
    const now = dayjs();  // Fecha actual
    return now.diff(birth, 'year');  // Devolver la diferencia en años
  };

  const setAgeCalculate = (birthDate) => {
    const anio = calculateAge(birthDate);

    setAge(birthDate);

    setFormData((formData) => ({
      ...formData,
      ageCalculated: anio,
    }));
  };

  const setAgeConyugueCalculate = (birthDate) => {
    const age = calculateAge(birthDate);

    setConyugueAge(birthDate);
    setFormData((formData) => ({
      ...formData,
      ageConyugueCalculated: age,
    }));
  }

  const cargarDatos = async () => {
    if (datosCargados) return; // Prevenir cargas redundantes
    handleOpenBackdrop(true);
    const dataPersonal = await cargarCotizacion();
    if (isMounted.current) {
      setFormData((formData) => ({
        ...formData,
        name: dataPersonal[0].clinombre,
        lastname: dataPersonal[0].cliapellido,
        email: dataPersonal[0].clicorreo,
        phone: dataPersonal[0].clitelefono,
        documentType: dataPersonal[0].clitipcedula,
        identification: dataPersonal[0].clicedula,
        address: dataPersonal[0].clidireccion,
        genero: dataPersonal[0].cligenero,
        status: dataPersonal[0].cliestadocivil || "",
      }));
      const dateObject = dayjs(dataPersonal[0].clinacimiento, "YYYY/MM/DD");
      setAgeCalculate(dateObject);

      const datoscoyugue = JSON.parse(dataPersonal[0].datosconyugues);
      //Setear datos conyugue si los hay
      setFormData((formData) => ({
        ...formData,
        conyugeapellido: datoscoyugue?.apellidoConyuge || "",
        conyugenombre: datoscoyugue?.nombreConyuge || "",
        conyugenumero: datoscoyugue?.identificacion || "",
        conyugesexo: datoscoyugue?.genero || "0",
        conyugetipo: datoscoyugue?.tipo || "C",
        countryConyugue: datoscoyugue?.pais || "",
      }));

      const datosprestamo = JSON.parse(dataPersonal[0].datosprestamo);

      const datosFactura = dataPersonal[0].datosfacturas ? JSON.parse(dataPersonal[0].datosfacturas) : [];

      setDatosFactura(datosFactura);


      setFormData((formData) => ({
        ...formData,
        country: dataPersonal[0].clipais || "",
        province: dataPersonal[0].cliprovincia || "",
      }));

      await cargarCiudad(datosprestamo?.provincia);

      setFormData((formData) => ({
        ...formData,
        city: dataPersonal[0].cliciudad || "",
      }));


      if (datoscoyugue?.fechaNacimiento) {
        const dateObjectconyugue = dayjs(datoscoyugue.fechaNacimiento, "DD/MM/YYYY");
        setAgeConyugueCalculate(dateObjectconyugue);
      }

      const datosCertificado = JSON.parse(dataPersonal[0].datoscertificado);

      const inicioVig = datosCertificado.inicioVigencia;

      if (inicioVig) {
        const dateInicioVig = dayjs(inicioVig, "DD/MM/YYYY");

        setInicioVigencia(dateInicioVig);
      }


      const dataPoliza = await cargarDatosPoliza(); // API PARA CONSULTAR EMI POL CABECERA
      if (dataPoliza) {
        setFormData((formData) => ({
          ...formData,
          vigencia: dataPoliza.vigencia,
          numPrestamo: datosCertificado.numPrestamo,
          tipoProducto:datosCertificado.tipoProducto,
        }));

        if (dataPoliza.vigencia && inicioVigencia) {
          const newFinVigencia = inicioVigencia.add(dataPoliza.vigencia, 'month');
          setFinVigencia(newFinVigencia);
        }


        setcargarDataInicial(true);
        let montoPeriodo = JSON.parse(dataPoliza.arrmontoperiodo);
        const transformedData = Object.values(montoPeriodo).flat().map(item => (
          {
            monto: parseFloat(item.monto) || '',
            tasa: item.tasa || '',
            prima: item.prima || '', // Asumiendo que quieres agregar el campo 'prima', si no es necesario, puedes omitirlo
            estado: item.estado || '' // Si no tienes 'estado' en el objeto original, puedes eliminar esta línea o ajustar según lo que necesites
          }));
        setFormDataTabla(transformedData);
      }


      await setDatosCargados(true);
      let tipoPrestamo = (formData.status === 2 || formData.status === 5) ? 'M' : 'I';
      try {

        const data = await LifeService.fetchActualizaDocumento(ramo, producto, tipoPrestamo, age.format("YYYY/MM/DD"), inicioVigencia.format("DD/MM/YYYY"), finVigencia.format("DD/MM/YYYY"), datosprestamo.prestamo, dataPoliza.vigencia);
        if (data) {
          localStorage.setItem(LS_DOCUMENTOSVIDA, JSON.stringify(data));
        } else {
        }
        handleCloseBackdrop();
      } catch (error) {
        handleCloseBackdrop();
      }
      handleOpenBackdrop(false);
    }
  };


  //Usado para enviar api en modo editar
  useEffect(() => {
    //Funcion para carga inicial si se desea usar el useEfect utilizar debajo o declarar una nueva
    const fetchDataProcesaDatos = async () => {
      if (cargarDataInicial) {
        // Calcula el resultado basado en formDataTabla
        const resultado = formDataTabla.reduce((acc, item) => {
          const monto = parseFloat(item.monto); // Convierte a número flotante

          // Verifica si el valor es un número válido
          if (!isNaN(monto) && monto !== null && monto !== '') {
            acc += monto; // Suma el monto válido al acumulador
          } else {
          }

          return acc;
        }, 0); // El acumulador comienza en 0

        setFormData({ ...formData, prestamo: resultado });

        // Verifica si se debe mostrar el mensaje de error
        if (resultado === 0) {
          setErrorMessage("Se deben ingresar un valor en prestamo");
          setOpenSnack(true);
          return;
        }

        const data = crearDatosProcesarDatos();
        setOpenBackdrop(true);

        try {
          // Llama al servicio para procesar datos
          const response = await LifeService.fetchProcesaDatos(data);
          if (response.codigo === 200) {
            localStorage.setItem(LS_TABLAACTUALIZDA, JSON.stringify(response));
            setCalculado(response);
          } else {
            setErrorMessage(response.message);
            setOpenSnack(true);
            setCalculado([]);
          }
        } catch (error) {
          setErrorMessage("Error al procesar los datos.");
          setOpenSnack(true);
          setCalculado([]);
        } finally {
          setOpenBackdrop(false);
        }
      }
      setcargarDataInicial(false);
    };

    fetchDataProcesaDatos();
  }, [formDataTabla]); // Agrega cargarDataInicial a las dependencias para asegurar que el efecto se ejecute cuando cambie


  const cargarDatosPoliza = async () => {
    let ramo = JSON.parse(localStorage.getItem(LS_RAMO));
    let idCotizacion = localStorage.getItem(LS_COTIZACION);
    let producto = JSON.parse(localStorage.getItem(LS_PRODUCTO));

    try {
      const cotizacion = await LifeService.fetchConsultarPolizaVida(ramo, idCotizacion, producto);

      if (cotizacion && cotizacion.data) {
        return cotizacion.data;
      }
    } catch (error) {
      console.error("Error al obtener antiguedad:", error);
    }
  };


  const cargarCotizacion = async () => {
    let userId = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    let idCotizacion = localStorage.getItem(LS_COTIZACION);

    let dato = {
      usuario: userId.id,
      id_CotiGeneral: idCotizacion,
    };
    try {
      const cotizacion = await QuoterService.fetchConsultarCotizacionGeneral(
        dato
      );

      if (cotizacion && cotizacion.data) {
        return cotizacion.data;
      }
    } catch (error) {
      console.error("Error al obtener antiguedad:", error);
    }
  };

  const cargarCiudad = async (value) => {

    try {
      const ciudades = await ComboService.fetchComboCiudad(
        1,
        113,
        value
      );

      if (ciudades && ciudades.data) {
        setCiudades(ciudades.data);
        setFormData((formData) => ({ ...formData, city: ciudades.data[0].Codigo }));
      }
    } catch (error) {
      console.error("Error al obtener ciudad:", error);
    }
  };


  const cargarPais = async () => {
    try {
      const paises = await ComboService.fetchComboPais();
      if (paises && paises.data) {
        await setCountry(paises.data);
        await setFormData((formData) => ({ ...formData, country: paises.data[69].codpais }));

      }
    } catch (error) {
      console.error("Error al obtener paises:", error);
    }
  };

  const cargarProvincias = async () => {

    try {
      const provincias = await ComboService.fetchComboProvincias(
        1,
        113
      );
      if (provincias && provincias.data) {
        await setProvinces(provincias.data);
        await setFormData((formData) => ({ ...formData, province: provincias.data[0].Codigo }));
        await cargarCiudad(provincias.data[0].Codigo);
      }
    } catch (error) {
      console.error("Error al obtener provincias:", error);
    }
  };

  const cargarEstadoCivil = async () => {


    try {
      const estadoCivil = await ComboService.fetchComboEstadoCivil();

      if (estadoCivil && estadoCivil.data) {
        setEstadoCivil(estadoCivil.data);
        setFormData((formData) => ({ ...formData, status: estadoCivil.data[0].Codigo }));
      }
    } catch (error) {
      console.error("Error al obtener estadoCivil:", error);
    }
  };

  function formatedInput(numero) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numero);
  }

  const cargarVigencia = async () => {
    try {
      producto = localStorage.getItem(LS_PRODUCTO);
      ramo = JSON.parse(localStorage.getItem(LS_RAMO));

      const vigencia = await LifeService.fetchVidaProducto(ramo, producto);
      if (vigencia && vigencia.data) {
        setVigencia(vigencia.data.vigencia);
        setFormData((formData) => ({ ...formData, vigencia: vigencia.data.vigencia[0].Codigo }));
        const newFinVigencia = inicioVigencia.add(vigencia.data.vigencia[0].Codigo, 'month');
        setFinVigencia(newFinVigencia);
        let preguntasVida = vigencia.data.arrDeclaracionesAsegurado.pregunta
        let documentosVida = vigencia.data.documentos
        let tabla1 = vigencia.data.crearTablaPeriodos.tabla1
        if (tabla1.EtiquetaTable.codigo) {

          localStorage.setItem(LS_VIDACOBERTURA, tabla1.EtiquetaTable.codigo);
        }
        localStorage.setItem(LS_FPAGO, vigencia.data.frm_pago);
        localStorage.setItem(LS_TPRESTAMO, vigencia.data.tipo_prestamo);
        setTipoprestamo(vigencia.data.tipo_prestamo);
        const preguntasprevias = JSON.parse(localStorage.getItem(LS_PREGUNTASVIDA));
        if (!(preguntasprevias && preguntasprevias.length > 0)) {

          localStorage.setItem(LS_PREGUNTASVIDA, JSON.stringify(preguntasVida));
        }

        if (vigencia.data.polizas[0]) {
          localStorage.setItem(LS_VIDAPOLIZA, JSON.stringify(vigencia.data.polizas[0].Codigo));
        } else {
        }

        localStorage.setItem(LS_TABLACALC, JSON.stringify(tabla1));
        setTablecalc(tabla1);
        localStorage.setItem(LS_DOCUMENTOSVIDA, JSON.stringify(documentosVida));// se omite el stringify por que de base esta pasado como string
        const detalle = transformData(tabla1);
        setFormDataTabla(detalle);


      } else {
        setOpenSnack(true);
        setErrorMessage(vigencia.message);
      }

    } catch (error) {
      console.error('Error al obtener Vigencia:', error);
    }
  }

  useEffect(() => {
    isMounted.current = true; // Establecer a true cuando el componente está montado
    const producto = Number(localStorage.getItem(LS_PRODUCTO));
    let listaProductos = JSON.parse(localStorage.getItem(API_SUBBALDOSAS));
    const resultado = listaProductos.filter(item => item.producto === producto).map(item => item.titulo);
    
    setNomnbreProducto(resultado);
    setAgeCalculate(maxDate);
    setAgeConyugueCalculate(maxDate);
    const iniciarDatosCombos = async () => {
      handleOpenBackdrop();
      await cargarPais();
      await cargarProvincias();
      await cargarEstadoCivil();
      await cargarVigencia();
      handleCloseBackdrop();
    };

    const modoEditar = async () => {
      let idCotizacion = localStorage.getItem(LS_COTIZACION);

      if (idCotizacion) {
        await cargarDatos();
      } else {
        setDatosCargados(true);
      }
    };

    // Ejecutar iniciarDatosCombos primero y luego modoEditar
    const fetchData = async () => {
      const idCotizacion = await iniciarDatosCombos();
      await modoEditar(idCotizacion);
    };

    fetchData();

    return () => {
      isMounted.current = false; // Establecer a false cuando el componente se desmonta
    };
  }, []);


  function crearDatosProcesarDatos() {
    const tipoPrestamo = (formData.status === 2 || formData.status === 5) ? 'M' : 'I';
    let conyugueEdad = '';
    if (!tipoPrestamo === 'I') {
      conyugueEdad = conyugueage.format('DD/MM/YYYY');
    }

    const poliza = JSON.parse(localStorage.getItem(LS_VIDAPOLIZA));
    const cobertura = localStorage.getItem(LS_VIDACOBERTURA);
    const periodos = formDataTabla.map((item, index) => ({
      monto: isNaN(item.monto) ? item.monto.replace(/[$,.]/g, '') : item.monto,
      periodo: index + 1,
      vigencia: ""
    }));
    return {
      action: "procesarDatos",
      aplicacion: "",
      diasMas: "",
      fechaDesde: inicioVigencia.format("DD/MM/YYYY"),
      fechaHasta: finVigencia.format("DD/MM/YYYY"),
      fechaNac: age.format("MM/DD/YYYY"),
      fechaNacConyuge: conyugueEdad,
      identificacion: formData.identification,
      mode: "Nuevo",
      sess_tip_usuario: "1",
      objPeriodos: [
        {
          codigo: cobertura,
          datos: periodos
        }
      ],
      poliza: poliza,
      porAjuste: "0.00",
      genero: formData.genero,
      producto: producto,
      ramoAlt: ramo,
      ramoOri: ramo,
      tipoContrato: tipoPrestamo, // Uso de tipoPrestamo aquí
      vidaGrupo: "N",
      vigencia: formData.vigencia,
      zona: ''
    };
  }

  const handleChange = async (e) => {
    const { name, value } = e.target;
    let modifiedValue = value;
    if (name === "province") {
      cargarCiudad(value);
    }

    if (name ==="tipoProducto"){
      console.log(value);
      console.log(t_prestamo);
      if ((value !== t_prestamo  )) {
        if(t_prestamo !== 'A'||value === 'Z'){
          setErrorMessage("El tipo de plan ingresado no es valido")
          setOpenSnack(true);
          return false;
        }
      }
  
    }

    if (name === "vigencia") {
      const newFinVigencia = inicioVigencia.add(value, 'month');
      setFinVigencia(newFinVigencia);
    }

    if (name === "identification") {
      if (formData.documentType === "C" && value.length > 10) {
        modifiedValue = value.slice(0, 10);
      }
      if (formData.documentType === "R" && value.length > 13) {
        modifiedValue = value.slice(0, 13);
      }
      if (isNaN(value)) {
        e.preventDefault();
        return;
      }
    }

    if (name === "phone") {
      modifiedValue = value.slice(0, 10);
    }

    if (name === "email") {
      if (!ValidationUtils.validateEmail(modifiedValue)) {
        setErrorMessage("Por favor ingresa un correo electrónico válido.")
        setOpenSnack(true);
      }
    }
    setFormData({ ...formData, [name]: modifiedValue });
  };

  const transformData = (tabla1) => {
    return tabla1.detalle.map(row => ({
      monto: "",
      tasa: "",
      prima: "",
      estado: "" // el estado es el mismo para tasa y prima
    }));
  };

  //Cuando cambie la variable vigencia
  useEffect(() => {
    handleOpenBackdrop();
    const fetchDataCargaInicial = async () => {
      if (formData.vigencia) {
        if (datosCargados) {
          let tipoPrestamo = (formData.status === 2 || formData.status === 5) ? 'M' : 'I';
          try {
            const data = await LifeService.fetchTablaPeriodo(ramo, producto, tipoPrestamo, formData.vigencia, inicioVigencia.format("DD/MM/YYYY"));
            localStorage.setItem(LS_TABLACALC, JSON.stringify(data.data.tabla1));
            setTablecalc(data.data.tabla1);
            const detalle = transformData(data.data.tabla1);
            setFormDataTabla(detalle);
            handleCloseBackdrop();
          } catch (error) {
            console.error("Error fetching data:", error);
            handleCloseBackdrop();
          }
        } else {
          handleCloseBackdrop();
        }
      }
    };
    fetchDataCargaInicial();
  }, [formData.vigencia]);

  //Cuando cambie la variable vigencia
  useEffect(() => {
    fetchDataDocumento();
  }, [formData.vigencia, formData.prestamo, age]);


  const fetchDataDocumento = async () => {
    if (formData.vigencia && formData.prestamo && age) {
      if (datosCargados) {
        let tipoPrestamo = (formData.status === 2 || formData.status === 5) ? 'M' : 'I';
        try {
          handleOpenBackdrop();
          const data = await LifeService.fetchActualizaDocumento(ramo, producto, tipoPrestamo, age.format("YYYY/MM/DD"), inicioVigencia.format("DD/MM/YYYY"), finVigencia.format("DD/MM/YYYY"), formData.prestamo, formData.vigencia);
          if (data) {
            localStorage.setItem(LS_DOCUMENTOSVIDA, JSON.stringify(data));
          } else {
            console.log("No existen documentos para este grupo de parametros Revise requisito de asegurabilidad");
          }
          handleCloseBackdrop();
        } catch (error) {
          console.error("Error fetching data:", error);
          handleCloseBackdrop();
        }
      }
    }
  };

  useImperativeHandle(ref, () => ({
    handleSubmitExternally: handleSubmit,
  }));

  const verifyIdentification = async (e) => {
    const { value } = e.target;
    let documentType = formData.documentType;
    let identification = value;
    if (value === "") {
      setOpen(true);
      setmessageError("Valor de cedula invalido");
      return;
    }
    try {
      handleOpenBackdrop();
      const cedulaData = await UsuarioService.fetchVerificarCedula(
        documentType,
        identification
      );
      if (cedulaData.codigo === 200) {
        setErrorCedula(false);
        await consultUserData(documentType, identification);
        handleCloseBackdrop();
      } else {
        setErrorCedula(true);
        setOpen(true);
        setmessageError(cedulaData.message);
        handleCloseBackdrop();
      }
    } catch (error) {
      console.error("Error al verificar cédula:", error);
    }
  };


  const actualizarVigencia = async (value) => {
    setInicioVigencia(value);
    const newFinVigencia = value.add(formData.vigencia, 'month');
    setFinVigencia(newFinVigencia);
  }

  const consultUserData = async (documentType, identification) => {
    try {
      const cedulaData = await UsuarioService.fetchConsultarUsuario(
        documentType,
        identification
      );
      if (cedulaData.codigo === 200 && cedulaData.data) {
        const dateString = cedulaData.data[0].cli_fecnacio;
        const dateObject = dayjs(dateString, "YYYY-MM-DD", true);

        setAge(dateObject);
        setFormData({
          ...formData,
          name: cedulaData.data[0].cli_nombres || "",
          lastname: cedulaData.data[0].cli_apellidos || "",
          email: cedulaData.data[0].cli_email || "",
          phone: cedulaData.data[0].cli_celular || "",
          address: cedulaData.data[0].cli_direccion || "",
        });
      }
    } catch (error) {
      console.error("Error al verificar cédula:", error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  function faltanDatosConyugue() {
    if (conyugueage === '') {
      setErrorMessage("Debe ingresar una fecha de nacimiento para el conyugue")
      setOpenSnack(true);
      return true;
    }
    if (formData.conyugenombre === '') {
      setErrorMessage("Debe ingresar un valor en nombre para el conyugue")
      setOpenSnack(true);
      return true;
    }

    if (formData.conyugenumero === '') {
      setErrorMessage("Debe ingresar un valor en cédula para el conyugue")
      setOpenSnack(true);
      return true;
    }

    if (formData.conyugeapellido === '') {
      setErrorMessage("Debe ingresar un valor en apellido para el conyugue")
      setOpenSnack(true);
      return true;
    }

    if (formData.conyugesexo === '') {
      setErrorMessage("Debe ingresar un valor en género para el conyugue")
      setOpenSnack(true);
      return true;
    }
    if (formData.countryConyugue === '') {
      setErrorMessage("Debe ingresar un valor en pais para el conyugue")
      setOpenSnack(true);
      return true;
    }
    return false;
  }


  function faltanDatosUsuario() {
    if (formData.numPrestamo === '') {
      setErrorMessage("Debe ingresar un valor en número de prestamo")
      setOpenSnack(true);
      return true;
    }

    if (formData.prestamo === '') {
      setErrorMessage("Debe ingresar un valor en prestamo")
      setOpenSnack(true);
      return true;
    }

    // if (formData.montodesempleo === '') {
    //   setErrorMessage("Debe ingresar un valor en desempleo")
    //   setOpenSnack(true);
    //   return true;
    // }

    return false;
  }

  const handleSubmit = async (e) => {
    const tipoPrestamo = (formData.status === 2 || formData.status === 5) ? 'M' : 'I';
    if (tipoPrestamo === 'M') {
      if (faltanDatosConyugue()) {
        return false;
      }
    }
    if (faltanDatosUsuario()) {
      return false;
    }

    if (formData.vigencia === '' || formData.vigencia === 0) {
      setErrorMessage("Debe ingresar un valor en vigencia, no puede ser 0")
      setOpenSnack(true);
      return false;
    }

    if (formData.prima === '' && formData.impuesto === '') {
      setErrorMessage("Primero se deben realizar los calculos")
      setOpenSnack(true);
      return false;
    }

    if (formData.tipoProducto === 'Z') {
      setErrorMessage("Se debe ingresar datos en tipo plan")
      setOpenSnack(true);
      return false;
    }

    

    const poliza = JSON.parse(localStorage.getItem(LS_VIDAPOLIZA));
    const requiredFields = [
      "name",
      "lastname",
      "email",
      "phone",
      "documentType",
      "identification",
      "address",
    ];

    let next = false;
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        next = false;
        return next;
      } else {
        next = true;
      }
    }

    //VALIDAR MENOR DE EDAD
    next = age !== "" ? true : false;
    let producto = JSON.parse(localStorage.getItem(LS_PRODUCTO));
    let userId = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    const cobertura = localStorage.getItem(LS_VIDACOBERTURA);
    //JSON PARA MAPEAR LOS CAMPOS Y ENVIARLOS
    const datosconyugues = {
      nombreConyuge: formData.conyugenombre,
      apellidoConyuge: formData.conyugeapellido,
      identificacion: formData.conyugenumero,
      fechaNacimiento: conyugueage ? conyugueage.format("DD/MM/YYYY") : "",
      genero: formData.conyugesexo,
      tipo: formData.conyugetipo,
      pais:formData.countryConyugue
    };

    const datosprestamo = {
      prestamo: formData.prestamo,
      prima: formData.prima,
      impuesto: formData.impuesto,
      primatotal: formData.primaTotal,
      primaMensual: formData.primaMensual,
      provincia: formData.province,
      ciudad: formData.city
    };

    const datoscertificado = {
      inicioVigencia: inicioVigencia.format("DD/MM/YYYY"),
      finVigencia: finVigencia.format("DD/MM/YYYY"),
      vigencia: formData.vigencia,
      numPrestamo: formData.numPrestamo,
      tipoProducto:formData.tipoProducto
    };



    const arrDatosCliente = {
      nombre: formData.name,
      apellido: formData.lastname,
      correo: formData.email,
      telefono: formData.phone,
      tipoDocumento: formData.documentType,
      identificacion: formData.identification,
      fechaNacimiento: age.format("DD/MM/YYYY"),
      direccion: formData.address,
      producto: producto,
      ramo: ramo,
      cligenero: formData.genero,
      cliestadocivil: formData.status,
      clipais: formData.country,
      cliciudad: formData.city,
      cliprovincia: formData.province,
      poliza: poliza,
      tippoliza: 1,
      usuario: userId.id,
      zona: formData.province,
      datosconyugues: datosconyugues,
      datosprestamo: datosprestamo,
      datosfacturas: datosFactura,
      datoscertificado: datoscertificado,
    };

    const periodos = formDataTabla.map((item, index) => ({
      tipo_monto: "",
      monto: item.monto,
      periodo: index + 1,
      vigencia: formData.vigencia,
      vigencia_desde: item.vigencia_desde,
      vigencia_hasta: item.vigencia_hasta,
      fecha_desde: item.fecha_desde,
      fecha_hasta: item.fecha_hasta,
      total_dias: item.total_dias,
      tasa: item.tasa,
      prima_anio: item.prima_anio,
      prima_dia: item.prima_dia,
      prima_total: item.prima_total,
    }));

    const arrMontoPeriodo = {
      [cobertura]: periodos
    }

    const arrFrmEmision = {
      slProducto: producto,
      slPoliza: poliza,
      txtAplicacion: "",
      txtCodCliente: formData.identification,
      txtEdadCliente: "",
      slTipContrato: tipoPrestamo,
      txtReferencia: '',
      slBeneficiado: "",
      slVigencia: formData.vigencia,
      slDiasAdicional: 0,
      txtFecDesde: inicioVigencia.format("DD/MM/YYYY"),
      txtFecHasta: finVigencia.format("DD/MM/YYYY"),
      txtFecCredDesde: inicioVigencia.format("DD/MM/YYYY"),
      txtFecCredHasta: finVigencia.format("DD/MM/YYYY"),
      txtNomZona: '',
      slTipAmortizacion: "",
      txtValPrestamo: 0,
      txtTasaInteres: 0,
      txtAgente: '',
      slTipConyuge: '',
      txtCodConyugue: '',
      txtAplConyugue: formData.conyugeapellido,
      txtNomConyugue: formData.conyugenombre,
      txtNacConyugue: conyugueage,
      txtEdadConyugue: '',
      txtCodZona: formData.province,//en blanco
      txtTipoVigencia: tipoPrestamo,
      sysAccion: '',
      hddPorTasa: '',
      hddVidaGrupo: 'N',
    }

    let calc = JSON.parse(localStorage.getItem(LS_TABLAACTUALIZDA));
    const arrValores = {
      tasa: calc.data.valores.tasa,
      prima: formData.prima,
      derecho: calc.data.valores.derecho,
      porinteres: calc.data.valores.porinteres,
      prima_total: calc.data.valores.prima_total,
      monto_total: calc.data.valores.monto_total,
      prima_minima: calc.data.valores.prima_minima
    }

    const arrFrmDebito = {
      slPgTipDeudor: "",
      slPgTipCedula: "",
      txtPgCedula: "",
      txtPgNombre: "",
      txtPgTelefono: "",
      slPgTipRegistro: "1",
      slPgBanco: "",
      txtPgNumCuenta: "",
      slPgTipCuenta: "",
      slPgTarjeta: "",
      txtPgNumTarjeta: "",
      txtPgCadTarjetaMes: "",
      txtPgCadTarjetaAnio: "",
    }

    const preguntasVida = JSON.parse(localStorage.getItem(LS_PREGUNTASVIDA));


    const data = {
      arrDatosCliente: arrDatosCliente,
      ramoAlt: ramo,
      ramo: ramo,
      poliza: poliza,
      strCoberturas: [
        {
          codcob: cobertura,
          selcob: true,
          clscob: "",
          tipcob: ""
        }
      ],
      arrMontoPeriodo: arrMontoPeriodo,
      arrValores: arrValores,
      arrFrmEmision: arrFrmEmision,
      arrFacturacion: null,
      sumaAsegurada: formData.prestamo,
      arrFrmDebito: arrFrmDebito,
      slTipFacturacion: "",
      slFormaPago: "",
      txtValEntrada: "",
      slNumPagos: "",
      slConInteres: "",
      txtFecCobro: "",
      txtFecEmite: "",
      hddFecCuoInicial: "",
      txtPorAjuste: "",
      txtPorTasa: calc.data.valores.tasa,
      txtValPrima: calc.data.valores.prima,
      txtValDerecho: calc.data.valores.derecho,
      txtPorSibs: "",
      txtPorSsc: "",
      txtDeducibles: "",
      txtAclaratorios: "",
      slTipCredito: "",
      aprobAutomatica: "",
      jsonPreguntas: preguntasVida,
      arrLogTasa: {},
      vidaGrupo: "N",
    }
    const pag = JSON.parse(localStorage.getItem(LS_DATOSPAGO));

    const totalPagar = {
      documentType: formData.documentType,
      identification: formData.identification,
      name: formData.name,
      lastname: formData.lastname,
      direction: formData.address,
      email: formData.email,
      phone: formData.phone,
      sumAdd: formData.prestamo,
      prima: formData.prima,
      impScvs: pag.impScvs,
      impSsc: pag.impSsc,
      admision: pag.admision,
      subtotal: pag.subtotal,
      iva: pag.iva,
      total: pag.total,
      pais: formData.country
    }
    localStorage.setItem(LS_DATOSPAGO, JSON.stringify(totalPagar));

    // Si existen entonces estamos en modo editar
    const application = localStorage.getItem(LS_IDCOTIZACIONVIDA);
    const id_cotigeneral = localStorage.getItem(LS_COTIZACION);

    if (application !== null && application !== undefined && application !== '') {
      data.aplicacion = application;
    }
    if (id_cotigeneral !== null && id_cotigeneral !== undefined && id_cotigeneral !== '') {
      data.id_CotiGeneral = id_cotigeneral;
    }

    localStorage.setItem(LS_DATAVIDASEND, JSON.stringify(data));
    try {
      handleOpenBackdrop();
      const response = await LifeService.fetchGrabaDatosVida(data);
      handleCloseBackdrop();
      if (response.codigo === 200) {
        const idVida = response.data.aplicacion;
        localStorage.setItem(LS_IDCOTIZACIONVIDA, idVida);

        const idCotizacion = response.data.id_CotiGeneral;
        localStorage.setItem(LS_COTIZACION, idCotizacion);
        handleCloseBackdrop();
        localStorage.removeItem(LS_POLVIDAEDIT);
        localStorage.removeItem(DATOS_PERSONALES_STORAGE_KEY);
        localStorage.removeItem(LS_PROCESODATOSVIDA);
        localStorage.removeItem(LS_TABLAACTUALIZDA);
        localStorage.removeItem(LS_TABLACALC);
        localStorage.removeItem(LS_VIDACOBERTURA);
        localStorage.removeItem(LS_VIDAPOLIZA);
        return true;
      } else {
        handleCloseBackdrop();
        return false;
      }
    } catch (error) {
      console.error("Error al verificar enviar a guadradar datos:", error);
      handleCloseBackdrop();
      return false;
    }

    // // localStorage.setItem(
    // //   DATOS_PERSONALES_STORAGE_KEY,
    // //   JSON.stringify(objetoSeguro)
    // // );

    // console.log("Formulario enviado:", objetoSeguro, next);
    // return next;
  };

  const handleOpenModal = async () => {
    const todosTienenNumero = formDataTabla.every((item) => {
      const monto = item.monto.replace(/[$,.]/g, '');
      return monto !== undefined && monto !== null && monto !== '' && !Number.isNaN(Number(monto));
    });
    if (!todosTienenNumero) {
      setErrorMessage("Se deben ingresar valores validos en la tabla de montos")
      setOpenSnack(true);
      return;
    }

    if (formData.vigencia === '' || formData.vigencia === 0) {
      setErrorMessage("Se deben ingresar datos en vigencia")
      setOpenSnack(true);
      return;
    }

    //SUMATORIA DE PRESTAMO A PARTIR DE LA TABLA DE CALCULOS
    const resultado = formDataTabla.reduce((acc, item) => {
      const montoConvertido = item.monto.replace(/[$,.]/g, '');
      const monto = parseFloat(montoConvertido); // Convierte a número flotante

      // Verifica si el valor es un número válido
      if (!isNaN(monto) && monto !== null && monto !== '') {
        acc += monto; // Suma el monto válido al acumulador
      } else {
        console.error(`Valor inválido encontrado: ${item.monto}`);
      }

      return acc;
    }, 0); // El acumulador comienza en 0

    setFormData({ ...formData, prestamo: resultado });


    // if (formData.prestamo === '') {
    //   setErrorMessage("Se deben ingresar un valor en prestamo")
    //   setOpenSnack(true);
    //   return;
    // }

    const data = crearDatosProcesarDatos();
    setOpenBackdrop(true);
    const response = await LifeService.fetchProcesaDatos(data);
    if (response.codigo === 200) {
      setOpenBackdrop(false);
      localStorage.setItem(LS_TABLAACTUALIZDA, JSON.stringify(response));
      setCalculado(response);
    } else {
      setErrorMessage(response.message);
      setOpenSnack(true);
      // localStorage.setItem(LS_TABLAACTUALIZDA, JSON.stringify([]));
      setCalculado([]);
      setOpenBackdrop(false);
    }

    // setOpenModal(true);
  };


  useEffect(() => {
    if (calculado && calculado.data) {
      const result = calculado.data.montoPeriodo
        ? Object.values(calculado.data.montoPeriodo).flatMap(obj =>
          Object.values(obj).map(item => ({
            monto: item.monto || '',
            tasa: item.tasa || '',
            prima: item.prima_anio || '',
            vigencia_desde: item.vigencia_desde || '',
            vigencia_hasta: item.vigencia_hasta || '',
            fecha_desde: item.fecha_desde || '',
            fecha_hasta: item.fecha_hasta || '',
            total_dias: item.total_dias || '',
            prima_anio: item.prima_anio || '',
            prima_dia: item.prima_dia || '',
            estado: ''
          }))
        )
        : [];
      setFormDataTabla(result);

      let prima = null;
      for (let key in calculado.data.montoPeriodo) {
        let firstElement = true;
        for (let subKey in calculado.data.montoPeriodo[key]) {
          let item = calculado.data.montoPeriodo[key][subKey];

          if (firstElement) {
            prima = item.prima_anio;
            firstElement = false;
          }
        }
      }

      let impuesto = 0;
      const parametros = JSON.parse(localStorage.getItem(PARAMETROS_STORAGE_KEY));

      // Asegúrate de que prima y los valores de parametros son números
      const primaNumber = Number(prima);
      const porIva = Number(parametros[0].por_iva);
      const porSbs = Number(parametros[0].por_sbs);
      const porSsc = Number(parametros[0].por_ssc);
      const derPoliza = Number(parametros[0].der_poliza);

      // Calcula los impuestos y redondea a 2 decimales
      //const iva = parseFloat((primaNumber * porIva / 100).toFixed(2));
      const iva = 0;
      const sbs = parseFloat((primaNumber * porSbs / 100).toFixed(2));
      const ssc = parseFloat((primaNumber * porSsc / 100).toFixed(2));
      const der_poliza = parseFloat(derPoliza.toFixed(2));



      // Suma los impuestos
      impuesto = parseFloat((iva + sbs + ssc + der_poliza).toFixed(2));

      // Calcula el total y redondea a 2 decimales
      let total = parseFloat((primaNumber + impuesto).toFixed(2));

      let subTotal = parseFloat(((impuesto - iva) + prima).toFixed(2));
      let totalPag = parseFloat((subTotal + iva).toFixed(2));

      const totalPagar = {
        documentType: formData.documentType,
        identification: formData.identification,
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        sumAdd: formData.prestamo,
        prima: primaNumber,
        impScvs: sbs,
        impSsc: ssc,
        admision: der_poliza,
        subtotal: subTotal,
        iva: iva,
        total: totalPag,
        pais: formData.country
      }
      localStorage.setItem(LS_DATOSPAGO, JSON.stringify(totalPagar));

      // Actualiza el formData con los valores calculados y redondeados
      setFormData({
        ...formData,
        prima: parseFloat(primaNumber.toFixed(2)),
        primaMensual: parseFloat((total / 12).toFixed(2)),
        primaTotal: total,
        impuesto: impuesto
      });
    }
  }, [calculado]);

  const verificaPrestamo = async (numPrestamo) => {
    var  idCotizacion = localStorage.getItem(LS_COTIZACION);
    setOpenBackdrop(true);
    const response = await LifeService.fetchVerificaPrestamo(producto, numPrestamo,idCotizacion);
    if (response.codigo === 200) {
      setOpenBackdrop(false);

    } else {
      setOpenBackdrop(false);
      setErrorMessage(response.message);
      setFormData({ ...formData, numPrestamo: '' });
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false);
    let calc = JSON.parse(localStorage.getItem(LS_TABLAACTUALIZDA));
    setCalculado(calc);
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const handleBlur = (e) => {
    setFormDataTouched({ ...formDataTouched, [e.target.name]: true });
  };




  const handleTableChange = React.useCallback((e, index, field) => {
    const newValue = e.target.value;

    setFormDataTabla(prevData => prevData.map((item, i) => (
      i === index ? { ...item, [field]: newValue } : item
    )));
  }, []);


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

  return (
    <Card elevation={4} sx={{ width: '100%', m: 2, mx: 'auto', paddingTop: '30px', paddingBottom: '30px', }}>

      {/* MODAL de  */}
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
          style={{ overflow: "scroll", padding: "0px" }}
          className="dialog-height-content"
        >
          {/* Componente del formulario */}
          <QuestionModalLife
            closeModalDetail={handleCloseModal}
            isEditMode=""
            style={{ width: "100%" }}
          />
        </DialogContent>
      </Dialog>


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

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <form
        component="form"
        onSubmit={handleSubmit}
        style={{ width: '100%', paddingLeft: '30px', paddingRight: '10px', paddingBottom: '20px' }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingBottom: '20px' }}>
          <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '0px', fontWeight: 'bold' }}>
            DATOS PERSONALES
          </Typography>

          <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '0px', fontWeight: 'bold', marginRight: '35px' }}>
            Producto: {NomnbreProducto}
          </Typography>

        </div>


        <Grid container spacing={2} style={{ paddingRight: '5px' }}>
          <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert severity="warning">{messageError}</Alert>
          </Snackbar>
          <Grid item xs={10.5} md={3}>
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Seleccione Documento <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Select
              labelId="documentType-Label"
              id="documentType"
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ textAlign: "left", }}
              variant="standard"
              placeholder="Seleccione documento"
              fullWidth
              required
            >
              <MenuItem value="C">Cédula</MenuItem>
              <MenuItem value="R">RUC</MenuItem>
              <MenuItem value="P">Pasaporte</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={10.5} md={3} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Doc. de identificación <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              type={formData.documentType === "P" ? "text" : "text"}
              name="identification"
              value={formData.identification}
              placeholder="Documento de identificación"
              onChange={handleChange}
              onBlur={verifyIdentification}
              variant="standard"
              fullWidth
              required
            />
            {errorCedula ? (
              <Alert
                severity="error"
                style={{ fontSize: "10px", textAlign: "start" }}
              >
                El documento de identificación no es valido.
              </Alert>
            ) : null}
          </Grid>
          <Grid item xs={10.5} md={3} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Nombres <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Nombres"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="standard"
              fullWidth
              disabled={errorCedula}
              inputProps={{ maxLength: 30 }}
              required
            />
          </Grid>
          <Grid item xs={10.5} md={2.5}>
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Apellidos <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Apellidos"
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              disabled={errorCedula}
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 30 }}
              required
            />
          </Grid>
          <Grid item xs={10.5} md={3} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Fecha de nacimiento <span style={{ color: 'red' }}>*</span>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}  >
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  placeholder="Fecha de nacimiento"
                  slotProps={{
                    textField: { variant: "standard", size: "small" },
                  }}
                  value={age}
                  format="DD/MM/YYYY"
                  disabled={errorCedula}
                  className="datePicker"
                  maxDate={maxDate}
                  onChange={(newValue) => {
                    setAgeCalculate(newValue);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Teléfono <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Teléfono"
              type="text"
              disabled={errorCedula}
              name="phone"
              value={ValidationUtils.Valida_numeros(formData.phone)}
              onChange={handleChange}
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 10 }}
              required
            />
          </Grid>
          <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Dirección <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Dirección"
              type="text"
              disabled={errorCedula}
              name="address"
              value={formData.address}
              onChange={handleChange}
              variant="standard"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={10.5} md={2.5} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Email <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Email"
              type="email"
              name="email"
              disabled={errorCedula}
              value={formData.email}
              onChange={handleChange}
              variant="standard"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Edad <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Edad"
              type="text"
              disabled={true}
              name="Edad"
              value={ValidationUtils.Valida_numeros(formData.ageCalculated)}
              onChange={handleChange}
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 10 }}
              required
            />
          </Grid>
          <Grid item xs={10.5} md={3}>
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Pais <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ textAlign: "left", }}
              variant="standard"
              placeholder="Seleccione País"
              fullWidth
              required
            >
              {country.map((risk, index) => (
                <MenuItem key={index} value={risk.codpais}>
                  {risk.nombre}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={10.5} md={3}>
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Provincia <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ textAlign: "left" }}
              variant="standard"
              placeholder="Seleccione provincia"
              fullWidth
              required
            >
              {provinces.map((province, index) => (
                <MenuItem key={index} value={province.Codigo}>
                  {province.Nombre}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={10.5} md={3}>
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Ciudad <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ textAlign: "left", }}
              variant="standard"
              placeholder="Seleccione Ciudad"
              fullWidth
              required
            >
              {ciudades.map((risk, index) => (
                <MenuItem key={index} value={risk.Codigo}>
                  {risk.Nombre}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={10.5} md={3}  >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Estado civil <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Select
              labelId="status-Label"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ textAlign: "left", }}
              variant="standard"
              placeholder="Seleccione estado civil"
              fullWidth
              required
            >

              {estadoCivil.map((status, index) => (
                <MenuItem key={index} value={status.Codigo}>
                  {status.Nombre}
                </MenuItem>
              ))}

            </Select>
          </Grid>

          <Grid item xs={10.5} md={3} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Genero <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Select
              labelId="genero-Label"
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ textAlign: "left", }}
              variant="standard"
              placeholder="Seleccione el genero"
              fullWidth
              required
            >

              <MenuItem key='0' value='M'>
                MASCULINO
              </MenuItem>
              <MenuItem key='1' value='F'>
                FEMENINO
              </MenuItem>

            </Select>
          </Grid>

        </Grid>

        {(formData.status === CodigoComboCasado || formData.status === CodigoComboUnionLibre)
          && ( // Estado Casado
            <>
              <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingTop: '30px', fontWeight: 'bold' }}>
                DATOS CONYUGUE
              </Typography>

              <Grid container spacing={2} style={{ paddingRight: '45px' }}>
                <Grid item xs={10.5} md={3} >
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                    Cedula <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <TextField
                    placeholder="Conyugue Cedula"
                    type="text"
                    name="conyugenumero"
                    value={formData.conyugenumero}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    disabled={errorCedula}
                    inputProps={{ maxLength: 30 }}
                    required
                  />

                </Grid>

                <Grid item xs={10.5} md={3} >
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                    Nombres <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <TextField
                    placeholder="Conyugue Nombres"
                    type="text"
                    name="conyugenombre"
                    value={formData.conyugenombre}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    disabled={errorCedula}
                    inputProps={{ maxLength: 30 }}
                    required
                  />

                </Grid>

                <Grid item xs={10.5} md={3} >
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                    Apellidos <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <TextField
                    placeholder="Conyugue Apellido"
                    type="text"
                    name="conyugeapellido"
                    value={formData.conyugeapellido}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    disabled={errorCedula}
                    inputProps={{ maxLength: 30 }}
                    required
                  />

                </Grid>

                <Grid item xs={10.5} md={3} >
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                    Genero <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Select
                    labelId="genero-Label"
                    id="conyugesexo"
                    name="conyugesexo"
                    value={formData.conyugesexo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ textAlign: "left", }}
                    variant="standard"
                    placeholder="Seleccione el genero"
                    fullWidth
                    required
                  >

                    <MenuItem key='0' value='M'>
                      MASCULINO
                    </MenuItem>
                    <MenuItem key='1' value='F'>
                      FEMENINO
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={10.5} md={3} >
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                    Fecha de nacimiento <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}  >
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        placeholder="Fecha de nacimiento"
                        slotProps={{
                          textField: { variant: "standard", size: "small" },
                        }}
                        value={conyugueage}
                        format="DD/MM/YYYY"
                        disabled={errorCedula}
                        className="datePicker"
                        maxDate={maxDate}
                        onChange={(newValue) => {
                          setAgeConyugueCalculate(newValue);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>

                </Grid>

                <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }} >
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                    Edad <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <TextField
                    placeholder="Edad conyugue"
                    type="text"
                    disabled={true}
                    name="Edad"
                    value={ValidationUtils.Valida_numeros(formData.ageConyugueCalculated)}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    inputProps={{ maxLength: 10 }}
                    required
                  />
                </Grid>
                <Grid item xs={10.5} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                    Pais <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Select
                    id="countryConyugue"
                    name="countryConyugue"
                    value={formData.countryConyugue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ textAlign: "left", }}
                    variant="standard"
                    placeholder="Seleccione País"
                    fullWidth
                    required
                  >
                    {country.map((risk, index) => (
                      <MenuItem key={index} value={risk.codpais}>
                        {risk.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>


              </Grid>

            </>
          )}
        <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingTop: '30px', fontWeight: 'bold' }}>
          DATOS DEL CERTIFICADO
        </Typography>
        <Grid container spacing={2} style={{ paddingRight: '45px' }}>

          <Grid item xs={10.5} md={3} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Tipo de Plan <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Select
              labelId="tipoProducto-Label"
              id="tipoProducto"
              name="tipoProducto"
              value={formData.tipoProducto}
              onChange={handleChange}
              style={{ textAlign: "left", }}
              variant="standard"
              placeholder="Seleccione tipo de prestamo"
              fullWidth
              required
            >
              <MenuItem key='I' value='Z'>
                Seleccione el Tipo De Plan
              </MenuItem>
              <MenuItem key='I' value='I'>
                INDIVIDUAL
              </MenuItem>
              <MenuItem key='M' value='M'>
                MANCOMUNADO
              </MenuItem>

            </Select>
          </Grid>

          <Grid item xs={10.5} md={3} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Inicio de Vigencia <span style={{ color: 'red' }}>*</span>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  placeholder="Fecha de nacimiento"
                  slotProps={{
                    textField: { variant: "standard", size: "small" },
                  }}
                  value={inicioVigencia}

                  format="DD/MM/YYYY"
                  disabled={errorCedula}
                  className="datePicker"
                  minDate={maxDate}
                  onChange={(newValue) => {
                    actualizarVigencia(newValue)
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }}>
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Vigencia/Plazo <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Select
              labelId="vigencia-Label"
              id="vigencia"
              name="vigencia"
              value={formData.vigencia}
              onChange={handleChange}
              style={{ textAlign: "left", }}
              variant="standard"
              placeholder="Seleccione documento"
              fullWidth
              required
            >
              {vigencia.map((vigencia, index) => (
                <MenuItem key={vigencia.Codigo} value={vigencia.Codigo}>
                  {vigencia.Nombre} Meses
                </MenuItem>
              ))}

            </Select>
          </Grid>

          <Grid item xs={10.5} md={3} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Fin de vigencia <span style={{ color: 'red' }}>*</span>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  placeholder="Fecha de nacimiento"
                  slotProps={{
                    textField: { variant: "standard", size: "small" }
                  }}

                  value={finVigencia}
                  format="DD/MM/YYYY"
                  readOnly
                  disabled={errorCedula}
                  className="datePicker"
                  minDate={maxDate}
                  onChange={(newValue) => {
                    setFinVigencia(newValue);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>


          <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Num. Prestamo <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Num. Prestamo"
              type="text"
              disabled={errorCedula}
              name="numPrestamo"
              value={ValidationUtils.Valida_numeros(formData.numPrestamo)}
              onChange={handleChange}
              onBlur={() => verificaPrestamo(formData.numPrestamo)}
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 10 }}
              required
            />
          </Grid>



          {/* <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              $ Desempleo <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Monto Desempleo"
              type="text"
              disabled={errorCedula}
              name="montodesempleo"
              value={ValidationUtils.Valida_moneda(formData.montodesempleo)}
              onChange={handleChange}
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 10 }}
              required
            />
          </Grid> */}

        </Grid>




        <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingTop: '30px', fontWeight: 'bold' }}>
          CALCULOS
        </Typography>


        <TableContainer
          style={{ overflow: "auto", height: "100%", marginBottom: 70, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Table
            sx={{ minWidth: 500, width: 500 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>Periodo</StyledTableCell>
                <StyledTableCell>Monto</StyledTableCell>
                <StyledTableCell>Tasa</StyledTableCell>
                <StyledTableCell>Prima</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(memoizedFormDataTabla) && memoizedFormDataTabla.map((item, index) => (
                <MemoizedRow key={index} item={item} index={index} handleTableChange={handleTableChange} />
              ))}
            </TableBody>
          </Table>

          <Grid item xs={10.5} md={3} style={{ paddingTop: '25px' }}>
            <Button
              onClick={handleOpenModal}
              sx={{ mr: 1 }}
              className="button-styled-primary"
              style={{ top: "20%", backgroundColor: '#0099a8', color: "white", borderRadius: "5px" }}
            >
              Calcular
            </Button>
          </Grid>

        </TableContainer>


        <Grid container spacing={2} style={{ paddingRight: '45px' }}>

          <Grid item xs={10.5} md={3} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              $ Prestamo <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Prestamo"
              type="text"
              disabled={true}
              name="prestamo"
              value={formatedInput(formData.prestamo)}
              onChange={handleChange}
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 10 }}
              required
            />
          </Grid>
          <Grid item xs={10.5} md={3} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              $ Prima <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Prima"
              type="text"
              disabled={true}
              name="prima"
              value={formatedInput(formData.prima)}
              onChange={handleChange}
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 10 }}

              required
            />
          </Grid>

          <Grid item xs={10.5} md={3} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              $ Impuesto <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Impuesto"
              type="text"
              disabled={true}
              name="impuesto"
              value={formatedInput(formData.impuesto)}
              onChange={handleChange}
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 10 }}
              readOnly
              required
            />
          </Grid>
          <Grid item xs={10.5} md={3} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              $ Prima total <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Prima total"
              type="text"
              disabled={true}
              name="primaTotal"
              value={formatedInput(formData.primaTotal)}
              onChange={handleChange}
              variant="standard"
              fullWidth
              readOnly
              inputProps={{ maxLength: 10 }}
              required
            />
          </Grid>
          <Grid item xs={10.5} md={3} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              $ Prima Mensual<span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Prima Mensual"
              type="text"
              disabled={true}
              name="primaMensual"
              value={formatedInput(formData.primaMensual)}
              onChange={handleChange}
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 10 }}
              readOnly
              required
            />
          </Grid>
        </Grid>
        {error && <Alert severity="error">{error}</Alert>}
      </form>
    </Card>
  );
});

export default PersonalFormLife;
