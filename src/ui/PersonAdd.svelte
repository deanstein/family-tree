<script>
    import { css } from '@emotion/css';
    import stylingConstants from './../stores/stylingConstants'

    console.log(stylingConstants.sizes.personAddNodeRadiusSize)

    let personAddContainerDynamicStyle = css`
        width: ${stylingConstants.sizes.personAddNodeSize};
        height: ${stylingConstants.sizes.personAddNodeSize};
    `

    const personAddButtonDynamicStyle = css`
        -moz-border-radius: ${stylingConstants.sizes.personAddNodeRadiusSize};
        -webkit-border-radius: ${stylingConstants.sizes.personAddNodeRadiusSize};
        border-radius: ${stylingConstants.sizes.personAddNodeRadiusSize};
    `
</script>

<div id='person-add-container' class='{personAddContainerDynamicStyle} person-add-container'>
    <div id='person-add-button' class='{personAddButtonDynamicStyle} person-add-button'>

    </div>
</div>

<style>
    .person-add-container {

    }

    .person-add-button {
        width: 100%;
        height: 100%;
        background: red;
    }
</style>
