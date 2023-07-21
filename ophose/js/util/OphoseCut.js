class OphoseCutUtil {

    static functions = {};

    /**
     * @param {Iterable} list the list or map to iterate to
     * @param {*} f the html function for each entry
     * @returns {string} the html string
     */
    static listToHTML(list, f){
        let html = '';
        for (const e of list) {
            html += f(e) ?? '';
        }
        return html;
    }

    /**
     * @param {Iterable} list the list or map to iterate to
     * @param {*} f the html function for each entry
     * @returns {string} the html string
     */
    static mapToHTMLWithIndex(list, f){
        let html = '';
        for (const [i, e] of Object.entries(list)) {
            let result = f(i, e);
            html += result ?? '';
        }
        return html;
    }

    /**
     * @param {Function} f the function to call
     * @returns {string} the format html string
     */
    static functionToHTML(f){
        let id = Object.keys(OphoseCutUtil.functions).length;
        OphoseCutUtil.functions[id] = f;
        return `"OphoseCutUtil.callFunction(${id}, event)"`;
    }

    /**
     * @param {*} id the id of the function
     * @param {*} event the event
     */
    static callFunction(id, event){
        OphoseCutUtil.functions[id](event);
    }

}

const omap = OphoseCutUtil.listToHTML;
const omapi = OphoseCutUtil.mapToHTMLWithIndex;
const o = OphoseCutUtil.functionToHTML;