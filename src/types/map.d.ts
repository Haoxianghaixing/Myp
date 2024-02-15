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
