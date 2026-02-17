// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { WorkflowEdge, WorkflowNode, WorkflowSnapshot } from '../workflow/types'
import WorkflowView from './WorkflowView'

type CapturedReactFlowProps = {
  isValidConnection: (connection: { source?: string | null; target?: string | null }) => boolean
  onConnect: (params: { source?: string | null; target?: string | null }) => void
  onEdgeDoubleClick: (_event: unknown, edge: WorkflowEdge) => void
}

const xyflowState = vi.hoisted(() => ({
  nodes: [] as WorkflowNode[],
  edges: [] as WorkflowEdge[],
  setEdges: vi.fn(),
  onNodesChange: vi.fn(),
  onEdgesChange: vi.fn(),
  addEdge: vi.fn(
    (params: { source?: string | null; target?: string | null }, edges: WorkflowEdge[]) =>
      edges.concat({
        id: 'edge-added',
        source: params.source ?? '',
        target: params.target ?? '',
      }),
  ),
}))

// We capture ReactFlow props and invoke callback props directly to test WorkflowView logic without DOM drag/connect simulation.
let capturedReactFlowProps: CapturedReactFlowProps | null = null

vi.mock('../workflow/NodeSidebar', () => ({
  default: () => <div data-testid="node-sidebar">Node Sidebar</div>,
}))

vi.mock('@xyflow/react', () => {
  return {
    Background: () => <div data-testid="workflow-background" />,
    BackgroundVariant: { Dots: 'dots' },
    ReactFlowProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="react-flow-provider">{children}</div>
    ),
    ReactFlow: (props: CapturedReactFlowProps & { children?: React.ReactNode }) => {
      capturedReactFlowProps = props
      return <div data-testid="react-flow">{props.children}</div>
    },
    // Controlled arrays are injected per test so each scenario can deterministically drive connection and effect behavior.
    useNodesState: () => [xyflowState.nodes, vi.fn(), xyflowState.onNodesChange],
    useEdgesState: () => [xyflowState.edges, xyflowState.setEdges, xyflowState.onEdgesChange],
    addEdge: (params: { source?: string | null; target?: string | null }, edges: WorkflowEdge[]) =>
      xyflowState.addEdge(params, edges),
  }
})

const sourceNode: WorkflowNode = {
  id: 'source-1',
  type: 'source',
  position: { x: 0, y: 0 },
  data: { url: 'https://example.com/one.geojson' },
}

const sourceNodeTwo: WorkflowNode = {
  id: 'source-2',
  type: 'source',
  position: { x: 10, y: 10 },
  data: { url: 'https://example.com/two.geojson' },
}

const layerNode: WorkflowNode = {
  id: 'layer-1',
  type: 'layer',
  position: { x: 100, y: 100 },
  data: {},
}

const layerNodeTwo: WorkflowNode = {
  id: 'layer-2',
  type: 'layer',
  position: { x: 110, y: 110 },
  data: {},
}

const wrongSourceTypeNode: WorkflowNode = {
  id: 'wrong-source',
  type: 'layer',
  position: { x: 120, y: 120 },
  data: {},
}

const wrongTargetTypeNode: WorkflowNode = {
  id: 'wrong-target',
  type: 'source',
  position: { x: 130, y: 130 },
  data: { url: 'https://example.com/three.geojson' },
}

const stableSnapshot: WorkflowSnapshot = {
  nodes: [sourceNode, layerNode],
  edges: [],
}

const draggingSnapshot: WorkflowSnapshot = {
  nodes: [{ ...sourceNode, dragging: true }, layerNode],
  edges: [],
}

const duplicateSourceSnapshot: WorkflowSnapshot = {
  nodes: [sourceNode, sourceNodeTwo, layerNode, layerNodeTwo],
  edges: [{ id: 'edge-1', source: 'source-1', target: 'layer-1' }],
}

const duplicateTargetSnapshot: WorkflowSnapshot = {
  nodes: [sourceNode, sourceNodeTwo, layerNode, layerNodeTwo],
  edges: [{ id: 'edge-1', source: 'source-1', target: 'layer-1' }],
}

const renderWorkflowView = (snapshot: WorkflowSnapshot = stableSnapshot) => {
  xyflowState.nodes = snapshot.nodes
  xyflowState.edges = snapshot.edges

  const setShowWorkflowView = vi.fn()
  const setWorkflowSnapshot = vi.fn()

  render(
    <WorkflowView
      setShowWorkflowView={setShowWorkflowView}
      workflowSnapshot={snapshot}
      setWorkflowSnapshot={setWorkflowSnapshot}
    />,
  )

  return { setShowWorkflowView, setWorkflowSnapshot }
}

const getReactFlowProps = () => {
  if (!capturedReactFlowProps) {
    throw new Error('ReactFlow props were not captured')
  }

  return capturedReactFlowProps
}

describe('WorkflowView', () => {
  beforeEach(() => {
    capturedReactFlowProps = null
    xyflowState.nodes = []
    xyflowState.edges = []
    xyflowState.setEdges = vi.fn()
    xyflowState.onNodesChange = vi.fn()
    xyflowState.onEdgesChange = vi.fn()
    xyflowState.addEdge = vi.fn(
      (params: { source?: string | null; target?: string | null }, edges: WorkflowEdge[]) =>
        edges.concat({
          id: 'edge-added',
          source: params.source ?? '',
          target: params.target ?? '',
        }),
    )
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders the baseline structure', () => {
    renderWorkflowView(stableSnapshot)

    expect(screen.getByTestId('node-sidebar')).toBeTruthy()
    expect(screen.getByTestId('react-flow')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Map' })).toBeTruthy()
  })

  it('toggles to map view when the Map button is clicked', () => {
    const { setShowWorkflowView } = renderWorkflowView(stableSnapshot)

    fireEvent.click(screen.getByRole('button', { name: 'Map' }))

    expect(setShowWorkflowView).toHaveBeenCalledTimes(1)
    expect(setShowWorkflowView).toHaveBeenCalledWith(false)
  })

  it('persists workflow snapshot when nodes are stable', () => {
    const { setWorkflowSnapshot } = renderWorkflowView(stableSnapshot)

    expect(setWorkflowSnapshot).toHaveBeenCalledWith({
      nodes: stableSnapshot.nodes,
      edges: stableSnapshot.edges,
    })
  })

  it('does not persist snapshot while a node is dragging', () => {
    // Dragging state is intentionally skipped to avoid writing transient intermediate positions to persisted workflow.
    const { setWorkflowSnapshot } = renderWorkflowView(draggingSnapshot)

    expect(setWorkflowSnapshot).not.toHaveBeenCalled()
  })

  it('rejects invalid primitive connection values', () => {
    renderWorkflowView(stableSnapshot)
    const props = getReactFlowProps()

    expect(props.isValidConnection({ source: null, target: 'layer-1' })).toBe(false)
    expect(props.isValidConnection({ source: 'source-1', target: null })).toBe(false)
    expect(props.isValidConnection({ source: 'source-1', target: 'source-1' })).toBe(false)
  })

  it('enforces source-to-layer connection typing', () => {
    const typedSnapshot: WorkflowSnapshot = {
      nodes: [sourceNode, layerNode, wrongSourceTypeNode, wrongTargetTypeNode],
      edges: [],
    }

    renderWorkflowView(typedSnapshot)
    const props = getReactFlowProps()

    expect(props.isValidConnection({ source: 'wrong-source', target: 'layer-1' })).toBe(false)
    expect(props.isValidConnection({ source: 'source-1', target: 'wrong-target' })).toBe(false)
  })

  it('rejects duplicate source or target connections', () => {
    // Each source and each layer target can only participate in one edge to preserve one-to-one workflow mapping.
    renderWorkflowView(duplicateSourceSnapshot)
    const sourceDuplicateProps = getReactFlowProps()
    expect(sourceDuplicateProps.isValidConnection({ source: 'source-1', target: 'layer-2' })).toBe(
      false,
    )

    renderWorkflowView(duplicateTargetSnapshot)
    const targetDuplicateProps = getReactFlowProps()
    expect(targetDuplicateProps.isValidConnection({ source: 'source-2', target: 'layer-1' })).toBe(
      false,
    )
  })

  it('accepts a valid unique source-to-layer connection', () => {
    const validSnapshot: WorkflowSnapshot = {
      nodes: [sourceNode, sourceNodeTwo, layerNode, layerNodeTwo],
      edges: [{ id: 'edge-1', source: 'source-1', target: 'layer-1' }],
    }

    renderWorkflowView(validSnapshot)
    const props = getReactFlowProps()

    expect(props.isValidConnection({ source: 'source-2', target: 'layer-2' })).toBe(true)
  })

  it('does not add an edge when onConnect receives an invalid connection', () => {
    renderWorkflowView(stableSnapshot)
    const props = getReactFlowProps()

    props.onConnect({ source: 'source-1', target: 'source-1' })

    expect(xyflowState.addEdge).not.toHaveBeenCalled()
    expect(xyflowState.setEdges).not.toHaveBeenCalled()
  })

  it('adds an edge when onConnect receives a valid connection', () => {
    renderWorkflowView(stableSnapshot)
    const props = getReactFlowProps()
    const nextEdges: WorkflowEdge[] = [{ id: 'edge-2', source: 'source-1', target: 'layer-1' }]
    xyflowState.addEdge.mockReturnValueOnce(nextEdges)
    const connection = { source: 'source-1', target: 'layer-1' }

    props.onConnect(connection)

    expect(xyflowState.addEdge).toHaveBeenCalledWith(connection, stableSnapshot.edges)
    expect(xyflowState.setEdges).toHaveBeenCalledWith(nextEdges)
  })

  it('removes the selected edge on double click', () => {
    const removableEdges: WorkflowEdge[] = [
      { id: 'edge-1', source: 'source-1', target: 'layer-1' },
      { id: 'edge-2', source: 'source-2', target: 'layer-2' },
    ]
    const snapshot: WorkflowSnapshot = {
      nodes: [sourceNode, sourceNodeTwo, layerNode, layerNodeTwo],
      edges: removableEdges,
    }

    renderWorkflowView(snapshot)
    const props = getReactFlowProps()

    props.onEdgeDoubleClick({}, removableEdges[0])

    expect(xyflowState.setEdges).toHaveBeenCalledWith([removableEdges[1]])
  })
})
