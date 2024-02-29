import { IArea } from '@/types/map'
import Detail from './Detail'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Icon from '@/components/common/icon'

interface IAreaDetailProps {
  areaId: string
  handleClose: () => void
}

export default function AreaDetail({ areaId, handleClose }: IAreaDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const close = () => {
    gsap.to(containerRef.current, {
      duration: 0.2,
      right: -400,
      onComplete: () => {
        handleClose()
      },
    })
  }

  useEffect(() => {
    gsap.to(containerRef.current, {
      duration: 0.5,
      right: 20,
      ease: 'back',
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className={
        'fixed h-[600px] w-[400px] rounded-lg right-[-400px]  top-1/2 -translate-y-1/2 shadow-lg overflow-hidden'
      }
    >
      <Detail areaId={areaId} />
      <div
        className='absolute right-2 top-2 cursor-pointer'
        onClick={() => {
          close()
        }}
      >
        <Icon width={24} height={24} name='close' />
      </div>
    </div>
  )
}
