import { BsChatText } from "react-icons/bs";
import { FaSearchPlus } from "react-icons/fa";
import { FaUserAstronaut } from "react-icons/fa6";
import { FaEarthAfrica } from "react-icons/fa6";
import SquBtn from '../hooks/SquBtn'
import SunClicked from "./SunClicked";
import PlanetsClicked from "./PlanetsClicked";
import { GiMountaintop } from "react-icons/gi";
import { SiMoonrepo } from "react-icons/si";

const SolaSysElement = ( { sunclicked, setSunClicked, NASAsunImageUrl, selectedPlanet, setSelectedPlanet, clickedPlanet, NASAplanetImages } :any) => {
    return ( <>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
          <div
            style={{
              clipPath: 'polygon(12% 0%, 88% 0%, 100% 50%, 88% 100%, 12% 100%, 0% 50%)',
              background: 'linear-gradient(180deg,#064b4d,#0b393b)',
              boxShadow: 'inset 0 0 0 6px rgba(16,185,129,0.06)'
            }}
            className="px-10 py-3 rounded-xl flex flex-col items-center text-center text-white"
          >
            <h1 className="text-2xl font-extrabold tracking-widest uppercase">
              Solar System
            </h1>
          </div>

        </div>

      <SunClicked  sunclicked={sunclicked} setSunClicked={setSunClicked} NASAsunImageUrl={NASAsunImageUrl} />

     <PlanetsClicked selectedPlanet={selectedPlanet} clickedPlanet={clickedPlanet} sunclicked={sunclicked} NASAplanetImages={NASAplanetImages} setSelectedPlanet={setSelectedPlanet} />

        <div className="z-50 pb-2 cursor-none m-[-55px] absolute rotate-90 left-0 top-1/2 pt-5 rounded-t-4xl border border-x-4 border-cyan-500/90 text-white text-2xl hover:shadow-lg ">
          <div className="flex items-center gap-2 cursor-none">
            <SquBtn link="epic"
              Icon={FaEarthAfrica}
              hoverText="Discover EPIC Images"
              HoverclassName="absolute bottom-10 ml-14 -rotate-90 right-24 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300 whitespace-nowrap"
              ICONclassName="mx-1 -rotate-90 px-5 py-2 cursor-none rounded-xl text-white transition transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/40 hover:border-cyan-300/90 hover:from-cyan-800/60 hover:to-cyan-900/40 focus:outline-none focus:ring-4 focus:ring-cyan-400/25"
            />
            
            <SquBtn link="neows"
              Icon={GiMountaintop}
              hoverText="Near Earth Object Watcher"
              HoverclassName="absolute bottom-10 ml-14 -rotate-90 right-24 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300 whitespace-nowrap"
              ICONclassName="mx-1 -rotate-90 px-5 py-2 cursor-none rounded-xl text-white transition transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/40 hover:border-cyan-300/90 hover:from-cyan-800/60 hover:to-cyan-900/40 focus:outline-none focus:ring-4 focus:ring-cyan-400/25"
            />
            <SquBtn link="moonwmts"
              Icon={SiMoonrepo}
              hoverText="Discover EPIC Images"
              HoverclassName="absolute bottom-10 ml-14 -rotate-90 right-24 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300 whitespace-nowrap"
              ICONclassName="mx-1 -rotate-90 px-5 py-2 cursor-none rounded-xl text-white transition transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/40 hover:border-cyan-300/90 hover:from-cyan-800/60 hover:to-cyan-900/40 focus:outline-none focus:ring-4 focus:ring-cyan-400/25"
            />
          </div>
        </div>

        <SquBtn link="solar"
          Icon={FaSearchPlus}
          hoverText="Explore Solar System Planets"
          HoverclassName="absolute bottom-10 ml-7 left-18 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300"
          ICONclassName="cursor-none absolute bottom-10 rotate-46 left-10 p-3 hover:bg-cyan-500/40 border border-cyan-500/90 transition-all duration-300 text-white text-2xl hover:shadow-lg hover:shadow-cyan-500/30"
        />

        <SquBtn link="apod"
          Icon={FaUserAstronaut}
          hoverText="View Astronomy Picture of the Day"
          HoverclassName="absolute bottom-34 ml-7 left-18 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300 whitespace-nowrap"
          ICONclassName="cursor-none absolute bottom-34 rotate-46  left-10 p-3 hover:bg-cyan-500/40 border border-cyan-500/90 transition-all duration-300 text-white text-2xl hover:shadow-lg hover:shadow-cyan-500/30"
        />

        <SquBtn link="chatbot"
          Icon={BsChatText}
          hoverText="Learn More About the Planets"
          HoverclassName="absolute bottom-10 ml-7 right-24 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300"
          ICONclassName="cursor-none absolute bottom-10 rotate-46 right-10 p-3 hover:bg-cyan-500/40 border border-cyan-500/90 transition-all duration-300 text-white text-2xl hover:shadow-lg hover:shadow-cyan-500/30"
        />
        </> );
}
 
export default SolaSysElement;