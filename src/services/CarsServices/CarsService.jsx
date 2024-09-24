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
      console.error("Error fetching Grabare Vida Producto:", error);
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
}
export default CarsService;