// src/routes/HomeRoutes.js
import React, { lazy } from 'react';
import { Route, Routes  } from 'react-router-dom';
import NotFound from '../pages/NotFound';

const HomePage = lazy(() => import('../pages/HomePage'));
const Login = lazy(() => import('../modules/Register/Login'));
const Register = lazy(() => import('../modules/Register/Register'));
const HomeRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<HomePage />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default HomeRoutes;
