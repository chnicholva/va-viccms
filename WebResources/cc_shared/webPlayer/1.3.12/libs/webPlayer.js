"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var Core;
(function (Core) {
    var Embedding;
    (function (Embedding) {
        var CoreEmbedding = /** @class */ (function () {
            function CoreEmbedding(embeddingOptions, hostWindow) {
                this.embeddingOptions = embeddingOptions;
                this.hostWindow = hostWindow;
                if (!embeddingOptions) {
                    throw new Embedding.EmbeddingError("Options cannot be empty");
                }
                this.embeddingOptions.hostName = this.embeddingOptions.hostName ? this.ensureTrailingSlash(embeddingOptions.hostName) : this.getHostName();
                if (this.embeddingOptions.endpoint && this.embeddingOptions.endpoint === "INT") {
                    this.webplayerPathSegmentToUse = CoreEmbedding.WebplayerCommonPathSegmentForInt;
                }
                else {
                    this.webplayerPathSegmentToUse = CoreEmbedding.WebplayerCommonPathSegment;
                }
                if (this.embeddingOptions.getAccessToken) {
                    if (!hostWindow) {
                        throw new Embedding.EmbeddingError("Host window must be specified when using delegated token authentication");
                    }
                    this.authHandler = this.accessTokenRequestHandler.bind(this);
                    this.hostWindow.addEventListener("message", this.authHandler);
                }
                // extract the domain of the host name
                var match = embeddingOptions.hostName.match(/https:\/\/([a-z0-9\-\.]*[:0-9]*)/i);
                if (!match || match.length < 2) {
                    throw new Embedding.EmbeddingError("Host name is not of the correct format");
                }
                var domain = match[1]; // The domain is the 2nd item in the array of the match
                var subDomainRegExpString = "https:\/\/(?:([^\s\\\/]*)\.)?" + domain; // matches the domain + sub domains
                this.subDomainRegex = new RegExp(subDomainRegExpString, "i"); // ignore case
            }
            // Disposes the object, and thus releases any resource being used
            CoreEmbedding.prototype.dispose = function () {
                if (this.authHandler) {
                    this.hostWindow.removeEventListener("message", this.authHandler);
                    this.authHandler = undefined;
                }
            };
            // Handles access token request
            CoreEmbedding.prototype.accessTokenRequestHandler = function (event) {
                if (!this.validateMessageOrigin(event)) {
                    return;
                }
                var input = event.data;
                if (input && input.api !== undefined) {
                    switch (input.api) {
                        case Embedding.RuntimeToSdkApi.GetAccessToken:
                            var getAccessTokenInput = event.data;
                            var response_1 = {
                                id: getAccessTokenInput.id,
                                api: getAccessTokenInput.api,
                                success: false,
                                accessToken: null,
                                errorMessage: null,
                                parentRequestId: ""
                            };
                            var successCallback = function (token, parentRequestId) {
                                if (parentRequestId === void 0) { parentRequestId = ""; }
                                response_1.success = true;
                                response_1.accessToken = token;
                                response_1.parentRequestId = parentRequestId;
                                if (event.source) {
                                    event.source.postMessage(response_1, event.origin);
                                }
                            };
                            var errorCallback = function (errorMessage, parentRequestId) {
                                if (parentRequestId === void 0) { parentRequestId = ""; }
                                response_1.success = false;
                                response_1.errorMessage = errorMessage;
                                response_1.parentRequestId = parentRequestId;
                                if (event.source) {
                                    event.source.postMessage(response_1, event.origin);
                                }
                            };
                            this.embeddingOptions.getAccessToken(getAccessTokenInput.audience, successCallback, errorCallback, getAccessTokenInput.clientRequestId);
                            break;
                        default:
                            // Invalid API.
                            break;
                    }
                }
            };
            CoreEmbedding.prototype.ensureTrailingSlash = function (url) {
                if (url.charAt(url.length - 1) !== "/") {
                    return url + "/";
                }
                return url;
            };
            CoreEmbedding.prototype.validateMessageOrigin = function (event) {
                var isInWhiteList = false;
                CoreEmbedding.HostNameWhiteList.forEach(function (domain) {
                    if (event.origin === domain) {
                        isInWhiteList = true;
                    }
                });
                return isInWhiteList || !!this.subDomainRegex.exec(event.origin);
            };
            CoreEmbedding.prototype.getHostName = function () {
                var endpoint;
                switch (this.embeddingOptions.endpoint) {
                    case Embedding.Endpoint.PROD:
                        endpoint = "https://web.powerapps.com/";
                        break;
                    case Embedding.Endpoint.INT:
                        endpoint = "https://tip1.web.powerapps.com/";
                        break;
                    case Embedding.Endpoint.TEST:
                        endpoint = "https://tip1.web.powerapps.com/";
                        break;
                    case Embedding.Endpoint.DEV:
                        endpoint = "https://webplayer-test.cloudapp.net:44390/";
                        break;
                    default:
                        endpoint = "https://web.powerapps.com/";
                        break;
                }
                return endpoint;
            };
            CoreEmbedding.prototype.constructBaseUrl = function (pathSegment) {
                var url = this.embeddingOptions.hostName + this.webplayerPathSegmentToUse + "/" + pathSegment;
                var params = [];
                if (this.embeddingOptions.source) {
                    params.push("source=" + this.embeddingOptions.source);
                }
                if (this.embeddingOptions.locale) {
                    params.push("locale=" + this.embeddingOptions.locale);
                }
                if (this.embeddingOptions.externalCorrelationId) {
                    params.push("correlationId=" + encodeURIComponent(this.embeddingOptions.externalCorrelationId));
                }
                if (this.embeddingOptions.enableOnBehalfOf) {
                    params.push("enableOnBehalfOf=true");
                }
                var queryString = params.join("&");
                if (!!queryString) {
                    return url + "?" + queryString;
                }
                else {
                    return url;
                }
            };
            CoreEmbedding.WebplayerCommonPathSegment = "webplayer";
            CoreEmbedding.WebplayerCommonPathSegmentForInt = "webplayer-int";
            CoreEmbedding.HostNameWhiteList = [
                "https://apps.powerapps.com",
                "https://apps.preview.powerapps.com",
                "https://apps.preprod.powerapps.com",
                "https://apps.int.powerapps.com",
                "https://apps.test.powerapps.com",
                "https://apps.dev.powerapps.com",
                "https://apps.local.powerapps.com:44328"
            ];
            return CoreEmbedding;
        }());
        Embedding.CoreEmbedding = CoreEmbedding;
    })(Embedding = Core.Embedding || (Core.Embedding = {}));
})(Core || (Core = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var Core;
(function (Core) {
    var Embedding;
    (function (Embedding) {
        // Different endpoint switches to configure the hostname
        var Endpoint;
        (function (Endpoint) {
            Endpoint["DEV"] = "DEV";
            Endpoint["TEST"] = "TEST";
            Endpoint["PROD"] = "PROD";
            Endpoint["INT"] = "INT";
        })(Endpoint = Embedding.Endpoint || (Embedding.Endpoint = {}));
        // DO NOT CHANGE
        // Changing these values will cause a breaking change.
        // If you need to add values, add them at end and be sure to
        // set a fixed numerical value.
        /** @internal */
        var RuntimeToSdkApi;
        (function (RuntimeToSdkApi) {
            RuntimeToSdkApi[RuntimeToSdkApi["GetAccessToken"] = 0] = "GetAccessToken";
            // Don't allocate any number without making sure that it doesn't conflict in derived SDKs
        })(RuntimeToSdkApi = Embedding.RuntimeToSdkApi || (Embedding.RuntimeToSdkApi = {}));
        /** @internal */
        function isRuntimeToSdkRequest(request) {
            return typeof request === "object" &&
                typeof request.api === "number" &&
                (typeof request.id === "string" || typeof request.id === "undefined");
        }
        Embedding.isRuntimeToSdkRequest = isRuntimeToSdkRequest;
        var EmbeddingError = /** @class */ (function (_super) {
            __extends(EmbeddingError, _super);
            function EmbeddingError(message) {
                return _super.call(this, message) || this;
            }
            return EmbeddingError;
        }(Error));
        Embedding.EmbeddingError = EmbeddingError;
        // Represents different uber kinds of data that can be supplied from an embedded context
        var DataKind;
        (function (DataKind) {
            DataKind["Table"] = "Table";
            DataKind["Record"] = "Record";
        })(DataKind = Embedding.DataKind || (Embedding.DataKind = {}));
        var DataType;
        (function (DataType) {
            DataType["String"] = "s";
            DataType["Number"] = "n";
            DataType["Boolean"] = "b";
            DataType["Date"] = "d";
            DataType["DateTime"] = "D";
        })(DataType = Embedding.DataType || (Embedding.DataType = {}));
    })(Embedding = Core.Embedding || (Core.Embedding = {}));
})(Core || (Core = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var WebPlayer;
(function (WebPlayer) {
    var Sdk;
    (function (Sdk) {
        // DO NOT CHANGE
        // Changing these values will cause a breaking change.
        // If you need to add values, add them at end and be sure to
        // set a fixed numerical value.
        /** @internal */
        var PowerAppsEmbeddingCallbackApi;
        (function (PowerAppsEmbeddingCallbackApi) {
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["GetAccessToken"] = 0] = "GetAccessToken";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["AppLoaded"] = 1] = "AppLoaded";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["AppClosed"] = 2] = "AppClosed";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["AppFailed"] = 3] = "AppFailed";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["RequestHide"] = 4] = "RequestHide";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["EnableSave"] = 5] = "EnableSave";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["NewItem"] = 6] = "NewItem";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["EditItem"] = 7] = "EditItem";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["ViewItem"] = 8] = "ViewItem";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["SaveItem"] = 9] = "SaveItem";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["CancelEditItem"] = 10] = "CancelEditItem";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["SetProperty"] = 20] = "SetProperty";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["VisibilityChanged"] = 21] = "VisibilityChanged";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["ReadyToHandleMessages"] = 22] = "ReadyToHandleMessages";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["InteractionRequired"] = 23] = "InteractionRequired";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["SendTrigger"] = 30] = "SendTrigger";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["SendTelemetryEvent"] = 40] = "SendTelemetryEvent";
            PowerAppsEmbeddingCallbackApi[PowerAppsEmbeddingCallbackApi["Log"] = 41] = "Log";
        })(PowerAppsEmbeddingCallbackApi = Sdk.PowerAppsEmbeddingCallbackApi || (Sdk.PowerAppsEmbeddingCallbackApi = {}));
        /** @internal */
        function isAppToHostFunctionsEventCallBackParams(params) {
            return typeof params.requestParameters.url === "string" &&
                typeof params.requestParameters.method === "string" &&
                (!params.requestParameters.headers || typeof params.requestParameters.headers === "object") &&
                (!params.requestParameters.retryable || typeof params.requestParameters.retryable === "object") &&
                (!params.requestParameters.bodyData || typeof params.requestParameters.bodyData === "string") &&
                Core.Embedding.isRuntimeToSdkRequest(params);
        }
        Sdk.isAppToHostFunctionsEventCallBackParams = isAppToHostFunctionsEventCallBackParams;
        /** @internal */
        function isAppToHostTelemetryEventCallBackParams(params) {
            return typeof params.message === "string" &&
                params.message !== "" &&
                params.message !== null &&
                (params.data === null || typeof params.data === "object") &&
                Core.Embedding.isRuntimeToSdkRequest(params);
        }
        Sdk.isAppToHostTelemetryEventCallBackParams = isAppToHostTelemetryEventCallBackParams;
    })(Sdk = WebPlayer.Sdk || (WebPlayer.Sdk = {}));
})(WebPlayer || (WebPlayer = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var WebPlayer;
(function (WebPlayer) {
    var Sdk;
    (function (Sdk) {
        var IframeDimensions = /** @class */ (function () {
            function IframeDimensions() {
            }
            return IframeDimensions;
        }());
        /* Embed a power app */
        var PowerAppsEmbedding = /** @class */ (function (_super) {
            __extends(PowerAppsEmbedding, _super);
            function PowerAppsEmbedding(options, hostWindow) {
                var _this = _super.call(this, options, hostWindow || window) || this;
                _this.sdkVersion = "1.3.12";
                _this.appIdConst = "/providers/Microsoft.PowerApps/apps/";
                _this.eventListeners = {};
                _this.params = "";
                if (!options.appId) {
                    throw new Sdk.PowerAppsEmbeddingError("App Id cannot be empty");
                }
                else if (options.appId.indexOf(_this.appIdConst) === -1) {
                    // check if /providers/Microsoft.PowerApps/apps/ is at the front to be more resilient to other inputs
                    options.appId = _this.appIdConst + options.appId;
                }
                if (!options.containerId) {
                    throw new Sdk.PowerAppsEmbeddingError("Container id cannot be empty");
                }
                _this.containerElement = document.getElementById(options.containerId);
                if (!_this.containerElement) {
                    throw new Sdk.PowerAppsEmbeddingError("Container div does not exist");
                }
                _this.options = options;
                _this._onMessageReceived = _this._onMessageReceived.bind(_this);
                _this.queuedCdpData = [];
                return _this;
            }
            /**
             *  @param itemId The id value of the item being sent.
             *  @param promise This promise resolves when your call is finished. Important: Caller must return same object type for both success and reject. Just modify the status
             */
            PowerAppsEmbedding.prototype.sendCdpData = function (itemId, promise) {
                if (!promise) {
                    return;
                }
                var cdpData = {
                    itemId: itemId,
                    promise: promise
                };
                if (!this.sdkOrchestrator) {
                    this.queuedCdpData.push(cdpData);
                    return;
                }
                this._sendCdpData(cdpData);
            };
            /**
             * Executes an action in the embedded app. This is used by Sharepoint forms integration.
             * This can only be called after the load event is fired.
             *
             * Available actions:
             *  - new : Create a new record in the current list. Does not require options.
             *  - edit : Edit an existing record in the current list. Requires itemId in options.
             *  - view : View an existing record in the current list. Requires itemId in options.
             *  - save : Save the currently selected record. Does not require options.
             *  - cancel : Cancel editing/creating the current record. This resets the form. Does not require options.
             *  - log : Log data with a correlate parentRequestId. Requires options in the form of a single depth object.
             *
             * @example
             * var powerAppsEmbedding = new WebPlayer.Sdk.PowerAppsEmbedding(options);
             * powerAppsEmbedding.addEventListener("load", function () {
             *     powerAppsEmbedding.executeAction("edit", { itemId: "5" });
             * });
             * powerAppsEmbedding.renderApp();
             *
             * @param action A string representing the action to execute
             * @param options An object with the options the action requires to execute
             */
            PowerAppsEmbedding.prototype.executeAction = function (action, options) {
                if (options === void 0) { options = {}; }
                if (!this.iframe) {
                    throw new Error("renderApp must be called before executeAction");
                }
                var itemId = options && options.itemId;
                var params;
                switch (action) {
                    case "new":
                        params = { api: Sdk.PowerAppsEmbeddingCallbackApi.NewItem };
                        break;
                    case "edit":
                        if (!itemId) {
                            throw new TypeError("options must contain itemId");
                        }
                        params = {
                            api: Sdk.PowerAppsEmbeddingCallbackApi.EditItem,
                            itemId: itemId
                        };
                        break;
                    case "view":
                        if (!itemId) {
                            throw new TypeError("options must contain itemId");
                        }
                        params = {
                            api: Sdk.PowerAppsEmbeddingCallbackApi.ViewItem,
                            itemId: itemId
                        };
                        break;
                    case "save":
                        params = { api: Sdk.PowerAppsEmbeddingCallbackApi.SaveItem };
                        break;
                    case "cancel":
                        params = { api: Sdk.PowerAppsEmbeddingCallbackApi.CancelEditItem };
                        break;
                    case "set-data":
                        params = {
                            api: Sdk.PowerAppsEmbeddingCallbackApi.SetProperty,
                            hostType: "dynamic",
                            propertyName: "Data",
                            value: options.data
                        };
                        break;
                    case "log":
                        if (!options && !options.parentRequestId) {
                            throw new TypeError("data must contain parentRequestId");
                        }
                        params = {
                            api: Sdk.PowerAppsEmbeddingCallbackApi.Log,
                            data: options
                        };
                        break;
                    default:
                        throw new RangeError("Invalid action");
                }
                // Send the message to the app host
                this.iframe.contentWindow.postMessage(params, "*");
            };
            PowerAppsEmbedding.prototype._constructUrl = function () {
                var webPlayerAppSegment = "iframeapp";
                if (this.options.getAccessToken) {
                    webPlayerAppSegment = "embedapp";
                }
                var url = this.constructBaseUrl(webPlayerAppSegment);
                // only add an & if there is an existing query
                if (url.indexOf("?") !== -1) {
                    url += "&";
                }
                else {
                    url += "?";
                }
                url += "appId=" + encodeURIComponent(this.options.appId) + "&embed=true&hideNavBar=true";
                if (this.options.appInfo && this.options.appInfo.properties && this.options.appInfo.properties.backgroundColor) {
                    url += "&screenColor=" + encodeURIComponent(this.options.appInfo.properties.backgroundColor);
                }
                else if (this.options.splashScreenCssColor) {
                    url += "&screenColor=" + encodeURIComponent(this.options.splashScreenCssColor);
                }
                if (this.options.hideAppSplashScreen) {
                    url += "&hideAppSplash=true";
                }
                if (this.options.packagePropertiesJson) {
                    url += "&packageProperties=" + encodeURIComponent(this.options.packagePropertiesJson);
                }
                if (this.options.cachedFilesJson) {
                    url += "&skipIframeCreation=true";
                }
                url += "&sdkVersion=" + this.sdkVersion;
                url += "&iframeContainerId=" + this.options.containerId;
                if (this.options.locale) {
                    url += "&locale=" + this.options.locale;
                }
                if (this.options.parameters) {
                    for (var paramKey in this.options.parameters) {
                        if (this.options.parameters.hasOwnProperty(paramKey)) {
                            this.params += "&" + paramKey + "=" + encodeURIComponent(this.options.parameters[paramKey]);
                        }
                    }
                    url += this.params;
                }
                if (this.options.useIntegrationEnvironment) {
                    url += "&overrideEnvironment=Tip1&overridePackager=Int";
                }
                return url;
            };
            PowerAppsEmbedding.prototype._generateIframeSize = function () {
                if (this.options.appInfo && this.options.appInfo.tags && this.options.appInfo.tags.primaryDeviceWidth && this.options.appInfo.tags.primaryDeviceHeight) {
                    var aspectRatio = this.options.appInfo.tags.primaryDeviceHeight / this.options.appInfo.tags.primaryDeviceWidth;
                    if (aspectRatio > 0) {
                        // Aspect ratio is a valid value
                        if (this.options.maxWidth) {
                            // Max width is set
                            var width = parseInt(this.options.maxWidth, 10);
                            var height = width * aspectRatio;
                            if (this.options.maxHeight) {
                                // max height is set
                                var maxHeight = parseInt(this.options.maxHeight, 10);
                                if (height > maxHeight) {
                                    // the height we calculated is greater than max height so we need to calculate the width based on the height
                                    width = maxHeight / aspectRatio;
                                    height = maxHeight;
                                }
                            }
                            return {
                                width: width + "px",
                                height: height + "px"
                            };
                        }
                        else {
                            // Max width is not set
                            if (this.options.maxHeight) {
                                // Max height is set so calculate width based on that
                                var height = parseInt(this.options.maxHeight, 10);
                                var width = height / aspectRatio;
                                return {
                                    width: width + "px",
                                    height: height + "px"
                                };
                            }
                            else {
                                // Max height is also not set
                                if (aspectRatio > 1) {
                                    // Height > width
                                    var width = 100 / aspectRatio;
                                    return {
                                        height: "100%",
                                        width: width + "%"
                                    };
                                }
                                else {
                                    // width > height
                                    var height = 100 * aspectRatio;
                                    return {
                                        width: "100%",
                                        height: height + "%"
                                    };
                                }
                            }
                        }
                    }
                    else {
                        // Got a weird number for the aspect ratio so treating as if there is no aspect ratio
                        console.log("Aspect ratio is: " + aspectRatio);
                        return this._generateIframeSizeWithNoAspectRatio();
                    }
                }
                else {
                    // we don't have the data to determine the aspect ratio
                    return this._generateIframeSizeWithNoAspectRatio();
                }
            };
            PowerAppsEmbedding.prototype._generateIframeSizeWithNoAspectRatio = function () {
                var height;
                var width;
                if (this.options.maxWidth) {
                    // max width is set so force the width to be that
                    width = parseInt(this.options.maxWidth, 10) + "px";
                }
                else {
                    // Set to to fill 100% of container div
                    width = "100%";
                }
                if (this.options.maxHeight) {
                    // max width is set so force the width to be that
                    height = parseInt(this.options.maxHeight, 10) + "px";
                }
                else {
                    // Set to to fill 100% of container div
                    height = "100%";
                }
                return {
                    width: width,
                    height: height
                };
            };
            // This is used by our test page as we have to be able to support webplayer-int paths
            PowerAppsEmbedding.prototype.overrideWebPlayerPathSegment = function (pathSegment) {
                this.webplayerPathSegmentToUse = pathSegment;
            };
            PowerAppsEmbedding.prototype._fetchSDKMetadataAndLoad = function () {
                var url = this.options.hostName + this.webplayerPathSegmentToUse + "/SDKMetadata";
                var injectSDKOrchestratorScript = this._injectSDKOrchestratorScriptAndRenderApp.bind(this);
                var renderAppWithoutSdkOrchestrator = this._renderWebPlayerApp.bind(this);
                var renderAppWithSdkOrchestrator = this._renderAppWithSdkOrchestrator.bind(this);
                var request = new XMLHttpRequest();
                request.onload = function () {
                    var notRendered = true;
                    if (this.status === 200) {
                        var metadataString = request.responseText;
                        try {
                            var parsedMetadata = JSON.parse(metadataString);
                            if (parsedMetadata.defaultPublishedAppUrlTemplate && parsedMetadata.orchestratorScriptLocation) {
                                if (typeof WebPlayerSDKOrchestrator !== "undefined") {
                                    // script has already been injected
                                    notRendered = false;
                                    renderAppWithSdkOrchestrator(parsedMetadata);
                                }
                                else {
                                    notRendered = false;
                                    injectSDKOrchestratorScript(parsedMetadata, parsedMetadata.orchestratorScriptLocation);
                                }
                            }
                        }
                        catch (error) {
                        }
                    }
                    if (notRendered) {
                        renderAppWithoutSdkOrchestrator();
                    }
                };
                request.onerror = function () {
                    renderAppWithoutSdkOrchestrator();
                };
                request.open("GET", url);
                request.send();
            };
            PowerAppsEmbedding.prototype._injectSDKOrchestratorScriptAndRenderApp = function (sdkMetadata, orchestratorScriptLocation) {
                // Create a Script tag.
                var scriptTag = document.createElement("SCRIPT");
                scriptTag.setAttribute("crossorigin", "anonymous");
                scriptTag.type = "text/javascript";
                scriptTag.async = false; // Disabling async for modern browsers to ensure that the scripts load in the correct order.
                var renderAppWithoutSdkOrchestrator = this._renderWebPlayerApp.bind(this);
                var renderAppWithSdkOrchestrator = this._renderAppWithSdkOrchestrator.bind(this);
                scriptTag.addEventListener("error", function (ev) {
                    renderAppWithoutSdkOrchestrator();
                });
                scriptTag.addEventListener("load", function (ev) {
                    renderAppWithSdkOrchestrator(sdkMetadata);
                });
                document.head.appendChild(scriptTag);
                // Setting the Script "src" property should happen after appending the element to the DOM, otherwise the "load" event is not going to fire correctly.
                scriptTag.src = orchestratorScriptLocation;
            };
            PowerAppsEmbedding.prototype._renderAppWithSdkOrchestrator = function (sdkMetadata) {
                var _this = this;
                window.addEventListener("message", this._onMessageReceived);
                var iframeDimensions = this._generateIframeSize();
                this.sdkOrchestrator = new WebPlayerSDKOrchestrator.SDKOrchestrator(this.containerElement, this._constructUrl(), sdkMetadata, this.options.cachedFilesJson, iframeDimensions.width, iframeDimensions.height, this.options.appId, this.options.packagePropertiesJson, this.params);
                var sdkOrchestratorIframes = this.sdkOrchestrator.setupIframes();
                this.iframe = sdkOrchestratorIframes.hostIframe;
                this.queuedCdpData.forEach(function (cdpData) {
                    _this._sendCdpData(cdpData);
                });
                this.queuedCdpData = [];
            };
            PowerAppsEmbedding.prototype._sendCdpData = function (cdpData) {
                this.sdkOrchestrator.sendCdpData(cdpData, this.options.overrideSendCdpDataApiEnabled);
            };
            PowerAppsEmbedding.prototype._renderWebPlayerApp = function () {
                var _this = this;
                window.addEventListener("message", this._onMessageReceived);
                this.options.cachedFilesJson = null; // clear cached file json if any
                var url = this._constructUrl();
                this.iframe = document.createElement("iframe");
                this.iframe.name = "webPlayer-iFrame";
                this.iframe.src = url;
                this.iframe.scrolling = "no";
                this.iframe.setAttribute("allow", "geolocation *; microphone *; camera *");
                if (!navigator.userAgent.match('Edge')) {
                    // only add the sandboxing attribute on non Edge browsers.
                    // This is because Edge prevents the pop ups of the disambiguation dialog if the sandboxing attribute is present.
                    var sandboxProps = ["allow-popups", "allow-popups-to-escape-sandbox", "allow-same-origin", "allow-scripts", "allow-forms", "allow-orientation-lock"];
                    if (this.iframe.sandbox && this.iframe.sandbox.add) {
                        sandboxProps.forEach(function (prop) { return _this.iframe.sandbox.add(prop); });
                    }
                    else {
                        this.iframe.setAttribute("sandbox", sandboxProps.join(" "));
                    }
                }
                var iframeDimensions = this._generateIframeSize();
                this.iframe.width = iframeDimensions.width;
                this.iframe.height = iframeDimensions.height;
                // set box-sizing to border-box so it doesn't bleed outside container
                this.iframe.style.boxSizing = "border-box";
                // remove border
                this.iframe.style.border = "none";
                this.containerElement.appendChild(this.iframe);
                if (this.options.perceivedNodeQuerySelector) {
                    this.preceivedNodeToWatch = document.querySelector(this.options.perceivedNodeQuerySelector);
                    this._trackEmbeddedPlayerVisibility();
                }
            };
            /* Creates an iframe for the app */
            PowerAppsEmbedding.prototype.renderApp = function () {
                if (this.options.cachedFilesJson && !this.sdkOrchestrator) {
                    this._fetchSDKMetadataAndLoad();
                }
                else if (!this.iframe && !this.options.cachedFilesJson) {
                    this._renderWebPlayerApp();
                }
            };
            PowerAppsEmbedding.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                if (this.iframe && !this.sdkOrchestrator) {
                    this.containerElement.removeChild(this.iframe);
                    this.iframe = null;
                }
                if (this.sdkOrchestrator) {
                    this.sdkOrchestrator.dispose();
                }
                this.eventListeners = {};
                window.removeEventListener("message", this._onMessageReceived);
            };
            /**
             * Listen to events on the app. Events support multiple listeners. Available events:
             *  - load : Fired when app is sucessfully loaded.
             *  - unload: Fired when the app is closed. This can happen before load is fired.
             *            It happens when user does not agree to consent dialog or when the app calls Exit().
             *  - error: Fired when the app does not load due to an error.
             *  - requestHide: Fired when the app requests the embedder to be hidden, such as when a call to executeAction("save") completes.
             *  - enableSave: For an embedded form, fired when form validation determines the Save button can be enabled by the embedder.
             *  - sendTrigger: Fired when the app transmits information to the host in order to trigger an action
             *
             * @param eventName The name of the event to listen to
             * @param listener A function to call when the event is fired
             */
            PowerAppsEmbedding.prototype.addEventListener = function (eventName, listener) {
                if (typeof listener !== "function") {
                    throw new TypeError("Event listener must be a function");
                }
                if (this.eventListeners.hasOwnProperty(eventName)) {
                    this.eventListeners[eventName].push(listener);
                }
                else {
                    this.eventListeners[eventName] = [listener];
                }
            };
            /**
             * Removes a listener for an event. The function passed must be the exact same function passed to addEventListener.
             *
             * @example <caption>Wrong usage</caption>
             * powerAppsEmbedding.addEventListener("load", onload.bind(this));
             * powerAppsEmbedding.removeEventListener("load", onload.bind(this));
             *
             * @example <caption>Correct usage</caption>
             * var onloadHandler = onload.bind(this);
             * powerAppsEmbedding.addEventListener("load", onloadHandler);
             * powerAppsEmbedding.removeEventListener("load", onloadHandler);
             *
             * @param eventName Name of the event on which you want to remove the listener
             * @param listener Function to be removed as the listener. Must be the exact same function passed to addEventListener
             */
            PowerAppsEmbedding.prototype.removeEventListener = function (eventName, listener) {
                if (this.eventListeners.hasOwnProperty(eventName)) {
                    var index = this.eventListeners[eventName].indexOf(listener);
                    if (index !== -1) {
                        this.eventListeners[eventName].splice(index, 1);
                    }
                }
            };
            PowerAppsEmbedding.prototype._fireEvent = function (eventName, appId, containerId, data) {
                if (this.eventListeners.hasOwnProperty(eventName)) {
                    var fullAppId_1 = appId;
                    appId = fullAppId_1.substring(fullAppId_1.lastIndexOf("/") + 1);
                    this.eventListeners[eventName].forEach(function (e) { return e(appId, fullAppId_1, containerId, data); });
                }
            };
            PowerAppsEmbedding.prototype._onMessageReceived = function (e) {
                if (!this.validateMessageOrigin(e)) {
                    return;
                }
                var input = e.data;
                if (input && input.api !== undefined) {
                    var eventName = "";
                    switch (input.api) {
                        case Sdk.PowerAppsEmbeddingCallbackApi.AppLoaded:
                            eventName = "load";
                            break;
                        case Sdk.PowerAppsEmbeddingCallbackApi.AppClosed:
                            eventName = "unload";
                            break;
                        case Sdk.PowerAppsEmbeddingCallbackApi.AppFailed:
                            eventName = "error";
                            break;
                        case Sdk.PowerAppsEmbeddingCallbackApi.EnableSave:
                            eventName = "enableSave";
                            break;
                        case Sdk.PowerAppsEmbeddingCallbackApi.RequestHide:
                            eventName = "requestHide";
                            break;
                        case Sdk.PowerAppsEmbeddingCallbackApi.SendTrigger:
                            if (Sdk.isAppToHostFunctionsEventCallBackParams(input)) {
                                eventName = "sendTrigger";
                            }
                            break;
                        case Sdk.PowerAppsEmbeddingCallbackApi.ReadyToHandleMessages:
                            if (this.preceivedNodeToWatch) { // only report if we have a mutation observer in place
                                this._reportEmbeddedPlayerVisibility();
                            }
                            return;
                        case Sdk.PowerAppsEmbeddingCallbackApi.SendTelemetryEvent:
                            if (Sdk.isAppToHostTelemetryEventCallBackParams(input)) {
                                eventName = "telemetry";
                            }
                            break;
                        case Sdk.PowerAppsEmbeddingCallbackApi.InteractionRequired:
                            eventName = "interactionRequired";
                            break;
                        default:
                            // Invalid API.
                            break;
                    }
                    if (eventName
                        && (!input.appId || input.appId.toLowerCase() === this.options.appId.toLowerCase())
                        && (!input.containerId || input.containerId === this.options.containerId)) {
                        this._fireEvent(eventName, input.appId, input.containerId, input);
                    }
                }
            };
            PowerAppsEmbedding.prototype._trackEmbeddedPlayerVisibility = function () {
                var _this = this;
                if (typeof MutationObserver === "undefined") {
                    return;
                }
                var mutationObserver = new MutationObserver(function (changed, observer) {
                    var ancestorOrSelfChanged = changed.some(function (change) { return [_this.containerElement, _this.iframe].some(function (target) { return change.target.contains(target) || change.target === target; }); });
                    if (!ancestorOrSelfChanged) {
                        return;
                    }
                    _this._reportEmbeddedPlayerVisibility(observer);
                });
                mutationObserver.observe(this.preceivedNodeToWatch, {
                    attributes: true,
                    subtree: false
                });
            };
            PowerAppsEmbedding.prototype._reportEmbeddedPlayerVisibility = function (observer) {
                var isPlayerVisible = PowerAppsEmbedding._isElementOnScreen(this.iframe);
                if (this.isPlayerVisible !== isPlayerVisible && this.iframe) {
                    this.isPlayerVisible = isPlayerVisible;
                    this.iframe.contentWindow.postMessage({
                        api: Sdk.PowerAppsEmbeddingCallbackApi.VisibilityChanged,
                        visible: this.isPlayerVisible
                    }, "*");
                    if (observer) {
                        observer.disconnect();
                    }
                }
            };
            PowerAppsEmbedding._isElementOnScreen = function (element) {
                if (element) {
                    var containsRect = function (container, rect) {
                        return container.top <= rect.top
                            && container.bottom >= rect.bottom
                            && container.left <= rect.left
                            && container.right >= rect.right;
                    };
                    var hasDimensions = element.offsetWidth + element.offsetHeight;
                    var isCssVisible = ["hidden", "collapsed"].indexOf(getComputedStyle(element).visibility) === -1;
                    var isDisplayedOnScreen = containsRect(document.body.getBoundingClientRect(), element.getBoundingClientRect());
                    return !!hasDimensions && isCssVisible && isDisplayedOnScreen;
                }
                return false;
            };
            return PowerAppsEmbedding;
        }(Core.Embedding.CoreEmbedding));
        Sdk.PowerAppsEmbedding = PowerAppsEmbedding;
    })(Sdk = WebPlayer.Sdk || (WebPlayer.Sdk = {}));
})(WebPlayer || (WebPlayer = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var WebPlayer;
(function (WebPlayer) {
    var Sdk;
    (function (Sdk) {
        var PowerAppsEmbeddingError = /** @class */ (function (_super) {
            __extends(PowerAppsEmbeddingError, _super);
            function PowerAppsEmbeddingError() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return PowerAppsEmbeddingError;
        }(Error));
        Sdk.PowerAppsEmbeddingError = PowerAppsEmbeddingError;
    })(Sdk = WebPlayer.Sdk || (WebPlayer.Sdk = {}));
})(WebPlayer || (WebPlayer = {}));
//# sourceMappingURL=../../../../../obj/Assets/js/WebPlayer.Sdk/index.js.map