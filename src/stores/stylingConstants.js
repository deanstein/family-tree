const sizes = {

    nPadding: 1,
    get padding() {
        return this.nPadding.toString() + 'vh';
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
        return this.nGenerationRowHeight - (2 * this.nPadding);
    },
    get personNodeGroupHeight() {
        return this.nPersonNodeGroupHeight + 'vh';
    },
    get nPersonNodeGroupTitleHeight() {
        return this.nPersonNodeGroupFontSize + (2 * this.nPadding);
    } ,
    get personNodeGroupTitleHeight() {
        return (this.nPersonNodeGroupTitleHeight).toString() + 'vh';
    },
    nPersonNodeGroupFontSize: 1.75,
    get personNodeGroupFontSize() {
        return this.nPersonNodeGroupFontSize + 'vh';
    },

	get nPersonNodeSize() {
        return this.nPersonNodeGroupHeight - this.nPersonNodeGroupTitleHeight - this.nPadding /*account for gap*/ - (2 * this.nPadding);
    },
	get personNodeSize() {
		return this.nPersonNodeSize.toString() + 'vh';
	},
    nPersonNodeFontSize: 1.50,
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

const stylingConstants = {
	sizes
};

export default stylingConstants;
