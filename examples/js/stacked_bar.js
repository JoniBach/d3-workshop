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
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // Get daily counts for stacked bar chart
    const chartData = getChartData(data).stackedBar;
    
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Stack the data
    const stack = d3.stack()
        .keys(['non_hazardous', 'hazardous']);
    
    const stackedData = stack(chartData);
    
    // Scales
    const x = d3.scaleBand()
        .domain(chartData.map(d => d.date))
        .range([0, width])
        .padding(0.2);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.total)])
        .nice()
        .range([height, 0]);
    
    const color = d3.scaleOrdinal()
        .domain(['non_hazardous', 'hazardous'])
        .range(['#2ecc71', '#e74c3c']);
    
    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .style('font-size', '10px');
    
    svg.append('g')
        .call(d3.axisLeft(y));
    
    // Y axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Count');
    
    // Draw stacked bars
    svg.selectAll('.layer')
        .data(stackedData)
        .enter()
        .append('g')
        .attr('class', 'layer')
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
    
    // Legend
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
