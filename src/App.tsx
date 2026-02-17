import { useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { useNodesState, useEdgesState } from '@xyflow/react'

import theme from './theme'
import WorkflowView from './views/WorkflowView'
import Mapview from './views/Mapview'
import type { WorkflowEdge, WorkflowNode } from './workflow/types'

function App() {
  const [showWorkflowView, setShowWorkflowView] = useState<boolean>(true)
  const initialNodes: WorkflowNode[] = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
  ]
  const initialEdges: WorkflowEdge[] = [{ id: 'n1-n2', source: 'n1', target: 'n2' }]

  const [nodes, , onNodesChange] = useNodesState<WorkflowNode>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>(initialEdges)

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {showWorkflowView ? (
          <WorkflowView
            nodes={nodes}
            edges={edges}
            setEdges={setEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setShowWorkflowView={setShowWorkflowView}
          />
        ) : (
          <Mapview />
        )}
      </ThemeProvider>
    </>
  )
}

export default App
