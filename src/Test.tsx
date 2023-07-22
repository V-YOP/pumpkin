import { ImageData } from "@/ImageMeta";
import { Flex, Input } from "@chakra-ui/react";
import { MutableRefObject, useEffect, useReducer, useRef, useState } from "react";

function readImageByFile(file: File): Promise<ImageData> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = readerEvent => {
      const base64 = readerEvent.target!.result as string
      const image = new Image()
      image.src = base64
      image.onload = () => {
        const width = image.width;
        const height = image.height;
        const ratio = width / height
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!;
        canvas.width = 400
        canvas.height = Math.floor(canvas.width / ratio)
        // 将图像绘制到canvas上并缩放
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        // 将缩放后的图像转换为base64对象
        const thumbnailBase64 = canvas.toDataURL('image/jpeg', 0.8)
        resolve({
          imageName: file.name,
          original: base64,
          thumbnail: thumbnailBase64,
          width, height
        })
      }
    }
  })
}

export function Test() {
  const [, refresh] = useReducer(x => x + 1, 0)
  const ref: MutableRefObject<HTMLInputElement | null> = useRef(null)

  const [imageMeta, setImageMeta] = useState<ImageData | null>(null)

  useEffect(() => {
    (async () => {
      if (!ref.current || !ref.current.files) return
      const f = ref.current.files[0]
      const meta = await readImageByFile(f)
      setImageMeta(meta)
    })()
  })

  return (
    <>
      <Input ref={ref} type="file" onChange={refresh}></Input>
      <Flex justifyContent='flex-start' alignItems='flex-start'>
      <img src={imageMeta?.original} />
      <img src={imageMeta?.thumbnail} />
      <p>{imageMeta?.imageName}</p>
      <p>{imageMeta?.width}</p>
      <p>{imageMeta?.height}</p></Flex>
    </>
  )
}