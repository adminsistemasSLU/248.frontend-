// src/routes/HomeRoutes.js
import React, { lazy } from 'react';
import { Route, Routes  } from 'react-router-dom';
import NotFound from '../pages/NotFound';


const HomePage = lazy(() => import('../pages/HomePage'));
const BrockerRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<HomePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default BrockerRoutes;