if (typeof (REST) == "undefined")
{ REST = { __namespace: true }; }
REST.SYNC = {
    retrieveRecordSync: function(id, type, select, expand) {
        ///<summary>
        /// Sends a synchronous request to retrieve a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to retrieve.
        ///</param>
        ///<param name="type" type="String">
        /// The Schema Name of the Entity type record to retrieve.
        /// For an Account record, use "Account"
        ///</param>
        ///<param name="select" type="String">
        /// A String representing the $select OData System Query Option to control which
        /// attributes will be returned. This is a comma separated list of Attribute names that are valid for retrieve.
        /// If null all properties for the record will be returned
        ///</param>
        SDK.REST._stringParameterCheck(id, "SDK.REST.retrieveRecord requires the id parameter is a string.");
        SDK.REST._stringParameterCheck(type, "SDK.REST.retrieveRecord requires the type parameter is a string.");
        if (select != null)
            SDK.REST._stringParameterCheck(select, "SDK.REST.retrieveRecord requires the select parameter is a string.");
        if (expand != null)
            SDK.REST._stringParameterCheck(expand, "SDK.REST.retrieveRecord requires the expand parameter is a string.");

        var systemQueryOptions = "";

        if (select != null || expand != null) {
            systemQueryOptions = "?";
            if (select != null) {
                var selectString = "$select=" + select;
                if (expand != null) {
                    selectString = selectString + "," + expand;
                }
                systemQueryOptions = systemQueryOptions + selectString;
            }
            if (expand != null) {
                systemQueryOptions = systemQueryOptions + "&$expand=" + expand;
            }
        }

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(SDK.REST._ODataPath() + type + "Set(guid'" + id + "')" + systemQueryOptions), false);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.send();

        if (req.status == 200) {
            var parsedResult = JSON.parse(req.responseText);
            if (parsedResult.d!=null) {
                return parsedResult.d;
            } else {
                return null;
                alert("Error: No data returned on REST call");
            }
        } else {
            alert("Error: Rest.Sync.retrieveRecordSync: " + req.status)
        }
    },
    retrieveMultipleRecordsSync: function(type, options) {
        ///<summary>
        /// Sends a synchronous request to retrieve records.
        ///</summary>
        ///<param name="type" type="String">
        /// The Schema Name of the Entity type record to retrieve.
        /// For an Account record, use "Account"
        ///</param>
        ///<param name="options" type="String">
        /// A String representing the OData System Query Options to control the data returned
        ///</param>
        SDK.REST._stringParameterCheck(type, "SDK.REST.retrieveMultipleRecords requires the type parameter is a string.");
        if (options != null)
            SDK.REST._stringParameterCheck(options, "SDK.REST.retrieveMultipleRecords requires the options parameter is a string.");

        var optionsString;
        if (options != null) {
            if (options.charAt(0) != "?") {
                optionsString = "?" + options;
            } else {
                optionsString = options;
            }
        }

        var req = new XMLHttpRequest();
        req.open("GET", SDK.REST._ODataPath() + type + "Set" + optionsString, false);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.send();

        if (req.status == 200) {
            var parsedResult = JSON.parse(req.responseText);
            if (parsedResult.d != null) {
                return parsedResult.d;
            } else {
                return null;
                alert("Error: No data returned on REST call");
            }
        } else {
            alert("Error: Rest.Sync.retrieveRecordSync: " + req.status)
        }
    },
    __namespace: true
};
