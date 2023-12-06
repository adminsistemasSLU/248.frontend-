import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import '../../styles/moddalForm.scss';

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
};

const CustomCurrencyEditCell = ({ id, field, value, api }) => {
    
    const handleValueChange = (event) => {
        console.log('data');
      const inputValue = event.target.value;
      const formattedValue = formatCurrency(parseFloat(inputValue.replace(/[^0-9.-]+/g, '')) || 0);
      api.setEditCellValue({ id, field, value: formattedValue });
    };
  
    return (
      <input
        type="text"
        value={value}
        onChange={handleValueChange}
        style={{ width: '100%', boxSizing: 'border-box' }}
      />
    );
  };

const columns = [
  { field: 'id', headerName: '', width: 70 },
  { field: 'cobertura', headerName: 'Cobertura', width: 350, editable: true },
  {
    field: 'accion',
    headerName: '',
    width: 90,
    editable: true,
    renderCell: (params) => <ActionButton onClick={() => console.log('Ver detalles', params.row)} />,
  },
  {
    field: 'monto',
    headerName: 'Monto',
    width: 160,
    editable: true,
    valueFormatter: (params) => formatCurrency(params.value),
    editComponent: CustomCurrencyEditCell,
  },
  {
    field: 'tasa',
    headerName: 'Tasa',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    editable: true,
    valueFormatter: (params) => formatCurrency(params.value),
    editComponent: CustomCurrencyEditCell,
  },
  {
    field: 'prima',
    headerName: 'Prima',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    editable: true,
    valueFormatter: (params) => formatCurrency(params.value),
    editComponent: CustomCurrencyEditCell,
  },
];

const ActionButton = ({ onClick }) => (
  <IconButton onClick={onClick}>
    <VisibilityIcon />
  </IconButton>
);

const rows = [
  { id: 1, cobertura: 'Edificio con todas sus instalaciones fijas y permanentes (Estructuras)', monto: 34, tasa: 35, prima: 0 },
  { id: 2, cobertura: 'Maquinarias y equipos', monto: 24245, tasa: 42, prima: 0 },
  { id: 3, cobertura: 'Muebles, enseres y equipos de oficina', monto: 234, tasa: 45, prima: 0 },
  { id: 4, cobertura: 'Equipo electrónico fijo y portátil', monto: 41, tasa: 16, prima: 0 },
  { id: 5, cobertura: 'Targaryen', monto: 7656, tasa: 15, prima: 0 },
  { id: 6, cobertura: 'Melisandre', monto: 899786, tasa: 150, prima: 0 },
  { id: 7, cobertura: 'Clifford', monto: 3313, tasa: 44, prima: 0 },
  { id: 8, cobertura: 'Frances', monto: 7843, tasa: 36, prima: 0 },
  { id: 9, cobertura: 'Roxie', monto: 45, tasa: 65, prima: 0 },
  { id: 'combined', cobertura: 'NUEVOS AMPAROS', monto: 0, tasa: 0, prima: 0 },
];

const getRowId = (row) => row.id;

const rowClassName = (params) => {
  return params.row.id === 'combined' ? 'combined-row' : '';
};

export default function DetailObjectsTable() {
  const handleEditCellChange = React.useCallback((params) => {
    if (params.id !== 'combined') {
      params.api.setCellValue(params.id, 'monto', parseFloat(params.props.value.replace(/[^0-9.-]+/g, '')) || 0);
      params.api.setCellValue(params.id, 'tasa', parseFloat(params.props.value.replace(/[^0-9.-]+/g, '')) || 0);
      params.api.setCellValue(params.id, 'prima', parseFloat(params.props.value.replace(/[^0-9.-]+/g, '')) || 0);
      console.log('data2');
    }else{
        console.log('data');
    }
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        disableSelectionOnClick
        columns={columns}
        density='compact'
        pageSizeOptions={[5, 10]}
        checkboxSelection
        getRowId={getRowId}
        rowClassName={rowClassName}
        onCellEditCommit={handleEditCellChange}
      />
    </div>
  );
}
