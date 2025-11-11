/**
 * Donut Chart - Similar to Pie but with inner radius
 * Demonstrates: Arc with innerRadius, center labels
 */

// Chart metadata
window.DONUT_CHART_CONFIG = {
    title: 'Donut Chart',
    subtitle: 'Hazardous asteroid distribution with center label',
    description: 'Variation of pie chart with hollow center. The innerRadius creates the "donut hole" which can display summary statistics or labels.',
    category: 'categorical'
};

function renderDonutChart(containerId, data) {
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
    const chartData = getChartData(data).donut;
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
    const color = d3.scaleOrdinal()
        .domain(['Hazardous', 'Non-Hazardous'])
        .range(['#e74c3c', '#2ecc71']);
    
    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);
    
    // Donut arc - innerRadius creates the hole in the center
    const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius);
    
    // ============================================================================
    // STEP 5: DRAW DONUT SLICES - Create the donut chart segments
    // ============================================================================
    svg.selectAll('.slice')
        .data(pie(pieData))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.label))
        .attr('opacity', 0.8)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);
    
    // ============================================================================
    // STEP 6: ADD CENTER TEXT - Display total count in the donut hole
    // ============================================================================
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.5em')
        .style('font-size', '32px')
        .style('font-weight', 'bold')
        .text(totalCount);
    
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.5em')
        .style('font-size', '14px')
        .style('fill', '#666')
        .text('Total Asteroids');
    
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
