import { BsChatText } from "react-icons/bs";
import { FaSearchPlus } from "react-icons/fa";
import { FaUserAstronaut } from "react-icons/fa6";
import { FaEarthAfrica } from "react-icons/fa6";
import SquBtn from '../hooks/SquBtn'
import SunDetail from "./SunDetail";
import { GiMountaintop } from "react-icons/gi";
import { SiMoonrepo } from "react-icons/si";
import PlanetsDetail from "./PlanetsDetail";

const SolaSysElement = () => {
  return (<>
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

    <SunDetail />
    <PlanetsDetail />

    <div className="z-50 pb-2 cursor-none mt-[-130px] ml-7 absolute left-0 top-1/2 pt-4 rounded-r-4xl border border-x-1 border-cyan-500/90 text-white text-2xl">
      <div className="items-center gap-2 cursor-none">
        <div className="flex space-x-4 mb-4 mt-4 justify-center relative group">
          <SquBtn link="epic"
            Icon={FaEarthAfrica}
            hoverText="Discover EPIC Images"
            HoverclassName="absolute text-cyan-300 left-full top-1/2 -translate-y-1/2 ml-2 bg-cyan-900/80 text-sm p-2 rounded opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 whitespace-nowrap shadow-md backdrop-blur-sm"
            ICONclassName="mx-1 px-5 py-2 cursor-none rounded-xl text-white transition transform hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/40 hover:border-cyan-300/90 bg-transparent group-hover:bg-gradient-to-r " />
        </div>

        <div className="flex space-x-4 mb-4 mt-4 justify-center relative group">
          <SquBtn link="neows"
            Icon={GiMountaintop}
            hoverText="Near Earth Object Watcher"
            HoverclassName="absolute text-cyan-300 left-full top-1/2 -translate-y-1/2 ml-2 bg-cyan-900/80 text-sm p-2 rounded opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 whitespace-nowrap shadow-md backdrop-blur-sm"
            ICONclassName="mx-1 px-5 py-2 cursor-none rounded-xl text-white transition transform hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/40 hover:border-cyan-300/90 bg-transparent group-hover:bg-gradient-to-r "
          />
        </div>

        <div className="flex space-x-4 mb-4 mt-4 justify-center relative group">
          <SquBtn link="moonwmts"
            Icon={SiMoonrepo}
            hoverText="Discover EPIC Images"
            HoverclassName="absolute text-cyan-300 left-full top-1/2 -translate-y-1/2 ml-2 bg-cyan-900/80 text-sm p-2 rounded opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 whitespace-nowrap shadow-md backdrop-blur-sm"
            ICONclassName="mx-1 px-5 py-2 cursor-none rounded-xl text-white transition transform hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/40 hover:border-cyan-300/90 bg-transparent group-hover:bg-gradient-to-r " />
        </div>
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
  </>);
}

export default SolaSysElement;