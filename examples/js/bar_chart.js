/**
 * Bar Chart - Top 10 Asteroids by Diameter
 * Demonstrates: Basic D3 scales, axes, and rectangles
 */

// Chart metadata
window.BAR_CHART_CONFIG = {
    title: 'Bar Chart',
    subtitle: 'Top 10 asteroids by estimated diameter',
    description: 'A fundamental chart type using rectangles to compare values. Height represents the asteroid diameter. Demonstrates D3 scales, axes, and basic SVG rectangles.',
    category: 'categorical'
};

function renderBarChart(containerId, data) {
    // ============================================================================
    // STEP 1: SETUP - Prepare the container and set chart dimensions
    // ============================================================================
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 100, left: 60 };
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
    // STEP 3: PREPARE DATA - Get top asteroids by diameter
    // ============================================================================
    const chartData = getChartData(data).bar;
    
    // ============================================================================
    // STEP 4: CREATE SCALES - Map data values to pixel positions
    // ============================================================================
    // X scale: Maps asteroid names to horizontal positions
    const xScale = d3.scaleBand()
        .domain(chartData.map(d => d.name))
        .range([0, width])
        .padding(0.2);
    
    // Y scale: Maps diameter to vertical positions
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.diameter_avg)])
        .nice()
        .range([height, 0]);
    
    // Color scale: Maps hazard status to colors
    const colorScale = d3.scaleOrdinal()
        .domain([true, false])
        .range(['#e74c3c', '#3498db'])
    
    // ============================================================================
    // STEP 5: DRAW AXES - Add X and Y axes to the chart
    // ============================================================================
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .style('font-size', '10px');
    
    svg.append('g')
        .call(d3.axisLeft(yScale));
    
    // ============================================================================
    // STEP 6: ADD LABELS - Label the Y axis
    // ============================================================================
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Average Diameter (km)');
    
    // ============================================================================
    // STEP 7: CREATE TOOLTIP - For interactive hover information
    // ============================================================================
    // Create tooltip
    const tooltip = container
        .append('div')
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('opacity', 0);
    
    // ============================================================================
    // STEP 8: DRAW BARS - Create the bar rectangles with interactivity
    // ============================================================================
    svg.selectAll('.bar')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.name))
        .attr('y', d => yScale(d.diameter_avg))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.diameter_avg))
        .attr('fill', d => colorScale(d.is_hazardous))
        .attr('opacity', 0.8)
        .on('mouseover', function(event, d) {
            // Highlight bar
            d3.select(this)
                .attr('opacity', 1)
                .attr('stroke', '#000')
                .attr('stroke-width', 2);
            
            // Show tooltip
            tooltip
                .style('opacity', 1)
                .html(`
                    <strong>${d.name}</strong><br/>
                    Diameter: ${d.diameter_avg.toFixed(3)} km<br/>
                    Velocity: ${d.velocity.toFixed(0)} km/h<br/>
                    Status: ${d.is_hazardous ? '⚠️ Hazardous' : '✅ Safe'}<br/>
                    Date: ${d.date}
                `);
        })
        .on('mousemove', function(event) {
            tooltip
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
            // Reset bar
            d3.select(this)
                .attr('opacity', 0.8)
                .attr('stroke', 'none');
            
            // Hide tooltip
            tooltip.style('opacity', 0);
        });
    
    // Add legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 120}, 0)`);
    
    const legendData = [
        { label: 'Hazardous', color: '#e74c3c' },
        { label: 'Non-Hazardous', color: '#3498db' }
    ];
    
    legendData.forEach((item, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 20})`);
        
        legendRow.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', item.color)
            .attr('opacity', 0.8);
        
        legendRow.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .style('font-size', '12px')
            .text(item.label);
    });
}
