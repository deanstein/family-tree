<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	export let label = 'Fact Label';

	let fieldLabelCss = css`
		color: ${stylingConstants.colors.textColor};
	`;
</script>

<div class="bio-fact-label-container">
	<div class={fieldLabelCss}>
		{label}
	</div>
</div>

<style>
	.bio-fact-label-container {
		display: flex;
		margin-bottom: 0.5vh;
	}
</style>
