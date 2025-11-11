/**
 * Stacked Bar Chart - Daily Hazardous vs Non-Hazardous Count
 * Demonstrates: Stacked bars, d3.stack()
 */

// Chart metadata
window.STACKED_BAR_CONFIG = {
    title: 'Stacked Bar Chart',
    subtitle: 'Daily count of hazardous and non-hazardous asteroids',
    description: 'Shows part-to-whole relationships by stacking values. Uses d3.stack() to compute cumulative positions. Each bar shows total with color-coded segments.',
    category: 'categorical'
};

function renderStackedBar(containerId, data) {
    // ============================================================================
    // STEP 1: SETUP - Prepare the container and set chart dimensions
    // ============================================================================
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // ============================================================================
    // STEP 2: CREATE SVG CANVAS - Build the drawing area
    // ============================================================================
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // ============================================================================
    // STEP 3: PREPARE DATA - Get daily counts and stack them
    // ============================================================================
    const chartData = getChartData(data).stackedBar;
    
    // Stack the data using d3.stack()
    const stack = d3.stack()
        .keys(['non_hazardous', 'hazardous']);
    
    const stackedData = stack(chartData);
    
    // ============================================================================
    // STEP 4: CREATE SCALES - Map data values to pixel positions
    // ============================================================================
    // X scale: Maps dates to horizontal positions
    const x = d3.scaleBand()
        .domain(chartData.map(d => d.date))
        .range([0, width])
        .padding(0.2);
    
    // Y scale: Maps stacked counts to vertical positions
    const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.total)])
        .nice()
        .range([height, 0]);
    
    // Color scale: Maps hazard status to colors
    const color = d3.scaleOrdinal()
        .domain(['non_hazardous', 'hazardous'])
        .range(['#2ecc71', '#e74c3c']);
    
    // ============================================================================
    // STEP 5: DRAW AXES - Add X and Y axes to the chart
    // ============================================================================
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .style('font-size', '10px');
    
    svg.append('g')
        .call(d3.axisLeft(y));
    
    // ============================================================================
    // STEP 6: ADD LABELS - Label the Y axis
    // ============================================================================
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Count');
    
    // ============================================================================
    // STEP 7: DRAW STACKED BARS - Create stacked bar segments
    // ============================================================================
    svg.selectAll('.layer')
        .data(stackedData)
        .enter()
        .append('g')
        .attr('fill', d => color(d.key))
        .attr('opacity', 0.8)
        .selectAll('rect')
        .data(d => d)
        .enter()
        .append('rect')
        .attr('x', d => x(d.data.date))
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth());
    
    // ============================================================================
    // STEP 8: ADD LEGEND - Show hazardous vs non-hazardous categories
    // ============================================================================
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 140}, 0)`);
    
    ['non_hazardous', 'hazardous'].forEach((key, i) => {
        const row = legend.append('g')
            .attr('transform', `translate(0, ${i * 20})`);
        
        row.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', color(key))
            .attr('opacity', 0.8);
        
        row.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .style('font-size', '12px')
            .text(key === 'hazardous' ? 'Hazardous' : 'Non-Hazardous');
    });
}
