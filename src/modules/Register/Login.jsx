import React, { useContext,useState } from 'react';
import { TextField, Button, Container, Grid, Paper, Alert } from '@mui/material';
import '../../styles/form.scss'; 
import { AuthContext }  from  '../../services/AuthProvider';


const Login = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const setAuth = useContext(AuthContext);
  const { signin } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        txtUser: formData.username,
        txtPassword: formData.password,
      };
      const error = await signin('api/Login', 'POST', data);
      if(error){
        
      }
    } catch (error) {
      console.log(error);
      setError("Se presentó un error con el inicio de sesión. Por favor, intente nuevamente.");
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: '70px',marginBottom: '90px',display:'flex',alignItems:'center', flexDirection:'column', justifyContent:'center'}}>
       <h2 style={{color:'#00a99e'}}>Login</h2>
      
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
