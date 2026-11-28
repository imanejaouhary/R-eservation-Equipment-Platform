import { useState } from 'react'
import { Search, MapPin, Calendar, ChevronDown, Tractor, Sparkles } from 'lucide-react'

const MACHINE_TYPES = [
  { value: 'ALL', label: 'All machines' },
  { value: 'TRACTOR', label: 'Tractors' },
  { value: 'HARVESTER', label: 'Combine harvesters' },
  { value: 'SEEDER', label: 'Seed drills' },
  { value: 'SPRAYER', label: 'Sprayers' },
  { value: 'BALER', label: 'Balers' },
  { value: 'PLOW', label: 'Ploughs' },
  { value: 'TRAILER', label: 'Trailers' },
]

export default function HeroSection({ onSearch, initialStartDate, initialEndDate }) {
  const [location, setLocation] = useState('Chartres, Eure-et-Loir')
  const [startDate, setStartDate] = useState(initialStartDate || '')
  const [endDate, setEndDate] = useState(initialEndDate || '')
  const [machineType, setMachineType] = useState('ALL')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch({ location, startDate, endDate, machineType })
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2">
      <div className="relative rounded-2xl bg-gradient-to-br from-[#1F6F3D] via-[#1B5E34] to-[#144726] hero-stripes px-6 sm:px-10 py-8 sm:py-10 shadow-lg overflow-hidden">
        {/* Top Row: Badge + Title + Stats */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-7">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-xs text-emerald-100 text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-white/15 mb-4">
              <Sparkles size={11} className="text-amber-300" />
              Harvest Season 2025
            </div>
            <h1 className="font-display text-white text-3xl sm:text-4xl font-extrabold leading-[1.12] tracking-tight">
              Reserve the right machine,
              <br />
              right when your fields need it.
            </h1>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 shrink-0 pb-1">
            <div>
              <div className="font-display text-white text-2xl font-bold leading-none">
                3,200<span className="text-amber-300">+</span>
              </div>
              <div className="text-emerald-100/80 text-xs mt-1">machines nearby</div>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div>
              <div className="font-display text-white text-2xl font-bold leading-none">
                4.8<span className="text-emerald-200/70 text-base font-medium">/5</span>
              </div>
              <div className="text-emerald-100/80 text-xs mt-1">from 18k farmers</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-1.5 shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center gap-1"
        >
          {/* Farm Location */}
          <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-gray-50/80 transition-colors">
            <MapPin size={17} className="text-[#1B6B3A] shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Farm location
              </label>
              <input
                type="text"
                placeholder="City, region or postal code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm font-medium text-gray-900 placeholder-gray-400 bg-transparent outline-none truncate"
              />
            </div>
          </div>

          <div className="hidden lg:block w-px h-8 bg-gray-200" />

          {/* Rental Dates */}
          <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-gray-50/80 transition-colors">
            <Calendar size={17} className="text-[#1B6B3A] shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Rental dates
              </label>
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent outline-none text-xs sm:text-sm text-gray-800 w-full cursor-pointer"
                />
                <span className="text-gray-400">–</span>
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent outline-none text-xs sm:text-sm text-gray-800 w-full cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-px h-8 bg-gray-200" />

          {/* Machine Type */}
          <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-gray-50/80 transition-colors">
            <Tractor size={17} className="text-[#1B6B3A] shrink-0" />
            <div className="flex-1 min-w-0 relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Machine type
              </label>
              <select
                value={machineType}
                onChange={(e) => setMachineType(e.target.value)}
                className="w-full text-sm font-medium text-gray-900 bg-transparent outline-none appearance-none cursor-pointer pr-5"
              >
                {MACHINE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 bottom-0.5 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-[#DDA135] hover:bg-[#C98E24] active:scale-[0.99] text-gray-950 font-semibold text-sm px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-xs"
          >
            <Search size={16} />
            Search
          </button>
        </form>
      </div>
    </section>
  )
}
