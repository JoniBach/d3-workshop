/**
 * Central data provider for all visualization charts.
 * This function serves as a single source of truth for data transformations,
 * ensuring consistency across all chart types and making it easy to update
 * data processing logic in one place.
 * 
 * Available Chart Types:
 * - **Time-based:** area, line, streamGraph, timeline
 * - **Bar Charts:** bar, horizontalBar, groupedBar, stackedBar
 * - **Part-to-Whole:** pie, donut, treemap, sunburst
 * - **Distribution:** histogram, boxPlot, violinPlot
 * - **Relationship:** scatter, bubble, heatmap
 * - **Network/Hierarchy:** forceDirected, sankey
 * 
 * ============================================================================
 * 
 * @param {Object} data - The raw asteroid data object containing all asteroid information
 * @param {Array<Object>} data.asteroids - Array of asteroid objects with properties like:
 *   - id: Unique identifier
 *   - name: Asteroid name
 *   - date: Close approach date (YYYY-MM-DD)
 *   - diameter_avg: Average diameter in km
 *   - velocity: Relative velocity in km/h
 *   - miss_distance: Miss distance from Earth in km
 *   - is_hazardous: Boolean indicating if asteroid is potentially hazardous
 * @param {Array<string>} data.dates - Array of unique dates in the dataset
 * @param {number} data.total_count - Total number of asteroids
 * @param {number} data.hazardous_count - Count of hazardous asteroids
 * @param {number} data.non_hazardous_count - Count of non-hazardous asteroids
 * 
 * @returns {Object} An object containing pre-processed data for each chart type:
 * 
 * **Time-based Charts:**
 * @returns {Array<Object>} area - Daily asteroid counts for area chart (cumulative visualization)
 * @returns {Array<Object>} line - Daily asteroid counts for line chart (trend over time)
 * @returns {Array<Object>} streamGraph - Daily asteroid counts for stream graph (flowing stacked areas)
 * @returns {Array<Object>} timeline - Raw asteroid array for temporal events (chronological points)
 * 
 * **Bar Charts:**
 * @returns {Array<Object>} bar - Top 10 asteroids by diameter (vertical bars)
 * @returns {Array<Object>} horizontalBar - Top 10 asteroids by velocity (horizontal bars)
 * 
 * **Grouped/Stacked Charts:**
 * @returns {Array<Object>} groupedBar - Daily counts with hazardous/non-hazardous breakdown (side-by-side bars)
 * @returns {Array<Object>} stackedBar - Daily counts for stacked visualization (cumulative bars)
 * 
 * **Part-to-Whole Charts:**
 * @returns {Object} pie - Asteroids grouped by size category (circular slices)
 * @returns {Object} donut - Asteroids grouped by size category (donut with center hole)
 * @returns {Object} treemap - Asteroids grouped by size category (nested rectangles)
 * @returns {Object} sunburst - Asteroids grouped by size category (radial hierarchy)
 * 
 * **Distribution Charts:**
 * @returns {Array<Object>} histogram - Raw asteroid array for velocity distribution (binned frequencies)
 * @returns {Array<Object>} boxPlot - Raw asteroid array for statistical summary (quartiles & outliers)
 * @returns {Array<Object>} violinPlot - Raw asteroid array for density visualization (mirrored distribution)
 * 
 * **Relationship Charts:**
 * @returns {Array<Object>} scatter - Raw asteroid array for size vs velocity (2D point plot)
 * @returns {Array<Object>} bubble - Raw asteroid array for 3-variable comparison (size, velocity, distance)
 * @returns {Array<Object>} heatmap - Raw asteroid array for 2D density grid (color-coded cells)
 * 
 * **Network/Hierarchy Charts:**
 * @returns {Object} forceDirected - Asteroids grouped by date for network simulation (physics-based layout)
 * @returns {Array<Object>} sankey - Daily counts for flow diagram (date → hazard status flows)
 * 
 * @example
 * // Get data for a specific chart type
 * const barData = getChartData(data).bar;
 * const scatterData = getChartData(data).scatter;
 * 
 * @example
 * // Use in a render function
 * function renderMyChart(containerId, data) {
 *     const chartSpecificData = getChartData(data).myChartType;
 *     // ... use chartSpecificData for visualization
 * }
 */
function getChartData(data) {
    return {
        // Time-based charts - use getDailyCounts()
        area: getDailyCounts(),
        line: getDailyCounts(),
        streamGraph: getDailyCounts(),
        
        // Bar charts - use getTopAsteroids()
        bar: getTopAsteroids('diameter_avg', 10),
        horizontalBar: getTopAsteroids('velocity', 10),
        
        // Grouped/Stacked bars - use getDailyCounts()
        groupedBar: getDailyCounts(),
        stackedBar: getDailyCounts(),
        
        // Part-to-whole - use getAsteroidsBySizeCategory()
        pie: getAsteroidsBySizeCategory(),
        donut: getAsteroidsBySizeCategory(),
        treemap: getAsteroidsBySizeCategory(),
        sunburst: getAsteroidsBySizeCategory(),
        
        // Distribution - use data.asteroids directly or getMetricStats()
        histogram: data.asteroids,  // uses data.asteroids directly
        boxPlot: data.asteroids,    // uses getMetricStats() inside the chart
        violinPlot: data.asteroids, // uses data.asteroids directly
        
        // Relationship - use data.asteroids directly (they access d.diameter_avg, d.velocity, etc.)
        scatter: data.asteroids,    // uses data.asteroids, accesses d.diameter_avg, d.velocity
        bubble: data.asteroids,     // uses data.asteroids, accesses d.diameter_avg, d.velocity, d.miss_distance
        heatmap: data.asteroids,    // uses data.asteroids directly
        
        // Network/Hierarchy
        forceDirected: getAsteroidsByDate(),
        sankey: getDailyCounts(),
        timeline: data.asteroids
    }
}