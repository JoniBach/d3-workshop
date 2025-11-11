/**
 * Bubble Chart - Size, Velocity, and Miss Distance
 * Demonstrates: Three variables (x, y, radius)
 */

// Chart metadata
window.BUBBLE_CHART_CONFIG = {
    title: 'Bubble Chart',
    subtitle: 'Size, velocity, and miss distance (3 variables)',
    description: 'Extension of scatter plot with a third dimension. Circle size represents miss distance. Uses d3.scaleSqrt() for proportional area scaling.',
    category: 'relationship'
};

function renderBubbleChart(containerId, data) {
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
    // STEP 3: PREPARE DATA - Get asteroid data for bubble chart
    // ============================================================================
    const chartData = getChartData(data).bubble;
    
    // ============================================================================
    // STEP 4: CREATE SCALES - Map three variables to visual properties
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
    
    // Radius scale: Maps miss distance to bubble size (using sqrt for area)
    const radius = d3.scaleSqrt()
        .domain([0, d3.max(chartData, d => d.miss_distance)])
        .range([2, 20]);
    
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
    // STEP 7: DRAW BUBBLES - Create circles with varying sizes
    // ============================================================================
    svg.selectAll('.bubble')
        .data(chartData)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.diameter_avg))
        .attr('cy', d => y(d.velocity))
        .attr('r', d => radius(d.miss_distance))
        .attr('fill', d => d.is_hazardous ? '#e74c3c' : '#3498db')
        .attr('opacity', 0.4)
        .attr('stroke', d => d.is_hazardous ? '#c0392b' : '#2980b9')
        .attr('stroke-width', 1);
}
