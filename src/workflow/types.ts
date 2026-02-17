import type { Edge, Node } from '@xyflow/react'

export type SidebarNodeType = 'layer' | 'source'

export type WorkflowNodeData = {
  url?: string
  onUrlChange?: (url: string) => void
}

export type WorkflowNode = Node<WorkflowNodeData>
export type WorkflowEdge = Edge
