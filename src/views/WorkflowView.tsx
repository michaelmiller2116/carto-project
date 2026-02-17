import { useCallback } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Box } from '@mui/material'

import NodeSidebar from '../workflow/NodeSidebar'
import LayerNode from '../workflow/nodes/LayerNode'
import SourceNode from '../workflow/nodes/SourceNode'
import type { WorkflowEdge, WorkflowNode } from '../workflow/types'

const nodeTypes = {
  layer: LayerNode,
  source: SourceNode,
}

type WorkflowViewProps = {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  setShowWorkflowView: React.Dispatch<React.SetStateAction<boolean>>
  setEdges: React.Dispatch<React.SetStateAction<WorkflowEdge[]>>
  onNodesChange: OnNodesChange<WorkflowNode>
  onEdgesChange: OnEdgesChange<WorkflowEdge>
}

const WorkflowView = ({
  nodes,
  edges,
  setEdges,
  onNodesChange,
  onEdgesChange,
}: WorkflowViewProps) => {
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((previousEdges) => addEdge(params, previousEdges)),
    [setEdges],
  )

  return (
    <ReactFlowProvider>
      <Box sx={{ height: '100vh', width: '100vw', display: 'flex' }}>
        <NodeSidebar />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        />
      </Box>
    </ReactFlowProvider>
  )
}

export default WorkflowView
