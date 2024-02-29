import { getUserHotMap } from '@/api/map'
import { useMapStore } from '@/store/map'
import { IHotMap } from '@/types/map'
import { useState } from 'react'

export default function useHotMap() {
  const { getHotMap, setHotMap } = useMapStore()
  const [hotMap, setHM] = useState<IHotMap | undefined>(getHotMap())
  if (!hotMap) {
    getUserHotMap().then((res) => {
      if (res.data.data) {
        setHotMap(res.data.data)
        setHM(res.data.data)
      }
    })
  }
  return hotMap
}
