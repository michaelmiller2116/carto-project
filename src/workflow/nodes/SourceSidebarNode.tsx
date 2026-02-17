import type { XYPosition } from '@xyflow/react'
import { Typography } from '@mui/material'

import DraggableNode from './DraggableNode'
import type { SidebarNodeType } from '../types'

type SourceSidebarNodeProps = {
  onDrop: (nodeType: SidebarNodeType, position: XYPosition) => void
}

const SourceSidebarNode = ({ onDrop }: SourceSidebarNodeProps) => {
  return (
    <DraggableNode nodeType="source" onDrop={onDrop}>
      <Typography>Source Node</Typography>
    </DraggableNode>
  )
}

export default SourceSidebarNode
