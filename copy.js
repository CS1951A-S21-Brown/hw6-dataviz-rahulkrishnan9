let radius = Math.min(graph_2_width, graph_2_height) / 2 - margin

let svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height)
    .append("g")
    .attr("transform", `translate(${(graph_2_width / 2)} , ${graph_2_height / 2})`);

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

        data = cleanData(data, function(a, b) { return parseFloat(b["value"]) - parseFloat(a["value"]) }, 5);

        let color = d3.scaleOrdinal()
        .domain(data)
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

        let pie = d3.pie()
        .value(function(d) { return d["value"]; });

        let path = d3.arc()
                     .outerRadius(radius - 10)
                     .innerRadius(0);

        let label = d3.arc()
                      .outerRadius(radius)
                      .innerRadius(radius - 80);

        let arc = svg2.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

        arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return color(d.data.key); });

        arc.append("text")
        .attr("transform", function(d) { return `translate(` + label.centroid(d) + `)`; })
        .text(function(d) { return d.data.key; });

    });

    svg2.append("g")
    .attr("transform", `translate(` + (graph_2_width / 2 - 120) + `,` + 20 + `)`)
    .append("text")
    .text("Most popular genres")
    .attr("class", "title")

}

setData2("Global_Sales");
