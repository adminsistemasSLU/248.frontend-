import React, { useContext,useState } from 'react';
import { TextField, Button, Container, Grid, Paper, Alert } from '@mui/material';
import '../../styles/form.scss'; 
import { AuthContext }  from  '../../services/AuthProvider';
import Swal from "sweetalert2";
import Snackbar from "@mui/material/Snackbar";
import AlertTitle from "@mui/material/AlertTitle";

const Login = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const setAuth = useContext(AuthContext);
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
      console.log('Error corregido')
      return;
    }
    
    try {
      const data = {
        txtUser: formData.username,
        txtPassword: formData.password,
      };
      const response = await signin('api/Login', 'POST', data);
      console.log(response);
      if(response.codigo !==200){
        setOpenSnack(true);
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.log(error);
      setError("Se presentó un error con el inicio de sesión. Por favor, intente nuevamente.");
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: '70px',marginBottom: '90px',display:'flex',alignItems:'center', flexDirection:'column', justifyContent:'center'}}>
       <h2 style={{color:'#00a99e'}}>Login</h2>
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
      <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center',margin:'20px' }}>
        <form onSubmit={handleSubmit} className='form'>
        {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={2}>
            {/* Componentes de campo de entrada de Material-UI */}
            <Grid item xs={12}>
              <TextField
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                variant="standard"
                required
                fullWidth
              />
            </Grid>
            {errorPassword && <Alert severity="error">{errorPassword}</Alert>}
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                variant="standard"
                required
                fullWidth
              />
            </Grid>
          </Grid>

          {/* Botón de envío */}
          <Button type="submit" variant="contained" style={{backgroundColor:'#00a99e'}} fullWidth>
            Enviar
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
