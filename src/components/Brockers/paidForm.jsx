import React, { useState } from 'react';
import { TextField, Button, Container, Grid, Paper } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import '../../styles/form.scss';
const PaidForm = () => {
        const [formData, setFormData] = useState({
          paidType: '',
          paidForm: '',
          numberPaid: '',
          firstPaid: '',
          sumAdd: '',
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
      maxWidth="md"
      
    >
      <form  onSubmit={handleSubmit} style={{width:'100%', marginBottom: '20px', alignItems: 'start', justifyContent: 'center' }}
        className='paidForm'
      >
     
      <Paper elevation={3} style={{ width:'100%',padding: 20, display: 'flex',flexGrow: 2, flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
        <div component="form" >
          <Grid container spacing={2}>
            <Grid item xs={12}>
            <FormControl sx={{ m: 1, minWidth: 290 }}  variant="standard">
              <InputLabel id="documentType-Label">Tipo de credito</InputLabel>
                <Select
                  labelId="documentType-Label"
                  id="documentType"
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  style={{textAlign:'left'}}
                  variant="standard"
                  fullWidth
                  required
                >
                  <MenuItem value="deb">Debito Automatico</MenuItem>
                  
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
            <FormControl sx={{ m: 1, minWidth: 290 }}  variant="standard"> 
            <InputLabel id="paidForm-Label">Forma de pago</InputLabel>
              <Select
                labelId="paidForm-Label"
                id="paidForm"
                name="paidForm"
                value={formData.paidForm}
                onChange={handleChange}
                style={{textAlign:'left'}}
                variant="standard"
                fullWidth
                required
              >
                <MenuItem value="pgiguales">Pagos iguales</MenuItem>
              </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Numeros de pagos"
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
                label="Entrada"
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            
          </Grid>
          <Button type="submit" variant="contained" style={{ visibility:'hidden', backgroundColor: '#00a99e', color: '#fff',marginTop:'20px' }} fullWidth>
            Registrarse
          </Button>
        </div >
      </Paper>

      <Paper elevation={3} style={{ width:'100%', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
        <div component="form" onSubmit={handleSubmit} >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Suma Agregada"
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
                label="Prima"
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
                label="Imp Sim"
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
                label="Imp SSC"
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
                label="Derecho de Emision"
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
                label="SubTotal"
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
                label="Iva 12%"
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
                label="Total"
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

          {/* Botón de envío
          <Button type="submit" variant="contained" style={{ backgroundColor: '#00a99e', color: '#fff',marginTop:'20px' }} fullWidth>
            Registrarse
          </Button> */}
        </div >
      </Paper>
      </form>
    </Container>
  );
};
export default PaidForm;