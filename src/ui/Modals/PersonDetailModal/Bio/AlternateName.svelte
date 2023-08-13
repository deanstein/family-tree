<script>
	import { css } from '@emotion/css';
	import stylingConstants from '../../styling-constants';
	import { setEditAltName } from '../../../logic/temp-management';

	export let alternateName;
	export let isEnabled;

	let alternateNameDynamicClass;

	const alternateNameOnClickAction = () => {
		setEditAltName(alternateName);
	};

	$: {
		alternateNameDynamicClass = css`
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

<div id="alternate-name-container" class="alternate-name-container">
	<div
		id="alternate-name"
		class="{alternateNameDynamicClass} alternate-name"
		on:click={alternateNameOnClickAction}
		on:keypress={alternateNameOnClickAction}
	>
		{alternateName.name}
	</div>
</div>

<style>
	.alternate-name-container {
		display: flex;
		align-items: center;
	}

	.alternate-name {
		padding: 5px;
	}

	.alternate-name-type-tag {
	}
</style>
