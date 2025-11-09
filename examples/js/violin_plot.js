/**
 * Violin Plot - Velocity Distribution Density
 * Demonstrates: Density estimation, mirrored area chart
 */

// Chart metadata
window.VIOLIN_PLOT_CONFIG = {
    title: 'Violin Plot',
    subtitle: 'Velocity distribution density visualization',
    description: 'Combines box plot with density estimation. Width at each point shows the probability density. Mirrored shape reveals distribution shape better than histograms.',
    category: 'distribution'
};

function renderViolinPlot(containerId, data) {
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    const asteroids = chartData(data).violinPlot;
    const velocities = asteroids.map(d => d.velocity).sort((a, b) => a - b);
    
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const y = d3.scaleLinear()
        .domain(d3.extent(velocities))
        .nice()
        .range([height, 0]);
    
    const histogram = d3.bin()
        .domain(y.domain())
        .thresholds(20);
    
    const bins = histogram(velocities);
    
    const maxDensity = d3.max(bins, d => d.length);
    const x = d3.scaleLinear()
        .domain([0, maxDensity])
        .range([0, width / 2]);
    
    const center = width / 2;
    
    svg.append('g')
        .call(d3.axisLeft(y));
    
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Velocity (km/h)');
    
    // Create area generator for right side
    const areaRight = d3.area()
        .y(d => y((d.x0 + d.x1) / 2))
        .x0(center)
        .x1(d => center + x(d.length));
    
    // Create area generator for left side (mirrored)
    const areaLeft = d3.area()
        .y(d => y((d.x0 + d.x1) / 2))
        .x0(d => center - x(d.length))
        .x1(center);
    
    // Draw violin (both sides)
    svg.append('path')
        .datum(bins)
        .attr('d', areaRight)
        .attr('fill', '#3498db')
        .attr('opacity', 0.6);
    
    svg.append('path')
        .datum(bins)
        .attr('d', areaLeft)
        .attr('fill', '#3498db')
        .attr('opacity', 0.6);
}
