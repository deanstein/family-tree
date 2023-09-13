// the various types of timeline events and the content they can display
// this is used for upgrading timeline events to ensure no errors when new data is supported
const timelineEventTypes = {
	birth: {
		type: 'birth',
		icon: '',
		content: {
			birthdate: '',
			birthtime: '',
			birthplace: '',
			additionalContext: '',
			media: []
		}
	},
	death: {
		type: 'death',
		icon: '',
		content: {
			deathDate: '',
			deathTime: '',
			deathPlace: '',
			deathCause: '',
			disposition: '',
			media: []
		}
	},
	child: {
		type: 'child',
		icon: '',
		content: {}
	},
	text: {
		type: 'text',
		icon: '',
		content: {}
	},
	residence: {
		type: 'residence',
		icon: '',
		content: {}
	},
	vehicle: {
		type: 'vehicle',
		icon: '',
		content: {}
	}
};

export default timelineEventTypes;
