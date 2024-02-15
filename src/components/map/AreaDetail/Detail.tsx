'use client'

import { IArea } from '@/types/map'
import { ImgList } from '@/mock/map'
import Carousel from '@/components/basic/Carousel'

interface IAreaDetailProps {
  area: IArea | null
}

export default function Detail(props: IAreaDetailProps) {
  const { area } = props

  // 根据 area.id 获取数据

  return (
    area && (
      <div className='flex flex-col items-center bg-white w-full h-full px-3 py-4'>
        <div className='flex flex-col flex-1 gap-5 overflow-auto'>
          <div className='text-xl'>{area.name}</div>
          <div className='w-full border border-solid'></div>
          <div>
            北京是中国的首都，拥有丰富的历史和文化遗产，著名的景点包括故宫、天安门广场和长城等。
          </div>
          <div className='w-full border border-solid'></div>
          <div className='w-full flex flex-col'>
            <div className='mb-5'>我的记录</div>
            <div className='w-[100%] h-40 rounded-lg self-center flex items-center justify-center'>
              <Carousel imgList={ImgList} />
            </div>
          </div>
          <div className='w-full border border-solid'></div>
          <div className='w-full flex flex-col'>
            <div className='mb-5'>相关照片</div>
            <div className='w-[100%] h-40 rounded-lg self-center flex items-center justify-center'>
              <Carousel imgList={ImgList} />
            </div>
          </div>
          <div className='h-5'></div>
        </div>
        <div className='flex flex-row justify-end w-full gap-4 items-center mt-4'>
          <button className='rounded-lg py-1 px-2 border bg-white '>
            添加记录
          </button>
          <button className='rounded-lg py-1 px-2 border bg-white '>
            添加记录
          </button>
        </div>
      </div>
    )
  )
}
