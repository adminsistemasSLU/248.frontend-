// src/routes/HomeRoutes.js
import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Steppers from '../components/steppers';
import RequireAuth from '../services/RoutesService/RequireAuth';
import ProtectObjectsTable from '../components/Quoter/protectObjectsTable';
import PaidForm from '../components/Quoter/paidForm';
import MyQuoters from '../modules/Quoter/myQuoters';
import DetailObjectsTable from '../components/Quoter/detailObjectsTable';
import BranchInsurance from '../components/Quoter/branchInsurance';
  


const HomePage = lazy(() => import('../pages/HomePage'));

const QuoterRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<RequireAuth> <HomePage /> </RequireAuth>} />
      <Route path="/Pymes" element={<RequireAuth> <Steppers /> </RequireAuth>} />
      <Route path="*" element={<NotFound />} />

      <Route path="/Pymes/MyQuotes" element={<RequireAuth> <MyQuoters /> </RequireAuth>} />
      <Route path="/Pymes/product" element={<RequireAuth> <BranchInsurance /> </RequireAuth>} />

      <Route path="/quoter/*" element={<RequireAuth> <QuoterRoutes /> </RequireAuth> } />

    </Routes>
  );
};

export default QuoterRoutes;
