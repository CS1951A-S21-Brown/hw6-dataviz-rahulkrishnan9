// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};
const NUM_EXAMPLES = 10;

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 275;

let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let tooltip = d3.select("#graph1")
.append("div")
.attr("class", "tooltip")
.style("opacity", 0);

let x = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

let y = d3.scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1);

let countRef = svg.append("g");

let y_axis_label = svg.append("g");

let x_axis_text = svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
                                ${(graph_1_height - margin.top - margin.bottom) + 30})`)
    .style("text-anchor", "middle");

svg.append("text")
    .attr("transform", `translate(-130, ${((graph_1_height - margin.top - margin.bottom) / 2) + 10})`)
    .style("text-anchor", "middle")
    .text("Name");

let title = svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);

function setData(attr) {

    d3.csv("../data/video_games.csv").then(function(data) {
        data = cleanData(data, function(a, b) { return parseFloat(b[attr]) - parseFloat(a[attr]) }, NUM_EXAMPLES);
        x.domain([0, d3.max(data, function(d) { return d[attr]; })]);
        y.domain(data.map(function(d) { return d["Name"] }));
        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

        let color = d3.scaleOrdinal()
            .domain(data)
            .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#ff5c7a"), data.length));

        let mouseover = function(d) {
            let color_span = `<span style="color: ${color(d["Name"])};">`;
            let html = `${d["Publisher"]}<br/>
                    ${color_span}${d["Name"]}</span><br/>
                    Sales: ${color_span}${d[attr]}</span>`;

            tooltip.html(html)
                .style("right", `${(d3.event.pageX) - 220}px`)
                .style("top", `${(d3.event.pageY) - 30}px`)
                .style("box-shadow", `2px 2px 5px ${color(d["Name"])}`)

            tooltip.transition()
            .duration(200)
            .style("opacity", 0.9)
        };

        let mouseout = function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        };

        let bars = svg.selectAll("rect").data(data);

        bars.enter()
            .append("rect")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("x", x(0))
            .attr("y", function(d){ return y(d["Name"]) })
            .attr("width", function(d) { return x(d[attr]); })
            .attr("height",  y.bandwidth());

        let counts = countRef.selectAll("text").data(data);

        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d){ return x(d[attr]) +15 })
            .attr("y", function(d){ return y(d["Name"]) +15 })
            .style("text-anchor", "start")
            .text(function(d){ return (d[attr]); });

        x_axis_text.text(attr);
        title.text("Top "+ attr+" of All Time (in Millions)");


        bars.exit().remove();
        counts.exit().remove();
    });
}

function cleanData(data, comparator, numExamples) {
    return data.sort(comparator).slice(0,numExamples)
}

setData("Global_Sales");

let svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x_2 = d3.scaleLinear()
        .range([0, graph_2_width - margin.left - margin.right]);

let y_2 = d3.scaleBand()
.range([0, graph_2_height - margin.top - margin.bottom])
.padding(0.1);

let y_axis_label_2 = svg2.append("g");

let x_axis_text2 = svg2.append("text")
.attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
                                        ${(graph_2_height - margin.top - margin.bottom) + 30})`)

let y_axis_text2 = svg2.append("text")
.attr("transform", `translate(-120, ${((graph_2_height - margin.top - margin.bottom) / 2) + 5})`)
.text("Name");


let countRef2 = svg2.append("g");

let title2 = svg2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);

function setData2(attr) {
    d3.csv("../data/video_games.csv").then(function(data) {
        data = d3.nest()
        .key(function(d) { return d["Genre"]; })
        .rollup(function(g) {return parseInt(d3.sum(g, function(d) { return d[attr]; })); })
        .entries(data);

        data = cleanData(data, function(a, b) { return parseFloat(b["value"]) - parseFloat(a["value"]) }, NUM_EXAMPLES);

        x_2.domain([0, d3.max(data, function(d) { return d["value"]; })]);
        y_2.domain(data.map(function(d) { return d["key"] }));
        y_axis_label_2.call(d3.axisLeft(y_2).tickSize(0).tickPadding(10));
        let bars = svg2.selectAll("rect").data(data);

        bars.enter()
            .append("rect")
            .merge(bars)
            .attr("fill", "#a05d56")
            .transition()
            .duration(1000)
            .attr("x", x_2(0))
            .attr("y", function(d){ return y_2(d["key"]) })
            .attr("width", function(d) { return x_2(d["value"]); })
            .attr("height",  y_2.bandwidth());

        let counts = countRef2.selectAll("text").data(data);

        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d){ return x_2(d["value"]) +15 })
            .attr("y", function(d){ return y_2(d["key"]) +15 })
            .style("text-anchor", "start")
            .text(function(d){ return (d["value"]); });

        x_axis_text2.text(attr);
        title2.text("Most Popular Genres By "+ attr+" (in Millions)");

        bars.exit().remove();
        counts.exit().remove();

    });

}

setData2("Global_Sales");


let svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x_3 = d3.scaleLinear()
    .range([0, graph_3_width - margin.left - margin.right]);

let y_3 = d3.scaleBand()
    .range([0, graph_3_height - margin.top - margin.bottom])
    .padding(0.1);

let countRef3 = svg3.append("g");

let y_axis_label_3 = svg3.append("g");

let x_axis_text3 = svg3.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2},
                                ${(graph_3_height - margin.top - margin.bottom) + 30})`)

let y_axis_text3 = svg3.append("text")
    .attr("transform", `translate(-120, ${((graph_3_height - margin.top - margin.bottom) / 2) + 5})`)
    .text("Name");

let title3 = svg3.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);

function setData3(genre) {
    d3.csv("../data/video_games.csv").then(function(data) {
        map_data = d3.nest()
        .key(function(d) { return d["Genre"]; })
        .entries(data);
        console.log(d3.values(map_data))
        data = d3.nest()
        .key(function(d) { return d["Publisher"]; })
        .rollup(function(g) {return parseInt(d3.sum(g, function(d) { return d["Global_Sales"]; })); })
        .entries(d3.values(map_data[genre])[1]);
        data = cleanData(data, function(a, b) { return parseFloat(b["value"]) - parseFloat(a["value"]) }, NUM_EXAMPLES);
        console.log(data)
        x_3.domain([0, d3.max(data, function(d) { return d["value"]; })]);
        y_3.domain(data.map(function(d) { return d["key"] }));
        y_axis_label_3.call(d3.axisLeft(y_3).tickSize(0).tickPadding(10));
        let bars = svg3.selectAll("rect").data(data);

        var dict = {};
        dict[0] = "Sports";
        dict[1] = "Platform";
        dict[2] = "Racing";
        dict[3] = "Role-Playing";
        dict[4] = "Puzzle";
        dict[5] = "Misc";
        dict[6] = "Shooter";
        dict[7] = "Simulation";
        dict[8] = "Action";
        dict[9] = "Fighting";
        dict[10] = "Adventure";
        dict[11] = "Strategy";

        bars.enter()
            .append("rect")
            .merge(bars)
            .attr("fill", "#66a0e2")
            .transition()
            .duration(1000)
            .attr("x", x_3(0))
            .attr("y", function(d){ return y_3(d["key"]) })
            .attr("width", function(d) { return x_3(d["value"]); })
            .attr("height",  y_3.bandwidth());

        let counts = countRef3.selectAll("text").data(data);

        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d){ return x_3(d["value"]) +15 })
            .attr("y", function(d){ return y_3(d["key"]) +15 })
            .style("text-anchor", "start")
            .text(function(d){ return (d["value"]); });

        x_axis_text3.text("Sales in "+ dict[genre]);
        title3.text("Most Popular Publishers In "+ dict[genre]+" (in Millions)");

        bars.exit().remove();
        counts.exit().remove();
    });
}


setData3(0);
