import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Button,
  TextField,
  Modal,
} from "@mui/material";
import {
  LS_FORMAPAGO,
  DATOS_PERSONALES_STORAGE_KEY,
  LS_COTIZACION,
} from "../../utils/constantes";
import ValidationUtils from "../../utils/ValiationsUtils";
import QuoterService from "../../services/QuoterService/QuoterService";
import Swal from "sweetalert2";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// const paypalIcon =
//   process.env.PUBLIC_URL + "/assets/images/carousel/icon/paypal.png";
// const stripeIcon =
//   process.env.PUBLIC_URL + "/assets/images/carousel/icon/stripe.webp";
// const mercadopagoIcon =
//   process.env.PUBLIC_URL + "/assets/images/carousel/icon/mercadopago.png";
// const safetypayIcon =
//   process.env.PUBLIC_URL + "/assets/images/carousel/icon/safety.png";

const PaymentMethods = () => {
  // const [selectedMethod, setSelectedMethod] = useState(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [cliente, setCLiente] = useState("");
  const [fPago, setFpago] = useState("");
  const [Error, setError] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  useEffect(() => {
    let pagoID = localStorage.getItem(LS_FORMAPAGO);
    let datosPersonales = JSON.parse(
      localStorage.getItem(DATOS_PERSONALES_STORAGE_KEY)
    );
    console.log(datosPersonales);
    if (datosPersonales) {
      setEmail(datosPersonales.correo);
      setCLiente(datosPersonales.nombre + " " + datosPersonales.apellido);
    }
    setFpago(pagoID);

    console.log(fPago);
  }, []);
  // Función para manejar el envío del correo

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const handleSubmit = async () => {
    let idCotizacion = JSON.parse(localStorage.getItem(LS_COTIZACION));
    if (!ValidationUtils.validateEmail(email)) {
      setError("Se debe ingresar un correo electrónico válido.");
      return;
    }
    if (cliente === "") {
      setError("El campo nombre no puede estar vacio.");
      return;
    }
    handleOpenBackdrop();
    try {
      const response = await QuoterService.fetchEnvioCorreoFormCuenta(
        idCotizacion,
        cliente,
        email
      );
      if (response.codigo === 200) {
        handleCloseBackdrop();
        Swal.fire({
          title: "Exito!",
          text: response.data,
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          handleClose();
          
        });
      }else{
        Swal.fire({
          title: "Exito!",
          text: response.message,
          icon: "error",
          confirmButtonText: "Ok",
        }).then(() => {
          handleClose();
          
        });
      }
      handleClose();
    } catch (error) {
      handleCloseBackdrop();
      console.error("Error al enviar correo:", error);
    }
    handleCloseBackdrop();
    handleClose();
  };

  return (
    <Container maxWidth="sm" style={{ marginBottom: "20px" }}>
      {fPago !== "1" && (
        <div>
          <Button variant="contained" onClick={handleOpen}>
            Enviar Link de Pago
          </Button>
          <Backdrop
            sx={{ color: "#fff", zIndex: 3000 }}
            open={openBackdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Enviar Link de Pago
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Ingresa el Nombre del Cliente:
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Nombre Cliente"
                value={cliente}
                onChange={(e) => setCLiente(e.target.value)}
              />

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
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{ mt: 2 }}
              >
                Enviar
              </Button>
            </Box>
          </Modal>
        </div>
      )}
    </Container>
  );
};

export default PaymentMethods;
