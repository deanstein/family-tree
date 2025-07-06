import { schemaVersion } from '$lib/versions';
import timelineEventContent from './timeline-event-content';
import timelineEventOriginTypes from './timeline-event-origin-types';

const timelineEvent = {
	eventId: '',
	eventType: '',
	eventDate: '',
	isApprxDate: false,
	eventContent: (() => {
		let eventContent = {};
		Object.keys(timelineEventContent).forEach((element) => {
			eventContent[element] = [];
		});
		return eventContent;
	})(),
	originType: timelineEventOriginTypes.self,
	originMeta: undefined,
	eventVersion: schemaVersion
};

export default timelineEvent;
