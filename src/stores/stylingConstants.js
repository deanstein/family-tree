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
    nPersonNodeGroupTitleHeight: 1.5,
    get personNodeGroupTitleHeight() {
        return this.nPersonNodeGroupTitleHeight + 'vh';
    },

	get nPersonNodeSize() {
        return this.nPersonNodeGroupHeight - this.nPersonNodeGroupTitleHeight - (2 * this.nPadding);
    },
	get personNodeSize() {
		return this.nPersonNodeSize.toString() + 'vh';
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
