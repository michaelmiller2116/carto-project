import type { Node, NodeProps } from '@xyflow/react'

// TODO: update this node to use the correct props
type SourceNode = Node<{ number: number }, 'number'>

// TODO: should use Draggable Node
const SourceNode = ({ data }: NodeProps<SourceNode>) => {
  return <div>A special number: {data.number}</div>
}

export default SourceNode
