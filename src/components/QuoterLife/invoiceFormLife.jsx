import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import {
    TextField,
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
import {
    LS_COTIZACION,
    LS_DATOSPAGO,
    LS_DATAVIDASEND
} from "../../utils/constantes";
import LifeService from "../../services/LifeService/LifeService";
import UsuarioService from "../../services/UsuarioService/UsuarioService";


const InvoiceFormLife = forwardRef((props, ref) => {


    const [formData, setFormData] = useState({
        paidType: "C",
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

   


    const [tipoCredito, settipoCredito] = useState([]);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [formPago, setFormPago] = React.useState([]);
    const [errorMessage, seterrorMessage] = React.useState([]);
    const [OpenSnackAlert, setOpenSnackAlert] = React.useState(false);
    const [validate, setvalidate] = React.useState(false);
    const [messageError, setmessageError] = useState("");
    const [errorCedula, setErrorCedula] = useState(false);
    const [open, setOpen] = useState(false);

    const [editForm, setEditForm] = useState(false);


    const [formaPago, setformaPago] = useState("C");

    useEffect(() => {
        const cargarData = async () => {
            handleOpenBackdrop();
            cargarDatosVidaPago();
            handleCloseBackdrop();
        };
        cargarData();
    }, []);

    

    useImperativeHandle(ref, () => ({
        handleSubmitExternally: handleSubmit,
    }));

    const cargarDatosVidaPago = () => {
        let formaPagoAray = JSON.parse(localStorage.getItem(LS_DATAVIDASEND));
        let factura = JSON.parse(localStorage.getItem(LS_DATOSPAGO));
        let formaPagos;
        
        if (formaPagoAray &&
            formaPagoAray.arrDatosCliente &&
            formaPagoAray.arrDatosCliente.datosfacturas &&
            typeof formaPagoAray.arrDatosCliente.datosfacturas === 'object' &&
            Object.keys(formaPagoAray.arrDatosCliente.datosfacturas).length > 0) {

            formaPagos = formaPagoAray.arrDatosCliente.datosfacturas;
            setEditForm(false);
        } else {

            formaPagos = factura;
            setEditForm(true);
        }
        setFormData((prevData) => ({
            ...prevData,
            paidType: formaPagos.paidType, // Asegúrate de que `newValue` es el valor correcto que deseas establecer
        }));
        let formapag = formaPagos.paidType || 'C';
        setformaPago(formapag);
    }

    useEffect(() => {
        
       
        let formaPagoAray = JSON.parse(localStorage.getItem(LS_DATAVIDASEND));
        let factura = JSON.parse(localStorage.getItem(LS_DATOSPAGO));
        let formaPagos;

        if (formaPagoAray &&
            formaPagoAray.arrDatosCliente &&
            formaPagoAray.arrDatosCliente.datosfacturas &&
            typeof formaPagoAray.arrDatosCliente.datosfacturas === 'object' &&
            Object.keys(formaPagoAray.arrDatosCliente.datosfacturas).length > 0) {
            formaPagos = formaPagoAray.arrDatosCliente.datosfacturas;
        } else {
            formaPagos = factura;
        }

        let monto = parseFloat(factura.sumAdd);
        let prima = parseFloat(factura.prima);
        let sbs = (parseFloat(factura.impScvs));
        let scc = (parseFloat(factura.impSsc));
        let derechoEmision = (parseFloat(factura.admision));
        let subtot = parseFloat(factura.subtotal);
        let iva = (parseFloat(factura.iva));
        let total = parseFloat(factura.total);

        if (formaPago === 'C') {
            let formaPagos = JSON.parse(localStorage.getItem(LS_DATOSPAGO));
            setFormData({
                ...formData,
                name: formaPagos.name,
                lastname: formaPagos.lastname,
                email: formaPagos.email,
                phone: formaPagos.phone,
                documentType: formaPagos.documentType,
                identification: formaPagos.identification,
                sumAdd: parseFloat(monto).toFixed(2),
                iva: iva.toFixed(2),
                prima: parseFloat(prima).toFixed(2),
                impScvs: parseFloat(sbs).toFixed(2),
                impSsc: parseFloat(scc).toFixed(2),
                admision: parseFloat(derechoEmision).toFixed(2),
                subtotal: parseFloat(subtot).toFixed(2),
                total: parseFloat(total).toFixed(2),
            });
        }

        if (formaPago === 'R') {
            let nombre =   formaPagoAray.arrDatosCliente.datosfacturas.paidType ==='R'?formaPagoAray.arrDatosCliente.datosfacturas.name : '';
            let lastname =   formaPagoAray.arrDatosCliente.datosfacturas.paidType ==='R'?formaPagoAray.arrDatosCliente.datosfacturas.lastname : '';
            let email =   formaPagoAray.arrDatosCliente.datosfacturas.paidType ==='R'?formaPagoAray.arrDatosCliente.datosfacturas.email : '';
            let phone =   formaPagoAray.arrDatosCliente.datosfacturas.paidType ==='R'?formaPagoAray.arrDatosCliente.datosfacturas.phone : '';
            let documentType =   formaPagoAray.arrDatosCliente.datosfacturas.paidType ==='R'?formaPagoAray.arrDatosCliente.datosfacturas.documentType : '';
            let identification =   formaPagoAray.arrDatosCliente.datosfacturas.paidType ==='R'?formaPagoAray.arrDatosCliente.datosfacturas.identification : '';

            setFormData({
                ...formData,
                name: nombre || '',
                lastname: lastname || '',
                email: email || '',
                phone: phone || '',
                documentType: documentType || 'C',
                identification: identification || '',
                sumAdd: parseFloat(monto).toFixed(2),
                iva: iva.toFixed(2),
                prima: parseFloat(prima).toFixed(2),
                impScvs: parseFloat(sbs).toFixed(2),
                impSsc: parseFloat(scc).toFixed(2),
                admision: parseFloat(derechoEmision).toFixed(2),
                subtotal: parseFloat(subtot).toFixed(2),
                total: parseFloat(total).toFixed(2),
            });
        }
    }, [formaPago]);


    function formatedInput(numero) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(numero);
    }


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
            e.target.name === "documentType" ||
            e.target.name === "identification"
        ) {

            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
        if( e.target.name === "paidType" ){
            setformaPago(e.target.value);
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

        if (formData.name === "" && formData.paidForm === "2") {
            valido = false;
            seterrorMessage("Debe llenar el campo Nombre");
            setOpenSnackAlert(true);
            handleCloseBackdrop();
        }

        if (formData.lastname === "") {
            valido = false;
            seterrorMessage("Debe llenar el campo Apellido");
            setOpenSnackAlert(true);
            handleCloseBackdrop();
        }

        if (formData.email === "") {
            valido = false;
            seterrorMessage("Debe llenar el campo email");
            setOpenSnackAlert(true);
            handleCloseBackdrop();
        }

        if (formData.phone === "") {
            valido = false;
            seterrorMessage("Debe llenar el campo telefono");
            setOpenSnackAlert(true);
            handleCloseBackdrop();
        }

        if (formData.identification === "") {
            valido = false;
            seterrorMessage("Debe llenar el campo cédula");
            setOpenSnackAlert(true);
            handleCloseBackdrop();
        }

        return valido;
    };

    const handleSubmit = async (e) => {
        handleOpenBackdrop();
        setvalidate(true);
        handleOpenBackdrop();
        let enviarFormulario = false;
        enviarFormulario = validarformulario();
        const datosfacturas = {
            paidType: formaPago,
            name: formData.name,
            lastname: formData.lastname,
            email: formData.email,
            phone: formData.phone,
            documentType: formData.documentType,
            identification: formData.identification,
            sumAdd: formData.sumAdd,
            iva: formData.iva,
            prima: formData.prima,
            impScvs: formData.impScvs,
            impSsc: formData.impSsc,
            admision: formData.admision,
            subtotal: formData.subtotal,
            total: formData.total
        }

        if (enviarFormulario) {
            enviarFormulario = false;
            const data = JSON.parse(localStorage.getItem(LS_DATAVIDASEND));
            const datosCliente = data.arrDatosCliente;
            datosCliente.datosfacturas = datosfacturas;
            data.arrDatosCliente = datosCliente;
            console.log(data);

           
            try {
                const response = await LifeService.fetchGrabaDatosVida(data);
                if (response.codigo === 200) {
                    enviarFormulario = true;
                    localStorage.setItem(LS_DATAVIDASEND, JSON.stringify(data));
                    handleCloseBackdrop();
                    return true;
                } else {
                    handleCloseBackdrop();
                    enviarFormulario = false;
                    return false;
                }
            } catch (error) {
                handleCloseBackdrop();
                return false;
            }

            
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
                                    error={!formaPago && validate}
                                >
                                    <InputLabel id="paidType-Label">Facturar a asegurado</InputLabel>
                                    <Select
                                        labelId="paidType-Label"
                                        id="paidType"
                                        name="paidType"
                                        value={formaPago}
                                        onChange={handleChange}
                                        style={{ textAlign: "left", width: "100%" }}
                                        variant="standard"
                                        fullWidth
                                        required
                                    >
                                        <MenuItem value="C">Cliente</MenuItem>
                                        <MenuItem value="R">Otra Persona</MenuItem>
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
                                        disabled={formaPago === 'C'}
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
                                    disabled={formaPago === 'C'}
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
                                    disabled={formaPago === 'C'}
                                    value={formData.name}
                                    placeholder="Nombres"
                                    onChange={handleChange}
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
                                    disabled={formaPago === 'C'}
                                    placeholder="Apellidos"
                                    onChange={handleChange}
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
                                    disabled={formaPago === 'C'}
                                    placeholder="Email"
                                    onChange={handleChange}
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
                                    disabled={formaPago === 'C'}
                                    placeholder="Télefono"
                                    onChange={handleChange}
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

                       
                    </div>
                </Paper>
            </form>
        </Container>
    );
});
export default InvoiceFormLife;
