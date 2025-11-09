/**
 * Heatmap - Asteroid Density by Size and Velocity
 * Demonstrates: 2D binning, color scales
 */

// Chart metadata
window.HEATMAP_CONFIG = {
    title: 'Heatmap',
    subtitle: 'Asteroid density by size and velocity ranges',
    description: 'Uses color intensity to show density in a 2D grid. Darker colors indicate more asteroids in that size/velocity combination. Good for spotting concentration patterns.',
    category: 'relationship'
};

function renderHeatmap(containerId, data) {
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 100, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    const asteroids = chartData(data).heatmap;
    
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create bins
    const sizeBins = 10;
    const velocityBins = 10;
    
    const sizeExtent = d3.extent(asteroids, d => d.diameter_avg);
    const velocityExtent = d3.extent(asteroids, d => d.velocity);
    
    const sizeScale = d3.scaleLinear()
        .domain(sizeExtent)
        .range([0, sizeBins]);
    
    const velocityScale = d3.scaleLinear()
        .domain(velocityExtent)
        .range([0, velocityBins]);
    
    // Create 2D grid
    const grid = Array(velocityBins).fill().map(() => Array(sizeBins).fill(0));
    
    asteroids.forEach(d => {
        const sizeIdx = Math.min(Math.floor(sizeScale(d.diameter_avg)), sizeBins - 1);
        const velIdx = Math.min(Math.floor(velocityScale(d.velocity)), velocityBins - 1);
        grid[velIdx][sizeIdx]++;
    });
    
    const maxCount = d3.max(grid.flat());
    
    const x = d3.scaleBand()
        .domain(d3.range(sizeBins))
        .range([0, width])
        .padding(0.05);
    
    const y = d3.scaleBand()
        .domain(d3.range(velocityBins))
        .range([0, height])
        .padding(0.05);
    
    const color = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, maxCount]);
    
    // Draw cells
    for (let i = 0; i < velocityBins; i++) {
        for (let j = 0; j < sizeBins; j++) {
            svg.append('rect')
                .attr('x', x(j))
                .attr('y', y(i))
                .attr('width', x.bandwidth())
                .attr('height', y.bandwidth())
                .attr('fill', color(grid[i][j]))
                .attr('stroke', '#fff')
                .attr('stroke-width', 1);
        }
    }
    
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Size Category');
    
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Velocity Category');
}
