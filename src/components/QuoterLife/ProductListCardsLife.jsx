import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import '../../styles/carrousel.scss';
import BaldosasService from '../../services/BaldosasService/BaldosasService';
import Loading from '../../utils/loading';
import { API_SUBBALDOSAS, LS_PRODUCTO, LS_RAMO } from '../../utils/constantes';



const ProductListCardsLife = ({ onNext }) => {
  const [data, setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const subbaldosas = JSON.parse(localStorage.getItem(API_SUBBALDOSAS));
  const ramo = JSON.parse(localStorage.getItem(LS_RAMO));
  console.log(subbaldosas);

  useEffect(() => {
    if (subbaldosas) {
      setdata(subbaldosas);
      return;
    }

    const printBaldosas = async () => {
      setIsLoading(true);
      try {
        const baldosas = await BaldosasService.fetchSubBaldosas(ramo, '');
        setIsLoading(false);
        console.log(baldosas);
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

  const handleCardClick = async (index, producto) => {
    console.log('Producto elegido: ' + producto);
    localStorage.setItem(LS_PRODUCTO, (producto));
    onNext(index);
  };

  return (

    <Container style={{ marginBottom: 80 }} >
      <div>
        {isLoading ? <Loading /> : (<div></div>)}
      </div>
      {/* <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '0px', fontWeight: 'bold' }}>
          PRODUCTOS
      </Typography> */}

      {/* <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Seleccione el Producto a cotizar 
            </Typography> */}

      <Grid container spacing={2}>



        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} style={{paddingTop:"20px"}} className='carousel-container' onClick={() => handleCardClick(index, item.producto)}>
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
                  
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductListCardsLife;
