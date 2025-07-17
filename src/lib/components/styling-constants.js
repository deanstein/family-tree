export const breakpoints = {
	width: ['768px', '1024px'],
	height: ['400px', '800px']
};

const colors = {
	textColor: '#595959',
	textColorLight: '#737373',
	buttonColorPrimary: '#0092e4',
	buttonColorSecondary: 'darkGray',
	buttonColorDisabled: '#B5B5B5',
	buttonColorDone: '#4dc44d',
	buttonColorDelete: '#FF5757',
	hoverColor: '#50CBFC',
	hoverColorSubtle: '#B6EAFF',
	hoverColorSubtleDark: '#99CBDE',
	activeColor: '#3399ff',
	activeColorSubtle: '#e6f3ff',
	overlayColor: 'gray',
	overlayOpacity: '75%',
	modalTitleBackground: 'rgba(220, 220, 220, 1.0)',
	modalContentBackground: 'rgba(220, 220, 220, 0.4)',
	formBackgroundLegibleTransparency: '0.8',
	nodeGroupColor: 'rgba(255, 255, 255, 0.65)',
	nodeGroupHeaderColor: 'rgba(150, 150, 150, 0.5)',
	personNodeColor: '#bfd0db',
	personNodeGradient1: 'rgba(164, 200, 188)',
	personNodeGradient2: 'rgba(193, 208, 219)',
	personNodeGradient3: 'rgba(168, 164, 191)',
	personNodeConnectionLineColor: 'rgba(128, 128, 128, 0.45)',
	activePersonNodeColor: '#87a9c0',
	timelineSpineColor: 'rgba(200, 200, 200, 0.75)',
	timelineEventTitleBarColor: 'rgba(205, 205, 205, 1)',
	timelineEventBackgroundColorGradient1: 'rgba(227, 244, 223, 1)',
	timelineEventBackgroundColorGradient2: 'rgba(208, 240, 242, 1)',
	timelineEventBackgroundColorGradient3: 'rgba(218, 228, 248, 1)',
	timelineEventBackgroundHoverColor: 'rgba(255, 255, 255, 0.75)',
	hyperlinkColor: '#2373a3',
	notificationColorError: 'palevioletred',
	notificationColorWarning: 'lightYellow',
	notificationColorInformation: 'lightBlue',
	notificationColorInProgress: 'yellow',
	notificationColorSuccess: '#77FF16'
};

const sizes = {
	nHeaderHeight: 5,
	get headerHeight() {
		return this.nHeaderHeight.toString() + 'svh';
	},

	nModalFormHeight: 80,
	get modalFormHeight() {
		return this.nModalFormHeight + 'svh';
	},
	modalFormWidth: '25vw',

	nPadding: 0.75,
	get padding() {
		return this.nPadding.toString() + 'svh';
	},
	nPaddingNarrow: 0.5,
	get paddingNarrow() {
		return this.nPaddingNarrow.toString() + 'svh';
	},

	nShowGenerationsUp: 2,
	nShowGenerationsDown: 2,
	get nGenerationRowHeight() {
		return (
			(100 - (this.nHeaderHeight + this.nGenerationRowGap * 6)) /
			(this.nShowGenerationsUp + this.nShowGenerationsUp + 1)
		);
	},
	get generationRowHeight() {
		return this.nGenerationRowHeight.toString() + 'svh';
	},

	nGenerationRowGap: 2,
	get generationRowGap() {
		return this.nGenerationRowGap + 'svh';
	},

	get nPersonNodeGroupHeight() {
		return this.nGenerationRowHeight - 2 * this.nPadding;
	},
	get personNodeGroupHeight() {
		return this.nPersonNodeGroupHeight + 'svh';
	},
	get nPersonNodeGroupTitleHeight() {
		return this.nPersonNodeGroupFontSize + 2 * this.nPaddingNarrow;
	},
	get personNodeGroupTitleHeight() {
		return this.nPersonNodeGroupTitleHeight.toString() + 'svh';
	},
	nPersonNodeGroupFontSize: 1.25,
	get personNodeGroupFontSize() {
		return this.nPersonNodeGroupFontSize + 'svh';
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
		return this.nPersonNodeSize.toString() + 'svh';
	},
	nPersonNodeFontSize: 1.1,
	get personNodeFontSize() {
		return this.nPersonNodeFontSize + 'svh';
	},

	get nPersonNodeActiveSize() {
		return this.nPersonNodeGroupHeight - this.nPadding; /*account for gap*/
	},
	get personNodeActiveSize() {
		return this.nPersonNodeActiveSize + 'svh';
	},

	nBioFieldBorderRadius: 8,
	get bioFieldBorderRadius() {
		return this.nBioFieldBorderRadius + 'px';
	},

	nTimelineEventEmptyRowHeight: 1,
	get timelineEventEmptyRowHeight() {
		return this.nTimelineEventEmptyRowHeight + 'px';
	},
	nTimelineEventFilledRowHeight: 80,
	get timelineEventFilledRowheight() {
		return this.nTimelineEventFilledRowHeight + 'px';
	},
	nTimelineDateFontSize: 0.9,
	get timelineDateFontSize() {
		return this.nTimelineDateFontSize + 'rem';
	},
	nTimelineYearFontSize: 1.5,
	get timelineYearFontSize() {
		return this.nTimelineYearFontSize + 'rem';
	},
	nTimelineSpineLineThickness: 0.45,
	get timelineSpineThickness() {
		return this.nTimelineSpineLineThickness + 'vw';
	},
	nTimelineEventGapSize: 1,
	get timelineEventGapSize() {
		return this.nTimelineEventGapSize + 'vw';
	},
	nTimelineEventNodeSize: 0.9,
	get timelineEventNodeSize() {
		return this.nTimelineEventNodeSize + 'vw';
	},
	nTimelineEventYearWidth: 4,
	get timelineEventYearWidth() {
		return this.nTimelineEventYearWidth + 'vw';
	},
	nPersonNodeConnectionLineThickness: 5,
	nPersonNodeConnectionLineThicknessHover: 8
};

const quantities = {
	initialTimelineRowCount: 1000
};

const durations = {
	transitionDuration: 75 //ms
};

const zIndices = {
	personNodeOverlayZIndex: 2,
	personNodeEditZIndex: 3,
	personNodeSettingsZIndex: 4,
	personNodeSettingsFlyoutZIndex: 5,
	personDetailViewZIndex: 6,
	addEditAltNameZIndex: 7,
	notificationZIndex: 8,
	mediaGalleryZIndex: 9,
	chooseTreeModalZIndex: 10,
	authenticateTreeModalZIndex: 11,
	deleteConfirmationModalZIndex: 12
};

const stylingConstants = {
	breakpoints,
	colors,
	sizes,
	quantities,
	durations,
	zIndices
};

export default stylingConstants;
