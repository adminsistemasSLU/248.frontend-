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
import '../../styles/form.scss';
import '../../styles/button.scss';
import '../../styles/objectInsuranceTable.scss';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

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
      style={{ padding:0, minHeight: '80vh', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}
    >


      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xl" className='dialog-height'
        PaperProps={{
          style: {
            backgroundColor: '#ffffff',
            boxShadow: 'none',
          
            overflow: 'hidden',
            zIndex: '2000'
          },
        }}>
        <DialogContent style={{ overflow: 'scroll', padding: '0px', paddingBottom: '20px' }} className='dialog-height-content'>
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


          <Paper elevation={3} className='modalContent' style={{overflowY:'scroll', height: '50vh' , paddingBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <form component="form" onSubmit={handleSubmit} className='form'>
              <table container spacing={2} >
                <tbody>
                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }} >
                    <td   className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="province-Label"> <b>Provincia:</b>  </label>
                    </td>
                    <td className='tdTableData'>
                      <select

                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        variant="standard"

                        required
                        style={{ textAlign: 'left', width: '80%', border: '1px solid #A1A8AE' }}
                      >
                        <option value="01">Guayas</option>
                        <option value="02">Quito</option>
                        <option value="03">Azogues</option>
                      </select>
                    </td>

                  </tr>

                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="city-Label"> <b>Ciudad:</b>  </label>
                    </td>
                    <td className='tdTableData'>
                      <select

                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        variant="standard"

                        required
                        style={{ textAlign: 'left', border: '1px solid #A1A8AE',width:'80%' }}
                      >
                        <option value="G01">Guayaquil</option>
                        <option value="G02">Duran</option>
                        <option value="G03">Daule</option>
                      </select>
                    </td>
                  </tr>


                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="parish-Label"> <b>Parroquia:</b>  </label>
                    </td>
                    <td className='tdTableData'>
                      <select

                        id="parish"
                        name="parish"
                        value={formData.parish}
                        onChange={handleChange}
                        variant="standard"

                        required
                        style={{ textAlign: 'left',width:'80%' }}
                      >
                        <option value="G01">Balao</option>
                        <option value="G02">Duran</option>
                        <option value="G03">Daule</option>
                      </select>
                    </td>
                  </tr>
                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="direction-Label"> <b>Direccion:</b>  </label>
                    </td>
                    <td  className='tdTableData'  style={{display:'flex', alignItems:'center'}} >
                      <input
                        label="direction-Label"
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        variant="standard"
                        required
                        style={{ width: '80%' }}
                      />
                       <div onClick={SearchLocation} >
                        <AddLocationAltRoundedIcon />
                      </div>
                    </td>
                    
                  </tr>

                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="number-Label"> <b>Manzana:</b>  </label>
                    </td>
                    <td className='tdTableData'>
                      <input
                        label="number"
                        type="text"
                        name="block"
                        value={formData.block}
                        onChange={handleChange}
                        variant="standard"
                        required
                        style={{ width: '80%' }}
                      />
                    </td>
                  </tr>

                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="house-Label"> <b>Villa:</b>  </label>
                    </td>
                    <td className='tdTableData'>
                      <input

                        id="house"
                        name="house"
                        value={formData.house}
                        onChange={handleChange}
                        variant="standard"

                        required
                        style={{ width: '80%' }}
                      />

                    </td>
                  </tr>

                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="floor-Label"> <b>Pisos:</b>  </label>
                    </td>
                    <td className='tdTableData'>
                      <input

                        id="floor"
                        name="floor"
                        value={formData.floor}
                        onChange={handleChange}
                        variant="standard"
                        required
                        style={{ width: '80%' }}
                      />

                    </td>
                  </tr>

                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="buildingAge-Label"> <b>Antiguedad:</b>  </label>
                    </td>
                    <td className='tdTableData'>
                      <select

                        id="buildingAge"
                        name="buildingAge"
                        value={formData.buildingAge}
                        onChange={handleChange}
                        variant="standard"

                        required
                        style={{ textAlign: 'left', width: '80%', border: '1px solid #A1A8AE' }}
                      >
                        <option value="G01">1</option>
                        <option value="G02">2</option>
                        <option value="G03">3</option>
                      </select>
                    </td>
                  </tr>



                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="constructionType-Label"> <b>T.Constuccion:</b>  </label>
                    </td>
                    <td className='tdTableData'>
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
                    <td className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="riskType-Label"> <b>T. Riesgo:</b>  </label>
                    </td>
                    <td className='tdTableData'>
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
                    <td className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="destiny-Label"> <b>Destinado a:</b>  </label>
                    </td>
                    <td className='tdTableData'>
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
                    <td className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="sumInsure-Label"> <b>Suma Aseg:</b>  </label>
                    </td>
                    <td  className='tdTableData' style={{display:'flex', alignItems:'center'}}>
                      <input
                        label="sumInsure-Label"
                        type="text"
                        name="umInsure"
                        value={formData.sumInsure}

                        variant="standard"
                        required
                        style={{ width: '80%' }}
                      />
                       <div onClick={handleOpenModal}  >
                        <CalendarMonthIcon />
                      </div>
                    </td>
                   
                  </tr>

                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="latituded-Label"> <b>Latitud:</b>  </label>
                    </td>
                    <td className='tdTableData'>
                      <input

                        id="lat"
                        name="lat"
                        value={formData.lat}
                        onChange={handleChange}
                        variant="standard"

                        required
                        disabled
                        style={{ textAlign: 'left', width: '80%', border: '1px solid #A1A8AE' }}
                      >

                      </input>
                    </td>
                  </tr>

                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="longitude-Label"> <b>Longitud:</b>  </label>
                    </td>
                    <td className='tdTableData'>
                      <input

                        id="lng"
                        name="lng"
                        value={formData.lng}
                        onChange={handleChange}
                        variant="standard"

                        required
                        disabled
                        style={{ textAlign: 'left', width: '80%', border: '1px solid #A1A8AE' }}
                      >

                      </input>
                    </td>
                  </tr>

                  <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <td className='tdTableTitle'>
                      <label style={{ fontSize: '13px' }} id="longitude-Label"> <b>Inspeccion:</b>  </label>
                    </td>
                    <td className='tdTableData'>
                      <input

                        id="inspection"
                        name="inspection"
                        checked={formData.inspection}
                        onChange={toggleInspection}
                        variant="standard"
                        type='checkbox'
                        style={{ textAlign: 'left', width: '80%', border: '1px solid #A1A8AE' }}
                      >
                      </input>
                    </td>
                  </tr>


                  {formData.inspection && ( // Verificar si inspection es true
                    <Tooltip title="Dirección de inspeccion" placement="left">
                      <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <td className='tdTableTitle' >

                          <label style={{ fontSize: '13px' }} id="longitude-Label">
                            <b>Dirección:</b>
                          </label>

                        </td>
                        <td className='tdTableData' >
                          <input
                            id="direcctionInspection"
                            name="direcctionInspection"
                            value={formData.direcctionInspection}
                            onChange={handleChange}
                            variant="standard"
                            style={{ textAlign: 'left', width: '80%', border: '1px solid #A1A8AE' }}
                          >
                          </input>
                        </td>
                      </tr>
                    </Tooltip>
                  )}

                  {formData.inspection && ( // Verificar si inspection es true
                    <Tooltip title="Telefono de inspeccion" placement="left">
                      <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <td className='tdTableTitle'>

                          <label style={{ fontSize: '13px' }} id="longitude-Label">
                            <b>Teléfono:</b>
                          </label>

                        </td>
                        <td className='tdTableData'>
                          <input
                            id="phoneInspection"
                            name="phoneInspection"
                            value={formData.phoneInspection}
                            onChange={handleChange}
                            variant="standard"
                            style={{ textAlign: 'left', width: '80%', border: '1px solid #A1A8AE' }}
                          >
                          </input>
                        </td>
                      </tr>
                    </Tooltip>
                  )}

                  {formData.inspection && ( // Verificar si inspection es true
                    <Tooltip title="Agente de inspeccion" placement="left">
                      <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <td className='tdTableTitle'>

                          <label style={{ fontSize: '13px' }} id="longitude-Label">
                            <b>Contacto:</b>
                          </label>

                        </td>
                        <td className='tdTableData'>
                          <input
                            id="agentInspection"
                            name="agentInspection"
                            value={formData.agentInspection}
                            onChange={handleChange}
                            variant="standard"
                            style={{ textAlign: 'left', width: '80%', border: '1px solid #A1A8AE' }}
                          >
                          </input>
                        </td>
                      </tr>
                    </Tooltip>
                  )}

                  {formData.inspection && ( // Verificar si inspection es true
                    <Tooltip title="Fecha Tentativa" placement="left">
                      <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <td style={{ width: '30%', textAlign: 'left', display: 'flex', flexDirection: 'row', justifyContent:'start',alignItems:'center'    }}>

                          <label style={{ fontSize: '13px' }} id="longitude-Label">
                            <b>Fecha:</b>
                          </label>

                        </td>
                        <td className='tdTableData'>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}  sx={{overflow:'hidden'}}>
                              <DatePicker className='hourPicker'  style={{overflow:'hidden'}}   slotProps={{ textField: {variant: 'standard', size:'small'} }} />
                            </DemoContainer>
                          </LocalizationProvider>
                        </td>
                      </tr>
                    </Tooltip>
                  )}

                  {formData.inspection && ( // Verificar si inspection es true
                    <Tooltip title="Hora tentativa" placement="left">
                      <tr style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <td style={{ width: '30%', textAlign: 'left', display: 'flex', flexDirection: 'row', justifyContent:'start',alignItems:'center'   }}>

                          <label style={{ fontSize: '13px' }} id="longitude-Label">
                            <b>Hora:</b>
                          </label>
                        </td>
                        <td  className='tdTableData' >
                          <LocalizationProvider dateAdapter={AdapterDayjs} style={{overflow:'hidden'}}>
                            <DemoContainer components={['TimePicker']} sx={{overflow:'hidden'}}>
                              <TimePicker
                              className='hourPicker' 
                               slotProps={{ textField: {variant: 'standard', size:'small'} }}
                               
                              />

                            </DemoContainer>
                          </LocalizationProvider>
                        </td>
                      </tr>
                    </Tooltip>
                  )}
                </tbody>
              </table>
              <div style={{display:'flex',justifyContent:'center'}}>
              <Button type="submit" className='btnStepper' variant="contained"  style={{top:'0', backgroundColor:'rgb(0, 169, 158)'}} fullWidth>
                Agregar
              </Button>
              </div>
            
            </form >
          </Paper>
          <div className='modalContent' style={{ display: 'flex', alignItems: 'center', justifyContent:'center' }}>
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