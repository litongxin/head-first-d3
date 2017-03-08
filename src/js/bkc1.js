import * as d3 from "d3";
import _ from 'lodash';
import bookmarks from './constants/bookmarks';

import '../sass/bkc1.scss';

const width = 600;
const height = 400;

const svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const padding = {left: 60, right: 30, top: 20, bottom: 40};

const dataSet = _.each(bookmarks, (d) => {
  d.created = new Date(d.created);
});

const dataSetX = _.map(dataSet, 'created');
const dataSetY = _.map(dataSet, 'count');


const xScale = d3.scaleTime()
  .domain([_.first(dataSetX), _.last(dataSetX)])
  .range([0, dataSetX.length]);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(dataSetY)])
  .range([height - padding.top - padding.bottom, 0]);

const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y-%m"));

const yAxis = d3.axisLeft(yScale);

const line = d3.line()
  .x((d) => {
    return xScale(d.created)
  })
  .y((d) => {
    return yScale(d.count)
  });

svg.append("path")
  .data([dataSet])
  .attr("class", "line")
  .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
  .attr("d", line);


svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
  .call(xAxis);

svg.append("text")
  .attr("transform", "translate(" + (width / 2) + "," + height + ")")
  .style("text-anchor", "middle")
  .text("Date");

svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
  .call(yAxis);

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", padding.left / 6)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Count");
