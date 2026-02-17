import { describe, expect, it } from 'vitest'

import { getOrderedSourceLayerPairs } from './mapLayerPairs'
import type { WorkflowSnapshot } from '../workflow/types'

describe('getOrderedSourceLayerPairs', () => {
  it('excludes pairs with empty or missing source URLs', () => {
    const snapshot: WorkflowSnapshot = {
      nodes: [
        { id: 'source-1', type: 'source', position: { x: 0, y: 0 }, data: { url: '' } },
        { id: 'layer-1', type: 'layer', position: { x: 0, y: 0 }, data: {} },
      ],
      edges: [{ id: 'edge-1', source: 'source-1', target: 'layer-1' }],
    }

    const pairs = getOrderedSourceLayerPairs(snapshot)
    expect(pairs).toHaveLength(0)
  })

  it('returns valid pairs sorted by layer y position (top to bottom)', () => {
    const snapshot: WorkflowSnapshot = {
      nodes: [
        {
          id: 'source-1',
          type: 'source',
          position: { x: 0, y: 0 },
          data: { url: 'https://example.com/one.geojson' },
        },
        {
          id: 'source-2',
          type: 'source',
          position: { x: 0, y: 0 },
          data: { url: 'https://example.com/two.geojson' },
        },
        { id: 'layer-1', type: 'layer', position: { x: 0, y: 200 }, data: {} },
        { id: 'layer-2', type: 'layer', position: { x: 0, y: 100 }, data: {} },
      ],
      edges: [
        { id: 'edge-1', source: 'source-1', target: 'layer-1' },
        { id: 'edge-2', source: 'source-2', target: 'layer-2' },
      ],
    }

    const pairs = getOrderedSourceLayerPairs(snapshot)
    expect(pairs.map((pair) => pair.layerId)).toEqual(['layer-2', 'layer-1'])
  })
})
