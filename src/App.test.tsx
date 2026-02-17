// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { WorkflowSnapshot } from './workflow/types'

// Deterministic snapshot emitted by the mocked WorkflowView "update" action.
const nextSnapshot: WorkflowSnapshot = {
  nodes: [
    {
      id: 'node-1',
      type: 'source',
      position: { x: 10, y: 20 },
      data: { url: 'https://example.com/a.geojson' },
    },
  ],
  edges: [{ id: 'edge-1', source: 'node-1', target: 'layer-1' }],
}

vi.mock('./views/WorkflowView', async () => {
  type WorkflowViewProps = {
    setShowWorkflowView: React.Dispatch<React.SetStateAction<boolean>>
    workflowSnapshot: WorkflowSnapshot
    setWorkflowSnapshot: React.Dispatch<React.SetStateAction<WorkflowSnapshot>>
  }

  const MockWorkflowView = ({
    setShowWorkflowView,
    workflowSnapshot,
    setWorkflowSnapshot,
  }: WorkflowViewProps) => (
    <div>
      <div data-testid="workflow-view">Workflow View</div>
      <div data-testid="workflow-nodes-count">{workflowSnapshot.nodes.length}</div>
      <div data-testid="workflow-edges-count">{workflowSnapshot.edges.length}</div>
      <button onClick={() => setShowWorkflowView(false)} type="button">
        Go To Map
      </button>
      <button onClick={() => setWorkflowSnapshot(nextSnapshot)} type="button">
        Update Workflow
      </button>
    </div>
  )

  return { default: MockWorkflowView }
})

vi.mock('./views/Mapview', async () => {
  type MapviewProps = {
    setShowWorkflowView: React.Dispatch<React.SetStateAction<boolean>>
  }

  const MockMapview = ({ setShowWorkflowView }: MapviewProps) => (
    <div>
      <div data-testid="map-view">Map View</div>
      <button onClick={() => setShowWorkflowView(true)} type="button">
        Go To Workflow
      </button>
    </div>
  )

  return { default: MockMapview }
})

import App from './App'

const viewStorageKey = 'showWorkflowView'
const workflowStorageKey = 'workflow'

describe('App', () => {
  beforeEach(() => {
    // Each test controls its own storage setup explicitly.
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('defaults to workflow view and persists default values when storage is empty', () => {
    // Spy on writes while keeping real localStorage behavior.
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

    render(<App />)

    expect(screen.getByTestId('workflow-view')).toBeTruthy()
    expect(setItemSpy).toHaveBeenCalledWith(viewStorageKey, 'true')
    expect(setItemSpy).toHaveBeenCalledWith(
      workflowStorageKey,
      JSON.stringify({ nodes: [], edges: [] }),
    )
  })

  it('renders map view first when showWorkflowView is false in storage', () => {
    localStorage.setItem(viewStorageKey, 'false')

    render(<App />)

    expect(screen.getByTestId('map-view')).toBeTruthy()
  })

  it('hydrates workflow snapshot from valid storage JSON', () => {
    // Stored JSON should be parsed and handed to WorkflowView as initial props.
    const storedWorkflow: WorkflowSnapshot = {
      nodes: [
        {
          id: 'source-1',
          type: 'source',
          position: { x: 0, y: 0 },
          data: { url: 'https://example.com/one.geojson' },
        },
      ],
      edges: [{ id: 'edge-1', source: 'source-1', target: 'layer-1' }],
    }
    localStorage.setItem(workflowStorageKey, JSON.stringify(storedWorkflow))

    render(<App />)

    expect(screen.getByTestId('workflow-nodes-count').textContent).toBe('1')
    expect(screen.getByTestId('workflow-edges-count').textContent).toBe('1')
  })

  it('falls back to empty workflow snapshot for invalid workflow JSON', () => {
    localStorage.setItem(workflowStorageKey, 'not-json')

    render(<App />)

    expect(screen.getByTestId('workflow-view')).toBeTruthy()
    expect(screen.getByTestId('workflow-nodes-count').textContent).toBe('0')
    expect(screen.getByTestId('workflow-edges-count').textContent).toBe('0')
  })

  it('persists showWorkflowView when switching between views', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Go To Map' }))
    expect(screen.getByTestId('map-view')).toBeTruthy()
    expect(setItemSpy).toHaveBeenCalledWith(viewStorageKey, 'false')

    fireEvent.click(screen.getByRole('button', { name: 'Go To Workflow' }))
    expect(screen.getByTestId('workflow-view')).toBeTruthy()
    expect(setItemSpy).toHaveBeenCalledWith(viewStorageKey, 'true')
  })

  it('persists updated workflow snapshot when child updates workflow', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Update Workflow' }))

    expect(setItemSpy).toHaveBeenCalledWith(workflowStorageKey, JSON.stringify(nextSnapshot))
  })

  it('sanitizes stored workflow when nodes or edges are not arrays', () => {
    // App should coerce invalid shapes to empty arrays.
    localStorage.setItem(
      workflowStorageKey,
      JSON.stringify({
        nodes: { bad: true },
        edges: 'also-bad',
      }),
    )

    render(<App />)

    expect(screen.getByTestId('workflow-nodes-count').textContent).toBe('0')
    expect(screen.getByTestId('workflow-edges-count').textContent).toBe('0')
  })
})
