import { Component, type ErrorInfo, type ReactNode } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Button, Typography } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Keep basic logging for debugging unexpected runtime errors.
    console.error('Unhandled UI error', error, errorInfo)
  }

  private handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              minHeight: '100vh',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
            }}
          >
            <Box sx={{ maxWidth: 520, textAlign: 'center' }}>
              <Typography variant="h5" component="h1" gutterBottom>
                Something went wrong
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Unexpected turbulence in the workflow engine. A rogue polygon may have escaped
                containment.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  px: 2,
                  py: 1.5,
                  borderRadius: 1,
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  textAlign: 'left',
                }}
              >
                Incident report:
                <br />
                - Layer goblin pulled the wrong lever.
                <br />
                - Source URL union has gone on strike.
                <br />- Recommended fix: press reload and pretend this never happened.
              </Typography>
              <Button onClick={this.handleReload}>Reload</Button>
            </Box>
          </Box>
        </ThemeProvider>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
