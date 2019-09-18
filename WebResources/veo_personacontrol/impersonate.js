if (typeof Persona === 'undefined') { Persona = { __namespace: true }; }

var webAPIPath = "/api/data/v8.1";
var clientUrl = "";

Persona.request = function (action, uri, data, addHeader) {
    if (!RegExp(action, "g").test("POST PATCH PUT GET DELETE")) { // Expected action verbs.
        throw new Error("Persona.request: action parameter must be one of the following: " +
            "POST, PATCH, PUT, GET, or DELETE.");
    }
    if (!typeof uri === "string") {
        throw new Error("Persona.request: uri parameter must be a string.");
    }
    if ((RegExp(action, "g").test("POST PATCH PUT")) && (!data)) {
        throw new Error("Persona.request: data parameter must not be null for operations that create or modify data.");
    }
    if (addHeader) {
        if (typeof addHeader.header != "string" || typeof addHeader.value != "string") {
            throw new Error("Persona.request: addHeader parameter must have header and value properties that are strings.");
        }
    }

    // Construct a fully qualified URI if a relative URI is passed in.
    if (uri.charAt(0) === "/") {
        uri = clientUrl + webAPIPath + uri;
    }

    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open(action, encodeURI(uri), true);
        request.setRequestHeader("OData-MaxVersion", "4.0");
        request.setRequestHeader("OData-Version", "4.0");
        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        if (addHeader) {
            request.setRequestHeader(addHeader.header, addHeader.value);
        }
        request.onreadystatechange = function () {
            if (this.readyState === 4) {
                request.onreadystatechange = null;
                switch (this.status) {
                    case 200: // Success with content returned in response body.
                    case 204: // Success with no content returned in response body.
                    case 304: // Success with Not Modified
                        resolve(this);
                        break;
                    default: // All other statuses are error cases.
                        var error;
                        try {
                            error = JSON.parse(request.response).error;
                        } catch (e) {
                            error = new Error("Unexpected Error: " + this.status);
                        }
                        reject(error);
                        break;
                }
            }
        };
        request.send(JSON.stringify(data));
    });
};

Persona.impersonate = function (context) {
    //get client url 
    //Note Xrm.Utility is being deprecated, but this particular method has not been deprecated yet (as of 1/2019)
    clientUrl = Xrm.Utility.getGlobalContext().getClientUrl();
    //Retrieve current Persona guid
    var formContext = context.getFormContext();
    var persona = formContext.data.entity.getId();
    if (formContext.ui.getFormType() != 1) {
        if (formContext.getAttribute("veo_makeitso").getValue()) {
            //Clear any existing form notifications
            formContext.ui.clearFormNotification("Persona");

            //Retrieve currently logged in user id with WhoAmI Function
            Persona.whoAmI()
            .then(function (UserId) {
                //Call Custom action with user GUID and persona GUID as inputs
                Persona.callAction(UserId, formContext, persona);
            })
            formContext.getAttribute("veo_makeitso").setValue(false)
        }
    }
}

Persona.whoAmI = function () {
    return new Promise(function (resolve, reject) {
        //Use WhoAmI Function
        Persona.request("GET", "/WhoAmI")
        .then(function (request) {
            resolve(JSON.parse(request.response).UserId);
        })
        .catch(function (err) {
            reject("Error in WhoAmI function: " + err.message);
        });
    })
}

Persona.callAction = function(UserId, formContext, persona) {
    return new Promise(function (resolve, reject) {
        var parameters = {
            "UserId": UserId,
            "Persona": persona
        };
        Persona.request("POST", "/veo_PersonaSwitch", parameters)
        .then(function (request) {
            Persona.onResponse(JSON.parse(request.response), formContext);
        })
        .catch(function (err) {
            reject("Error in Action call: " + err.message);
        })
    })
}

Persona.onResponse = function (response, formContext) {
    if (response.ExceptionOccurred != true) {
        formContext.ui.setFormNotification("Persona successfully switched", "INFO", "Persona")
    }
    else {
        formContext.ui.setFormNotification("Error switching personas: " + response.ExceptionMessage, "WARN", "Persona")
    }
}