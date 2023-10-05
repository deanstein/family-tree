<script>
	import { onMount } from 'svelte';

	import { getBuildCode } from '../logic/utils';
	import uiState from '../stores/ui-state';

	export let appVersion;
	export let schemaVersion;

	let buildCode = 'yyymmdd.nnn'; // date and number of commits

	const copyrightYear = new Date().getFullYear();

	const toggleDevTools = () => {
		uiState.update((currentValue) => {
			currentValue.showDevTools = !currentValue.showDevTools;
			return currentValue;
		});
	};

	onMount(async () => {
		// get the lgetBuildCode the deployment repo
		buildCode = await getBuildCode();
	});
</script>

<div id="footer-outer-container" class="footer-outer-container">
	<div id="copyright" class="footer-item">(C) JDG {copyrightYear}</div>
	<div id="version" class="footer-item">
		| App: v{appVersion} | Schema: v{schemaVersion} | Build: {buildCode} |
		<a on:click={toggleDevTools} on:keypress={toggleDevTools}
			>{!$uiState.showDevTools ? 'Show Dev Tools' : 'Hide Dev Tools'}</a
		>
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
		font-size: 1.5vh;
		height: 5vh;
		background-color: lightgrey;
	}

	.footer-item {
		padding-left: 5px;
	}

	a {
		cursor: pointer;
	}
</style>
