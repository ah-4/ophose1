class OphoseModule extends OphoseElement {

    static __addedModuleStyles = {};

    /**
     * Constructor
     * @param {string} moduleUID the module UID (unique name)
     * @param {OphoseComponent} component the listen component
     */
    constructor() {
        super();
        this.__moduleUID = "__ocmodule__" + this.constructor.name.toLowerCase();
        this.__components = [];
        this.__applyStyle();
    }

    /**
     * @returns class name (as DOM element)
     */
    _getClassName() {
        return this.__moduleUID;
    }

    /**
     * @returns {HTMLStyleElement} component style node
     */
    __getStyleNode() {
        return OphoseModule.__addedModuleStyles[this._getClassName()];
    }

    __reloadStyle() {
        let styleNode = this.__getStyleNode();
        if (!styleNode) return;
        styleNode.innerText = this.style().replaceAll('%self', '.' + this._getClassName());
    }

    /**
     * Applies style
     */
    __applyStyle() {
        if (this.__getStyleNode()) return;
        let styleNode = document.createElement('style');
        OphoseModule.__addedModuleStyles[this._getClassName()] = styleNode;
        document.head.append(styleNode);
        this.__reloadStyle();
    }

    /**
     * Sets component to the current module instance
     * @param {OphoseComponent} the component 
     */
    addComponent(component) {
        if(!this.__components.includes(component)) return;
        this.__components.push(component);
        this.onComponentAdded(component);
    }

    /**
     * @returns {OphoseComponent[]} components of the module
     */
    getComponents() {
        return this.__components;
    }

    /**
     * Removes component from the current module instance
     * @param {OphoseComponent} the component
     */
    removeComponent(component) {
        this.__components.splice(this.__components.indexOf(component), 1);
        this.onComponentRemoved(component);
    }

    /**
     * This function is called when a component is added to the module
     * @param {OphoseComponent} component the component
     * @abstract
     */
    onComponentAdded(component) {

    }

    /**
     * This function is called when a component is removed from the module
     * @param {OphoseComponent} component the component
     * @abstract
     */
    onComponentRemoved(component) {

    }

    /**
     * This function is called when an element implementing this
     * module is placed and rendered.
     * @param {OphoseComponent} component the component
     * @param {HTMLElement} element DOM element
     */
    onPlace(component, element) {

    }

    /**
     * This function is called when an element implementing this
     * module is removed.
     * @param {OphoseComponent} component the component
     * @param {HTMLElement} element DOM element
     */
    onRemove(component, element) {

    }

    __onRemove(component, element) {
        this.onRemove(component, element);
        this.__components.splice(this.__components.indexOf(component), 1);
    }

    // LIVE

    ___getLocalLiveId(id) {
        return this.__moduleUID + "_ophLive_" + id;
    }

    __updateLive(id) {
        if (!this.liveFlags[id]) return;
        if (this.liveFlags[id].includes(Live.Flags.UPDATE_STYLE_ON_CHANGE)) {
            this.__reloadStyle();
        }
    }

}