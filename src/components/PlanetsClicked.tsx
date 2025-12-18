import { planetData } from "../data/PlanetData";

const PlanetsClicked = ({ selectedPlanet, clickedPlanet, sunclicked, NASAplanetImages, setSelectedPlanet }: any) => {
    return ( <> 
    
      {selectedPlanet && clickedPlanet && !sunclicked && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            role="dialog"
            aria-modal="true"
            onClick={() => setSelectedPlanet(null)}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Escape') setSelectedPlanet(null); }}
            tabIndex={0}
          >
            <div
              className="relative w-full max-w-4xl h-[90vh] bg-gradient-to-br from-purple-900/95 to-black/95 text-white rounded-lg border border-purple-600/40 shadow-xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPlanet(null)}
                aria-label="Close planet details"
                className="absolute top-4 right-4 z-20 rounded-md bg-purple-800/60 hover:bg-purple-700/70 px-3 py-1 text-sm text-white border border-purple-500/40"
              >
                Close
              </button>

              <div className="flex-1 overflow-auto">
                <div className="w-full h-72 md:h-96 bg-black/10">
                  <img
                    src={NASAplanetImages[selectedPlanet] || ''}
                    alt={selectedPlanet}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl font-semibold text-purple-300">{selectedPlanet}</h3>
                    <span className="text-sm text-gray-300/80">{planetData.find((p: any) => p.name === selectedPlanet)?.type || ''}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-200">
                    {(() => {
                      const p = planetData.find((pl: any) => pl.name === selectedPlanet);
                      if (!p) return null;
                      return (
                        <>
                          <div className="space-y-2">
                            <p><strong>Mass (Earth=1):</strong> {p.mass}</p>
                            <p><strong>Moons:</strong> {p.moons}</p>
                            <p><strong>Distance from Sun (million km):</strong> {p.distance}</p>
                          </div>
                          <div className="space-y-2">
                            <p><strong>Radius (thousand km):</strong> {p.radius}</p>
                            {p.atmosphere && <p><strong>Atmosphere:</strong> {p.atmosphere}</p>}
                            {p.notes && <p><strong>Notes:</strong> {p.notes}</p>}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setSelectedPlanet(null)}
                      className="w-full md:w-auto inline-block px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded border border-purple-400/40 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </> );
}
 
export default PlanetsClicked;