window.lcjsSmallView = window.devicePixelRatio >= 2
if (!window.__lcjsDebugOverlay) {
    window.__lcjsDebugOverlay = document.createElement('div')
    window.__lcjsDebugOverlay.style.cssText = 'position:fixed;top:10px;left:10px;background:rgba(0,0,0,0.7);color:#fff;padding:4px 8px;z-index:99999;font:12px monospace;pointer-events:none'
    const attach = () => { if (document.body && !window.__lcjsDebugOverlay.parentNode) document.body.appendChild(window.__lcjsDebugOverlay) }
    attach()
    setInterval(() => {
        attach()
        window.__lcjsDebugOverlay.textContent = window.innerWidth + 'x' + window.innerHeight + ' dpr=' + window.devicePixelRatio + ' small=' + window.lcjsSmallView
    }, 500)
}
/*
 * LightningChartJS example that showcases a simple XY line series.
 */
// Import LightningChartJS
const lcjs = require('@lightningchart/lcjs')

// Extract required parts from LightningChartJS.
const { lightningChart, PalettedFill, LUT, regularColorSteps, emptyLine, contoursFromLUT, Themes } = lcjs

const { createWaterDropDataGenerator } = require('@lightningchart/xydata')

// Specify the resolution used for the heatmap.
const resolutionX = 1000
const resolutionY = 1000

// Create a XY Chart.
const chart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .ChartXY({
        theme: (() => {
    const t = Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined
    return t && window.lcjsSmallView ? lcjs.scaleTheme(t, 0.5) : t
})(),
textRenderer: window.lcjsSmallView ? lcjs.htmlTextRenderer : undefined,
    })
    .setTitle(
        `Heatmap Grid Series ${resolutionX}x${resolutionY} (${((resolutionX * resolutionY) / 1000000).toFixed(1)} million data points)`,
    )

// Create LUT and FillStyle
const theme = chart.getTheme()
const palette = new LUT({
    units: '°C',
    steps: regularColorSteps(0, 75, theme.examples.intensityColorPalette),
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
            .setContours(contoursFromLUT(palette))
            .invalidateIntensityValues(data)
    })
