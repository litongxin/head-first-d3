import * as d3 from "d3";
import _ from 'lodash';

import '../sass/lec2.scss'

import 'static-loader?!./constants/API_SP.DYN.LE00.IN_DS2_en_csv_v2.csv?output=API_SP.DYN.LE00.IN_DS2_en_csv_v2.csv';

String.prototype.isNumber = function () {
  return /^\d+$/.test(this);
};

const padding = {left: 60, right: 30, top: 60, bottom: 30};

d3.text('./dist/API_SP.DYN.LE00.IN_DS2_en_csv_v2.csv', (data) => {
  let lines = data.split("\n");
  lines.splice(0, 4);
  let trimmedLines = _.map(lines, (l) => {
    return l.substr(0, l.length - 2);
  });

  const dataSet = d3.csvParse(trimmedLines.join("\n"));
  const dataIn1991 = _.map(dataSet, (d) => {
    if (!_.isEmpty(d["1991"])) {
      return {
        "country": d["Country Name"],
        "age": d["1991"]
      }
    }
  });

  const top15DataIn1991 = _.slice(_.filter(dataIn1991, d => d != undefined), 0, 15);

  const dataSetX = _.map(top15DataIn1991, d => d.age);
  const dataSetY = _.map(top15DataIn1991, d => d.country);

  const width = Math.max(Math.min(window.innerWidth, dataSetX.length * 10), 800),
    height = top15DataIn1991.length * 30;

  const colorScale = d3.scaleLinear()
    .domain([0, d3.max(dataSetX) / 2, d3.max(dataSetX)])
    .range(["#FFFBB7", "#F88863", "#9FD6D2"]);

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(dataSetX)])
    .range([0, (height - padding.top - padding.bottom) * 2]);

  const yScale = d3.scaleOrdinal()
    .domain(dataSetY)
    .range(_.range(0, dataSetX.length * 25, 25));

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg.append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text("Top 10 countries Life expectancy at birth in 1991 ");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + padding.left * 2 + "," + (height - padding.bottom) + ")")
    .call(xAxis);

  const yWrapper = svg.append("g")
    .attr("class","yWrapper")
    .attr("transform","translate(" + padding.left * 2 + "," + (height - dataSetX.length * 25 - padding.bottom) + ")");

  yWrapper.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0, 0)")
    .call(yAxis);

  yWrapper.selectAll("rect")
    .data(top15DataIn1991)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d) => yScale(d.country) - 10)
    .attr("width", (d) => xScale(d.age))
    .attr("height", 20)
    .style("fill", function (d) {
      return colorScale(d.age);
    })

});