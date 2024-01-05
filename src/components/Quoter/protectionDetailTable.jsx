import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import CurrencyInput from '../../utils/currencyInput';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button'; // Agregar el botón
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { visuallyHidden } from '@mui/utils';
import '../../styles/moddalForm.scss';
import '../../styles/detailQuoter.scss';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DetailObjectsTable from './detailObjectsTable';

function createData(id, descripcion, monto) {
    return {
        id,
        descripcion,
        monto,
    };
}

const headCells = [
    {
        id: 'descripcion',
        numeric: false,
        disablePadding: false,
        label: 'Descripción',
        visible: true,
    },
    {
        id: 'monto',
        numeric: true,
        disablePadding: false,
        label: 'Monto',
        visible: true,
    },
    {
        id: 'accion',
        numeric: true,
        disablePadding: false,
        label: 'Acción',
        visible: true,
    },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#00A99D",
        color: '#fff',
        borderBottom: '1px solid black'
    },
    [`&.${tableCellClasses.body}`]: {
        borderBottom: '1px solid black'
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:last-child td, &:last-child th': {
        borderBottom: '1px solid black'
    },
}));

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function ProtectionDetailTable({ closeModalDetail }) {
    const [order,] = React.useState('asc');
    const [orderBy,] = React.useState('calories');
    const [selected,] = React.useState([]);
    const [page] = React.useState(0);
    const [rowsPerPage] = React.useState(10);
    const [openModal, setOpenModal] = React.useState(false);
    const [editableValues, setEditableValues] = React.useState([]);

    // Datos iniciales para la tabla
    const initialRows = [
        createData(1, 'Menaje de hogar', 750000,),
        createData(2, 'Joyeria', 150000,),
        createData(3, 'Estructura de casa', 50000,),
    ];
    const [jsonData, setJsonData] = React.useState(initialRows); // Estado para los datos


    React.useEffect(() => {
        setEditableValues(
            initialRows.map((row) => ({
                descripcion: row.descripcion,
                monto: row.monto,
            }))
        );
    }, []);

    React.useEffect(() => {
        // Calcula el total del monto desde el estado jsonData
        const total = jsonData.reduce((acc, item) => acc + parseFloat(item.monto), 0);
        // Actualiza el estado totalMonto
        setTotalMonto(total);
    }, [jsonData]); // Observa cambios en jsonData
    const [totalMonto, setTotalMonto] = React.useState(0);

    // const handleOpenModal = () => {
    //     setOpenModal(true);
    // };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const handleCellValueChange = (event, index, field) => {
        const newValue = event.target.value;
        const numericValue1 = parseFloat(newValue.replace(/[^\d.-]/g, ''));
        const newEditableValues = [...editableValues];
        isNaN(numericValue1) ? newEditableValues[index][field] = newValue : newEditableValues[index][field] = numericValue1;
        setEditableValues(newEditableValues);
        const newJsonData = [...jsonData];
        const numericValue = parseFloat(newValue.replace(/[^\d.-]/g, '')); // Remueve caracteres no numéricos, excepto puntos y guiones
        newJsonData[index][field] = numericValue;
        setJsonData(newJsonData);
        const total = jsonData.reduce((acc, item) => parseFloat(acc) + parseFloat(item.monto), 0);
        setTotalMonto(total);
    };

    const handleDeleteRow = (index) => {
        const newEditableValues = [...editableValues];
        newEditableValues.splice(index, 1);
        setEditableValues(newEditableValues);

        const newJsonData = [...jsonData];
        newJsonData.splice(index, 1);
        setJsonData(newJsonData);

        const total = newJsonData.reduce((acc, item) => parseFloat(acc) + parseFloat(item.monto), 0);
        setTotalMonto(total);
    };


    const handleAddRow = () => {
        const newRow = createData(
            editableValues.length + 1,
            '', // Puedes proporcionar valores por defecto
            0.00,
        );
        const newEditableValues = [...editableValues, { descripcion: '', monto: 0 }];
        setEditableValues(newEditableValues);
        const newJsonData = [...jsonData, newRow];
        setJsonData(newJsonData);
    };

    // Función para guardar los datos en un objeto JSON
    // const saveDataToJson = () => {
    //     const jsonData = editableValues.map((value, index) => ({
    //         id: index + 1,
    //         descripcion: value.descripcion,
    //         monto: parseFloat(value.monto),
    //         prima: 7, // Puedes proporcionar otro valor por defecto para la prima
    //     }));
    //     console.log(jsonData); // Puedes hacer lo que desees con los datos JSON
    // };

    const visibleRows = React.useMemo(
        () =>
            stableSort(editableValues, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [order, orderBy, page, rowsPerPage, editableValues]
    );

    const closeModal = () => {
        closeModalDetail('true');
    };



    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ backgroundColor: '#00a99e', color: 'white', paddingTop: '5px', paddingLeft: '15px', paddingRight: '15px', display: 'flex', justifyContent: 'space-between' }}>
                <div>Descripcion de Sección</div>
                <div onClick={closeModal}> <CloseIcon /></div>
            </div>

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xl" className='dialog-height'
                PaperProps={{
                    style: {
                        backgroundColor: '#ffffff',
                        boxShadow: 'none',
                        overflow: 'hidden',
                        zIndex: '2000'
                    },
                }}>
                <DialogContent style={{ overflow: 'hidden', padding: '0px', paddingBottom: '20px' }} className='dialog-height-content'>
                    {/* Componente del formulario */}
                    <DetailObjectsTable closeModalDetail={handleCloseModal} style={{ width: '80%' }} />
                </DialogContent>
            </Dialog>

            {/* Botón para añadir nuevas filas */}

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Button variant="outlined" color="primary" style={{ height: '23px', width: '115px', }} onClick={handleAddRow}>
                    Añadir
                </Button>
            </div>


            <TableContainer style={{ overflow: 'auto', height: '100%', padding: '20px' }}>
                <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={'small'}
                    style={{ height: 150 }}
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    style={{ visibility: 'hidden' }}
                                />
                            </StyledTableCell>
                            {headCells.map((headCell) => (
                                <StyledTableCell
                                    key={headCell.id}
                                    align={headCell.numeric ? 'right' : 'left'}
                                    padding={headCell.disablePadding ? 'none' : 'normal'}
                                    sortDirection={orderBy === headCell.id ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                    // onClick={() => {
                                    //   handleRequestSort(headCell.id);
                                    // }}
                                    >
                                        {headCell.label}
                                        {orderBy === headCell.id ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((row, index) => {
                            const isItemSelected = isSelected(row.id);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <StyledTableRow
                                    key={row.id}
                                    hover
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    sx={{ cursor: 'pointer' }}

                                >
                                    <TableCell
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="none"
                                    >
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="left">
                                        <input
                                            className='input-table'
                                            style={{ textAlign: 'left' }}
                                            value={row.descripcion}
                                            onChange={(event) =>
                                                handleCellValueChange(event, index, 'descripcion')
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <CurrencyInput
                                            className='input-table'
                                            style={{ textAlign: 'right' }}
                                            value={row.monto.toFixed(2)}
                                            onChange={(event) =>
                                                handleCellValueChange(event, index, 'monto')
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <DeleteIcon
                                            onClick={() => handleDeleteRow(index)}
                                        />
                                    </TableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '20px' }}>
                <div style={{ marginRight: '20px' }}>Monto:</div>
                <div style={{ fontWeight: 'bold' }}>
                    {/* Calcula el total del monto desde el JSON */}
                    <CurrencyInput className='input-table' value={totalMonto.toFixed(2)} />
                </div>
            </div>

            {/* Botón "Aceptar" */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Button variant="contained" color="primary">
                    Aceptar
                </Button>
            </div>
        </div>
    );
}
