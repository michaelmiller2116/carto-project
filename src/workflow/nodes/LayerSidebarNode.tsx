import type { XYPosition } from '@xyflow/react'
import { Typography } from '@mui/material'

import DraggableNode from './DraggableNode'
import type { SidebarNodeType } from '../types'

type LayerSidebarNodeProps = {
  onDrop: (nodeType: SidebarNodeType, position: XYPosition) => void
}

const LayerSidebarNode = ({ onDrop }: LayerSidebarNodeProps) => {
  return (
    <DraggableNode nodeType="layer" onDrop={onDrop}>
      <Typography>Layer Node</Typography>
    </DraggableNode>
  )
}

export default LayerSidebarNode
