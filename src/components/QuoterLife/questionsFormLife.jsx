import React, {
    useState,
    forwardRef,
    useImperativeHandle,
    useEffect,
    useRef,
  } from "react";
  import Card from '@mui/material/Card';
  import Typography from '@mui/material/Typography';
  import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField, Grid, Alert,Snackbar } from "@mui/material";

const QuestionsFormLife = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false);


 useImperativeHandle(ref, () => ({
    handleSubmitExternally: handleSubmit,
  }));

  //Funcion para enviar a guardar el formulario controlado desde el stepper
  const handleSubmit = (e) => {

  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
  <Card elevation={4} sx={{ width: '100%', m: 2, mx: 'auto', paddingTop: '30px', paddingBottom: '30px', }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        // open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <form
        component="form"
        onSubmit={handleSubmit}
        style={{ width: '100%', paddingLeft: '30px', paddingRight: '10px', paddingBottom: '20px' }}
      >
        <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '0px', fontWeight: 'bold' }}>
          DATOS PERSONALES
        </Typography>
        <Grid container spacing={2} style={{ paddingRight: '5px' }}>
          <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {/* <Alert severity="warning">{messageError}</Alert> */}
          </Snackbar>
          <Grid item xs={10.5} md={3}>
            <Typography variant="body2" style={{ textAlign: 'left', fontSize: '16px', paddingBottom: '5px' }}>
              Seleccione Documento <span style={{ color: 'red' }}>*</span>
            </Typography>
            </Grid>
        </Grid>
        {/* {error && <Alert severity="error">{error}</Alert>} */}
      </form>
    </Card>
  );

});

export default QuestionsFormLife;   