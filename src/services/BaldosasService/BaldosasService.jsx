import authService from '../authServices'; // Asegúrate de tener la ruta correcta aquí

const BaldosasService = {

  fetchSubBaldosas: async (ramo, producto) => {
    const endpoint = 'api/subbaldosas';
    const method = 'PUT'; // Suponiendo que es una solicitud POST, cámbialo según sea necesario
    const data = {
      ramo: ramo,
      producto: producto,
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching subbaldosas:', error);
      throw error;
    }
  },

  fetchBaldosas: async () => {
    const endpoint = 'api/baldosas';
    const method = 'PUT'; // Suponiendo que es una solicitud GET, cámbialo según sea necesario

    try {
      const response = await authService.fetchWithAuth(endpoint, method);
      return response;
    } catch (error) {
      console.error('Error fetching baldosas:', error);
      throw error;
    }
  },

};

export default BaldosasService;