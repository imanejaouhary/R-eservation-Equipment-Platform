import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { equipmentApi } from '../api/equipmentApi'
import Layout from '../components/Layout'
import HeroSection from '../components/HeroSection'
import ReservationSidebar from '../components/ReservationSidebar'
import {
  SHOWCASE_EQUIPMENTS,
  CATEGORY_LABELS,
  getEquipmentImage,
} from '../data/equipmentAssets'
import {
  Heart,
  MapPin,
  Star,
  Zap,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Check,
  X,
  ChevronDown,
} from 'lucide-react'
import { addDays, format, parseISO } from 'date-fns'

const CATEGORIES = [
  { id: 'ALL', label: 'All', count: 248 },
  { id: 'TRACTOR', label: 'Tractors', count: 82 },
  { id: 'HARVESTER', label: 'Combine harvesters', count: 27 },
  { id: 'SEEDER', label: 'Seed drills', count: 34 },
  { id: 'SPRAYER', label: 'Sprayers', count: 31 },
  { id: 'BALER', label: 'Balers', count: 22 },
  { id: 'PLOW', label: 'Ploughs', count: 25 },
  { id: 'TRAILER', label: 'Trailers', count: 17 },
]

function enrichEquipment(eq, idx) {
  const fallback = SHOWCASE_EQUIPMENTS[idx % SHOWCASE_EQUIPMENTS.length]
  return {
    ...fallback,
    ...eq,
    imageUrl: eq.imageUrl || getEquipmentImage(eq),
    specs:
      eq.specs ||
      [
        eq.horsePower ? `${eq.horsePower} HP` : null,
        eq.status === 'OPERATIONAL' ? 'Verified' : eq.status,
        eq.year ? String(eq.year) : null,
      ].filter(Boolean),
    availabilityNote: eq.isAvailable
      ? 'Available your dates'
      : 'Limited availability',
  }
}

function MachineCard({ eq, selected, favorite, onSelect, onToggleFavorite, onOpenDetail, listView }) {
  return (
    <article
      className={`bg-white rounded-2xl border transition-all overflow-hidden group ${
        selected
          ? 'border-[#1B6B3A] ring-2 ring-[#1B6B3A]/20 shadow-md'
          : 'border-gray-200/90 hover:border-gray-300 hover:shadow-md shadow-2xs'
      } ${listView ? 'flex flex-col sm:flex-row' : 'flex flex-col'}`}
    >
      {/* Photo */}
      <div
        onClick={onOpenDetail}
        className={`relative bg-gray-100 overflow-hidden cursor-pointer ${
          listView ? 'sm:w-64 h-48 sm:h-auto shrink-0' : 'h-48 w-full'
        }`}
      >
        <img
          src={getEquipmentImage(eq)}
          alt={eq.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 pointer-events-none" />

        {/* Top-left tags */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="bg-white/95 backdrop-blur-xs text-gray-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs">
            {CATEGORY_LABELS[eq.category] || eq.category}
          </span>
          {eq.instantBook && (
            <span className="bg-amber-300 text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-xs">
              <Zap size={10} className="fill-gray-900" />
              Instant book
            </span>
          )}
        </div>

        {/* Heart button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(eq.id)
          }}
          aria-label="Save machine"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-xs hover:scale-105 transition-transform cursor-pointer"
        >
          <Heart
            size={15}
            className={
              favorite ? 'text-rose-500 fill-rose-500' : 'text-gray-500'
            }
          />
        </button>

        {/* Bottom-left availability */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs ${
              eq.availabilityNote?.includes('Booked')
                ? 'bg-amber-950/85 text-amber-100'
                : 'bg-[#1B6B3A]/95 text-white'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                eq.availabilityNote?.includes('Booked')
                  ? 'bg-amber-400'
                  : 'bg-emerald-300'
              }`}
            />
            {eq.availabilityNote || 'Available your dates'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={onOpenDetail}
              className="font-display font-bold text-gray-900 text-base leading-snug hover:text-[#1B6B3A] transition-colors cursor-pointer"
            >
              {eq.name}
            </h3>
            <div className="text-right shrink-0">
              <div className="font-display font-extrabold text-gray-900 text-base leading-none">
                €{eq.pricePerDay?.toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">per day</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin size={12} className="text-gray-400 shrink-0" />
            <span className="truncate">{eq.location || 'Nearby farm'}</span>
          </div>

          {/* Spec chips */}
          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            {(eq.specs || []).slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-md"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-3.5 mt-3.5 border-t border-gray-100">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#EDF7F0] text-[#1B6B3A] text-[11px] font-bold flex items-center justify-center shrink-0">
              {eq.ownerInitials || 'AG'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-gray-800 truncate">
                {eq.ownerName || `Owner #${eq.ownerId || 1}`}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-500">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="font-semibold text-gray-700">{eq.rating ?? '4.8'}</span>
                <span>· {eq.rentalsCount ?? 24} rentals</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelect(eq)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1 shrink-0 cursor-pointer ${
              selected
                ? 'bg-[#1B6B3A] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-[#1B6B3A] hover:text-[#1B6B3A]'
            }`}
          >
            {selected ? (
              <>
                <Check size={13} />
                Selected
              </>
            ) : (
              'Select'
            )}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [equipments, setEquipments] = useState(SHOWCASE_EQUIPMENTS)
  const [usingDemoData, setUsingDemoData] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState('nearest')
  const [viewMode, setViewMode] = useState('grid')
  const [favorites, setFavorites] = useState([])
  const [selectedEquipment, setSelectedEquipment] = useState(SHOWCASE_EQUIPMENTS[0])

  // Default 4-day window starting tomorrow
  const [startDate, setStartDate] = useState(() => addDays(new Date(), 1))
  const [endDate, setEndDate] = useState(() => addDays(new Date(), 4))
  const [searchLocation, setSearchLocation] = useState('Chartres')

  // Quick filter chips
  const [filterOperator, setFilterOperator] = useState(true)
  const [filterDelivery, setFilterDelivery] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    equipmentApi
      .getEquipments()
      .then((res) => {
        if (!active) return
        const raw = Array.isArray(res.data) ? res.data : res.data?.content ?? []
        if (raw.length > 0) {
          const enriched = raw.map(enrichEquipment)
          setEquipments(enriched)
          setSelectedEquipment(enriched[0])
          setUsingDemoData(false)
        } else {
          setEquipments(SHOWCASE_EQUIPMENTS)
          setSelectedEquipment(SHOWCASE_EQUIPMENTS[0])
          setUsingDemoData(true)
        }
      })
      .catch(() => {
        if (!active) return
        setEquipments(SHOWCASE_EQUIPMENTS)
        setSelectedEquipment(SHOWCASE_EQUIPMENTS[0])
        setUsingDemoData(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const handleSearch = (params) => {
    if (params.location) setSearchLocation(params.location.split(',')[0])
    if (params.machineType) setActiveCategory(params.machineType)
    if (params.startDate) setStartDate(parseISO(params.startDate))
    if (params.endDate) setEndDate(parseISO(params.endDate))
  }

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const filtered = useMemo(() => {
    const base =
      activeCategory === 'ALL'
        ? equipments
        : equipments.filter((e) => e.category === activeCategory)

    return [...base].sort((a, b) => {
      if (sortBy === 'price-asc') return (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0)
      if (sortBy === 'price-desc') return (b.pricePerDay ?? 0) - (a.pricePerDay ?? 0)
      if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0)
      return 0
    })
  }, [equipments, activeCategory, sortBy])

  const dateSubtitle =
    startDate && endDate
      ? `${format(startDate, 'd')} – ${format(endDate, 'd MMMM')}`
      : 'Flexible dates'

  return (
    <Layout>
      <HeroSection
        onSearch={handleSearch}
        initialStartDate={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
        initialEndDate={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
      />

      {/* ── CATEGORY BAR ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id
            const realCount =
              usingDemoData
                ? cat.count
                : cat.id === 'ALL'
                ? equipments.length
                : equipments.filter((e) => e.category === cat.id).length

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  active
                    ? 'bg-[#1B6B3A] text-white border-[#1B6B3A] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200/90 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] font-medium px-1.5 py-0.2 rounded-full ${
                    active ? 'bg-white/20 text-white' : 'text-gray-400'
                  }`}
                >
                  {realCount}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── MAIN 2-COLUMN WORKSPACE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Catalog (8 cols) */}
          <div className="lg:col-span-8">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-gray-900">
                  {filtered.length} machine{filtered.length !== 1 ? 's' : ''} available
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Within 40 km of {searchLocation} · {dateSubtitle}
                  {usingDemoData && (
                    <span className="ml-2 text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full text-[10px] font-medium">
                      Preview catalog
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Grid / List toggle */}
                <div className="inline-flex bg-white border border-gray-200 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-[#EDF7F0] text-[#1B6B3A]'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-[#EDF7F0] text-[#1B6B3A]'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                    aria-label="List view"
                  >
                    <List size={15} />
                  </button>
                </div>

                {/* Sort select */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-gray-700 appearance-none cursor-pointer focus:outline-none focus:border-[#1B6B3A]"
                  >
                    <option value="nearest">Sort: Nearest</option>
                    <option value="price-asc">Sort: Price ↑</option>
                    <option value="price-desc">Sort: Price ↓</option>
                    <option value="rating">Sort: Top rated</option>
                  </select>
                  <ChevronDown
                    size={13}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap mb-5">
              <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                <SlidersHorizontal size={12} />
                Filters
                <span className="bg-[#1B6B3A] text-white text-[10px] w-4 h-4 rounded-full inline-flex items-center justify-center">
                  {(filterOperator ? 1 : 0) + (filterDelivery ? 1 : 0) + 1}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 bg-[#EDF7F0] text-[#1B6B3A] border border-emerald-200/70 text-xs font-medium px-3 py-1.5 rounded-full">
                €100 – €1,200 / day
              </span>

              {filterOperator && (
                <button
                  type="button"
                  onClick={() => setFilterOperator(false)}
                  className="inline-flex items-center gap-1 bg-[#EDF7F0] text-[#1B6B3A] border border-emerald-200/70 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:bg-emerald-100/70 transition-colors"
                >
                  Operator available
                  <X size={12} />
                </button>
              )}

              {filterDelivery && (
                <button
                  type="button"
                  onClick={() => setFilterDelivery(false)}
                  className="inline-flex items-center gap-1 bg-[#EDF7F0] text-[#1B6B3A] border border-emerald-200/70 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:bg-emerald-100/70 transition-colors"
                >
                  Farm delivery
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Machine Cards Grid / List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-2xl border border-gray-200/80 h-80 animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center">
                <p className="font-display font-bold text-gray-800 text-lg">
                  No machines in this category
                </p>
                <p className="text-xs text-gray-500 mt-1 mb-4">
                  Try switching back to All categories.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveCategory('ALL')}
                  className="bg-[#1B6B3A] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Show all machines
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                    : 'space-y-4'
                }
              >
                {filtered.map((eq) => (
                  <MachineCard
                    key={eq.id}
                    eq={eq}
                    listView={viewMode === 'list'}
                    selected={selectedEquipment?.id === eq.id}
                    favorite={favorites.includes(eq.id)}
                    onSelect={setSelectedEquipment}
                    onToggleFavorite={toggleFavorite}
                    onOpenDetail={() => navigate(`/equipments/${eq.id}`)}
                  />
                ))}
              </div>
            )}

            {/* Show more */}
            {!loading && filtered.length > 0 && (
              <div className="text-center mt-7">
                <button
                  type="button"
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold px-5 py-2.5 rounded-full shadow-2xs transition-colors cursor-pointer"
                >
                  Show more machines ↓
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Sticky Live Reservation Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <ReservationSidebar
              equipment={selectedEquipment || filtered[0]}
              startDate={startDate}
              endDate={endDate}
              onDatesChange={(s, e) => {
                setStartDate(s)
                setEndDate(e)
              }}
            />
          </div>
        </div>
      </section>
    </Layout>
  )
}
