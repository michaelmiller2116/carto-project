import { useRef, useState } from 'react'
import { useDraggable } from '@neodrag/react'
import type { XYPosition } from '@xyflow/react'
import { Card } from '@mui/material'

import type { SidebarNodeType } from '../types'

interface DraggableNodeProps {
  className?: string
  children: React.ReactNode
  nodeType: SidebarNodeType
  onDrop: (nodeType: SidebarNodeType, position: XYPosition) => void
}

const DraggableNode = ({ className, children, nodeType, onDrop }: DraggableNodeProps) => {
  const draggableRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<XYPosition>({ x: 0, y: 0 })

  useDraggable(draggableRef, {
    position: position,
    onDrag: ({ offsetX, offsetY }: { offsetX: number; offsetY: number }) => {
      // Calculate position relative to the viewport
      setPosition({
        x: offsetX,
        y: offsetY,
      })
    },
    onDragEnd: ({ event }) => {
      setPosition({ x: 0, y: 0 })
      onDrop(nodeType, {
        x: event.clientX,
        y: event.clientY,
      })
    },
  })

  return (
    <Card ref={draggableRef} className={`node ${className}`}>
      {children}
    </Card>
  )
}

export default DraggableNode
