import React, {
    useState,
} from "react";
import { TextField, Grid, Alert, Button,Snackbar } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import UsuarioService from "../services/UsuarioService/UsuarioService";
import { USER_STORAGE_KEY } from "./constantes";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ChangePassword(props) {
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [OpenSnackAlert, setOpenSnackAlert] = React.useState(false);
    const [errorMessage, seterrorMessage] = React.useState([]);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        actualPassword: "",
        newPassword: "",
        repeatPassword: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones personalizadas
        if (!formData.actualPassword) {
            alert("El campo Contraseña actual es obligatorio.");
            return;
        }
        if (!formData.newPassword) {
            alert("El campo Nueva Contraseña es obligatorio.");
            return;
        }
        if (!formData.repeatPassword) {
            alert("El campo Repetir Contraseña es obligatorio.");
            return;
        }
        if (formData.newPassword !== formData.repeatPassword) {
            seterrorMessage("Las contraseñas no coinciden.");
            setOpenSnackAlert(true);
            return;
        }

        if(formData.newPassword  < 6){
            seterrorMessage("La contraseña debe tener al menos 6 caracteres");
            setOpenSnackAlert(true);
          }

        let user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
        
        if (formData.newPassword !== formData.repeatPassword) {
            seterrorMessage("La nueva contraseña y la confirmación de contraseña no coinciden.");
            setOpenSnackAlert(true);
            return; // Detener el envío si las contraseñas no coinciden
        }

        try{
            setOpenBackdrop(true);
           let response =  await UsuarioService.fetchCambiarContrasenia(user.cod_usuario,formData.newPassword,formData.actualPassword);
           setOpenBackdrop(false); 
           if(response.codigo === 200){
                Swal.fire({
                    title: "Exito!",
                    text: response.message,
                    icon: "success",
                    confirmButtonText: "Ok",
                  }).then(() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    navigate("/login");
                  });
            }else {
                seterrorMessage(response.message);
                setOpenSnackAlert(true);
            }
        }catch (ex){
            seterrorMessage("Error al llamar al servicio");
            setOpenSnackAlert(true);
        }
       

    }

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        let modifiedValue = value;
        setFormData({ ...formData, [name]: modifiedValue });
    }

    const handleCloseSnack = () => {
        setOpenSnackAlert(false);
    };


    return (
        <div style={{ paddingTop: '30px' }}>
            <Typography
                variant="h3"
                color="#02545C"
                style={{ textAlign: 'center', paddingBottom: '20px', paddingLeft: '0px', fontWeight: 'bold' }}
            >
                Cambiar Contraseña 
            </Typography>

            <Snackbar
                    open={OpenSnackAlert}
                    autoHideDuration={5000}
                    onClose={handleCloseSnack}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    <Alert  sx={{ fontSize: '1.25rem' }} severity="error">{errorMessage}</Alert>
                </Snackbar>

            <Card
                elevation={4}
                sx={{
                    width: { xs: '90%', sm: '70%', md: '50%' }, // Ajusta el ancho según el tamaño de pantalla
                    m: 2,
                    mx: 'auto',
                    marginBottom: '90px',
                    paddingTop: '30px',
                    paddingBottom: '30px',
                    height: 'auto', // Cambiado a auto para evitar problemas de altura fija
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
                    component="form"
                    style={{ width: '100%', paddingLeft: '30px', paddingRight: '10px', paddingBottom: '20px' }}
                >
                    <Typography
                        variant="body2"
                        color="#02545C"
                        style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '0px', fontWeight: 'bold' }}
                    >
                        Cambiar Contraseña
                    </Typography>
    
                    <Grid container spacing={2} style={{ paddingRight: '5px' }}>
                        <Grid item xs={11}>
                            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                                Contraseña actual <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField
                                type="password"
                                name="actualPassword"
                                value={formData.actualPassword}
                                onChange={handleChange}
                                placeholder="xxxxxxxxxxxx"
                                variant="standard"
                                fullWidth
                                required
                                onBlur={(e) => {
                                    if (!formData.actualPassword) {
                                        e.target.setCustomValidity('El campo Contraseña actual es obligatorio.');
                                    } else {
                                        e.target.setCustomValidity('');
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
    
                    <Grid container spacing={2} style={{ paddingRight: '5px' }}>
                        <Grid item xs={11}>
                            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                                Nueva Contraseña <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                placeholder="xxxxxxxxx"
                                onChange={handleChange}
                                variant="standard"
                                fullWidth
                                required
                                onBlur={(e) => {
                                    if (!formData.newPassword) {
                                        e.target.setCustomValidity('El campo Nueva Contraseña es obligatorio.');
                                    } else {
                                        e.target.setCustomValidity('');
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
    
                    <Grid container spacing={2} style={{ paddingRight: '5px' }}>
                        <Grid item xs={11}>
                            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
                                Repetir Contraseña <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField
                                type="password"
                                placeholder="xxxxxxxxxxxx"
                                id="repeatPassword"
                                name="repeatPassword"
                                onChange={handleChange}
                                value={formData.repeatPassword}
                                variant="standard"
                                fullWidth
                                inputProps={{ maxLength: 30 }}
                                required
                                onBlur={(e) => {
                                    if (!formData.repeatPassword) {
                                        e.target.setCustomValidity('El campo Repetir Contraseña es obligatorio.');
                                    } else {
                                        e.target.setCustomValidity('');
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
    
                    <Grid container spacing={2} style={{ paddingRight: '5px',paddingTop:'5px' }}>
                        <Grid item xs={11}>
                            <Button
                                type="submit"
                                sx={{ mr: 1 }}
                                className="button-styled-primary"
                                style={{ top: "20%", backgroundColor: '#02545C', color: "white" }}
                            >
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Card>
        </div>
    );
    

}