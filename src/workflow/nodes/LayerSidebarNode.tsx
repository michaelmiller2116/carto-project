import type { XYPosition } from '@xyflow/react'
import { CardContent, Typography } from '@mui/material'

import DraggableNode from './DraggableNode'
import type { SidebarNodeType } from '../types'

type LayerSidebarNodeProps = {
  onDrop: (nodeType: SidebarNodeType, position: XYPosition) => void
}

const LayerSidebarNode = ({ onDrop }: LayerSidebarNodeProps) => {
  return (
    <DraggableNode nodeType="layer" onDrop={onDrop}>
      <CardContent>
        <Typography variant="subtitle2" align="center">
          Layer
        </Typography>
      </CardContent>
    </DraggableNode>
  )
}

export default LayerSidebarNode
