/*
 * LightningChartJS example that showcases a simple XY line series.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const { lightningChart, PalettedFill, LUT, regularColorSteps, emptyLine, Themes } = lcjs

const { createWaterDropDataGenerator } = require('@arction/xydata')

// Specify the resolution used for the heatmap.
const resolutionX = 1000
const resolutionY = 1000

// Create a XY Chart.
const chart = lightningChart()
    .ChartXY({
        // theme: Themes.darkGold
    })
    .setTitle(
        `Heatmap Grid Series ${resolutionX}x${resolutionY} (${((resolutionX * resolutionY) / 1000000).toFixed(1)} million data points)`,
    )
    .setPadding({ right: 40 })

// Create LUT and FillStyle
const theme = chart.getTheme()
const palette = new LUT({
    units: 'intensity',
    steps: regularColorSteps(0, 60, theme.examples.intensityColorPalette),
    interpolate: false,
})

// Generate heatmap data.
createWaterDropDataGenerator()
    .setRows(resolutionX)
    .setColumns(resolutionY)
    .generate()
    .then((data) => {
        // Add a Heatmap to the Chart.
        const heatmap = chart
            .addHeatmapGridSeries({
                columns: resolutionX,
                rows: resolutionY,
                start: { x: 0, y: 0 },
                end: { x: resolutionX, y: resolutionY },
                dataOrder: 'columns',
            })
            // Color Heatmap using previously created color look up table.
            .setFillStyle(new PalettedFill({ lut: palette }))
            .setWireframeStyle(emptyLine)
            .invalidateIntensityValues(data)

        // Add LegendBox.
        const legend = chart
            .addLegendBox()
            // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
            .setAutoDispose({
                type: 'max-width',
                maxWidth: 0.3,
            })
            .add(chart)
    })
