interface Flask {
    url_for: string;
}

let Flask: any;

function isMobile(windowInnerWidth) {
    if (windowInnerWidth < '768') {
        return 1;
    }
    return 0;
}

async function postGetJson(postId: number, offset?: number, limit?: number): Promise<Response> {
    /*
     * Returns an array with entries
     */
    let parameters = {
        postid: postId,
        offset: offset,
        limit: limit
    };

    try {

        let response = await fetch(Flask.url_for('getJsonPost', parameters));
        return response.json();

    } catch (err) {
        console.log(err);
    }

}

async function getPortfolioItem(itemID: number): Promise<Response> {
    /*
     * Returns an array with entries
     */
    let parameters = {
        itemID: itemID
    };

    try {
        let response = await fetch(Flask.url_for('API_portfolio_get', parameters));
        return response.json();
    } catch (err) {
        console.log(err);
    }

}

async function sendJson(flaskLocation: string, settingsObj: object): Promise<any> {
    try {
        return await fetch(Flask.url_for(flaskLocation), settingsObj)
    } catch (err) {
        console.log(err);
    }
}

/**
 *
 * @param flaskLocation: Flask.url_for location
 * @param flaskParameter: Parameter for Flask.url_for
 * @param settingsObj: Http headers, content-type, etc
 */
async function sendJsonWithObj(flaskLocation: string, flaskParameter: object, settingsObj: object): Promise<any> {
    try {
        return await fetch(Flask.url_for(flaskLocation, flaskParameter), settingsObj)
    } catch (err) {
        console.log(err);
    }
}


// returns a promise when time has passed
function delay(t): Promise<any> {
    return new Promise(function(resolve) {
        setTimeout(resolve, t);
    });
}

function toggleClasses(element: HTMLElement, ...classes: Array<string>): void {
    for (let cls of classes) {
        element.classList.toggle(cls)
    }
}

/**
 * Return the first element with chosen data attribute.
 * @param {Type of tagName} tagName - String with tag. 'div' or 'a'.
 * @param {Type of dataAttribute} dataAttribute - String name of data attribute.
 * @param {Type of dataAttributeValue} dataAttributeValue - String name of data attribute value.
 * @returns {Return Type} an HTML element.
 */
function getElementbyTagNameWithDataAttribute(tagName: string, dataAttribute: string, dataAttributeValue): HTMLElement {

    return document.querySelector(`${tagName}[data-${dataAttribute}="${dataAttributeValue}"]`);
}

/**
 * Returns an object with all matched dataAttributeValue on 'matched', and ALL NOT matched dataAttributeValue on 'unmatched'
 * @param tagName - String with tag name
 * @param dataAttribute: String with data attribute name
 * @param dataAttributeValue String with data attribute value
 * @returns {object} Array<node> matches with all nodes that match the dataAttributeValue, Array<node> unmatched with all nodes with same dataAttribute that doesn't match dataAttributeValue.
 */
function getElementbyTagNameWithDataAttributeAll(tagName: string, dataAttribute: string, dataAttributeValue) {

    let allResults: NodeList = document.querySelectorAll(`${tagName}[data-${dataAttribute}]`);

    var matches: Array<Node> = [];
    var unmatched: Array<Node> = [];

    for (var i = 0; i < allResults.length; i++) {
        let element = allResults[i]

        if (element['dataset'][dataAttribute] == dataAttributeValue) {
            matches.push(element)
        }
        else {
            unmatched.push(element)
        }
    }

    return {
        matches: matches,
        unmatched: unmatched
    }
}
