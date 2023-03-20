const colors = {
	sHoverColor: '#50CBFC',
	sActiveColor: '#3399ff',
	sOverlayColor: 'gray',
	overlayOpacity: '45%',
	sNodeGroupColor: 'white',
	sPersonNodeColor: '#ececec'
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

	nShowGenerationsUp: 2,
	nShowGenerationsDown: 2,
	get nGenerationRowHeight() {
		return 100 / (this.nShowGenerationsUp + this.nShowGenerationsUp + 1);
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
	nPersonNodeGroupFontSize: 1.75,
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
	nPersonNodeFontSize: 1.5,
	get personNodeFontSize() {
		return this.nPersonNodeGroupFontSize + 'vh';
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
	}
};

const zIndices = {
	nPersonNodeOverlayZIndex: 2,
	nPersonNodeEditZIndex: 3
};

const stylingConstants = {
	colors,
	sizes,
	zIndices
};

export default stylingConstants;
