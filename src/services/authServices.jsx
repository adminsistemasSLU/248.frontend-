// authService.js
const API_URL = process.env.REACT_APP_API_URL || 'default_url';

const authService = {
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token, permissions } = await response.json();
        return { token, permissions };
      } else {
        // Manejar errores de autenticación
        console.error('Error de autenticación');
        return null;
      }
    } catch (error) {
      console.error('Error de red:', error);
      return null;
    }   
  },
};

export default authService;
