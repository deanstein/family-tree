<script>
	import uiState from '../stores/uiState';

	export let sAppVersion;
	export let sDataVersion;

	const toggleDevTools = () => {
		uiState.update((currentValue) => {
			currentValue.showDevTools = !currentValue.showDevTools;
			return currentValue;
		});
	};
</script>

<div id="footer-outer-container" class="footer-outer-container">
	<div id="copyright" class="footer-item">(C) JDG 2023</div>
	<div id="version" class="footer-item">
		| App: v{sAppVersion} | Data: v{sDataVersion} |
		<a on:click={toggleDevTools}>{!$uiState.showDevTools ? 'Show Dev Tools' : 'Hide Dev Tools'}</a>
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
	}

	.footer-item {
		padding-left: 5px;
	}
</style>
