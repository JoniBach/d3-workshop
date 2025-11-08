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
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleLinear()
        .domain([0, d3.max(data.asteroids, d => d.diameter_avg)])
        .nice()
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data.asteroids, d => d.velocity)])
        .nice()
        .range([height, 0]);
    
    const radius = d3.scaleSqrt()
        .domain([0, d3.max(data.asteroids, d => d.miss_distance)])
        .range([2, 20]);
    
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
    
    svg.selectAll('.bubble')
        .data(data.asteroids)
        .enter()
        .append('circle')
        .attr('class', 'bubble')
        .attr('cx', d => x(d.diameter_avg))
        .attr('cy', d => y(d.velocity))
        .attr('r', d => radius(d.miss_distance))
        .attr('fill', d => d.is_hazardous ? '#e74c3c' : '#3498db')
        .attr('opacity', 0.4)
        .attr('stroke', d => d.is_hazardous ? '#c0392b' : '#2980b9')
        .attr('stroke-width', 1);
}
