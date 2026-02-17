// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import NodeSidebar from './NodeSidebar'

const mockState = vi.hoisted(() => ({
  setNodes: vi.fn(),
  screenToFlowPosition: vi.fn(),
  layerDropPosition: { x: 0, y: 0 },
  sourceDropPosition: { x: 0, y: 0 },
}))

vi.mock('nanoid', () => ({
  nanoid: () => 'abc123',
}))

vi.mock('@xyflow/react', () => ({
  useReactFlow: () => ({
    setNodes: mockState.setNodes,
    screenToFlowPosition: mockState.screenToFlowPosition,
  }),
}))

vi.mock('./nodes/LayerSidebarNode', () => ({
  default: ({
    onDrop,
  }: {
    onDrop: (nodeType: 'layer' | 'source', position: { x: number; y: number }) => void
  }) => (
    <button type="button" onClick={() => onDrop('layer', mockState.layerDropPosition)}>
      drop-layer
    </button>
  ),
}))

vi.mock('./nodes/SourceSidebarNode', () => ({
  default: ({
    onDrop,
  }: {
    onDrop: (nodeType: 'layer' | 'source', position: { x: number; y: number }) => void
  }) => (
    <button type="button" onClick={() => onDrop('source', mockState.sourceDropPosition)}>
      drop-source
    </button>
  ),
}))

const setupFlowBounds = () => {
  const flow = document.createElement('div')
  flow.className = 'react-flow'
  flow.getBoundingClientRect = () => ({ left: 0, right: 100, top: 0, bottom: 100 }) as DOMRect
  document.body.appendChild(flow)
}

describe('NodeSidebar', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    mockState.setNodes.mockReset()
    mockState.screenToFlowPosition.mockReset()
    mockState.screenToFlowPosition.mockReturnValue({ x: 10, y: 20 })
  })

  afterEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('drop inside .react-flow adds a source node with expected shape', () => {
    setupFlowBounds()
    mockState.sourceDropPosition = { x: 50, y: 50 }

    render(<NodeSidebar />)

    fireEvent.click(screen.getByRole('button', { name: 'drop-source' }))

    expect(mockState.screenToFlowPosition).toHaveBeenCalledWith({ x: 50, y: 50 })
    expect(mockState.setNodes).toHaveBeenCalledTimes(1)

    const updater = mockState.setNodes.mock.calls[0][0] as (nodes: unknown[]) => unknown[]
    const result = updater([]) as Array<Record<string, unknown>>

    expect(result[0]).toMatchObject({
      id: 'dndnode_abc123',
      type: 'source',
      position: { x: 10, y: 20 },
      data: { url: '' },
    })
  })

  it('drop inside .react-flow adds a layer node with empty data object', () => {
    setupFlowBounds()
    mockState.layerDropPosition = { x: 60, y: 60 }

    render(<NodeSidebar />)

    fireEvent.click(screen.getByRole('button', { name: 'drop-layer' }))

    expect(mockState.setNodes).toHaveBeenCalledTimes(1)

    const updater = mockState.setNodes.mock.calls[0][0] as (nodes: unknown[]) => unknown[]
    const result = updater([]) as Array<Record<string, unknown>>

    expect(result[0]).toMatchObject({
      id: 'dndnode_abc123',
      type: 'layer',
      position: { x: 10, y: 20 },
      data: {},
    })
  })

  it('drop outside .react-flow does nothing', () => {
    setupFlowBounds()
    mockState.layerDropPosition = { x: 500, y: 500 }

    render(<NodeSidebar />)

    fireEvent.click(screen.getByRole('button', { name: 'drop-layer' }))

    expect(mockState.screenToFlowPosition).not.toHaveBeenCalled()
    expect(mockState.setNodes).not.toHaveBeenCalled()
  })
})
