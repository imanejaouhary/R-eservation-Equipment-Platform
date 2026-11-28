import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reservationApi } from '../api/reservationApi'
import Layout from '../components/Layout'
import {
  Calendar,
  Loader2,
  AlertCircle,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Archive,
  Tractor,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    classes: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: <Clock size={12} />,
  },
  CONFIRMED: {
    label: 'Confirmed',
    classes: 'bg-[#EDF7F0] text-[#1B6B3A] border-emerald-200',
    icon: <CheckCircle2 size={12} />,
  },
  CANCELLED: {
    label: 'Cancelled',
    classes: 'bg-red-50 text-red-700 border-red-200',
    icon: <XCircle size={12} />,
  },
  COMPLETED: {
    label: 'Completed',
    classes: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: <Archive size={12} />,
  },
}

const CURRENT_USER_ID = 1

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${cfg.classes}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export default function MyReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    reservationApi
      .getReservationsByUser(CURRENT_USER_ID)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.content ?? []
        setReservations(data)
      })
      .catch(() =>
        setError('Could not load reservations. Make sure the backend API Gateway (port 8080) is running.')
      )
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id) => {
    setCancellingId(id)
    setError(null)
    try {
      const res = await reservationApi.cancelReservation(id)
      const updated = res.data
      setReservations((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: updated?.status || 'CANCELLED' } : item
        )
      )
    } catch (err) {
      setError(err.response?.data?.message || `Could not cancel reservation #${id}.`)
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-gray-900">
              My bookings
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Track and manage all your agricultural equipment reservations
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-[#1B6B3A] hover:bg-[#15572F] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            + New booking
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#1B6B3A]" size={32} />
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-white border border-red-200 text-red-700 rounded-2xl p-5 shadow-2xs">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Connection unavailable</p>
              <p className="text-xs text-gray-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && reservations.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200/90 p-12 text-center shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#EDF7F0] text-[#1B6B3A] flex items-center justify-center mx-auto mb-3">
              <Tractor size={24} />
            </div>
            <h3 className="font-display text-lg font-bold text-gray-900">
              No bookings yet
            </h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Explore available tractors, harvesters, and implements near your farm.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-[#1B6B3A] hover:bg-[#15572F] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Explore machines
            </button>
          </div>
        )}

        {!loading && !error && reservations.length > 0 && (
          <div className="space-y-3">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md transition-shadow p-5"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap mb-3">
                      <span className="font-display font-bold text-gray-900 text-sm">
                        Reservation #{res.id}
                      </span>
                      <StatusBadge status={res.status} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Tractor size={15} className="text-[#1B6B3A] shrink-0" />
                        <div>
                          <div className="text-[11px] text-gray-400">Equipment</div>
                          <div className="font-semibold text-gray-900">
                            Machine #{res.equipmentId}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={15} className="text-[#1B6B3A] shrink-0" />
                        <div>
                          <div className="text-[11px] text-gray-400">Rental period</div>
                          <div className="font-semibold text-gray-900">
                            {formatDate(res.startDate)} → {formatDate(res.endDate)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-gray-400">Total price</div>
                        <div className="font-display font-extrabold text-[#1B6B3A] text-sm">
                          {res.totalPrice != null ? `€${res.totalPrice}` : '—'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {(res.status === 'PENDING' || res.status === 'CONFIRMED') && (
                      <button
                        type="button"
                        onClick={() => handleCancel(res.id)}
                        disabled={cancellingId === res.id}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {cancellingId === res.id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <XCircle size={13} />
                        )}
                        Cancel
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => navigate(`/equipments/${res.equipmentId}`)}
                      className="inline-flex items-center gap-1 text-[#1B6B3A] hover:text-[#15572F] font-semibold text-xs transition-colors cursor-pointer"
                    >
                      View machine
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
