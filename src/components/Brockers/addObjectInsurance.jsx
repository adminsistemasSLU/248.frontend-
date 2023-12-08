import React, { useState,useRef  } from 'react';
import { TextField, Button, Container, Grid, Paper } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MapContainer from './mapContainer';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import IconButton from '@mui/material/IconButton';
import '../../styles/moddalForm.scss';


const AddObjectInsurance = () => {
  const [formData, setFormData] = useState({
    province: '',
    city: '',
    parish: '',
    direccion: '',
    block: '',
    house: '',
    floor: '',
    buildingAge: '',
    constructionType: '',
    riskType: '',
    destiny: '',
    sumInsure: '',
    lat: '',
    lng: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const mapContainerRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    // Agregar lógica de envío del formulario si es necesario
    console.log('Formulario enviado:', formData);
  };

  const onMarkerDragEnd = ({ lat, lng, direccion }) => {
    setFormData({ ...formData, lat, lng, direccion });
    console.log('Marcador actualizado:', formData);
  };

  const updateLocation = (lat, lng, direccion) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      lat: lat,
      lng: lng,
      direccion: direccion
    }));
  };

  const SearchLocation = () => {
    if (mapContainerRef.current) {
      mapContainerRef.current.handleSearchLocation();
    }
  };


  return (
    <Container
      component="main"
      style={{ width: '80%', minHeight: '80vh', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}
    >
      <h2 style={{ color: '#00a99e' }}>Objeto del Seguro</h2>
      <div className='modalForm '>
        <Paper elevation={3} style={{ width: '50%', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <form component="form" onSubmit={handleSubmit} className='form'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl style={{ width: '100%', height: 30 }} >
                  <InputLabel id="province-Label">Provincia</InputLabel>
                  <Select
                    labelId="province-Label"
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    style={{ textAlign: 'left', height: 30 }}
                  >
                    <MenuItem value="01">Guayas</MenuItem>
                    <MenuItem value="02">Quito</MenuItem>
                    <MenuItem value="03">Azogues</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl style={{ width: '100%' }}>
                  <InputLabel id="city-Label">Ciudad</InputLabel>
                  <Select
                    labelId="city-Label"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    style={{ textAlign: 'left' }}
                  >
                    <MenuItem value="G01">Guayaquil</MenuItem>
                    <MenuItem value="G02">Duran</MenuItem>
                    <MenuItem value="G03">Daule</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl style={{ width: '100%' }}>
                  <InputLabel id="parish-Label">Parroquia</InputLabel>
                  <Select
                    labelId="parish-Label"
                    id="parish"
                    name="parish"
                    value={formData.parish}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    style={{ textAlign: 'left' }}
                  >
                    <MenuItem value="G01">Guayaquil</MenuItem>
                    <MenuItem value="G02">Duran</MenuItem>
                    <MenuItem value="G03">Daule</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={10}>
                <TextField
                  label="Direccion"
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <IconButton onClick={SearchLocation} style={{ marginTop: '20px' }}>
                  <AddLocationAltRoundedIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Manzana"
                  type="number"
                  name="block"
                  value={formData.block}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Villa"
                  type="text"
                  name="house"
                  value={formData.house}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Piso"
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Suma Asegurada"
                  type="text"
                  name="sumInsure"
                  value={formData.sumInsure}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl style={{ width: '100%' }}>
                  <InputLabel id="buildingAge-Label">Antiguedad</InputLabel>
                  <Select
                    labelId="buildingAge-Label"
                    id="buildingAge"
                    name="buildingAge"
                    value={formData.buildingAge}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    style={{ textAlign: 'left' }}
                  >
                    <MenuItem value="G01">Guayaquil</MenuItem>
                    <MenuItem value="G02">Duran</MenuItem>
                    <MenuItem value="G03">Daule</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl style={{ width: '100%' }}>
                  <InputLabel id="constructionType-Label">T.Constuccion</InputLabel>
                  <Select
                    labelId="constructionType-Label"
                    id="constructionType"
                    name="constructionType"
                    value={formData.constructionType}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    style={{ textAlign: 'left' }}
                  >
                    <MenuItem value="G01">Guayaquil</MenuItem>
                    <MenuItem value="G02">Duran</MenuItem>
                    <MenuItem value="G03">Daule</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl style={{ width: '100%' }}>
                  <InputLabel id="riskType-Label">T. Riesgo</InputLabel>
                  <Select
                    labelId="riskType-Label"
                    id="riskType"
                    name="riskType"
                    value={formData.riskType}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    style={{ textAlign: 'left' }}
                  >
                    <MenuItem value="G01">Guayaquil</MenuItem>
                    <MenuItem value="G02">Duran</MenuItem>
                    <MenuItem value="G03">Daule</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl style={{ width: '100%' }}>
                  <InputLabel id="destiny-Label">Destinado a</InputLabel>
                  <Select
                    labelId="destiny-Label"
                    id="destiny"
                    name="destiny"
                    value={formData.destiny}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    style={{ textAlign: 'left' }}
                  >
                    <MenuItem value="G01">Guayaquil</MenuItem>
                    <MenuItem value="G02">Duran</MenuItem>
                    <MenuItem value="G03">Daule</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Latitud"
                  type="text"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  disabled
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Longitud"
                  type="text"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  disabled
                  required
                />
              </Grid>
            </Grid>

            {/* Botón de envío */}
            <Button type="submit" variant="contained" style={{ backgroundColor: '#00a99e', color: '#fff', marginTop: '20px' }} fullWidth>
              Agregar
            </Button>
          </form >
        </Paper>
        <div style={{ width: '80%' }}>
          <MapContainer 
          ref={mapContainerRef}
          lat={formData.lat} 
          lng={formData.lng} 
          direccion={formData.direccion} 
          onMarkerDragEnd={onMarkerDragEnd}
          onUpdateLocation={updateLocation} 
          ></MapContainer>
        </div>
      </div>
    </Container>
  );
};

export default AddObjectInsurance;