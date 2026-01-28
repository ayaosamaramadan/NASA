import "../styles/solars.css"
import { SliderData } from '../data/PlanetData'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoArrowBackSharp } from "react-icons/io5";
import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { FaUserAstronaut } from "react-icons/fa6";
import CustomCursor from './hooks/CustomCursor';
import theSonga from "/sfx.mp3";
import useSound from "use-sound";

export default function SolarS() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [play, { stop }] = useSound(theSonga);
    var settings = {
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '120px',
        afterChange: (i: number) => setCurrentIndex(i),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    centerPadding: '80px',
                }
            },
            {
                breakpoint: 990,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '80px',
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '80px',
                }

            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '60px',
                }
            },
            {

                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '50px',
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '40px',
                }
            }
        ]
    };
    const containerRef = useRef<HTMLDivElement | null>(null)
    return (
        <>
            <div className='flex'>
                <CustomCursor />
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
                                <div key={key} className="p-20 my-10 ">
                                    <div className="flex justify-center">
                                        {value.img && (
                                            <div className="relative">
                                                <div id="apple" className="relative z-20">
                                                    <img
                                                        src={value.img}
                                                        alt={key}
                                                        loading="lazy"
                                                        width={224}
                                                        height={224}
                                                        className="rounded-full object-cover"
                                                    />
                                                </div>
                                                <div aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 bottom-2 w-56 h-6 bg-black/60 rounded-full blur-xl opacity-80 z-10" />
                                            </div>
                                        )}
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
                                <div className="mt-20 w-full">
                                    <div className="max-w-4xl mx-auto text-center px-6">
                                        <h1 style={{ textShadow: '0 8px 30px rgba(0,0,0,0.75)' }} className="text-white text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide">{activeKey}</h1>
                                        <p className="mt-4 text-white/90 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">{activeValue.content}</p>
                                    </div>
                                </div>
                            )
                        })()}
                        <Link to="/apod">
                            <div className="relative"></div>
                            <button
                                className="absolute bottom-34 rotate-46 cursor-none left-10 p-3 hover:bg-cyan-500/40 border border-cyan-500/90 transition-all duration-300 text-white text-2xl hover:shadow-lg hover:shadow-cyan-500/30 hidden md:block"
                                onMouseEnter={(e) => {
                                    const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (tooltip) tooltip.style.opacity = '1';
                                    play();
                                }}
                                onMouseLeave={(e) => {
                                    const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (tooltip) tooltip.style.opacity = '0';
                                    stop();
                                }}
                            >
                                <FaUserAstronaut className='rotate-[-46deg]' />
                            </button>
                            <div className="absolute bottom-34 ml-7 left-18 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300 hidden md:block">
                                View Astronomy Picture of the Day
                            </div>

                        </Link>
                        <Link to="/">
                            <button className="absolute bottom-10 rotate-46 cursor-none left-10 p-3 hover:bg-cyan-500/40 border border-cyan-500/90 transition-all duration-300 text-white text-2xl hover:shadow-lg hover:shadow-cyan-500/30 hidden md:block" onMouseEnter={() => play()} onMouseLeave={() => stop()}>
                                <IoArrowBackSharp className='rotate-[-46deg] ' />
                            </button>
                        </Link>

                        <div className="mt-6 flex flex-col items-center gap-3 md:hidden px-4">
                            <Link to="/apod" className="w-full">
                                <button className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md flex items-center justify-center gap-2" onMouseEnter={() => play()} onMouseLeave={() => stop()}>
                                    <FaUserAstronaut />
                                    <span className="font-semibold">View APOD</span>
                                </button>
                            </Link>
                            <Link to="/" className="w-full">
                                <button className="w-full px-4 py-3 border border-cyan-500 text-white rounded-md flex items-center justify-center gap-2" onMouseEnter={() => play()} onMouseLeave={() => stop()}>
                                    <IoArrowBackSharp />
                                    <span className="font-semibold">Back SolaSysElement</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </>);
}

