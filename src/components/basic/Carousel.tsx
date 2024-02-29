import { useRef, useState } from 'react'
import Image from 'next/image'
import { Modal } from 'antd'
import gsap from 'gsap'
import { IPicture } from '@/types/map'
import { ossPath } from '@/api/oss'
import Link from 'next/link'
export default function Carousel({ imgList }: { imgList: IPicture[] }) {
  // const centerImgIdxRef = useRef(0)
  const [centerImgIdx, setCenterImgIdx] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<IPicture>({
    fileName: '',
    userId: 0,
    areaId: '',
    userName: '',
  })

  const handleCancel = () => {
    setPreviewOpen(false)
  }

  const imgListContainerRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  // imgWidth + span
  // (rootRef.current.clientWidth - imgWidth) / 2

  const handleClickImg = (index: number) => {
    // const dIdx = index - centerImgIdxRef.current
    const dIdx = index - centerImgIdx
    const container = imgListContainerRef.current
    const imgWidth = 200
    const span = 8
    if (container) {
      if (!dIdx) {
        setPreviewImage(imgList[index])
        setPreviewOpen(true)
      } else {
        gsap.to(container, {
          duration: 0.5,
          x:
            index === 0
              ? 0
              : index === imgList.length - 1
              ? -(container.clientWidth - rootRef.current!.clientWidth)
              : `+=${
                  (index === 1 && dIdx === 1) ||
                  (index === imgList.length - 2 && dIdx === -1)
                    ? (imgWidth +
                        span -
                        (rootRef.current!.clientWidth - imgWidth) / 2) *
                      -dIdx
                    : (imgWidth + span) * -dIdx
                }`,
          ease: 'linear',
          onComplete: () => {
            setCenterImgIdx(index)
          },
        })
      }
    }
  }

  return (
    <>
      <div ref={rootRef} className='w-full h-full overflow-hidden'>
        <div
          ref={imgListContainerRef}
          className='flex flex-row h-full w-max gap-2'
        >
          {imgList.map((img, index) => (
            <div
              key={`img-${index}`}
              className='w-[200px] cursor-pointer h-full rounded-lg bg-gray-300 relative overflow-hidden'
              onClick={() => {
                handleClickImg(index)
              }}
            >
              {Math.abs(index - centerImgIdx) < 3 && (
                <Image
                  loader={() => ossPath + img.fileName}
                  src={ossPath + img.fileName}
                  fill
                  alt=''
                />
              )}
            </div>
          ))}
        </div>
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
              by: &nbsp;
              <Link href={`/user/${previewImage.userId}`}>
                {previewImage.userName}
              </Link>
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
