import { useDispatch, useSelector } from 'react-redux'
import { setMapUrl } from '../../features/mapSlice'
import type { RootState } from '../../store/store'

const TypeMap = () => {
    const dispatch = useDispatch()
    const { MapUrl } = useSelector((state: RootState) => state.map)

    return (
        <>
           
        <div className="bg-[#0b8b85] min-h-[180px] pt-5 items-center absolute top-1/2 left-4 z-[2000] transform -translate-y-1/2 flex flex-col gap-2 p-2 bg-gradient-to-br from-black/25 via-transparent to-white/3 backdrop-blur-md rounded-r-xl border border-white/6 shadow-xl">
            <button
            type="button"
            onClick={() => dispatch(setMapUrl('moon'))}
            aria-pressed={MapUrl === 'moon'}
            aria-label="Select Moon"
            className={`group cursor-none flex items-center gap-3 px-3 py-2 rounded-lg transition-transform duration-200 ease-out transform will-change-transform focus:outline-none focus:ring-4 focus:ring-indigo-400/25 ${
                MapUrl === 'moon'
                ? 'bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-lg scale-105'
                : 'bg-white/5 text-white hover:bg-white/10'
            } hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-indigo-300/25`}
            >
            <img
                src="/models/moon.png"
                alt=""
                aria-hidden="true"
                className="w-8 h-8 rounded-full object-cover shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-3"
                draggable={false}
            />
            <span className="text-sm font-semibold transition-colors duration-150 group-hover:text-white/100">Moon</span>
            </button>

            <button
            type="button"
            onClick={() => dispatch(setMapUrl('mars'))}
            aria-pressed={MapUrl === 'mars'}
            aria-label="Select Mars"
            className={`group cursor-none flex items-center gap-3 px-3 py-2 rounded-lg transition-transform duration-200 ease-out transform will-change-transform focus:outline-none focus:ring-4 focus:ring-rose-400/25 ${
                MapUrl === 'mars'
                ? 'bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow-lg scale-105'
                : 'bg-white/5 text-white hover:bg-white/10'
            } hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-rose-300/25`}
            >
            <img
                src="/models/mars.png"
                alt=""
                aria-hidden="true"
                className="w-8 h-8 rounded-full object-cover shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-6"
                draggable={false}
            />
            <span className="text-sm font-semibold transition-colors duration-150 group-hover:text-white/100">Mars</span>
            </button>

            <div className="mt-1 px-2 text-xs text-white/60">
            <span>Map view</span>
            </div>
        </div>
        
        </>
    )
}

export default TypeMap