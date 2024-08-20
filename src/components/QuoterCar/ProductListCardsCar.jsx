import React, { useState, useEffect } from 'react';
import { Card, CardContent, Link, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Button, Typography } from '@mui/material';
import '../../styles/carrousel.scss';
import BaldosasService from '../../services/BaldosasService/BaldosasService';
import Loading from '../../utils/loading';
import { API_SUBBALDOSAS, LS_PRODUCTO } from '../../utils/constantes';

const ProductListCardsCar = ({ onNext }) => {
    const [data, setdata] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const subbaldosas = JSON.parse(localStorage.getItem(API_SUBBALDOSAS));
    const [openModal, setOpenModal] = useState(false);
    const [modalLink, setModalLink] = useState('');

    const handleOpenModal = (link) => {
        setModalLink(link);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        if (subbaldosas) {
            setdata(subbaldosas);
            return;
        }

        const printBaldosas = async () => {
            setIsLoading(true);
            try {
                const baldosas = await BaldosasService.fetchSubBaldosas(1, '');
                setIsLoading(false);
                if (baldosas && baldosas.data.BaldosaSubServisios) {
                    const newItems = baldosas.data.BaldosaSubServisios.map(baldosa => {
                        return {
                            titulo: baldosa.titulo,
                            descripcion: baldosa.descripcion,
                            imagen: process.env.REACT_APP_API_URL + '/api/Imagen/' + baldosa.nombre_imagen,
                            producto: baldosa.producto,
                        };
                    });
                    setdata(newItems);
                    localStorage.setItem(API_SUBBALDOSAS, JSON.stringify(newItems));
                }
            } catch (error) {
                console.error('Error al obtener baldosas:', error);
            }
        };
        printBaldosas();
    }, []);

    const handleCardClick = (index, producto) => {
        console.log('Producto elegido: ' + producto);
        localStorage.setItem(LS_PRODUCTO, (producto));
        onNext(index);
    };

    return (
        <>
            <Card elevation={4} sx={{ width: '100%', m: 2, mx: 'auto', paddingTop: '30px', paddingBottom: '30px', }}>
                <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '30px', fontWeight: 'bold' }}>
                    PLANES
                </Typography>
                <div>
                    {isLoading ? <Loading /> : (<div></div>)}
                </div>

                <Grid container spacing={1}>
                    {/* {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} className='carousel-container' onClick={() => handleCardClick(index,item.producto)}>
            <Card style={{ maxWidth: 240, cursor: 'pointer' }} >
              <CardMedia
                component="img"
                height="200"
                image={item.imagen}
                alt={item.titulo}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {item.titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.descripcion}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))} */}
                    <Grid item xs={12} sm={6} md={4} className='carousel-container'>
                        <Card style={{ maxWidth: 240, cursor: 'pointer' }} >
                            {<img src={process.env.PUBLIC_URL + '/assets/images/plan_oro.jpg'} style={{ width: '250px' }} alt="Background" />}
                            <CardContent>
                                <Typography variant="h6" component="div" style={{ paddingBottom: 8 }}>
                                    PLAN ORO
                                </Typography>
                                <Typography variant="h6" component="div" style={{ paddingBottom: 8 }}>
                                    $1.230.00
                                </Typography>
                                <Typography variant="body2">
                                    <Link href="#" onClick={() => handleOpenModal('https://www.example.com/plan-oro')} style={{ textDecoration: 'underline', color: 'black' }}>
                                        Ver condiciones
                                    </Link>
                                </Typography>

                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} className='carousel-container'>
                        <Card style={{ maxWidth: 240, cursor: 'pointer' }} >
                            {<img src={process.env.PUBLIC_URL + '/assets/images/plan_plata.png'} style={{ width: '250px' }} alt="Background" />}
                            <CardContent>
                                <Typography variant="h6" component="div" style={{ paddingBottom: 8 }}>
                                    PLAN PLATA
                                </Typography>
                                <Typography variant="h6" component="div" style={{ paddingBottom: 8 }}>
                                    $800.00
                                </Typography>
                                <Typography variant="body2">
                                    <Link href="#" onClick={() => handleOpenModal('https://www.example.com/plan-oro')} style={{ textDecoration: 'underline', color: 'black' }}>
                                        Ver condiciones
                                    </Link>
                                </Typography>

                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} className='carousel-container'>
                        <Card style={{ maxWidth: 240, cursor: 'pointer' }} >
                            {<img src={process.env.PUBLIC_URL + '/assets/images/plan_bronce.jpg'} style={{ width: '250px' }} alt="Background" />}
                            <CardContent>
                                <Typography variant="h6" component="div" style={{ paddingBottom: 8 }}>
                                    PLAN BRONCE
                                </Typography>
                                <Typography variant="h6" component="div" style={{ paddingBottom: 8 }}>
                                    $599.99
                                </Typography>
                                <Typography variant="body2">
                                    <Link href="#" onClick={() => handleOpenModal('https://www.example.com/plan-oro')} style={{ textDecoration: 'underline', color: 'black' }}>
                                        Ver condiciones
                                    </Link>
                                </Typography>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid >
                <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                    <DialogTitle>Condiciones del Plan</DialogTitle>
                    <DialogContent dividers>
                        <iframe
                            src={modalLink}
                            style={{ width: '100%', height: '500px', border: 'none' }}
                            title="Condiciones del Plan"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </>
    );
};

export default ProductListCardsCar;
