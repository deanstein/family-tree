import timelineEvent from './timeline-event';
import timelineEventReference from './timeline-event-reference';

const timelineRowItem = {
	index: 0,
	event: timelineEvent,
	/* if defined, this is a reference event */
	eventReference: timelineEventReference
};

export default timelineRowItem;
