// the various types of timeline events and the content they can display
// this is used for upgrading timeline events to ensure no errors when new data is supported
const timelineEventTypes = {
	birth: {
		type: 'birth',
		icon: '',
		modalTitle: 'Birth event details',
		content: {
			birthdate: {
				value: '',
				placeholder: '',
				inputType: 'single-line',
				label: 'Date of Birth'
			},
			birthTime: {
				value: '',
				placeholder: '',
				inputType: 'single-line',
				label: 'Time of Birth'
			},
			birthplace: {
				value: '',
				placeholder: '',
				inputType: 'single-line',
				label: 'Place of Birth'
			},
			hometown: {
				value: '',
				placeholder: '',
				inputType: 'single-line',
				label: 'Hometown'
			},
			additionalContext: {
				value: '',
				placeholder: '',
				inputType: 'multi-line',
				label: 'Additional Context'
			},
			media: []
		}
	},
	death: {
		type: 'death',
		icon: '',
		modalTitle: 'Death event details',
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
		typeLabel: 'Child',
		icon: '',
		modalTitle: 'Child event details',
		content: {}
	},
	text: {
		type: 'text',
		typeLabel: 'Text',
		icon: '',
		modalTitle: 'Text memory event details',
		placeholder: 'Enter a memory, random fact, or other text-based record of this person...'
	},
	photo: {
		type: 'photo',
		typeLabel: 'Photo',
		icon: '',
		modalTitle: 'Photo details',
		placeholder: 'Add photos...'
	},
	residence: {
		type: 'residence',
		typeLabel: 'Residence',
		icon: '',
		modalTitle: 'Residence details',
		placeholder: 'Where did this person live?'
	},
	vehicle: {
		type: 'vehicle',
		typeLabel: 'Vehicle',
		icon: '',
		modalTitle: 'Vehicle details',
		placeholder: 'What vehicle did this person drive?'
	}
};

export default timelineEventTypes;
