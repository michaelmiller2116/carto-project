import { useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

import theme from './theme'
import WorkflowView from './views/WorkflowView'
import Mapview from './views/Mapview'

const VIEW_STORAGE_KEY = 'activeView'

const getInitialView = (): boolean => {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(VIEW_STORAGE_KEY) !== 'false'
}

function App() {
  const [showWorkflowView, setShowWorkflowView] = useState<boolean>(getInitialView)

  useEffect(() => {
    localStorage.setItem(VIEW_STORAGE_KEY, String(showWorkflowView))
  }, [showWorkflowView])

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {showWorkflowView ? (
          <WorkflowView setShowWorkflowView={setShowWorkflowView} />
        ) : (
          <Mapview setShowWorkflowView={setShowWorkflowView} />
        )}
      </ThemeProvider>
    </>
  )
}

export default App
