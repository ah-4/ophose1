class OphoseRest {

    /**
     * Returns JSON object from post request calling an Ophose
     * module
     * @param {*} module the module path
     * @param {*} postData post data to send
     * @param {*} callback(jsonObject) callback function
     * @param {*} asynchronous if request is synchronous or not
     */
    static request(moduleUrl, postData, asynchronous = false) {

        let fixedModuleUrl = moduleUrl.startsWith("/") ? moduleUrl.substring(1, moduleUrl.length) : moduleUrl;
        let jsonResult = null;

        $.ajax({
            type: 'POST',
            url: '/ophose/app/rest/' + fixedModuleUrl + '.php',
            async: asynchronous,
            data: postData,
            success: function (result) {
                jsonResult = JSON.parse(result);
            }
        });

        return jsonResult;

    }

}