'use client'

import gsap from 'gsap'
import { useRef } from 'react'

interface IFleetingMessageProps {
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'center'
  color?: string
}

const positionMap = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
  center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
}

export default function useFleetingMessage(
  props: IFleetingMessageProps
): [(message: string) => void, JSX.Element] {
  const { position = 'center', color = 'black' } = props
  const containerRef = useRef<HTMLDivElement>(null)

  function showMessage(message: string) {
    if (containerRef.current) {
      containerRef.current.innerText = message

      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0 },
        {
          duration: 1,
          autoAlpha: 1,
          ease: 'power4.out',
          onComplete: () => {
            gsap.to(containerRef.current, {
              duration: 1,
              autoAlpha: 0,
              y: 0,
              delay: 0.2,
              ease: 'power4.out',
            })
          },
        }
      )
    }
  }

  return [
    showMessage,
    <div
      className={`${positionMap[position]} pointer-events-none cursor-pointer`}
      style={{
        position: 'fixed',
        fontSize: '2rem',
        fontWeight: 'bolder',
        letterSpacing: '0.5rem',
        fontFamily: 'kaiti',
        color: color,
      }}
      ref={containerRef}
      key={'fleeting-message-container'}
    />,
  ]
}
