import { Handle, Position, useReactFlow, type NodeProps } from '@xyflow/react'
import { Card, CardContent, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

import type { WorkflowNode } from '../types'

const SourceNode = ({ id, data, selected }: NodeProps<WorkflowNode>) => {
  const { setNodes } = useReactFlow()
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
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, url: value } } : node,
        ),
      )
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
        <Typography variant="subtitle2" align="center">
          Source
        </Typography>
        <TextField
          size="small"
          label="url"
          value={draftUrl}
          onChange={(event) => handleUrlChange(event.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  )
}

export default SourceNode
