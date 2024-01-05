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
		label: 'Media',
		icon: 'fa-image'
	},
	education: {
		type: 'education',
		label: 'Education',
		icon: 'fa-graduation-cap',
		content: {}
	},
	residence: {
		type: 'residence',
		label: 'Residence',
		icon: 'fa-house',
		content: {}
	},
	workplace: {
		type: 'workplace',
		label: 'Workplace',
		icon: 'fa-building',
		content: {}
	},
	vehicle: {
		type: 'vehicle',
		label: 'Vehicle',
		icon: 'fa-car',
		content: {}
	},
	relationship: {
		type: 'relationship',
		label: 'Relationship',
		icon: 'fa-heart',
		content: {}
	},
	child: {
		type: 'child',
		label: 'Childbirth',
		icon: 'fa-child',
		content: {}
	}
};

export default timelineEventTypes;
