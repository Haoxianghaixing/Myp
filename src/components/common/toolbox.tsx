'use client'

import { useEffect, useRef, useState } from 'react'
import Icon from './icon'
import gsap from 'gsap'

export interface IToolboxItem {
  iconName: string
  transformOrigin: string
  actions: () => void
  uniqueStyle?: string
}

interface IToolboxProps {
  items: IToolboxItem[]
}

export default function Toolbox(props: IToolboxProps) {
  const { items } = props
  const [toolboxVisible, setToolboxVisible] = useState<boolean>(false)

  const showToolbox = () => {
    if (toolboxVisible) {
      setToolboxVisible(false)
      gsap.to('.toolbox-item', {
        duration: 0.2,
        scale: 0,
        ease: 'back',
      })
    } else {
      setToolboxVisible(true)
      gsap.to('.toolbox-item', {
        duration: 0.2,
        scale: 1,
        stagger: 0.1,
        ease: 'back',
      })
    }
  }

  const handleHoverItem = (
    e: React.MouseEvent<HTMLDivElement>,
    item: IToolboxItem
  ) => {
    gsap.to(e.target, {
      duration: 0.2,
      scale: 1.2,
      ease: 'back',
      transformOrigin: item.transformOrigin,
    })
  }

  const handleLeaveItem = (
    e: React.MouseEvent<HTMLDivElement>,
    item: IToolboxItem
  ) => {
    gsap.to(e.target, {
      duration: 0.2,
      scale: 1,
      ease: 'back',
      transformOrigin: item.transformOrigin,
    })
  }

  return (
    <>
      <div className='relative w-[120px] h-[120px] '>
        <div
          className={
            'w-[120px] h-[120px] rounded-[120px] relative grid grid-cols-2 grid-rows-2 '
          }
        >
          {items.map((item, index) => (
            <div
              key={`toolbox-item-${index}`}
              onMouseEnter={(e) => handleHoverItem(e, item)}
              onMouseLeave={(e) => handleLeaveItem(e, item)}
              className={`toolbox-item bg-white cursor-pointer scale-0 w-[60px] h-[60px] flex items-center justify-center border-solid border ${item.uniqueStyle}`}
              onClick={() => item.actions()}
            >
              <Icon height={20} width={20} name={item.iconName} />
            </div>
          ))}
        </div>
        <div
          className='w-10 h-10 rounded-[100%] bg-[#F9F7F7] border-2 border-solid border-[#BDC1CA] shadow-sm\
       cursor-pointer absolute top-[40px] left-[40px] flex items-center justify-center'
          onClick={() => showToolbox()}
        >
          <Icon height={24} width={24} name='addImg' />
        </div>
      </div>
    </>
  )
}
