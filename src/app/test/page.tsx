'use client'

import Carousel from '@/components/basic/Carousel'
import useAreaDetail from '@/hooks/useAreaDetail'

export default function Page() {
  const areaDetail = useAreaDetail('46')
  return (
    <>
      <div className='flex flex-col h-screen overflow-hidden justify-center items-center bg-gradient-to-b from-[#1677b3] to-[#c3d7df] relative'>
        <div className='w-[300px] h-40 flex justify-center items-center'>
          {areaDetail ? <Carousel imgList={areaDetail.areaImgList} /> : null}
        </div>
      </div>
    </>
  )
}
