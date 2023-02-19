<script>
    export let inputValue;
</script>

<div id="text-input-container" class="text-input-container">
    <input type='text' value={inputValue} id='text-input' class='text-input' on:click|stopPropagation on:keydown|stopPropagation>
</div>

<style>
    .text-input-container {
        display: flex;
    }

    .text-input {
        width: 100%;
        text-align: center;
    }
</style>
