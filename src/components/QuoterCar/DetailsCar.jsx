import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TextField, Grid, Alert, Button } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "../../styles/form.scss";
import ValidationUtils from "../../utils/ValiationsUtils";
import UsuarioService from "../../services/UsuarioService/UsuarioService";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import "../../styles/button.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import {
  DATOS_PERSONALES_STORAGE_KEY,
  LS_COTIZACION,
  USER_STORAGE_KEY,
} from "../../utils/constantes";
import QuoterService from "../../services/QuoterService/QuoterService";

dayjs.extend(customParseFormat);

const DetailsCar = forwardRef((props, ref) => {
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

  const [cars, setCars] = useState([]);

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

  const handleAddCar = () => {
    const newCar = {
      placa: formData.placa,
      marca: formData.name,
      modelo: formData.lastname,
      anio: formData.anio, // Añade este campo en el formData
      antiguedad: dayjs().diff(formData.anio, "year"),
      costo: formData.valor_vehiculo,
      tasa: "TBD", 
      prima: "TBD" 
    };
    setCars([...cars, newCar]);

  };

  const handleDeleteCar = (index) => {
    const updatedCars = cars.filter((_, i) => i !== index);
    setCars(updatedCars);
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  return (
    <Card elevation={4} sx={{ width: '100%', m: 2, mx: 'auto', paddingTop: '30px', paddingBottom: '20px', }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '30px', fontWeight: 'bold' }}>
        DATOS DEL VEHÍCULO
      </Typography>
      <FormControl
        component="form"
        onSubmit={handleSubmit}
        style={{ width: '100%', paddingLeft: '30px', paddingRight: '10px', paddingBottom: '20px' }}
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
          <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Placa <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              type={formData.documentType === "P" ? "text" : "text"}
              name="placa"
              placeholder="Placa"
              variant="standard"
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Marca <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Marca"
              type="text"
              name="marca"
              value={formData.name}
              onChange={handleChange}
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 30 }}
              required
            />
          </Grid>
          <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Modelo <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Modelo"
              type="text"
              name="modelo"
              value={formData.lastname}
              onChange={handleChange}
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 30 }}
              required
            />
          </Grid>
          <Grid item xs={10.5} md={2.5} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Año  <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Select
              labelId="documentType-Label"
              id="anio"
              name="anio"
              // value={formData.documentType}
              value={"2001"}
              style={{ textAlign: "left", }}
              variant="standard"
              onChange={handleChange}
              placeholder="Año"
              fullWidth
              required
            >
              <MenuItem value="2001">2001</MenuItem>
              <MenuItem value="2002">2002</MenuItem>
              <MenuItem value="2003">2003</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Zona circulación <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Select
              labelId="documentType-Label"
              id="zona"
              name="anio"
              // value={formData.documentType}
              value={"1"}
              style={{ textAlign: "left", }}
              variant="standard"
              onChange={handleChange}
              placeholder="Zona"
              fullWidth
              required
            >
              <MenuItem value="C">Costa</MenuItem>
              <MenuItem value="S">Sierra</MenuItem>
              <MenuItem value="O">Oriente</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Valor del vehículo <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Valor del vehículo"
              type="number"
              onChange={handleChange}
              name="valor_vehiculo"
              variant="standard"
              fullWidth
              inputProps={{ maxLength: 10 }}
              required
            />
          </Grid>
          <Grid item xs={10.5} md={3} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Valor accesorios <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Dirección"
              type="text"
              onChange={handleChange}
              name="address"
              variant="standard"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={10.5} md={2.5} style={{ paddingTop: '21px' }} >
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Total suma asegurada <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              placeholder="Total Suma Asegurada"
              type="text"
              onChange={handleChange}
              name="suma_asegurada"
              variant="standard"
              fullWidth
              required
            />
          </Grid>
        </Grid>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid item xs={10.5} md={2.5} style={{ paddingTop: '31px' }} >
          <Button
            sx={{ mr: 1 }}
            className="button-styled-primary"
            style={{ top: "20%", backgroundColor: '#0099A8', color: "white" }}
            onClick={handleAddCar}
          >
            Aceptar
          </Button>
        </Grid>
        <Grid item xs={10.5} md={12} style={{ paddingTop: '31px' }} >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="car table">
              <TableHead>
                <TableRow>
                  <TableCell>Placa</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell>Modelo</TableCell>
                  <TableCell>Año</TableCell>
                  <TableCell>Antigüedad</TableCell>
                  <TableCell>Costo</TableCell>
                  <TableCell>Tasa</TableCell>
                  <TableCell>Prima</TableCell>
                  <TableCell>Eliminar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cars.map((car, index) => (
                  <TableRow key={index}>
                    <TableCell>{car.placa}</TableCell>
                    <TableCell>{car.marca}</TableCell>
                    <TableCell>{car.modelo}</TableCell>
                    <TableCell>{car.anio}</TableCell>
                    <TableCell>{car.antiguedad} años</TableCell>
                    <TableCell>{car.costo}</TableCell>
                    <TableCell>{car.tasa}</TableCell>
                    <TableCell>{car.prima}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteCar(index)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </FormControl>
    </Card>
  );
});

export default DetailsCar;
