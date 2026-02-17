import { GeoJsonLayer } from '@deck.gl/layers'
import { DeckGL } from '@deck.gl/react'
import { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import MapLibre from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Alert, Box, Button, Snackbar } from '@mui/material'
import type { WorkflowSnapshot } from '../workflow/types'
import { getOrderedSourceLayerPairs } from '../map/mapLayerPairs'

type MapviewProps = {
  setShowWorkflowView: Dispatch<SetStateAction<boolean>>
  workflowSnapshot: WorkflowSnapshot
}

const INITIAL_VIEW_STATE = {
  longitude: -122.19697830299943,
  latitude: 37.79676335624272,
  zoom: 10,
}

const getFilenameFromUrl = (url: string): string => {
  try {
    const pathname = new URL(url).pathname
    const filename = pathname.split('/').pop()
    return filename ? decodeURIComponent(filename) : 'data file'
  } catch {
    return 'data file'
  }
}

const Mapview = ({ setShowWorkflowView, workflowSnapshot }: MapviewProps) => {
  const [warningDismissed, setWarningDismissed] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; failedFilenames: string[] }>({
    open: false,
    failedFilenames: [],
  })

  const sourceLayerPairs = useMemo(
    () => getOrderedSourceLayerPairs(workflowSnapshot),
    [workflowSnapshot],
  )
  const hasLayerUrls = sourceLayerPairs.length > 0
  const errorSnackbarMessage =
    snackbar.failedFilenames.length <= 1
      ? `Couldn't load ${snackbar.failedFilenames[0] ?? 'data file'}.`
      : `Couldn't load ${snackbar.failedFilenames.join(', ')}.`

  const handleLoadError = useCallback((dataUrl: string, error: unknown) => {
    const filename = getFilenameFromUrl(dataUrl)
    console.error(`[${filename}]`, error)
    setSnackbar((previous) => ({
      open: true,
      failedFilenames: previous.failedFilenames.includes(filename)
        ? previous.failedFilenames
        : [...previous.failedFilenames, filename],
    }))
  }, [])

  const handleSnackbarClose = useCallback(() => {
    setSnackbar({
      open: false,
      failedFilenames: [],
    })
  }, [])

  const handleWarningClose = useCallback(() => {
    setWarningDismissed(true)
  }, [])

  const layers = useMemo(() => {
    return sourceLayerPairs.map(
      ({ dataUrl, sourceId, layerId }) =>
        new GeoJsonLayer({
          id: `workflow-layer-${layerId}-${sourceId}`,
          data: dataUrl,
          pickable: true,
          stroked: true,
          filled: true,
          lineWidthUnits: 'pixels',
          getLineWidth: 4,
          lineWidthMinPixels: 4,
          pointRadiusUnits: 'pixels',
          getPointRadius: 6,
          pointRadiusMinPixels: 6,
          getFillColor: [90, 90, 90, 90],
          getLineColor: [30, 30, 30, 200],
          onError: (error) => {
            handleLoadError(dataUrl, error)
          },
        }),
    )
  }, [handleLoadError, sourceLayerPairs])

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh' }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller
        layers={layers}
        getTooltip={({ object }) => (object?.properties?.name ? object.properties.name : null)}
        style={{ position: 'absolute', top: '0', right: '0', bottom: '0', left: '0' }}
      >
        <MapLibre mapStyle="https://demotiles.maplibre.org/style.json" />
      </DeckGL>
      <Button
        onClick={() => setShowWorkflowView(true)}
        sx={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}
      >
        Back
      </Button>
      <Snackbar
        open={!hasLayerUrls && !warningDismissed}
        autoHideDuration={5000}
        onClose={handleWarningClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleWarningClose} severity="warning">
          No layer URLs found. Add a URL in the workflow to render a layer on the map.
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" variant="filled">
          {errorSnackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Mapview
