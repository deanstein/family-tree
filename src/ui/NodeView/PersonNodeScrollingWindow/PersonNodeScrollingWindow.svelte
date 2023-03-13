<script>
    import PersonNode from "../PersonNode/PersonNode.svelte";

    export let aPersonIdsToDisplayAsNodes;
</script>

<div id='person-node-scrolling-window-container' class='person-node-scrolling-window-container'>
    {#each aPersonIdsToDisplayAsNodes as sPersonId}
    <PersonNode
        sPersonId={sPersonId}
    />
    {/each}
</div>

<style>
    .person-node-scrolling-window-container {
        display: flex;
        position: absolute;
        justify-content: center;
        top: 100%;
        gap: 10px;
        padding: 10px;
        background-color: gray;
    }
</style>