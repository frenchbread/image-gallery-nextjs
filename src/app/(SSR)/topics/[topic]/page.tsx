import { UnsplashImage } from '@/models/unsplash-image'
import Image from 'next/image'
import styles from './page.module.css'
import { Alert } from '@/components/bootstrap'
import { Metadata } from 'next'

// export const revalidate = 0;

export const dynamicParams = false

interface PageProps {
  params: { topic: string },
  // searchParams: { [key: string]: string | string[] | undefined },
}

export function generateMetadata ({ params: { topic } }: PageProps): Metadata {
  return {
    title:`${topic} - Image Gallery`
  }
}

export function generateStaticParams () {
  return ['health', 'fitness', 'coding'].map(topic => ({ topic }))
}

export default async function Page ({params: { topic } } : PageProps) {
  const response = await fetch(`https://api.unsplash.com/photos/random?query=${topic}&count=30&client_id=${process.env.UNSPLASH_ACCESS_KEY}`)
  const images: UnsplashImage[] = await response.json()

  return (
    <div>
      <h1>{topic}</h1>
      <Alert>This page uses <strong>generateStatisParams</strong> to render and cache static pages at build time even though the URL has a dynamic parameter. Pages that are not included in generateStatic will be fetched & rebdererd on first access and then <strong>cached for the subsequent requests</strong> (this can be disabled).</Alert>
      {
        images.map(image => (
          <Image
            src={image.urls.raw}
            width={250}
            height={250}
            alt={image.description}
            key={image.urls.raw}
            className={styles.image}
          />
        ))
      }
    </div>
  )
}
