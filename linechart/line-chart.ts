import * as d3 from "d3";
// import { color } from "d3";

export function lineChart() {
  const margin = { top: 30, right: 0, bottom: 30, left: 50 };
  const width = document.body.clientWidth;
  const height = 300;
  const xRange = [margin.left, width - margin.right];
  const yRange = [height - margin.bottom, margin.top];
  // Construct scales and axes.
  const xScale = d3.scaleTime().range(xRange);
  const yScale = d3.scaleLinear().range(yRange);
  // const colors = [{"name":"Good","min":0,"max":50,"color":"#9cd84e"},{"name":"Moderate","min":51,"max":100,"color":"#facf39"},{"name":"Unhealthy for Sensitive Groups","min":101,"max":150,"color":"#f99049"},{"name":"Unhealthy","min":151,"max":200,"color":"#f65e5f"},{"name":"Very Unhealthy","min":201,"max":300,"color":"#a070b6"},{"name":"Hazardous","min":301,"color":"#a06a7b"}];

  const xAxis = d3
    .axisBottom(xScale)
    .ticks(width / 80)
    .tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40);


  // Create the SVG element for the chart.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  


  // Add the x axis
  svg
    .append("g")
    .attr("class", "xaxis")
    .attr("transform", `translate(0,${height - margin.bottom})`);

  // Add the y axis
  svg
    .append("g")
    .attr("class", "yaxis")
    .attr("transform", `translate(${margin.left},0)`);

  const line = svg.append("path").attr("class", "line");
  

  function update(X1: Int32Array, Y1: Int32Array) {


    const I = d3.range(X1.length);

    xScale.domain([d3.min(X1) as number, d3.max(X1) as number]);
    yScale.domain([0, Math.max(...Y1)]);

   const l  = d3
      .line<number>()
      .x((i) => xScale(X1[i]))
      .y((i) => yScale(Y1[i]));
    
    line
      .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .attr("d", l(I))
      .style("fill", "none")
      .style("stroke", "#000000")
      .style("stroke-width", "2");
   
      // Clear the axis so that when we add the grid, we don't get duplicate lines
    // console.log(svg.select(".line").selectAll("*"));
    svg.select(".xaxis").selectAll("*").remove();
    svg.select(".yaxis").selectAll("*").remove();
    svg.select(".line").selectAll("*").remove();
   

    // Update axes since we set new domains
    svg
      .select<SVGSVGElement>(".yaxis")
      .call(yAxis)
      // add gridlines
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - margin.right - margin.left)
          .attr("stroke-opacity", 0.1)
      )
      .call((g) =>
        g
          .append("text")
          .attr("y", margin.top)
          .attr("x", -22)
          .attr("fill", "black")
          .text("A_AQI")
      );

    svg.select<SVGSVGElement>(".xaxis").call(xAxis);

    // Add legends
    svg.append("circle")
    .attr("cx",50).attr("cy",320).attr("r", 7).style("fill", "#9cd84e")
    svg.append("circle")
    .attr("cx",130).attr("cy",320).attr("r", 7).style("fill", "#facf39")
    svg.append("circle")
    .attr("cx",240).attr("cy",320).attr("r", 7).style("fill", "#f99049")
    svg.append("circle")
    .attr("cx",500).attr("cy",320).attr("r", 7).style("fill", "#f65e5f")
    svg.append("circle")
    .attr("cx",610).attr("cy",320).attr("r", 7).style("fill", "#a070b6")
    svg.append("circle")
    .attr("cx",760).attr("cy",320).attr("r", 7).style("fill", "#a06a7b")
    svg.append("text")
    .attr("x", 65).attr("y", 320).text("Good").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text")
    .attr("x", 145).attr("y", 320).text("Moderate").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text")
    .attr("x", 255).attr("y", 320).text("Unhealthy for Sensitive Groups").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text")
    .attr("x", 515).attr("y", 320).text("Unhealthy").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text")
    .attr("x", 625).attr("y", 320).text("Very Unhealthy").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text")
    .attr("x", 775).attr("y", 320).text("Hazardous").style("font-size", "15px").attr("alignment-baseline","middle")

  }
  return {
    element: svg.node()!,
    update,
  };
}
