/**
 * Pie Chart - Hazardous vs Non-Hazardous Percentage
 * Demonstrates: d3.pie(), d3.arc(), arc generators
 */

// Chart metadata
window.PIE_CHART_CONFIG = {
    title: 'Pie Chart',
    subtitle: 'Percentage of hazardous vs non-hazardous asteroids',
    description: 'Classic circular chart showing proportions. Uses d3.pie() to compute angles and d3.arc() to draw slices. Good for showing simple part-to-whole relationships.',
    category: 'categorical'
};

function renderPieChart(containerId, data) {
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;
    
    // Get size categories for pie chart
    const chartDataset = chartData(data).pie;
    const totalCount = Object.values(chartDataset).flat().length;
    const hazardousCount = Object.values(chartDataset).flat().filter(a => a.is_hazardous).length;
    const nonHazardousCount = totalCount - hazardousCount;
    
    const pieData = [
        { label: 'Hazardous', count: hazardousCount },
        { label: 'Non-Hazardous', count: nonHazardousCount }
    ];
    
    const svg = container
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);
    
    // Color scale
    const color = d3.scaleOrdinal()
        .domain(['Hazardous', 'Non-Hazardous'])
        .range(['#e74c3c', '#2ecc71']);
    
    // Pie generator
    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);
    
    // Arc generator
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
    
    // Arc for labels (slightly outside)
    const labelArc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.6);
    
    // Draw slices
    const slices = svg.selectAll('.slice')
        .data(pie(pieData))
        .enter()
        .append('g')
        .attr('class', 'slice');
    
    slices.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.label))
        .attr('opacity', 0.8)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);
    
    // Add labels
    slices.append('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', 'white')
        .text(d => {
            const percent = ((d.data.count / totalCount) * 100).toFixed(1);
            return `${percent}%`;
        });
    
    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(${radius + 20}, -${radius})`);
    
    pieData.forEach((item, i) => {
        const row = legend.append('g')
            .attr('transform', `translate(0, ${i * 25})`);
        
        row.append('rect')
            .attr('width', 18)
            .attr('height', 18)
            .attr('fill', color(item.label))
            .attr('opacity', 0.8);
        
        row.append('text')
            .attr('x', 24)
            .attr('y', 14)
            .style('font-size', '12px')
            .text(`${item.label}: ${item.count}`);
    });
}
