const width = 960; // Set the desired width of the SVG
const height = 500; // Set the desired height of the SVG


(async function () {
    const data = await getDataChart();
    const svg = d3.select("#dynamicCharts") // Select the <body> element
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Define the missing variables and functions
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const n = 10; // Specify the number of bars to display
    const names = new Set(data.map(d => d.name));
    const formatNumber = d3.format(".3f");

    const datevalues = Array.from(d3.rollup(data, ([d]) => d.value, d => d.date, d => d.name)) // Use rollup instead of d3.rollup
        .map(([date, data]) => [new Date(date), data])
        .sort(([a], [b]) => d3.ascending(a, b));

    const duration = 250;
    const k = 10;
    const keyframes = [];
    let ka, a, kb, b;
    for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
        for (let i = 0; i < k; ++i) {
            const t = i / k;
            keyframes.push([
                new Date(ka * (1 - t) + kb * t),
                rank(name => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t)
            ]);
        }
    }
    keyframes.push([new Date(kb), rank(name => b.get(name) || 0)]);

    const nameframes = d3.groups(keyframes.flatMap(([, data]) => data), d => d.name);
    const prev = new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])));
    const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));

    const barSize = 48;
    const x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);
    const y = d3
        .scaleBand()
        .domain(d3.range(n + 1))
        .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
        .padding(0.1);

    const formatDate = d3.utcFormat("%Y");

    const color = d3
        .scaleOrdinal(d3.schemeTableau10)
        .domain(Array.from(names, name => name));

    const updateBars = bars(svg);
    const updateAxis = axis(svg);
    const updateLabels = labels(svg);
    const updateTicker = ticker(svg);

    // Define the plot function
    async function plot(data) {
        for (const keyframe of keyframes) {
            const transition = svg.transition()
                .duration(duration)
                .ease(d3.easeLinear);

            // Extract the top bar’s value.
            x.domain([0, keyframe[1][0].value]);

            updateAxis(keyframe, transition);
            updateBars(keyframe, transition);
            updateLabels(keyframe, transition);
            updateTicker(keyframe, transition);

            await transition.end();
        }
    }

    function bars(svg) {
        let bar = svg.append("g")
            .attr("fill-opacity", 0.6)
            .selectAll("rect");

        return ([date, data], transition) => bar = bar
            .data(data.slice(0, n), d => d.name)
            .join(
                enter => enter.append("rect")
                    .attr("fill", color)
                    .attr("height", y.bandwidth())
                    .attr("x", x(0))
                    .attr("y", d => y((prev.get(d) || d).rank))
                    .attr("width", d => x((prev.get(d) || d).value) - x(0)),
                update => update,
                exit => exit.transition(transition).remove()
                    .attr("y", d => y((next.get(d) || d).rank))
                    .attr("width", d => x((next.get(d) || d).value) - x(0))
            )
            .call(bar => bar.transition(transition)
                .attr("y", d => y(d.rank))
                .attr("width", d => x(d.value) - x(0)));
    }

    function labels(svg) {
        let label = svg.append("g")
            .style("font", "bold 12px var(--sans-serif)")
            .style("font-variant-numeric", "tabular-nums")
            .attr("text-anchor", "end")
            .selectAll("text");

        return ([date, data], transition) => label = label
            .data(data.slice(0, n), d => d.name)
            .join(
                enter => enter.append("text")
                    .attr("transform", d => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
                    .attr("y", y.bandwidth() / 2)
                    .attr("x", -6)
                    .attr("dy", "-0.25em")
                    .text(d => d.name)
                    .call(text => text.append("tspan")
                        .attr("fill-opacity", 0.7)
                        .attr("font-weight", "normal")
                        .attr("x", -6)
                        .attr("dy", "1.15em")),
                update => update,
                exit => exit.transition(transition).remove()
                    .attr("transform", d => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
                    .call(g => g.select("tspan").tween("text", d => textTween(d.value, (next.get(d) || d).value)))
            )
            .call(bar => bar.transition(transition)
                .attr("transform", d => `translate(${x(d.value)},${y(d.rank)})`)
                .call(g => g.select("tspan").tween("text", d => textTween((prev.get(d) || d).value, d.value))))
    }

    function axis(svg) {
        const g = svg.append("g")
            .attr("transform", `translate(0,${margin.top})`);

        const axis = d3.axisTop(x)
            .ticks(width / 160)
            .tickSizeOuter(0)
            .tickSizeInner(-barSize * (n + y.padding()));

        return (_, transition) => {
            g.transition(transition).call(axis);
            g.select(".tick:first-of-type text").remove();
            g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
            g.select(".domain").remove();
        };
    }

    function ticker(svg) {
        const now = svg.append("text")
            .style("font", `bold ${barSize}px var(--sans-serif)`)
            .style("font-variant-numeric", "tabular-nums")
            .attr("text-anchor", "end")
            .attr("x", width - 6)
            .attr("y", margin.top + barSize * (n - 0.45))
            .attr("dy", "0.32em")
            .text(formatDate(keyframes[0][0]));

        return ([date], transition) => {
            transition.end().then(() => now.text(formatDate(date)));
        };
    }

    function textTween(a, b) {
        const i = d3.interpolateNumber(a, b);
        return function (t) {
            this.textContent = formatNumber(i(t));
        };
    }

    function rank(value) {
        const data = Array.from(names, name => ({ name, value: value(name) }));
        data.sort((a, b) => d3.descending(a.value, b.value));
        for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
        return data;
    }

    // Call the plot function with the initial data
    plot(data);
})();
async function getDataChart() {
    return await new Promise( (resolve, reject) => {
        fetch('/api/dyCharts').then(response => response.json()).then(data => {
            resolve(data)
        }
        )
    })
};