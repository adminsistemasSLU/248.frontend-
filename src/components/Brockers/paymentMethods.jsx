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
  Grid,
} from '@mui/material';


const paypalIcon = process.env.PUBLIC_URL + '/assets/images/carousel/icon/paypal.png';
const stripeIcon = process.env.PUBLIC_URL + '/assets/images/carousel/icon/stripe.webp';
const mercadopagoIcon = process.env.PUBLIC_URL + '/assets/images/carousel/icon/mercadopago.png';
const safetypayIcon = process.env.PUBLIC_URL + '/assets/images/carousel/icon/safety.png';



const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

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
                {/* Aquí puedes mostrar información adicional para PayPal */}
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
