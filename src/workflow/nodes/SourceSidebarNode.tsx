import type { XYPosition } from '@xyflow/react'
import { CardContent, TextField, Typography } from '@mui/material'

import DraggableNode from './DraggableNode'
import type { SidebarNodeType } from '../types'

type SourceSidebarNodeProps = {
  onDrop: (nodeType: SidebarNodeType, position: XYPosition) => void
}

const SourceSidebarNode = ({ onDrop }: SourceSidebarNodeProps) => {
  return (
    <DraggableNode nodeType="source" onDrop={onDrop}>
      <CardContent>
        <Typography variant="subtitle2" align="center">
          Source
        </Typography>
        <TextField
          size="small"
          placeholder="url"
          fullWidth
          inputProps={{ readOnly: true, tabIndex: -1 }}
          sx={{ pointerEvents: 'none' }}
        />
      </CardContent>
    </DraggableNode>
  )
}

export default SourceSidebarNode
