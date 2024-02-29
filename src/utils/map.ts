import { IHotMap, IMapJson } from '@/types/map'
import { EXPORT_DETAIL } from 'next/dist/shared/lib/constants'
import { exitCode } from 'process'

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

export function getHotMapByAreaId(areaId: string, hotMap: IHotMap) {
  if (!hotMap) return 0
  if (areaId.length === 2) {
    return hotMap[areaId] ? hotMap[areaId].count : 0
  } else {
    const provinceId = areaId.slice(0, 2)
    if (hotMap[provinceId]) {
      return hotMap[provinceId].children[areaId]
        ? hotMap[provinceId].children[areaId].count
        : 0
    } else {
      return 0
    }
  }
}

export function getAreaHotColor(factor: number) {
  const minColor = 0xf9f7f7
  const maxColor = 0x7d0a0a
  // 提取颜色的 R、G、B 分量
  var r1 = (minColor >> 16) & 0xff
  var g1 = (minColor >> 8) & 0xff
  var b1 = minColor & 0xff

  var r2 = (maxColor >> 16) & 0xff
  var g2 = (maxColor >> 8) & 0xff
  var b2 = maxColor & 0xff

  // 插值计算
  var r = Math.round(r1 + factor * (r2 - r1))
  var g = Math.round(g1 + factor * (g2 - g1))
  var b = Math.round(b1 + factor * (b2 - b1))

  // 合并新的颜色值
  return (r << 16) | (g << 8) | b
}
