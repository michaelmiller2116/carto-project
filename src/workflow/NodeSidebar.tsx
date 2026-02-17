import { useCallback } from 'react'
import { useReactFlow, type XYPosition } from '@xyflow/react'
import { nanoid } from 'nanoid'
import { Box, Stack } from '@mui/material'

import LayerSidebarNode from './nodes/LayerSidebarNode'
import SourceSidebarNode from './nodes/SourceSidebarNode'
import type { SidebarNodeType, WorkflowNodeData } from './types'

const getId = () => `dndnode_${nanoid(12)}`

const NodeSidebar = () => {
  const { setNodes, screenToFlowPosition } = useReactFlow()

  const handleNodeDrop = useCallback(
    (nodeType: SidebarNodeType, screenPosition: XYPosition) => {
      const flow = document.querySelector('.react-flow')
      const flowRect = flow?.getBoundingClientRect()
      const isInFlow =
        flowRect &&
        screenPosition.x >= flowRect.left &&
        screenPosition.x <= flowRect.right &&
        screenPosition.y >= flowRect.top &&
        screenPosition.y <= flowRect.bottom

      // Create a new node and add it to the flow
      if (isInFlow) {
        const position = screenToFlowPosition(screenPosition)
        const nodeId = getId()

        const data: WorkflowNodeData =
          nodeType === 'source'
            ? {
                url: '',
              }
            : {}

        const newNode = {
          id: nodeId,
          type: nodeType,
          position,
          data,
        }

        setNodes((nodes) => nodes.concat(newNode))
      }
    },
    [setNodes, screenToFlowPosition],
  )

  return (
    <Box
      component="aside"
      sx={(theme) => ({
        width: 'fit-content',
        padding: 3,
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: '6px 0 20px rgba(0, 0, 0, 0.14)',
        zIndex: 4,
      })}
    >
      <Stack gap={2}>
        <LayerSidebarNode onDrop={handleNodeDrop} />
        <SourceSidebarNode onDrop={handleNodeDrop} />
      </Stack>
    </Box>
  )
}

export default NodeSidebar
