const __ = undefined; // Shortcut for undefined

class OphoseConstant {

    static getComponentQuerySelector(component) {
        return "*[oph_id=" + component.__getComponentUniqueId() + "]";
    }

}