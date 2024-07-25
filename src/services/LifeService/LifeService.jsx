import authService from "../authServices";

const LifeService = {
  fetchVidaProducto: async (ramo, producto) => {
    const endpoint = "api/vida/Producto";
    const method = "POST";
    const data = {
      ramo: ramo,
      producto: producto,
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Vida Producto:", error);
      throw error;
    }
  },


}

export default LifeService;
