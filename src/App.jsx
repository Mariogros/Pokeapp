import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './components/Landing.jsx'
import PokeGrid from './components/PokeGrid.jsx'
import Pokedex from './components/Pokedex.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/grid" element={<PokeGrid />} />
      <Route path="/pokedex/:name" element={<Pokedex />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
