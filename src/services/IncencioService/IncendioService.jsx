import authService from "../authServices";

const IncendioService = {
  fetchDetalleAsegurado: async (ramo, producto) => {
    const endpoint = "api/se_DetalleAsegurado";
    const method = "POST";
    const data = {
      ramo: ramo,
      producto: producto,
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Detalle Asegurado:", error);
      throw error;
    }
  },

  fetchAmparoIncendios: async (ramo, producto, IdclasificacionAmparo) => {
    const endpoint = "api/se_amparosincendios";
    const method = "POST";
    const data = {
      ramo: ramo,
      producto: producto,
      IdclasificacionAmparo: IdclasificacionAmparo,
    };
    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Amparo Incendios:", error);
      throw error;
    }
  },

  getValTasaAmparoIncendio: async (amparoTasa) => {
    const endpoint = "api/getValTasaAmparoIncendio";
    const method = "POST";
    const data = {
      amparo: "",
      grupoamparo: "",
      montofijo: "N",
      valmaximo: "0",
      monto: "50000",
      ramo: "1",
      producto: "113",
      poliza: "PBROK",
      vigencia: "1",
      zona: "G",
      fechaDesde: "31/01/2024",
      fechaHasta: "31/01/2025",
      tip_usuario: "N",
      arrRiesgos: [
        {
          zona: "G",
          nomProvincia: "GUAYAS",
          ciudad: "0003",
          nomCiudad: "PALESTINA",
          tipriesgo: "3",
          nomTipRiesgo: "VIVIENDA",
          tipdestino: "00644",
          nomTipDestino: "DEPARTAMENTO HABITACIONAL",
          direccion: "GUAYAQUIL 33 ENTRE LA H Y G",
          antiguedad: "3",
          monto: "50000",
          estado: "P",
        },
      ],
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Val Tasa Amparo Incendio:", error);
      throw error;
    }
  },

  guardarCotizacion: async (cotizacion) => {
    const endpoint = "api/guardarCotizacion";
    const method = "POST";
    const data = cotizacion;
    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching guardar Cotizacion:", error);
      throw error;
    }
  },

  guardarCotizacionIncendio: async (cotizacionIncendio) => {
    const endpoint = "api/guardarCotizacionIncendio";
    const method = "POST";
    const data = cotizacionIncendio;
    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching guardar Cotizacion Incendio:", error);
      throw error;
    }
  },

  consultaCotizacionIncendio: async (ramo, producto, id_CotiGeneral) => {
    const endpoint = "api/ConsultaCotizacionIncendio";
    const method = "POST";
    const data = {
      ramo: ramo,
      producto: producto,
      id_CotiGeneral: id_CotiGeneral,
    };
    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching consulta Cotizacion Incendio:", error);
      throw error;
    }
  },
  //  editarCotizacionIncendio
  editarCotizacionIncendio: async (cotizacionIncendio) => {
    const endpoint = "api/editarCotizacionIncendio";
    const method = "POST";
    const data = cotizacionIncendio;
    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching guardar Cotizacion Incendio:", error);
      throw error;
    }
  },

  eliminarCotizacionIncendio: async (id_CotiIncendio) => {
    const endpoint = "api/EliminarCotizacionIncendio";
    const method = "POST";
    const data = {
      id_CotiIncendio: id_CotiIncendio,
    };
    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching guardar Cotizacion Incendio:", error);
      throw error;
    }
  },


  cargarDatosPago: async (id_CotiGeneral) => {
    const endpoint = "api/formas_Pagos";
    const method = "POST";
    const data = {
      id_CotiGeneral: id_CotiGeneral,
    };
    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching guardar Cotizacion Incendio:", error);
      throw error;
    }
  },
};

export default IncendioService;
