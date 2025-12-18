import { useEffect, useState } from 'react'
import { getEpicNaturalAll } from '../utils/nasaApi'
import type { EpicNaturalItem } from '../utils/nasaApi'
import CustomCursor from './hooks/CustomCursor'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const EPIC = () => {
    const [items, setItems] = useState<EpicNaturalItem[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [, setIndex] = useState(0)

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
            <h1>EPIC — Earth Polychromatic Imaging Camera</h1>

            {loading && <p>Loading EPIC images…</p>}
            {error && <p style={{ color: 'crimson' }}>{error}</p>}

            {!loading && !error && (
                (items ?? []).length === 0 ? (
                    <p>No EPIC images available.</p>
                ) : (
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
                                <figure key={key} style={{ margin: 0, padding: '0 8px' }}>
                                    <div className="flex flex-col md:flex-row items-stretch gap-6">
                                        <div className="md:w-1/2  w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {it.url ? (
                                                <img
                                                    src={it.url}
                                                    alt={alt}
                                                    loading="lazy"
                                                    decoding="async"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        
                                                        display: 'block',
                                                        objectFit: 'cover',
                                                    
                                                    }}
                                                    className=''
                                                />
                                            ) : (
                                                <div
                                                    role="img"
                                                    aria-label="No image available"
                                                    style={{
                                                        width: '100%',
                                                        minHeight: 220,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: '#111',
                                                        color: '#fff',
                                                        borderRadius: 8,
                                                    }}
                                                >
                                                    No image
                                                </div>
                                            )}
                                        </div>

                                        <div className="md:flex-1 w-full text-left" style={{ color: 'white' }}>
                                            <h2 style={{ fontSize: 22, margin: 0, fontWeight: 700 }}>{it.caption || 'No caption'}</h2>
                                            {formattedDate ? (
                                                <div style={{ marginTop: 8, color: '#bbb' }}>
                                                    <time dateTime={formattedISO}>{formattedDate}</time>
                                                </div>
                                            ) : null}

                                            {/* optional metadata / actions */}
                                            <div style={{ marginTop: 14, color: '#999', fontSize: 14 }}>
                                                Image ID: {it.identifier}
                                            </div>

                                            <div style={{ marginTop: 18 }}>
                                                <a href={it.url || '#'} target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>Open full image</a>
                                            </div>
                                        </div>
                                    </div>
                                </figure>
                            )
                        })}
                    </Slider>
                )
            )}
        </div>
    )
}

export default EPIC