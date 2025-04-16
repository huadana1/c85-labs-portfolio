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

    //  let colors = d3.scaleQuantize().range(d3.schemeBlues[5]); 


    let liveText = "";

    function toggleWedge (index, event) {
        if (!event.key || event.key === "Enter") {
            selectedIndex = selectedIndex === index ? -1 : index;
            const d = data[index];
            liveText = `${d.label}: ${d.value} projects selected.`;
        }
    }

    $: description = `A pie chart showing project counts by year. ${data.map(d => `${d.label}: ${d.value} projects`).join(', ')}.`;


</script>

<div class = "pie-chart-container">
    <svg viewBox="-50 -50 100 100" role = "img" aria-labelledby="pie-title pie-desc">
    <title id="pie-title">Projects by Year</title>
    <desc id="pie-desc">{description}</desc>
    <circle class="pie-outline" r="50" />
        {#each arcs as arc, index}
            <path tabindex="0" role="button" aria-label d={ arc } fill={ colors(index) } 
            class:selected={selectedIndex === index} 
            on:click={e => toggleWedge(index, e)}
            />
        {/each}
    </svg>

    <p aria-live="polite" class="sr-only">{liveText}</p>

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
    .sr-only {
        position: absolute;
        left: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    }

    .pie-outline {
        stroke: black;
        fill: none;
        stroke-width: 1;
    }



    svg {
        max-width: 20em;
        margin-block: 2em;

        /* Do not clip shapes outside the viewBox */
        overflow: visible;
    }
    
    path {
        outline: none;
        transition: 300ms;
    }

    /* When any path is hovered, make non-hovered paths 50% opacity */
    svg:has(path:hover) path:not(:hover), svg:focus-visible path:not(:focus-visible) {
        opacity: 50%;
    }

    path:focus-visible {
        stroke: white;
        stroke-width: 2px;
        stroke-dasharray: 4; /* Adjust the dash length as needed */
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

    ul:has(.selected) li:not(.selected) {
        color: gray;
    }

    .swatch {
        height: 10px; 
        aspect-ratio: 1/1;
        background-color: var(--color);
        border-radius: 50%;
    }

    ul {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(8em, 1fr));
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
