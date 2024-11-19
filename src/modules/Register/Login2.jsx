import React, { useContext, useState, useEffect } from "react";
import "../../styles/button.scss";
import "../../styles/style.scss";
import { Container, Grid, Paper, Alert } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import { AuthContext } from "../../services/AuthProvider";
import Snackbar from "@mui/material/Snackbar";
import AlertTitle from "@mui/material/AlertTitle";

const Login2 = () => {
  const [searchParams] = useSearchParams();
  const parametro = searchParams.get("Token");

  const [formData, setFormData] = useState({
    username: "",
  });

  const [error, setError] = useState("");
  const { signin } = useContext(AuthContext);
  const [openSnack, setOpenSnack] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Llamar al servicio cuando el componente se monte
  useEffect(() => {
    const callSignin = async () => {
      try {
        const data = {
          token: parametro,
        };

        const response = await signin("api/Login2", "POST", data);
        if (response.codigo !== 200) {
          alert(response.message);
          setOpenSnack(true);
        }
      } catch (error) {
        console.error(error);
        setError("Se presentó un error con el inicio de sesión. Por favor, intente nuevamente.");
        setOpenSnack(true);
        setErrorMessage("Error al iniciar sesión. Por favor, intente más tarde.");
      }
    };

    if (parametro) {
      callSignin();
    } else {
      setErrorMessage("El token no está presente en la URL.");
      setOpenSnack(true);
    }
  }, [parametro, signin]);

  return (
    <Container maxWidth={false} style={{ height: "100vh", width: "100vw", padding: 0, margin: 0 }}>
      <Grid container style={{ height: "100%" }}>
        <Grid item xs={false} md={7} className="hide-on-mobile" style={{ height: "100vh", overflow: "hidden" }}>
          <img
            src={process.env.PUBLIC_URL + "/assets/images/login.png"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="Background"
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          square
          style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
          <div
            style={{
              margin: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Container
              component="main"
              maxWidth="md"
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="show-on-mobile">
                <img
                  src={process.env.PUBLIC_URL + "/assets/images/LogoSLU.jpg"}
                  style={{ height: "100px", objectFit: "cover" }}
                  alt="Background"
                />
              </div>
              <h2 style={{ color: "#02545C" }}>Iniciar Sesión</h2>
              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={openSnack}
                autoHideDuration={5000}
                onClose={() => setOpenSnack(false)}
              >
                <Alert style={{ fontSize: "1em" }} severity="error">
                  <AlertTitle style={{ textAlign: "left" }}>Error</AlertTitle>
                  {errorMessage}
                </Alert>
              </Snackbar>
            </Container>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login2;
