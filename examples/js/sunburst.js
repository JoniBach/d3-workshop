/**
 * Sunburst Chart - Radial Hierarchical Visualization
 * Demonstrates: d3.partition(), arc for hierarchy
 */

// Chart metadata
window.SUNBURST_CONFIG = {
    title: 'Sunburst Chart',
    subtitle: 'Radial hierarchical visualization',
    description: 'Circular version of treemap showing hierarchy as nested rings. Uses d3.partition() and arc generators. Inner rings are parents, outer rings are children.',
    category: 'hierarchy'
};

function renderSunburst(containerId, data) {
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2;
    
    // Get size categories for sunburst
    const chartDataset = chartData(data).sunburst;
    
    // Create hierarchical data
    const hierarchyData = {
        name: 'asteroids',
        children: Object.entries(chartDataset).map(([category, asteroids]) => ({
            name: category,
            children: asteroids.map(a => ({
                name: a.name,
                value: a.diameter_avg,
                hazardous: a.is_hazardous
            }))
        }))
    };
    
    const svg = container
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);
    
    const root = d3.hierarchy(hierarchyData)
        .sum(d => d.value);
    
    d3.partition()
        .size([2 * Math.PI, radius])
        (root);
    
    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1);
    
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
    svg.selectAll('path')
        .data(root.descendants())
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => {
            if (d.depth === 0) return '#ccc';
            if (d.depth === 1) return color(d.data.name);
            return d.data.hazardous ? '#e74c3c' : '#3498db';
        })
        .attr('opacity', 0.7)
        .attr('stroke', 'white')
        .attr('stroke-width', 1);
}
