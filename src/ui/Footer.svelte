<script>
	export let sAppVersion;
	export let sDataVersion;
</script>

<div id="footer-outer-container" class="footer-outer-container">
	<div id='copyright' class='footer-item'>
		(C) JDG 2023
	</div>
	<div id='version' class='footer-item'>
		| App: {sAppVersion} | Data: {sDataVersion}
	</div>
</div>

<style>
	.footer-outer-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		width: -moz-available; /* WebKit-based browsers will ignore this. */
		width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
		height: 5vh;

		background-color: lightgrey;

		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.footer-item {
		padding-left: 5px;
	}
</style>
