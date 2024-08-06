import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TextField, Grid, Alert,Snackbar,AlertTitle } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ComboService from "../../services/ComboService/ComboService";
import "../../styles/form.scss";
import ValidationUtils from "../../utils/ValiationsUtils";
import UsuarioService from "../../services/UsuarioService/UsuarioService";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import {
  LS_COTIZACION,
  USER_STORAGE_KEY,
  LS_PRODUCTO,
  LS_RAMO,
  LS_PREGUNTASVIDA,
  LS_DOCUMENTOSVIDA
} from "../../utils/constantes";
import QuoterService from "../../services/QuoterService/QuoterService";
import { Button } from "@mui/base";
import LifeService from '../../services/LifeService/LifeService';

dayjs.extend(customParseFormat);
const producto = localStorage.getItem(LS_PRODUCTO);
const ramo = JSON.parse(localStorage.getItem(LS_RAMO));


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
    status: "0",

    conyugetipo: "C",
    conyugenumero: "",
    conyugeapellido: "",
    conyugenombre: "",
    conyugefecha: "",
    conyugesexo: "",
    conyugeestadocivil: "",

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

    conyugetipo: false,
    conyugenumero: false,
    conyugeapellido: false,
    conyugenombre: false,
    conyugefecha: false,
    conyugesexo: false,
    conyugeestadocivil: false,

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

  const [openSnack, setOpenSnack] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const maxDate = dayjs().subtract(18, "years");
  const [error, setError] = useState("");
  const [messageError, setmessageError] = useState("");
  const [errorCedula, setErrorCedula] = useState(false);
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState(maxDate);
  const [inicioVigencia, setInicioVigencia] = useState(dayjs());
  const [finVigencia, setFinVigencia] = useState(dayjs());
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const isMounted = useRef(false);
  //Combos
  const [estadoCivil, setEstadoCivil] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [vigencia, setVigencia] = useState([]);
  //Constantes
  const CodigoComboCasado = "02";
  const CodigoComboUnionLibre = "05";
  const cargarDatos = async () => {

    const dataPersonal = await cargarCotizacion();

    console.log(dataPersonal);
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
      }));
      const dateObject = dayjs(dataPersonal[0].clinacimiento, "YYYY/MM/DD");
      setAge(dateObject);
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
    setCiudades([]);
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
    setEstadoCivil([]);

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

  const cargarVigencia = async () => {
    try {
      const vigencia = await LifeService.fetchVidaProducto(ramo, producto);
      if(vigencia && vigencia.data){
        setVigencia(vigencia.data.vigencia);
        setFormData((formData) => ({ ...formData, vigencia: vigencia.data.vigencia[0].value }));
        const newFinVigencia = inicioVigencia.add(vigencia.data.vigencia[0].value, 'month');
        setFinVigencia(newFinVigencia);
        
        let preguntasVida = vigencia.data.arrDeclaracionesAsegurado.pregunta
        let documentosVida = vigencia.data.documentos
        
        localStorage.setItem(LS_PREGUNTASVIDA, JSON.stringify(preguntasVida));
        localStorage.setItem(LS_DOCUMENTOSVIDA, JSON.stringify(documentosVida));// se omite el stringify por que de base esta pasado como string
        console.log(vigencia);
      }else{
        console.log(vigencia.message);
        setOpenSnack(true);
        setErrorMessage(vigencia.message);
      }
     
    } catch (error) {
      console.error('Error al obtener Vigencia:', error);
    }
  }

  useEffect(() => {
    isMounted.current = true; // Establecer a true cuando el componente está montado
   
    const iniciarDatosCombos = async () => {
      handleOpenBackdrop();
      let idCotizacion = localStorage.getItem(LS_COTIZACION);
      await cargarProvincias();
      await cargarEstadoCivil();
      await cargarVigencia();
      handleCloseBackdrop();
      if (idCotizacion) {
        await cargarDatos();
      }
    };


    const modoEditar = async () => {
      let idCotizacion = localStorage.getItem(LS_COTIZACION);
      
      if (idCotizacion) {
        await cargarDatos();
      }
    };

    iniciarDatosCombos();
    modoEditar();
    
    return () => {
      isMounted.current = false; // Establecer a false cuando el componente se desmonta
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let modifiedValue = value;
    if (name === "province") {
      cargarCiudad(value);
    }

    if (name === "vigencia") {
      const newFinVigencia = inicioVigencia.add(value, 'month');
      console.log(newFinVigencia);
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
        setError("Por favor ingresa un correo electrónico válido.");
      } else {
        setError("");
      }
    }
    setFormData({ ...formData, [name]: modifiedValue });
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

  const actualizarVigencia = (value)=>{
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
          ...formData, // Conserva los valores actuales
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

  const handleSubmit = (e) => {
    const formattedDate = dayjs(age).format("DD/MM/YYYY");
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
    //JSON PARA MAPEAR LOS CAMPOS Y ENVIARLOS
    const objetoSeguro = {
      nombre: formData.name,
      apellido: formData.lastname,
      correo: formData.email,
      telefono: formData.phone,
      tipoDocumento: formData.documentType,
      identificacion: formData.identification,
      fechaNacimiento: formattedDate,
      direccion: formData.address,
      producto: producto,
      ramo: ramo,
      tippoliza: 1,
      usuario: userId,
      zona: formData.province
    };

    // localStorage.setItem(
    //   DATOS_PERSONALES_STORAGE_KEY,
    //   JSON.stringify(objetoSeguro)
    // );

    console.log("Formulario enviado:", objetoSeguro, next);
    return next;
  };


  const jsonDesgravament= () =>{

    const desgravamentObject = {
        ramo: ramo,
        //id_CotiGeneral:2,
        producto: producto,
        riesgo: 1,
        cantidad: 1,
        zona: formData.province,
        ciudad: formData.city,
        direccion: formData.address,

        conyugetipo: "1",
        conyugenumero: formData.conyugenumero,
        conyugeapellido: formData.conyugeapellido,
        conyugenombre: formData.conyugenombre,
        conyugefecha: formData.conyugefecha,
        conyugesexo: formData.conyugesexo,
        conyugeestadocivil: "C",

        vigencia: formData.vigencia,  
        numPrestamo: formData.numPrestamo,
        montodesempleo: formData.montodesempleo,
        monto: formData.prestamo,
        prima: formData.prima, 
        
        // "tasa": "1.25",
        // "arrMontos": "", 
        "arrDeclaracionesAsegurado":  [],       
        "arrRequisitosasegurados": []
    }



  }

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const handleBlur = (e) => {
    setFormDataTouched({ ...formDataTouched, [e.target.name]: true });

  };

  return (
    <Card elevation={4} sx={{ width: '100%', m: 2, mx: 'auto', paddingTop: '30px', paddingBottom: '30px', }}>
      
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
        <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '0px', fontWeight: 'bold' }}>
          DATOS PERSONALES
        </Typography>
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
              Documento de identificación <span style={{ color: 'red' }}>*</span>
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
                    setAge(newValue);
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
          <Grid item xs={10.5} md={3}>
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

        </Grid>

        { (formData.status === CodigoComboCasado || formData.status === CodigoComboUnionLibre)
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
                  Fecha de nacimiento <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  placeholder="Conyugue Fecha de nacimiento"
                  type="text"
                  name="conyugefecha"
                  value={formData.conyugefecha}
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
                  Sexo <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  placeholder="Conyugue Sexo"
                  type="text"
                  name="conyugesexo"
                  value={formData.conyugesexo}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  disabled={errorCedula}
                  inputProps={{ maxLength: 30 }}
                  required
                />

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

          <Grid item xs={10.5} md={3} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Fin de vigencia <span style={{ color: 'red' }}>*</span>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  placeholder="Fecha de nacimiento"
                  slotProps={{
                    textField: { variant: "standard", size: "small" },
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

          <Grid item xs={10.5} md={3}>
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Vigencia del prestamo <span style={{ color: 'red' }}>*</span>
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
                <MenuItem key={index} value={vigencia.Codigo}>
                  {vigencia.Nombre} Meses
                </MenuItem>
              ))}
              
            </Select>
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
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 10 }}
              required
            />
          </Grid>

          <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              $ Prestamo <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Prestamo"
              type="text"
              disabled={errorCedula}
              name="prestamo"
              value={ValidationUtils.Valida_moneda(formData.prestamo)}
              onChange={handleChange}
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 10 }}
              required
            />
          </Grid>

          <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }} >
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
          </Grid>
          <Grid item xs={10.5} md={3} style={{ paddingTop: '25px' }}>
            <Button
              onClick=""
              sx={{ mr: 1 }}
              className="button-styled-primary"
              style={{ top: "20%", backgroundColor: '#0099a8', color: "white", borderRadius: "5px" }}
            >
              Calcular
            </Button>
          </Grid>
        </Grid>

        <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingTop: '30px', fontWeight: 'bold' }}>
          CALCULOS
        </Typography>


        <Grid container spacing={2} style={{ paddingRight: '45px' }}>

          <Grid item xs={10.5} md={3} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              $ Prima <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Prima"
              type="text"
              disabled={errorCedula}
              name="prima"
              value={ValidationUtils.Valida_moneda(formData.prima)}
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
              disabled={errorCedula}
              name="impuesto"
              value={ValidationUtils.Valida_moneda(formData.impuesto)}
              onChange={handleChange}
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 10 }}
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
              disabled={errorCedula}
              name="primaTotal"
              value={ValidationUtils.Valida_moneda(formData.primaTotal)}
              onChange={handleChange}
              variant="standard"
              fullWidth
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
              disabled={errorCedula}
              name="primaMensual"
              value={ValidationUtils.Valida_moneda(formData.primaMensual)}
              onChange={handleChange}
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 10 }}
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
