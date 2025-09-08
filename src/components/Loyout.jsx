import React from 'react'
import Saidebar from './Saidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'

export default function Loyout() {
  return (
    <div className="layout">
      <Saidebar/>
      <div className="content">
        <header className="header">
        </header>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
