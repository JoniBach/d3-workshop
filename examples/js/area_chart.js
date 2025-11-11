/**
 * Area Chart - Cumulative Asteroids Over Time
 * Demonstrates: d3.area(), cumulative data
 */

// Chart metadata
window.AREA_CHART_CONFIG = {
    title: 'Area Chart',
    subtitle: 'Cumulative asteroids over the date range',
    description: 'Filled version of line chart emphasizing volume. Uses d3.area() to create filled regions. Great for showing cumulative totals or magnitude over time.',
    category: 'time'
};

function renderAreaChart(containerId, data) {
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
    // STEP 3: PREPARE DATA - Get and transform data for cumulative area
    // ============================================================================
    const chartData = getChartData(data).area;
    const parseDate = d3.timeParse('%Y-%m-%d');
    
    // Calculate cumulative counts
    let cumulative = 0;
    const cumulativeData = chartData.map(d => {
        cumulative += d.total;
        return {
            date: parseDate(d.date),
            cumulative: cumulative
        };
    });
    
    // ============================================================================
    // STEP 4: CREATE SCALES - Map data values to pixel positions
    // ============================================================================
    const x = d3.scaleTime()
        .domain(d3.extent(cumulativeData, d => d.date))
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(cumulativeData, d => d.cumulative)])
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
        .text('Cumulative Count');
    
    // ============================================================================
    // STEP 7: DRAW AREA AND LINE - Create filled area and border line
    // ============================================================================
    // Create area generator
    const area = d3.area()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y(d.cumulative));
    
    // Draw filled area
    svg.append('path')
        .datum(cumulativeData)
        .attr('fill', '#3498db')
        .attr('opacity', 0.6)
        .attr('d', area);
    
    // Create line generator for border
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.cumulative));
    
    // Draw border line
    svg.append('path')
        .datum(cumulativeData)
        .attr('fill', 'none')
        .attr('stroke', '#2980b9')
        .attr('stroke-width', 2)
        .attr('d', line);
}
