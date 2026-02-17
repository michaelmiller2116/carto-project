// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import SourceSidebarNode from './SourceSidebarNode'

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

describe('SourceSidebarNode', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders source label, read-only input, and passes nodeType=source to DraggableNode', () => {
    const onDrop = vi.fn()

    render(<SourceSidebarNode onDrop={onDrop} />)

    expect(screen.getByText('Source')).toBeTruthy()
    expect(screen.getByTestId('draggable-node')).toBeTruthy()
    expect(mockState.capturedNodeType).toBe('source')
    expect(mockState.capturedOnDrop).toBe(onDrop)

    const input = screen.getByPlaceholderText('url') as HTMLInputElement
    expect(input.readOnly).toBe(true)
    expect(input.tabIndex).toBe(-1)
  })
})
