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
import PersonalFormLife from ".//../QuoterLife/personalFormLife";
import InvoiceFormLife from ".//../QuoterLife/invoiceFormLife";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ProductListCardsLife from "./ProductListCardsLife";
import SumaryFormLife from ".//../QuoterLife/sumaryFormLife";
import { Alert } from "@mui/material";
import {
  DATOS_PERSONALES_STORAGE_KEY,
  LS_COTIZACION,
  LS_PRODUCTO,
  LS_DATOSPAGO,
  LS_PREGUNTASVIDA,
  LS_PREGRESPONDIDAS,
  LS_DOCUMENTOSVIDA
} from "../../utils/constantes";
import EmailService from "../../services/EmailService/EmailService";
import Swal from "sweetalert2";
import RiskFormLife from "./riskFormLife";
import LifeService from "../../services/LifeService/LifeService";

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

export default function SteppersLife() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed] = React.useState({});
  const [formData, setFormData] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [isVisibleFormulario, setIsVisibleFormulario] = React.useState(true);
  const [isVisibleCertificado, setIsVisibleCertificado] = React.useState(true);
  const navigate = useNavigate();

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const modoEditar = () => {
    let idCotizacion = sessionStorage.getItem(LS_COTIZACION);
    if (idCotizacion) {
      setActiveStep(1);
    }
  };

  useEffect(() => {
    modoEditar();
  }, []);

  const personalFormRef = useRef();
  const paidFormRef = useRef();
  const questionFormRef = useRef();
  const sumaryFormRef = useRef();

  const handleNext = async (formData) => {
    // Actualiza el estado formData con los datos recibidos
    setFormData(formData);
    let continuar = true;
    //Accion para Datos Personales
    if (steps[activeStep].label === "Datos Personales") {
      continuar = await personalFormRef.current.handleSubmitExternally();
    }


    if (steps[activeStep].label === "Resumen") {
      continuar = await sumaryFormRef.current.handleSubmitExternally();

    }


    let datosPersonales = JSON.parse(
      localStorage.getItem(DATOS_PERSONALES_STORAGE_KEY)
    );

    if (datosPersonales) {
      setEmail(datosPersonales.correo);
    }

    if (steps[activeStep].label === "Facturacion") {
      continuar = await paidFormRef.current.handleSubmitExternally();

    }

    if (steps[activeStep].label === "Riesgo") {
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
      label: "Producto",
      formComponent: <ProductListCardsLife onNext={handleNext} />,
    },
    {
      label: "Datos Personales",
      formComponent: <PersonalFormLife ref={personalFormRef} />,
    },
    {
      label: "Riesgo",
      formComponent: <RiskFormLife ref={questionFormRef} />,
    },
    {
      label: "Facturacion",
      formComponent: <InvoiceFormLife ref={paidFormRef} onNext={handleNext} />,
    },
    {
      label: "Resumen",
      formComponent: <SumaryFormLife ref={sumaryFormRef} onNext={handleNext} />,
    },
  ];

  const descargarPdf = async () => {
    try {
      handleOpenBackdrop();
      const idCotizacion = sessionStorage.getItem(LS_COTIZACION);
      const producto = sessionStorage.getItem(LS_PRODUCTO);
      await LifeService.fetchPrevizualizarPDFFormulario(producto, idCotizacion);
      handleCloseBackdrop();
    } catch (error) {
      handleCloseBackdrop();
      console.error("Error al obtener Tipo Credito: ", error);
    }
  };

  const handleDownloadPdf = () => {
    descargarPdf();
  };

  const handleDownloadPdfCertificado = () => {
    descargarPdfCertificado('Certificado de Vida');
  };

  const handleDownloadPdfFormulario = () => {
    descargarPdfCertificado('Solicitud de Vida');
  };

  const descargarPdfCertificado = async (titulo) => {
    try {
      handleOpenBackdrop();
      const idCotizacion = sessionStorage.getItem(LS_COTIZACION);
      const producto = sessionStorage.getItem(LS_PRODUCTO);
      await LifeService.fetchPrevizualizarPDFCertificado(producto, idCotizacion, titulo);
      handleCloseBackdrop();
    } catch (error) {
      handleCloseBackdrop();
      console.error("Error al obtener Tipo Credito: ", error);
    }
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
    let DocumentosVida = sessionStorage.getItem(LS_DOCUMENTOSVIDA);
    //SE HABILITA CUANDO NO TIENE REQUISITOS DE ASEGURABILIDAD O SOLO LA DECLARACION DE SALUD 
    setIsVisibleCertificado(false);
    //VERIFICO SI NO EXISTE
    if ( !DocumentosVida ||(Array.isArray(JSON.parse(DocumentosVida)))
    ) {
      setIsVisibleCertificado(true);
    } //VERIFICO SI ES DIFERENTE A NINGUNO
    if( (JSON.parse(DocumentosVida).length === 0 ||
          Object.values(JSON.parse(DocumentosVida)).some(doc => doc.nombre.toLowerCase() === "ninguno"))){
      setIsVisibleCertificado(true);
    }


    setIsVisibleFormulario(true);
    let Preguntas = sessionStorage.getItem(LS_PREGUNTASVIDA);
    if (!Preguntas || (Array.isArray(JSON.parse(Preguntas)) && JSON.parse(Preguntas).length === 0)) {
      setIsVisibleFormulario(false);
  }
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

      let user = JSON.parse(sessionStorage.getItem(LS_DATOSPAGO));
      let producto = JSON.parse(sessionStorage.getItem(LS_PRODUCTO));
      let idCotizacion = sessionStorage.getItem(LS_COTIZACION);
      let name = user.name + ' ' + user.lastname;
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

      const response = await EmailService.fetchEnvioCorreoVida(
        idCotizacion,
        name,
        email,
        producto
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
    <Stack className={"stack-content"} spacing={1}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: 9999 }}
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
          {"Descargar Reportes"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{ display: "flex", gap: '30px' }} >
            {isVisibleFormulario && (
              <Button
                onClick={handleDownloadPdf}
                style={{ top: "20%", fontSize: '10px', backgroundColor: '#004ba8cc', color: "white", borderRadius: "5px" }}
              >
                Descargar Formulario
              </Button>
            )}
            <Button
              disabled={!isVisibleCertificado}
              onClick={handleDownloadPdfCertificado}
              style={{ top: "20%", fontSize: '10px', backgroundColor: isVisibleCertificado ? "#0099a8" : "#d3d3d3",
                color: isVisibleCertificado ? "white" : "black",
                borderRadius: "5px",
                cursor: isVisibleCertificado ? "pointer" : "not-allowed" }}>
              Descargar Certificado
            </Button>
            <Button
              onClick={handleDownloadPdfFormulario}
              style={{ top: "20%", fontSize: '10px', backgroundColor: '#02545c', color: "white", borderRadius: "5px" }}>
              Descargar Solicitud
            </Button>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ display: "flex", gap: '30px' }}>

          <Button
            onClick={handleClose}
            style={{ top: "20%", fontSize: '10px', backgroundColor: '#0099a8', color: "white", borderRadius: "5px" }}>
            Cerrar
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
            {steps[activeStep].label !== "Productos" && (
              <Button
                onClick={handleBack}
                sx={{ mr: 1 }}
                className="button-styled-back"
                style={{ top: "10%", backgroundColor: 'white', color: "#02545C" }}
              >
                Regresar
              </Button>
            )}
            {steps[activeStep].label === "Resumen" && (
              <Button
                onClick={handleClickOpen}
                sx={{ mr: 1 }}
                className="button-styled-primary"
                style={{ top: "20%", backgroundColor: '#0099A8', color: "white" }}
              >
                Descargar Documentos
              </Button>
            )}

            {steps[activeStep].label !== "Productos" && steps[activeStep].label !== "Resumen" && (
              <Button
                onClick={handleNext}
                sx={{ mr: 1 }}
                className="button-styled-primary"
                style={{ top: "20%", backgroundColor: '#02545C', color: "white" }}
              >
                Siguiente
              </Button>
            )}
            {steps[activeStep].label === "Resumen" && (
              <Button
                onClick={handleNext}
                sx={{ mr: 1 }}
                className="button-styled-primary"
                style={{ top: "20%", backgroundColor: '#02545C', color: "white" }}
              >
                Grabar Cotización
              </Button>
            )}
          </div>
        </Box>
      </div>
    </Stack>
  );
}
