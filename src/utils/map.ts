import { IMapJson } from '@/types/map'

export async function getMapDataById(id: string) {
  const res = await fetch(`/geometryProvince/${id}.json`)
  return await res.json()
}

export function getMapParams(mapJson: IMapJson[]) {
  let minLongitude = 180
  let maxLongitude = -180
  let minLatitude = 90
  let maxLatitude = -90

  mapJson.forEach((item) => {
    const longitude = item.geometry.coordinates
      .flat(3)
      .filter((_, idx) => idx % 2 === 0)
    const latitude = item.geometry.coordinates
      .flat(3)
      .filter((_, idx) => idx % 2 !== 0)
    minLongitude = Math.min(minLongitude, ...longitude)
    maxLongitude = Math.max(maxLongitude, ...longitude)
    minLatitude = Math.min(minLatitude, ...latitude)
    maxLatitude = Math.max(maxLatitude, ...latitude)
  })
  return {
    width: maxLongitude - minLongitude,
    height: maxLatitude - minLatitude,
    corner: {
      longitude: minLongitude,
      latitude: minLatitude,
    },
  }
}
