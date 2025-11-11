/**
 * Histogram - Distribution of Velocities
 * Demonstrates: d3.bin(), binning continuous data
 */

// Chart metadata
window.HISTOGRAM_CONFIG = {
    title: 'Histogram',
    subtitle: 'Distribution of asteroid velocities',
    description: 'Shows frequency distribution by grouping continuous data into bins. Uses d3.bin() to automatically create intervals. Reveals patterns like normal distribution or skewness.',
    category: 'distribution'
};

function renderHistogram(containerId, data) {
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
    // STEP 3: PREPARE DATA - Extract velocities and create bins
    // ============================================================================
    const chartData = getChartData(data).histogram;
    const velocities = chartData.map(d => d.velocity);
    
    // ============================================================================
    // STEP 4: CREATE SCALES AND BINS - Set up scales and bin the data
    // ============================================================================
    // X scale for velocity values
    const x = d3.scaleLinear()
        .domain(d3.extent(velocities))
        .nice()
        .range([0, width]);
    
    // Create histogram bins
    const histogram = d3.bin()
        .domain(x.domain())
        .thresholds(x.ticks(20));
    
    const bins = histogram(velocities);
    
    // Y scale for frequency counts
    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
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
        .text('Velocity (km/h)');
    
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Frequency');
    
    // ============================================================================
    // STEP 7: DRAW BARS - Create histogram bars for each bin
    // ============================================================================
    svg.selectAll('.bar')
        .data(bins)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.x0) + 1)
        .attr('y', d => y(d.length))
        .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 2))
        .attr('height', d => height - y(d.length))
        .attr('fill', '#3498db')
        .attr('opacity', 0.8);
}
