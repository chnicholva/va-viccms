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
                    var newPopupId = ContextualEmail.PopupUtility.getPopupId(popupNumber);
                    var content = ContextualEmail.PopupContent.createEmailPopupContent(popupNumber, params);
                    var title = this.createTitle(popupNumber);
                    var newPopup = jsPanel.create({
                        // static properties
                        content: content,
                        dragit: false,
                        iconfont: [ContextualEmail.Constants.SmalifyIcon, ContextualEmail.Constants.UnSmalifyIcon, ContextualEmail.Constants.MinimizeIcon, ContextualEmail.Constants.NormalizeIcon, ContextualEmail.Constants.MaximizeIcon, ContextualEmail.Constants.CloseIcon],
                        resizeit: { disable: true },
                        headerControls: {
                            smallify: "remove",
                            smallifyrev: "remove"
                        },
                        headerTitle: title,
                        rtl: this.getRtlParamForCreatePopup(),
                        // dynamic styling properties
                        contentSize: {
                            width: ContextualEmail.PopupContent.width,
                            height: ContextualEmail.PopupContent.height
                        },
                        position: ContextualEmail.PopupContent.EmailPopupPosition(ContextualEmail.PopupManagerState.Instance.Rtl),
                        // events
                        callback: PopupManager.oncreate,
                        onclosed: PopupManager.onclosed,
                        onfronted: PopupManager.onfronted,
                        onnormalized: PopupManager.onnormalized,
                        onmaximized: PopupManager.onmaximized,
                        onwindowresize: PopupManager.onwindowresize,
                        onbeforeclose: PopupManager.onbeforeclose
                    });
                    newPopup.setAttribute(ContextualEmail.Constants.PopupUniqueIdAttribute, newPopupId);
                    newPopup.setAttribute(ContextualEmail.Constants.PopupNumberAttribute, popupNumber.toString());
                    ContextualEmail.PopupManagerState.Instance.storePopup(newPopupId, newPopup, popupNumber, params);
                    ContextualEmail.PopupMonitor.Instance.AddOrUpdateMonitor();
                };
                PopupManager.createTitle = function (popupNumber) {
                    var titleTemplate = ContextualEmail.PopupManagerState.Instance.ResourceStrings[ContextualEmail.ResourceKeys.PopupTitleTemplate];
                    return titleTemplate;
                };
                PopupManager.getRtlParamForCreatePopup = function () {
                    if (ContextualEmail.PopupManagerState.Instance.Rtl) {
                        return { rtl: true };
                    }
                    return undefined;
                };
                // Events for PopupManager
                /**
                 * Event handler for oncreate of new popup
                 * @param popup
                 */
                PopupManager.oncreate = function (popup) {
                    var popupId = popup.getAttribute(ContextualEmail.Constants.PopupUniqueIdAttribute);
                    PopupManager.minimizeOtherPopups(popupId);
                };
                PopupManager.onclosed = function (popup) {
                    var popupId = popup.getAttribute(ContextualEmail.Constants.PopupUniqueIdAttribute);
                    ContextualEmail.PopupManagerState.Instance.deletePopup(popupId);
                    if (ContextualEmail.PopupManagerState.Instance.ActivePopups === 0) {
                        ContextualEmail.PopupMonitor.Instance.RemoveMonitor();
                    }
                };
                PopupManager.onfronted = function (popup, status) {
                    // TODO: event handling
                };
                /**
                 * Event handler of onnormalized for popup
                 * @param popup
                 * @param status
                 */
                PopupManager.onnormalized = function (popup, status) {
                    var popupId = popup.getAttribute(ContextualEmail.Constants.PopupUniqueIdAttribute);
                    PopupManager.minimizeOtherPopups(popupId);
                };
                /**
                 * Event handler of onmaximized for popup
                 * @param popup
                 * @param status
                 */
                PopupManager.onmaximized = function (popup, status) {
                    var popupId = popup.getAttribute(ContextualEmail.Constants.PopupUniqueIdAttribute);
                    PopupManager.minimizeOtherPopups(popupId);
                };
                /**
                 * Event handler of onwindowresize for popup.
                 * Called when container window size is changed
                 * @param event
                 * @param popup
                 */
                PopupManager.onwindowresize = function (event, popup) {
                    popup.reposition(popup.options.position);
                };
                PopupManager.onbeforeclose = function (popup, status) {
                    var popupId = popup.getAttribute(ContextualEmail.Constants.PopupUniqueIdAttribute);
                    var popupState = ContextualEmail.PopupManagerState.Instance.PopupsDictionary[popupId];
                    if (popupState.canClosePopup) {
                        return true;
                    }
                    else if (popupState.showMessage) {
                        //restore the email page
                        var iframe = document.getElementById(ContextualEmail.PopupUtility.getIframeId(popupState.popupNumber));
                        iframe.contentWindow.location.href = ContextualEmail.PopupUtility.getEmailSrcUrl(popupState.createParams, popupState.emailId);
                        //show unintended click UX
                        ContextualEmail.DialogComponent.showMessageDialog(popupState.popupNumber, ContextualEmail.PopupManagerState.Instance.ResourceStrings[ContextualEmail.ResourceKeys.NavigateAwayDialogTitle], ContextualEmail.PopupManagerState.Instance.ResourceStrings[ContextualEmail.ResourceKeys.NavigateAwayDialogDescription], ContextualEmail.PopupManagerState.Instance.ResourceStrings[ContextualEmail.ResourceKeys.NavigateAwayDialogStayButton], PopupManager.stayButtonClickHandler.bind(this, popupState.popupNumber));
                        // Important to return false to make sure that popup is not closed
                        return false;
                    }
                    else {
                        // Popup closed by user
                        // TODO: check with PM, UX
                        // Closing popup for now
                        return true;
                    }
                };
                PopupManager.stayButtonClickHandler = function (popupNumber) {
                    var popupState = ContextualEmail.PopupManagerState.Instance.PopupsDictionary[ContextualEmail.PopupUtility.getPopupId(popupNumber)];
                    //hide dialog
                    ContextualEmail.DialogComponent.hideMessageDialog(popupNumber);
                    // showMessage status to false
                    popupState.showMessage = false;
                };
                /**
                 * function to minimize popups other than current popup
                 * @param currentPopupId - Id of current popup that should not be mimimized.
                 */
                PopupManager.minimizeOtherPopups = function (currentPopupId) {
                    var popupStates = ContextualEmail.PopupManagerState.Instance.PopupsDictionary;
                    for (var popupId in popupStates) {
                        if (popupId === currentPopupId) {
                            continue;
                        }
                        var popupState = popupStates[popupId];
                        popupState.popup.minimize();
                    }
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
            Constants.IframeNotLoadedPage = "about:blank";
            Constants.EmptyGuid = "00000000-0000-0000-0000-000000000000";
            // HTML element accessors
            Constants.PopupIdPrefix = "EmailPopup_";
            Constants.PopupUniqueIdAttribute = "email-popup-id";
            Constants.PopupNumberAttribute = "email-popup-number";
            Constants.PopupMainDivIdPrefix = "EmailPopupMainDiv_";
            Constants.PopupIframeIdPrefix = "EmailPopupIframe_";
            Constants.PopupDialogIdPrefix = "EmailDialogIframe_";
            Constants.PopupDialogStyleIdPrefix = "EmailPopupDialogStyle_";
            Constants.PopupDialogTitleIdPrefix = "EmailPopupDialogTitle_";
            Constants.PopupDialogDescIdPrefix = "EmailPopupDialogDesc_";
            Constants.PopupDialogButtonIdPrefix = "EmailPopupDialogButton_";
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
            // Interval in milli second for popup monitoring
            Constants.PopupMonitorInterval = 300;
            // Query parameters
            Constants.PageTypeQueryParam = "pagetype";
            Constants.EntityTypeQueryParam = "etn";
            Constants.EntityIdQueryParam = "id";
            // Page types
            Constants.PageTypeEntityForm = "entityrecord";
            Constants.PageTypeDashboard = "dashboard";
            Constants.PageTypeGrid = "entitylist";
            // Entity names
            Constants.EmailEntity = "email";
            Constants.AttachmentEntity = "activitymimeattachment";
            // Popup Icons Style class names
            Constants.SmalifyIcon = "";
            Constants.UnSmalifyIcon = "";
            Constants.NormalizeIcon = "PopupNormalized-symbol";
            Constants.MaximizeIcon = "PopupMaximize-symbol";
            Constants.MinimizeIcon = "PopupMiminize-symbol";
            Constants.CloseIcon = "PopupClose-symbol";
            // MDD dialog Names
            Constants.MaximumPopupsAlertDialog = "MaximumPopupsAlert";
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
            /**
             * This class defines the content and styling for the Dialog
             */
            var DialogComponent = (function () {
                function DialogComponent() {
                }
                /**
                 * Create UX messaging inline in popup
                 */
                DialogComponent.createMessageContent = function (id) {
                    var dialogContainer = document.createElement("div");
                    dialogContainer.style.visibility = "hidden";
                    dialogContainer.id = ContextualEmail.PopupUtility.getDialogContainerId(id);
                    dialogContainer.className = ContextualEmail.Constants.PopupDialogStyleIdPrefix + "ModelDialog";
                    var dialogContent = document.createElement("div");
                    dialogContent.id = ContextualEmail.PopupUtility.getDialogContainerId(id) + "ContentContainer";
                    dialogContent.className = ContextualEmail.Constants.PopupDialogStyleIdPrefix + "ModelDialog-content";
                    var headerContainer = document.createElement("div");
                    headerContainer.id = ContextualEmail.PopupUtility.getDialogContainerId(id) + "_headerContainer";
                    headerContainer.className = ContextualEmail.Constants.PopupDialogStyleIdPrefix + "ModelDialogHeader";
                    var dialogHeader = document.createElement("h1");
                    dialogHeader.id = ContextualEmail.PopupUtility.getDialogTitleId(id);
                    dialogHeader.className = ContextualEmail.Constants.PopupDialogStyleIdPrefix + "ModelDialogTitle";
                    headerContainer.appendChild(dialogHeader);
                    dialogContent.appendChild(headerContainer);
                    var descContainer = document.createElement("div");
                    descContainer.id = ContextualEmail.PopupUtility.getDialogContainerId(id) + "_DescContainer";
                    descContainer.className = ContextualEmail.Constants.PopupDialogStyleIdPrefix + "ModelDialogDescription";
                    var dialogDesc = document.createElement("p");
                    dialogDesc.id = ContextualEmail.PopupUtility.getDialogDescId(id);
                    dialogDesc.className = ContextualEmail.Constants.PopupDialogStyleIdPrefix + "ModelDialogDescription";
                    descContainer.appendChild(dialogDesc);
                    dialogContent.appendChild(descContainer);
                    var footerContainer = document.createElement("div");
                    footerContainer.id = ContextualEmail.PopupUtility.getDialogContainerId(id) + "footerContainer";
                    footerContainer.className = ContextualEmail.Constants.PopupDialogStyleIdPrefix + "ModelDialogFooter";
                    var button = document.createElement("button");
                    button.id = ContextualEmail.PopupUtility.getDialogButtonId(id);
                    button.className = ContextualEmail.Constants.PopupDialogStyleIdPrefix + "ModelDialogButton";
                    footerContainer.appendChild(button);
                    dialogContent.appendChild(footerContainer);
                    dialogContainer.appendChild(dialogContent);
                    return dialogContainer;
                };
                DialogComponent.showMessageDialog = function (id, title, description, button1Title, button1Handler) {
                    var dialogContainer = document.getElementById(ContextualEmail.PopupUtility.getDialogContainerId(id));
                    var dialogTitle = document.getElementById(ContextualEmail.PopupUtility.getDialogTitleId(id));
                    dialogTitle.innerText = title;
                    var dialogDesc = document.getElementById(ContextualEmail.PopupUtility.getDialogDescId(id));
                    dialogDesc.innerText = description;
                    var dialogButton = document.getElementById(ContextualEmail.PopupUtility.getDialogButtonId(id));
                    dialogButton.title = button1Title;
                    dialogButton.innerText = button1Title;
                    dialogButton.onclick = button1Handler;
                    dialogButton.focus();
                    dialogContainer.style.visibility = "visible";
                };
                DialogComponent.hideMessageDialog = function (id) {
                    var dialogContainer = document.getElementById(ContextualEmail.PopupUtility.getDialogContainerId(id));
                    dialogContainer.style.visibility = "hidden";
                };
                return DialogComponent;
            }());
            ContextualEmail.DialogComponent = DialogComponent;
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
            var IframeState;
            (function (IframeState) {
                IframeState[IframeState["ValidEmailForm"] = 0] = "ValidEmailForm";
                IframeState[IframeState["IntendendClick"] = 1] = "IntendendClick";
                IframeState[IframeState["UnintendedClick"] = 2] = "UnintendedClick";
                IframeState[IframeState["NotAccessible"] = 3] = "NotAccessible";
                IframeState[IframeState["NotLoaded"] = 4] = "NotLoaded";
            })(IframeState = ContextualEmail.IframeState || (ContextualEmail.IframeState = {}));
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
                    var emailsrc = ContextualEmail.PopupUtility.getEmailSrcUrl(params);
                    var emailIframe = document.createElement("iframe");
                    emailIframe.id = ContextualEmail.PopupUtility.getIframeId(id);
                    emailIframe.src = emailsrc;
                    emailIframe.width = "100%";
                    emailIframe.height = "100%";
                    var message = ContextualEmail.DialogComponent.createMessageContent(id);
                    var mainDiv = document.createElement("div");
                    mainDiv.id = ContextualEmail.PopupUtility.getMainDivId(id);
                    mainDiv.style.width = "100%";
                    mainDiv.style.height = "100%";
                    mainDiv.style.display = "flex";
                    mainDiv.appendChild(emailIframe);
                    mainDiv.appendChild(message);
                    return mainDiv;
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
                Object.defineProperty(PopupManagerState.prototype, "ActivePopups", {
                    get: function () {
                        return this.activePopups;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PopupManagerState.prototype, "PopupsDictionary", {
                    get: function () {
                        return this.popups;
                    },
                    enumerable: true,
                    configurable: true
                });
                PopupManagerState.prototype.generateNewPopupId = function () {
                    return this.newPopupId++;
                };
                PopupManagerState.prototype.storePopup = function (id, popup, popupNumber, createParams) {
                    this.activePopups++;
                    this.popups[id] = new PopupState(popup, popupNumber, createParams);
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
            var PopupState = (function () {
                function PopupState(popup, popupNumber, createParams) {
                    this.canClosePopup = false;
                    this.showMessage = false;
                    this.isLoaded = false;
                    this.popup = popup;
                    this.popupNumber = popupNumber;
                    this.createParams = createParams;
                }
                return PopupState;
            }());
            ContextualEmail.PopupState = PopupState;
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
             * Monitors the state of popups and does appropriate state management
             */
            var PopupMonitor = (function () {
                function PopupMonitor() {
                    this._timer = null;
                    this._shouldMonitor = false;
                    this._monitorFunctionBound = this.MonitorInternal.bind(this);
                }
                Object.defineProperty(PopupMonitor, "Instance", {
                    get: function () {
                        if (!this._instance) {
                            this._instance = new PopupMonitor();
                        }
                        return this._instance;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * If monitor is inactive, adds a new monitor cycle
                 */
                PopupMonitor.prototype.AddOrUpdateMonitor = function () {
                    if (!this._shouldMonitor) {
                        this._shouldMonitor = true;
                        this.setNextMonitorCycle();
                    }
                };
                /**
                 * Removes monitor cycle chain
                 */
                PopupMonitor.prototype.RemoveMonitor = function () {
                    if (this._timer) {
                        window.clearTimeout(this._timer);
                        this._timer = null;
                    }
                    this._shouldMonitor = false;
                };
                /**
                 * Set next cycle of monitoring
                 */
                PopupMonitor.prototype.setNextMonitorCycle = function () {
                    if (this._shouldMonitor) {
                        this._timer = window.setTimeout(this._monitorFunctionBound, ContextualEmail.Constants.PopupMonitorInterval);
                    }
                };
                /**
                 * The actual function to be invoked for monitoring
                 */
                PopupMonitor.prototype.MonitorInternal = function () {
                    var popups = ContextualEmail.PopupManagerState.Instance.PopupsDictionary;
                    for (var popupId in popups) {
                        var popupState = popups[popupId];
                        var iframeState = this.CheckIframeState(popupState);
                        switch (iframeState) {
                            case ContextualEmail.IframeState.IntendendClick:
                                popupState.canClosePopup = true;
                                popupState.showMessage = false;
                                this.ClosePopup(popupState.popup);
                                break;
                            case ContextualEmail.IframeState.UnintendedClick:
                                popupState.canClosePopup = false;
                                if (!popupState.showMessage) {
                                    popupState.showMessage = true;
                                    this.ClosePopup(popupState.popup);
                                }
                                break;
                            case ContextualEmail.IframeState.NotAccessible:
                                // TODO: check with PM and UX
                                // Closing the popup for now
                                popupState.canClosePopup = true;
                                popupState.showMessage = false;
                                this.ClosePopup(popupState.popup);
                                break;
                            case ContextualEmail.IframeState.NotLoaded:
                                // Do nothing
                                break;
                            case ContextualEmail.IframeState.ValidEmailForm:
                                popupState.isLoaded = true;
                                break;
                        }
                    }
                    this.setNextMonitorCycle();
                };
                PopupMonitor.prototype.ClosePopup = function (popup) {
                    setTimeout(function () { return popup.close(); }, 0);
                };
                PopupMonitor.prototype.CheckIframeState = function (popupState) {
                    var popupNumber = popupState.popupNumber;
                    var iframe = document.getElementById(ContextualEmail.PopupUtility.getIframeId(popupNumber));
                    if (iframe && iframe.contentWindow) {
                        try {
                            var iframeHref = iframe.contentWindow.location.href;
                            if (!popupState.isLoaded && iframeHref === ContextualEmail.Constants.IframeNotLoadedPage) {
                                return ContextualEmail.IframeState.NotLoaded;
                            }
                            var iframeQueryString = iframe.contentWindow.location.search;
                            var iframeParams = ContextualEmail.Utils.getQueryParams(iframeQueryString);
                            var entityId = iframeParams[ContextualEmail.Constants.EntityIdQueryParam];
                            var iframeState = this.CheckStateBasedOnQueryParams(iframeParams);
                            if (iframeState === ContextualEmail.IframeState.ValidEmailForm && !popupState.emailId && !ContextualEmail.Utils.isNullOrEmptyGuid(entityId)) {
                                popupState.emailId = entityId;
                            }
                            return iframeState;
                        }
                        catch (e) {
                            // Iframe is not accessible. The iframe href is not a valid Dynamics 365 URL
                            return ContextualEmail.IframeState.NotAccessible;
                        }
                    }
                    return ContextualEmail.IframeState.NotAccessible;
                };
                PopupMonitor.prototype.CheckStateBasedOnQueryParams = function (queryParams) {
                    var pageType = queryParams[ContextualEmail.Constants.PageTypeQueryParam];
                    var entityType = queryParams[ContextualEmail.Constants.EntityTypeQueryParam];
                    if (pageType && pageType.length > 0) {
                        switch (pageType) {
                            case ContextualEmail.Constants.PageTypeEntityForm:
                                if (entityType && entityType === ContextualEmail.Constants.EmailEntity) {
                                    return ContextualEmail.IframeState.ValidEmailForm;
                                }
                                // If user has accidentally clicked on a lookup record
                                return ContextualEmail.IframeState.UnintendedClick;
                            case ContextualEmail.Constants.PageTypeDashboard:
                                // Default sitemap behaviour
                                return ContextualEmail.IframeState.IntendendClick;
                            case ContextualEmail.Constants.PageTypeGrid:
                                if (PopupMonitor.EntityGridsUnintendedClick.indexOf(entityType) >= 0) {
                                    return ContextualEmail.IframeState.UnintendedClick;
                                }
                                // Assuming that customer has customized the sitemap
                                // This can happen if entity grid is put ahead of dashboards
                                return ContextualEmail.IframeState.IntendendClick;
                            default:
                                // When page type is something else, we're assuming it is intended click
                                // This happens when customer has customized sitemap with a different URL
                                return ContextualEmail.IframeState.IntendendClick;
                        }
                    }
                    // If pageType parameter is not found assuming it's not a valid Dynamics URL
                    return ContextualEmail.IframeState.NotAccessible;
                };
                return PopupMonitor;
            }());
            // Attachment grid is opened from 'See all records' button click
            // Bug 1495368
            PopupMonitor.EntityGridsUnintendedClick = [ContextualEmail.Constants.AttachmentEntity];
            ContextualEmail.PopupMonitor = PopupMonitor;
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
             * Popup Content utility class
             */
            var PopupUtility = (function () {
                function PopupUtility() {
                }
                // Element accessors
                PopupUtility.getPopupId = function (id) {
                    return "" + ContextualEmail.Constants.PopupIdPrefix + id;
                };
                PopupUtility.getMainDivId = function (id) {
                    return "" + ContextualEmail.Constants.PopupMainDivIdPrefix + id;
                };
                PopupUtility.getIframeId = function (id) {
                    return "" + ContextualEmail.Constants.PopupIframeIdPrefix + id;
                };
                PopupUtility.getDialogTitleId = function (id) {
                    return "" + ContextualEmail.Constants.PopupDialogTitleIdPrefix + id;
                };
                PopupUtility.getDialogDescId = function (id) {
                    return "" + ContextualEmail.Constants.PopupDialogDescIdPrefix + id;
                };
                PopupUtility.getDialogButtonId = function (id) {
                    return "" + ContextualEmail.Constants.PopupDialogButtonIdPrefix + id;
                };
                PopupUtility.getDialogContainerId = function (id) {
                    return "" + ContextualEmail.Constants.PopupDialogIdPrefix + id;
                };
                PopupUtility.getEmailSrcUrl = function (createParams, emailId) {
                    var appId = encodeURIComponent(ContextualEmail.Utils.formatGuid(createParams.appId));
                    var dataParams = encodeURIComponent(JSON.stringify(createParams.dataParams));
                    var formId = encodeURIComponent(ContextualEmail.Utils.formatGuid(createParams.emailFormId));
                    var emailSrc = window.location.protocol + "//" + window.location.host + window.location.pathname + "?appId=" + appId + "&pagetype=entityrecord&etn=email&formid=" + formId + "&navbar=off";
                    if (emailId) {
                        emailId = encodeURIComponent(ContextualEmail.Utils.formatGuid(emailId));
                        emailSrc = emailSrc + ("&id=" + emailId);
                    }
                    else {
                        emailSrc = emailSrc + ("&data=" + dataParams);
                    }
                    return emailSrc;
                };
                return PopupUtility;
            }());
            ContextualEmail.PopupUtility = PopupUtility;
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
            ResourceKeys.NavigateAwayDialogTitle = "NavigateAwayDialogTitle";
            ResourceKeys.NavigateAwayDialogDescription = "NavigateAwayDialogDescription";
            ResourceKeys.NavigateAwayDialogStayButton = "NavigateAwayDialogStayButton";
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
                    if (id && id.length > 0 && typeof id === "string") {
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
                Utils.parseInt = function (str) {
                    return parseInt(str);
                };
                Utils.getQueryParams = function (queryString) {
                    var parsedParams = {};
                    if (queryString && queryString.length > 0 && queryString.charAt(0) === '?') {
                        queryString = queryString.substr(1);
                        var queryParams = queryString.split('&');
                        queryParams.forEach(function (queryParam) {
                            var keyValuePair = queryParam.split('=');
                            if (keyValuePair && keyValuePair.length === 2) {
                                parsedParams[keyValuePair[0]] = keyValuePair[1];
                            }
                        });
                    }
                    return parsedParams;
                };
                Utils.isNullOrEmptyGuid = function (guid) {
                    if (guid && guid.length > 0) {
                        guid = ContextualEmail.Utils.formatGuid(guid);
                        return guid === ContextualEmail.Constants.EmptyGuid;
                    }
                    return true;
                };
                return Utils;
            }());
            ContextualEmail.Utils = Utils;
        })(ContextualEmail = AppCommon.ContextualEmail || (AppCommon.ContextualEmail = {}));
    })(AppCommon = MscrmControls.AppCommon || (MscrmControls.AppCommon = {}));
})(MscrmControls || (MscrmControls = {}));
