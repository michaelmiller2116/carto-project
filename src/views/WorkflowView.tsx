import { useCallback } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  useEdgesState,
  useNodesState,
  type EdgeChange,
  type NodeChange,
  type EdgeMouseHandler,
  type IsValidConnection,
  type OnConnect,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Box, Button } from '@mui/material'

import NodeSidebar from '../workflow/NodeSidebar'
import LayerNode from '../workflow/nodes/LayerNode'
import SourceNode from '../workflow/nodes/SourceNode'
import type { WorkflowEdge, WorkflowNode } from '../workflow/types'

const nodeTypes = {
  layer: LayerNode,
  source: SourceNode,
}

type WorkflowViewProps = {
  setShowWorkflowView: React.Dispatch<React.SetStateAction<boolean>>
}

const WORKFLOW_STORAGE_KEY = 'workflow'

const getInitialWorkflow = (): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } => {
  if (typeof window === 'undefined') {
    // TODO: better error handling
    return { nodes: [], edges: [] }
  }

  try {
    const rawWorkflow = localStorage.getItem(WORKFLOW_STORAGE_KEY)
    if (!rawWorkflow) return { nodes: [], edges: [] }

    const parsedWorkflow = JSON.parse(rawWorkflow)
    const nodes = Array.isArray(parsedWorkflow.nodes)
      ? (parsedWorkflow.nodes as WorkflowNode[])
      : []
    const edges = Array.isArray(parsedWorkflow.edges)
      ? (parsedWorkflow.edges as WorkflowEdge[])
      : []

    return { nodes, edges }
  } catch {
    return { nodes: [], edges: [] }
  }
}

const WorkflowView = ({ setShowWorkflowView }: WorkflowViewProps) => {
  const { nodes: initialNodes, edges: initialEdges } = getInitialWorkflow()
  const [nodes, , onNodesChange] = useNodesState<WorkflowNode>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>(initialEdges)

  const persistToLocalStorage = useCallback(
    (nextNodes = nodes, nextEdges = edges) => {
      localStorage.setItem(
        WORKFLOW_STORAGE_KEY,
        JSON.stringify({ nodes: nextNodes, edges: nextEdges }),
      )
    },
    [edges, nodes],
  )

  const handleNodesChange = useCallback(
    (changes: NodeChange<WorkflowNode>[]) => {
      const nextNodes = applyNodeChanges(changes, nodes)
      onNodesChange(changes)

      const change = changes[0]
      if (!change) return

      const isDragMove =
        change.type === 'position' && 'dragging' in change && change.dragging === true
      // ignoring dimensions here as I am not allowing dimension change of a node
      const shouldPersist = change.type !== 'dimensions' && !isDragMove

      if (shouldPersist) {
        persistToLocalStorage(nextNodes, edges)
      }
    },
    [edges, nodes, onNodesChange, persistToLocalStorage],
  )

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<WorkflowEdge>[]) => {
      const nextEdges = applyEdgeChanges(changes, edges)
      onEdgesChange(changes)

      const change = changes[0]
      if (!change) return

      persistToLocalStorage(nodes, nextEdges)
    },
    [edges, nodes, onEdgesChange, persistToLocalStorage],
  )

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
      persistToLocalStorage(nodes, nextEdges)
    },
    [edges, isValidConnection, nodes, persistToLocalStorage, setEdges],
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
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
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
