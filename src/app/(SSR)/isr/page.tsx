import { Alert } from '@/components/bootstrap'
import { UnsplashImage } from '@/models/unsplash-image'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: "Incremental static regeneration - Image Gallery"
}

export const revalidate = 15;

export default async function Page () {
  const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_KEY}`, {
    // cache: 'no-cache'
    // next: { revalidate: 0 }
  })
  const image: UnsplashImage = await response.json()

  const width = Math.min(500, image.width)
  const height = (width / image.width) * image.height

  return (
    <div className="d-flex flex-column align-items-center">
      <Alert>This page <strong>incremental static regeneration</strong>. A new image is fetched every 15 seconds (after refreshing the page) and then served from the cache for that duration.</Alert>
      <Image
        src={image.urls.raw}
        width={width}
        height={height}
        alt={image.description || 'no description provided'}
        className="rounded shadow mw-100 h-100 mb-1"
        />
      by <Link href={`/user/${image.user.username}`}>{image.user.username}</Link>
    </div>
  )
}
