<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";
    import Pie from "$lib/Pie.svelte";
    import * as d3 from 'd3';



    let query = "";
    let filteredProjects;
    $: filteredProjects = projects.filter(project => {
        if (query) {
            let values = Object.values(project).join("\n").toLowerCase();
            return values.includes(query.toLowerCase());
        }
        return true;
    });

    let selectedYearIndex = -1;

    let selectedYear;
    $: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;
    $: filteredByYear = filteredProjects.filter(project => {
        if (selectedYear) {
            return project.year === selectedYear;
        }
        return true;
    });
    
    let pieData;

    $: {
        pieData = {};

        let rolledData = d3.rollups(filteredProjects, v => v.length, d => d.year);
        pieData = rolledData.map(([year, count]) => {
            return { value: count, label: year };
        });
    }


</script>

<svelte:head>
  <title>Projects</title>
</svelte:head>

<h1>{projects.length} Projects</h1>

<Pie data={pieData} bind:selectedIndex={selectedYearIndex} />
Selected year index: {selectedYearIndex}

<!-- <input type="search" bind:value={query}
       aria-label="Search projects" placeholder="🔍 Search projects…" /> -->

<div class="search-wrapper">
    <span aria-hidden="true" class="emoji">🔍</span>
    <input 
        type="search" 
        bind:value={query}
        aria-label="Search projects"
        placeholder="Search projects…" />
</div>


<div class="projects">
    {#each filteredByYear as p}
        <Project data={p} />
    {/each}
</div>

<style>
    input {
        width: 100%;
    }

    .search-wrapper {
        position: relative;
    }

    .emoji {
        position: absolute;
        left: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        font-size: 1rem;
    }
    
    input[type="search"] {
        padding-left: 2rem; /* gives space for the emoji */
        width: 100%;
    }



</style>