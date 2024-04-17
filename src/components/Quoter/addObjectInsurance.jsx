import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Button, Container, Paper, Grid, TextField, Select, MenuItem } from "@mui/material";
import Typography from '@mui/material/Typography';
import MapContainer from "./mapContainer";
import AddLocationAltRoundedIcon from "@mui/icons-material/AddLocationAltRounded";
import CloseIcon from "@mui/icons-material/Close";
import PaidIcon from '@mui/icons-material/Paid';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import BranchInsurance from "./branchInsurance";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import "../../styles/moddalForm.scss";
import "../../styles/dialogForm.scss";
import "../../styles/form.scss";
import "../../styles/button.scss";
import "../../styles/objectInsuranceTable.scss";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import ComboService from "../../services/ComboService/ComboService";
import {
  LS_PRODUCTO,
  LS_RAMO,
  LS_TABLASECCIONES,
  LS_COTIZACION,
  LS_TABLAOBJETOSEGURO,
  LS_TABLAAMPARO,
} from "../../utils/constantes";
import IncendioService from "../../services/IncencioService/IncendioService";
dayjs.extend(customParseFormat);

const AddObjectInsurance = ({ closeModal, idObjectSelected }) => {
  const [formData, setFormData] = useState({
    province: "",
    city: "",
    parish: "",
    direccion: "",
    block: "",
    house: "",
    floor: "",
    buildingAge: "",
    constructionType: "",
    riskType: "",
    destiny: "",
    sumInsure: "",
    lat: "",
    lng: "",
    inspection: false,
    phoneInspection: "",
    agentInspection: "",
  });

  const [formDataTouched, setFormDataTouched] = useState({
    province: false,
    city: false,
    parish: false,
    direccion: false,
    block: false,
    house: false,
    floor: false,
    buildingAge: false,
    constructionType: false,
    riskType: false,
    destiny: false,
    sumInsure: false,
    lat: false,
    lng: false,
    inspection: false,
    phoneInspection: false,
    agentInspection: false,
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [provinces, setProvinces] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [parroquia, setParroquia] = useState([]);
  const [antiguedad, setAntiguedad] = useState([]);
  const [construccion, setConstruccion] = useState([]);
  const [riesgo, setRiesgo] = useState([]);
  const [destinado, setDestinado] = useState([]);
  const ramo = localStorage.getItem(LS_RAMO);
  const producto = localStorage.getItem(LS_PRODUCTO);
  const [dateInspecction, setdateInspecction] = useState([]);
  const [timeInspecction, setTimeInspecction] = useState([]);
  const idObject = idObjectSelected;
  const editMode = idObject !== "" ? true : false;
  const [openBackdrop1, setOpenBackdrop] = React.useState(false);
  const [messageError, setmessageError] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Manejador para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
    const secciones = JSON.parse(localStorage.getItem(LS_TABLASECCIONES));
    let sumaAsegurada = secciones.reduce((sum, row) => {
      return row.checked ? sum + parseFloat(row.monto) : sum;
    }, 0);
    setFormData((formData) => ({ ...formData, sumInsure: sumaAsegurada }));
  };

  const cerrarModal = () => {
    localStorage.removeItem(LS_TABLASECCIONES);
    closeModal(true);
  };

  const handleChange = (e) => {
    if (e.target.name === "umInsure") {
      return;
    }
    if (e.target.name === "province") {
      cargarCiudad(e.target.value);
    }
    if (e.target.name === "riskType") {
      cargarDestinado(e.target.value);
    }
    if (e.target.name === "city") {
      cargarParroquia(e.target.value);
    }
    console.log(e.target.name);
    if (
      e.target.name === "block" ||
      e.target.name === "house" ||
      e.target.name === "floor"
    ) {
      if (isNaN(e.target.value)) {
        return;
      }
    }

    if (e.target.name === "phoneInspection") {
      if (isNaN(e.target.value)) {
        return;
      }
      if (e.target.value.length > 10) {
        return;
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setFormDataTouched({ ...formDataTouched, [e.target.name]: true });

    if (e.target.name === "direccion") {
      SearchLocation();
    }
  };

  const toggleInspection = () => {
    setFormData({ ...formData, inspection: !formData.inspection });
  };
  const mapContainerRef = useRef(null);

  const handleSubmit = async (e) => {
    handleOpenBackdrop();
    e.preventDefault();

    const camposRequeridos = ["city", "province", "parish", "direccion"];

    setFormDataTouched((prevFormData) =>
      Object.keys(prevFormData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );

    // Verificar si alguno de los campos requeridos está vacío y ha sido "tocado"
    const campoInvalido = camposRequeridos.some(
      (campo) => formData[campo] === "" && formDataTouched[campo]
    );

    if (campoInvalido) {
      handleCloseBackdrop();
      return;
      //return; // Salir de la función si algún campo requerido es inválido
    }

    let objetoSeguro = obtenerFormulario();
    console.log(objetoSeguro);
    if (!objetoSeguro) {
      return;
    }

    if (objetoSeguro.sumaAsegurada === 0) {
      setmessageError("No existe suma asegurada");
      setOpen(true);
      handleCloseBackdrop();
      return;
    }

    const accionCotizacion = editMode
      ? IncendioService.editarCotizacionIncendio
      : IncendioService.guardarCotizacionIncendio;

    try {
      const response = await accionCotizacion(objetoSeguro);
      console.log(response);

      if (response.codigo === 200) {
        localStorage.removeItem(LS_TABLASECCIONES);
        localStorage.removeItem(LS_TABLAOBJETOSEGURO);
        localStorage.removeItem(LS_TABLAAMPARO);
        handleCloseBackdrop();
        closeModal(true);
      } else {
        handleCloseBackdrop();

        console.error("Error en la respuesta del servidor:", response.message);
      }
    } catch (error) {
      // Manejar errores de la petición
      console.error("Error al realizar la solicitud:", error);
      handleCloseBackdrop();
    }
  };

  function formatearEnDolares(numero) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numero);
  }

  const obtenerFormulario = () => {
    const idCotizacion = localStorage.getItem(LS_COTIZACION);
    if (!idCotizacion) {
      console.log("No existe cotizacion generada");
      return null;
    }

    const formattedDate = dayjs(dateInspecction).format("DD/MM/YYYY");
    const formattedTime = dayjs(timeInspecction).format("HH:mm");
    const secciones = JSON.parse(localStorage.getItem(LS_TABLASECCIONES));

    if (!secciones) {
      setmessageError("No existe suma asegurada");
      setOpen(true);
      handleCloseBackdrop();
      return null;
    }
    if (!formData.direccion) {
      setmessageError("La direccion debe ser llenada");
      setFormData({
        ...formData,
        direccion: "",
      });
      handleCloseBackdrop();
      setOpen(true);
      return null;
    }

    if (!formData.riskType || formData.riskType ==="") {
      setmessageError("El campo T.Riesgo debe ser llenado");
      setFormData({
        ...formData,
        riskType: "",
      });
      handleCloseBackdrop();
      setOpen(true);
      return null;
    }

    if (!formData.destiny || formData.destiny ==="") {
      setmessageError("El campo destinado a debe ser llenado");
      setFormData({
        ...formData,
        destiny: "",
      });
      handleCloseBackdrop();
      setOpen(true);
      return null;
    }
    let sumaAsegurada = secciones.reduce(
      (sum, item) => (item.checked ? sum + parseFloat(item.monto) : sum),
      0
    );

    let primaAsegudara = secciones.reduce(
      (sum, item) => (item.checked ? sum + parseFloat(item.prima) : sum),
      0
    );

    let tasa = (primaAsegudara / sumaAsegurada) * 100;

    let formDatas = {
      id_CotiGeneral: idCotizacion,
      contactoInspeccion: formData.agentInspection,
      manzana: formData.block,
      antiguedad: formData.buildingAge,
      ciudad: formData.city,
      tConstruccion: formData.constructionType,
      destinado: formData.destiny,
      direccion: formData.direccion,
      piso: formData.floor,
      villa: formData.house,
      inspeccion: formData.inspection,
      latitud: formData.lat,
      longitud: formData.lng,
      parroqua: formData.parish,
      telefonoContacto: formData.phoneInspection,
      provincia: formData.province,
      riesgo: formData.riskType,
      sumaAsegurada: sumaAsegurada,
      producto: producto,
      ramo: ramo,
      tablaSumaAsegurada: secciones,
      fechaInspeccion: formattedDate,
      horaInspeccion: formattedTime,
      tasa: tasa.toFixed(2),
      prima: primaAsegudara,
    };

    if (!formData.inspection) {
      formDatas = {
        ...formDatas,
        contactoInspeccion: "",
        fechaInspeccion: '',
        horaInspeccion: '',
        telefonoContacto: '',
      };
    }

    if (editMode) {
      formDatas = {
        ...formDatas,
        id: idObject,
      };
    }
    console.log(formDatas);
    return formDatas;
  };

  const onMarkerDragEnd = ({ lat, lng, direccion }) => {
    console.log(direccion);
    if (direccion) {
      if (direccion.code === 500) {
        console.log("error api");
        direccion = "";
      }
    }
    setFormData({ ...formData, lat, lng, direccion });
    console.log("Marcador actualizado:", formData);
  };

  const updateLocation = (lat, lng, direccion) => {
    console.log(direccion);
    setFormData((prevFormData) => ({
      ...prevFormData,
      lat: lat,
      lng: lng,
      direccion: direccion,
    }));
  };

  const SearchLocation = () => {
    if (mapContainerRef.current) {
      mapContainerRef.current.handleSearchLocation();
    }
  };

  useEffect(() => {
    const cargarData = async () => {
      console.log(editMode);
      if (editMode) {
        handleOpenBackdrop();
        console.log("entro");
        await cargarDatosEditar();
        return;
      } else {
        handleOpenBackdrop();
        await cargarConstruccion();
        await cargarAntiguedad();
        await cargarRiesgo();
        await cargarProvincias();
        handleCloseBackdrop();
      }
    };
    cargarData();
  }, []);

  const cargarDatosEditar = async () => {
    let tablaObjetoSeguro;
    tablaObjetoSeguro = JSON.parse(localStorage.getItem(LS_TABLAOBJETOSEGURO));
    if (tablaObjetoSeguro) {
      localStorage.setItem(
        LS_TABLASECCIONES,
        JSON.stringify(tablaObjetoSeguro.arrMontos)
      );
    }

    if (tablaObjetoSeguro && idObject) {
      try {
        await cargarProvincias();
      } catch (error) {
        console.error("Error al cargar las ciudades:", error);
      }
      try {
        await cargarCiudad(tablaObjetoSeguro.zona);
      } catch (error) {
        console.error("Error al cargar las ciudad:", error);
      }
      try {
        await cargarParroquia(tablaObjetoSeguro.ciudad);
      } catch (error) {
        console.error("Error al cargar las parroquia:", error);
      }
      try {
        await cargarRiesgo();
      } catch (error) {
        console.error("Error al cargar las Riesgo:", error);
      }
      try {
        await cargarDestinado(tablaObjetoSeguro.riesgo);
      } catch (error) {
        console.error("Error al cargar las Destinado:", error);
      }
      try {
        await cargarAntiguedad();
      } catch (error) {
        console.error("Error al cargar las Antiguedad:", error);
      }
      try {
        await cargarConstruccion();
      } catch (error) {
        console.error("Error al cargar las Construccion:", error);
      }

      setFormData((formData) => ({
        ...formData,
        province: tablaObjetoSeguro.zona,
        city: tablaObjetoSeguro.ciudad,
        parish: tablaObjetoSeguro.parroquia,
        direccion: tablaObjetoSeguro.direccion,
        block: tablaObjetoSeguro.manzana,
        house: tablaObjetoSeguro.villa,
        floor: tablaObjetoSeguro.pisos,
        buildingAge: tablaObjetoSeguro.antiguedad,
        constructionType: tablaObjetoSeguro.tipconstruccion,
        riskType: tablaObjetoSeguro.riesgo,
        destiny: tablaObjetoSeguro.tipdestino,
        sumInsure: tablaObjetoSeguro.monto,
        lat: tablaObjetoSeguro.latitud,
        lng: tablaObjetoSeguro.longitud,
        inspection: tablaObjetoSeguro.inspeccion === 0 ? false : true,
        phoneInspection: tablaObjetoSeguro.telefono,
        agentInspection: tablaObjetoSeguro.contacto,
      }));
      const dateObject = dayjs(tablaObjetoSeguro.fecha, "DD/MM/YYYY");
      const timeObject = dayjs(tablaObjetoSeguro.hora, "HH:mm");
      setdateInspecction(dateObject);
      setTimeInspecction(timeObject);
    }
    SearchLocation();
    handleCloseBackdrop();
  };

  useEffect(() => {
    cargarDestinado(formData.riskType);
    const cargarDatosRiesgo = () => {
      let tablaObjetoSeguro;
      if (idObject) {
        tablaObjetoSeguro = JSON.parse(
          localStorage.getItem(LS_TABLAOBJETOSEGURO)
        );
      }
      if (tablaObjetoSeguro && idObject) {
        setFormData((formData) => ({
          ...formData,
          destiny: tablaObjetoSeguro.tipdestino,
        }));
      }
    };
    cargarDatosRiesgo();
  }, [riesgo]);

  const cargarAntiguedad = async () => {
    setAntiguedad([]);
    try {
      const antiguedad = await ComboService.fetchComboAntiguedad(
        ramo,
        producto,
        1
      );
      if (antiguedad && antiguedad.data) {
        setAntiguedad(antiguedad.data);
        console.log(antiguedad.data[0].Codigo);
        setFormData((formData) => ({
          ...formData,
          buildingAge: antiguedad.data[0].Codigo,
        }));
      }
    } catch (error) {
      console.error("Error al obtener antiguedad:", error);
    }
  };

  const cargarCiudad = async (value) => {
    setCiudades([]);
    try {
      const ciudades = await ComboService.fetchComboCiudad(
        ramo,
        producto,
        value
      );

      if (ciudades && ciudades.data) {
        setCiudades(ciudades.data);
      }
    } catch (error) {
      console.error("Error al obtener ciudad:", error);
    }
  };

  const cargarParroquia = async (ciudad) => {
    setParroquia([]);
    try {
      const parroquia = await ComboService.fetchComboParroquia(ciudad);

      if (parroquia && parroquia.data) {
        setParroquia(parroquia.data);
      }
    } catch (error) {
      console.error("Error al obtener ciudad:", error);
    }
  };

  const cargarDestinado = async (value) => {
    setDestinado([]);
    try {
      const destinado = await ComboService.fetchTipDestino(
        ramo,
        producto,
        1,
        value
      );

      if (destinado && destinado.data) {
        setDestinado(destinado.data);
        setFormData((formData) => ({
          ...formData,
          destiny: destinado.data[0].Codigo,
        }));
      }
    } catch (error) {
      console.error("Error al obtener destinado:", error);
    }
  };

  const cargarRiesgo = async () => {
    setRiesgo([]);
    try {
      const riesgo = await ComboService.fetchComboTipoRiesgos(ramo, producto);

      if (riesgo && riesgo.data) {
        setRiesgo(riesgo.data);
      }
    } catch (error) {
      console.error("Error al obtener riesgo:", error);
    }
  };

  const cargarConstruccion = async (value) => {
    console.log(openBackdrop1);
    setConstruccion([]);
    try {
      const construccion = await ComboService.fetchComboTipConstruccion();
      if (construccion && construccion.data) {
        setConstruccion(construccion.data);
        setFormData((formData) => ({
          ...formData,
          constructionType: construccion.data[0].Codigo,
        }));
      }
    } catch (error) {
      console.error("Error al obtener antiguedad:", error);
    }
  };

  const cargarProvincias = async () => {
    try {
      const provincias = await ComboService.fetchComboProvincias(
        ramo,
        producto
      );

      if (provincias && provincias.data) {
        setProvinces(provincias.data);
      }
    } catch (error) {
      console.error("Error al obtener provincias:", error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
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
      className="dialog-Form"
      style={{
        padding: 0,
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Backdrop sx={{ color: "#fff", zIndex: "3000" }} open={openBackdrop1}>
        <CircularProgress color="inherit" />
      </Backdrop>
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
          style={{ overflow: "scroll", paddingBottom: "20px" }}
          className="dialog-height-content"
        >
          {/* Componente del formulario */}
          <BranchInsurance
            closeModalDetail={handleCloseModal}
            isEditMode={editMode}
            style={{ width: "80%" }}
          />
        </DialogContent>
      </Dialog>

      <div
        className="modalForm"
        style={{
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            paddingTop: "5px",
            paddingLeft: "15px",
            paddingRight: "15px",
            backgroundColor: "#00a99e",
            color: "white",
            position: "relative",
            top: "0px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>Objeto del seguro</div>

          <div style={{ cursor: "pointer" }}>
            <CloseIcon onClick={cerrarModal} />
          </div>
        </div>

        <div className="modalFormColumn">
          <Paper
            elevation={3}
            className="modalContent"
            style={{
              overflowY: "scroll",
              height: "40%",
              paddingBottom: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Snackbar
              open={open}
              autoHideDuration={5000}
              onClose={handleClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert severity="warning">{messageError}</Alert>
            </Snackbar>
            <form
              component="form"
              variant="standard"
              onSubmit={handleSubmit}
              className="form"
              style={{width: '90%', padding: '30px'}} >
              <Grid container spacing={2}>
                <Snackbar
                  open={open}
                  autoHideDuration={5000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Alert severity="warning">{messageError}</Alert>
                </Snackbar>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                  Provincia <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Seleccione la provincia"
                    variant="standard"
                    fullWidth>

                    {provinces.map((province, index) => (
                      <MenuItem key={index} value={province.Codigo}>
                        {province.Nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {formData.province === "" && formDataTouched.province && (
                    <Alert severity="error" color="error">
                      El campo provincia es requerido
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                  Ciudad <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="standard"
                    placeholder="SELECCIONE UNA PROVINCIA"
                    fullWidth
                  >
                    {ciudades.map((ciudad, index) => (
                      <MenuItem key={index} value={ciudad.Codigo}>
                        {ciudad.Nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {formData.city === "" && formDataTouched.city && (
                    <Alert severity="error" color="error">
                      El campo ciudad es requerido
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                  Parroquia <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Select
                    id="parish"
                    name="parish"
                    value={formData.parish}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    variant="standard"
                    placeholder="SELECCIONE UNA CIUDAD"
                    fullWidth
                  >
                    {parroquia.map((parroq, index) => (
                      <MenuItem key={index} value={parroq.Codigo}>
                        {parroq.Nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {formData.parish === "" && formDataTouched.parish && (
                    <Alert severity="error" color="error">
                      El campo parroquia es requerido
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                    Dirección <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs>
                      <TextField
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        variant="standard"
                        placeholder="Av 9 de Octubre"
                        fullWidth
                      />
                    </Grid>
                    <Grid item>
                      <div onClick={SearchLocation}>
                        <AddLocationAltRoundedIcon style={{ cursor: 'pointer' }} />
                      </div>
                    </Grid>
                  </Grid>
                  {formData.direccion === "" && formDataTouched.direccion && (
                    <Alert severity="error" color="error">
                      El campo dirección es requerido
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                  Manzana <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <TextField
                    type="text"
                    name="block"
                    placeholder="Ingrese la manzana de su casa"
                    value={formData.block}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                  Villa <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <TextField
                    id="house"
                    name="house"
                    placeholder="Ingrese la villa de su casa"
                    value={formData.house}
                    onChange={handleChange}
                    variant="standard"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                  Pisos <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <TextField
                    id="floor"
                    name="floor"
                    placeholder="Número de pisos"
                    value={formData.floor}
                    onChange={handleChange}
                    variant="standard"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                  Antiguedad <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Select
                    id="buildingAge"
                    name="buildingAge"
                    value={formData.buildingAge}
                    onChange={handleChange}
                    variant="standard"
                    placeholder="Seleccione la antigueadad"
                    required
                    fullWidth
                  >
                    {antiguedad.map((antig, index) => (
                      <MenuItem key={index} value={antig.Codigo}>
                        {antig.Nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                  T. Construcción <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Select
                    id="constructionType"
                    name="constructionType"
                    value={formData.constructionType}
                    onChange={handleChange}
                    variant="standard"
                    required
                    fullWidth
                  >
                    {construccion.map((construc, index) => (
                      <MenuItem key={index} value={construc.Codigo}>
                        {construc.Nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                  T. Riesgo <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Select
                    id="riskType"
                    name="riskType"
                    value={formData.riskType}
                    onChange={handleChange}
                    variant="standard"
                    placeholder=""
                    required
                    fullWidth
                  >
                    {riesgo.map((risk, index) => (
                      <MenuItem key={index} value={risk.Codigo}>
                        {risk.Nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                  Destinado a <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Select
                    id="destiny"
                    name="destiny"
                    value={formData.destiny}
                    onChange={handleChange}
                    variant="standard"
                    required
                    fullWidth
                  >
                    {destinado.map((destin, index) => (
                      <MenuItem key={index} value={destin.Codigo}>
                        {destin.Nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                    Suma Aseg <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs>
                      <TextField
                        type="text"
                        name="umInsure"
                        onClick={handleOpenModal}
                        value={formatearEnDolares(formData.sumInsure)}
                        variant="standard"
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item>
                      <div onClick={handleOpenModal}>
                        <PaidIcon />
                      </div>
                    </Grid>
                  </Grid>
                  {formData.direccion === "" && formDataTouched.direccion && (
                    <Alert severity="error" color="error">
                      El campo dirección es requerido
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                  Latitud <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <TextField
                    id="lat"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                    variant="standard"
                    required
                    placeholder="Latitud de la ubicación"
                    disabled
                    fullWidth
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                  Longitud <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <TextField
                    id="lng"
                    name="lng"
                    value={formData.lng}
                    onChange={handleChange}
                    variant="standard"
                    placeholder="Longitud de la ubicación"
                    required
                    disabled
                    fullWidth
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                   Inspección <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <input
                    id="inspection"
                    name="inspection"
                    checked={formData.inspection}
                    onChange={toggleInspection}
                    variant="standard"
                    type="checkbox"
                    fullWidth
                  ></input>
                </Grid>
                {formData.inspection && ( // Verificar si inspection es true
                  <>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                      Contacto <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <TextField
                        id="agentInspection"
                        name="agentInspection"
                        value={formData.agentInspection}
                        onChange={handleChange}
                        variant="standard"
                        placeholder="Nombre de contacto"
                        fullWidth
                      ></TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                        Teléfono <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <TextField
                        id="phoneInspection"
                        name="phoneInspection"
                        value={formData.phoneInspection}
                        onChange={handleChange}
                        variant="standard"
                        style={{paddingTop: '5px'}}
                        fullWidth
                      ></TextField>
                    </Grid>
                  </>
                )}
                {formData.inspection && ( // Verificar si inspection es true
                <>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                        Fecha <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          components={["DatePicker"]}
                          sx={{ overflow: "hidden" }}
                        >
                          <DatePicker
                            value={dateInspecction}
                            onChange={setdateInspecction}
                            format="DD/MM/YYYY"
                            className="hourPicker"
                            style={{ overflow: "hidden" }}
                            fullWidth
                            slotProps={{
                              textField: {
                                variant: "standard",
                                size: "small",
                              },
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>
                  <Grid item xs={12} md={3}>
                  <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px', paddingLeft: '10px' }}>
                      Hora <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      style={{ overflow: "hidden" }}
                    >
                      <DemoContainer
                        components={["TimePicker"]}
                        sx={{ overflow: "hidden" }}
                      >
                        <TimePicker
                          format="HH:mm"
                          value={timeInspecction}
                          onChange={setTimeInspecction}
                          className="hourPicker"
                          fullWidth
                          slotProps={{
                            textField: {
                              variant: "standard",
                              size: "small",
                            },
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                </>
                )}
              </Grid>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  className="button-styled-primary"
                  style={{ top: "20%", backgroundColor: '#02545C', color: "white", borderRadius: '10px' }}
                  variant="contained"
                  fullWidth
                >
                  {editMode ? "Editar" : "Agregar"}
                </Button>
              </div>
            </form>
          </Paper>
          <div
            className="modalContent"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ width: "90%" }}>
              <MapContainer
                ref={mapContainerRef}
                lat={formData.lat}
                lng={formData.lng}
                direccion={formData.direccion}
                onMarkerDragEnd={onMarkerDragEnd}
                onUpdateLocation={updateLocation}
              ></MapContainer>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AddObjectInsurance;
