import { useRef, useState } from 'react'
import Image from 'next/image'
import { Modal } from 'antd'
import gsap from 'gsap'
export default function Carousel({ imgList }: { imgList: any[] }) {
  const [centerImgIdx, setCenterImgIdx] = useState(1)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

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
        setPreviewImage(imgList[index].src)
        setPreviewOpen(true)
      }
    }
  }
  return (
    <>
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
            <Image src={img} fill alt='' />
          </div>
        ))}
      </div>
      <Modal
        open={previewOpen}
        footer={null}
        width={800}
        centered
        onCancel={handleCancel}
      >
        <div className='relative w-full h-[400px]'>
          <Image
            alt='example'
            className='object-contain'
            fill
            src={previewImage}
          />
        </div>
      </Modal>
    </>
  )
}
