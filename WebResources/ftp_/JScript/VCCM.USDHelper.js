var JSQueue = (function () {
    JSQueue.prototype.interval = 0;
    JSQueue.prototype.autorun = true;
    JSQueue.prototype.running = false;
    JSQueue.prototype.queue = [];
    function JSQueue(pAutorun, pInterval) {
        if (typeof pAutorun !== "undefined") {
            this.autorun = pAutorun;
        }
        if (typeof pInterval !== "undefined") {
            this.interval = pInterval;
        }
        this.queue = []; //initialize the queue
        //console.log("Constructed new JSQueue object: { autorun: " + this.autorun.toString() + ", interval: " + this.interval.toString() + ", queue.length: " + this.queue.length.toString());
    };
    JSQueue.prototype.add = function (pFunction) {
        //console.log("begin add(). Queue length:" + this.queue.length);
        var _this = this;
        //add pFunction to the queue
        this.queue.push(function () {
            var thisFunctionIsFinished = pFunction();
            if (typeof thisFunctionIsFinished === "undefined" || !!thisFunctionIsFinished) {
                //if pFunction returns 'false', then you have to manually call 'next' somewhere in pFunction
                _this.dequeue();
            }
            else if (thisFunctionIsFinished == false) {
                _this.next();
            }
            else {

            }
        });

        if (this.autorun && !this.running) {
            //if autorun is on and nothing is running, then start the engines!
            this.dequeue();
        }
        return this;
    };
    JSQueue.prototype.dequeue = function () {
        //console.log("begin dequeue(). Starting queue length:" + this.queue.length);
        this.running = false;
        //get the next function from the queue
        var nextFunction = this.queue.shift();
        //console.log("dequeue() shifted queue. New queue length:" + this.queue.length);
        if (!!nextFunction) {
            this.running = true;
            setTimeout(nextFunction, this.interval);
        }
        return nextFunction;
    };
    JSQueue.prototype.next = JSQueue.prototype.dequeue;
    return JSQueue;
})();

if (typeof (VCCM) == "undefined") {
	VCCM = {
		__namespace : true
	};
}

VCCM.USDHelper = {
	_globalManagerName: "Shared Global Manager",
	_userSecurityControlName: "User Security",
    _commonControlName: "Common",
    _crlf: "%0D%0A",
    _functionQueue: new JSQueue(true, 20),
    AddFunctionToQueue: function (pFunction) {
        this._functionParameterCheck(pFunction, "VCCM.USDHelper.AddFunctionToQueue() requires that pFunction is a function.");
        this._functionQueue.add(pFunction);
    },
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
	_numberParameterCheck: function(parameter, message){
	    ///<summary>
	    /// Private function used to check whether required parameters are null or undefined
	    ///</summary>
	    ///<param name="parameter" type="number">
	    /// The number parameter to check;
	    ///</param>
	    ///<param name="message" type="String">
	    /// The error message text to include when the error is thrown.
	    ///</param>
	    if (typeof parameter != "number") {
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
			throw new Error("VCCM.USDHelper requires that pLookupObject.Id is a string.");
		}
		if (parameter.hasOwnProperty("Id")){
			this._stringParameterCheck(parameter.Id, "VCCM.USDHelper requires that pLookupObject.Id is a string.");
		}
		if (!parameter.hasOwnProperty("LogicalName")) {
			throw new Error("VCCM.USDHelper requires that pLookupObject.LogicalName is a string.");
		}
		if (parameter.hasOwnProperty("LogicalName")){
			this._stringParameterCheck(parameter.LogicalName, "VCCM.USDHelper requires that pLookupObject.LogicalName is a string.");
		}
		if (!parameter.hasOwnProperty("Name")) {
			throw new Error("VCCM.USDHelper requires that pLookupObject.Name is a string.");
		}
		if (parameter.hasOwnProperty("Name")){
			this._stringParameterCheck(parameter.Name, "VCCM.USDHelper requires that pLookupObject.Name is a string.");
		}
	},
	_arrayParameterCheck : function(parameter, message){
	    if (typeof parameter == "undefined") {
	        throw new Error(message);
	    }
	    if (typeof parameter != "undefined" && !(Object.prototype.toString.call(parameter) == "[object Array]")) {
	        throw new Error(message);
	    }
	    if (!(parameter.length > 0)) {
	        throw new Error(message);
	    }
	},
	_booleanParameterCheck : function(parameter, message){
	    if (typeof parameter != "boolean") {
	        throw new Error(message);
	    }
	},
	_functionParameterCheck: function (parameter, message) {
	    ///<summary>
	    /// Private function used to check whether required callback parameters are functions
	    ///</summary>
	    ///<param name="callbackParameter" type="Function">
	    /// The callback parameter to check;
	    ///</param>
	    ///<param name="message" type="String">
	    /// The error message text to include when the error is thrown.
	    ///</param>
	    if (typeof parameter != "function") {
	        throw new Error(message);
	    }
	},
	_processDataArrayIntoURLString: function (pData, pIndex, pValidationFunction, pMemberTransformFunction, pJoinCharacter, pAccumulatedString) {
	    this._functionParameterCheck(pValidationFunction, "VCCM.USDHelper._processDataArrayIntoURLString requires that pValidationFunction is a function.");
	    this._functionParameterCheck(pValidationFunction, "VCCM.USDHelper._processDataArrayIntoURLString requires that pMemberTransformFunction is a function.");
	    var index = !!pIndex && typeof pIndex == "number" ? pIndex : 0;
	    var returnString = !!pAccumulatedString ? pAccumulatedString : "";
	    if (!!pData && pData.length > 0 && index < pData.length) {
	        var thisMember = pData[index];
	        if (pValidationFunction(thisMember, index) == true) {
	            var transformedMember = pMemberTransformFunction(thisMember, index);
	            returnString += (index > 0 ? pJoinCharacter : "") + transformedMember;
	            return this._processDataArrayIntoURLString(pData, index + 1, pValidationFunction, pMemberTransformFunction, pJoinCharacter, returnString);
	        }
	    }
	    else {
	        return returnString;
	    }	    
	},
	_docCookies: {
	    getItem: function (sKey) {
	        //return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "$&") + "s*=s*([^;]*).*$)|^.*$"), "$1")) || null;
	        if (!sKey) return null;
	        var keys = this.keys();
	        for (var i = 0, l = keys.length; i < l; i++) {
	            if (keys[i].name == sKey) return keys[i].value;
	        }
	    },
	    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
	        if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) { return false; }
	        var sExpires = "";
	        if (vEnd) {
	            switch (vEnd.constructor) {
	                case Number:
	                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
	                    break;
	                case String:
	                    sExpires = "; expires=" + vEnd;
	                    break;
	                case Date:
	                    sExpires = "; expires=" + vEnd.toUTCString();
	                    break;
	            }
	        }
	        var newCookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires/* + (sDomain ? "; domain=" + sDomain : "")*/ + (sPath ? "; path=" + sPath : "")/* + (bSecure ? "; secure" : "")*/;
	        document.cookie = newCookie;
	        return true;
	    },
	    removeItem: function (sKey, sPath, sDomain) {
	        if (!sKey || !this.hasItem(sKey)) { return false; }
	        var removalCookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT"/* + (sDomain ? "; domain=" + sDomain : "")*/ + (sPath ? "; path=" + sPath : "");
	        document.cookie = removalCookie;
	        return true;
	    },
	    hasItem: function (sKey) {
	        //return (new RegExp("(?:^|;s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "$&") + "s*=")).test(document.cookie);
	        if (!sKey) return false;
	        var keys = this.keys();
	        for (var i = 0, l = keys.length; i < l; i++) {
	            if (keys[i].name == sKey) return true;
	        }
	    },
	    keys: function () {
	        var encodedCookies = document.cookie.split(';');
	        var cookieObjectArray = [];
	        for (var i = 0, l = encodedCookies.length; i < l; i++) {
	            var x = encodedCookies[i].split('=');
	            cookieObjectArray.push({ name: x[0].trim(), value: decodeURIComponent(x[1]).trim() });
	        }
	        cookieObjectArray.sort(this.SortArray("name"));
	        cookieObjectArray = this.RemoveDuplicates(cookieObjectArray, "name");
	        return cookieObjectArray;
	    },
	    SortArray: function(pSortProperty) {
	        var sortOrder = 1;
	        if (pSortProperty[0] === "-") {
	            sortOrder = -1;
	            pSortProperty = pSortProperty.substr(1);
	        }
	        return function (a, b) {
	            var result = (a[pSortProperty] < b[pSortProperty]) ? -1 : (a[pSortProperty] > b[pSortProperty]) ? 1 : 0;
	            return result * sortOrder;
	        }
	    },
	    RemoveDuplicates: function(pArray, pAttribute) {
	        var pArrayObject = {};
	        var returnArray = [];
	        var j = 0;
	        for (var i = 0; i < pArray.length; i++) {
	            var item = pArray[i];
	            if (pArrayObject[item[pAttribute]] !== 1) {
	                pArrayObject[item[pAttribute]] = 1;
	                returnArray[j++] = item;
	            }
	        }
	        return returnArray;
	    }
	},
	GetCookie: function(pKey){
	    this._stringParameterCheck(pKey, "VCCM.USDHelper.GetCookie() requires that pKey is a string.");
	    return this._docCookies.getItem(pKey);
	},
	SetCookie: function(pKey, pValue, pAge){
	    this._stringParameterCheck(pKey, "VCCM.USDHelper.SetCookie() requires that pKey is a string.");
	    this._parameterCheck(pValue, "pValue is a required parameter of VCCM.USDHelper.SetCookie().");
	    if (!!pAge) {
	        this._numberParameterCheck(pAge, "VCCM.USDHelper.SetCookie() requires that pAge is a number, indicating how many hours you want the cookie to last.");
	    }
	    var age = !!pAge ? pAge : 1; //default to 1 hour
	    var now = new Date();
	    var expiration = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + age, now.getMinutes(), now.getSeconds(), now.getMilliseconds());
	    return this._docCookies.setItem(pKey, pValue, expiration, "/");
	},
	GetGlobalManagerName: function(){
	    return this._globalManagerName;
	},
	OpenUSDURL: function (pURL, pCallbackFunction){
	    this._stringParameterCheck(pURL, "VCCM.USDHelper.OpenUSDURL() requires that pURL is a string.");
        this.AddFunctionToQueue(function () { window.open(pURL); });
	    if (typeof pCallbackFunction == "function") {
	        pCallbackFunction();
	    }
	},
	FireUSDEvent: function (pName, pData, pCallbackFunction) {
	    /*
            pName is the exact name of the USD event. The named event must exist under the current hosted control from which some script is calling this FireUSDEvent function.
            pData should be an array of strings representing key-value-pairs joined with '=' signs 
			e.g. ["firstName=John","middleName=","lastName=Doe"] will copy firstName and lastName values to $Context, as well as an empty middleName value
            pCallbackFunction is an optional passthrough function that takes no parameters
        */
	    try {
	        this._stringParameterCheck(pName, "VCCM.USDHelper.CopyCredentialToReplacementParameters() requires that pName is a string.");
	        var commandUrl = "http://event/?eventname=" + pName;
	        if (!!pData) {
				var singleStringParameter = false;
	            if (typeof pData == "string") {
	                this._stringParameterCheck(pData, "VCCM.USDHelper.FireUSDEvent() requires that pData is either a single string value or an Array of one or more members, each of which being a key value pair joined by an equal sign.");
	                singleStringParameter = true;
	            }
				else {
	                this._arrayParameterCheck(pData, "VCCM.USDHelper.FireUSDEvent() requires that pData is either a single string value or an Array of one or more members, each of which being a key value pair joined by an equal sign.");
	            }
				
				if (singleStringParameter) {
	                commandUrl += "&" + pData;
	            }
	            else {
					for (var i = 0; i < pData.length; i++) {
						var thisValue = pData[i];
						if (thisValue.indexOf("=") > -1) {
							commandUrl += ("&" + thisValue);
						}
					}
	            }	            
	        }
	        this.OpenUSDURL(commandUrl, pCallbackFunction);
	    }
	    catch (e) {
	        alert(e.message);
	        throw e;
	    }

	},
	CopyToUSDContext: function(pData, pCallbackFunction){
		/*
			pData should be an array of strings representing key-value-pairs joined with '=' signs 
			e.g. ["firstName=John","middleName=","lastName=Doe"] will copy firstName and lastName values to $Context, as well as an empty middleName value
            pCallbackFunction is an optional passthrough function that takes no parameters
		*/
	    try {
	        this._arrayParameterCheck(pData, "VCCM.USDHelper.CopyToUSDContext() requires that pData is an Array of one or more members, each of which being a key value pair joined by an equal sign.");
	        var commandUrl = "http://uii/" + this._globalManagerName + "/CopyToContext?";
	        var fire = false;
			for(var i = 0; i < pData.length; i++){
				var thisValue = pData[i];
				if(thisValue.indexOf("=") > -1){
				    commandUrl += (i == 0) ? thisValue : (this._crlf + thisValue);
					fire = true;
				}
			}
			if (fire == true) {
			    this.OpenUSDURL(commandUrl, pCallbackFunction);
			}
		}
	    catch (e) {
	        alert(e.message);
			throw e;
		}
	},
	CopyCredentialToReplacementParameters: function(pName, pValue, pCallbackFunction){
		/*
			pName and pValue should be strings
            pCallbackFunction is an optional passthrough function that takes no parameters
		*/
	    try {
	        this._stringParameterCheck(pName, "VCCM.USDHelper.CopyCredentialToReplacementParameters() requires that pName is a string.");
	        this._stringParameterCheck(pValue, "VCCM.USDHelper.CopyCredentialToReplacementParameters() requires that pValue is a string.");;
	        var commandUrl = "http://uii/" + this._userSecurityControlName + "/CopyCredentialToReplacementParameters?name=" + pName + this._crlf + "value=" + pValue;
	        this.OpenUSDURL(commandUrl, pCallbackFunction);
		}
	    catch (e) {
	        alert(e.message);
			throw e;
		}
	},
	CopyDataToReplacementParameters: function (pGroupName, pData, pGlobal, pCallbackFunction) {
	    /*
            pGroupName should be a string, the name of the replacement parameter group where you want to place the data
			pData should be an array of strings representing key-value-pairs joined with '=' signs
                e.g. ["firstName=John","middleName=","lastName=Doe"] will copy firstName and lastName values to pGroupName, as well as an empty middleName value
            pGlobal should be a boolean, indicating pGroupName should be a global or session-based grouping
            pCallbackFunction is an optional passthrough function that takes no parameters
		*/
	    try {
	        this._stringParameterCheck(pGroupName, "VCCM.USDHelper.CopyDataToReplacementParameters() requires that pGroupName is a string.");
	        this._arrayParameterCheck(pData, "VCCM.USDHelper.CopyDataToReplacementParameters() requires that pData is an Array of one or more members, each of which being a key value pair joined by an equal sign.");
	        this._booleanParameterCheck(pGlobal, "VCCM.USDHelper.CopyDataToReplacementParameters() requires that pGlobal is a boolean.");
	        var commandUrl = "http://uii/" + this._commonControlName + "/CopyDataToReplacementParameters?group=" + pGroupName + this._crlf + "global=" + pGlobal.toString() + this._crlf;
	        var fire = false;
	        for (var i = 0; i < pData.length; i++) {
	            var thisValue = pData[i];
	            if (thisValue.indexOf("=") > -1) {
	                commandUrl += (i == 0) ? thisValue : (this._crlf + thisValue);
	                fire = true;
	            }
	        }
	        if (fire == true) {
	            this.OpenUSDURL(commandUrl, pCallbackFunction);
	        }
	    }
	    catch (e) {
	        alert(e.message);
	        throw e;
	    }
	},
	CallUSDAction: function (pControlName, pActionName, pData, pCallbackFunction) {
	    /*
            pControlName should be a string, the name of the hosted control whose action you want to call
            pActionName should be a string, the name of the action you want to call
            pData should be either a single string value, or an array of unencoded strings representing key-value-pairs joined with '=' signs
               e.g. ["firstName=John","middleName=","lastName=Doe"]
            pCallbackFunction is an optional passthrough function that takes no parameters
       */
	    try{
	        this._stringParameterCheck(pControlName, "VCCM.USDHelper.CallUSDAction() requires that pControlName is a string.");
	        this._stringParameterCheck(pActionName, "VCCM.USDHelper.CallUSDAction() requires that pActionName is a string.");
	        
	        var commandUrl = "http://uii/" + this._globalManagerName + "/CallDoAction?application=" + pControlName + this._crlf + "action=" + pActionName;

	        if (!!pData) {
	            var singleStringParameter = false;
	            if (typeof pData == "string") {
	                this._stringParameterCheck(pData, "VCCM.USDHelper.CallUSDAction() requires that pData is either a single string value or an Array of one or more members, each of which being a key value pair joined by an equal sign.");
	                singleStringParameter = true;
	            }
	            else {
	                this._arrayParameterCheck(pData, "VCCM.USDHelper.CallUSDAction() requires that pData is either a single string value or an Array of one or more members, each of which being a key value pair joined by an equal sign.");
	            }
	            commandUrl += this._crlf + "data=";
	            if (singleStringParameter) {
	                commandUrl += encodeURIComponent(pData);
	            }
	            else {
					var dataString = "";
	                for (var i = 0; i < pData.length; i++) {
	                    var thisDataParameter = pData[i];
	                    if (thisDataParameter.indexOf("=") > -1) {
	                        var thisParamName = thisDataParameter.split("=")[0] + "=";
	                        var thisParamValue = thisDataParameter.substr(thisParamName.length);
	                        dataString += (i == 0) ? thisParamName + thisParamValue : encodeURIComponent(this._crlf) + thisParamName + thisParamValue;
	                    }
	                }
					commandUrl += encodeURIComponent(dataString);
	            }
	        }
	        this.OpenUSDURL(commandUrl, pCallbackFunction);
	    }
	    catch(e) {
	        alert(e.message);
	        throw e;
	    }
	}
}