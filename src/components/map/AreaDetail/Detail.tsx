'use client'

import { AreaDetail, IArea } from '@/types/map'
import Carousel from '@/components/basic/Carousel'
import { useEffect, useState } from 'react'
import { getAreaDetailById } from '@/api/map'

interface IAreaDetailProps {
  area: IArea | null
}

export default function Detail(props: IAreaDetailProps) {
  const { area } = props
  const [areaDetail, setAreaDetail] = useState<AreaDetail | null>(null)

  // 根据 area.id 获取数据
  useEffect(() => {
    if (area) {
      getAreaDetailById(area!.id).then((res) => {
        if (res.data.code === 200) {
          const { data } = res.data
          console.log(data)
          setAreaDetail(data!)
        }
      })
    }
  }, [area])

  return (
    area && (
      <div className='flex flex-col items-center bg-white w-full h-full px-3 py-4'>
        <div className='flex flex-col flex-1 gap-5 overflow-auto w-full'>
          <div className='text-xl'>{area.name}</div>
          <div className='w-full border border-solid'></div>
          {/* <div>{areaDetail?.areaDesc || '暂无描述'}</div> */}
          {/* <div className='w-full border border-solid'></div> */}
          <div className='w-full flex flex-col'>
            <div className='mb-5'>我的记录</div>
            <div className='w-[100%] h-40 rounded-lg self-center flex items-center justify-center'>
              {areaDetail?.userImgList.length ? (
                <Carousel imgList={areaDetail.userImgList} />
              ) : (
                <div>暂无记录</div>
              )}
            </div>
          </div>
          <div className='w-full border border-solid'></div>
          <div className='w-full flex flex-col'>
            <div className='mb-5'>相关照片</div>
            <div className='w-[100%] h-40 rounded-lg self-center flex items-center justify-center'>
              {areaDetail?.areaImgList.length ? (
                <Carousel imgList={areaDetail.areaImgList} />
              ) : (
                <div>暂无记录</div>
              )}
            </div>
          </div>
          <div className='h-5'></div>
        </div>
        {/* <div className='flex flex-row justify-end w-full gap-4 items-center mt-4'>
          <button className='rounded-lg py-1 px-2 border bg-white '>
            添加记录
          </button>
          <button className='rounded-lg py-1 px-2 border bg-white '>
            添加记录
          </button>
        </div> */}
      </div>
    )
  )
}
