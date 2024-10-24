import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
  LS_COTIZACION_VEHICULO,
  DATOS_VEHICULO_STORAGE_KEY,
  DATOS_VEHICULO_COTI_STORAGE_KEY,
} from "../../utils/constantes";
import ComboService from "../../services/ComboService/ComboService";
import CarsService from "../../services/CarsServices/CarsService";

dayjs.extend(customParseFormat);

const DetailsCar = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    placa: "",
    marca: "",
    grupo: "",
    modelo: "",
    anio: "2009",
    uso: "",
    tipo: "",
    valor_vehiculo: "",
    valor_accesorios: "0,00",
    suma_asegurada: "",
    ocupantes: "",
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

  // const cargarDatos = async () => {
  //   const dataPersonal = await cargarCotizacion();
  //   if (dataPersonal) {
  //     setFormData((formData) => ({
  //       ...formData,
  //       placa: dataPersonal[0].placa,
  //       marca: dataPersonal[0].marca,
  //       grupo: dataPersonal[0].grupo,
  //       modelo: dataPersonal[0].modelo,
  //       anio: dataPersonal[0].anio,
  //       uso: dataPersonal[0].uso,
  //       tipo: dataPersonal[0].tipo,
  //       valor_vehiculo: dataPersonal[0].valor_vehiculo,
  //       valor_accesorios: dataPersonal[0].valor_accesorios,
  //       suma_asegurada: dataPersonal[0].suma_asegurada,
  //     }));
  //   }
  // };

  // const cargarCotizacion = async () => {
  //   const userId = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
  //   const idCotizacion = localStorage.getItem(LS_COTIZACION);
  //   const dato = {
  //     usuario: userId.id,
  //     id_CotiGeneral: idCotizacion,
  //   };
  //   try {
  //     const cotizacion = await QuoterService.fetchConsultarCotizacionGeneral(dato);
  //     return cotizacion.data || [];
  //   } catch (error) {
  //     console.error("Error al obtener cotización:", error);
  //   }
  // };

  useEffect(() => {
    isMounted.current = true;
    const modoEditar = async () => {
      let data = JSON.parse(localStorage.getItem(DATOS_VEHICULO_STORAGE_KEY));

      if (data) {
        setCars(data);
      }
      await cargarCombos();
    };

    modoEditar();

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(DATOS_VEHICULO_STORAGE_KEY, JSON.stringify(cars));
  }, [cars]);


  const cargarCombos = async () => {
    try {
      await Promise.all([cargarMarca(), cargarUso(), cargarTipo()]);
    } catch (error) {
      console.error("Error al cargar combos:", error);
    }
  };

  const calculaSumaAsegurada = (valor1, valor2) => {
    const cleanValor1 = parseFloat(valor1.replace(/\./g, "").replace(",", "."));
    const cleanValor2 = parseFloat(valor2.replace(/\./g, "").replace(",", "."));

    return cleanValor1 + cleanValor2;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let modifiedValue = value;

    if (name === "placa") {
      modifiedValue = value.toUpperCase();
    }

    if (name === "marca") {
      formData.valor_vehiculo = "0,00";
      setModelo([]);
      cargarGrupo(modifiedValue);
    }

    if (name === "grupo") {
      setModelo([]);
      cargarModelo(modifiedValue);
      formData.valor_vehiculo = "0,00";
      formData.ocupantes = "";
    }

    if (name === "modelo") {
      const valor_vehiculo = formatAmount(obtenerMontoPorId(modifiedValue));

      setFormData((prevData) => ({
        ...prevData,
        valor_vehiculo,
        suma_asegurada: valor_vehiculo,
        ocupantes: obtenerOcupantePorId(modifiedValue)
      }));
    }

    if (name == "valor_accesorios") {
      if (modifiedValue.includes("0,00")) {
        modifiedValue = modifiedValue.replace("0,00", "");
      }

      if (modifiedValue == "")
        modifiedValue = "0,00";

      formData.suma_asegurada = obtenerMontoPorId(formatCurrency(modifiedValue));
    }

    if (["valor_vehiculo", "valor_accesorios", "suma_asegurada"].includes(name)) {
      modifiedValue = formatCurrency(modifiedValue);
    }

    setFormData((prevData) => {
      const newData = { ...prevData, [name]: modifiedValue };
      if (newData.valor_vehiculo && newData.valor_accesorios) {
        const sumaAsegurada = calculaSumaAsegurada(newData.valor_vehiculo, newData.valor_accesorios);
        newData.suma_asegurada = formatAmount(sumaAsegurada.toString());
      }
      return newData;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "valor_vehiculo") {
      const valorOriginal = obtenerMontoPorId(formatCurrency(formData.modelo));
      if (!valorOriginal || parseFloat(valorOriginal) === 0)
        return;

      const valorModificado = parseFloat(value.replace(/\./g, '').replace(',', '.'));
      const nuevoValor = modificarValorConRango(valorOriginal, valorModificado);

      if (nuevoValor !== null) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: formatAmount(nuevoValor),
        }));
      } else {
        setOpenSnack(true);
        setFormData((prevData) => ({
          ...prevData,
          [name]: formatAmount(valorOriginal),
          suma_asegurada: formatAmount(calculaSumaAsegurada(formatAmount(valorOriginal), formData.valor_accesorios)),
        }));
      }
    }
  };

  const modificarValorConRango = (valorOriginal, valorModificado) => {
    const valorNumericoOriginal = parseFloat(valorOriginal);
    const valorNumericoModificado = parseFloat(valorModificado);
    const porCiento = valorNumericoOriginal * 0.20;

    const maximoPermitido = valorNumericoOriginal + porCiento;
    const minimoPermitido = valorNumericoOriginal - porCiento;

    if (valorNumericoModificado <= minimoPermitido || valorNumericoModificado >= maximoPermitido) {
      setMessageError("El valor está fuera del rango permitido ("+formatAmount(minimoPermitido)+" y "+formatAmount(maximoPermitido)+").");
      return null;
    }
    return valorNumericoModificado;
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'string') return value;
    let cleanValue = value.replace(/[^\d,]/g, "");
    cleanValue = cleanValue.includes(",")
      ? cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return cleanValue;
  };

  const formatAmount = (value) => {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleAddCar = () => {
    if (!isFormValid()) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    const newCar = {
      marca: formData.marca,
      anio: formData.anio,
      grupo: formData.grupo,
      nombreGrupo: obtenerNombreGrupoPorId(formData.grupo),
      modelo: formData.modelo,
      modeloNombre: obtenerNombrePorId(formData.modelo),
      uso: formData.uso,
      tipo: formData.tipo,
      placa: formData.placa,
      ocupantes: formData.ocupantes,
      costo: formData.valor_vehiculo,
      totalAsegurado: formData.suma_asegurada,
      valorAccesorios: formData.valor_accesorios,
    };

    const updatedCars = [...cars, newCar];
    setCars(updatedCars);

    localStorage.setItem(DATOS_VEHICULO_STORAGE_KEY, JSON.stringify(updatedCars));


    setError("");
    formData.anio = "2009";
    formData.modelo = "";
    formData.modelo = "";
    formData.placa = "";
    formData.ocupantes = "";
    formData.valor_vehiculo = "0";
    formData.suma_asegurada = "0";
    formData.valor_accesorios = "0";
  };

  const isFormValid = () => {
    return (
      formData.marca &&
      formData.anio &&
      formData.grupo &&
      formData.modelo &&
      formData.modelo &&
      formData.uso &&
      formData.tipo &&
      formData.placa &&
      formData.ocupantes &&
      formData.valor_vehiculo &&
      formData.suma_asegurada &&
      formData.valor_accesorios
    );
  };

  const handleDeleteCar = (index) => {
    const updatedCars = cars.filter((_, i) => i !== index);
    setCars(updatedCars);
    localStorage.setItem(DATOS_VEHICULO_STORAGE_KEY, JSON.stringify(updatedCars));
  };

  const handleEditCar = async (index) => {
    const carToEdit = cars[index];
    formData.anio = carToEdit.anio;
    formData.marca = carToEdit.marca;
    await loadOnlyGrupo(carToEdit.marca);
    await loadOnlyModel(carToEdit.nombreGrupo);

    setFormData({
      ...formData,
      anio: carToEdit.anio,
      marca: carToEdit.marca,
      grupo: carToEdit.grupo,
      modelo: carToEdit.modelo,
      uso: carToEdit.uso,
      tipo: carToEdit.tipo,
      placa: carToEdit.placa,
      ocupantes: carToEdit.ocupantes,
      valor_vehiculo: carToEdit.costo,
      valor_accesorios: carToEdit.valorAccesorios,
      suma_asegurada: carToEdit.totalAsegurado,
    });

    handleDeleteCar(index);
  };


  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const handleSubmit = async (e) => {
    if (!cars.length) {
      faltanDatosUsuario();
      return false;
    }

    const data = crearObjetoVehiculo(cars);
    try {
      handleOpenBackdrop();

      const response = await CarsService.fetchGrabaDatosCars(data);
      if (response.codigo === 200) {
        localStorage.setItem(DATOS_VEHICULO_COTI_STORAGE_KEY, JSON.stringify(response.data));
        handleCloseBackdrop();
        return true;
      } else {
        setMessageError(response.message);
        setOpenSnack(true);
        handleCloseBackdrop();
        return false;
      }
    } catch (error) {
      handleCloseBackdrop();
      setMessageError("Se presentó un error no controlado, por favor revise toda la información y vuelva a intentar");
      setOpenSnack(true);
      return false;
    }
  };

  const crearObjetoVehiculo = (listaVehiculos) => {
    if (!Array.isArray(listaVehiculos)) {
      console.error("Se esperaba una lista de vehículos.");
      return null;
    }

    const arrVehiculo = listaVehiculos.map((newCar) => {
      const valorVehiculo = (newCar.costo && typeof newCar.costo === 'string')
        ? parseFloat(newCar.costo.replace(/\./g, '').replace(',', '.'))
        : parseFloat(newCar.costo);

      const valorAccesorios = (newCar.valorAccesorios && typeof newCar.valorAccesorios === 'string')
        ? parseFloat(newCar.valorAccesorios.replace(/\./g, '').replace(',', '.'))
        : parseFloat(newCar.valorAccesorios);

      return {
        riesgo: "",
        tipo: newCar.tipo,
        anio: newCar.anio,
        nuevo: "N",
        marca: newCar.marca,
        grupoModelo: newCar.grupo,
        modelo: newCar.modelo,
        nommodelo: newCar.modeloNombre,
        desmodelo: newCar.modeloNombre,
        color: "",
        uso: newCar.uso,
        rastreo: null,
        ocupantes: newCar.ocupantes,
        motor: "",
        chasis: "",
        placa: newCar.placa,
        paisorigen: null,
        descriesgo: null,
        valorVehiculo: valorVehiculo,
        montosugerido: null,
        montooriginal: null,
        montoautid: null,
        tasaanterior: null,
        tasacomparativo: 2.60,
        tasapura: "",
        tasanueva: "",
        tasaminima: "",
        tasainfima: "",
        tasaoriginal: "",
        tasa: "",
        prima: "",
        primaminima: "",
        accesorios: valorAccesorios,
        inspeccion: null,
        observacion: null,
        descuentotipo: "",
        descuentovalor: "",
        cobbasicas: null,
        cobadicionales: null,
        clausulas: null,
        combinado: null,
        descuentoautoid: null,
        poliquidautid: null,
        polizarenautid: null,
        novigenteautid: null,
        clase: "",
        nomClase: ""
      };
    });

    return {
      producto: 99999,
      ramo: 3,
      idCotizacion: localStorage.getItem(LS_COTIZACION_VEHICULO),
      arrVehiculo: arrVehiculo
    };
  };

  useImperativeHandle(ref, () => ({
    handleSubmitExternally: handleSubmit,
  }));

  const faltanDatosUsuario = () => {
    setMessageError("Debe llenar todos los datos obligatorios");
    setOpenSnack(true);
  };

  const cargarMarca = async () => {
    try {
      const marca = await ComboService.fetchComboMarca();
      if (marca?.data) {
        setMarca(marca.data);
        setFormData((prevData) => ({
          ...prevData,
          marca: marca.data[0].clave,
        }));
        await cargarGrupo(marca.data[0].nombre);
      }
    } catch (error) {
      console.error("Error al cargar marcas:", error);
    }
  };

  const cargarGrupo = async (idMarca) => {

    try {
      const grupo = await ComboService.fetchComboGrupo(idMarca);
      if (grupo?.data?.length > 0) {
        setGrupo(grupo.data);
        setFormData((prevData) => ({
          ...prevData,
          grupo: grupo.data[0].idGrupo,
        }));
        await cargarModelo(grupo.data[0].nombre);
      }
    } catch (error) {
      console.error("Error al cargar grupos:", error);

      // const grupo = await ComboService.fetchComboGrupo(idMarca);
      // if (grupo?.data?.length > 0) {
      //   setGrupo(grupo.data);
      //   setFormData((prevData) => ({ ...prevData, grupo: grupo.data[0].idGrupo }));
      //   await cargarModelo(grupo.data[0].nombre);

      // }
    }
  }

  const cargarModelo = async (nombre) => {
    const anio = formData.anio;
    const marca = formData.marca;
    const modelo = await ComboService.fetchComboModelo(nombre, anio, marca);
    if (modelo?.data?.length > 0) {
      setModelo(modelo.data);
      setFormData((prevData) => ({
        ...prevData,
        modelo: modelo.data[0].id,
        valor_vehiculo: formatAmount(modelo.data[0].monto),
        suma_asegurada: formatAmount(modelo.data[0].monto),
        ocupantes: modelo.data[0].ocupantes
      })
      );
    } else {
      formData.valor_vehiculo = "0,00";
    }
  };

  const loadOnlyModel = async (nombre) => {
    const anio = formData.anio;
    const marca = formData.marca;
    const modelo = await ComboService.fetchComboModelo(nombre, anio, marca);

    if (modelo?.data?.length > 0) {
      setModelo(modelo.data);
    }
  };

  const loadOnlyGrupo = async (idMarca) => {
    const grupo = await ComboService.fetchComboGrupo(idMarca);
    if (grupo?.data?.length > 0) {
      setGrupo(grupo.data);
    }
  };

  const obtenerNombrePorId = (idBuscado) => {
    const objetoEncontrado = modelo.find(item => item.id === idBuscado);
    return objetoEncontrado ? objetoEncontrado.nombre : 'ID no encontrado';
  };

  const obtenerNombreGrupoPorId = (idBuscado) => {
    const objetoEncontrado = grupo.find(item => item.idGrupo === idBuscado);
    console.log(objetoEncontrado);
    return objetoEncontrado ? objetoEncontrado.nombre : 'ID no encontrado';
  };

  const obtenerMontoPorId = (id) => {
    const item = modelo.find(obj => obj.id === id);
    return item ? item.monto : null;
  };

  const obtenerOcupantePorId = (id) => {
    const item = modelo.find(obj => obj.id === id);
    return item ? item.ocupantes : null;
  };

  const obtenerPorId = (id) => {
    const item = modelo.find(obj => obj.id === id);
    return item ? item.ocupantes : null;
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
                {Array.from({ length: 2025 - 2009 + 1 }, (_, index) => {
                  const year = 2009 + index;
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
                Modelo <span style={{ color: 'red' }}>*</span>
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
                Versión <span style={{ color: 'red' }}>*</span>
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
                Número de ocupantes <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                placeholder="Número de ocupantes"
                type="text"
                onChange={handleChange}
                name="ocupantes"
                value={formData.ocupantes}
                variant="standard"
                fullWidth
                required
              />

            </Grid>

            <Grid item xs={10.5} md={2.8} style={{ paddingTop: '21px' }}>
              <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                Valor del vehículo <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                placeholder="Valor del vehículo"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
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
                placeholder="0,00"
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
                Suma asegurada <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                placeholder="Suma asegurada"
                type="text"
                onChange={handleChange}
                name="suma_asegurada"
                value={formData.suma_asegurada}
                variant="standard"
                fullWidth
                disabled
                inputProps={{ maxLength: 15 }}
                required
              />
            </Grid>
            <Grid item xs={10.5} md={2.5} style={{ paddingTop: '21px' }}>
            <Button
              sx={{ mr: 1 }}
              className="button-styled-primary"
              style={{ top: "20%", backgroundColor: '#0099A8', color: "white" }}
              onClick={handleAddCar}
            >
              Agregar
            </Button>
          </Grid>
          </Grid>
          {error && <Alert severity="error">{error}</Alert>}

          <Grid item xs={10.5} md={12} style={{ width: '95%', paddingTop: '30px', paddingLeft: '30px', paddingRight: '30px', paddingBottom: '20px' }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 600 }} aria-label="car table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Placa</TableCell>
                    <TableCell align="center">Marca</TableCell>
                    <TableCell align="center">Modelo</TableCell>
                    <TableCell align="center">Año</TableCell>
                    <TableCell align="center">Suma Asegurada</TableCell>
                    <TableCell align="center">Eliminar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cars.map((car, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{car.placa}</TableCell>
                      <TableCell align="center">{car.marca}</TableCell>
                      <TableCell align="center">{car.nombreGrupo}</TableCell>
                      <TableCell align="center">{car.anio}</TableCell>
                      <TableCell align="center">{car.totalAsegurado}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteCar(index)}
                        >
                          <DeleteIcon />
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEditCar(index)}
                          style={{ marginLeft: '10px' }}
                        >
                          <EditIcon />
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
