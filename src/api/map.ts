import axios from 'axios'

export const getMapGeoDataById = (areaId: string) =>
  axios.get<{
    areaName: string
    data: string
  }>(`/api/map/getAreaGeoDataById?areaId=${areaId}`)
