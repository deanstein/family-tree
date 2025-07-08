import stylingConstants from '$lib/components/styling-constants';

const composeButtonTypes = {
	compose: {
		type: 'compose',
		faIcon: 'fa-pencil fa-fw',
		tooltip: 'Compose',
		color: stylingConstants.colors.activeColor,
		backgroundColor: '#ffffff'
	},
	confirm: {
		type: 'confirm',
		faIcon: 'fa-check fa-fw',
		tooltip: 'Confirm',
		color: '#ffffff',
		backgroundColor: stylingConstants.colors.buttonColorDone
	},
	cancel: {
		type: 'cancel',
		faIcon: 'fa-x fa-fw',
		tooltip: 'Cancel',
		color: stylingConstants.colors.activeColorSubtle,
		backgroundColor: '#ffffff'
	}
};

export default composeButtonTypes;
