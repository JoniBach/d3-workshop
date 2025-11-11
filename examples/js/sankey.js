/**
 * Sankey Diagram - Flow from Dates to Size Categories to Hazard Status
 * Demonstrates: d3.sankey(), flow visualization
 */

// Chart metadata
window.SANKEY_CONFIG = {
    title: 'Sankey Diagram',
    subtitle: 'Flow from dates to size categories to hazard status',
    description: 'Shows flow between categories with width representing quantity. Curved paths connect source nodes to target nodes. Excellent for visualizing multi-stage processes.',
    category: 'network'
};

function renderSankey(containerId, data) {
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const width = 800;
    const height = 500;
    
    // Simplified Sankey without d3-sankey plugin
    // We'll create a simple flow visualization
    
    const svg = container
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Get daily counts for sankey diagram
    const chartData = getChartData(data).sankey;
    
    // Group by size category from daily counts
    const sizeCategories = {
        small: [],
        medium: [],
        large: [],
        very_large: []
    };
    
    // We'll use a simplified approach - just use the daily counts
    // Create flows from dates to hazard status
    const flows = [];
    chartData.slice(0, 4).forEach((day, i) => {
        const hazCount = day.hazardous;
        const safeCount = day.non_hazardous;
        
        if (hazCount > 0) {
            flows.push({
                source: day.date,
                target: 'hazardous',
                value: hazCount,
                sourceY: i * 100 + 50,
                targetY: 100
            });
        }
        
        if (safeCount > 0) {
            flows.push({
                source: day.date,
                target: 'safe',
                value: safeCount,
                sourceY: i * 100 + 50,
                targetY: 300
            });
        }
    });
    
    const maxValue = d3.max(flows, d => d.value);
    const heightScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, 80]);
    
    // Draw flows
    flows.forEach(flow => {
        const path = d3.path();
        const h = heightScale(flow.value);
        
        path.moveTo(200, flow.sourceY - h/2);
        path.bezierCurveTo(
            400, flow.sourceY - h/2,
            400, flow.targetY - h/2,
            600, flow.targetY - h/2
        );
        path.lineTo(600, flow.targetY + h/2);
        path.bezierCurveTo(
            400, flow.targetY + h/2,
            400, flow.sourceY + h/2,
            200, flow.sourceY + h/2
        );
        path.closePath();
        
        svg.append('path')
            .attr('d', path.toString())
            .attr('fill', flow.target === 'hazardous' ? '#e74c3c' : '#2ecc71')
            .attr('opacity', 0.4);
    });
    
    // Draw source nodes
    chartData.slice(0, 4).forEach((day, i) => {
        svg.append('rect')
            .attr('x', 150)
            .attr('y', i * 100 + 30)
            .attr('width', 50)
            .attr('height', 40)
            .attr('fill', '#3498db')
            .attr('opacity', 0.8);
        
        svg.append('text')
            .attr('x', 175)
            .attr('y', i * 100 + 55)
            .attr('text-anchor', 'middle')
            .style('font-size', '8px')
            .style('fill', 'white')
            .text(day.date.substring(5));
    });
    
    // Draw target nodes
    ['hazardous', 'safe'].forEach((status, i) => {
        svg.append('rect')
            .attr('x', 600)
            .attr('y', i * 200 + 80)
            .attr('width', 80)
            .attr('height', 40)
            .attr('fill', status === 'hazardous' ? '#e74c3c' : '#2ecc71')
            .attr('opacity', 0.8);
        
        svg.append('text')
            .attr('x', 640)
            .attr('y', i * 200 + 105)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', 'white')
            .text(status);
    });
}
