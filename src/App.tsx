import { useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

import theme from './theme'
import WorkflowView from './views/WorkflowView'
import Mapview from './views/Mapview'

function App() {
  const [showWorkflowView] = useState<boolean>(true)

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {showWorkflowView ? <WorkflowView /> : <Mapview />}
      </ThemeProvider>
    </>
  )
}

export default App
