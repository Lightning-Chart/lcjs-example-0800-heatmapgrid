/*
 * LightningChartJS example that showcases a simple XY line series.
 */
// Import LightningChartJS
const lcjs = require('@lightningchart/lcjs')

// Extract required parts from LightningChartJS.
const { lightningChart, PalettedFill, LUT, regularColorSteps, emptyLine, Themes } = lcjs

const { createWaterDropDataGenerator } = require('@lightningchart/xydata')

// Specify the resolution used for the heatmap.
const resolutionX = 1000
const resolutionY = 1000

// Create a XY Chart.
const chart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .ChartXY({
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    })
    .setTitle(
        `Heatmap Grid Series ${resolutionX}x${resolutionY} (${((resolutionX * resolutionY) / 1000000).toFixed(1)} million data points)`,
    )

// Create LUT and FillStyle
const theme = chart.getTheme()
const palette = new LUT({
    units: '°C',
    percentageValues: true,
    steps: regularColorSteps(
        // first color at min value
        0,
        // last color at 70% between min and max value
        0.7,
        theme.examples.intensityColorPalette,
    ),
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
                dataOrder: 'columns',
            })
            .setStart({ x: 0, y: 0 })
            .setEnd({ x: resolutionX, y: resolutionY })
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
