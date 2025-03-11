<script>
    import * as d3 from 'd3';

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let arc = arcGenerator({
        startAngle: 0,
        endAngle: 2 * Math.PI
    });

    export let data = [];
    export let selectedIndex = -1;

    let sliceGenerator = d3.pie().value(d => d.value);
    // let arcData = sliceGenerator(data);
    // let arcs = arcData.map(d => arcGenerator(d));

    let arcData;
    let arcs;

    $: {
        arcData = sliceGenerator(data);
        arcs = arcData.map(d => arcGenerator(d));
    }

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

</script>

<div class = "pie-chart-container">
    <svg viewBox="-50 -50 100 100">
        {#each arcs as arc, index}
            <path d={ arc } fill={ colors(index) } 
            class:selected={selectedIndex === index} 
            on:click={e => selectedIndex = selectedIndex === index ? -1 : index} />
        {/each}
    </svg>

    <ul class="legend">
        {#each data as d, index}
            <li style="--color: { colors(index) }" class:selected={selectedIndex === index}>
                <span class="swatch"></span>
                {d.label} <em>({d.value})</em>
            </li>
        {/each}
    </ul>
</div>




<style>
    svg {
        max-width: 20em;
        margin-block: 2em;

        /* Do not clip shapes outside the viewBox */
        overflow: visible;
    }
    
    

    /* svg:has(path:hover) path:not(:hover) {
        opacity: 50%;
    } */

    path {
        transition: 300ms;
    }

    /* .selected {
        --color: oklch(60% 45% 0) !important;

        &:is(path) {
            fill: var(--color);
        }
    } */
    
    /* When any path is hovered, make non-hovered paths 50% opacity */
    svg:has(path:hover) path:not(:hover) {
        opacity: 50%;
    }

    /* When a path is selected, make all non-selected paths 50% opacity */
    svg:has(.selected) path:not(.selected) {
        opacity: 50%;
    }

    /* Ensure hovered path always has full opacity */
    path:hover {
        opacity: 100% !important;
    }

    /* Selected paths should have a specific fill color */
    .selected {
        --color: oklch(60% 45% 0) !important;
        
        &:is(path) {
            fill: var(--color) !important;
        }
        
        &:is(li) {
            color: var(--color);
        }
    }
    /* .selected {
	--color: oklch(60% 45% 0) !important;

	&:is(path) {
		fill: var(--color);
	} */
/* } */

    ul:has(.selected) li:not(.selected) {
        color: gray;
    }

    .swatch {
        /* display: inline-block; */
        /* /* width: 10px; */
        height: 10px; 
        aspect-ratio: 1/1;
        background-color: var(--color);
        border-radius: 50%;
    }

    ul {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(9em, 1fr));
    }

    li {
        display: flex;
        align-items: center;
        gap: 0.5em;
    }

    .legend {
        border: 1px solid black;
        padding: 8px;
        margin: auto;
        flex: 1;
    }

    .pie-chart-container {
        display: flex;
        gap: 5em;
    }
</style>
