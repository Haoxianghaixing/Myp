'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { IArea, IMapJson } from '@/types/map'
import Toolbox, { IToolboxItem } from '@/components/common/toolbox'
import * as PIXI from 'pixi.js'
import { getMapDataById, getMapParams } from '@/utils'
import gsap from 'gsap'
import useFleetingMessage from '@/hooks/useFleetingMessage'
import AreaDetail from '@/components/map/AreaDetail'
import MapCanvas from '@/components/map/MapCanvas'
import Record from '@/components/map/Record'
import { useRouter } from 'next/navigation'

const MAX_WIDTH = 1000
const MAX_HEIGHT = 600

export default function Page({ params }: { params: { id: string } }) {
  const areaId = params.id
  const [mapParams, setMapParams] = useState({
    width: 0,
    height: 0,
    corner: { longitude: 0, latitude: 0 },
  })
  const mapJsonRef = useRef<IMapJson[] | null>(null)
  const [selectedArea, setSelectedArea] = useState<IArea | null>(null)
  const selectedAreaRef = useRef<IArea | null>(null)
  const [stageSize, setStageSize] = useState({
    width: MAX_WIDTH,
    height: MAX_HEIGHT,
  })
  const router = useRouter()

  const [isLoaded, setIsLoaded] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [showMessage, messageContainer] = useFleetingMessage({
    position: 'center',
  })

  const [recordVisible, setRecordVisible] = useState(false)

  const drawMap = useCallback(
    (g: PIXI.Graphics) => {
      if (!isLoaded) return
      g.clear()
      g.removeChildren()

      const mapWidth = mapParams.width
      const mapHeight = mapParams.height
      const mapCorner = mapParams.corner
      const stageWidth = stageSize.width
      const stageHeight = stageWidth * (mapHeight / mapWidth)

      g.lineStyle(2, 0xdee1e6)
      mapJsonRef.current!.forEach((area: IMapJson) => {
        const p = new PIXI.Graphics()
        p.lineStyle(1, 0xdee1e6)
        p.beginFill('0xffffff')
        p.eventMode = 'static'
        p.cursor = 'pointer'
        area.geometry.coordinates.forEach((item) => {
          p.drawPolygon(
            item.flat(2).map((item, idx) => {
              if (idx % 2 === 0) {
                return ((item - mapCorner.longitude) / mapWidth) * stageWidth
              } else {
                return (
                  stageHeight -
                  ((item - mapCorner.latitude) / mapHeight) * stageHeight
                )
              }
            })
          )
        })
        p.endFill()
        p.on('pointerenter', () => {
          p.tint = 0xdbe2ef
        })
        p.on('pointerout', () => {
          p.tint = 0xffffff
        })

        let lastClickTime = 0
        let timeoutId: NodeJS.Timeout | null = null
        const handleClickArea = () => {
          const now = new Date().getTime()
          if (lastClickTime) {
            if (now - lastClickTime < 300) {
              // 双击事件处理
              lastClickTime = 0
              clearTimeout(timeoutId!)
              if (area.properties.childNum) {
                router.push('/map/' + area.properties.id)
              }
              setIsLoaded(false)
            }
          } else {
            lastClickTime = now
            timeoutId = setTimeout(() => {
              // 单击事件处理
              lastClickTime = 0
              if (area.properties.name !== selectedAreaRef.current?.name) {
                setSelectedArea({
                  id: area.properties.id,
                  name: area.properties.name,
                })
                selectedAreaRef.current = {
                  id: area.properties.id,
                  name: area.properties.name,
                }
              }
              setDetailVisible(true)
            }, 300)
          }
        }

        p.on('pointerdown', handleClickArea)
        g.addChild(p)
        gsap.fromTo(
          g,
          {
            alpha: 0,
          },
          {
            duration: 0.5,
            alpha: 1,
          }
        )
      })
    },
    [isLoaded]
  )

  const toolBoxItems: IToolboxItem[] = [
    {
      iconName: 'addImg',
      transformOrigin: '100% 100%',
      uniqueStyle: 'rounded-tl-[120px]',
      actions: () => {
        setRecordVisible(true)
      },
    },
    {
      iconName: 'addImg',
      transformOrigin: '0% 100%',
      uniqueStyle: 'rounded-tr-[120px]',
      actions: () => {},
    },
    {
      iconName: 'addImg',
      transformOrigin: '100% 0%',
      uniqueStyle: 'rounded-bl-[120px]',
      actions: () => {},
    },
    {
      iconName: 'addImg',
      transformOrigin: '0% 0%',
      uniqueStyle: 'rounded-br-[120px]',
      actions: () => {},
    },
  ]

  useEffect(() => {
    setIsLoaded(false)
    getMapDataById(areaId).then((res) => {
      mapJsonRef.current = res.features
      const newMapParams = getMapParams(res.features)
      setMapParams(newMapParams)

      const scale = newMapParams.width / newMapParams.height
      if (scale > MAX_WIDTH / MAX_HEIGHT) {
        setStageSize({
          width: MAX_WIDTH,
          height: MAX_WIDTH / scale,
        })
      } else {
        setStageSize({
          width: MAX_HEIGHT * scale,
          height: MAX_HEIGHT,
        })
      }

      showMessage(areaId)

      setIsLoaded(true)
    })
  }, [])

  return (
    <div className='w-full flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#1677b3] to-[#c3d7df] relative'>
      <div className='w-[1000px] h-[600px] flex items-center justify-center'>
        <MapCanvas drawMap={drawMap} stageSize={stageSize} />
      </div>
      {messageContainer}
      {recordVisible && <Record handleClose={() => setRecordVisible(false)} />}
      {detailVisible && (
        <AreaDetail
          selectedArea={selectedArea}
          handleClose={() => setDetailVisible(false)}
        />
      )}
      <div className='absolute bottom-10 right-10'>
        <Toolbox items={toolBoxItems} />
      </div>
    </div>
  )
}
