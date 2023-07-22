/*
要求能够上传，列举，下载，预览图片

上传图片时，保存元信息到链接中，格式为 <basename>.<w>.<h>.<ext>

*/

import COS from "cos-js-sdk-v5"

const META_OBJECT_NAME = '.META'

export type ImageMetadata = {
  realPath: string, 
  thumbtailPath: string,
  size: [number, number],
  fileName: string
}

export class OSSHelper {
  private readonly cos: COS
  private readonly bucketInfo: {Bucket: string, Region: string}
  constructor(param: {accessKey: string, secretKey: string, bucketName: string, region: string}) {
    this.cos = new COS({SecretId: param.accessKey, SecretKey: param.secretKey})
    this.bucketInfo = {Bucket: param.bucketName, Region: param.region}
  }

  private getPicUrl(key: string) {
    return `//${this.bucketInfo.Bucket}.cos.${this.bucketInfo.Region}.myqcloud.com/${key}`
  }

  // TODO 要可配
  private parseKey(key: string): ImageMetadata | null {
    try {
      if (key.endsWith('/')) {
        return null
      }
      const paths = key.split('/')
      const fileName = paths[paths.length - 1]
      const slices = fileName.split('.')
      if (slices.length < 4) {
        return null
      }
      const [ext, height, width, ...base] = [...slices].reverse()
      base.reverse()
      return {
        realPath: this.getPicUrl(key),
        thumbtailPath: this.getPicUrl(key) + '?imageMogr2/thumbnail/240x',
        size: [+width, +height],
        fileName: base.join('.') + '.' + ext,
      }
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async upload(targetDir: string, fileObject: File): Promise<String> {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(fileObject)
    const [width, height] = await new Promise<[number,number]>((resolve, reject) => {
      fileReader.onload = () => {
        const base64 = fileReader.result as string
        const img = new Image()
        console.log(base64)
        img.src = base64
        img.onload = () => {
          resolve([img.naturalWidth, img.naturalHeight])
        }
        img.onerror = (e) => {
          reject(e)
        }
      }
    })
    const [base, ext] = fileObject.name.split('.')

    const status = await this.cos.putObject({
      Bucket: 'myalbum-1259498433',
      Region: 'ap-nanjing',
      Key: `${targetDir}${base}.${width}.${height}.${ext}`,
      Body: fileObject
    })
    return `${targetDir}${base}.${width}.${height}.${ext}`
  }

  async list(albumName: string): Promise<ImageMetadata[]> {
    return (await this.listAllByParam({Prefix: `${albumName}/`, ...this.bucketInfo})).flatMap(content => {
      const key = content.Key
      const metadata = this.parseKey(key)
      if (!metadata) {
        console.warn(`invalid key: '${key}', skipped`)
        return []
      }
      return [metadata]
    })
  }

  async listAlbums(): Promise<String[]> {
    try {
      const meta = await this.cos.getObject({...this.bucketInfo, Key: META_OBJECT_NAME})
      const albumNames = meta.Body.toString().split(',')
      return albumNames
    } catch (e) {
      return []
    }
  }
  async setAlbums(albumNames: string[]): Promise<void> {
    await this.cos.putObject({...this.bucketInfo, Key: META_OBJECT_NAME, Body: albumNames.join(',')})
  }

  private async listAllByParam(param: COS.GetBucketParams): Promise<COS.CosObject[]> {
    const paramCopy = {...param}
    delete paramCopy['MaxKeys']
    const res: COS.CosObject[][] = []

    let list = await this.cos.getBucket(param)
    res.push(list.Contents)
    while (list.NextMarker) {
      paramCopy.Marker = list.NextMarker
      list = await this.cos.getBucket(paramCopy)
      res.push(list.Contents)
    }
    return res.flatMap(x=>x.filter(x=>x.Key !== META_OBJECT_NAME))
  }
}
const ossHelper = new OSSHelper({
  accessKey: 'AKIDtfL0VosrAIBpWzFIAoDOPGwTq5KQd2MU',
  secretKey: 'ypX4NVbVDi8OcjlaFgYHoDe2NabdYJp7',
  bucketName: 'myalbum-1259498433',
  region: 'ap-nanjing'
})
