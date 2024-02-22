import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Button, Container, Paper } from "@mui/material";
import MapContainer from "./mapContainer";
import AddLocationAltRoundedIcon from "@mui/icons-material/AddLocationAltRounded";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import BranchInsurance from "./branchInsurance";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
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
    if (e.target.name === "block" || e.target.name === "house" || e.target.name === "floor") {
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
  };

  const toggleInspection = () => {
    setFormData({ ...formData, inspection: !formData.inspection });
  };
  const mapContainerRef = useRef(null);

  const handleSubmit = async (e) => {
    handleOpenBackdrop();
    e.preventDefault();

    const camposRequeridos = ['city', 'province', 'parish', 'direccion'];

    setFormDataTouched((prevFormData) => Object.keys(prevFormData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));

    // Verificar si alguno de los campos requeridos está vacío y ha sido "tocado"
    const campoInvalido = camposRequeridos.some((campo) => formData[campo] === '' && formDataTouched[campo]);

    console.log(campoInvalido);
    if (campoInvalido) {
      handleCloseBackdrop();
      return  ;
      //return; // Salir de la función si algún campo requerido es inválido
    }

    let objetoSeguro = obtenerFormulario();
    console.log(objetoSeguro);
    if (!objetoSeguro) {
      console.log("No existe datos para cotizar");
      return;
    }

    const accionCotizacion = editMode ? IncendioService.editarCotizacionIncendio : IncendioService.guardarCotizacionIncendio;

    try {
      const response = await accionCotizacion(objetoSeguro);
      console.log(response);

      if (response.codigo === 200) {
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
      return;
    }

    const formattedDate = dayjs(dateInspecction).format("DD/MM/YYYY");
    const formattedTime = dayjs(timeInspecction).format("HH:mm");
    const secciones = JSON.parse(localStorage.getItem(LS_TABLASECCIONES));
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
    setFormData({ ...formData, lat, lng, direccion });
    console.log("Marcador actualizado:", formData);
  };

  const updateLocation = (lat, lng, direccion) => {
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
    localStorage.setItem(
      LS_TABLASECCIONES,
      JSON.stringify(tablaObjetoSeguro.arrMontos)
    );
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
          style={{ overflow: "scroll", padding: "0px", paddingBottom: "20px" }}
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
              height: "50vh",
              paddingBottom: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <form component="form" onSubmit={handleSubmit} className="form">
              <table spacing={3}>
                <tbody>
                  <tr className="modalFormRow">
                    <td
                      className="modalFormContent"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      {formData.province === "" && formDataTouched.province && (
                        <Alert severity="error" color="error">
                          El campo provincia es requerido
                        </Alert>
                      )}
                      <div
                        className="modalFormContent"
                        style={{ width: "100%" }}
                      >
                        <div className="tdTableTitle">
                          <label
                            style={{ fontSize: "13px" }}
                            id="province-Label"
                          >
                            {" "}
                            <b>Provincia:</b>{" "}
                          </label>
                        </div>
                        <div className="tdTableData">
                          <select
                            id="province"
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="standard"
                            className="modalFormInputs"
                            style={{ border: "1px solid #A1A8AE" }}
                          >
                            <option value="">SELECCIONE UNA OPCION</option>
                            {provinces.map((province, index) => (
                              <option key={index} value={province.Codigo}>
                                {province.Nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </td>
                    <td
                      className="modalFormContent"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      {formData.city === "" && formDataTouched.city && (
                        <Alert severity="error" color="error">
                          El campo ciudad es requerido
                        </Alert>
                      )}
                      <div
                        className="modalFormContent"
                        style={{ width: "100%" }}
                      >
                        <div className="tdTableTitle">
                          <label style={{ fontSize: "13px" }} id="city-Label">
                            {" "}
                            <b>Ciudad:</b>{" "}
                          </label>
                        </div>
                        <div className="tdTableData">
                          <select
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="standard"
                            className="modalFormInputs"
                            
                            style={{ border: "1px solid #A1A8AE" }}
                          >
                            <option value="">SELECCIONE UNA PROVINCIA</option>
                            {ciudades.map((ciudad, index) => (
                              <option key={index} value={ciudad.Codigo}>
                                {ciudad.Nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr className="modalFormRow">
                    <td
                      className="modalFormContent"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      {formData.parish === "" && formDataTouched.parish && (
                        <Alert severity="error" color="error">
                          El campo parroquia es requerido
                        </Alert>
                      )}
                      <div
                        className="modalFormContent"
                        style={{ width: "100%" }}
                      >
                        <div className="tdTableTitle">
                          <label style={{ fontSize: "13px" }} id="parish-Label">
                            {" "}
                            <b>Parroquia:</b>{" "}
                          </label>
                        </div>
                        <div className="tdTableData">
                          <select
                            id="parish"
                            name="parish"
                            value={formData.parish}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="standard"
                            className="modalFormInputs"
                            
                          >
                            <option value="">SELECCIONE UNA CIUDAD</option>
                            {parroquia.map((parroq, index) => (
                              <option key={index} value={parroq.Codigo}>
                                {parroq.Nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </td>
                    <td
                      className="modalFormContent"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      {formData.direccion === "" && formDataTouched.direccion && (
                        <Alert severity="error" color="error">
                          El campo direccion es requerido
                        </Alert>
                      )}
                      <div
                        className="modalFormContent"
                        style={{ width: "100%" }}
                      >
                        <div className="tdTableTitle">
                          <label
                            style={{ fontSize: "13px" }}
                            id="direction-Label"
                          >
                            {" "}
                            <b>Dirección:</b>{" "}
                          </label>
                        </div>
                        <div
                          className="tdTableData"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <input
                            label="direction-Label"
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="standard"
                            placeholder="Av 9 de Octubre"
                            className="modalFormInputs"
                          />
                          <div onClick={SearchLocation}>
                            <AddLocationAltRoundedIcon />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="modalFormRow">
                    <td className="modalFormContent">
                      <div className="tdTableTitle">
                        <label style={{ fontSize: "13px" }} id="number-Label">
                          {" "}
                          <b>Manzana:</b>{" "}
                        </label>
                      </div>
                      <div className="tdTableData">
                        <input
                          label="number"
                          type="text"
                          name="block"
                          placeholder="207"
                          value={formData.block}
                          onChange={handleChange}
                          variant="standard"
                          required
                          className="modalFormInputs"
                        />
                      </div>
                    </td>
                    <td className="modalFormContent">
                      <div className="tdTableTitle">
                        <label style={{ fontSize: "13px" }} id="house-Label">
                          {" "}
                          <b>Villa:</b>{" "}
                        </label>
                      </div>
                      <div className="tdTableData">
                        <input
                          id="house"
                          name="house"
                          placeholder="11"
                          value={formData.house}
                          onChange={handleChange}
                          variant="standard"
                          required
                          className="modalFormInputs"
                        />
                      </div>
                    </td>
                  </tr>

                  <tr className="modalFormRow">
                    <td className="modalFormContent">
                      <div className="tdTableTitle">
                        <label style={{ fontSize: "13px" }} id="floor-Label">
                          {" "}
                          <b>Pisos:</b>{" "}
                        </label>
                      </div>
                      <div className="tdTableData">
                        <input
                          id="floor"
                          name="floor"
                          placeholder="1"
                          value={formData.floor}
                          onChange={handleChange}
                          variant="standard"
                          required
                          className="modalFormInputs"
                        />
                      </div>
                    </td>
                    <td className="modalFormContent">
                      <div className="tdTableTitle">
                        <label
                          style={{ fontSize: "13px" }}
                          id="buildingAge-Label"
                        >
                          {" "}
                          <b>Antiguedad:</b>{" "}
                        </label>
                      </div>
                      <div className="tdTableData">
                        <select
                          id="buildingAge"
                          name="buildingAge"
                          value={formData.buildingAge}
                          onChange={handleChange}
                          variant="standard"
                          className="modalFormInputs"
                          required
                          style={{ border: "1px solid #A1A8AE" }}
                        >
                          {antiguedad.map((antig, index) => (
                            <option key={index} value={antig.Codigo}>
                              {antig.Nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>

                  <tr className="modalFormRow">
                    <td className="modalFormContent">
                      <div className="tdTableTitle">
                        <label
                          style={{ fontSize: "13px" }}
                          id="constructionType-Label"
                        >
                          {" "}
                          <b>T. Construcción:</b>{" "}
                        </label>
                      </div>
                      <div className="tdTableData">
                        <select
                          id="constructionType"
                          name="constructionType"
                          value={formData.constructionType}
                          onChange={handleChange}
                          variant="standard"
                          className="modalFormInputs"
                          required
                          style={{ border: "1px solid #A1A8AE" }}
                        >
                          {construccion.map((construc, index) => (
                            <option key={index} value={construc.Codigo}>
                              {construc.Nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="modalFormContent">
                      <div className="tdTableTitle">
                        <label style={{ fontSize: "13px" }} id="riskType-Label">
                          {" "}
                          <b>T. Riesgo:</b>{" "}
                        </label>
                      </div>
                      <div className="tdTableData">
                        <select
                          id="riskType"
                          name="riskType"
                          value={formData.riskType}
                          onChange={handleChange}
                          variant="standard"
                          className="modalFormInputs"
                          required
                          style={{ border: "1px solid #A1A8AE" }}
                        >
                          <option value="--">SELECCIONE UNA OPCION</option>
                          {riesgo.map((risk, index) => (
                            <option key={index} value={risk.Codigo}>
                              {risk.Nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>

                  <tr className="modalFormRow">
                    <td className="modalFormContent">
                      <div className="tdTableTitle">
                        <label style={{ fontSize: "13px" }} id="destiny-Label">
                          {" "}
                          <b>Destinado a:</b>{" "}
                        </label>
                      </div>
                      <div className="tdTableData">
                        <select
                          id="destiny"
                          name="destiny"
                          value={formData.destiny}
                          onChange={handleChange}
                          variant="standard"
                          className="modalFormInputs"
                          required
                          style={{ border: "1px solid #A1A8AE" }}
                        >
                          {destinado.map((destin, index) => (
                            <option key={index} value={destin.Codigo}>
                              {destin.Nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="modalFormContent">
                      <div className="tdTableTitle">
                        <label
                          style={{ fontSize: "13px" }}
                          id="sumInsure-Label"
                        >
                          {" "}
                          <b>Suma Aseg:</b>{" "}
                        </label>
                      </div>
                      <div
                        className="tdTableData"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          label="sumInsure-Label"
                          type="text"
                          name="umInsure"
                          value={formatearEnDolares(formData.sumInsure)}
                          className="modalFormInputs"
                          variant="standard"
                          onChange={handleChange}
                        />
                        <div onClick={handleOpenModal}>
                          <CalendarMonthIcon />
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr className="modalFormRow">
                    <td className="modalFormContent">
                      <div className="tdTableTitle">
                        <label
                          style={{ fontSize: "13px" }}
                          id="latituded-Label"
                        >
                          {" "}
                          <b>Latitud:</b>{" "}
                        </label>
                      </div>
                      <div className="tdTableData">
                        <input
                          id="lat"
                          name="lat"
                          value={formData.lat}
                          onChange={handleChange}
                          variant="standard"
                          className="modalFormInputs"
                          required
                          disabled
                          style={{ border: "1px solid #A1A8AE" }}
                        ></input>
                      </div>
                    </td>
                    <td className="modalFormContent">
                      <div className="tdTableTitle">
                        <label
                          style={{ fontSize: "13px" }}
                          id="longitude-Label"
                        >
                          {" "}
                          <b>Longitud:</b>{" "}
                        </label>
                      </div>
                      <div className="tdTableData">
                        <input
                          id="lng"
                          name="lng"
                          value={formData.lng}
                          onChange={handleChange}
                          variant="standard"
                          className="modalFormInputs"
                          required
                          disabled
                          style={{ border: "1px solid #A1A8AE" }}
                        ></input>
                      </div>
                    </td>
                  </tr>

                  <tr className="modalFormRow">
                    <td className="modalFormContent">
                      <div className="tdTableTitle">
                        <label
                          style={{ fontSize: "13px" }}
                          id="longitude-Label"
                        >
                          {" "}
                          <b>Inspección:</b>{" "}
                        </label>
                      </div>
                      <div className="tdTableData">
                        <input
                          id="inspection"
                          name="inspection"
                          checked={formData.inspection}
                          onChange={toggleInspection}
                          variant="standard"
                          className="modalFormInputs"
                          type="checkbox"
                          style={{ border: "1px solid #A1A8AE" }}
                        ></input>
                      </div>
                    </td>
                  </tr>

                  {formData.inspection && ( // Verificar si inspection es true
                    <tr className="modalFormRow">
                      <td className="modalFormContent">
                        <Tooltip
                          title="Agente de inspeccion"
                          style={{ width: "100%", display: "flex" }}
                          placement="left"
                        >
                          <div className="tdTableTitle">
                            <label
                              style={{ fontSize: "13px" }}
                              id="longitude-Label"
                            >
                              <b>Contacto:</b>
                            </label>
                          </div>
                          <div className="tdTableData">
                            <input
                              id="agentInspection"
                              name="agentInspection"
                              value={formData.agentInspection}
                              onChange={handleChange}
                              variant="standard"
                              className="modalFormInputs"
                              style={{ border: "1px solid #A1A8AE" }}
                            ></input>
                          </div>
                        </Tooltip>
                      </td>

                      <td className="modalFormContent">
                        <Tooltip
                          title="Telefono de inspeccion"
                          placement="left"
                          style={{ width: "100%", display: "flex" }}
                        >
                          <div className="tdTableTitle">
                            <label
                              style={{ fontSize: "13px" }}
                              id="longitude-Label"
                            >
                              <b>Teléfono:</b>
                            </label>
                          </div>
                          <div className="tdTableData">
                            <input
                              id="phoneInspection"
                              name="phoneInspection"
                              value={formData.phoneInspection}
                              onChange={handleChange}
                              variant="standard"
                              className="modalFormInputs"
                              style={{ border: "1px solid #A1A8AE" }}
                            ></input>
                          </div>
                        </Tooltip>
                      </td>
                    </tr>
                  )}

                  {formData.inspection && ( // Verificar si inspection es true
                    <tr className="modalFormRow">
                      <td className="modalFormContent">
                        <Tooltip
                          title="Fecha Tentativa"
                          placement="left"
                          style={{ width: "100%", display: "flex" }}
                        >
                          <div className=" tdTableTitle dateTimePickerForm">
                            <label
                              style={{ fontSize: "13px" }}
                              id="longitude-Label"
                            >
                              <b>Fecha:</b>
                            </label>
                          </div>
                          <div className="tdTableData">
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
                                  slotProps={{
                                    textField: {
                                      variant: "standard",
                                      size: "small",
                                    },
                                  }}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </div>
                        </Tooltip>
                      </td>

                      <td className="modalFormContent">
                        <Tooltip
                          title="Hora tentativa"
                          placement="left"
                          style={{ width: "100%", display: "flex" }}
                        >
                          <div className=" tdTableTitle dateTimePickerForm">
                            <label
                              className="tdTableTitle"
                              style={{ fontSize: "13px" }}
                              id="longitude-Label"
                            >
                              <b>Hora:</b>
                            </label>
                          </div>
                          <div className="tdTableData">
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
                                  slotProps={{
                                    textField: {
                                      variant: "standard",
                                      size: "small",
                                    },
                                  }}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </div>
                        </Tooltip>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  className="btnStepper"
                  variant="contained"
                  style={{ top: "0", backgroundColor: "rgb(0, 169, 158)" }}
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
              justifyContent: "center",
            }}
          >
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
    </Container>
  );
};

export default AddObjectInsurance;
