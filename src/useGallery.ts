import { ImageMeta } from "@/ImageMeta"
import { distinctBy, groupBy } from "@/util"
import { useEffect, useMemo, useState } from "react"

type StaticGallery = {
  type: 'STATIC_GALLERY',
  metaDataUrl: string,
}

type GalleryOption = StaticGallery | { type: '占位' }

export function useGallery(option: GalleryOption) {
  const [allImageMeta, setAllImageMeta] = useState<ImageMeta[]>([])
  const [currentAlbum, setCurrentAlbum] = useState<string>('')
  const [error, setError] = useState<Error | string | null>(null)

  const album2Metas = useMemo(() => {
    return groupBy(allImageMeta.sort((a, b) => a.imageName === b.imageName ? 0 : a.imageName < b.imageName ? -1: 1), img => img.albumName)
  }, [allImageMeta])

  const allAlbums = useMemo<string[]>(() => {
    return Object.keys(album2Metas)
  }, [album2Metas])

  const images = useMemo<ImageMeta[]>(() => {
    return album2Metas[currentAlbum] ?? []
  }, [allAlbums, allImageMeta])

  useEffect(() => {
    (async () => {

      // clean
      setError(null)
      setAllImageMeta([])

      if (option.type === 'STATIC_GALLERY') {
        try {
          const res = await fetch(option.metaDataUrl)
          const datas = await res.json() as ImageMeta[]
          if (datas.length === 0) {
            throw `no pictures found in ${option.metaDataUrl}`
          }
          setAllImageMeta(datas)
          setCurrentAlbum(datas[0].albumName)
        } catch (e) {
          console.log(e)
          setError(e as any)
        }
      }
    })()
  }, [option.type, (option as any).metaDataUrl])

  return {images, allAlbums, error, currentAlbum, setCurrentAlbum}
}