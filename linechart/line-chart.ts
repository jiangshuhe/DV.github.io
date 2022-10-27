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
  const yAxis = d3.axisLeft(yScale).ticks(height / 40);


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
    .attr('width', 700)
    .attr('height', 73)
    .attr('stroke', '#9cd84e')
    .attr('fill', '#9cd84e')
    .attr("opacity",0.5)

    svg.append('rect')
    .attr('x', 51)
    .attr('y', 121)
    .attr('width', 700)
    .attr('height', 73)
    .attr('stroke', '#facf39')
    .attr('fill', '#facf39')
    .attr("opacity",0.5)

    svg.append('rect')
    .attr('x', 51)
    .attr('y', 46)
    .attr('width', 700)
    .attr('height', 73)
    .attr('stroke', '#f99049')
    .attr('fill', '#f99049')
    .attr("opacity",0.5)

    svg.append('rect')
    .attr('x', 51)
    .attr('y', 31)
    .attr('width', 700)
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

    

  const line = svg.append("path").attr("class", "line");
  

  function update(X1: Int32Array, Y1: Int32Array) {


   const I = d3.range(X1.length);

    xScale.domain([d3.min(X1) as number, d3.max(X1) as number]);
    yScale.domain([0, 160]);

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

      // Add the path using this helper function

// Add the path using this helper function


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
