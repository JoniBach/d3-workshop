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
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    const asteroids = chartData(data).scatter;
    
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleLinear()
        .domain([0, d3.max(asteroids, d => d.diameter_avg)])
        .nice()
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(asteroids, d => d.velocity)])
        .nice()
        .range([height, 0]);
    
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    svg.append('g')
        .call(d3.axisLeft(y));
    
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
    
    svg.selectAll('.dot')
        .data(asteroids)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.diameter_avg))
        .attr('cy', d => y(d.velocity))
        .attr('r', 4)
        .attr('fill', d => d.is_hazardous ? '#e74c3c' : '#3498db')
        .attr('opacity', 0.6);
}
