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
    Snackbar,
    Backdrop,
    CircularProgress,
    MenuItem,
    Select,
    Card,
    Typography,
} from "@mui/material";
import {
    LS_COTIZACION_VEHICULO,
    DATOS_PERSONALES_VEHICULO_STORAGE_KEY,
    DATOS_AGENTES,
    USER_STORAGE_KEY,
    MAIL_COTIZACION,
} from "../../utils/constantes";
import "../../styles/form.scss";
import ValidationUtils from "../../utils/ValiationsUtils";
import UsuarioService from "../../services/UsuarioService/UsuarioService";
import ComboService from "../../services/ComboService/ComboService";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import CarsService from "../../services/CarsServices/CarsService";
import relativeTime from 'dayjs/plugin/relativeTime';
import { DataObject } from "@mui/icons-material";

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

const PersonalFormCar = forwardRef((props, ref) => {
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        phone: "",
        documentType: "C",
        identification: "",
        address: "",
        gender: "M",
        status: "S",
        anios: "",
        agente: "",
        provincia: "",
        ciudad: "",
        fechaNacimiento: "",
        pais: "",
    });
    const maxDate = dayjs().subtract(18, "years");
    const [error, setError] = useState("");
    const [errorCedula, setErrorCedula] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const isMounted = useRef(false);
    const [estadoCivil, setEstadoCivil] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [pais, setPais] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [fechaNacimiento, setFechaNacimiento] = useState();
    const [vigencia, setVigencia] = useState([]);
    const [agentes, setAgentes] = useState([]);

    const [showLastName, setShowLastName] = useState(true); // Controla si se muestra o no el campo apellido
    const [labelName, setLabelName] = useState("Nombres"); // Controla la etiqueta de nombre/empresa

    useEffect(() => {
        if (formData.documentType === "R") {
            setShowLastName(false);
            setLabelName("Empresa");
        } else {
            setShowLastName(true);
            setLabelName("Nombres");
        }
    }, [formData.documentType]);

    useEffect(() => {
        const iniciarDatosCombos = async () => {
            handleOpenBackdrop();

            await Promise.all([cargarProvincias(), cargarEstadoCivil(), cargarPais(), cargarVigencia()]);
            handleCloseBackdrop();

            cargarAgentesDesdeLocalStorage()
            let data = JSON.parse(localStorage.getItem(DATOS_PERSONALES_VEHICULO_STORAGE_KEY));

            if (data) {
                setFormData(data);
                const dateObject = dayjs(data.fechaNacimiento, "DD/MM/YYYY");
                setFechaNacimiento(dateObject);
            }
        };

        isMounted.current = true;
        iniciarDatosCombos();

        return () => {
            isMounted.current = false; // Establecer a false cuando el componente se desmonta
        };
    }, []);

    const cargarAgentesDesdeLocalStorage = () => {
        const datosAgentes = localStorage.getItem(DATOS_AGENTES);
        if (datosAgentes) {
            try {
                const agentesGuardados = JSON.parse(datosAgentes);
                if (Array.isArray(agentesGuardados)) {
                    setAgentes(agentesGuardados);
                }
            } catch (error) {
                console.error("Error al parsear DATOS_AGENTES:", error);
            }
        }
    };

    // const cargarDatos = async () => {
    //     const dataPersonal = await cargarCotizacion();

    //     if (isMounted.current && dataPersonal?.length) {
    //         setFormData({
    //             name: dataPersonal[0].clinombre,
    //             lastname: dataPersonal[0].cliapellido,
    //             email: dataPersonal[0].clicorreo,
    //             phone: dataPersonal[0].clitelefono,
    //             documentType: dataPersonal[0].clitipcedula,
    //             identification: dataPersonal[0].clicedula,
    //             address: dataPersonal[0].clidireccion,
    //             gender: dataPersonal[0].cli_genero,
    //             status: dataPersonal[0].cliestadocivil,
    //             anios: dataPersonal[0].vigencia,
    //             agente: dataPersonal[0].cliagente,
    //             provincia: dataPersonal[0].cliprovincia,
    //             ciudad: dataPersonal[0].cliciudad,
    //             fechaNacimiento: dayjs(dataPersonal[0].clinacimiento, "YYYY/MM/DD"),
    //         });
    //     }
    // };

    // const cargarCotizacion = async () => {
    //     let userId = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    //     let idCotizacion = localStorage.getItem(LS_COTIZACION_VEHICULO);

    //     let dato = {
    //         usuario: userId.id,
    //         id_CotiGeneral: idCotizacion,
    //     };
    //     try {
    //         const cotizacion = await QuoterService.fetchConsultarCotizacionGeneral(dato);

    //         if (cotizacion && cotizacion.data) {
    //             return cotizacion.data;
    //         }
    //     } catch (error) {
    //         console.error("Error al obtener antigüedad:", error);
    //     }
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "provincia") {
            cargarCiudad(value);
            setFormData({ ...formData, provincia: value, ciudad: "" });  // Reseteamos la ciudad cuando cambia la provincia
        } else if (name === "ciudad") {
            setFormData({ ...formData, ciudad: value });
        } else if (name === "pais") {
            setFormData({ ...formData, pais: value });
        } else {
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
        }
    };

    useImperativeHandle(ref, () => ({
        handleSubmitExternally: handleSubmit,
    }));

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        const requiredFields = [
            "name",
            "email",
            "phone",
            "documentType",
            "identification",
            "address",
            "gender",
            "status",
            "anios",
            "provincia",
            "ciudad",
            "fechaNacimiento",
            "pais",
        ];

        if (formData.documentType !== "R") {
            requiredFields.push("lastname");
        }

        let next = true;
        for (const field of requiredFields) {
            const value = formData[field];
            if (typeof value === "undefined" || value === null || (typeof value === "string" && value.trim() === "")) {
                next = false;
                faltanDatosUsuario();
                break;
            }
        }

        if (!next) return false;
        localStorage.setItem(MAIL_COTIZACION, formData.email);
        const data = transformarObjetoSeguro(formData);
        localStorage.setItem(DATOS_PERSONALES_VEHICULO_STORAGE_KEY, JSON.stringify(formData));

        try {
            handleOpenBackdrop();
            const response = await CarsService.fetchGrabaDatosPersona(data);
            if (response.codigo === 200) {
                handleCloseBackdrop();
                localStorage.setItem(LS_COTIZACION_VEHICULO, response.data)
                return true;
            } else {
                handleCloseBackdrop();
                setErrorMessage("Se presentó un error, por favor vuelva a intentar");
                setOpenSnack(true);
                return false;
            }
        } catch (error) {
            handleCloseBackdrop();
            setErrorMessage("Se presentó un error, por favor vuelva a intentar");
            setOpenSnack(true);
            return false;
        }
    };

    const transformarObjetoSeguro = (objetoSeguro) => {
        let userId = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
        return {
            // producto: process.env.PRODUCT_PIVOTE,
            // ramo: process.env.RAMO_VEHICULO,
            producto: 99999,
            ramo: 3,
            idUsuarioSistema: userId.id,
            datosCliente: {
                zona: obtenerProvinciaPorId(objetoSeguro.provincia)[0],
                tipoPoliza: "1",
                nuePoliza: null,
                poliza: "",
                agente: objetoSeguro.agente,
                agenteCorreo: "",
                tipoCedula: objetoSeguro.documentType,
                cedula: objetoSeguro.identification,
                apellido: objetoSeguro.lastname,
                nombre: objetoSeguro.name,
                fecNacimiento: objetoSeguro.fechaNacimiento,
                correo: objetoSeguro.email,
                genero: objetoSeguro.gender,
                estadoCivil: obtenerEstadoCivilPorId(objetoSeguro.status),
                pais: obtenerPaisPorId(objetoSeguro.pais),
                telefono: objetoSeguro.phone,
                direccion: objetoSeguro.address,
                provincia: obtenerProvinciaPorId(objetoSeguro.provincia),
                ciudad: obtenerCiudadPorId(objetoSeguro.ciudad),
                vigencia: objetoSeguro.anios
            }
        };
    };


    const verifyIdentification = async (e) => {
        const { value } = e.target;
        let documentType = formData.documentType;
        let identification = value;
        if (value === "") {
            setOpenSnack(true);
            setErrorMessage("Valor de cedula invalido");
            return;
        }
        try {
            handleOpenBackdrop();
            const cedulaData = await UsuarioService.fetchVerificarCedula(documentType, identification);
            if (cedulaData.codigo === 200) {
                setErrorCedula(false);
                await consultUserData(documentType, identification);
                handleCloseBackdrop();
            } else {
                setErrorCedula(true);
                setOpenSnack(true);
                setErrorMessage(cedulaData.message);
                handleCloseBackdrop();
            }
        } catch (error) {
            console.error("Error al verificar cédula:", error);
        }
    };

    const consultUserData = async (documentType, identification) => {
        try {
            const cedulaData = await UsuarioService.fetchConsultarUsuario(documentType, identification);
            if (cedulaData.codigo === 200 && cedulaData.data) {
                setFormData({
                    ...formData,
                    name: cedulaData.data[0].cli_nombres || "",
                    lastname: cedulaData.data[0].cli_apellidos || "",
                    email: cedulaData.data[0].cli_email || "",
                    phone: cedulaData.data[0].cli_celular || "",
                    address: cedulaData.data[0].cli_direccion || "",
                    status: cedulaData.data[0].cli_estcivil || "",
                    pais: cedulaData.data[0].cli_residencia || "",
                    gender: cedulaData.data[0].cli_sexo || "",
                });
                const dateObject = dayjs(cambiarFormatoFecha(cedulaData.data[0].cli_fecnacio), "DD/MM/YYYY");
                handleDateChange(dateObject);
                setFechaNacimiento(dateObject);

            }
        } catch (error) {
            console.error("Error al verificar cédula:", error);
        }
    };

    const cambiarFormatoFecha = (fecha) => {
        if (!fecha) return '';

        const [anio, mes, dia] = fecha.split('-');
        return `${dia}/${mes}/${anio}`;
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnack(false);
    };

    function faltanDatosUsuario() {
        setErrorMessage("Debe llenar todos los datos obligatorios");
        setOpenSnack(true);
    }

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };

    const handleOpenBackdrop = () => {
        setOpenBackdrop(true);
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

    const cargarProvincias = async () => {
        try {
            const provincias = await ComboService.fetchComboProvincias(1, 113);
            if (provincias && provincias.data) {
                setProvinces(provincias.data);
                const codigoProvincia = provincias.data.find((item) => item.Nombre.toLowerCase() === "guayas".toLowerCase()).Codigo;
                setFormData((formData) => ({
                    ...formData,
                    provincia: codigoProvincia
                }));
                await cargarCiudad(codigoProvincia);
            }
        } catch (error) {
            console.error("Error al obtener provincias:", error);
        }
    };

    const cargarVigencia = async () => {
        try {
            const vigencia = await ComboService.fetchComboVigencia(99999);

            if (vigencia && vigencia.data) {
                setVigencia(vigencia.data);

                setFormData((formData) => ({ ...formData, anios: vigencia.data[0].vigencia }));
            }
        } catch (error) {
            console.error("Error al obtener vigencia:", error);
        }
    };

    const cargarCiudad = async (provinciaCodigo) => {
        try {
            const ciudades = await ComboService.fetchComboCiudad(1, 113, provinciaCodigo);
            if (ciudades && ciudades.data) {
                setCiudades(ciudades.data);
                setFormData((formData) => ({ ...formData, ciudad: ciudades.data[0].Codigo }));
            }
        } catch (error) {
            console.error("Error al obtener ciudad:", error);
        }
    };

    const cargarPais = async () => {
        try {
            const pais = await ComboService.fetchComboPais();
            if (pais && pais.data) {
                setPais(pais.data);
                setFormData((formData) => ({
                    ...formData,
                    pais: pais.data.find((item) => item.nombre.toLowerCase() === "ecuador".toLowerCase()).codiso
                }));
            }
        } catch (error) {
            console.error("Error al obtener pais:", error);
        }
    };

    const obtenerNombrePorId = (id, arrayDatos, idPropiedad = 'Codigo', nombrePropiedad = 'nombre') => {
        const objetoEncontrado = arrayDatos.find(item => item[idPropiedad].toLowerCase() === id.toLowerCase());
        return objetoEncontrado ? objetoEncontrado[nombrePropiedad] : 'ID no encontrado';
    };

    const obtenerPaisPorId = (id) => obtenerNombrePorId(id, pais, 'codiso', 'nombre');
    const obtenerCiudadPorId = (id) => obtenerNombrePorId(id, ciudades, 'Codigo', 'Nombre');
    const obtenerProvinciaPorId = (id) => obtenerNombrePorId(id, provinces, 'Codigo', 'Nombre');
    const obtenerEstadoCivilPorId = (id) => obtenerNombrePorId(id, estadoCivil, 'Codigo', 'Nombre');

    const handleDateChange = (newValue) => {
        console.log(newValue);
        const formattedDate = newValue ? dayjs(newValue).format('DD/MM/YYYY') : '';
        setFechaNacimiento(newValue);
        setFormData((prevData) => ({
            ...prevData,
            fechaNacimiento: formattedDate,
        }));
    };

    return (
        <Card elevation={4} sx={{ width: '100%', m: 2, mx: 'auto', paddingTop: '30px', paddingBottom: '20px' }}>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <form
                component="form"
                onSubmit={handleSubmit}
                style={{ width: '100%', paddingLeft: '30px', paddingRight: '10px', paddingBottom: '20px' }}
            >
                <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '30px', fontWeight: 'bold' }}>
                    DATOS PERSONALES
                </Typography>
                <Grid container spacing={2}>
                    <Snackbar
                        open={openSnack}
                        autoHideDuration={5000}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <Alert severity="warning">{errorMessage}</Alert>
                    </Snackbar>

                    {/* Documento */}
                    <Grid item xs={10.5} md={2.8}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Seleccione Documento <span style={{ color: 'red' }}>*</span>
                        </Typography>
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

                    {/* Documento de identificación */}
                    <Grid item xs={10.5} md={2.8}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Documento de identificación <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <TextField
                            type="text"
                            name="identification"
                            value={formData.identification}
                            placeholder="Documento de identificación"
                            onChange={handleChange}
                            onBlur={verifyIdentification}
                            variant="standard"
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={10.5} md={2.8}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            {labelName} <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <TextField
                            placeholder={labelName}
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>

                    {/* Apellidos */}
                    {showLastName && (
                        <Grid item xs={10.5} md={2.8}>
                            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                                Apellidos <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField
                                placeholder="Apellidos"
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                variant="standard"
                                fullWidth
                                inputProps={{ maxLength: 30 }}
                                required
                            />
                        </Grid>
                    )}

                    {/* Género */}
                    <Grid item xs={10.5} md={2.8}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Género <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <Select
                            labelId="gender-Label"
                            id="gender"
                            name="gender"
                            style={{ textAlign: "left" }}
                            value={formData.gender}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            required
                        >
                            <MenuItem value="M">Masculino</MenuItem>
                            <MenuItem value="F">Femenino</MenuItem>
                        </Select>
                    </Grid>

                    {/* Estado Civil */}
                    <Grid item xs={10.5} md={2.8}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Estado Civil <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <Select
                            labelId="status-Label"
                            id="status"
                            style={{ textAlign: "left" }}
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            variant="standard"
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

                    {/* Teléfono */}
                    <Grid item xs={10.5} md={2.8}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Teléfono <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <TextField
                            placeholder="Teléfono"
                            type="number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            inputProps={{ maxLength: 10 }}
                            required
                        />
                    </Grid>

                    {/* Dirección */}
                    <Grid item xs={10.5} md={2.8}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Dirección <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <TextField
                            placeholder="Dirección"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            required
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={10.5} md={2.8}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Email <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <TextField
                            placeholder="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            required
                        />
                    </Grid>

                    {/* Años de Vigencia */}
                    <Grid item xs={10.5} md={2.8}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Años de Vigencia <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <Select
                            labelId="anios-Label"
                            id="anios"
                            name="anios"
                            style={{ textAlign: "left" }}
                            value={formData.anios}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            required
                        >
                            {vigencia.map((vigencia, index) => (
                                <MenuItem key={index} value={vigencia.vigencia}>
                                    {vigencia.descripcion}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    <Grid item xs={10.5} md={2.8}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px' }}>
                            Fecha de nacimiento <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}  >
                            <DemoContainer components={["DatePicker"]}>
                                <DatePicker
                                    placeholder="Fecha de nacimiento"
                                    slotProps={{
                                        textField: { variant: "standard", size: "small" },
                                    }}
                                    value={fechaNacimiento}
                                    format="DD/MM/YYYY"
                                    className="datePicker"
                                    maxDate={maxDate}
                                    onChange={handleDateChange}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>

                    {/* Pais */}
                    <Grid item xs={10.5} md={2.8}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Pais <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <Select
                            labelId="pais-Label"
                            id="pais"
                            style={{ textAlign: "left" }}
                            name="pais"
                            value={formData.pais}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            required
                            placeholder="Seleccione pais"
                        >
                            {pais.map((pais, index) => (
                                <MenuItem key={index} value={pais.codiso}>
                                    {pais.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    {/* Provincia */}
                    <Grid item xs={10.5} md={2.8}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Provincia <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <Select
                            labelId="provincia-Label"
                            id="provincia"
                            style={{ textAlign: "left" }}
                            name="provincia"
                            value={formData.provincia}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            required
                            placeholder="Seleccione provincia"
                        >
                            {provinces.map((province, index) => (
                                <MenuItem key={index} value={province.Codigo}>
                                    {province.Nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    {agentes.length > 0 && (
                        <Grid item xs={10.5} md={2.8}>
                            <Typography
                                variant="body2"
                                style={{
                                    textAlign: "left",
                                    fontSize: "16px",
                                    paddingBottom: "5px",
                                }}
                            >
                                Agentes <span style={{ color: "red" }}>*</span>
                            </Typography>
                            <Select
                                labelId="agente-Label"
                                id="agente"
                                style={{ textAlign: "left" }}
                                name="agente"
                                value={formData.agente}
                                onChange={handleChange}
                                variant="standard"
                                fullWidth
                                required
                                placeholder="Seleccione agente"
                            >
                                {agentes.map((agente, index) => (
                                    <MenuItem key={index} value={agente.clave}>
                                        {`${agente.nombre}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    )}

                </Grid>
            </form>
        </Card >
    );
});

export default PersonalFormCar;
