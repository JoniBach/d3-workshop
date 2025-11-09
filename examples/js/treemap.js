/**
 * Treemap - Hierarchical View by Date and Size
 * Demonstrates: d3.treemap(), hierarchical layouts
 */

// Chart metadata
window.TREEMAP_CONFIG = {
    title: 'Treemap',
    subtitle: 'Hierarchical view by date and size category',
    description: 'Space-filling visualization of hierarchical data. Rectangle size represents asteroid diameter. Uses d3.treemap() layout to efficiently pack nested rectangles.',
    category: 'hierarchy'
};

function renderTreemap(containerId, data) {
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const width = 800;
    const height = 500;
    
    const sizeCategories = chartData(data).treemap;
    
    // Create hierarchical data
    const hierarchyData = {
        name: 'asteroids',
        children: Object.entries(sizeCategories).map(([category, asteroids]) => ({
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
        .attr('height', height);
    
    const root = d3.hierarchy(hierarchyData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    
    d3.treemap()
        .size([width, height])
        .padding(2)
        (root);
    
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
    const cell = svg.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);
    
    cell.append('rect')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => d.data.hazardous ? '#e74c3c' : '#3498db')
        .attr('opacity', 0.6)
        .attr('stroke', 'white')
        .attr('stroke-width', 1);
    
    cell.append('text')
        .attr('x', 3)
        .attr('y', 12)
        .style('font-size', '8px')
        .style('fill', 'white')
        .text(d => {
            const width = d.x1 - d.x0;
            return width > 50 ? d.data.name.substring(0, 10) : '';
        });
}
