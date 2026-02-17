import { GeoJsonLayer } from '@deck.gl/layers'
import { DeckGL } from '@deck.gl/react'
import type { Dispatch, SetStateAction } from 'react'
import Map from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Box, Button } from '@mui/material'

type MapviewProps = {
  setShowWorkflowView: Dispatch<SetStateAction<boolean>>
}

type BartFeatureProperties = {
  name?: string
  color?: string
}

type BartFeature = {
  properties?: BartFeatureProperties
}

const BART_GEOJSON_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json'
const SF_NEIGHBORHOODS_GEOJSON_URL =
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/san-francisco.geojson'

const INITIAL_VIEW_STATE = {
  longitude: -122.19697830299943,
  latitude: 37.79676335624272,
  zoom: 10,
}

const toRgb = (hex = ''): [number, number, number] => {
  const normalizedHex = hex.replace('#', '')
  const matches = normalizedHex.match(/[0-9a-f]{2}/gi)
  if (!matches || matches.length < 3) return [0, 0, 0]
  return [
    Number.parseInt(matches[0], 16),
    Number.parseInt(matches[1], 16),
    Number.parseInt(matches[2], 16),
  ]
}

const Mapview = ({ setShowWorkflowView }: MapviewProps) => {
  const handleBack = () => {
    setShowWorkflowView(true)
  }

  const bartLayer = new GeoJsonLayer<BartFeatureProperties>({
    id: 'bart-geojson-layer',
    data: BART_GEOJSON_URL,
    stroked: false,
    filled: true,
    pointType: 'circle+text',
    pickable: true,
    autoHighlight: true,
    getFillColor: [160, 160, 180, 200],
    getLineColor: (feature: BartFeature) => toRgb(feature.properties?.color),
    getText: (feature: BartFeature) => feature.properties?.name ?? '',
    lineWidthUnits: 'pixels',
    getLineWidth: 8,
    lineWidthMinPixels: 8,
    pointRadiusUnits: 'pixels',
    getPointRadius: 10,
    pointRadiusMinPixels: 10,
    getTextSize: 8,
  })

  const sfNeighborhoodsLayer = new GeoJsonLayer({
    id: 'sf-neighborhoods',
    data: SF_NEIGHBORHOODS_GEOJSON_URL,
    pickable: true,
    stroked: true,
    filled: true,
    extruded: false,

    getFillColor: [200, 160, 255, 110],
    getLineColor: [45, 45, 45, 255],
    lineWidthUnits: 'pixels',
    getLineWidth: 2,
    lineWidthMinPixels: 2,
    autoHighlight: true,
    highlightColor: [255, 255, 255, 80],
  })

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh' }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller
        layers={[bartLayer, sfNeighborhoodsLayer]}
        getTooltip={({ object }) => (object?.properties?.name ? object.properties.name : null)}
        onViewStateChange={({ viewState }) => {
          console.log('viewState', viewState)
        }}
        style={{ position: 'absolute', top: '0', right: '0', bottom: '0', left: '0' }}
      >
        <Map mapStyle="https://demotiles.maplibre.org/style.json" />
      </DeckGL>
      <Button
        onClick={handleBack}
        variant="contained"
        sx={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}
      >
        Back
      </Button>
    </Box>
  )
}

export default Mapview
