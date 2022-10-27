import * as d3 from "d3";


export function lineChart() {
  const margin = { top: 30, right: 0, bottom: 230, left: 50 };
  const width = document.body.clientWidth;
  const height = 500;
  const xRange = [margin.left, width - margin.right];
  const yRange = [height - margin.bottom, margin.top];

  // Construct scales and axes
  const xScale = d3.scaleTime().range(xRange);
  const yScale = d3.scaleLinear().range(yRange);


  const xAxis = d3
    .axisBottom(xScale)
    .ticks(width / 80)
    .tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 80);


  // Create the SVG element for the chart
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append('rect')
    .attr('x', 51)
    .attr('y', 196)
    .attr('width', 3000)
    .attr('height', 73)
    .attr('stroke', '#9cd84e')
    .attr('fill', '#9cd84e')
    .attr("opacity",0.5)

    svg.append('rect')
    .attr('x', 51)
    .attr('y', 121)
    .attr('width', 3000)
    .attr('height', 74)
    .attr('stroke', '#facf39')
    .attr('fill', '#facf39')
    .attr("opacity",0.5)

    svg.append('rect')
    .attr('x', 51)
    .attr('y', 46)
    .attr('width', 3000)
    .attr('height', 74)
    .attr('stroke', '#f99049')
    .attr('fill', '#f99049')
    .attr("opacity",0.5)

    svg.append('rect')
    .attr('x', 51)
    .attr('y', 31)
    .attr('width', 3000)
    .attr('height', 14)
    .attr('stroke', '#f65e5f')
    .attr('fill', '#f65e5f')
    .attr("opacity",0.5)

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

    
  // Mutiple lines chart
  const line = svg.append("path").attr("class", "line");
  const area = svg.append("path").attr("class", "area");
  

  function update1(X: Int32Array, X1: Int32Array, 
    Y: Int32Array, Y_1: Int32Array, Y_2: Int32Array, Y1: Int32Array) {

   const I = d3.range(X.length);
   const II = d3.range(X1.length);

    xScale.domain([d3.min(X) as number, d3.max(X) as number]);
    yScale.domain([0, 160]);

    const a = d3
      .area<number>()
      .x((i) => xScale(X[i]))
      .y0((i) => yScale(Y_1[i]))
      .y1((i) => yScale(Y_2[i]));

    area
      .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .attr("d", a(I))
      .attr("fill", "#000000")
      .attr("opacity", 0.2);

   const l  = d3
      .line<number>()
      .x((i) => xScale(X[i]))
      .y((i) => yScale(Y[i]));
    
    line
      .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .attr("d", l(I))
      .style("fill", "none")
      .style("stroke", "#000000")
      .style("stroke-width", "2");
   

    svg.select(".xaxis").selectAll("*").remove();
    svg.select(".yaxis").selectAll("*").remove();
    svg.select(".line").selectAll("*").remove();
    svg.select(".area").selectAll("*").remove();

    // Update axes since we set new domains
    svg
      .select<SVGSVGElement>(".yaxis")
      .call(yAxis)
      // Add gridlines
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - margin.right - margin.left)
          .attr("stroke-opacity", 0.08)
      )
      .call((g) =>
        g
          .append("text")
          .attr("y", 324)
          .attr("x", 0)
          .attr("fill", "black")
          .text("US AQI")
          .style("font-size", "13px")
      );

    svg.select<SVGSVGElement>(".xaxis").call(xAxis);


    // Add tooltips
    var Tooltip = d3.select("#div_template")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    var mouseover = function(d) {
      Tooltip
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 1)
  }
    var mousemove = function(d) {
      Tooltip
        .html("The valueis: " )
        .style("left", (d3.mouse(this)[0]+70) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
  }
    var mouseleave = function(d) {
      Tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }
    svg.selectAll()
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    
    // Add Checkbox

    d3.select< HTMLInputElement, unknown >("#mb")
      .on("change", function(){

      const checked = this.checked;
      if (checked) {

      svg
        .selectAll("circle")
        .data(II)
        .enter()
        .append("circle")
        .attr("class","dots")
        .attr("cx", (i) => xScale(X1[i]))
        .attr("cy", (i) => yScale(Y1[i]))
        .attr("r",1)
        .attr("opacity", 0.8)
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .style("fill", "#000000") }

        else {
          update1 
      }
        return {
          Element: svg.node()!,
          update1};
        }

      );



    // Add legends
      svg.append("circle")
      .attr("cx",70).attr("cy",320).attr("r", 7).style("fill", "#9cd84e")
      svg.append("circle")
      .attr("cx",150).attr("cy",320).attr("r", 7).style("fill", "#facf39")
      svg.append("circle")
      .attr("cx",260).attr("cy",320).attr("r", 7).style("fill", "#f99049")
      svg.append("circle")
      .attr("cx",520).attr("cy",320).attr("r", 7).style("fill", "#f65e5f")
      svg.append("circle")
      .attr("cx",630).attr("cy",320).attr("r", 7).style("fill", "#a070b6")
      svg.append("circle")
      .attr("cx",780).attr("cy",320).attr("r", 7).style("fill", "#a06a7b")
      svg.append("text")
      .attr("x", 85).attr("y", 320).text("Good").style("font-size", "15px").attr("alignment-baseline","middle")
      svg.append("text")
      .attr("x", 165).attr("y", 320).text("Moderate").style("font-size", "15px").attr("alignment-baseline","middle")
      svg.append("text")
      .attr("x", 275).attr("y", 320).text("Unhealthy for Sensitive Groups").style("font-size", "15px").attr("alignment-baseline","middle")
      svg.append("text")
      .attr("x", 535).attr("y", 320).text("Unhealthy").style("font-size", "15px").attr("alignment-baseline","middle")
      svg.append("text")
      .attr("x", 645).attr("y", 320).text("Very Unhealthy").style("font-size", "15px").attr("alignment-baseline","middle")
      svg.append("text")
      .attr("x", 795).attr("y", 320).text("Hazardous").style("font-size", "15px").attr("alignment-baseline","middle")

  }

  return {
    element: svg.node()!,
    update1,
  };
}
