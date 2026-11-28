import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import EquipmentDetail from './pages/EquipmentDetail'
import MyReservations from './pages/MyReservations'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/equipments/:id" element={<EquipmentDetail />} />
        <Route path="/my-reservations" element={<MyReservations />} />
      </Routes>
    </BrowserRouter>
  )
}
