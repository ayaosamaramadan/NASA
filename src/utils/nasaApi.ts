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
