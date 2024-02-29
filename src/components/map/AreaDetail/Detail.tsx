'use client'

import Carousel from '@/components/basic/Carousel'
import Loader from '@/components/basic/Loader'
import useAreaDetail from '@/hooks/useAreaDetail'
import { useUserStore } from '@/store/user'
import Link from 'next/link'

export default function Detail({ areaId }: { areaId: string }) {
  // 根据 area.id 获取数据
  const areaDetail = useAreaDetail(areaId)
  const { isLogin } = useUserStore()
  const isUserLogin = isLogin()

  return (
    <div className='flex flex-col items-center bg-white w-full h-full px-3 py-4'>
      {areaDetail ? (
        <div className='flex flex-col flex-1 gap-5 overflow-auto w-full'>
          <div className='text-xl'>{areaDetail.areaName}</div>
          <div className='w-full border border-solid'></div>
          {/* <div>{areaDetail?.areaDesc || '暂无描述'}</div> */}
          {/* <div className='w-full border border-solid'></div> */}
          <div className='w-full flex flex-col'>
            <div className='mb-5'>我的记录</div>
            <div className='w-[100%] h-40 rounded-lg self-center flex items-center justify-center'>
              {areaDetail?.userImgList.length ? (
                <Carousel imgList={areaDetail.userImgList} />
              ) : (
                <div>
                  {isUserLogin ? (
                    '暂无记录'
                  ) : (
                    <span>
                      <Link href='/login' className='text-blue-500'>
                        登录
                      </Link>
                      后可查看
                    </span>
                  )}
                </div>
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
      ) : (
        <div className='w-full h-full flex justify-center items-center'>
          <Loader />
        </div>
      )}
      {/* /* <div className='flex flex-row justify-end w-full gap-4 items-center mt-4'>
          <button className='rounded-lg py-1 px-2 border bg-white '>
            添加记录
          </button>
          <button className='rounded-lg py-1 px-2 border bg-white '>
            添加记录
          </button>
        </div> */}
    </div>
  )
}
