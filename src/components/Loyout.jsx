import React, { useState } from 'react'   // 🔹 useState ni import qilish kerak
import Saidebar from './Saidebar'
import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Loyout() {
  const [search, setSearch] = useState('')

  return (
    <div className="layout">
      <Saidebar />
      <div className="content">
        <header className="header">
          <Header search={search} setSearch={setSearch} />
        </header>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
