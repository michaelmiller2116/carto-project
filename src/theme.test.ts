import { describe, expect, it } from 'vitest'

import theme from './theme'

describe('theme', () => {
  it('defines core palette, shape, and button defaults', () => {
    expect(theme.palette.mode).toBe('light')
    expect(theme.palette.primary.main).toBe('#000000')
    expect(theme.palette.background.paper).toBe('#f6f6f6')
    expect(theme.shape.borderRadius).toBe(0)
    expect(theme.components?.MuiButton?.defaultProps?.variant).toBe('contained')
  })

  it('defines card node and selected-node style overrides', () => {
    const cardRoot = theme.components?.MuiCard?.styleOverrides?.root as Record<string, unknown>

    expect(cardRoot['&.node']).toBeTruthy()
    expect(cardRoot['&.node.selected']).toBeTruthy()
  })

  it('defines filled alert overrides for warning and error', () => {
    const alertStyles = theme.components?.MuiAlert?.styleOverrides as Record<string, unknown>

    expect(alertStyles.filledError).toBeTruthy()
    expect(alertStyles.filledWarning).toBeTruthy()
  })
})
