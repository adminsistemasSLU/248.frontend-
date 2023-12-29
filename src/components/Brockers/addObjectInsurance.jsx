import React, { useState, useRef } from 'react';
import { Button, Container, Paper } from '@mui/material';
import MapContainer from './mapContainer';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import BranchInsurance from './branchInsurance';
import Tooltip from '@mui/material/Tooltip';
import '../../styles/moddalForm.scss';
import '../../styles/dialogForm.scss';

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
    inspection: false,
    direcctionInspection: '',
    phoneInspection: '',
    agentInspection: '',

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
    closeModal(true);
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const toggleInspection = () => {
    setFormData({ ...formData, inspection: !formData.inspection });
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
      className='dialog-Form'
      style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}
    >


      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xl"
        PaperProps={{
          style: {
            backgroundColor: '#ffffff',
            boxShadow: 'none',
            width: '70%',
            overflow: 'hidden',
            zIndex: '2000'
          },
        }}>
        <DialogContent style={{ overflow: 'hidden', padding: '0px', paddingBottom: '20px' }}>
          {/* Componente del formulario */}
          <BranchInsurance closeModalDetail={handleCloseModal} style={{ width: '80%' }} />
        </DialogContent>
      </Dialog>

      <div className='modalForm' style={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          width: '100%', paddingTop: '5px', paddingLeft: '15px', paddingRight: '15px',
          backgroundColor: '#00a99e', color: 'white', position: 'relative', top: '0px',
          display: 'flex', justifyContent: 'space-between'
        }}>
          <div>
            Objeto del seguro
          </div>

          <div style={{ cursor: 'pointer' }} >
            <CloseIcon onClick={cerrarModal} />
          </div>
        </div>

        <div className='modalFormColumn'>


          <Paper elevation={3} className='modalContent' style={{ paddingBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <form component="form" onSubmit={handleSubmit} className='form'>
              <table container spacing={2} >
                <tbody>
                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }} >
                    <td style={{ width: '30%', textAlign: 'right' }}>
                      <label style={{ fontSize: '13px' }} id="province-Label"> <b>Provincia:</b>  </label>
                    </td>
                    <td style={{ width: '70%' }}>
                      <select

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
                      <label style={{ fontSize: '13px' }} id="city-Label"> <b>Ciudad:</b>  </label>
                    </td>
                    <td style={{ width: '70%' }}>
                      <select

                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        variant="standard"

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
                      <label style={{ fontSize: '13px' }} id="parish-Label"> <b>Parroquia:</b>  </label>
                    </td>
                    <td style={{ width: '70%' }}>
                      <select

                        id="parish"
                        name="parish"
                        value={formData.parish}
                        onChange={handleChange}
                        variant="standard"

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
                      <label style={{ fontSize: '13px' }} id="direction-Label"> <b>Direccion:</b>  </label>
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
                      <label style={{ fontSize: '13px' }} id="number-Label"> <b>Manzana:</b>  </label>
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
                      <label style={{ fontSize: '13px' }} id="house-Label"> <b>Villa:</b>  </label>
                    </td>
                    <td style={{ width: '70%' }}>
                      <input

                        id="house"
                        name="house"
                        value={formData.house}
                        onChange={handleChange}
                        variant="standard"

                        required
                        style={{ width: '30%' }}
                      />

                    </td>
                  </tr>

                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td style={{ width: '30%', textAlign: 'right' }}>
                      <label style={{ fontSize: '13px' }} id="floor-Label"> <b>Pisos:</b>  </label>
                    </td>
                    <td style={{ width: '70%' }}>
                      <input

                        id="floor"
                        name="floor"
                        value={formData.floor}
                        onChange={handleChange}
                        variant="standard"
                        required
                        style={{ width: '30%' }}
                      />

                    </td>
                  </tr>

                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td style={{ width: '30%', textAlign: 'right' }}>
                      <label style={{ fontSize: '13px' }} id="buildingAge-Label"> <b>Antiguedad:</b>  </label>
                    </td>
                    <td style={{ width: '70%' }}>
                      <select

                        id="buildingAge"
                        name="buildingAge"
                        value={formData.buildingAge}
                        onChange={handleChange}
                        variant="standard"

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
                      <label style={{ fontSize: '13px' }} id="constructionType-Label"> <b>T.Constuccion:</b>  </label>
                    </td>
                    <td style={{ width: '70%' }}>
                      <select

                        id="constructionType"
                        name="constructionType"
                        value={formData.constructionType}
                        onChange={handleChange}
                        variant="standard"

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
                      <label style={{ fontSize: '13px' }} id="riskType-Label"> <b>T. Riesgo:</b>  </label>
                    </td>
                    <td style={{ width: '70%' }}>
                      <select

                        id="riskType"
                        name="riskType"
                        value={formData.riskType}
                        onChange={handleChange}
                        variant="standard"

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
                      <label style={{ fontSize: '13px' }} id="destiny-Label"> <b>Destinado a:</b>  </label>
                    </td>
                    <td style={{ width: '70%' }}>
                      <select

                        id="destiny"
                        name="destiny"
                        value={formData.destiny}
                        onChange={handleChange}
                        variant="standard"

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
                      <label style={{ fontSize: '13px' }} id="sumInsure-Label"> <b>Suma Aseg:</b>  </label>
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
                      <label style={{ fontSize: '13px' }} id="latituded-Label"> <b>Latitud:</b>  </label>
                    </td>
                    <td style={{ width: '70%' }}>
                      <input

                        id="lat"
                        name="lat"
                        value={formData.lat}
                        onChange={handleChange}
                        variant="standard"

                        required
                        disabled
                        style={{ textAlign: 'left', width: '45%', border: '1px solid #A1A8AE' }}
                      >

                      </input>
                    </td>
                  </tr>

                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td style={{ width: '30%', textAlign: 'right' }}>
                      <label style={{ fontSize: '13px' }} id="longitude-Label"> <b>Longitud:</b>  </label>
                    </td>
                    <td style={{ width: '70%' }}>
                      <input

                        id="lng"
                        name="lng"
                        value={formData.lng}
                        onChange={handleChange}
                        variant="standard"

                        required
                        disabled
                        style={{ textAlign: 'left', width: '45%', border: '1px solid #A1A8AE' }}
                      >

                      </input>
                    </td>
                  </tr>

                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td style={{ width: '30%', textAlign: 'right' }}>
                      <label style={{ fontSize: '13px' }} id="longitude-Label"> <b>Inspeccion:</b>  </label>
                    </td>
                    <td style={{ width: '70%' }}>
                      <input

                        id="inspection"
                        name="inspection"
                        checked={formData.inspection}
                        onChange={toggleInspection}
                        variant="standard"
                        type='checkbox'
                        style={{ textAlign: 'left', width: '45%', border: '1px solid #A1A8AE' }}
                      >
                      </input>
                    </td>
                  </tr>


                  {formData.inspection && ( // Verificar si inspection es true
                    <Tooltip title="Direccion de inspeccion" placement="left">
                      <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <td style={{ width: '30%', textAlign: 'right' }}>

                          <label style={{ fontSize: '13px' }} id="longitude-Label">
                            <b>Direccion:</b>
                          </label>

                        </td>
                        <td style={{ width: '70%' }}>
                          <input
                            id="direcctionInspection"
                            name="direcctionInspection"
                            value={formData.direcctionInspection}
                            onChange={handleChange}
                            variant="standard"
                            style={{ textAlign: 'left', width: '70%', border: '1px solid #A1A8AE' }}
                          >
                          </input>
                        </td>
                      </tr>
                    </Tooltip>
                  )}

                  {formData.inspection && ( // Verificar si inspection es true
                    <Tooltip title="Telefono de inspeccion" placement="left">
                      <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <td style={{ width: '30%', textAlign: 'right' }}>

                          <label style={{ fontSize: '13px' }} id="longitude-Label">
                            <b>Telefono:</b>
                          </label>

                        </td>
                        <td style={{ width: '70%' }}>
                          <input
                            id="phoneInspection"
                            name="phoneInspection"
                            value={formData.phoneInspection}
                            onChange={handleChange}
                            variant="standard"
                            style={{ textAlign: 'left', width: '70%', border: '1px solid #A1A8AE' }}
                          >
                          </input>
                        </td>
                      </tr>
                    </Tooltip>
                  )}

                  {formData.inspection && ( // Verificar si inspection es true
                    <Tooltip title="Agente de inspeccion" placement="left">
                      <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <td style={{ width: '30%', textAlign: 'right' }}>

                          <label style={{ fontSize: '13px' }} id="longitude-Label">
                            <b>Agente:</b>
                          </label>

                        </td>
                        <td style={{ width: '70%' }}>
                          <input
                            id="agentInspection"
                            name="agentInspection"
                            value={formData.agentInspection}
                            onChange={handleChange}
                            variant="standard"
                            style={{ textAlign: 'left', width: '70%', border: '1px solid #A1A8AE' }}
                          >
                          </input>
                        </td>
                      </tr>
                    </Tooltip>
                  )}

                </tbody>
              </table>

              {/* Botón de envío */}
              <Button type="submit" variant="contained" style={{ backgroundColor: '#00a99e', color: '#fff', marginTop: '20px' }} fullWidth>
                Agregar
              </Button>
            </form >
          </Paper>
          <div className='modalContent' style={{ display: 'flex', alignItems: 'center' }}>
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
      </div>
    </Container>
  );


};




export default AddObjectInsurance;