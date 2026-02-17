import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Card, CardContent, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

import type { WorkflowNode } from '../types'

const SourceNode = ({ data, selected }: NodeProps<WorkflowNode>) => {
  const [draftUrl, setDraftUrl] = useState<string>(data.url ?? '')
  const debounceTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current !== null) {
        window.clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  const handleUrlChange = (value: string) => {
    setDraftUrl(value)

    if (debounceTimeoutRef.current !== null) {
      window.clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      data.onUrlChange?.(value)
    }, 300)
  }

  return (
    <Card className={`node ${selected ? 'selected' : ''}`}>
      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 10, height: 10, borderRadius: '50%', background: '#111111' }}
      />
      <CardContent>
        <Typography variant="subtitle2">Source</Typography>
        <TextField
          size="small"
          label="url"
          value={draftUrl}
          onChange={(event) => handleUrlChange(event.target.value)}
          fullWidth
        />
      </CardContent>
    </Card>
  )
}

export default SourceNode
