<script>
	import stylingConstants from '$lib/components/styling-constants';
	import ButtonCircular from '$lib/components/ButtonCircular.svelte';

	export let onClickFunction = undefined;
	export let faIcon = 'fa-ellipsis fa-fw';
	export let faIconFontSize = '0.75rem';
	export let faIconPadding = '0.25rem';
	export let iconColor = stylingConstants.colors.textColorLight;
	export let backgroundColor = 'transparent';
	export let tooltip = '';
</script>

<div class="node-actions-button-container">
	<div class="node-actions-button-wrapper">
		<ButtonCircular
			{onClickFunction}
			{faIcon}
			{faIconFontSize}
			padding={faIconPadding}
			{iconColor}
			{backgroundColor}
			{tooltip}
		/>
	</div>
</div>

<style>
	.node-actions-button-container {
		width: 100%;
		float: right;
	}

	.node-actions-button-wrapper {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 0px;
		right: 0px;
		border: none;
		letter-spacing: 2px;
		padding: 0.3rem;
		font-weight: bold;
	}
</style>
