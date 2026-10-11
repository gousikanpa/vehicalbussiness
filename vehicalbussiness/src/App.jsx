import React from 'react'
import "./App.css"


import Dashboard from "./Pages/Dashboard";
import Vehical from "./Pages/Vehical";
import Income from "./Pages/Income";
import Expense from "./Pages/Expense";
import Maintanance from "./Pages/Maintanance";
import Reports from "./Pages/Reports";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Slidebar from "./Component/Slidebar";
const App = () => {
  return (
<>
<BrowserRouter>
    <div className="app-layout">
        <Slidebar />

        <main className="main-content">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/vehicles" element={<Vehical />} />
                <Route path="/income" element={<Income />} />
                <Route path="/expense" element={<Expense />} />
                <Route path="/maintenance" element={<Maintanance />} />
                <Route path="/reports" element={<Reports />} />
            </Routes>
        </main>
    </div>
</BrowserRouter>
    </>
  )
}

export default App