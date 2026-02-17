import type { NodeProps } from '@xyflow/react'
import { Card, CardContent, TextField, Typography } from '@mui/material'
import { useState } from 'react'

import type { WorkflowNode } from '../types'

const SourceNode = ({ data }: NodeProps<WorkflowNode>) => {
  const [source, setSource] = useState<string>(data.url ?? '')

  return (
    <Card className="node">
      <CardContent>
        <Typography variant="subtitle2">Source</Typography>
        <TextField
          size="small"
          label="url"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          fullWidth
        />
      </CardContent>
    </Card>
  )
}

export default SourceNode
