export type ImageData = {
  /**
   * 图像名称
   */
  imageName: string,
  /**
   * 图像原始base64
   */
  original: string,
  /**
   * 图像缩略图base64，等比缩放宽度至400像素
   */
  thumbnail: string,
  /**
   * 图像原始宽度
   */
  width: number,
  /**
   * 图像原始高度
   */
  height: number
}

export type ImageMeta = {
  /**
   * 相册名称
   */
  albumName: string,
  /**
   * 图像名称
   */
  imageName: string,
  /**
   * 图像原始url
   */
  original: string,
  /**
   * 图像缩略图url
   */
  thumbnail: string,
  /**
   * 图像原始宽度
   */
  width: number,
  /**
   * 图像原始高度
   */
  height: number
}

