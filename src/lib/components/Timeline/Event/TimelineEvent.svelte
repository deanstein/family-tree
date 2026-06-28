<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import timelineEventTypes from '$lib/schemas/timeline-event-types';
	import timelineEventOriginTypes from '$lib/schemas/timeline-event-origin-types';
	import timelineEventReference from '$lib/schemas/timeline-event-reference';

	import { timelineEditEvent } from '$lib/states/temp-state';

	import { getNumberOfYearsBetweenEvents, instantiateObject } from '$lib/utils';

	import { getPersonById, setActivePerson } from '$lib/tree-management';
	import { upgradeTimelineEvent } from '$lib/person-management';

	import { monthNames } from '$lib/components/strings';

	import { activePerson } from '$lib/states/family-tree-state';
	import {
		showTimelineEventDetailsModal,
		timelineFirstEventHeight,
		timelineLastEventHeight
	} from '$lib/states/ui-state';

	import { JDGButton } from 'jdg-ui-svelte';
	import ImageThumbnailGroup from '$lib/components/ImageThumbnailGroup.svelte';
	import stylingConstants from '$lib/components/styling-constants';

	export let timelineEvent;
	// if this is set, this event is a reference to someone else's event
	// so it will display and interact differently
	export let eventReference = instantiateObject(timelineEventReference);
	export let onClickFunction = undefined;
	export let backgroundColor = stylingConstants.colors.activeColorSubtle;
	export let rowIndex;

	let upgradedEvent;
	let eventDateCorrected;
	let eventAge;
	let eventRowDivRef;

	const onClickTimelineEvent = () => {
		// do nothing if this is the "today" event (no death date)
		// or if the event is not a self event
		if (
			upgradedEvent.originType !== timelineEventOriginTypes.self ||
			upgradedEvent.eventType === timelineEventTypes.today.type
		) {
			return;
		}
		showTimelineEventDetailsModal.set(true);
		timelineEditEvent.set(upgradedEvent);
	};

	const eventRowCss = css`
		color: ${stylingConstants.colors.textColor};

		> :nth-child(1) {
			margin-right: ${stylingConstants.sizes.timelineEventGapSize};
		}
	`;

	const eventDateYearCss = css`
		margin-left: ${stylingConstants.sizes.timelineEventGapSize};
	`;

	const eventDateCss = css`
		font-size: ${stylingConstants.sizes.timelineDateFontSize};
		width: ${stylingConstants.sizes.timelineEventYearWidth};
		color: ${stylingConstants.colors.textColor};
		background-color: ${stylingConstants.colors.activeColorSubtle};
	`;

	const eventYearCss = css`
		font-size: ${stylingConstants.sizes.timelineYearFontSize};
		width: ${stylingConstants.sizes.timelineEventYearWidth};
		color: ${stylingConstants.colors.textColor};
		background-color: ${stylingConstants.colors.activeColorSubtle};
	`;

	const eventNodeCss = css`
		height: ${stylingConstants.sizes.timelineEventNodeSize};
		background-color: ${stylingConstants.colors.textColorLight};
	`;

	const eventDetailLineCss = css`
		background-color: ${stylingConstants.colors.textColorLight};
	`;

	const eventTitleBarCss = css`
		background-color: ${stylingConstants.colors.timelineEventTitleBarColor};
		border-radius: ${stylingConstants.sizes.bioFieldBorderRadius}
			${stylingConstants.sizes.bioFieldBorderRadius} 0px 0px;
	`;

	const timelineEventTitlePrimaryCss = css`
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	`;

	const eventFaIconCss = css`
		color: ${stylingConstants.colors.textColor};
	`;

	const eventAgeCss = css`
		color: ${stylingConstants.colors.textColor};
	`;

	const eventContentCss = css`
		background-color: ${backgroundColor};
		border-radius: 0px 0px ${stylingConstants.sizes.bioFieldBorderRadius}
			${stylingConstants.sizes.bioFieldBorderRadius};
	`;

	const timelineEventSharedMetaCss = css`
		display: flex;
		align-items: center;
	`;

	onMount(() => {
		// upgrade the timeline event so it has the right fields for downstream operations
		upgradedEvent = upgradeTimelineEvent(timelineEvent);

		// birth and death events report their row height for the spine to align to
		if (upgradedEvent.eventType === timelineEventTypes.birth.type && eventRowDivRef) {
			const eventRowHeight = eventRowDivRef.getBoundingClientRect().height;
			timelineFirstEventHeight.set(eventRowHeight);
		}
		if (upgradedEvent.eventType === timelineEventTypes.death.type && eventRowDivRef) {
			const eventRowHeight = eventRowDivRef.getBoundingClientRect().height;
			timelineLastEventHeight.set(eventRowHeight);
		}

		// if onClick isn't provided, use this function
		onClickFunction =
			(onClickFunction ?? eventReference?.personId) ? () => {} : onClickTimelineEvent;
	});

	$: {
		if (upgradedEvent) {
			eventDateCorrected = new Date(upgradedEvent.eventDate);

			eventAge = getNumberOfYearsBetweenEvents($activePerson.birth.date, eventDateCorrected);
		}
	}

	// dynamic CSS
	let eventRowContainerCss = css``;
	$: {
		if (upgradedEvent) {
			eventRowContainerCss = css`
				cursor: ${upgradedEvent.originType !== timelineEventOriginTypes.self ||
				upgradedEvent.eventType === timelineEventTypes.today.type
					? 'default'
					: 'pointer'};
			`;
		}
	}

	let eventRowDynamicCss = css``;
	$: {
		if (upgradedEvent) {
			eventRowDynamicCss = css`
				grid-row: ${rowIndex};
				cursor: ${upgradedEvent.originType !== timelineEventOriginTypes.self ||
				upgradedEvent.eventType === timelineEventTypes.today.type
					? 'default'
					: 'pointer'};
				&:hover {
					background-color: ${upgradedEvent.originType !== timelineEventOriginTypes.self ||
					upgradedEvent.eventType === timelineEventTypes.today.type
						? ''
						: stylingConstants.colors.timelineEventBackgroundHoverColor};
				}
			`;
		}
	}
</script>

<div
	class="timeline-event-row {eventRowCss} {eventRowDynamicCss}"
	role="button"
	tabindex="0"
	on:click={onClickFunction}
	on:keydown={onClickFunction}
	bind:this={eventRowDivRef}
>
	<div class="timeline-event-date-year-container {eventDateYearCss}">
		<div class="timeline-event-date {eventDateCss}">
			<!-- show month name with three letters like AUG -->
			{eventDateCorrected?.toString() !== 'Invalid Date'
				? monthNames[eventDateCorrected?.getUTCMonth()] + ' ' + eventDateCorrected?.getUTCDate()
				: 'Date?'}
		</div>
		<div class="timeline-event-year {eventYearCss}">
			{eventDateCorrected?.toString() !== 'Invalid Date'
				? eventDateCorrected?.getUTCFullYear()
				: 'Year?'}
		</div>
		{#if upgradedEvent?.isApprxDate}
			<div class="timeline-event-date-apprx">(apprx.)</div>
		{/if}
	</div>
	<div class="timeline-event-node {eventNodeCss}" />
	<div class="timeline-event-line {eventDetailLineCss}" />
	<div class="timeline-event-content-outer-container {eventRowContainerCss}">
		<div class="timeline-event-title-bar {eventTitleBarCss}">
			<div class="timeline-event-title-primary {timelineEventTitlePrimaryCss}">
				<!-- event icon -->
				<i class="fa-solid {timelineEventTypes[upgradedEvent?.eventType]?.icon} {eventFaIconCss}" />
				<!-- hide age if this is the birth event -->
				{#if upgradedEvent?.eventType !== timelineEventTypes.birth.type}
					<div class="timeline-event-age {eventAgeCss}">
						{eventAge?.toString() !== 'NaN' ? 'Age: ' : ''}
						{eventAge?.toString() !== 'NaN' ? eventAge : ''}
					</div>
				{/if}
			</div>
			<!-- if this is a reference event, show who it's shared from -->
			{#if timelineEvent.originType === timelineEventOriginTypes.reference}
				<div class="timeline-event-shared-meta {timelineEventSharedMetaCss}">
					<span class="timeline-event-meta-divider">|</span>
					<span class="timeline-event-shared-label">Shared event from</span>
					<JDGButton
						onClickFunction={() => {
							setActivePerson(getPersonById(eventReference.personId));
						}}
						faIcon={'fa-circle-arrow-right'}
						backgroundColor={stylingConstants.colors.activePersonNodeColor}
						paddingLeftRight="8px"
						paddingTopBottom="2px"
						fontSize="12px"
						gap="6px"
						label={getPersonById(eventReference?.personId)?.name}
						tooltip={'Go to ' + getPersonById(eventReference?.personId)?.name}
					/>
				</div>
			{/if}
			<!-- if this event has associated people, show the first -->
			{#if upgradedEvent?.eventContent?.associatedPeopleIds?.length > 0 && upgradedEvent?.originType !== timelineEventOriginTypes.reference}
				<div class="timeline-event-shared-meta {timelineEventSharedMetaCss}">
					<span class="timeline-event-meta-divider">|</span>
					<span class="timeline-event-shared-label">Shared event with</span>
					<JDGButton
						onClickFunction={() => {
							setActivePerson(getPersonById(upgradedEvent?.eventContent?.associatedPeopleIds[0]));
						}}
						faIcon={'fa-circle-arrow-right'}
						backgroundColor={stylingConstants.colors.activePersonNodeColor}
						paddingLeftRight="8px"
						paddingTopBottom="2px"
						fontSize="12px"
						gap="6px"
						label={getPersonById(upgradedEvent?.eventContent?.associatedPeopleIds[0])?.name}
						tooltip={'Go to ' +
							getPersonById(upgradedEvent?.eventContent?.associatedPeopleIds[0])?.name}
					/>
					{#if upgradedEvent?.eventContent?.associatedPeopleIds?.length > 1}
						<span class="timeline-event-shared-label">and others</span>
					{/if}
				</div>
			{/if}
			<!-- if this is a contextual event, treat it specifically -->
			{#if upgradedEvent?.originType === timelineEventOriginTypes.contextual}
				<!-- child birth -->
				{#if upgradedEvent?.eventType === timelineEventTypes.childBirth.type}
					<div class="timeline-event-shared-meta {timelineEventSharedMetaCss}">
						<span class="timeline-event-meta-divider">|</span>
						<span class="timeline-event-shared-label">Shared event from</span>
						<JDGButton
							onClickFunction={() => {
								setActivePerson(getPersonById(upgradedEvent?.originMeta?.personId));
							}}
							faIcon={timelineEventTypes.childBirth.icon}
							backgroundColor={stylingConstants.colors.activePersonNodeColor}
							paddingLeftRight="8px"
							paddingTopBottom="2px"
							fontSize="12px"
							gap="6px"
							label={getPersonById(upgradedEvent?.originMeta?.personId)?.name}
							tooltip={'Go to ' + getPersonById(upgradedEvent?.originMeta?.personId)?.name}
						/>
					</div>
				{/if}
				<!-- parent death -->
				{#if upgradedEvent?.eventType === timelineEventTypes.parentDeath.type}
					<div class="timeline-event-shared-meta {timelineEventSharedMetaCss}">
						<span class="timeline-event-meta-divider">|</span>
						<span class="timeline-event-shared-label">Shared event from</span>
						<JDGButton
							onClickFunction={() => {
								setActivePerson(getPersonById(upgradedEvent?.originMeta?.personId));
							}}
							faIcon={timelineEventTypes.parentDeath.icon}
							backgroundColor={stylingConstants.colors.activePersonNodeColor}
							paddingLeftRight="8px"
							paddingTopBottom="2px"
							fontSize="12px"
							gap="6px"
							label={getPersonById(upgradedEvent?.originMeta?.personId)?.name}
							tooltip={'Go to ' + getPersonById(upgradedEvent?.originMeta?.personId)?.name}
						/>
					</div>
				{/if}
			{/if}
		</div>
		<div class="timeline-event-content {eventContentCss}">
			<div class="timeline-event-description">
				{upgradedEvent?.eventContent?.description
					? upgradedEvent?.eventContent?.description
					: 'Event description'}
			</div>
			{#if upgradedEvent?.eventContent?.images?.length > 0}
				<div class="timeline-event-image-preview">
					<!-- show a few of the timeline event images, if there are any -->
					<ImageThumbnailGroup
						imageArray={upgradedEvent?.eventContent?.images}
						showGroupTitle={false}
						showAddButton={false}
					/>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.timeline-event-row {
		max-width: 100%;
		display: flex;
		align-items: center;
		padding-top: 2px;
		padding-bottom: 2px;
	}

	.timeline-event-date-year-container {
		display: flex;
		flex-direction: column;
	}

	.timeline-event-date {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 5px 5px 0px 0px;
	}

	.timeline-event-year {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0px 0px 5px 5px;
	}

	.timeline-event-date-apprx {
		display: flex;
		width: -webkit-fill-available;
		width: -moz-available;
		justify-content: center;
		font-size: 10px;
		padding-top: 3px;
	}

	.timeline-event-node {
		border-radius: 1vw;
		aspect-ratio: 1;
	}

	.timeline-event-line {
		display: flex;
		flex-shrink: 0;
		height: 0.2rem;
		width: 2vw;
	}

	.timeline-event-title-bar {
		display: flex;
		flex-basis: 0;
		flex-grow: 1;
		width: -webkit-fill-available;
		padding: 5px 10px 5px 10px;
	}

	/* font awesome icon */
	.fa-solid {
		display: flex;
		align-items: center;
		font-size: 20px;
	}

	.timeline-event-age {
		font-style: italic;
	}

	.timeline-event-shared-label {
		font-style: italic;
		white-space: nowrap;
	}

	.timeline-event-meta-divider {
		margin-left: 12px;
		margin-right: 8px;
	}

	@media (min-width: 1024px) {
		.timeline-event-shared-meta {
			gap: 8px;
		}
	}

	@media (max-width: 1023px) {
		.timeline-event-title-bar {
			flex-direction: column;
			align-items: flex-start;
			gap: 4px;
		}

		.timeline-event-meta-divider {
			display: none;
		}

		.timeline-event-shared-meta {
			flex-direction: column;
			align-items: flex-start;
			gap: 4px;
		}
	}

	.timeline-event-content-outer-container {
		display: flex;
		flex-direction: column;
		padding: 3px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.timeline-event-content {
		padding: 0px 8px 0px 8px;
	}

	.timeline-event-description {
		padding: 8px 0px 8px 0px;
	}

	.timeline-event-image-preview {
		padding-bottom: 8px;
	}
</style>
