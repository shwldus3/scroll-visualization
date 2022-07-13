import { scroller } from "./lib/scroller.js";
import { PieChart } from "./charts/pie_chart.js";
import { MultiLineChart } from "./charts/multiline_chart.js";
import {
  getBtsWriteRatioData,
  getBtsComposeRatioData,
  getBoybandOwnSongData,
  getSongByBtsMembersData
} from './services/bts_data.js';


const WIDTH = 1000;
const HEIGHT = 950;
const COLOR_SCHEME = d3.schemeTableau10;

let multilineChart;
let pieChart;

setTimeout(drawInitial(), 100);


function drawInitial() {
  const svg = d3
    .select("#vis")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .attr("opacity", 1);

  multilineChart = new MultiLineChart('multiline-chart', WIDTH, HEIGHT, COLOR_SCHEME)
  pieChart = new PieChart('pie-chart', WIDTH/2, HEIGHT/2, COLOR_SCHEME)

  draw1();

}


function clean(chartType) {
  const svg = d3.select("#vis").select("svg");

  if (chartType !== "isMultiple"){
    multilineChart.unshow();
    console.log("clean multi-line chart");
  }
  if (chartType !== "isFirst") {
    svg.selectAll(".bts-img").attr("opacity", 0);
    console.log("clean first chart");
  }
  if (chartType !== "isPie") {
    pieChart.unshow();
    console.log("clean pie chart");
    svg.attr("viewBox", [0, 0, WIDTH, HEIGHT]);
  }
}


function draw1() {
  clean("isFirst");

  const svg = d3.select("#vis").select("svg");

  if (!svg.select(".bts-img").empty()) {
    svg.select(".bts-img").attr("opacity", 1);
    return;
  }

  svg
    .append("svg:image")
    .attr("class", "bts-img")
    .attr("xlink:href", "images/bts.jpeg")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", "100%")
    .attr("height", "100%");
}


async function draw2() {
  clean("isPie");

  const svg = d3
    .select("#vis")
    .select("svg")
    .attr("viewBox", [-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT]);

  const data = await getBtsComposeRatioData();
  const dataKey = "멤버 작곡 참여 비율";
  pieChart.drawChart(data, dataKey).show();
}


async function draw3() {
  clean("isPie");

  const svg = d3
    .select("#vis")
    .select("svg")
    .attr("viewBox", [-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT]);

  // const data = [
  //   { name: "멤버 작사 참여 비율", value: 92.5 },
  //   { name: "멤버 작사 비참여 비율", value: 7.5 },
  // ];
  const data = await getBtsWriteRatioData();
  const dataKey = "멤버 작사 참여 비율";
  pieChart.drawChart(data, dataKey).show();
}


async function draw4() {
  clean("isMultiple");

  const { dates, series, keys } = await getBoybandOwnSongData();
  multilineChart.drawChart(dates, series, keys).show();
}


async function draw5() {
  clean("isMultiple");

  const { dates, series, keys } = await getSongByBtsMembersData();
  multilineChart.drawChart(dates, series, keys).show();
}

const activationFunctions = [
  draw1,
  draw2,
  draw3,
  draw4,
  draw5,
];


const scroll = scroller().container();
scroll();

let lastIndex,
  activeIndex = 0;

scroll.on("active", function (index) {
  d3.selectAll(".step")
    .transition()
    .duration(500)
    .style("opacity", function (d, i) {
      return i === index ? 1 : 0.1;
    });

  activeIndex = index;
  let sign = activeIndex - lastIndex < 0 ? -1 : 1;
  let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
  console.log("scrolledSections", scrolledSections);
  scrolledSections.forEach((i) => {
    console.log("section", i);
    activationFunctions[i]();
  });
  lastIndex = activeIndex;
});
