export class MultiLineChart {

  #margin;
  #width;
  #height;
  #chart;
  #xScale;
  #yScale;
  #colorScale;
  #colorScheme;
  #xAxis;
  #xAxisGroup;
  #line;
  #lineGroup;
  #lineSeries;

  constructor(className, width, height, colorScheme) {
    this.#margin = { top: 50, right: 30, bottom: 80, left: 50};
    this.#width = width - this.#margin.left - this.#margin.right;
    this.#height = height - this.#margin.top - this.#margin.bottom;
    this.#colorScheme = colorScheme;

    this.#init(className);
  }

  #init(className) {
    const svg = d3.select("#vis").select("svg");

    this.#chart = svg.append("g")
      .attr('class', className)
      .attr('transform', `translate(${this.#margin.left},${this.#margin.top})`); 
    this.#xAxisGroup = this.#chart.append('g')
      .attr('transform', `translate(0,${this.#height - this.#margin.bottom})`)
      .style('font-size', 14);
    this.#lineGroup = this.#chart.append("g");

    this.#xScale = d3.scaleUtc();
    this.#yScale = d3.scaleLinear();
    this.#colorScale = d3.scaleOrdinal();
    this.#xAxis = d3.axisBottom(this.#xScale);
    this.#line = d3.line()
  }

  #setXscale(dates) {
    this.#xScale
      .domain(d3.extent(dates))
      .range([this.#margin.left, this.#width - this.#margin.right]);
    return this;
  }

  #setYscale(series) {
    this.#yScale
      .domain([0, d3.max(series, (s) => d3.max(s, (d) => d.value))])
      .range([this.#height - this.#margin.bottom, this.#margin.top]);
    return this;
  }

  #setColorScale(keys) {
    this.#colorScale.domain(keys).range(this.#colorScheme);
    return this;
  }

  #setXaxis() {
    this.#xAxisGroup.call(this.#xAxis);
    return this;
  }

  #setLines(series) {
    const t = d3.transition()
      .duration(250)
      .ease(d3.easeLinear)

    this.#line
      .x((d) => this.#xScale(d.date))
      .y((d) => this.#yScale(d.value));

    this.#lineSeries = this.#lineGroup.selectAll("g")
      .data(series, d => d[0].key)
      .join(
        enter => enter.append('g').attr('class', 'line-group'),
        update => update,
        exit => exit.transition(t)
          .style("opacity",  0.1)
          .remove()
      )
      .call(bar => bar
        .append("path")
        .attr('class', 'line-series')
        .attr("d", this.#line)
        .attr('fill', 'none')
        .style("stroke", (d) => this.#colorScale(d[0].key))
      )

    return this;
  }

  #setLabels() {
    if (!this.#lineSeries) {
      return this;
    }

    this.#lineSeries.append("g")
        .attr('class', 'label-group')
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .attr("text-anchor", "middle")
        .selectAll("text")
      .data(d => d, d => d.name)
      .join(
        enter => enter.append('text')
          .text((d) => d.value)
          .attr("dy", "0.35em")
          .attr("x", (d) => this.#xScale(d.date))
          .attr("y", (d) => this.#yScale(d.value)),
        update => update,
        exit => exit.remove()
      )
      .call((d) =>
        d.filter((d, i, data) => i === data.length - 1)
          .append("tspan")
          .attr("font-weight", "bold")
          .text((d) => ' ' + d.key)
      )
      .clone(true)
      .lower()
      .attr("fill", "none")
      .attr("stroke", "#f5f4f1")
      .attr("stroke-width", 6)

    return this;
  }

  get chart() {
    return this.#chart;
  }

  show() {
    this.#chart.attr("opacity", 1);
  }

  unshow() {
    this.#chart.attr("opacity", 0);
  }

  drawChart(dates, series, keys) {
    this.#setXscale(dates)
      .#setYscale(series)
      .#setColorScale(keys)
      .#setXaxis()
      .#setLines(series)
      .#setLabels();

    return this;
  }
}