<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../styling-constants';

	export let isEnabled = true;
	export let inputValue;

	let altNamesContainerDynamicClass = css`
		border: 2px solid ${stylingConstants.colors.activeColor};
		:hover  {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
	`;

	let altNamesContainerDisabledDynamicClass = css`
		border: 2px solid transparent;
		:hover  {
			border: 2px solid none;
		}
	`;
</script>

<div
	id="bio-alt-names-container"
	class="{isEnabled
		? altNamesContainerDynamicClass
		: altNamesContainerDisabledDynamicClass} bio-alt-names-container"
>
	<div id="alt-names-scrollable-container" class="alt-names-scrollable-container" />
</div>

<style>
	.bio-alt-names-container {
		height: 2vw;
		background-color: white;
	}
</style>
