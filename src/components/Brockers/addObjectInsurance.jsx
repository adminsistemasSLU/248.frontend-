import React, { useState, useRef } from 'react';
import { Button, Container, Paper } from '@mui/material';
import MapContainer from './mapContainer';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DetailObjectsTable from './detailObjectsTable';
import '../../styles/moddalForm.scss';


const AddObjectInsurance = ({ closeModal }) => {
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

  const [openModal, setOpenModal] = React.useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Manejador para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };


  const cerrarModal = () => {
    closeModal('true');
  };


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


      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xl"
        PaperProps={{
          style: {
            backgroundColor: '#ffffff',
            boxShadow: 'none',
            width: '70%',
            overflow: 'hidden',
            zIndex:'2000'
          },
        }}>
        <DialogContent style={{ overflow: 'hidden',padding:'0px',paddingBottom:'20px' }}>
          {/* Componente del formulario */}
          <DetailObjectsTable closeModalDetail={handleCloseModal} style={{ width: '80%' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cerrar</Button>
          {/* Puedes agregar más botones según tus necesidades */}
        </DialogActions>
      </Dialog>


      <div className='modalForm '>
        <Paper elevation={3} style={{ width: '50%', paddingBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%',paddingTop:'5px',paddingLeft:'15px', paddingRight:'15px', backgroundColor: '#00a99e', color: 'white', position: 'relative', top: '0px', display: 'flex', justifyContent: 'space-between' }}>
            Objeto del seguro
            <div style={{ cursor: 'pointer' }} >
              <CloseIcon onClick={cerrarModal} />
            </div>
          </div>
          <form component="form" onSubmit={handleSubmit} className='form'>
            <table container spacing={2} >

              <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }} >
                <td style={{ width: '30%', textAlign: 'right' }}>
                  <label textAlign='right' style={{ fontSize: '13px' }} id="province-Label"> <b>Provincia:</b>  </label>
                </td>
                <td style={{ width: '70%' }}>
                  <select
                    labelId="province-Label"
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    variant="standard"

                    required
                    style={{ textAlign: 'left', width: '45%', border: '1px solid #A1A8AE' }}
                  >
                    <option value="01">Guayas</option>
                    <option value="02">Quito</option>
                    <option value="03">Azogues</option>
                  </select>
                </td>

              </tr>

              <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <td style={{ width: '30%', textAlign: 'right' }}>
                  <label textAlign='right' style={{ fontSize: '13px' }} id="city-Label"> <b>Ciudad:</b>  </label>
                </td>
                <td style={{ width: '70%' }}>
                  <select
                    labelId="city-Label"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    style={{ textAlign: 'left', border: '1px solid #A1A8AE' }}
                  >
                    <option value="G01">Guayaquil</option>
                    <option value="G02">Duran</option>
                    <option value="G03">Daule</option>
                  </select>
                </td>
              </tr>


              <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <td style={{ width: '30%', textAlign: 'right' }}>
                  <label textAlign='right' style={{ fontSize: '13px' }} id="parish-Label"> <b>Parroquia:</b>  </label>
                </td>
                <td style={{ width: '70%' }}>
                  <select
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
                    <option value="G01">Balao</option>
                    <option value="G02">Duran</option>
                    <option value="G03">Daule</option>
                  </select>
                </td>
              </tr>
              <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <td style={{ width: '30%', textAlign: 'right' }}>
                  <label textAlign='right' style={{ fontSize: '13px' }} id="direction-Label"> <b>Direccion:</b>  </label>
                </td>
                <td style={{ width: '50%' }}>
                  <input
                    label="direction-Label"
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    variant="standard"
                    required
                    style={{ width: '100%' }}
                  />
                </td>
                <td style={{ width: '20%' }}>
                  <div onClick={SearchLocation} >
                    <AddLocationAltRoundedIcon />
                  </div>
                </td>
              </tr>

              <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <td style={{ width: '30%', textAlign: 'right' }}>
                  <label textAlign='right' style={{ fontSize: '13px' }} id="number-Label"> <b>Manzana:</b>  </label>
                </td>
                <td style={{ width: '70%' }}>
                  <input
                    label="number"
                    type="text"
                    name="block"
                    value={formData.block}
                    onChange={handleChange}
                    variant="standard"
                    required
                    style={{ width: '30%' }}
                  />
                </td>
              </tr>

              <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <td style={{ width: '30%', textAlign: 'right' }}>
                  <label textAlign='right' style={{ fontSize: '13px' }} id="house-Label"> <b>Villa:</b>  </label>
                </td>
                <td style={{ width: '70%' }}>
                  <input
                    labelId="house-Label"
                    id="house"
                    name="house"
                    value={formData.house}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    style={{ width: '30%' }}
                  />

                </td>
              </tr>

              <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <td style={{ width: '30%', textAlign: 'right' }}>
                  <label textAlign='right' style={{ fontSize: '13px' }} id="floor-Label"> <b>Pisos:</b>  </label>
                </td>
                <td style={{ width: '70%' }}>
                  <input
                    labelId="floor-Label"
                    id="floor"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    style={{ width: '30%' }}
                  />

                </td>
              </tr>

              <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <td style={{ width: '30%', textAlign: 'right' }}>
                  <label textAlign='right' style={{ fontSize: '13px' }} id="buildingAge-Label"> <b>Antiguedad:</b>  </label>
                </td>
                <td style={{ width: '70%' }}>
                  <select
                    labelId="buildingAge-Label"
                    id="buildingAge"
                    name="buildingAge"
                    value={formData.buildingAge}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    style={{ textAlign: 'left', width: '45%', border: '1px solid #A1A8AE' }}
                  >
                    <option value="G01">1</option>
                    <option value="G02">2</option>
                    <option value="G03">3</option>
                  </select>
                </td>
              </tr>



              <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <td style={{ width: '30%', textAlign: 'right' }}>
                  <label textAlign='right' style={{ fontSize: '13px' }} id="constructionType-Label"> <b>T.Constuccion:</b>  </label>
                </td>
                <td style={{ width: '70%' }}>
                  <select
                    labelId="constructionType-Label"
                    id="constructionType"
                    name="constructionType"
                    value={formData.constructionType}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    style={{ textAlign: 'left', width: '80%', border: '1px solid #A1A8AE' }}
                  >
                    <option value="G01">CEMENTO</option>
                    <option value="G02">2</option>
                    <option value="G03">3</option>
                  </select>
                </td>
              </tr>

              <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <td style={{ width: '30%', textAlign: 'right' }}>
                  <label textAlign='right' style={{ fontSize: '13px' }} id="riskType-Label"> <b>T. Riesgo:</b>  </label>
                </td>
                <td style={{ width: '70%' }}>
                  <select
                    labelId="riskType-Label"
                    id="riskType"
                    name="riskType"
                    value={formData.riskType}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    style={{ textAlign: 'left', width: '80%', border: '1px solid #A1A8AE' }}
                  >
                    <option value="G01">VIVIENDA</option>
                    <option value="G02">2</option>
                    <option value="G03">3</option>
                  </select>
                </td>
              </tr>


              <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <td style={{ width: '30%', textAlign: 'right' }}>
                  <label textAlign='right' style={{ fontSize: '13px' }} id="destiny-Label"> <b>Destinado a:</b>  </label>
                </td>
                <td style={{ width: '70%' }}>
                  <select
                    labelId="destiny-Label"
                    id="destiny"
                    name="destiny"
                    value={formData.destiny}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    style={{ textAlign: 'left', width: '80%', border: '1px solid #A1A8AE' }}
                  >
                    <option value="G01">VIVIENDA</option>
                    <option value="G02">2</option>
                    <option value="G03">3</option>
                  </select>
                </td>
              </tr>


              <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <td style={{ width: '30%', textAlign: 'right' }}>
                  <label textAlign='right' style={{ fontSize: '13px' }} id="sumInsure-Label"> <b>Suma Aseg:</b>  </label>
                </td>
                <td style={{ width: '50%' }}>
                  <input
                    label="sumInsure-Label"
                    type="text"
                    name="umInsure"
                    value={formData.sumInsure}

                    variant="standard"
                    required
                    style={{ width: '100%' }}
                  />
                </td>
                <td style={{ width: '20%' }}>
                  <div onClick={handleOpenModal}  >
                    <CalendarMonthIcon />
                  </div>
                </td>
              </tr>

              <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <td style={{ width: '30%', textAlign: 'right' }}>
                  <label textAlign='right' style={{ fontSize: '13px' }} id="latituded-Label"> <b>Latitud:</b>  </label>
                </td>
                <td style={{ width: '70%' }}>
                  <input
                    labelId="latituded-Label"
                    id="lat"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    disabled
                    style={{ textAlign: 'left', width: '45%', border: '1px solid #A1A8AE' }}
                  >

                  </input>
                </td>
              </tr>

              <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <td style={{ width: '30%', textAlign: 'right' }}>
                  <label textAlign='right' style={{ fontSize: '13px' }} id="longitude-Label"> <b>Longitud:</b>  </label>
                </td>
                <td style={{ width: '70%' }}>
                  <input
                    labelId="longitude-Label"
                    id="lng"
                    name="lng"
                    value={formData.lng}
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    required
                    disabled
                    style={{ textAlign: 'left', width: '45%', border: '1px solid #A1A8AE' }}
                  >

                  </input>
                </td>
              </tr>


            </table>

            {/* Botón de envío */}
            <Button type="submit" variant="contained" style={{ backgroundColor: '#00a99e', color: '#fff', marginTop: '20px' }} fullWidth>
              Agregar
            </Button>
          </form >
        </Paper>
        <div style={{ width: '50%', display: 'flex', alignItems: 'center' }}>
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