String.prototype.prettyHashCode = function() {
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return 'h' + Math.abs(hash);
}

class OphoseRender {

    static __tree;

    static constructNode(ophRawRenderedNode, setElementOI = false) {
        let ophId = ophRawRenderedNode.getAttribute("oph_id");
        let ophElement = OphoseComponent.getComponent(ophId);

        ophRawRenderedNode.removeAttribute("oph_id");

        if(setElementOI) {
            ophRawRenderedNode.ophoseInstance = ophElement;
            ophElement.__setNode(ophRawRenderedNode);
            ophElement.onPlace(ophRawRenderedNode);
            for(let module of ophElement.__myModules) {
                module.onPlace(ophElement, ophRawRenderedNode);
            }
        }

        return ophRawRenderedNode;
    }

    static constructOphoseTree() {
        // Construct components
        $("*[oph_id]").each((index, element) => {
            OphoseRender.constructNode(element, true);
        });

        // Construct lives
        $("livevalue").each((index, element) => {
            let ophLiveId = element.getAttribute("liveid");
            if(!Live.__placedLiveTextNodes[ophLiveId]) {
                Live.__placedLiveTextNodes[ophLiveId] = [];
            }
            let currentValue = Live.__liveVars[ophLiveId];
            let valueNode;
            if(element.getAttribute("cacheFunctionId")) {
                let cacheFunctionId = element.getAttribute("cacheFunctionId");
                let cacheFunction = Live.___cachedLiveDisplayFunctions[cacheFunctionId];
                valueNode = $(cacheFunction(currentValue))[0];
                valueNode.displayFunction = cacheFunction;
                Live.___cachedLiveDisplayFunctions[cacheFunctionId] = undefined;
            }else{
                valueNode = document.createTextNode(currentValue);
                valueNode.textContent = currentValue;
            }
            element.replaceWith(valueNode);
            Live.__placedLiveTextNodes[ophLiveId].push(valueNode);
        });
    }

}