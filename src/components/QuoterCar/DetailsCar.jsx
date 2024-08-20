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
    placa: "",
    marca: "",
    modelo: "",
    anio: "2001",
    zona: "C",
    valor_vehiculo: "",
    valor_accesorios: "",
    suma_asegurada: "",
  });

  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [messageError, setmessageError] = useState("");
  const [open, setOpen] = useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const isMounted = useRef(false);

  const cargarDatos = async () => {
    const dataPersonal = await cargarCotizacion();
    console.log(dataPersonal);
    if (isMounted.current) {
      setFormData((formData) => ({
        ...formData,
        placa: dataPersonal[0].placa,
        marca: dataPersonal[0].marca,
        modelo: dataPersonal[0].modelo,
        anio: dataPersonal[0].anio,
        zona: dataPersonal[0].zona,
        valor_vehiculo: dataPersonal[0].valor_vehiculo,
        valor_accesorios: dataPersonal[0].valor_accesorios,
        suma_asegurada: dataPersonal[0].suma_asegurada,
      }));
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
      const cotizacion = await QuoterService.fetchConsultarCotizacionGeneral(dato);
      if (cotizacion && cotizacion.data) {
        return cotizacion.data;
      }
    } catch (error) {
      console.error("Error al obtener cotización:", error);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    const modoEditar = async () => {
      let idCotizacion = localStorage.getItem(LS_COTIZACION);
      if (idCotizacion) {
        await cargarDatos();
      }
    };

    modoEditar();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let modifiedValue = value;
    if (name === "placa") {
      modifiedValue = value.toUpperCase();
    }

    if (["valor_vehiculo", "valor_accesorios", "suma_asegurada"].includes(name)) {
      modifiedValue = formatCurrency(value);
    }

    setFormData({ ...formData, [name]: modifiedValue });
  };

  const formatCurrency = (value) => {
    let cleanValue = value.replace(/[^\d,]/g, "");

    if (cleanValue.includes(",")) {
      const [integerPart, decimalPart] = cleanValue.split(",");
      cleanValue = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + decimalPart.slice(0, 2);
    } else {
      cleanValue = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return cleanValue;
  };

  const handleAddCar = () => {
    if (
      !formData.placa ||
      !formData.marca ||
      !formData.modelo ||
      !formData.anio ||
      !formData.valor_vehiculo ||
      !formData.valor_accesorios ||
      !formData.suma_asegurada
    ) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    const newCar = {
      placa: formData.placa,
      marca: formData.marca,
      modelo: formData.modelo,
      anio: formData.anio,
      antiguedad: dayjs().diff(formData.anio, "year"),
      costo: formData.valor_vehiculo,
      tasa: "TBD",
      prima: "TBD",
    };

    setCars([...cars, newCar]);
    setError("");
  };

  const handleDeleteCar = (index) => {
    const updatedCars = cars.filter((_, i) => i !== index);
    setCars(updatedCars);
  };

  const handleSubmit = (e) => {
    const requiredFields = [
      "name",
      "lastname",
      "email",
      "phone",
      "documentType",
      "identification",
      "address",
      "gender",
      "status",
      "anios",
      "agente",
      "provincia",
      "ciudad"
    ];
    let next = false;

    // Verificar que todos los campos requeridos estén llenos
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        next = false;
        return next;
      } else {
        next = true;
      }
    }

    const objetoSeguro = {
      // nombre: formData.name,
      // apellido: formData.lastname,
      // correo: formData.email,
      // telefono: formData.phone,
      // tipoDocumento: formData.documentType,
      // identificacion: formData.identification,
      // direccion: formData.address,
      // genero: formData.gender,
      // estadoCivil: formData.status,
      // aniosVigencia: formData.anios,
      // agente: formData.agente,
      // provincia: formData.provincia,
      // ciudad: formData.ciudad
    };

    localStorage.setItem(
      DATOS_PERSONALES_STORAGE_KEY,
      JSON.stringify(objetoSeguro)
    );

    console.log("Formulario enviado:", objetoSeguro, next);
    return next;
  };

  return (
    <>
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
          <Grid container spacing={2} style={{ width: '100%', paddingLeft: '30px', paddingBottom: '20px' }}>
            <Snackbar open={open} autoHideDuration={5000} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
              <Alert severity="warning">{messageError}</Alert>
            </Snackbar>
            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Placa <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                type="text"
                name="placa"
                placeholder="Placa"
                value={formData.placa}
                variant="standard"
                onChange={handleChange}
                fullWidth
                required />
            </Grid>
            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Marca <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                placeholder="Marca"
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                variant="standard"
                fullWidth
                inputProps={{ maxLength: 30 }}
                required />
            </Grid>
            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Modelo <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                placeholder="Modelo"
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                variant="standard"
                fullWidth
                inputProps={{ maxLength: 30 }}
                required />
            </Grid>
            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Año <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Select
                labelId="anio-label"
                id="anio"
                name="anio"
                value={formData.anio}
                style={{ textAlign: "left" }}
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
            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Zona circulación <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Select
                labelId="zona-label"
                id="zona"
                name="zona"
                value={formData.zona}
                style={{ textAlign: "left" }}
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
            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Valor del vehículo <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                placeholder="Valor del vehículo"
                type="text"
                onChange={handleChange}
                name="valor_vehiculo"
                value={formData.valor_vehiculo}
                variant="standard"
                fullWidth
                inputProps={{ maxLength: 15 }}
                required
              />
            </Grid>
            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Valor accesorios <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                placeholder="Valor accesorios"
                type="text"
                onChange={handleChange}
                name="valor_accesorios"
                value={formData.valor_accesorios}
                variant="standard"
                fullWidth
                inputProps={{ maxLength: 15 }}
                required
              />
            </Grid>
            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Total suma asegurada <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                placeholder="Total Suma Asegurada"
                type="text"
                onChange={handleChange}
                name="suma_asegurada"
                value={formData.suma_asegurada}
                variant="standard"
                fullWidth
                inputProps={{ maxLength: 15 }}
                required
              />
            </Grid>
          </Grid>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid item xs={10.5} md={2.5} style={{ paddingTop: '31px' }}>
            <Button
              sx={{ mr: 1 }}
              className="button-styled-primary"
              style={{ top: "20%", backgroundColor: '#0099A8', color: "white" }}
              onClick={handleAddCar}
            >
              Aceptar
            </Button>
          </Grid>
          <Grid item xs={10.5} md={12} style={{ width: '100%', paddingTop: '30px', paddingLeft: '30px', paddingRight: '30px', paddingBottom: '20px' }}>
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
      </Card></>
  );
});

export default DetailsCar;
