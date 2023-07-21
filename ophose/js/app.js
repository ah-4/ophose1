class OphoseApp {

    static __base;
    static __$baseApp;
    static __$baseAppNode;
    static __histories = [];
    static __loadedPages = {};
    static __currentURL = null;
    static __isBaseLoaded = false;
    static __lastShared = undefined;

    /**
     * Loads base component it is not loaded
     */
    static __loadBase() {
        if (OphoseApp.__isBaseLoaded) return;
        OphoseApp.__base = new Base();
        let renderedHtml = OphoseApp.__base.place();
        document.body.innerHTML = renderedHtml;
        OphoseApp.__$baseApp = $("app");
        OphoseApp.__$baseAppNode = OphoseApp.__$baseApp[0];
        OphoseApp.__isBaseLoaded = true;
    }

    /**
     * Loads ophose page at requested URL
     * @param {*} requestUrl requested URL
     */
    static __loadAt(requestUrl) {

        /**
         * Returns the URL with pages prefix
         * @param {string} url the URL
         * @returns the URL with pages prefix
         */
        let prepareUrlWithPagesPrefix = (url) => {
            if (url.startsWith('/')) url = url.substring(1, url.length);
            if (url.endsWith('/')) url = url.substring(0, url.length - 1);
            return '/pages/' + url;
        }

        OphoseApp.__loadBase();
        OphoseEvent.callEvent("onPageLoad", requestUrl);

        requestUrl = prepareUrlWithPagesPrefix(requestUrl);

        let urlAndQuery = requestUrl.split("?");
        let urlFullPath = urlAndQuery[0];
        let urlPath = urlAndQuery[0].split('/');
        if (urlPath[urlPath.length - 1] == "") {
            urlPath.pop(urlPath.length - 1);
        }

        if (requestUrl == "/pages/") {
            urlFullPath = "/pages/index";
        }

        if (OphoseApp.__loadedPages[OphoseApp.__currentURL] && OphoseApp.__currentURL !== null) {
            OphoseApp.__loadedPages[OphoseApp.__currentURL]["pageInstance"].onLeave();
            OphoseApp.__loadedPages[OphoseApp.__currentURL]["page"] = $("app").clone(true, true);
        }
        if(OphoseApp.__currentURL == urlFullPath) return;
        OphoseApp.__currentURL = urlFullPath;

        // Returns fixed JSON response
        let getUrlQueries = () => {
            if(__OPHOSE_PRODUCTION_MODE) {
                let matchUrl = (url, link) => {
                    const urlParts = url.split('/');
                    const linkParts = link.split('/');
                    let vars = {};
                  
                    for (let i = 0; i < urlParts.length; i++) {
                        const urlPart = urlParts[i];
                        const linkPart = linkParts[i];
                    
                        if (urlPart && !linkPart) {
                            return {valid: false};
                        }

                        if (linkPart.startsWith('_')) {
                            vars[linkPart.substring(1, linkPart.length)] = urlPart ?? 'index';
                            continue;
                        }
                    
                        if (urlPart !== linkPart) {
                            return {valid: false};
                        }
                    }

                    for(let i = urlParts.length; i < linkParts.length; i++) {
                        const linkPart = linkParts[i];
                        if (linkPart.startsWith('_')) {
                            vars[linkPart.substring(1, linkPart.length)] = 'index';
                            continue;
                        }
                    }

                    return {
                        valid: true,
                        variables: vars
                    };
                }

                let findMatchingUrl = (url) => {
                    let matchingUrls = [];
                    for (const link in __OPHOSE_PAGES) {
                        let murl = matchUrl(url, link);
                        if (murl.valid) matchingUrls.push(
                            {
                                "link": link,
                                "variables": murl.variables
                            }
                        );
                    }
                    return matchingUrls;
                }

                // todo: filter best url

                let url = urlFullPath.substring('/pages/'.length, urlFullPath.length);
                if(url == '') url = 'index';
                let matchingUrls = findMatchingUrl(url);
                if(matchingUrls.length == 0) {
                    return {
                        valid: false,
                        path: "error",
                        variables: {}
                    };
                }else{
                    return {
                        valid: true,
                        path: matchingUrls[0].link,
                        variables: matchingUrls[0].variables
                    };
                }
            } else {
                return OphoseRest.request(
                    "router/get_url_queries",
                    {
                        url: urlFullPath
                    }
                );
            }
        }
        let jsonResponse = getUrlQueries();
        

        let urlExists = jsonResponse["valid"];
        let urlRequest = jsonResponse["path"];
        let urlQueries = jsonResponse["variables"];

        if (!urlExists && urlFullPath != "error") {
            OphoseApp.__loadAt("error");
            return;
        }

        let Page = undefined;

        let scrollToUrlId = () => {
            let url = window.location.href;
            let fragmentIndex = url.lastIndexOf('#');
            if (fragmentIndex == -1) return false;
            let id = url.substring(fragmentIndex + 1);
            let element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView();
                }, 250);
                return true;
            }
            return false;
        }

        let loadPage = (PageClass) => {

            let loadedPage = new PageClass(urlQueries);
            let pageNode = $(loadedPage.render())[0];
            
            // Remove all components
            document.querySelectorAll("app *").forEach((element) => {
                if(element.ophoseInstance){
                    element.ophoseInstance.__processRemove();
                }
            });

            OphoseApp.__$baseAppNode.replaceChildren(pageNode);
            loadedPage.___loadStyle();
            OphoseApp.__histories.push($("app"));

            OphoseApp.__loadedPages[urlRequest] = {};
            OphoseApp.__loadedPages[urlRequest]["pageInstance"] = loadedPage;
            OphoseApp.__loadedPages[urlRequest]["pageNode"] = pageNode;
            OphoseApp.__loadedPages[urlRequest]["pageClass"] = PageClass;

            loadedPage.onCreate();
            loadedPage.onLoad();
            OphoseRender.constructOphoseTree();
            if(!scrollToUrlId()) window.scrollTo(0, 0);
            OphoseEvent.callEvent("onPageLoaded", requestUrl);
        }

        if (urlFullPath != "error" && OphoseApp.__loadedPages[urlRequest]) {
            let pageClass = OphoseApp.__loadedPages[urlRequest]['pageClass'];
            loadPage(pageClass);
            return;
        }

        // Page loading
        if(__OPHOSE_PRODUCTION_MODE) {
            Page = __OPHOSE_PAGES[urlRequest];
            loadPage(Page);
        }else{
            OphoseScript.run(urlRequest, false,
                () => {
                    Page = OphoseApp.__getShared();
                    
                    loadPage(Page);
                },
                () => {
    
                    if (urlFullPath == "error") {
                        return;
                    }
                    OphoseApp.__loadAt("error");
                }
            );
        }
        
    }

    /**
     * Sets application title
     * @param {string} newTitle the new title
     */
    static setTitle(newTitle) {
        document.title = newTitle;
    }

    /**
     * Used to export an object
     * @param {object} object the object
     */
    static share(object) {
        OphoseApp.__lastShared = object;
    }

    /**
     * Used to get the last shareed object and reset it
     * @returns {object} the last shareed object
     */
    static __getShared() {
        let e = OphoseApp.__lastShared;
        OphoseApp.__lastShared = undefined;
        return e;
    }

}

const app = OphoseApp;
const oshare = OphoseApp.share; 