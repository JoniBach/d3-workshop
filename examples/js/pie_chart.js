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
    // ============================================================================
    // STEP 1: SETUP - Prepare the container and set chart dimensions
    // ============================================================================
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;
    
    // ============================================================================
    // STEP 2: CREATE SVG CANVAS - Build the drawing area
    // ============================================================================
    const svg = container
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);
    
    // ============================================================================
    // STEP 3: PREPARE DATA - Calculate hazardous vs non-hazardous counts
    // ============================================================================
    const chartData = getChartData(data).pie;
    const totalCount = Object.values(chartData).flat().length;
    const hazardousCount = Object.values(chartData).flat().filter(a => a.is_hazardous).length;
    const nonHazardousCount = totalCount - hazardousCount;
    
    const pieData = [
        { label: 'Hazardous', count: hazardousCount },
        { label: 'Non-Hazardous', count: nonHazardousCount }
    ];
    
    // ============================================================================
    // STEP 4: CREATE SCALES AND GENERATORS - Set up color scale and arc generators
    // ============================================================================
    // Color scale
    const color = d3.scaleOrdinal()
        .domain(['Hazardous', 'Non-Hazardous'])
        .range(['#e74c3c', '#2ecc71']);
    
    // Pie generator - computes angles
    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);
    
    // Arc generator - creates slice paths
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
    
    // Arc for labels (positioned inside slices)
    const labelArc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.6);
    
    // ============================================================================
    // STEP 5: DRAW PIE SLICES - Create the pie chart segments
    // ============================================================================
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
    
    // ============================================================================
    // STEP 6: ADD LABELS - Show percentages on slices
    // ============================================================================
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
    
    // ============================================================================
    // STEP 7: ADD LEGEND - Show category names and counts
    // ============================================================================
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
