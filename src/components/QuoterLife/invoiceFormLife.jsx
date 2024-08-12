import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import {
    TextField,
    Button,
    Container,
    Grid,
    Paper,
    Alert,
    Snackbar,
    Typography,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "../../styles/form.scss";
import { PARAMETROS_STORAGE_KEY, LS_FORMAPAGO, LS_COTIZACION, DATOS_PAGO_STORAGE_KEY } from "../../utils/constantes";
import IncendioService from "../../services/IncencioService/IncendioService";
import ComboService from "../../services/ComboService/ComboService";
import QuoterService from "../../services/QuoterService/QuoterService";
import Swal from "sweetalert2";
import UsuarioService from "../../services/UsuarioService/UsuarioService";


const InvoiceFormLife = forwardRef((props, ref) => {


    const [formData, setFormData] = useState({
        paidType:"",
        name: "",
        lastname: "",
        email: "",
        phone: "",
        documentType: "C",
        identification: "",
        sumAdd: "",
        iva: "",
        prima: "",
        impScvs: "",
        impSsc: "",
        admision: "",
        subtotal: "",
        total: "",
    });
    const [formaPago, setformaPago] = useState([]);
    const [tipoCredito, settipoCredito] = useState([]);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [formPago, setFormPago] = React.useState([]);
    const [errorMessage, seterrorMessage] = React.useState([]);
    const [OpenSnackAlert, setOpenSnackAlert] = React.useState(false);
    const [validate, setvalidate] = React.useState(false);
    const [error, setError] = useState("");
    const [messageError, setmessageError] = useState("");
    const [errorCedula, setErrorCedula] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const cargarData = async () => {
            handleOpenBackdrop();
            // await cargarFormaPago();
            // await cargarTipoCredito();
            // await cargarDatosCotizacion();
            handleCloseBackdrop();
        };
        cargarData();
    }, []);

    useEffect(() => {
        console.log(tipoCredito);
    }, [tipoCredito]);

    useImperativeHandle(ref, () => ({
        handleSubmitExternally: handleSubmit,
    }));

    const cargarDatosCotizacion = async () => {
        try {
            const idCotizacion = localStorage.getItem(LS_COTIZACION);
            const response = await IncendioService.cargarDatosPago(idCotizacion);
            let formaPago = response.data[0];
            const parametros = JSON.parse(
                localStorage.getItem(PARAMETROS_STORAGE_KEY)
            );
            setFormPago(formaPago);
            console.log(formaPago);
            let monto = parseFloat(formaPago.totalmonto);
            let prima = parseFloat(formaPago.totalprima);
            let sbs = (parseFloat(formaPago.por_sbs) * prima) / 100;
            let scc = (parseFloat(formaPago.por_ssc) * prima) / 100;
            let derechoEmision = (parseFloat(formaPago.valDerecho) * prima) / 100;
            let subtot =
                parseFloat(prima) +
                parseFloat(sbs) +
                parseFloat(scc) +
                parseFloat(derechoEmision);
            let iva = (parseFloat(formaPago.por_iva) * subtot) / 100;
            let total = iva + sbs + scc + derechoEmision + parseFloat(prima);

            const datosPago = JSON.parse(localStorage.getItem(DATOS_PAGO_STORAGE_KEY));
            console.log(datosPago[0]);

            let formapago = datosPago[0].formapago != null ? datosPago[0].formapago : "";
            let numpagos = datosPago[0].numpagos != null ? datosPago[0].numpagos : "";
            let tipfacturacion = datosPago[0].tipfacturacion != null ? datosPago[0].tipfacturacion : "";
            let valentrada = datosPago[0].valentrada !== "0.00" ? datosPago[0].valentrada : "";

            setFormData({
                ...formData,
                paidType: tipfacturacion,
                paidForm: formapago,
                numberPaid: numpagos,
                firstPaid: valentrada,
                sumAdd: parseFloat(monto).toFixed(2),
                iva: iva.toFixed(2),
                prima: parseFloat(prima).toFixed(2),
                impScvs: parseFloat(sbs).toFixed(2),
                impSsc: parseFloat(scc).toFixed(2),
                admision: parseFloat(derechoEmision).toFixed(2),
                subtotal: parseFloat(subtot).toFixed(2),
                total: parseFloat(total).toFixed(2),
            });
        } catch (error) {
            console.error("Error al obtener Datos de Pago: ", error);
        }
    };

    function formatedInput(numero) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(numero);
    }

    // const cargarFormaPago = async () => {
    //     try {
    //         const fPago = await ComboService.fetchComboFormaPago();
    //         if (fPago && fPago.data) {
    //             setformaPago(fPago.data);
    //         }
    //     } catch (error) {
    //         console.error("Error al obtener Forma Pago: ", error);
    //     }
    // };

    // const cargarTipoCredito = async () => {
    //     try {
    //         const tCredito = await ComboService.fetchComboTipoCredito();
    //         if (tCredito && tCredito.data) {
    //             settipoCredito(tCredito.data);
    //         }
    //     } catch (error) {
    //         console.error("Error al obtener Tipo Credito: ", error);
    //     }
    // };

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };
    const handleOpenBackdrop = () => {
        setOpenBackdrop(true);
    };

    const handleChange = (e) => {
        if (
            e.target.name === "name" ||
            e.target.name === "lastname" ||
            e.target.name === "email" ||
            e.target.name === "phone" ||
            e.target.name === "paidType"||
            e.target.name === "documentType"||
            e.target.name === "identification"
        ) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const validarformulario = () => {
        let valido = true;
        if (formData.paidType === "") {
            valido = false;
            seterrorMessage("Debe llenar el campo Tipo de Crédito");
            setOpenSnackAlert(true);
            handleCloseBackdrop();
        }

        if (formData.firstPaid === "" && formData.paidForm === "2") {
            valido = false;
            seterrorMessage("Debe llenar el campo Entrada");
            setOpenSnackAlert(true);
            handleCloseBackdrop();
        }

        if (formData.paidForm === "") {
            valido = false;
            seterrorMessage("Debe llenar el campo Forma de Pago");
            setOpenSnackAlert(true);
            handleCloseBackdrop();
        }

        if (formData.numberPaid === "") {
            valido = false;
            seterrorMessage("Debe llenar el campo Números de pagos");
            setOpenSnackAlert(true);
            handleCloseBackdrop();
        }

        return valido;
    };

    const handleSubmit = async (e) => {
        setvalidate(true);
        handleOpenBackdrop();
        let enviarFormulario = false;
        const idCotizacion = localStorage.getItem(LS_COTIZACION);
        enviarFormulario = validarformulario();
        if (enviarFormulario) {
            enviarFormulario = false;
            let envioPago = {
                id_CotiGeneral: idCotizacion,
                enviado: 1,
                tipfacturacion: formData.paidType,
                formapago: formData.paidForm,
                numpagos: formData.numberPaid,
                valentrada: formData.firstPaid,
                valprima: formData.prima,
                porsibs: formPago.por_sbs,
                valsibs: formData.impScvs,
                porssc: formPago.por_ssc,
                valssc: formData.impSsc,
                porsscnc: formPago.por_sscnc,
                valsscnc: 0,
                poriva: formPago.por_iva,
                valiva: formData.iva,
                valDerecho: formData.admision,
            };

            //Se agrega en ls para mostrar los datos guardados 
            let envioPagoLS = [{
                id: idCotizacion,
                tipfacturacion: formData.paidType,
                formapago: formData.paidForm,
                numpagos: formData.numberPaid,
                valentrada: formData.firstPaid,
            }];

            localStorage.setItem(
                DATOS_PAGO_STORAGE_KEY,
                JSON.stringify(envioPagoLS)
            );

            try {
                const response = await QuoterService.fetchGuardarFormaDePago(envioPago);
                if (response.codigo === 200) {
                    enviarFormulario = true;
                    localStorage.setItem(LS_FORMAPAGO, formData.paidForm)
                    handleCloseBackdrop();
                } else {
                    handleCloseBackdrop();
                    enviarFormulario = false;
                    Swal.fire({
                        title: "Exito!",
                        text: response.message,
                        icon: "error",
                        confirmButtonText: "Ok",
                    });
                }
            } catch (error) {
                handleCloseBackdrop();

            }

            return enviarFormulario;
        }

        return enviarFormulario;
    };

    const handleCloseSnack = () => {
        setOpenSnackAlert(false);
    };

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
                // await consultUserData(documentType, identification);
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

    //   const consultUserData = async (documentType, identification) => {
    //     try {
    //       const cedulaData = await UsuarioService.fetchConsultarUsuario(
    //         documentType,
    //         identification
    //       );
    //       if (cedulaData.codigo === 200 && cedulaData.data) {
    //         setFormData({
    //           ...formData, // Conserva los valores actuales
    //           name: cedulaData.data[0].cli_nombres || "",
    //           lastname: cedulaData.data[0].cli_apellidos || "",
    //           email: cedulaData.data[0].cli_email || "",
    //           phone: cedulaData.data[0].cli_celular || "",
    //           address: cedulaData.data[0].cli_direccion || "",
    //         });
    //       }
    //     } catch (error) {
    //       console.error("Error al verificar cédula:", error);
    //     }
    //   };

    return (
        <Container
            component="main"
            maxWidth="md"
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
            <form
                onSubmit={handleSubmit}
                style={{
                    width: "100%",
                    marginBottom: "20px",
                    alignItems: "start",
                    justifyContent: "center",
                }}
                className="paidForm"
            >
                <Snackbar
                    open={OpenSnackAlert}
                    autoHideDuration={5000}
                    onClose={handleCloseSnack}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    <Alert severity="warning">{errorMessage}</Alert>
                </Snackbar>
                <Paper
                    elevation={3}
                    style={{
                        width: "90%",
                        minWidth: "340px",
                        padding: 20,
                        display: "flex",
                        flexGrow: 2,
                        flexDirection: "column",
                        alignItems: "center",
                        margin: "20px",
                    }}
                >
                    <div component="form" style={{ width: "100%" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl
                                    sx={{ margin: "0px", minWidth: 290, width: "100%" }}
                                    variant="standard"
                                    error={!formData.paidType && validate}
                                >
                                    <InputLabel id="paidType-Label">Facturar a asegurado</InputLabel>
                                    <Select
                                        labelId="paidType-Label"
                                        id="paidType"
                                        name="paidType"
                                        value={formData.paidType}
                                        onChange={handleChange}
                                        style={{ textAlign: "left", width: "100%" }}
                                        variant="standard"
                                        fullWidth
                                        required
                                    >
                                        {Array.isArray(tipoCredito) &&
                                            tipoCredito.map((tCredito, index) => (
                                                <MenuItem key={index} value={tCredito.Codigo}>
                                                    {tCredito.Nombre}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl
                                    sx={{ margin: "0px", minWidth: 290, width: "100%" }}
                                    variant="standard"
                                >
                                    <InputLabel id="paidForm-Label">Tipo Documento</InputLabel>
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
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                                    Documento<span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    type={formData.documentType === "P" ? "text" : "text"}
                                    name="identification"
                                    value={formData.identification}
                                    placeholder="Documento"
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

                            <Grid item xs={12} md={12}>
                                <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                                    Nombres<span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    placeholder="Nombres"
                                    onChange={handleChange}
                                    onBlur={verifyIdentification}
                                    variant="standard"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                                Apellidos<span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    placeholder="Apellidos"
                                    onChange={handleChange}
                                    onBlur={verifyIdentification}
                                    variant="standard"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                                Email<span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    placeholder="Email"
                                    onChange={handleChange}
                                    onBlur={verifyIdentification}
                                    variant="standard"
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                                Télefono<span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    placeholder="Télefono"
                                    onChange={handleChange}
                                    onBlur={verifyIdentification}
                                    variant="standard"
                                    fullWidth
                                    required
                                />
                            </Grid>

                        </Grid>



                    </div>
                </Paper>

                <Paper
                    elevation={3}
                    style={{
                        width: "90%",
                        minWidth: "340px",
                        padding: 20,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        margin: "20px",
                    }}
                >
                    <div
                        component="form"
                        onSubmit={handleSubmit}
                        style={{ width: "100%" }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Suma Asegurada"
                                    className="disablePaidForm"
                                    type="text"
                                    name="sumAdd"
                                    value={formatedInput(formData.sumAdd)}
                                    onChange={handleChange}
                                    variant="standard"
                                    fullWidth
                                    required
                                    sx={{
                                        '& input': {
                                            textAlign: 'right'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Prima"
                                    type="text"
                                    name="prima"
                                    value={formatedInput(formData.prima)}
                                    onChange={handleChange}
                                    variant="standard"
                                    fullWidth
                                    required
                                    sx={{
                                        '& input': {
                                            textAlign: 'right'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Imp SCVS"
                                    type="text"
                                    name="impScvs"
                                    value={formatedInput(formData.impScvs)}
                                    onChange={handleChange}
                                    variant="standard"
                                    fullWidth
                                    required
                                    sx={{
                                        '& input': {
                                            textAlign: 'right'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Imp SSC"
                                    type="text"
                                    name="impSsc"
                                    value={formatedInput(formData.impSsc)}
                                    onChange={handleChange}
                                    variant="standard"
                                    fullWidth
                                    required
                                    sx={{
                                        '& input': {
                                            textAlign: 'right'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Derecho de Emisión"
                                    type="text"
                                    name="admision"
                                    value={formatedInput(formData.admision)}
                                    onChange={handleChange}
                                    variant="standard"
                                    fullWidth
                                    required
                                    sx={{
                                        '& input': {
                                            textAlign: 'right'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="SubTotal"
                                    type="text"
                                    name="subtotal"
                                    value={formatedInput(formData.subtotal)}
                                    onChange={handleChange}
                                    variant="standard"
                                    fullWidth
                                    required
                                    sx={{
                                        '& input': {
                                            textAlign: 'right'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Iva 15%"
                                    type="text"
                                    name="iva"
                                    value={formatedInput(formData.iva)}
                                    onChange={handleChange}
                                    variant="standard"
                                    fullWidth
                                    required
                                    sx={{
                                        '& input': {
                                            textAlign: 'right'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Total"
                                    type="text"
                                    name="total"
                                    value={formatedInput(formData.total)}
                                    onChange={handleChange}
                                    variant="standard"
                                    fullWidth
                                    required
                                    sx={{
                                        '& input': {
                                            textAlign: 'right'
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        {/* Botón de envío
            <Button type="submit" variant="contained" style={{ backgroundColor: '#00a99e', color: '#fff',marginTop:'20px' }} fullWidth>
              Registrarse
            </Button> */}
                    </div>
                </Paper>
            </form>
        </Container>
    );
});
export default InvoiceFormLife;
