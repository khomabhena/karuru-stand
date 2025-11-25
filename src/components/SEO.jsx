import { useEffect } from 'react'

/**
 * SEO Component for dynamic meta tags
 * Usage: <SEO title="Page Title" description="Page description" />
 */
export function SEO({ 
	title, 
	description, 
	keywords, 
	image, 
	url,
	type = 'website'
}) {
	useEffect(() => {
		// Update document title
		if (title) {
			document.title = title.includes('Karuru') 
				? title 
				: `${title} | Karuru Stand Management`
		}

		// Update or create meta tags
		const updateMetaTag = (name, content, isProperty = false) => {
			if (!content) return
			
			const attribute = isProperty ? 'property' : 'name'
			let meta = document.querySelector(`meta[${attribute}="${name}"]`)
			
			if (!meta) {
				meta = document.createElement('meta')
				meta.setAttribute(attribute, name)
				document.head.appendChild(meta)
			}
			
			meta.setAttribute('content', content)
		}

		// Primary meta tags
		updateMetaTag('title', title)
		updateMetaTag('description', description)
		if (keywords) updateMetaTag('keywords', keywords)

		// Open Graph tags
		updateMetaTag('og:title', title, true)
		updateMetaTag('og:description', description, true)
		updateMetaTag('og:type', type, true)
		if (url) updateMetaTag('og:url', url, true)
		if (image) updateMetaTag('og:image', image, true)

		// Twitter Card tags
		updateMetaTag('twitter:title', title)
		updateMetaTag('twitter:description', description)
		if (image) updateMetaTag('twitter:image', image)

		// Canonical URL
		if (url) {
			let canonical = document.querySelector('link[rel="canonical"]')
			if (!canonical) {
				canonical = document.createElement('link')
				canonical.setAttribute('rel', 'canonical')
				document.head.appendChild(canonical)
			}
			canonical.setAttribute('href', url)
		}
	}, [title, description, keywords, image, url, type])

	return null
}

