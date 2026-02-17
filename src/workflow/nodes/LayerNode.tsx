import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Card, CardContent, Typography } from '@mui/material'

import type { WorkflowNode } from '../types'

const LayerNode = ({ selected }: NodeProps<WorkflowNode>) => {
  return (
    <Card className={`node ${selected ? 'selected' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ width: 10, height: 10, borderRadius: '50%', background: '#111111' }}
      />
      <CardContent>
        <Typography variant="subtitle2">Layer</Typography>
      </CardContent>
    </Card>
  )
}

export default LayerNode
