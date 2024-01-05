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
            name: "Pymes",
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores nobis ullam facilis ',
            imageUrl: process.env.PUBLIC_URL + '/assets/images/carousel/pymes.png',
            url:'/quoter/stepper',
            enable:true,
        },{
            name: "Vehículos",
            description: "Probably the most random thing you have ever seen!",
            imageUrl: process.env.PUBLIC_URL + '/assets/images/carousel/automovil.jpg',
            url:'/FireInsurance/form',
            enable:false,
        },
        {
            name: "Vida",
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores nobis ullam facilis ',
            imageUrl: process.env.PUBLIC_URL + '/assets/images/carousel/vida2.jpg',
            url:'/FireInsurance/form',
            enable:false,
        }
        ,
       
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
        <Card sx={{ maxWidth: 200 }} >
            <a href={props.item.url} className={props.item.enable ? 'carousel-content' : ''}  onClick={(e) => { e.preventDefault(); handleImageClick(); }}>
                <CardMedia
                className={props.item.enable ? '' : 'inactivo'}
                component="img"
                height="194px"
                image={props.item.imageUrl}
                alt={props.item.name}
                width="150px"
                />
            </a>
            <CardContent>
                <Typography variant="h6" color="#018997" >
                    {props.item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{textAlign:'justify'}}>
                        {props.item.description }
                    </Typography>
            </CardContent>
            <CardActions disableSpacing>
                
            </CardActions>
        </Card>

    )
}

export default HomeCarrousel;