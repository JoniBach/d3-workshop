/**
 * Line Chart - Daily Asteroid Count
 * Demonstrates: d3.line(), time series
 */

// Chart metadata
window.LINE_CHART_CONFIG = {
    title: 'Line Chart',
    subtitle: 'Daily asteroid count over time',
    description: 'Shows trends over time by connecting data points. Uses d3.line() path generator and d3.scaleTime() for date handling. Essential for time series data.',
    category: 'time'
};

function renderLineChart(containerId, data) {
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // Get daily counts for line chart
    const chartDataset = chartData(data).line;
    
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const parseDate = d3.timeParse('%Y-%m-%d');
    chartDataset.forEach(d => d.parsedDate = parseDate(d.date));
    
    const x = d3.scaleTime()
        .domain(d3.extent(chartDataset, d => d.parsedDate))
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(chartDataset, d => d.total)])
        .nice()
        .range([height, 0]);
    
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    svg.append('g')
        .call(d3.axisLeft(y));
    
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Date');
    
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Count');
    
    const line = d3.line()
        .x(d => x(d.parsedDate))
        .y(d => y(d.total));
    
    svg.append('path')
        .datum(chartDataset)
        .attr('fill', 'none')
        .attr('stroke', '#3498db')
        .attr('stroke-width', 2)
        .attr('d', line);
    
    svg.selectAll('.dot')
        .data(chartDataset)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.parsedDate))
        .attr('cy', d => y(d.total))
        .attr('r', 4)
        .attr('fill', '#3498db');
}
