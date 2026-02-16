import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import WorkflowView from './views/WorkflowView'
import Mapview from './views/Mapview'

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WorkflowView />
        <Mapview />
      </ThemeProvider>
    </>
  )
}

export default App
