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
    iva: '',
    prima: '',
    impScvs: '',
    impSsc: '',
    admision: '',
    subtotal: '',
    total: '',
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
      style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}
    >
      <form onSubmit={handleSubmit} style={{ width: '100%', marginBottom: '20px', alignItems: 'start', justifyContent: 'center' }}
        className='paidForm'
      >

        <Paper elevation={3} style={{ width: '90%', minWidth:'340px',padding: 20, display: 'flex', flexGrow: 2, flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
          <div component="form"  style={{ width: '100%'}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl sx={{ margin: '0px', minWidth: 290,width:'100%'}} variant="standard">
                  <InputLabel id="paidType-Label">Tipo de credito</InputLabel>
                  <Select
                    labelId="paidType-Label"
                    id="paidType"
                    name="paidType"
                    value={formData.paidType}
                    onChange={handleChange}
                    style={{ textAlign: 'left',width:'100%' }}
                    variant="standard"
                    fullWidth
                    required
                  >
                    <MenuItem value="deb">Debito Automatico</MenuItem>

                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ margin: '0px', minWidth: 290,width:'100%' }} variant="standard">
                  <InputLabel id="paidForm-Label">Forma de pago</InputLabel>
                  <Select
                    labelId="paidForm-Label"
                    id="paidForm"
                    name="paidForm"
                    value={formData.paidForm}
                    onChange={handleChange}
                    style={{ textAlign: 'left',width:'100%' }}
                    variant="standard"
                    fullWidth
                    required
                  >
                    <MenuItem value="pgiguales">Pagos iguales</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="Numeros de pagos"
                  type="text"
                  name="numberPaid"
                  value={formData.numberPaid}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="Entrada"
                  type="text"
                  name="firstPaid"
                  value={formData.firstPaid}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>

            </Grid>
            <Button type="submit" variant="contained" style={{ visibility: 'hidden', backgroundColor: '#00a99e', color: '#fff', marginTop: '20px' }} fullWidth>
              Registrarse
            </Button>
          </div >
        </Paper>

        <Paper elevation={3} style={{ width: '90%', minWidth:'340px',  padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
          <div component="form" onSubmit={handleSubmit}  style={{ width: '100%'}} >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Suma Agregada"
                  type="text"
                  name="sumAdd"
                  value={formData.sumAdd}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Prima"
                  type="text"
                  name="prima"
                  value={formData.prima}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  label="Imp SCVS"
                  type="text"
                  name="impScvs"
                  value={formData.impScvs}
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
                  name="impSsc"
                  value={formData.impSsc}
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
                  name="admision"
                  value={formData.admision}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="SubTotal"
                  type="text"
                  name="subtotal"
                  value={formData.subtotal}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Iva 12%"
                  type="text"
                  name="iva"
                  value={formData.iva}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Total"
                  type="text"
                  name="total"
                  value={formData.total}
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