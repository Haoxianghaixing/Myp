'use client'

import gsap from 'gsap'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [boxList, setBoxList] = useState<any[]>([])
  function generateBoxList(col: number) {
    const width = window.innerWidth
    const height = window.innerHeight
    const boxList: any[] = []
    for (let i = 0; i < col; i++) {
      let newCol = []
      const isOdd = i % 2 !== 0
      for (let j = 0; j < (isOdd ? 3 : 4); j++) {
        newCol.push({
          id: `${i}-${j}`,
          style: {
            width: `${100 / col}%`,
            height: `${isOdd ? 100 / 3 : 25}%`,
            backgroundImage: `url(/bg.png)`,
            backgroundSize: `${width}px ${height}px`,
            backgroundPosition: `left -${width * i * (1 / col)}px top -${
              (isOdd ? 1 / 3 : 0.25) * j * height
            }px`,
          },
        })
        console.log(
          'background-position: ',
          `${i * (100 / col)}% ${(isOdd ? 100 / 3 : 25) * j}%`
        )
      }
      boxList.push(...newCol)
    }
    return boxList
  }
  // const boxList = generateBoxList(8)

  const handleClicked = (e: any) => {
    e.preventDefault()
    gsap.to('.box', {
      duration: 0.2,
      y: 200,
      opacity: 0,
      stagger: {
        axis: 'x',
        amount: 0.4,
      },
      onComplete: () => {
        document.getElementById('link')!.click()
      },
    })
    gsap.to('h1, p', {
      duration: 0.5,
      y: -200,
      opacity: 0,
    })
    gsap.to('#router', {
      duration: 0.5,
      y: 200,
      opacity: 0,
    })
  }
  if (boxList.length) {
    setTimeout(() => {
      gsap.from('.box', {
        duration: 0.8,
        y: -400,
        opacity: 0,
        stagger: {
          amount: 0.4,
          axis: 'x',
        },
      })
    }, 0)
    gsap.to('h1', {
      duration: 1.5,
      ease: 'power1.out',
      opacity: 1,
      onStart: () => {},
    })
    gsap.to('p', {
      duration: 1.5,
      ease: 'power1.out',
      delay: 0.6,
      opacity: 1,
    })
    gsap.to('#router', {
      duration: 1.5,
      delay: 1.5,
      ease: 'power1.out',
      opacity: 1,
    })
  }

  useEffect(() => {
    setBoxList(generateBoxList(8))
  }, [])

  return (
    <>
      <div
        id='container'
        className='fixed flex flex-col flex-wrap w-screen h-screen'
      >
        {boxList.length
          ? boxList.map((box) => {
              return (
                <div
                  key={box.id}
                  className='border border-white box bg-no-repeat'
                  style={box.style}
                ></div>
              )
            })
          : null}
      </div>
      <main className='relative z-20 flex min-h-screen flex-col items-center justify-center'>
        <h1 className='text-5xl opacity-0 font-bold text-[#2D3250] mb-8'>
          欢迎来到 Myp
        </h1>
        <p className=' text-2xl opacity-0 text-[#2D3250] text-center'>
          希望这里能成为专属于您的旅行地图
          <br />
          在此记录
          <br />
          在此分享
        </p>
        <Link id='link' href='/map/00'></Link>
        <div
          id='router'
          className='mt-10 text-2xl opacity-0 font-bold text-[#1677b3] underline underline-offset-4 cursor-pointer'
          onClick={handleClicked}
        >
          点击进入
        </div>
      </main>
    </>
  )
}
