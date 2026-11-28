import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { equipmentApi } from '../api/equipmentApi'
import Layout from '../components/Layout'
import ReservationSidebar from '../components/ReservationSidebar'
import {
  SHOWCASE_EQUIPMENTS,
  CATEGORY_LABELS,
  getEquipmentImage,
} from '../data/equipmentAssets'
import {
  ChevronLeft,
  MapPin,
  Star,
  Zap,
  ShieldCheck,
  Calendar,
  Tractor,
} from 'lucide-react'
import { addDays } from 'date-fns'

export default function EquipmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [equipment, setEquipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState(() => addDays(new Date(), 1))
  const [endDate, setEndDate] = useState(() => addDays(new Date(), 4))

  useEffect(() => {
    let active = true
    setLoading(true)
    equipmentApi
      .getEquipmentById(id)
      .then((res) => {
        if (!active) return
        setEquipment(res.data)
      })
      .catch(() => {
        if (!active) return
        const fallback =
          SHOWCASE_EQUIPMENTS.find((e) => String(e.id) === String(id)) ||
          SHOWCASE_EQUIPMENTS[0]
        setEquipment(fallback)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="h-96 bg-white rounded-2xl border border-gray-200 animate-pulse" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#1B6B3A] mb-5 transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          Back to explore
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Details */}
          <div className="lg:col-span-8 space-y-5">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video shadow-sm border border-gray-200/80">
              <img
                src={getEquipmentImage(equipment)}
                alt={equipment?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-white/95 backdrop-blur-xs text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                  {CATEGORY_LABELS[equipment?.category] || equipment?.category}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full shadow-xs ${
                    equipment?.isAvailable
                      ? 'bg-[#1B6B3A] text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {equipment?.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-gray-100">
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-gray-900">
                    {equipment?.name}
                  </h1>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} className="text-gray-400" />
                      {equipment?.location || 'Chartres · Eure-et-Loir'}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 text-gray-800 font-semibold">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      {equipment?.rating ?? '4.9'} ({equipment?.rentalsCount ?? 65} rentals)
                    </span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <div className="font-display text-3xl font-extrabold text-[#1B6B3A]">
                    €{equipment?.pricePerDay?.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">per day</div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 border-b border-gray-100">
                <div className="bg-[#F6F7F2] rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                    <Zap size={13} className="text-[#1B6B3A]" />
                    Power
                  </div>
                  <div className="font-semibold text-sm text-gray-900">
                    {equipment?.horsePower ? `${equipment.horsePower} HP` : '155 HP'}
                  </div>
                </div>
                <div className="bg-[#F6F7F2] rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                    <Calendar size={13} className="text-[#1B6B3A]" />
                    Year
                  </div>
                  <div className="font-semibold text-sm text-gray-900">
                    {equipment?.year || '2022'}
                  </div>
                </div>
                <div className="bg-[#F6F7F2] rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                    <Tractor size={13} className="text-[#1B6B3A]" />
                    Status
                  </div>
                  <div className="font-semibold text-sm text-gray-900">
                    {equipment?.status || 'OPERATIONAL'}
                  </div>
                </div>
                <div className="bg-[#F6F7F2] rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                    <ShieldCheck size={13} className="text-[#1B6B3A]" />
                    Insurance
                  </div>
                  <div className="font-semibold text-sm text-gray-900">Included</div>
                </div>
              </div>

              <div className="pt-5">
                <h3 className="font-display font-bold text-sm text-gray-900 mb-2">
                  Machine overview
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {equipment?.description ||
                    'Well-maintained agricultural machine ready for field operations. Full maintenance log verified, GPS guidance compatible, and available with certified operator or farm delivery.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Interactive Reservation Sidebar */}
          <div className="lg:col-span-4">
            <ReservationSidebar
              equipment={equipment}
              startDate={startDate}
              endDate={endDate}
              onDatesChange={(s, e) => {
                setStartDate(s)
                setEndDate(e)
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
