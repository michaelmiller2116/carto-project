import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './ErrorBoundary.tsx'

const logConsoleEasterEgg = () => {
  const asciiArt = `
**************************************************************
*                                                            *
* .______    __    ______  __  ___  .___  ___.  _______      *
* |   _  \\  |  |  /      ||  |/  /  |   \\/   | |   ____|     *
* |  |_)  | |  | |  ,----'|  '  /   |  \\  /  | |  |__        *
* |   ___/  |  | |  |     |    <    |  |\\/|  | |   __|       *
* |  |      |  | |  \`----.|  .  \\   |  |  |  | |  |____ __   *
* | _|      |__|  \\______||__|\\__\\  |__|  |__| |_______(_ )  *
* .______    __    ______  __  ___  .___  ___.  _______ |/_  *
* |   _  \\  |  |  /      ||  |/  /  |   \\/   | |   ____||  | *
* |  |_)  | |  | |  ,----'|  '  /   |  \\  /  | |  |__   |  | *
* |   ___/  |  | |  |     |    <    |  |\\/|  | |   __|  |  | *
* |  |      |  | |  \`----.|  .  \\   |  |  |  | |  |____ |__| *
* | _|      |__|  \\______||__|\\__\\  |__|  |__| |_______|(__) *
*                                                            *
**************************************************************
`

  console.log('%c' + asciiArt, 'color: #1f6feb; font-weight: 700;')
}

const setupConsoleEasterEgg = () => {
  let hasLogged = false
  const devtoolsThreshold = 160

  const maybeLog = () => {
    if (hasLogged) {
      return
    }

    const widthGap = Math.abs(window.outerWidth - window.innerWidth)
    const heightGap = Math.abs(window.outerHeight - window.innerHeight)
    const isDevtoolsLikelyOpen = widthGap > devtoolsThreshold || heightGap > devtoolsThreshold

    if (isDevtoolsLikelyOpen) {
      hasLogged = true
      logConsoleEasterEgg()
      window.removeEventListener('resize', maybeLog)
    }
  }

  window.addEventListener('resize', maybeLog)
  setTimeout(maybeLog, 0)
}

if (import.meta.env.MODE !== 'test') {
  setupConsoleEasterEgg()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
