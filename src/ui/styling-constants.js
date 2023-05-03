export const breakpoints = {
	width: ['768px', '1024px'],
	height: ['400px', '800px']
};

const colors = {
	buttonColor: '#0092e4',
	hoverColor: '#50CBFC',
	activeColor: '#3399ff',
	overlayColor: 'gray',
	overlayOpacity: '75%',
	nodeGroupColor: 'white',
	nodeGroupHeaderColor: '#adadad',
	personNodeColor: '#bfd0db',
	activePersonNodeColor: '#87a9c0',
	hyperlinkColor: '#2373a3',
	menuBackgroundColor: '#ececec',
	notificationColorError: 'palevioletred',
	notificationColorWarning: 'lightYellow',
	notificationColorInformation: 'lightBlue',
	notificationColorInProgress: 'yellow',
	notificationColorSuccess: '#77FF16'
};

const sizes = {
	nPadding: 0.75,
	get padding() {
		return this.nPadding.toString() + 'vh';
	},
	nPaddingNarrow: 0.5,
	get paddingNarrow() {
		return this.nPaddingNarrow.toString() + 'vh';
	},

	nNotificationFontSize: 1.5,
	get notificationFontSize() {
		return this.nNotificationFontSize.toString() + 'vh';
	},

	nShowGenerationsUp: 2,
	nShowGenerationsDown: 2,
	get nGenerationRowHeight() {
		return 100 / (this.nShowGenerationsUp + this.nShowGenerationsUp + 2);
	},
	get generationRowHeight() {
		return this.nGenerationRowHeight.toString() + 'vh';
	},

	get nPersonNodeGroupHeight() {
		return this.nGenerationRowHeight - 2 * this.nPadding;
	},
	get personNodeGroupHeight() {
		return this.nPersonNodeGroupHeight + 'vh';
	},
	get nPersonNodeGroupTitleHeight() {
		return this.nPersonNodeGroupFontSize + 2 * this.nPaddingNarrow;
	},
	get personNodeGroupTitleHeight() {
		return this.nPersonNodeGroupTitleHeight.toString() + 'vh';
	},
	nPersonNodeGroupFontSize: 1.25,
	get personNodeGroupFontSize() {
		return this.nPersonNodeGroupFontSize + 'vh';
	},

	get nPersonNodeSize() {
		return (
			this.nPersonNodeGroupHeight -
			this.nPersonNodeGroupTitleHeight -
			this.nPadding /*account for gap*/ -
			2 * this.nPadding
		);
	},
	get personNodeSize() {
		return this.nPersonNodeSize.toString() + 'vh';
	},
	nPersonNodeFontSize: 1.1,
	get personNodeFontSize() {
		return this.nPersonNodeFontSize + 'vh';
	},

	get nPersonNodeActiveSize() {
		return this.nPersonNodeGroupHeight - this.nPadding; /*account for gap*/
	},
	get personNodeActiveSize() {
		return this.nPersonNodeActiveSize + 'vh';
	},

	get nPersonNodeAddButtonSize() {
		return this.nPersonNodeSize / 4;
	},
	get personNodeAddButtonSize() {
		return this.nPersonNodeAddButtonSize.toString() + 'vh';
	},
	get nPersonNodeAddButtonRadius() {
		return this.nPersonNodeAddButtonSize / 2;
	},
	get personNodeAddButtonRadius() {
		return this.nPersonNodeAddButtonRadius.toString() + 'vh';
	},
	nBioFieldFontSize: 1.5,
	get bioFieldFontSize() {
		return this.nBioFieldFontSize + 'vh';
	},
	nTimelineSpacerLineThickness: 0.5,
	get timelineSpineThickness() {
		return this.nTimelineSpacerLineThickness + 'vw';
	},
	nTimelineEventGapSize: 1,
	get timelineEventGapSize() {
		return this.nTimelineEventGapSize + 'vw';
	},
	nTimelineEventNodeSize: 2,
	get timelineEventNodeSize() {
		return this.nTimelineEventNodeSize + 'vw';
	},
	nTimelineEventYearWidth: 3,
	get timelineEventYearWidth() {
		return this.nTimelineEventNodeSize + 'vw';
	}
};

const zIndices = {
	personNodeOverlayZIndex: 2,
	personNodeEditZIndex: 3,
	personNodeSettingsZIndex: 4,
	personNodeSettingsFlyoutZIndex: 5,
	personDetailViewZIndex: 6,
	notificationZIndex: 7
};

const stylingConstants = {
	breakpoints,
	colors,
	sizes,
	zIndices
};

export default stylingConstants;
