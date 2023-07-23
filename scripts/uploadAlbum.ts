import { ImageData, ImageMeta } from './ImageMeta'
import Sharp from 'Sharp'
import fs from 'fs/promises'
import COS from "cos-nodejs-sdk-v5"
import path from 'path'
import {CONFIG} from './CONFIG.ts'

const cos = new COS({
  SecretId: CONFIG.accessKey, 
  SecretKey: CONFIG.secretKey, 
  ChunkParallelLimit: 32, 
  FileParallelLimit: 32})

const META_FILE_PATH = path.resolve(process.cwd(), 'public', 'STATIC_ALBUM.json')

async function readMetaFile() {
  try {
    const metaFile = await fs.readFile(META_FILE_PATH)
    return JSON.parse(metaFile.toString()) as ImageMeta[]
  } catch (e) {
    console.error(e)
    return []
  }
}

async function main() {
  // 读取原来的文件，上传前检查是否已经上传
  const metaFile = await readMetaFile()
  const imageIds = new Set<string>()
  metaFile.forEach(meta => {
    imageIds.add(meta.albumName + meta.imageName)
  })

  const albums = await getAllAlbumImgs()
  const albumNameImgPairs = Object.entries(albums).flatMap(([albumName, files]) => files.map(file => [albumName, file] as [string, string]))
  const metas: ImageMeta[] = []
  console.time('上传')
  await Promise.all(albumNameImgPairs.map(async ([albumName, imagePath]) => {
    try {
      const img = await readImage(imagePath)
      if (imageIds.has(albumName + img.imageName)) {
        console.log(`${imagePath} exists, skip`)
        return
      }
      const res = await uploadImage(albumName, img)
      metas.push(res)
    } catch (e) {
      console.error(`${imagePath} read fail`, e)
    }
  }))
  console.timeEnd('上传')
  await fs.writeFile(META_FILE_PATH, JSON.stringify([...metaFile, ...metas]))
}

async function uploadImage(albumName: string, image: ReadImageResult): Promise<ImageMeta> {
  const {imageName, width, height, original, thumbnail} = image
  console.time(imageName)
  console.timeLog(imageName, '图像处理')
  const imageKey = `${albumName}/${imageName}`
  const thumbKey = imageKey.replace(path.extname(imageName), `.thumb${path.extname(imageName)}`)
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
  console.timeLog(imageName, '图像上传')
  console.timeEnd(imageName)
  return {
    albumName, imageName, width, height, original: oriRes.Location, thumbnail: thumbRes.Location
  }
}

type ReadImageResult = Omit<ImageData, 'original' | 'thumbnail'> & {original: Buffer, thumbnail: Buffer}

async function readImage(imgPath: string): Promise<ReadImageResult> {
  const imageName = path.basename(imgPath)
  const bf = await fs.readFile(imgPath)
  const image = Sharp(bf)
  const metadata = await image.metadata()
  const [width, height] = [metadata.width!, metadata.height!]
  const thumbnail = await image.clone().resize(400).jpeg({quality: 80}).toBuffer()
  return {
    imageName, original: bf, thumbnail, width, height
  }
}

async function getAllAlbumImgs() {
  const albumName2imgs: Record<string, string[]> = {}
  const ALBUM_PATH = path.resolve(process.cwd(), 'upload_albums')
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

main().catch(console.error);
