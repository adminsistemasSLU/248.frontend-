import authService from '../authServices'; 

const EmailService = {

  fetchEnvioCorreoCotizacion: async (id_CotiGeneral,cliente,correo) => {
    const endpoint = 'api/EnvioCorreoIncendio';
    const method = 'POST'; 
    const data = {
        "id_CotiGeneral":id_CotiGeneral,
        "cliente": cliente,
        "Correo": correo
      };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching Consultar Cotizacion General:', error);
      throw error;
    }
  },

  fetchEnvioCorreoVida: async (id_CotiGeneral,cliente,correo,producto) => {
    const endpoint = 'api/EnvioCorreoVida';
    const method = 'POST'; 
    const data = {
        "id_CotiGeneral":id_CotiGeneral,
        "cliente": cliente,
        "Correo": correo,
        "producto":producto
      };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching Consultar Cotizacion General:', error);
      throw error;
    }
  },

  fetchEnvioCorreoCotizacionCar: async (id_CotiGeneral,correo) => {
    const endpoint = 'api/enviarMailVehiculo';
    const method = 'POST'; 
    const data = {
        "idCotizacion":id_CotiGeneral,
        "email": correo
      };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching Consultar Cotizacion General:', error);
      throw error;
    }
  },
};


export default EmailService;