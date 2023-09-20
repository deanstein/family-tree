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
	generic: {
		type: 'generic',
		icon: '',
		content: {
			associatedPeople: [],
			additionalContext: '',
			media: []
		}
	},
	residence: {
		type: 'residence',
		icon: '',
		content: {}
	},
	workplace: {
		type: 'workplace',
		icon: '',
		content: {}
	},
	vehicle: {
		type: 'vehicle',
		icon: '',
		content: {}
	},
	child: {
		type: 'child',
		icon: '',
		content: {}
	}
};

export default timelineEventTypes;
