import { useCallback } from 'react'
import { useReactFlow, type XYPosition } from '@xyflow/react'
import { nanoid } from 'nanoid'
import { Box, Stack } from '@mui/material'

import LayerSidebarNode from './nodes/LayerSidebarNode'
import SourceSidebarNode from './nodes/SourceSidebarNode'
import type { SidebarNodeType } from './types'

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

        const newNode = {
          id: getId(),
          type: nodeType,
          position,
          data: nodeType === 'source' ? { url: '' } : {},
        }

        setNodes((nds) => nds.concat(newNode))
      }
    },
    [setNodes, screenToFlowPosition],
  )

  return (
    <Box
      component="aside"
      sx={{ width: 'fit-content', borderRight: '1px solid black', padding: 3 }}
    >
      <Stack gap={2}>
        <LayerSidebarNode onDrop={handleNodeDrop} />
        <SourceSidebarNode onDrop={handleNodeDrop} />
      </Stack>
    </Box>
  )
}

export default NodeSidebar
