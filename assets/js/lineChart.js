
import { parseYear } from './loadAndProcessData.js';

export const lineChart = (selection, props) => {
    const {
        colorValue,
        colorScale,
        yValue,
        title,
        xValue,
        xAxisLabel,
        yAxisLabel,
        circleRadius,
        margin,
        width,
        height,
        data,
        nested,
        selectedYear,
        setSelectedYear
    } = props;

    // const parseYear = d3.timeParse('%Y');

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth]);

    // console.log(xScale.domain());
    // console.log(xScale.range());

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice();


    // console.log(yScale.domain());
    // console.log(yScale.range());

    //general update pattern for DOM element
    //special case for group element
    const g = selection.selectAll('.container').data([null]);
    //update element - append and assign container class for group element
    const gEnter = g.enter()
        .append('g')
        .attr('class', 'container');
    gEnter.merge(g)
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(15);

    const yAxisTickFormat = number =>
        d3.format('.2s')(number)
            .replace('G', 'B')
            .replace('.0', '');

    const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat(yAxisTickFormat)
        .tickPadding(10);

    // use nested version of general update pattern
    const yAxisGEnter = gEnter
        .append('g')
        .attr('class', 'y-axis');
    const yAxisG = g.select('y-axis');
    yAxisGEnter
        .merge(yAxisG)
        .call(yAxis)
        .selectAll('.domain').remove();

    yAxisGEnter.append('text')
        //not dependent on the props set in enter selection
        .attr('class', 'axis-label')
        .attr('y', -60)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        //what is set in props set in the merge enter and update selection
        .merge(yAxisG.select('axis-label'))
        .attr('x', -innerHeight / 2)
        .text(yAxisLabel);

    const xAxisGEnter = gEnter
        .append('g')
        .attr('class', 'x-axis');
    const xAxisG = g.select('.x-axis');
    xAxisGEnter
        .merge(xAxisG)
        .call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`)
        .select('.domain').remove();

    xAxisGEnter
        // Static attr set in enter selection
        .append('text')
        .attr('class', 'axis-label')
        .attr('y', 75)
        .attr('fill', 'black')
        .merge(xAxisG.select('.axis-label'))
        .attr('x', innerWidth / 2)
        .text(xAxisLabel);

    const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(d3.curveBasis);

    //multiple path elements using data join
    const linePaths = g.merge(gEnter)
        .selectAll('.line-path').data(nested);
    linePaths
        .enter().append('path')
        .attr('class', 'line-path')
        .merge(linePaths)
        //d has key and values
        .attr('d', d => lineGenerator(d.values))
        //key is the city name
        .attr('stroke', d => colorScale(d.key));
    // g.append('path')
    //   .attr('class', 'line-path')
    //   .attr('d', lineGenerator(data));

    //bandwidth compute width of a single bar
    // 	g.selectAll('circle').data(data)
    //   	.enter().append('circle')
    //   		.attr('cy', d => yScale(yValue(d)))
    //   		.attr('cx', d => xScale(xValue(d)))
    //   		.attr('r', circleRadius);

    const selectedYearDate = parseYear(selectedYear);
    gEnter
        .append('line')
        .attr('class', 'selected-date-line')
        .attr('y1', 0)
        .merge(g.select('.selected-date-line'))
        .attr('x1', xScale(selectedYearDate))
        .attr('x2', xScale(selectedYearDate))
        .attr('y2', innerHeight);

    gEnter
        .append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .merge(g.select('.title'))
        .text(title);

    gEnter.append('rect')
        .attr('class', 'mouse-interceptor')
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .merge(g.select('mouse-interceptor'))
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        //use function instead arrow to use this to get the DOM element associated with the event 
        .on('mousemove', function () {
            const x = d3.mouse(this)[0];
            const hoveredDate = xScale.invert(x);
            //invoke a call back define function in index.js takes input as a year and assign it to selected year
            setSelectedYear(hoveredDate.getFullYear());
            // console.log(hoveredDate.getFullYear());
        });

};