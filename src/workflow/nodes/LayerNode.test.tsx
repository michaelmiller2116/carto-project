// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import LayerNode from './LayerNode'

vi.mock('@xyflow/react', () => ({
  Handle: ({ type, position }: { type: string; position: string }) => (
    <div data-testid="layer-handle" data-type={type} data-position={position} />
  ),
  Position: {
    Left: 'left',
  },
}))

describe('LayerNode', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders layer label and target handle', () => {
    render(<LayerNode selected={true} {...({} as never)} />)

    const handle = screen.getByTestId('layer-handle')
    expect(screen.getByText('Layer')).toBeTruthy()
    expect(handle.getAttribute('data-type')).toBe('target')
    expect(handle.getAttribute('data-position')).toBe('left')
  })
})
