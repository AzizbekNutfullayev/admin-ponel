import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './page/Dashboard'
import Loyout from './components/Loyout'
import Settings from './page/Settings'
import Users from './page/Users'
import Statistica from './page/Statistica'
import Companiya from './page/Companiya'
import AdminControll from './page/AdminControll'
import Ombor from './page/Ombor'

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Loyout />} >
            <Route path="settings" element={<Settings />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="analytics" element={<Statistica />} />
            <Route path="analytics" element={<Statistica />} />
            <Route path="companiya" element={<Companiya />} />
            <Route path="admincontrollers" element={<AdminControll />} />
            <Route path="ombor" element={<Ombor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
