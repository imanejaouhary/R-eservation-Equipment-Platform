import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Truck,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameDay,
  isWithinInterval,
  isBefore,
  differenceInCalendarDays,
  startOfDay,
} from 'date-fns'
import { reservationApi } from '../api/reservationApi'
import { CATEGORY_LABELS, getEquipmentImage } from '../data/equipmentAssets'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
        checked ? 'bg-[#1B6B3A]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default function ReservationSidebar({
  equipment,
  startDate,
  endDate,
  onDatesChange,
}) {
  const navigate = useNavigate()
  const [currentMonth, setCurrentMonth] = useState(
    () => startDate || new Date()
  )
  const [withOperator, setWithOperator] = useState(true)
  const [withDelivery, setWithDelivery] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  // Convert Sunday=0..Saturday=6 to Monday=0..Sunday=6
  const leadingEmpty = (getDay(monthStart) + 6) % 7
  const today = startOfDay(new Date())

  const handleDayClick = (day) => {
    if (isBefore(day, today)) return
    setSuccessMsg(null)
    setErrorMsg(null)

    if (!startDate || (startDate && endDate)) {
      onDatesChange(day, null)
    } else if (isBefore(day, startDate)) {
      onDatesChange(day, startDate)
    } else if (isSameDay(day, startDate)) {
      onDatesChange(day, day)
    } else {
      onDatesChange(startDate, day)
    }
  }

  const days =
    startDate && endDate
      ? Math.max(1, differenceInCalendarDays(endDate, startDate) + 1)
      : startDate
      ? 1
      : 0

  const pricePerDay = equipment?.pricePerDay ?? 0
  const equipmentCost = pricePerDay * days
  const operatorCost = withOperator ? 180 * days : 0
  const deliveryCost = withDelivery ? 95 : 0
  const subtotal = equipmentCost + operatorCost + deliveryCost
  const serviceFee = Math.round(subtotal * 0.05)
  const total = subtotal + serviceFee

  const handleReserve = async () => {
    if (!equipment) return
    if (!startDate) {
      setErrorMsg('Select your rental dates on the calendar.')
      return
    }
    const effectiveEnd = endDate || startDate

    setSubmitting(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const payload = {
        userId: 1,
        equipmentId: equipment.id,
        startDate: `${format(startDate, 'yyyy-MM-dd')}T08:00:00`,
        endDate: `${format(effectiveEnd, 'yyyy-MM-dd')}T18:00:00`,
        notes: [
          withOperator ? 'With certified operator' : null,
          withDelivery ? 'Delivery to farm' : null,
        ]
          .filter(Boolean)
          .join(' · ') || 'Standard rental',
      }
      const createRes = await reservationApi.createReservation(payload)
      const reservationId = createRes.data?.id

      if (reservationId) {
        await reservationApi.confirmReservation(reservationId, {
          paymentMethod: 'CARD',
        })
      }

      setSuccessMsg(
        `Booked! Reservation #${reservationId ?? ''} confirmed.`
      )
    } catch (err) {
      const apiMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        err.response?.data?.error
      setErrorMsg(
        apiMsg ||
          'Backend unavailable or booking failed. Start Docker services on port 8080 to confirm live.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!equipment) return null

  const dateRangeLabel =
    startDate && endDate
      ? `${format(startDate, 'd')} – ${format(endDate, 'd MMM')}`
      : startDate
      ? format(startDate, 'd MMM')
      : 'Select dates'

  return (
    <aside className="space-y-3 lg:sticky lg:top-20">
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5">
        {/* Selected Equipment Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <img
            src={getEquipmentImage(equipment)}
            alt={equipment.name}
            className="w-14 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Your reservation
            </div>
            <button
              type="button"
              onClick={() => navigate(`/equipments/${equipment.id}`)}
              className="font-display font-bold text-gray-900 text-sm truncate block hover:text-[#1B6B3A] transition-colors cursor-pointer text-left w-full"
            >
              {equipment.name}
            </button>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5 truncate">
              <span>{CATEGORY_LABELS[equipment.category] || equipment.category}</span>
              {equipment.horsePower && (
                <>
                  <span>·</span>
                  <span>{equipment.horsePower} HP</span>
                </>
              )}
              <span>·</span>
              <span className="inline-flex items-center gap-0.5 text-gray-700 font-medium">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                {equipment.rating ?? '4.9'}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Month Calendar */}
        <div className="py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-[11px] font-medium text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {Array.from({ length: leadingEmpty }).map((_, idx) => (
              <div key={`empty-${idx}`} />
            ))}
            {daysInMonth.map((day) => {
              const isPast = isBefore(day, today)
              const isStart = startDate && isSameDay(day, startDate)
              const isEnd = endDate && isSameDay(day, endDate)
              const inRange =
                startDate &&
                endDate &&
                isWithinInterval(day, { start: startDate, end: endDate }) &&
                !isStart &&
                !isEnd

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleDayClick(day)}
                  className={`h-8 w-full text-xs font-medium transition-all flex items-center justify-center ${
                    isPast
                      ? 'text-gray-300 cursor-not-allowed'
                      : isStart || isEnd
                      ? 'bg-[#1B6B3A] text-white font-bold rounded-lg shadow-2xs cursor-pointer'
                      : inRange
                      ? 'bg-[#E6F4EA] text-[#1B6B3A] font-semibold cursor-pointer'
                      : 'text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer'
                  }`}
                >
                  {format(day, 'd')}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-[#1B6B3A]" />
              Selected
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-gray-200" />
              Unavailable
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs border border-gray-300 bg-white" />
              Available
            </span>
          </div>
        </div>

        {/* Options Toggles */}
        <div className="py-4 space-y-3 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EDF7F0] text-[#1B6B3A] flex items-center justify-center shrink-0">
                <UserCheck size={15} />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-900">
                  With certified operator
                </div>
                <div className="text-[11px] text-gray-500">+€180 / day</div>
              </div>
            </div>
            <Toggle checked={withOperator} onChange={setWithOperator} />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EDF7F0] text-[#1B6B3A] flex items-center justify-center shrink-0">
                <Truck size={15} />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-900">
                  Delivery to my farm
                </div>
                <div className="text-[11px] text-gray-500">Round trip · €95 flat</div>
              </div>
            </div>
            <Toggle checked={withDelivery} onChange={setWithDelivery} />
          </div>

          <div className="flex items-center gap-2 bg-[#EDF7F0] text-[#1B6B3A] text-[11px] font-medium px-3 py-2 rounded-xl">
            <ShieldCheck size={14} className="shrink-0" />
            <span>Breakdown &amp; damage insurance included on every booking</span>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="py-4 space-y-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>
              €{pricePerDay} × {days} {days === 1 ? 'day' : 'days'}
            </span>
            <span className="font-medium text-gray-900">€{equipmentCost.toLocaleString()}</span>
          </div>
          {withOperator && days > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>
                Operator · {days} {days === 1 ? 'day' : 'days'}
              </span>
              <span className="font-medium text-gray-900">€{operatorCost.toLocaleString()}</span>
            </div>
          )}
          {withDelivery && days > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Farm delivery</span>
              <span className="font-medium text-gray-900">€{deliveryCost}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Service fee (5%)</span>
            <span className="font-medium text-gray-900">€{serviceFee}</span>
          </div>
          <div className="flex items-baseline justify-between pt-2.5 border-t border-gray-100">
            <div>
              <div className="font-display font-bold text-sm text-gray-900">Total</div>
              <div className="text-[10px] text-gray-400">VAT included</div>
            </div>
            <div className="font-display font-extrabold text-xl text-gray-900">
              €{total.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="flex items-start gap-2 bg-[#EDF7F0] text-[#1B6B3A] border border-emerald-200 rounded-xl p-3 mb-3 text-xs font-medium">
            <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="flex items-start gap-2 bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 mb-3 text-xs">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Reserve CTA */}
        <button
          type="button"
          onClick={handleReserve}
          disabled={submitting || !equipment.isAvailable}
          className="w-full bg-[#1B6B3A] hover:bg-[#15572F] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Confirming…
            </>
          ) : (
            <>Reserve {dateRangeLabel} →</>
          )}
        </button>

        <p className="text-[11px] text-gray-400 text-center mt-2.5">
          You won&apos;t be charged until the owner confirms.
        </p>
      </div>

      {/* Free cancellation note */}
      <div className="bg-[#FDF8EC] border border-[#F3E3BD] rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-gray-700">
        <div className="w-6 h-6 rounded-full bg-[#F5E6C4] text-[#9A6B16] flex items-center justify-center shrink-0 mt-0.5">
          <RotateCcw size={12} />
        </div>
        <p className="leading-relaxed">
          <span className="font-semibold text-gray-900">Free cancellation</span> up to 48 h before
          pickup. Weather-related delays? Reschedule at no cost.
        </p>
      </div>
    </aside>
  )
}
