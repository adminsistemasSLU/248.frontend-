import authService from '../authServices'; 

const QuoterService = {

  fetchConsultarCotizacionGeneral: async (dato) => {
    const endpoint = 'api/ConsultaCotizacionGeneral';
    const method = 'POST'; 
    const data = dato;

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

};

export default QuoterService;