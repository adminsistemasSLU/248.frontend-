import authService from '../authServices';

const ComboService = {

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
            console.error('Error fetching validar ComboProvincias:', error);
            throw error;
        }
    },

    fetchComboCiudad: async (ramo, producto,provincia) => {
        const endpoint = 'api/cb_ciudad';
        const method = 'POST';
        const data = {
            ramo: ramo,
            producto: producto,
            provincia:provincia
        };
        try {
            const response = await authService.fetchWithAuth(endpoint, method, data);
            return response;
        } catch (error) {
            console.error('Error fetching validar ComboCiudad:', error);
            throw error;
        }
    },

    fetchComboParroquia: async (ciudad) => {
        const endpoint = 'api/cb_parroquia';
        const method = 'POST';
        const data = {
            ciudad: ciudad,
        };
        try {
            const response = await authService.fetchWithAuth(endpoint, method, data);
            return response;
        } catch (error) {
            console.error('Error fetching validar ComboParroquia:', error);
            throw error;
        }
    },

    fetchComboAntiguedad: async (ramo,producto,tipPoliza) => {
        const endpoint = 'api/cb_antiguedad';
        const method = 'POST';
        const data = {
            ramo: ramo,
            producto: producto,
            tipPoliza:tipPoliza
        };
        try {
            const response = await authService.fetchWithAuth(endpoint, method, data);
            return response;
        } catch (error) {
            console.error('Error fetching validar ComboAntiguedad:', error);
            throw error;
        }
    },

    fetchComboTipConstruccion: async () => {
        const endpoint = 'api/cb_tipConstruccion';
        const method = 'POST';
        
        try {
            const response = await authService.fetchWithAuth(endpoint, method);
            return response;
        } catch (error) {
            console.error('Error fetching validar ComboTipConstruccion:', error);
            throw error;
        }
    },

    fetchComboTipoRiesgos: async (ramo, producto) => {
        const endpoint = 'api/cb_tipoRiesgos';
        const method = 'POST';
        const data = {
            ramo: ramo,
            producto: producto,
        };

        try {
            const response = await authService.fetchWithAuth(endpoint, method, data);
            return response;
        } catch (error) {
            console.error('Error fetching validar ComboTipoRiesgos:', error);
            throw error;
        }
    },

    fetchTipDestino: async (ramo, producto,tipPoliza,riesgo) => {
        const endpoint = 'api/cb_tipDestino';
        const method = 'POST';
        const data = {
            ramo: ramo,
            producto: producto,
            tipPoliza:tipPoliza,
            riesgo:riesgo
        };

        try {
            const response = await authService.fetchWithAuth(endpoint, method, data);
            return response;
        } catch (error) {
            console.error('Error fetching validar Cedula:', error);
            throw error;
        }
    },


    fetchComboZona: async (zona_usuario, filtro,estado_zona) => {
        const endpoint = 'api/cb_zona';
        const method = 'POST';
        const data = {
            zona_usuario: zona_usuario,
            filtro: filtro,
            estado_zona:estado_zona,
        };

        try {
            const response = await authService.fetchWithAuth(endpoint, method, data);
            return response;
        } catch (error) {
            console.error('Error fetching validar ComboZona:', error);
            throw error;
        }
    },


    fetchComboTipoCredito: async () => {
        const endpoint = 'api/cb_TipoCredito';
        const method = 'POST';
        const data = {
            Alias: "TIPCRE"
        };

        try {
            const response = await authService.fetchWithAuth(endpoint, method, data);
            return response;
        } catch (error) {
            console.error('Error fetching validar Combo TipoCredito:', error);
            throw error;
        }
    },

    fetchComboFormaPago: async (zona_usuario, filtro,estado_zona) => {
        const endpoint = 'api/cb_FormaPago';
        const method = 'POST';
        const data = {
            Alias: "FORPAG"
        };

        try {
            const response = await authService.fetchWithAuth(endpoint, method, data);
            return response;
        } catch (error) {
            console.error('Error fetching validar Combo FormaPago:', error);
            throw error;
        }
    },




}

export default ComboService;