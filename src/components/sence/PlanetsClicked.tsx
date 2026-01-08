import { planetData } from "../../data/PlanetData";

const PlanetsClicked = ({ selectedPlanet, sunclicked, NASAplanetImages, setSelectedPlanet }: any) => {
    return ( <> 
    
      {selectedPlanet && !sunclicked && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-end p-4 overflow-y-auto"
              role="dialog"
              aria-modal="true"
              onClick={() => setSelectedPlanet(false)}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Escape') setSelectedPlanet(false);}}
              tabIndex={0}
            >
              <div
                className="relative w-[92vw] max-w-sm md:max-w-md bg-gradient-to-tr from-purple-900/90 to-black/80 text-white rounded-xl border border-purple-600/30 shadow-2xl backdrop-blur-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                aria-label={`${selectedPlanet} details`}
              >
                <button
                  onClick={() => setSelectedPlanet(false)}
                  aria-label="Close"
                  className="absolute top-2 right-2 z-20 rounded-full bg-purple-800/60 hover:bg-purple-700/70 w-8 h-8 flex items-center justify-center text-sm font-semibold"
                >
                  ×
                </button>

                <div className="flex items-center gap-3 p-3">
                  <div className="flex-none w-20 h-20 rounded-lg overflow-hidden bg-black/10">
                    <img
                      src={NASAplanetImages[selectedPlanet] || ''}
                      alt={selectedPlanet}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-purple-300 truncate">{selectedPlanet}</h3>
                    <p className="text-xs text-gray-300/80 truncate">
                      {planetData.find((p: any) => p.name === selectedPlanet)?.type || ''}
                    </p>

                    <div className="mt-2 text-xs text-gray-200 grid grid-cols-2 gap-2">
                      {(() => {
                        const p = planetData.find((pl: any) => pl.name === selectedPlanet);
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

                <div className="border-t border-purple-700/20 p-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPlanet(false)}
                    className="ml-auto px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
        )}
        </> );
}
 
export default PlanetsClicked;