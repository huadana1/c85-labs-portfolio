<script>
    import * as d3 from 'd3';

    export let data = [];

    let width = 400;
    let height = 50; // One bar height
    let margin = { left: 50, right: 10, top: 10, bottom: 10 };

    // Process data: Group by year and count occurrences
    let rolledData = d3.rollups(data, v => v.length, d => d.year);

    let total = d3.sum(rolledData, ([, count]) => count);

    let barData = rolledData.map(([year, count]) => ({
        year,
        count,
        percent: count / total // Normalize to percentage
    }));

    // Cumulative percentage to position stacked segments
    let cumulative = 0;
    barData = barData.map(d => {
        let start = cumulative;
        cumulative += d.percent;
        return { ...d, start, end: cumulative };
    });

    // Scales
    let colorScale = d3.scaleOrdinal()
        .domain(barData.map(d => d.year))
        .range(d3.schemeTableau10);

</script>

<svg {width} height={height + margin.top + margin.bottom}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        {#each barData as d}
            <rect 
                x={d.start * (width - margin.left - margin.right)}
                y="0"
                width={(d.percent * (width - margin.left - margin.right))}
                height={height}
                fill={colorScale(d.year)}
                stroke="white"
            />
            
            <!-- Percentage Labels -->
            {#if d.percent > 0.1} <!-- Only show labels for larger sections -->
                <text 
                    x={(d.start + d.percent / 2) * (width - margin.left - margin.right)}
                    y={height / 2}
                    dy=".35em"
                    text-anchor="middle"
                    fill="white"
                    font-size="12px"
                >
                    {Math.round(d.percent * 100)}%
                </text>
            {/if}
        {/each}
    </g>

    <!-- Label for the whole bar -->
    <text 
        x="10" 
        y={height / 2 + margin.top} 
        text-anchor="start" 
        font-size="14px"
        font-weight="bold"
    >
        Year
    </text>
</svg>

<style>
    text {
        font-family: Arial, sans-serif;
    }
</style>
