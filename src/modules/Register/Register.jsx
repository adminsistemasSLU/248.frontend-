import React, { useState } from 'react';
import { TextField, Button, Container, Grid, Paper, Alert } from '@mui/material';
import '../../styles/form.scss';
import ValidationUtils from '../../utils/ValiationsUtils';

// Componente del formulario
const Register = () => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    let modifiedValue = value;

    if (name === 'email') {
      if (!ValidationUtils.validateEmail(value)) {
        setError('Por favor ingresa un correo electrónico válido.');
      } else {
        setError('');
      }
    }
    setFormData({ ...formData, [name]: modifiedValue });
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar el formulario
    // Puedes agregar la lógica para enviar los datos al servidor aquí
  };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: '20px',marginBottom: '20px',display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
      <h2 style={{ color: '#00a99e' }}>Registro</h2>
      <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
        <form onSubmit={handleSubmit} className='form'>
          <Grid container spacing={2}>
            {/* Componentes de campo de entrada de Material-UI */}
            <Grid item xs={12}>
              <TextField
                label="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="LastName"
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="standard"
                fullWidth
                required
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
                required
              />
            </Grid>
          </Grid>

          {/* Botón de envío */}
          <Button type="submit" variant="contained" style={{ backgroundColor: '#00a99e', color: '#fff' }} fullWidth>
            Registrarse
          </Button>
        </form>
        <br/>
        {error && <Alert severity="error">{error}</Alert>}
      </Paper>
    </Container>
  );
};

export default Register;
