function toggleClasses(element: any, classes) {
    // i = 0 is the element
    for (let i = 1; i < arguments.length; i++) {
        element.classList.toggle(arguments[i]);
    }
}

/**
 * Return the first element with chosen data attribute.
 * @param {Type of tagName} tagName - String with tag. 'div' or 'a'.
 * @param {Type of dataAttribute} dataAttribute - String name of data attribute.
 * @param {Type of dataAttributeValue} dataAttributeValue - String name of data attribute value.
 * @returns {Return Type} HTML element.
 */
function getElementbyTagNameWithDataAttribute(tagName: string, dataAttribute: string, dataAttributeValue) {

    return document.querySelector(`${tagName}[data-${dataAttribute}="${dataAttributeValue}"]`);
}
