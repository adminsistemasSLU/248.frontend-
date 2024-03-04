import React, { useState } from 'react';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
  Box,
  Container,
  Paper,
  Button,
  TextField,
  Modal,
  Grid,
} from '@mui/material';


const paypalIcon = process.env.PUBLIC_URL + '/assets/images/carousel/icon/paypal.png';
const stripeIcon = process.env.PUBLIC_URL + '/assets/images/carousel/icon/stripe.webp';
const mercadopagoIcon = process.env.PUBLIC_URL + '/assets/images/carousel/icon/mercadopago.png';
const safetypayIcon = process.env.PUBLIC_URL + '/assets/images/carousel/icon/safety.png';



const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Función para manejar el envío del correo
  const handleSubmit = () => {
    // Aquí deberías implementar la lógica para enviar el correo
    console.log(email);
    handleClose();
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedMethod(method);
    // Aquí puedes agregar lógica adicional según la pasarela de pago seleccionada.
  };

  // Define un objeto que asocie cada método de pago con su icono
  const paymentIcons = {
    paypal: paypalIcon,
    stripe: stripeIcon,
    mercadopago: mercadopagoIcon,
    safetypay: safetypayIcon,
  };

  return (
    <Container maxWidth="sm" style={{ marginBottom: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Selecciona un método de pago:
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="paymentMethod"
            name="paymentMethod"
            value={selectedMethod}
            onChange={(e) => handlePaymentMethodChange(e.target.value)}
          >
            {Object.keys(paymentIcons).map((method) => (
              <Grid container key={method} alignItems="center">
                <Grid item xs>
                  <FormControlLabel
                    value={method}
                    control={<Radio color="primary" />}
                    //label={`${method.charAt(0).toUpperCase() + method.slice(1)}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat, quam id volutpat venenatis, quam quam commodo odio.`}
                  />
                </Grid>
                <Grid item>
                  <img
                    src={paymentIcons[method]}
                    alt={`${method} icon`}
                    style={{ width: '32px', marginRight: '16px' }}
                  />
                </Grid>
                
              </Grid>
            ))}
          </RadioGroup>
        </FormControl>

        {/* Aquí puedes agregar lógica adicional según la pasarela de pago seleccionada */}
        {selectedMethod && (
          <Box mt={2}>
            {/* Renderizar contenido específico para la pasarela de pago seleccionada */}
            {selectedMethod === 'paypal' && (
             <div>
             <Button variant="contained" onClick={handleOpen}>
               Enviar Link de Pago
             </Button>
             <Modal
               open={open}
               onClose={handleClose}
               aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-description"
             >
               <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                 <Typography id="modal-modal-title" variant="h6" component="h2">
                   Enviar Link de Pago PayPal
                 </Typography>
                 <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                   Ingresa el correo electrónico para enviar el link de pago:
                 </Typography>
                 <TextField
                   fullWidth
                   margin="normal"
                   label="Correo Electrónico"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
                 <Button fullWidth variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                   Enviar
                 </Button>
               </Box>
             </Modal>
           </div>
            )}
            {selectedMethod === 'stripe' && (
              <div>
                {/* Aquí puedes mostrar información adicional para Stripe */}
              </div>
            )}
            {selectedMethod === 'mercadopago' && (
              <div>
                {/* Aquí puedes mostrar información adicional para MercadoPago */}
              </div>
            )}
            {selectedMethod === 'safetypay' && (
              <div>
                {/* Aquí puedes mostrar información adicional para SafetyPay */}
              </div>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PaymentMethods;
