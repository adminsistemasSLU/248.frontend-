import React, { useState } from 'react';
import { TextField, Container, Grid, Paper, Alert } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../../styles/form.scss';
import ValidationUtils from '../../utils/ValiationsUtils';

const PersonalForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    documentType: '',
    identification: '',
    age: '',
    address: '',
  });
  const [error, setError] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
  
    let modifiedValue = value;
    if (name === 'identification') {
      if (formData.documentType === 'C' && value.length > 10) {
        modifiedValue = value.slice(0, 10);
      } else if (formData.documentType === 'R' && value.length > 13) {
        modifiedValue = value.slice(0, 13);
      }
    } else if (name === 'phone') {
      modifiedValue = value.slice(0, 10);
    } else if (name === 'email') {
      if (!ValidationUtils.validateEmail(modifiedValue)) {
        setError('Por favor ingresa un correo electrónico válido.');
      } else {
        setError('');
      }
    }
  
    setFormData({ ...formData, [name]: modifiedValue });
  };

  const [age, setAge] = React.useState();

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
        <FormControl component="form" variant="standard" onSubmit={handleSubmit} className='form'>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputLabel id="documentType-Label">Seleccione documento</InputLabel>
              <Select
                labelId="documentType-Label"
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                style={{ textAlign: 'left' }}
                variant="standard"
                fullWidth
                required
              >
                <MenuItem value="C">Cédula</MenuItem>
                <MenuItem value="R">RUC</MenuItem>
                <MenuItem value="P">Pasaporte</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Documento de identificación"
                type={formData.documentType === "P" ? "text" : "number"}
                name="identification"
                value={formData.identification}
                onChange={handleChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                label="Nombres"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="standard"
                fullWidth
                inputProps={{ maxLength: 30 }}
                required
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                label="Apellidos"
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                variant="standard"
                fullWidth
                inputProps={{ maxLength: 30 }}
                required
              />
            </Grid>

            <Grid item xs={12} md={12}>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Fecha de nacimiento"
                    slotProps={{ textField: {variant: 'standard', size:'small'} }}
                    value={age}
                    className='datePicker'
                    onChange={(newValue) => setAge(newValue)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Teléfono"
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                variant="standard"
                fullWidth
                inputProps={{ maxLength: 10 }}
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
          {error && <Alert severity="error">{error}</Alert>}
        </FormControl >
      </Paper>
    </Container>
  );
};

export default PersonalForm;