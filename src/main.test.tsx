// @vitest-environment jsdom
import { StrictMode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockState = vi.hoisted(() => ({
  createRoot: vi.fn(),
  render: vi.fn(),
}))

vi.mock('./App.tsx', () => ({
  default: () => <div data-testid="mock-app" />,
}))

vi.mock('react-dom/client', () => ({
  createRoot: (element: Element | null) => {
    mockState.createRoot(element)
    return {
      render: mockState.render,
    }
  },
}))

describe('main entrypoint', () => {
  beforeEach(() => {
    vi.resetModules()
    document.body.innerHTML = '<div id="root"></div>'
    mockState.createRoot.mockReset()
    mockState.render.mockReset()
  })

  it('creates root and renders App inside StrictMode', async () => {
    await import('./main.tsx')

    const rootElement = document.getElementById('root')
    expect(mockState.createRoot).toHaveBeenCalledWith(rootElement)
    expect(mockState.render).toHaveBeenCalledTimes(1)

    const renderedTree = mockState.render.mock.calls[0][0] as {
      type: unknown
      props: { children: unknown }
    }
    expect(renderedTree.type).toBe(StrictMode)
    expect(renderedTree.props.children).toBeTruthy()
  })
})
