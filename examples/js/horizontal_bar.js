/**
 * Horizontal Bar Chart - Asteroids by Velocity
 * Demonstrates: Horizontal orientation, different axis arrangement
 */

// Chart metadata
window.HORIZONTAL_BAR_CONFIG = {
    title: 'Horizontal Bar Chart',
    subtitle: 'Asteroids sorted by relative velocity',
    description: 'Same as bar chart but rotated 90 degrees. Better for displaying long labels and comparing many items. Shows how to swap X and Y scales.',
    category: 'categorical'
};

function renderHorizontalBar(containerId, data) {
    // ============================================================================
    // STEP 1: SETUP - Prepare the container and set chart dimensions
    // ============================================================================
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 60, left: 200 };
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
    // STEP 3: PREPARE DATA - Get top asteroids by velocity
    // ============================================================================
    const chartData = getChartData(data).horizontalBar;
    
    // ============================================================================
    // STEP 4: CREATE SCALES - Map data values to pixel positions
    // ============================================================================
    // X scale: Maps velocity to horizontal position (the value)
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.velocity)])
        .nice()
        .range([0, width]);
    
    // Y scale: Maps asteroid names to vertical positions (the category)
    const yScale = d3.scaleBand()
        .domain(chartData.map(d => d.name))
        .range([0, height])
        .padding(0.2);
    
    // ============================================================================
    // STEP 5: DRAW AXES - Add X and Y axes to the chart
    // ============================================================================
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));
    
    svg.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll('text')
        .style('font-size', '10px');
    
    // ============================================================================
    // STEP 6: ADD LABELS - Label the X axis
    // ============================================================================
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Velocity (km/h)');
    
    // ============================================================================
    // STEP 7: DRAW BARS - Create horizontal bars
    // ============================================================================
    svg.selectAll('.bar')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', d => yScale(d.name))
        .attr('width', d => xScale(d.velocity))
        .attr('height', yScale.bandwidth())
        .attr('fill', d => d.is_hazardous ? '#e74c3c' : '#3498db')
        .attr('opacity', 0.8);
}
