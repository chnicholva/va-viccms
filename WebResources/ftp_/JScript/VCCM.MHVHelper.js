if (typeof (VCCM) == "undefined") {
    VCCM = {
        __namespace: true
    };
}

VCCM.MHVHelper = {
    _crlf: "%0D%0A",
    _contactMethods: [
        { label: "Email", fieldName: "email", value: 100000000 },
        { label: "Fax", fieldName: "fax", value: 100000001 },/*deprecated by MHV*/
        { label: "HomePhone", fieldName: "homePhone", value: 100000002 },
        { label: "MobilePhone", fieldName: "mobilePhone", value: 100000003 },
        { label: "Pager", fieldName: "pager", value: 100000004 }, /*deprecated by MHV*/
        { label: "WorkPhone", fieldName: "workPhone", value: 100000005 }
    ],
    _refillStatusDictionary: {
        refillinprocess: {
            label: "Refill in process",
            cursor: "help",
            tooltip: "The refill request is being processed by the VA pharmacy. True value of refills left may be less than displayed value."
        },
        active_refillinprocess: {
            label: "Active: Refill in process",
            cursor: "help",
            tooltip: "The refill request is being processed by the VA pharmacy."
        },
        submitted: {
            label: "Submitted",
            cursor: "help",
            tooltip: "The refill request has been received by My HealtheVet but has not been processed by the VA Pharmacy yet."
        },
        active_submitted: {
            label: "Active: Submitted",
            cursor: "help",
            tooltip: "The refill request has been received by My HealtheVet but has not been processed by the VA Pharmacy yet."
        },
        active: {
            label: "Active",
            cursor: "help",
            tooltip: "A prescription that can be filled at the local VA pharmacy. If this prescription is refillable, you may request a refill of this VA prescription."
        },
        onhold: {
            label: "On hold",
            cursor: "help",
            tooltip: "An active prescription that will not be filled until pharmacy resolves the issue. Contact your VA pharmacy when you need more of this VA prescription."
        },
        discontinued: {
            label: "Discontinued",
            cursor: "help",
            tooltip: "A prescription stopped by a VA provider. It is no longer available to be filled. Contact your VA healthcare team when you need more of this VA prescription."
        },
        expired: {
            label: "Expired",
            cursor: "help",
            tooltip: "A prescription which is too old to fill. This does not refer to the expiration date of the medication in the container. Contact your VA healthcare team when you need more of this VA prescription."
        },
        unknown: {
            label: "Unknown",
            cursor: "help",
            tooltip: "The status cannot be determined. Contact your VA care team when you need more of this VA prescription. A prescription stopped by a VA provider. It is no longer available to be filled."
        }
    },
    _stateAbbreviationDictionary: { "": "Unknown", "AK": "Alaska", "AL": "Alabama", "AR": "Arkansas", "AS": "American Samoa", "AZ": "Arizona", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DC": "District of Columbia", "DE": "Delaware", "FL": "Florida", "FM": "Federated States of Micronesia", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii", "IA": "Iowa", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "MA": "Massachusetts", "MD": "Maryland", "ME": "Maine", "MH": "Marshall Islands", "MI": "Michigan", "MN": "Minnesota", "MO": "Missouri", "MP": "Northern Mariana Islands", "MS": "Mississippi", "MT": "Montana", "NC": "North Carolina", "ND": "North Dakota", "NE": "Nebraska", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NV": "Nevada", "NY": "New York", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "PR": "Puerto Rico", "PW": "Palau", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VA": "Virginia", "VI": "Virgin Islands", "VT": "Vermont", "WA": "Washington", "WI": "Wisconsin", "WV": "West Virginia", "WY": "Wyoming" },
    _countryAbbreviationDictionary: {"ABW":"Aruba","AFG":"Afghanistan","AGO":"Angola","AIA":"Anguilla","ALA":"Aland Islands","ALB":"Albania","AND":"Andorra","ARE":"United Arab Emirates","ARG":"Argentina","ARM":"Armenia","ATA":"Antarctica","ATF":"French Southern Territories","ATG":"Antigua and Barbuda","AUS":"Australia","AUT":"Austria","AZE":"Azerbaijan","BDI":"Burundi","BEL":"Belgium","BEN":"Benin","BES":"Bonaire","BFA":"Burkina Faso","BGD":"Bangladesh","BGR":"Bulgaria","BHR":"Bahrain","BHS":"Bahamas","BIH":"Bosnia and Herzegovina","BLM":"Saint Barthelemy","BLR":"Belarus","BLZ":"Belize","BMU":"Bermuda","BOL":"Bolivia","BRA":"Brazil","BRB":"Barbados","BRN":"Brunei Darussalam","BTN":"Bhutan","BVT":"Bouvet Island","BWA":"Botswana","CAF":"Central African Republic","CAN":"Canada","CCK":"Cocos (Keeling) Islands","CHE":"Switzerland","CHL":"Chile","CHN":"China","CIV":"CÃ´te d'Ivoire","CMR":"Cameroon","COD":"Congo (Kinshasa)","COG":"Congo (Brazzaville)","COK":"Cook Islands","COL":"Colombia","COM":"Comoros","CPV":"Cape Verde","CRI":"Costa Rica","CUB":"Cuba","CUW":"CuraÃƒÂ§ao","CXR":"Christmas Island","CYM":"Cayman Islands","CYP":"Cyprus","CZE":"Czech Republic","DEU":"Germany","DJI":"Djibouti","DMA":"Dominica","DNK":"Denmark","DOM":"Dominican Republic","DZA":"Algeria","ECU":"Ecuador","EGY":"Egypt","ERI":"Eritrea","ESH":"Western Sahara","ESP":"Spain","EST":"Estonia","ETH":"Ethiopia","FIN":"Finland","FJI":"Fiji","FLK":"Falkland Islands","FRA":"France","FRO":"Faroe Islands","FSM":"Micronesia","GAB":"Gabon","GBR":"United Kingdom","GEO":"Georgia","GGY":"Guernsey","GHA":"Ghana","GIB":"Gibraltar","GIN":"Guinea","GLP":"Guadeloupe","GMB":"Gambia","GNB":"Guinea-Bissau","GNQ":"Equatorial Guinea","GRC":"Greece","GRD":"Grenada","GRL":"Greenland","GTM":"Guatemala","GUF":"French Guiana","GUM":"Guam","GUY":"Guyana","HKG":"Hong Kong","HMD":"Heard and McDonald Islands","HND":"Honduras","HRV":"Croatia","HTI":"Haiti","HUN":"Hungary","IDN":"Indonesia","IMN":"Isle of Man","IND":"India","IOT":"British Indian Ocean Territory","IRL":"Ireland","IRN":"Iran","IRQ":"Iraq","ISL":"Iceland","ISR":"Israel","ITA":"Italy","JAM":"Jamaica","JEY":"Jersey","JOR":"Jordan","JPN":"Japan","KAZ":"Kazakhstan","KEN":"Kenya","KGZ":"Kyrgyzstan","KHM":"Cambodia","KIR":"Kiribati","KNA":"Saint Kitts and Nevis","KOR":"Korea (South)","KWT":"Kuwait","LAO":"Laos","LBN":"Lebanon","LBR":"Liberia","LBY":"Libya","LCA":"Saint Lucia","LIE":"Liechtenstein","LKA":"Sri Lanka","LSO":"Lesotho","LTU":"Lithuania","LUX":"Luxembourg","LVA":"Latvia","MAC":"Macao","MAF":"Saint Martin","MAR":"Morocco","MCO":"Monaco","MDA":"Moldova","MDG":"Madagascar","MDV":"Maldives","MEX":"Mexico","MHL":"Marshall Islands ","MKD":"Macedonia","MLI":"Mali","MLT":"Malta","MMR":"Myanmar","MNG":"Mongolia","MNP":"Northern Mariana Islands ","MOZ":"Mozambique","MRT":"Mauritania","MSR":"Montserrat","MTQ":"Martinique","MUS":"Mauritius","MWI":"Malawi","MYS":"Malaysia","MYT":"Mayotte","NAM":"Namibia","NCL":"New Caledonia","NER":"Niger","NFK":"Norfolk Island","NGA":"Nigeria","NIC":"Nicaragua","NIU":"Niue","NLD":"Netherlands","NOR":"Norway","NPL":"Nepal","NRU":"Nauru","NZL":"New Zealand","OMN":"Oman","PAK":"Pakistan","PAN":"Panama","PCN":"Pitcairn","PER":"Peru","PHL":"Philippines","PLW":"Palau","PNG":"Papua New Guinea","POL":"Poland","PRK":"Korea (North)","PRT":"Portugal","PRY":"Paraguay","PSE":"Palestine","PYF":"French Polynesia","QAT":"Qatar","REU":"Reunion","ROU":"Romania","RUS":"Russian Federation","RWA":"Rwanda","SAU":"Saudi Arabia","SDN":"Sudan","SEN":"Senegal","SGP":"Singapore","SGS":"South Georgia and South Sandwich Islands","SHN":"Saint Helena","SJM":"Svalbard and Jan Mayen","SLB":"Solomon Islands","SLE":"Sierra Leone","SLV":"El Salvador","SMR":"San Marino","SOM":"Somalia","SPM":"Saint Pierre and Miquelon","SRB":"Serbia and Montenegro","SSD":"South Sudan","STP":"Sao Tome and Principe","SUR":"Suriname","SVK":"Slovakia","SVN":"Slovenia","SWE":"Sweden","SWZ":"Swaziland","SXM":"Sint Maarten","SYC":"Seychelles","SYR":"Syrian Arab Republic","TCA":"Turks and Caicos Islands","TCD":"Chad","TGO":"Togo","THA":"Thailand","TJK":"Tajikistan","TKL":"Tokelau","TKM":"Turkmenistan","TLS":"Timor-Leste","TON":"Tonga","TTO":"Trinidad and Tobago","TUN":"Tunisia","TUR":"Turkey","TUV":"Tuvalu","TWN":"Taiwan","TZA":"Tanzania","UGA":"Uganda","UKR":"Ukraine","UMI":"United States Minor Outlying Islands","UNKNOWN":"UNKNOWN","URY":"Uruguay","USA":"United States","UZB":"Uzbekistan","VAT":"Vatican City","VCT":"Saint Vincent and the Grenadines","VEN":"Venezuela","VGB":"US Virgin Islands","VNM":"Viet Nam","VUT":"Vanuatu","WLF":"Wallis and Futuna Islands","WSM":"Samoa","YEM":"Yemen","ZAF":"South Africa","ZMB":"Zambia","ZWE":"Zimbabwe"},
    _getRefillStatusProperty: function (pStatus, pProperty) {
        if (typeof pStatus != "string") return "";
        if (typeof pProperty != "string") return "";
        var entry = this._refillStatusDictionary[pStatus.toLowerCase().replace(":", "_")];
        if (!!entry && !!entry[pProperty]) {
            return entry[pProperty];
        }
        else {
            return "";
        }
    },
    _context: function () {
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
    _getServerUrl: function () {
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
    _ODataPath: function () {
        ///<summary>
        /// Private function to return the path to the REST endpoint.
        ///</summary>
        ///<returns>String</returns>
        return this._getServerUrl() + "/XRMServices/2011/OrganizationData.svc/";
    },
    _errorHandler: function (req) {
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
    _dateReviver: function (key, value) {
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
    _parameterCheck: function (parameter, message) {
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
    _stringParameterCheck: function (parameter, message) {
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
        if (typeof parameter != "number") {
            throw new Error(message);
        }
    },
    _optionSetValueParamterCheck: function (value, optionset, message) {
        this._numberParameterCheck(value, message);
        if (this._indexOfObjectByAttribute(optionset, "value", value) == -1) {
            throw new Error(message);
        }
    },
    _optionSetLabelParamterCheck: function (label, optionset, message) {
        this._stringParameterCheck(label, message);
        if (this._indexOfObjectByAttribute(optionset, "label", label) == -1) {
            throw new Error(message);
        }
    },
    _dateParameterCheck: function (parameter, message) {
        if (typeof parameter != "undefined" && Object.prototype.toString.call(parameter) != "[object Date]") {
            throw new Error(message);
        }
    },
    _lookupParameterCheck: function (parameter, message) {
        if (typeof parameter == "undefined") {
            throw new Error(message);
        }
        if (typeof parameter != "undefined" && typeof parameter != "object") {
            throw new Error(message);
        }
        if (!parameter.hasOwnProperty("Id")) {
            throw new Error("VCCM.MHVHelper requires that pLookupObject.Id is a string.");
        }
        if (parameter.hasOwnProperty("Id")) {
            this._stringParameterCheck(parameter.Id, "VCCM.MHVHelper requires that pLookupObject.Id is a string.");
        }
        if (!parameter.hasOwnProperty("LogicalName")) {
            throw new Error("VCCM.MHVHelper requires that pLookupObject.LogicalName is a string.");
        }
        if (parameter.hasOwnProperty("LogicalName")) {
            this._stringParameterCheck(parameter.LogicalName, "VCCM.MHVHelper requires that pLookupObject.LogicalName is a string.");
        }
        if (!parameter.hasOwnProperty("Name")) {
            throw new Error("VCCM.MHVHelper requires that pLookupObject.Name is a string.");
        }
        if (parameter.hasOwnProperty("Name")) {
            this._stringParameterCheck(parameter.Name, "VCCM.MHVHelper requires that pLookupObject.Name is a string.");
        }
    },
    _arrayParameterCheck: function (parameter, message) {
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
    _booleanParameterCheck: function (parameter, message) {
        if (typeof parameter != "boolean") {
            throw new Error(message);
        }
    },
    _callbackParameterCheck: function (parameter, message) {
        if (typeof parameter != "function") {
            throw new Error(message);
        }
    },
    _USDHelperCheck: function (message){
        if (typeof VCCM.USDHelper == "undefined") {
            throw new Error(message);
        }
    },
    _getDeepProperty: function(pPath, pObject) {
        if (!!pPath) {
            var pathAsArray = pPath.split(".");
            var returnObj = !!pObject ? pObject : window[pathAsArray.shift()];
            if (typeof returnObj != "undefined") {
                while (!!returnObj && pathAsArray.length > 0) {
                    var nextLevel = pathAsArray.shift();
                    var isArrayQuery = nextLevel.indexOf("[") > -1 && nextLevel.indexOf("]") == nextLevel.indexOf("[") + 2;
                    var nextLevelName = !isArrayQuery ? nextLevel : nextLevel.split("[")[0];
                    var nextLevelArrayMember = !isArrayQuery ? null : parseInt((nextLevel.split("[")[1]).substr(0, (nextLevel.split("[")[1].length)));

                    returnObj = isArrayQuery ? returnObj[nextLevelName][nextLevelArrayMember] : returnObj[nextLevelName];

                }
                return returnObj;
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }
    },
    _indexOfObjectByAttribute: function(pArray, pAttr, pValue) {
        for (var i = 0; i < pArray.length; i++) {
            if (pArray[i][pAttr] === pValue) {
                return i;
            }
        }
        return -1;
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
    GetRefillStatusLabel: function (pStatus) {
        //this._stringParameterCheck(pSessionAPIURL, "VCCM.MHVHelper.GetRefillStatusCursor requires that pStatus is a string.");
        var returnValue = this._getRefillStatusProperty(pStatus, "label");
        return !!returnValue ? returnValue : "Unknown";
    },
    GetRefillStatusCursor: function(pStatus){
        //this._stringParameterCheck(pSessionAPIURL, "VCCM.MHVHelper.GetRefillStatusCursor requires that pStatus is a string.");
        var returnValue = this._getRefillStatusProperty(pStatus, "cursor");
        return !!returnValue ? returnValue : "default";
    },
    GetRefillStatusTooltip: function(pStatus){
        //this._stringParameterCheck(pSessionAPIURL, "VCCM.MHVHelper.GetRefillStatusTooltip requires that pStatus is a string.");
        var returnValue = this._getRefillStatusProperty(pStatus, "tooltip");
        return !!returnValue ? returnValue : "";
    },
    GetSessionToken: function (pSessionAPIURL, pIDList, pSuccessCallback, pPassthroughObject, pErrorCallback) {
        this._stringParameterCheck(pSessionAPIURL, "VCCM.MHVHelper.GetSessionToken requires that pSessionAPIURL is a string.");
        this._arrayParameterCheck(pIDList, "VCCM.MHVHelper.GetSessionToken requires that pIDList is an array of one or more MHV IDs. VCCM.MHVHelper.GetSessionToken cycles through the list of MHV IDs until it receives a token or runs out of IDs.");
        this._callbackParameterCheck(pSuccessCallback, "VCCM.MHVHelper.GetSessionToken requires that pSuccessCallback is a function.");
        this._parameterCheck(pPassthroughObject, "VCCM.MHVHelper.GetSessionToken requires that pPassthroughObject is an object.");
        this._callbackParameterCheck(pErrorCallback, "VCCM.MHVHelper.GetSessionToken requires that pErrorCallback is a function.");
        var IDList = pIDList.slice();
        var mhvObject = this.GetSessionTokenFromCookie(IDList);
        if (!!mhvObject && !!mhvObject.Token) {
            pSuccessCallback(mhvObject, pPassthroughObject);
        }
        else {
            IDList = pIDList.slice();
            this.RetrieveSessionTokenFromAPI(pSessionAPIURL, IDList, pSuccessCallback, pPassthroughObject, pErrorCallback);
        }
    },
    GetSessionTokenFromCookie: function (pIDList) {
        //returns an object containing an MHV session token from browser cookies, and the MHV ID used to find the token.
        this._arrayParameterCheck(pIDList, "VCCM.MHVHelper.GetSessionTokenFromCookie requires that pIDList is an array of one or more MHV IDs. VCCM.MHVHelper.GetSessionTokenFromCookie cycles through the list of MHV IDs until it finds a non-expired token cookie or runs out of IDs.");
        var thisID = pIDList.shift();
        var token = this._docCookies.getItem("MHVSessionCookie_" + thisID.toString());
        if (!!token) {
            return { ID: thisID.toString(), Token: token };
        }
        else {
            if (pIDList.length > 0) {
                return this.GetSessionTokenFromCookie(pIDList);
            }
            else {
                return null;
            }
        }
    },
    RetrieveSessionTokenFromAPI: function (pSessionAPIURL, pIDList, pSuccessCallback, pPassthroughObject, pErrorCallback) {
        //returns an object containing the token, expiration, and the MHV ID used to get that token
        //also saves the token to a cookie, named for the MHV ID used to get the token (e.g. MHVSessionCookie_<MHVID>, which expires according to the returned expiration value
        this._stringParameterCheck(pSessionAPIURL, "VCCM.MHVHelper.RetrieveSessionTokenFromAPI requires that pSessionAPIURL is a string.");
        this._arrayParameterCheck(pIDList, "VCCM.MHVHelper.RetrieveSessionTokenFromAPI requires that pIDList is an array of one or more MHV IDs. VCCM.MHVHelper.RetrieveSessionTokenFromAPI cycles through the list of MHV IDs until it receives a token or runs out of IDs.");
        this._callbackParameterCheck(pSuccessCallback, "VCCM.MHVHelper.RetrieveSessionTokenFromAPI requires that pSuccessCallback is a function.");
        this._parameterCheck(pPassthroughObject, "VCCM.MHVHelper.RetrieveSessionTokenFromAPI requires that pPassthroughObject is an object.");
        this._callbackParameterCheck(pErrorCallback, "VCCM.MHVHelper.RetrieveSessionTokenFromAPI requires that pErrorCallback is a function.");
        var thisID = pIDList.shift();

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(pSessionAPIURL + "/" + thisID.toString() + "/json"), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    //1-18-18
                    var response = JSON.parse(this.responseText, VCCM.MHVHelper._dateReviver);
                    if (!!response && !!response.Data && Object.prototype.toString.call(response.Data) == "[object Array]" && response.Data.length > 0) {
                        //2/9/18, 'Data' is now an array, and the Token and ExpirationDate are properties of its first member
                        var mhvObject = response.Data[0];
                        if (!!mhvObject.Token && !!mhvObject.ExpirationDate) {
                            var expiry = new Date(mhvObject.ExpirationDate);
                            mhvObject.ID = thisID.toString();
                            VCCM.MHVHelper._docCookies.setItem("MHVSessionCookie_" + thisID.toString(), mhvObject.Token, expiry, "/");
                            pSuccessCallback(mhvObject, pPassthroughObject);
                        }
                        else {
                            if (pIDList.length > 0) {
                                VCCM.MHVHelper.RetrieveSessionTokenFromAPI(pSessionAPIURL, pIDList, pCopyToUSD, pSuccessCallback, pPassthroughObject, pErrorCallback); //try again with the rest of the MHV IDs until we get a token or run out of IDs
                            }
                            else {
                                pSuccessCallback(null, pPassthroughObject);
                            }
                        }
                    }
                    else {
                        if (pIDList.length > 0) {
                            VCCM.MHVHelper.RetrieveSessionTokenFromAPI(pSessionAPIURL, pIDList, pCopyToUSD, pSuccessCallback, pPassthroughObject, pErrorCallback); //try again with the rest of the MHV IDs until we get a token or run out of IDs
                        }
                        else {
                            pSuccessCallback(null, pPassthroughObject);
                        }
                    }
                }
                else {
                    if (!!this && !!this.responseText) {
                        pErrorCallback(JSON.parse(this.responseText, VCCM.MHVHelper._dateReviver), pPassthroughObject);
                    }
                    else {
                        pErrorCallback(VCCM.MHVHelper._errorHandler(this), pPassthroughObject);
                    }
                }
            }
        };
        req.send();
    },
    RetrieveActivePrescriptions: function (pPrescriptionAPIURL, pSessionToken, pSuccessCallback, pErrorCallback) {
        this._stringParameterCheck(pPrescriptionAPIURL, "VCCM.MHVHelper.RetrieveActivePrescriptions requires that pPrescriptionAPIURL is a string.");
        this._stringParameterCheck(pSessionToken, "VCCM.MHVHelper.RetrieveActivePrescriptions requires that pSessionToken is a string.");
        this._callbackParameterCheck(pSuccessCallback, "VCCM.MHVHelper.RetrieveActivePrescriptions requires that pSuccessCallback is a function.");
        this._callbackParameterCheck(pErrorCallback, "VCCM.MHVHelper.RetrieveActivePrescriptions requires that pErrorCallback is a function.");
        var postData = { token: pSessionToken, format: "json" };
        var req = new XMLHttpRequest();
        req.open("POST", encodeURI(pPrescriptionAPIURL), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    pSuccessCallback(JSON.parse(this.responseText, VCCM.MHVHelper._dateReviver));
                }
                else {
                    if (!!this && !!this.responseText) {
                        pErrorCallback(JSON.parse(this.responseText, VCCM.MHVHelper._dateReviver));
                    }
                    else {
                        pErrorCallback(VCCM.MHVHelper._errorHandler(this));
                    }
                }
            }
        };
        req.send(JSON.stringify(postData));
    },
    RetrieveCombinedMedicationList: function (pCombinedMedicationAPIURL, pSessionToken, pICN, pVersion, pClientName, pSuccessCallback, pErrorCallback) {
        this._stringParameterCheck(pCombinedMedicationAPIURL, "VCCM.MHVHelper.RetrieveActivePrescriptions requires that pCombinedMedicationAPIURL is a string.");
        this._stringParameterCheck(pSessionToken, "VCCM.MHVHelper.RetrieveActivePrescriptions requires that pSessionToken is a string.");
        this._stringParameterCheck(pICN, "VCCM.MHVHelper.RetrieveActivePrescriptions requires that pICN is a string.");        
        this._stringParameterCheck(pVersion, "VCCM.MHVHelper.RetrieveActivePrescriptions requires that pVersion is a string.");
        this._stringParameterCheck(pClientName, "VCCM.MHVHelper.RetrieveActivePrescriptions requires that pClientName is a string.");
        this._callbackParameterCheck(pSuccessCallback, "VCCM.MHVHelper.RetrieveActivePrescriptions requires that pSuccessCallback is a function.");
        this._callbackParameterCheck(pErrorCallback, "VCCM.MHVHelper.RetrieveActivePrescriptions requires that pErrorCallback is a function.");
        var postData = { Token: pSessionToken, NationalID: pICN, Version: pVersion, ClientName: pClientName, Format: "json" };
        var req = new XMLHttpRequest();
        req.open("POST", encodeURI(pCombinedMedicationAPIURL), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    pSuccessCallback(JSON.parse(this.responseText, VCCM.MHVHelper._dateReviver));
                }
                else {
                    if (!!this && !!this.responseText) {
                        pErrorCallback(JSON.parse(this.responseText, VCCM.MHVHelper._dateReviver));
                    }
                    else {
                        pErrorCallback(VCCM.MHVHelper._errorHandler(this));
                    }
                }
            }
        };
        req.send(JSON.stringify(postData));
    },
    SubmitPrescriptionRefill: function (pRefillAPIURL, pSessionToken, pPrescriptionId, pSuccessCallback, pErrorCallback) {
        this._stringParameterCheck(pRefillAPIURL, "VCCM.MHVHelper.SubmitPrescriptionRefill requires that pRefillAPIURL is a string.");
        this._stringParameterCheck(pSessionToken, "VCCM.MHVHelper.SubmitPrescriptionRefill requires that pSessionToken is a string.");
        this._stringParameterCheck(pPrescriptionId, "VCCM.MHVHelper.SubmitPrescriptionRefill requires that pPrescriptionId is a string.");
        this._callbackParameterCheck(pSuccessCallback, "VCCM.MHVHelper.SubmitPrescriptionRefill requires that pSuccessCallback is a function.");
        this._callbackParameterCheck(pErrorCallback, "VCCM.MHVHelper.SubmitPrescriptionRefill requires that pErrorCallback is a function.");
        var postData = { token: pSessionToken, rxid: pPrescriptionId, format: "json" };
        var req = new XMLHttpRequest();
        req.open("POST", encodeURI(pRefillAPIURL), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    pSuccessCallback(JSON.parse(this.responseText, VCCM.MHVHelper._dateReviver));
                }
                else {
                    if (!!this && !!this.responseText) {
                        pErrorCallback(JSON.parse(this.responseText, VCCM.MHVHelper._dateReviver));
                    }
                    else {
                        pErrorCallback(VCCM.MHVHelper._errorHandler(this));
                    }
                }
            }
        };
        req.send(JSON.stringify(postData));
    },
    TrackPrescription: function (pTrackingAPIURL, pSessionToken, pPrescriptionId, pSuccessCallback, pErrorCallback) {
        this._stringParameterCheck(pTrackingAPIURL, "VCCM.MHVHelper.TrackPrescription requires that pTrackingAPIURL is a string.");
        this._stringParameterCheck(pSessionToken, "VCCM.MHVHelper.TrackPrescription requires that pSessionToken is a string.");
        this._stringParameterCheck(pPrescriptionId, "VCCM.MHVHelper.TrackPrescription requires that pPrescriptionId is a string.");
        this._callbackParameterCheck(pSuccessCallback, "VCCM.MHVHelper.TrackPrescription requires that pSuccessCallback is a function.");
        this._callbackParameterCheck(pErrorCallback, "VCCM.MHVHelper.TrackPrescription requires that pErrorCallback is a function.");
        var postData = { token: pSessionToken, rxid: pPrescriptionId, format: "json" };
        var req = new XMLHttpRequest();
        req.open("POST", encodeURI(pTrackingAPIURL), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    pSuccessCallback(JSON.parse(this.responseText, VCCM.MHVHelper._dateReviver));
                }
                else {
                    if (!!this && !!this.responseText) {
                        pErrorCallback(JSON.parse(this.responseText, VCCM.MHVHelper._dateReviver));
                    }
                    else {
                        pErrorCallback(VCCM.MHVHelper._errorHandler(this));
                    }
                }
            }
        };
        req.send(JSON.stringify(postData));
    },
    RegisterVeteran: function (pRegistrationAPIURL, pICN, /*pStreetAddress1, pStreetAddress2, pCity, pStateOrProvince, pPostalCode, pCountry, */pIsPatient, pIsPatientAdvocate, pIsVeteran, pIsChampVABeneficiary, pIsServiceMember, pIsVAEmployee, pIsHealthCareProvider, pIsOther, pSignInPartners, pContactMethod, pContactMethodValue, pTermsVersion, pTermsAcceptedDate, pSuccessCallback, pErrorCallback) {
        this._stringParameterCheck(pRegistrationAPIURL, "VCCM.MHVHelper.RegisterVeteran requires that pRegistrationAPIURL is a string.");
        this._stringParameterCheck(pICN, "VCCM.MHVHelper.RegisterVeteran requires that pICN is a string.");
        //this._stringParameterCheck(pStreetAddress1, "VCCM.MHVHelper.RegisterVeteran requires that pStreetAddress1 is a string.");
        //this._stringParameterCheck(pStreetAddress2, "VCCM.MHVHelper.RegisterVeteran requires that pStreetAddress2 is a string.");
        //this._stringParameterCheck(pCity, "VCCM.MHVHelper.RegisterVeteran requires that pCity is a string.");
        //this._stringParameterCheck(pStateOrProvince, "VCCM.MHVHelper.RegisterVeteran requires that pStateOrProvince is a string.");
        //this._stringParameterCheck(pPostalCode, "VCCM.MHVHelper.RegisterVeteran requires that pPostalCode is a string.");
        //this._stringParameterCheck(pCountry, "VCCM.MHVHelper.RegisterVeteran requires that pCountry is a string.");

        //per MHV documenation, at least one of these must be true
        this._booleanParameterCheck(pIsPatient, "VCCM.MHVHelper.RetrieveSessionToken requires that pIsPatient is a boolean.");
        this._booleanParameterCheck(pIsPatientAdvocate, "VCCM.MHVHelper.RetrieveSessionToken requires that pIsPatientAdvocate is a boolean.");
        this._booleanParameterCheck(pIsVeteran, "VCCM.MHVHelper.RetrieveSessionToken requires that pIsVeteran is a boolean.");
        this._booleanParameterCheck(pIsChampVABeneficiary, "VCCM.MHVHelper.RetrieveSessionToken requires that pIsChampVABeneficiary is a boolean.");
        this._booleanParameterCheck(pIsServiceMember, "VCCM.MHVHelper.RetrieveSessionToken requires that pIsServiceMember is a boolean.");
        this._booleanParameterCheck(pIsVAEmployee, "VCCM.MHVHelper.RetrieveSessionToken requires that pIsVAEmployee is a boolean.");
        this._booleanParameterCheck(pIsHealthCareProvider, "VCCM.MHVHelper.RetrieveSessionToken requires that pIsHealthCareProvider is a boolean.");
        this._booleanParameterCheck(pIsOther, "VCCM.MHVHelper.RetrieveSessionToken requires that pIsOther is a boolean.");

        this._stringParameterCheck(pSignInPartners, "VCCM.MHVHelper.RegisterVeteran requires that pSignInPartners is a string.");

        //per MHV documentation, valid values for contact method are ‘Email’, ‘Fax (deprecated)’, ‘HomePhone’, ‘MobilePhone’, ‘Pager (deprecated)’ and ‘WorkPhone’
        this._optionSetLabelParamterCheck(pContactMethod, this._contactMethods, "VCCM.MHVHelper.RegisterVeteran requires that pContactMethod is a string with one of these values (case-sensitive): " + this._contactMethods.map(function (x) { return x.label }).join(", "));
        this._stringParameterCheck(pContactMethodValue, "VCCM.MHVHelper.RegisterVeteran requires that pContactMethodValue is a string.");

        //this will be hard-coded/configured, probably in a CRM settings value or UII Option value
        this._stringParameterCheck(pTermsVersion, "VCCM.MHVHelper.RegisterVeteran requires that pTermsVersion is a string.");

        //need to know exact date string formatting to use.
        this._dateParameterCheck(pTermsAcceptedDate, "VCCM.MHVHelper.RegisterVeteran requires that pTermsAcceptedDate is a Datetime object.");
        var termsAcceptedDateString = pTermsAcceptedDate.toUTCString();
        this._callbackParameterCheck(pSuccessCallback, "VCCM.MHVHelper.RetrieveActivePrescriptions requires that pSuccessCallback is a function.");
        this._callbackParameterCheck(pErrorCallback, "VCCM.MHVHelper.RetrieveActivePrescriptions requires that pErrorCallback is a function.");


        //TODO: setup postdata with parameter data
        var postData = {
            icn: pICN,
            //address1: pStreetAddress1,
            //address2: pStreetAddress2,
            //city: pCity,
            //province: pStateOrProvince,
            //zip: pPostalCode,
            //country: pCountry,
            isPatient: pIsPatient,
            isPatientAdvocate: pIsPatientAdvocate,
            isVeteran: pIsVeteran,
            isChampVABeneficiary: pIsChampVABeneficiary,
            isServiceMember: pIsServiceMember,
            isEmployee: pIsVAEmployee,
            isHealthCareProvider: pIsHealthCareProvider,
            isOther: pIsOther,
            signInPartners: pSignInPartners,
            contactMethod: pContactMethod,
            termsVersion: pTermsVersion,
            termsAcceptedDate: termsAcceptedDateString,
            format: "json"
        };
        postData[this._contactMethods[this._indexOfObjectByAttribute(this._contactMethods, "label", pContactMethod)].fieldName] = pContactMethodValue;

        var req = new XMLHttpRequest();
        req.open("POST", encodeURI(pRegistrationAPIURL), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    //response from Registration API should return a 'correlationId', 'accountStatus', and 'apiCompletionStatus'
                    pSuccessCallback(JSON.parse(this.responseText, VCCM.MHVHelper._dateReviver));
                }
                else {
                    //pErrorCallback(VCCM.MHVHelper._errorHandler(this));
                    pErrorCallback(JSON.parse(this.responseText, VCCM.MHVHelper._dateReviver));
                }
            }
        };
        req.send(JSON.stringify(postData));
    }
}