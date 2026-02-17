// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import SourceNode from './SourceNode'

const mockState = vi.hoisted(() => ({
  setNodes: vi.fn(),
}))

vi.mock('@xyflow/react', () => ({
  Handle: (props: { type: string; position: string }) => (
    <div data-testid="handle" data-type={props.type} data-position={props.position} />
  ),
  Position: {
    Right: 'right',
  },
  useReactFlow: () => ({
    setNodes: mockState.setNodes,
  }),
}))

const renderSourceNode = (data: { url?: string } = { url: '' }) => {
  return render(<SourceNode id="source-1" data={data} selected={false} {...({} as never)} />)
}

describe('SourceNode', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockState.setNodes.mockReset()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('updates local draft URL immediately while typing', () => {
    renderSourceNode({ url: '' })

    const input = screen.getByLabelText('url') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'https://example.com/first.geojson' } })

    expect(input.value).toBe('https://example.com/first.geojson')
  })

  it('debounces setNodes URL update by 300ms', () => {
    renderSourceNode({ url: '' })

    const input = screen.getByLabelText('url')
    fireEvent.change(input, { target: { value: 'https://example.com/debounced.geojson' } })

    expect(mockState.setNodes).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(mockState.setNodes).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(mockState.setNodes).toHaveBeenCalledTimes(1)

    const updater = mockState.setNodes.mock.calls[0][0] as (
      nodes: Array<Record<string, unknown>>,
    ) => Array<Record<string, unknown>>
    const result = updater([
      { id: 'source-1', data: { url: '' } },
      { id: 'other-node', data: { url: 'https://example.com/keep.geojson' } },
    ])

    expect(result[0].data).toMatchObject({ url: 'https://example.com/debounced.geojson' })
    expect(result[1].data).toMatchObject({ url: 'https://example.com/keep.geojson' })
  })

  it('clears prior timeout when retyping so latest value wins', () => {
    renderSourceNode({ url: '' })

    const input = screen.getByLabelText('url')
    fireEvent.change(input, { target: { value: 'https://example.com/old.geojson' } })

    act(() => {
      vi.advanceTimersByTime(150)
    })

    fireEvent.change(input, { target: { value: 'https://example.com/new.geojson' } })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockState.setNodes).toHaveBeenCalledTimes(1)

    const updater = mockState.setNodes.mock.calls[0][0] as (
      nodes: Array<Record<string, unknown>>,
    ) => Array<Record<string, unknown>>
    const result = updater([{ id: 'source-1', data: { url: '' } }])

    expect(result[0].data).toMatchObject({ url: 'https://example.com/new.geojson' })
  })

  it('clears pending timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    const view = renderSourceNode({ url: '' })

    fireEvent.change(screen.getByLabelText('url'), {
      target: { value: 'https://example.com/pending.geojson' },
    })

    view.unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })
})
