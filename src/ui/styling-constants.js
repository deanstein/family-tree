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
	personNodeConnectionLineColor: 'rgba(128, 128, 128, 0.45)',
	activePersonNodeColor: '#87a9c0',
	timelineSpineColor: 'rgba(200, 200, 200, 0.75)',
	timelineEventTitleBarColor: 'rgba(205, 205, 205, 1)',
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
		return this.nHeaderHeight.toString() + 'vh';
	},
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

	nModalTitleFontSize: 2,
	get modalTitleFontSize() {
		return this.nModalTitleFontSize.toString() + 'vh';
	},
	nModalSubtitleFontSize: 1.5,
	get modalSubtitleFontSize() {
		return this.nModalSubtitleFontSize.toString() + 'vh';
	},
	nModalFormWidth: 25,
	get modalFormWidth() {
		return this.nModalFormWidth.toString() + 'vw';
	},
	nModalFormHeight: 80,
	get modalFormHeight() {
		return this.nModalFormHeight.toString() + 'vh';
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
		return this.nGenerationRowHeight.toString() + 'vh';
	},

	nGenerationRowGap: 2,
	get generationRowGap() {
		return this.nGenerationRowGap + 'vh';
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
	nTimelineDateFontSize: 1.5,
	get timelineDateFontSize() {
		return this.nTimelineDateFontSize + 'vh';
	},
	nTimelineYearFontSize: 2.5,
	get timelineYearFontSize() {
		return this.nTimelineYearFontSize + 'vh';
	},
	nTimelineSpineLineThickness: 0.9,
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
	notificationZIndex: 8
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
