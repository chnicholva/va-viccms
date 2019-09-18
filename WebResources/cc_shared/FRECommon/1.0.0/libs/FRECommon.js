var ODataContract;
(function (ODataContract) {
    var ExportTemplateToWordRequest = (function () {
        function ExportTemplateToWordRequest(entityTypeCode, selectedEntities) {
            this.EntityTypeCode = entityTypeCode;
            this.SelectedEntities = selectedEntities;
        }
        ExportTemplateToWordRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "EntityTypeCode": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1,
                    },
                    "SelectedEntities": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                },
                operationName: "ExportTemplateToWord",
                operationType: 0,
            };
            return metadata;
        };
        return ExportTemplateToWordRequest;
    }());
    ODataContract.ExportTemplateToWordRequest = ExportTemplateToWordRequest;
})(ODataContract || (ODataContract = {}));
var ODataContract;
(function (ODataContract) {
    var Object = (function () {
        function Object(type, value) {
            this.Type = type;
            this.Value = value;
        }
        Object.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "Type": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "Value": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                },
                operationName: null,
                operationType: null,
            };
            return metadata;
        };
        return Object;
    }());
    ODataContract.Object = Object;
})(ODataContract || (ODataContract = {}));
///<reference path="./Object.ts" />
var ODataContract;
(function (ODataContract) {
    var InputArgument = (function () {
        function InputArgument(count, isReadOnly, keys, values) {
            this.Count = count;
            this.IsReadOnly = isReadOnly;
            this.Keys = keys;
            this.Values = values;
        }
        InputArgument.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "Count": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1,
                    },
                    "IsReadOnly": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                    "Keys": {
                        "typeName": "Edm.String",
                        "structuralProperty": 4,
                    },
                    "Values": {
                        "typeName": "mscrm.Object",
                        "structuralProperty": 4,
                    },
                },
                operationName: null,
                operationType: null,
            };
            return metadata;
        };
        return InputArgument;
    }());
    ODataContract.InputArgument = InputArgument;
})(ODataContract || (ODataContract = {}));
///<reference path="./InputArgument.ts" />
var ODataContract;
(function (ODataContract) {
    var InputArgumentCollection = (function () {
        function InputArgumentCollection(args) {
            this.Arguments = args;
        }
        InputArgumentCollection.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "Arguments": {
                        "typeName": "Microsoft.Dynamics.CRM.InputArgument",
                        "structuralProperty": 2,
                    },
                },
                operationName: null,
                operationType: null,
            };
            return metadata;
        };
        return InputArgumentCollection;
    }());
    ODataContract.InputArgumentCollection = InputArgumentCollection;
})(ODataContract || (ODataContract = {}));
///<reference path="./InputArgumentCollection.ts" />
var ODataContract;
(function (ODataContract) {
    var ExportToExcelRequest = (function () {
        function ExportToExcelRequest(view /*Microsoft.Dynamics.CRM.crmbaseentity*/, fetchXml, layoutXml, queryApi, queryParameters) {
            this.View = view;
            this.FetchXml = fetchXml;
            this.LayoutXml = layoutXml;
            this.QueryApi = queryApi;
            this.QueryParameters = queryParameters;
        }
        ExportToExcelRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "View": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "FetchXml": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "LayoutXml": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "QueryApi": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "QueryParameters": {
                        "typeName": "Microsoft.Dynamics.CRM.InputArgumentCollection",
                        "structuralProperty": 2,
                    },
                },
                operationName: "ExportToExcel",
                operationType: 0,
            };
            return metadata;
        };
        return ExportToExcelRequest;
    }());
    ODataContract.ExportToExcelRequest = ExportToExcelRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* enum needed for the RetrieveCurrentOrganizationRequest */
    var EndpointAccessType;
    (function (EndpointAccessType) {
        EndpointAccessType[EndpointAccessType["Default"] = 0] = "Default";
        EndpointAccessType[EndpointAccessType["Internet"] = 1] = "Internet";
        EndpointAccessType[EndpointAccessType["Intranet"] = 2] = "Intranet";
    })(EndpointAccessType = ODataContract.EndpointAccessType || (ODataContract.EndpointAccessType = {}));
    /* tslint:disable:crm-force-fields-private */
    var RetrieveCurrentOrganizationRequest = (function () {
        function RetrieveCurrentOrganizationRequest(accessType) {
            this.AccessType = accessType;
        }
        RetrieveCurrentOrganizationRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "AccessType": {
                        "typeName": "Microsoft.Dynamics.CRM.EndpointAccessType",
                        "structuralProperty": 3,
                        "enumProperties": [,
                            {
                                "name": "Default",
                                "value": 0,
                            },
                            {
                                "name": "Internet",
                                "value": 1,
                            },
                            {
                                "name": "Intranet",
                                "value": 2,
                            },
                        ],
                    },
                },
                operationName: "RetrieveCurrentOrganization",
                operationType: 1,
            };
            return metadata;
        };
        return RetrieveCurrentOrganizationRequest;
    }());
    ODataContract.RetrieveCurrentOrganizationRequest = RetrieveCurrentOrganizationRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RetrieveTenantAdminPermissionsRequest = (function () {
        function RetrieveTenantAdminPermissionsRequest() {
        }
        RetrieveTenantAdminPermissionsRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {},
                operationName: "RetrieveTenantAdminPermissions",
                operationType: 1,
            };
            return metadata;
        };
        return RetrieveTenantAdminPermissionsRequest;
    }());
    ODataContract.RetrieveTenantAdminPermissionsRequest = RetrieveTenantAdminPermissionsRequest;
})(ODataContract || (ODataContract = {}));
var ODataContract;
(function (ODataContract) {
    var RetrieveTenantInfoRequest = (function () {
        function RetrieveTenantInfoRequest() {
        }
        RetrieveTenantInfoRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                operationName: "RetrieveTenantInfo",
                operationType: 1,
                parameterTypes: {},
            };
            return metadata;
        };
        return RetrieveTenantInfoRequest;
    }());
    ODataContract.RetrieveTenantInfoRequest = RetrieveTenantInfoRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RetrieveUserPrivilegesRequest = (function () {
        function RetrieveUserPrivilegesRequest(entity /*Microsoft.Dynamics.CRM.systemuser*/) {
            this.entity = entity;
        }
        RetrieveUserPrivilegesRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.systemuser",
                        "structuralProperty": 5,
                    },
                },
                operationName: "RetrieveUserPrivileges",
                operationType: 1,
            };
            return metadata;
        };
        return RetrieveUserPrivilegesRequest;
    }());
    ODataContract.RetrieveUserPrivilegesRequest = RetrieveUserPrivilegesRequest;
})(ODataContract || (ODataContract = {}));
var SmbAppsTelemetryUtility;
(function (SmbAppsTelemetryUtility) {
    'use strict';
    /**
    * To format the inner payload for telemetry data according to the event schema
    */
    var TelemetryParameter = (function () {
        function TelemetryParameter() {
        }
        return TelemetryParameter;
    }());
    SmbAppsTelemetryUtility.TelemetryParameter = TelemetryParameter;
    /**
    * To format the outer payload for telemetry data according to the event schema
    */
    var TelemetryPayload = (function () {
        function TelemetryPayload() {
        }
        return TelemetryPayload;
    }());
    SmbAppsTelemetryUtility.TelemetryPayload = TelemetryPayload;
    var Controls_ShellMode;
    (function (Controls_ShellMode) {
        //Basic Shell Mode
        Controls_ShellMode[Controls_ShellMode["BASICSHELLMODE"] = 0] = "BASICSHELLMODE";
        //Advanced Shell Mode
        Controls_ShellMode[Controls_ShellMode["ADVANCEDSHELLMODE"] = 1] = "ADVANCEDSHELLMODE";
        //Stand Alone Page
        Controls_ShellMode[Controls_ShellMode["STANDALONE"] = 2] = "STANDALONE";
    })(Controls_ShellMode = SmbAppsTelemetryUtility.Controls_ShellMode || (SmbAppsTelemetryUtility.Controls_ShellMode = {}));
    /**
     * Enums for Page Types for FRE SMB Sales App
     */
    var Controls_PageType;
    (function (Controls_PageType) {
        //BasicSetup Summary Page
        Controls_PageType[Controls_PageType["BASICSETUPSUMMARY"] = 0] = "BASICSETUPSUMMARY";
        //AppWelcome Page
        Controls_PageType[Controls_PageType["APPWELCOME"] = 1] = "APPWELCOME";
        //Setting Summary Page
        Controls_PageType[Controls_PageType["SETTINGSUMMARY"] = 2] = "SETTINGSUMMARY";
        //Branding and Theming Page
        Controls_PageType[Controls_PageType["BRANDINGANDTHEMING"] = 3] = "BRANDINGANDTHEMING";
        // Fiscal year Page
        Controls_PageType[Controls_PageType["FISCALYEAR"] = 4] = "FISCALYEAR";
        //Email Template Page
        Controls_PageType[Controls_PageType["EMAILTEMPLATE"] = 5] = "EMAILTEMPLATE";
        //Word and Excel Template Page
        Controls_PageType[Controls_PageType["WORDANDEXCELTEMPLATE"] = 6] = "WORDANDEXCELTEMPLATE";
        //Document Storage page
        Controls_PageType[Controls_PageType["DOCUMENTSTORAGE"] = 7] = "DOCUMENTSTORAGE";
        //Quote To cash Page
        Controls_PageType[Controls_PageType["QUOTETOCASH"] = 8] = "QUOTETOCASH";
        //ApplicationManagement Page
        Controls_PageType[Controls_PageType["APPLICATIONMANAGEMENT"] = 9] = "APPLICATIONMANAGEMENT";
        //Sample Data management Page
        Controls_PageType[Controls_PageType["SAMPLEDATAMANAGEMENT"] = 10] = "SAMPLEDATAMANAGEMENT";
        //Duplicate Detection Page
        Controls_PageType[Controls_PageType["DUPLICATEDETECTION"] = 11] = "DUPLICATEDETECTION";
        //User management
        Controls_PageType[Controls_PageType["USERMANAGEMENT"] = 12] = "USERMANAGEMENT";
        //Team management
        Controls_PageType[Controls_PageType["TEAMMANAGEMENT"] = 13] = "TEAMMANAGEMENT";
        //Click To Call Page
        Controls_PageType[Controls_PageType["CLICKTOCALL"] = 14] = "CLICKTOCALL";
        //Product Catalog Page
        Controls_PageType[Controls_PageType["PRODUCTCATALOG"] = 15] = "PRODUCTCATALOG";
        //Leads and Contacts Page
        Controls_PageType[Controls_PageType["LEADANDCONTACT"] = 16] = "LEADANDCONTACT";
        //Import Data Page
        Controls_PageType[Controls_PageType["IMPORTDATA"] = 17] = "IMPORTDATA";
        //Export Data Page
        Controls_PageType[Controls_PageType["EXPORTDATA"] = 18] = "EXPORTDATA";
        //Forms Page
        Controls_PageType[Controls_PageType["FORMS"] = 19] = "FORMS";
        //Views Page
        Controls_PageType[Controls_PageType["VIEWS"] = 20] = "VIEWS";
        //Business process flow Page
        Controls_PageType[Controls_PageType["BUSINESSPROCESSFLOW"] = 21] = "BUSINESSPROCESSFLOW";
    })(Controls_PageType = SmbAppsTelemetryUtility.Controls_PageType || (SmbAppsTelemetryUtility.Controls_PageType = {}));
    /**
     *Enums for  Actions Types associated with FRE Pages
     */
    var Controls_EventName;
    (function (Controls_EventName) {
        //Button is clicked
        Controls_EventName[Controls_EventName["CLICKEDBUTTON"] = 0] = "CLICKEDBUTTON";
        //LINK is Clicked
        Controls_EventName[Controls_EventName["CLICKEDLINK"] = 1] = "CLICKEDLINK";
        //Combobox is clicked
        Controls_EventName[Controls_EventName["CLICKEDCOMBOBOX"] = 2] = "CLICKEDCOMBOBOX";
        //Checkbox is clicked
        Controls_EventName[Controls_EventName["CLICKEDCHECKBOX"] = 3] = "CLICKEDCHECKBOX";
        //Textbox is changes
        Controls_EventName[Controls_EventName["CHANGEDTEXTBOX"] = 4] = "CHANGEDTEXTBOX";
        //FRE page is visited
        Controls_EventName[Controls_EventName["PAGEVISITED"] = 5] = "PAGEVISITED";
        //Error occurs
        Controls_EventName[Controls_EventName["ERROR"] = 6] = "ERROR";
        //If there is a success scenario
        Controls_EventName[Controls_EventName["SUCCESS"] = 7] = "SUCCESS";
        //If an event is Completed
        Controls_EventName[Controls_EventName["COMPLETED"] = 8] = "COMPLETED";
        //If a user is dropped from any page
        Controls_EventName[Controls_EventName["DROPPED"] = 9] = "DROPPED";
        //An upload event
        Controls_EventName[Controls_EventName["UPLOADS"] = 10] = "UPLOADS";
        //Grid Command is Clicked
        Controls_EventName[Controls_EventName["CLICKEDGRIDCOMMAND"] = 11] = "CLICKEDGRIDCOMMAND";
        //Form Command is Clicked
        Controls_EventName[Controls_EventName["CLICKEDFORMCOMMAND"] = 12] = "CLICKEDFORMCOMMAND";
        //Command is Executed
        Controls_EventName[Controls_EventName["CLOSEDCOMMAND"] = 13] = "CLOSEDCOMMAND";
        //Selectbox is clicked
        Controls_EventName[Controls_EventName["CLICKEDSELECTBOX"] = 14] = "CLICKEDSELECTBOX";
    })(Controls_EventName = SmbAppsTelemetryUtility.Controls_EventName || (SmbAppsTelemetryUtility.Controls_EventName = {}));
    /**
     * Class for Telemetry Data for FRE pages
     */
    var TelemetryData = (function () {
        function TelemetryData(context, count, pagetype, eventname, customcontrolname, customcontrolID, customcontrolShellmode, information, isError) {
            this._enableLogging = true;
            this._context = context;
            this._count = count;
            this._pagetype = pagetype;
            this._eventname = eventname;
            this._customcontrolname = customcontrolname;
            this._customcontrolid = customcontrolID;
            this._customcontrolShellmode = customcontrolShellmode;
            this._information = information;
            this._isError = isError;
        }
        /**
         * @function _getMessageString
         * @description Helper function to format the "message" attribute for schema "SMBSalesFREInfo"
         * @returns {string}
         */
        TelemetryData.prototype._getMessageString = function () {
            var message;
            if (this._isError) {
                message = "CC_Name:" + this._customcontrolname + ",CC_ID:" + this._customcontrolid + ",CC_ShellMode:" + this._getShellMode(this._customcontrolShellmode) + ",ErrorType:" + this._information;
            }
            else {
                message = "CC_Name:" + this._customcontrolname + ",CC_ID:" + this._customcontrolid + ",CC_ShellMode:" + this._getShellMode(this._customcontrolShellmode) + ",Message:" + this._information;
            }
            return message;
        };
        /**
         * @function _getsolutionVersion
         * @description Helper function to format the "SolutionVersion" attribute for schema "SMBSalesFREInfo"
         * @returns {string}
         */
        TelemetryData.prototype._getsolutionVersion = function () {
            var solutionApp = "default";
            if (window && window.top && window.top.getGlobalContextObject() && window.top.getGlobalContextObject().getCurrentAppName()._result)
                solutionApp = window.top.getGlobalContextObject().getCurrentAppName()._result;
            return solutionApp;
        };
        /**
         * @function _getPageType
         * @description Return the corrosponding string associated to enum for pagetype.
         * @returns {string}
         * @param {Controls_PageType} pagetype
         */
        TelemetryData.prototype._getPageType = function (pagetype) {
            switch (pagetype) {
                case Controls_PageType.BASICSETUPSUMMARY: return "Basic Setup Summary Page";
                case Controls_PageType.APPLICATIONMANAGEMENT: return "Application Management Page";
                case Controls_PageType.APPWELCOME: return "App Welcome Page";
                case Controls_PageType.BRANDINGANDTHEMING: return "Branding and Theming Page";
                case Controls_PageType.DOCUMENTSTORAGE: return "Document Storage Page";
                case Controls_PageType.EMAILTEMPLATE: return "Email Template Page";
                case Controls_PageType.FISCALYEAR: return "Fiscal Year Page";
                case Controls_PageType.QUOTETOCASH: return "QuoteToCash Page";
                case Controls_PageType.SAMPLEDATAMANAGEMENT: return "Sample Data Management Page";
                case Controls_PageType.SETTINGSUMMARY: return "Setting Summary Page";
                case Controls_PageType.WORDANDEXCELTEMPLATE: return "Word And Excel Document Page";
                case Controls_PageType.DUPLICATEDETECTION: return "Duplicate Detection Page";
                case Controls_PageType.USERMANAGEMENT: return "User Management page";
                case Controls_PageType.TEAMMANAGEMENT: return "Team Management page";
                case Controls_PageType.CLICKTOCALL: return "Click To Call Page";
                case Controls_PageType.PRODUCTCATALOG: return "Product Catalog Page";
                case Controls_PageType.LEADANDCONTACT: return "Leads and Contacts Page";
                case Controls_PageType.IMPORTDATA: return "Import Data Page";
                case Controls_PageType.EXPORTDATA: return "Export Data Page";
                case Controls_PageType.FORMS: return "Forms Page";
                case Controls_PageType.VIEWS: return "Views Page";
                case Controls_PageType.BUSINESSPROCESSFLOW: return "Business process flow Page";
                default: return null;
            }
        };
        /**
         * @function _getShellMode
         * @description Return the corrosponding string associated to enum for Shell.
         * @returns {string}
         * @param {Controls_ShellMode} shellMode
         */
        TelemetryData.prototype._getShellMode = function (shellMode) {
            switch (shellMode) {
                case Controls_ShellMode.ADVANCEDSHELLMODE: return "Advanced Shell";
                case Controls_ShellMode.BASICSHELLMODE: return "Basic Shell";
                case Controls_ShellMode.STANDALONE: return "StandAlone Page";
                default: return null;
            }
        };
        /**
         * @function _getEventName
         * @description Return the corrosponding string associated to enum for eventtype.
         * @returns {string}
         * @param {Controls_EventName} eventname
         */
        TelemetryData.prototype._getEventName = function (eventname) {
            switch (eventname) {
                case Controls_EventName.CHANGEDTEXTBOX: return "Changed TextBox";
                case Controls_EventName.CLICKEDBUTTON: return "Clicked Button";
                case Controls_EventName.CLICKEDCHECKBOX: return "Clicked CheckBox";
                case Controls_EventName.CLICKEDCOMBOBOX: return "Clicked ComboBox";
                case Controls_EventName.CLICKEDSELECTBOX: return "Clicked SelectBox";
                case Controls_EventName.CLICKEDLINK: return "Clicked Link";
                case Controls_EventName.COMPLETED: return "Activity Completed";
                case Controls_EventName.DROPPED: return "Activity Dropped";
                case Controls_EventName.ERROR: return "Error Encountered";
                case Controls_EventName.PAGEVISITED: return "Page Visited";
                case Controls_EventName.SUCCESS: return "Success";
                case Controls_EventName.UPLOADS: return "Uploads";
                case Controls_EventName.CLICKEDGRIDCOMMAND: return "Clicked Grid Command";
                default: return null;
            }
        };
        /**
         * @function _getTelemetryData
         * @description Formats the payload according to schema for telemetry event "SMBSalesFREInfo"
         * @returns {TelemetryPayload}
         */
        TelemetryData.prototype._getTelemetryData = function () {
            var payload = {
                eventName: "SMBFREEventInfo", eventParameters: []
            };
            var para1 = { name: "ActionName", value: this._getEventName(this._eventname) };
            var para2 = { name: "Count", value: this._count };
            var para3 = { name: "Message", value: this._getMessageString() };
            var para4 = { name: "PageName", value: this._getPageType(this._pagetype) };
            var para5 = { name: "SolutionVersion", value: this._getsolutionVersion() };
            payload.eventParameters.push(para1);
            payload.eventParameters.push(para2);
            payload.eventParameters.push(para3);
            payload.eventParameters.push(para4);
            payload.eventParameters.push(para5);
            return payload;
        };
        /**
         * @function ReportEventData
         * @description Logs Telemetry Data
         */
        TelemetryData.ReportEventData = function (context, count, pagetype, eventname, customcontrolname, customcontrolID, customcontrolShellmode, information, isError) {
            var telemetrydata = new TelemetryData(context, count, pagetype, eventname, customcontrolname, customcontrolID, customcontrolShellmode, information, isError);
            try {
                if (telemetrydata._enableLogging) {
                    if (telemetrydata._context != null) {
                        telemetrydata._context.reporting.reportEvent(telemetrydata._getTelemetryData());
                    }
                    else {
                        Xrm.Reporting.reportEvent(telemetrydata._getTelemetryData());
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        TelemetryData.ReportAppComponentFailureTelemetry = function (context, pagetype, err, suggestedMitigation) {
            var telemetryerrordata = new TelemetryData(context, null, pagetype);
            var errorToBeLogged = { message: "" };
            var componentName = "";
            if (typeof err != "object" || err.message == null) {
                errorToBeLogged.message = JSON.stringify(err);
            }
            else {
                errorToBeLogged = err;
            }
            if (telemetryerrordata._pagetype) {
                componentName = telemetryerrordata._getsolutionVersion() + "." + telemetryerrordata._getPageType(telemetryerrordata._pagetype);
            }
            //API
            try {
                if (telemetryerrordata._context != null) {
                    telemetryerrordata._context.reporting.reportFailure(componentName, errorToBeLogged, suggestedMitigation);
                }
                else {
                    Xrm.Reporting.reportFailure(componentName, errorToBeLogged, suggestedMitigation);
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        return TelemetryData;
    }());
    SmbAppsTelemetryUtility.TelemetryData = TelemetryData;
})(SmbAppsTelemetryUtility || (SmbAppsTelemetryUtility = {}));
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        var Common;
        (function (Common) {
            'use strict';
            var DocumentTemplateType;
            (function (DocumentTemplateType) {
                DocumentTemplateType[DocumentTemplateType["None"] = 0] = "None";
                DocumentTemplateType[DocumentTemplateType["Excel"] = 1] = "Excel";
                DocumentTemplateType[DocumentTemplateType["Word"] = 2] = "Word";
            })(DocumentTemplateType = Common.DocumentTemplateType || (Common.DocumentTemplateType = {}));
            var Utility = (function () {
                function Utility() {
                }
                /**
                 * Checks whether an object is null.
                 * @param object The object to check.
                 * @returns A flag indicating whether the object is null.
                 */
                Utility.isNull = function (object) {
                    return object === null;
                };
                /**
                 * Checks whether an object is null or undefined.
                 * @param object The object to check.
                 * @returns A flag indicating whether the object is null or undefined.
                 */
                Utility.isNullOrUndefined = function (object) {
                    return object === null || object === undefined;
                };
                /**
                 * Checks whether an object is an undefined, null or empty string.
                 * @param object The object to check.
                 * @returns A flag indicating whether the object is undefined, null or an empty string.
                 */
                Utility.isNullOrEmptyString = function (object) {
                    return Utility.isNullOrUndefined(object) || object === "";
                };
                /**
                * Tries to convert an object to string
                * @param object The object to convert.
                * @returns Returns the object converted to string or the object itself if this is null or undefined.
                */
                Utility.toStringWithNullCheck = function (object) {
                    return Utility.isNullOrUndefined(object) ? object : object.toString();
                };
                Utility.newGuid = function () {
                    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                };
                /**
                * The method for creating Blob object from base64 content.
                */
                Utility.Base64ToBlob = function (fileContent, fileType) {
                    if (this.isNullOrEmptyString(fileContent))
                        throw new Error("file Content cannot be empty");
                    if (this.isNullOrEmptyString(fileType))
                        throw new Error("file Type cannot be empty");
                    // convert base64 content to raw binary data held in a string
                    var binary = window.atob(fileContent);
                    var binaryLength = binary.length;
                    // create ArrayBuffer with binary length
                    var buffer = new ArrayBuffer(binaryLength);
                    // create 8-bit Array for ArrayBuffer
                    var viewBuffer = new Uint8Array(buffer);
                    // save unicode of binary data into 8-bit Array
                    for (var i = 0; i < binaryLength; i++) {
                        viewBuffer[i] = binary.charCodeAt(i);
                    }
                    return new Blob([buffer], { type: fileType });
                };
                Utility.clickOnTempAnchor = function (url, fileName) {
                    var tempAnchorElement = document.createElement("a");
                    tempAnchorElement.setAttribute("href", url);
                    tempAnchorElement.setAttribute("target", "_blank");
                    tempAnchorElement.setAttribute("download", fileName);
                    document.body.appendChild(tempAnchorElement);
                    tempAnchorElement.click();
                    document.body.removeChild(tempAnchorElement);
                };
                Utility.GetCurrentAppId = function () {
                    if (window && window.top && window.top.location && window.top.location.href) {
                        var currentUrl = window.top.location.href;
                        var index = currentUrl.indexOf("?");
                        var queryString = currentUrl.substring(index + 1, currentUrl.length);
                        var UrlVariables = queryString.split("&");
                        for (var i = 0; i < UrlVariables.length; i++) {
                            var Entry = UrlVariables[i].split("=");
                            var key = Entry.length === 2 ? Entry[0] : null;
                            if (key === "appid") {
                                return Entry[1];
                            }
                        }
                    }
                    return "";
                };
                /**
                 * returns the fetchXML, which can be used to fetch the parkinsolutionID of the app.
                 * @param appId : appId of the App being used.
                 * @param parkingSolutionAppConfigMasterId
                 */
                Utility.GetParkingSolutionIdFetchXML = function (appId, parkingSolutionAppConfigMasterId) {
                    var retFetchXML = "?fetchXml=" + encodeURI("<fetch version=\"1.0\" mapping=\"logical\" distinct=\"true\">\n\t\t\t\t\t <entity name=\"appconfiginstance\">\n\t\t\t\t\t <attribute name=\"value\" />\n\t\t\t\t\t <link-entity name=\"appconfig\" to=\"appconfigid\" from=\"appconfigid\" link-type=\"inner\" >\n\t\t\t\t\t\t <filter type=\"and\">\n\t\t\t\t\t\t\t <condition attribute=\"appmoduleid\" operator=\"eq\" value=\"" + appId + "\"/>\n\t\t\t\t\t\t </filter >\n\t\t\t\t\t </link-entity>\n\t\t\t\t\t <link-entity name=\"solution\" to=\"value\" from=\"solutionid\" link-type=\"inner\"  />\n\t\t\t\t\t <filter type=\"and\">\n\t\t\t\t\t\t<condition attribute=\"appconfigmasterid\" operator=\"eq\" value=\"" + parkingSolutionAppConfigMasterId + "\"/> </filter>\n\t\t\t\t\t </entity>\n\t\t\t\t </fetch>");
                    return retFetchXML;
                };
                Utility.GetCurrentShellMode = function () {
                    if (window && window.top && window.top.location && window.top.location.href) {
                        var currentUrl = window.top.location.href;
                        var index = currentUrl.indexOf("?");
                        var queryString = currentUrl.substring(index + 1, currentUrl.length);
                        var UrlVariables = queryString.split("&");
                        for (var i = 0; i < UrlVariables.length; i++) {
                            var Entry = UrlVariables[i].split("=");
                            var key = Entry.length === 2 ? Entry[0] : null;
                            if (key === "appshellmode") {
                                return Entry[1].toLowerCase();
                            }
                        }
                    }
                    return "";
                };
                Utility.GetFileExtension = function (fileName) {
                    return this.isNullOrEmptyString(fileName) ? fileName
                        : fileName.substr(fileName.lastIndexOf('.') + 1);
                };
                Utility.GetFileNameWithoutExtension = function (fileName) {
                    return this.isNullOrEmptyString(fileName) ? fileName
                        : fileName.substr(0, fileName.lastIndexOf('.'));
                };
                Utility.GetDocumentTemplateType = function (fileExtension) {
                    switch (fileExtension) {
                        case "xlsx":
                            return DocumentTemplateType.Excel;
                        case "docx":
                            return DocumentTemplateType.Word;
                    }
                    return DocumentTemplateType.None;
                };
                Utility.GetFileExtensionForDocument = function (docType) {
                    switch (docType) {
                        case DocumentTemplateType.Excel:
                            return "xlsx";
                        case DocumentTemplateType.Word:
                            return "docx";
                    }
                    return "";
                };
                Utility.EqualsIgnoreCase = function (string1, string2) {
                    var isString1Null = string1 == null;
                    var isString2Null = string2 == null;
                    var isString1Undefined = string1 == undefined;
                    var isString2Undefined = string2 == undefined;
                    if (isString1Null && isString2Null || isString1Undefined && isString2Undefined) {
                        return true;
                    }
                    if (isString1Null != isString2Null || isString1Undefined != isString2Undefined) {
                        return false;
                    }
                    return string1.toUpperCase() === string2.toUpperCase();
                };
                Utility.isNullUndefinedOrWhitespace = function (s) {
                    return s == null || s == undefined || s.trim().length === 0;
                };
                ;
                /**
                 * Parses webapplication endpoint url and returns crmhostname : used for AddNewUserControl, EditUserControl and ApplicationManagementControl
                 */
                Utility.GetCrmHostName = function (webApplicationEndpoint) {
                    /*
                    * Parsing considers following 4 forms of URLs:
                    *   1."https://someorg.crmx.something.com/"
                    *   2."https://someorg.crmx.something.com"
                    *   3."someorg.crmx.something.com"
                    *   4."someorg.crmx.something.com/"
                    * converts into "crmx.something.com"
                    */
                    var currentUrl = webApplicationEndpoint;
                    var matchedStringIndex = currentUrl.indexOf(".");
                    if (matchedStringIndex != -1) {
                        currentUrl = currentUrl.substring(matchedStringIndex + 1);
                        //remove last "/" if there
                        var lastIndex = currentUrl.lastIndexOf("/");
                        if (lastIndex != -1) {
                            currentUrl = currentUrl.substring(0, lastIndex);
                        }
                    }
                    //TODO: throw exception if not able to process the string and catch it when function is called.
                    return currentUrl;
                };
                /**
                 * Detects whether the browser is Safari
                 */
                Utility.IsSafari = function () {
                    var ua = window.navigator.userAgent.toLowerCase();
                    if (ua.indexOf('safari') != -1 && ua.indexOf('chrome') == -1) {
                        return true;
                    }
                    return false;
                };
                /**
                 * Detects whether the iphone or ipad
                 */
                Utility.IsIosDevice = function () {
                    var ua = window.navigator.userAgent.toLowerCase();
                    if (ua.indexOf('iphone') != -1 || ua.indexOf('ipad') != -1) {
                        return true;
                    }
                    return false;
                };
                /**
                 * Downloads the file
                 * @param fileName name of the file
                 * @param fileContent content of the file
                 * @param mimeType the mimeType
                 */
                Utility.DownloadFile = function (fileName, fileContent, mimeType) {
                    var file = {
                        fileContent: fileContent,
                        fileName: fileName,
                        mimeType: mimeType
                    };
                    var openMode = { "openMode": 2 };
                    window.Xrm.Navigation.openFile(file, openMode);
                };
                Utility.actionFailedErrorDialog = function (errorResponse) {
                    Xrm.Navigation.openErrorDialog({ errorCode: errorResponse.errorCode, message: errorResponse.message });
                };
                /*
                 ***********************************Constructing Immersive Excel Utilities******************************************************
                */
                /**
                * Generate file name for exported document
                * @param prefix Prefix of the name
                * @param documentType 1: Excel 2: Word
                */
                Utility.generateExportFileName = function (prefix, documentType) {
                    var ext = documentType === 2 ? ".docx" : ".xlsx";
                    if (typeof (Xrm.Utility.getGlobalContext()) != 'undefined'
                        && Xrm.Utility.getGlobalContext() != null
                        && typeof (Xrm.Utility.getGlobalContext().userSettings) != 'undefined'
                        && Xrm.Utility.getGlobalContext().userSettings != null
                        && prefix
                        && prefix.length != 0) {
                        var now = new Date();
                        var datePattern = Xrm.Utility.getGlobalContext().userSettings.dateFormattingInfo.ShortDatePattern;
                        var timePattern = Xrm.Utility.getGlobalContext().userSettings.dateFormattingInfo.LongTimePattern;
                        var dateSeparator = Xrm.Utility.getGlobalContext().userSettings.dateFormattingInfo.DateSeparator;
                        var timeSeparator = Xrm.Utility.getGlobalContext().userSettings.dateFormattingInfo.TimeSeparator;
                        var fileName = prefix + " " + now.format(datePattern) + " " + now.format(timePattern) + ext;
                        fileName = fileName.split(dateSeparator).join("-").split(timeSeparator).join("-");
                        return fileName;
                    }
                    if (prefix && prefix.length != 0) {
                        return "" + prefix + ext;
                    }
                    return "Export" + ext;
                };
                /**
                 * Parses the xml and generates to XMLDocument using JS runtime
                 * @param xml xml represented as string for which we need XMLDocument
                 */
                Utility.ParseXml = function (xml) {
                    if (window.hasOwnProperty("DOMParser")) {
                        var parser = new DOMParser();
                        return parser.parseFromString(xml, "text/xml");
                    }
                    else if (window.hasOwnProperty("ActiveXObject")) {
                        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM"); // tslint:disable-line:no-any
                        xmlDoc.async = false;
                        xmlDoc.loadXML(xml);
                        return xmlDoc;
                    }
                    return null;
                };
                Utility.getGridAttributes = function () {
                    var gridAttributes = ["sortColumns", "pageNum", "recsPerPage", "dataProvider", "uiProvider", "cols", "max", "refreshAsync", "pagingCookie", "enableMultiSort", "enablePagingWhenOnePage", "refreshCalledFromRefreshButton", "totalrecordcount", "allrecordscounted", "returntotalrecordcount", "getParameters", "parameters", "columns"];
                    return gridAttributes;
                };
                Utility.getGridParameters = function () {
                    var gridParameters = ["autorefresh", "isGridHidden", "isGridFilteringEnabled", "viewid", "viewtype", "RecordsPerPage", "viewTitle", "layoutXml", "otc", "otn", "entitydisplayname", "titleformat", "entitypluraldisplayname", "isWorkflowSupported", "fetchXmlForFilters", "isFetchXmlNotFinal", "effectiveFetchXml", "LayoutStyle", "enableFilters", "isTurboForm"];
                    return gridParameters;
                };
                Utility.getColumnValues = function (layoutXml) {
                    return "";
                };
                Utility.getGridAttributesDefaultValues = function () {
                    var defaultValuesforGridAttributes = {};
                    //Assign Default Values
                    var xmlDocument = Utility.ParseXml(Xrm.Page.data.attributes.get("entity_fetchXml").getValue());
                    var orderNode = xmlDocument;
                    //ToDo
                    defaultValuesforGridAttributes["sortColumns"] = "name:1";
                    defaultValuesforGridAttributes["pageNum"] = "1";
                    defaultValuesforGridAttributes["recsPerPage"] = "50";
                    defaultValuesforGridAttributes["dataProvider"] = "Microsoft.Crm.Application.Platform.Grid.GridDataProviderQueryBuilder";
                    defaultValuesforGridAttributes["uiProvider"] = "Microsoft.Crm.Application.Controls.GridUIProvider";
                    defaultValuesforGridAttributes["Cols"] = "Empty";
                    defaultValuesforGridAttributes["max"] = "-1";
                    defaultValuesforGridAttributes["refreshAsync"] = "false";
                    defaultValuesforGridAttributes["pagingCookie"] = "Empty";
                    defaultValuesforGridAttributes["enableMultiSort"] = "true";
                    defaultValuesforGridAttributes["enablePagingWhenOnePage"] = "true";
                    defaultValuesforGridAttributes["refreshCalledFromRefreshButton"] = "1";
                    defaultValuesforGridAttributes["totalrecordcount"] = Xrm.Page.data.attributes.get("entity_totalRecordCount").getValue();
                    defaultValuesforGridAttributes["allrecordscounted"] = "true";
                    defaultValuesforGridAttributes["returntotalrecordcount"] = "true";
                    defaultValuesforGridAttributes["getParameters"] = "Empty";
                    defaultValuesforGridAttributes["columns"] = Utility.getColumnValues(Xrm.Page.data.attributes.get("entity_layoutXml").getValue());
                    return defaultValuesforGridAttributes;
                };
                Utility.getGridParameterDefaultValues = function () {
                    var defaultValuesforGridParameters = {};
                    var fetchXml = Xrm.Page.data.attributes.get("entity_fetchXml").getValue();
                    var layoutXml = Xrm.Page.data.attributes.get("entity_layoutXml").getValue();
                    var entity_effectiveFetchXml = Xrm.Page.data.attributes.get("entity_fetchXml").getValue();
                    var entity_effectiveLayoutXml = Xrm.Page.data.attributes.get("entity_layoutXml").getValue();
                    //Extracting HTML Decoded Content
                    fetchXml = Utility.unescapeHtml(fetchXml);
                    layoutXml = Utility.unescapeHtml(layoutXml);
                    entity_effectiveFetchXml = Utility.unescapeHtml(entity_effectiveFetchXml);
                    entity_effectiveLayoutXml = Utility.unescapeHtml(entity_effectiveLayoutXml);
                    var entityTypeName = Xrm.Page.data.attributes.get("entity_typeName").getValue();
                    defaultValuesforGridParameters["autorefresh"] = "1";
                    defaultValuesforGridParameters["isGridHidden"] = "false";
                    defaultValuesforGridParameters["isGridFilteringEnabled"] = "1";
                    defaultValuesforGridParameters["viewid"] = Xrm.Page.data.attributes.get("entity_viewId").getValue();
                    defaultValuesforGridParameters["viewtype"] = "1039";
                    defaultValuesforGridParameters["RecordsPerPage"] = "50";
                    defaultValuesforGridParameters["viewTitle"] = Xrm.Page.data.attributes.get("entity_viewName").getValue();
                    defaultValuesforGridParameters["layoutXml"] = layoutXml;
                    defaultValuesforGridParameters["otc"] = Xrm.Page.data.attributes.get("entity_typeCode").getValue().toString();
                    defaultValuesforGridParameters["otn"] = entityTypeName;
                    defaultValuesforGridParameters["entitydisplayname"] = entityTypeName;
                    defaultValuesforGridParameters["titleformat"] = "{0} {1}";
                    defaultValuesforGridParameters["entitypluraldisplayname"] = entityTypeName;
                    defaultValuesforGridParameters["isWorkflowSupported"] = "true";
                    defaultValuesforGridParameters["fetchXmlForFilters"] = entity_effectiveFetchXml;
                    defaultValuesforGridParameters["isFetchXmlNotFinal"] = "False";
                    defaultValuesforGridParameters["effectiveFetchXml"] = entity_effectiveFetchXml;
                    defaultValuesforGridParameters["LayoutStyle"] = "GridList";
                    defaultValuesforGridParameters["enableFilters"] = "1";
                    defaultValuesforGridParameters["isTurboForm"] = "0";
                    defaultValuesforGridParameters["fetchXml"] = fetchXml;
                    return defaultValuesforGridParameters;
                };
                /**
                * Export GridXml parameter
                * @param gridControl The current grid
                * @param entityTypeName The entityTypeName for this grid
                * @param exportType The type of exporting we are doing (static/dynamic/online...)
                */
                Utility.constructGridXml = function () {
                    var gridAttributes = Utility.getGridAttributes();
                    var xmlString = "<grid></grid>";
                    var gridXml = Utility.ParseXml(xmlString);
                    var index = 0;
                    var gridAttributeDefaultValues = Utility.getGridAttributesDefaultValues();
                    var gridParamerterDefaultValues = Utility.getGridParameterDefaultValues();
                    var gridParameters = Utility.getGridParameters();
                    while (index < gridAttributes.length) {
                        var node = gridXml.createElement(gridAttributes[index]);
                        if (gridAttributeDefaultValues[gridAttributes[index]] != "Empty") {
                            node.textContent = gridAttributeDefaultValues[gridAttributes[index]];
                        }
                        index++;
                        gridXml.documentElement.appendChild(node);
                    }
                    var parametersNodeCollection = gridXml.querySelectorAll('grid>parameters');
                    var parameternode = parametersNodeCollection[0];
                    index = 0;
                    while (index < gridAttributes.length) {
                        var nodeparam = gridXml.createElement(gridParameters[index]);
                        nodeparam.textContent = gridParamerterDefaultValues[gridParameters[index]];
                        index++;
                        parameternode.appendChild(nodeparam);
                    }
                    return (new XMLSerializer()).serializeToString(gridXml);
                };
                //HTML Encode Decode
                Utility.unescapeHtml = function (str) {
                    var map = { amp: '&', lt: '<', le: '≤', gt: '>', ge: '≥', quot: '"', '#039': "'" };
                    return str.replace(/&([^;]+);/g, function (m, c) { return map[c] || ''; });
                };
                /**
                 * Export PostData parameter to MDD
                 * @param gridControl The current grid
                 * @param entityTypeName The entityTypeName for this grid
                 * @param exportType The type of exporting we are doing (static/dynamic/online...)
                 */
                Utility.constructPostData = function () {
                    // Construct Grid Xml
                    var postData = "";
                    var exportType = Xrm.Page.data.attributes.get("entity_exportType").getValue();
                    var fetchXml = Xrm.Page.data.attributes.get("entity_fetchXml").getValue();
                    var layoutXml = Xrm.Page.data.attributes.get("entity_layoutXml").getValue();
                    //Extracting HTML Decoded Content
                    fetchXml = Utility.unescapeHtml(fetchXml);
                    layoutXml = Utility.unescapeHtml(layoutXml);
                    //Construct First Parameter - ExportType
                    if (exportType == 2) {
                        postData = postData.concat("exportType=dynamicXlsx&");
                    }
                    else if (exportType == 3) {
                        postData = postData.concat("exportType=pivotXlsx&");
                    }
                    //Construct Second Parameter - GridXml
                    postData = postData.concat("gridXml=" + Utility.unescapeHtml(Utility.constructGridXml()) + "&");
                    //Construct the FetchXml Parameter
                    postData = postData.concat("fetchXml=" + fetchXml + "&");
                    //Construct the LayoutXml
                    postData = postData.concat("layoutXml=" + layoutXml + "&printAllPages=1");
                    return postData;
                };
                return Utility;
            }());
            Common.Utility = Utility;
        })(Common = AppCommon.Common || (AppCommon.Common = {}));
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
///<reference path="../../../../../../references/external/TypeDefinitions/jquery.d.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        var Common;
        (function (Common) {
            'use strict';
            var ServiceProxy = (function () {
                function ServiceProxy() {
                }
                ServiceProxy.init = function (url) {
                    if (Common.Utility.isNullOrEmptyString(url)) {
                        throw new Error("The server url is required");
                    }
                    this._clientUrl = url + this._webapiPath;
                };
                ServiceProxy.Retrieve = function (query) {
                    if (Common.Utility.isNullOrEmptyString(this._clientUrl)) {
                        throw new Error("The server url is not set");
                    }
                    var ajaxOptions = {
                        url: encodeURI(this._clientUrl + query),
                        type: "GET",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        }
                    };
                    return $.ajax(ajaxOptions);
                };
                ServiceProxy.GetDocumentTemplate = function (id, columns) {
                    var query = "documenttemplates(" + id + ")";
                    if (!Common.Utility.isNullOrUndefined(columns)) {
                        query += "?$select=" + columns.join(",");
                    }
                    return this.Retrieve(query);
                };
                ServiceProxy.GetAppModuleComponents = function (id, filter) {
                    var query = "RetrieveAppComponents(AppModuleId=" + id + ")";
                    if (!Common.Utility.isNullOrUndefined(filter)) {
                        query += filter;
                    }
                    return this.Retrieve(query);
                };
                ServiceProxy.GetEntityMetadata = function (filter) {
                    var query = "EntityDefinitions";
                    if (!Common.Utility.isNullOrUndefined(filter)) {
                        query += filter;
                    }
                    return this.Retrieve(query);
                };
                ServiceProxy.GetSMBEnabledEntities = function (appModuleId, columns, failureCallback) {
                    var that = this;
                    return this.GetAppModuleComponents(appModuleId).then(function (data) {
                        var filters = that.CreateMetadataFilters(data);
                        var query = '?$select=' + (Common.Utility.isNullOrUndefined(columns) ? "ObjectTypeCode" : columns.join(",")) + ("&$filter=" + filters);
                        return that.GetEntityMetadata(query);
                    }, function (jqXHR, textStatus, errorThrown) {
                        if (!Common.Utility.isNullOrUndefined(failureCallback)) {
                            failureCallback(jqXHR, textStatus, errorThrown);
                        }
                    });
                };
                ServiceProxy.CreateMetadataFilters = function (data) {
                    var filters = "";
                    var operator = "";
                    if (!Common.Utility.isNullOrUndefined(data.value)) {
                        var records = data.value;
                        records = records.filter(function (record) { return record.componenttype == 1; }); //filter out entity components
                        records.forEach(function (record) {
                            filters += operator + "MetadataId eq " + record.objectid;
                            operator = " or ";
                        });
                    }
                    return filters;
                };
                ServiceProxy.Resolve = function (response) {
                    console.log(response);
                };
                ServiceProxy.Reject = function (response) {
                    console.log(response);
                };
                return ServiceProxy;
            }());
            ServiceProxy._clientUrl = null;
            ServiceProxy._webapiPath = "/api/data/v9.0/";
            Common.ServiceProxy = ServiceProxy;
        })(Common = AppCommon.Common || (AppCommon.Common = {}));
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/// <reference path="Utility.ts" />
/// <reference path="ServiceProxy.ts" /> 
