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


}

export default LifeService;
