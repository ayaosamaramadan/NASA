export type ApodResult = {
    url: string | null
    media_type?: string | null
    title?: string | null
    explanation?: string | null
    date?: string | null
}

// searchNasaImage queries the NASA Image and Video Library API for images matching the given query
export async function searchNasaImage(query: string): Promise<string | null> {
    try {
        const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`
        const res = await fetch(url)
        if (!res.ok) return null

        const items = (await res.json()).collection?.items || []

        for (const item of items) {
            const imageUrl = item.links?.find((l: any) =>
                /\.(jpg|jpeg|png|webp)$/i.test(l.href)
            )?.href

            if (imageUrl) return imageUrl
        }

        return null
    } catch {
        return null
    }
}









// get Astro Picture of the Day (APOD) image from NASA API
export async function getApodImage(daysAgo: number = 1): Promise<ApodResult | null> {
    try {
        const apiKey = "TLzQSxfAsc3pTtpGfCkZ7lP90FM7JqohAuQb2c8W"

        const normalizeUrl = (input?: string | null) => {
            if (!input) return null
            return input.replace(/^http:\/\//i, 'https://')
        }

        const fetchApodByOffset = async (offset: number): Promise<ApodResult | null> => {
            const date = new Date()
            date.setDate(date.getDate() - offset)
            const dateStr = date.toISOString().split('T')[0]

            const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${dateStr}&thumbs=true`
            const res = await fetch(url)
            if (!res.ok) return null

            const data = await res.json()
            if (!data) return null

            const result: ApodResult = {
                url: null,
                media_type: data.media_type || null,
                title: data.title || null,
                explanation: data.explanation || null,
                date: data.date || dateStr,
            }

            if (data.media_type === 'image') {
                result.url = normalizeUrl(data.hdurl) || normalizeUrl(data.url)
            } else if (data.media_type === 'video') {
                // Prefer thumbnail when APOD is a video so we always have an image
                result.url = normalizeUrl(data.thumbnail_url) || null
            }

            return result.url ? result : null
        }

        const startOffset = Math.max(0, daysAgo)
        const maxLookback = 7
        for (let offset = startOffset; offset < startOffset + maxLookback; offset++) {
            const result = await fetchApodByOffset(offset)
            if (result) return result
        }

        return null
    } catch (err) {
        console.warn('getApodImage error', err)
        return null
    }
}

export type EpicNaturalItem = {
    identifier: string
    caption?: string | null
    image?: string | null
    date?: string | null
    url?: string | null

}
const buildArchiveUrl = (dateStr?: string | null, image?: string | null): string | null => {
    if (!dateStr || !image) return null
    const d = new Date(dateStr + ' UTC')
    const yyyy = d.getUTCFullYear()
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(d.getUTCDate()).padStart(2, '0')
    return `https://epic.gsfc.nasa.gov/archive/natural/${yyyy}/${mm}/${dd}/png/${encodeURIComponent(image)}.png`
}

const fetchJsonArray = async (url: string): Promise<any[] | null> => {
    try {
        const res = await fetch(url)
        if (!res.ok) return null
        const data = await res.json()
        return Array.isArray(data) ? data : null
    } catch (err) {
        console.warn('fetchJsonArray error', err)
        return null
    }
}

export async function getEpicNaturalAll(): Promise<EpicNaturalItem[] | null> {
    try {
        // Use GSFC EPIC API; `/api/natural` returns most recent natural images
        const url = `https://epic.gsfc.nasa.gov/api/natural`
        const data = await fetchJsonArray(url)
        if (!data) return null

        return data.map((item: any) => ({
            identifier: item.identifier,
            caption: item.caption ?? null,
            image: item.image ?? null,
            date: item.date ?? null,
            url: buildArchiveUrl(item.date, item.image),
        }))
    } catch (err) {
        console.warn('getEpicNaturalAll error', err)
        return null
    }
}

export async function getEpicByDate(date: string): Promise<EpicNaturalItem[] | null> {
    try {
        const url = `https://epic.gsfc.nasa.gov/api/natural/date/${encodeURIComponent(date)}`
        const data = await fetchJsonArray(url)
        if (!data) return null

        const items: EpicNaturalItem[] = data.map((item: any) => {
            const dateStr: string | undefined = item.date
            let archiveUrl: string | null = null

            if (dateStr && item.image) {
                archiveUrl = buildArchiveUrl(item.date, item.image)
            }

            return {
                identifier: item.identifier,
                caption: item.caption || null,
                image: item.image || null,
                date: item.date || null,
                url: archiveUrl,
            }
        })

        return items
    } catch (err) {
        console.warn('getEpicByDate error', err)
        return null
    }
}

// NeoWs (Near Earth Object Web Service) API types
export type NeoAsteroid = {
    id: string
    neo_reference_id: string
    name: string
    nasa_jpl_url: string
    absolute_magnitude_h: number
    estimated_diameter: {
        kilometers: { min: number; max: number }
        meters: { min: number; max: number }
        miles: { min: number; max: number }
        feet: { min: number; max: number }
    }
    is_potentially_hazardous_asteroid: boolean
    close_approach_data: Array<{
        close_approach_date: string
        relative_velocity: { kilometers_per_second: number }
        miss_distance: { kilometers: number }
    }>
}

export type NeoFeedResult = {
    asteroids: NeoAsteroid[]
    element_count: number
    links: { next?: string; prev?: string }
}

const NEO_API_KEY = 'TLzQSxfAsc3pTtpGfCkZ7lP90FM7JqohAuQb2c8W'

// Fetch asteroids by date range
export async function getNeoFeed(startDate: string, endDate?: string): Promise<NeoFeedResult | null> {
    try {
        const end = endDate || startDate
        const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${end}&api_key=${NEO_API_KEY}`
        
        const res = await fetch(url)
        if (!res.ok) return null

        const data = await res.json()
        if (!data.near_earth_objects) return null

        const allAsteroids: NeoAsteroid[] = []
        Object.values(data.near_earth_objects).forEach((dayAsteroids: any) => {
            if (Array.isArray(dayAsteroids)) {
                allAsteroids.push(...dayAsteroids)
            }
        })

        return {
            asteroids: allAsteroids,
            element_count: data.element_count || allAsteroids.length,
            links: data.links || {},
        }
    } catch (err) {
        console.warn('getNeoFeed error', err)
        return null
    }
}

// Lookup a specific asteroid by ID
export async function getNeoById(asteroidId: string): Promise<NeoAsteroid | null> {
    try {
        const url = `https://api.nasa.gov/neo/rest/v1/neo/${encodeURIComponent(asteroidId)}?api_key=${NEO_API_KEY}`
        
        const res = await fetch(url)
        if (!res.ok) return null

        const data = await res.json()
        return data || null
    } catch (err) {
        console.warn('getNeoById error', err)
        return null
    }
}

// Browse all asteroids
export async function getNeoBrowse(page: number = 0): Promise<{ asteroids: NeoAsteroid[]; page: any } | null> {
    try {
        const url = `https://api.nasa.gov/neo/rest/v1/neo/browse?page=${page}&api_key=${NEO_API_KEY}`
        
        const res = await fetch(url)
        if (!res.ok) return null

        const data = await res.json()
        return {
            asteroids: data.near_earth_objects || [],
            page: data.page || {},
        }
    } catch (err) {
        console.warn('getNeoBrowse error', err)
        return null
    }
}

