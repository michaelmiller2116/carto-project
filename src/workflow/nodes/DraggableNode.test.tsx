// @vitest-environment jsdom
import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import DraggableNode from './DraggableNode'

const dragState = vi.hoisted(() => ({
  useDraggable: vi.fn(),
  latestOptions: null as null | {
    position: { x: number; y: number }
    onDrag: (payload: { offsetX: number; offsetY: number }) => void
    onDragEnd: (payload: { event: { clientX: number; clientY: number } }) => void
  },
}))

vi.mock('@neodrag/react', () => ({
  useDraggable: (
    _ref: unknown,
    options: {
      position: { x: number; y: number }
      onDrag: (payload: { offsetX: number; offsetY: number }) => void
      onDragEnd: (payload: { event: { clientX: number; clientY: number } }) => void
    },
  ) => {
    dragState.latestOptions = options
    dragState.useDraggable(_ref, options)
  },
}))

describe('DraggableNode', () => {
  beforeEach(() => {
    dragState.useDraggable.mockReset()
    dragState.latestOptions = null
  })

  afterEach(() => {
    cleanup()
  })

  it('calls onDrop with nodeType and pointer position on drag end', () => {
    const onDrop = vi.fn()

    render(
      <DraggableNode nodeType="source" onDrop={onDrop}>
        child
      </DraggableNode>,
    )

    if (!dragState.latestOptions) {
      throw new Error('Draggable options were not captured')
    }

    act(() => {
      dragState.latestOptions?.onDragEnd({ event: { clientX: 120, clientY: 240 } })
    })

    expect(onDrop).toHaveBeenCalledWith('source', { x: 120, y: 240 })
  })

  it('resets internal drag position back to {0,0} after drag end', () => {
    const onDrop = vi.fn()

    render(
      <DraggableNode nodeType="layer" onDrop={onDrop}>
        child
      </DraggableNode>,
    )

    if (!dragState.latestOptions) {
      throw new Error('Draggable options were not captured')
    }

    act(() => {
      dragState.latestOptions?.onDrag({ offsetX: 11, offsetY: 22 })
    })

    const afterDragCall =
      dragState.useDraggable.mock.calls[dragState.useDraggable.mock.calls.length - 1]
    expect(afterDragCall[1].position).toEqual({ x: 11, y: 22 })

    act(() => {
      dragState.latestOptions?.onDragEnd({ event: { clientX: 50, clientY: 60 } })
    })

    const afterDragEndCall =
      dragState.useDraggable.mock.calls[dragState.useDraggable.mock.calls.length - 1]
    expect(afterDragEndCall[1].position).toEqual({ x: 0, y: 0 })
  })
})
