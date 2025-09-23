import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './page/Dashboard';
import Loyout from './components/Loyout';
import Users from './page/Users';
import Statistica from './page/Statistica';
import Companiya from './page/Companiya';
import AdminControll from './page/AdminControll';
import Ombor from './page/Ombor';
import Notifications from './page/Notifications';
import HelpCenter from './page/Help Center';
import Login from './page/Login';
import Product from './page/Product';

export default function App() {
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/loyout" element={<Loyout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="analytics" element={<Statistica />} />
            <Route path="companiya" element={<Companiya />} />
            <Route path="admincontrollers" element={<AdminControll />} />
            <Route path="ombor" element={<Ombor />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="help_centr" element={<HelpCenter />} />
            <Route path="product" element={<Product />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}
