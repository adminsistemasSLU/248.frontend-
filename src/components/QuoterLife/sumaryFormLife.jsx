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


const SumaryFormLife = forwardRef((props, ref) => {
    const [openBackdrop, setOpenBackdrop] = React.useState(false);

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
    });



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
                            value={formData.prima}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
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
                            value={formData.impuesto}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
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
                            value={formData.total}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>
                    
                    <Grid item xs={10.5} md={3}>
                        <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                            $ Muerte por cualquier causa 
                        </Typography>
                        <TextField
                            placeholder="$ Muerte por cualquier causa"
                            type="text"
                            name="muerteCausa"
                            value={formData.muerteCausa}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>
                    
                    <Grid item xs={10.5} md={3}>
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
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                    </Grid>

                    <Grid item xs={10.5} md={3}>
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