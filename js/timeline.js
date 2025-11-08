/**
 * Timeline - Individual Asteroid Closest Approach Dates
 * Demonstrates: Timeline visualization with dots
 */

// Chart metadata
window.TIMELINE_CONFIG = {
    title: 'Timeline',
    subtitle: 'Individual asteroid closest approach dates',
    description: 'Linear representation of events over time. Each asteroid appears as a point on the timeline. Useful for showing when specific events occur.',
    category: 'time'
};

function renderTimeline(containerId, data) {
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const topAsteroids = getTopAsteroids('diameter_avg', 15);
    
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const parseDate = d3.timeParse('%Y-%m-%d');
    topAsteroids.forEach(d => d.parsedDate = parseDate(d.date));
    
    const x = d3.scaleTime()
        .domain(d3.extent(topAsteroids, d => d.parsedDate))
        .range([0, width]);
    
    // Draw timeline axis
    svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', height / 2)
        .attr('y2', height / 2)
        .attr('stroke', '#333')
        .attr('stroke-width', 2);
    
    svg.append('g')
        .attr('transform', `translate(0,${height / 2})`)
        .call(d3.axisBottom(x));
    
    // Draw asteroid events
    topAsteroids.forEach((d, i) => {
        const xPos = x(d.parsedDate);
        const yOffset = (i % 2 === 0 ? -1 : 1) * 30;
        
        // Line from timeline to dot
        svg.append('line')
            .attr('x1', xPos)
            .attr('x2', xPos)
            .attr('y1', height / 2)
            .attr('y2', height / 2 + yOffset)
            .attr('stroke', d.is_hazardous ? '#e74c3c' : '#3498db')
            .attr('stroke-width', 1);
        
        // Dot
        svg.append('circle')
            .attr('cx', xPos)
            .attr('cy', height / 2 + yOffset)
            .attr('r', 5)
            .attr('fill', d.is_hazardous ? '#e74c3c' : '#3498db')
            .attr('opacity', 0.8);
    });
}
