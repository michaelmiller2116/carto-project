import { useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

import theme from './theme'
import type { WorkflowEdge, WorkflowNode, WorkflowSnapshot } from './workflow/types'
import WorkflowView from './views/WorkflowView'
import Mapview from './views/Mapview'

const VIEW_STORAGE_KEY = 'showWorkflowView'
const WORKFLOW_STORAGE_KEY = 'workflow'

const getInitialView = (): boolean => {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(VIEW_STORAGE_KEY) !== 'false'
}

const getInitialWorkflowSnapshot = (): WorkflowSnapshot => {
  if (typeof window === 'undefined') return { nodes: [], edges: [] }

  try {
    const rawWorkflow = localStorage.getItem(WORKFLOW_STORAGE_KEY)
    if (!rawWorkflow) return { nodes: [], edges: [] }

    const parsedWorkflow = JSON.parse(rawWorkflow)
    const nodes = Array.isArray(parsedWorkflow.nodes)
      ? (parsedWorkflow.nodes as WorkflowNode[])
      : []
    const edges = Array.isArray(parsedWorkflow.edges)
      ? (parsedWorkflow.edges as WorkflowEdge[])
      : []

    return { nodes, edges }
  } catch {
    return { nodes: [], edges: [] }
  }
}

function App() {
  const [showWorkflowView, setShowWorkflowView] = useState<boolean>(getInitialView)
  const [workflowSnapshot, setWorkflowSnapshot] = useState<WorkflowSnapshot>(
    getInitialWorkflowSnapshot,
  )

  useEffect(() => {
    localStorage.setItem(VIEW_STORAGE_KEY, String(showWorkflowView))
  }, [showWorkflowView])

  useEffect(() => {
    localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(workflowSnapshot))
  }, [workflowSnapshot])

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {showWorkflowView ? (
          <WorkflowView
            setShowWorkflowView={setShowWorkflowView}
            workflowSnapshot={workflowSnapshot}
            setWorkflowSnapshot={setWorkflowSnapshot}
          />
        ) : (
          <Mapview setShowWorkflowView={setShowWorkflowView} workflowSnapshot={workflowSnapshot} />
        )}
      </ThemeProvider>
    </>
  )
}

export default App
