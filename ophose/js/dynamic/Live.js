class Live {

    static __liveVars = {};
    static __liveObservers = {};
    static __placedLiveTextNodes = {};
    static ___cachedLiveDisplayFunctions = {};

    static setLive(id, value) {
        let oldValue = Live.__liveVars[id];

        Live.__liveVars[id] = value;
        if (!Live.__liveObservers[id]) {
            Live.__liveObservers[id] = [];
        }

        if(Live.__placedLiveTextNodes[id]){
            let toDeleteElements = [];
            let toAddElements = [];
            for(let element of Live.__placedLiveTextNodes[id]) {
                if(element.displayFunction) {
                    let displayValue = element.displayFunction(value);
                    let newNode = $(displayValue)[0];
                    newNode.displayFunction = element.displayFunction;
                    element.replaceWith(newNode);
                    toAddElements.push(newNode);
                    toDeleteElements.push(element);
                }else{
                    element.textContent = value;
                }
            }
            for(let element of toAddElements) {
                Live.__placedLiveTextNodes[id].push(element);
            }
            for(let element of toDeleteElements) {
                let index = Live.__placedLiveTextNodes[id].indexOf(element);
                Live.__placedLiveTextNodes[id].splice(index, 1);
            }
        }

        for (const observer of Live.__liveObservers[id]) {
            observer.onLiveChange(id, oldValue, value);
            let localComponentLivePrefix = observer.__getComponentUniqueId() + "_ophLive_";
            if (id.startsWith(localComponentLivePrefix)) {
                let localId = id.substring(localComponentLivePrefix.length, id.length);
                observer.onLocalLiveChange(localId, oldValue, value);
            }
            observer.__updateLive(id);
        }

        OphoseRender.constructOphoseTree();
    }

    /**
     * Returns live value and automatically assigns as observer of this
     * live variable
     * @param {component} caller the caller
     * @param {*} id the id
     * @param {boolean} asHTML if returned object should be HTML form 
     * @returns the value
     */
    static getLive(caller, id, asHTML = false, defaultHTMLDisplayFunction = undefined) {
        if (!Object.keys(Live.__liveVars).includes(id)) {
            console.error("This live variable does not exist: " + id + ".");
            return undefined;
        }

        if (caller && !Live.__liveObservers[id].includes(caller)) {
            Live.__liveObservers[id].push(caller);
        }

        if (!asHTML) {
            return Live.__liveVars[id];
        } else {
            let cacheFunctionHTML = '';
            if (defaultHTMLDisplayFunction) {
                let cacheFunctionId = "" + Object.keys(this.___cachedLiveDisplayFunctions).length;
                Live.___cachedLiveDisplayFunctions[cacheFunctionId] = defaultHTMLDisplayFunction;
                cacheFunctionHTML = ' cacheFunctionId="' + cacheFunctionId + '"';
            }
            return '<livevalue ' + cacheFunctionHTML + 'liveId="' + id + '">' + Live.__liveVars[id] + '</livevalue>';
        }

    }

    /**
     * Refreshes a live variable
     * @param {*} id the id
     */
    static refreshLive(id) {
        let value = Live.getLive(undefined, id);
        if (value === undefined) {
            return;
        }
        Live.setLive(id, value);
    }

    static Flags = {
        UPDATE_HTML_ON_CHANGE: 0,
        UPDATE_STYLE_ON_CHANGE: 1
    }

}