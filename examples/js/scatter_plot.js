/**
 * Scatter Plot - Size vs Velocity
 * Demonstrates: Circle positioning, two continuous variables
 */

// Chart metadata
window.SCATTER_PLOT_CONFIG = {
    title: 'Scatter Plot',
    subtitle: 'Asteroid size vs velocity relationship',
    description: 'Shows correlation between two continuous variables. Each point represents one asteroid. Reveals patterns, clusters, and outliers in the relationship.',
    category: 'relationship'
};

function renderScatterPlot(containerId, data) {
    // ============================================================================
    // STEP 1: SETUP - Prepare the container and set chart dimensions
    // ============================================================================
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
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
    // STEP 3: PREPARE DATA - Get the data for scatter plot
    // ============================================================================
    const chartData = getChartData(data).scatter;
    
    // ============================================================================
    // STEP 4: CREATE SCALES - Map data values to pixel positions
    // ============================================================================
    // X scale: Maps diameter to horizontal position
    const x = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.diameter_avg)])
        .nice()
        .range([0, width]);
    
    // Y scale: Maps velocity to vertical position
    const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.velocity)])
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
        .text('Diameter (km)');
    
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Velocity (km/h)');
    
    // ============================================================================
    // STEP 7: DRAW DATA POINTS - Add circles for each asteroid
    // ============================================================================
    svg.selectAll('.dot')
        .data(chartData)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.diameter_avg))
        .attr('cy', d => y(d.velocity))
        .attr('r', 4)
        .attr('fill', d => d.is_hazardous ? '#e74c3c' : '#3498db')
        .attr('opacity', 0.6);
}
