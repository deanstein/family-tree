import timelineEventContent from './timeline-event-content';

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
	eventVersion: ''
};

export default timelineEvent;
