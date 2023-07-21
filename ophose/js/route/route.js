const __ophoseRegExpUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

class OphoseRoute {

    /**
     * To go to another page (without reloading base)
     * @param {page} requestUrl requested URL
     */
    static go(requestUrl, urlQueries = null) {
        if (requestUrl === undefined || requestUrl === null) {
            return;
        }
        if(__ophoseRegExpUrl.test(requestUrl)) {
            window.location = requestUrl;
            return;
        }
        if(!requestUrl.startsWith('/')) requestUrl = '/' + requestUrl;
        OphoseApp.__loadAt(requestUrl, urlQueries);
        if (requestUrl != OphoseApp.__currentURL) {
            window.history.pushState(requestUrl, '', requestUrl);
        }
    }

}

const route = OphoseRoute;