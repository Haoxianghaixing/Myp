export interface IMapJson {
  type: string
  properties: {
    id: string
    size: string
    name: string
    cp: [number, number]
    childNum: number
  }
  geometry: {
    type: string
    coordinates: number[][][]
  }
}

export interface IArea {
  id: string
  name: string
}

export interface AreaDetail {
  areaId: string
  areaName: string
  areaDesc: string
  areaImgList: IPicture[]
  userImgList: IPicture[]
}

export interface IPicture {
  fileName: string
  areaId: string
  userName: string
  // 上传日期
  uploadDate?: string
  // 拍摄日期
  takeDate?: string
  // 拍摄地点
  spot?: string
}
