import authService from '../authServices'; 

const BaldosasService = {

  fetchSubBaldosas: async (ramo, producto) => {
    const endpoint = 'api/subbaldosas';
    const method = 'PUT'; 
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

  fetchSubBaldosasMock: async () => {
    const endpoint = 'api/planesConTasas';
    const method = 'GET'; 
    
    try {
      const response = await authService.fetchWithAuth(endpoint, method);
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching subbaldosas:', error);
      throw error;
    }
  },

  fetchBaldosas: async () => {
    const endpoint = 'api/baldosas';
    const method = 'PUT'; 

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