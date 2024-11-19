import React, { useContext,useState } from 'react';
import "../../styles/button.scss";
import "../../styles/style.scss";
import { TextField, InputAdornment, IconButton, Container, Grid, Paper, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSearchParams } from "react-router-dom";

import { AuthContext }  from  '../../services/AuthProvider';
import Snackbar from "@mui/material/Snackbar";
import AlertTitle from "@mui/material/AlertTitle";

const Login2 = () => {
  const [searchParams] = useSearchParams();
  const parametro = searchParams.get("Token")
  alert(parametro);

  const [formData, setFormData] = useState({
    username: ''
  });
  const [error, setError] = useState('');
  const { signin } = useContext(AuthContext);
  const [errorPassword, setErrorPassword] = useState('');
  const [openSnack, setOpenSnack] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    if(errorPassword!==''){

      return;
    }
    
    try {
      const data = {
        txtUser: formData.username
      };
      
      const response = await signin('api/Login2', 'POST', data);
      if(response.codigo !==200){
        setOpenSnack(true);
        setErrorMessage(response.message);
      }
    } catch (error) {
      setError("Se presentó un error con el inicio de sesión. Por favor, intente nuevamente.");
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
 
              </form>
            </Container>
          </div>
        </Grid>
      </Grid>
    </Container>

  );
};

export default Login2;
