import { Stage, Graphics } from '@pixi/react'
import React from 'react'
import type { Graphics as PIXIGraphics } from 'pixi.js'
interface IMapCanvasProps {
  drawMap: (g: PIXIGraphics) => void
  stageSize: {
    width: number
    height: number
  }
}

export default React.memo(function MapCanvas(props: IMapCanvasProps) {
  const { drawMap, stageSize } = props
  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      options={{
        backgroundAlpha: 0,
      }}
      onMount={(app) => {
        // globalThis.__PIXI_APP__ = app
      }}
    >
      <Graphics draw={drawMap} />
    </Stage>
  )
})
