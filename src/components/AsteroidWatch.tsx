import { useEffect, useState } from 'react'
import theSonga from "/sfx.mp3";
import useSound from "use-sound";
import { IoArrowBackSharp } from "react-icons/io5";
import { Link } from 'react-router';

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
  const [play, { stop }] = useSound(theSonga);

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
    <>
      <Link to="/">
        <button title='back' className="fixed top-10 rotate-46 cursor-none left-10 p-3 hover:bg-cyan-500/40 border border-cyan-500/90 transition-all duration-300 text-white text-2xl hover:shadow-lg hover:shadow-cyan-500/30 hidden md:block" onMouseEnter={() => play()} onMouseLeave={() => stop()}>
          <IoArrowBackSharp className='rotate-[-46deg] ' />
        </button>
      </Link>

      <div className="pointer-events-none fixed inset-0 flex justify-end items-center p-4 z-50">
        <div
          className='z-[2000] m-15 mt-20 fixed' >


          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="asteroid-watch-title"
            className="relative justify-end w-full max-w-md bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-cyan-400 rounded-3xl p-4 md:p-6 shadow-2xl shadow-cyan-500/20 pointer-events-auto"
          >


            <div className="flex flex-col md:flex-row md:gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h1 id="asteroid-watch-title" className="ml-10 text-lg md:text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-cyan-400">◉</span>
                    Asteroid Watch
                  </h1>

                </div>

                <p className="text-xs text-gray-400 mb-3 tracking-widest">
                  {currentIndex + 1} / {asteroids.length} — LIVE UPDATES
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{asteroid?.name}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 tracking-widest uppercase font-semibold">Date</label>
                    <p className="text-sm text-white">
                      {approachDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
                      {approachDate?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 tracking-widest uppercase font-semibold">Distance</label>
                    <p className="text-sm text-white">{distanceKm} km</p>
                  </div>

                  <div className="md:col-span-2 border-2 border-cyan-500 rounded-xl p-3 bg-cyan-500/5 mt-2">
                    <span className="block text-xs text-cyan-400 uppercase tracking-widest font-semibold text-center mb-2">
                      — LIVE COUNTDOWN —
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {timeUnits.map((unit, idx) => {
                        const labels = ['DAYS', 'HOURS', 'MINUTES', 'SECONDS']
                        return (
                          <div key={idx} className="text-center">
                            <p className="text-lg md:text-xl font-mono font-bold text-cyan-400">{unit}</p>
                            <p className="text-xxs text-cyan-400/70 tracking-wide uppercase">{labels[idx]}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <aside className="w-full md:w-32 flex-shrink-0 flex flex-col items-center justify-center mt-5 md:mt-0">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center text-4xl border border-cyan-400/30">
                  <img src="/rock.png" className="p-2 w-full h-full object-contain" alt="Asteroid illustration" />
                </div>
                <p className="mt-3 text-white font-bold text-sm">{diameterM} m</p>
                <p className="text-xs text-gray-500">[ESTIMATED]</p>
              </aside>
            </div>

            <div className="flex items-center justify-between mt-5 pt-3 border-t border-cyan-400/20">
              <button
                onClick={handlePrev}
                type="button"
                className="text-cyan-400 hover:scale-110 transition text-lg font-bold"
                onMouseEnter={() => play()}
                onMouseLeave={() => stop()}
                aria-label="Previous asteroid"
              >
                ←
              </button>

              <div className="flex gap-2 justify-center flex-1">
                {asteroids.slice(0, 8).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    type="button"
                    aria-pressed={idx === currentIndex}
                    className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50 scale-110' : 'bg-gray-600 hover:bg-gray-500'}`}
                    onMouseEnter={() => play()}
                    onMouseLeave={() => stop()}
                    aria-label={`Select asteroid ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                type="button"
                className="text-cyan-400 hover:scale-110 transition text-lg font-bold"
                onMouseEnter={() => play()}
                onMouseLeave={() => stop()}
                aria-label="Next asteroid"
              >
                →
              </button>
            </div>

            {asteroid?.is_potentially_hazardous_asteroid && (
              <div className="mt-3 text-center text-xs text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg py-2 tracking-widest">
                ⚠ POTENTIALLY HAZARDOUS ASTEROID
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
