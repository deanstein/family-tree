<script>
    export let modalTitle;
    export let showCloseButton;
    export let modalWidth;
    export let modalHeight;
    export let zIndex;
</script>

<div id="modal-frame-container" class="modal-frame-container">
    <div id="modal-frame-content" class="modal-frame-content">
        <slot />
    </div>
    <div id="modal-frame-toolbar" class="modal-frame-toolbar">
        <slot />
    </div>
</div>

<style>
    .modal-frame-container {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100%;
        border-radius: 10px;
    }

    .modal-frame-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1vh;
		padding: 1vw;
		background-color: lightGray;
    }
</style>