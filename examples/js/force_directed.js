/**
 * Force-Directed Graph - Cluster Asteroids by Similar Properties
 * Demonstrates: d3.forceSimulation(), force layouts
 */

// Chart metadata
window.FORCE_DIRECTED_CONFIG = {
    title: 'Force-Directed Graph',
    subtitle: 'Cluster asteroids by similar properties',
    description: 'Physics-based network layout using d3.forceSimulation(). Nodes repel each other while links pull connected nodes together. Reveals natural clustering patterns.',
    category: 'network'
};

function renderForceDirected(containerId, data) {
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const width = 800;
    const height = 600;
    
    // Get asteroids by date for force-directed graph (subset for performance)
    const chartData = getChartData(data).forceDirected;
    const asteroids = Object.values(chartData).flat().slice(0, 50);
    
    const svg = container
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Create nodes
    const nodes = asteroids.map(a => ({
        id: a.id,
        name: a.name,
        hazardous: a.is_hazardous,
        diameter: a.diameter_avg,
        velocity: a.velocity
    }));
    
    // Create links based on similar velocities
    const links = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const velDiff = Math.abs(nodes[i].velocity - nodes[j].velocity);
            if (velDiff < 10000) {  // Similar velocities
                links.push({
                    source: nodes[i].id,
                    target: nodes[j].id
                });
            }
        }
    }
    
    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(50))
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(10));
    
    // Draw links
    const link = svg.selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.3)
        .attr('stroke-width', 1);
    
    // Draw nodes
    const node = svg.selectAll('.node')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', d => 3 + d.diameter * 10)
        .attr('fill', d => d.hazardous ? '#e74c3c' : '#3498db')
        .attr('opacity', 0.7)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);
    
    // Update positions on each tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    });
}
