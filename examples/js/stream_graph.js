/**
 * Stream Graph - Hazardous and Non-Hazardous Flow Over Time
 * Demonstrates: d3.stack(), streamgraph offset
 */

// Chart metadata
window.STREAM_GRAPH_CONFIG = {
    title: 'Stream Graph',
    subtitle: 'Hazardous and non-hazardous flow over time',
    description: 'Stacked area chart with organic flowing appearance. Uses d3.stackOffsetWiggle for centered baseline. Shows how categories change in proportion over time.',
    category: 'time'
};

function renderStreamGraph(containerId, data) {
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    const dailyCounts = chartData(data).streamGraph;
    
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const parseDate = d3.timeParse('%Y-%m-%d');
    dailyCounts.forEach(d => d.parsedDate = parseDate(d.date));
    
    const stack = d3.stack()
        .keys(['hazardous', 'non_hazardous'])
        .offset(d3.stackOffsetWiggle);
    
    const stackedData = stack(dailyCounts);
    
    const x = d3.scaleTime()
        .domain(d3.extent(dailyCounts, d => d.parsedDate))
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([
            d3.min(stackedData, layer => d3.min(layer, d => d[0])),
            d3.max(stackedData, layer => d3.max(layer, d => d[1]))
        ])
        .range([height, 0]);
    
    const color = d3.scaleOrdinal()
        .domain(['hazardous', 'non_hazardous'])
        .range(['#e74c3c', '#2ecc71']);
    
    const area = d3.area()
        .x(d => x(d.data.parsedDate))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))
        .curve(d3.curveBasis);
    
    svg.selectAll('.layer')
        .data(stackedData)
        .enter()
        .append('path')
        .attr('class', 'layer')
        .attr('d', area)
        .attr('fill', d => color(d.key))
        .attr('opacity', 0.8);
    
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Date');
}
