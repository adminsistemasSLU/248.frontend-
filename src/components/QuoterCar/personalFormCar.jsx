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

const PersonalFormCar = forwardRef((props, ref) => {
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        phone: "",
        documentType: "C",
        identification: "",
        age: "",
        address: "",
        gender: "M",
        status: "S",
        anios: "1",
        inicioVigencia: null,
        finVigencia: null,
        agente: "001",
        provincia: "1",
        ciudad: "1",
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
                gender: dataPersonal[0].cligenero,
                status: dataPersonal[0].cliestadocivil,
                anios: dataPersonal[0].vigencia,
                agente: dataPersonal[0].cliagente,
                provincia: dataPersonal[0].cliprovincia,
                ciudad: dataPersonal[0].cliciudad
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
            genero: formData.gender,
            estadoCivil: formData.status,
            aniosVigencia: formData.anios,
            agente: formData.agente,
            provincia: formData.provincia,
            ciudad: formData.ciudad
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
        <Card elevation={4} sx={{ width: '100%', m: 2, mx: 'auto', paddingTop: '30px', paddingBottom: '20px', }}>
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

                    {/* Nombres */}
                    <Grid item xs={10.5} md={2.8}>
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
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>

                    {/* Apellidos */}
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
                            <MenuItem value="S">Soltero</MenuItem>
                            <MenuItem value="C">Casado</MenuItem>
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
                            <MenuItem value="1">1 año</MenuItem>
                            <MenuItem value="2">2 años</MenuItem>
                            <MenuItem value="3">3 años</MenuItem>
                        </Select>
                    </Grid>

                    {/* Agente */}
                    <Grid item xs={10.5} md={2.8}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Agente <span style={{ color: 'red' }}>*</span>
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
                        >
                            <MenuItem value="001">ZHM Cia. Lta</MenuItem>
                            <MenuItem value="002">ZHM Cia. Lta 1</MenuItem>
                            <MenuItem value="003">ZHM Cia. Lta 2</MenuItem>
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
                        >
                            <MenuItem value="1">Guayas</MenuItem>
                            <MenuItem value="2">Manabi</MenuItem>
                        </Select>
                    </Grid>

                    <Grid item xs={10.5} md={2.8}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Ciudad <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <Select
                            labelId="ciudad-Label"
                            id="ciudad"
                            name="ciudad"
                            style={{ textAlign: "left" }}
                            value={formData.ciudad}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            required
                        >
                            <MenuItem value="1">Guayaquil</MenuItem>
                            <MenuItem value="2">Quito</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
            </FormControl>
        </Card>
    );
});

export default PersonalFormCar;
