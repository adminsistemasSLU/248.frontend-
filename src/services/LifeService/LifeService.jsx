import authService from "../authServices";

const LifeService = {
  fetchVidaProducto: async (ramo, producto, ciudad) => {
    const endpoint = "api/vida/Producto";
    const method = "POST";
    const data = {
      ramo: ramo,
      producto: producto,
      tipPoliza: 1, // nuevo
      action: "cargaListas",// constasnte
      UsoZona: "G"// ciudad
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Vida Producto:", error);
      throw error;
    }
  },


  fetchTablaPeriodo: async (ramo, producto, tip_monto, vigencia, fechadesde) => {
    const endpoint = "api/vida/TraertablaPeriodo";
    const method = "POST";
    const data = {
      ramoOri: ramo,
      producto: producto,
      ramoAlt: ramo,
      tip_monto: tip_monto,
      tasainteres: 0,// constasnte
      zona: "G",// ciudad
      vigencia: vigencia,
      fechadesde: fechadesde
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Vida Producto:", error);
      throw error;
    }
  },

  fetchActualizaDocumento: async (ramo, producto, tip_monto, fechaNac, vigencia_desde, vigencia_hasta, monto, minVigencia) => {
    const endpoint = "api/vida/documentosReqAsegurado";
    const method = "POST";
    const data = {
      ramo: ramo,
      ramoOri: ramo,
      producto: producto,
      tipoPrestamo: tip_monto,
      vigencia_desde: vigencia_desde,
      vigencia_hasta: vigencia_hasta,
      fechaNac: fechaNac,// constasnte
      monto: monto,// ciudad
      minVigencia: minVigencia,
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

  fetchConsultarPolizaVida: async (ramo, coti_general, producto) => {
    const endpoint = "api/vida/ConPolizaVida";
    const method = "POST";
    const data = {
      ramo: ramo,
      id_cotiGeneral: coti_general,
      producto: producto
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Consulta Vida Producto:", error);
      throw error;
    }
  },

  fetchVerificaPrestamo: async (producto, numPrestamo,idcotizacion) => {
    const endpoint = "api/vida/consultaNumeroPrestamo";
    const method = "POST";
    const data = {
      Nprestamo: numPrestamo,
      producto: producto,
      idCotizacion:idcotizacion
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Consulta Numero de Prestamo:", error);
      throw error;
    }
  },

  fetchEmitirCertificado: async (idcotizacion) => {
    const endpoint = "api/vida/emitirCertificado";
    const method = "POST";
    const data = {
      idCotizacion:idcotizacion
    };
    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Consulta Numero de Prestamo:", error);
      throw error;
    }
  },


  fetchPrevizualizarPDFCertificado: async (producto,idcotizacion,tipo_Solicitud) => {
    const endpoint = "api/vida/PrevisualizarPDFVidaCertificado";
    const method = "POST";
    const data = {
      producto: producto,
      id_CotiGeneral:idcotizacion,
      tipo_Solicitud:tipo_Solicitud
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      console.log(response);
      if (response.codigo===200 && response.data) {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
        
        const pdfBlobDeclaracionSalud = base64ToBlob(response.data.archivoBase64_2, 'application/pdf');
        const downloadUrlDeclaracionSalud = window.URL.createObjectURL(pdfBlobDeclaracionSalud);
        const linkDeclaracionSalud = document.createElement("a");
        linkDeclaracionSalud.href = downloadUrlDeclaracionSalud;
        const fileName = `${tipo_Solicitud} - ${formattedDate}_${formattedTime}.pdf`;
        linkDeclaracionSalud.setAttribute("download", fileName);document.body.appendChild(linkDeclaracionSalud);
        linkDeclaracionSalud.click();
        linkDeclaracionSalud.remove();

      } else {
        console.error("Error en la respuesta del servidor:", response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Error fetching Previsualizar pdf:", error);
      throw error;
    }
  },

  fetchPrevizualizarPDFFormulario: async (producto,idcotizacion) => {
    const endpoint = "api/vida/PrevisualizarPDFVidaFormulario";
    const method = "POST";
    const data = {
      producto: producto,
      id_CotiGeneral:idcotizacion
    };

    try {
      const response = await authService.fetchWithAuth(endpoint, method, data);
      if (response.codigo===200 && response.data) {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
        const fileName = `reporteCotizacionVida_${formattedDate}_${formattedTime}.pdf`; 
        const pdfBlob = base64ToBlob(response.data.archivoBase64, 'application/pdf');
        const downloadUrl = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", fileName); // O cualquier otro nombre de archivo
        document.body.appendChild(link);
        link.click();
        link.remove(); // Limpiar el enlace temporal

      } else {
        console.error("Error en la respuesta del servidor:", response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Error fetching Previsualizar pdf:", error);
      throw error;
    }
  },

}

function base64ToBlob(base64, type = 'application/octet-stream') {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], {type: type});
}

export default LifeService;
