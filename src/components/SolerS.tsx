import { SliderData } from '../data/PlanetData'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoArrowBackSharp } from "react-icons/io5";
import { useRef, useState } from 'react';
import { Link } from 'react-router';

const SolarS = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    var settings = {
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '120px',
        afterChange: (i: number) => setCurrentIndex(i),
    };
    const containerRef = useRef<HTMLDivElement | null>(null)
    return (
        <>
            <div className='flex'>
                <div ref={containerRef} className="top-0 left-0 z-40 max-w-full max-h-full overflow-hidden">
                    <div style={{ backgroundImage: "url('/textures/8k_stars_milky_way.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }} className="absolute inset-0 -z-10" />
                    <div className="absolute inset-0 bg-black/50 -z-5" />
                    <div className="bg-gradient-to-br from-cyan-900/40 mt-7 text-white p-6 rounded-lg border border-cyan-500/50 shadow-lg shadow-cyan-500/20 slider-container absolute top-6 left-1/2 transform -translate-x-1/2 z-50 w-11/12">
                        <style>{`
                              .slider-container .slick-center { transform: scale(1.28); z-index: 50; }
                              .slider-container .slick-slide { transition: transform 0.3s ease; }
                              .slider-container .slick-slide img { transition: transform 0.3s ease; }
                              .slider-container .slick-slide.slick-active img { transform: scale(1.3); }
                              `}</style>

                        <Slider {...settings}>
                            {Object.entries(SliderData).map(([key, value]) => (
                                <div key={key} className="p-20">
                                    <div className="">
                                        {value.img && <img src={value.img} alt={key} className="rounded-full w-56 h-56 object-cover mx-auto" />}
                                    </div>
                                </div>
                            ))}
                        </Slider>
                        {(() => {
                            const entries = Object.entries(SliderData)
                            const active = entries[currentIndex]
                            if (!active) return null
                            const [activeKey, activeValue] = active as [string, { title?: string; content?: string; img?: string }]
                            return (
                                <div className="mt-10 w-full">
                                    <div className="max-w-4xl mx-auto text-center px-6">
                                        <h1 style={{ textShadow: '0 8px 30px rgba(0,0,0,0.75)' }} className="text-white text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide">{activeKey}</h1>
                                        <p className="mt-4 text-white/90 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">{activeValue.content}</p>
                                    </div>
                                </div>
                            )
                        })()}

                        <Link to="/">
                            <button className="absolute bottom-6 rotate-46 cursor-pointer left-6 p-3 hover:bg-cyan-500/40 border border-cyan-500/50 transition-all duration-300 text-white text-2xl hover:shadow-lg hover:shadow-cyan-500/30">
                                <IoArrowBackSharp className='rotate-[-46deg] ' />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

        </>);
}

export default SolarS;