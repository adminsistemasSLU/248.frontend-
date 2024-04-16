import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from "react-router-dom";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import PersonIcon from "@mui/icons-material/Person";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import PaidIcon from "@mui/icons-material/Paid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import DialogTitle from "@mui/material/DialogTitle";
import "../styles/button.scss";
import "../styles/form.scss";
import PersonalForm from "./Quoter/personalForm";
import ProtectObjectsTable from "./Quoter/protectObjectsTable";
import PaidForm from "./Quoter/paidForm";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ProductListCards from "./Quoter/productListCards";
import PaymentMethods from "./Quoter/paymentMethods";
import { TextField, Grid, Alert } from "@mui/material";
import IncendioService from "../services/IncencioService/IncendioService";
import {
  DATOS_PERSONALES_STORAGE_KEY,
  LS_COTIZACION,
  LS_FORMAPAGO,
  LS_TOTAL_PRIMA_RIESGO,
  USER_STORAGE_KEY,
} from "../utils/constantes";
import EmailService from "../services/EmailService/EmailService";
import Swal from "sweetalert2";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 136deg, #3cf1d9 0%, #00a99e 50%, rgb(74 101 172) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 136deg, #3cf1d9 0%, #00a99e 50%, rgb(74 101 172) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 40,
  height: 40,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, #3cf1d9 0%, #00a99e 50%, rgb(74 101 172) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, #3cf1d9 0%, #00a99e 50%, rgb(74 101 172) 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <PersonIcon />,
    2: <ProductionQuantityLimitsIcon />,
    3: <LocalFireDepartmentIcon />,
    4: <PaidIcon />,
    5: <AddShoppingCartIcon />,
  };

  return (
    <ColorlibStepIconRoot
      style={{ aspectRatio: "1/1" }}
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

export default function Steppers() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed] = React.useState({});
  const [formData, setFormData] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const navigate = useNavigate();

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const modoEditar = () => {
    let idCotizacion = localStorage.getItem(LS_COTIZACION);
    if (idCotizacion) {
      setActiveStep(2);
    }
  };

  useEffect(() => {
    modoEditar();
  }, []);

  const personalFormRef = useRef();
  const paidFormRef = useRef();
 

  const handleNext = async (formData) => {
    // Actualiza el estado formData con los datos recibidos
    setFormData(formData);
    let continuar = true;
    //Accion para Datos Personales
    if (steps[activeStep].label === "Datos Personales") {
      continuar = personalFormRef.current.handleSubmitExternally();
    }

    if (steps[activeStep].label === "Pasarela de Pago") {
      Swal.fire({
        title: "Exito!",
        text: `El proceso ha terminado`,
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        navigate("/quoter/Pymes/MyQuotes");
      });
      return;
    }

    //Accion para Riesgo
    if (steps[activeStep].label === "Pago") {
      continuar = false;
      continuar = await paidFormRef.current.handleSubmitExternally();
      if (localStorage.getItem(LS_FORMAPAGO) === "1") {
        Swal.fire({
          title: "Exito!",
          text: `El proceso ha terminado`,
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          navigate("/quoter/Pymes/MyQuotes");
        });
      }

      
    }

    let datosPersonales = JSON.parse(
      localStorage.getItem(DATOS_PERSONALES_STORAGE_KEY)
    );

    if (datosPersonales) {
      setEmail(datosPersonales.correo);
    }
    //Accion para Riesgo
    if (steps[activeStep].label === "Riesgo") {
      let totalPrima = localStorage.getItem(LS_TOTAL_PRIMA_RIESGO);
      if(totalPrima ==='0'){
        return;
      }
    }

    if (continuar) {
      const newActiveStep =
        isLastStep() && !allStepsCompleted()
          ? steps.findIndex((step, i) => !(i in completed))
          : activeStep + 1;
      setActiveStep(newActiveStep);
    }
  };

  const steps = [
    {
      label: "Datos Personales",
      formComponent: <PersonalForm ref={personalFormRef} />,
    },
    {
      label: "Producto",
      formComponent: <ProductListCards onNext={handleNext} />,
    },
    {
      label: "Riesgo",
      formComponent: <ProtectObjectsTable onNext={handleNext} />,
    },
    {
      label: "Pago",
      formComponent: <PaidForm ref={paidFormRef} onNext={handleNext} />,
    },
    {
      label: "Pasarela de Pago",
      formComponent: <PaymentMethods onNext={handleNext} />,
    },
  ];

  const descargarPdf = async () => {
    try {
      handleOpenBackdrop();
      const idCotizacion = localStorage.getItem(LS_COTIZACION);
      await IncendioService.descargarPdf(idCotizacion);
      handleCloseBackdrop();
    } catch (error) {
      handleCloseBackdrop();
      console.error("Error al obtener Tipo Credito: ", error);
    }
  };

  const handleDownloadPdf = () => {
    descargarPdf();
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChangeEmail = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseSnack = () => {
    setOpenSnack(false);
  };

  const enviarCorreo = async () => {
    try {
      handleOpenBackdrop();
      let user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));

      let idCotizacion = localStorage.getItem(LS_COTIZACION);

      let emailValido = validateEmail(email);
      console.log(emailValido);
      if (!emailValido) {
        handleCloseBackdrop();
        Swal.fire({
          title: "Error!",
          text: `Correo no valido`,
          icon: "error",
          confirmButtonText: "Ok",
        });
        setEmailError("El Correo no es valido");

        return;
      }

      const response = await EmailService.fetchEnvioCorreoCotizacion(
        idCotizacion,
        user.des_usuario,
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
          setOpen(false);
        });
      } else {
        handleCloseBackdrop();
        setOpen(false);
      }
    } catch (error) {
      // Manejar errores de la petición
      console.error("Error al realizar la solicitud:", error);
      handleCloseBackdrop();
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendQuoter = () => {
    enviarCorreo();
  };

  return (
    <Stack className={"stack-content"} spacing={4}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <Snackbar
          open={openSnack}
          autoHideDuration={5000}
          onClose={handleCloseSnack}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="warning">{emailError}</Alert>
        </Snackbar>

        <DialogTitle id="alert-dialog-title">
          {"Enviar cotización por correo"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid item xs={12}>
              <TextField
                label="Correo electrónico"
                type="text"
                name="identification"
                value={email}
                onChange={handleChangeEmail}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownloadPdf}>Visualizar Cotizacion</Button>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSendQuoter} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Card elevation={4} sx={{ width: '100%', m: 2, mx: 'auto' }}>
        <CardContent sx={{ bgcolor: 'background.default' }}>
          <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
          >
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          pt: 2,
          justifyContent: "center",
          marginBottom: "10%",
        }}
      >
        <Box style={{ width: "100%" }}>
          {steps[activeStep].label === "Producto" && (
            <div style={{paddingLeft: '9%', textAlign: 'left'}}>
              <span style={{ color: "#02545C", }}><b>PRODUCTOS</b></span>
              <br />
            <div style={{paddingTop: '5px', paddingBottom: '30px'}}><span>Seleccione el producto a cotizar</span></div>
            </div>
          )}
          {React.cloneElement(steps[activeStep].formComponent, {
            formData,
            onNext: handleNext,
          })}
          <div className="btnDisplay">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              className="button-styled-back"
              style={{ top: "20%", backgroundColor: 'white', color: "#02545C", borderRadius: '20px' }}
            >
              Regresar
            </Button>

            {steps[activeStep].label === "Pago" && (
              <Button
                onClick={handleClickOpen}
                sx={{ mr: 1 }}
                className="btnPaid"
              >
                Enviar Cotización
              </Button>
            )}

            {steps[activeStep].label !== "Producto" && (
              <Button
                onClick={handleNext}
                sx={{ mr: 1 }}
                className="button-styled-primary"
                style={{ top: "20%", backgroundColor: '#02545C', color: "white", borderRadius: '20px' }}
              >
                Siguiente
              </Button>
            )}
          </div>
        </Box>
      </div>
    </Stack>
  );
}
