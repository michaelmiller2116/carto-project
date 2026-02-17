import { useCallback } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  type EdgeMouseHandler,
  type IsValidConnection,
  type OnConnect,
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

const WorkflowView = () => {
  const initialNodes: WorkflowNode[] = []
  const initialEdges: WorkflowEdge[] = []
  const [nodes, , onNodesChange] = useNodesState<WorkflowNode>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>(initialEdges)

  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      const { source, target } = connection
      if (!source || !target || source === target) return false

      const sourceNode = nodes.find((node) => node.id === source)
      const targetNode = nodes.find((node) => node.id === target)

      if (sourceNode?.type !== 'source' || targetNode?.type !== 'layer') return false

      const sourceAlreadyConnected = edges.some((edge) => edge.source === source)
      const targetAlreadyConnected = edges.some((edge) => edge.target === target)

      return !sourceAlreadyConnected && !targetAlreadyConnected
    },
    [edges, nodes],
  )

  const onConnect: OnConnect = useCallback(
    (params) => {
      if (!isValidConnection(params)) return
      setEdges((previousEdges) => addEdge(params, previousEdges))
    },
    [isValidConnection, setEdges],
  )

  const onEdgeDoubleClick: EdgeMouseHandler<WorkflowEdge> = useCallback(
    (_, edge) => {
      setEdges((previousEdges) => previousEdges.filter((currentEdge) => currentEdge.id !== edge.id))
    },
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
          isValidConnection={isValidConnection}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeDoubleClick={onEdgeDoubleClick}
          fitView
        />
      </Box>
    </ReactFlowProvider>
  )
}

export default WorkflowView
