import authService from "../authServices";

const LifeService = {
  fetchVidaProducto: async (ramo, producto,ciudad) => {
    const endpoint = "api/vida/Producto";
    const method = "POST";
    const data = {
      ramo: ramo,
      producto: producto,
      tipPoliza:1, // nuevo
      action:"cargaListas",// constasnte
      UsoZona:"G"// ciudad
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Vida Producto:", error);
      throw error;
    }
  },


  fetchTablaPeriodo: async (ramo, producto,tip_monto,vigencia,fechadesde) => {
    const endpoint = "api/vida/TraertablaPeriodo";
    const method = "POST";
    const data = {
      ramoOri: ramo,
      producto: producto,
      ramoAlt:ramo,
      tip_monto:tip_monto,
      tasainteres:0,// constasnte
      zona:"G",// ciudad
      vigencia:vigencia,
      fechadesde:fechadesde
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Vida Producto:", error);
      throw error;
    }
  },

  fetchActualizaDocumento: async (ramo, producto,tip_monto,fechaNac,vigencia_desde,vigencia_hasta,monto,minVigencia) => {
    const endpoint = "api/vida/documentosReqAsegurado";
    const method = "POST";
    const data = {
      ramo:ramo,
      ramoOri: ramo,
      producto: producto,
      tipoPrestamo:tip_monto,
      vigencia_desde:vigencia_desde,
      vigencia_hasta:vigencia_hasta,
      fechaNac:fechaNac,// constasnte
      monto:monto,// ciudad
      minVigencia:minVigencia,
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Vida Producto:", error);
      throw error;
    }
  },

  fetchProcesaDatos: async (datos) => {
    const endpoint = "api/vida/procesarDatos";
    const method = "POST";
    const data = datos;

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Vida Producto:", error);
      throw error;
    }
  },

  fetchGrabaDatosVida: async (datos) => {
    const endpoint = "api/vida/grabarDatosVida";
    const method = "POST";
    const data = datos;

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Grabare Vida Producto:", error);
      throw error;
    }
  },

  fetchConsultarPolizaVida: async (ramo,coti_general,producto) => {
    const endpoint = "api/vida/ConPolizaVida";
    const method = "POST";
    const data = {
      ramo: ramo,
      id_cotiGeneral: coti_general,
      producto:producto
 };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Consulta Vida Producto:", error);
      throw error;
    }
  },

}

export default LifeService;
