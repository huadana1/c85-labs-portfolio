<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";

    import Bar from "$lib/Bar.svelte";
  import StackedBar from "$lib/StackedBar.svelte";
</script>

<svelte:head>
  <title>Projects</title>
</svelte:head>

<h1>{projects.length} Projects</h1>
<Bar data={projects}/>
<StackedBar data={projects}/>
<div class="projects">
    {#each projects as p}
        <Project data={p} />
    {/each}
</div>