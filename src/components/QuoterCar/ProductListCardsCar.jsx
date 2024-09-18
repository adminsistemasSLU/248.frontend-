import React, { useState, useEffect, useImperativeHandle, } from 'react';
import { Card, CardContent, Link, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Button, Typography } from '@mui/material';
import '../../styles/carrousel.scss';
import BaldosasService from '../../services/BaldosasService/BaldosasService';
import Loading from '../../utils/loading';
import { API_SUBBALDOSAS, LS_PRODUCTO } from '../../utils/constantes';

const ProductListCardsCar = ({ onNext, ref, totalAsegurado }) => {
    const [data, setdata] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const subbaldosas = JSON.parse(localStorage.getItem(API_SUBBALDOSAS));
    const [planesVehiculos, setPlanesVehiculos] = useState();

    const handleComparativo = () => {
        const link = document.createElement('a');
        link.href = `${process.env.PUBLIC_URL}/assets/resource/comparativo.pdf`;
        link.download = 'comparativo.pdf';
        link.click();
    };

    useEffect(() => {
        // if (subbaldosas) {
        //     setdata(subbaldosas);
        //     return;
        // }

        const callPlans = async () => {
            await cargarPlanes()
        };

        callPlans();
        // const printBaldosas = async () => {
        //     setIsLoading(true);
        //     try {
        //         const baldosas = await BaldosasService.fetchSubBaldosas(1, '');
        //         setIsLoading(false);
        //         if (baldosas && baldosas.data.BaldosaSubServisios) {
        //             const newItems = baldosas.data.BaldosaSubServisios.map(baldosa => {
        //                 return {
        //                     titulo: baldosa.titulo,
        //                     descripcion: baldosa.descripcion,
        //                     imagen: process.env.REACT_APP_API_URL + '/api/Imagen/' + baldosa.nombre_imagen,
        //                     producto: baldosa.producto,
        //                 };
        //             });
        //             setdata(newItems);
        //             localStorage.setItem(API_SUBBALDOSAS, JSON.stringify(newItems));
        //         }
        //     } catch (error) {
        //         console.error('Error al obtener baldosas:', error);
        //     }
        // };
        // printBaldosas();
    }, []);

    useImperativeHandle(ref, () => ({
        handleSubmitExternally: handleSubmit,
    }));

    const handleSubmit = async (e) => {
        return true
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const cargarPlanes = async () => {
        try {
            const planes = await BaldosasService.fetchSubBaldosasMock();
            console.log(planes);

            if (planes && planes.data) {
                setPlanesVehiculos(planes.data);
            }
        } catch (error) {
            console.error("Error al obtener estadoCivil:", error);
        }
    };

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
                    {planesVehiculos && planesVehiculos.length > 0 ? (
                        planesVehiculos.map((plan, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index} className='carousel-container'>
                                <Card style={{ maxWidth: 240, cursor: 'pointer' }}>
                                    <img
                                        src={process.env.PUBLIC_URL + `/assets/images/${plan.imagen.toLowerCase()}`}
                                        style={{ width: '250px' }}
                                        alt={`Plan ${plan.plan}`}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" component="div" style={{ paddingBottom: 8 }}>
                                            {plan.plan.toUpperCase()}
                                        </Typography>
                                        <Typography variant="h6" component="div" style={{ paddingBottom: 8 }}>
                                            ${formatCurrency(plan.tasa * parseFloat(totalAsegurado) / 100)}
                                        </Typography>

                                        <Typography variant="body2">
                                            <Link href="#" onClick={() => handleComparativo()} style={{ textDecoration: 'underline', color: 'black' }}>
                                                Ver condiciones
                                            </Link>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))) : (
                        <Typography variant="body2" style={{ textAlign: 'center', padding: '20px' }}>
                            No hay planes disponibles.
                        </Typography>
                    )}
                </Grid>
            </Card>
        </>
    );
};

export default ProductListCardsCar;
