/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
var MscrmControls;
(function (MscrmControls) {
    var AppCommon;
    (function (AppCommon) {
        var ContextualEmail;
        (function (ContextualEmail) {
            'use strict';
            var PopupManager = (function () {
                function PopupManager() {
                }
                /**
                 * Initialize PopupManager with given params
                 * @param params Parameters
                 * @returns Boolean indicating whether PopupManager was already initialized or not
                 */
                PopupManager.init = function (params) {
                    return ContextualEmail.PopupManagerState.init(params);
                };
                /**
                 * Checks whether a new popup can be created in current state
                 */
                PopupManager.canCreateNewPopup = function () {
                    return ContextualEmail.PopupManagerState.Instance.canCreateNewPopup();
                };
                /**
                 * Creates a new popup with given params
                 * @param params Parameters for opening the popup
                 */
                PopupManager.createNewPopup = function (params) {
                    if (!this.canCreateNewPopup()) {
                        throw ContextualEmail.PopupManagerState.Instance.ResourceStrings[ContextualEmail.ResourceKeys.MaxPopupsLimitReached];
                    }
                    var popupNumber = ContextualEmail.PopupManagerState.Instance.generateNewPopupId();
                    var newPopupId = ContextualEmail.PopupContent.getPopupId(popupNumber);
                    var content = ContextualEmail.PopupContent.createEmailPopupContent(popupNumber, params);
                    var title = this.createTitle(popupNumber);
                    var newPopup = jsPanel.create({
                        // static properties
                        content: content,
                        dragit: false,
                        resizeit: { disable: true },
                        headerControls: {
                            smallify: "remove",
                            smallifyrev: "remove"
                        },
                        headerTitle: title,
                        rtl: {
                            rtl: ContextualEmail.PopupManagerState.Instance.Rtl
                        },
                        // dynamic styling properties
                        contentSize: {
                            width: ContextualEmail.PopupContent.width,
                            height: ContextualEmail.PopupContent.height
                        },
                        position: ContextualEmail.PopupContent.EmailPopupPosition(ContextualEmail.PopupManagerState.Instance.Rtl),
                        // events
                        onclosed: PopupManager.onclosed,
                        onfronted: PopupManager.onfronted,
                        onnormalized: PopupManager.onnormalized,
                        onwindowresize: PopupManager.onwindowresize
                    });
                    newPopup.setAttribute(ContextualEmail.Constants.PopupUniqueIdAttribute, newPopupId);
                    newPopup.setAttribute(ContextualEmail.Constants.PopupNumberAttribute, popupNumber.toString());
                    ContextualEmail.PopupManagerState.Instance.storePopup(newPopupId, newPopup);
                };
                PopupManager.createTitle = function (popupNumber) {
                    var titleTemplate = ContextualEmail.PopupManagerState.Instance.ResourceStrings[ContextualEmail.ResourceKeys.PopupTitleTemplate];
                    return titleTemplate;
                };
                // Events for PopupManager
                PopupManager.onclosed = function (popup) {
                    var popupId = popup.getAttribute(ContextualEmail.Constants.PopupUniqueIdAttribute);
                    ContextualEmail.PopupManagerState.Instance.deletePopup(popupId);
                };
                PopupManager.onfronted = function (popup, status) {
                    // TODO: event handling
                };
                PopupManager.onnormalized = function (popup, status) {
                    // TODO: event handling
                };
                PopupManager.onwindowresize = function (event, popup) {
                    // TODO: event handling
                };
                return PopupManager;
            }());
            ContextualEmail.PopupManager = PopupManager;
        })(ContextualEmail = AppCommon.ContextualEmail || (AppCommon.ContextualEmail = {}));
    })(AppCommon = MscrmControls.AppCommon || (MscrmControls.AppCommon = {}));
})(MscrmControls || (MscrmControls = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="PopupManager.ts" /> 
var MscrmControls;
(function (MscrmControls) {
    var AppCommon;
    (function (AppCommon) {
        var ContextualEmail;
        (function (ContextualEmail) {
            'use strict';
            var Constants = (function () {
                function Constants() {
                }
                return Constants;
            }());
            Constants.MaxPopups = 3;
            Constants.EmailPopupFormId = "b54ca399-eaa6-45f8-83f2-c268b0021087";
            // HTML element accessors
            Constants.PopupIdPrefix = "EmailPopup_";
            Constants.PopupUniqueIdAttribute = "email-popup-id";
            Constants.PopupNumberAttribute = "email-popup-number";
            Constants.PopupMainDivIdPrefix = "EmailPopupMainDiv_";
            Constants.PopupIframeIdPrefix = "EmailPopupIframe_";
            // Email form auto-fill params
            Constants.ParentRecordId = "parentrecordid";
            Constants.ParentRecordType = "parentrecordtype";
            Constants.ParentRecordName = "parentrecordname";
            Constants.ToAttributeName = "to";
            Constants.FromAttributeName = "from";
            // Email content constants
            Constants.RtlPositioning = "left-bottom 20 0";
            Constants.LtrPositioning = "right-bottom -0 -20";
            Constants.Popupwidth = 840;
            Constants.PopupHeight = 600;
            ContextualEmail.Constants = Constants;
        })(ContextualEmail = AppCommon.ContextualEmail || (AppCommon.ContextualEmail = {}));
    })(AppCommon = MscrmControls.AppCommon || (MscrmControls.AppCommon = {}));
})(MscrmControls || (MscrmControls = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
var MscrmControls;
(function (MscrmControls) {
    var AppCommon;
    (function (AppCommon) {
        var ContextualEmail;
        (function (ContextualEmail) {
            'use strict';
        })(ContextualEmail = AppCommon.ContextualEmail || (AppCommon.ContextualEmail = {}));
    })(AppCommon = MscrmControls.AppCommon || (MscrmControls.AppCommon = {}));
})(MscrmControls || (MscrmControls = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
var MscrmControls;
(function (MscrmControls) {
    var AppCommon;
    (function (AppCommon) {
        var ContextualEmail;
        (function (ContextualEmail) {
            'use strict';
            /**
             * This class defines the content and styling for the email popup
             */
            var PopupContent = (function () {
                function PopupContent() {
                }
                /**
                 * Get positioning of popup w.r.t the viewport
                 * @param isRtl
                 */
                PopupContent.EmailPopupPosition = function (isRtl) {
                    return isRtl ? ContextualEmail.Constants.RtlPositioning : ContextualEmail.Constants.LtrPositioning;
                };
                Object.defineProperty(PopupContent, "width", {
                    get: function () {
                        return ContextualEmail.Constants.Popupwidth;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PopupContent, "height", {
                    get: function () {
                        return ContextualEmail.Constants.PopupHeight;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Create conent for a new popup window
                 * @param id
                 * @param params
                 */
                PopupContent.createEmailPopupContent = function (id, params) {
                    var appId = encodeURIComponent(ContextualEmail.Utils.formatGuid(params.appId));
                    var dataParams = encodeURIComponent(JSON.stringify(params.dataParams));
                    var formId = encodeURIComponent(ContextualEmail.Utils.formatGuid(params.emailFormId));
                    var emailsrc = window.location.protocol + "//" + window.location.host + window.location.pathname + "?appId=" + appId + "&pagetype=entityrecord&etn=email&formid=" + formId + "&navbar=off&data=" + dataParams;
                    var emailIframe = document.createElement("iframe");
                    emailIframe.id = this.getIframeId(id);
                    emailIframe.src = emailsrc;
                    emailIframe.width = "100%";
                    emailIframe.height = "100%";
                    var message = this.createMessageContent();
                    var mainDiv = document.createElement("div");
                    mainDiv.id = this.getMainDivId(id);
                    mainDiv.style.width = "100%";
                    mainDiv.style.height = "100%";
                    mainDiv.appendChild(emailIframe);
                    mainDiv.appendChild(message);
                    return mainDiv;
                };
                /**
                 * Create UX messaging inline in popup
                 */
                PopupContent.createMessageContent = function () {
                    // TODO: add UX for messaging here
                    var confirmDiv = document.createElement("div");
                    confirmDiv.style.visibility = "none";
                    return confirmDiv;
                };
                // Element accessors
                PopupContent.getPopupId = function (id) {
                    return "" + ContextualEmail.Constants.PopupIdPrefix + id;
                };
                PopupContent.getMainDivId = function (id) {
                    return "" + ContextualEmail.Constants.PopupMainDivIdPrefix + id;
                };
                PopupContent.getIframeId = function (id) {
                    return "" + ContextualEmail.Constants.PopupIframeIdPrefix + id;
                };
                return PopupContent;
            }());
            ContextualEmail.PopupContent = PopupContent;
        })(ContextualEmail = AppCommon.ContextualEmail || (AppCommon.ContextualEmail = {}));
    })(AppCommon = MscrmControls.AppCommon || (MscrmControls.AppCommon = {}));
})(MscrmControls || (MscrmControls = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
var MscrmControls;
(function (MscrmControls) {
    var AppCommon;
    (function (AppCommon) {
        var ContextualEmail;
        (function (ContextualEmail) {
            'use strict';
            var PopupManagerState = (function () {
                function PopupManagerState(params) {
                    this.rtl = params.rtl;
                    this.maxPopus = params.maxPopups;
                    this.resourceStrings = params.resourceStrings;
                    this.activePopups = this.newPopupId = 0;
                    this.popups = {};
                }
                Object.defineProperty(PopupManagerState, "Instance", {
                    get: function () {
                        return this._instance;
                    },
                    enumerable: true,
                    configurable: true
                });
                PopupManagerState.init = function (params) {
                    if (!this._instance) {
                        this._instance = new PopupManagerState(params);
                        return true;
                    }
                    return false;
                };
                Object.defineProperty(PopupManagerState.prototype, "Rtl", {
                    get: function () {
                        return this.rtl;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PopupManagerState.prototype, "ResourceStrings", {
                    get: function () {
                        return this.resourceStrings;
                    },
                    enumerable: true,
                    configurable: true
                });
                PopupManagerState.prototype.generateNewPopupId = function () {
                    return this.newPopupId++;
                };
                PopupManagerState.prototype.storePopup = function (id, popup) {
                    this.activePopups++;
                    this.popups[id] = popup;
                };
                PopupManagerState.prototype.canCreateNewPopup = function () {
                    return this.activePopups < this.maxPopus;
                };
                PopupManagerState.prototype.deletePopup = function (id) {
                    this.activePopups--;
                    delete this.popups[id];
                };
                return PopupManagerState;
            }());
            PopupManagerState._instance = null;
            ContextualEmail.PopupManagerState = PopupManagerState;
        })(ContextualEmail = AppCommon.ContextualEmail || (AppCommon.ContextualEmail = {}));
    })(AppCommon = MscrmControls.AppCommon || (MscrmControls.AppCommon = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var AppCommon;
    (function (AppCommon) {
        var ContextualEmail;
        (function (ContextualEmail) {
            /**
             * Class refers to the path of all the keys for localization
             */
            var ResourceKeys = (function () {
                function ResourceKeys() {
                }
                return ResourceKeys;
            }());
            ResourceKeys.MaxPopupsLimitReached = "MaxPopupsLimitReached";
            ResourceKeys.PopupTitleTemplate = "PopupTitleTemplate";
            ContextualEmail.ResourceKeys = ResourceKeys;
        })(ContextualEmail = AppCommon.ContextualEmail || (AppCommon.ContextualEmail = {}));
    })(AppCommon = MscrmControls.AppCommon || (MscrmControls.AppCommon = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var AppCommon;
    (function (AppCommon) {
        var ContextualEmail;
        (function (ContextualEmail) {
            'use strict';
            var Utils = (function () {
                function Utils() {
                }
                Utils.formatGuid = function (id) {
                    if (id && id.length > 0) {
                        if (id.charAt(0) == "{") {
                            id = id.substr(1);
                        }
                        if (id.charAt(id.length - 1) == '}') {
                            id = id.substr(0, id.length - 1);
                        }
                    }
                    return id;
                };
                Utils.parseJson = function (json) {
                    try {
                        if (json && json.length > 0) {
                            return JSON.parse(json);
                        }
                    }
                    catch (e) { }
                    return null;
                };
                return Utils;
            }());
            ContextualEmail.Utils = Utils;
        })(ContextualEmail = AppCommon.ContextualEmail || (AppCommon.ContextualEmail = {}));
    })(AppCommon = MscrmControls.AppCommon || (MscrmControls.AppCommon = {}));
})(MscrmControls || (MscrmControls = {}));
