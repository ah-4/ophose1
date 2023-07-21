/**
 * Represents an ophose page
 */
class OphosePage extends OphoseElement {

    /**
     * Page constructor
     * @param {dict} urlQueries url queries if any (ex: pageId, productId...)
     */
    constructor(urlQueries) {
        super();
        this.urlQueries = urlQueries;
    }

    /**
     * This method is called once the page is created
     * (only once)
     */
    onCreate() {

    }

    /**
     * This method is called when the page is loaded
     * (after onCreate()) and typically when the page is accessed
     * through route.go(this)
     */
    onLoad() {

    }

    /**
     * This method is called when the page is left
     * through route.go(other_page)
     */
    onLeave() {

    }

    ___loadStyle() {
        $("#__ophose___page_style").html(this.style());
    }

    render() {
        return '';
    }

    // LIVE

    ___getLocalLiveId(id) {
        return this.__componentUniqueId + "_ophLive_" + id;
    }

    __updateLive(id) {
        if (!this.liveFlags[id]) return;
        if (this.liveFlags[id].includes(Live.Flags.UPDATE_STYLE_ON_CHANGE)) {
            this.___loadStyle();
        }
        if (this.liveFlags[id].includes(Live.Flags.UPDATE_HTML_ON_CHANGE)) {
            OphoseApp.__$baseApp.html(this.render());
        }
    }

}