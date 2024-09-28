import React, { useContext,useState } from 'react';
import "../../styles/button.scss";
import "../../styles/style.scss";
import { TextField, InputAdornment, IconButton, Container, Grid, Paper, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { AuthContext }  from  '../../services/AuthProvider';
import Snackbar from "@mui/material/Snackbar";
import AlertTitle from "@mui/material/AlertTitle";
import {
  DATOS_AGENTES,
} from "../../utils/constantes";

const Login = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { signin } = useContext(AuthContext);
  const [errorPassword, setErrorPassword] = useState('');
  const [openSnack, setOpenSnack] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [values, setValues] = useState({
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    
    if(e.target.name ==='password'){
      if(e.target.value.length  < 6){
        setErrorPassword("La contraseña debe tener al menos 6 caracteres")
      }else{
        setErrorPassword('');
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem(DATOS_AGENTES);
    if(errorPassword!==''){

      return;
    }
    
    try {
      const data = {
        txtUser: formData.username,
        txtPassword: formData.password,
      };
      const response = await signin('api/Login', 'POST', data);
      if(response.codigo !==200){
        setOpenSnack(true);
        setErrorMessage(response.message);
      } else {
        getAgentes(response.data)
      }
    } catch (error) {
      setError("Se presentó un error con el inicio de sesión. Por favor, intente nuevamente.");
    }
  };

  const getAgentes = (usuario) => {
    if (usuario && usuario.tip_usuario === "I") {
      const list_agentes = usuario.arrAgente;
      if (Array.isArray(list_agentes) && list_agentes.length > 0) {
        localStorage.setItem("DATOS_AGENTES", JSON.stringify(list_agentes));
      }
    }
  };  

  return (
    <Container maxWidth={false} style={{ height: '100vh', width: '100vw', padding: 0, margin: 0 }}>
      <Grid container style={{ height: '100%' }}>
        <Grid item xs={false} md={7} className="hide-on-mobile" style={{ height: '100vh', overflow: 'hidden' }}>
          <img src={process.env.PUBLIC_URL + '/assets/images/login.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Background" />
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} square style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Container component="main" maxWidth="md" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent:'center' }}>
            <div className="show-on-mobile">
              <img src={process.env.PUBLIC_URL + '/assets/images/LogoSLU.jpg'} style={{ height: '100px', objectFit: 'cover' }} alt="Background" />
            </div>
              <h2 style={{color:'#02545C'}}>Iniciar Sesión</h2>
              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={openSnack}
                autoHideDuration={5000}
                onClose={() => setOpenSnack(false)}
              >
                <Alert style={{ fontSize: "1em" }} severity="error">
                  <AlertTitle style={{ textAlign: "left" }}>Error</AlertTitle>
                  {errorMessage}
                </Alert>
              </Snackbar>
              <form onSubmit={handleSubmit} className="form">
                <div className="input-container">
                  <label htmlFor="username" className="left-aligned-label"><b>Usuario o e-mail</b></label>
                  <TextField
                    id="username"
                    type="text"
                    name="username"
                    placeholder="Usuario o e-mail"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </div>
                {error && <div className="alert alert-error">{error}</div>}
                
                <div className="input-container ">
                  <label htmlFor="password" className="left-aligned-label"><b>Contraseña</b></label>
                  <TextField
                    id="password"
                    type={values.showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder='Contraseña'
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errorPassword && <div className="alert alert-error">{errorPassword}</div>}
                </div>
                <center>
                  <button type="submit" className="button-styled">
                    Iniciar Sesión
                  </button>
                </center>
              </form>
            </Container>
          </div>
        </Grid>
      </Grid>
    </Container>

  );
};

export default Login;
