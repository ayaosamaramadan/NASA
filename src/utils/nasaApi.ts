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

export async function getEpicNaturalAll(): Promise<EpicNaturalItem[] | null> {
    try {
        const apiKey = "TLzQSxfAsc3pTtpGfCkZ7lP90FM7JqohAuQb2c8W"
        const url = `https://api.nasa.gov/EPIC/api/natural/images?api_key=${encodeURIComponent(apiKey)}`
        const res = await fetch(url)
        if (!res.ok) return null
        const data = await res.json()
        if (!Array.isArray(data)) return null

        const items: EpicNaturalItem[] = data.map((item: any) => {
            const dateStr: string | undefined = item.date
            let archiveUrl: string | null = null

            if (dateStr && item.image) {
                const d = new Date(dateStr + ' UTC')
                const yyyy = d.getUTCFullYear()
                const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
                const dd = String(d.getUTCDate()).padStart(2, '0')

                archiveUrl = `https://epic.gsfc.nasa.gov/archive/natural/${yyyy}/${mm}/${dd}/png/${encodeURIComponent(item.image)}.png`
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
        console.warn('getEpicNaturalAll error', err)
        return null
    }
}

// Fetch EPIC images for a specific date (YYYY-MM-DD)
export async function getEpicByDate(date: string): Promise<EpicNaturalItem[] | null> {
    try {
        const apiKey = "TLzQSxfAsc3pTtpGfCkZ7lP90FM7JqohAuQb2c8W"
        const url = `https://api.nasa.gov/EPIC/api/natural/date/${encodeURIComponent(date)}?api_key=${encodeURIComponent(apiKey)}`
        const res = await fetch(url)
        if (!res.ok) return null
        const data = await res.json()
        if (!Array.isArray(data)) return null

        const items: EpicNaturalItem[] = data.map((item: any) => {
            const dateStr: string | undefined = item.date
            let archiveUrl: string | null = null

            if (dateStr && item.image) {
                const d = new Date(dateStr + ' UTC')
                const yyyy = d.getUTCFullYear()
                const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
                const dd = String(d.getUTCDate()).padStart(2, '0')

                archiveUrl = `https://epic.gsfc.nasa.gov/archive/natural/${yyyy}/${mm}/${dd}/png/${encodeURIComponent(item.image)}.png`
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