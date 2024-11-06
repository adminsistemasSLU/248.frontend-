import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle
} from "react";
import Typography from '@mui/material/Typography';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { TextField, Grid, FormControl, Select, MenuItem, Snackbar, Alert, AlertTitle } from "@mui/material";
import { LS_PREGUNTASVIDA, LS_DATAVIDASEND } from "../../utils/constantes";


const QuestionModalLife = forwardRef((props, ref) => {
    const [questions, setQuestions] = useState([]);
    const [questionsUpload, setQuestionsUpload] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [open, setOpen] = useState(false);
    // const editMode = isEditMode;

    useEffect(() => {

        let preguntas = JSON.parse(sessionStorage.getItem(LS_PREGUNTASVIDA));
        setQuestions(preguntas || []);

        let questions = (preguntas || []).map(pregunta => ({
            codigo: pregunta.codigo,
            respuesta: ""
        }));
        setQuestionsUpload(questions);
    }, []);




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

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    useImperativeHandle(ref, () => ({
        handleSubmitExternally: handleSubmit,
    }));

    const handleSubmit = async (e) => {
        await handleSaveChanges();
        return true;
    };

    const handleSaveChanges = async () => {
        let preguntas = JSON.parse(sessionStorage.getItem(LS_PREGUNTASVIDA));

        let updatedQuestions = preguntas.map(pregunta => {
            let respuestaEncontrada = questionsUpload.find(q => q.codigo === pregunta.codigo);
            return {
                ...pregunta,
                respuestapregunta: respuestaEncontrada ? respuestaEncontrada.respuesta : ""
            };
        });

        const data = JSON.parse(sessionStorage.getItem(LS_DATAVIDASEND));
        setOpenBackdrop(true);

        data.jsonPreguntas = updatedQuestions
        //const response = await LifeService.fetchGrabaDatosVida(data);
        // if (response.codigo === 200) {

        //     sessionStorage.setItem(LS_DATAVIDASEND,data);
        //     closeModalDetail("true");
        // } else {

        //     closeModalDetail("true");
        // }

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

    // const closeModal = () => {
    //     closeModalDetail("true");
    // };

    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
            }}
        >
            <div
                style={{
                    backgroundColor: "#00a99e",
                    color: "white",
                    paddingTop: "5px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <div>Descripción de Sección</div>
                
            </div>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
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

            <form style={{ paddingLeft: '30px', paddingRight: '10px', paddingBottom: '20px' }} >
                <Snackbar
                    open={open}
                    autoHideDuration={5000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    {/* <Alert severity="warning">{messageError}</Alert> */}
                </Snackbar>
                <Typography variant="body2" color="#02545C" style={{ textAlign: 'left', paddingBottom: '20px', paddingLeft: '0px', fontWeight: 'bold' }}>
                    DECLARACION DE ASEGURABILIDAD
                </Typography>

                <Grid container spacing={2} style={{ paddingRight: '5px' }}>
                    {preguntasArray}
                </Grid>

                <Button
                    variant="contained"
                    className="button-styled-primary"
                    style={{ top: "20%", backgroundColor: '#02545C', color: "white" }}
                    onClick={handleSaveChanges}>
                    Aceptar
                </Button>
            </form>
        </div >

    );
});

export default QuestionModalLife;