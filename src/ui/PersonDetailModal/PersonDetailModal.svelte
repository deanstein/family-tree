<script>
	import { css } from '@emotion/css';
	import Portal from 'svelte-portal';

	import familyTreeData from '../../stores/family-tree-data';
	import uiState from '../../stores/ui-state';
	import stylingConstants from '../styling-constants';
	import { hidePersonDetailView } from '../../logic/ui-management';

	import Avatar from '../NodeView/PersonNode/Avatar.svelte';
	import Button from '../Button.svelte';
	import Overlay from '../NodeView/Overlay.svelte';
	import Timeline from './Timeline/Timeline.svelte';

	const personDetailContainerDynamicClass = css`
		z-index: ${stylingConstants.zIndices.personDetailViewZIndex};
	`;

	const personDetailContentContainerDynamicClass = css``;

	const closeButtonOnClick = () => {
		hidePersonDetailView();
	};
</script>

{#if $uiState.showPersonDetailView}
	<div id="person-detail-container" class="person-detail-container">
		<div
			id="person-detail-content-container"
			class="person-detail-content-container {personDetailContainerDynamicClass}"
		>
			<div id="person-detail-bio-container" class="person-detail-bio-container">
				<div id="person-detail-bio-content-container" class="person-detail-bio-content-container">
					<div id="person-detail-bio-avatar-container" class="person-detail-bio-avatar-container">
						<Avatar />
					</div>
					<div id="person-detail-bio-name" class="person-detail-bio-name">
						{$uiState.activePerson.name}
					</div>
					<div id="person-detail-bio-facts" class="person-detail-bio-facts">
						<div id="person-detail-bio-fact" class="person-detail-bio-fact">Also known as:</div>
						<div id="person-detail-bio-fact" class="person-detail-bio-fact">Gender:</div>
						<div id="person-detail-bio-fact" class="person-detail-bio-fact">Date of Birth:</div>
						<div id="person-detail-bio-fact" class="person-detail-bio-fact">Time of Birth:</div>
						<div id="person-detail-bio-fact" class="person-detail-bio-fact">Place of Birth:</div>
						<div id="person-detail-bio-fact" class="person-detail-bio-fact">Hometown:</div>
						<div id="person-detail-bio-fact" class="person-detail-bio-fact">Deceased?</div>
					</div>
				</div>
			</div>
			<div id="person-detail-timeline-container" class="person-detail-timeline-container">
				<div
					id="person-detail-timeline-content-container"
					class="person-detail-timeline-content-container"
				>
					<Timeline />
				</div>
			</div>
			<Button buttonText={'Close'} onClickFunction={closeButtonOnClick} />
		</div>
		<Portal target="#app-container">
			<Overlay />
		</Portal>
	</div>
{/if}

<style>
	.person-detail-container {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
	}

	.person-detail-content-container {
		display: flex;
		flex-direction: row;
		width: 80vw;
		height: 80vh;
		gap: 1vw;
		padding: 1vw;
		background-color: rgba(48, 48, 48, 0.8);
	}

	.person-detail-bio-container {
		display: flex;
		flex-direction: column;
		flex-basis: 33.333%;
	}

	.person-detail-bio-content-container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		justify-content: center;
		align-items: center;
		background-color: gainsboro;
		padding: 1vh;
	}

	.person-detail-bio-avatar-container {
		width: 20vh;
		height: 20vh;
	}

	.person-detail-bio-name {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 10px;
		color: white;
		font-size: 5vh;
	}

	.person-detail-bio-facts {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		gap: 1vh;
	}

	.person-detail-bio-fact {
		background-color: darkgray;
	}

	.person-detail-timeline-container {
		display: flex;
		flex-direction: column;
		flex-basis: 67.667%;
	}

	.person-detail-timeline-content-container {
		display: flex;
		flex-grow: 1;
		background-color: gainsboro;
		padding: 1vh;
	}
</style>
