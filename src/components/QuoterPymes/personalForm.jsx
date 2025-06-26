import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TextField, Grid, Alert } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "../../styles/form.scss";
import ValidationUtils from "../../utils/ValiationsUtils";
import UsuarioService from "../../services/UsuarioService/UsuarioService";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import {
  DATOS_PERSONALES_STORAGE_KEY,
  LS_COTIZACION,
  USER_STORAGE_KEY,
} from "../../utils/constantes";
import QuoterService from "../../services/QuoterService/QuoterService";

dayjs.extend(customParseFormat);

const PersonalForm = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    documentType: "C",
    identification: "",
    age: "",
    address: "",
  });
  const maxDate = dayjs().subtract(18, "years");
  const [error, setError] = useState("");
  const [messageError, setmessageError] = useState("");
  const [errorCedula, setErrorCedula] = useState(false);
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState(maxDate);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const isMounted = useRef(false);

  const cargarDatos = async () => {
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

  useEffect(() => {
    isMounted.current = true; // Establecer a true cuando el componente está montado
    const modoEditar = async () => {
      let idCotizacion = localStorage.getItem(LS_COTIZACION);
      if (idCotizacion) {
        await cargarDatos();
      }
    };

    modoEditar();

    return () => {
      isMounted.current = false; // Establecer a false cuando el componente se desmonta
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let modifiedValue = value;
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

  const consultUserData = async (documentType, identification) => {
    let userId = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
        console.log("modulo pymes",userId);
        try {
            const cedulaData = await UsuarioService.fetchConsultarUsuario_v2(
                documentType, 
                identification, 
                userId.id
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

    const objetoSeguro = {
      nombre: formData.name,
      apellido: formData.lastname,
      correo: formData.email,
      telefono: formData.phone,
      tipoDocumento: formData.documentType,
      identificacion: formData.identification,
      fechaNacimiento: formattedDate,
      direccion: formData.address,
    };
    localStorage.setItem(
      DATOS_PERSONALES_STORAGE_KEY,
      JSON.stringify(objetoSeguro)
    );
    return next;
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  return (
      <Card elevation={4} sx={{ width: '100%', m: 2, mx: 'auto', paddingTop: '30px', paddingBottom: '30px', }}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '30px', fontWeight: 'bold' }}>
          DATOS PERSONALES 
        </Typography>
          <FormControl
            component="form"
            onSubmit={handleSubmit}
            style={{width: '100%', paddingLeft: '30px', paddingRight: '10px', paddingBottom: '20px'}}
          >
            <Grid container spacing={2}>
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
                  type="text"
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              <Grid item xs={10.5} md={3} style={{paddingTop: '21px'}} >
                <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                  Teléfono <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  placeholder="Teléfono"
                  type="number"
                  disabled={errorCedula}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                  required
                />
              </Grid>
              <Grid item xs={10.5} md={3} style={{paddingTop: '21px'}} >
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
              <Grid item xs={10.5} md={2.5} style={{paddingTop: '21px'}} >
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
            </Grid>
            {error && <Alert severity="error">{error}</Alert>}
          </FormControl>
      </Card>
  );
});

export default PersonalForm;
