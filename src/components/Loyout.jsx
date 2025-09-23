import React from 'react'
import Saidebar from './Saidebar'
import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Loyout() {
  return (
    <div className="layout">
      <Saidebar/>
      <div className="content">
        <header className="header">
          <Header/>
        </header>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
