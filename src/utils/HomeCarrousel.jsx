import React, { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel'
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/carrousel.scss';
import BaldosasService from '../services/BaldosasService/BaldosasService';

function HomeCarrousel(props) {
    const [items, setItems] = useState([]);
    var items3 = [
        {
            name: "PYMES",
            url: '/quoter/pymes/stepper',
        }, {
            name: "VEHICULO",
            url: '/quoter/car/stepper',
          
        },
        {
            name: "VIDA",
            url: '/quoter/life/stepper',
        }
        ,
    ];
    useEffect(() => {
        const printBaldosas = async () => {
            try {
                const baldosas = await BaldosasService.fetchBaldosas();
                if (baldosas && baldosas.data.BaldosaServisios) {
                    const newItems = baldosas.data.BaldosaServisios.map(baldosa => {
                        const matchedItem = items3.find(item3 => item3.name === baldosa.titulo);
                        return {
                            name: baldosa.titulo,
                            description: baldosa.descripcion,
                            imageUrl: process.env.REACT_APP_API_URL  + '/Imagen/' + baldosa.nombre_imagen,
                            url: matchedItem ? matchedItem.url : '/default-url',
                            enable: baldosa.titulo ==='PYMES'?true:false, 
                        };
                    });
                    setItems(newItems);
                    console.log(newItems);
                }
            } catch (error) {
                console.error('Error al obtener baldosas:', error);
            }
        };
        printBaldosas();
    }, []);

    const groupItems = (items, groupSize) => {
        const grouped = [];
        for (let i = 0; i < items.length; i += groupSize) {
            const group = items.slice(i, i + groupSize);
            while (group.length < groupSize) {
                group.push(null);
            }
            grouped.push(group);
        }
        return grouped;
    };

    return (
        <Carousel
            fullHeightHover={false}    
            navButtonsProps={{          
                style: {
                    backgroundColor: 'cornflowerblue',
                    borderRadius: 0
                }
            }}
            navButtonsWrapperProps={{   
                style: {
                    bottom: '0',
                    top: 'unset'
                }
            }}
            indicatorIconButtonProps={{
                style: {
                    padding: '10px',  
                }
            }}

            indicatorContainerProps={{
                style: {
                    marginTop: '50px',
                    textAlign: 'right', 
                    display: 'flex',
                    justifyContent: 'center'
                }

            }}

        >
            {groupItems(items, 3).map((group, index) => (
                <div key={index} className="carousel-container">
                    {group.map((item, i) => (
                        <Item key={i} item={item} />
                    ))}
                </div>
            ))}
        </Carousel>
    )
}


function Item(props) {
    const navigate = useNavigate();
    if (!props.item) {
        // Manejar elementos nulos si el grupo no tiene suficientes elementos
        return <div style={{ width: '0%' }} />;
    }
    const handleImageClick = () => {
        // Redirige a la URL deseada
        navigate(props.item.url); // Reemplaza 'url' con la propiedad correcta de tu objeto
    };
    return (
        <Card sx={{ maxWidth: 200 }} >
            <Link to={props.item.url} className={props.item.enable ? 'carousel-content' : ''} onClick={(e) => { e.preventDefault(); handleImageClick(); }}>
                <CardMedia
                    className={props.item.enable ? '' : 'inactivo'}
                    component="img"
                    height="194px"
                    image={props.item.imageUrl}
                    alt={props.item.name}
                    width="150px"
                />
            </Link>
            <CardContent>
                <Typography variant="h6" color="#018997" >
                    {props.item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{ textAlign: 'justify' }}>
                    {props.item.description}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>

            </CardActions>
        </Card>

    )
}

export default HomeCarrousel;