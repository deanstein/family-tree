const sizes = {
    personNodeSizeValue: 15,
    get personNodeSize() {
        return this.personNodeSizeValue.toString() + 'vh';
    },

    get personAddNodeSizeValue() {
        return this.personNodeSizeValue / 2;
    },
    get personAddNodeSize() {
        return this.personAddNodeSizeValue.toString() + 'vh'
    },

    get personAddNodeRadiusValue() {
        return this.personAddNodeSizeValue / 2;
    },
    get personAddNodeRadiusSize() {
        return this.personAddNodeRadiusValue.toString() + 'vh'
    }
}

const stylingConstants = {
    sizes
}

export default stylingConstants;