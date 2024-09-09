import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  TextField,
  Grid,
  Alert,
  Button,
  MenuItem,
  FormControl,
  Select,
  Snackbar,
  Backdrop,
  CircularProgress,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "../../styles/form.scss";
import "../../styles/button.scss";
import {
  DATOS_VEHICULO_STORAGE_KEY,
  LS_COTIZACION,
  USER_STORAGE_KEY,
} from "../../utils/constantes";
import QuoterService from "../../services/QuoterService/QuoterService";
import ComboService from "../../services/ComboService/ComboService";

dayjs.extend(customParseFormat);

const DetailsCar = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    placa: "",
    marca: "",
    grupo: "",
    modelo: "",
    anio: "2001",
    zona: "C",
    uso: "",
    tipo: "",
    valor_vehiculo: "",
    valor_accesorios: "",
    suma_asegurada: "",
  });

  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const isMounted = useRef(false);

  const [marca, setMarca] = useState([]);
  const [grupo, setGrupo] = useState([]);
  const [modelo, setModelo] = useState([]);
  const [uso, setUso] = useState([]);
  const [tipo, setTipo] = useState([]);

  const cargarDatos = async () => {
    const dataPersonal = await cargarCotizacion();
    if (dataPersonal) {
      setFormData((formData) => ({
        ...formData,
        placa: dataPersonal[0].placa,
        marca: dataPersonal[0].marca,
        grupo: dataPersonal[0].grupo,
        modelo: dataPersonal[0].modelo,
        anio: dataPersonal[0].anio,
        uso: dataPersonal[0].uso,
        tipo: dataPersonal[0].tipo,
        zona: dataPersonal[0].zona,
        valor_vehiculo: dataPersonal[0].valor_vehiculo,
        valor_accesorios: dataPersonal[0].valor_accesorios,
        suma_asegurada: dataPersonal[0].suma_asegurada,
      }));
    }
  };

  const cargarCotizacion = async () => {
    const userId = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    const idCotizacion = localStorage.getItem(LS_COTIZACION);
    const dato = {
      usuario: userId.id,
      id_CotiGeneral: idCotizacion,
    };
    try {
      const cotizacion = await QuoterService.fetchConsultarCotizacionGeneral(dato);
      return cotizacion.data || [];
    } catch (error) {
      console.error("Error al obtener cotización:", error);
    }
  };

  useEffect(() => {
    isMounted.current = true;

    const modoEditar = async () => {
      const idCotizacion = localStorage.getItem(LS_COTIZACION);
      if (idCotizacion) {
        await cargarDatos();
      }
      await cargarCombos();
    };

    modoEditar();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const cargarCombos = async () => {
    try {
      await cargarMarca();
      await cargarUso();
      await cargarTipo();
    } catch (error) {
      console.error("Error al cargar combos:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let modifiedValue = value;

    if (name === "placa") {
      modifiedValue = value.toUpperCase();
    }

    if (name === "marca") {
      cargarGrupo(modifiedValue);
      setModelo([]);
    }

    if (name === "grupo") {
      cargarModelo(modifiedValue);
    }

    if (["valor_vehiculo", "valor_accesorios", "suma_asegurada"].includes(name)) {
      modifiedValue = formatCurrency(modifiedValue);
    }

    setFormData((prevData) => ({ ...prevData, [name]: modifiedValue }));
  };

  const formatCurrency = (value) => {
    let cleanValue = value.replace(/[^\d,]/g, "");
    cleanValue = cleanValue.includes(",")
      ? cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return cleanValue;
  };

  const handleAddCar = () => {
    if (!isFormValid()) {
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
      totalAsegurado: formData.suma_asegurada,
    };

    setCars([...cars, newCar]);
    setError("");
  };

  const isFormValid = () => {
    return (
      formData.placa &&
      formData.marca &&
      formData.modelo &&
      formData.anio &&
      formData.valor_vehiculo &&
      formData.valor_accesorios &&
      formData.suma_asegurada
    );
  };

  const handleDeleteCar = (index) => {
    setCars(cars.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!cars.length) {
      faltanDatosUsuario();
      return false;
    }

    localStorage.setItem(DATOS_VEHICULO_STORAGE_KEY, "");
    localStorage.setItem(DATOS_VEHICULO_STORAGE_KEY, JSON.stringify(cars));
    return true;
  };

  useImperativeHandle(ref, () => ({
    handleSubmitExternally: handleSubmit,
  }));

  const faltanDatosUsuario = () => {
    setMessageError("Debe llenar todos los datos obligatorios");
    setOpenSnack(true);
  };

  const cargarMarca = async () => {
    const marca = await ComboService.fetchComboMarca();
    if (marca?.data) {
      setMarca(marca.data);
      setFormData((prevData) => ({ ...prevData, marca: marca.data[0].clave }));
      await cargarGrupo(marca.data[0].nombre);
    }
  };

  const cargarGrupo = async (idMarca) => {
    const grupo = await ComboService.fetchComboGrupo(idMarca);
    if (grupo?.data?.length > 0) {
      setGrupo(grupo.data);
      console.log(grupo.data);
      setFormData((prevData) => ({ ...prevData, grupo: grupo.data[0].idGrupo }));
      await cargarModelo(grupo.data[0].idGrupo);
    }
  };

  const cargarModelo = async (idGrupo) => {
    const modelo = await ComboService.fetchComboModelo(idGrupo);
    if (modelo?.data?.length > 0) {
      setModelo(modelo.data);
      setFormData((prevData) => ({ ...prevData, modelo: modelo.data[0].id }));
    }
  };

  const cargarUso = async () => {
    const uso = await ComboService.fetchComboUso();
    if (uso?.data) {
      setUso(uso.data);
      setFormData((prevData) => ({ ...prevData, uso: uso.data[0].idUso }));
    }
  };

  const cargarTipo = async () => {
    const tipo = await ComboService.fetchComboTipo();
    if (tipo?.data) {
      setTipo(tipo.data);
      setFormData((prevData) => ({ ...prevData, tipo: tipo.data[0].idTipoVehiculo }));
    }
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
            <Snackbar open={openSnack} autoHideDuration={5000} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
              <Alert severity="warning">{messageError}</Alert>
            </Snackbar>
            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Placa <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                placeholder="Placa"
                type="text"
                onChange={handleChange}
                name="placa"
                value={formData.placa}
                variant="standard"
                fullWidth
                inputProps={{ maxLength: 8 }}
                required
              />
            </Grid>
            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Marca <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Select
                labelId="marca-Label"
                id="marca"
                style={{ textAlign: "left" }}
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                variant="standard"
                fullWidth
                required
                placeholder="Seleccione marca"
              >
                {marca.map((marca, index) => (
                  <MenuItem key={index} value={marca.nombre}>
                    {marca.nombre}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Grupo <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Select
                labelId="grupo-Label"
                id="grupo"
                style={{ textAlign: "left" }}
                name="grupo"
                value={formData.grupo}
                onChange={handleChange}
                variant="standard"
                fullWidth
                required
                placeholder="Seleccione grupo"
              >
                {Array.isArray(grupo) && grupo.length > 0 ? (
                  grupo.map((grupo, index) => (
                    <MenuItem key={index} value={grupo.idGrupo}>
                      {grupo.nombre}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No hay grupos disponibles
                  </MenuItem>
                )}
              </Select>
            </Grid>
            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Modelo <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Select
                labelId="modelo-Label"
                id="modelo"
                style={{ textAlign: "left" }}
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                variant="standard"
                fullWidth
                required
                placeholder="Seleccione modelo"
              >
                {Array.isArray(modelo) && modelo.length > 0 ? (
                  modelo.map((modelo, index) => (
                    <MenuItem key={index} value={modelo.id}>
                      {modelo.nombre}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No hay Modelos disponibles
                  </MenuItem>
                )}
              </Select>
            </Grid>
            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Uso vehículo <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Select
                labelId="uso-label"
                id="uso"
                name="uso"
                value={formData.uso}
                style={{ textAlign: "left" }}
                variant="standard"
                onChange={handleChange}
                placeholder="Uso"
                fullWidth
                required
              >
                {Array.isArray(uso) && uso.length > 0 ? (
                  uso.map((uso, index) => (
                    <MenuItem key={index} value={uso.idUso}>
                      {uso.nombre}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No hay uso disponibles
                  </MenuItem>
                )}
              </Select>
            </Grid>
            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Tipo <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Select
                labelId="tipo-label"
                id="tipo"
                name="tipo"
                value={formData.tipo}
                style={{ textAlign: "left" }}
                variant="standard"
                onChange={handleChange}
                placeholder="tipo"
                fullWidth
                required
              >
                {Array.isArray(tipo) && tipo.length > 0 ? (
                  tipo.map((tipo, index) => (
                    <MenuItem key={index} value={tipo.idTipoVehiculo}>
                      {tipo.nombre}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No hay tipo disponibles
                  </MenuItem>
                )}
              </Select>
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
                {Array.from({ length: 2024 - 2001 + 1 }, (_, index) => {
                  const year = 2001 + index;
                  return (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  );
                })}
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
