'use client'

import { UnsplashImage } from '@/models/unsplash-image'
import { FormEvent, useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import Image from 'next/image'
import styles from './SearchPage.module.css'

export default function SearchPage () {
  const [searchResults, setSearchResults] = useState<UnsplashImage[] | null>(null)
  const [searchResultsLoading, setShowResultsLoading] = useState(false)
  const [searchResultsLoadingError, setShowResultsLoadingError] = useState(false)

  const onSubmit =  async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const query = formData.get('query')?.toString().trim()

    if (query) {
      try {
        setSearchResults(null)
        setShowResultsLoadingError(false)
        setShowResultsLoading(true)
        const response = await fetch(`/api/search?query=${query}`)
        const images: UnsplashImage[] = await response.json()
        setSearchResults(images)
      } catch (err) {
        setShowResultsLoadingError(true)
        console.error(err)
      } finally {
        setShowResultsLoading(false)
      }
    }
  }

  return(
    <div>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-1" controlId="search-input">
          <Form.Label>Search query</Form.Label>
          <Form.Control name="query" placeholder="e.g. cats, hotdogs, ..." />
        </Form.Group>
        <Button type="submit" className="mb-1" disabled={searchResultsLoading}>Search</Button>
      </Form>

      <div className="d-flex flex-column align-items-center">
        {searchResultsLoading && <Spinner animation="border" />}
        {searchResultsLoadingError && <p>Something went wrong, please try again.</p>}
        {searchResults?.length === 0 && <p>Nothing found. Try a dufferent query.</p>}
      </div>

      {searchResults && (
        <>
          {searchResults.map(image => (
            <Image
              key={image.urls.raw}
              src={image.urls.raw}
              width={250}
              height={250}
              alt={image.description}
              className={styles.image}
            />
          ))}
        </>
      )}
    </div>
  )
}
