import { ImageData, ImageMeta } from '../src/ImageMeta'
import Sharp from 'Sharp'
import fs from 'fs/promises'
import COS from "cos-nodejs-sdk-v5"
import path from 'path'

const CONFIG = {
  accessKey: 'AKIDtfL0VosrAIBpWzFIAoDOPGwTq5KQd2MU',
  secretKey: 'ypX4NVbVDi8OcjlaFgYHoDe2NabdYJp7',
  bucketName: '71780a8cqed-1259498433',
  region: 'ap-nanjing'
}

const cos = new COS({
  SecretId: CONFIG.accessKey, 
  SecretKey: CONFIG.secretKey, 
  ChunkParallelLimit: 32, 
  FileParallelLimit: 32})

async function main() {
  const albums = await getAllAlbumImgs()
  const albumNameImgPairs = Object.entries(albums).flatMap(([albumName, files]) => files.map(file => [albumName, file] as [string, string]))
  const metas: ImageMeta[] = []
  console.time('上传')
  await Promise.all(albumNameImgPairs.map(async ([albumName, imagePath]) => {
    try {
      const res = await uploadImage(albumName, imagePath)
      metas.push(res)
    } catch (e) {
      console.error(`${imagePath} read fail`, e)
    }
  }))
  await fs.writeFile(path.resolve(process.cwd(), 'public', 'STATIC_ALBUM.json'), JSON.stringify(metas))
}

async function uploadImage(albumName: string, imagePath: string): Promise<ImageMeta> {
  console.time(imagePath)
  const {imageName, width, height, original, thumbnail} = await readImage(imagePath)
  console.timeLog(imagePath, '图像处理')
  const imageKey = `${albumName}/${imageName}`
  const thumbKey = imageKey.replace(path.extname(imagePath), `.thumb${path.extname(imagePath)}`)
  const [oriRes, thumbRes] = await Promise.all([cos.putObject({
    Bucket: CONFIG.bucketName,
    Region: CONFIG.region,
    Body: original,
    Key: imageKey
  }), cos.putObject({
    Bucket: CONFIG.bucketName,
    Region: CONFIG.region,
    Body: thumbnail,
    Key: thumbKey
  })])
  console.timeLog(imagePath, '图像上传')
  console.timeEnd(imagePath)
  return {
    albumName, imageName, width, height, original: oriRes.Location, thumbnail: thumbRes.Location
  }
}

async function readImage(imgPath: string): Promise<Omit<ImageData, 'original' | 'thumbnail'> & {original: Buffer, thumbnail: Buffer}> {
  const imageName = path.basename(imgPath)
  const bf = await fs.readFile(imgPath)
  const image = Sharp(bf)
  const metadata = await image.metadata()
  const [width, height] = [metadata.width!, metadata.height!]
  const thumbnailImage = await image.clone().resize(400)
  const thumbnail = await thumbnailImage.jpeg({quality: 80}).toBuffer()
  return {
    imageName, original: bf, thumbnail, width, height
  }
}

async function getAllAlbumImgs() {
  const albumName2imgs: Record<string, string[]> = {}
  const ALBUM_PATH = path.resolve(process.cwd(), 'album')
  const albums = await fs.readdir(ALBUM_PATH)
  await Promise.all(albums.map(async album => {
    const SUB_ALBUM_PATH = path.resolve(ALBUM_PATH, album)
    const stat = await fs.stat(SUB_ALBUM_PATH)
    if (!stat.isDirectory()) {
      console.info(`${SUB_ALBUM_PATH} is not directory, skip`)
      return
    }
    const imgs = await fs.readdir(SUB_ALBUM_PATH)
    albumName2imgs[album] = imgs.map(img => path.resolve(SUB_ALBUM_PATH, img))
      .filter(img => {
        const imgExts = ['.jpg', '.jpeg', '.raw', '.png', '.gif', '.webp']
        return imgExts.some(ext => img.endsWith(ext))
      })
  }))
  return albumName2imgs
}

main()

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
