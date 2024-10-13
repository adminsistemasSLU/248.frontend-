import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Card, CardContent, Link, Grid, Typography } from '@mui/material';
import '../../styles/carrousel.scss';
import Loading from '../../utils/loading';
import { LS_PRODUCTO, DATOS_VEHICULO_COTI_STORAGE_KEY } from '../../utils/constantes';

const ProductListCardsCar = ({ onNext, ref }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [planesVehiculos, setPlanesVehiculos] = useState([]);

    const handleComparativo = () => {
        const link = document.createElement('a');
        link.href = `${process.env.PUBLIC_URL}/assets/resource/comparativo.pdf`;
        link.download = 'comparativo.pdf';
        link.click();
    };

    useEffect(() => {
        const storedPlanes = localStorage.getItem(DATOS_VEHICULO_COTI_STORAGE_KEY);
        
        console.log("-----------------------");
        console.log(storedPlanes);
        console.log("-----------------------");

        if (storedPlanes) {
            try {
                const parsedPlanes = JSON.parse(storedPlanes);
                setPlanesVehiculos(parsedPlanes);
            } catch (error) {
                console.error("Error al convertir planesVehiculos de JSON:", error);
            }
        }
    }, []);

    // useImperativeHandle(ref, () => ({
    //     handleSubmitExternally: handleSubmit,
    // }));

    // const handleSubmit = async (e) => {
    //     return false;
    // };

    const formatCurrency = (value) => {
        return Number(value).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const handleCardClick = (index, producto) => {
        localStorage.setItem(LS_PRODUCTO, (producto));
        onNext(index);
    };

    return (
        <>
            <Card elevation={4} sx={{ width: '100%', m: 2, mx: 'auto', paddingTop: '30px', paddingBottom: '30px' }}>
                <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '30px', fontWeight: 'bold' }}>
                    PLANES
                </Typography>
                <div>
                    {isLoading ? <Loading /> : (<div></div>)}
                </div>
                
                <Grid container spacing={1} justifyContent="center" alignItems="center">
                    {planesVehiculos && planesVehiculos.length > 0 ? (
                        planesVehiculos.map((plan, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index} className='carousel-container'>
                                <Card style={{ maxWidth: 240, cursor: 'pointer'}}>
                                    <img
                                        src={process.env.PUBLIC_URL + `/assets/images/${plan.imagen.toLowerCase()}`}
                                        style={{ height: '220px', padding: '10px'}}
                                        alt={`Plan ${plan.plan}`}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" component="div" style={{ paddingBottom: 8 }}>
                                            {plan.plan.toUpperCase()}
                                        </Typography>
                                        <Typography variant="h6" component="div" style={{fontWeight: 'bold' }}>
                                            ${formatCurrency(plan.prima)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
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
