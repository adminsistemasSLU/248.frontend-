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
import Swal from "sweetalert2";
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
  API_SUBBALDOSAS,
  LS_PREGRESPONDIDAS
} from "../../utils/constantes";
import QuoterService from "../../services/QuoterService/QuoterService";
import { Button } from "@mui/base";
import LifeService from '../../services/LifeService/LifeService';
import QuestionModalLife from "./questionModalLife";
import CurrencyInput from "../../utils/currencyInput";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

let producto = sessionStorage.getItem(LS_PRODUCTO);
let ramo = JSON.parse(sessionStorage.getItem(LS_RAMO));

const StyledTableRow = styled(({ ...props }) => <TableRow {...props} />)(({ theme }) => ({
  "td, &:last-child th": {
    borderBottom: "1px solid black",
    padding: '0px',
  },
}));




const MemoizedStyledTableRow = React.memo(StyledTableRow);


const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.item.monto === nextProps.item.monto &&
    prevProps.item.tasa === nextProps.item.tasa &&
    prevProps.item.prima === nextProps.item.prima &&
    prevProps.index === nextProps.index &&
    prevProps.handleTableChange === nextProps.handleTableChange &&
    prevProps.disabledMonto === nextProps.disabledMonto
  );
};

const MemoizedMontoCell = React.memo(({ value, onChange,disabledMonto }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <TableCell>
      <CurrencyInput
        disabled = {disabledMonto}
        className="input-table"
        value={value || ''}
        onChange={(e) => {
          const cleanValue = e.target.value.replace(/[^\d.-]/g, ''); // Elimina formato para obtener el número limpio
          onChange({ target: { value: cleanValue } }); // Pasa el valor limpio
        }}
        style={{
          border: '1px solid #ccc',
          width: '96%',
          height: '29px',
          borderRadius: '5px',
          fontSize: '16px',
        }}
      />
    </TableCell>
  );
});




const MemoizedRow = React.memo(({ item, codcobIndex, periodoIndex, handleTableChange,disabledMonto }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  function formatedInput(numero) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numero);
  }

  return (
    <MemoizedStyledTableRow key={periodoIndex} sx={{ padding: 0 }}>
      <TableCell>
        <TextField
          fullWidth
          value={periodoIndex + 1 || ''}
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
        value={(item.monto)}
        onChange={(e) => handleTableChange(e, codcobIndex, periodoIndex, 'monto')}
        disabledMonto ={disabledMonto}
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
    { monto: '', tasa: '', prima: '', estado: '', desempleo: 0, periodos: [] }
  ]);

  const generarPeriodos = (n) => Array.from({ length: n }, (_, i) => ({
    periodo: i + 1,
    monto: '',
    tasa: '',
    prima: '',
  }));




  const [tablasData, setTablasData] = useState([]);

  const [visibleDesempleo, setvisibleDesempleo] = React.useState(true);

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

  const [disabledMonto, setDisabledMonto] = useState(false);

  const isMounted = useRef(false);
  //Combos
  const [estadoCivil, setEstadoCivil] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [country, setCountry] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [vigencia, setVigencia] = useState([]);
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
    sessionStorage.removeItem(LS_PREGRESPONDIDAS);
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

      sessionStorage.setItem(LS_IDCOTIZACIONVIDA, dataPersonal[0].aplicacion);

      const pregRespondidas = dataPersonal[0].DocumentosPreguntas;
      sessionStorage.setItem(LS_PREGRESPONDIDAS, pregRespondidas);

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
          tipoProducto: datosCertificado.tipoProducto,
        }));

        if (dataPoliza.vigencia && inicioVigencia) {
          const newFinVigencia = inicioVigencia.add(dataPoliza.vigencia, 'month');
          setFinVigencia(newFinVigencia);
        }
        sessionStorage.setItem(LS_VIDAPOLIZA, dataPoliza.poliza);


        setcargarDataInicial(true);
        let montoPeriodo = JSON.parse(dataPoliza.arrmontoperiodo);
        const transformedData = Object.values(montoPeriodo).flat().map(item => (
          {
            monto: item.monto ? `$${parseFloat(item.monto).toLocaleString()}` : '',
            tasa: item.tasa || '',
            prima: item.prima || '',
            estado: item.estado || '',
            desempleo: item.desempleo || 0,
          }));
        setFormDataTabla(transformedData);
      }

      sessionStorage.setItem(LS_TABLACALC, JSON.stringify(datosprestamo.conf_amparos));

      const datos = [];
      datos.data = datosprestamo;
      console.log(datos);
      setCalculado(datos);

      setDatosCargados(true);
      setOpenBackdrop(false);

    }
  };


  //Usado para enviar api en modo editar
  useEffect(() => {
    //Funcion para carga inicial si se desea usar el useEfect utilizar debajo o declarar una nueva
    const fetchDataProcesaDatos = async () => {
      if (cargarDataInicial) {
        // Calcula el resultado basado en tablasData
        const resultado = tablasData.reduce((acc, item) => {
          // Itera sobre cada periodo en el objeto actual
          item.periodos.forEach((periodo) => {
            const montoConvertido = periodo.monto.replace(/[$,]/g, ''); // Limpiar el monto
            const monto = parseFloat(montoConvertido); // Convierte a número flotante

            // Verifica si el valor es un número válido
            if (!isNaN(monto) && monto !== null && monto !== '') {
              acc += monto; // Suma el monto válido al acumulador
            } else {
              setOpenBackdrop(false);
              console.error(`Valor inválido encontrado: ${periodo.monto}`);
            }
          });

          return acc; // Devuelve el acumulador
        }, 0);  // El acumulador comienza en 0

        // Verifica si se debe mostrar el mensaje de error
        if (resultado === 0) {
          setErrorMessage("Se deben ingresar un valor en prestamo");
          setOpenSnack(true);
          return;
        }
        setFormData({ ...formData, prestamo: resultado });
        const data = crearDatosProcesarDatos();
        setOpenBackdrop(true);

        try {
          // Llama al servicio para procesar datos
          const response = await LifeService.fetchProcesaDatos(data);
          if (response.codigo === 200) {
            sessionStorage.setItem(LS_TABLAACTUALIZDA, JSON.stringify(response));
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
  }, [tablasData]);


  const cargarDatosPoliza = async () => {
    let ramo = JSON.parse(sessionStorage.getItem(LS_RAMO));
    let idCotizacion = sessionStorage.getItem(LS_COTIZACION);
    let producto = JSON.parse(sessionStorage.getItem(LS_PRODUCTO));

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
    let idCotizacion = sessionStorage.getItem(LS_COTIZACION);

    let dato = {
      usuario: userId.id,
      id_CotiGeneral: idCotizacion,
    };
    try {
      handleOpenBackdrop(true);
      const cotizacion = await QuoterService.fetchConsultarCotizacionGeneral(
        dato
      );
      handleOpenBackdrop(false);
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
        setFormData((formData) => ({ ...formData, city: ciudades.data[4].Codigo }));
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
        await setFormData((formData) => ({ ...formData, country: paises.data[69].codpais,  countryConyugue: paises.data[69].codpais, }));

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
        await setFormData((formData) => ({ ...formData, province: provincias.data[9].Codigo }));
        await cargarCiudad(provincias.data[9].Codigo);
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
      producto = sessionStorage.getItem(LS_PRODUCTO);
      ramo = JSON.parse(sessionStorage.getItem(LS_RAMO));

      const vigencia = await LifeService.fetchVidaProducto(ramo, producto);
      if (vigencia && vigencia.data) {
        setVigencia(vigencia.data.vigencia);
        setFormData((formData) => ({ ...formData, vigencia: vigencia.data.vigencia[0].Codigo }));
        const newFinVigencia = inicioVigencia.add(vigencia.data.vigencia[0].Codigo, 'month');
        setFinVigencia(newFinVigencia);
        //let preguntasVida = vigencia.data.arrDeclaracionesAsegurado.pregunta
        let documentosVida = vigencia.data.documentos
        let tabla1 = vigencia.data.crearTablaPeriodos.tabla1
        if (tabla1.EtiquetaTable.codigo) {

          sessionStorage.setItem(LS_VIDACOBERTURA, tabla1.EtiquetaTable.codigo);
        }


        setTablasData([]);
        const tablaDinamicaCoberturas = vigencia.data.configuracionTabla.conf_amparos;
        const tablasConfAmparos = Object.entries(tablaDinamicaCoberturas).map(([key, value]) => ({
          codcob: key,
          carcob: value.tipo.toString(),  // Asigna un valor para carcob según tu lógica
          tipcob: value.tipo === 1 ? "BASICA" : "ADICIONAL", // Lógica para determinar tipcob
          nomcob: value.nomcob,
          numcob: "", // Si tienes lógica para numcob, puedes agregarla aquí
          selcob: "1", // Si necesitas asignar un valor específico
          pidecapital: value.tipo === 1 ? "N" : "S", // Lógica para pidecapital
          periodos: generarPeriodos(Object.keys(value.periodos).length) // Asumiendo que generas periodos según la longitud de la entrada
        }));
        setTablasData(tablasConfAmparos);

        sessionStorage.setItem(LS_FPAGO, vigencia.data.frm_pago);
        sessionStorage.setItem(LS_TPRESTAMO, vigencia.data.tipo_prestamo);



        setFormData((formData) => ({ ...formData, tipoProducto: vigencia.data.tipo_prestamo }));

        const preguntasprevias = JSON.parse(sessionStorage.getItem(LS_PREGUNTASVIDA));
        if (!(preguntasprevias && preguntasprevias.length > 0)) {

          //sessionStorage.setItem(LS_PREGUNTASVIDA, JSON.stringify(preguntasVida));
        }

        if (vigencia.data.polizas[0]) {
          sessionStorage.setItem(LS_VIDAPOLIZA, JSON.stringify(vigencia.data.polizas[0].Codigo));
        } else {
        }

        sessionStorage.setItem(LS_TABLACALC, JSON.stringify(tabla1));
        setTablecalc(tabla1);
        sessionStorage.setItem(LS_DOCUMENTOSVIDA, JSON.stringify(documentosVida));// se omite el stringify por que de base esta pasado como string
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
    const producto = Number(sessionStorage.getItem(LS_PRODUCTO));
    let listaProductos = JSON.parse(localStorage.getItem(API_SUBBALDOSAS)) || [];
    if (listaProductos.length > 0) {
      const resultado = listaProductos
        .filter(item => item.producto === producto)
        .map(item => item.titulo);

      setNomnbreProducto(resultado);
    } else {
      setNomnbreProducto([]); // O algún valor predeterminado
    }
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
      let idCotizacion = sessionStorage.getItem(LS_COTIZACION);

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

    const poliza = JSON.parse(sessionStorage.getItem(LS_VIDAPOLIZA));
    const periodos = tablasData.map((item) => {
      return {
        codigo: item.codcob,
        datos: item.periodos.map((periodo, index) => ({
          monto: periodo.monto.replace(/[$,]/g, ''),
          periodo: index + 1,
          vigencia: "",
          nomcob: item.nomcob || 0
        }))
      };
    });
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
      objPeriodos: periodos,
      poliza: poliza,
      porAjuste: "0.00",
      genero: formData.genero,
      producto: producto,
      ramoAlt: ramo,
      ramoOri: ramo,
      tipoContrato: formData.tipoProducto, // Uso de tipoPrestamo aquí
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

    if (name === "tipoProducto") {
      const tipo_prestamo = sessionStorage.getItem(LS_TPRESTAMO)
      console.log(value);
      console.log(tipo_prestamo);
      if ((value !== tipo_prestamo)) {
        if (tipo_prestamo !== 'A' || value === 'Z') {
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

    const fetchDataCargaInicial = async () => {
      if (formData.vigencia) {
        if (datosCargados) {
          handleOpenBackdrop();
          let tipoPrestamo = (formData.status === 2 || formData.status === 5) ? 'M' : 'I';
          try {
            const data = await LifeService.fetchTablaPeriodo(ramo, producto, tipoPrestamo, formData.vigencia, inicioVigencia.format("DD/MM/YYYY"));
            sessionStorage.setItem(LS_TABLACALC, JSON.stringify(data.data.conf_amparos));
            console.log(data.data.montoPeriodo);

            setCalculado(data);

            handleCloseBackdrop();
          } catch (error) {
            console.error("Error fetching data:", error);
            handleCloseBackdrop();
          } finally {
            setOpenBackdrop(false);
          }
          if(formData.vigencia !=0){
            setDisabledMonto(false);
          }

        } else {
          handleCloseBackdrop();
        }
      }else{
        setDisabledMonto(true);
        if (datosCargados) {
          if(formData.vigencia ==0){
            setErrorMessage("La vigencia seleccionada no es valida");
            setOpenSnack(true);
            setDisabledMonto(true);
          }
        }
      }
      
    };
    fetchDataCargaInicial();
  }, [formData.vigencia]);
  //Cuando cambie la variable vigencia
  useEffect(() => {
    fetchDataDocumento();
  }, [formData.vigencia, formData.prestamo, age]);


  useEffect(() => {
    fetchDataPreguntas();
  }, [formData.prestamo,formData.ageCalculated]);

  const fetchDataPreguntas = async () => {
    if (formData.prestamo && formData.ageCalculated  ) {
      if (datosCargados) {
        try {
          handleOpenBackdrop();
          const data = await LifeService.fetchActualizaPreguntas(ramo, producto,formData.prestamo,formData.ageCalculated);
          let preguntasVida = data.data.arrDeclaracionesAsegurado.pregunta;
          if (data) {
            sessionStorage.setItem(LS_PREGUNTASVIDA, JSON.stringify(preguntasVida));
          } 
          handleCloseBackdrop();
        } catch (error) {
          //setErrorMessage("No existen Preguntas asignadas con los parametros ingresados");
          //setOpenSnack(true);
          sessionStorage.setItem(LS_PREGUNTASVIDA, JSON.stringify([]));
          handleCloseBackdrop();
        } finally {
          setOpenBackdrop(false);
        }
      }
    }
  }

  const fetchDataDocumento = async () => {
    if (formData.vigencia && formData.prestamo && age) {
      if (datosCargados) {
        let tipoPrestamo = (formData.status === 2 || formData.status === 5) ? 'M' : 'I';
        try {
          handleOpenBackdrop();
          const data = await LifeService.fetchActualizaDocumento(ramo, producto, tipoPrestamo, age.format("DD/MM/YYYY"), inicioVigencia.format("DD/MM/YYYY"), finVigencia.format("DD/MM/YYYY"), formData.prestamo, formData.vigencia);
          if (data) {
            sessionStorage.setItem(LS_DOCUMENTOSVIDA, JSON.stringify(data));
          } else {
            console.log("No existen documentos para este grupo de parametros Revise requisito de asegurabilidad");
          }
          handleCloseBackdrop();
        } catch (error) {
          console.error("Error fetching data:", error);
          handleCloseBackdrop();
        } finally {
          setOpenBackdrop(false);
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
        if(documentType =='C'){
          await consultUserData(documentType, identification);
        }
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

  const verifyIdentificationConyugue = async (e) => {
    const { value } = e.target;
    let documentType = 'C';
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
        if(documentType =='C'){
          await consultConyugueData(documentType, identification);
        }
        handleCloseBackdrop();
      } else {
        
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

        if(cedulaData.message!=='ok' ){
          Swal.fire({
            title: "Alerta!",
            text: cedulaData.message,
            icon: "warning",
            confirmButtonText: "Ok",
          });
        }

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
          ageCalculated: parseInt(cedulaData.data[0].cli_edad) || "",
          genero: cedulaData.data[0].cli_sexo || "",
          
        });
      }else{
        verificarLavadoActivo(cedulaData);
        setFormData({
          ...formData,
          name:  "",
          lastname: "",
          email: "",
          phone: "",
          address: "",
          ageCalculated: "",
          genero:  "",
        });
      }
    } catch (error) {
      console.error("Error al verificar cédula:", error);
    }
  };




  function verificarLavadoActivo(cedulaData) {
 
    setErrorCedula(true);
    setOpen(true);
    setmessageError(cedulaData.message);
    handleCloseBackdrop();
    if (
      cedulaData &&
      cedulaData.codigo === 500
    ) {

      Swal.fire({
        title: "Alerta!",
        text: cedulaData.message,
        icon: "warning",
        confirmButtonText: "Ok",
      }).then(() => {
        //Accion para lista de lavado de activos
      });
    }
  }


  const consultConyugueData = async (documentType, identification) => {
    try {
      const cedulaData = await UsuarioService.fetchConsultarUsuario(
        documentType,
        identification
      );
      if (cedulaData.codigo === 200 && cedulaData.data) {
        if(cedulaData.message!=='ok' ){
          Swal.fire({
            title: "Alerta!",
            text: cedulaData.message,
            icon: "warning",
            confirmButtonText: "Ok",
          });
        }
        const dateString = cedulaData.data[0].cli_fecnacio;
        const dateObject = dayjs(dateString, "YYYY-MM-DD", true);
        setConyugueAge(dateObject);
        setFormData({
          ...formData,
          conyugenombre: cedulaData.data[0].cli_nombres || "",
          conyugeapellido: cedulaData.data[0].cli_apellidos || "",
          conyugesexo: cedulaData.data[0].cli_sexo || "",
          ageConyugueCalculated: parseInt(cedulaData.data[0].cli_edad) || "",
        });
      }else{
        verificarLavadoActivo(cedulaData);
        setFormData({
          ...formData,
          conyugenombre:  "",
          conyugeapellido: "",
          conyugesexo:  "",
          ageConyugueCalculated: "",
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
    
    
    let continuar =  await handleOpenModal();
   if(!continuar){
    return false;
   }

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

    if (formData.phone === '') {
      setErrorMessage("Se debe ingresar datos en télefono")
      setOpenSnack(true);
      return false;
    }

    if (formData.email === '') {
      setErrorMessage("Se debe ingresar datos en email")
      setOpenSnack(true);
      return false;
    }


    const poliza = JSON.parse(sessionStorage.getItem(LS_VIDAPOLIZA));
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
    let producto = JSON.parse(sessionStorage.getItem(LS_PRODUCTO));
    let userId = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    const cobertura = sessionStorage.getItem(LS_VIDACOBERTURA);
    //JSON PARA MAPEAR LOS CAMPOS Y ENVIARLOS
    let datosconyugues = {};

    if(formData.status === CodigoComboCasado || formData.status === CodigoComboUnionLibre){
       datosconyugues = {
        nombreConyuge: formData.conyugenombre,
        apellidoConyuge: formData.conyugeapellido,
        identificacion: formData.conyugenumero,
        fechaNacimiento: conyugueage ? conyugueage.format("DD/MM/YYYY") : "",
        genero: formData.conyugesexo,
        tipo: formData.conyugetipo,
        pais: formData.countryConyugue
      };
    }else {
      datosconyugues = {
        nombreConyuge: '',
        apellidoConyuge: '',
        identificacion: '',
        fechaNacimiento: '',
        genero: '',
        tipo: '',
        pais: '',
      };
    }


    const periodos = tablasData.map((item) => {
      return {
        codigo: item.codcob, // Usar codcob de tablasData
        datos: item.periodos.map((periodo, index) => ({
          monto: periodo.monto.replace(/[$,]/g, ''), // Limpiar el monto
          tipo_monto: "",
          nomcob: item.nomcob,
          desempleo: periodo.desempleo || 0,
          periodo: index + 1,
          vigencia: formData.vigencia,
          vigencia_desde: periodo.vigencia_desde,
          vigencia_hasta: periodo.vigencia_hasta,
          fecha_desde: periodo.fecha_desde,
          fecha_hasta: periodo.fecha_hasta,
          total_dias: periodo.total_dias,
          tasa: periodo.tasa,
          prima_anio: periodo.prima_anio,
          prima_dia: periodo.prima_dia,
          prima_total: periodo.prima_total,
        }))
      };
    });

    const arrMontoPeriodo = periodos.reduce((acc, item) => {
      acc[item.codigo] = item.datos; // Aquí item.codigo se usa como clave del objeto acumulado.
      return acc;
    }, {});

    console.log(arrMontoPeriodo);

    console.log(tablasData);

    const datosprestamo = {
      conf_amparos: arrMontoPeriodo,
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
      tipoProducto: formData.tipoProducto
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

    let calc = JSON.parse(sessionStorage.getItem(LS_TABLAACTUALIZDA));

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

    const preguntasVida = JSON.parse(sessionStorage.getItem(LS_PREGUNTASVIDA));
    const dataresp = JSON.parse(sessionStorage.getItem(LS_PREGRESPONDIDAS));

    let preguntas ;

    if(dataresp){
      preguntas = dataresp;
    }else{
      preguntas = preguntasVida;
    }
     


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
      jsonPreguntas: preguntas,
      arrLogTasa: {},
      vidaGrupo: "N",
    }
    const pag = JSON.parse(sessionStorage.getItem(LS_DATOSPAGO));

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
    sessionStorage.setItem(LS_DATOSPAGO, JSON.stringify(totalPagar));

    // Si existen entonces estamos en modo editar
    const application = sessionStorage.getItem(LS_IDCOTIZACIONVIDA);
    const id_cotigeneral = sessionStorage.getItem(LS_COTIZACION);

    if (application !== null && application !== undefined && application !== '') {
      data.aplicacion = application;
    }
    if (id_cotigeneral !== null && id_cotigeneral !== undefined && id_cotigeneral !== '') {
      data.id_CotiGeneral = id_cotigeneral;
    }



    sessionStorage.setItem(LS_DATAVIDASEND, JSON.stringify(data));
    try {
      handleOpenBackdrop();
      const response = await LifeService.fetchGrabaDatosVida(data);

      handleCloseBackdrop();
      if (response.codigo === 200) {
        const idVida = response.data.aplicacion;
        sessionStorage.setItem(LS_IDCOTIZACIONVIDA, idVida);

        const idCotizacion = response.data.id_CotiGeneral;
        sessionStorage.setItem(LS_COTIZACION, idCotizacion);
        handleCloseBackdrop();
        sessionStorage.removeItem(LS_POLVIDAEDIT);
        sessionStorage.removeItem(DATOS_PERSONALES_STORAGE_KEY);
        sessionStorage.removeItem(LS_PROCESODATOSVIDA);
        sessionStorage.removeItem(LS_TABLAACTUALIZDA);
        sessionStorage.removeItem(LS_TABLACALC);
        sessionStorage.removeItem(LS_VIDACOBERTURA);
        sessionStorage.removeItem(LS_VIDAPOLIZA);
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

    const todosTienenNumero = tablasData.every((item) => {
      // Verificar que cada item tiene periodos y que cada periodo tiene un monto válido
      return item.periodos.every((periodo) => {
        const monto = periodo.monto.replace(/[$,]/g, ''); // Limpiar el monto
        return monto !== undefined && monto !== null && monto !== '' && !Number.isNaN(Number(monto));
      });
    });


    if (!todosTienenNumero) {
      setErrorMessage("Se deben ingresar valores validos en la tabla de montos")
      setOpenSnack(true);
      
      return false;
    }

    if (formData.vigencia === '' || formData.vigencia === 0) {
      setErrorMessage("Se deben ingresar datos en vigencia")
      setOpenSnack(true);
      return false;
    }

    //SUMATORIA DE PRESTAMO A PARTIR DE LA TABLA DE CALCULOS
    const resultado = tablasData.reduce((acc, item) => {
      // Itera sobre cada periodo en el objeto actual
      item.periodos.forEach((periodo) => {
        const montoConvertido = periodo.monto.replace(/[$,]/g, ''); // Limpiar el monto
        const monto = parseFloat(montoConvertido); // Convierte a número flotante

        // Verifica si el valor es un número válido
        if (!isNaN(monto) && monto !== null && monto !== '') {
          acc += monto; // Suma el monto válido al acumulador
        } else {
          console.error(`Valor inválido encontrado: ${periodo.monto}`);
          return false;
        }
      });

      return acc; // Devuelve el acumulador
    }, 0); // El acumulador comienza en 0

    setFormData({ ...formData, prestamo: resultado });


    // if (formData.prestamo === '') {
    //   setErrorMessage("Se deben ingresar un valor en prestamo")
    //   setOpenSnack(true);
    //   return;
    // }
    try {
      const data = crearDatosProcesarDatos();
      setOpenBackdrop(true);
      const response = await LifeService.fetchProcesaDatos(data);
      if (response.codigo === 200) {
        setOpenBackdrop(false);
        sessionStorage.setItem(LS_TABLAACTUALIZDA, JSON.stringify(response));
        setCalculado(response);
      } else {
        setErrorMessage(response.message);
        setOpenSnack(true);

        setCalculado([]);
        setOpenBackdrop(false);
        return false;
      }
    } catch (error) {
      setErrorMessage("Error al procesar los datos.");
      setOpenSnack(true);
      return false;
    } finally {
      setOpenBackdrop(false);
    }
    return true;
        // setOpenModal(true);
  };


  useEffect(() => {
    if (calculado && calculado.data && calculado.data.conf_amparos) {
      const result = calculado.data.conf_amparos
        ? Object.entries(calculado.data.conf_amparos).map(([codCob, periodos]) => ({
          codcob: codCob,
          carcob: "1",
          tipcob: "BASICA",
          nomcob: periodos[1]?.nomcob || periodos[0]?.nomcob,
          numcob: "",
          selcob: "1",
          pidecapital: "N",
          periodos: Object.entries(periodos).map(([periodo, item]) => ({
            periodo: parseInt(periodo, 10),
            monto: item.monto || '',
            tasa: item.tasa || '',
            prima: item.prima_anio || '',
            vigencia: null,
            tipo_monto: "",
            vigencia_desde: item.vigencia_desde,
            vigencia_hasta: item.vigencia_hasta,
            fecha_desde: item.fecha_desde,
            fecha_hasta: item.fecha_hasta,
            total_dias: item.total_dias,
            prima_anio: item.prima_anio,
            prima_dia: item.prima_dia,
            prima_total: item.prima_total,
          }))
        }))
        : [];

      setTablasData(result);

      let prima = 0;
      for (let key in calculado.data.conf_amparos) {

        for (let subKey in calculado.data.conf_amparos[key]) {
          let item = calculado.data.conf_amparos[key][subKey];
          prima = item.prima_anio + prima;
        }
      }

      let impuesto = 0;
      const parametros = JSON.parse(localStorage.getItem(PARAMETROS_STORAGE_KEY));
      console.log(prima);
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
      sessionStorage.setItem(LS_DATOSPAGO, JSON.stringify(totalPagar));

      // Actualiza el formData con los valores calculados y redondeados
      setFormData({
        ...formData,
        prima: parseFloat(primaNumber.toFixed(2)),
        primaMensual: parseFloat((total / 12).toFixed(2)),
        primaTotal: total,
        impuesto: impuesto,

      });
    } else if (calculado && calculado.data && calculado.data.montoPeriodo) {
      const tablaDinamicaCoberturas = calculado.data.montoPeriodo;
      const tablasConfAmparos = Object.entries(tablaDinamicaCoberturas).map(([key, value]) => ({
        codcob: key,
        carcob: value.tipo.toString(),  // Asigna un valor para carcob según tu lógica
        tipcob: value.tipo === 1 ? "BASICA" : "ADICIONAL", // Lógica para determinar tipcob
        nomcob: value.nomcob,
        numcob: "", // Si tienes lógica para numcob, puedes agregarla aquí
        selcob: "1", // Si necesitas asignar un valor específico
        pidecapital: value.tipo === 1 ? "N" : "S", // Lógica para pidecapital
        periodos: generarPeriodos(Object.keys(value.periodos).length) // Asumiendo que generas periodos según la longitud de la entrada
      }));
      setTablasData(tablasConfAmparos);
      console.log(tablasConfAmparos);
      setTablasData(tablasConfAmparos);
    } else {
      // Recupera los datos actuales de tablasData
      const currentData = [...tablasData]; // Copia los datos actuales

      // Mapea los datos para restablecer solo monto, tasa y prima
      const updatedData = currentData.map(cobertura => {
        return {
          ...cobertura,
          periodos: cobertura.periodos.map(periodo => ({
            ...periodo,
            monto: '',    // Borra el monto
            tasa: '',     // Borra la tasa
            prima: ''     // Borra la prima
          }))
        };
      });
      setcargarDataInicial(false);
      // Actualiza tablasData con los nuevos valores
      setTablasData(updatedData);
    }
  }, [calculado]);

  const verificaPrestamo = async (numPrestamo) => {
    var idCotizacion = sessionStorage.getItem(LS_COTIZACION);
    setOpenBackdrop(true);
    const response = await LifeService.fetchVerificaPrestamo(producto, numPrestamo, idCotizacion);
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
    let calc = JSON.parse(sessionStorage.getItem(LS_TABLAACTUALIZDA));
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


  const handleTableChange = React.useCallback((e, codcobIndex, periodoIndex, field) => {
    const newValue = e.target.value;


    setTablasData(prevData => prevData.map((item, i) => (
      i === codcobIndex ? {
        ...item,
        periodos: item.periodos.map((periodo, j) => (
          j === periodoIndex ? { ...periodo, [field]: newValue } : periodo
        ))
      } : item
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
              {/* <MenuItem value="R">RUC</MenuItem> */}
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
                    onBlur={verifyIdentificationConyugue}
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

        </Grid>

        <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingTop: '30px', fontWeight: 'bold' }}>
          CALCULOS
        </Typography>


        {tablasData.length > 0 ? (tablasData.map((item, index) => (
          <TableContainer key={item.codcob} style={{ overflow: "auto", height: "100%", marginBottom: 70, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <h3>{item.nomcob}</h3>
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
                {item.periodos.map((periodo, periodoIndex) => (
                  <MemoizedRow
                    key={periodoIndex}
                    item={periodo}
                    codcobIndex={index}
                    periodoIndex={periodoIndex}
                    handleTableChange={handleTableChange}
                    disabledMonto = {disabledMonto}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ))) : (
          <p>No hay coberturas disponibles configuradas para este producto.</p>
        )}
        <Grid item xs={10.5} md={3} style={{ paddingTop: '0px', paddingBottom: '25px' }}>
          <Button
            onClick={handleOpenModal}
            sx={{ mr: 1 }}
            className="button-styled-primary"
            style={{ top: "20%", backgroundColor: '#0099a8', color: "white", borderRadius: "5px" }}
          >
            Calcular
          </Button>
        </Grid>


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
