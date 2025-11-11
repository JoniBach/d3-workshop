/**
 * Line Chart - Daily Asteroid Count
 * Demonstrates: d3.line(), time series, d3.scaleTime()
 */

// Chart metadata
window.LINE_CHART_CONFIG = {
    title: 'Line Chart',
    subtitle: 'Daily asteroid count over time',
    description: 'Shows trends over time by connecting data points. Uses d3.line() path generator and d3.scaleTime() for date handling. Essential for time series data.',
    category: 'time'
};

function renderLineChart(containerId, data) {
    // ============================================================================
    // STEP 1: SETUP - Prepare the container and set chart dimensions
    // ============================================================================
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // ============================================================================
    // STEP 2: CREATE SVG CANVAS - Build the drawing area
    // ============================================================================
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // ============================================================================
    // STEP 3: PREPARE DATA - Get and parse the data
    // ============================================================================
    // Get daily counts from data provider
    const chartData = getChartData(data).line;
    
    // Parse date strings into Date objects for d3.scaleTime()
    const parseDate = d3.timeParse('%Y-%m-%d');
    chartData.forEach(d => d.parsedDate = parseDate(d.date));
    
    // ============================================================================
    // STEP 4: CREATE SCALES - Map data values to pixel positions
    // ============================================================================
    // X scale: Time scale for dates
    const x = d3.scaleTime()
        .domain(d3.extent(chartData, d => d.parsedDate))
        .range([0, width]);
    
    // Y scale: Linear scale for counts
    const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.total)])
        .nice()
        .range([height, 0]);
    
    // ============================================================================
    // STEP 5: DRAW AXES - Add X and Y axes to the chart
    // ============================================================================
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    svg.append('g')
        .call(d3.axisLeft(y));
    
    // ============================================================================
    // STEP 6: ADD LABELS - Label the axes
    // ============================================================================
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Date');
    
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Count');
    
    // ============================================================================
    // STEP 7: DRAW THE LINE and DATA POINTS
    // ============================================================================
    // Create line generator
    const line = d3.line()
        .x(d => x(d.parsedDate))
        .y(d => y(d.total));
    
    // Draw the line path
    svg.append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', '#3498db')
        .attr('stroke-width', 2)
        .attr('d', line);
    
    // Add circles at each data point
    svg.selectAll('.dot')
        .data(chartData)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.parsedDate))
        .attr('cy', d => y(d.total))
        .attr('r', 4)
        .attr('fill', '#3498db');
}
