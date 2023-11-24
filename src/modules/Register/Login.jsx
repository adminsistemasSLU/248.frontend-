import React, { useState } from 'react';
import { TextField, Button, Container, Grid, Paper } from '@mui/material';
import '../../styles/form.scss'; 
// Componente del formulario
const Login = () => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar el formulario
    console.log(formData);
  };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: '70px',marginBottom: '90px',display:'flex',alignItems:'center', flexDirection:'column', justifyContent:'center'}}>
       <h2 style={{color:'#00a99e'}}>Login</h2>
      <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center',margin:'20px' }}>
        <form onSubmit={handleSubmit} className='form'>
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
