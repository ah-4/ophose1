/**
 * Represents an ophose component.
 */
class OphoseComponent extends OphoseElement {

    static __allComponents = {};

    /**
     * Returns the component ID
     * @param {*} componentId the component id
     * @returns {OphoseComponent} component matching id
     */
    static getComponent(componentId) {
        return OphoseComponent.__allComponents[componentId];
    }

    constructor() {
        super();
        this.__styleNode = undefined;
        this.__node = undefined;
        this.__loadingContext = null;
        this.compUID = this.constructor.name.toLowerCase();
        this.__componentUniqueClassName = "__oc_" + this.compUID;
        this.__componentUniqueClassName = this.__componentUniqueClassName.prettyHashCode();
        this.__componentUniqueId = this.__componentUniqueClassName + (Object.keys(OphoseComponent.__allComponents).length + 1);
        OphoseComponent.__allComponents[this.__componentUniqueId] = this;
        this.__myModules = [];

        this.__children = null;
        this.__lastProps = undefined;
    }

    /**
     * Sets component node
     * @param {HTMLElement} node the node
     */
    __setNode(node) {
        this.__node = node;
    }

    /**
     * @returns component unique class (unique for all instances of this class)
     */
    __getComponentUniqueClass() {
        return this.__componentUniqueClassName;
    }

    /**
     * @returns component unique id (unique for every component)
     */
    __getComponentUniqueId() {
        return this.__componentUniqueId;
    }

    // Style

     /**
     * @returns {HTMLStyleElement} component style node
     */
     __getStyleNode() {
        return this.__styleNode;
    }

    /**
     * Creates style node
     * @returns {HTMLStyleElement} style node (or undefined if already exists)
     */
    __createStyleNode() {
        if(this.__getStyleNode()) return undefined;
        let styleNode = document.createElement('style');
        document.head.append(styleNode);
        this.__styleNode = styleNode;
        return styleNode;
    }

    /**
     * Reloads component style
     */
    ___reloadStyle() {
        let style = this.style().replaceAll('%self', '.' + this.__getComponentUniqueId());
        let styleNode = this.__getStyleNode();
        styleNode.innerText = style;
    }

    /**
     * Reload component style
     */
    reloadComponentStyle() {
        this.___reloadStyle();
    }

    /**
     * Applies style
     */
    __applyStyle() {
        if(this.__getStyleNode()) return;
        this.__createStyleNode();
        this.___reloadStyle();
    }

    /**
     * Reloads component HTML
     */
    ___reloadHtml() {
        let renderedNode = OphoseRender.constructNode(this.__place());
        this.__node.replaceWith(renderedNode);
        this.__setNode(renderedNode);
    }

    /**
     * Reload component style
     */
    reloadComponentHTML() {
        this.___reloadHtml();
    }

    getComponentInstanceSelector() {
        return "OphoseComponent.getComponent('" + this.__getComponentUniqueId() + "')";
    }

    /**
     * Return rendered node
     * @param {*} children the children
     * @param {*} props the properties
     * @returns {HTMLElement} node
     */
    __place(children = undefined, props = {}) {

        this.__loadingContext = "html";
        if(!props && this.__lastProps) {
            props = this.__lastProps;
        }else if(props) {
            this.__lastProps = props;
        }
        let renderedHTML = this.render(children, props);
        this.__loadingContext = null;


        if ($(renderedHTML).length != 1) {
            console.error(renderedHTML + " is not valid. Your HTML component must contain only one element.");
            return "This element cannot be displayed";
        }

        
        this.__loadingContext = "style";
        this.__applyStyle();
        this.__loadingContext = null;

        renderedHTML = renderedHTML.replaceAll("{$this}", this.getComponentInstanceSelector());
        renderedHTML = renderedHTML.replaceAll("{$uid}", this.__getComponentUniqueId());

        let renderedElement = $(renderedHTML).
            addClass(this.__getComponentUniqueId()).
            attr('oph_id', this.__getComponentUniqueId());
            
        if(props && props.attr) {
            for (const [attribute, value] of Object.entries(props.attr)) {
                if(attribute == "class" || attribute == "className"){
                    renderedElement.addClass(value);
                    continue;
                }
                renderedElement.attr(attribute, value);
            }
        }

        renderedElement = renderedElement[0].outerHTML;

        this.__myModules.forEach(module => {
            renderedElement = $(renderedElement).addClass(module._getClassName())[0].outerHTML;
        });

        let renderedNode = $(renderedElement)[0];

        return renderedNode;
    }

    place(children = undefined, props = {}) {
        let element = this.__place(children, props);
        return element.outerHTML;
    }

    /**
     * Abstract method to render HTML
     * @param {*} children children HTML
     * @param {*} props properties
     * @returns HTML
     */
    render(children = undefined, props = {}) {

    }

    /**
     * Called when component will be removed from the DOM
     */
    __processRemove() {
        this.onRemove(this.__node);
        for(let module of this.__myModules) {
            module.__onRemove(this, this.__node);
        }
        this.__styleNode.remove();
        this.__styleNode = undefined;
        OphoseComponent.__allComponents[this.__componentUniqueId] = undefined;
    }

    // LIVE

    getLive(id, asHTML = false) {
        switch(this.__loadingContext) {
            case "html":
                if(asHTML) break;
                this.useLiveFlag(id, Live.Flags.UPDATE_HTML_ON_CHANGE);
                break;
            case "style":
                this.useLiveFlag(id, Live.Flags.UPDATE_STYLE_ON_CHANGE);
                break;
            default:
                break;
        }
        return super.getLive(id, asHTML);
    }

    ___getLocalLiveId(id) {
        return this.__componentUniqueId + "_ophLive_" + id;
    }

    __updateLive(id) {
        if (!this.liveFlags[id]) return;
        if (this.liveFlags[id].includes(Live.Flags.UPDATE_STYLE_ON_CHANGE)) {
            this.___reloadStyle();
        }
        if (this.liveFlags[id].includes(Live.Flags.UPDATE_HTML_ON_CHANGE)) {
            this.___reloadHtml();
        }
    }

    // Lifecycle

    /**
     * Called when component is added to the DOM
     * @param {HTMLElement} element the element
     */
    onPlace(element) {

    }

    /**
     * Called when component will be removed from the DOM
     * @param {HTMLElement} element the element
     */
    onRemove(element) {

    }

    // MODULE

    /**
     * Add module to the current component
     * @param {OphoseModule} module the module
     */
    addModule(module) {
        this.__myModules.push(module);
        module.addComponent(this);
    }

}