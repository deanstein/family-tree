// the various types of timeline events and the content they can display
// this is used for upgrading timeline events to ensure no errors when new data is supported
const timelineEventTypes = {
	birth: {
		type: 'birth',
		icon: 'fa-wand-magic-sparkles',
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
		icon: 'fa-umbrella-beach',
		content: {
			deathDate: '',
			deathTime: '',
			deathPlace: '',
			deathCause: '',
			disposition: '',
			media: []
		}
	},
	today: {
		type: 'today',
		icon: 'fa-sun'
	},
	generic: {
		type: 'generic',
		icon: 'fa-rectangle-list',
		content: {
			associatedPeople: [],
			additionalContext: '',
			media: []
		}
	},
	// also treat undefined type as generic
	'': {
		type: 'generic',
		icon: 'fa-rectangle-list'
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
