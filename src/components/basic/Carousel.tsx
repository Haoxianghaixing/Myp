import { useRef, useState } from 'react'
import Image from 'next/image'
import { Modal } from 'antd'
import gsap from 'gsap'
import { IPicture } from '@/types/map'
import { ossPath } from '@/api/oss'
export default function Carousel({ imgList }: { imgList: IPicture[] }) {
  const [centerImgIdx, setCenterImgIdx] = useState(1)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<IPicture>({
    fileName: '',
    areaId: '',
    userName: '',
  })

  const handleCancel = () => {
    setPreviewOpen(false)
  }

  const imgListContainerRef = useRef<HTMLDivElement>(null)

  const handleClickImg = (index: number) => {
    const dIdx = (centerImgIdx - index + imgList.length) % imgList.length
    const container = imgListContainerRef.current
    setCenterImgIdx(index)
    if (container) {
      if (dIdx) {
        gsap.from(container, {
          duration: 0.5,
          x: ((container.clientWidth - 16) / 3 + 8) * (dIdx === 1 ? -1 : 1),
          ease: 'linear',
        })
      } else {
        setPreviewImage(imgList[index])
        setPreviewOpen(true)
      }
    }
  }

  return (
    <>
      {imgList.length > 3 ? (
        <div
          ref={imgListContainerRef}
          className='w-[180%] h-full flex flex-row items-center flex-shrink-0 gap-2'
        >
          {[
            imgList[(centerImgIdx + imgList.length - 1) % imgList.length],
            imgList[centerImgIdx],
            imgList[(centerImgIdx + 1) % imgList.length],
          ].map((img, index) => (
            <div
              key={`img-${index}`}
              className=' flex-1 cursor-pointer h-full rounded-lg bg-gray-300 relative overflow-hidden'
              onClick={() => {
                handleClickImg(
                  (centerImgIdx + index - 1 + imgList.length) % imgList.length
                )
              }}
            >
              <Image
                loader={() => ossPath + img.fileName}
                src={ossPath + img.fileName}
                fill
                alt=''
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={imgListContainerRef}
          className='w-full cursor-pointer h-full flex flex-row items-center flex-shrink-0 gap-2 relative'
          onClick={() => {
            handleClickImg(0)
          }}
        >
          <Image
            loader={() => ossPath + imgList[0].fileName}
            src={ossPath + imgList[0].fileName}
            fill
            className='object-contain rounded-lg'
            alt=''
          />
        </div>
      )}
      <Modal
        open={previewOpen}
        footer={null}
        width={800}
        centered
        onCancel={handleCancel}
      >
        <div className='relative w-full h-[400px]'>
          <Image
            loader={() => ossPath + previewImage.fileName}
            alt='example'
            className='object-contain'
            fill
            src={ossPath + previewImage.fileName}
          />
        </div>
        <div className='flex flex-row justify-end gap-2 font-bold'>
          {previewImage.userName && (
            <div className='bg-white p-1 rounded-lg'>
              by: {previewImage.userName}
            </div>
          )}
          {previewImage.takeDate && (
            <div className='bg-white p-1 rounded-lg'>
              {previewImage.takeDate}
            </div>
          )}
          {previewImage.spot && (
            <div className='bg-white p-1 rounded-lg'>{previewImage.spot}</div>
          )}
        </div>
      </Modal>
    </>
  )
}
