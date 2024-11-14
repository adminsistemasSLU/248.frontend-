import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from './authServices'; // Asegúrate de importar authService correctamente
import {
    TOKEN_STORAGE_KEY, USER_STORAGE_KEY, MENU_STORAGE_KEY, PARAMETROS_STORAGE_KEY, PARAMETROS_RAMO_STORAGE_KEY,
    PERMISSIONS_STORAGE_KEY, DATOS_AGENTES,
    USERS_FEATURES_STORAGE_KEY,
} from '../utils/constantes';

export const AuthContext = React.createContext({
    user: null, // Proporciona una estructura inicial
    signin: () => { },
    signout: () => { },
    isLoading: false,
    menu: null,
});

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
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
            if (userData.codigo === 200) {
                localStorage.setItem(TOKEN_STORAGE_KEY, userData.token);
                console.log(userData);
                if (userData.data && userData.data.ramoRol && userData.data.ramoRol.ramo_rol) {
                    localStorage.setItem(PERMISSIONS_STORAGE_KEY, userData.data.ramoRol.ramo_rol);
                }
                if (userData.data && userData.data.ramoTipo) {
                    localStorage.setItem(USERS_FEATURES_STORAGE_KEY, userData.data.ramoTipo);
                }
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData.data.usuario));
                localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(userData.data.menu));
                localStorage.setItem(PARAMETROS_STORAGE_KEY, JSON.stringify(userData.data.parametros));
                localStorage.setItem(PARAMETROS_RAMO_STORAGE_KEY, JSON.stringify(userData.data.parametros_ramo));
                setUser(userData); // Asumiendo que la información del usuario viene en la respuesta
                setMenu(JSON.stringify(userData.data.menu));

                getAgentes(userData.data.usuario)


                const fechaIni = new Date(userData.data.usuario.usu_fech_ult_passwd); // Supongo que esta es la fecha de la última contraseña
                const fechaHoy = new Date();

                // Calcular la diferencia en días
                const diffTime = Math.abs(fechaHoy - fechaIni);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convertir de milisegundos a días

                if (diffDays <= 90) {
                    sessionStorage.setItem('new_password', 'N');
                    navigate('/quoter/dashboard');
                } else {
                    sessionStorage.setItem('new_password', 'S');
                    navigate('/changePassword'); 
                }

               
                setIsLoading(false);
            } else {
                navigate('/login');
                setIsLoading(false);
                return userData;
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setIsLoading(false);
        }
    };

    const getAgentes = (usuario) => {
        localStorage.removeItem(DATOS_AGENTES);
        if (usuario && usuario.tip_usuario === "I") {
            const list_agentes = usuario.arrAgente;
            if (Array.isArray(list_agentes) && list_agentes.length > 0) {
                localStorage.setItem(DATOS_AGENTES, JSON.stringify(list_agentes));
            }
        }
    };

    // Cerrar sesión y eliminar el estado del usuario
    const signout = async (endpoint, method) => {
        setIsLoading(true);
        const userData = await authService.fetchWithAuth(endpoint, method);
        if (userData.codigo === 200) {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
            localStorage.removeItem('menu');
            localStorage.clear();
            setUser(null); // Asumiendo que la información del usuario viene en la respuesta
            setMenu(null);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };

    const value = { user, signin, signout, isLoading, menu };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
