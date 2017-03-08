import * as d3 from "d3";
import _ from 'lodash';

import '../sass/lec3.scss'

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

  const countries = ['China', 'Australia', 'Japan', 'Finland', 'Brazil', 'Yemen, Rep.'];

  const dataSet = d3.csvParse(trimmedLines.join("\n"));
  const dataSetX = _.filter(Object.keys(dataSet[0]), (k) => k.isNumber());
  const countriesData = _.map(countries, (c) => _.filter(dataSet, (d) => d["Country Name"] == c));
  const dataSetY = _.union(_.flatten(_.map(countriesData, (c) => _.map(dataSetX, (d) => c[0][d]))));
  const countriesObj = _.map(countriesData, (c) => {
    return _.map(c[0], (v, k) => {
      if (k.isNumber() && v != '') {
        return {x: k, y: v}
      }
    })
  });

  const width = Math.max(Math.min(window.innerWidth, dataSetX.length * 10), 1200),
    height = dataSetY.length * 2;

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
    .text("Life expectancy at birth");

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

  const chinaNodes = _.filter(countriesObj[0], (d) => d != undefined);
  const australiaNodes = _.filter(countriesObj[1], (d) => d != undefined);
  const japanNodes = _.filter(countriesObj[2], (d) => d != undefined);
  const finlandNodes = _.filter(countriesObj[3], (d) => d != undefined);
  const brazilNodes = _.filter(countriesObj[4], (d) => d != undefined);
  const yemenNodes = _.filter(countriesObj[5], (d) => d != undefined);


  const line = d3.line()
    .x((d) => {
      return xScale(d.x)
    })
    .y((d) => {
      return yScale(d.y)
    });

  svg.append("path")
    .data([chinaNodes])
    .attr("class", "line china")
    .attr("transform", "translate(" + padding.left * 1.2 + "," + padding.top + ")")
    .attr("stroke", "#FF9036")
    .attr("d", line);

  svg.append("text")
    .attr("transform", "translate(" + (xScale(_.last(chinaNodes).x) + padding.left * 1.5) + "," + (yScale(_.last(chinaNodes).y) + padding.top) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "#FF9036")
    .text("China");

  svg.append("path")
    .data([australiaNodes])
    .attr("class", "line australia")
    .attr("transform", "translate(" + padding.left * 1.2 + "," + padding.top + ")")
    .attr("stroke", "#FF5475")
    .attr("d", line);

  svg.append("text")
    .attr("transform", "translate(" + (xScale(_.last(australiaNodes).x) + padding.left * 1.5) + "," + (yScale(_.last(australiaNodes).y) + padding.top) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "#FF5475")
    .text("Australia");

  svg.append("path")
    .data([japanNodes])
    .attr("class", "line japan")
    .attr("transform", "translate(" + padding.left * 1.2 + "," + padding.top + ")")
    .attr("stroke", "#1693A7")
    .attr("d", line);

  svg.append("text")
    .attr("transform", "translate(" + (xScale(_.last(japanNodes).x) + padding.left * 1.5) + "," + (yScale(_.last(japanNodes).y) + padding.top) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "#1693A7")
    .text("Japan");

  svg.append("path")
    .data([finlandNodes])
    .attr("class", "line finland")
    .attr("transform", "translate(" + padding.left * 1.2 + "," + padding.top + ")")
    .attr("stroke", "#A8A39D")
    .attr("d", line);

  svg.append("text")
    .attr("transform", "translate(" + (xScale(_.last(finlandNodes).x) + padding.left * 1.5) + "," + (yScale(_.last(finlandNodes).y) + padding.top) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "#A8A39D")
    .text("Finland");

  svg.append("path")
    .data([brazilNodes])
    .attr("class", "line finland")
    .attr("transform", "translate(" + padding.left * 1.2 + "," + padding.top + ")")
    .attr("stroke", "#C0D860")
    .attr("d", line);

  svg.append("text")
    .attr("transform", "translate(" + (xScale(_.last(brazilNodes).x) + padding.left * 1.5) + "," + (yScale(_.last(brazilNodes).y) + padding.top) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "#C0D860")
    .text("Brazil");

  svg.append("path")
    .data([yemenNodes])
    .attr("class", "line finland")
    .attr("transform", "translate(" + padding.left * 1.2 + "," + padding.top + ")")
    .attr("stroke", "#572E4F")
    .attr("d", line);

  svg.append("text")
    .attr("transform", "translate(" + (xScale(_.last(yemenNodes).x) + padding.left * 1.5) + "," + (yScale(_.last(yemenNodes).y) + padding.top) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "#572E4F")
    .text("Yemen");

});