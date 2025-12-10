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

export type ApodResult = {
    url: string | null
    media_type?: string | null
    title?: string | null
    explanation?: string | null
    date?: string | null
}

export async function getApodImage(daysAgo: number = 1): Promise<ApodResult | null> {
    try {
        const apiKey = "TLzQSxfAsc3pTtpGfCkZ7lP90FM7JqohAuQb2c8W";
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const dateStr = date.toISOString().split('T')[0];

        const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${dateStr}`
        const res = await fetch(url)
        if (!res.ok) {
          return null
        }

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
            result.url = data.hdurl || data.url || null
        }

        return result
    } catch (err) {
        console.warn('getApodImage error', err)
        return null
    }
}
