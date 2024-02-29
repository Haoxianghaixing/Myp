'use client'

import {
  DatePicker,
  DatePickerProps,
  UploadFile,
  UploadProps,
  GetProp,
  Cascader,
  message,
} from 'antd'
import Icon from '../common/icon'
import React, { useEffect, useRef, useState } from 'react'
import { Modal, Upload } from 'antd'
import Image from 'next/image'
import gsap from 'gsap'
import { addRecord, getAreaSelectOptions, uploadImage } from '@/api/map'
interface IRecordProps {
  handleClose: () => void
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

interface Option {
  value: string | number
  label: string
  children?: Option[]
}

export default function Record(props: IRecordProps) {
  const { handleClose } = props
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [options, setOptions] = useState<Option[]>([])

  const fileMapRef = useRef(new Map<string, string>())

  const [uploadParams, setUploadParams] = useState<{
    areaId: string
    takeDate?: string
    spot?: string
  }>({
    areaId: '',
  })

  const handleChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
    setUploadParams((prev) => ({ ...prev, takeDate: dateString as string }))
  }

  const handleChangePosition = (value: (number | string)[]) => {
    setUploadParams((prev) => ({ ...prev, areaId: value[1] as string }))
  }

  const handleChangeFile: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList)
    console.log(newFileList)
  }

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    )
  }

  const uploadButton = (
    <button
      style={{ border: 0, background: 'none' }}
      className='flex flex-col justify-center items-center'
      type='button'
    >
      <Icon name='uploadFile' width={40} height={40} />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </button>
  )

  const containerRef = React.useRef<HTMLDivElement>(null)

  const closeRecord = () => {
    gsap.to(containerRef.current, {
      duration: 0.1,
      scale: 0,
      onComplete: () => {
        handleClose()
      },
    })
    setFileList([])
  }

  const handleAddRecord = () => {
    const newFileList = fileList.map(
      (item) => fileMapRef.current.get(item.name)!
    )
    addRecord(
      uploadParams.areaId,
      newFileList,
      uploadParams.takeDate,
      uploadParams.spot
    ).then((res) => {
      if (res.data.code === 200) {
        message.success('添加记录成功')
        closeRecord()
      }
    })
  }

  useEffect(() => {
    const container = containerRef.current

    gsap.to(container, {
      duration: 0.5,
      scale: 1,
      ease: 'back',
    })

    getAreaSelectOptions().then((res) => {
      if (res.data.code === 200) {
        const { data } = res.data
        const selectOptions: Option[] = []
        data.forEach((item) => {
          const children = item.children.map((child) => ({
            value: child.areaId,
            label: child.areaName,
          }))
          selectOptions.push({
            value: item.areaId,
            label: item.areaName,
            children,
          })
        })
        setOptions(selectOptions)
      }
    })

    return () => {}
  }, [])

  return (
    <>
      <div className=' z-20 fixed w-screen h-screen bg-[rgba(0,0,0,0.5)] pointer-events-none flex justify-center items-center top-0'>
        <div
          className={
            'fixed pointer-events-auto scale-0 flex flex-col h-[500px] w-[400px] rounded-lg left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 shadow-lg overflow-hidden p-4 bg-white'
          }
          ref={containerRef}
        >
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            width={800}
            centered
            onCancel={handleCancel}
          >
            <div className='relative w-full h-[400px]'>
              <Image
                alt='example'
                fill
                objectFit='contain'
                src={previewImage}
              />
            </div>
          </Modal>
          <div className='flex flex-col flex-1'>
            <div className='w-full rounded-lg h-64 overflow-auto shadow-md mb-6 relative py-4 pr-[14px] pl-[23px]'>
              <Upload
                listType='picture-card'
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChangeFile}
                customRequest={(params) => {
                  const originFileName = (params.file as File).name
                  const formData = new FormData()
                  formData.append('file', params.file as Blob)
                  uploadImage(formData, (ev: any) => {
                    const percent = (ev.loaded / ev.total) * 100
                    params.onProgress!({ percent })
                  }).then((res) => {
                    console.log(res)
                    if (res.data.code === 200) {
                      const fileName = res.data.fileName!
                      fileMapRef.current.set(originFileName!, fileName)
                      console.log(fileMapRef.current)
                      params.onSuccess!(res)
                    }
                  })
                }}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
            </div>
            <div className='grid grid-cols-2 gap-x-3 gap-y-2'>
              <div className='col-span-2 text-sm'>地点</div>
              <div className='col-span-2'>
                <Cascader
                  className='w-full'
                  options={options}
                  onChange={handleChangePosition}
                  placeholder='请选择地点'
                />
              </div>
              <div className='text-sm'>具体景点（可选）</div>
              <div className='text-sm'>拍摄日期</div>
              <div className='h-8 bg-[#FCF2F3] input rounded-lg'>
                <input
                  type='text'
                  className='w-full h-full text-input rounded-lg text-xs'
                  placeholder='具体景点（可选）'
                  onChange={(e) =>
                    setUploadParams((prev) => ({
                      ...prev,
                      spot: e.target.value,
                    }))
                  }
                />
              </div>
              <DatePicker onChange={handleChangeDate} />
            </div>
          </div>
          <div className='flex flex-row justify-end w-full gap-4'>
            <button
              className='rounded-lg py-1 px-2 border bg-white '
              onClick={() => handleAddRecord()}
            >
              确认
            </button>
            <button
              className='rounded-lg py-1 px-2 border bg-white'
              onClick={() => closeRecord()}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
