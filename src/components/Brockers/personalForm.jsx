import React, { useState } from 'react';
import { TextField, Container, Grid, Paper } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const PersonalForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    documentType: '',
    identification: '',
    age: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Agregar lógica de envío del formulario si es necesario
    console.log('Formulario enviado:', formData);
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}
    >
      <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
        <FormControl component="form" onSubmit={handleSubmit} className='form'>
          <Grid container spacing={2}>
            <Grid item xs={12}>
            <InputLabel id="documentType-Label">Seleccione documento</InputLabel>
              <Select
                labelId="documentType-Label"
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                variant="standard"
                fullWidth
                required
              >
                <MenuItem value="cedula">Cédula</MenuItem>
                <MenuItem value="ruc">RUC</MenuItem>
                <MenuItem value="pasaporte">Pasaporte</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Documento de identificación"
                type="text"
                name="identification"
                value={formData.identification}
                onChange={handleChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombres"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Apellidos"
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
                label="Edad"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dirección"
                type="text"
                name="address"
                value={formData.address}
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
          </Grid>

          {/* Botón de envío */}
          {/* <Button type="submit" variant="contained" style={{ backgroundColor: '#00a99e', color: '#fff',marginTop:'20px' }} fullWidth>
            Registrarse
          </Button> */}
        </FormControl >
      </Paper>
    </Container>
  );
};

export default PersonalForm;