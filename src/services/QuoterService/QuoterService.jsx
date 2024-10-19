import authService from '../authServices'; 

const QuoterService = {

  fetchConsultarCotizacionGeneral: async (dato) => {
    const endpoint = 'api/ConsultaCotizacionGeneral';
    const method = 'POST'; 
    const data = {
      usuario:dato.usuario,
      id_CotiGeneral:dato.id_CotiGeneral,
      ramo:dato.ramo,
      producto:dato.producto,
      cliente:dato.cliente,
      estado:dato.estado,
      fecha:dato.fecha,
      idBroker:dato.idBroker
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching Consultar Cotizacion General:', error);
      throw error;
    }
  },

  fetchEliminarCotizacionGeneral: async (id_CotiGeneral) => {
    const endpoint = 'api/EliminarCotizacionGeneral';
    const method = 'POST'; 
    const data = {
      id_CotiGeneral:id_CotiGeneral
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching Eliminar Cotizacion General:', error);
      throw error;
    }
  },

  fetchGuardarCotizacion: async (id_CotiGeneral) => {
    const endpoint = 'api/EliminarCotizacionGeneral';
    const method = 'POST'; 
    const data = {
      id_CotiGeneral:id_CotiGeneral
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching Eliminar Cotizacion General:', error);
      throw error;
    }
  },

  fetchGuardarFormaDePago: async (dato) => {
    const endpoint = 'api/guardarFormaDePago';
    const method = 'POST'; 
    const data = dato;

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching Guardar Forma de Pago:', error);
      throw error;
    }
  },


  fetchEnvioCorreoFormCuenta: async (id_CotiGeneral,cliente,Correo) => {
    const endpoint = 'api/EnvioCorreoFormCuenta';
    const method = 'POST'; 
    const data = {
      id_CotiGeneral: id_CotiGeneral,
      cliente: cliente,
      Correo:Correo
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching Envio Correo Cuenta:', error);
      throw error;
    }
  },

  fetchExportExcel: async (dato,estado) => {
    const endpoint = 'api/reporte/ReporteExcelEmisiones';
    const method = 'POST'; 
    const data = {
      usuario:dato.usuario,
      id_CotiGeneral:dato.id_CotiGeneral,
      ramo:dato.ramo,
      producto:dato.producto,
      cliente:dato.cliente,
      estado:estado,
      fecha:dato.fecha
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);

      const pdfBlob = base64ToBlob(response.data.archivo, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // Crear un enlace temporal para descargar el archivo
        const downloadUrl = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "ReporteExcel.xlsx"); // O cualquier otro nombre de archivo
        document.body.appendChild(link);
        link.click();
        link.remove(); // Limpiar el enlace temporal



      return response;
    } catch (error) {
      console.error('Error fetching Envio Correo Cuenta:', error);
      throw error;
    }
  },
  


};

function base64ToBlob(base64, type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], {type: type});
}


export default QuoterService;