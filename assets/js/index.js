// import {
//   select,
//   csv,
//   scaleLinear,
//   scaleTime,
//   extent,
//   axisLeft,
//   axisBottom,
//   line,
//   curveBasis,
//   nest,
//   schemeCategory10,
//   scaleOrdinal,
//   descending.
//   format,
//   mouse
// } from "https://unpkg.com/d3@5.7.0/dist/d3.min.js";

// import { dropdownMenu } from './dropdownMenu.js';
// import { scatterPlot } from './scatterPlot.js';
import { colorLegend } from './colorLegend.js';
import { loadAndProcessData, parseYear } from './loadAndProcessData.js';
import { lineChart } from './lineChart.js';

const svg = d3.select('svg');
const colorLegendG = svg.append('g');
const lineChartG = svg.append('g');


const width = +svg.attr('width');
const height = +svg.attr('height');

//state
let selectedYear = 2018;
//data get defined when render function is invoked
let data;

const setSelectedYear = year => {
  selectedYear = year;
  //invoke render to complete the cycle
  render();
};

//accessor functions
const render = () => {
  const yValue = d => d.population;
  const colorValue = d => d.country;
  // console.log(data);
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  //  y value of the last entry in array
  const lastYValue = d =>
    yValue(d.values[d.values.length - 1]);

  //single line for each city
  // split array into multiple arrays
  const nested = d3.nest()
    .key(colorValue)
    .entries(data)
    .sort((a, b) =>
      d3.descending(lastYValue(a), lastYValue(b))
    );

  // console.log(nested);

  //isolated the last point in time index 168

  colorScale.domain(nested.map(d => d.key));

  // lineChart
  lineChartG.call(lineChart, {
    colorScale,
    colorValue,
    yValue,
    title: 'Population over Time by Region',
    xValue: d => d.year,
    xAxisLabel: 'Year',
    yAxisLabel: 'Population',
    circleRadius: 6,
    margin: {
      top: 60,
      right: 280,
      bottom: 88,
      left: 105
    },
    width,
    height,
    data,
    nested,
    selectedYear,
    setSelectedYear
  });

  colorLegendG
    .attr('transform', `translate(700,110)`)
    .call(colorLegend, {
      colorScale,
      circleRadius: 10,
      spacing: 55,
      textOffset: 15
    });
};

//Data Table
loadAndProcessData()
  .then((loadedData) => {
    data = loadedData;
    render();
  });