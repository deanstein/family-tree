<script>
</script>

<div id="modal-actions-bar" class="modal-actions-bar">
	<slot />
</div>

<style>
	.modal-actions-bar {
		display: flex;
		width: -webkit-fill-available;
		width: -moz-available;
		gap: 0.5vw;
		margin-top: 1.5vh;
		justify-content: right;
		padding: 0 10px 10px 10px;
	}
</style>
