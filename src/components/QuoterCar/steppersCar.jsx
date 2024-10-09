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
import "../../styles/button.scss";
import "../../styles/form.scss";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { TextField, Grid, Alert } from "@mui/material";
import IncendioService from "../../services/IncencioService/IncendioService";
import Swal from "sweetalert2";
import {
  LS_COTIZACION_VEHICULO,
  LS_COTIZACION,
  USER_STORAGE_KEY

} from "../../utils/constantes";
import PersonalFormCar from "./personalFormCar";
import InvoiceFormCar from "./invoiceFormCar";
import ResumenCar from "./resumenCar";
import DetailsCar from "./DetailsCar";
import ProductListCardsCar from "./ProductListCardsCar";
import EmailService from "../../services/EmailService/EmailService";

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
    1: <ProductionQuantityLimitsIcon />,
    2: <PersonIcon />,
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

export default function SteppersCar() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed] = React.useState({});
  const [formData, setFormData] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [totalAsegurado, setTotalAsegurado] = React.useState("");

  const navigate = useNavigate();

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const modoEditar = () => {
    let idCotizacion = localStorage.getItem(LS_COTIZACION_VEHICULO);
    if (idCotizacion) {
      setActiveStep(2);
    }
  };

  useEffect(() => {
    modoEditar();
  }, []);

  const personalFormRef = useRef();
  const paidFormRef = useRef();
  const questionFormRef = useRef();

  const handleComparativo = () => {
    const link = document.createElement('a');
    // link.href = `${process.env.PUBLIC_URL}/assets/resource/comparativo.pdf`+ localStorage.getItem(LS_COTIZACION_VEHICULO);
    console.log("Link de descarga: ");
    console.log(`${process.env.PUBLIC_URL}/api/cotizacion_pdf/` + localStorage.getItem(LS_COTIZACION_VEHICULO));
    link.href = `${process.env.PUBLIC_URL}/api/cotizacion_pdf/` + localStorage.getItem(LS_COTIZACION_VEHICULO);
    link.download = 'comparativo.pdf';
    link.click();
  };

  const handleNext = async (formData) => {
    setFormData(formData);

    let continuar = true;
    if (steps[activeStep].label === "Cliente") {
      continuar = await personalFormRef.current.handleSubmitExternally();
    }


    if (steps[activeStep].label === "Datos Vehículo") {
      continuar = await questionFormRef.current.handleSubmitExternally();

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
      label: "Cliente",
      formComponent: <PersonalFormCar ref={personalFormRef} />,
    },
    {
      label: "Datos Vehículo",
      formComponent: <DetailsCar ref={questionFormRef} />,
    },
    {
      label: "Planes",
      formComponent: <ProductListCardsCar ref={paidFormRef} onNext={handleNext} />,
    },
    {
      label: "Facturación",
      formComponent: <InvoiceFormCar ref={paidFormRef} onNext={handleNext} />,
    },
    {
      label: "Resumen",
      formComponent: <ResumenCar onNext={handleNext} />,
    },
  ];

  const parseCurrency = (value) => {
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  };

  const descargarPdf = async () => {
    try {
      handleOpenBackdrop();
      const idCotizacion = localStorage.getItem(LS_COTIZACION_VEHICULO);
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
    if (activeStep < 1) {
      navigate('/quoter/dashboard');
    }
    else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }

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

  const handleSendQuoter = () => {
    enviarCorreo();
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const enviarCorreo = async () => {
    try {
      handleOpenBackdrop();
      let idCotizacion = localStorage.getItem(LS_COTIZACION);
      let emailValido = validateEmail(email);

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

      const response = await EmailService.fetchEnvioCorreoCotizacionCar(
        idCotizacion,
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
      handleCloseBackdrop();
      Swal.fire({
        title: "Error!",
        text: "Se presentó un error, por favor vuelva a intentar",
        icon: "error",
        confirmButtonText: "Ok",
      }).then(() => {
        setOpen(false);
      });
    }
  };

  return (
    <Stack className={"stack-content"} spacing={1}>
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
          {"Enviar comparativo por correo"}
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
          <Button onClick={handleSendQuoter}>
            Enviar
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
            <div style={{ paddingLeft: '9%', paddingTop: '20px', textAlign: 'left' }}>
              <span style={{ color: "#02545C", }}><b>PRODUCTOS</b></span>
              <br />
              <div style={{ paddingTop: '5px', paddingBottom: '30px' }}><span>Seleccione el producto a cotizar</span></div>
            </div>
          )}
          {React.cloneElement(steps[activeStep].formComponent, {
            formData,
            onNext: handleNext,
          })}
          <div className="btnDisplay">
            <Button
              onClick={handleBack}
              sx={{ mr: 1 }}
              className="button-styled-back"
              style={{ top: "10%", backgroundColor: 'white', color: "#02545C" }}
            >
              Regresar
            </Button>


            {(steps[activeStep].label === "Cliente" || steps[activeStep].label === "Datos Vehículo") && (
              <Button
                onClick={handleNext}
                sx={{ mr: 1 }}
                className="button-styled-primary"
                style={{ top: "20%", backgroundColor: '#02545C', color: "white" }}
              >
                Siguiente
              </Button>
            )}

            {steps[activeStep].label === "Planes" && (
              <Button
                onClick={handleComparativo}
                sx={{ mr: 1 }}
                className="button-styled-primary"
                style={{ top: "20%", backgroundColor: '#02545C', color: "white" }}
              >
                Comparativo
              </Button>
            )}

            {steps[activeStep].label === "Planes" && (
              <Button
                onClick={handleClickOpen}
                sx={{ mr: 1 }}
                className="button-styled-primary"
                style={{ top: "20%", backgroundColor: '#0099A8', color: "white" }}
              >
                Enviar Cotización
              </Button>
            )}
          </div>
        </Box>
      </div>
    </Stack>

  );
}
