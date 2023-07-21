class OphoseImport {

    static __imported = [];
    static __lastExport = undefined;

    static __fixedPath(path) {
        return path.trim().replaceAll("//", "/");
    }

    static __strictUse(path) {
        OphoseImport.__imported.push(path);
        OphoseScript.run(path);
    }

    static __use(path) {
        if(__OPHOSE_PRODUCTION_MODE) return;
        let jsonResponse = OphoseRest.request(
            "/router/get_url_queries",
            {
                url: OphoseImport.__fixedPath(path)
            }
        );
        let urlExists = jsonResponse["valid"];
        let urlPath = jsonResponse["path"];
        if (!urlExists || OphoseImport.__imported.includes(urlPath)) {
            return;
        }
        OphoseImport.__strictUse(urlPath);
    }

    /**
     * Imports once the class component
     * @param {string} path the path
     */
    static useComponent(path) {
        OphoseImport.__use("/components/" + OphoseImport.__fixedPath(path));
    }

    /**
     * Imports once the class component from Ophose components
     * @param {string} path the path
     */
    static useOphoseComponent(path) {
        OphoseImport.__use("/ophose/components/" + OphoseImport.__fixedPath(path));
    }

    /**
     * Imports once the class module
     * @param {string} path the path
     */
    static useModule(path) {
        OphoseImport.__use("/modules/" + OphoseImport.__fixedPath(path));
    }

    /**
     * Imports once the class module from Ophose modules
     * @param {string} path the path
     */
    static useOphoseModule(path) {
        OphoseImport.__use("/ophose/modules/" + OphoseImport.__fixedPath(path));
    }

    /**
     * Imports once the environment
     * @param {string} path the path
     */
    static useEnvironment(path) {
        OphoseImport.__strictUse(OphoseImport.__fixedPath("/.ophose/_envjs/" + path));
    }

    /**
     * Imports once the environment
     * @param {string} path the path
     */
    static useEnvironmentComponent(env, path) {
        OphoseImport.__strictUse(OphoseImport.__fixedPath("/.ophose/_envjsc/" + env + "/c/" + path));
    }

    /**
     * Imports once the CSS
     * @param {string} path the path
     */
    static importCss(path) {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = path;
        document.head.appendChild(link);
    }

    /**
     * Imports once the script
     * @param {string} path the path
     */
    static importScript(path) {
        let script = document.createElement("script");
        script.src = path;
        document.head.appendChild(script);
    }

}

const importCss = OphoseImport.importCss;
const importScript = OphoseImport.importScript;

const oimpc = OphoseImport.useComponent;
const oimpm = OphoseImport.useModule;
const oimpcO = OphoseImport.useOphoseComponent;
const oimpmO = OphoseImport.useOphoseModule;
const oimpe = OphoseImport.useEnvironment;
const oimpec = OphoseImport.useEnvironmentComponent;