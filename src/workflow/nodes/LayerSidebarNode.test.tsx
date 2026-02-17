// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import LayerSidebarNode from './LayerSidebarNode'

const mockState = vi.hoisted(() => ({
  capturedNodeType: '' as string,
  capturedOnDrop: null as
    | null
    | ((nodeType: 'layer' | 'source', position: { x: number; y: number }) => void),
}))

vi.mock('./DraggableNode', () => ({
  default: ({
    nodeType,
    onDrop,
    children,
  }: {
    nodeType: string
    onDrop: (nodeType: 'layer' | 'source', position: { x: number; y: number }) => void
    children?: React.ReactNode
  }) => {
    mockState.capturedNodeType = nodeType
    mockState.capturedOnDrop = onDrop
    return <div data-testid="draggable-node">{children}</div>
  },
}))

describe('LayerSidebarNode', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders layer label and passes nodeType=layer to DraggableNode', () => {
    const onDrop = vi.fn()

    render(<LayerSidebarNode onDrop={onDrop} />)

    expect(screen.getByText('Layer')).toBeTruthy()
    expect(screen.getByTestId('draggable-node')).toBeTruthy()
    expect(mockState.capturedNodeType).toBe('layer')
    expect(mockState.capturedOnDrop).toBe(onDrop)
  })
})
