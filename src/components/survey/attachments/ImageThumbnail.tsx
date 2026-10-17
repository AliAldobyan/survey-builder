import { useEffect, useRef } from 'react'
import { Image } from '@mantine/core'

export function ImageThumbnail({ file, alt }: { file: File; alt: string }) {
  const image = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const previewUrl = URL.createObjectURL(file)
    if (image.current) image.current.src = previewUrl
    // Release the browser URL when the preview is replaced or unmounted.
    return () => URL.revokeObjectURL(previewUrl)
  }, [file])

  return <Image ref={image} alt={alt} w={120} h={90} fit="contain" radius="sm" />
}
