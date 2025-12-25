import { useEffect, useState } from 'react'

type Asteroid = {
  id: string
  name: string
  estimated_diameter: {
    kilometers: { min: number; max: number }
    meters: { min: number; max: number }
  }
  is_potentially_hazardous_asteroid: boolean
  close_approach_data: Array<{
    close_approach_date: string
    relative_velocity: { kilometers_per_second: number }
    miss_distance: { kilometers: number }
  }>
}

type AsteroidWatchProps = {
  asteroids: Asteroid[]
}

export default function AsteroidWatch({ asteroids }: AsteroidWatchProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState('00:00:00:00')

  const asteroid = asteroids[currentIndex]
  const closeApproach = asteroid?.close_approach_data?.[0]

  useEffect(() => {
    if (!closeApproach) return

    const interval = setInterval(() => {
      const approachDate = new Date(closeApproach.close_approach_date).getTime()
      const now = Date.now()
      const diff = approachDate - now

      if (diff <= 0) {
        setTimeRemaining('00:00:00:00')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeRemaining(
        `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [closeApproach])

  const diameterM = (asteroid?.estimated_diameter?.meters?.max || 0).toFixed(1)
  const distanceKm = (closeApproach?.miss_distance?.kilometers || 0).toLocaleString()
  const approachDate = closeApproach?.close_approach_date ? new Date(closeApproach.close_approach_date) : null

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? asteroids.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === asteroids.length - 1 ? 0 : prev + 1))
  }

  const timeUnits = timeRemaining.split(':')

  return (
    <div className="fixed top-1/2 left-1/5 transform mt-5 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md z-50">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-cyan-400 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20">
        
       <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400">◉</span>
            Asteroid Watch
          </h1>
          <button className="text-cyan-400 text-xl hover:scale-110 transition-transform bg-none border-none cursor-none">
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-600 text-center mb-6 tracking-widest">{currentIndex + 1} OF {Math.max(asteroids.length)}</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-4xl font-bold text-white">{asteroid?.name}</h2>

           
            <div>
              <label className="text-xs text-gray-400 tracking-widest uppercase font-semibold">DATE</label>
              <p className="text-base text-white">
                {approachDate?.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                {approachDate?.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>
            </div>

            {/* Distance */}
            <div>
              <label className="text-xs text-gray-400 tracking-widest uppercase font-semibold">DISTANCE</label>
              <p className="text-base text-white">{distanceKm} km</p>
            </div>

            {/* Countdown Box */}
            <div className="border-2 border-cyan-500 rounded-xl p-4 bg-cyan-500/5 mt-4">
              <span className="block text-xs text-cyan-400 uppercase tracking-widest font-semibold text-center mb-3">
                — LIVE COUNTDOWN —
              </span>
              <div className="grid grid-cols-4 gap-2">
                {timeUnits.map((unit, idx) => {
                  const labels = ['DAYS', 'HOURS', 'MINUTES', 'SECONDS']
                  return (
                    <div key={idx} className="text-center">
                      <p className="text-xl font-mono font-bold text-cyan-400">{unit}</p>
                      <p className="text-xs text-cyan-400/70 tracking-wide uppercase">{labels[idx]}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Visual Section */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center text-5xl border border-cyan-400/30">
              <img src="/rock.png"
              className='p-2'
               alt="" />
            </div>
            <p className="mt-3 text-white font-bold text-sm">{diameterM} m</p>
            <p className="text-xs text-gray-500">[ESTIMATED]</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-cyan-400/20">
          <button
            onClick={handlePrev}
            className="text-cyan-400 hover:scale-125 transition-transform bg-none border-none cursor-none text-lg font-bold"
          >
            ←
          </button>

          <div className="flex gap-2 justify-center flex-1">
            {asteroids.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50 scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="text-cyan-400 hover:scale-125 transition-transform bg-none border-none cursor-none text-lg font-bold"
          >
            →
          </button>
        </div>

        {/* Hazard Warning */}
        {asteroid?.is_potentially_hazardous_asteroid && (
          <div className="mt-4 text-center text-xs text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg py-2 tracking-widest">
            ⚠ POTENTIALLY HAZARDOUS ASTEROID
          </div>
        )}
      </div>
    </div>
  )
}
