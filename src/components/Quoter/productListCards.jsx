import React from 'react';
import { Card, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import '../../styles/carrousel.scss';

const ProductListCards = ({ onNext }) => {
  // Definición de datos para las cartas
  const data = [
    {
      imagen: process.env.PUBLIC_URL + '/assets/images/carousel/ProductCards/industria-pesada.jpg',
      titulo: 'Hogar',
      descripcion: 'Descripción breve de la carta 1.',
    },
    {
      imagen:  process.env.PUBLIC_URL + '/assets/images/carousel/ProductCards/oficinas.jpg',
      titulo: 'Oficina',
      descripcion: 'Descripción breve de la carta 2.',
    },
    {
      imagen:  process.env.PUBLIC_URL + '/assets/images/carousel/ProductCards/edificios.jpg',
      titulo: 'Edificios',
      descripcion: 'Descripción breve de la carta 3.',
    },
  ];

  const handleCardClick = (index) => {
    // Llama a la función onNext cuando se hace clic en una carta y pasa el índice como argumento.
    onNext(index);
  };

  return (
    <Container style={{ marginBottom: 80 }} >
      <Grid container spacing={2}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} className='carousel-container' onClick={() => handleCardClick(index)}>
            <Card style={{ maxWidth: 240, cursor:'pointer' }} >
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
        ))}
      </Grid>
    </Container>
  );
};

export default ProductListCards;
