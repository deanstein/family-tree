<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	export let label = 'Fact Label';

	let fieldLabelDynamicClass = css`
		font-size: ${stylingConstants.sizes.bioFieldFontSize};
		color: ${stylingConstants.colors.textColor};
	`;
</script>

<div id="bio-fact-label-container" class="bio-fact-label-container">
	<div id="bio-fact-label" class={fieldLabelDynamicClass}>
		{label}
	</div>
</div>

<style>
	.bio-fact-label-container {
		display: flex;
		margin-bottom: 0.5vh;
	}
</style>
