export class PieChart {

  #chart;
  #radius;
  #arc;
  #pie;
  #piePercent;
  #colorScale;
  #colorScheme;

  constructor(className, width, height, colorScheme) {
    this.#radius = Math.min(width, height) / 2;
    this.#colorScheme = colorScheme;

    this.#init(className);
  }

  #init(className) {
    const svg = d3.select("#vis").select("svg");

    this.#chart = svg
      .append("g")
      .attr("x", 0)
      .attr("y", 0)
      .attr("font-family", "'Work sans', sans-serif")
      .attr("font-size", 14)
      .attr("text-anchor", "middle")
      .attr("class", className);
    this.#arc = d3.arc()
      .innerRadius(this.#radius * 0.4)
      .outerRadius(this.#radius * 0.9);
    this.#colorScale = d3.scaleOrdinal();
    this.#piePercent = svg.append("g")
      .attr("font-family", "'Work sans', sans-serif")
      .attr("font-size", 24)
      .attr("text-anchor", "middle")
      .append("text");
  }

  #setColorScale(data) {
    this.#colorScale
      .domain(data.map((d) => d.name))
      .range(this.#colorScheme);
    return this;
  }

  #setPie(data) {
    this.#pie = d3.pie()
      .sort(null)
      .padAngle(0.02)
      .value((d) => d.value)(data);

    this.#chart.selectAll("path")
      .data(this.#pie)
      .join(
        enter => enter.append('path'),
        update => update,
        exit => exit.remove()
      )
      .transition()
      .duration(400)
      .delay((d, i) => i * 5)
      .attr("fill", (d) => this.#colorScale(d.data.name))
      .attr("d", this.#arc);
    return this;
  }

  #setLabel() {
    const labelGroup = this.#chart
      .selectAll("text")
      .data(this.#pie)
      .join('text')

    if (this.#chart.select('.pie-label-name').empty()) {
      labelGroup
        .attr("transform", (d) => `translate(${this.#arc.centroid(d)})`)
        .call((text) => 
            text
              .filter((d) => d.endAngle - d.startAngle > 0.25)
              .append("tspan")
              .attr("class", "pie-label-name")
              .attr("y", "-0.1em")
              .attr("font-weight", "bold")
              .text((d) => d.data.name)
        )
        .call((text) => 
            text
              .filter((d) => d.endAngle - d.startAngle > 0.25)
              .append("tspan")
              .attr("class", "pie-label-value")
              .attr("x", 0)
              .attr("y", "1.1em")
              .attr("fill-opacity", 0.7)
              .text((d) => d.data.value.toLocaleString())
        )
    } else {
      labelGroup
        .transition()
        .duration(400)
        .delay((d, i) => i * 5)
        .attr("transform", (d) => `translate(${this.#arc.centroid(d)})`)
        .call((text) => 
          text.select('.pie-label-name')
            .text((d) => d.data.name)
        )
        .call((text) => 
          text.select('.pie-label-value') 
            .text((d) => d.data.value.toLocaleString())
        )
    }

    return this;
  }

  #setPiePercent(data, dataKey) {
      this.#piePercent
        .transition()
        .duration(400)
        .delay((d, i) => i * 5)
        .text(d3.format(".0%")(data.find((d) => d.name === dataKey).value / 100));
    return this;
  }

  get chart() {
    return this.#chart;
  }

  show() {
    this.#chart.attr("opacity", 1);
    this.#piePercent.attr("opacity", 1);
  }

  unshow() {
    this.#chart.attr("opacity", 0);
    this.#piePercent.attr("opacity", 0);
  }

  drawChart(data, dataKey) {
    this.#setColorScale(data)
      .#setPie(data)
      .#setLabel()
      .#setPiePercent(data, dataKey)

    return this;
  }
}