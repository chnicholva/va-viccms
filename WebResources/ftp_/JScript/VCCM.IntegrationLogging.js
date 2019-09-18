if (typeof(VCCM) == "undefined") {
	VCCM = {
		__namespace : true
	};
}
VCCM.IntegrationLogging = {
	_context : function () {
		///<summary>
		/// Private function to the context object.
		///</summary>
		///<returns>Context</returns>
		if (typeof GetGlobalContext != "undefined") {
			return GetGlobalContext();
		} else {
			if (typeof Xrm != "undefined") {
				return Xrm.Page.context;
			} else {
				throw new Error("Context is not available.");
			}
		}
	},
	_getServerUrl : function () {
		///<summary>
		/// Private function to return the server URL from the context
		///</summary>
		///<returns>String</returns>
		var serverUrl = this._context().getClientUrl()
			if (serverUrl.match(/\/$/)) {
				serverUrl = serverUrl.substring(0, serverUrl.length - 1);
			}
			return serverUrl;
	},
	_ODataPath : function () {
		///<summary>
		/// Private function to return the path to the REST endpoint.
		///</summary>
		///<returns>String</returns>
		return this._getServerUrl() + "/XRMServices/2011/OrganizationData.svc/";
	},
	_errorHandler : function (req) {
		///<summary>
		/// Private function return an Error object to the errorCallback
		///</summary>
		///<param name="req" type="XMLHttpRequest">
		/// The XMLHttpRequest response that returned an error.
		///</param>
		///<returns>Error</returns>
		//Error descriptions come from http://support.microsoft.com/kb/193625
		if (req.status == 12029) {
			return new Error("The attempt to connect to the server failed.");
		}
		if (req.status == 12007) {
			return new Error("The server name could not be resolved.");
		}
		var errorText;
		try {
			errorText = JSON.parse(req.responseText).error.message.value;
		} catch (e) {
			errorText = req.responseText
		}

		return new Error("Error : " +
			req.status + ": " +
			req.statusText + ": " + errorText);
	},
	_dateReviver : function (key, value) {
		///<summary>
		/// Private function to convert matching string values to Date objects.
		///</summary>
		///<param name="key" type="String">
		/// The key used to identify the object property
		///</param>
		///<param name="value" type="String">
		/// The string value representing a date
		///</param>
		var a;
		if (typeof value === 'string') {
			a = /Date\(([-+]?\d+)\)/.exec(value);
			if (a) {
				return new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
			}
		}
		return value;
	},
	_parameterCheck : function (parameter, message) {
		///<summary>
		/// Private function used to check whether required parameters are null or undefined
		///</summary>
		///<param name="parameter" type="Object">
		/// The parameter to check;
		///</param>
		///<param name="message" type="String">
		/// The error message text to include when the error is thrown.
		///</param>
		if ((typeof parameter === "undefined") || parameter === null) {
			throw new Error(message);
		}
	},
	_stringParameterCheck : function (parameter, message) {
		///<summary>
		/// Private function used to check whether required parameters are null or undefined
		///</summary>
		///<param name="parameter" type="String">
		/// The string parameter to check;
		///</param>
		///<param name="message" type="String">
		/// The error message text to include when the error is thrown.
		///</param>
		if (typeof parameter != "string") {
			throw new Error(message);
		}
	},
	_dateParameterCheck : function (parameter, message) {
		if (typeof parameter != "undefined" && Object.prototype.toString.call(parameter) != "[object Date]") {
			throw new Error(message);
		}
	},
	_lookupParameterCheck : function (parameter, message) {
		if (typeof parameter == "undefined") {
			throw new Error(message);
		}
		if (typeof parameter != "undefined" && typeof parameter != "object") {
			throw new Error(message);
		}
		if (!parameter.hasOwnProperty("Id")) {
			throw new Error("VCCM.IntegrationLogging.LogIntegrationResult requires that pLookupObject.Id is a string.");
		}
		if (parameter.hasOwnProperty("Id"))
			this._stringParameterCheck(parameter.Id, "VCCM.IntegrationLogging.LogIntegrationResult requires that pLookupObject.Id is a string.");

		if (!parameter.hasOwnProperty("LogicalName")) {
			throw new Error("VCCM.IntegrationLogging.LogIntegrationResult requires that pLookupObject.LogicalName is a string.");
		}
		if (parameter.hasOwnProperty("LogicalName"))
			this._stringParameterCheck(parameter.LogicalName, "VCCM.IntegrationLogging.LogIntegrationResult requires that pLookupObject.LogicalName is a string.");

		if (!parameter.hasOwnProperty("Name")) {
			throw new Error("VCCM.IntegrationLogging.LogIntegrationResult requires that pLookupObject.Name is a string.");
		}
		if (parameter.hasOwnProperty("Name"))
			this._stringParameterCheck(parameter.Name, "VCCM.IntegrationLogging.LogIntegrationResult requires that pLookupObject.Name is a string.");
	},
	_callbackParameterCheck : function (callbackParameter, message) {
		///<summary>
		/// Private function used to check whether required callback parameters are functions
		///</summary>
		///<param name="callbackParameter" type="Function">
		/// The callback parameter to check;
		///</param>
		///<param name="message" type="String">
		/// The error message text to include when the error is thrown.
		///</param>
		if (typeof callbackParameter != "function") {
			throw new Error(message);
		}
	},
	LogIntegrationResult : function (pName, pWebService, pURL, pIntegrationDate, pIntegrationStatus, pExternalId, pErrorMessage, pLookupField, pLookupObject, pSuccessCallback, pErrorCallback) {
		var allowedLookupObjects = [
			{ fieldSchemaName: "ftp_veteran", logicalName: "contact" },
			{ fieldSchemaName: "ftp_progressnote", logicalName: "ftp_progressnote"},
			{ fieldSchemaName: "ftp_addendum", logicalName: "ftp_addendum" },
			{ fieldSchemaName: "ftp_AdditionalSignerId", logicalName: "ftp_additionalsigner" }
		];

		this._stringParameterCheck(pWebService, "VCCM.IntegrationLogging.LogIntegrationResult requires that ftp_webservice is a string.");
		this._stringParameterCheck(pURL, "VCCM.IntegrationLogging.LogIntegrationResult requires that ftp_url is a string.");
		this._dateParameterCheck(pIntegrationDate, "VCCM.IntegrationLogging.LogIntegrationResult requires that ftp_integrationdate is a datetime object, e.g. 'new Date()'");
		this._stringParameterCheck(pIntegrationStatus, "VCCM.IntegrationLogging.LogIntegrationResult requires that ftp_integrationstatus is a string.");
		if(!!pExternalId) { this._stringParameterCheck(pExternalId, "VCCM.IntegrationLogging.LogIntegrationResult requires that ftp_uniqueid is a string."); }
		if (!!pErrorMessage) { this._stringParameterCheck(pErrorMessage, "VCCM.IntegrationLogging.LogIntegrationResult requires that ftp_errormessage is a string."); }
		this._stringParameterCheck(pLookupField, "VCCM.IntegrationLogging.LogIntegrationResult requires that pLookupField is a string.");
		this._lookupParameterCheck(pLookupObject, "VCCM.IntegrationLogging.LogIntegrationResult requires that pLookupObject is an object with the schema {Id(GUID as string), LogicalName(string), Name(string)}");
		this._callbackParameterCheck(pSuccessCallback, "VCCM.IntegrationLogging.LogIntegrationResult requires that pSuccessCallback is a function.");
		this._callbackParameterCheck(pErrorCallback, "VCCM.IntegrationLogging.LogIntegrationResult requires that pErrorCallback is a function.");

		var newRecord = {
			ftp_name : pName,
			ftp_webservice : pWebService,
			ftp_url : pURL,
			ftp_integrationdate : pIntegrationDate,
			ftp_integrationstatus : pIntegrationStatus,
			ftp_uniqueid : pExternalId,
			ftp_errormessage : pErrorMessage,
		};
		newRecord.ftp_name = (!!pName) ? pName : ""; 
		for (var i = 0; i < allowedLookupObjects.length; i++) {
			if (pLookupField.toLowerCase() == allowedLookupObjects[i].fieldSchemaName.toLowerCase() && pLookupObject.LogicalName.toLowerCase() == allowedLookupObjects[i].logicalName.toLowerCase()) {
				newRecord[allowedLookupObjects[i].fieldSchemaName] = pLookupObject;
				if(!!!newRecord.ftp_name) newRecord.ftp_name = "Integration Result for " + pLookupObject.Name + " on " + newRecord.ftp_integrationdate.toLocaleString();
				break;
			}
		}

		var req = new XMLHttpRequest();
		req.open("POST", encodeURI(this._ODataPath() + "ftp_integrationresultSet"), true);
		req.setRequestHeader("Accept", "application/json");
		req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		req.onreadystatechange = function () {
			if (this.readyState == 4 /* complete */
			)
			{
				if (this.status == 201) {
					this.onreadystatechange = null; //avoids memory leaks
					pSuccessCallback(JSON.parse(this.responseText, SDK.REST._dateReviver).d);
				} else {
					pErrorCallback(VCCM.IntegrationLogging._errorHandler(this));
				}
			}
		};
		req.send(JSON.stringify(newRecord));
	},
	LogSuccess : function(pName, pWebService, pURL, pIntegrationDate, pExternalId, pLookupField, pLookupObject, pSuccessCallback, pErrorCallback){
		this._stringParameterCheck(pWebService, "VCCM.IntegrationLogging.LogSuccess requires that ftp_webservice is a string.");
		this._stringParameterCheck(pURL, "VCCM.IntegrationLogging.LogSuccess requires that ftp_url is a string.");
		this._dateParameterCheck(pIntegrationDate, "VCCM.IntegrationLogging.LogSuccess requires that ftp_integrationdate is a datetime object, e.g. 'new Date()'");
		if(!!pExternalId) { this._stringParameterCheck(pExternalId, "VCCM.IntegrationLogging.LogSuccess requires that ftp_uniqueid is a string."); }
		this._stringParameterCheck(pLookupField, "VCCM.IntegrationLogging.LogSuccess requires that pLookupField is a string.");
		this._lookupParameterCheck(pLookupObject, "VCCM.IntegrationLogging.LogSuccess requires that pLookupObject is an object with the schema {Id(GUID as string), LogicalName(string), Name(string)}");
		this._callbackParameterCheck(pSuccessCallback, "VCCM.IntegrationLogging.LogSuccess requires that pSuccessCallback is a function.");
		this._callbackParameterCheck(pErrorCallback, "VCCM.IntegrationLogging.LogSuccess requires that pErrorCallback is a function.");
		
		var name = (!!pName) ? pName : (pWebService + " integration Success for " + pLookupObject.Name + " on " + pIntegrationDate.toLocaleString()).substr(0,100);
		this.LogIntegrationResult(name, pWebService, pURL, pIntegrationDate, "SUCCESS", pExternalId, null, pLookupField, pLookupObject, pSuccessCallback, pErrorCallback);
	},
	LogFailure : function(pName, pWebService, pURL, pIntegrationDate, pExternalId, pErrorMessage, pLookupField, pLookupObject, pSuccessCallback, pErrorCallback){
		this._stringParameterCheck(pWebService, "VCCM.IntegrationLogging.LogFailure requires that ftp_webservice is a string.");
		this._stringParameterCheck(pURL, "VCCM.IntegrationLogging.LogFailure requires that ftp_url is a string.");
		this._dateParameterCheck(pIntegrationDate, "VCCM.IntegrationLogging.LogFailure requires that ftp_integrationdate is a datetime object, e.g. 'new Date()'");
		if(!!pExternalId) { this._stringParameterCheck(pExternalId, "VCCM.IntegrationLogging.LogFailure requires that ftp_uniqueid is a string."); }
		this._stringParameterCheck(pErrorMessage, "VCCM.IntegrationLogging.LogFailure requires that ftp_errormessage is a string.");
		this._stringParameterCheck(pLookupField, "VCCM.IntegrationLogging.LogFailure requires that pLookupField is a string.");
		this._lookupParameterCheck(pLookupObject, "VCCM.IntegrationLogging.LogFailure requires that pLookupObject is an object with the schema {Id(GUID as string), LogicalName(string), Name(string)}");
		this._callbackParameterCheck(pSuccessCallback, "VCCM.IntegrationLogging.LogFailure requires that pSuccessCallback is a function.");
		this._callbackParameterCheck(pErrorCallback, "VCCM.IntegrationLogging.LogFailure requires that pErrorCallback is a function.");
		
		var name = (!!pName) ? pName : (pWebService + " integration Failure for " + pLookupObject.Name + " on " + pIntegrationDate.toLocaleString()).substr(0,100);
		this.LogIntegrationResult(name, pWebService, pURL, pIntegrationDate, "FAILURE", pExternalId, pErrorMessage, pLookupField, pLookupObject, pSuccessCallback, pErrorCallback);
	}
};
