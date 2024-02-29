'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { IMapJson } from '@/types/map'
import Toolbox, { IToolboxItem } from '@/components/common/toolbox'
import * as PIXI from 'pixi.js'
import { getAreaHotColor, getHotMapByAreaId, getMapParams } from '@/utils'
import gsap from 'gsap'
import useFleetingMessage from '@/hooks/useFleetingMessage'
import AreaDetail from '@/components/map/AreaDetail'
import MapCanvas from '@/components/map/MapCanvas'
import Record from '@/components/map/Record'
import { useRouter } from 'next/navigation'
import { getMapGeoDataById } from '@/api/map'
import useHotMap from '@/hooks/useHotMap'
const MAX_WIDTH = 1000
const MAX_HEIGHT = 600

export default function Page({ params }: { params: { id: string } }) {
  const areaId = params.id
  const [isLoaded, setIsLoaded] = useState(false)
  const [mapParams, setMapParams] = useState({
    width: 0,
    height: 0,
    corner: { longitude: 0, latitude: 0 },
  })
  const mapJsonRef = useRef<IMapJson[] | null>(null)
  const [selectedAreaId, setSelectedAreaId] = useState<string>('')
  const [stageSize, setStageSize] = useState({
    width: MAX_WIDTH,
    height: MAX_HEIGHT,
  })
  const router = useRouter()
  // 显示控制
  const [detailVisible, setDetailVisible] = useState(false)
  const [recordVisible, setRecordVisible] = useState(false)
  const [showMessage, messageContainer] = useFleetingMessage({
    position: 'center',
  })

  const [mapMode, setMapMode] = useState<'normal' | 'hotMap'>('normal')
  const hotMap = useHotMap()

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
        if (mapMode === 'hotMap') {
          const areaId = area.properties.id
          const hotData = hotMap ? getHotMapByAreaId(areaId, hotMap) : 0
          const color = getAreaHotColor(hotData / 10)
          p.beginFill(color)
        } else {
          p.beginFill('0xffffff')
        }
        p.lineStyle(1, 0xdee1e6)
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

        const text = new PIXI.Text(area.properties.name, {
          fontSize: 14,
          fill: 0x000000,
        })
        text.position.x =
          ((area.properties.cp[0] - mapCorner.longitude) / mapWidth) *
          stageWidth
        text.position.y =
          stageHeight -
          ((area.properties.cp[1] - mapCorner.latitude) / mapHeight) *
            stageHeight
        text.anchor.set(0.5)

        p.on('pointerenter', () => {
          p.tint = 0xdbe2ef
          g.addChild(text)
        })
        p.on('pointerout', () => {
          p.tint = 0xffffff
          g.removeChild(text)
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
              if (area.properties.childNum && area.properties.id.length === 2) {
                router.push('/map/' + area.properties.id)
              }
            }
          } else {
            lastClickTime = now
            timeoutId = setTimeout(() => {
              // 单击事件处理
              lastClickTime = 0
              setSelectedAreaId(area.properties.id)
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
    [isLoaded, mapMode]
  )

  const toolBoxItems: IToolboxItem[] = [
    {
      iconName: 'addImg',
      transformOrigin: '100% 100%',
      uniqueStyle: 'rounded-tl-[120px]',
      needAuth: true,
      actions: () => {
        setRecordVisible(true)
      },
    },
    {
      iconName: 'addImg',
      transformOrigin: '0% 100%',
      uniqueStyle: 'rounded-tr-[120px]',
      needAuth: true,
      actions: () => {
        setMapMode('hotMap')
      },
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
    getMapGeoDataById(areaId).then((res) => {
      const body = res.data
      const data = JSON.parse(body.data)
      mapJsonRef.current = data.features
      const newMapParams = getMapParams(data.features)
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

      showMessage(body.areaName)

      setIsLoaded(true)
    })
  }, [])

  return (
    <div className='w-full flex-1 flex flex-col items-center justify-center relative'>
      <div className='w-[1000px] h-[600px] flex items-center justify-center'>
        <MapCanvas drawMap={drawMap} stageSize={stageSize} />
      </div>
      {mapMode === 'hotMap' && (
        <div className='fixed left-20 bottom-10 h-44'>
          <div className='absolute w-8 h-full bg-gradient-to-b from-[#7D0A0A] to-[#f9f7f7]'></div>
          <div className='absolute top-[1.5rem] left-[40px] text-white font-bold text-center'>
            区域图片数
          </div>
          <div className='absolute bottom-0 left-[40px] border-b-2 text-white font-bold'>
            0
          </div>
          <div className='absolute top-0 left-[40px] border-b-2 text-white font-bold'>
            100
          </div>
        </div>
      )}
      {messageContainer}
      {recordVisible && <Record handleClose={() => setRecordVisible(false)} />}
      {detailVisible && (
        <AreaDetail
          areaId={selectedAreaId}
          handleClose={() => setDetailVisible(false)}
        />
      )}
      <div className='absolute bottom-10 right-10'>
        <Toolbox items={toolBoxItems} />
      </div>
    </div>
  )
}
