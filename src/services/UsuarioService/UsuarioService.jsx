import authService from '../authServices'; 

const UsuarioService = {

  fetchVerificarCedula: async (TipoIdentificacion, Numero) => {
    const endpoint = 'api/validar_Cedula';
    const method = 'POST'; 
    const data = {
        TipoIdentificacion: TipoIdentificacion,
        Numero: Numero,
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching validar Cedula:', error);
      throw error;
    }
  },


  fetchConsultarUsuario: async (tipoDocumento, documento) => {
    const endpoint = 'api/validar_Cliente';
    const method = 'POST'; 
    const data = {
        tipoDocumento: tipoDocumento,
        documento: documento,
    };
    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching validar Cedula:', error);
      throw error;
    }
  },

  fetchConsultarUsuario_v2: async (tipoDocumento, documento, usuario) => {
    const endpoint = 'api/validar_Cliente';
    const method = 'POST';
    const data = {
      tipoDocumento: tipoDocumento,
      documento: documento,
      usuario: usuario
    };
  
    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching validar Cedula:', error);
      throw error;
    }
  },

  fetchCambiarContrasenia: async (txtUser, txtPassword,txtPasswordActual) => {
    const endpoint = 'api/cambiarContrasenia';
    const method = 'POST'; 
    const data = {
      txtUser: txtUser,
      txtPassword: txtPassword,
      txtPasswordActual:txtPasswordActual
    };
    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error('Error fetching Cambiar Contrasenia:', error);
      throw error;
    }
  },

}
export default UsuarioService;