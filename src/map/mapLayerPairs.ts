import type { WorkflowEdge, WorkflowNode, WorkflowSnapshot } from '../workflow/types'

export type SourceLayerPair = {
  dataUrl: string
  sourceId: string
  layerId: string
  layerY: number
}

// Type guard for .filter(...) so TypeScript narrows (T | null)[] to T[].
const isDefined = <T>(value: T | null): value is T => value !== null

const toNodesById = (nodes: WorkflowNode[]): Map<string, WorkflowNode> =>
  new Map(nodes.map((node) => [node.id, node]))

const toSourceLayerPair = (
  edge: WorkflowEdge,
  nodesById: Map<string, WorkflowNode>,
): SourceLayerPair | null => {
  const sourceNode = nodesById.get(edge.source)
  const layerNode = nodesById.get(edge.target)
  const dataUrl = sourceNode?.data.url?.trim()

  if (sourceNode?.type !== 'source' || layerNode?.type !== 'layer' || !dataUrl) {
    return null
  }

  return {
    dataUrl,
    sourceId: sourceNode.id,
    layerId: layerNode.id,
    layerY: layerNode.position.y ?? 0,
  }
}

const byLayerYAscending = (left: SourceLayerPair, right: SourceLayerPair): number =>
  left.layerY - right.layerY

// Builds source->layer records from workflow edges, keeps only valid connected pairs with
// non-empty source URLs, then orders them by the layer node's y-position (top to bottom).
export const getOrderedSourceLayerPairs = ({
  nodes,
  edges,
}: WorkflowSnapshot): SourceLayerPair[] => {
  const nodesById = toNodesById(nodes)

  return edges
    .map((edge) => toSourceLayerPair(edge, nodesById))
    .filter(isDefined)
    .sort(byLayerYAscending)
}
