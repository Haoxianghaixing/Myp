import { AreaDetail, IHotMap, IPicture } from '@/types/map'
import axios from 'axios'

export const getMapGeoDataById = (areaId: string) =>
  axios.get<{
    areaName: string
    data: string
  }>(`/api/map/getAreaGeoDataById?areaId=${areaId}`)

export const uploadImage = (data: FormData, onUploadProgress: any) =>
  axios.post<{
    code: number
    message: string
    fileName?: string
  }>(`/api/map/uploadImage`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })

export const getAreaDetailById = (areaId: string) =>
  axios.get<{
    code: number
    message: string
    data?: AreaDetail
  }>(`/api/map/getAreaDetailById?areaId=${areaId}`)

export const addRecord = (
  areaId: string,
  fileList: string[],
  takeDate?: string,
  spot?: string
) =>
  axios.post<{
    code: number
    message: string
  }>(`/api/map/addRecord`, {
    areaId,
    fileList,
    takeDate,
    spot,
  })

export const getAreaSelectOptions = () =>
  axios.get<{
    code: number
    message: string
    data: {
      areaId: string
      areaName: string
      children: {
        areaId: string
        areaName: string
      }[]
    }[]
  }>(`/api/map/getAreaList`)

export const getUserHotMap = () =>
  axios.get<{
    code: number
    message: string
    data: IHotMap | null
  }>(`/api/map/getUserHotMap`)
