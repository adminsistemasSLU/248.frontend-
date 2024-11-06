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
import Loading from './loading';
import { API_BALDOSAS,LS_COTIZACION,LS_PRODUCTO,DATOS_PAGO_STORAGE_KEY,
    LS_RAMO,API_SUBBALDOSAS,  LS_DATAVIDASEND,LS_DATOSPAGO,LS_PREGUNTASVIDA
    ,LS_DOCUMENTOSVIDA,LS_IDCOTIZACIONVIDA,LS_VIDAPOLIZA,
    DATOS_PERSONALES_VEHICULO_STORAGE_KEY, DATOS_VEHICULO_STORAGE_KEY, LS_COTIZACION_VEHICULO, DATOS_VEHICULO_COTI_STORAGE_KEY,
    PERMISSIONS_STORAGE_KEY,
    LS_PREGRESPONDIDAS,
    LS_FPAGO,
    LS_TPRESTAMO} from './constantes';


function HomeCarrousel(props) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const baldosas = JSON.parse(localStorage.getItem(API_BALDOSAS));
    var items3 = [
        {
            name: "PYMES",
            url: '/quoter/pymes',
        }, {
            name: "VEHICULO",
            url: '/quoter/car',
        },
        {
            name: "VIDA",
            url: '/quoter/life',
        }
        ,
    ];
    
    useEffect(() => {
        localStorage.removeItem(DATOS_PERSONALES_VEHICULO_STORAGE_KEY);
        localStorage.removeItem(DATOS_VEHICULO_STORAGE_KEY);
        localStorage.removeItem(DATOS_VEHICULO_COTI_STORAGE_KEY);
        localStorage.removeItem(LS_COTIZACION_VEHICULO);
        sessionStorage.removeItem(LS_PREGRESPONDIDAS);
        localStorage.removeItem(LS_PRODUCTO);
        sessionStorage.removeItem(LS_DATAVIDASEND);
        sessionStorage.removeItem(LS_DATOSPAGO);
        sessionStorage.removeItem(LS_PREGUNTASVIDA);
        sessionStorage.removeItem(LS_DOCUMENTOSVIDA);
        sessionStorage.removeItem(LS_IDCOTIZACIONVIDA);
        sessionStorage.removeItem(LS_VIDAPOLIZA);
        localStorage.removeItem(DATOS_PAGO_STORAGE_KEY);
        localStorage.removeItem(LS_COTIZACION);
        sessionStorage.removeItem(LS_FPAGO);
        sessionStorage.removeItem(LS_TPRESTAMO);
        sessionStorage.removeItem(LS_COTIZACION);
        sessionStorage.removeItem(LS_PRODUCTO);
        sessionStorage.removeItem(LS_RAMO);
        //const cotizacion = JSON.parse(localStorage.getItem(LS_COTIZACION));
        if(baldosas){
            setItems(baldosas);
            return;
        }        
        const storedBaldosasPermiso = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
        const baldosasPermiso = storedBaldosasPermiso ? JSON.parse(storedBaldosasPermiso) : { Baldosas: [] };

        const printBaldosas = async () => {
            try {
                setIsLoading(true);
                const baldosas = await BaldosasService.fetchBaldosas();
                const baldosasIdsPermitidos = baldosasPermiso.Baldosas;
                setIsLoading(false);
                if (baldosas && baldosas.data.BaldosaServisios) {
                    const newItems = baldosas.data.BaldosaServisios
                    .filter(baldosa => baldosasIdsPermitidos.includes(baldosa.id_BaldosaServisios.toString()))
                    .map(baldosa => {
                        const matchedItem = items3.find(item3 => item3.name === baldosa.titulo);
                        return {
                            name: baldosa.titulo,
                            description: baldosa.descripcion,
                            imageUrl: process.env.REACT_APP_API_URL + '/api/Imagen/' + baldosa.nombre_imagen,
                            url: matchedItem ? matchedItem.url : '/default-url',
                            enable: true ,
                            ramo:baldosa.ramo,
                            id_BaldosaServisios: baldosa.id_BaldosaServisios
                        };
                    });
                    setItems(newItems);
                    localStorage.setItem(API_BALDOSAS,JSON.stringify(newItems));
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
            grouped.push(group);
        }
        return grouped;
    };


    return (
        <div>
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
                    < div key={index} className="carousel-container">
                        {group.map((item, i) => (
                            <Item key={i} item={item} style={{ flex: 1, maxWidth: '100vw' }} />
                        ))}
                    </div>
                ))}
            </Carousel>

            <div>
                {isLoading ? <Loading /> : (<div></div>)}
            </div>
        </div>
    )
}


function Item(props) {
    const navigate = useNavigate();
    if (!props.item) {
        return null;
    }
    const handleImageClick = (ramo) => {
        localStorage.setItem(LS_RAMO,JSON.stringify(ramo));
        localStorage.removeItem(API_SUBBALDOSAS);
        localStorage.removeItem(LS_COTIZACION);
        navigate(props.item.url); 
    };
    return (
        <Card sx={{ maxWidth: 300, minWidht:250 }} >
            <Link to={props.item.url} className={props.item.enable ? 'carousel-content' : ''} onClick={(e) => { e.preventDefault(); handleImageClick(props.item.ramo); }}>
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
                <Typography variant="h6"  style={{ color: "#02545C" }}>
                    {props.item.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" style={{ textAlign: 'justify', fontWeight: '400', paddingBottom: '30px' }}>
                    {props.item.description}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>

            </CardActions>
        </Card>

    )
}

export default HomeCarrousel;