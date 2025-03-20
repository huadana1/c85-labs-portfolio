<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";
    
    import { onMount } from "svelte";

    let githubData = null;
    let loading = true;
    let error = null;

    onMount(async () => {
      try {
        if (!!githubData) {
            const response = await fetch("https://api.github.com/users/huadana1");
            githubData = await response.json();
        }
        
      } catch (err) {
        error = err;
      }
      loading = false;
    });

</script>

<h1>Dana</h1>
<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi numquam sed labore sunt, facere at vero repellendus adipisci deleniti consequatur? Pariatur ipsum rerum explicabo sit expedita, voluptatum soluta repellat nostrum.</p>

<img src="images/dana.jpg" alt="headshot of me"/>

{#if loading}
    <p>Loading...</p>
{:else if error}
    <p class="error">Something went wrong: {error.message}</p>
{:else}
    <section>
        <h2>My GitHub Stats</h2>
        <dl>
            <dt>Followers</dt>
            <dd>{githubData.followers}</dd>
            <dt>Following</dt>
            <dd>{githubData.following}</dd>
            <dt>Public Repositories</dt>
            <dd>{githubData.public_repos}</dd>
        </dl>
    </section>
{/if}


<h2>Latest projects</h2>
<div class="projects">
    {#each projects.slice(0, 3) as p}
        <Project data="{p}" hLevel="3" />
    {/each}
</div>
