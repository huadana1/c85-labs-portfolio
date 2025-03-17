<script>
    import { page } from "$app/stores";
    import "../style.css";

    let pages = [
        { url: "./", title: "Home" },
        { url: "./projects", title: "Projects" },
        { url: "./contact", title: "Contact" },
         { url: "./meta", title: "Meta" },
        // add the rest of your pages here
    ];

    let root = globalThis?.document?.documentElement;
    $: root?.style.setProperty("color-scheme", colorScheme);

    let localStorage = globalThis.localStorage ?? {};
    let colorScheme = localStorage.colorScheme ?? "light dark";
    $: localStorage.colorScheme = colorScheme;

</script>

<nav>
  {#each pages as p}
    <a href={p.url}
   class:current={"."+$page.route.id === p.url}
   target={p.url.startsWith("http") ? "_blank" : null}>
	{p.title}
</a>


  {/each}
</nav>

<label class="color-scheme">
  Theme:
  <select bind:value={ colorScheme }>
    <option value="light dark">Auto</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
  </select>
</label>

<slot />  

<style>
.color-scheme {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 80%;
  display: inline-flex;
  gap: 4px;
}

label {
  display: grid;
  grid-template-columns: subgrid;
}

select {
  font: inherit;
}
</style>