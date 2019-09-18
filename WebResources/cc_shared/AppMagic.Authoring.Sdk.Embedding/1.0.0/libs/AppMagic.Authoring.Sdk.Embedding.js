// v 1.0.0
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
                // TODO: this  if/else can be deleted when SF conversion is completed.
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
                var isInAllowList = false;
                CoreEmbedding.HostNameAllowList.forEach(function (domain) {
                    if (event.origin === domain) {
                        isInAllowList = true;
                    }
                });
                return isInAllowList || !!this.subDomainRegex.exec(event.origin);
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
                return this.appendCoreEmbeddingParams(url);
            };
            // TODO: test this, and the above
            CoreEmbedding.prototype.appendCoreEmbeddingParams = function (url) {
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
                    // only add an & if there is an existing query
                    if (url.indexOf("?") !== -1) {
                        return url + "&" + queryString;
                    }
                    else {
                        return url + "?" + queryString;
                    }
                }
                else {
                    return url;
                }
            };
            CoreEmbedding.WebplayerCommonPathSegment = "webplayer";
            CoreEmbedding.WebplayerCommonPathSegmentForInt = "webplayer-int";
            CoreEmbedding.HostNameAllowList = [
                "https://apps.powerapps.com",
                "https://apps.preview.powerapps.com",
                "https://apps.preprod.powerapps.com",
                "https://apps.int.powerapps.com",
                "https://apps.test.powerapps.com",
                "https://apps.dev.powerapps.com",
                "https://apps.local.powerapps.com:44329",
                "https://apps.local.powerapps.com:44328",
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
var Core;
(function (Core) {
    var Embedding;
    (function (Embedding) {
        var EventHook = /** @class */ (function () {
            function EventHook(sender) {
                this.sender = sender;
                this.listeners = [];
            }
            EventHook.prototype.subscribe = function (listener) {
                if (listener) {
                    this.listeners.push(listener);
                }
            };
            EventHook.prototype.unsubscribe = function (listener) {
                var index = this.listeners.indexOf(listener);
                if (index >= 0) {
                    this.listeners.splice(index, 1);
                }
            };
            EventHook.prototype.unsubscribeAll = function () {
                this.listeners = [];
            };
            EventHook.prototype.dispatch = function (data) {
                for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                    var listener = _a[_i];
                    listener.call(this.sender, data);
                }
            };
            return EventHook;
        }());
        Embedding.EventHook = EventHook;
    })(Embedding = Core.Embedding || (Core.Embedding = {}));
})(Core || (Core = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var Authoring;
(function (Authoring) {
    var Embedding;
    (function (Embedding) {
        /* Embed a power app authoring */
        var AuthoringSession = /** @class */ (function () {
            // private authoringView: AuthoringView;
            function AuthoringSession(options, hostWindow) {
                this.options = options;
                this.hostWindow = hostWindow;
                if (!this.options) {
                    this.options = {};
                }
                if (!this.options.hostDataKind) {
                    this.options.hostDataKind = Core.Embedding.DataKind.Table;
                }
                if (!this.options.endpoint) {
                    this.options.endpoint = Core.Embedding.Endpoint.PROD;
                }
                if (!this.options.source) {
                    this.options.source = "Host";
                }
            }
            /**
             * Use this method to initialize an Authoring Experience in the provided HTML container.
             * Experience includes choosing an app from the available apps for the user,
             * and launching PowerApps studio for creating a new app.
             *
             * @param {HTMLElement} container
             * @param {IAuthoringViewOptions} [authoringViewOptions={}]
             * @returns
             * @memberof AuthoringSession
             */
            // public initAuthoringView(container: HTMLElement, authoringViewOptions: IAuthoringViewOptions = {}) {
            //     this.authoringView = new AuthoringView(container, this, authoringViewOptions);
            //     return this.authoringView;
            // }
            /**
             * Use this method to launch PowerApps studio and thus create a Studio Session.
             * Returns an instance of StudioSession (wrapped in a Promise), which can be used to
             * subscribe to useful events like studioLaunched and appSaved and manipulate bound app data.
             *
             * @param {IStudioSessionOptions} [studioOptions]
             * @returns {Promise<StudioSession>}
             * @memberof AuthoringSession
             */
            AuthoringSession.prototype.initStudio = function (studioOptions) {
                return Embedding.StudioSession.init(this.options, studioOptions);
            };
            /**
             * Returns the list of apps (wrapped in a Promise)
             * (optionally filtered by environment) that the user has access to.
             *
             * @param {*} [environmentName]
             * @returns {Promise<IAppInfo[]>}
             * @memberof AuthoringSession
             */
            AuthoringSession.prototype.getAppList = function (environmentName) {
                return this.getSdkSession().getAppList(environmentName);
            };
            /**
             * Returns the list of environments (wrapped in a Promise)
             * that the user has access to.
             * @returns {Promise<any[]>}
             * @memberof AuthoringSession
             */
            AuthoringSession.prototype.getEnvironmentList = function () {
                return this.getSdkSession().getEnvironmentList();
            };
            /**
             * Used to dispose the Authoring Session.
             * Runs crucial cleaning-up methods.
             *
             * @memberof AuthoringSession
             */
            AuthoringSession.prototype.dispose = function () {
                if (this.sdkSession) {
                    this.sdkSession.dispose();
                    this.sdkSession = null;
                }
            };
            AuthoringSession.prototype.getSdkSession = function () {
                if (!this.sdkSession) {
                    this.sdkSession = new Embedding.SdkSession(this.options, this.hostWindow);
                }
                return this.sdkSession;
            };
            return AuthoringSession;
        }());
        Embedding.AuthoringSession = AuthoringSession;
    })(Embedding = Authoring.Embedding || (Authoring.Embedding = {}));
})(Authoring || (Authoring = {}));
/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */
var Authoring;
(function (Authoring) {
    var Embedding;
    (function (Embedding) {
        var AuthoringStrings;
        (function (AuthoringStrings) {
            // GetAccessToken Audiences
            AuthoringStrings.getAccessTokenAudience = "https://web.powerapps.com/";
            // RP Endpoints
            AuthoringStrings.powerAppsRpBaseUrlTest = "https://tip1.api.powerapps.com";
            AuthoringStrings.powerAppsRpBaseUrlProd = "https://api.powerapps.com";
        })(AuthoringStrings = Embedding.AuthoringStrings || (Embedding.AuthoringStrings = {}));
    })(Embedding = Authoring.Embedding || (Authoring.Embedding = {}));
})(Authoring || (Authoring = {}));
/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */
var Authoring;
(function (Authoring) {
    var Embedding;
    (function (Embedding) {
        // This namespace has all the constants associated with HTTP calls.
        var HeaderName;
        (function (HeaderName) {
            // See: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
            // Per the HTTP/1.1 spec, these names are in the case they are defined. And therefore not guaranteed to be case-insensitive.
            // Take this into account when using these constants for checking the name of a header.
            HeaderName.Accept = "Accept";
            HeaderName.AcceptLanguage = "Accept-Language";
            HeaderName.Authorization = "Authorization";
            HeaderName.ContentDisposition = "Content-Disposition";
            HeaderName.ContentType = "Content-Type";
            HeaderName.ContentLength = "Content-Length";
            HeaderName.IfMatch = "If-Match";
            HeaderName.IfNoneMatch = "If-None-Match";
            HeaderName.SoapAction = "SOAPAction";
            HeaderName.ETag = "ETag";
            HeaderName.Location = "Location";
            HeaderName.CacheControl = "Cache-Control";
            HeaderName.Date = "Date";
            HeaderName.RetryAfter = "Retry-After";
            //
            // Microsoft-specific Headers
            //
            // RP Request headers
            HeaderName.MsClientRequestId = "x-ms-client-request-id";
            HeaderName.MsClientSessionId = "x-ms-client-session-id";
            HeaderName.MsDocServerEndpoint = "x-ms-docserver-endpoint";
            HeaderName.MsDocServerEnvironment = "x-ms-docserver-environment";
            HeaderName.PowerAppsConnectorProtocolSemantics = "x-ms-protocol-semantics";
            // RP Response headers
            HeaderName.MsRequestId = "x-ms-request-id";
            HeaderName.MsCorrelationRequestId = "x-ms-correlation-request-id";
            HeaderName.MsRoutingRequestId = "x-ms-routing-request-id";
            HeaderName.MsFailureCause = "x-ms-failure-cause";
            // Extended webdav error (like SharePoint).
            HeaderName.MsDavExtendedError = "X-MSDAVEXT_Error";
            // SharePoint Service request id
            HeaderName.SharePointRequestId = "SPRequestGuid";
            // Request header to support cross region
            HeaderName.MsDomainName = "x-ms-domain-name";
            // Connector Request headers
            HeaderName.MsUserAgent = "x-ms-user-agent";
            // Custom Debug Header for SAS key duration on webPackageUrl
            HeaderName.MsSasDuration = "x-ms-app-sas-duration";
            // PA Client headers prefix
            HeaderName.PAClientHeaderPrefix = "x-ms-pa-client-";
            HeaderName.TelemetryOptions = HeaderName.PAClientHeaderPrefix + "telemetry-options";
            HeaderName.TelemetryAdditionalData = HeaderName.PAClientHeaderPrefix + "telemetry-additional-data";
            HeaderName.ServiceErrorOptions = HeaderName.PAClientHeaderPrefix + "service-error-options";
            HeaderName.CustomHeadersOptions = HeaderName.PAClientHeaderPrefix + "custom-headers-options";
            // TASK 570605: Remove this special casing and have EntityFormControl use the existing authentication pipeline.
            // Entity Form app request headers
            HeaderName.MsRtsAuthorizationRequestId = "x-ms-rts-authorization-request-id";
            HeaderName.Consistency = "Consistency";
        })(HeaderName = Embedding.HeaderName || (Embedding.HeaderName = {}));
        var HeaderValue;
        (function (HeaderValue) {
            HeaderValue.MatchAll = "*";
            HeaderValue.NoCache = "no-cache";
            HeaderValue.NoStore = "no-store";
            HeaderValue.NoCacheNoStore = "no-cache, no-store";
            HeaderValue.PowerAppsConnectorProtocolSemanticsValue = "cdp";
            HeaderValue.ConsistencyStrong = "Strong";
        })(HeaderValue = Embedding.HeaderValue || (Embedding.HeaderValue = {}));
        var HttpStatusCode;
        (function (HttpStatusCode) {
            // http://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html#sec6.1.1
            //
            // The request was canceled before it was made. Relevant only to XHR request.
            //
            HttpStatusCode.XhrRequestIncomplete = 0;
            //
            // Informational 1xx
            //
            HttpStatusCode.Continue = 100;
            HttpStatusCode.SwitchingProtocols = 101;
            //
            // Successful 2xx
            //
            HttpStatusCode.Ok = 200;
            HttpStatusCode.ContentAdded = 201;
            HttpStatusCode.Accepted = 202;
            HttpStatusCode.NonAuthoritativeInformation = 203;
            HttpStatusCode.NoContent = 204;
            HttpStatusCode.ResetContent = 205;
            HttpStatusCode.PartialContent = 206;
            //
            // Redirection 3xx
            //
            HttpStatusCode.MultipleChoices = 300;
            HttpStatusCode.Ambiguous = 300;
            HttpStatusCode.MovedPermanently = 301;
            HttpStatusCode.Moved = 301;
            HttpStatusCode.Found = 302;
            HttpStatusCode.Redirect = 302;
            HttpStatusCode.SeeOther = 303;
            HttpStatusCode.RedirectMethod = 303;
            HttpStatusCode.NotModified = 304;
            HttpStatusCode.UseProxy = 305;
            HttpStatusCode.Unused = 306;
            HttpStatusCode.TemporaryRedirect = 307;
            HttpStatusCode.RedirectKeepVerb = 307;
            //
            // Client Error 4xx
            //
            HttpStatusCode.BadRequest = 400;
            HttpStatusCode.Unauthorized = 401;
            HttpStatusCode.PaymentRequired = 402;
            HttpStatusCode.Forbidden = 403;
            HttpStatusCode.NotFound = 404;
            HttpStatusCode.MethodNotAllowed = 405;
            HttpStatusCode.NotAcceptable = 406;
            HttpStatusCode.ProxyAuthenticationRequired = 407;
            HttpStatusCode.RequestTimeout = 408;
            HttpStatusCode.Conflict = 409;
            HttpStatusCode.Gone = 410;
            HttpStatusCode.LengthRequired = 411;
            HttpStatusCode.PreconditionFailed = 412;
            HttpStatusCode.RequestEntityTooLarge = 413;
            HttpStatusCode.RequestUriTooLong = 414;
            HttpStatusCode.UnsupportedMediaType = 415;
            HttpStatusCode.RequestedRangeNotSatisfiable = 416;
            HttpStatusCode.ExpectationFailed = 417;
            HttpStatusCode.Locked = 423;
            HttpStatusCode.UpgradeRequired = 426;
            HttpStatusCode.TooManyRequests = 429;
            /**
             * Client Error Codes
             */
            var ClientErrorCodes = [
                HttpStatusCode.BadRequest,
                HttpStatusCode.Unauthorized,
                HttpStatusCode.PaymentRequired,
                HttpStatusCode.Forbidden,
                HttpStatusCode.NotFound,
                HttpStatusCode.MethodNotAllowed,
                HttpStatusCode.NotAcceptable,
                HttpStatusCode.ProxyAuthenticationRequired,
                HttpStatusCode.RequestTimeout,
                HttpStatusCode.Conflict,
                HttpStatusCode.Gone,
                HttpStatusCode.LengthRequired,
                HttpStatusCode.PreconditionFailed,
                HttpStatusCode.RequestEntityTooLarge,
                HttpStatusCode.RequestUriTooLong,
                HttpStatusCode.UnsupportedMediaType,
                HttpStatusCode.RequestedRangeNotSatisfiable,
                HttpStatusCode.ExpectationFailed,
                HttpStatusCode.Locked,
                HttpStatusCode.UpgradeRequired
            ];
            //
            // Server Error 5xx
            //
            HttpStatusCode.InternalServerError = 500;
            HttpStatusCode.NotImplemented = 501;
            HttpStatusCode.BadGateway = 502;
            HttpStatusCode.ServiceUnavailable = 503;
            HttpStatusCode.GatewayTimeout = 504;
            HttpStatusCode.HttpVersionNotSupported = 505;
            var ServerErrorCodes = [
                HttpStatusCode.InternalServerError,
                HttpStatusCode.NotImplemented,
                HttpStatusCode.BadGateway,
                HttpStatusCode.ServiceUnavailable,
                HttpStatusCode.GatewayTimeout,
                HttpStatusCode.HttpVersionNotSupported
            ];
            HttpStatusCode.CommonRetryableErrorCodes = [
                HttpStatusCode.RequestTimeout,
                HttpStatusCode.Conflict,
                HttpStatusCode.InternalServerError,
                HttpStatusCode.BadGateway,
                HttpStatusCode.ServiceUnavailable,
                HttpStatusCode.GatewayTimeout
            ];
            /**
             * Returns whether the specified error code is a client error code or not.
             */
            function isClientErrorCode(errorCode) {
                return (ClientErrorCodes.indexOf(errorCode) > -1);
            }
            HttpStatusCode.isClientErrorCode = isClientErrorCode;
            /**
             * Returns whether the specified error code is a server error code or not.
             */
            function isServerErrorCode(errorCode) {
                return (ServerErrorCodes.indexOf(errorCode) > -1);
            }
            HttpStatusCode.isServerErrorCode = isServerErrorCode;
        })(HttpStatusCode = Embedding.HttpStatusCode || (Embedding.HttpStatusCode = {}));
        // Some of the known HTTP method names.
        var Method;
        (function (Method) {
            Method.GET = "GET";
            Method.HEAD = "HEAD";
            Method.POST = "POST";
            Method.PUT = "PUT";
            Method.PATCH = "PATCH";
            Method.DELETE = "DELETE";
        })(Method = Embedding.Method || (Embedding.Method = {}));
        Embedding.KnownMethods = [
            Method.GET,
            Method.HEAD,
            Method.POST,
            Method.PUT,
            Method.PATCH,
            Method.DELETE,
        ];
        // Also known as MIME types. Used to define the 'content-type' header values in HTTP.
        // For some standard examples, see: http://www.freeformatter.com/mime-types-list.html
        // Note: these constants should be all lower-case.
        var MediaType;
        (function (MediaType) {
            MediaType.All = "*/*";
            MediaType.Text = "text";
            MediaType.TextHtml = "text/html";
            MediaType.TextJavascript = "text/javascript";
            MediaType.TextPlain = "text/plain";
            MediaType.TextXml = "text/xml";
            MediaType.ApplicationXHtml = "application/xhtml+xml";
            MediaType.ApplicationXml = "application/xml";
            MediaType.ApplicationJson = "application/json";
            MediaType.ApplicationFormUrlEncoded = "application/x-www-form-urlencoded";
            MediaType.ApplicationOctetStream = "application/octet-stream";
            MediaType.MultipartFormData = "multipart/form-data";
            MediaType.Image = "image";
            MediaType.Audio = "audio";
            MediaType.Video = "video";
        })(MediaType = Embedding.MediaType || (Embedding.MediaType = {}));
        // Known Content-Disposition type values.
        // See: http://www.ietf.org/rfc/rfc1806.txt and http://www.iana.org/assignments/cont-disp/cont-disp.xhtml
        var ContentDispositionType;
        (function (ContentDispositionType) {
            ContentDispositionType.Attachment = "attachment";
            /** Used in multipart/form-data parts. */
            ContentDispositionType.FormData = "form-data";
            ContentDispositionType.Inline = "inline";
        })(ContentDispositionType = Embedding.ContentDispositionType || (Embedding.ContentDispositionType = {}));
        // See: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
        var XhrReadyState;
        (function (XhrReadyState) {
            XhrReadyState[XhrReadyState["Unsent"] = 0] = "Unsent";
            XhrReadyState[XhrReadyState["Opened"] = 1] = "Opened";
            XhrReadyState[XhrReadyState["HeadersReceived"] = 2] = "HeadersReceived";
            XhrReadyState[XhrReadyState["Loading"] = 3] = "Loading";
            XhrReadyState[XhrReadyState["Done"] = 4] = "Done";
        })(XhrReadyState = Embedding.XhrReadyState || (Embedding.XhrReadyState = {}));
    })(Embedding = Authoring.Embedding || (Authoring.Embedding = {}));
})(Authoring || (Authoring = {}));
/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var Authoring;
(function (Authoring) {
    var Embedding;
    (function (Embedding) {
        var SdkSessionErrors;
        (function (SdkSessionErrors) {
            SdkSessionErrors["SERVER_NOT_RESPONDING"] = "Server not responding";
            SdkSessionErrors["SERVER_ERROR"] = "Server Error";
        })(SdkSessionErrors = Embedding.SdkSessionErrors || (Embedding.SdkSessionErrors = {}));
        var SdkConstants;
        (function (SdkConstants) {
            SdkConstants["SdkMessageType"] = "PowerAppsSdkMessage";
        })(SdkConstants || (SdkConstants = {}));
        var SdkSession = /** @class */ (function (_super) {
            __extends(SdkSession, _super);
            function SdkSession(options, hostWindow) {
                var _this = _super.call(this, options, hostWindow || window) || this;
                _this.options = options;
                return _this;
            }
            SdkSession.prototype.getAppList = function (environmentName) {
                return this._getSdkChannel()
                    .then(function (channel) {
                    return channel.invoke("getAppList", { environmentName: environmentName });
                });
            };
            SdkSession.prototype.getEnvironmentList = function () {
                return this._getSdkChannel()
                    .then(function (channel) {
                    return channel.invoke("getEnvironmentList");
                });
            };
            // Gets a promise to the Sdk channel instance which is resolved when the channel is ready
            SdkSession.prototype._getSdkChannel = function () {
                var _this = this;
                if (this._sdkChannel) {
                    return this._sdkChannel;
                }
                return this._sdkChannel = new Promise(function (resolve, reject) {
                    // wait for 10 seconds for runtime sdk to respond
                    var channelLoadedTimeout = setTimeout(function () {
                        channelLoadedTimeout = null;
                        reject(SdkSessionErrors.SERVER_NOT_RESPONDING);
                        _this._sdkChannel = null;
                        _this._sdkIframe.parentNode.removeChild(_this._sdkIframe);
                    }, 10000);
                    var outboundId = 1;
                    var outboundMessageHandlers = {};
                    var channel = {
                        invoke: function (actionName, actionData) {
                            if (_this._sdkIframe) {
                                var actionMessageId_1 = "sdk-message-" + (outboundId++);
                                var responsePromise = new Promise(function (resolve, reject) {
                                    outboundMessageHandlers[actionMessageId_1] = {
                                        resolve: resolve,
                                        reject: reject
                                    };
                                });
                                var message = {
                                    actionName: actionName,
                                    actionData: actionData,
                                    id: actionMessageId_1,
                                    type: "PowerAppsSdkMessage" /* SdkMessageType */
                                };
                                _this._sdkIframe.contentWindow.postMessage(message, _this.options.hostName);
                                return responsePromise;
                            }
                        }
                    };
                    var sdkIframeUrl = _this.constructBaseUrl("embedsdk");
                    // Add message listeners
                    window.addEventListener("message", function (event) {
                        if (!_this.validateMessageOrigin(event) || (event.data && event.data.type !== "PowerAppsSdkMessage" /* SdkMessageType */)) {
                            return;
                        }
                        var message = event.data;
                        switch (message.actionName) {
                            case "loaded": {
                                clearTimeout(channelLoadedTimeout);
                                resolve(channel);
                                break;
                            }
                            case "apiResponse": {
                                if (outboundMessageHandlers[message.sourceId]) {
                                    if (message.success) {
                                        outboundMessageHandlers[message.sourceId].resolve(message.actionData);
                                    }
                                    else {
                                        outboundMessageHandlers[message.sourceId].reject(SdkSessionErrors.SERVER_ERROR);
                                    }
                                    delete outboundMessageHandlers[message.sourceId];
                                }
                                break;
                            }
                            default: break;
                        }
                    });
                    _this._sdkIframe = document.createElement("iframe");
                    _this._sdkIframe.src = sdkIframeUrl;
                    _this._sdkIframe.scrolling = "no";
                    _this._sdkIframe.height = "1px";
                    _this._sdkIframe.width = "1px";
                    // so it is right outside the screen
                    _this._sdkIframe.style.cssText = "position: fixed; top:-2px; left: -2px;";
                    window.document.body.appendChild(_this._sdkIframe);
                });
            };
            return SdkSession;
        }(Core.Embedding.CoreEmbedding));
        Embedding.SdkSession = SdkSession;
    })(Embedding = Authoring.Embedding || (Authoring.Embedding = {}));
})(Authoring || (Authoring = {}));
/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */
var Authoring;
(function (Authoring) {
    var Embedding;
    (function (Embedding) {
        /**
         * Helper class to get authorization for shared sessions.
         */
        var SharedAuthoringSessionAuthorizer = /** @class */ (function () {
            function SharedAuthoringSessionAuthorizer() {
            }
            SharedAuthoringSessionAuthorizer.getAuthorizationAsync = function (armToken, authorizationEndpoint) {
                return SharedAuthoringSessionAuthorizer.getSessionTokenAsync(armToken, authorizationEndpoint, null);
            };
            SharedAuthoringSessionAuthorizer.refreshAuthorizationAsync = function (armToken, authorizationToken, refreshSessionEndpoint) {
                var body = { sessionToken: authorizationToken };
                return SharedAuthoringSessionAuthorizer.getSessionTokenAsync(armToken, refreshSessionEndpoint, JSON.stringify(body));
            };
            SharedAuthoringSessionAuthorizer.getSessionTokenAsync = function (armToken, endpoint, body) {
                var _this = this;
                if (SharedAuthoringSessionAuthorizer._lastEndpoint !== endpoint) {
                    SharedAuthoringSessionAuthorizer._getAuthorizationOperation = null;
                    SharedAuthoringSessionAuthorizer._lastEndpoint = endpoint;
                }
                if (!SharedAuthoringSessionAuthorizer._getAuthorizationOperation) {
                    SharedAuthoringSessionAuthorizer._getAuthorizationOperation = function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, options, response, errorMessage, val, errorMessage, authoringSessionToken, errorMessage, e_1, errorMessage;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    options = {
                                        "type": "POST",
                                        url: endpoint,
                                        headers: (_a = {
                                                "Content-Type": "application/json; charset=utf-8",
                                                "Authorization": "Bearer " + armToken,
                                                "x-ms-client-request-id": Embedding.SharedAuthoringSessionManager.generateRequestId(),
                                                "x-ms-correlation-request-id": Embedding.SharedAuthoringSessionManager.getCorrelationId()
                                            },
                                            // 'no-store' is required to avoid request stalls in the Chrome browser.
                                            // See: https://stackoverflow.com/questions/27513994/chrome-stalls-when-making-multiple-requests-to-same-resource
                                            _a[Embedding.HeaderName.CacheControl] = Embedding.HeaderValue.NoCacheNoStore,
                                            _a),
                                    };
                                    if (body) {
                                        options["data"] = body;
                                    }
                                    return [4 /*yield*/, WinJS.xhr(options)];
                                case 1:
                                    response = _b.sent();
                                    if (response.status !== 200) {
                                        errorMessage = "Non-200 response received. Status: " + response.status + ", content: " + response.responseText;
                                        throw new Error(errorMessage);
                                    }
                                    val = JSON.parse(response.responseText);
                                    if (!val) {
                                        errorMessage = "Response status " + response.status + " with empty response text.";
                                        if (options) {
                                            errorMessage += " Request id " + options.headers["x-ms-client-request-id"] + " correlation request id " + options.headers["x-ms-correlation-request-id"];
                                        }
                                        throw new Error(errorMessage);
                                    }
                                    authoringSessionToken = val.sessionToken;
                                    if (!authoringSessionToken) {
                                        errorMessage = "Response status " + response.status + " returned with invalid response text.";
                                        if (options) {
                                            errorMessage += " Request id " + options.headers["x-ms-client-request-id"] + " correlation request id " + options.headers["x-ms-correlation-request-id"];
                                        }
                                        throw new Error(errorMessage);
                                    }
                                    return [2 /*return*/, authoringSessionToken];
                                case 2:
                                    e_1 = _b.sent();
                                    errorMessage = void 0;
                                    if (e_1 instanceof XMLHttpRequest) {
                                        errorMessage = "xhr error. Status: " + e_1.status + ", response: " + e_1.responseText;
                                    }
                                    else {
                                        errorMessage = "Error: " + (errorMessage || "n/a");
                                    }
                                    errorMessage = "Failed to get Authorized. " + errorMessage;
                                    console.error("SharedAuthoringSessionAuthorizer.getSessionTokenAsync", errorMessage);
                                    throw new Error(errorMessage);
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }, { startOnWait: true };
                }
                return SharedAuthoringSessionAuthorizer._getAuthorizationOperation();
            };
            SharedAuthoringSessionAuthorizer._lastEndpoint = "";
            SharedAuthoringSessionAuthorizer._getAuthorizationOperation = null;
            return SharedAuthoringSessionAuthorizer;
        }());
        Embedding.SharedAuthoringSessionAuthorizer = SharedAuthoringSessionAuthorizer;
    })(Embedding = Authoring.Embedding || (Authoring.Embedding = {}));
})(Authoring || (Authoring = {}));
/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */
var Authoring;
(function (Authoring) {
    var Embedding;
    (function (Embedding) {
        // Singleton manager of remote authoring session. Singleton model is chosen here since if in the future more parts of the SDK rely on this component,
        // it will be clear if there is already an authoring session in progress, and thus new code wouldn't want to start another separate session.
        var SharedAuthoringSessionManager = /** @class */ (function () {
            function SharedAuthoringSessionManager(getAccessToken, endpoint) {
                // AuthoringSession newInstance endpoint (endpoint strings should start with slash)
                this._newInstance = "/api/authoringsession/newinstance";
                // SharedAuthoringSessionManager information
                this._authoringSessionTokenObject = null;
                this._authoringSessionEstablishedState = 0 /* Idle */;
                this._initCreateServerInstanceActivity(getAccessToken, endpoint);
            }
            SharedAuthoringSessionManager.instance = function (getAccessToken, endpoint) {
                var instance = SharedAuthoringSessionManager._instance;
                if (!instance) {
                    instance = SharedAuthoringSessionManager._instance = new SharedAuthoringSessionManager(getAccessToken, endpoint);
                }
                return instance;
            };
            SharedAuthoringSessionManager.generateRequestId = function () {
                return this._generate128BitUUID();
            };
            SharedAuthoringSessionManager.getCorrelationId = function () {
                return this._generate128BitUUID();
            };
            /**
             * Generates a hex character to replace another given character
             * If the given character is x, any hex character will do
             * Otherwise, the hex character must be greater than 7 (ie. 8,9,a,b,c,d,e,f)
             */
            SharedAuthoringSessionManager._hexGenerator = function (seed, patternCharacter) {
                var rnd = (seed + Math.random() * 16) % 16 | 0;
                return (patternCharacter === 'x' ? rnd : (rnd & 0x3 | 0x8)).toString(16);
            };
            /**
             * Returns an RFC 4122 Compliant UUID; i.e. a GUID.
             */
            SharedAuthoringSessionManager._generate128BitUUID = function () {
                var _this = this;
                var seed = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (replacer) { return _this._hexGenerator(seed, replacer); });
                return uuid;
            };
            SharedAuthoringSessionManager._getLocationState = function () {
                var locationState = window.history.state;
                if (!locationState) {
                    locationState = {
                        href: window.location.href,
                        protocol: window.location.protocol,
                        host: window.location.host,
                        pathname: window.location.pathname,
                        hash: window.location.hash
                    };
                }
                return locationState;
            };
            Object.defineProperty(SharedAuthoringSessionManager.prototype, "authoringSessionToken", {
                get: function () {
                    return this._authoringSessionTokenObject.authoringToken;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SharedAuthoringSessionManager.prototype, "isAuthoringSessionEstablished", {
                get: function () {
                    return this._authoringSessionEstablishedState === 1 /* Established */;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SharedAuthoringSessionManager.prototype, "isAuthoringSessionIdle", {
                get: function () {
                    return this._authoringSessionEstablishedState === 0 /* Idle */;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SharedAuthoringSessionManager.prototype, "isAuthoringSessionDisposed", {
                get: function () {
                    return this._authoringSessionEstablishedState === 2 /* Disposed */;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SharedAuthoringSessionManager.prototype, "joinToken", {
                get: function () {
                    return this._joinToken;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SharedAuthoringSessionManager.prototype, "regionSpecificDomainName", {
                get: function () {
                    return this._regionSpecificDomain;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SharedAuthoringSessionManager.prototype, "sessionStateOpaqueString", {
                get: function () {
                    return this._sessionStateOpaqueString;
                },
                enumerable: true,
                configurable: true
            });
            SharedAuthoringSessionManager.prototype._initCreateServerInstanceActivity = function (getAccessToken, endpoint) {
                var _this = this;
                this._createServerInstanceOp = new Core.AsyncOperation("SharedAuthoringSessionManager._createServerInstanceOp", function () { return _this._createServerInstanceAsync(getAccessToken, endpoint); }, { startOnWait: true });
            };
            /**
             * Ensures that we have an authoring session and starts a new one otherwise.
             */
            SharedAuthoringSessionManager.prototype.establishAsync = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var error, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (this._authoringSessionEstablishedState === 2 /* Disposed */) {
                                    DebugContracts.assert(false, SharedAuthoringSessionManager._attemptedToReestablishDisposedSessionErrorMessage);
                                    error = new Error(SharedAuthoringSessionManager._attemptedToReestablishDisposedSessionErrorMessage);
                                    Core.Log.error("SharedAuthoringSessionManager.establishAsync", Core.Utility.throwInline(error));
                                    return [2 /*return*/, Promise.reject(error)];
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this._createServerInstanceOp.waitAsync()];
                            case 2:
                                _a.sent();
                                this.ensureEstablished();
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                // Log an error and reject
                                Core.Log.error("SharedAuthoringSessionManager.establishAsync", error_1);
                                return [2 /*return*/, Promise.reject(error_1)];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            };
            /**
             * Verifies that there is a WebAuth session currently established
             * and throws an error otherwise.
             */
            SharedAuthoringSessionManager.prototype.ensureEstablished = function () {
                if (this._authoringSessionEstablishedState === 2 /* Disposed */) {
                    DebugContracts.assert(false, SharedAuthoringSessionManager._attemptedToReestablishDisposedSessionErrorMessage);
                    // Log an error and throw
                    var error = new Core.ApplicationError(SharedAuthoringSessionManager._attemptedToReestablishDisposedSessionErrorMessage);
                    Core.Log.error("SharedAuthoringSessionManager.ensureEstablished", Core.Utility.throwInline(error));
                    // And throw a canceled error so that user doesn't see abnormal termination dialog
                    // (this is known to happen when the use is already seeing the session expiration dialog).
                    throw Core.PromiseUtils.createCanceledError();
                }
                else if (this._authoringSessionEstablishedState !== 1 /* Established */) {
                    var errorMessage = "SharedAuthoringSessionManager session is not established yet.";
                    errorMessage += " Correlation id: " + SharedAuthoringSessionManager.getCorrelationId();
                    Core.Log.error("SharedAuthoringSessionManager.ensureEstablished", errorMessage);
                    throw new Core.ApplicationError(errorMessage);
                }
            };
            /**
             * Closes a session. The host will have to start a new session to continue using authoring,
             * thus it is advisable to also notify the host of the closing user session if calling this method.
             */
            SharedAuthoringSessionManager.prototype.closeAuthoringSession = function () {
                // Mark session as disposed and reset info specific to previous session
                this._authoringSessionEstablishedState = 2 /* Disposed */;
                this._authoringSessionTokenObject.authoringToken = "";
                this._regionSpecificDomain = null;
            };
            /**
             * Builds the newinstance request and parses the response.
             */
            SharedAuthoringSessionManager.prototype._createServerInstanceAsync = function (getAccessToken, endpoint) {
                return __awaiter(this, void 0, void 0, function () {
                    var sessionTokenProvider, _a, request, response, e_2, locationState, responseValue, locationState, errorMessage, errorMessage, jsonObject;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                this._endpoint = endpoint;
                                sessionTokenProvider = new Embedding.SharedAuthoringSessionTokenProvider(getAccessToken, this._endpoint);
                                _a = this;
                                return [4 /*yield*/, sessionTokenProvider.getAuthoringSessionTokenAsync()];
                            case 1:
                                _a._authoringSessionTokenObject = _b.sent();
                                request = this._buildInstanceRequest();
                                _b.label = 2;
                            case 2:
                                _b.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, WinJS.xhr(request)];
                            case 3:
                                response = _b.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                e_2 = _b.sent();
                                if (e_2 instanceof XMLHttpRequest && e_2.status === 0) {
                                    locationState = SharedAuthoringSessionManager._getLocationState();
                                    // Some network failures surface as http status 0.
                                    // A common cause for this is if the CORS preflight request fails
                                    // (this could be due to a corporate network policy that prevents access to our direct DC endpoints).
                                    // In the SDK we do not retry against the global endpoint in this case.
                                    Core.Log.errorEx("SharedAuthoringSessionManager._createServerInstanceAsync", {
                                        message: "Call to newinstance failed with HTTP status 0.",
                                        eventData: {
                                            requestedUrl: request.url,
                                            origin: locationState.host
                                        }
                                    });
                                    console.warn("Call to newinstance failed with HTTP status 0.");
                                }
                                else if (e_2 instanceof XMLHttpRequest) {
                                    if (e_2.status === Embedding.HttpStatusCode.PreconditionFailed) {
                                        responseValue = JSON.parse(e_2.response);
                                        if (responseValue && responseValue.domainName) {
                                            locationState = SharedAuthoringSessionManager._getLocationState();
                                            Core.Telemetry.Log.trackActivityEvent(Core.Telemetry.OperationNames.sharedWebAuthNewInstanceRedirect, {
                                                requestedUrl: request && request.url,
                                                origin: locationState.host,
                                                redirectToUrl: responseValue.domainName
                                            });
                                        }
                                        console.warn("SharedAuthoringSessionManager._createServerInstanceAsync");
                                        console.warn(e_2);
                                        console.warn("Will not redirect");
                                    }
                                    else if (e_2.status === Embedding.HttpStatusCode.TooManyRequests) {
                                        console.warn("SharedAuthoringSessionManager._createServerInstanceAsync");
                                        console.warn(e_2);
                                        console.warn("NewInstance API is throttled");
                                    }
                                    else {
                                        Core.Log.error("SharedAuthoringSessionManager._createServerInstanceAsync", "Call to newinstance failed with HTTP status " + e_2.status);
                                    }
                                }
                                else {
                                    Core.Log.error("SharedAuthoringSessionManager._createServerInstanceAsync", "Call to newinstance failed " + e_2);
                                }
                                errorMessage = "Failed to create new session (newinstance)." + e_2.toString();
                                Core.Log.error("SharedAuthoringSessionManager._createServerInstanceAsync", errorMessage);
                                throw new Error(errorMessage);
                            case 5:
                                if (!response) {
                                    errorMessage = "Creation of new session returned an empty response (newinstance).";
                                    Core.Log.error("SharedAuthoringSessionManager._createServerInstanceAsync", errorMessage);
                                    throw new Error(errorMessage);
                                }
                                jsonObject = JSON.parse(response.responseText);
                                this._joinToken = jsonObject.joinToken;
                                this._sessionStateOpaqueString = jsonObject.sessionState;
                                this._regionSpecificDomain = jsonObject.domainName;
                                // Mark session as established
                                this._authoringSessionEstablishedState = 1 /* Established */;
                                return [2 /*return*/];
                        }
                    });
                });
            };
            /*
            * Constructs the URL which provides a new instance of document sever (and also
            * requests a join token via query string parameter provideJoinToken = true) and
            * returns IXhrOptions representing the XMLHttpRequest to make to the new instance endpoint.
            */
            SharedAuthoringSessionManager.prototype._buildInstanceRequest = function () {
                var baseStudioUrl = Embedding.StudioUtilities.getBaseStudioUrlFromEndpoint(this._endpoint);
                var joinTokenRequestParam = "?provideJoinToken=true";
                var newInstanceRequestUrl = baseStudioUrl + this._newInstance + joinTokenRequestParam;
                var options = this._buildGeneralXhrRequestOptions("POST", newInstanceRequestUrl);
                return options;
            };
            SharedAuthoringSessionManager.prototype._buildGeneralXhrRequestOptions = function (method, url, body) {
                if (body === void 0) { body = null; }
                // 'no-store' is required to avoid request stalls in the Chrome browser.
                // See: https://stackoverflow.com/questions/27513994/chrome-stalls-when-making-multiple-requests-to-same-resource
                var headers = this.buildGeneralRequestHeader();
                headers[Embedding.HeaderName.CacheControl] = Embedding.HeaderValue.NoCacheNoStore;
                return {
                    "type": method,
                    url: url,
                    headers: headers,
                    data: body || null
                };
            };
            /*
            * Populates a request with authorization and authentication headers, session information, and content type (all apis use JSON serialization).
            * @param extraHeaders : additional headers to include
            */
            SharedAuthoringSessionManager.prototype.buildGeneralRequestHeader = function (extraHeaders) {
                if (!extraHeaders) {
                    extraHeaders = Object.create(null);
                }
                extraHeaders["Content-Type"] = "application/json; charset=utf-8";
                extraHeaders.AuthoringSessionToken = this._authoringSessionTokenObject.authoringToken;
                extraHeaders["x-ms-client-request-id"] = SharedAuthoringSessionManager.generateRequestId();
                extraHeaders["x-ms-correlation-request-id"] = SharedAuthoringSessionManager.getCorrelationId();
                if (this._regionSpecificDomain) {
                    extraHeaders["x-ms-domain-name"] = this._regionSpecificDomain;
                }
                if (this._sessionStateOpaqueString) {
                    extraHeaders["x-ms-session-state"] = this._sessionStateOpaqueString;
                }
                return extraHeaders;
            };
            SharedAuthoringSessionManager._attemptedToReestablishDisposedSessionErrorMessage = "Attempted to establish a WebAuth session after a previous session had been disposed.";
            SharedAuthoringSessionManager._instance = null;
            return SharedAuthoringSessionManager;
        }());
        Embedding.SharedAuthoringSessionManager = SharedAuthoringSessionManager;
        // Note: Once a Session has been disposed it cannot be re-established. The host must start a new AuthoringSession which can
        // then create a new instance of SharedAuthoringSessionManager
        var SessionEstablishedState;
        (function (SessionEstablishedState) {
            SessionEstablishedState[SessionEstablishedState["Idle"] = 0] = "Idle";
            SessionEstablishedState[SessionEstablishedState["Established"] = 1] = "Established";
            SessionEstablishedState[SessionEstablishedState["Disposed"] = 2] = "Disposed"; // Session has ended and is no longer accepting communications
        })(SessionEstablishedState || (SessionEstablishedState = {}));
    })(Embedding = Authoring.Embedding || (Authoring.Embedding = {}));
})(Authoring || (Authoring = {}));
/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */
var Authoring;
(function (Authoring) {
    var Embedding;
    (function (Embedding) {
        // Class that provides access to the token which may later be presented to WebAuth in order to create a new session
        var SharedAuthoringSessionTokenProvider = /** @class */ (function () {
            function SharedAuthoringSessionTokenProvider(getAccessToken, endpoint) {
                if (getAccessToken === null || getAccessToken === undefined) {
                    throw new Error("SharedAuthoringSessionTokenProvider requires an AccessTokenProvider");
                }
                this._getAccessToken = getAccessToken;
                this._endpoint = endpoint;
            }
            SharedAuthoringSessionTokenProvider.constructAuthorizationEndpoint = function (token, api, endpoint) {
                // Parse the JSON Web Token
                var jsonWebToken = SharedAuthoringSessionTokenProvider.parseJwt(token);
                // Build the url for the RP Authorization Endpoint
                var powerAppsRpBaseUrl = "";
                switch (endpoint) {
                    case Core.Embedding.Endpoint.DEV:
                    case Core.Embedding.Endpoint.INT:
                    case Core.Embedding.Endpoint.TEST:
                        powerAppsRpBaseUrl = Embedding.AuthoringStrings.powerAppsRpBaseUrlTest;
                        break;
                    case Core.Embedding.Endpoint.PROD:
                        powerAppsRpBaseUrl = Embedding.AuthoringStrings.powerAppsRpBaseUrlProd;
                        break;
                    default:
                        powerAppsRpBaseUrl = Embedding.AuthoringStrings.powerAppsRpBaseUrlProd;
                        break;
                }
                var providersPath = "/" + Authoring.Embedding.PowerAppEndpoints.providers;
                var objectIdsValuePath = "/" + Authoring.Embedding.PowerAppEndpoints.objectIdsValue;
                var oidPath = "/" + jsonWebToken.oid;
                var apiPath = "/" + api;
                var apiVersionQueryParam = "?api-version=" + Authoring.Embedding.PowerAppEndpoints.getApiVersion();
                var url = powerAppsRpBaseUrl + providersPath + objectIdsValuePath + oidPath + apiPath + apiVersionQueryParam;
                return url;
            };
            SharedAuthoringSessionTokenProvider.parseJwt = function (token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                return JSON.parse(window.atob(base64));
            };
            ;
            SharedAuthoringSessionTokenProvider.prototype.getAuthoringSessionTokenAsync = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var accessToken, authoringSessionTokenApiEndpoint, authoringSessionToken, authoringTokenObject, e_3, errorMessage;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, this.acquireTokenAsync()];
                            case 1:
                                accessToken = _a.sent();
                                authoringSessionTokenApiEndpoint = SharedAuthoringSessionTokenProvider.constructAuthorizationEndpoint(accessToken, Authoring.Embedding.PowerAppEndpoints.serverSession, this._endpoint);
                                return [4 /*yield*/, Embedding.SharedAuthoringSessionAuthorizer.getAuthorizationAsync(accessToken, authoringSessionTokenApiEndpoint)];
                            case 2:
                                authoringSessionToken = _a.sent();
                                authoringTokenObject = {
                                    accessToken: accessToken,
                                    authoringToken: authoringSessionToken
                                };
                                return [2 /*return*/, authoringTokenObject];
                            case 3:
                                e_3 = _a.sent();
                                errorMessage = "Failed to obtain authoring session token from Parent. " + e_3;
                                console.error("SharedAuthoringSessionTokenProvider.getAuthoringSessionTokenAsync", errorMessage);
                                throw new Error(errorMessage);
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            };
            SharedAuthoringSessionTokenProvider.prototype.acquireTokenAsync = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var getAccessTokenInput, response_2, successCallback, errorCallback, token, errorMessage;
                    return __generator(this, function (_a) {
                        try {
                            getAccessTokenInput = {
                                api: Core.Embedding.RuntimeToSdkApi.GetAccessToken,
                                id: Date.now().toString(),
                                clientRequestId: Embedding.SharedAuthoringSessionManager.generateRequestId(),
                                audience: Embedding.AuthoringStrings.getAccessTokenAudience
                            };
                            response_2 = {
                                id: getAccessTokenInput.id,
                                api: getAccessTokenInput.api,
                                success: false,
                                accessToken: null,
                                errorMessage: null,
                                parentRequestId: ""
                            };
                            successCallback = function (token, parentRequestId) {
                                if (parentRequestId === void 0) { parentRequestId = ""; }
                                response_2.success = true;
                                response_2.accessToken = token;
                                response_2.parentRequestId = parentRequestId;
                            };
                            errorCallback = function (errorMessage, parentRequestId) {
                                if (parentRequestId === void 0) { parentRequestId = ""; }
                                response_2.success = false;
                                response_2.errorMessage = errorMessage;
                                response_2.parentRequestId = parentRequestId;
                            };
                            // Get the accesstoken from the parent, which is hosted by the application intiating the session to be shared
                            this._getAccessToken(getAccessTokenInput.audience, successCallback, errorCallback, getAccessTokenInput.clientRequestId);
                            token = response_2.accessToken;
                            return [2 /*return*/, token];
                        }
                        catch (e) {
                            errorMessage = "Failed to obtain token. " + e;
                            console.error("SharedAuthoringSessionTokenProvider.acquireTokenAsync", errorMessage);
                            throw e;
                        }
                        return [2 /*return*/];
                    });
                });
            };
            return SharedAuthoringSessionTokenProvider;
        }());
        Embedding.SharedAuthoringSessionTokenProvider = SharedAuthoringSessionTokenProvider;
        var PowerAppEndpoints;
        (function (PowerAppEndpoints) {
            function getApiVersion() {
                return "2018-10-01";
            }
            PowerAppEndpoints.getApiVersion = getApiVersion;
            PowerAppEndpoints.providers = "providers/Microsoft.PowerApps";
            PowerAppEndpoints.objectIdsValue = "objectIds";
            PowerAppEndpoints.serverSession = "initiateDocumentServerSession";
        })(PowerAppEndpoints = Embedding.PowerAppEndpoints || (Embedding.PowerAppEndpoints = {}));
    })(Embedding = Authoring.Embedding || (Authoring.Embedding = {}));
})(Authoring || (Authoring = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var Authoring;
(function (Authoring) {
    var Embedding;
    (function (Embedding) {
        var StudioSessionError;
        (function (StudioSessionError) {
            StudioSessionError["STUDIO_WINDOW_OPENING_ERROR"] = "Studio window couldn't be opened.";
            StudioSessionError["STUDIO_SESSION_ESTABLISH_ERROR"] = "Studio authoring session couldn't be established.";
        })(StudioSessionError = Embedding.StudioSessionError || (Embedding.StudioSessionError = {}));
        /**
         * Class to handle a launched/embedded studio view.<br/>
         *
         * @export
         * @class StudioView
         * @extends {EventManager}
         */
        var StudioSession = /** @class */ (function () {
            function StudioSession(_launchedStudioResolver, _launchedStudioRejector, _hostName, _authoringOptions, options) {
                this._launchedStudioResolver = _launchedStudioResolver;
                this._launchedStudioRejector = _launchedStudioRejector;
                this._hostName = _hostName;
                this._authoringOptions = _authoringOptions;
                this._sessionManagerInstance = null;
                /**
                 * Triggered when an studio is ready to receive updates
                 *
                 * @type {EventHook<void>}
                 * @memberof AuthoringView
                 */
                this.studioLaunched = new Core.Embedding.EventHook(this);
                /**
                 * Triggered when the user saves the app
                 *
                 * @type {EventHook<IAppInfo>}
                 * @memberof AuthoringView
                 */
                this.appSaved = new Core.Embedding.EventHook(this);
                /**
                 * Triggered when the user publishes the app
                 *
                 * @type {EventHook<IAppInfo>}
                 * @memberof AuthoringView
                 */
                this.appPublished = new Core.Embedding.EventHook(this);
                /**
                 * Triggered when the app issues a signal
                 *
                 * @type {EventHook<ISendHttpRequestParameters>}
                 * @memberof AuthoringView
                 */
                this.appSignal = new Core.Embedding.EventHook(this);
                this._options = options || {};
                if (!this._options.appId && !this._options.appTemplate) {
                    // Default a template
                    if (this._authoringOptions.hostDataKind === Core.Embedding.DataKind.Table) {
                        // For table we use default list templates
                        this._options.appTemplate = Embedding.TemplatePatterns.list;
                    }
                }
                this._currentAppId = this._options.appId;
                this._studioWindowName = "studio-window-" + (options.appId ? options.appId : Date.now());
                this._sourceName = this._authoringOptions.source || StudioSession.DEFAULT_SOURCE_NAME;
                this._handleAutomationServerEvent = this._handleAutomationServerEvent.bind(this);
                this._checkStudioWindowClosed = this._checkStudioWindowClosed.bind(this);
            }
            /**
             * Spawn a new instance of Studio Session.
             * The returned StudioSession instance can be used to subscribe to events and manipulate bound app data.
             *
             * @static
             * @param {string} [endpoint]
             * @param {IAuthoringEmbeddingOptions} [authoringOptions]
             * @param {IStudioSessionOptions} [options]
             * @returns {Promise<StudioSession>}
             * @memberof StudioSession
             */
            StudioSession.init = function (authoringOptions, options) {
                var _this = this;
                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var session, e_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                session = new StudioSession(resolve, reject, Embedding.StudioUtilities.getBaseStudioUrlFromEndpoint(authoringOptions.endpoint) + "/studio/", authoringOptions, options);
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, session._launchStudioAsync()];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                e_4 = _a.sent();
                                reject();
                                return [2 /*return*/];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
            };
            /**
             * Update the data (replaces previous data)
             * that the current app being edited is bound to.
             *
             * @param {PowerAppsData} data
             * @returns
             * @memberof StudioSession
             */
            StudioSession.prototype.updateData = function (data) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this._automationClient.sendCommandAsync({
                                    type: "SetHostDataCommand",
                                    propertyName: "Data",
                                    propertyValue: data
                                })];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            };
            /**
             *
             * Update the schema of the data (replaces previous schema)
             * that the current app being edited is bound to.
             *
             * @param {PowerAppsSchema} schema
             * @returns
             * @memberof StudioSession
             */
            StudioSession.prototype.updateSchema = function (schema) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this._automationClient.sendCommandAsync({
                                    type: "SetHostSchemaCommand",
                                    propertyName: "Data",
                                    propertySchema: schema
                                })];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            };
            /**
             *
             * Set the schema of a particular message, specified by WADL XML.
             *
             * @param {string} hostDefWadl
             * @returns
             * @memberof StudioSession
             */
            StudioSession.prototype.setHostDefinition = function (hostDefWadl) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this._automationClient.sendCommandAsync({
                                    type: "SetHostDefinitionCommand",
                                    hostDefWadl: hostDefWadl
                                })];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            };
            /**
             * Relaunch the studio window with the last-saved app (if available)
             * or a new blank app.
             *
             * Returns a promise, which when resolved indicates that the studio session
             * is ready to receive updates.
             * @memberof StudioSession
             */
            StudioSession.prototype.relaunchStudio = function () {
                var _this = this;
                if (this._studioWindow && !this._studioWindow.closed) {
                    // this will reopen in a new window
                    this._studioWindow = this._launchUrl(this._studioWindowURLBuilder());
                    return Promise.resolve(this);
                }
                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var e_5;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this._launchedStudioResolver = resolve;
                                this._launchedStudioRejector = reject;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this._launchStudioAsync()];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                e_5 = _a.sent();
                                reject();
                                return [2 /*return*/];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
            };
            /**
             * Dispose the Studio Session. <br/>
             * Runs crucial cleaning-up methods,
             * including disconnecting any open PowerApps Studio Session.
             *
             * @memberof StudioSession
             */
            StudioSession.prototype.dispose = function () {
                if (this._isDisposed) {
                    return;
                }
                this._disposeAutomationClient();
            };
            StudioSession.prototype._disposeAutomationClient = function () {
                var _this = this;
                if (this._automationClient && this._automationClient.isConnected) {
                    this._automationClient.disconnectAsync().then(function () {
                        _this._automationClient.dispose(true);
                        _this._isDisposed = true;
                    });
                }
            };
            StudioSession.prototype._handleLaunchErrors = function () {
                var _this = this;
                if (this._studioWindow === null) {
                    this._launchedStudioRejector(StudioSessionError.STUDIO_WINDOW_OPENING_ERROR);
                    return;
                }
                this._checkStudioWindowClosedInterval = setInterval(function () { _this._checkStudioWindowClosed(); }, 2000);
            };
            StudioSession.prototype._checkStudioWindowClosed = function () {
                if (this._studioWindow && this._studioWindow.closed) {
                    this._launchedStudioRejector(StudioSessionError.STUDIO_WINDOW_OPENING_ERROR);
                    clearInterval(this._checkStudioWindowClosedInterval);
                    this._checkStudioWindowClosedInterval = undefined;
                }
            };
            StudioSession.prototype._launchStudioAsync = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var error_2, baseStudioUrl, signalRHubUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(this._isSourceSessionAllowed(this._authoringOptions.source) &&
                                    this._authoringOptions.endpoint &&
                                    this._authoringOptions.hostIsDesktopApp &&
                                    this._authoringOptions.getAccessToken)) return [3 /*break*/, 5];
                                if (!!this._sessionManagerInstance) return [3 /*break*/, 4];
                                // Create new DocumentServer Session and obtain a session key
                                this._sessionManagerInstance = this.__buildNewDocumentServerInstanceRequest(this._authoringOptions.getAccessToken);
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this._sessionManagerInstance.establishAsync()];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                error_2 = _a.sent();
                                this._launchedStudioRejector(StudioSessionError.STUDIO_SESSION_ESTABLISH_ERROR);
                                return [2 /*return*/];
                            case 4:
                                // Automation Cleanup and Pre-Setup
                                this._appCreated = false;
                                this._handleLaunchErrors();
                                this._disposeAutomationClient();
                                baseStudioUrl = Embedding.StudioUtilities.getBaseStudioUrlFromEndpoint(this._authoringOptions.endpoint);
                                signalRHubUrl = baseStudioUrl + "/api/signalr/automationhub";
                                // Automation Setup
                                this._setupAutomationClient(signalRHubUrl);
                                // When Setup is complete, prompt the host to launch studio url
                                this._launchUrlViaHost(this._studioWindowURLBuilder());
                                return [3 /*break*/, 6];
                            case 5:
                                // Web Host Case
                                // First launch studio url and retain window reference (later steps rely on studio window object)
                                this._studioWindow = this._launchUrl(this._studioWindowURLBuilder());
                                // Automation Cleanup and Pre-Setup
                                this._appCreated = false;
                                this._handleLaunchErrors();
                                this._disposeAutomationClient();
                                // Automation Setup
                                this._setupAutomationClient();
                                _a.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                });
            };
            // Allow list of sources that we permit to request their own WebAuth sessions
            StudioSession.prototype._isSourceSessionAllowed = function (source) {
                return source === "PowerBIIntegration" || source === "Embed SDK Test Page";
            };
            StudioSession.prototype.__buildNewDocumentServerInstanceRequest = function (getAccessToken) {
                // Create a NewInstance of DocumentServer
                var sessionManagerInstance = Embedding.SharedAuthoringSessionManager.instance(getAccessToken, this._authoringOptions.endpoint);
                return sessionManagerInstance;
            };
            StudioSession.prototype._launchUrl = function (url, target) {
                return window.open(url, target ? target : undefined);
            };
            StudioSession.prototype._launchUrlViaHost = function (url, target) {
                if (this._authoringOptions.hostUrlLauncher) {
                    this._authoringOptions.hostUrlLauncher(url);
                }
            };
            StudioSession.prototype._setupAutomationClient = function (signalRHubUrl) {
                var ua = window.navigator.userAgent;
                var isIE = ua.indexOf("MSIE ") >= 0 || ua.indexOf("Trident/") >= 0;
                // If the host is a desktop application, then automation should use a SignalR channel
                // Else, automation should use some form of PostRobot channel
                if (this._authoringOptions.hostIsDesktopApp && this._isSourceSessionAllowed(this._authoringOptions.source) && signalRHubUrl) {
                    DebugContracts.assertValue(this._sessionManagerInstance);
                    var headers = {};
                    headers["x-ms-session-state"] = this._sessionManagerInstance.sessionStateOpaqueString;
                    // AutomationClient sends messages via "SendCommandToStudio" queue and receives messages via "BroadcastEventToSdk" queue
                    this._automationChannel = new UniversalRemote.SignalR.SignalRMessagingChannel(signalRHubUrl, "SendCommandToStudio", "BroadcastEventToSdk", UniversalRemote.HttpTransportType.LongPolling, headers);
                }
                else if (isIE) {
                    this._automationChannel = new UniversalRemote.PostRobot.PostRobotIEMessagingChannel(this._studioWindow, null, Embedding.StudioUtilities.getBaseStudioUrlFromEndpoint(this._authoringOptions.endpoint)
                        + "/global/postMessageBridge?origin=" + window.location.protocol + "//" + window.location.host);
                }
                else {
                    this._automationChannel = new UniversalRemote.PostRobot.PostRobotMessagingChannel(this._studioWindow);
                }
                this._automationClient = new UniversalRemote.AutomationClient(this._automationChannel);
                this._automationClient.onServerEventReceived.attach(this._handleAutomationServerEvent);
                this._automationClient.connectAsync();
            };
            StudioSession.prototype._handleAutomationServerEvent = function (eventArgs) {
                switch (eventArgs.serverEvent.type) {
                    case "ApplicationCreatedEvent":
                        this._onAppCreated();
                        break;
                    case "ApplicationSavedEvent":
                        this._onAppSaved(eventArgs.serverEvent.applicationId);
                        break;
                    case "ApplicationPublishedEvent":
                        this._onAppPublished(eventArgs.serverEvent.applicationId);
                        break;
                    case "ApplicationTriggerEvent":
                        this._onAppSignal(eventArgs.serverEvent.requestParameters);
                        break;
                    default:
                        break;
                }
            };
            StudioSession.prototype._studioWindowURLBuilder = function () {
                var hashParamsSection = this._hashParamsBuilder();
                return "" + this._hostName + hashParamsSection;
            };
            // Subroutine of _studioWindowURLBuilder for query parameter construction.
            // If there are any hash parameters in the studio URL, returns them in a string following "#" and joined by "&" thereafter.
            // If there are none, returns empty string.
            StudioSession.prototype._hashParamsBuilder = function () {
                var _this = this;
                /// 1. INITIALIZE
                var hashParamsExtension = "";
                /// 2. APPEND HASH PARAMETERS AS NECESSARY
                // add app-id if available, otherwise open a blank app
                var appId = this._currentAppId ? this._currentAppId : this._options.appId;
                var newAppAction = this._options.newAppAction ? this._options.newAppAction : "new-blank";
                var editAppAction = this._options.editAppAction ? this._options.editAppAction : "edit";
                if (appId) {
                    hashParamsExtension = "action=" + editAppAction + "&app-id=" + encodeURIComponent(appId);
                }
                else {
                    hashParamsExtension = "action=" + newAppAction;
                }
                // add environment name if available, otherwise allow it to default to current environment
                if (this._options.environmentName) {
                    hashParamsExtension += "&environment-name=" + encodeURIComponent(this._options.environmentName);
                }
                // add source and hosting information
                hashParamsExtension += "&source=" + encodeURIComponent(this._sourceName);
                hashParamsExtension += "&is-hosted=true";
                if (this._options.solutionId) {
                    hashParamsExtension += "&solution-id=" + encodeURIComponent(this._options.solutionId);
                }
                // add canvas app query parameters
                if (this._options.authoringQueryParm) {
                    hashParamsExtension += Object.keys(this._options.authoringQueryParm).map(function (paramKey) { return "&" + encodeURIComponent(paramKey) + "=" + encodeURIComponent(_this._options.authoringQueryParm[paramKey]); }).join('');
                }
                // add desktop hosting/join session information
                var desktopJoinInstanceScenario = this._isSourceSessionAllowed(this._authoringOptions.source) &&
                    this._authoringOptions.hostIsDesktopApp &&
                    this._sessionManagerInstance &&
                    this._sessionManagerInstance.joinToken;
                if (desktopJoinInstanceScenario) {
                    var domainNameQueryParam = this._sessionManagerInstance.regionSpecificDomainName;
                    // Does domain name start with "https://" ? If so, remove it.
                    if (domainNameQueryParam.lastIndexOf("https://", 0) === 0) {
                        domainNameQueryParam = domainNameQueryParam.substring(8);
                    }
                    hashParamsExtension += "&domainName=" + domainNameQueryParam;
                    hashParamsExtension += "&host-is-desktop-app=true";
                    hashParamsExtension += "&join-token=" + this._sessionManagerInstance.joinToken;
                }
                return hashParamsExtension ? "#" + hashParamsExtension : "";
            };
            StudioSession.prototype._onAppCreated = function () {
                var _this = this;
                // stop interval-checking if the studio window was closed
                if (this._checkStudioWindowClosedInterval) {
                    clearInterval(this._checkStudioWindowClosedInterval);
                    this._checkStudioWindowClosedInterval = undefined;
                }
                // return if app was already created
                if (this._appCreated) {
                    return;
                }
                this._appCreated = true;
                // If we have an app template to apply
                // and if the app is new (i.e., no current app_id)
                if (this._options.appTemplate && !this._currentAppId) {
                    this._automationClient
                        .sendCommandAsync({
                        type: "ApplyTemplateCommand",
                        template: this._options.appTemplate
                    })
                        .then(function () {
                        _this.studioLaunched.dispatch();
                        _this._launchedStudioResolver(_this);
                    });
                }
                else {
                    this.studioLaunched.dispatch();
                    this._launchedStudioResolver(this);
                }
            };
            StudioSession.prototype._onAppSaved = function (appId) {
                if (this._currentAppId && this._currentAppId !== appId) {
                    // return if a different app than the one previously saved is saved
                    return;
                }
                this._currentAppId = appId;
                this.appSaved.dispatch(appId);
            };
            StudioSession.prototype._onAppPublished = function (appId) {
                if (this._currentAppId && this._currentAppId !== appId) {
                    // return if a different app than the one previously saved is published
                    return;
                }
                this._currentAppId = appId;
                this.appPublished.dispatch(appId);
            };
            StudioSession.prototype._onAppSignal = function (requestParameters) {
                this.appSignal.dispatch(requestParameters);
            };
            StudioSession.DEFAULT_SOURCE_NAME = "Host";
            return StudioSession;
        }());
        Embedding.StudioSession = StudioSession;
    })(Embedding = Authoring.Embedding || (Authoring.Embedding = {}));
})(Authoring || (Authoring = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var Authoring;
(function (Authoring) {
    var Embedding;
    (function (Embedding) {
        var StudioUtilities;
        (function (StudioUtilities) {
            function getBaseStudioUrlFromEndpoint(endpoint) {
                var baseUrl;
                switch (endpoint) {
                    case Core.Embedding.Endpoint.PROD:
                        baseUrl = "https://create.powerapps.com";
                        break;
                    case Core.Embedding.Endpoint.INT:
                        baseUrl = "https://int.create.powerapps.com";
                        break;
                    case Core.Embedding.Endpoint.TEST:
                        baseUrl = "https://test.create.powerapps.com";
                        break;
                    case Core.Embedding.Endpoint.DEV:
                        baseUrl = "https://local.create.powerapps.com:44300";
                        break;
                    default:
                        baseUrl = "https://create.powerapps.com";
                        break;
                }
                return baseUrl;
            }
            StudioUtilities.getBaseStudioUrlFromEndpoint = getBaseStudioUrlFromEndpoint;
        })(StudioUtilities = Embedding.StudioUtilities || (Embedding.StudioUtilities = {}));
    })(Embedding = Authoring.Embedding || (Authoring.Embedding = {}));
})(Authoring || (Authoring = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var Authoring;
(function (Authoring) {
    var Embedding;
    (function (Embedding) {
        var TemplatePatterns = /** @class */ (function () {
            function TemplatePatterns() {
            }
            Object.defineProperty(TemplatePatterns, "list", {
                // Gets the standard list template pattern
                get: function () {
                    return {
                        name: "Gallery",
                        type: "Gallery",
                        variant: "BrowseLayout_Vertical_OneTextVariant_ver4.0",
                        properties: {
                            "Layout": "Layout.Vertical",
                            "Height": "%Screen%.Height",
                            "Y": "0",
                            "Width": "%Screen%.Width",
                            "X": "0",
                            "Items": "%Host%.Data"
                        }
                    };
                },
                enumerable: true,
                configurable: true
            });
            return TemplatePatterns;
        }());
        Embedding.TemplatePatterns = TemplatePatterns;
    })(Embedding = Authoring.Embedding || (Authoring.Embedding = {}));
})(Authoring || (Authoring = {}));
//# sourceMappingURL=../../../../../obj/Assets/js/AppMagic.Authoring.Sdk.Embedding/index.js.map