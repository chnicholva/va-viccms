var MscrmControls;
(function (MscrmControls) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var AppConfigConstants = (function () {
            function AppConfigConstants() {
            }
            Object.defineProperty(AppConfigConstants, "ENTITY_COMPONENTTYPE", {
                get: function () {
                    return 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "APP_COMPONENTTYPE", {
                get: function () {
                    return 80;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "SAVEDQUERY_COMPONENTTYPE", {
                get: function () {
                    return 26;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "SYSTEMFORM_COMPONENTTYPE", {
                get: function () {
                    return 60;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "BPF_COMPONENTTYPE", {
                get: function () {
                    return 29;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "BPF_ENTITY_ID", {
                get: function () {
                    return "e5c40599-99d3-453d-8594-8d55e29a9579";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "CANBECUSTOMIZED_APPCONFIGMASTERID", {
                get: function () {
                    return "dfe2b7b7-d938-4749-abcc-049ba14c546a";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "PARKINGSOLUTION_APPCONFIGMASTERID", {
                get: function () {
                    return "bcb82bb9-1ae9-424a-9207-bdcb35ec0a25";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "DEFAULT_SOLUTIONID", {
                get: function () {
                    return "fd140aaf-4df4-11dd-bd17-0019b9312238";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "SAVEDQUERY_PRIMARYKEY", {
                get: function () {
                    return "savedqueryid";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "SYSTEMFORM_PRIMARYKEY", {
                get: function () {
                    return "formid";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "BPF_PRIMARYKEY", {
                get: function () {
                    return "workflowid";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "SAVEDQUERY_ENTITYNAMEATTRIBUTE", {
                get: function () {
                    return "returnedtypecode";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "SYSTEMFORM_ENTITYNAMEATTRIBUTE", {
                get: function () {
                    return "objecttypecode";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "BPF_ENTITYNAMEATTRIBUTE", {
                get: function () {
                    return "primaryentity";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "HTTPGET", {
                /**
                 * Logical Operators
                 **/
                get: function () {
                    return "GET";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "HTTPPOST", {
                get: function () {
                    return "POST";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "LOGICALAND", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "LOGICALOR", {
                get: function () {
                    return 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "OPERATOREQUAL", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppConfigConstants, "OPERATORNOTEQUAL", {
                get: function () {
                    return 1;
                },
                enumerable: true,
                configurable: true
            });
            return AppConfigConstants;
        }());
        AppCommon.AppConfigConstants = AppConfigConstants;
    })(AppCommon = MscrmControls.AppCommon || (MscrmControls.AppCommon = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        /**
     * This class is use to create request for creating Odata request for AddSolutionComponent
     */
        var AddSolutionComponentRequest = (function () {
            function AddSolutionComponentRequest(componentId, componentType, solutionUniqueName, addRequiredComponents, doNotIncludeSubcomponents, includedComponentSettingsValues) {
                this.ComponentId = componentId;
                this.ComponentType = componentType;
                this.SolutionUniqueName = solutionUniqueName;
                this.AddRequiredComponents = addRequiredComponents;
                this.DoNotIncludeSubcomponents = doNotIncludeSubcomponents;
                this.IncludedComponentSettingsValues = includedComponentSettingsValues;
            }
            AddSolutionComponentRequest.prototype.getMetadata = function () {
                var metadata = {
                    boundParameter: null,
                    parameterTypes: {
                        "ComponentId": {
                            "typeName": "Edm.Guid",
                            "structuralProperty": 1,
                        },
                        "ComponentType": {
                            "typeName": "Edm.Int32",
                            "structuralProperty": 1,
                        },
                        "SolutionUniqueName": {
                            "typeName": "Edm.String",
                            "structuralProperty": 1,
                        },
                        "AddRequiredComponents": {
                            "typeName": "Edm.Boolean",
                            "structuralProperty": 1,
                        },
                        "DoNotIncludeSubcomponents": {
                            "typeName": "Edm.Boolean",
                            "structuralProperty": 1,
                        },
                        "IncludedComponentSettingsValues": {
                            "typeName": "Edm.String",
                            "structuralProperty": 4,
                        },
                    },
                    operationName: "AddSolutionComponent",
                    operationType: 0,
                };
                return metadata;
            };
            return AddSolutionComponentRequest;
        }());
        AppCommon.AddSolutionComponentRequest = AddSolutionComponentRequest;
    })(AppCommon = MscrmControls.AppCommon || (MscrmControls.AppCommon = {}));
})(MscrmControls || (MscrmControls = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
* Logic to integrate Sales SMB customization screens (View/Form/BPF etc) with AppModule and App Config
*/
var MscrmControls;
(function (MscrmControls) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        /**
         * This class is to define data for select box control on create View/BPF MDD
         */
        var SMBEntityMetadata = (function () {
            function SMBEntityMetadata() {
            }
            return SMBEntityMetadata;
        }());
        /**
         * For AppConfigInstance filtering
         */
        var AppFilterCondition = (function () {
            function AppFilterCondition(_attributeName, _conditionOperator, _value) {
                this.attributeName = _attributeName;
                this.conditionOperator = _conditionOperator;
                this.value = _value;
            }
            return AppFilterCondition;
        }());
        ;
        /**
         * The module integrates SMB customization grids with AppModule and AppConfig by providing following capabilities
         * Api that returns records for customization grid for given appId and component type
         * Api that returns records available in app module for given appId and component type
         * Api that returns records blacklisted/whitelisted for customization in app config for given appId and component type
         */
        var AppModuleAppConfig = (function () {
            /**
             * Constructor
             * @param _webApiContext
             * @param _utilContext
             * @param _targetComponentType
             * @param _appId
             * @param _handler
             */
            function AppModuleAppConfig(_webApiContext, _utilContext, _targetComponentType, _appId, _callBackForFilteringInput, _callBackForParkingSolution) {
                this.webApiContext = _webApiContext;
                this.utilContext = _utilContext;
                this.targetComponentType = _targetComponentType;
                this.appId = _appId;
                this.appConfigId = "";
                this.appModComponentRecords = null;
                this.appModEntityComponentRecords = null;
                this.whiteListedEntityIds = null;
                this.mapEntityIdObjectTypeCode = null;
                this.callBackForFilteringInput = _callBackForFilteringInput;
                this.callBackForParkingSolution = _callBackForParkingSolution;
                this.filteringInput = null;
            }
            /**
            * The function creates filtering input for collection of records ids that need to be shown on systemview/systemform/BPF customization grid
            **/
            AppModuleAppConfig.prototype.AsyncGetFilteringInputForCustomizationGrid = function () {
                //Retrieving appmoduleidunique for unpublished layer
                var that = this;
                this.getAppModuleIdUniqueForUnpublishedLayer().then(function (appUniqueIdResp) {
                    if (that.isNullOrUndefined(appUniqueIdResp) || that.isNullOrUndefined(appUniqueIdResp.value) || appUniqueIdResp.value.length != 1) {
                        var errMessage = "AppModuleIdUnique record is not found in successful response.";
                        that.handleError(new Error(errMessage));
                        return;
                    }
                    that.appUniqueIdUnpublished = appUniqueIdResp.value[0].appmoduleidunique;
                    that.asyncGetFilteringInputOrEntityWhiteList();
                }, function (error) {
                    var errMessage = "Retrieval of AppModuleIdUnique Failed.";
                    that.handleError(error, errMessage);
                });
            };
            /**
            * The function returns input for the collection of entities that need to rendered in View/BPF create dialog's select box
            **/
            AppModuleAppConfig.prototype.GetEntityWhiteListForCreateDialog = function () {
                return this.createWhiteListedEntityInput();
            };
            /**
             * The function retrieves and sets parking solution id
             */
            AppModuleAppConfig.prototype.AsyncGetParkingSolution = function () {
                var that = this;
                this.getParkingSolutionId().then(function (response) {
                    if (that.isNullOrUndefined(response) || that.isNullOrUndefined(response.value) || response.value.length < 1) {
                        that.callBackForParkingSolution(AppCommon.AppConfigConstants.DEFAULT_SOLUTIONID);
                        that.handleError(new Error("Parking solution is not available in AppConfig for AppID : {" + that.appId + "}"));
                    }
                    else {
                        that.callBackForParkingSolution(response.value[0].value);
                    }
                }, function (error) {
                    that.callBackForParkingSolution(AppCommon.AppConfigConstants.DEFAULT_SOLUTIONID);
                    that.handleError(error, "Parking solution is not available in AppConfig for AppID : {" + that.appId + "}");
                });
            };
            /**
             * The function adds updated components in the App
             * @param componentId
             * @param isCreateMode
             * @param solutionUniqueName
             */
            AppModuleAppConfig.prototype.AsyncAddComponentAndAppToUnmanagedSolution = function (componentId, isCreateMode, solutionId) {
                var that = this;
                var solutionUniqueName = "";
                //Retrieving solutionUniqueName by SolutionId
                this.webApiContext.retrieveRecord("solution", solutionId, "?$select=uniquename").then(function (respSol) {
                    solutionUniqueName = respSol.uniquename;
                    //In case it is create mode, add current app to the solution
                    if (isCreateMode) {
                        var reqAddApp = new AppCommon.AddSolutionComponentRequest(that.appId, AppCommon.AppConfigConstants.APP_COMPONENTTYPE, solutionUniqueName, false, false, null);
                        that.getWebApiPostRequest("/api/data/v9.0/AddSolutionComponent", JSON.stringify(reqAddApp)).then(function (data) {
                            //Do nothing in case it succeeds
                        }, function (error) {
                            var errMessage = "Adding App:{" + that.appId + "} in solution:{" + solutionUniqueName + "} failed.";
                            that.handleError(error, errMessage);
                        });
                    }
                    //Add corresponding entity and record to the unmananged solution
                    var entityId = "";
                    switch (that.targetComponentType) {
                        case AppCommon.AppConfigConstants.BPF_COMPONENTTYPE:
                            entityId = AppCommon.AppConfigConstants.BPF_ENTITY_ID;
                            break;
                        default:
                            throw Error("AsyncAddComponentAndAppToUnmanagedSolution is not implemented for component type: " + this.targetComponentType);
                    }
                    var reqAddEntity = new AppCommon.AddSolutionComponentRequest(entityId, AppCommon.AppConfigConstants.ENTITY_COMPONENTTYPE, solutionUniqueName, false, true, null);
                    that.getWebApiPostRequest("/api/data/v9.0/AddSolutionComponent", JSON.stringify(reqAddEntity)).then(function (data) {
                        //Add the record in the unmanaged solution layer
                        var reqAddRecord = new AppCommon.AddSolutionComponentRequest(componentId, that.targetComponentType, solutionUniqueName, false, false, null);
                        that.getWebApiPostRequest("/api/data/v9.0/AddSolutionComponent", JSON.stringify(reqAddRecord)).then(function (data) {
                            //Do nothing in case it succeeds
                        }, function (error) {
                            var errMessage = "Adding record:{" + componentId + "} of component type:{" + that.targetComponentType + "} in solution:{" + solutionUniqueName + "} failed.";
                            that.handleError(error, errMessage);
                        });
                    }, function (error) {
                        var errMessage = "Adding entity of component type:{" + that.targetComponentType + "} in solution:{" + solutionUniqueName + "} failed.";
                        that.handleError(error, errMessage);
                    });
                }, function (error) {
                    var errMessage = "Retrieval of solution for solutionid:{" + solutionId + "} failed.";
                    that.handleError(error, errMessage);
                });
            };
            /**
            * Private Methods
            **/
            /**
             * The funciton creates input for grid or create mode MDD based on the input parameter isEntityWhiteList
             * @param isEntityWhiteList
             */
            AppModuleAppConfig.prototype.asyncGetFilteringInputOrEntityWhiteList = function () {
                var that = this;
                // 1. Get records from AppModule
                this.getAppModuleRecords().then(function (respAppModuleRecords) {
                    if (that.isNullOrUndefined(respAppModuleRecords) || that.isNullOrUndefined(respAppModuleRecords.value) || respAppModuleRecords.value.length < 1) {
                        var errMessage = "Could not retrieve AppModule records.";
                        that.handleError(new Error(errMessage));
                        return;
                    }
                    //As RetrieveAppComponent returns records of all component type,
                    //Filtering out records where componenttype != targetComponentType
                    that.appModComponentRecords = new Array();
                    that.appModEntityComponentRecords = new Array();
                    for (var _i = 0, _a = respAppModuleRecords.value; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (item.componenttype == that.targetComponentType) {
                            that.appModComponentRecords.push(item.objectid);
                        }
                        else if (item.componenttype = AppCommon.AppConfigConstants.ENTITY_COMPONENTTYPE) {
                            that.appModEntityComponentRecords.push(item.objectid);
                        }
                    }
                    // If all responses received, create filtering input
                    if (that.whiteListedEntityIds != null && that.mapEntityIdObjectTypeCode != null && that.blackListedComponentIds != null) {
                        that.CreateFilteringInputAndCallHandler();
                    }
                }, function (error) {
                    var errMessage = "Retrieval of AppModuleRecords Failed.";
                    that.handleError(error, errMessage);
                });
                // 2. Retrieve WhiteList of entityids from appConfig
                this.getWhiteListedEntitiesFromAppConfig().then(function (respWhiteListedEtns) {
                    that.whiteListedEntityIds = new Array();
                    if (that.isNullOrUndefined(respWhiteListedEtns) || that.isNullOrUndefined(respWhiteListedEtns.value)) {
                        return;
                    }
                    for (var _i = 0, _a = respWhiteListedEtns.value; _i < _a.length; _i++) {
                        var item = _a[_i];
                        that.whiteListedEntityIds.push(item.objectid);
                    }
                    // If all responses received, create filtering input							
                    if (that.appModComponentRecords != null && that.mapEntityIdObjectTypeCode != null && that.blackListedComponentIds != null) {
                        that.CreateFilteringInputAndCallHandler();
                    }
                }, function (error) {
                    var errMessage = "Retrieval of WhileListedEntityIdsFromAppConfig Failed.";
                    that.handleError(error, errMessage);
                });
                // 3. Retrieve BlackListed (which are not customizable) components from appConfig
                this.getNonCustomizableComponentsFromAppConfig().then(function (respBlackListedComps) {
                    that.blackListedComponentIds = new Array();
                    if (that.isNullOrUndefined(respBlackListedComps) || that.isNullOrUndefined(respBlackListedComps.value)) {
                        return;
                    }
                    for (var _i = 0, _a = respBlackListedComps.value; _i < _a.length; _i++) {
                        var item = _a[_i];
                        that.blackListedComponentIds.push(item.objectid);
                    }
                    // If all responses received, create filtering input							
                    if (that.appModComponentRecords != null && that.mapEntityIdObjectTypeCode != null && that.whiteListedEntityIds != null) {
                        that.CreateFilteringInputAndCallHandler();
                    }
                }, function (error) {
                    var errMessage = "Retrieval of BlackListedComponentIdsFromAppConfig Failed.";
                    that.handleError(error, errMessage);
                });
                // 4. Retrieve EntityIDs and ObjectTypeCodes
                this.getEntityIdsObjectTypeCodes().then(function (respIdOTC) {
                    that.mapEntityIdObjectTypeCode = {};
                    if (that.isNullOrUndefined(respIdOTC) || that.isNullOrUndefined(respIdOTC.value) || respIdOTC.value.length < 1) {
                        return;
                    }
                    for (var _i = 0, _a = respIdOTC.value; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (that.validateOptionItem(item)) {
                            that.mapEntityIdObjectTypeCode[item.MetadataId] = new SMBEntityMetadata();
                            that.mapEntityIdObjectTypeCode[item.MetadataId].OTC = String(item.ObjectTypeCode);
                            that.mapEntityIdObjectTypeCode[item.MetadataId].LogicalName = item.LogicalName;
                            that.mapEntityIdObjectTypeCode[item.MetadataId].UserLocalizedName = item.DisplayName.UserLocalizedLabel.Label;
                        }
                    }
                    // If all responses received, create filtering input							
                    if (that.appModComponentRecords != null && that.whiteListedEntityIds != null && that.blackListedComponentIds != null) {
                        that.CreateFilteringInputAndCallHandler();
                    }
                }, function (error) {
                    var errMessage = "Retrieval of EntityIdsAndOTC Failed.";
                    that.handleError(error, errMessage);
                });
            };
            /**
            * Retrieving AppModuleIdUnique for the unmanaged layer of the app
            **/
            AppModuleAppConfig.prototype.getAppModuleIdUniqueForUnpublishedLayer = function () {
                var requestUri = "/api/data/v9.0/appmodules/Microsoft.Dynamics.CRM.RetrieveUnpublishedMultiple?$select=appmoduleidunique&$filter=appmoduleid eq " + this.appId;
                return $.ajax({
                    url: encodeURI(this.utilContext.createCrmUri(requestUri)),
                    type: 'GET',
                    async: true,
                    contentType: "application/json",
                    dataType: "json",
                });
            };
            /**
            * The function returns a promise with entitybase records
            **/
            AppModuleAppConfig.prototype.getEntityIdsObjectTypeCodes = function () {
                var requestUri = "/api/data/v9.0/EntityDefinitions?$select=MetadataId,ObjectTypeCode,LogicalName,DisplayName&$filter=IsCustomizable/Value eq true";
                return $.ajax({
                    url: encodeURI(this.utilContext.createCrmUri(requestUri)),
                    type: 'GET',
                    async: true,
                    contentType: "application/json",
                    dataType: "json",
                });
            };
            /**
            * The function returns the collection of records ids which subset need to be shown on systemview/systemform/BPF customization grid
            **/
            AppModuleAppConfig.prototype.getAppModuleRecords = function () {
                var fetchXML = "?fetchXml=<fetch version=\"1.0\" mapping=\"logical\" distinct=\"true\">\n\t\t\t\t\t<entity name=\"appmodulecomponent\">\n\t\t\t\t\t<attribute name=\"objectid\" />\n\t\t\t\t\t<attribute name=\"componenttype\" />\n\t\t\t\t\t<filter type=\"and\">\n\t\t\t\t\t\t<condition attribute=\"appmoduleidunique\" operator=\"eq\" value=\"" + this.appUniqueIdUnpublished + "\"/>\n\t\t\t\t\t</filter>\n\t\t\t\t\t<filter type=\"or\">\n\t\t\t\t\t\t<condition attribute=\"componenttype\" operator=\"eq\" value=\"" + AppCommon.AppConfigConstants.ENTITY_COMPONENTTYPE + "\"/>\n\t\t\t\t\t\t<condition attribute=\"componenttype\" operator=\"eq\" value=\"" + this.targetComponentType + "\"/>\n\t\t\t\t\t</filter>\n\t\t\t\t\t</entity>\n\t\t\t\t</fetch>";
                return $.ajax({
                    url: encodeURI(this.utilContext.createCrmUri("/api/data/v9.0/appmodulecomponents" + fetchXML)),
                    type: 'GET',
                    async: true,
                    contentType: "application/json",
                    dataType: "json",
                });
            };
            /**
            * The function returns the collection of components which cannot be customized
            **/
            AppModuleAppConfig.prototype.getNonCustomizableComponentsFromAppConfig = function () {
                var fetchXML = "?fetchXml=<fetch version=\"1.0\" mapping=\"logical\" distinct=\"true\">\n\t\t\t\t\t <entity name=\"appconfiginstance\">\n\t\t\t\t\t <attribute name=\"objectid\" />\n\t\t\t\t\t <link-entity name=\"appconfig\" to=\"appconfigid\" from=\"appconfigid\" link-type=\"inner\" >\n\t\t\t\t\t\t <filter type=\"and\">\n\t\t\t\t\t\t\t <condition attribute=\"appmoduleid\" operator=\"eq\" value=\"" + this.appId + "\"/>\n\t\t\t\t\t\t </filter >\n\t\t\t\t\t </link-entity>\n\t\t\t\t\t <filter type=\"and\">\n\t\t\t\t\t <condition attribute=\"componenttype\" operator=\"eq\" value=\"" + this.targetComponentType + "\"/>\n\t\t\t\t\t <condition attribute=\"value\" operator=\"eq\" value=\"false\" />\n\t\t\t\t\t <condition attribute=\"appconfigmasterid\" operator=\"eq\" value=\"" + AppCommon.AppConfigConstants.CANBECUSTOMIZED_APPCONFIGMASTERID + "\"/> </filter>\n\t\t\t\t\t </entity>\n\t\t\t\t </fetch>";
                return $.ajax({
                    url: encodeURI(this.utilContext.createCrmUri("/api/data/v9.0/appconfiginstances" + fetchXML)),
                    type: 'GET',
                    async: true,
                    contentType: "application/json",
                    dataType: "json",
                });
            };
            /**
            * The function returns the collection of whitelisted entity ids (that can be customized) for app
            **/
            AppModuleAppConfig.prototype.getWhiteListedEntitiesFromAppConfig = function () {
                var fetchXML = "?fetchXml=<fetch version=\"1.0\" mapping=\"logical\" distinct=\"true\">\n\t\t\t\t\t <entity name=\"appconfiginstance\">\n\t\t\t\t\t <attribute name=\"objectid\" />\n\t\t\t\t\t <link-entity name=\"appconfig\" to=\"appconfigid\" from=\"appconfigid\" link-type=\"inner\" >\n\t\t\t\t\t\t <filter type=\"and\">\n\t\t\t\t\t\t\t <condition attribute=\"appmoduleid\" operator=\"eq\" value=\"" + this.appId + "\"/>\n\t\t\t\t\t\t </filter >\n\t\t\t\t\t </link-entity>\n\t\t\t\t\t <filter type=\"and\">\n\t\t\t\t\t <condition attribute=\"componenttype\" operator=\"eq\" value=\"1\"/>\n\t\t\t\t\t <condition attribute=\"value\" operator=\"eq\" value=\"true\" />\n\t\t\t\t\t <condition attribute=\"appconfigmasterid\" operator=\"eq\" value=\"" + AppCommon.AppConfigConstants.CANBECUSTOMIZED_APPCONFIGMASTERID + "\"/> </filter>\n\t\t\t\t\t </entity>\n\t\t\t\t </fetch>";
                return $.ajax({
                    url: encodeURI(this.utilContext.createCrmUri("/api/data/v9.0/appconfiginstances" + fetchXML)),
                    type: 'GET',
                    async: true,
                    contentType: "application/json",
                    dataType: "json",
                });
            };
            /**
            * The function returns the parking solution id of the app
            **/
            AppModuleAppConfig.prototype.getParkingSolutionId = function () {
                var fetchXML = "?fetchXml=<fetch version=\"1.0\" mapping=\"logical\" distinct=\"true\">\n\t\t\t\t\t <entity name=\"appconfiginstance\">\n\t\t\t\t\t <attribute name=\"value\" />\n\t\t\t\t\t <link-entity name=\"appconfig\" to=\"appconfigid\" from=\"appconfigid\" link-type=\"inner\" >\n\t\t\t\t\t\t <filter type=\"and\">\n\t\t\t\t\t\t\t <condition attribute=\"appmoduleid\" operator=\"eq\" value=\"" + this.appId + "\"/>\n\t\t\t\t\t\t </filter >\n\t\t\t\t\t </link-entity>\n\t\t\t\t\t <link-entity name=\"solution\" to=\"value\" from=\"solutionid\" link-type=\"inner\"  />\n\t\t\t\t\t <filter type=\"and\">\n\t\t\t\t\t\t<condition attribute=\"appconfigmasterid\" operator=\"eq\" value=\"" + AppCommon.AppConfigConstants.PARKINGSOLUTION_APPCONFIGMASTERID + "\"/> </filter>\n\t\t\t\t\t </entity>\n\t\t\t\t </fetch>";
                return $.ajax({
                    url: encodeURI(this.utilContext.createCrmUri("/api/data/v9.0/appconfiginstances" + fetchXML)),
                    type: 'GET',
                    async: true,
                    contentType: "application/json",
                    dataType: "json",
                });
            };
            /**
            * below functions creates filtering input to be passed in the grid
            **/
            AppModuleAppConfig.prototype.CreateFilteringInputAndCallHandler = function () {
                //Populating Entity OTCs based on entityIds
                this.whiteListedEntityOTCs = new Array();
                for (var _i = 0, _a = this.whiteListedEntityIds; _i < _a.length; _i++) {
                    var item = _a[_i];
                    this.whiteListedEntityOTCs.push(this.mapEntityIdObjectTypeCode[item].OTC);
                }
                // Removing those components which are set non customizable in AppConfigInstance
                for (var _b = 0, _c = this.blackListedComponentIds; _b < _c.length; _b++) {
                    var blackitem = _c[_b];
                    var index = this.appModComponentRecords.indexOf(blackitem, 0);
                    this.appModComponentRecords.splice(index, 1);
                }
                this.createFilteringInput();
                this.callBackForFilteringInput(this.filteringInput);
            };
            AppModuleAppConfig.prototype.createFilteringInput = function () {
                var baseFilterExpression = {
                    filterOperator: AppCommon.AppConfigConstants.LOGICALAND,
                    conditions: this.createBaseFilterConditions()
                };
                var entityFilterExpression = {
                    filterOperator: AppCommon.AppConfigConstants.LOGICALOR,
                    conditions: this.createEntityFilterConditions()
                };
                var instnacesFilterExpression = {
                    filterOperator: AppCommon.AppConfigConstants.LOGICALOR,
                    conditions: this.createInstanceFilterConditions()
                };
                var filterExpression;
                if (entityFilterExpression.conditions.length > 0) {
                    filterExpression = {
                        filterOperator: AppCommon.AppConfigConstants.LOGICALAND,
                        filters: [baseFilterExpression, entityFilterExpression, instnacesFilterExpression]
                    };
                }
                else {
                    filterExpression = {
                        filterOperator: AppCommon.AppConfigConstants.LOGICALAND,
                        filters: [baseFilterExpression, instnacesFilterExpression]
                    };
                }
                this.filteringInput = JSON.stringify(filterExpression);
            };
            /**
            * The function creates BaseFilterCondition for filtering Input
            **/
            AppModuleAppConfig.prototype.createBaseFilterConditions = function () {
                var baseCondAttrName;
                var baseCondAttrValue;
                if (this.targetComponentType == AppCommon.AppConfigConstants.SAVEDQUERY_COMPONENTTYPE) {
                    baseCondAttrName = "querytype";
                    baseCondAttrValue = "0";
                }
                else if (this.targetComponentType == AppCommon.AppConfigConstants.SYSTEMFORM_COMPONENTTYPE) {
                    baseCondAttrName = "formpresentation";
                    baseCondAttrValue = "1";
                }
                else if (this.targetComponentType == AppCommon.AppConfigConstants.BPF_COMPONENTTYPE) {
                    baseCondAttrName = "type";
                    baseCondAttrValue = "1";
                }
                else {
                    throw new Error("Component type support not implemented in the class (AppModuleAppConfig).");
                }
                var conditions = [
                    {
                        attributeName: baseCondAttrName,
                        conditionOperator: AppCommon.AppConfigConstants.OPERATOREQUAL,
                        value: baseCondAttrValue
                    },
                    {
                        attributeName: "iscustomizable",
                        conditionOperator: AppCommon.AppConfigConstants.OPERATOREQUAL,
                        value: "1"
                    }
                ];
                if (this.targetComponentType == AppCommon.AppConfigConstants.SAVEDQUERY_COMPONENTTYPE) {
                    conditions.push({
                        attributeName: "returnedtypecode",
                        conditionOperator: AppCommon.AppConfigConstants.OPERATORNOTEQUAL,
                        value: "0"
                    });
                }
                return conditions;
            };
            /**
            * The funtion creates Entity Filter condition for different Object (view/form/bpf) instances
            **/
            AppModuleAppConfig.prototype.createEntityFilterConditions = function () {
                var instanceCondAttrName;
                switch (this.targetComponentType) {
                    case AppCommon.AppConfigConstants.SAVEDQUERY_COMPONENTTYPE:
                        instanceCondAttrName = AppCommon.AppConfigConstants.SAVEDQUERY_ENTITYNAMEATTRIBUTE;
                        break;
                    case AppCommon.AppConfigConstants.SYSTEMFORM_COMPONENTTYPE:
                        instanceCondAttrName = AppCommon.AppConfigConstants.SYSTEMFORM_ENTITYNAMEATTRIBUTE;
                        break;
                    case AppCommon.AppConfigConstants.BPF_COMPONENTTYPE:
                        instanceCondAttrName = AppCommon.AppConfigConstants.BPF_ENTITYNAMEATTRIBUTE;
                        break;
                    default:
                        this.handleError(new Error("Component type support not implemented in the class (AppModuleAppConfig)"));
                }
                //TODO: change to In Operator from OR conditions once CC support is available
                var conditions = new Array();
                for (var _i = 0, _a = this.whiteListedEntityOTCs; _i < _a.length; _i++) {
                    var item = _a[_i];
                    var condition = new AppFilterCondition(instanceCondAttrName, 0, item);
                    conditions.push(condition);
                }
                return conditions;
            };
            /**
             * The funtion creates Instance Filter condition for different Object (view/form/bpf) instances
             */
            AppModuleAppConfig.prototype.createInstanceFilterConditions = function () {
                var instanceCondAttrName;
                switch (this.targetComponentType) {
                    case AppCommon.AppConfigConstants.SAVEDQUERY_COMPONENTTYPE:
                        instanceCondAttrName = AppCommon.AppConfigConstants.SAVEDQUERY_PRIMARYKEY;
                        break;
                    case AppCommon.AppConfigConstants.SYSTEMFORM_COMPONENTTYPE:
                        instanceCondAttrName = AppCommon.AppConfigConstants.SYSTEMFORM_PRIMARYKEY;
                        break;
                    case AppCommon.AppConfigConstants.BPF_COMPONENTTYPE:
                        instanceCondAttrName = AppCommon.AppConfigConstants.BPF_PRIMARYKEY;
                        break;
                    default:
                        this.handleError(new Error("Component type support not implemented in the class (AppModuleAppConfig)"));
                }
                //TODO: change to In Operator from OR conditions once CC support is available
                var conditions = new Array();
                for (var _i = 0, _a = this.appModComponentRecords; _i < _a.length; _i++) {
                    var item = _a[_i];
                    var condition = new AppFilterCondition(instanceCondAttrName, 0, item);
                    conditions.push(condition);
                }
                return conditions;
            };
            /**
            * This function returns select options for MDD create dialog select box
            **/
            AppModuleAppConfig.prototype.createWhiteListedEntityInput = function () {
                var selectOptions = new Array();
                if (this.whiteListedEntityIds.length > 0) {
                    for (var _i = 0, _a = this.whiteListedEntityIds; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (this.mapEntityIdObjectTypeCode[item] != null) {
                            selectOptions.push(this.mapEntityIdObjectTypeCode[item]);
                        }
                    }
                }
                else {
                    for (var _b = 0, _c = this.appModEntityComponentRecords; _b < _c.length; _b++) {
                        var item = _c[_b];
                        if (this.mapEntityIdObjectTypeCode[item] != null) {
                            selectOptions.push(this.mapEntityIdObjectTypeCode[item]);
                        }
                    }
                }
                return JSON.stringify(selectOptions);
            };
            /**
             * The function handles errors/exceptions
             * @param e
             * @param errMessage
             */
            AppModuleAppConfig.prototype.handleError = function (e, errMessage) {
                console.log("View Grid Error : " + errMessage);
                if (e instanceof Error) {
                    errMessage = e.message;
                    console.log(errMessage);
                }
            };
            /**
            *  To check if the object is null or undefined
            **/
            AppModuleAppConfig.prototype.isNullOrUndefined = function (object) {
                if (object == null || object == undefined) {
                    return true;
                }
                return false;
            };
            /**
             * The function verifies if the given displayname has UserLocalizedLabel defined or not
             * @param item
             */
            AppModuleAppConfig.prototype.validateOptionItem = function (item) {
                if ((item != null && item != undefined) &&
                    (item.DisplayName != null && item.DisplayName != undefined) &&
                    (item.DisplayName.UserLocalizedLabel != null && item.DisplayName.UserLocalizedLabel != undefined) &&
                    (item.DisplayName.UserLocalizedLabel.Label != null && item.DisplayName.UserLocalizedLabel.Label != undefined)) {
                    return true;
                }
                else {
                    return false;
                }
            };
            /**
            * The function creates a POST request promise for given Uri and Data
            **/
            AppModuleAppConfig.prototype.getWebApiPostRequest = function (uri, data) {
                return $.ajax({
                    url: encodeURI(this.utilContext.createCrmUri(uri)),
                    type: AppCommon.AppConfigConstants.HTTPPOST,
                    async: true,
                    contentType: "application/json",
                    dataType: "json",
                    data: data
                });
            };
            return AppModuleAppConfig;
        }());
        AppCommon.AppModuleAppConfig = AppModuleAppConfig;
    })(AppCommon = MscrmControls.AppCommon || (MscrmControls.AppCommon = {}));
})(MscrmControls || (MscrmControls = {}));
