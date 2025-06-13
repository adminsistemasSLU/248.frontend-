import authService from "../authServices";

const CarsService = {
  fetchGrabaDatosPersona: async (datos) => {
    const endpoint = "api/grabarCotizacionGeneral";
    const method = "POST";
    const data = datos;
  
    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Grabar Cotización:", error);
      throw error;
    }
  },
  
  fetchEditarDatosPersona: async (data) => {
    const idCotizacion = data.idCotizacion;
    const endpoint = `api/grabarCotizacionGeneral/${idCotizacion}`;
    const method = "PUT";
  
    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Editar Cotización:", error);
      throw error;
    }
  },
  
  fetchGrabaDatosCars: async (datos) => {
    const endpoint = "api/grabarCotizacionVehiculo";
    const method = "POST";
    const data = datos;

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Grabar Cars:", error);
      throw error;
    }
  },

    fetchGrabaDatosEditCars: async (datos) => {
    const endpoint = "api/grabarCotizacionEditVehiculo";
    const method = "POST";
    const data = datos;

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Grabar Cars:", error);
      throw error;
    }
  },

  
  fetchDetalleVehiculo: async (idCotizacion) => {
    if (!idCotizacion) {
      throw new Error("Se requiere idCotizacion para fetchDetalleVehiculo");
    }
    const endpoint = `api/consultaDetalleCotizacionVehiculo/${idCotizacion}`;
    const method = "GET";
  
    try {
      // Para GET no pases datos en el body
      const response = await authService.fetchWithAuth(endpoint, method);
      return response;
    } catch (error) {
      console.error("Error fetching detalle de vehículos:", error);
      throw error;
    }
  },  
}
export default CarsService;