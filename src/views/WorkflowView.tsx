import { useCallback, useEffect, type Dispatch, type SetStateAction } from 'react'
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
import { Box, Button } from '@mui/material'

import NodeSidebar from '../workflow/NodeSidebar'
import LayerNode from '../workflow/nodes/LayerNode'
import SourceNode from '../workflow/nodes/SourceNode'
import type { WorkflowEdge, WorkflowNode, WorkflowSnapshot } from '../workflow/types'

const nodeTypes = {
  layer: LayerNode,
  source: SourceNode,
}

type WorkflowViewProps = {
  setShowWorkflowView: Dispatch<SetStateAction<boolean>>
  workflowSnapshot: WorkflowSnapshot
  setWorkflowSnapshot: Dispatch<SetStateAction<WorkflowSnapshot>>
}

const WorkflowView = ({
  setShowWorkflowView,
  workflowSnapshot,
  setWorkflowSnapshot,
}: WorkflowViewProps) => {
  const [nodes, , onNodesChange] = useNodesState<WorkflowNode>(workflowSnapshot.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>(workflowSnapshot.edges)

  useEffect(() => {
    if (nodes.some((node) => node.dragging)) return
    setWorkflowSnapshot({ nodes, edges })
  }, [edges, nodes, setWorkflowSnapshot])

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
      const nextEdges = addEdge(params, edges)
      setEdges(nextEdges)
    },
    [edges, isValidConnection, setEdges],
  )

  const onEdgeDoubleClick: EdgeMouseHandler<WorkflowEdge> = useCallback(
    (_, edge) => {
      const nextEdges = edges.filter((currentEdge) => currentEdge.id !== edge.id)
      setEdges(nextEdges)
    },
    [edges, setEdges],
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
      <Button
        onClick={() => setShowWorkflowView(false)}
        variant="contained"
        sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
      >
        Map
      </Button>
    </ReactFlowProvider>
  )
}

export default WorkflowView
