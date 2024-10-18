import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import { TextField, Grid, Alert } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { LS_DATAVIDASEND, API_SUBBALDOSAS,LS_PRODUCTO, LS_COTIZACION, LS_DATOSPAGO, LS_PREGUNTASVIDA, LS_DOCUMENTOSVIDA, LS_IDCOTIZACIONVIDA, LS_VIDAPOLIZA, DATOS_PAGO_STORAGE_KEY } from "../../utils/constantes";
import Swal from "sweetalert2";
import LifeService from "../../services/LifeService/LifeService";
import { useNavigate } from "react-router-dom";


const SumaryFormLife = forwardRef((props, ref) => {
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        document: "",
        email: "",
        phone: "",

        documentInvoice: "",
        nameInvoice: "",
        emailInvoice: "",
        phoneInovice: "",

        producto: "",
        prima: "",
        impuesto: "",
        total: "",
        muerteCausa: "",
        itp: "",
        muerteAccidental: "",
        tipoPlan:""
    });

    function formatedInput(numero) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(numero);
    }

    useImperativeHandle(ref, () => ({
        handleSubmitExternally: handleSubmit,
    }));

    const handleSubmit = async (e) => {
    let idCotizacion = localStorage.getItem(LS_COTIZACION);
    setOpenBackdrop(true);
      const terminarTarea = await LifeService.fetchEmitirCertificado(idCotizacion)
      setOpenBackdrop(false);
      if (terminarTarea.codigo === 200) {
        Swal.fire({
          title: "Exito!",
          text: `El proceso ha terminado`,
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
            localStorage.removeItem(LS_PRODUCTO);
            localStorage.removeItem(LS_DATAVIDASEND);
            localStorage.removeItem(LS_DATOSPAGO);
            localStorage.removeItem(LS_PREGUNTASVIDA);
            localStorage.removeItem(LS_DOCUMENTOSVIDA);
            localStorage.removeItem(LS_IDCOTIZACIONVIDA);
            localStorage.removeItem(LS_VIDAPOLIZA);
            localStorage.removeItem(DATOS_PAGO_STORAGE_KEY);
          navigate("/quoter/Pymes/MyQuotes");
        });
        return;
      } else {
        Swal.fire({
          title: "Alerta!",
          text: terminarTarea.message,
          icon: "warning",
          confirmButtonText: "Ok",
        });
      }
    }
    //Funcion principal para cargar datos
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(LS_DATAVIDASEND));
        const productos = JSON.parse(localStorage.getItem(API_SUBBALDOSAS));
        const IdProducto = JSON.parse(localStorage.getItem(LS_PRODUCTO));
        const nombreProducto = productos.filter((item)=>{
            return item.producto === IdProducto;
        })

        let sbs = (parseFloat(data.arrDatosCliente.datosfacturas.impScvs));
        let scc = (parseFloat(data.arrDatosCliente.datosfacturas.impSsc));
        let derechoEmision = (parseFloat(data.arrDatosCliente.datosfacturas.admision));
        let iva = (parseFloat(data.arrDatosCliente.datosfacturas.iva));

        let tipoPlan = ((data.arrDatosCliente.datoscertificado.tipoProducto==='I'?'Individual':'Mancomunado'));
        
        let impuesto = sbs +scc+derechoEmision+iva;

        setFormData((prevData) => ({
            ...prevData,
            name: data.arrDatosCliente.nombre+" "+data.arrDatosCliente.apellido,
            document: data.arrDatosCliente.identificacion,
            email: data.arrDatosCliente.correo,
            phone: data.arrDatosCliente.telefono,

            documentInvoice: data.arrDatosCliente.datosfacturas.identification,
            nameInvoice: data.arrDatosCliente.datosfacturas.name+" "+data.arrDatosCliente.datosfacturas.lastname,
            emailInvoice: data.arrDatosCliente.datosfacturas.email,
            phoneInovice: data.arrDatosCliente.datosfacturas.phone,

            producto: nombreProducto[0].titulo,
            prima: data.arrDatosCliente.datosfacturas.prima,
            impuesto: impuesto,
            total: data.arrDatosCliente.datosfacturas.total,
            muerteCausa: data.arrDatosCliente.datosfacturas.sumAdd,
            itp: "",
            muerteAccidental: "",
            tipoPlan:tipoPlan
        }));
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        let modifiedValue = value;
        setFormData({ ...formData, [name]: modifiedValue });
    }


    return (
        <Card elevation={4} sx={{ width: '100%', m: 2, mx: 'auto', paddingTop: '30px', paddingBottom: '30px', }}>

            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <form
                component="form"
                style={{ width: '100%', paddingLeft: '30px', paddingRight: '10px', paddingBottom: '20px' }}
            >
                <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '0px', fontWeight: 'bold' }}>
                    ASEGURADO
                </Typography>
                <Grid container spacing={2} style={{ paddingRight: '5px' }}>
                    <Grid item xs={10.5} md={3}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Documento
                        </Typography>
                        <TextField
                            type="text"
                            name="document"
                            value={formData.document}
                            placeholder="Documento"
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            required
                        />
                    </Grid>
                    <Grid item xs={10.5} md={3} >
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Nombre
                        </Typography>
                        <TextField
                            type="text"
                            name="name"
                            value={formData.name}
                            placeholder="Nombre"
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            required
                        />
                    </Grid>
                    <Grid item xs={10.5} md={3} >
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Email
                        </Typography>
                        <TextField
                            placeholder="Email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>
                    <Grid item xs={10.5} md={2.5}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Télefono
                        </Typography>
                        <TextField
                            placeholder="Télefono"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>
                </Grid>
                <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingTop: '30px', paddingLeft: '0px', fontWeight: 'bold' }}>
                    FACTURACION
                </Typography>
                <Grid container spacing={2} style={{ paddingRight: '5px' }}>

                    <Grid item xs={10.5} md={3}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Documento
                        </Typography>
                        <TextField
                            type="text"
                            name="documentInvoice"
                            value={formData.documentInvoice}
                            placeholder="Documento"
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            required
                            disabled
                        />
                    </Grid>
                    <Grid item xs={10.5} md={3} >
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Nombre
                        </Typography>
                        <TextField
                            type="text"
                            name="nameInvoice"
                            value={formData.nameInvoice}
                            placeholder="Nombre"
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            required
                        />
                    </Grid>
                    <Grid item xs={10.5} md={3} >
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Email
                        </Typography>
                        <TextField
                            placeholder="Email"
                            id="email"
                            name="emailInvoice"
                            value={formData.emailInvoice}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>
                    <Grid item xs={10.5} md={2.5}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Télefono
                        </Typography>
                        <TextField
                            placeholder="Télefono"
                            type="text"
                            name="phoneInovice"
                            value={formData.phoneInovice}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>
                </Grid>

                <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingTop: '30px', paddingLeft: '0px', fontWeight: 'bold' }}>
                    COBERTURAS
                </Typography>
                <Grid container spacing={2} style={{ paddingRight: '5px' }}>

                    <Grid item xs={10.5} md={3}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Producto
                        </Typography>
                        <TextField
                            placeholder="Producto"
                            type="text"
                            name="producto"
                            value={formData.producto}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>

                    <Grid item xs={10.5} md={3}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            $ Prima
                        </Typography>
                        <TextField
                            placeholder="Prima"
                            type="text"
                            name="prima"
                            value={formatedInput(formData.prima)}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>

                    <Grid item xs={10.5} md={3}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            $ Impuesto
                        </Typography>
                        <TextField
                            placeholder="$ Impuesto"
                            type="text"
                            name="impuesto"
                            value={formatedInput(formData.impuesto)}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>


                    <Grid item xs={10.5} md={3}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            $ Total
                        </Typography>
                        <TextField
                            placeholder="$ Total"
                            type="text"
                            name="total"
                            value={formatedInput(formData.total)}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>

                    <Grid item xs={10.5} md={3}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            $ Suma Asegurada
                        </Typography>
                        <TextField
                            placeholder="$ Muerte por cualquier causa"
                            type="text"
                            name="muerteCausa"
                            value={formatedInput(formData.muerteCausa)}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>

                    <Grid item xs={10.5} md={3}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            Tipo de plan
                        </Typography>
                        <TextField
                            placeholder="$ Muerte por cualquier causa"
                            type="text"
                            name="muerteCausa"
                            value={(formData.tipoPlan)}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>

                    <Grid item xs={10.5} md={3} style={{visibility:'hidden'}}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            $ ITP
                        </Typography>
                        <TextField
                            placeholder="$ ITP"
                            type="text"
                            name="itp"
                            value={formData.itp}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>

                    <Grid item xs={10.5} md={3} style={{visibility:'hidden'}}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            $ Muerte Accidental
                        </Typography>
                        <TextField
                            placeholder="$ Muerte Accidental"
                            type="text"
                            name="muerteAccidental"
                            value={formData.muerteAccidental}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            disabled
                            inputProps={{ maxLength: 30 }}
                            required
                            
                        />
                    </Grid>

                </Grid>

            </form>
        </Card >
    );

});
export default SumaryFormLife;