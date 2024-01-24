import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { TOKEN_STORAGE_KEY , USER_STORAGE_KEY } from './authServices'; // Asegúrate de importar authService correctamente

export const AuthContext = React.createContext({
    user: null, // Proporciona una estructura inicial
    signin: () => { },
    signout: () => { },
    isLoading:false,
    menu: null,
});

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        console.log('context undefined');
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  }

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [menu, setMenu] = useState(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // Intentar recuperar el token y la información del usuario al cargar la aplicación
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem(TOKEN_STORAGE_KEY);
            if (token) {
                setIsLoading(false);
                try {
                    //Aquí puedes llamar a un endpoint que valide el token y devuelva información del usuario
                    const user = localStorage.getItem(USER_STORAGE_KEY);
                    const menu = localStorage.getItem('menu');
                    //const userData = await authService.fetchWithAuth('user_info_endpoint');
                    setUser(user);
                    setMenu(menu);
                    AuthContext.user = user;
                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(false);
                    console.error('Error al validar el token:', error);
                }
            } else {
                console.log('No encontro token');
                setIsLoading(false);
                navigate('/login');
                setUser('');
            }
        };
        initializeAuth();
    }, []);

    // Iniciar sesión y actualizar el estado del usuario
    const signin = async (endpoint, method, data, additionalHeaders) => {
        setIsLoading(true);
        try {
            const userData = await authService.fetchWithAuth(endpoint, method, data, additionalHeaders);
            if(userData.codigo===200){
                localStorage.setItem('authToken', userData.token);
                localStorage.setItem('user',JSON.stringify (userData.data.usuario) );
                localStorage.setItem('menu',JSON.stringify (userData.data.menu) );
                setUser(userData); // Asumiendo que la información del usuario viene en la respuesta
                setMenu(JSON.stringify (userData.data.menu));
                navigate('/quoter/dashboard');
                setIsLoading(false);
            }else{
                navigate('/login');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setIsLoading(false);
        }
    };

    // Cerrar sesión y eliminar el estado del usuario
    const signout = async (endpoint, method) => {
        setIsLoading(true);
        const userData = await authService.fetchWithAuth(endpoint, method);
        if(userData.codigo===200){
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
            localStorage.removeItem('menu');
            setUser(null); // Asumiendo que la información del usuario viene en la respuesta
            setMenu(null);
            setIsLoading(false);
        }else{
            setIsLoading(false);
        }
    };

    const value = { user, signin, signout,isLoading,menu };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
