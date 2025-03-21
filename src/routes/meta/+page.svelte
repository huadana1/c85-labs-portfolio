<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import Bar from '$lib/Bar.svelte';



    let data = [];
    let commits = [];
    let max_depth = 0;
    let avg_depth = 0;

    onMount(async () => {
        data = await d3.csv("/loc.csv", row => ({
            ...row,
            line: Number(row.line), // or just +row.line
            depth: Number(row.depth),
            length: Number(row.length),
            date: new Date(row.date + "T00:00" + row.timezone),
            datetime: new Date(row.datetime)
        }));

    
        commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
            let first = lines[0];
            let {author, date, time, timezone, datetime} = first;
            let ret = {
                id: commit,
                url: "https://github.com/vis-society/lab-7/commit/" + commit,
                author, date, time, timezone, datetime,
                hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                totalLines: lines.length
            };

            // Like ret.lines = lines
            // but non-enumerable so it doesn’t show up in JSON.stringify
            Object.defineProperty(ret, "lines", {
                value: lines,
                configurable: true,
                writable: true,
                enumerable: false,
            });

            return ret;
        });

        commits = commits.filter(commit => !/^0+$/.test(commit.id));

        max_depth = d3.max(data, d => d.depth);
        avg_depth = d3.mean(data, d => d.depth);
    });

    let width = 1000, height = 600;


    let margin = {top: 10, right: 10, bottom: 30, left: 20};

    let usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left
    };
    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;

    $: xScale = d3.scaleTime()
              .domain(d3.extent(commits.map(d => d.date)))
              .range([usableArea.left, usableArea.right])
              .nice();

    $: yScale = d3.scaleLinear()
                .domain([24, 0])
                .range([usableArea.bottom, usableArea.top]);

    let xAxis, yAxis, yAxisGridlines;

    $: {
        d3.select(xAxis).call(d3.axisBottom(xScale));
        d3.select(yAxis).call(d3.axisLeft(yScale));
        d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
    }
    

    $: {
	d3.select(yAxisGridlines).call(
		d3.axisLeft(yScale)
		  .tickFormat("")
		  .tickSize(-usableArea.width)
        );
    }

    let hoveredIndex = -1;
    $: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};

    let cursor = {x: 0, y: 0};

    let clickedCommits = [];

    async function dotInteraction (index, evt) {
        let hoveredDot = evt.target;
        if (evt.type === "mouseenter") {
            hoveredIndex = index;
            cursor = {x: evt.x, y: evt.y};
            tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
                strategy: "fixed", // because we use position: fixed
                middleware: [
                    offset(5), // spacing from tooltip to dot
                    autoPlacement() // see https://floating-ui.com/docs/autoplacement
                ],
            });        }
        else if (evt.type === "mouseleave") {
            hoveredIndex = -1
        }

        else if (evt.type === "click") {
            let commit = commits[index]
            if (!clickedCommits.includes(commit)) {
                // Add the commit to the clickedCommits array
                clickedCommits = [...clickedCommits, commit];
            }
            else {
                    // Remove the commit from the array
                    clickedCommits = clickedCommits.filter(c => c !== commit);
            }
        }
    }

    $: allTypes = Array.from(new Set(data.map(d => d.type)));
    $: selectedLines = (clickedCommits.length > 0 ? clickedCommits : commits).flatMap(d => d.lines);
    $: selectedCounts = d3.rollup(
        selectedLines,
        v => v.length,
        d => d.type
    );
    $: languageBreakdown = allTypes.map(type => [type, selectedCounts.get(type) || 0]);

</script>

<p>Total lines of code: {data.length}</p>

<dl class="stats">
	<dt>Total <abbr title="Lines of code">LOC</abbr></dt>
	<dd>{data.length}</dd>
    <dd>{max_depth}</dd>
    <dd>{avg_depth}</dd>
</dl>

<h3> Commits by time of day </h3>
<svg viewBox="0 0 {width} {height}">
    <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
	<g class="dots">
    {#each commits as commit, index }
        <circle
            class:selected={ clickedCommits.includes(commit) }
            on:mouseenter={evt => dotInteraction(index, evt)}
	        on:mouseleave={evt => dotInteraction(index, evt)}
            on:click={evt => dotInteraction(index, evt)}
            cx={ xScale(commit.datetime) }
            cy={ yScale(commit.hourFrac) }
            r="5"
            fill="steelblue"
        />
    {/each}
    </g>
</svg>

<Bar data={languageBreakdown} width={width} />


{JSON.stringify(cursor, null, "\t")}

<dl class="info tooltip" hidden={hoveredIndex === -1} style="top: {cursor.y}px; left: {cursor.x}px">
	<dt>Commit</dt>
	<dd><a href="{ hoveredCommit.url }" target="_blank">{ hoveredCommit.id }</a></dd>

	<dt>Date</dt>
	<dd>{ hoveredCommit.datetime?.toLocaleString("en", {dateStyle: "full"}) }</dd>

	<!-- Add: Time, author, lines edited -->
</dl>




<style>
	svg {
		overflow: visible;
	}

    .gridlines {
	stroke-opacity: .2;
    }

    circle {
        transition: 200ms;
        transform-origin: center;
        transform-box: fill-box;

        &:hover {
            transform: scale(1.5);
        }
    }


    dl.info {
        /* ... other styles ... */
        background-color: oklch( 100% 0% 0/80%);
        
        transition-duration: 500ms;
        transition-property: opacity, visibility;

        &[hidden]:not(:hover, :focus-within) {
            opacity: 0;
            visibility: hidden;
        }
    }

    .selected {
        fill: var(--color-accent);
    }

</style>
