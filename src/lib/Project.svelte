<script>
    export let data = {};
    export let hLevel = 2;
</script>

<article>
    <svelte:element this={"h" + hLevel}>{data.title}</svelte:element>
    <img src={data.image} alt="">
    <div>
        <p>{data.description}</p>
        <p>c. {data.year}</p>
    </div>
</article>

<style>
    p {
        font-family: "Baskerville";
        font-variant-numeric: oldstyle-nums;
    }
</style>