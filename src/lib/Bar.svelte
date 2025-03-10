<script>
    import * as d3 from 'd3';

    export let data = [];

    let width = 400;
	let height = 200;

    let rolledData = d3.rollups(data, v => v.length, d => d.year);
    let barData = rolledData.map(([year, count]) => {
	    return { count: count, year: year };
    });

    $: xScale = d3.scaleLinear()
		.domain([0, d3.max(barData, (d) => d.count)])
		.range([0, width]);
	
	$: colorScale = d3.scaleOrdinal()
		.domain(barData.map(d => d.year))
		.range(d3.schemeTableau10)

</script>

<svg {width} {height}>
	{#each barData as d, i}
		<rect class="bar"
					x="0"
					y={i * 25}
					width={xScale(d.count)}
					height="25"
					fill={colorScale(d.year)} />
	
		<text class="label"
					x={xScale(d.count)}
					y={i * 25}
					dx="-5"
					dy="1.2em">
			{d.year}: {d.count}
		</text>
	{/each}
</svg>

<style>
	.bar {
		stroke: white;
	}
	
	.label {
		fill: white;
		font-size: small;
		text-anchor: end;
	}
</style>