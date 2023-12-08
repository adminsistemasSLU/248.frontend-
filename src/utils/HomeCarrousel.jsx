import React from 'react';
import Carousel from 'react-material-ui-carousel'
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import '../styles/carrousel.scss'; 

function HomeCarrousel(props) {
    var items = [
        {
            name: "Automovil ligero",
            description: "Probably the most random thing you have ever seen!",
            imageUrl: process.env.PUBLIC_URL + '/assets/images/carousel/automovil.jpg',
            url:'/FireInsurance/form'
        },
        {
            name: "Vida",
            description: "Hello World!",
            imageUrl: process.env.PUBLIC_URL + '/assets/images/carousel/vida2.jpg',
            url:'/FireInsurance/form'
        }
        ,
        {
            name: "Incendio",
            description: "Hello World!",
            imageUrl: process.env.PUBLIC_URL + '/assets/images/carousel/incendio.jpg',
            url:'/quoter/stepper'
        }
    ];
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
            fullHeightHover={false}     // We want the nav buttons wrapper to only be as big as the button element is
            navButtonsProps={{          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
                style: {
                    backgroundColor: 'cornflowerblue',
                    borderRadius: 0
                }
            }}
            navButtonsWrapperProps={{   // Move the buttons to the bottom. Unsetting top here to override default style.
                style: {
                    bottom: '0',
                    top: 'unset'
                }
            }}
            indicatorIconButtonProps={{
                style: {
                    padding: '10px',    // 1
                    // 3
                }
            }}

            indicatorContainerProps={{
                style: {
                    marginTop: '50px', // 5
                    textAlign: 'right', // 4
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
    if (!props.item) {
        // Manejar elementos nulos si el grupo no tiene suficientes elementos
        return <div style={{ width: '0%' }} />;
    }
    const handleImageClick = () => {
        // Redirige a la URL deseada
        window.location.href = props.item.url; // Reemplaza 'url' con la propiedad correcta de tu objeto
      };
    return (
        <Card sx={{ maxWidth: 200 }}>
            <a href={props.item.url} onClick={(e) => { e.preventDefault(); handleImageClick(); }}>
                <CardMedia
                component="img"
                height="194px"
                image={props.item.imageUrl}
                alt={props.item.name}
                width="150px"
                style={{ cursor: 'pointer' }} // Cambia el cursor para indicar que es interactivo
                />
            </a>
            <CardContent>
                <Typography variant="body2" color="#018997" >
                    {props.item.name}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                
            </CardActions>
        </Card>

    )
}

export default HomeCarrousel;