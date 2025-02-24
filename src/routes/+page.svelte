<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";
</script>

<h1>Dana</h1>
<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi numquam sed labore sunt, facere at vero repellendus adipisci deleniti consequatur? Pariatur ipsum rerum explicabo sit expedita, voluptatum soluta repellat nostrum.</p>

<img src="images/dana.jpg" alt="headshot of me"/>

<h2>Latest projects</h2>
<div class="projects">
    {#each projects.slice(0, 3) as p}
        <Project data="{p}" hLevel="3" />
    {/each}
</div>
