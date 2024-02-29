import { getAreaDetailById } from '@/api/map'
import { AreaDetail } from '@/types/map'
import { useState, useEffect } from 'react'

export default function useAreaDetail(areaId: string) {
  const [areaDetail, setAreaDetail] = useState<AreaDetail | null>(null)

  useEffect(() => {
    if (areaId) {
      getAreaDetailById(areaId).then((res) => {
        if (res.data.code === 200) {
          const { data } = res.data
          setAreaDetail(data!)
        }
      })
    }
  }, [areaId])

  return areaDetail
}
