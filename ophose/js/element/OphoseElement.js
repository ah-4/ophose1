class OphoseElement {

    constructor() {

    }

    /**
     * Abstract method to define style of the element
     */
    style() {
        return '';
    }

    /**
     * Returns page base
     * @returns {OphoseBase} base
     */
    getBase() {
        return OphoseApp.__base;
    }

    // LIVE

    liveFlags = [];

    getLive(id, asHTML = false, defaultHTMLDisplayFunction = undefined) {
        return Live.getLive(this, id, asHTML, defaultHTMLDisplayFunction);
    }

    setLive(id, value) {
        Live.setLive(id, value);
    }

    placeLive(id, defaultHTMLDisplayFunction = undefined) {
        return Live.getLive(this, id, true, defaultHTMLDisplayFunction);
    }

    /**
     * Returns local live ID (to be overriden)
     * @param {string} id the id
     * @returns local live ID
     */
    ___getLocalLiveId(id) {
        return "";
    }

    /**
     * Defines local live variable
     * (useful for "private" live variables)
     * @param {*} id the id
     * @param {*} value the value
     */
    setLocalLive(id, value) {
        Live.setLive(this.___getLocalLiveId(id), value);
    }

    /**
     * Returns local live value
     * @param {*} id the id
     * @returns value
     */
    getLocalLive(id) {
        return this.getLive(this.___getLocalLiveId(id));
    }

    /**
     * Returns local live value
     * @param {*} id the id
     * @returns value
     */
    placeLocalLive(id, defaultHTMLDisplayFunction = undefined) {
        return this.placeLive(this.___getLocalLiveId(id), defaultHTMLDisplayFunction);
    }

    /**
     * Abstract method called when an observed live variable changes
     * @param {*} id 
     * @param {*} oldValue 
     * @param {*} newValue 
     */
    onLiveChange(id, oldValue, newValue) {

    }

    /**
     * Abstract method called when an observed local live variable
     * changes
     * @param {*} id 
     * @param {*} oldValue 
     * @param {*} newValue 
     */
    onLocalLiveChange(id, oldValue, newValue) {

    }

    /**
     * Declares an use to flag (and automatically add this
     * as observer)
     * @param {Live.Flags} flag the flag
     */
    useLiveFlag(id, flag) {
        if (!this.liveFlags[id]) {
            this.liveFlags[id] = [];
        }
        this.liveFlags[id].push(flag);
    }

    /**
     * Declares an use to flag
     * @param {Live.FLAGS} flag the flag
     */
    useLocalLiveFlag(id, flag) {
        this.useLiveFlag(this.___getLocalLiveId(id), flag);
    }

    /**
     * Called on live variable update after (onLiveChange)
     */
    __updateLive(id) {
        return;
    }
}