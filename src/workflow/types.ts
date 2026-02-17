import type { Edge, Node } from '@xyflow/react'

export type WorkflowNodeData = {
  label: string
}

export type WorkflowNode = Node<WorkflowNodeData>
export type WorkflowEdge = Edge
