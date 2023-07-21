/**
 * Class representing ophose event
 */
class OphoseEvent {

    // Associative array of eventname: callback
    static __eventCallbacks = {};

    /**
     * Registers a callback for an event
     * (note that callbacks are registered in apparition order)
     * @param {string} eventName the event name ("onPageLoad")
     * @param {object} callback the callback (called with: value passed
     * by event caller, event name)
     */
    static registerEvent(eventName, callback) {
        if (!OphoseEvent.__eventCallbacks[eventName]) {
            OphoseEvent.__eventCallbacks[eventName] = [];
        }
        OphoseEvent.__eventCallbacks[eventName].push(callback);
    }


    static callEvent(eventName, value) {
        if (!OphoseEvent.__eventCallbacks[eventName]) {
            return;
        }
        for (const callback of OphoseEvent.__eventCallbacks[eventName]) {
            callback(value, eventName);
        }
    }

}

// History listener
window.addEventListener("popstate", (event) => {
    if (event.state === null) return;
    OphoseApp.__loadAt(event.state);
});