// src/routes/HomeRoutes.js
import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Steppers from '../components/steppers';
import RequireAuth from '../services/RoutesService/RequireAuth';
import ProductListCards from '../components/Quoter/productListCards';


const HomePage = lazy(() => import('../pages/HomePage'));

const QuoterRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<RequireAuth> <HomePage /> </RequireAuth>} />
      <Route path="/Pymes/stepper" element={<RequireAuth> <Steppers /> </RequireAuth>} />
      <Route path="*" element={<NotFound />} />


      <Route path="/Pymes/stepper/product" element={<RequireAuth> <ProductListCards /> </RequireAuth>} />

      <Route path="/quoter/*" element={<RequireAuth> <QuoterRoutes /> </RequireAuth> } />

    </Routes>
  );
};

export default QuoterRoutes;
