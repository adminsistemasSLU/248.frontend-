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

  fetchPermisosBaldosas: async () => {
    const endpoint = 'api/Permisosbaldosas';
    const method = 'PUT';

    // Obtiene el usuario desde localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const usuario = user?.cod_usuario;

    if (!usuario) {
      console.error('No se encontró el usuario en localStorage.');
      return { codigo: 400, data: [], message: 'Usuario no autenticado o inválido' };
    }

    try {
      const payload = { usuario };
      console.log("Usuario a enviar:", payload);

      const response = await authService.fetchWithAuth(endpoint, method, payload);
      
      // Validación opcional de estructura
      if (!response || typeof response !== 'object' || !('codigo' in response)) {
        throw new Error('Respuesta inválida del servidor');
      }

      console.log("Permisos recibidos:", response);
      return response;
    } catch (error) {
      console.error('Error al obtener permisos de baldosas:', error.message || error);
      return { codigo: 500, data: [], message: 'Error en el servidor o red' };
    }
  },
  
};

export default BaldosasService;