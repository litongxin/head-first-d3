import * as d3 from "d3";
import _ from 'lodash';

import '../sass/lec1.scss'

import 'static-loader?!./constants/API_SP.DYN.LE00.IN_DS2_en_csv_v2.csv?output=API_SP.DYN.LE00.IN_DS2_en_csv_v2.csv';

String.prototype.isNumber = function () {
  return /^\d+$/.test(this);
};

const padding = {left: 30, right: 30, top: 60, bottom: 30};

d3.text('./dist/API_SP.DYN.LE00.IN_DS2_en_csv_v2.csv', (data) => {
  let lines = data.split("\n");
  lines.splice(0, 4);
  let trimmedLines = _.map(lines, (l) => {
    return l.substr(0, l.length - 2);
  });

  const dataSet = d3.csvParse(trimmedLines.join("\n"));
  // const countries = _.map(dataSet, (d) => {
  //   return d["Country Name"];
  // });
  const dataSetX = _.filter(Object.keys(dataSet[0]), (k) => k.isNumber());
  const chinaData = _.filter(dataSet, (d) => d["Country Name"] == 'China');
  const dataSetY = _.map(dataSetX, (d) => chinaData[0][d]);
  const objArray = _.map(chinaData[0], (v, k) => {
    if (k.isNumber() && v!='') {
      return {x:k, y: v}
    }
  });
  const nodes = _.filter(objArray, (d) => d != undefined);

  const width = Math.max(Math.min(window.innerWidth, dataSetX.length * 10), 1200),
    height = dataSetY.length * 5;

  const xScale = d3.scaleOrdinal()
    .domain(dataSetX)
    .range(_.range(0, dataSetX.length * 20, 20));

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataSetY)])
    .range([height - padding.top - padding.bottom, 0]);

  const xAxis = d3.axisBottom(xScale);

  const yAxis = d3.axisLeft(yScale);

  const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg.append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", 30)
    .style("text-anchor", "middle")
    .text("Life expectancy at birth for China ");

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left * 1.2 + "," + (height - padding.bottom) + ")")
    .call(xAxis);

  svg.append("text")
    .attr("class", "scale-text")
    .attr("transform", "translate(" + (width / 2) + "," + height + ")")
    .style("text-anchor", "middle")
    .text("Year");

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left * 1.2 + "," + padding.top + ")")
    .call(yAxis);

  svg.append("text")
    .attr("class", "scale-text")
    .attr("transform", "rotate(-90)")
    .attr("y", padding.left / 10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Age");

  svg.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d.x) + padding.left * 1.2 ;
    })
    .attr("cy", function (d) {
      return yScale(d.y) + padding.top;
    })
    .attr("r", function (d) {
      return 3;
    })
    .style("fill", "#62997A");
});