/*
 * LightningChartJS example that showcases a simple XY line series.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    PalettedFill,
    LUT,
    ColorRGBA,
    Themes
} = lcjs

const {
    createWaterDropDataGenerator
} = require('@arction/xydata')


// Create a XY Chart.
const chart = lightningChart().ChartXY({
    // theme: Themes.dark
})
    .setTitle('Heatmap using IntensityGrid')

// Specify the resolution used for the heatmap.
const resolutionX = 100
const resolutionY = 200

// Create LUT and FillStyle
const palette = new LUT({
    steps: [
        { value: 0, color: ColorRGBA(255, 255, 0) },
        { value: 30, color: ColorRGBA(255, 204, 0) },
        { value: 45, color: ColorRGBA(255, 128, 0) },
        { value: 60, color: ColorRGBA(255, 0, 0) },
    ],
    interpolate: false
})

// Add a Heatmap to the Chart. By default IntensityGrid Series Type is used.
const heatmap = chart.addHeatmapSeries({
    rows: resolutionX,
    columns: resolutionY,
    start: { x: 10, y: 10 },
    end: { x: 90, y: 90 },
    pixelate: false
})
    // Color Heatmap using previously created color look up table.
    .setFillStyle(new PalettedFill({ lut: palette }))

// Generate heatmap data.
createWaterDropDataGenerator()
    .setRows( resolutionX )
    .setColumns( resolutionY )
    .generate()
    .then( data => {
        heatmap.invalidateValuesOnly( data )
    } )

// Add LegendBox.
const legend = chart.addLegendBox().add(chart)
