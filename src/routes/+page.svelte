<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";
</script>

<h1>Dana</h1>
<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi numquam sed labore sunt, facere at vero repellendus adipisci deleniti consequatur? Pariatur ipsum rerum explicabo sit expedita, voluptatum soluta repellat nostrum.</p>

<img src="images/dana.jpg" alt="headshot of me"/>

{#await fetch("https://api.github.com/users/huadana1")}
  <p>Loading...</p>
{:then response}
  {#await response.json()}
    <p>Decoding...</p>
  {:then data}
    <section>
      <h2>My GitHub Stats</h2>
      <dl>
        <dt>Followers:</dt>
        <dd>{data.followers}</dd>
        <dt>Following:</dt>
        <dd>{data.following}</dd>
        <dt>Public Repositories:</dt>
        <dd>{data.public_repos}</dd>
      </dl>
    </section>
  {:catch error}
    <p class="error">Something went wrong: {error.message}</p>
  {/await}
{:catch error}
  <p class="error">Something went wrong: {error.message}</p>
{/await}

<h2>Latest projects</h2>
<div class="projects">
    {#each projects.slice(0, 3) as p}
        <Project data="{p}" hLevel="3" />
    {/each}
</div>
