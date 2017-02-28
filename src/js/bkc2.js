import * as d3 from "d3";
// import * as d3_svg from 'd3-svg';
import _ from 'lodash';
import bookmarks from './constants/bookmarks';

import '../sass/bkc2.scss';

Date.prototype.getWeek = function() {
  let firstDayOfYear = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - firstDayOfYear) / 86400000) + firstDayOfYear.getDay()+1)/7);
};

const dataSet = _.map(bookmarks, (d) => {
  let date = new Date(d.created);
  d.year = date.getFullYear();
  d.month = date.getMonth() + 1;
  d.day = date.getDay() + 1;
  d.week = date.getWeek();
  return d;
});

const dateSetIn2014 = _.filter(dataSet, (d) => {
  return d.year == '2014';
});

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  times = d3.range(53);

const margin = {
  top: 170,
  right: 50,
  bottom: 70,
  left: 50
};

const width = Math.max(Math.min(window.innerWidth, 1200), 500) - margin.left - margin.right - 20,
  gridSize = Math.floor(width / times.length),
  height = gridSize * (days.length + 2);

const svg = d3.select('body')
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const newFontSize = width * 62.5 / 900;
d3.select("html").style("font-size", newFontSize + "%");


const colorScale = d3.scaleLinear()
  .domain([0, d3.max(dateSetIn2014, function (d) {
    return d.count;
  }) / 2, d3.max(dateSetIn2014, function (d) {
    return d.count;
  })])
  .range(["#F9F2E7", "#40C0CB", "#00A8C6"]);

const dayLabels = svg.selectAll(".dayLabel")
  .data(days)
  .enter().append("text")
  .text(function (d) {
    return d;
  })
  .attr("x", 0)
  .attr("y", function (d, i) {
    return i * gridSize;
  })
  .style("text-anchor", "end")
  .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
  .attr("class", function (d, i) {
    return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
  });

const timeLabels = svg.selectAll(".timeLabel")
  .data(times)
  .enter().append("text")
  .text(function (d) {
    return d + 1;
  })
  .attr("x", function (d, i) {
    return i * gridSize;
  })
  .attr("y", 0)
  .style("text-anchor", "middle")
  .attr("transform", "translate(" + gridSize / 2 + ", -6)");

const heatMap = svg.selectAll(".hour")
  .data(dateSetIn2014)
  .enter().append("rect")
  .attr("x", function (d) {
    return (d.week - 1) * gridSize;
  })
  .attr("y", function (d) {
    return (d.day - 1) * gridSize;
  })
  .attr("class", "hour bordered")
  .attr("width", gridSize)
  .attr("height", gridSize)
  .style("stroke", "white")
  .style("stroke-opacity", 0.6)
  .style("fill", function (d) {
    return colorScale(d.count);
  });

//Append title to the top
svg.append("text")
  .attr("class", "title")
  .attr("x", width / 2)
  .attr("y", -90)
  .style("text-anchor", "middle")
  .text("Number of Bookmarks in 2014");
svg.append("text")
  .attr("class", "subtitle")
  .attr("x", width / 2)
  .attr("y", -60)
  .style("text-anchor", "middle")
  .text("By Momo | 2017");

svg.append("text")
  .attr("class", "credit")
  .attr("x", width / 2)
  .attr("y", gridSize * (days.length + 1) + 80)
  .style("text-anchor", "middle")
  .text("Based on Nadieh Bremer’s Block");

const countScale = d3.scaleLinear()
  .domain([0, d3.max(dateSetIn2014, function (d) {
    return d.count;
  })])
  .range([0, width]);

const numStops = 10;
const countRange = countScale.domain();
countRange[2] = countRange[1] - countRange[0];
const countPoint = [];
for (let i = 0; i < numStops; i++) {
  countPoint.push(i * countRange[2] / (numStops - 1) + countRange[0]);
}

svg.append("defs")
  .append("linearGradient")
  .attr("id", "legend-traffic")
  .attr("x1", "0%").attr("y1", "0%")
  .attr("x2", "100%").attr("y2", "0%")
  .selectAll("stop")
  .data(d3.range(numStops))
  .enter().append("stop")
  .attr("offset", function (d, i) {
    return countScale(countPoint[i]) / width;
  })
  .attr("stop-color", function (d, i) {
    return colorScale(countPoint[i]);
  });


const legendWidth = Math.min(width * 0.8, 400);
const legendsvg = svg.append("g")
  .attr("class", "legendWrapper")
  .attr("transform", "translate(" + (width / 2) + "," + (gridSize * days.length + 40) + ")");

legendsvg.append("rect")
  .attr("class", "legendRect")
  .attr("x", -legendWidth / 2)
  .attr("y", 0)
  .attr("width", legendWidth)
  .attr("height", 10)
  .style("fill", "url(#legend-traffic)");

legendsvg.append("text")
  .attr("class", "legendTitle")
  .attr("x", 0)
  .attr("y", -10)
  .style("text-anchor", "middle")
  .text("Number of Bookmarks");

const xScale = d3.scaleLinear()
  .range([-legendWidth / 2, legendWidth / 2])
  .domain([0, d3.max(dateSetIn2014, function (d) {
    return d.count;
  })]);

const xAxis = d3.axisBottom()
  .ticks(5)
  .scale(xScale);

legendsvg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + (10) + ")")
  .call(xAxis);