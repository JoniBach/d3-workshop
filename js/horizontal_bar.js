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
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 60, left: 200 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    const topAsteroids = getTopAsteroids('velocity', 10);
    
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales - note X is now the value, Y is the category
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(topAsteroids, d => d.velocity)])
        .nice()
        .range([0, width]);
    
    const yScale = d3.scaleBand()
        .domain(topAsteroids.map(d => d.name))
        .range([0, height])
        .padding(0.2);
    
    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));
    
    svg.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll('text')
        .style('font-size', '10px');
    
    // X axis label
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Velocity (km/h)');
    
    // Bars
    svg.selectAll('.bar')
        .data(topAsteroids)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', d => yScale(d.name))
        .attr('width', d => xScale(d.velocity))
        .attr('height', yScale.bandwidth())
        .attr('fill', d => d.is_hazardous ? '#e74c3c' : '#3498db')
        .attr('opacity', 0.8);
}
