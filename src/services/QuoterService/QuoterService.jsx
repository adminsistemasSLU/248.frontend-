import authService from '../authServices'; 
import { TOKEN_STORAGE_KEY } from '../../utils/constantes';

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
      idBroker:dato.idBroker,
      usuarioBusq: dato.usuarioBusq,
      fechaInicio: dato.fechaInicio,
      fechaFin: dato.fechaFin,
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching Consultar Cotizacion General:', error);
      throw error;
    }
  },

  fetchPendingCount: async ({ ramo }) => {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const user = JSON.parse(localStorage.getItem("user"));
  
      if (!token || !user?.id) {
        console.warn("Token o usuario no encontrado");
        return 0;
      }
  
      const response = await fetch('/api/cotizacionesPendientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ usuario: user.id })
      });
  
      const data = await response.json();
  
      if (data.codigo === 200 && Array.isArray(data.data)) {
        const resultado = data.data.find(
          item => item.estado === "A" && item.ramo === String(ramo)
        );
        return resultado?.totalCotizaciones ?? 0;
      } else {
        console.warn("Respuesta inválida:", data.message);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching pending quotes:', error);
      return 0;
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

  fetchActualizaCotizacionGeneral: async (id_CotiGeneral,idUsuario,comentario) => {
    const endpoint = 'api/ActualizaCotizacionGeneral';
    const method = 'POST'; 
    const data = {
      id_CotiGeneral:id_CotiGeneral,
      idUsuario :idUsuario,
      comentario:comentario
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching Actualiza Cotizacion General:', error);
      throw error;
    }
  },

  fetchActualizaEstadoNoConcretado: async (id_CotiGeneral,idUsuario,comentario) => {
    const endpoint = 'api/ActualizaCotizacionGeneralenc';
    const method = 'POST'; 
    const data = {
      id_CotiGeneral:id_CotiGeneral,
      idUsuario :idUsuario,
      comentario:comentario
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching Actualiza Cotizacion General:', error);
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