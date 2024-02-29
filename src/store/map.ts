import { IHotMap } from '@/types/map'
import { create } from 'zustand'

type MapData = {
  hotMap: IHotMap
}

type MapStore = {
  data: MapData | null
  setHotMap: (hotMap: IHotMap) => void
  getHotMap: () => IHotMap | undefined
}

export const useMapStore = create<MapStore>((set, get) => ({
  data: null,
  setHotMap: (hotMap: IHotMap) => set({ data: { hotMap } }),
  getHotMap: () => {
    if (get().data) {
      return get().data!.hotMap
    } else {
      return undefined
    }
  },
}))
