/**
 * Class representing ophose environment
 */
class OphoseEnvironment {

    /**
     * Returns environment URL
     * @param {*} env the environment
     * @param {*} request the request (rest)
     */
    static constructURL(env, request, getParameters = {}) {

        let getsToString = (param) => {
            let paramString = "";
            for (const [p, v] of Object.entries(getParameters)) {
                paramString += `&${p}=${v}`;
            }
            return paramString;
        }

        return '/.ophose/r/' + env + '/e/' + request + getsToString(getParameters);
    }

    /**
     * Sends asychronous request (POST) to the environment
     * and return JSON parsed result
     * @param {string} env the environment path
     * @param {string} request the rest request
     * @param {Array} data post data
     */
    static async post(env, request, data = {}) {

        let jsonResult = null;
        let error = false;

        await $.ajax({
            type: 'POST',
            url: OphoseEnvironment.constructURL(env, request),
            data: data,
            success: (result) => {
                jsonResult = result;
            },
            error: (result) => {
                error = true;
                jsonResult = JSON.parse(result.responseText);
            }
        });

        if (error) {
            throw jsonResult;
        }
        
        return jsonResult;
    }

    /**
     * Sends files to an environment request
     * @param {string} env the environment path
     * @param {string} request the rest request
     * @param {string} name the file(s) name
     * @param {boolean} multiple if user can send multiple file
     */
    static async sendFiles(env, request, filename, callbackSuccess, callbackError, multiple = false, acceptTypes = "*") {
        let url = OphoseEnvironment.constructURL(env, request);

        let __form = document.createElement("form");
        __form.enctype = "multipart/form-data";

        let __fileInput = document.createElement("input");
        __fileInput.type = "file";
        __fileInput.accept = acceptTypes;
        if (multiple) {
            __fileInput.multiple = true;
        }
        __fileInput.id = filename;
        __fileInput.name = filename;

        __form.appendChild(__fileInput);

        __fileInput.click();

        let dataReceived = null;

        __fileInput.onchange = e => {
            let form_data = new FormData(__form);
            $.ajax({
                url: url, // <-- point to server-side PHP script 
                dataType: 'json',  // <-- what to expect back from the PHP script, if anything
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: 'POST',
                method: 'POST',
                success: (r) => {
                    callbackSuccess(r) // <-- display response from the PHP script, if any
                },
                error: (r) => {
                    callbackError(r);
                }
            });
        };


    }

}

/**
 * Class representing an environment entity
 */
class EnvironmentEntity {

    constructor(id, data) {
        this.__id = id;
        this.data = data;
    }

    /**
     * Returns entity id
     * @returns {*} id
     */
    getId() {
        return this.__id;
    }

    /**
     * Method called when entity is updated
     * @param {*} data the new data
     * @abstract
     */
    update(data) {

    }

}

/**
 * Class representing an environment entity manager
 */
class EnvironmentEntityManager {

    /**
     * Environment constructor
     * @param {EnvironmentEntity}
     * @param {boolean} saveEntitiesInCache if environment should saves 
     */
    constructor(EntityClass, saveEntitiesInCache = true) {
        this.__EntityClass = EntityClass;
        this.__entities = {};
        this.__saveEntitiesInCache = saveEntitiesInCache;
    }

    /**
     * Returns entity (null if not overriden)
     * (Note that if this function isn't overriden, it'll
     * return entity from array, or entity created from
     * createEntity(id))
     * @param {*} id the entity id
     * @returns {EnvironmentEntity} entity
     */
    async getEntity(id) {
        if (this.saveEntitiesInCache && this.__entities[id]) {
            return this.__entities[id];
        }
        return await this.__generateEntity(id);
    }

    /**
     * Generates entity then returns it
     * @param {*} id the entity id
     * @returns entity
     */
    async __generateEntity(id) {
        let entity = await this.createEntity(id);
        if (entity === undefined) {
            return undefined;
        }
        if (this.saveEntitiesInCache) {
            this.__entities[id] = entity;
        }
        return entity;
    }

    /**
     * This method is called when an entity is needed to
     * be created
     * @param {*} id the entity id
     * @returns created entity (null by default)
     */
    async createEntity(id) {
        return null;
    }

    /**
     * Saves entity in cache with data
     * @param {*} id the entity id
     * @param {*} data the entity data
     */
    saveEntity(id, data) {
        if(!this.__saveEntitiesInCache) return;
        if(this.__entities[id]) {
            this.__entities[id].data = data;
            this.__entities[id].update(data);
            return;
        }
        this.__entities[id] = new this.__EntityClass(id, data);
    }

    /**
     * Cleans all created entities
     */
    cleanEntities() {
        this.__entities = {};
    }

}

const oenv = OphoseEnvironment.post;
const oenvSendFiles = OphoseEnvironment.sendFiles;