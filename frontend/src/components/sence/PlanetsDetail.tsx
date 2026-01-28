import { useDispatch, useSelector } from "react-redux";
import { planetData } from "../../data/PlanetData";
import type { AppDispatch, RootState } from "../../store/store";
import { setSelectedPlanet } from "../../features/appSlice";
import theSonga from "/sfx.mp3";
import useSound from "use-sound";

const PlanetsClicked = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPlanet, sunclicked, NASAplanetImages } = useSelector((state: RootState) => state.app);
  const planetName = typeof selectedPlanet === 'string' ? selectedPlanet : undefined
  const [play, { stop }] = useSound(theSonga);
  return (
    <>
      {planetName && !sunclicked && (
        <div
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
          role="dialog"
          aria-modal="true"
          tabIndex={0}
        >
          <div
            className="pointer-events-auto w-72 md:w-96 p-4 rounded-xl bg-black/60 backdrop-blur-md text-white border border-purple-600/30 shadow-2xl overflow-hidden transform transition-transform duration-200"
            onClick={(e) => e.stopPropagation()}
            aria-label={`${planetName} details`}
          >
            <button
              onClick={() => dispatch(setSelectedPlanet(false))}
              aria-label="Close"
              className="absolute top-2 right-2 z-20 rounded-full bg-purple-800/60 hover:bg-purple-700/70 w-8 h-8 flex items-center justify-center text-sm font-semibold"
              onMouseEnter={() => play()}
              onMouseLeave={() => stop()}
            >
              ×
            </button>

            <div className="flex items-center gap-3 p-2">
                <div className="flex-none w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-black/20 to-black/10 border border-white/5">
                <img
                  src={NASAplanetImages[planetName] || ''}
                  alt={planetName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-purple-300 truncate">{planetName}</h3>
                <p className="text-xs text-gray-300/80 truncate">
                  {planetData.find((p: any) => p.name === planetName)?.type || ''}
                </p>

                <div className="mt-2 text-xs text-gray-200 grid grid-cols-2 gap-2">
                  {(() => {
                    const p = planetData.find((pl: any) => pl.name === planetName);
                    if (!p) return null;
                    return (
                      <>
                        <div className="space-y-1">
                          <p><strong className="text-gray-100">Mass:</strong> <span className="text-gray-200">{p.mass}</span></p>
                          <p><strong className="text-gray-100">Moons:</strong> <span className="text-gray-200">{p.moons}</span></p>
                        </div>
                        <div className="space-y-1">
                          <p><strong className="text-gray-100">Distance:</strong> <span className="text-gray-200">{p.distance}</span></p>
                          <p><strong className="text-gray-100">Radius:</strong> <span className="text-gray-200">{p.radius}</span></p>
                        </div>
                        {p.atmosphere && (
                          <p className="col-span-2 text-xs text-gray-200/90">
                            <strong className="text-gray-100">Atmosphere:</strong> {p.atmosphere}
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>);
}

export default PlanetsClicked;