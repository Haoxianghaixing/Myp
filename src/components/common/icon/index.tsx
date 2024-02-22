import Image from 'next/image'

interface IconProps {
  name?: string
  width: number
  height: number
}

const IconList = {
  addImg: require('./addImg.svg').default,
  default: require('./addImg.svg').default,
  uploadFile: require('./uploadFile.svg').default,
  close: require('./close.svg').default,
  toolbox: require('./toolbox.svg').default,
}

export default function Icon(props: IconProps) {
  const { name = 'default', width, height } = props

  return (
    <Image
      height={height}
      width={width}
      src={IconList[name as keyof typeof IconList].src}
      alt='addImg'
    />
  )
}
