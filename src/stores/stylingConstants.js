const sizes = {
    nShowGenerationsUp: 1,
    nShowGenerationsDown: 2,
    get generationRowHeight() {
        return (100 / (this.nShowGenerationsUp + this.nShowGeneratinsUp + 1)).toString() + 'vh';
    },
	personNodeSizeValue: 15,
	get personNodeSize() {
		return this.personNodeSizeValue.toString() + 'vh';
	},

	get personAddNodeSizeValue() {
		return this.personNodeSizeValue / 4;
	},
	get personAddNodeSize() {
		return this.personAddNodeSizeValue.toString() + 'vh';
	},

	get personAddNodeRadiusValue() {
		return this.personAddNodeSizeValue / 2;
	},
	get personAddNodeRadiusSize() {
		return this.personAddNodeRadiusValue.toString() + 'vh';
	}
};

const stylingConstants = {
	sizes
};

export default stylingConstants;
