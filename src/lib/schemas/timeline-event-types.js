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
		label: 'Generic',
		icon: 'fa-rectangle-list',
		content: {
			associatedPeople: [],
			additionalContext: '',
			media: []
		}
	},
	media: {
		type: 'media',
		label: 'Media Only',
		icon: 'fa-image'
	},
	residence: {
		type: 'residence',
		label: 'Residence',
		icon: '',
		content: {}
	},
	workplace: {
		type: 'workplace',
		label: 'Workplace',
		icon: '',
		content: {}
	},
	vehicle: {
		type: 'vehicle',
		label: 'Vehicle',
		icon: '',
		content: {}
	},
	child: {
		type: 'child',
		label: 'Childbirth',
		icon: '',
		content: {}
	}
};

export default timelineEventTypes;
