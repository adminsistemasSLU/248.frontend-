import React, { useState, forwardRef, useImperativeHandle } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TextField, Container, Grid, Paper, Alert } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
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
import { DATOS_PERSONALES_STORAGE_KEY } from "../../utils/constantes";

dayjs.extend(customParseFormat);
const PersonalForm = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    documentType: "",
    identification: "",
    age: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [messageError, setmessageError] = useState("");
  const [errorCedula, setErrorCedula] = useState(false);
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState(dayjs());
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

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

    console.log("Formulario enviado:", objetoSeguro, next);
    return next;
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper
        elevation={3}
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "20px",
        }}
      >
        <FormControl
          component="form"
          variant="standard"
          onSubmit={handleSubmit}
          className="form"
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
            <Grid item xs={12}>
              <InputLabel id="documentType-Label">
                Seleccione documento
              </InputLabel>
              <Select
                labelId="documentType-Label"
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                style={{ textAlign: "left" }}
                variant="standard"
                fullWidth
                required
              >
                <MenuItem value="C">Cédula</MenuItem>
                <MenuItem value="R">RUC</MenuItem>
                <MenuItem value="P">Pasaporte</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              {errorCedula ? (
                <Alert
                  severity="error"
                  style={{ fontSize: "10px", textAlign: "start" }}
                >
                  El documento de identificación no es valido.
                </Alert>
              ) : null}

              <TextField
                label="Documento de identificación"
                type={formData.documentType === "P" ? "text" : "text"}
                name="identification"
                value={formData.identification}
                onChange={handleChange}
                onBlur={verifyIdentification}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                label="Nombres"
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
            <Grid item xs={12} md={12}>
              <TextField
                label="Apellidos"
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

            <Grid item xs={12} md={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Fecha de nacimiento"
                    slotProps={{
                      textField: { variant: "standard", size: "small" },
                    }}
                    value={age}
                    format="DD/MM/YYYY"
                    disabled={errorCedula}
                    className="datePicker"
                    onChange={(newValue) => {
                      setAge(newValue);
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Teléfono"
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
            <Grid item xs={12}>
              <TextField
                label="Dirección"
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
            <Grid item xs={12}>
              <TextField
                label="Email"
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

          {/* Botón de envío */}
          {/* <Button type="submit" variant="contained" style={{ backgroundColor: '#00a99e', color: '#fff',marginTop:'20px' }} fullWidth>
            Registrarse
          </Button> */}
          {error && <Alert severity="error">{error}</Alert>}
        </FormControl>
      </Paper>
    </Container>
  );
});

export default PersonalForm;
