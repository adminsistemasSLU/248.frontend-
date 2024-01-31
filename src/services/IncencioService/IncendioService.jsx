import authService from '../authServices'; 

const IncendioService = {

  fetchDetalleAsegurado: async (ramo, producto) => {
    const endpoint = 'api/se_DetalleAsegurado';
    const method = 'POST'; 
    const data = {
      ramo: ramo,
      producto: producto,
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching Detalle Asegurado:', error);
      throw error;
    }
  },

  fetchAmparoIncendios: async (ramo, producto, IdclasificacionAmparo) => {
    const endpoint = 'api/se_amparosincendios';
    const method = 'POST'; 
    const data = {
        ramo: ramo,
        producto: producto,
        IdclasificacionAmparo:IdclasificacionAmparo
      };
    try {
      const response = await authService.fetchWithAuth(endpoint, method,data);
      return response;
    } catch (error) {
      console.error('Error fetching Amparo Incendios:', error);
      throw error;
    }
  },

};

export default IncendioService;