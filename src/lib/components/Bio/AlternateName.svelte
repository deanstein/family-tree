<script>
	import { css } from '@emotion/css';

	import { bioEditAltName } from '$lib/states/temp-state';
	import { showEditAlternateNameModal } from '$lib/states/ui-state';

	import stylingConstants from '$lib/components/styling-constants';

	export let alternateName;
	export let isEnabled;

	let alternateNameCss;

	const alternateNameOnClickAction = () => {
		showEditAlternateNameModal.set(true);
		bioEditAltName.set(alternateName);
	};

	$: {
		alternateNameCss = css`
			color: ${isEnabled ? 'white' : 'black'};
			font-size: ${stylingConstants.sizes.bioFieldFontSize};
			background-color: ${isEnabled
				? stylingConstants.colors.activeColor
				: stylingConstants.colors.activeColorSubtle};
			:hover {
				background-color: ${isEnabled
					? stylingConstants.colors.hoverColor
					: stylingConstants.colors.hoverColorSubtle};
			}
		`;
	}
</script>

<div class="alternate-name-container">
	<div
		class="alternate-name {alternateNameCss}"
		on:click={alternateNameOnClickAction}
		on:keypress={alternateNameOnClickAction}
		role="button"
		tabindex="0"
	>
		{alternateName.name}
	</div>
</div>

<style>
	.alternate-name-container {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.alternate-name {
		padding: 5px;
		border-radius: 5px;
	}
</style>
