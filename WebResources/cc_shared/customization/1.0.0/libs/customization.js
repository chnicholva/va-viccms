var customization =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/PCFControlContext.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PCFControlContext; });
/* harmony import */ var _PCFCustomization__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/PCFCustomization.ts");
/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */

class PCFControlContext {
    constructor(syncService, instanceId) {
        this.syncService = syncService;
        this.instanceId = instanceId;
        this.getProperties = async () => {
            return await this.syncService
                .send({
                instanceId: this.instanceId,
                type: _PCFCustomization__WEBPACK_IMPORTED_MODULE_0__["CustomizationSyncMessageType"].CustomizationSyncMessage,
                actionName: _PCFCustomization__WEBPACK_IMPORTED_MODULE_0__["CustomizationAction"].GetProperties,
                actionData: {}
            })
                .then((result) => {
                if (result && result.actionData) {
                    const actionData = result.actionData;
                    return actionData.properties;
                }
                return;
            })
                // tslint:disable-next-line:no-any
                .catch(() => {
                // TODO: Log telemetry here
                return;
            });
        };
        this.setProperties = async (properties) => {
            return await this.syncService
                .send({
                instanceId: this.instanceId,
                type: _PCFCustomization__WEBPACK_IMPORTED_MODULE_0__["CustomizationSyncMessageType"].CustomizationSyncMessage,
                actionName: _PCFCustomization__WEBPACK_IMPORTED_MODULE_0__["CustomizationAction"].SetProperties,
                actionData: { properties }
            })
                .then((result) => {
                return result.success;
            })
                // tslint:disable-next-line:no-any
                .catch(() => {
                // TODO: Log telemetry here
                return false;
            });
        };
        this.getPropertyValueFromModel = async (propertyName) => {
            return await this.syncService
                .send({
                instanceId: this.instanceId,
                type: _PCFCustomization__WEBPACK_IMPORTED_MODULE_0__["CustomizationSyncMessageType"].CustomizationSyncMessage,
                actionName: _PCFCustomization__WEBPACK_IMPORTED_MODULE_0__["CustomizationAction"].GetPropertyValueFromModel,
                actionData: { formModelPropertyName: propertyName }
            })
                .then((result) => {
                if (result && result.actionData) {
                    const actionData = result.actionData;
                    return actionData.formModelPropertyName;
                }
                return '';
            })
                // tslint:disable-next-line:no-any
                .catch(() => {
                // TODO: Log telemetry here
                return '';
            });
        };
        this.setPropertyValueInModel = async (propertyName, value) => {
            return await this.syncService
                .send({
                instanceId: this.instanceId,
                type: _PCFCustomization__WEBPACK_IMPORTED_MODULE_0__["CustomizationSyncMessageType"].CustomizationSyncMessage,
                actionName: _PCFCustomization__WEBPACK_IMPORTED_MODULE_0__["CustomizationAction"].SetPropertyValueInModel,
                actionData: {
                    formModelPropertyName: propertyName,
                    formModelPropertyValue: value
                }
            })
                .then((result) => {
                return result.success;
            })
                // tslint:disable-next-line:no-any
                .catch(() => {
                // TODO: Log telemetry here
                return false;
            });
        };
    }
}


/***/ }),

/***/ "./src/PCFCustomization.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ../cds-sync-channel/lib/SyncChannel.js
/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */
var SyncMessageTypes;
(function (SyncMessageTypes) {
    SyncMessageTypes[SyncMessageTypes["SyncMessageRequest"] = 0] = "SyncMessageRequest";
    SyncMessageTypes[SyncMessageTypes["SyncMessageResponse"] = 1] = "SyncMessageResponse";
    SyncMessageTypes[SyncMessageTypes["HandshakeRequest"] = 2] = "HandshakeRequest";
    SyncMessageTypes[SyncMessageTypes["HandshakeAck"] = 3] = "HandshakeAck";
})(SyncMessageTypes || (SyncMessageTypes = {}));
function log(displayName, message) {
    // tslint:disable-next-line:no-console
    console.log('Channel:' + displayName + ' => ' + message);
}
class SyncChannel {
    constructor(channelId, targetDomain, displayName, targetWindow) {
        this._outboundMessageHandlers = {};
        this._targetDomain = targetDomain;
        this._channelId = channelId;
        this._targetWindow = targetWindow;
        this._displayName = displayName;
        this._messageHandler = undefined;
        this.Ready = new Promise((resolve, reject) => {
            this._onReady = { resolve, reject };
        });
        this._outboundMessageId = 1;
        this.listener = (event) => {
            if (!this.validateMessageOrigin(event)) {
                return;
            }
            if (event.data && event.data.messageType !== undefined) {
                const message = event.data;
                log(this._displayName, 'received message of type' + message.messageType);
                switch (message.messageType) {
                    // is this handshake message from right window?
                    case SyncMessageTypes.HandshakeRequest:
                        if (message.messageData && message.messageData.channelId === this._channelId) {
                            log(this._displayName, 'Received handshake request for channel' + message.messageData.channelId);
                            // this handshake is coming from correct iframe
                            // tslint:disable-next-line:no-any
                            this._targetWindow = event.source;
                            // send ack and resolve ready
                            const handshakeack = this.createMessage({
                                channelId: this._channelId
                            }, SyncMessageTypes.HandshakeAck);
                            handshakeack.sourceId = message.messageId;
                            this._send(handshakeack);
                            this._onReady.resolve('');
                        }
                        break;
                    // handshake initiated by this window was ack by target windo
                    case SyncMessageTypes.HandshakeAck:
                        if (message.messageData &&
                            message.messageData.channelId === this._channelId &&
                            message.sourceId &&
                            this._outboundMessageHandlers[message.sourceId]) {
                            this._outboundMessageHandlers[message.sourceId].resolve(message.messageData);
                            this._onReady.resolve('');
                        }
                        break;
                    case SyncMessageTypes.SyncMessageRequest:
                        // process the request
                        log(this._displayName, 'Received sync message request ' + message.messageId);
                        const responsePromise = this._messageHandler.call({}, message.messageData);
                        // tslint:disable-next-line:no-any
                        responsePromise.then((response) => {
                            const outboundMessage = this.createMessage(response, SyncMessageTypes.SyncMessageResponse);
                            outboundMessage.sourceId = message.messageId;
                            log(this._displayName, 'Sending response' + outboundMessage.messageId);
                            this._send(outboundMessage);
                        });
                        break;
                    case SyncMessageTypes.SyncMessageResponse:
                        // resolve the pending source message promise
                        if (message.sourceId && this._outboundMessageHandlers[message.sourceId]) {
                            log(this._displayName, ' received response for request' + message.sourceId);
                            this._outboundMessageHandlers[message.sourceId].resolve(message.messageData);
                            delete this._outboundMessageHandlers[message.sourceId];
                        }
                        break;
                    default:
                        throw new Error('Unsupported message type');
                }
            }
        };
        window.addEventListener('message', this.listener);
        if (targetWindow) {
            // we are given a window to communicate to which might be ready. Initiate handshake
            this.handshake(); // to do -  allow for failure after a timeout
        }
    }
    teardown() {
        window.removeEventListener('message', this.listener);
    }
    ChannelId() {
        return this._channelId;
    }
    // tslint:disable-next-line:no-any
    send(messageData) {
        return this.Ready.then(() => {
            const outboundMessage = this.createMessage(messageData, SyncMessageTypes.SyncMessageRequest);
            const responsePromise = new Promise((resolve, reject) => {
                this._outboundMessageHandlers[outboundMessage.messageId] = {
                    resolve,
                    reject
                };
            });
            log(this._displayName, 'sending message of type ' + outboundMessage.messageType);
            this._send(outboundMessage);
            return responsePromise;
        });
    }
    // tslint:disable-next-line:no-any
    onReceive(messageHandler) {
        this._messageHandler = messageHandler;
    }
    validateMessageOrigin(event) {
        if (this._targetDomain === '*') {
            return true;
        }
        /**
         * Check the correct domain.
         * Input targetDomain could have trailing "/",
         * remove possible trailing slash for targetDomain, and for event.origin in case
         */
        if (this.removeTrailingSlash(event.origin) !== this.removeTrailingSlash(this._targetDomain)) {
            // TODO extract out the origin base
            return false;
        }
        return true;
    }
    removeTrailingSlash(url) {
        return url.replace(/\/$/, '');
    }
    handshake() {
        const messageData = { channelId: this._channelId };
        const outboundMessage = this.createMessage(messageData, SyncMessageTypes.HandshakeRequest);
        const responsePromise = new Promise((resolve, reject) => {
            this._outboundMessageHandlers[outboundMessage.messageId] = {
                resolve,
                reject
            };
        });
        this._send(outboundMessage);
        return responsePromise;
    }
    // tslint:disable-next-line:no-any
    createMessage(message, messagetype) {
        const messageId = this._outboundMessageId++;
        const messageData = message;
        const messageType = messagetype;
        return {
            messageId,
            messageType,
            messageData
        };
    }
    _send(message) {
        if (this._targetWindow) {
            this._targetWindow.postMessage(message, this._targetDomain);
        }
        else {
            throw new Error('lost the target window');
        }
    }
}
//# sourceMappingURL=SyncChannel.js.map
// EXTERNAL MODULE: ./src/PCFControlContext.ts
var PCFControlContext = __webpack_require__("./src/PCFControlContext.ts");

// CONCATENATED MODULE: ./src/PCFCustomization.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomizationSyncMessageType", function() { return CustomizationSyncMessageType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomizationAction", function() { return CustomizationAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PCFCustomization_PCFCustomization; });
/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */


var CustomizationSyncMessageType;
(function (CustomizationSyncMessageType) {
    CustomizationSyncMessageType["CustomizationSyncMessage"] = "CustomizationSyncMessage";
})(CustomizationSyncMessageType || (CustomizationSyncMessageType = {}));
var CustomizationAction;
(function (CustomizationAction) {
    CustomizationAction["Init"] = "Init";
    CustomizationAction["GetProperties"] = "GetProperties";
    CustomizationAction["SetProperties"] = "SetProperties";
    CustomizationAction["GetPropertyValueFromModel"] = "GetPropertyValueFromModel";
    CustomizationAction["SetPropertyValueInModel"] = "SetPropertyValueInModel";
})(CustomizationAction || (CustomizationAction = {}));
// tslint:disable-next-line:no-unnecessary-class
class PCFCustomization_PCFCustomization {
    static init(
    // tslint:disable-next-line:no-any
    onInit) {
        // TODO: Replace the * with a domain
        const syncService = new SyncChannel('customization channel', '*', 'CustomControl_channel', window.parent);
        const pcfControlContextMap = {};
        const handleRequest = async (request) => {
            if (request &&
                request.type === CustomizationSyncMessageType.CustomizationSyncMessage &&
                request.actionName &&
                request.instanceId) {
                switch (request.actionName) {
                    case CustomizationAction.Init:
                        let customControlInfo;
                        let instanceId;
                        if (request.actionData) {
                            const actionData = request.actionData;
                            if (actionData.customControlInfo) {
                                instanceId = request.instanceId;
                                customControlInfo = actionData.customControlInfo;
                            }
                            else {
                                return Promise.resolve({
                                    instanceId: request.instanceId,
                                    type: CustomizationSyncMessageType.CustomizationSyncMessage,
                                    actionName: request.actionName,
                                    actionData: {},
                                    success: false,
                                    error: `no control info`
                                });
                            }
                            const context = new PCFControlContext["default"](syncService, instanceId);
                            pcfControlContextMap[instanceId] = context;
                            return Promise.resolve({
                                instanceId: request.instanceId,
                                type: CustomizationSyncMessageType.CustomizationSyncMessage,
                                actionName: request.actionName,
                                actionData: {},
                                success: await onInit(context, customControlInfo)
                            });
                        }
                        return Promise.resolve({
                            instanceId: request.instanceId,
                            type: CustomizationSyncMessageType.CustomizationSyncMessage,
                            actionName: request.actionName,
                            actionData: {},
                            success: false,
                            error: `no action data`
                        });
                    default:
                        return Promise.resolve({
                            instanceId: request.instanceId,
                            type: CustomizationSyncMessageType.CustomizationSyncMessage,
                            actionName: request.actionName,
                            actionData: {},
                            success: false,
                            error: `unknown request action type ${request.actionName}`
                        });
                }
            }
            return Promise.reject({});
        };
        syncService.onReceive(handleRequest.bind(this));
    }
}


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./src/PCFControlContext.ts");
module.exports = __webpack_require__("./src/PCFCustomization.ts");


/***/ })

/******/ });

window.PCFCustomization = window.customization.default;