import { useCallback } from 'react'
import { useReactFlow, type XYPosition } from '@xyflow/react'
import { nanoid } from 'nanoid'

import DraggableNode from './nodes/DraggableNode'

const getId = () => `dndnode_${nanoid(12)}`

const NodeSidebar = () => {
  const { setNodes, screenToFlowPosition } = useReactFlow()

  const handleNodeDrop = useCallback(
    (nodeType: string, screenPosition: XYPosition) => {
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
          data: { label: `${nodeType} node` },
        }

        setNodes((nds) => nds.concat(newNode))
      }
    },
    [setNodes, screenToFlowPosition],
  )

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane to create new nodes.</div>
      <DraggableNode className="input" nodeType="input" onDrop={handleNodeDrop}>
        Input Node
      </DraggableNode>
      <DraggableNode className="default" nodeType="default" onDrop={handleNodeDrop}>
        Default Node
      </DraggableNode>
      <DraggableNode className="output" nodeType="output" onDrop={handleNodeDrop}>
        Output Node
      </DraggableNode>
    </aside>
  )
}

export default NodeSidebar
