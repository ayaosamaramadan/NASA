import { useEffect, useState } from 'react'
import { getEpicNaturalAll } from '../utils/nasaApi'
import type { EpicNaturalItem } from '../utils/nasaApi'
import CustomCursor from './hooks/CustomCursor'
import Slider from 'react-slick'
import "../styles/epic.css"
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import LoadingScreen from './hooks/LoadingScreen'
import { Link } from 'react-router'
import { IoArrowBackSharp } from "react-icons/io5";
import theSonga from "/sfx.mp3";
import useSound from "use-sound";

const EPIC = () => {
    const [items, setItems] = useState<EpicNaturalItem[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [, setIndex] = useState(0)
    const [play, { stop }] = useSound(theSonga);

    var settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        beforeChange: (_: number, next: number) => setIndex(next),
    };

    useEffect(() => {
        let cancelled = false

        const load = async () => {
            try {
                const res = await getEpicNaturalAll()
                if (cancelled) return
                setItems(res || [])
            } catch (err) {
                if (!cancelled) setError('Failed to load EPIC items')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <div role="main" aria-live="polite">
            <CustomCursor />

            {loading && <LoadingScreen />}
            {error && <p className="text-red-400" style={{ marginBottom: 12 }}>{error}</p>}


            {!loading && !error && (

                <Slider
                    {...settings}

                    dots
                    infinite
                    speed={500}
                    adaptiveHeight
                    lazyLoad="ondemand"
                    accessibility

                >


                    {(items ?? []).slice(0, 12).map((it, idx) => {
                        const alt = it.caption || it.image || `EPIC ${it.identifier}`;
                        const formattedISO = it.date ? new Date(it.date).toISOString() : undefined;
                        const formattedDate = it.date ? new Date(it.date).toLocaleString() : '';
                        const key = `${it.identifier ?? idx}-${formattedISO ?? idx}`;

                        return (
                            <figure key={key} className="epic-figure px-3 py-6">


                                <div className="flex flex-col md:flex-row items-stretch gap-6">
                                    <div className="md:w-1/2 w-full flex relative">
                                        {it.url ? (
                                            <>
                                                <Link to="/">
                                                    <div className="relative">
                                                        <button
                                                            className="cursor-none absolute z-50 top-10 left-10 rotate-46 p-3 hover:bg-cyan-500/40 border border-cyan-500/90 transition-all duration-300 text-white text-2xl rounded"
                                                            onMouseEnter={(e) => {
                                                                const tooltip = (e.currentTarget.nextElementSibling) as HTMLElement;
                                                                if (tooltip) tooltip.style.opacity = '1';
                                                                play();
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                const tooltip = (e.currentTarget.nextElementSibling) as HTMLElement;
                                                                if (tooltip) tooltip.style.opacity = '0';
                                                                stop();
                                                            }}
                                                        >
                                                            <IoArrowBackSharp className='rotate-[-46deg]' />
                                                        </button>
                                                        <div className="absolute top-3 left-14 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300">
                                                            Back
                                                        </div>
                                                    </div>
                                                </Link>

                                                <img
                                                    src={it.url}
                                                    alt={alt}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="epic-img"
                                                />
                                            </>
                                        ) : (
                                            <div role="img" aria-label="No image available" className="epic-noimage">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    <div className="epic-card md:flex-1 w-full text-left">
                                        <div className="flex gap-3 items-center mb-2">
                                            <div className="epic-badge"></div>
                                            <h1 className="epic-title">Earth Polychromatic Imaging Camera</h1>
                                        </div>
                                        <div className="max-w-4xl mx-auto py-6">
                                            <p className="epic-caption text-lg text-slate-200">Welcome to the EPIC gallery — browse recent full‑disc natural color imagery from the DSCOVR EPIC instrument. Use the slider below to explore available captures, open a full image, download it, or copy its URL.</p>
                                        </div>

                                        <h2 className="epic-caption">{it.caption || 'No caption'}</h2>

                                        {formattedDate ? (
                                            <div className="epic-time">
                                                <span style={{ fontSize: 26 }}>⏰</span>
                                                <time dateTime={formattedISO}>{formattedDate}</time>
                                            </div>
                                        ) : null}

                                        <dl className="epic-id">
                                            <dt>Image ID:</dt>
                                            <dd>{it.identifier ?? '—'}</dd>
                                        </dl>

                                        <div className="epic-actions">
                                            <a href={it.url || '#'} target="_blank" rel="noopener noreferrer" className="epic-btn-primary" aria-label={`Open full image ${it.identifier ?? ''}`}>Open full image</a>

                                            <a href={it.url || '#'} download={`${it.identifier ?? 'epic'}.jpg`} className="epic-btn-ghost" aria-label={`Download image ${it.identifier ?? ''}`}>Download</a>

                                            <button
                                                type="button"
                                                onClick={async (e: any) => {
                                                    e.preventDefault()
                                                    const url = it.url || ''
                                                    if (!url) return
                                                    try {
                                                        await navigator.clipboard.writeText(url)
                                                        const btn = e.currentTarget as HTMLButtonElement
                                                        const prev = btn.textContent
                                                        btn.textContent = 'Copied ✓'
                                                        btn.classList.add('epic-copied')
                                                        setTimeout(() => {
                                                            btn.textContent = prev
                                                            btn.classList.remove('epic-copied')
                                                        }, 1600)
                                                    } catch {
                                                       
                                                    }
                                                }}
                                                className="epic-copy-btn"
                                                onMouseEnter={() => play()}
                                                onMouseLeave={() => stop()}
                                                aria-label={`Copy image URL ${it.identifier ?? ''}`}
                                            >
                                                Copy URL
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </figure>
                        )
                    })}

                </Slider>

            )}
        </div>
    )
}

export default EPIC