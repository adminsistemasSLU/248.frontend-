import authService from '../authServices';

const CommonService = {

    fetchComboProvincias: async (ramo, producto) => {
        const endpoint = 'api/cb_provincias';
        const method = 'POST';
        const data = {
            ramo: ramo,
            producto: producto,
        };
        try {
            const response = await authService.fetchWithAuth(endpoint, method, data);
            return response;
        } catch (error) {
            console.error('Error fetching validar Cedula:', error);
            throw error;
        }
    },

    fetchTipoRiesgos: async (TipoIdentificacion, Numero) => {
        const endpoint = 'api/cb_tipoRiesgos';
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

}

export default CommonService;