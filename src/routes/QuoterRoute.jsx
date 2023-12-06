// src/routes/HomeRoutes.js
import React, { lazy } from 'react';
import { Route, Routes  } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Steppers from '../components/steppers';


const HomePage = lazy(() => import('../pages/HomePage'));

const QuoterRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<HomePage />} />
      <Route path="stepper" element={<Steppers />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default QuoterRoutes;
