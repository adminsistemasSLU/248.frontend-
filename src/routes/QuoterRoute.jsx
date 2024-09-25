// src/routes/HomeRoutes.js
import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Steppers from '../components/steppers';
import RequireAuth from '../services/RoutesService/RequireAuth';
import MyQuoters from '../modules/Quoter/myQuoters';
import PaymentMethods from '../components/QuoterPymes/paymentMethods';
import SteppersLife from '../components/QuoterLife/steppersLife';
import SteppersCar from '../components/QuoterCar/steppersCar';

const HomePage = lazy(() => import('../pages/HomePage'));

const QuoterRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<RequireAuth> <HomePage /> </RequireAuth>} />
      <Route path="*" element={<NotFound />} />

      <Route path="/Life" element={<RequireAuth requiredBaldosaId="3"> <SteppersLife /> </RequireAuth>} />

      <Route path="/Pymes" element={<RequireAuth requiredBaldosaId="2"> <Steppers /> </RequireAuth>} />

      <Route path="/car" element={<RequireAuth requiredBaldosaId="1"> <SteppersCar /> </RequireAuth>} />

      <Route path="/Pymes/MyQuotes" element={<RequireAuth> <MyQuoters /> </RequireAuth>} />
      <Route path="/Pymes/product" element={<RequireAuth> <PaymentMethods /> </RequireAuth>} />
      <Route path="/quoter/*" element={<RequireAuth> <QuoterRoutes /> </RequireAuth> } />

    </Routes>
  );
};

export default QuoterRoutes;
