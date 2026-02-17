// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { WorkflowSnapshot } from '../workflow/types'
import Mapview from './Mapview'

const mockState = vi.hoisted(() => ({
  capturedDeckProps: null as null | Record<string, unknown>,
  geoJsonLayer: vi.fn(function MockGeoJsonLayer(
    this: Record<string, unknown>,
    props: Record<string, unknown>,
  ) {
    Object.assign(this, props)
  }),
  orderedPairs: vi.fn(),
}))

vi.mock('./mapLayerPairs', () => ({
  getOrderedSourceLayerPairs: (snapshot: WorkflowSnapshot) => mockState.orderedPairs(snapshot),
}))

vi.mock('@deck.gl/layers', () => ({
  GeoJsonLayer: mockState.geoJsonLayer,
}))

vi.mock('@deck.gl/react', () => ({
  DeckGL: (props: Record<string, unknown> & { children?: React.ReactNode }) => {
    mockState.capturedDeckProps = props
    return <div data-testid="deckgl">{props.children}</div>
  },
}))

vi.mock('react-map-gl/maplibre', () => ({
  default: () => <div data-testid="maplibre" />,
}))

vi.mock('@mui/material', () => ({
  Box: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Button: ({ children, onClick }: { children?: React.ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
  Snackbar: ({
    open,
    children,
    onClose,
  }: {
    open: boolean
    children?: React.ReactNode
    onClose?: () => void
  }) =>
    open ? (
      <div>
        {children}
        <button type="button" onClick={onClose}>
          dismiss
        </button>
      </div>
    ) : null,
  Alert: ({ children, onClose }: { children?: React.ReactNode; onClose?: () => void }) => (
    <div>
      {children}
      <button type="button" onClick={onClose}>
        dismiss
      </button>
    </div>
  ),
}))

const emptySnapshot: WorkflowSnapshot = { nodes: [], edges: [] }

const renderMapview = (pairs: Array<{ dataUrl: string; sourceId: string; layerId: string }>) => {
  mockState.orderedPairs.mockReturnValue(pairs)
  const setShowWorkflowView = vi.fn()

  render(<Mapview setShowWorkflowView={setShowWorkflowView} workflowSnapshot={emptySnapshot} />)

  return { setShowWorkflowView }
}

const getDeckProps = () => {
  if (!mockState.capturedDeckProps) {
    throw new Error('DeckGL props were not captured')
  }

  return mockState.capturedDeckProps
}

describe('Mapview', () => {
  beforeEach(() => {
    mockState.capturedDeckProps = null
    mockState.geoJsonLayer.mockClear()
    mockState.orderedPairs.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders warning snackbar when no valid layer URLs and dismiss hides it', () => {
    renderMapview([])

    expect(
      screen.getByText(
        'No layer URLs found. Add a URL in the workflow to render a layer on the map.',
      ),
    ).toBeTruthy()

    fireEvent.click(screen.getAllByRole('button', { name: 'dismiss' })[0])

    expect(
      screen.queryByText(
        'No layer URLs found. Add a URL in the workflow to render a layer on the map.',
      ),
    ).toBeNull()
  })

  it('Back button flips to workflow view', () => {
    const { setShowWorkflowView } = renderMapview([])

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(setShowWorkflowView).toHaveBeenCalledWith(true)
  })

  it('builds layers from ordered source-layer pairs', () => {
    renderMapview([
      { dataUrl: 'https://example.com/one.geojson', sourceId: 'source-1', layerId: 'layer-1' },
      { dataUrl: 'https://example.com/two.geojson', sourceId: 'source-2', layerId: 'layer-2' },
    ])

    expect(mockState.geoJsonLayer).toHaveBeenCalledTimes(2)
    expect(mockState.geoJsonLayer.mock.calls[0][0]).toMatchObject({
      id: 'workflow-layer-layer-1-source-1',
      data: 'https://example.com/one.geojson',
    })
    expect(mockState.geoJsonLayer.mock.calls[1][0]).toMatchObject({
      id: 'workflow-layer-layer-2-source-2',
      data: 'https://example.com/two.geojson',
    })

    const deckProps = getDeckProps() as { layers: unknown[] }
    expect(deckProps.layers).toHaveLength(2)
  })

  it('de-dupes failed filenames and shows single/multi-file error messages', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    renderMapview([
      { dataUrl: 'https://example.com/one.geojson', sourceId: 'source-1', layerId: 'layer-1' },
      { dataUrl: 'https://example.com/two.geojson', sourceId: 'source-2', layerId: 'layer-2' },
    ])

    const firstLayerProps = mockState.geoJsonLayer.mock.calls[0][0] as {
      onError: (error: unknown) => void
    }
    const secondLayerProps = mockState.geoJsonLayer.mock.calls[1][0] as {
      onError: (error: unknown) => void
    }

    act(() => {
      firstLayerProps.onError(new Error('failed 1'))
    })
    expect(screen.getByText("Couldn't load one.geojson.")).toBeTruthy()

    act(() => {
      firstLayerProps.onError(new Error('failed 1 again'))
    })
    expect(screen.getByText("Couldn't load one.geojson.")).toBeTruthy()

    act(() => {
      secondLayerProps.onError(new Error('failed 2'))
    })
    expect(screen.getByText("Couldn't load one.geojson, two.geojson.")).toBeTruthy()
    expect(consoleErrorSpy).toHaveBeenCalledWith('[one.geojson]', expect.any(Error))

    consoleErrorSpy.mockRestore()
  })

  it('provides tooltip with feature name or null', () => {
    renderMapview([
      { dataUrl: 'https://example.com/one.geojson', sourceId: 'source-1', layerId: 'layer-1' },
    ])

    const deckProps = getDeckProps() as {
      getTooltip: (args: { object?: { properties?: { name?: string } } | null }) => string | null
    }

    expect(deckProps.getTooltip({ object: { properties: { name: 'Feature Name' } } })).toBe(
      'Feature Name',
    )
    expect(deckProps.getTooltip({ object: { properties: {} } })).toBeNull()
    expect(deckProps.getTooltip({ object: null })).toBeNull()
  })
})
