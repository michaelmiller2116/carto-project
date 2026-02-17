import type { Node, NodeProps } from '@xyflow/react'

// TODO: update this node to use the correct props
type LayerNode = Node<{ number: number }, 'number'>

// TODO: should use Draggable Node
const LayerNode = ({ data }: NodeProps<LayerNode>) => {
  return <div>A special number: {data.number}</div>
}

export default LayerNode
