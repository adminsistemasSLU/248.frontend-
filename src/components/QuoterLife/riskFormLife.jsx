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
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CircularProgress from "@mui/material/CircularProgress";
import { TextField, Box, Grid, FormControl, Select, MenuItem, Snackbar, Alert, AlertTitle, Button } from "@mui/material";
import { LS_DOCUMENTOSVIDA, LS_PREGUNTASVIDA, LS_DATAVIDASEND, LS_COTIZACION, LS_IDCOTIZACIONVIDA, LS_PREGRESPONDIDAS } from "../../utils/constantes";
import LifeService from "../../services/LifeService/LifeService";

const RiskFormLife = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [documentsUpload, setDocumentsUpload] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [questionsUpload, setQuestionsUpload] = useState([]);
  const fileInputRefs = useRef({});



  useEffect(() => {

    let docuemtos = JSON.parse(sessionStorage.getItem(LS_DOCUMENTOSVIDA));
    let preguntas = JSON.parse(sessionStorage.getItem(LS_PREGUNTASVIDA));
    let questions = (preguntas || []).map(pregunta => ({
      codigo: pregunta.codigo,
      respuesta: ""
    }));
    setQuestions(preguntas || []);
    if (docuemtos) {
      let array = Object.values(docuemtos);
      setDocuments(array || []);

      //PREGUNTAR SI ES MODO EDITAR
      let idCotizacion = sessionStorage.getItem(LS_COTIZACION);

      if (idCotizacion) {
        const data = JSON.parse(sessionStorage.getItem(LS_DATAVIDASEND));

        const dataresp = JSON.parse(sessionStorage.getItem(LS_PREGRESPONDIDAS));

        let preguntas = data.jsonPreguntas;

        if (dataresp) {
          preguntas = dataresp;
        } else {
          preguntas = data.jsonPreguntas;
        }


        const questionUploadNew = questions.map((item) => {
          // Buscamos la pregunta correspondiente en el arreglo preguntas
          const preguntaCorrespondiente = preguntas.find(pregunta => pregunta.codigo === item.codigo);

          // Retornamos un nuevo objeto con la respuesta asignada si existe
          return {
            ...item,
            respuesta: preguntaCorrespondiente ? preguntaCorrespondiente.respuestapregunta : item.respuesta
          };
        });
        // Actualizamos el estado con el nuevo arreglo
        setQuestionsUpload(questionUploadNew);

      } else {
        setQuestionsUpload(questions);
      }



    }

  }, []);



  useImperativeHandle(ref, () => ({
    handleSubmitExternally: handleSubmit,
  }));

  const handleSubmit = async (e) => {

    const respuestasIncompletas = questionsUpload.some(q => !q.respuesta || q.respuesta.trim() === "");
    if (respuestasIncompletas) {
      setErrorMessage("Por favor, complete todas las respuestas antes de continuar.");
      setOpenSnack(true);
      return false;
    }
    const application = sessionStorage.getItem(LS_IDCOTIZACIONVIDA);
    const id_cotigeneral = sessionStorage.getItem(LS_COTIZACION);


    let preguntas = JSON.parse(sessionStorage.getItem(LS_PREGUNTASVIDA));

    let updatedQuestions = (preguntas || []).map(pregunta => {
      let respuestaEncontrada = questionsUpload.find(q => q.codigo === pregunta.codigo);
      return {
        ...pregunta,
        respuestapregunta: respuestaEncontrada ? respuestaEncontrada.respuesta : ""
      };
    });
    const data = JSON.parse(sessionStorage.getItem(LS_DATAVIDASEND));
    if (application !== null && application !== undefined && application !== '') {
      data.aplicacion = application;
    }
    if (id_cotigeneral !== null && id_cotigeneral !== undefined && id_cotigeneral !== '') {
      data.id_CotiGeneral = id_cotigeneral;
    }
    data.jsonPreguntas = updatedQuestions;
    setOpen(true);
    const response = await LifeService.fetchGrabaDatosVida(data);

    if (response.codigo === 200) {
      sessionStorage.setItem(LS_PREGUNTASVIDA, JSON.stringify(updatedQuestions));
      sessionStorage.setItem(LS_PREGRESPONDIDAS, JSON.stringify(updatedQuestions));
      sessionStorage.setItem(LS_DATAVIDASEND, JSON.stringify(data));
      setOpen(false);
      return true;
    } else {
      setErrorMessage(response.message);
      setOpenSnack(true);
      setOpen(false);
      return false;
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleFileChange = (event, codId, nombre) => {

    let newFiles = Array.from(event.target.files);
    newFiles = newFiles.map(file => ({
      file,
      nombre,
      codigo: codId
    }));

    setDocumentsUpload(prevFiles => {
      const filteredFiles = prevFiles.filter(fileObj => fileObj.codigo !== codId);
      return [
        ...filteredFiles,
        ...newFiles
      ];
    });

    // Limpiar el campo de archivo
    if (fileInputRefs.current[codId]) {
      fileInputRefs.current[codId].value = null;
    }
  };

  const handleRemoveFile = (fileCod) => {
    setDocumentsUpload(prevFiles =>
      prevFiles.filter(fileObj => fileObj.codigo !== fileCod)
    );
  };



  const documentsArray = (
    <Grid container spacing={2} sx={{
      paddingRight: '5px',
      paddingBottom: '20px',
      justifyContent: {
        xs: 'space-around', // Justificación en dispositivos pequeños
        sm: 'center', // Justificación en dispositivos medianos
        md: 'space-between', // Justificación en dispositivos grandes
      }
    }}>
      {documents.length > 0 && (
        documents.map((file, index) => (
          <Grid item xs={12} sm={5} md={4} key={index}>
            <div style={{ marginBottom: '10px' }}>
              <Typography variant="body1">{file.nombre}
                {file.opcional === 'S' && (
                  <span style={{ color: 'red' }}>*</span>
                )}
              </Typography>
            </div>
            <Box>
              <input
                type="file"
                id={`file-upload-${file.codigo}`}
                multiple
                onChange={(event) => handleFileChange(event, file.codigo, file.nombre)}
                ref={el => fileInputRefs.current[file.codigo] = el} // Asigna la referencia
                style={{ display: 'none' }} // Oculta el input real
              />
              <label htmlFor={`file-upload-${file.codigo}`}>
                <Button

                  startIcon={<DriveFolderUploadIcon />}
                  variant="contained"
                  component="span"
                  style={{ backgroundColor: "#0099a8", display: "none" }}>  {/* Se oculta boton por peticion de cliente */}
                  Upload File
                </Button>
              </label>
            </Box>
            {/* Mostrar nombres de archivos subidos */}
            {documentsUpload.filter(fileObj => fileObj.codigo === file.codigo).length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {documentsUpload.filter(fileObj => fileObj.codigo === file.codigo).map((fileObj, idx) => (
                    <li style={{ textDecoration: "none", alignItems: 'center', display: 'flex', flexDirection: 'column' }} key={idx}>
                      <div style={{ width: '200px', overflow: 'hidden', whiteSpace: 'nowrap' }}
                      >{fileObj.file.name}
                      </div>
                      <Button
                        component="span"
                        onClick={() => handleRemoveFile(fileObj.codigo)}
                        variant="contained"
                        sx={{
                          backgroundColor: "#dd3301"
                        }}
                        size="small"
                        startIcon={<DeleteOutlineIcon />}
                        style={{ marginTop: '10px', width: '143.7px', height: '36.7px' }}
                      >{/* Se oculta boton por peticion de cliente */}
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Grid>
        ))
      )}
    </Grid>
  );



  // const handleRemoveFile = (fileCod) => {
  //   console.log(fileCod);
  //   setDocumentsUpload(prevFiles =>
  //     prevFiles.filter(fileObj => fileObj.cod !== fileCod)
  //   );
  // };


  const handleSelectChange = (event, questionIndex) => {
    const value = event.target.value;
    setQuestionsUpload(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[questionIndex].respuesta = value;
      return newQuestions;
    });
  };

  const handleTextChange = (event, questionIndex) => {
    const value = event.target.value;
    setQuestionsUpload(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[questionIndex].respuesta = value;
      return newQuestions;
    });
  };

  const preguntasArray = (
    <Grid container spacing={2} style={{ paddingRight: '5px', marginLeft: '1px' }}>
      {questions.length > 0 && questions.map((pregunta, questionIndex) => (
        <Grid item xs={12} sm={5} md={4} textAlign={"start"}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          key={pregunta.codigo}>
          <Typography variant="body1" fontSize={14}>{pregunta.pregunta}</Typography>
          {pregunta.tipo === 'lista' ? (
            <FormControl fullWidth margin="normal">
              <Select
                labelId={`select-label-${questionIndex}`}
                value={questionsUpload[questionIndex].respuesta || ''}
                onChange={(event) => handleSelectChange(event, questionIndex)}
              >
                {JSON.parse(pregunta.respuesta)
                  .filter(respuesta => respuesta.nombre !== "")
                  .map((respuesta, answerIndex) => (
                    <MenuItem key={answerIndex} value={respuesta.nombre}>
                      {respuesta.nombre}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              variant="outlined"
              value={questionsUpload[questionIndex].respuesta || ''}
              onChange={(event) => handleTextChange(event, questionIndex)}
              margin="normal"
            />
          )}
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Card elevation={4} sx={{ width: '100%', m: 2, mx: 'auto', paddingTop: '30px', paddingBottom: '30px' }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>


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

      <form style={{ paddingLeft: '30px', paddingRight: '10px', paddingBottom: '20px' }}>
        <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '0px', fontWeight: 'bold' }}>
          REQUISITOS DE ASEGURABILIDAD
        </Typography>
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {/* <Alert severity="warning">{messageError}</Alert> */}
        </Snackbar>
        <Grid container spacing={2} style={{ paddingRight: '5px' }}>
          {documentsArray}
        </Grid>

        {questions.length > 0 && (
          <>
            <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '0px', fontWeight: 'bold' }}>
              DECLARACION DE ASEGURABILIDAD
            </Typography>

            <Grid container spacing={2} style={{ paddingRight: '5px' }}>
              {preguntasArray}
            </Grid>
          </>
        )}
      </form>
    </Card >
  );
});

export default RiskFormLife;
