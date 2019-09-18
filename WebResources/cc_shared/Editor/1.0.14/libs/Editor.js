"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var TraceLevel = MktSvc.Controls.Common.TraceLevel;
    var Dictionary = MktSvc.Controls.Common.Dictionary;
    var jSanityContentSanitizer = ControlsCommon.Utils.jSanityContentSanitizer;
    var DefaultExecutionContext = /** @class */ (function () {
        function DefaultExecutionContext(localizationProvider, logger, cdnPath, customization, libsFolder, configurationProvider, isShimApplication, maximumNumberOfBlocksOnCanvas) {
            this.localizationProvider = localizationProvider;
            this.logger = logger;
            this.cdnPath = cdnPath;
            this.configurationProvider = configurationProvider;
            this.isShimApplication = isShimApplication;
            this.maximumNumberOfBlocksOnCanvas = maximumNumberOfBlocksOnCanvas || 0;
            if (Object.isNullOrUndefined(libsFolder)) {
                this.libsFolder = String.Empty;
            }
            else {
                this.libsFolder = libsFolder;
            }
            this.customization = customization || new Editor.EditorCustomization();
            this.configurationProvider = configurationProvider;
            this.contentSanitizer = new jSanityContentSanitizer(this.getLibsPath(), Editor.ContentSanitizerContract.supportedAttributes);
        }
        /**
         * @see IEditorExecutionContext.getLocalizationProvider
         */
        DefaultExecutionContext.prototype.getLocalizationProvider = function () {
            return this.localizationProvider;
        };
        /**
         * @see IEditorExecutionContext.getLogger
         */
        DefaultExecutionContext.prototype.getLogger = function () {
            return this.logger;
        };
        /**
         * @see IEditorExecutionContext.getDelaySchedulerTime
         */
        DefaultExecutionContext.prototype.getDelaySchedulerTime = function () {
            return 1000; // tslint:disable-line
        };
        /**
         * @see IEditorExecutionContext.getBasePath
         */
        DefaultExecutionContext.prototype.getBasePath = function () {
            return this.cdnPath;
        };
        /**
         * @see IEditorExecutionContext.getLibsPath
         */
        DefaultExecutionContext.prototype.getLibsPath = function () {
            return this.cdnPath + "/" + this.libsFolder;
        };
        /**
         * @see IEditorExecutionContext.getContentSanitizer
         */
        DefaultExecutionContext.prototype.getContentSanitizer = function () {
            return this.contentSanitizer;
        };
        /**
         * @see IEditorExecutionContext.getMaximumNumberOfBlocksOnCanvas
         */
        DefaultExecutionContext.prototype.getMaximumNumberOfBlocksOnCanvas = function () {
            return this.maximumNumberOfBlocksOnCanvas;
        };
        /**
         * @see IPreviewContext.isSandboxed
         */
        DefaultExecutionContext.prototype.isSandboxed = function () {
            return true;
        };
        /**
         * @see IPreviewContext.shouldPreviewBeSanitized
         */
        DefaultExecutionContext.prototype.shouldPreviewBeSanitized = function () {
            return true;
        };
        /**
         * @see IPreviewContext.shouldLinksBeEnabled
         */
        DefaultExecutionContext.prototype.shouldLinksBeEnabled = function () {
            return false;
        };
        /**
         * @see IEditorExecutionContext.getConfigurationProvider
         */
        DefaultExecutionContext.prototype.getConfigurationProvider = function () {
            return this.configurationProvider;
        };
        /**
         * @see IEditorExecutionContext.isShimApp
         */
        DefaultExecutionContext.prototype.isShimApp = function () {
            if (Object.isNullOrUndefined(this.isShimApplication)) {
                return false;
            }
            return this.isShimApplication;
        };
        /**
         * @see IEditorExecutionContext.isFocused
         */
        DefaultExecutionContext.prototype.isFocused = function () {
            return false;
        };
        /**
         * @see IEditorExecutionContext.tryExecute
         */
        DefaultExecutionContext.prototype.tryExecute = function (action, event, throwError, onErrorAction, additionalData) {
            var eventName = "Editor.DefaultExecutionContext.tryExecute";
            var eventData = Object.isNullOrUndefined(additionalData) ? new Dictionary() : additionalData;
            eventData.addOrUpdate("EventName", event);
            try {
                this.getLogger().log(TraceLevel.Info, eventName, eventData);
                action();
                this.getLogger().log(TraceLevel.Info, eventName + ".successful", eventData);
            }
            catch (e) {
                eventData.addOrUpdate("Exception", e.stack);
                this.getLogger().log(TraceLevel.Error, eventName, eventData);
                if (Editor.CommonUtils.isFunction(onErrorAction)) {
                    onErrorAction(e);
                }
                if (throwError) {
                    throw e;
                }
            }
        };
        /**
         * @see IEditorExecutionContext.getCustomizations
         */
        DefaultExecutionContext.prototype.getCustomizations = function () {
            return this.customization;
        };
        /**
         * @see IEditorExecutionContext.dispose
         */
        DefaultExecutionContext.prototype.dispose = function () {
            this.contentSanitizer.dispose();
            this.contentSanitizer = null;
            this.localizationProvider = null;
            this.logger = null;
        };
        return DefaultExecutionContext;
    }());
    Editor.DefaultExecutionContext = DefaultExecutionContext;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var CkEditorCommand = /** @class */ (function () {
        function CkEditorCommand() {
        }
        CkEditorCommand.prototype.setupCkEditor = function (ckEditorProxy) {
            this.ckEditorProxy = ckEditorProxy;
        };
        return CkEditorCommand;
    }());
    Editor.CkEditorCommand = CkEditorCommand;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    /** Renders the popup container using the jquery */
    var PopupRenderer = /** @class */ (function () {
        function PopupRenderer() {
            this.okButon = "[OK]";
            this.cancelButon = "[Cancel]";
        }
        PopupRenderer.prototype.setup = function (eventBroker) {
            this.eventBroker = eventBroker;
        };
        /** Renders the popup */
        PopupRenderer.prototype.render = function (title, onOkClick, onCancelClick, showButtons, cssClass, width, height) {
            var _this = this;
            var popup = $("<div></div>");
            popup.attr("title", title);
            this.popupId = UniqueId.generate();
            Editor.CommonUtils.setId(popup, this.popupId);
            var popupButtons = [];
            if (showButtons) {
                popupButtons = [
                    {
                        text: Editor.CommonUtils.getLocalizedString(this.cancelButon),
                        title: Editor.CommonUtils.getLocalizedString(this.cancelButon),
                        class: PopupRenderer.cancelButtonCssClassName,
                        click: function (event) {
                            if (!Object.isNullOrUndefined(onCancelClick)) {
                                onCancelClick();
                            }
                            _this.close();
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    },
                    {
                        class: PopupRenderer.okButtonCssClassName,
                        text: Editor.CommonUtils.getLocalizedString(this.okButon),
                        title: Editor.CommonUtils.getLocalizedString(this.okButon),
                        click: function (event) {
                            var status = onOkClick();
                            if (status) {
                                _this.close();
                            }
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    }
                ];
            }
            var dialogCssClass = Object.isNullOrUndefined(cssClass)
                ? Editor.CommonConstants.popupCssClassName
                : String.Format("{0} {1}", cssClass, Editor.CommonConstants.popupCssClassName);
            this.dialog = popup.dialog({
                autoOpen: true,
                modal: true,
                dialogClass: dialogCssClass,
                width: "auto",
                height: "auto",
                close: function (event) {
                    if (!Object.isNullOrUndefined(onCancelClick)) {
                        onCancelClick();
                    }
                    _this.close();
                    event.stopPropagation();
                    event.preventDefault();
                },
                buttons: popupButtons
            });
            this.dialog.css({ "min-width": "350px" });
            this.dialog.css({ width: width || "auto" });
            this.dialog.css({ height: height || "auto" });
            $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.popupCssClassName) +
                "," + Editor.CommonUtils.getClassSelector(Editor.CommonConstants.overlayCssClassName)).click(function (event) {
                event.stopPropagation();
                event.preventDefault();
            });
            this.editorVisibilityChangedHandler = function (eventArgs) {
                if (!eventArgs.isVisible) {
                    _this.close();
                }
            };
            this.eventBroker.subscribe(Editor.EventConstants.editorVisibilityChanged, this.editorVisibilityChangedHandler);
            return this.popupId;
        };
        PopupRenderer.prototype.close = function () {
            if (!Object.isNullOrUndefined(this.popupId) && Editor.CommonUtils.getById(this.popupId).length > 0) {
                this.dialog.dialog("destroy").remove();
            }
            this.dialog = null;
        };
        PopupRenderer.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.eventBroker)) {
                this.eventBroker.unsubscribe(Editor.EventConstants.editorVisibilityChanged, this.editorVisibilityChangedHandler);
                this.editorVisibilityChangedHandler = null;
            }
            this.close();
        };
        PopupRenderer.okButtonCssClassName = "editorPopupOkButton";
        PopupRenderer.cancelButtonCssClassName = "editorPopupCancelButton";
        return PopupRenderer;
    }());
    Editor.PopupRenderer = PopupRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="commonreferences.ts" />
var Editor;
(function (Editor) {
    /** Defines the base class for control renderer. */
    var Control = /** @class */ (function () {
        /** Initializes a new instance of type
        * @param element - parent element
        */
        function Control(elementId) {
            this.id = elementId;
        }
        /**
        * Initializes the view - renders the view and/or attach proper event to render/refresh the view content
        */
        Control.prototype.init = function (eventBroker) {
            this.eventBroker = eventBroker;
        };
        /**
        * Activates the view - the view becomes visible
        */
        Control.prototype.activate = function () {
            this.isActive = true;
        };
        /**
        * Dectivates the view - the view becomes invisible
        */
        Control.prototype.deactivate = function () {
            this.isActive = false;
        };
        /**
        * Disposes the object - removes the html from the page, empty the  objects and detach the events
        */
        Control.prototype.dispose = function () {
        };
        /** Gets the parent element
         * @returns jquery element
         */
        Control.prototype.getElement = function () {
            return Editor.CommonUtils.getById(this.id);
        };
        return Control;
    }());
    Editor.Control = Control;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    /**
     * Common utility methods
     */
    var CommonUtils = /** @class */ (function () {
        function CommonUtils() {
        }
        /**
         * Gets name of class (RTL or LTR) according to language direction.
         */
        CommonUtils.getLangDirectionClass = function () {
            return this.localizationProvider.isRtl() ? Editor.CommonConstants.rightToLeftTextDirectionCssClass : Editor.CommonConstants.leftToRightTextDirectionCssClass;
        };
        /**
         * Get JQuery element(s) by id
         * @param id - element id
         * @param $rootElement The root - where to start from (e.g. in a test to verify explicitly)
         */
        CommonUtils.getById = function (id, $rootElement) {
            return CommonUtils.getBySelector("#" + id, $rootElement);
        };
        /**
         * Sets JQuery element(s)'s id
         * @param element - element
         * @param id - the id to set
         */
        CommonUtils.setId = function (element, id) {
            if (element) {
                element.attr("id", id);
            }
        };
        /**
         * Get JQuery element(s)'s id
         * @param element - element
         */
        CommonUtils.getId = function (element) {
            // Use native implementation to prevent "Object expected" errors in Edge when JQuery context is undefined
            return element && element.get(0) ? element.get(0).id : String.Empty;
        };
        /**
         * Get JQuery element(s) by class name
         * @param className The class to look for
         * @param $rootElement The root - where to start from (e.g. in a test to verify explicitly)
         */
        CommonUtils.getByClass = function (className, $rootElement) {
            return CommonUtils.getBySelector(CommonUtils.getClassSelector(className), $rootElement);
        };
        /**
         * Get CSS class selector from class name
         * @param className
         */
        CommonUtils.getClassSelector = function (className) {
            return String.Format(".{0}", className);
        };
        /**
         * Get CSS not class selector from class name
         * @param className
         */
        CommonUtils.getNotClassSelector = function (className) {
            return String.Format(":not(.{0})", className);
        };
        /**
         * Returns the attribute selector as a string
         * @param attrName
         */
        CommonUtils.getAttrSelector = function (attrName) {
            return String.Format("[{0}]", attrName);
        };
        /**
         * Returns the "attribute equals value" selector as a string
         * @param attrName
         * @param value
         */
        CommonUtils.getAttrEqualsSelector = function (attrName, value) {
            return String.Format("[{0}='{1}']", attrName, value);
        };
        /**
         * Sets element(s) content editable attribute to true
         * @param element - element to make content editable
         */
        CommonUtils.setEditable = function (element) {
            return element ? element.attr("contenteditable", "true") : $();
        };
        /**
         * Sets element(s) content editable attribute to false
         * @param element - element to make content *non*editable
         */
        CommonUtils.setNonEditable = function (element) {
            return element ? element.attr("contenteditable", "false") : $();
        };
        /**
         * Removes the element(s) esitable flags.
         * @param element - to remve the editable flags
         */
        CommonUtils.removeEditable = function (element) {
            return element ? element.removeAttr("contenteditable") : $();
        };
        /**
         * Removes the element(s) class attribute
         * @param element - element to remove the class attribute
         * @param className - name of class to remove
         */
        CommonUtils.removeClass = function (element, className) {
            if (!element) {
                return;
            }
            element.removeClass(className);
            if (String.isNullOrWhitespace(element.attr("class"))) {
                element.removeAttr("class");
            }
        };
        /* Returns the localized string for the string resource- id.
         * @param element - to remve the editable flags
         */
        CommonUtils.getLocalizedString = function (resource) {
            if (!CommonUtils.localizationProvider) {
                throw new Error("CommonUtils.getLocalizedString:ILocalizationProvider has not been initialized.");
            }
            return CommonUtils.localizationProvider.getLocalizedString(resource);
        };
        /**
         * Returns the localized string for the string key - id, in case of offline mode.
         */
        CommonUtils.getOfflineLocalizedString = function (key) {
            if (!CommonUtils.localizationProvider) {
                throw new Error("CommonUtils.getLocalizedString:ILocalizationProvider has not been initialized.");
            }
            return Editor.OfflineMessages.getLocalizedString(key, CommonUtils.localizationProvider.getLocaleId());
        };
        /**
         * Returns the editor id from the block.
         * @param block - block element.
         */
        CommonUtils.getEditorIdFromBlock = function (block) {
            return this.getEditorFromBlock(block).attr("id");
        };
        /**
         * Returns the editor element from the block.
         * @param block - block element.
         */
        CommonUtils.getEditorFromBlock = function (block) {
            return block ? block.find("[contenteditable]") : $();
        };
        /**
         * Create a style element with the specified CSS and id.
         * @param css The CSS.
         * @param id The id.
         */
        CommonUtils.createStyleElementFromCode = function (id, css, doc) {
            var curDocument = doc || document;
            var stylesElement = curDocument.createElement("style");
            var textNode = document.createTextNode(css);
            stylesElement.id = id;
            stylesElement.appendChild(textNode);
            return stylesElement;
        };
        /**
         * Create a style element with the specified CSS and id.
         * @param href The url.
         * @param id The id.
         */
        CommonUtils.createLinkElementFromUrl = function (id, href, doc) {
            var curDocument = doc || document;
            var link = curDocument.createElement("link");
            link.id = id;
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = href;
            return link;
        };
        /**
         * Create a style element with the specified url and id.
         * @param url The url.
         * @param id The id.
         */
        CommonUtils.createScriptElementFromUrl = function (id, url, doc) {
            var curDocument = doc || document;
            var scriptElement = curDocument.createElement("script");
            scriptElement.setAttribute("type", "text/javascript");
            scriptElement.setAttribute("src", url);
            scriptElement.setAttribute("id", id);
            return scriptElement;
        };
        /**
         * Search accross the dom, including iframes.
         * @param selector The selector.
         * @param $rootElement The root - where to start from.
         * @param resultCollection - The result collection.
         */
        CommonUtils.getBySelector = function (selector, $rootElement) {
            if (!$rootElement) {
                $rootElement = $(document); // tslint:disable-line
            }
            // Result collection
            var $resultCollection = $();
            var $queue = $($rootElement);
            var currentIndex = 0;
            while (currentIndex < $queue.length) {
                // Start with the current element and move the index in the queue
                var currentElement = $($queue[currentIndex]);
                currentIndex++;
                // Loop through all frames (.layoutFrameClassName to narrow down scope) and add it to the queue
                $queue = $queue.add(currentElement.find(CommonUtils.getClassSelector(Editor.CommonConstants.layoutFrameClassName)).contents());
                // Select all elements matching the selector under the root
                $resultCollection = $resultCollection.add(currentElement.find(selector));
            }
            return $resultCollection;
        };
        /**
         * Checks if the browser used is firefox.
         **/
        CommonUtils.isFirefox = function () {
            return (navigator.userAgent.indexOf("Firefox") !== -1 && navigator.userAgent.indexOf("Trident/") === -1);
        };
        /**
         * Checks if the variable is function.
         **/
        CommonUtils.isFunction = function (variable) {
            return typeof variable === "function";
        };
        /**
        * Checks if jQuery object is defined.
        **/
        CommonUtils.isElementDefined = function (block) {
            return block && block.length > 0;
        };
        /**
         * Write the content in the iframe element.
         * @param iframe The iframe.
         * @param html The html content.
         */
        CommonUtils.writeFrameContent = function (iframe, html) {
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(String.isNullOrWhitespace(html) ? String.Empty : html);
            iframe.contentWindow.document.close();
        };
        /**
         * Returns a well formed html from the iframe content document.
         * @param iframe The iframe.
         */
        CommonUtils.getFrameContent = function (iframe) {
            return CommonUtils.getWithDoctype(CommonUtils.getDocType(iframe.contentDocument) + iframe.contentDocument.documentElement.outerHTML);
        };
        /**
         * Returns the doc type of the document.
         * @param document The document
         */
        CommonUtils.getDocType = function (document) {
            return !document || !document.doctype ? String.Empty : new XMLSerializer().serializeToString(document.doctype);
        };
        /**
         * Returns the doc type from a html string.
         * @param html The html containing the doctype
         */
        CommonUtils.getDocTypeFromString = function (html) {
            var doctype = String.Empty;
            var doctypeIndex = html.toLowerCase().indexOf("<!doctype");
            if (doctypeIndex >= 0) {
                var iframeIndex = html.toLowerCase().indexOf("iframe");
                // If doctype is inside an iframe - we should ignore it as it's not this document's doctype
                if (iframeIndex === -1 || doctypeIndex < iframeIndex) {
                    var doctypeLength = html.indexOf(">", doctypeIndex) - doctypeIndex + 1;
                    doctype = html.substr(doctypeIndex, doctypeLength);
                }
            }
            return doctype;
        };
        /**
         * Returns the html of the document and ensures there is DOCTYPE tag to it.
         * @param document The document
         */
        CommonUtils.getWithDoctype = function (html) {
            if (String.isNullOrWhitespace(html)) {
                return html;
            }
            if (CommonUtils.isContentContainingDoctype(html)) {
                // Already has a doctype declaration
                return html;
            }
            return "<!DOCTYPE html>" + html;
        };
        /**
         * Returns the HTML document with a specific content.
         * @param html The document content
         */
        CommonUtils.getNewContentDocument = function (html) {
            var contentDocument = document.implementation.createHTMLDocument(String.Empty);
            CommonUtils.writeDocumentContent(contentDocument, html);
            return contentDocument;
        };
        /**
         * Returns the html of the document and ensures there is DOCTYPE tag to it.
         * @param document The document
         */
        CommonUtils.getDocumentContent = function (document, docType) {
            var content = document.documentElement.outerHTML;
            if (!String.isNullUndefinedOrWhitespace(docType) && !CommonUtils.isContentContainingDoctype(content)) {
                content = docType + content;
            }
            return content;
        };
        /**
         * Returns the html of the document and ensures there is DOCTYPE tag to it.
         * @param document The document
         * @param html The content
         */
        CommonUtils.writeDocumentContent = function (document, html) {
            if (html || html === String.Empty) {
                document.documentElement.innerHTML = html;
            }
        };
        /**
         * Sets tab index for the element
         * @param element - element
         * @param tabIndex - the tab index to set
         */
        CommonUtils.setTabIndex = function (element, tabIndex) {
            element.attr("tabindex", tabIndex);
        };
        /**
         * Get normalized value of boolean attribute
         * @param element - the element
         * @param attributeName - the boolean attribute name
         * @param defaultValue - the default value (true by default)
         */
        CommonUtils.getNormalizedBooleanAttributeValue = function (element, attributeName, defaultValue) {
            var defaultValueString = defaultValue === undefined
                ? Editor.CommonConstants.normalizedBooleanTrue
                : defaultValue
                    ? Editor.CommonConstants.normalizedBooleanTrue
                    : Editor.CommonConstants.normalizedBooleanFalse;
            var dataValue = element.attr(attributeName)
                ? element.attr(attributeName).trim().toLowerCase()
                : defaultValueString;
            return dataValue !== Editor.CommonConstants.normalizedBooleanTrue && dataValue !== Editor.CommonConstants.normalizedBooleanFalse
                ? defaultValueString
                : dataValue;
        };
        /**
         * Get normalized value of track attribute
         * @param element - the element
         */
        CommonUtils.getNormalizedTrackAttributeValue = function (element) {
            var attributeValue = CommonUtils.getNormalizedBooleanAttributeValue(element, Editor.CommonConstants.dataTrackAttributeName);
            return CommonUtils.convertNormalizedBooleanToTrackAttributeValue(attributeValue);
        };
        /**
         * Converts normalized boolean attribute value to normalized track attribute value.
         * @param element - the normalized boolean attribute value
         */
        CommonUtils.convertNormalizedBooleanToTrackAttributeValue = function (booleanAttributeValue) {
            return booleanAttributeValue === Editor.CommonConstants.normalizedBooleanTrue
                ? null
                : booleanAttributeValue;
        };
        /**
         * Gets link with default protocol if current link does not contain protocols
         * @param link The input link
         */
        CommonUtils.getLinkWithProtocol = function (link) {
            if (!String.isNullUndefinedOrWhitespace(link) &&
                !(Editor.CommonConstants.protocolRegex.exec(link.toLowerCase()))) {
                return Editor.CommonConstants.defaultProtocol + link.toLowerCase();
            }
            return link;
        };
        CommonUtils.setRole = function (element, role) {
            if (element) {
                element.attr("role", role);
            }
        };
        CommonUtils.setAriaAttribute = function (element, ariaAttrName, ariaAttrValue) {
            if (element) {
                element.attr(ariaAttrName, ariaAttrValue);
            }
        };
        CommonUtils.isVisible = function (elemment) {
            return elemment ? elemment.is(":visible") : false;
        };
        CommonUtils.isContentContainingDoctype = function (content) {
            return content.toLowerCase().indexOf("<!doctype") !== -1;
        };
        CommonUtils.overlayBlockElement = function (block, activeElement, overlayImageSource) {
            CommonUtils.removeBlockOverlay(block);
            block.append(this.createOverlay(overlayImageSource).attr("contenteditable", "false"));
            activeElement.addClass(Editor.CommonConstants.designerOverlayHiddenElementCssClassName);
        };
        CommonUtils.overlayImageElement = function (image, overlayImageSource) {
            image.attr("src", overlayImageSource).css("max-width", "125px").addClass(Editor.CommonConstants.designerUnconfiguredContentOverlayCssClassName);
        };
        CommonUtils.createOverlay = function (overlayImageSource) {
            var overlayIcon = $("<img>").addClass(Editor.CommonConstants.unconfiguredOverlayIconCssClassName).attr("src", overlayImageSource).css("max-width", "125px");
            var overlay = $("<div></div>").addClass(Editor.CommonConstants.designerUnconfiguredContentOverlayCssClassName);
            overlay.append(overlayIcon);
            return overlay;
        };
        CommonUtils.removeBlockOverlay = function (block) {
            if (CommonUtils.getByClass(Editor.CommonConstants.designerUnconfiguredContentOverlayCssClassName, block).length > 0) {
                CommonUtils.getByClass(Editor.CommonConstants.designerUnconfiguredContentOverlayCssClassName, block).remove();
                CommonUtils.removeClass(CommonUtils.getByClass(Editor.CommonConstants.designerOverlayHiddenElementCssClassName, block), Editor.CommonConstants.designerOverlayHiddenElementCssClassName);
            }
        };
        CommonUtils.removeImageOverlay = function (image) {
            image.attr("src", image.attr(Editor.CommonConstants.designerImageSourceAttributeName));
            image.css("max-width", String.Empty);
            image.removeClass(Editor.CommonConstants.designerUnconfiguredContentOverlayCssClassName);
        };
        CommonUtils.walkTree = function (node, visit) {
            var _this = this;
            var children = node.children();
            children.each(function (i, c) { _this.walkTree($(c), visit); });
            visit(node);
        };
        CommonUtils.getComments = function (element) {
            var currentNode;
            var comments = [];
            //IE 11 throws "TypeError: Argument not optional" when not initialized with 4 input parameters
            var iterator = this.isInternetExplorer()
                ? document.createNodeIterator(element, NodeFilter.SHOW_COMMENT, null, false)
                : document.createNodeIterator(element, NodeFilter.SHOW_COMMENT);
            while ((currentNode = iterator.nextNode())) {
                comments.push(currentNode);
            }
            return comments;
        };
        CommonUtils.isInternetExplorer = function () {
            return this.getInternetExplorerVersion() > -1;
        };
        CommonUtils.isEdge = function () {
            return /edge/.test(navigator.userAgent.toLowerCase());
        };
        CommonUtils.isIOS = function () {
            return /(ipad|iphone|ipod)/.test(navigator.userAgent.toLowerCase()) && !window.MSStream;
        };
        CommonUtils.isHighContrastModeEnabled = function () {
            // Create a test div and set background color
            var initialColor = "rgb(255, 0, 0)";
            var indicatorElement = $("<div>").css("background-color", initialColor).height(0).width(0);
            // Append element into body and inspect color
            $(document).find("body").append(indicatorElement);
            var actualColor = indicatorElement.css("background-color");
            indicatorElement.remove();
            // Browser is in high contrast mode if inline background color was changed for indicator element
            if (actualColor !== initialColor) {
                return true;
            }
            return false;
        };
        /**
         * Returns the version of Internet Explorer or a -1
         * (indicating the use of another browser).
         */
        CommonUtils.getInternetExplorerVersion = function () {
            var rv = -1;
            var ua = navigator.userAgent;
            if (navigator.appName === "Microsoft Internet Explorer") {
                var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null) {
                    rv = parseFloat(RegExp.$1);
                }
                return rv;
            }
            if (!!ua.match(/Trident\/7\./)) {
                rv = 11; // tslint:disable-line
            }
            return rv;
        };
        /**
         * Returns domain with port and protocol from URL
         * @param url source URL
         */
        CommonUtils.getDomainFromUrl = function (url) {
            var anchor = document.createElement("a");
            anchor.href = url;
            // This line needed for IE which returns protocol and port in all cases
            var port = !anchor.port || (anchor.port === "443" && anchor.protocol === "https:") || (anchor.port === "80" && anchor.protocol === "http:") ? String.Empty : ":" + anchor.port;
            return anchor.protocol && anchor.hostname ? anchor.protocol + "//" + anchor.hostname + port : String.Empty;
        };
        /**
         * Adds elements to content head.
         */
        CommonUtils.appendElementToHead = function (content, element) {
            content.find("head").append(element);
        };
        /**
         * Returns the localized placeholder for the image.
         */
        CommonUtils.getLocalizedImagePlaceholder = function () {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAykAAAJZCAIAAAAiXe1IAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAACf1SURBVHhe7d0te+PKlrDh9///nQOmgYnJEIM2MAkxCfCAHGBiYjCvrp11+upJK+msRNaqKt03Oh97dy87lvzYqqj+3/8CALAW7QUAsB7tBQCwHu0FALAe7QUAsB7tBQCwHu0FALAe7QUAsB7tBQCwHu0FALAe7QUAsB7tBQCwHu0FALAe7QUAsB7tBQCwHu0FALAe7QUAsB7tBQCwHu0FALAe7QUAsB7tBQCwHu0FALAe7QUAsB7tBQCwHu0FALAe7QUAsB7tBQCwnse21xMAQLciaBb12Pb6FwBAtyJoFqW9AADmRdAsSnsBAMyLoFmU9gIAmBdBsyjtBQAwL4JmUdoLAGBeBM2itBcAwLwImkVpLwCAeRE0i9JeAADzImgWpb0AAOZF0CxKewEAzIugWZT2AgCYF0GzKO0FADAvgmZR2gsAYF4EzaK0FwDAvAiaRWkvAIB5ETSL0l4AAPMiaBalvQAA5kXQLEp7AQDMi6BZlPYCAJgXQbMo7QUAMC+CZlHaCwBgXgTNorQXAMC8CJpFaS8AgHkRNIvSXgAA8yJoFqW9AADmRdAsSnsBAMyLoFmU9gIAmBdBsyjtBQAwL4JmUdoLAGBeBM2itBcAwLwImkVpLwCAeRE0i9JeAADzImgWpb0AAOZF0CxKewEAzIugWZT2AgCYF0GzKO0FADAvgmZR2gsAYF4EzaK0FwDAvAiaRWkvAIB5ETSL0l4AAPMiaBY1bHvt9/sXAKBz0xt6vLVXiKBZ1LDt9d///d8xBADQrekNPd7aK8QQi9JeAEC7tFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5Be6Vcr9d///vfT/84Ho/Ts/fG6/81mf6x6R+Ofw1ozPl8jv8Eo5jeg+KtvUIMsSjttVFTPz0/P59Opy+/pne73VRp0x9yu93iDwVKXS6X6dicjsr47zAE7ZUTg1fQXrOm5Jp6a8qmeJoW8tph//M//xN/DbC66VPQjx8/Xo/H+J9gCNorJwavoL1+96Dk+tP0V0x/kYuSsL79fh/H4b/+9fT0FP8r9E975cTgFbTXq+fn55JX7fSXuvABq5k+88Sx948fP37c7/f4/6Bz2isnBq+gvab0WeGLro9NAygweLTpKItD7je++mIY2isnBq+w5fa6XC7l1fW7aZhppBgOWNT1en1d5vUnvwfDGLRXTgxeYZvtNZ1qa1+jH5gG804Ay7rf778v83rj58+f8c9Bz7RXTgxeYYPt9fT0FA++Ya6DwIKOx2McWu/wiy8MQHvlxOAVNtVet9vtg8++rZlG9QUYfN/sMq83NvgplPFor5wYvMJ2zjiXy+W91R7Nmga2Agy+44NlXm+8vLzEvwN90l45MXiFjbTXX684tOx0OsXDADI+Xub1xs6tVumc9sqJwSsM317TyfdwOMSj7db0ENyFCLKyx75bvdA17ZUTg1cYu71Sn3obNz0Q+QWfdz6f4+D5tN1u5yijX9orJwavMHB7jRRer+QXfNL1eo3DJsmvGNMv7ZUTg1cYtb3GC69X8gv+ajpGvnzbZLsM0S/tlRODVxiyvUYNr1fyCz72zSWefruFTmmvnBi8wpDtVfv6W8GQPzVYxBeWef3JrfXokfbKicErjPcu3vXtJD5vepjxgIH/eHl5iSPkew6HQ/yJ0A/tlRODVxisvRb5yNsLvw8Pv7vf7wveP9mtVumO9sqJwSuM1F6fv4H1GKYHaxM6+GXZN57BPpeyBdorJwavMMz5Zez19e+x7h5ePWKPfDt60RftlRODVximvU6nUzykjfE7WbDUMq837DJEX7RXTgxeYYz2etCZtxcWprBlyy7zesOqSjqivXJi8ApjtNcGrzb+bnr48UTA9jz08HerVTqivXJi8AoDtNemfrfxPdOTEE8HbMkKiw3sMkQvtFdODF6h9/Z66OWGjvh0zgZdLpc4AB7JwUUvtFdODF6h9/Z6xC83dcqnczbldrut9rnr58+f8bdCw7RXTgxeoev28qXX73w6Z1NWXuVplyHap71yYvAKXbeXL73esOqLjVh/67DeLxGwBdorJwav0PUJZbfbxcPgH25HxBY8Pz/HK35dbuZC47RXTgxeod/2qjr/Ns7tiBhb4dZhvvqicdorJwav0O/ZpPZF1ixvDwzsXr11mM82tEx75cTgFTp9q77dbvEA+INFwYxq/WVeb7isT8u0V04MXqHT9nI/1Q9Ycc+QGllm4PiiWdorJwav0Gl7HQ6HeAD8YXpy4mmCURQu83rDzVxolvbKicErdNpebuv1genJiacJhjC1TlO/1Ow+xrRJe+XE4BV6bK/pE3BMzzumpyieLOhfa99zTx9vrKqkQdorJwav0GN7Wez1V5akMIw2j3e7DNEg7ZUTg1fosb0s9vorS74YQ8tfcvt2mdZor5wYvEKP7WWx119Z8sUAWlvm9UaPJ0/Gpr1yYvAK3Z0+LPb6JB/K6V3733DbZYimaK+cGLxCd+1lK6FPcgNuutbFTvn7/T7GhQZor5wYvEJ37dXFGbkFfg2efr28vMTruHk+5NAO7ZUTg1fQXqPSXnTqfr93tKbTLkO0Q3vlxOAVumuvnz9/xuh86HQ6xVMGXal9//gCn3NohPbKicErdNde3Z2Xq3T3k4VJj19s/7DLEG3QXjkxeAXtNSrtRXc6Wub1hq+ZaYH2yonBK3T3Dr3f72N0PuQ3sOjL7Xbr+tZ9dhminPbKicErdNdeMTefEE8Z9KD3j1V2GaKc9sqJwStor4HFUwbNO51O8artmVutUkt75cTgFbTXwOIpg7ZdLpd4yXauu9Mpg9FeOTF4he5OFv/1X/8Vo/Oh6YmKpwwa1vsyrzd89UUh7ZUTg1forr1qX1sd6e4nyzYN9tszbrVKIe2VE4NX0F6j0l6073g8xut1IHYZoor2yonBK2ivUWkvGjfqvvi73c6tVimhvXJi8ArdvUPbz/GT7HNCy67X60jLvN5w9FFCe+XE4BW6a6/z+Ryj86HpiYqnDBpzv9/HvkmyXYYoob1yYvAK3bVXv7uOrMzvW9GsIZd5veFWq6xPe+XE4BW6a6/b7Raj8yE7nNCmUZd5/ckxyMq0V04MXqG79pq4xddfubkXbbper/Ea3YDD4RAPG1ahvXJi8Ao9ttd0RovpeYeTPg263++73S5eo9vg0j9r0l45MXiFHtvLcvu/cochGrTBT009nmDpl/bKicEr9Hhq2NRli6+x0ITWbPYj0+VyiacAHkx75cTgFTr9WGbJ1wfsakJrtvx5yfHIarRXTgxeodP2Op1O8QD4w/TkxNMEDdjgMq83rAFgHdorJwav0Gl7uez4genJiacJGlD7ftACt1plHdorJwav0Gl7TTb+Sfo9LnDQFJuAvbLLECvQXjkxeIV+28s5fZathGiHXSh++fHjh9+A4dG0V04MXqHf9nKD+1nO7zTifr8PvFv2F9hliEfTXjkxeIV+22syncviYfAPJ3faUfs20CYfjXgo7ZUTg1four189fWGMzuNsCRgVtfnW9qnvXJi8Aq9nwtqX2pNsY8QjbhcLvGi5A92GeJxtFdODF6h9/aymPcX53RacLvdLPP6QO+nXFqmvXJi8AoDnAhsrT3xpReN2O/38aLkHW61yoNor5wYvMIA7TV9zt74FkPTw7fSixbYcOIz3ISPB9FeOTF4hQHaa7Lxhb1u20gLLPP6PMcsj6C9cmLwCmO012Szt7n3GZoWWOaVYpchHkF75cTgFYZpr83u8Gj3RspNGWGZV5avvlic9sqJwSsM016T8/kcj2oz7CBEC47HY7wiybBMk2Vpr5wYvMJI7TXZ1O88+t1GWvD8/ByvSJJsRMGytFdODF5hsPa63+8b+Z3H3W5nvQjlrterZV7fYc0AC9JeOTF4hcHaazKdy4bPr+kBOmVTzjKv7xvvDEwh7ZUTg1cY8sifuiQe3oiEF42wzGsRdqRgKdorJwavMOqnroHXoLgpNi2wzGsp+/0+nlP4Hu2VE4NXGLW9JkO+NwgvWjD2V8vrc1yzCO2VE4NXGLi9JoPllxM0Lbjf75u9lfGD+NUZFqG9cmLwCmO312SMpffWeNEOu9c/glut8n3aKycGrzB8e016zy/hRTs2eAfjddhliO/TXjkxeIUttNdkOqnVvii/bBrbGZlGWOb1UKfTKZ5o+BLtlRODV9hIe716enqKh90JlyFoh2VeK7DLEN+hvXJi8Aqbaq/Jy8tLF+8f05Du+kNTak/rG2GXIb5De+XE4BW21l6T6eN741+ATeO5zkhTuvvOuF8+dPFl2isnBq+wwfZ6dbvdGvwcP43kogOtmWogXqA83mbPyXyf9sqJwSts/Di/XC6NFNg0xjRMjAXNuN/vdstema+++BrtlRODV9h4e72aznSFL9npr3aqpVm1Z/Nt2u128exDhvbKicEraK9fpgD6+fPnancCm/6i6a9TXbTsdDrF65V12cSCL9BeOTF4Be31p8vl8tAIOxwOLi/SvulVGi9ZVudWq3yB9sqJwStorw9M7z3T5/5FXs37/X76o6Y/0PmULtxuN8u8arm9H1naKycGr6C9Pul6vT4/P7+m2BRS8fS9Y7fbTf/YdOo8n88vLy96i+789UXOo/nqiyztlRODV9Be33S73aa6EliMxDKvRrjVKinaKycGr6C9gN9Z5tUUN/zj87RXTgxeQXsBv1yvV8u8mnI4HOJnA3+jvXJi8AraC3h1v98t82rQizvR8DnaKycGr6C9gFfH4zHOC7TEWZpP0l45MXgFRzUweX5+jpMC7XGrVT5De+XE4BW0F2CZV+PsMsRnaK+cGLyC9oKNs8yrC+fzOX5g8A7tlRODV9BesHGWeXXBrVb5K+2VE4NX0F6wZefzOc4FNM8uQ3xMe+XE4BW0F2zW9XqNEwE9+PHjh1ut8gHtlRODV9BesE33+32328WJgE7YZYgPaK+cGLyC9oJtOhwOcRagK7764j3aKycGr6C9YIMs8+qXkzbv0V45MXgFhzFsjWVevbPLELO0V04MXkF7wabc73e3Ue3dfr+PHyf8RnvlxOAVtBdsSu3ZmaXYZYg/aa+cGLyC9oLteHp6iiOfztlliD9pr5wYvIL2go14eXmJw54huNUqb2ivnBi8gvaCLbDMazx2GeIN7ZUTg1fQXrAFdssekq+++J32yonBK2gvGN7pdIoDnuG41Sq/aK+cGLyC9oKxXS6XONoZkV2G+EV75cTgFbQXDOx2u1nmNbzr9Ro/b7ZNe+XE4BW0FwzMMq8tcBrnlfbKicErOGhhVJZ5bYddhphor5wYvIL2giE9Pz/HQc4GuNUqE+2VE4NX0F4wnuv1apnX1thlCO2VE4NX0F4wmPv9bpnXBu12O7da3TjtlRODV9BeMJjj8RiHNxvjVqsbp71yYvAK2gtGYpnXltllaOO0V04MXkF7wTAs8+J0OsWrge3RXjkxeAXtBWOwzItXdhnaLO2VE4NX0F4whsPhEEc12za9EuI1wcZor5wYvIL2ggGcz+c4pMGtVrdKe+XE4BW0F/Tuer3G8Qz/cGLfJu2VE4NXcIhC1+73+263i+MZ/uNyucRLhM3QXjkxeAXtBV2zzItZdhnaIO2VE4NX0F7QL8u8+IBdhrZGe+XE4BW0F3Tq5eUlDmOY41arW6O9cmLwCtoLejS9p7qNKn9ll6FN0V45MXgF7QU9qj3J0gtffW2K9sqJwStoL+jO09NTHMDwNz9//ozXDaPTXjkxeAXtBX2xzIssuwxthPbKicEraC/oiGVefIHz/EZor5wYvIJjEjpit2y+xi5DW6C9cmLwCtoLenE6neK4hSSn+i3QXjkxeAUHJHThcrnEQQtf4larw9NeOTF4Be0F7bvdbpZ58U12GRqe9sqJwStoL2ifZV4s4nw+x0uKEWmvnBi8gvaCxh2Pxzhc4XvcanVs2isnBq+gvaBlz8/PcazCEuwyNDDtlRODV9Be0Kzr9WqZF4tzq9VRaa+cGLyC9oI23e93y7x4BLsMjUp75cTgFbQXtMkyLx7ner3G64yBaK+cGLyC9oIGWebFQznzD0l75cTgFRyB0BrLvFiBXYbGo71yYvAK2guacr/fd7tdHJ/wMPv9Pl5zjEJ75cTgFbQXj3C9Xt1G6GsOh0McnPBgdhkajPbKicEraC8W97oBzvSp2nrerPP5HEcmPJ5dhgajvXJi8Arai8X9ujPCVGA+WH/elKqvzxusxq1WR6K9cmLwCtqLZZ1Op3ht/cfxeHT98a8s86KEXYZGor1yYvAK2osFXS6XeGH9X64//pVlXlSZPi/Fq5DOaa+cGLyC9mIpr8u84oX1B9cfP/D09BRPE1Swy9AYtFdODF5Be7GUzxz2rj/+6eXlJZ4dKGKXoTFor5wYvIL2YhGf/+bG9cffTSX6wZeFsBq3Wh2A9sqJwStoL74v+82N64+/1J4r4RfvBQPQXjkxeAXHG9/05W9uXH+0zIum+Oqrd9orJwavoL34pu8c7Vu+/miZF61xq9Xeaa+cGLyC9uI7vv/NzTavP378O6FQxWKArmmvnBi8gvbiyxa8D/vWrj/+uvU/NGW32/lN5H5pr5wYvIL24mumE/Sy92HfzvXHP2/9D+2wy1C/tFdODF5Be/E1j7gP+xauP753639oxHQY+uqrU9orJwavoL34gvP5HC+gBzj+I/6msVjmRRfcarVT2isnBq+gvchacJnXB4a8/miZF72wy1CPtFdODF5Be5Gy+DKv94x3/fF4PMZjg+YdDod44dIP7ZUTg1fQXqSsHBDTXzfG0pOpI+MhQSfcarU72isnBq+gvfi8koAY4Pcfp/kt86I73h26o71yYvAKji4+qTAgur7+eL/fLfOiU5fLJV7H9EB75cTgFbQXn9FCQHR6/dEyL/pll6G+aK+cGLyC9uIzGgmI7q4/WuZF787nc7yaaZ72yonBK2gv/qqp24F2dP1xysQYGro1HXFj/L7LFmivnBi8gvbiY23eDrT964/TeOvcjAMezS5DvdBeOTF4Be3Fx5pdJ9749cdH7LkEJaZPX2612gXtlRODV9BefKDxXZ+bvf740D2XYH12GeqC9sqJwStoL97Ty67PrV1/tMyLIfnqq33aKycGr6C9mNXXrs/tXH+0zItRebNon/bKicErOJyYVXsMf0Ej1x+7e97g8+wy1DjtlRODV9Be/Onp6SleH72pvf7Y7/MGn+H9onHaKycGr+BY4o3po228OPpUdf2x9+cNPqPf3b22QHvlxOAVtBe/u9/vHS3zes/61x/HeN7gr+wy1DLtlRODV9Be/K720F3WmtcfR3re4GNutdos7ZUTg1fQXvwy3nKlda4/WubFpvywy1CrtFdODF5Be/Fq1LtSPfr6Yy93QYMF+eqrTdorJwavoL2YTJ9ix74r1YOuP/Z1FzRYkFutNkh75cTgFbQXky1sPviI64/Tnxl/OmyMXYYapL1yYvAK2ovtbD647PXHxje7hEdrZDMJftFeOTF4Be21caMu8/rAItcfLfMCbx+t0V45MXgFB8+WDb/M6z3fvP5omRe8sstQU7RXTgxeQXtt2RaWeb3ny9cfp2C1zAteTcdCHBg0QHvlxOAVtNdmTeURL4IN+8L1x+lfiX8ZsMtQS7RXTgxeQXtt0/V6ddXsVer6o2CFN3a73SNu4MIXaK+cGLyC9togV83e+OT1R8EKs9xqtRHaKycGr6C9NshVs1kfX38UrPCe6TOJr75aoL1yYvAK2mtrXDX7wAfXHwUrfOB0OsWhQh3tlRODV9Bem+LmCH81e/1RsMJf2WWonPbKicEraK9NcdXsk36//njd3u1n4QvsMlROe+XE4BW013bYAyfl9frjVGDbvP0sfIFbrdbSXjkxeAXttRH2wPmCHz9++KYQPs8bSi3tlRODV3CobIFlXsA6po95cd5hddorJwavoL22wJc3wDp2u12cd1id9sqJwStor+E9PT3FDxvg8T5zp2IeQXvlxOAVtNfYXl5e4icNsAq3Wq2ivXJi8Araa2DT6c8yL2B9dhkqob1yYvAK2mtgtcchsFm++iqhvXJi8Araa1SWeQGF3Gp1fdorJwavoL2GZJkXUM4uQyvTXjkxeAXtNR63YgdacDgc4qzEKrRXTgxeQXuNZzrfxU8XoJRdhtakvXJi8AraazDn8zl+tADVvMWsSXvlxOAVHBgjuV6v8XMFaINbra5Ge+XE4BW01zAs8wIaZJeh1WivnBi8gvYahmVeQJvO53Ocp3gk7ZUTg1fQXmN4fn6OnyhAY9xqdR3aKycGr6C9BnC9Xu0dBLTMLkMr0F45MXgF7dW76dPkfr+PHydAk6bPh261+mjaKycGr6C9enc8HuNnCdAwuww9mvbKicEraK+uWeYFdMRXXw+lvXJi8Araq1/TWcwyL6Aj3nEeSnvlxOAVHAn9sswL6I5dhh5He+XE4BW0V6dOp1P8CAH6MX1ojLMYS9NeOTF4Be3Vo8vlEj8/gN7YZehBtFdODF5Be3XHMi+ga3YZehDtlRODV9Be3bHMC+idW60+gvbKicEraK++TCes+MkBdMsuQ4+gvXJi8AraqyMvLy/xYwPonK++Fqe9cmLwCtqrF9NnRMu8gJG41eqytFdODF5Be/Wi9qACWJxdhpalvXJi8AraqwuWeQFDcqvVBWmvnBi8gvZqn2VewKi8By1Ie+XE4BW87htnmRcwNl99LUV75cTgFbRX4w6HQ/yoAEbkVqtL0V45MXgF7dWy8/kcPyeAcdllaBHaKycGr6C9mnW9XuOHBDC03W7nVqvfp71yYvAK2qtN02loOhnFDwlgdG61+n3aKycGr6C92mSZF7Apdhn6Pu2VE4NX0F4NsswL2KDT6RQnQb5Ee+XE4BW0V2uu16ubSgDbZJeh79BeOTF4Be3VlPv9vt/v42cDsDGHwyHOhuRpr5wYvIL2asrxeIwfDMAmudXql2mvnBi8gvZqx/Pzc/xUALbKu9KXaa+cGLyCV3kjLPMCeHW5XOLMSIb2yonBK2ivRljmBfDKLkNfo71yYvAK2qsFp9Mpfh4A2GXoS7RXTgxeQXuVu1wu8cMA4B9utfoF2isnBq+gvWrdbjfLvAD+ZJehLO2VE4NX0F61LPMCmOWrryztlRODV9BehSzzAvjAz58/43TJJ2ivnBi8gvaq8vLyEj8DAN5hl6HP0145MXgF7VXifr9b5gXwV96kPk975cTgFbysS9QeIQAdscvQJ2mvnBi8gvZa39PTUzz7APyN96lP0l45MXgFr+mVWeYFkOVWq5+hvXJi8Araa02WeQF8gV2GPkN75cTgFbTXmg6HQzzvAGScz+c4k/IO7ZUTg1fQXquZThzxpAOQ5Farf6W9cmLwCtprHdfrNZ5xAL7ELkMf0145MXgF7bWC6bPabreLZxyAr3Kr1Q9or5wYvIL2WoFlXgCLsMvQB7RXTgxeQXs9mmVeAAu6Xq9xeuX/0l45MXgF7fVQ0znCTSUAFuRt6z3aKycGr+BF/Dj3+32/38cTDcBC7DI0S3vlxOAVtNfjHI/HeJYBWM70sTbOs/xGe+XE4BW014M8Pz/HUwzA0uwy9CftlRODV9Bej2CZF8BD2WXoT9orJwavoL0WZ5kXwArcavUN7ZUTg1fQXos7nU7x5ALwMHYZekN75cTgFbTXsi6XSzyzADzY9Fk3Tr5or6wYvIL2WtDtdrPMC2BNdhn6RXvlxOAVtNeCLPMCWJldhn7RXjkxeAXttRTLvABKuNXqK+2VE4NX0F6LsMwLoIo3slfaKycGr+Al+333+90yL4BCvvqaaK+cGLyC9vq+2pc7AG61OtFeOTF4Be31TU9PT/FUAlDHLkPaKycGr6C9vuPl5SWeRwBK7Xa7jd9qVXvlxOAVtNeXWeYF0JSN7zKkvXJi8Ara68tqX+UAvLHxXYa0V04MXkF7fc35fI5nEIBmbPlWq9orJwavoL2+4Hq9xtMHQGM2u8uQ9sqJwStor6z7/b7b7eLpA6Axh8Mhztcbo71yYvAK2itrOqrjuQOgSdu81ar2yonBK2ivFMu8ANq3zbc27ZUTg1fQXp9nmRdALy6XS5y7N0N75cTgFbTXJ93v9/1+H88aAG3b4C5D2isnBq+gvT7peDzGUwZAD87nc5zBt0F75cTgFbTXZzw/P8fzBUAntnarVe2VE4NX0F5/db1e7R0E0KNN7TKkvXJi8Ara62OWeQH0a/rkvJ1brWqvnBi8gvb62Ol0imcKgA5tZ5ch7ZUTg1fQXh+4XC7xNAHQrY189aW9cmLwCtrrPdOxapkXwAA28k6nvXJi8Ara6z2WeQEMYwu7DGmvnBi8gvaaZZkXwEi28GanvXJi8Ara60+WeQGM5/n5Oc7yg9JeOTF4Be31hmVeAEMafpch7ZUTg1fQXm/UvnYBeJyxb7WqvXJi8Ara63fTYRnPCwDDGXuXIe2VE4NX0F6/vLy8xJMCwKAG/upLe+XE4BW016vpk5BlXgBbMOqtVrVXTgxeQXu9qn3JArCaUXcZ0l45MXgF7TWxzAtgU67Xa7wBDER75cTgFbTXdATGcwHANgz53qe9cmLwChtvr/v9vtvt4rkAYDPG22VIe+XE4BU23l6HwyGeCAC2ZLxbrWqvnBi8wpbb63w+x7MAwPYMtsuQ9sqJwStstr0s8wLYuN1uN9KtVrVXTgxeYZvtZZkXAJORbrWqvXJi8ArbbK/j8RiPH4ANG2mXIe2VE4NX2GB7PT8/x4MHYPNOp1O8PXROe+XE4BW21l7X69XeQQD8boxdhrRXTgxeYVPtdb/f9/t9PHIA+McYuwxpr5wYvMKm2ssyLwBmDXCrVe2VE4NX2E57XS6XeMwA8H8N8G6ovXJi8Aobaa/b7WaZFwAfmD6ix3tGn7RXTgxeYSPtZZkXAB/rfZch7ZUTg1fYQnudTqd4tADwvq53GdJeOTF4heHbyzIvAD6p61utaq+cGLzC2O1lmRcAKf3uMqS9cmLwCmO3V+0LEYDu9PvVl/bKicErDNxe02eXeJAA8Gmd3mpVe+XE4BVGba+Xl5d4hACQ1OMuQ9orJwavMGR73e93y7wA+LIe3xy1V04MXmHI9qp9/QEwgO52GdJeOTF4hfHayzIvAL6vu/dH7ZUTg1cYrL2u12s8MAD4nr5utaq9cmLwCiO11/1+3+128cAA4Hv62mVIe+XE4BVGaq/D4RCPCgCWcD6f4z2medorJwavMEx7TYdHPCQAWEhHt1rVXjkxeIUx2ssyLwAepJddhrRXTgxeYYD2sswLgMf58eNHF7da1V45MXiFAdrreDzGgwGAB+hilyHtlRODV+i9vZ6fn+ORAMDDXK/XeONplfbKicErdN1e05Fg7yAAVtD+26X2yonBK/TbXvf7fb/fx8MAgAdrfJch7ZUTg1fot70s8wJgTdMH/ngHapL2yonBK3TaXpZ5AbC+lncZ0l45MXiFHtvrdrtZ5gXA+lreZUh75cTgFXpsL8u8AKjS7K1WtVdODF6hu/Y6nU4xOgCsrtldhrRXTgxeocfvvQCAN7RXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXkF7AcAAtFdODF5BewHAALRXTgxeQXsBwAC0V04MXmG/3/8bAOjc9IYeb+0VImgWNWx7AQB8UwTNorQXAMC8CJpFaS8AgHkRNIvSXgAA8yJoFqW9AADmRdAsSnsBAMyLoFmU9gIAmBdBsyjtBQAwL4JmUdoLAGBeBM2itBcAwLwImkVpLwCAeRE0i9JeAADzImgWpb0AAOZF0CxKewEAzIugWZT2AgCYF0GzKO0FADAvgmZR2gsAYF4EzaK0FwDAvAiaRWkvAIB5ETSL0l4AAPMiaBalvQAA5kXQLEp7AQDMi6BZlPYCAJgXQbMo7QUAMC+CZlHaCwBgXgTNorQXAMC8CJpFaS8AgHkRNIvSXgAA8yJoFqW9AADmRdAsSnsBAMyLoFmU9gIAmBdBsyjtBQAwL4JmUdoLAGBeBM2itBcAwLwImkVpLwCAeRE0i9JeAADzImgWpb0AAOZF0CxKewEAzIugWZT2AgCYF0GzKO0FADAvgmZR2gsAYF4EzaIe215PAADdiqBZ1GPbCwCA32kvAID1aC8AgPVoLwCA9WgvAID1aC8AgPVoLwCA9WgvAID1aC8AgPVoLwCA9WgvAID1aC8AgPVoLwCA9WgvAID1aC8AgPVoLwCA9WgvAID1aC8AgPVoLwCA9WgvAID1aC8AgPVoLwCA9WgvAIC1/O///n9bLFduoTwj3gAAAABJRU5ErkJggg==";
        };
        /**
         * Returns the localized placeholder for the dynamic image.
         */
        CommonUtils.getLocalizedDynamicImagePlaceholder = function () {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAykAAAJZCAMAAACa4YotAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFs7OztLS0tbW1tra2t7e3uLi4ubm5urq6u7u7vLy8vb29vr6+v7+/wMDAwcHBwsLCw8PDxMTExcXFxsbGx8fHyMjIycnJysrKy8vLzMzMzc3Nzs7Oz8/P0NDQ0dHR0tLS09PT1NTU1dXV1tbW19fX2NjY2dnZ2tra29vb3Nzc3d3d3t7e39/f4ODg4eHh4uLi4+Pj5OTk5eXl5ubm5+fn6Ojo6enp6urq6+vr7Ozs7e3t7u7u7+/v8PDw8fHx8vLy8/Pz9PT09fX19vb29/f3+Pj4+fn5+vr6+/v7/Pz8/f39/v7+////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAQ71AAAAAlwSFlzAAAScwAAEnMBjCK5BwAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMzQDW3oAACEXSURBVHhe7d3pYhS3EoZhNgecnDiELUAwhM1sCVsgCQQIwRA23//1HHtcsj2yRl3dLfVIpff5c3Iaezwe65tujUrVR7YAdCMpgAZJATRICqBBUgANkgJokBRAg6QAGiQF0CApgAZJATRICqBBUgANkgJokBRAg6QAGiQF0CApgAZJATRICqBBUgANkgJokBRAg6QAGiQF0CApgAZJATS6krIBNEMGfVBXUo4AzZBBH0RSAEcGfRBJARwZ9EEkBXBk0AeRFMCRQR9EUgBHBn0QSQEcGfRBJAVwZNAHkRTAkUEfRFIARwZ9EEkBHBn0QSQFcGTQB5EUwJFBH0RSAEcGfRBJARwZ9EEkBXBk0AeRFMCRQR9EUgBHBn0QSQEcGfRBJAVwZNAHkRTAkUEfRFIARwZ9EEkBHBn0QSQFcGTQB5EUwJFBH0RSAEcGfRBJARwZ9EEkBXBk0AeRFMCRQR9EUgBHBn0QSQEcGfRBJAVwZNAHkRTAkUEfRFIARwZ9EEkBHBn0QSQFcGTQB5EUwJFBH0RSAEcGfRBJARwZ9EEkBXBk0AeRFMCRQR+ULClrL4AirckQ7SaDPihZUs7KNwCFOStDtJt8QxBJgXUkBdAgKYAGSQE0SAqgQVIADZICaJAUQIOkABokBdAgKYAGSQE0SAqgQVIADZICaJAUQIOkABokBdAgKYAGSQE0SAqgQVIADZICaJAUQIOkABokBdAgKYAGSQE0SAqgQVIADZICaJAUQIOkABokBdAgKYAGSQE0SAqgQVIADZICaJAUQIOkABokBdAgKYAGSQE0SAqgQVIADZICaJAUQIOkABokBdAgKYAGSQE0SAqgQVIADZICaJAUQIOkABokBdAgKYAGSQE0SAqgQVIADZICaJAUQIOkABokBdAgKYAGSQE0SAqgQVIADZICaJAUQIOkABotJuXNy42N9bMzGxsbL9/IYfTwQP63HY0l5c3j64HfeHX98aZ8AVSeHXks/9WMlpLy5vqq/JiA1fXn8mXotLlyZFX+sxnNJCUak12r17kQ01nbfrU25L9b0UhSHit/z7PNXVQMcX3npVr5JP+vEU0k5XHn6WTfKlnp8nj3lWrspNJAUp71yMmO1WfyjQh6syIvVFufgphPyqb+N9xzlk/CFvu0M0mZuSJH2mA9KRvywD21Nl3tYV1eom1NfQBiOymbe+9/fa1xWgmTScpMnllloUwn5Zm7oh5ghdlKyN4kZeaFHG2B5aQcuE4Y4ro8DPbtT1JmWlp+tJuUTxflMQe72NiKgYL/mjb0kbrZpHjvfoOsEZV5D+SF2bPazitkNSkpgkJUPG/kZTmgnQ8JjSYlTVCIypxPgSXcdmpabCYlVVCIykHBiV8zn3vYTIr+t+qUbuZUu0OTlF2tLDyZTMrIj4fnrcuDtu6FvB6+i/Lv1llMyoI3v6EoLt7xaeEqbiPLjwaTMr+MPN4K+7u2LR4ojVyf2ktKutm8w6w+XmnaRt2PvaTMNuSlRV3LoknKTBs1LeaSEv2bDtVSJWDI4knKTBMzOXNJSX7ttWNNHrxVHS9qE8uP1pKS+HMvp71GcAd1XtC2UNNiLCkdlwmDtdaIZM4zeREWa+HlMZaUgZuBuzW8XXhT8e7TwJZ6W0nJdUpp+qSimvnZr2mxlZRsp5SGZyq60qDRE8zi2UpKz85efTTXh1cc7DARY/6DdFNJ0f5VB2mz/EtdGmT+pGIqKfpfZgD71xcBPUqDrL+TWErKpjxIJi12AOuxf8H65amlpGRadXQanNP3upw1/vpYSsrotkVxrWxZ2tdv/4LxD9ItJSXbYsquFfkxzQh1mIixvTprKCmBHjtptbajq+85esX0TM5QUjJPU5qbqPR/PU3XtBhKSuZpSmsTlSGnaMtnXUNJyTxNaWyi0neSMjNqmlk4O0nJPk1pa6Iy7AxtuKbFTlKylrLsaqigZWCtqeHNoXaSkrGO2Glnk8rgbgR230xISg/NJGX4Ph+7NS12knJFHiIjulV3M/tuYicpI/66WiOeXVXGnJ7N1rSQlB4aScq4lmlWT7x2kpKl0de8Ntp+aTpMxBitabGTFHmErORH2Tb2LcdoTQtJ6UN+lGnj+zrbXH4kKX3Ij7Ksuw1eJ5vTOTtJOSEPkdEJ+VGGjZ2kzJg8qdhJiv43Gczmm+WcJJ+LmFx+JCk92E9KojtkWqxpISk9mE9KqirTVYPLj3aSQt3XaOnukGnwlbKTlOybg81vD054h0yDNS12kpLltnXzjPfeTXkbf3vLj3aSkrmD5A7bXSTTboUz91rZSUr+BRXbyymJd1eba89hKCn0ZhljUIeJGGuXqoaSkn1Kb3obffL3mTF/yhIZSkr25iyWpykZ3maeyUMbYSgpuScqlm97kONdxtjrZSkp4+vFowzvok8+SZmxdbVqKSmZL78M98XTj4I+bC0/WkpKzhuimr74ylUIZKqmxVRSspZ+2S1lyVbdYOo2EaaSknWZ3uwnX8Pb4HWyVNNiKik5u+PZvTdInknKLkNvL7aSkvGkYvaUkvWSdeTfsyS2kpLv/dFsJUuCDhMxdmpajCUl2+TUasF9kg4TEXZOKsaSkqtM0uwpJXvnTTPLj9aSspmlpOWE1VlK5rKGbWaWoawlJc8E1eoG+syTlBkrr525pORYqLe6PJ97kjJjpabFXlIyVH8ZrfhK2GEixshJxV5S0m+1sFrHkrLDRIyNSZ7BpKT+/Mvq514T3Gx5l43yBotJ+ZT08y+L/RB3pGuD18nE1avFpGy9SRiVE0xSRkvzV10yk0lJOKu3GpTJJikzFiocbCYl3TW41X4sk01SZizcINNoUlKNBKtByd7HxmPgdbSalDRRsRqUPB0mIgx8LGI2KQmm9WbnKPnbbR5S//Kj3aSMjordoExwAw1f/TUthpOy9Un/ywWcNbqOMv0kZab6bmmWkzKqsNhq+fASJim7aq9psZ2UrRcDR8Wq4ZsKjTrTDld7TYvxpGx9GnRa2TB75ZW5w0RM5W8+1pOytbXZ+z30rNk+LNsmuMnfAhn+tlOyn5StrWe9snLW2N0M5mVsg9ep7pNKC0nZfiNV/5pnDU9QdvQ+wSZU99bRNpKynZUritWVE1eM52SCDhMxVZc8tJKUbc86wnLR9GXXzBQdJiKqXn5sKCnbnl1f8PuuXX9m+OMuZ5IOEzE1L1K1lZQdbx5fP3tgF9Pq2Y0HLxpIyY4JN2+F1XxSaS8pzuaLVgLiLHeSMlPx8mO7SWnOkicpu+pdqiIprZiww0REvY1uSEojpuwwEVPt5/AkpRGTdpiIqPYvTFLaMG2HiZhalx9JShPKmKTM1FrTQlJaUMokZabSNs8kpQWlTFJmKl1+JCkNWEKHiZg6a1pIin1L6TARsVLl8iNJMW9JHSYiqqxpISnmTd8Gr1ONJxWSYl1hk5SZGv/MJMW40iYpuyqsaSEpti2zw0REhbeJICm26f++06qvpoWkmLa0Nnhd6qtpISmWLa8NXqfqlh9JimGFTlJmqqtpISmGlVQXeUhtJxWSYlcBHSZiKlt+JClmFdFhIqKymhaSYtXS2+B1quvugCTFqqInKTN1/bFJilGFT1JmqqppISk2ldNhIqKq5UeSYlJBHSZiaqppISkWFdVhImK1ouVHkmJRUR0mYipafiQpBlUxSZmpqKaFpNhTySRl5ro85/KRFHNqmaTsqqamhaSYU2CHiYhqbhNBUqwpscNETC3LjyTFmDI7TETU8icnKbaU1wavUyU3NycpttQ1SZmppKaFpJhS2yRlpo6aFpJiScEdJiLqWH4kKYaU3GEipoqaFpJiiP6PWZYqTiokxY5i2+B1qmFLPUkxo85Jyq4KalpIihW1TlJmKvi7kxQrqqqLPKT8mhaSYkQNHSYiyv/DkxQbSm+D16n45UeSYkL5bfC6FF/TQlJMqHuSMvNAfpVSkRQLqukwEVH68iNJMaCeDhMxhde0kJT61dRhIqbs5UeSUr26OkxElF3TQlKqZ2GSsqvo20SQlNrZmKTMFP3XJymVszJJmSm5poWk1K3CDhMRa/JblYikZPFmqsWBCjtMxBRc00JScthcWZtmdlplh4mIgmtaSEoOa0eOrEzx9lhdG7xO5S4/kpQMdivg17NfgdmapMyUW9NCUtJzFfDZr8CMTVJmir1NBElJbr8CPvMVWL0dJmJKrWkhKckdfElzXoHV3GEiotSaFpKS2vw7fb4rsKo7TMQUuvxIUhLz3+mzXYHp/3KVKXQMkJS0Au/0ea7AbE5SZso8qZCUtEKvZ44rMKOTlJkylx9JSlLhd/r0V2D1d5iIKbKmhaSktHDNPPUVmJXNW2GrJS4/kpSEImvmaa/AKm+D16nEmhaSklBszTzlFVj1bfC6lFjTQlLS6SjsXV+XrxvL9iRlpsDlR5KSTHdhb6IrsBImKd/efvjn69evXjy/f/mEHEqqvJoWkpKKorA3zRVYCR0mrnyVJ7Pty205mNJFefBykJRUVAM4wWdgJXSYuCzPRZyWwykVt/xIUhJRDuDRn4EV0WHilTwZkeMsV9xIIClpqAfwyCuwItrg/ShPxjknx5N6Jg9eCpKSRJ8BPOoKrIg2eL/KkxEf5HBapdW0kJQkeg3gEVdgZbTB+0+ejcjU9qKw20SQlBR6LgUOvgIro8OE/7nUj3I8scKWH0lKAv2XAoddgRXSYeKpPB2RLb5l1bSQlAQGzLIHXYGV0WFiRZ6Nc0uOJ7dS1PIjSRlvUL3igCuwQtrgXZOn43wrx9MrqqaFpIw2tF6x7xVYKW3wvDXBv+RwDiWdVEjKWMPrFftdgZXSBu9/8nycq3I8h5KGA0kZS/8KHtLrCmzEz0nKm2d/zVIg6RRU00JSRhrX+UF/BVZMh4m38oTEEzmcR0HjgaSMM7bzg/YKrJgOE2fkCTk/yfFMklRfJ0FSRhnfnk53BVZOG7zf5BmJ93I4l3JqWkjKKCkmD5orsBQ/Jw2vkuW+HM6mmOVHkjJGmslD9xVYOW3wLskzcnJsTZlTTE0LSRkh1QpH1xVYQR0mfpenJF7L4YxKOamQlOESrnBEr8AK6jDxjTwlJ1slywGFLD+SlOFSlmHFrsAKaoP3izwlZ4rV0EJqWkjKYGnLsBZfgZXUBu+lPCfxpxzOa0gxaXokZajkZVgLrsBKaoP3vTwnZ5odmGUMCpIyUIYyrOAVWFFt8O7IkxJfjsvxzIqoaSEpA+XYKxK4Aiuiw8Sef+VZian2Kq/Jz1sqkjJMpkFy6AqsiA4Tjv/XuSDHsyuhpoWkDJKt65Z3BVZGhwnHq2TZlMP5lXCbCJIyRMZrorkrsCLa4O37KE9LZK9k2VfA8iNJGSLrNdH+FVhZkxS/x+rWD3J8AgXUtJCUATJfE+1dgRU1STnU1XGCSpZ91+WHLg9J6S/7B7dyBVbWJOXIydmT2ndTjk9j6TUtJKW/Ca6Jdq7ASukw4fhv69Pu6196TQtJ6W2S6pK1N6V0mNjzt/z+4g85PJVlLz+SlL4mqi5ZKWs2f3j574ocn8qyhwZJ6amo6pIpeZUsn4/J8cks+TYRJKWn0t7qJ+NVsjySw9NZ8pZ6ktJPOft0J3ZOXgDnvByf0HJrWkhKL8U0E5rcQ3kFxHSVLPuWu/xIUvoop5nQMCfvvf86rAj6qDdK78nxQ16/u5OtpfdSa1pISh/6V6tE39zbuTf2sE93f959AfYsmq5d3fnHXzNlZaknFZLSQ9WTlG/ufpn9El/k//fzfPa9e17J4UPkFpAP8iwGLXP5kaTo1TxJWbmzm5NtQz7ePSXf69yQ44fszbofnJIjSS2xpoWkqBW3aK63cuez/BLbvpGDffiVLAtjcGDR436GrPi3mJwQSVEr495xA5zYOJCTYfVaXiXLczl82B/yFTMZsrK8mhaSolXIveN6O77hzYO/k3/owa9k+VmOH/aXfIW4d1KOp7K8AUJSlEqr7FU6fvvQ50UDknJXvlV8PirHD/OSsvX13pCLvYilLT+SFJ06JynHbnkbencMSMo7+VYRqWTxk7K19eVu0qwsraaFpOjUOEk5dsu7hcOu/qun5+U7nXNyPGBuniK+3E25YPtAHnVqJEWlsO2HGkdvBnMyZD3lkXyreCeHQ7xe+OLznXRZWdbyI0nRKKxHisbND/LcfbFxHnZs7qOzra27cjxk0Tt+wqwsqaaFpCgU1iNF4cainAw5Pfor47FXY1bNEvR5I9FdhleWs/xIUhQK65HS6fp7eeIh+r+44809/pbDQbEJ96eNNH2Ml1PTQlK6VTZJuR59z/1VvkrPr2SJ9xGIthv6eDtJVpZyUiEpneraDxzPyfMf5ct6uCHf63QsJp77U74u6OOtBLuKlzJKSEqnmiYpv3grH/OenZEv6+WVfLdYXMninPMKj+f9lyAry6hpISldSrolVodr0Zz8PignR36Qb3cuy/GYM+EPi8V/txav8ess4zYRJKVDSbfEirvm9YSY93TAddfMPXkA8UkOdzgdrTr5cHNkVpZQ00JS4qqZpFx9K8846Onw+8Z7856HcrjT997O+3kfxvVqXUJNC0mJq2SSEs/JkxFd6S/IYzj6AXPkO9kAGfZ+4W4wjemXH0lKVB37gdf/kacb9HhU2r3rnH/lsM4p79Jt3vsRU8Dpa1pISkwV+4GvRHPy6H/yZcMc29tUvOuOHNda8VpPztscnpXJTyokJaKGpkVXondrfzi2S4q/Hv69HNc7fmunI8wiw7My9fIjSYnocU2+JD+/lqca9Nv43bleJctLOdzL0RteieWcd7/Il/U0dU0LSVms+ElKR04S7KDyP2MaOKqPXAvvANj17pp8VT8TLz+SlIVKn6Rc9hbP5/2apHL3pjyaMzx867GrpX+HZGXisUJSFil8knIpmpMHie7Z4J20Ri3DXo6tjP57Vb6qh2lPKiRlkaL3A1/y2grNS3b769PygM4lOT7QxdindG97Z2Xa5UeSskDJTYsuxnLydWFz7f7uy2OKj3J4uPOxM2HvrExa00JSwgpuWnTxpTzHkC+xrbu9eTvCfpPDY5yNPft/+u2ZW51y+ZGkBJXbtOin2NX5574Lg3EjKlkiTh/udLTvn163j5xy+ZGkBJU6SbkQy8mn2/JVqTyRBxZv5fBoa7ENLG96ZGXKmhaSElLoJOVC7N3447jq3IDj3uJ6wvWl757KY4b0yEp0L3JaJCWgzKZF56M5ybDhbF0e2xlXQeZZjU3HXy9ufOyZrqaFpBxWZNOi87Ht6f8NW+Xu4P3E1CuxJ2MbWF5rtlZum+42ESTlsAKbFp0LdTF1PuR5wt/Kwzvp03gi1jn1lS4rky0/kpRDymtadDqWk/fKd9/ebskPcHJckh6LbWB5pVnonGzEkBRfeZOUM/LMQjbzfUrnlfP/LodTi33Sq1lEPXAXsKxIiq+8ScrisbB5Qb4kgx/lZzgjK1ki/JPXAYoPEaaqaSEpnvKaFh2XZ3bIu8jdGcbz5hD/yeEsFn7Yq/lgeqKaFpIyr8CmRQtek7fD2nepeT3A+3dp7eWa/BiP5s8x0fIjSZlTYtOiYPv4N8PbEun8JD/IyZzLI0fWQ5uIVQ0upqlpISlzSlxJ8fsCb3uV/3l6i+j/yOGcLh/eRPxB/ilqmpMKSTmovEnKtkPdTV4OuFNjXyfkZzmpS8rCLvqbiD/LP8RNsqWepBxQ5n7g2/Ls9qjbOI7gX/JNEM5th1Yiv8o/dJiipoWk7Ct0P3Dgg6FHiTb/LubVmE3yHhJoOancOzbFsCEp+/SvxaT8QsWZJ4luBbfAd/JjnL67EQcIVoFtyj92maCmhaTsKbVp0YIl+t+T3ubd41/xZT/bercndv6Sf+4ywbghKU6xTYv8yfWe5+Mb3y3itYZ4KoczOeZtGdun3uucf/mRpIiCmxYtro/8c2wz1QX801jWLaAnIru6zsvXdMpf00JSRMFNiy7JUwz5K+n2KsebW6tWNQZaiVU4/ilfpBAr4E+CpOwquWnRkbWFVyfb/s6wCukta+R7cU5GbwnZpx9T9uVHkjJTcNOimR9i+85fpa5s8TcSDr3xXZdTsX03W/f7TcNy17SQlB3lNi3aczraoyFtVZb3ozK9jXwbvR13z5xsy7z8SFJ2FN1Z1fkxdkPetwkr8FfkMZ1bcjyp76I5eTDgrStzTQtJ2Vb0JOWAM7HZ77tku7r8CvgMH7B9H+szs/XrsFN89J5Lo5GUEvcDL3QmNgNOtVPYW/DWrv7prcVzMjSZeQcPSSmzadFCZ2NZ+ZCi+8T/5MGc1JUs0W6rW7+NqMXMWtNCUkpsWhQV7Wj0sVdf3yDvQ6SvaSvMfowO5zE52T5XyaNkQVLKa1rUKdol7/PYc4B3a/sncjiJs9GcPBy7jJqzpqX5pFQ0STkg2qH469C7Mc74lSw/yfEEzsXuCDH2fuA7cta0tJ6UuiYpB0S73m/dOCpf1t9v8hDivRwe70I8J/3v3x2Qcfmx9aQUuR9Y56foyLt1XL6sL6+SJdWd8OLP9lGiN6yMNS2NJ6XApkU9RO9it7Ux6LrSL8dMUykTvy/l43Qn9ny3iWg7KSU2LeolPgLvnpQv68ErBHgth0eJP8snP8iXJZGtpqXtpNQ6STkgflf6+31Xu7+Rb3QSVLJMmZOMNS1NJ6XiScoBl72bxs/7td8KxS/ybc7o0tF4kp+mb/CXa/mx5aTUPUk54OdoVh72+VTJm3f32EoVNHlO8g2hhpNS8H7g3q5EqwMfq69wvpfvcMbVL8QT/HumbS+ZTioNJ0X/q9dg3WsSMe+pclR6/Sq/DP2oeUc8J8+yNTrOtPzYblJKbVo02FWvDGXeM9Vf2nuIEZU+V5aUk215alqaTUqxTYtGuPqv/HJBf3Q3OvFf/sFbXuJXg8/zns5Xsyw/tpoUS5OUA669k98v6K+uGi6vkkXbwdG31Jxsy1LT0mpSsv+1luWX6NLby/hmr4/yZaJPb5R969Gc/JH1RmK7stS0NJqUWvYDD3E9mpVYV8bL8jXOkEXB09H6rj/Vre5GybH82GZSSm9aNNKN9/J7hkTOKt42/UGVLLGgTJSTbRlqWppMSgVNi0a64d2l8YDn8iWHnZSvcG7K8T4i/S7/ynijY5/fsSyBJpNSRdOicY7e9G9v5Syepvt1uEPeT+7K9x4yZU62pV9+bDEplicp+47dCmdl8W2uvErGP+RwLwvWMl4k3Dmpkn4gNZgU45OUfcdue59l7Vr0+bhfyTKod0Wwc8zLqXOyLdYabZD2klLtfuABjm8EPi9dVFzsVbJ8HnSHvMD+/o5PpjNJXtPSXlJqa1o0zok7h25dvSgp3gL/Izncz6Gk/H1J/mVqqW8T0VxSKmxaNM7KnS/yq4sFSTkn/+wM+0TXS8qrZeUk/fJja0mps2nRON/c/Sq//cyCpHh3JB1YyTLXiexVipaWgyWuaWksKS1NUg44ee9AVsJJOeq9BavvsDjvwET69VJzsn1SSbv82FhSbOwHHuDUfXkFtrbCbSh+ln91Br6l7H1K/PpnObI8aWta2kqKmf3AA5ySKe6C9RTv491XcrgvqUZ+M749cgJJTypNJaX6pkXjrM6yEq7mOjV7gfbdkON9Xd355jJykng0NZWUNicpB3z74L8FGfArWYbe6v7Y262X5XwOn7KmpaWkNDtJOWjBbXy8HiqLyyi7HB2asRxSDqeGktLyJKWLf+eR5U/H00i4pb6dpDQ+SYnzSoA/D2+VX5aENS3tJEX/mzbI237/UA7XL93yYzNJMde0KKXz8iI5E+x1n0i6mpZWkmKxaVE6j+RVEu/ksAXJTiqNJMVo06JEjnn1xgMrWcqUavmxkaQwSYnxyz5MrTulqmlpIylMUqK823b/LYeNiLYf02siKc3sBx7Gr2QxtkKbaEy1kBT7TYvGuSGvkzPgnndFS1PT0kJSGmhaNIpXyWKuliHN8mMDSWmjadFwP8jr5Cx5A1YGSWpa7CeFSUqHe/JCiU9y2JAkt4kwnxQmKV28BYff5LAlKZYfzSelraZFA1yQF8rRj4h6pKhpsZ6U5poW9eZdxP8rh23xN6oNYDwpLTYt6ueY1w3sjhw3ZnxNi+2kNNq0qA+/2KPPzesrMr6mxXZSmKR0mmtlt7X1Ug6bM3r50XRS2A/cyV+V+0WOmzN6ZFlOCvuBu92U18r5Ro7bM/Y2EZaTwiSl22t5rcTvctigsTUthpNC06Jup+W1cpbXmj6/kTUtdpPCJEVhv1vxzEc5bNLI5UezSWGSouHdjttiJcu+cTUtZpOi/8Ua9pO8WI7tF23cScVqUtgPrPFEXi3xVg5bNWr50WhSaFqkcXzuXl0NvL2MqWmxmRSaFqmsy8vl/E+OmzVmeNlMiu3r7WS8SpYGTsQjalpMJoVJispxebmca3LcsBHjy2JS2A+sc0JeL8duJcu+4cuPBpPCfmCt+XbETdQ0DK9pMZgUmhapXf1bXrOtT89PyzHj5L6w/dlLCk2L+jixdv7ipQtn2ikmHbz8aC4pTFIQNbSmxVpSmKQgbmXg8qO1pLAfGB0G1rQYSwpNi9Bp2G0ibCWFpkXoNmyQmUoKTYugMaimxVRSmKRAY03GSy+WksIkBTpDaloMJYX9wFAaUtNiKClMUqA1YPnRTlJoWgS1ATUtpmb0QDYkBdAgKYAGSQE0SAqgQVIADZICaJAUQIOkABokBdAgKYAGSQE0SAqgQVIADZICaJAUQIOkABokBdAgKYAGSQE0SAqgQVIADZICaJAUQIOkABokBdAgKYAGSQE0SAqgQVIADZICaJAUQIOkABokBdAgKYAGSQE0SAqgQVIADZICaJAUQIOkABqFJWXtJVCkNRmi3WTQByVLClA9GfRBJAVwZNAHkRTAkUEfRFIARwZ9EEkBHBn0QSQFcGTQB5EUwJFBH0RSAEcGfRBJARwZ9EEkBXBk0AeRFMCRQR9EUgBHBn0QSQEcGfRBJAVwZNAHkRTAkUEfRFIARwZ9EEkBHBn0QSQFcGTQB5EUwJFBH0RSAEcGfRBJARwZ9EEkBXBk0AeRFMCRQR9EUgBHBn0QSQEcGfRBJAVwZNAHkRTAkUEfRFIARwZ9EEkBHBn0QSQFcGTQB5EUwJFBH0RSAEcGfRBJARwZ9EEkBXBk0AeRFMCRQR9EUgBHBn0QSQEcGfRBJAVwZNAHkRTAkUEfRFIARwZ9EEkBHBn0QV1J2QCaIYM+qCspAHaQFECDpAAaJAXQICmABkkBNEgKoEFSAA2SAmiQFECDpAAaJAXQICmABkkBNEgKoEFSAA2SAmiQFECDpAAaJAXQICmABkkBNEgK0G1r6/+itYhTfb0XrQAAAABJRU5ErkJggg==";
        };
        /**
         * Returns the localized placeholder for the button.
         */
        CommonUtils.getButtonBlockPlaceholder = function () {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAykAAAFnCAMAAACVefZtAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFsrKys7OztLS0tbW1tra2t7e3uLi4ubm5urq6u7u7vLy8vb29vr6+v7+/wMDAwcHBwsLCw8PDxMTExcXFxsbGx8fHyMjIycnJysrKy8vLzMzMzc3Nzs7Oz8/P0NDQ0dHR0tLS09PT1NTU1dXV1tbW19fX2NjY2dnZ2tra29vb3Nzc3d3d3t7e39/f4ODg4eHh4uLi4+Pj5OTk5eXl5ubm5+fn6Ojo6enp6urq6+vr7Ozs7e3t7u7u7+/v8PDw8fHx8vLy8/Pz9PT09fX19vb29/f3+Pj4+fn5+vr6+/v7/Pz8/f39/v7+////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAl9mDJAAAAAlwSFlzAAAScwAAEnMBjCK5BwAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMzQDW3oAABBZSURBVHhe7d15n9TUEsZxh0VwY1REXECRVUF2cAERFRfW9/927nT3U905lUpS030y09z8vn95T9I99WnO0zedVE7eeQNgGEkBMkgKkEFSgAySAmSQFCCDpAAZJAXIIClABkkBMkgKkEFSgAySAmSQFCCDpAAZJAXIIClABkkBMkgKkEFSgAySAmSQFCCDpAAZJAXIIClABkkBMkgKkDGUlGvAZGjSh4aSsgNMhiZ9iKQARpM+RFIAo0kfIimA0aQPkRTAaNKHSApgNOlDJAUwmvQhkgIYTfoQSQGMJn2IpABGkz5EUgCjSR8iKYDRpA+RFMBo0odICmA06UMkBTCa9CGSAhhN+hBJAYwmfYikAEaTPkRSAKNJHyIpgNGkD5EUwGjSh0gKYDTpQyQFMJr0IZICGE36EEkBjCZ9iKQARpM+RFIAo0kfIimA0aQPkRTAaNKHSApgNOlDJAUwmvQhkgIYTfoQSQGMJn2IpABGkz5EUgCjSR8iKYDRpA+RFMBo0odICmA06UMkBTCa9CGSAhhN+hBJAYwmfahaUnYfAVtpV1N0mCZ9qFpSPtMLgC3zmaboML0gRFLw/46kABkkBcggKUAGSQEySAqQQVKADJICZJAUIIOkABkkBcggKUAGSQEySAqQQVKADJICZJAUIIOkABkkBcggKUAGSQEySAqQQVKADJKCt9rTh/du37h95+HjlxoYC0nBW+yHE5o4e8491+A4SAreXrc1bRbOanQcJAVvr3OaNgvHNToOkoK3F0kBMkgKkEFSgAySAmSQFCCDpAAZJAXIIClABkkBMkgKkEFSgAySAmSQFCCDpAAZJAXIIClABkkBMkgKkEFSgAySAmSQFCCDpAAZJAXIIClABkkBMkgKkEFSgAySAmSQFCCDpAAZJAXIIClABkkBMkgKkEFSgAySAmSQFCCDpAAZJAXIIClABkmp5dm9a9+dn/n26q1HGst4+eDGpfnrLt14+FJjKY9uXb0wf+HF6+Xf26tksWEbKtmSz2RzJKWSH/WuCx//puFBd4/pJTPH7ml02JNP9Jq5CxqdoZKFZiUVkJRKPtC7yq6Gh/yr/c1/Gh/0sV4gjW9QKpG6/69CUirRmy4l/5mua3dzQ+NDHmt/0/ji1cgSlVRBUio5qXc1lzU+4HPtbj7X+JAr2t/8rvE9VCKNSiogKZWc17uaUxrv9+qIdl96rS0DiiPy8h+OShYqT2aSUsl9vevSX9rQ61ftvPJQW/r9o73NlxqfoZKFZiUVkJRKWt+EN7Wh12XtvJI7Y3Nbe5vbGp95pbGlw6tkaz6TCkhKLV/obc0XGu/lztbs+UBb+n2lvc0/Gp+jkrmiks2RlFpu6W3NkVfa0MOfD515qm293tXOclrDC1QyU1ayOZJSy99626WftKHHPe3adF3b+vhD+fI1/oD98CrZns9kcySlmk/1vuY7jff4Vrs2ndG2Pv5Q/k+NC5XscZVsjKRU873e1ySOrt1F7IUX2thjV7uKv/hNJfmGgDSSUs1Tve/S4NH1H9qxdF9buz3TnuaKxg2VpK9y5pGUej7UG5vBI+Wb2rH0jbZ28z+UH2t8iUralWyKpNRzSW9sBv/Al9qx9J62dnOva7+ASoZfsF8kpZ7WxeXn2tDFndc0T7S501HtKN9qeIVKKrfc7yEpFZ3QO5sHGu/ge1/N99rexc++4NQrlWi8HpJSke8IPK/xDte0mzd0zcwd0RzTcBOVVEdSKvIdgSc13qHz8xi4dekj7SZfa7jpgbaZw6uk1mcycNSWqGRDJKWil3rnpd4TMC/f0V4t/bcg/am9zF2NN1FJdSSlprN6a3NN46GftVNb/xGKP48afttSSW0kpSZ/Uv8TjYf8CdSV/iMUN/XiOwKppDaSUlOrI7Cv89u1XzT1HaG8djd9/Kjx0rQrSd0Hs08kpSrfEdhzN1Gr47fhqvaJ/KR9zDONO5OuJHVv5T6RlKp8R+BXGg/c1S6RviOUC9pHunadciUfa7gqklLV73pv03Nev7jQcM41Y/Qcobhe265Lcr438fAqOfjPpPekwbpISl2+I/AXjbe9rz3m7rjfvXe0U5vvte1cqodK6iIpdV3Um5tLGm8pv/P/dk3j3VfO3LJx3Td8+NNIh1fJQX8mH2q4LpJSl+8/6lziqlizd2+v8qzPu9qr7Yz2kIsabqOSukhKZb4Xtusm1WLZkr1/W7cAYtfCpP4idveRTKs38fAqOeDP5FeN10VSKvMdgfFFhjdvmsu5zzpf3Revv3nQPNR26f6enW4lJzRcGUmpzHcEntW480ibF2bPCDmu/17oOtHp1mPo6/GgkqpISmWtjsB4iaur2jo3r+Rr/Q/puIxXnB3qv9uDSqoiKbX5jsB4Ud3T2jo3vxJxR/9Dbs1389xVkiO9a1tTSU0kpTbf1hrep/pcGxfmLU2uPypef/oHbZX+1Uv9Qr2HV8lBfiaVF+5eIim1+Y7A9zVeKO600qderscbX8l2H2H/ItVUUhNJqc49xiO8Yvydts3pW7A4TI/PupZfuzs7/2q8g+9NPLxKDvAz6WtV3gRJqc53BEb9UMXNrDpp6hZbiK5ku5NIQzeXT7GSsf5VSUp9viMw+Dtln8YfGi0vFUZXsr/RNhlaZo5KKiIp9fmOwPatqsVv7WXDVPlvEd1k8Z42iU2nTlRSD0mpz3cEthdLKK4TLFcSdXdntG/c+01bZHiR6ulV0tlTtjGSUt8v+gPmnMZXiofqLieNe8ZO+8SrO9ofXqTa9yYeXiUH9Zl0dbxsjqSMwHUEthqRnmjDwupkTXHpbedo6xKaO5fVd2e5UEk1JGUE7uC69c9XXCtrdDO5BRT9iqHu+zWzSLXvTTy8SrbnM1kTSRmB7wj0hwSfa3yusdEdc/sHWLlj9vZy2W1Tq6T+wt1LJGUE/oYJ3wRbrLnzswZnyvM4/t4997Xsv14jvjfxECvZms9kTSRlDL4j8G+NL5S/s5t9te7agDvjWV5b6Fm4oYFKaiEpY/AdgWUTbHErX/GwT3eIckPDC+56dW6RaiqphaSMwa2V4Ppbiyaooq/D9TCVi4a6HqjcItW+N7GspGhAHLmSg/hM2ldp6iEpo3AdgcVRwX8aXPhNowvuIyrueHLvmVykmkoqISmj8B2BzZ+oxeGEu67g7rVo3vHkViLNLlK9PZX4hwgdXiVrISmj8B2BzYV1iqVB3dKj7v695klPd/9fdpFqKqmEpIzDdQQ2T24Wm/wNr+U94c3V5nL3lLdtTyVuTdRDrGQdJGUcviNwtcRV+fgo3xzr1hlp3PFUtoP0rWddmk4l/hJNXSRlHL4jcHVyM+4uN+4Bjau7LcolfvaxSDWV1EFSRuI6AleXCL7SyFyr+8JdVF+9zK2nGN1e24FKqiApIyk/2MVCb3PFdGmvTVX0P+3svNCwW6O39b3bYyqV+EaXykjKSNwhw/Lfv+z4a18AcOu239ewu27XPG80ZHsqcZfbD7GSNZCUkbxwHYF2F19xfSP4NeyeBWIvc88S2c8i1VRSBUkZi+sItDsniicY+NbzmfKsrr2sfD5V6z6oXttTiTuMOsRK9o+kjMV3BC5+b77S/1qI1q8qlr3a2XmyGC2Wgd/nItVUUgNJGYvvCFy0/RVPuT06H3Lcc3AXL3M3xLd/9PahkhpIymhc996n88HimXJhn5J7tvpizbnyUXRHii7BYVRSAUkZje8InC9IWpzYjFdxcz8r5qeCivUVB5bLbptCJWUT/whIymh8R+DsNo6y+TW+VOYO5mf3XPyl/5b9LlK9PZWUK7DUrMQ3i1VHUsbjOgJnN+QVCyR0nK0pm6Dmv1SLR4WusUg1lWyOpIzHdQTOPtxiVaGue1nLw4qTeyPlwcf+C9+eStxZrEOsZL9Iynh8R+Aj10B+R/t55U/V2cpY5Q/a+FC+D5VsjqSMyHUEXnY3JXXdTuFOf171J0nXWKR66pU8++HcqZPH3jn+/pmL8ZPzhpGUEZUf7s5ueWz9kfZqO6o9Fj5xhyzrLFI97UpeF3d8ncytkOGRlBHd018yf32h/5jzyyGulG0aO/+UP4Ojdo8h067EXcVZ7zwZSRnRC/0lc6vov+i+qOxa/1wrbblySc6kKylu0p85Uq7Kl0NSxuQ6AssTOMvbLFpc00fcH7g/U66kPHCbKZfXyyEpY/IdgU19j0Ysb1EqtW4JTJlwJf7+nD19f6cLSRmT7whsuqp9Ipe1T6S5TFbehCvxK57tWadDn6SMyv+WbHikXSLunGjTuotUT7eScoovDDwUPEJSRuU7Alf6/3WPa6+2rovYQ6ZbSTTt1rgQRFJG5TsCV/q7cN2Sbw3rXQyYciXRD5w1ztqRlHG5jsCVH7VDzC0j2tBejyFpspWUp8kW1viJRVLG5ToCV55qh5h/mMPS+otUT7aSKJhrrE5BUsbV9Tt06FpE18/e/q/dPpOtpHhIjOhO/P0gKSPr+B06tD6Ce4TO0gaLVE+1kmjarZZETiMpIys/4KWu7nLjHstmNlmkeqqVRH9tjZvuScrIfEegDN6iVz7q02yySPVUKwmuPO5niVhDUkbmOwIXdrW1W/y9G99lnjPVSoJulnUuBZGUsbmOwIXhNXSLu8vNZotUT7WS9s+idR5bT1LGFl4G6GvbWHjhbg6c2+wJITUrWSxOt66DrcTdWbzmbyySMrpT+nsN7kmGoRvat+HEhqu/TbUSd3r5yGON7wtJGd3zi+6r8N3uO/ua7vgLAec3XalnspVcaN4udqb/AmcXknIQ/nh489qVmctXr9/P/xZ+/vju9cvz1135/uYva3ePNE20ktcPrn55+tTu6bMX7/inSGaRFCCDpAAZJAXIIClABkkBMkgKkEFSgAySAmSQFCCDpAAZJAXIIClABkkBMkgKkEFSgG1DUoAMkgJkkBQgg6QAGSQFyCApQAZJATJICpBBUoAMkgJkkBQgg6QAGSQFyCApQAZJATJICpBBUoAMkgJkkBQgg6QAGSQFyCApQAZJATJICpBBUoAMkgJkkBQgg6QAGSQFyCApQAZJATJICpBBUoAMkgJkkBQgg6QAGSQFyCApQAZJATJICpBBUoAMkgJkkBQgg6QAGSQFyCApQAZJATK2LCm7j4GttKspOkyTPlQtKcBbT5M+RFIAo0kfIimA0aQPkRTAaNKHSApgNOlDJAUwmvQhkgIYTfoQSQGMJn2IpABGkz5EUgCjSR8iKYDRpA+RFMBo0odICmA06UMkBTCa9CGSAhhN+hBJAYwmfYikAEaTPkRSAKNJHyIpgNGkD5EUwGjSh0gKYDTpQyQFMJr0IZICGE36EEkBjCZ9iKQARpM+RFIAo0kfIimA0aQPkRTAaNKHSApgNOlDJAUwmvQhkgIYTfoQSQGMJn2IpABGkz5EUgCjSR8iKYDRpA+RFMBo0odICmA06UMkBTCa9CGSAhhN+hBJAYwmfYikAEaTPjSUlGvAZGjSh4aSAmCGpAAZJAXIIClABkkBMkgKkEFSgAySAmSQFCCDpAAZJAXIIClABkkBMkgKkEFSgAySAmSQFCCDpAAZJAXIIClABkkBMkgKkEFSgAySAgx78+Z/6GjlBrbmrYMAAAAASUVORK5CYII=";
        };
        /**
         * Returns the image placeholder for the content block.
         */
        CommonUtils.getContentBlockPlaceholder = function () {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMUAAAB2CAYAAAB4ZlcrAAAAAXNSR0IArs4c6QAABEVJREFUeAHt3cFO4zAURmEGZsF70Q2ob0sFG54MCWZUFgjZIJs0jnJ9P1aN7bi+589Rkra0fx4fH/9d+UMAgU8C15+PPEAAgQ8CpHAgIFAQIEUBxCYCpHAMIFAQ+Ftsf2wej8fvmrUhMB2B0+lU1eRMUSHRkJ0AKbIfAeqvCJCiQqIhOwFSZD8C1F8RIEWFREN2AqTIfgSovyJAigqJhuwESJH9CFB/RYAUFRIN2QmQIvsRoP6KACkqJBqyEyBF9iNA/RUBUlRINGQn8O2nZDNAeX9/v3p6espQ6q9qvLm5ubq/v//VPrMNdqaYLVH1XEyAFBcjNMFsBEgxW6LquZgAKS5GaILZCKS90f4pyIeHh5+6pmz3YkMdKykKJtfXTp4FknSbjoB0kSu4RYAULUL60xEgRbrIFdwi4J6iQej8zvfLy0tj1P67z+9U393d7X+hO1ghKTpCeH197Ri17yFnKfz1EXD51MfJqEQESJEobKX2ESBFHyejEhFwT7Ew7MPhsHDPbXab4cWBbUjVz0KKmklXy+3tbdc4g+IRcPkULzMrHkyAFIMBmz4eAVLEy8yKBxMgxWDApo9HgBTxMrPiwQRIMRiw6eMRIEW8zKx4MAFSDAZs+ngESBEvMyseTIAUgwGbPh4BUsTLzIoHEyDFYMCmj0eAFPEys+LBBHxKdiHg0+m0cE+77Z2AM8XeE7K+zQmQYnPknnDvBEix94Ssb3MCpNgcuSfcOwE32o2Ezl+4nO2byBtIpu8mRUfEvom8A9JEQ1w+TRSmUtYhQIp1OJplIgKkmChMpaxDwD1Fg+Msv7ft97EbQX/pdqb4AsNDBM4ESOE4QKAgQIoCiE0ESOEYQKAg4Ea7ANK7ufd3uf0+dm+S9ThS1Ey6WrzL3YUp5CCXTyFjs+iRBEgxkq65QxIgRcjYLHokAVKMpGvukARIETI2ix5JgBQj6Zo7JAFShIzNokcSIMVIuuYOSYAUIWOz6JEESDGSrrlDEiBFyNgseiQBUoyka+6QBEgRMjaLHknAp2QX0vWt4wvBBdjNmSJASJa4LQFSbMvbswUgQIoAIVnitgRIsS1vzxaAgBvtRki+dbwBaMJuUnSE6v+xOyBNNMTl00RhKmUdAqRYh6NZJiJAionCVMo6BEixDkezTESAFBOFqZR1CJBiHY5mmYgAKSYKUynrECDFOhzNMhEBb94VYT4/PxctNrMRIEWR+NvbW9FiMxsBl0/ZEldvkwApmogMyEaAFNkSV2+TQNp7ivMnX4/HYxOQAfkIOFPky1zFDQKkaADSnY8AKfJlruIGAVI0AOnOR4AU+TJXcYMAKRqAdOcjQIp8mau4QYAUDUC68xEgRb7MVdwgQIoGIN35CJAiX+YqbhAgRQOQ7nwESJEvcxU3CHz7KVm/0tOgpntqAs4UU8eruCUESLGEmn2mJkCKqeNV3BICpFhCzT5TE/gPlq4zd0DZ51YAAAAASUVORK5CYII=";
        };
        /**
         * Returns the image placeholder for the video block.
         */
        CommonUtils.getVideoPlaceholder = function () {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMUAAAB2CAYAAAB4ZlcrAAAAAXNSR0IArs4c6QAABRxJREFUeAHtnUtO40AURaubQJbBd8QymCGxW5gwgGUgJP7LQBDRqrQKJXm28+w4savuyQRcLn/ueXVkG2L7z/X19U/gAwEI/BL4+/sbv0AAAnMCSMFAgMAKAaRYAcIkBJCCMQCBFQKTlen55NXVVVUzbRAojsDNzY3JxJHCIKFBnQBSqI8A8hsCSGGQ0KBOACnURwD5DQGkMEhoUCeAFOojgPyGAFIYJDSoE0AK9RFAfkMAKQwSGtQJIIX6CCC/IYAUBgkN6gSQQn0EkN8QQAqDhAZ1AkihPgLIbwgghUFCgzoBpFAfAeQ3BJDCIKFBnQBSqI8A8hsCSGGQ0KBOACnURwD5DQGkMEhoUCeAFOojgPyGAFIYJDSoE0AK9RFAfkMAKQwSGtQJIIX6CCC/IYAUBgkN6gSQQn0EkN8QQAqDhAZ1AkihPgLIbwgghUFCgzoBpFAfAeQ3BJDCIKFhlcDn5+dqU9HTlW8yKjFx1RtrSsyZMvXxNqoow8vLS/j4+AiXl5dp1cX/lJGi+Er2GHBRhtls1uOa81gVUuRRp53spboMCTJSJBLCP5FhufhIscxDagoZqsstLUUfF6PVWHfb2vaPCMjQXB9pKZrRlDcXGXw1RQofp6x7tZFhMpmE7+/vrPNuuvNIsSnBES/fVobj4+NwcnISbm9vR5xq+7uGFNtnPMgWHh4e5v90W/d/hnhkODo6Cqenp2F/f3+QfR3bRpFibBXpaX9eX18b14QM9XiQop5NkXP29vZ+jwwHBwdFZtw0FFJsSjCT5ZHBXyik8LPKsmeU4fDwMJydnQWODL4SIoWPU3a9kgzxAno6nWa3/0PuMFIMSX+L2764uECGjny5yagjuLEvxtGhe4WQojs7liyUAFIUWlhidSeAFN3ZsWShBJCi0MISqzsBpOjOjiULJYAUhRaWWN0JIEV3dixZKAGkKLSw8V4KPt0IIEU3bqNf6v7+PsR7KpCjfan4mkd7ZlksEW8uivdUxKf78YXAdiVDina8suu9KEe6w45vyzaXESma+RQzN8oRnwv7/v7OTUZrqooUawCVNjvJEU+r0pGDe7OXq8yF9jKPYqbiUzniPRV1n/gYm+fn53B3dxceHx/D19dXXVe5do4UhZb8/Px8/oSO9Cj9eISo+iQ54mlVesRNVT+lNqQouNrxnoo2cjw9PYW3t7eCifiicfrk45R1ryRHvBvPc1qVddgedh4peoCYyyrayJFLpm3sp/TpU9undW+jAEOsM8kRH2qw7ppjiP0bepscKYauwIDbT3J4TqsG3M2dbxopdo58fBtEjuWaIMUyD+kp5PhffulrCmkDGsInORavORq6FzdLRopSXuW1yxG4KMcutzv0tjh9GroCGWw/yqH0QQqlapPVRQApXJjopEQAKZSqTVYXAaRwYaKTEgGkUKo2WV0EkMKFiU5KBJBCqdpkdRFAChcmOikRQAqlapPVRQApXJjopEQAKZSqTVYXAaRwYaKTEgGkUKo2WV0EkMKFiU5KBJBCqdpkdRFAChcmOikRQAqlapPVRQApXJjopEQAKZSqTVYXAaRwYaKTEgGkUKo2WV0EkMKFiU5KBJBCqdpkdRFAChcmOikRQAqlapPVRQApXJjopEQAKZSqTVYXAaRwYaKTEgGkUKo2WV0EkMKFiU5KBJBCqdpkdRFAChcmOikRqHyTkeqrdJUKT9Z6Ahwp6tkwR5QAUogWntj1BJCing1zRAkghWjhiV1P4B+SqQo/scYf5wAAAABJRU5ErkJggg==";
        };
        CommonUtils.elementType = 1;
        CommonUtils.commentType = 8;
        return CommonUtils;
    }());
    Editor.CommonUtils = CommonUtils;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var BrowserQuirks = /** @class */ (function () {
        function BrowserQuirks() {
        }
        BrowserQuirks.fixCheckedNodes = function (node) {
            if (node && Editor.CommonUtils.getInternetExplorerVersion() === 11) {
                node
                    .find('input[checked="checked"]')
                    .each(function (index, element) {
                    element.setAttribute("checked");
                });
            }
        };
        return BrowserQuirks;
    }());
    Editor.BrowserQuirks = BrowserQuirks;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="commonreferences.ts" />
var Editor;
(function (Editor) {
    var CommonConstants = /** @class */ (function () {
        function CommonConstants() {
        }
        // TOOLS
        CommonConstants.buttonToolType = "Button";
        CommonConstants.buttonToolLabel = "[Button]";
        CommonConstants.buttonToolImageAltText = "[Button]";
        CommonConstants.buttonToolTitle = "[Button]";
        CommonConstants.buttonEmptyHref = "#";
        CommonConstants.dividerToolType = "Divider";
        CommonConstants.dividerToolLabel = "[Divider]";
        CommonConstants.dividerToolImageAltText = "[Divider]";
        CommonConstants.dividerToolTitle = "[Divider]";
        CommonConstants.imageToolType = "Image";
        CommonConstants.imageToolLabel = "[Image]";
        CommonConstants.imageToolImageAltText = "[Image]";
        CommonConstants.imageToolTitle = "[Image]";
        CommonConstants.textToolType = "Text";
        CommonConstants.textToolLabel = "[Text]";
        CommonConstants.textToolImageAltText = "[Text]";
        CommonConstants.textToolTitle = "[Text]";
        CommonConstants.contentBlockToolType = "Content";
        CommonConstants.contentBlockLookupContainerId = "contentBlockLookupContainer";
        CommonConstants.contentBlockLinkInputCssClass = "contentBlockLinkInput";
        CommonConstants.videoToolType = "Video";
        CommonConstants.videoToolLabel = "[Video]";
        CommonConstants.videoToolTitle = "[Video]";
        CommonConstants.videoToolCss = "videoTool";
        // EDITOR CONTROL
        /**
        * Class name to identify layout iframes.
        */
        CommonConstants.layoutFrameClassName = "editor-control-layout";
        /**
        * Class name to identify editor container.
        */
        CommonConstants.editorContainerCssClass = "editorContainer";
        /**
        * Class name to identify content editor element.
        */
        CommonConstants.contentEditorCssClass = "contentEditor";
        /**
        * Class name to identify content resolver iframe.
        */
        CommonConstants.contentResolverFrameClassName = "editor-control-content-resolver";
        /**
        * Class name to identify editor title in readonly mode.
        */
        CommonConstants.editorReadonlyTitleClassName = "editorReadonlyTitle";
        /**
        * Default type for the button
        */
        CommonConstants.buttonType = "button";
        /**
        * Class name to identify editor dialogs.
        */
        CommonConstants.popupCssClassName = "editorPopupCssClass";
        /**
        * Class name to identify JQuery-ui overlays.
        */
        CommonConstants.overlayCssClassName = "ui-widget-overlay";
        /**
         * Class name to identify hidden buttons used for accessibility navigation
         */
        CommonConstants.accessibilityButtonClassName = "editorAccessibilityButton";
        // BLOCKS
        /**
        * The block's attribute indicating that the inline toolbar was added for that block.
        */
        CommonConstants.toolbardataAttrName = "data-toolbar";
        CommonConstants.makeEditableAttrName = "data-makeeditable";
        CommonConstants.designerImageSourceAttributeName = "data-src";
        CommonConstants.designerTextBlockImageSourceAttributeName = "src";
        // Video
        CommonConstants.videoWrapperClass = "videoWrapper";
        CommonConstants.videoIdAttrName = "data-video-id";
        CommonConstants.videoNameAttrName = "data-video-name";
        CommonConstants.videoUrlAttrName = "data-video-url";
        CommonConstants.videoThumbnailUrlAttrName = "data-video-thumbnail";
        CommonConstants.videoEmbedCodeAttrName = "data-video-embed-code";
        /**
        * The attribute name for the ckeditor container
        */
        CommonConstants.ckEditorAttrName = "data-ckEditor";
        CommonConstants.draggableCursor = "move";
        CommonConstants.draggableOpacity = 0.75;
        CommonConstants.draggableHelperWidth = 225;
        CommonConstants.draggableHelperHeight = 15;
        CommonConstants.draggableHandleChar = "&#x2725;";
        CommonConstants.draggableHandleWrapperClassName = "handleWrapper";
        CommonConstants.draggableHandleClassName = "handle";
        CommonConstants.sortablePlaceholderClassName = "sort-highlight";
        CommonConstants.regularSortablePlaceholderClassName = "regular-sort-highlight";
        CommonConstants.selectedSortablePlaceholderClassName = "selected-sort-highlight";
        CommonConstants.sortableDragHandlerClassName = "grab";
        // TOOLBOX
        CommonConstants.toolboxItemClassName = "tool-card";
        CommonConstants.toolboxItemButtonCssClassName = "tool-card-button";
        CommonConstants.contentViewBlocksClassName = "contentViewBlocks";
        CommonConstants.toolboxDefaultSectionName = "ContentBlock";
        CommonConstants.toolboxDefaultSectionLabel = "[Content Block]";
        CommonConstants.toolboxSelectedToolItemClassName = "selectedToolItem";
        /**
        * The toolbox items's attribute that contains the tool id.
        */
        CommonConstants.toolboxItemTypeDataAttr = "editortool-type";
        CommonConstants.toolboxItemIdDataAttr = "editortool-id";
        CommonConstants.toolboxSectionNameDataAttr = "section";
        // HTML editor
        CommonConstants.htmlEditorContentAreaClassName = "htmlEditorContentTextArea";
        CommonConstants.htmlEditorComponentName = "htmlEditor";
        CommonConstants.htmlTabControlDataId = "htmlContentTabButton";
        CommonConstants.htmlWarningMessageId = "htmlWarningMessage";
        CommonConstants.htmlWarningMessageLabel = "[Protected Content]";
        CommonConstants.htmlEditorNotSupportedMessageClassName = "htmlEditorNotSupportedMessage";
        // Designer editor
        CommonConstants.selectedDataContainerClassName = "selectedDataContainer";
        CommonConstants.contentEditableAttrName = "contenteditable";
        CommonConstants.wrapperContainerClassName = "wrapperContainer";
        CommonConstants.designerContentEditorFrameClassName = "designerContentEditorFrame";
        CommonConstants.designerContentEditorFrameId = "designer-content-editor";
        CommonConstants.designerContentEditorFrameWrapperClassName = "designerContentEditorFrameWrapper";
        CommonConstants.iosScrollClassName = "iosScroll";
        CommonConstants.designerIosContainerClassName = "designerIosContainer";
        CommonConstants.htmlContentEditorFrame = "htmlContentEditorFrame";
        CommonConstants.designerContentEditorContainerInDragModeClassName = "containerDragMode";
        CommonConstants.treeViewCssClass = "treeView";
        CommonConstants.propertiesTitleCssClass = "propertiesTitle";
        CommonConstants.propertiesTitleButtonCssClass = "propertiesTitleButton";
        CommonConstants.extrasToggleCssClass = "extrasToggle";
        CommonConstants.collapsedCssClass = "collapsed";
        CommonConstants.contentBlockItemsCssClass = "contentBlockItems";
        CommonConstants.contentBlockSectionCssClass = "contentBlockSection";
        CommonConstants.contentBlockSectionEmptyCssClass = "contentBlockSection-empty";
        CommonConstants.contentBlockSectionSubtitleCssClass = "contentBlockSection-subtitle";
        CommonConstants.contentBlockSectionSubtitleId = "headerSubtitleId";
        CommonConstants.contentBlockSectionEmptyMessageCssClass = "contentBlockSection-empty-message";
        CommonConstants.contentBlockSectionEmptyMessage = "[ContentBlockSectionEmptyMessage]";
        CommonConstants.contentBlockCantInsertMoreBlocks = "[ContentBlockCantInsertMoreBlocks]";
        CommonConstants.contentBlockSectionLoadingCssClass = "contentBlockSection-loading";
        CommonConstants.contentBlockSectionLoadingMessageCssClass = "contentBlockSection-loading-message";
        CommonConstants.contentBlockSectionLoadingMessage = "[ContentBlockSectionLoadingMessage]";
        CommonConstants.tabSelectedCssClass = "ui-tabs-active ui-state-active";
        CommonConstants.designerControlCssClass = "designer";
        CommonConstants.designerTabViewCssClass = "designerTabView";
        CommonConstants.designerTabButtonViewCssClass = "designerTabButtonView";
        CommonConstants.designerOverlayHiddenElementCssClassName = "designer-content-editor-hidden";
        CommonConstants.designerUnconfiguredContentOverlayCssClassName = "designer-unconfiguredcontent-overlay";
        CommonConstants.unconfiguredOverlayIconCssClassName = "unconfigured-overlay-icon";
        CommonConstants.designerEditorComponentName = "designerEditor";
        CommonConstants.dataTrackAttributeName = "data-msdyn-tracking";
        CommonConstants.dataTargetAttributeName = "target";
        CommonConstants.dataTrackIdAttributeName = "data-msdyn-tracking-id";
        CommonConstants.protocolRegex = /^([a-z]+:\/\/|mailto:|#|{{)/;
        CommonConstants.defaultProtocol = "http://";
        CommonConstants.designerTabControlDataId = "designerContentTabButton";
        // Full Page editor
        CommonConstants.fullPageContentEditorcssClass = "fullPageContentEditor";
        CommonConstants.fullPageContentEditorFrameClassName = "fullPageContentEditorFrame";
        CommonConstants.fullPageEditorComponentName = "fullPageEditor";
        // MenuBar
        CommonConstants.menuBarControlCssClass = "menuBarControlLayout";
        CommonConstants.menuBarCssClass = "menuBar";
        CommonConstants.menuBarItemsCssClass = "menuBarItems";
        CommonConstants.toolbarButtonCssClass = "toolbarButton";
        CommonConstants.undoButtonCssClass = "undoButton";
        CommonConstants.undoButtonImageCssClass = "undoButtonImage";
        CommonConstants.undoButtonLabelCssClass = "undoButtonLabel";
        CommonConstants.redoButtonCssClass = "redoButton";
        CommonConstants.redoButtonImageCssClass = "redoButtonImage";
        CommonConstants.redoButtonLabelCssClass = "redoButtonLabel";
        CommonConstants.warningIndicatorLabelCssClass = "warningButtonLabel";
        CommonConstants.warningButtonImageCssClass = "warningButtonImage";
        CommonConstants.warningButtonCssClass = "warningButton";
        CommonConstants.maximizeButtonImageCssClass = "maximizeButtonImage";
        CommonConstants.maximizeButtonCssClass = "maximizeButton";
        CommonConstants.maximizeButtonLabelCssClass = "maximizeButtonLabel";
        CommonConstants.maximizeActiveCssClass = "maximizeButton-active";
        CommonConstants.fullscreenClose = "fullscreen_close";
        CommonConstants.toolsDropdownCssClass = "toolsDropdown";
        CommonConstants.selectedToolsDropdownCssClass = "selectedToolsDropdown";
        CommonConstants.menuBarDividerCssClass = "menuBarDivider";
        // Control tabs
        CommonConstants.toolboxTabContentClassName = "toolboxTabContent";
        CommonConstants.detailsTabContentClassName = "detailsTabContent";
        CommonConstants.htmlTabContentClassName = "htmlContentEditor";
        CommonConstants.designerTabContentClassName = "designerContentEditor";
        CommonConstants.previewViewClassName = "previewView";
        CommonConstants.browserPreviewTabContentClassName = "browserPreview";
        CommonConstants.tabButtonPreClassName = "tabButton_";
        CommonConstants.previewTabControlDataId = "previewContentTabButton";
        CommonConstants.previewTabControlCssClass = "preview";
        CommonConstants.previewTabButtonViewCssClass = "previewTabButtonView";
        CommonConstants.browserPreviewComponentName = "browserPreview";
        // Tab Control
        CommonConstants.designerTabContainer = "designerTabContainer";
        CommonConstants.designerTabAnchor = "designerTabAnchor";
        CommonConstants.designerTabPaneLabel = "designerTabPaneLabel";
        // Details view
        CommonConstants.detailsViewPropertiesClassName = "detailsViewProperties";
        CommonConstants.userDetailsViewSimpleInput = "userDetailsViewSimpleInput";
        // Styles view
        CommonConstants.stylesTabContentClassName = "stylesTabContent";
        CommonConstants.stylesViewFrameClassName = "stylesViewFrame";
        // Accessibility popup
        CommonConstants.accessibilityPopupClassName = "accessibilityPopup";
        CommonConstants.accessibilityLegendClassName = "accessibilityLegend";
        CommonConstants.accessibilityLegendSectionClassName = "accessibilityLegendSection";
        CommonConstants.accessibilityLegendSectionLabelClassName = "accessibilityLegendSectionLabel";
        CommonConstants.accessibilityLegendSectionElementClassName = "accessibilityLegendSectionElement";
        CommonConstants.accessibilityLegendSectionElementCaptionClassName = "accessibilityLegendSectionElementCaption";
        // Aria Labels
        CommonConstants.colorFieldAriaLabel = "colorFieldAriaLabel";
        // Text Direction (localization dependent)
        CommonConstants.leftToRightTextDirectionCssClass = "ltr";
        CommonConstants.rightToLeftTextDirectionCssClass = "rtl";
        //font
        CommonConstants.editorFontCssClass = "CCFSymbolFont";
        CommonConstants.fontIconSizeCssClass = "fontIconSize";
        CommonConstants.iconContainerCssClass = "iconContainer";
        // UTILS
        CommonConstants.normalizedBooleanTrue = "true";
        CommonConstants.normalizedBooleanFalse = "false";
        return CommonConstants;
    }());
    Editor.CommonConstants = CommonConstants;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    var AccessibilityInstructionsPopup = /** @class */ (function () {
        function AccessibilityInstructionsPopup(logger) {
            this.logger = logger;
            this.popup = new Editor.PopupRenderer();
            this.popup.setup(new MktSvc.Controls.Common.EventBroker(this.logger));
        }
        AccessibilityInstructionsPopup.prototype.show = function () {
            if ($("." + Editor.CommonConstants.accessibilityPopupClassName).length > 0) {
                return;
            }
            if (!AccessibilityInstructionsPopup.accessibilityInstructions) {
                AccessibilityInstructionsPopup.accessibilityInstructions = Editor.EditorAccessibilityInstructions.baseControlAccessibilityInstructions;
            }
            var containerId = this.popup.render(Editor.CommonUtils.getLocalizedString("[Accessibility Instructions]"), function () {
                return true;
            }, null, true, Editor.CommonConstants.accessibilityPopupClassName, "500px", "250px");
            this.render().appendTo("#" + containerId);
        };
        AccessibilityInstructionsPopup.prototype.render = function () {
            var legend = $("<div>")
                .attr("role", Editor.AriaRoleConstants.document)
                .attr("tabindex", "0")
                .addClass(Editor.CommonConstants.accessibilityLegendClassName);
            var dialogData = AccessibilityInstructionsPopup.accessibilityInstructions;
            var _loop_1 = function (sectionName) {
                var localizedSectionName = Editor.CommonUtils.getLocalizedString(sectionName);
                $("<h1>").text(localizedSectionName)
                    .addClass(Editor.CommonConstants.accessibilityLegendSectionLabelClassName)
                    .appendTo(legend);
                var sectionElement = $("<dl>")
                    .addClass(Editor.CommonConstants.accessibilityLegendSectionClassName)
                    .appendTo(legend);
                // Create elements inside section
                dialogData[sectionName].forEach(function (instructionElement) {
                    var elementCaption = $("<dt>")
                        .addClass(Editor.CommonConstants.accessibilityLegendSectionElementCaptionClassName)
                        .text(Editor.CommonUtils.getLocalizedString(instructionElement.caption));
                    var shortcutLabel = (instructionElement.keyboardShortcut
                        ? Editor.CommonUtils.getLocalizedString("Press") + " " + instructionElement.keyboardShortcut + " "
                        : String.Empty);
                    var elementDescription = $("<dd>")
                        .addClass(Editor.CommonConstants.accessibilityLegendSectionElementClassName)
                        .text(shortcutLabel +
                        (instructionElement.description
                            ? Editor.CommonUtils.getLocalizedString(instructionElement.description)
                            : String.Empty));
                    sectionElement.append(elementCaption).append(elementDescription);
                });
            };
            for (var sectionName in dialogData) {
                _loop_1(sectionName);
            }
            return legend;
        };
        AccessibilityInstructionsPopup.prototype.dispose = function () {
            this.popup.dispose();
        };
        return AccessibilityInstructionsPopup;
    }());
    Editor.AccessibilityInstructionsPopup = AccessibilityInstructionsPopup;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var EditorAccessibilityInstructions;
    (function (EditorAccessibilityInstructions) {
        EditorAccessibilityInstructions.baseControlAccessibilityInstructions = {
            "General actions": [
                {
                    caption: "[Toggle Full Screen View]",
                    keyboardShortcut: "Alt+F11"
                }
            ],
            "Tab Navigation": [
                {
                    caption: "[Navigate to Menu bar]",
                    keyboardShortcut: "Alt+Ctrl+0"
                },
                {
                    caption: "[Navigate to Designer Editor]",
                    keyboardShortcut: "Alt+1"
                },
                {
                    caption: "[Navigate to HTML Editor]",
                    keyboardShortcut: "Alt+2"
                },
                {
                    caption: "[Navigate to Preview View]",
                    keyboardShortcut: "Alt+3"
                }
            ]
        };
        EditorAccessibilityInstructions.baseFullPageAccessibilityInstructions = $.extend({}, EditorAccessibilityInstructions.baseControlAccessibilityInstructions, {
            "General Editor Commands": [
                {
                    caption: "[Editor Toolbar]",
                    description: "Press Alt+F10 to navigate to the toolbar"
                },
                {
                    caption: "[Editor Dialog]",
                    description: "Press Tab to navigate to the next dialog element, press Shift+Tab to move to the previous dialog element"
                },
                {
                    caption: "[Editor List Box]",
                    description: "Inside a list-box, move to next list item with Tab OR Down Arrow"
                }
            ],
            "Base Commands": [
                {
                    caption: "[Undo command]",
                    keyboardShortcut: "Ctrl+Z"
                },
                {
                    caption: "[Redo command]",
                    keyboardShortcut: "Shift+Ctrl+Z"
                },
                {
                    caption: "[Bold command]",
                    keyboardShortcut: "Ctrl+B"
                },
                {
                    caption: "[Italic command]",
                    keyboardShortcut: "Ctrl+I"
                },
                {
                    caption: "[Underline command]",
                    keyboardShortcut: "Ctrl+U"
                },
                {
                    caption: "[Accessibility Help]",
                    keyboardShortcut: "Alt+0"
                },
                {
                    caption: "[Cancel operation]",
                    keyboardShortcut: "ESC"
                }
            ]
        });
        EditorAccessibilityInstructions.baseDesignerAccessibilityInstructions = $.extend({}, EditorAccessibilityInstructions.baseFullPageAccessibilityInstructions, {
            "Designer Commands": [
                {
                    caption: "[Move Block]",
                    keyboardShortcut: "Alt+M"
                },
                {
                    caption: "[Clone Block]",
                    keyboardShortcut: "Alt+Shift+C"
                },
                {
                    caption: "[Delete Block]",
                    keyboardShortcut: "Alt+Shift+D"
                },
                {
                    caption: "[Focus back to the designer block]",
                    keyboardShortcut: "Alt+X"
                }
            ],
            "Designer Tab Navigation": [
                {
                    caption: "[Navigate to Toolbox view]",
                    keyboardShortcut: "Alt+4"
                },
                {
                    caption: "[Navigate to Properties View]",
                    keyboardShortcut: "Alt+5"
                },
                {
                    caption: "[Navigate to Styles View]",
                    keyboardShortcut: "Alt+6"
                }
            ]
        });
        EditorAccessibilityInstructions.basePreviewAccessibilityInstructions = $.extend({}, EditorAccessibilityInstructions.baseControlAccessibilityInstructions, {
            "Basic Preview Navigation": [
                {
                    caption: "[Navigate to Browser Preview View]",
                    keyboardShortcut: "Alt+B"
                },
                {
                    caption: "[Navigate to Desktop Preview]",
                    keyboardShortcut: "Alt+Ctrl+1"
                },
                {
                    caption: "[Navigate to Tablet Portrait Preview]",
                    keyboardShortcut: "Alt+Ctrl+2"
                },
                {
                    caption: "[Navigate to Tablet Landscape Preview]",
                    keyboardShortcut: "Alt+Ctrl+3"
                },
                {
                    caption: "[Navigate to Mobile Portrait Preview]",
                    keyboardShortcut: "Alt+Ctrl+4"
                },
                {
                    caption: "[Navigate to Mobile Landscape Preview]",
                    keyboardShortcut: "Alt+Ctrl+5"
                }
            ]
        });
    })(EditorAccessibilityInstructions = Editor.EditorAccessibilityInstructions || (Editor.EditorAccessibilityInstructions = {}));
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
var Editor;
(function (Editor) {
    var AriaAttributeNames = /** @class */ (function () {
        function AriaAttributeNames() {
        }
        AriaAttributeNames.describedBy = "aria-describedby";
        AriaAttributeNames.hasPopup = "aria-haspopup";
        AriaAttributeNames.ariaExpanded = "aria-expanded";
        AriaAttributeNames.role = "role";
        AriaAttributeNames.ariaLabelledby = "aria-labelledby";
        return AriaAttributeNames;
    }());
    Editor.AriaAttributeNames = AriaAttributeNames;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var BlockProvider = /** @class */ (function () {
        function BlockProvider() {
        }
        /**
        * Gets the closest block element for the jquery element
        */
        BlockProvider.prototype.getClosestBlock = function (element) {
            return element.closest(Editor.CommonUtils.getAttrSelector(Editor.Contract.blockTypeAttrName));
        };
        /*
        * Gets the blocks from the editor content.
        */
        BlockProvider.prototype.getBlocks = function (selectedEditor) {
            return Editor.CommonUtils.getBySelector(Editor.CommonUtils.getAttrSelector(Editor.Contract.blockTypeAttrName), selectedEditor);
        };
        /**
         * Gets the blocks of a particular type from the editor content.
         * @param selectedEditor
         * @param blockType
         */
        BlockProvider.prototype.getBlocksOfType = function (selectedEditor, blockType) {
            return Editor.CommonUtils.getBySelector(Editor.CommonUtils.getAttrEqualsSelector(Editor.Contract.blockTypeAttrName, blockType), selectedEditor);
        };
        /**
         * Get the last element before the container, for a jquery element.
         * if the jquery element itself, is the last - this will be returned.
         * @param selectedElement selected element.
         */
        BlockProvider.getLastElementBeforeContainer = function (selectedElement) {
            if (Object.isNullOrUndefined(selectedElement)) {
                return null;
            }
            var element = selectedElement.parentsUntil(Editor.CommonUtils.getAttrSelector(Editor.Contract.containerAttrName)).last();
            if (element.length === 0) {
                return selectedElement;
            }
            return element;
        };
        /**
         * Get content editable element from container
         * @param element container
         */
        BlockProvider.getEditableElement = function (element) {
            return element.find(Editor.CommonUtils.getAttrSelector(Editor.CommonConstants.contentEditableAttrName));
        };
        return BlockProvider;
    }());
    Editor.BlockProvider = BlockProvider;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var BlockDefinition = /** @class */ (function () {
        function BlockDefinition(availableBlocks) {
            this.availableBlocks = availableBlocks;
        }
        /**
        * Gets the block definition for the jquery element
        */
        BlockDefinition.prototype.getBlockDefinition = function (blockElement) {
            var blockType = blockElement.attr(Editor.Contract.blockTypeAttrName);
            return this.availableBlocks.firstOrDefault(function (b) {
                var currentBlockType = b.getType().toString();
                return currentBlockType.toLowerCase() === blockType.toLowerCase();
            });
        };
        /**
         * Setup the available blocks.
         * @param eventBroker the eventBroker.
         */
        BlockDefinition.prototype.init = function (eventBroker) {
            this.availableBlocks.each(function (block) {
                block.setup(eventBroker);
            });
        };
        /**
         * Cleanup the html content of the block.
         */
        BlockDefinition.prototype.cleanup = function (blockElements) {
            var _this = this;
            blockElements.each(function (index, block) {
                var blockDefinition = _this.getBlockDefinition($(block));
                if (!Object.isNullOrUndefined(blockDefinition)) {
                    blockDefinition.setFinalContent($(block));
                }
            });
        };
        /**
         * Dispose the available blocks.
         */
        BlockDefinition.prototype.dispose = function () {
            this.availableBlocks.each(function (block) {
                block.dispose();
            });
        };
        return BlockDefinition;
    }());
    Editor.BlockDefinition = BlockDefinition;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BlockDefinitionFactory = /** @class */ (function () {
        function BlockDefinitionFactory() {
        }
        BlockDefinitionFactory.prototype.create = function (plugin) {
            var blocks = plugin.getToolBlockMapping().getValues();
            var distinctBlocks = blocks.distinct(function (item1, item2) { return item1.getType() === item2.getType(); });
            return new Editor.BlockDefinition(distinctBlocks);
        };
        return BlockDefinitionFactory;
    }());
    Editor.BlockDefinitionFactory = BlockDefinitionFactory;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
    * Class responsible for setting up the draggable blocks - adds the grab handler on hover
    */
    var BlockDraggableController = /** @class */ (function () {
        function BlockDraggableController(eventBroker) {
            this.draggableHandleWrapperSelector = Editor.CommonUtils
                .getClassSelector(Editor.CommonConstants.draggableHandleWrapperClassName);
            this.sortableDragHandlerSelector = Editor.CommonUtils
                .getClassSelector(Editor.CommonConstants.sortableDragHandlerClassName);
            this.eventBroker = eventBroker;
        }
        BlockDraggableController.prototype.getName = function () {
            return "BlockDraggableController";
        };
        BlockDraggableController.prototype.setupBlocks = function (blockElements) {
            var _this = this;
            blockElements.each(function (index, block) {
                _this.wrapElementWithBlock($(block));
            });
            var draggableWrappers = this.getDraggableWrappers(blockElements.first());
            draggableWrappers.on("mouseleave", function () { draggableWrappers.find(_this.sortableDragHandlerSelector).hide(); });
            draggableWrappers.on("mouseenter", function (evt) {
                $(evt.target).closest(_this.draggableHandleWrapperSelector).find(_this.sortableDragHandlerSelector)
                    .show();
            });
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.controllerReady, new Editor.ControllerReadyEventArgs(this.getName()));
        };
        BlockDraggableController.prototype.disposeBlocks = function (blockElements) {
            $(blockElements).off("mouseenter");
            this.getDraggableWrappers(blockElements.first()).off("mouseleave mouseenter");
        };
        BlockDraggableController.prototype.cleanupBlocks = function (blockElements) {
            $(Editor.CommonUtils.getAttrSelector(Editor.Contract.containerAttrName))
                .removeClass(Editor.CommonConstants.designerContentEditorContainerInDragModeClassName);
            blockElements.siblings().remove();
            blockElements.unwrap();
        };
        BlockDraggableController.prototype.dispose = function () { };
        BlockDraggableController.prototype.wrapElementWithBlock = function (block) {
            var wrapper = $("<div>");
            wrapper.addClass(Editor.CommonConstants.draggableHandleWrapperClassName);
            block.wrap(wrapper);
            var handle = $('<span style="display:none">');
            handle.addClass(Editor.CommonConstants.draggableHandleClassName);
            handle.html(Editor.CommonConstants.draggableHandleChar);
            handle.addClass(Editor.CommonConstants.sortableDragHandlerClassName);
            block.before(handle);
        };
        /*
        * Contains the logic of looking up the draggable wrappers up in the hierarchy - without knowing the upward hierarchy - div or iframe.
        */
        BlockDraggableController.prototype.getDraggableWrappers = function (element) {
            return $(this.draggableHandleWrapperSelector, element.parentsUntil("html body"));
        };
        return BlockDraggableController;
    }());
    Editor.BlockDraggableController = BlockDraggableController;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var DelayScheduler = MktSvc.Controls.Common.DelayScheduler;
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var KeyboardKeyCodes = MktSvc.Controls.Common.KeyboardKeyCodes;
    /**
    * Class responsible for setting the editable attribute for blocks
    */
    var BlockEditableController = /** @class */ (function () {
        function BlockEditableController(blockProvider, eventBroker) {
            var _this = this;
            this.config = { attributes: true, childList: true, characterData: true, subtree: true };
            this.blockProvider = blockProvider;
            this.eventBroker = eventBroker;
            this.id = UniqueId.generate(this.getName());
            this.contentBlock = null;
            this.isNonEventPropagationEnabled = false;
            this.changeTimer = new DelayScheduler(this.eventBroker, Editor.DesignerInternalEventConstants.designerNonEventPropagationStart, Editor.DesignerInternalEventConstants.designerNonEventPropagationEnd);
            this.changeTimer.init(function () {
                _this.notifyBlockChanged();
            });
            this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.designerNonEventPropagationStart, this.onNonEventPropagationStart = function () {
                _this.isNonEventPropagationEnabled = true;
            });
            this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.designerNonEventPropagationEnd, this.onNonEventPropagationEnd = function () {
                _this.isNonEventPropagationEnabled = false;
            });
            this.observer = new MutationObserver(function (mutations) {
                if (_this.isBlockChanged(mutations)) {
                    _this.changeTimer.schedule();
                    _this.isPendingOperationsExists = true;
                }
            });
        }
        BlockEditableController.prototype.getName = function () {
            return "BlockEditableController";
        };
        BlockEditableController.prototype.setupBlocks = function (blockElements) {
            var _this = this;
            this.cancelPendingOperations();
            if (Object.isNullOrUndefined(this.onSelectionChanged)) {
                this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.selectionChanged, this.onSelectionChanged = function (eventArgs) {
                    return _this.selectionChanged(eventArgs.blockElement);
                });
            }
            blockElements.each(function (index, block) {
                var $block = $(block);
                $block.on("focusout", function () {
                    $block.removeClass(Editor.CommonConstants.selectedDataContainerClassName);
                });
                // Intercept text selection by key down
                $block.on("keydown", function (event) {
                    if (event.keyCode === KeyboardKeyCodes.backspaceKey ||
                        event.keyCode === KeyboardKeyCodes.deleteKey) {
                        if (String.isNullOrEmpty($block.text())) {
                            // Stop event for the saving styles
                            event.preventDefault();
                        }
                        if ($block.attr(Editor.Contract.blockTypeAttrName) === "Button" &&
                            $block.find("a").text().length <= 1) {
                            // Stop event for the saving 'a' tag
                            event.preventDefault();
                            // Add 'br' tag for the saving 'a' tag. 'br' tag will be removed by ckeditor after adding text.
                            $block.find("a").text(String.Empty).append("<br>");
                        }
                    }
                });
                // Intercept text selection by key up
                $block.on("keyup", function (event) {
                    if ((event.keyCode === KeyboardKeyCodes.backspaceKey ||
                        event.keyCode === KeyboardKeyCodes.deleteKey) &&
                        $block.attr(Editor.Contract.blockTypeAttrName) === "Button" &&
                        !$block.find("a").length) {
                        var editor = Editor.CommonUtils.getEditorFromBlock($block);
                        // Restore 'a' tag if it removed
                        var aTag = $("<a></a>").addClass("button").append("<br>");
                        if (editor.length) {
                            editor.prepend(aTag);
                        }
                        else {
                            $block.prepend(aTag);
                        }
                        // Remove ckeditor br tag
                        if ($block.find("br").length > 1) {
                            $block.find("br").last().remove();
                        }
                    }
                });
            });
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.controllerReady, new Editor.ControllerReadyEventArgs(this.getName()));
        };
        BlockEditableController.prototype.selectionChanged = function (block) {
            if (this.isPendingOperationsExists && !this.isNonEventPropagationEnabled) {
                // Cancel pending operations and notify, that block changed before changing contentBlock variable
                this.cancelPendingOperations();
                this.notifyBlockChanged();
            }
            // Add event listener and selection on the current block
            block.addClass(Editor.CommonConstants.selectedDataContainerClassName);
            this.contentBlock = block;
            var blockContent = this.getBlockContent(block);
            this.observer.observe(blockContent.get(0), this.config);
        };
        BlockEditableController.prototype.cleanupBlocks = function (blockElements) {
            Editor.CommonUtils.removeEditable(blockElements);
            Editor.CommonUtils.removeClass(blockElements, Editor.CommonConstants.selectedDataContainerClassName);
        };
        BlockEditableController.prototype.disposeBlocks = function (blockElements) {
            blockElements.each(function (index, block) {
                $(block).removeClass(Editor.CommonConstants.selectedDataContainerClassName);
                $(block).off("focusout keydown keyup");
            });
        };
        BlockEditableController.prototype.isBlockChanged = function (mutations) {
            // We should track attributes changes for the child element, but not for the editor
            return mutations.some(function (record) { return record.type !== "attributes"; });
        };
        BlockEditableController.prototype.cancelPendingOperations = function () {
            // Cancel all scheduled operations and cleanup the observer records
            this.changeTimer.stop(true);
            this.observer.takeRecords();
            this.isPendingOperationsExists = false;
        };
        BlockEditableController.prototype.notifyBlockChanged = function () {
            if (!Object.isNullOrUndefined(this.contentBlock)) {
                this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentBlockChanged, new Editor.BlockChangedEventArgs(this.id, this.contentBlock));
            }
            this.isPendingOperationsExists = false;
        };
        BlockEditableController.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.onSelectionChanged)) {
                this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.selectionChanged, this.onSelectionChanged);
            }
            if (!Object.isNullOrUndefined(this.onNonEventPropagationStart)) {
                this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerNonEventPropagationStart, this.onNonEventPropagationStart);
            }
            if (!Object.isNullOrUndefined(this.onNonEventPropagationEnd)) {
                this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerNonEventPropagationEnd, this.onNonEventPropagationEnd);
            }
            this.observer.disconnect();
            this.isPendingOperationsExists = false;
            this.onSelectionChanged = null;
            this.onNonEventPropagationStart = null;
            this.onNonEventPropagationEnd = null;
        };
        BlockEditableController.prototype.getBlockContent = function (block) {
            return Editor.BlockProvider.getEditableElement(block).length
                ? Editor.BlockProvider.getEditableElement(block)
                : block;
        };
        return BlockEditableController;
    }());
    Editor.BlockEditableController = BlockEditableController;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    /**
    * Class responsible for adding a unique id for the block element
    */
    var BlockIdController = /** @class */ (function () {
        function BlockIdController(eventBroker) {
            this.eventBroker = eventBroker;
        }
        BlockIdController.prototype.getName = function () {
            return "BlockIdController";
        };
        BlockIdController.prototype.setupBlocks = function (blockElements) {
            blockElements.each(function (index, block) {
                if (String.isNullOrWhitespace(Editor.CommonUtils.getId($(block)))) {
                    var id = UniqueId.generate("block");
                    Editor.CommonUtils.setId($(block), id);
                }
            });
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.controllerReady, new Editor.ControllerReadyEventArgs(this.getName()));
        };
        BlockIdController.prototype.cleanupBlocks = function (blockElements) {
            blockElements.removeAttr("id");
        };
        BlockIdController.prototype.disposeBlocks = function (blockElements) {
        };
        BlockIdController.prototype.dispose = function () { };
        return BlockIdController;
    }());
    Editor.BlockIdController = BlockIdController;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var ArrayQuery = MktSvc.Controls.Common.ArrayQuery;
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var KeyCodes = MktSvc.Controls.Common.KeyCodes;
    /**
     * Class responsible for setting up a custom inline toolbar for the block.
     */
    var BlockInlineToolbarController = /** @class */ (function () {
        function BlockInlineToolbarController(eventBroker, blockProvider, blockDefinition, ckEditorProxy, commands) {
            var _this = this;
            this.blockBindEvents = "focus focusin click";
            this.blockIdsWithInitializedToolbars = [];
            this.proxyInitialized = false;
            this.blockSetup = false;
            this.toolbarPrefix = "cke_";
            this.staticToolbarOffset = 15;
            this.observerConfig = { attributes: true, attributeOldValue: true, attributeFilter: ["style"] };
            this.eventBroker = eventBroker;
            this.blockProvider = blockProvider;
            this.blockDefinition = blockDefinition;
            this.ckEditorProxy = ckEditorProxy;
            this.commands = commands;
            this.onBlockReadyHandler = this.eventBroker
                .subscribe(Editor.DesignerInternalEventConstants.ckEditorInstanceReadyEvent, function (eventArgs) { _this.setElementConfiguration(eventArgs); });
            this.onCkEditorFocusHandler = this.eventBroker
                .subscribe(Editor.DesignerInternalEventConstants.ckEditorFocus, function (eventArgs) { return _this.onToolbarShown.apply(_this, [eventArgs]); });
            this.onDesignerInitializedHandler = this.eventBroker
                .subscribe(Editor.DesignerInternalEventConstants.designerFrameInitialized, function () { return _this.onDesignerInitialized.apply(_this); });
            this.onDesignerDisposedHandler = this.eventBroker
                .subscribe(Editor.DesignerInternalEventConstants.designerFrameDisposed, function () { return _this.onDesignerDisposed.apply(_this); });
        }
        BlockInlineToolbarController.prototype.getName = function () {
            return "BlockInlineToolbarController";
        };
        BlockInlineToolbarController.prototype.handlesEditableBlockEvent = function ($block, blockDefinition, inlineToolbar) {
            var blockId = Editor.CommonUtils.getId($block);
            var editableElement = this.wrapCkeditorToolbar(blockId, $block, inlineToolbar, this.createCkEditorWrapper);
            // Remove focus from the block and set focus on the editor
            $block.blur().focusout();
            var ckEditorId = this.ckEditorProxy.getCkEditorId($block);
            editableElement = this.setToolbarEvents(ckEditorId, editableElement, $block);
            if (blockDefinition.isEditable() && blockDefinition.usePlainText()) {
                var ckEditor = this.ckEditorProxy.getCkEditorInstance(ckEditorId);
                if (!Object.isNullOrUndefined(ckEditor)) {
                    ckEditor.config.pasteFilter = "plain-text";
                    ckEditor.on("paste", function (e) {
                        e.data.dataValue = $("<p>").html(e.data.dataValue).text();
                    });
                }
            }
        };
        BlockInlineToolbarController.prototype.setToolbarEvents = function (ckEditorId, editableElement, $block) {
            var _this = this;
            this.ckEditorProxy.setEditorFocus(ckEditorId, function () {
                var localEditableElement = editableElement || Editor.BlockProvider.getEditableElement($block);
                // Remove old events
                localEditableElement.off("focus click focusout");
                var editableElementFocus = function () {
                    if (_this.selectedBlockId !== $block.attr("id")) {
                        _this.selectedBlockId = $block.attr("id");
                        _this.notifySelectionChanged($block, localEditableElement);
                        _this.fixContentPosition(ckEditorId);
                        _this.createObserver();
                        _this.observeToolbar(ckEditorId);
                        _this.appendAccessibilityButton(localEditableElement, "toolbarnav_" + $block.attr("id"), "[Navigate to toolbar]", function () {
                            // We need to cast this as any as TS typings for the std
                            // library does not support keyCode or which as part of
                            // the initialisation object.
                            _this.ckEditorProxy.setEditorFocus(ckEditorId, function () {
                                var keyDown = new Event("keydown", { bubbles: true });
                                keyDown.altKey = true;
                                keyDown.keyCode = KeyCodes.F10;
                                keyDown.which = KeyCodes.F10;
                                localEditableElement[0].dispatchEvent(keyDown);
                            });
                        });
                    }
                };
                localEditableElement.on("focus click", editableElementFocus);
                localEditableElement.on("focusout", function () {
                    if (_this.toolbarObserver) {
                        _this.toolbarObserver.takeRecords();
                        _this.toolbarObserver.disconnect();
                    }
                    // We wrap the removal of the accessibility button in a
                    // setTimeout(_, 0) to allow the screen reader to execute its
                    // click action before we remove the button.
                    setTimeout(function () {
                        _this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerNonEventPropagationStart);
                        localEditableElement.children("#toolbarnav_" + $block.attr("id")).remove();
                    }, 0);
                    setTimeout(function () {
                        _this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerNonEventPropagationEnd);
                    }, 0);
                    _this.selectedBlockId = String.Empty;
                    localEditableElement.css("margin-top", "0");
                });
                editableElementFocus();
                _this.appendAccessibilityButton(_this.getToolbar(ckEditorId), "toolbarret_" + $block.attr("id"), "[Leave toolbar]", function () { localEditableElement.focus(); });
            });
            return editableElement;
        };
        BlockInlineToolbarController.prototype.wrapCkeditorToolbar = function (blockId, $block, inlineToolbar, wrapperFunction) {
            var editableElement;
            if (!this.isToolbarInitialized(blockId)) {
                var blockChildrenElements = $block.children();
                var editorId = UniqueId.generate(BlockInlineToolbarController.editorIdPrefix);
                if (blockChildrenElements.length !== 0) {
                    Editor.BrowserQuirks.fixCheckedNodes(blockChildrenElements);
                    editableElement = blockChildrenElements.wrapAll(wrapperFunction(editorId)).parent();
                }
                else {
                    editableElement = wrapperFunction(editorId).appendTo($block);
                }
                Editor.CommonUtils.setAriaAttribute(editableElement, "aria-label", $block.attr("aria-label"));
                this.initInlineToolbar(editableElement, inlineToolbar, blockId);
            }
            return editableElement;
        };
        BlockInlineToolbarController.prototype.handlesProtectedBlockEvent = function ($block, protectedDataBlockInlineToolbar) {
            var blockId = Editor.CommonUtils.getId($block);
            var nonEditableElement = this.wrapCkeditorToolbar(blockId, $block, protectedDataBlockInlineToolbar, this.createSimpleWrapper);
            // Remove focus from the block and set focus on the editor
            $block.blur().focusout();
            var ckEditorId = this.ckEditorProxy.getCkEditorId($block);
            nonEditableElement = this.setToolbarEvents(ckEditorId, nonEditableElement, $block);
            var message = Editor.CommonUtils.getLocalizedString("[PROTECTED]");
            // Acessibility
            Editor.CommonUtils.setAriaAttribute(nonEditableElement, "aria-label", message + " " + $block.attr("aria-label"));
        };
        /**
        * Init the proxy on designer iframe initialization.
        */
        BlockInlineToolbarController.prototype.onDesignerInitialized = function () {
            var _this = this;
            this.blockIdsWithInitializedToolbars = [];
            // CkEditor initialization
            this.ckEditorProxy.init(this.getDesignerFrame().get(0), function () {
                // Setup the commands
                _this.commands.forEach(function (command) { _this.setupCommand(command); });
                _this.proxyInitialized = true;
                _this.notifyControllerReady();
            });
        };
        BlockInlineToolbarController.prototype.setupBlocks = function (blockElements) {
            var _this = this;
            this.ckEditorProxy.getCkEditorInitializedPromise().done(function () {
                blockElements.each(function (index, block) {
                    var $block = $(block);
                    var blockDefinition = _this.blockDefinition.getBlockDefinition($block);
                    if (!Object.isNullOrUndefined(blockDefinition)) {
                        $block.attr(Editor.CommonConstants.toolbardataAttrName, "true");
                        Editor.CommonUtils.setTabIndex($block, 0);
                        // The editable has to be removed from the block, otherwise the ckeditor toolbar disappears (the editable is set only for the ckeditor contrainer)
                        Editor.CommonUtils.removeEditable($block);
                        var dataEditorBlockType = $block.closest("[" + Editor.Contract.blockTypeAttrName + "]");
                        var dataProtectedAttributeValue = dataEditorBlockType.attr(Editor.Contract.dataProtectedAttribute);
                        var isProtected = dataEditorBlockType.length > 0 && dataProtectedAttributeValue && dataProtectedAttributeValue.toLowerCase() === "true";
                        if (!isProtected) {
                            var inlineToolbar = blockDefinition.getInlineToolbar();
                            if (!Object.isNullOrUndefined(inlineToolbar) && !String.isNullOrWhitespace(inlineToolbar.getName())) {
                                // Register to show the toolbar on click and focus
                                $block.on(_this.blockBindEvents, _this.handlesEditableBlockEvent.bind(_this, $block, blockDefinition, inlineToolbar));
                            }
                        }
                        else {
                            $block.on(_this.blockBindEvents, _this.handlesProtectedBlockEvent.bind(_this, $block, new Editor.ProtectedDataBlockInlineToolbar()));
                        }
                    }
                });
                _this.blockSetup = true;
                _this.notifyControllerReady();
            });
        };
        BlockInlineToolbarController.prototype.fixContentPosition = function (editorId) {
            var designerFrame = this.getDesignerFrame();
            var editableElement = designerFrame.contents().find("#" + editorId);
            var visibleToolbar = this.getToolbar(editorId, true);
            if (!editableElement.length || !visibleToolbar.length) {
                return;
            }
            var editableElementPosition = editableElement.get(0).getBoundingClientRect().top +
                designerFrame.get(0).contentWindow.pageYOffset;
            if (visibleToolbar.get(0).getBoundingClientRect().top === 0 && editableElementPosition < visibleToolbar.height()) {
                var offset = visibleToolbar.height() + this.staticToolbarOffset - editableElementPosition;
                editableElement.css("margin-top", offset + "px");
                this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerToolbarPositionChanged);
            }
        };
        BlockInlineToolbarController.prototype.createObserver = function () {
            var _this = this;
            if (!this.toolbarObserver) {
                this.toolbarObserver = new MutationObserver(function (records) {
                    if (records.length && records[0].target && records[0].oldValue !== records[0].target.getAttribute("style")) {
                        var editorId = $(records[0].target).attr("id").replace(_this.toolbarPrefix, String.Empty);
                        _this.fixContentPosition(editorId);
                    }
                });
            }
        };
        BlockInlineToolbarController.prototype.observeToolbar = function (ckEditorId) {
            var toolbar = this.getToolbar(ckEditorId);
            if (toolbar.length) {
                this.toolbarObserver.observe(toolbar.get(0), this.observerConfig);
            }
        };
        BlockInlineToolbarController.prototype.getToolbar = function (ckEditorId, onlyVisible) {
            if (onlyVisible === void 0) { onlyVisible = false; }
            return this.getDesignerFrame().contents().find("#" + this.toolbarPrefix + ckEditorId + (onlyVisible ? ":visible" : String.Empty));
        };
        BlockInlineToolbarController.prototype.getDesignerFrame = function () {
            return Editor.CommonUtils.getByClass(Editor.CommonConstants.designerContentEditorFrameClassName);
        };
        BlockInlineToolbarController.prototype.cleanupBlocks = function (blockElements) {
            var _this = this;
            new ArrayQuery(blockElements.toArray())
                .select($)
                .where(function (b) { return b.attr(Editor.CommonConstants.toolbardataAttrName) === "true"; })
                .each(function (block) {
                var editor = Editor.BlockProvider.getEditableElement(block);
                var editorId = Editor.CommonUtils.getId(editor);
                if (!Object.isNullOrUndefined(editorId) && editor.length) {
                    editor.get(0).outerHTML = _this.ckEditorProxy.getContent(editorId);
                }
                block.removeAttr(Editor.CommonConstants.toolbardataAttrName);
                block.removeAttr("tabIndex");
                block.removeAttr("aria-label");
            });
            blockElements.children("." + Editor.CommonConstants.accessibilityButtonClassName).remove();
            // Cleanup the commands
            this.commands.forEach(function (command) { command.cleanup(blockElements); });
            // Cleanup additional ckeditor proxy resources
            this.ckEditorProxy.cleanup(blockElements.first().parentsUntil("body html"));
        };
        BlockInlineToolbarController.prototype.disposeBlocks = function (blockElements) {
            var _this = this;
            new ArrayQuery(blockElements.toArray())
                .select($)
                .where(function (b) { return b.attr(Editor.CommonConstants.toolbardataAttrName) === "true"; })
                .each(function (block) {
                var blockId = Editor.CommonUtils.getId(block);
                if (_this.isToolbarInitialized(blockId)) {
                    var editor = Editor.BlockProvider.getEditableElement(block);
                    var editorId = Editor.CommonUtils.getId(editor);
                    _this.destroyToolbar(editorId);
                }
                block.find(BlockInlineToolbarController.editorWrapperSelector).children().unwrap();
            });
            blockElements.off("focus focusin click");
            blockElements.each(function (index, element) {
                Editor.BlockProvider.getEditableElement($(element)).off("focus click");
            });
            if (this.toolbarObserver) {
                this.toolbarObserver.disconnect();
                this.toolbarObserver = null;
            }
            this.ckEditorProxy.cleanup(blockElements.first().parents("html"));
            this.proxyInitialized = false;
            this.blockSetup = false;
        };
        /**
        * Dispose logic when the designer iframe is disposed.
        */
        BlockInlineToolbarController.prototype.onDesignerDisposed = function () {
            if (this.proxyInitialized) {
                this.commands.forEach(function (command) { command.dispose(); });
            }
            this.ckEditorProxy.dispose();
            this.proxyInitialized = false;
            this.blockSetup = false;
        };
        BlockInlineToolbarController.prototype.notifySelectionChanged = function ($block, editableElement) {
            var blockDefinition = this.blockDefinition.getBlockDefinition($block);
            // Notify, that selection changed
            if (!Object.isNullOrUndefined(blockDefinition)) {
                var eventArgs = new Editor.SelectionChangedEventArgs(blockDefinition, $block);
                this.eventBroker.notify(Editor.DesignerInternalEventConstants.selectionChanged, eventArgs);
                this.eventBroker.notify(Editor.EventConstants.onElementFocusedIn, new Editor.ElementFocusedEventArgs(editableElement));
            }
        };
        BlockInlineToolbarController.prototype.dispose = function () {
            // Release listeners
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.ckEditorInstanceReadyEvent, this.onBlockReadyHandler);
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.ckEditorFocus, this.onCkEditorFocusHandler);
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerFrameInitialized, this.onDesignerInitializedHandler);
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerFrameDisposed, this.onDesignerDisposedHandler);
            this.onCkEditorFocusHandler = this.onDesignerInitializedHandler = this.onDesignerDisposedHandler = this
                .onBlockReadyHandler = null;
            // CkEditor disposal
            this.ckEditorProxy.dispose();
            this.ckEditorProxy = null;
        };
        BlockInlineToolbarController.prototype.initInlineToolbar = function (element, inlineToolbar, blockId) {
            if (!Object.isNullOrUndefined(this.ckEditorProxy.createEditor(element, inlineToolbar))) {
                this.blockIdsWithInitializedToolbars.push(blockId);
            }
        };
        BlockInlineToolbarController.prototype.destroyToolbar = function (id) {
            this.ckEditorProxy.destroyEditor(id);
        };
        BlockInlineToolbarController.prototype.isToolbarInitialized = function (blockId) {
            return blockId && $.inArray(blockId, this.blockIdsWithInitializedToolbars) >= 0;
        };
        BlockInlineToolbarController.prototype.createSimpleWrapper = function (editorId) {
            var simpleDivWrapper = $("<div>");
            Editor.CommonUtils.setId(simpleDivWrapper, editorId);
            simpleDivWrapper.attr(Editor.CommonConstants.ckEditorAttrName, "true");
            return simpleDivWrapper;
        };
        BlockInlineToolbarController.prototype.createCkEditorWrapper = function (editorId) {
            var ckeditorWrapper = $("<div>");
            Editor.CommonUtils.setEditable(ckeditorWrapper);
            Editor.CommonUtils.setId(ckeditorWrapper, editorId);
            ckeditorWrapper.attr(Editor.CommonConstants.ckEditorAttrName, "true");
            return ckeditorWrapper;
        };
        /**
         * Appends an invisible accessibility button to a block, allowing
         * for extended functionality for users with screen readers.
         * @param parent - the parent block to which the accessibility button
         *        should be appended to.
         * @param id - the id of the button to append. This id will be checked
         *        to prevent the button from being added twice to a parent.
         * @param ariaLabelToken - a localization token to retrieve the aria
         *        label from. This will be read out by the screen reader when
         *        it the button has been selected.
         * @param action - the action to be executed when the button is clicked.
         */
        BlockInlineToolbarController.prototype.appendAccessibilityButton = function (parent, id, ariaLabelToken, action) {
            if (!parent.children(id).length) {
                var toolbarReturnButton = $("<div>");
                toolbarReturnButton.attr("tabindex", "-1");
                toolbarReturnButton.attr("id", id);
                toolbarReturnButton.attr("aria-label", Editor.CommonUtils.getLocalizedString(ariaLabelToken));
                toolbarReturnButton.attr("role", "button");
                toolbarReturnButton.addClass(Editor.CommonConstants.accessibilityButtonClassName);
                toolbarReturnButton.on("focus click", action);
                parent.append(toolbarReturnButton);
                parent.attr("aria-owns", id);
            }
        };
        BlockInlineToolbarController.prototype.setElementConfiguration = function (eventArgs) {
            var instanceName = eventArgs.ckEditorInstanceName;
            var instanceId = eventArgs.sourceId;
            if (this.ckEditorProxy.instanceId() !== instanceId) {
                return;
            }
            this.ckEditorProxy.setRequiredAttributes(instanceName);
            var $ckEditor = this.ckEditorProxy.getCkEditorElement(instanceName);
            // Remove the role='textbox' set by ckeditor. This role confuses screen readers.
            $ckEditor.removeAttribute("role");
            var $block = $($ckEditor).closest("[" + Editor.Contract.blockTypeAttrName + "]");
            $block.removeAttr("tabindex");
            $block.off("focus focusin click");
            var blockDefinition = this.blockDefinition.getBlockDefinition($block);
            if (!Object.isNullOrUndefined(blockDefinition) && !blockDefinition.isEditable()) {
                this.ckEditorProxy.setReadOnly(instanceName);
            }
        };
        BlockInlineToolbarController.prototype.onToolbarShown = function (eventArgs) {
            var instanceId = eventArgs.sourceId;
            if (this.ckEditorProxy.instanceId() !== instanceId) {
                return;
            }
            var $block = this.blockProvider.getClosestBlock(Editor.CommonUtils.getById(eventArgs.ckEditorInstanceName));
            this.eventBroker.notify(Editor.EventConstants.toolbarShown, new Editor.ToolbarShownEventArgs(Editor.CommonUtils.getId($block)));
        };
        BlockInlineToolbarController.prototype.setupCommand = function (command) {
            command.setup(this.eventBroker);
            if (command instanceof Editor.CkEditorCommand) {
                var ckEditorCommand = (command);
                ckEditorCommand.setupCkEditor(this.ckEditorProxy);
            }
        };
        BlockInlineToolbarController.prototype.notifyControllerReady = function () {
            if (this.proxyInitialized && this.blockSetup) {
                this.eventBroker.notify(Editor.DesignerInternalEventConstants.controllerReady, new Editor.ControllerReadyEventArgs(this.getName()));
            }
        };
        BlockInlineToolbarController.editorIdPrefix = "editorIdPrefix";
        BlockInlineToolbarController.editorWrapperSelector = String.Format('[id^="{0}"]', BlockInlineToolbarController.editorIdPrefix);
        return BlockInlineToolbarController;
    }());
    Editor.BlockInlineToolbarController = BlockInlineToolbarController;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
    * Class for the notification, when block is loaded.
    */
    var BlockLoadedController = /** @class */ (function () {
        function BlockLoadedController(eventBroker, blockDefinition) {
            this.eventBroker = eventBroker;
            this.blockDefinition = blockDefinition;
            this.blockDefinition.init(this.eventBroker);
        }
        BlockLoadedController.prototype.getName = function () {
            return "BlockLoadedController";
        };
        BlockLoadedController.prototype.setupBlocks = function (blockElements) {
            var _this = this;
            blockElements.each(function (i, block) {
                var blockDefinition = _this.blockDefinition.getBlockDefinition($(block));
                if (!Object.isNullOrUndefined(blockDefinition)) {
                    _this.blockDefinition.getBlockDefinition($(block)).decorate($(block));
                    _this.eventBroker.notify(Editor.DesignerInternalEventConstants.blockLoaded, new Editor.BlockLoadedEventArgs($(block), null));
                }
            });
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.controllerReady, new Editor.ControllerReadyEventArgs(this.getName()));
        };
        BlockLoadedController.prototype.cleanupBlocks = function (blockElements) {
            var _this = this;
            blockElements.each(function (i, block) {
                var blockDefinition = _this.blockDefinition.getBlockDefinition($(block));
                if (!Object.isNullOrUndefined(blockDefinition)) {
                    _this.blockDefinition.getBlockDefinition($(block)).setFinalContent($(block));
                }
            });
        };
        BlockLoadedController.prototype.disposeBlocks = function (blockElements) { };
        BlockLoadedController.prototype.dispose = function () { };
        return BlockLoadedController;
    }());
    Editor.BlockLoadedController = BlockLoadedController;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
    * Class for the notification, when block is loaded.
    */
    var BlockClickedController = /** @class */ (function () {
        function BlockClickedController(eventBroker) {
            this.eventBroker = eventBroker;
        }
        BlockClickedController.prototype.getName = function () {
            return "BlockClickedController";
        };
        BlockClickedController.prototype.setupBlocks = function (blockElements) {
            var _this = this;
            var eventArgs = new Editor.BlockClickedEventArgs();
            blockElements.each(function (index, block) {
                $(block).on("click", function () {
                    eventArgs.block = $(block);
                    _this.eventBroker.notify(Editor.DesignerInternalEventConstants.blockClicked, eventArgs);
                });
            });
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.controllerReady, new Editor.ControllerReadyEventArgs(this.getName()));
        };
        BlockClickedController.prototype.cleanupBlocks = function (blockElements) {
        };
        BlockClickedController.prototype.disposeBlocks = function (blockElements) {
            if (!Object.isNullOrUndefined(blockElements)) {
                blockElements.off("click");
            }
        };
        BlockClickedController.prototype.dispose = function () { };
        return BlockClickedController;
    }());
    Editor.BlockClickedController = BlockClickedController;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var KeyCodes = MktSvc.Controls.Common.KeyCodes;
    /**
    * Class responsible for the adding placeholders after each block when editor is in add mode.
    */
    var BlockAddModeController = /** @class */ (function () {
        function BlockAddModeController(eventBroker, blockProvider) {
            this.blockSortablePlaceholderClassName = "block-sort-highlight";
            this.ariaLabelText = "Placeholder. Press enter to insert tool here";
            this.eventBroker = eventBroker;
            this.blockProvider = blockProvider;
        }
        BlockAddModeController.prototype.getName = function () {
            return "BlockAddModeController";
        };
        BlockAddModeController.prototype.setupBlocks = function (blockElements) {
            var _this = this;
            if (Object.isNullOrUndefined(this.onDesignerAddStart)) {
                this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.designerAddStart, this.onDesignerAddStart = function (eventArgs) { return _this
                    .designerAddStart(eventArgs.block, eventArgs.movingExistingBlock); });
            }
            if (Object.isNullOrUndefined(this.onDesignerAddEnd)) {
                this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.designerAddEnd, this.onDesignerAddEnd = function () { return _this.cleanup(); });
            }
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.controllerReady, new Editor.ControllerReadyEventArgs(this.getName()));
        };
        BlockAddModeController.prototype.cleanupBlocks = function (blockElements) {
            this.cleanup();
        };
        BlockAddModeController.prototype.disposeBlocks = function (blockElements) {
            this.cleanup();
        };
        BlockAddModeController.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.onDesignerAddStart)) {
                this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerAddStart, this.onDesignerAddStart);
            }
            if (!Object.isNullOrUndefined(this.onDesignerAddEnd)) {
                this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerAddEnd, this.onDesignerAddEnd);
            }
            this.onDesignerAddStart = this.onDesignerAddEnd = null;
            this.cleanup();
        };
        BlockAddModeController.prototype.designerAddStart = function (block, movingExistingBlock) {
            var _this = this;
            var designerFrame = Editor.CommonUtils.getByClass(Editor.CommonConstants.designerContentEditorFrameClassName);
            var blockElements = this.blockProvider.getBlocks(designerFrame.contents());
            var startTarget;
            // Remove old focuses and set editor into non event propagation mode
            blockElements.focusout();
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerNonEventPropagationStart);
            // Remove old placeholders if they exist
            Editor.CommonUtils.getByClass(this.blockSortablePlaceholderClassName, designerFrame.contents()).remove();
            // Set tabindexes for the blocks
            Editor.CommonUtils.setTabIndex(blockElements.filter(Editor.CommonUtils.getAttrSelector("tabindex")), -1);
            Editor.CommonUtils.setTabIndex(blockElements.find(Editor.CommonUtils.getAttrSelector(Editor.CommonConstants.ckEditorAttrName)), -1);
            var marker = $("<div>+</div>");
            marker.addClass(Editor.CommonConstants.sortablePlaceholderClassName)
                .addClass(Editor.CommonConstants.regularSortablePlaceholderClassName)
                .addClass(this.blockSortablePlaceholderClassName)
                .attr("tabindex", "0")
                .attr("role", "button")
                .attr("aria-label", Editor.CommonUtils.getLocalizedString(this.ariaLabelText))
                .attr(Editor.Contract.dataIdAttrName, Editor.TestabilityConstants.sortablePlaceholderId);
            marker.on("touchstart mousedown", function (event) {
                startTarget = $(event.target);
            });
            marker.on("touchend mouseup", function (event) {
                var target = $(event.target);
                if (startTarget && target.get(0) === startTarget.get(0)) {
                    _this.replacePlaceholder(target, block, movingExistingBlock);
                }
            });
            // Cleanup start target if user scroll the placrholders
            marker.on("touchmove", function () {
                startTarget = null;
            });
            marker.on("keydown", function (event) {
                var keyPressed = event.which || event.keyCode;
                var placeholder = $(event.target);
                if (keyPressed === KeyCodes.Enter) {
                    event.preventDefault();
                    _this.replacePlaceholder(placeholder, block, movingExistingBlock);
                }
            });
            marker.on("focus focusin", function (event) {
                // Add selection on the selected placeholder
                Editor.CommonUtils.getByClass(Editor.CommonConstants.sortablePlaceholderClassName, designerFrame.contents())
                    .removeClass(Editor.CommonConstants.selectedSortablePlaceholderClassName);
                $(event.target).addClass(Editor.CommonConstants.selectedSortablePlaceholderClassName);
            });
            var emptyContainers = designerFrame.contents()
                .find(Editor.CommonUtils.getAttrEqualsSelector(Editor.Contract.containerAttrName, "true"))
                .not(":has(" + Editor.CommonUtils.getAttrSelector(Editor.Contract.blockTypeAttrName) + ")");
            if (Editor.CommonUtils.isElementDefined(emptyContainers)) {
                emptyContainers.append(marker.clone(true));
            }
            blockElements.each(function (index, element) {
                var wrappedBlock = Editor.BlockProvider.getLastElementBeforeContainer($(element));
                if (Editor.CommonUtils.isElementDefined(wrappedBlock)) {
                    // Skip adding the placeholder, if we already have it before or after the block in this container
                    if (!_this.hasBlockPlaceholder(wrappedBlock.next())) {
                        wrappedBlock.after(marker.clone(true));
                    }
                    if (!_this.hasBlockPlaceholder(wrappedBlock.prev())) {
                        wrappedBlock.before(marker.clone(true));
                    }
                }
            });
            // Set focus on the first selected placeholder
            Editor.CommonUtils.getByClass(Editor.CommonConstants.sortablePlaceholderClassName, designerFrame.contents()).first()
                .focus().focusin();
        };
        BlockAddModeController.prototype.replacePlaceholder = function (placeholder, block, movingExistingBlock) {
            placeholder.replaceWith(block);
            if (movingExistingBlock) {
                // Notify, that block was moved
                this.eventBroker.notify(Editor.EventConstants.blockMoved, new Editor.BlockMovedEventArgs(block));
            }
            else {
                // Notify, that block was added
                this.eventBroker.notify(Editor.EventConstants.blockAdded, new Editor.BlockAddedEventArgs(block));
            }
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerAddEnd);
        };
        BlockAddModeController.prototype.cleanup = function () {
            var designerFrame = Editor.CommonUtils.getByClass(Editor.CommonConstants.designerContentEditorFrameClassName);
            var blockElements = this.blockProvider.getBlocks(designerFrame.contents());
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerNonEventPropagationEnd);
            // Restore tabindexes
            Editor.CommonUtils.setTabIndex(blockElements.filter(Editor.CommonUtils.getAttrSelector("tabindex")), 0);
            Editor.CommonUtils.setTabIndex(blockElements.find(Editor.CommonUtils.getAttrSelector(Editor.CommonConstants.ckEditorAttrName)), 0);
        };
        BlockAddModeController.prototype.hasBlockPlaceholder = function (block) {
            return block.hasClass(Editor.CommonConstants.sortablePlaceholderClassName);
        };
        return BlockAddModeController;
    }());
    Editor.BlockAddModeController = BlockAddModeController;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var DetailsViewConstants = /** @class */ (function () {
        function DetailsViewConstants() {
        }
        DetailsViewConstants.collapsableIconClassName = "extrasToggle";
        DetailsViewConstants.headingClassName = "propertiesTitleButton";
        DetailsViewConstants.headingLabelClassName = "propertiesTitle";
        DetailsViewConstants.sectionContentClassName = "treeView";
        DetailsViewConstants.sectionContainerClassName = "detailsViewProperties";
        DetailsViewConstants.emptyWatermarkClassName = "empty-watermark";
        DetailsViewConstants.inputControlContainerClassName = "treeViewItem";
        DetailsViewConstants.inputItemField = "treeViewItemField";
        DetailsViewConstants.neverProtected = "neverProtected";
        DetailsViewConstants.richEditDisabled = "richEditDisabled";
        DetailsViewConstants.disabled = "disabled";
        DetailsViewConstants.propertyNameCssClass = "propertyName";
        DetailsViewConstants.inputAttributeClassName = "attributeInput";
        DetailsViewConstants.inputColorCssClass = "inputColor";
        DetailsViewConstants.inputImageCssClass = "inputImage";
        DetailsViewConstants.inputCheckboxCssClass = "inputCheckbox";
        DetailsViewConstants.inputRadioButtonCssClass = "inputRadioButton";
        DetailsViewConstants.colorFilledRectangleCssClass = "colorFilledRectangle";
        DetailsViewConstants.colorPickerInputCssClassName = "colorPickerInput";
        DetailsViewConstants.colorPickerFocusedCssClass = "siblingFocused";
        DetailsViewConstants.inputTag = "input";
        DetailsViewConstants.selectTag = "select";
        DetailsViewConstants.inputTypeText = "text";
        DetailsViewConstants.inputTypeNumber = "number";
        DetailsViewConstants.linkSectionTitle = "Link";
        // ImageDetailsView constants
        DetailsViewConstants.srcInputCssClass = "srcInput";
        DetailsViewConstants.altInputCssClass = "altInput";
        DetailsViewConstants.linkInputCssClass = "linkInput";
        DetailsViewConstants.imageHSpaceInputCssClass = "imageHSpaceInput";
        DetailsViewConstants.imageVSpaceInputCssClass = "imageVSpaceInput";
        DetailsViewConstants.imageAlignmentDropDownCssClass = "imageAlignmentDropDown";
        DetailsViewConstants.imgGalleryCssClass = "detailsViewButton";
        DetailsViewConstants.imageSectionTitle = "Image";
        DetailsViewConstants.imageAlignmentLabel = "[Alignment]";
        DetailsViewConstants.imageWrapperClassName = "imageWrapper";
        DetailsViewConstants.imageTag = "img";
        DetailsViewConstants.altAttribute = "alt";
        DetailsViewConstants.alignAttribute = "align";
        DetailsViewConstants.srcAttribute = Editor.CommonConstants.designerImageSourceAttributeName;
        DetailsViewConstants.titleAttribute = "title";
        DetailsViewConstants.srcLabel = "[Source]";
        DetailsViewConstants.altLabel = "[Alt Text]";
        DetailsViewConstants.linkLabel = "[Link]";
        DetailsViewConstants.hSpaceLabel = "[HSpace]";
        DetailsViewConstants.vSpaceLabel = "[VSpace]";
        DetailsViewConstants.imgHeightLabel = "[Height px]";
        DetailsViewConstants.imgHeightAttribute = "height";
        DetailsViewConstants.imageHeightInputCssClass = "imageHeightInput";
        DetailsViewConstants.imgWidthLabel = "[Width px]";
        DetailsViewConstants.imgWidthAttribute = "width";
        DetailsViewConstants.imageWidthInputCssClass = "imageWidthInput";
        // ButtonDetailsView constants
        DetailsViewConstants.hrefInputCssClass = "hrefInput";
        DetailsViewConstants.anchorTag = "a";
        DetailsViewConstants.hrefAttribute = "href";
        DetailsViewConstants.urlLabel = "[URL]";
        DetailsViewConstants.buttonLinkLabel = "[Link]";
        DetailsViewConstants.buttonLinkInputCssClass = "buttonLinkInput";
        DetailsViewConstants.stylesSectionTitle = "[Styles Title]";
        DetailsViewConstants.buttonBackgroundColorLabel = "[Background Color]";
        DetailsViewConstants.buttonBackgroundColorInputCssClass = "buttonBackgroundColorInput";
        DetailsViewConstants.buttonTextColorLabel = "[Text Color]";
        DetailsViewConstants.buttonTextColorInputCssClass = "buttonTextColorInput";
        DetailsViewConstants.buttonAlignmentLabel = "[Alignment]";
        DetailsViewConstants.buttonAlignmentDropDownCssClass = "buttonAlignmentDropDown";
        DetailsViewConstants.buttonSizeSectionTitle = "[Size]";
        DetailsViewConstants.buttonWidthLabel = "[Width px]";
        DetailsViewConstants.buttonWidthInputCssClass = "buttonWidthInput";
        DetailsViewConstants.buttonHeightLabel = "[Height px]";
        DetailsViewConstants.buttonHeightInputCssClass = "buttonHeightInput";
        DetailsViewConstants.backgroundColorAttribute = "background-color";
        DetailsViewConstants.textColorAttribute = "color";
        DetailsViewConstants.marginLeftAttribute = "margin-left";
        DetailsViewConstants.marginRightAttribute = "margin-right";
        DetailsViewConstants.lineHeightAttribute = "line-height";
        // DividerDetailsView constants
        DetailsViewConstants.dividerSectionTitle = "Divider";
        DetailsViewConstants.tableTag = "table";
        DetailsViewConstants.tdTag = "td";
        DetailsViewConstants.pTag = "p";
        DetailsViewConstants.widthAttribute = "width";
        DetailsViewConstants.widthLabel = "[Width %]";
        DetailsViewConstants.dividerWidthInputCssClass = "dividerWidthInput";
        DetailsViewConstants.colorAttribute = "border-bottom-color";
        DetailsViewConstants.colorLabel = "[Color]";
        DetailsViewConstants.colorInputCssClass = "colorInput";
        DetailsViewConstants.paddingSectionTitle = "Padding";
        DetailsViewConstants.paddingTopAttribute = "padding-top";
        DetailsViewConstants.paddingTopLabel = "[Padding Top px]";
        DetailsViewConstants.paddingTopInputCssClass = "paddingTopInput";
        DetailsViewConstants.paddingBottomAttribute = "padding-bottom";
        DetailsViewConstants.paddingBottomLabel = "[Padding Bottom px]";
        DetailsViewConstants.paddingBottomInputCssClass = "paddingBottomInput";
        DetailsViewConstants.contentBlockTool = "[Content block tool]";
        DetailsViewConstants.contentBlockSource = "[Content block source]";
        DetailsViewConstants.contentBlockToolCss = "contentBlockTool";
        DetailsViewConstants.contentBlockWrapper = "contentBlockWrapper";
        DetailsViewConstants.contentBlockIdAttribute = "data-contentblock-id";
        DetailsViewConstants.lookupIdAttribute = "data-lookup-id";
        DetailsViewConstants.lookupNameAttribute = "data-lookup-name";
        //VideoDetailsView constants
        DetailsViewConstants.videoSectionTitle = "[Video]";
        DetailsViewConstants.videoLookupLabel = "[VideoLookupLabel]";
        DetailsViewConstants.videoLookupCssClass = "videoLookupInput";
        DetailsViewConstants.videoLookupContainerId = "videoLookupContainer";
        return DetailsViewConstants;
    }());
    Editor.DetailsViewConstants = DetailsViewConstants;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    /**
    * Divider Details View
    */
    var DividerDetailsView = /** @class */ (function () {
        function DividerDetailsView(detailsViewControl) {
            this.detailsViewControl = detailsViewControl;
        }
        /**
        * Initializes form control
        */
        DividerDetailsView.prototype.init = function (eventBroker, containerId) {
            this.eventBroker = eventBroker;
            this.containerId = containerId;
            this.detailsViewControl.init(this.containerId, this.eventBroker);
        };
        /**
        * Disposes the form control
        */
        DividerDetailsView.prototype.dispose = function () {
            this.detailsViewControl.dispose();
        };
        /**
        * Renders the form control
        */
        DividerDetailsView.prototype.render = function (selectedBlock) {
            var _this = this;
            this.clearContainer();
            var dividerSection = this.detailsViewControl
                .createSection(Editor.CommonUtils.getLocalizedString("[" + Editor.DetailsViewConstants.dividerSectionTitle + "]"));
            this.detailsViewControl.createInputField(dividerSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.widthLabel), Editor.DetailsViewConstants.inputTypeNumber, Editor.DetailsViewConstants.dividerWidthInputCssClass, this.getWidth(selectedBlock), {
                min: "1",
                max: "100",
                role: "spinbutton",
                id: UniqueId.generate(Editor.DetailsViewConstants.dividerWidthInputCssClass)
            }, function (inputField) {
                _this.onWidthFieldUpdated(selectedBlock, inputField);
            });
            this.detailsViewControl.createInputColorField(dividerSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.colorLabel), Editor.DetailsViewConstants.inputTypeText, Editor.DetailsViewConstants.colorInputCssClass, this.getColor(selectedBlock), {
                id: UniqueId.generate(Editor.DetailsViewConstants.colorInputCssClass)
            }, function (inputField) {
                _this.onColorFieldUpdated(selectedBlock, inputField);
            });
            var paddingSection = this.detailsViewControl
                .createSection(Editor.CommonUtils.getLocalizedString("[" + Editor.DetailsViewConstants.paddingSectionTitle + "]"));
            this.detailsViewControl.createInputField(paddingSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.paddingTopLabel), Editor.DetailsViewConstants.inputTypeNumber, Editor.DetailsViewConstants.paddingTopInputCssClass, this.getPaddingTop(selectedBlock), {
                min: "0",
                max: "200",
                role: "spinbutton",
                id: UniqueId.generate(Editor.DetailsViewConstants.paddingTopInputCssClass)
            }, function (inputField) {
                _this.onPaddingTopFieldUpdated(selectedBlock, inputField);
            });
            this.detailsViewControl.createInputField(paddingSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.paddingBottomLabel), Editor.DetailsViewConstants.inputTypeNumber, Editor.DetailsViewConstants.paddingBottomInputCssClass, this.getPaddingBottom(selectedBlock), {
                min: "0",
                max: "200",
                role: "spinbutton",
                id: UniqueId.generate(Editor.DetailsViewConstants.paddingBottomInputCssClass)
            }, function (inputField) {
                _this.onPaddingBottomFieldUpdated(selectedBlock, inputField);
            });
        };
        DividerDetailsView.prototype.getWidth = function ($block) {
            // Get with percentage
            var element = this.getTable($block).get(0);
            var value = (element && element.style.width) ? (element.style.width).replace(/%/g, String.Empty) : "100";
            return value;
        };
        DividerDetailsView.prototype.onWidthFieldUpdated = function (selectedBlock, inputElement) {
            var width = inputElement.val();
            if (width > 100 || width < 1) {
                width = 100; // tslint:disable-line
                inputElement.val(width);
            }
            var $table = this.getTable(selectedBlock);
            $table.css(Editor.DetailsViewConstants.widthAttribute, width + "%");
            //ARIA - for the divider tool, the screenreader should read the width
            var $tableCkWrapper = selectedBlock.find("[" + Editor.CommonConstants.ckEditorAttrName + "]");
            var ariaLabel = $tableCkWrapper.attr("aria-label");
            var widthTranslated = Editor.CommonUtils.getLocalizedString("[Width]");
            if (!Object.isNullOrUndefined(ariaLabel) && ariaLabel.indexOf(widthTranslated) === -1) {
                ariaLabel = ariaLabel + (" " + widthTranslated + " = %.");
            }
            var regExpPattern = "(" + widthTranslated + ")(.+?)(?= %.)";
            var regExp = new RegExp(regExpPattern);
            ariaLabel = !Object.isNullOrUndefined(ariaLabel)
                ? ariaLabel.replace(regExp, "$1 = " + width)
                : ariaLabel;
            $tableCkWrapper.attr("aria-label", ariaLabel);
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentChanged, new Editor.DesignerInternalContentChangedEventArgs(this.containerId));
        };
        DividerDetailsView.prototype.getTable = function (block) {
            return block.find(Editor.DetailsViewConstants.tableTag);
        };
        DividerDetailsView.prototype.getColor = function ($block) {
            var value = this.getParagraph($block).css(Editor.DetailsViewConstants.colorAttribute);
            if (Object.isNullOrUndefined(value)) {
                value = String.Empty;
            }
            return Editor.ColorUtils.rgbToHex(value);
        };
        DividerDetailsView.prototype.onColorFieldUpdated = function (selectedBlock, inputElement) {
            var color = inputElement.val();
            var $paragraph = this.getParagraph(selectedBlock);
            $paragraph.css(Editor.DetailsViewConstants.colorAttribute, color);
            //ARIA - for the divider tool, the screenreader should read the color
            var $paragraphCkWrapper = selectedBlock.find("[" + Editor.CommonConstants.ckEditorAttrName + "]");
            var ariaLabel = $paragraphCkWrapper.attr("aria-label");
            var colorTranslated = Editor.CommonUtils.getLocalizedString("[Color]");
            if (!Object.isNullOrUndefined(ariaLabel) && ariaLabel.indexOf(colorTranslated) === -1) {
                ariaLabel = ariaLabel + (" " + colorTranslated + " = .");
            }
            var regExpPattern = "(" + colorTranslated + ")(.+?)(?= \\.)";
            var regExp = new RegExp(regExpPattern);
            ariaLabel = !Object.isNullOrUndefined(ariaLabel)
                ? ariaLabel.replace(regExp, "$1 = " + color)
                : ariaLabel;
            $paragraphCkWrapper.attr("aria-label", ariaLabel);
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentChanged, new Editor.DesignerInternalContentChangedEventArgs(this.containerId));
        };
        DividerDetailsView.prototype.getParagraph = function (block) {
            return block.find(Editor.DetailsViewConstants.pTag);
        };
        DividerDetailsView.prototype.getPaddingTop = function ($block) {
            var value = this.getTableCell($block).css(Editor.DetailsViewConstants.paddingTopAttribute);
            if (Object.isNullOrUndefined(value)) {
                value = "0";
            }
            else {
                value = value.replace("px", String.Empty);
            }
            return value;
        };
        DividerDetailsView.prototype.onPaddingTopFieldUpdated = function (selectedBlock, inputElement) {
            var paddingTop = inputElement.val();
            if (paddingTop > 200 || paddingTop < 0) {
                paddingTop = 0;
                inputElement.val(paddingTop);
            }
            var $tableCell = this.getTableCell(selectedBlock);
            $tableCell.css(Editor.DetailsViewConstants.paddingTopAttribute, paddingTop + "px");
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentChanged, new Editor.DesignerInternalContentChangedEventArgs(this.containerId));
        };
        DividerDetailsView.prototype.getPaddingBottom = function ($block) {
            var value = this.getTableCell($block).css(Editor.DetailsViewConstants.paddingBottomAttribute);
            if (Object.isNullOrUndefined(value)) {
                value = "0";
            }
            else {
                value = value.replace("px", String.Empty);
            }
            return value;
        };
        DividerDetailsView.prototype.onPaddingBottomFieldUpdated = function (selectedBlock, inputElement) {
            var paddingBottom = inputElement.val();
            if (paddingBottom > 200 || paddingBottom < 0) {
                paddingBottom = 0;
                inputElement.val(paddingBottom);
            }
            var $tableCell = this.getTableCell(selectedBlock);
            $tableCell.css(Editor.DetailsViewConstants.paddingBottomAttribute, paddingBottom + "px");
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentChanged, new Editor.DesignerInternalContentChangedEventArgs(this.containerId));
        };
        DividerDetailsView.prototype.getTableCell = function (block) {
            return block.find(Editor.DetailsViewConstants.tdTag);
        };
        DividerDetailsView.prototype.clearContainer = function () {
            Editor.CommonUtils.getById(this.containerId).empty();
        };
        return DividerDetailsView;
    }());
    Editor.DividerDetailsView = DividerDetailsView;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    /**
    * Button Details View
    */
    var ButtonDetailsView = /** @class */ (function () {
        function ButtonDetailsView(linkSectionLabel, buttonCommonDetailsView, detailsViewControl) {
            this.detailsViewControl = detailsViewControl;
            this.linkSectionLabel = linkSectionLabel;
            this.buttonCommonDetailsView = buttonCommonDetailsView;
        }
        /**
        * Initializes form control
        */
        ButtonDetailsView.prototype.init = function (eventBroker, containerId) {
            this.eventBroker = eventBroker;
            this.containerId = containerId;
            this.detailsViewControl.init(this.containerId, this.eventBroker);
            this.buttonCommonDetailsView.init(eventBroker, containerId);
        };
        /**
        * Disposes the form control
        */
        ButtonDetailsView.prototype.dispose = function () {
            this.detailsViewControl.dispose();
            this.buttonCommonDetailsView.dispose();
        };
        /**
        * Renders the form control
        */
        ButtonDetailsView.prototype.render = function (selectedBlock) {
            var _this = this;
            this.clearContainer();
            this.linkSection = this.detailsViewControl.createSection(Editor.CommonUtils.getLocalizedString(this.linkSectionLabel));
            this.detailsViewControl.createLinkField(this.linkSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.buttonLinkLabel), Editor.DetailsViewConstants.inputTypeText, Editor.DetailsViewConstants.buttonLinkInputCssClass, this.getButtonLink(selectedBlock), {
                id: UniqueId.generate(Editor.DetailsViewConstants.buttonLinkInputCssClass)
            }, function (inputField) {
                _this.onLinkFieldUpdated(selectedBlock, inputField);
            }, { hasFocus: false });
            this.updateAriaAttr(selectedBlock);
            this.buttonCommonDetailsView.render(selectedBlock);
        };
        ButtonDetailsView.prototype.getAnchor = function (block) {
            return block.find(Editor.DetailsViewConstants.anchorTag);
        };
        ButtonDetailsView.prototype.getButtonLink = function ($block) {
            var value = this.getAnchor($block).attr(Editor.DetailsViewConstants.hrefAttribute);
            if (Object.isNullOrUndefined(value)) {
                value = String.Empty;
            }
            return value;
        };
        ButtonDetailsView.prototype.onLinkFieldUpdated = function (selectedBlock, inputElement) {
            var url = Editor.CommonUtils.getLinkWithProtocol(inputElement.val());
            var $anchor = this.getAnchor(selectedBlock);
            $anchor.attr(Editor.DetailsViewConstants.hrefAttribute, url);
            var eventArgs = new Editor.HrefAttributeChangedEventArgs($anchor, url);
            this.eventBroker.notify(Editor.EventConstants.hrefAttributeChanged, eventArgs);
            this.eventBroker.notify(selectedBlock.attr(Editor.Contract.blockTypeAttrName) + "_" + Editor.EventConstants.hrefAttributeChanged, eventArgs);
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentBlockChanged, new Editor.BlockChangedEventArgs(this.containerId, selectedBlock));
        };
        ButtonDetailsView.prototype.clearContainer = function () {
            Editor.CommonUtils.getById(this.containerId).empty();
        };
        ButtonDetailsView.prototype.isConfigured = function (block) {
            var href = this.getButtonLink(block);
            return !String.isNullUndefinedOrWhitespace(href) && href !== "#";
        };
        ButtonDetailsView.prototype.updateAriaAttr = function (selectedBlock) {
            var anchor = this.getAnchor(selectedBlock);
            var wrapper = Editor.BlockProvider.getEditableElement(selectedBlock);
            var ariaLabel = selectedBlock.attr("aria-label");
            if (this.isConfigured(selectedBlock)) {
                ariaLabel += " " + anchor.text();
            }
            wrapper.attr("aria-label", ariaLabel);
        };
        return ButtonDetailsView;
    }());
    Editor.ButtonDetailsView = ButtonDetailsView;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var Dictionary = MktSvc.Controls.Common.Dictionary;
    var ImageDetailsView = /** @class */ (function () {
        function ImageDetailsView(detailsViewControl, blockDefinition) {
            this.MINDIMENSION = 0;
            this.MAXDIMENSION = 10000;
            this.detailsViewControl = detailsViewControl;
            this.blockDefinition = blockDefinition;
        }
        ImageDetailsView.prototype.init = function (eventBroker, containerId) {
            this.eventBroker = eventBroker;
            this.containerId = containerId;
            this.detailsViewControl.init(this.containerId, this.eventBroker);
        };
        ImageDetailsView.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.detailsViewControl)) {
                this.detailsViewControl.dispose();
            }
            this.eventBroker = null;
            this.clearContainer();
        };
        ImageDetailsView.prototype.render = function (selectedBlock) {
            var _this = this;
            this.clearContainer();
            this.mainSection = this.detailsViewControl
                .createSection(Editor.CommonUtils.getLocalizedString("[" + Editor.DetailsViewConstants.imageSectionTitle + "]"));
            this.detailsViewControl.createImageField(this.mainSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.srcLabel), Editor.DetailsViewConstants.inputTypeText, Editor.DetailsViewConstants.srcInputCssClass, this.getImgAttributeInitialValue(selectedBlock, Editor.DetailsViewConstants.srcAttribute), {
                id: UniqueId.generate(Editor.DetailsViewConstants.srcInputCssClass)
            }, function (inputField) {
                _this.onImgAttributeFieldUpdated(selectedBlock, inputField, Editor.DetailsViewConstants.srcAttribute);
            }, { hasFocus: false });
            this.detailsViewControl.createInputField(this.mainSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.altLabel), Editor.DetailsViewConstants.inputTypeText, Editor.DetailsViewConstants.altInputCssClass, this.getImgAttributeInitialValue(selectedBlock, Editor.DetailsViewConstants.altAttribute), {
                id: UniqueId.generate(Editor.DetailsViewConstants.altInputCssClass)
            }, function (inputField) {
                _this.onImgAttributeFieldUpdated(selectedBlock, inputField, Editor.DetailsViewConstants.altAttribute);
            });
            this.detailsViewControl.createLinkField(this.mainSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.linkLabel), Editor.DetailsViewConstants.inputTypeText, Editor.DetailsViewConstants.linkInputCssClass, this.getLinkWrapperHrefValue(selectedBlock), {
                id: UniqueId.generate(Editor.DetailsViewConstants.linkInputCssClass)
            }, function (inputField) {
                _this.onLinkWrapperFieldUpdated(selectedBlock, inputField);
            }, { hasFocus: false });
            this.detailsViewControl.createDropdownList(this.mainSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.imageAlignmentLabel), new Dictionary({
                Left: Editor.CommonUtils.getLocalizedString("[Left]"),
                Center: Editor.CommonUtils.getLocalizedString("[Center]"),
                Right: Editor.CommonUtils.getLocalizedString("[Right]")
            }), Editor.DetailsViewConstants.imageAlignmentDropDownCssClass, this.getImageAlignment(selectedBlock), function (dropdownList) {
                _this.onImageAlignmentUpdated(selectedBlock, dropdownList);
            });
            this.detailsViewControl.createInputField(this.mainSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.imgHeightLabel), Editor.DetailsViewConstants.inputTypeNumber, Editor.DetailsViewConstants.imageHeightInputCssClass, this.getImgAttributeInitialValue(selectedBlock, Editor.DetailsViewConstants.imgHeightAttribute), {
                id: UniqueId.generate(Editor.DetailsViewConstants.imageHeightInputCssClass),
                min: this.MINDIMENSION,
                max: this.MAXDIMENSION // tslint:disable-line
            }, function (inputField) {
                _this.onImgAttributeFieldUpdated(selectedBlock, inputField, Editor.DetailsViewConstants.imgHeightAttribute);
            });
            this.detailsViewControl.createInputField(this.mainSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.imgWidthLabel), Editor.DetailsViewConstants.inputTypeNumber, Editor.DetailsViewConstants.imageWidthInputCssClass, this.getImgAttributeInitialValue(selectedBlock, Editor.DetailsViewConstants.imgWidthAttribute), {
                id: UniqueId.generate(Editor.DetailsViewConstants.imageWidthInputCssClass),
                min: this.MINDIMENSION,
                max: this.MAXDIMENSION // tslint:disable-line
            }, function (inputField) {
                _this.onImgAttributeFieldUpdated(selectedBlock, inputField, Editor.DetailsViewConstants.imgWidthAttribute);
            });
        };
        ImageDetailsView.prototype.getImgAttributeInitialValue = function ($block, attr) {
            var value = this.getImage($block).attr(attr);
            value = Object.isNullOrUndefined(value) ? "" : value;
            if (!this.blockDefinition.isConfigured($block)) {
                value = String.Empty;
            }
            return value;
        };
        ImageDetailsView.prototype.getLinkWrapperHrefValue = function (block) {
            return this.getLinkWrapperOfImg(this.getImage(block)).attr(Editor.DetailsViewConstants.hrefAttribute);
        };
        ImageDetailsView.prototype.getImageAlignment = function (selectedBlock) {
            var imageWrapper = this.getImageWrapper(selectedBlock);
            return imageWrapper.attr(Editor.DetailsViewConstants.alignAttribute) ? imageWrapper.attr(Editor.DetailsViewConstants.alignAttribute) : String.Empty;
        };
        ImageDetailsView.prototype.onImgAttributeFieldUpdated = function (selectedBlock, inputElement, attr) {
            var img = this.getImage(selectedBlock);
            var value = inputElement.val();
            img.attr(attr, value);
            this.eventBroker.notify(Editor.EventConstants.imageAttributeChanged, new Editor.ImageAttributeChangedEventArgs(img, attr, value, null));
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentChanged, new Editor.DesignerInternalContentChangedEventArgs(this.containerId));
        };
        ImageDetailsView.prototype.onLinkWrapperFieldUpdated = function (selectedBlock, inputField) {
            var img = this.getImage(selectedBlock);
            var linkWrapper = this.getLinkWrapperOfImg(img);
            var newValue = inputField.val();
            if (linkWrapper.length > 0) {
                if (String.isNullOrWhitespace(newValue)) {
                    // Link wrapper should be removed if the new link field value is empty
                    img.unwrap();
                }
                else {
                    linkWrapper.attr(Editor.DetailsViewConstants.hrefAttribute, newValue);
                    linkWrapper.attr(Editor.DetailsViewConstants.titleAttribute, newValue);
                }
            }
            else {
                img.wrap($("<a>").attr(Editor.DetailsViewConstants.hrefAttribute, newValue)
                    .attr(Editor.DetailsViewConstants.titleAttribute, newValue));
            }
            var eventArgs = new Editor.HrefAttributeChangedEventArgs(this.getLinkWrapperOfImg(img), newValue);
            this.eventBroker.notify(Editor.EventConstants.hrefAttributeChanged, eventArgs);
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentBlockChanged, new Editor.BlockChangedEventArgs(this.containerId, selectedBlock));
        };
        ImageDetailsView.prototype.onImageAlignmentUpdated = function (selectedBlock, dropdownList) {
            if (!this.getImageWrapper(selectedBlock).length) {
                var imageWrapper = $("<div>").addClass(Editor.DetailsViewConstants.imageWrapperClassName);
                this.getImage(selectedBlock).wrap(imageWrapper);
            }
            var value = dropdownList.val();
            this.getImageWrapper(selectedBlock).attr(Editor.DetailsViewConstants.alignAttribute, value);
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentChanged, new Editor.DesignerInternalContentChangedEventArgs(this.containerId));
        };
        ImageDetailsView.prototype.getImage = function (block) {
            return block.find(Editor.DetailsViewConstants.imageTag);
        };
        ImageDetailsView.prototype.getLinkWrapperOfImg = function (img) {
            return img.parent("a");
        };
        ImageDetailsView.prototype.getImageWrapper = function (selectedBlock) {
            return selectedBlock.find("." + Editor.DetailsViewConstants.imageWrapperClassName);
        };
        ImageDetailsView.prototype.clearContainer = function () {
            Editor.CommonUtils.getById(this.containerId).empty();
        };
        return ImageDetailsView;
    }());
    Editor.ImageDetailsView = ImageDetailsView;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
    *  Details View Control
    */
    var DetailsViewControl = /** @class */ (function () {
        function DetailsViewControl(sectionRenderer, inputElementRenderer, inputColorFieldRenderer, lookupContainerRenderer, dropdownElementRenderer, linkFieldRenderer, imageFieldRenderer, ignoreChangesWhileInputStrategy) {
            this.sectionRenderer = sectionRenderer;
            this.inputElementRenderer = inputElementRenderer;
            this.inputColorFieldRenderer = inputColorFieldRenderer;
            this.lookupContainerRenderer = lookupContainerRenderer;
            this.dropdownElementRenderer = dropdownElementRenderer;
            this.linkFieldRenderer = linkFieldRenderer;
            this.imageFieldRenderer = imageFieldRenderer;
            this.ignoreChangesWhileInputStrategy = ignoreChangesWhileInputStrategy;
        }
        /**
        * Initializes form control
        */
        DetailsViewControl.prototype.init = function (containerId, eventBroker) {
            this.eventBroker = eventBroker;
            this.containerId = containerId;
            this.linkFieldRenderer.setup(this.eventBroker);
            this.imageFieldRenderer.setup(this.eventBroker);
            this.ignoreChangesWhileInputStrategy.setup(eventBroker);
        };
        /**
        * Create a section
        */
        DetailsViewControl.prototype.createSection = function (sectionTitle, content) {
            var section = this.sectionRenderer
                .render(Editor.DetailsViewConstants.sectionContainerClassName, sectionTitle);
            Editor.CommonUtils.getById(this.containerId).append(section);
            if (content) {
                var sectionContent = section.find("." + Editor.DetailsViewConstants.sectionContentClassName);
                sectionContent.append(content);
            }
            return section;
        };
        /**
        * Create an input field
        */
        DetailsViewControl.prototype.createInputField = function (section, label, type, className, value, attributes, onFieldUpdated) {
            var inputField = this.inputElementRenderer
                .render(label, type, className, value, attributes, onFieldUpdated);
            section.find("." + Editor.DetailsViewConstants.sectionContentClassName).append(inputField);
            this.ignoreChangesWhileInputStrategy.addStopEventPropogationWhileInput(inputField);
            return inputField;
        };
        /**
        * Create a link field
        */
        DetailsViewControl.prototype.createLinkField = function (section, label, type, className, value, attributes, onFieldUpdated, config) {
            var linkField = this.linkFieldRenderer
                .render(label, type, className, value, attributes, onFieldUpdated, config);
            section.find("." + Editor.DetailsViewConstants.sectionContentClassName).append(linkField);
            this.ignoreChangesWhileInputStrategy.addStopEventPropogationWhileInput(linkField);
            return linkField;
        };
        /**
        * Create a image field
        */
        DetailsViewControl.prototype.createImageField = function (section, label, type, className, value, attributes, onFieldUpdated, config) {
            var imageField = this.imageFieldRenderer
                .render(label, type, className, value, attributes, onFieldUpdated, config);
            section.find("." + Editor.DetailsViewConstants.sectionContentClassName).append(imageField);
            this.ignoreChangesWhileInputStrategy.addStopEventPropogationWhileInput(imageField);
            return imageField;
        };
        /**
        * Create an input color field
        */
        DetailsViewControl.prototype.createInputColorField = function (section, label, type, className, value, attributes, onFieldUpdated) {
            var inputColorField = this.inputColorFieldRenderer
                .render(label, type, className, value, attributes, onFieldUpdated);
            section.find("." + Editor.DetailsViewConstants.sectionContentClassName).append(inputColorField);
            this.ignoreChangesWhileInputStrategy.addStopEventPropogationWhileInput(inputColorField);
            return inputColorField;
        };
        /**
        * Create a dropdown list
        */
        DetailsViewControl.prototype.createDropdownList = function (section, label, options, className, value, onSelectedValueChanged) {
            var dropdownList = this.dropdownElementRenderer.render(label, options, className, value);
            if (!Object.isNullOrUndefined(onSelectedValueChanged)) {
                this.setHandlerOnDropdownUpdate(dropdownList, onSelectedValueChanged);
            }
            section.find("." + Editor.DetailsViewConstants.sectionContentClassName).append(dropdownList);
            return dropdownList;
        };
        /**
        * Create a lookup field container
        */
        DetailsViewControl.prototype.createLookupContainer = function (section, label, className, id) {
            var lookupContainer = this.lookupContainerRenderer.render(label, className, id);
            section.find("." + Editor.DetailsViewConstants.sectionContentClassName).append(lookupContainer);
            this.ignoreChangesWhileInputStrategy.addStopEventPropogationWhileInput(lookupContainer);
            return lookupContainer;
        };
        /**
        * Add custom element to control
        */
        DetailsViewControl.prototype.addCustomElement = function (element, elementContainer) {
            elementContainer.append(element);
        };
        /**
        * Disposes the form control
        */
        DetailsViewControl.prototype.dispose = function () {
            this.linkFieldRenderer.dispose();
            this.imageFieldRenderer.dispose();
            this.clearContainer();
        };
        DetailsViewControl.prototype.setHandlerOnDropdownUpdate = function (dropdownList, onFieldUpdated) {
            dropdownList.find(Editor.DetailsViewConstants.selectTag).on("change", function () {
                onFieldUpdated(dropdownList.find(Editor.DetailsViewConstants.selectTag));
                return false;
            });
        };
        DetailsViewControl.prototype.clearContainer = function () {
            Editor.CommonUtils.getById(this.containerId).empty();
        };
        return DetailsViewControl;
    }());
    Editor.DetailsViewControl = DetailsViewControl;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var KeyCodes = MktSvc.Controls.Common.KeyCodes;
    /**
    * Section Renderer
    */
    var SectionRenderer = /** @class */ (function () {
        function SectionRenderer() {
        }
        /**
        * Render the form section
        */
        SectionRenderer.prototype.render = function (sectionContainerClass, sectionTitle) {
            var sectionContainer = $("<div>", { class: sectionContainerClass + " " + Editor.CommonUtils.getLangDirectionClass() });
            this.renderSectionHeading(sectionContainer, sectionTitle);
            this.renderSectionContentContainer(sectionContainer);
            return sectionContainer;
        };
        SectionRenderer.prototype.renderSectionHeading = function (sectionContainer, sectionHeading) {
            var toggleButton = $("<span>", { class: Editor.DetailsViewConstants.collapsableIconClassName + " " + Editor.CommonConstants.editorFontCssClass });
            toggleButton.on("click", function () {
                sectionContainer.find("." + Editor.DetailsViewConstants.sectionContentClassName).toggle();
                toggleButton.toggleClass(Editor.CommonConstants.collapsedCssClass);
            });
            sectionContainer.append(toggleButton);
            var sectionButton = $("<button>").addClass(Editor.DetailsViewConstants.headingClassName).attr("type", Editor.CommonConstants.buttonType);
            sectionButton.on("keypress", function (e) {
                if (e.keyCode === KeyCodes.Enter) {
                    toggleButton.click();
                }
            });
            var sectionLabel = $("<p>", { class: Editor.DetailsViewConstants.headingLabelClassName }).text(sectionHeading);
            sectionButton.append(sectionLabel);
            sectionContainer.append(sectionButton);
        };
        SectionRenderer.prototype.renderSectionContentContainer = function (sectionContainer) {
            sectionContainer.append($("<div>", { class: Editor.DetailsViewConstants.sectionContentClassName }));
        };
        return SectionRenderer;
    }());
    Editor.SectionRenderer = SectionRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
    * Input Field Renderer Class
    */
    var InputFieldRenderer = /** @class */ (function () {
        function InputFieldRenderer() {
        }
        /**
        * Render the form section
        */
        InputFieldRenderer.prototype.render = function (label, type, className, value, attributes, onFieldUpdated, ariaLabelKey) {
            var inputContainer = $("<div>", { class: Editor.DetailsViewConstants.inputControlContainerClassName });
            this.renderInputLabel(inputContainer, label, attributes["id"]);
            this.renderInputField(inputContainer, type, className, value, attributes, label, ariaLabelKey);
            if (!Object.isNullOrUndefined(onFieldUpdated)) {
                this.setHandlerOnInputUpdate(inputContainer, onFieldUpdated);
            }
            return inputContainer;
        };
        InputFieldRenderer.prototype.renderInputLabel = function (inputContainer, label, inputId) {
            var $label = $("<label>", {
                class: Editor.DetailsViewConstants.inputItemField + " " + Editor.DetailsViewConstants.propertyNameCssClass
            }).text(label);
            inputContainer.append($label);
        };
        InputFieldRenderer.prototype.renderInputField = function (inputContainer, type, className, value, attributes, label, ariaLabelKey) {
            var $input = $("<input type = " + type + " />");
            if (attributes.hasOwnProperty("min")) {
                $input.attr("aria-valuemin", attributes.min);
            }
            if (attributes.hasOwnProperty("max")) {
                $input.attr("aria-valuemax", attributes.max);
            }
            $input.attr(attributes);
            $input.addClass(Editor.DetailsViewConstants.inputAttributeClassName + " " + className);
            $input.val(value);
            if (ariaLabelKey) {
                $input.attr("aria-label", label + ". " + Editor.CommonUtils.getLocalizedString(ariaLabelKey));
            }
            else {
                $input.attr("aria-label", "" + label);
            }
            var inputElementContainer = $("<div>", { class: Editor.DetailsViewConstants.inputItemField });
            inputElementContainer.append($input);
            inputContainer.append(inputElementContainer);
        };
        InputFieldRenderer.prototype.setHandlerOnInputUpdate = function (inputField, onFieldUpdated) {
            var inputElement = inputField.find(Editor.DetailsViewConstants.inputTag).first();
            var initialInputValue = inputElement.val();
            var handlerInputUpdate = function () {
                var inputElem = inputField.find(Editor.DetailsViewConstants.inputTag).first();
                var currentInputElemVal = inputElem.val();
                if (initialInputValue !== currentInputElemVal) {
                    initialInputValue = currentInputElemVal;
                    onFieldUpdated(inputElem);
                    return false;
                }
            };
            inputElement.on("keydown", function (event) {
                if (event.keyCode === $.ui.keyCode.ENTER) {
                    handlerInputUpdate();
                }
            }).on("focusout", function () {
                handlerInputUpdate();
            });
        };
        return InputFieldRenderer;
    }());
    Editor.InputFieldRenderer = InputFieldRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
    * Class responsible for disabling the droping inside the block
    */
    var BlockDroppableController = /** @class */ (function () {
        function BlockDroppableController(eventBroker) {
            this.eventBroker = eventBroker;
        }
        BlockDroppableController.prototype.getName = function () {
            return "BlockDroppableController";
        };
        BlockDroppableController.prototype.setupBlocks = function (blockElements) {
            // Prevent the default action, but, don't stop bubling the event -> the container will safely handle it
            blockElements.on("drop", function (evt) { evt.preventDefault(); });
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.controllerReady, new Editor.ControllerReadyEventArgs(this.getName()));
        };
        BlockDroppableController.prototype.cleanupBlocks = function (blockElements) {
        };
        BlockDroppableController.prototype.disposeBlocks = function (blockElements) {
            blockElements.off("drop");
        };
        BlockDroppableController.prototype.dispose = function () { };
        return BlockDroppableController;
    }());
    Editor.BlockDroppableController = BlockDroppableController;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var ContainerProvider = /** @class */ (function () {
        function ContainerProvider() {
        }
        ContainerProvider.prototype.getContainers = function (selectedEditor) {
            return selectedEditor.find(Editor.CommonUtils.getAttrSelector(Editor.Contract.containerAttrName));
        };
        return ContainerProvider;
    }());
    Editor.ContainerProvider = ContainerProvider;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    /**
   * Class responsible for setting up the droppable functionality for the containers - blocks can be dropped into the containers
   */
    var ContainerDroppableController = /** @class */ (function () {
        function ContainerDroppableController(eventBroker) {
            this.mousePositionDifference = 5;
            this.eventBroker = eventBroker;
        }
        ContainerDroppableController.prototype.getName = function () {
            return "ContainerDroppableController";
        };
        ContainerDroppableController.prototype.setupContainers = function (containers) {
            var _this = this;
            this.frameDocument = Editor.CommonUtils.getByClass(Editor.CommonConstants.designerContentEditorFrameClassName)
                .contents();
            if (Object.isNullOrUndefined(this.pageDropHandler)) {
                // Register a handler on the page to cleanup UI hints on drop, even outside of the designer... we need to store the instance so we dont unregister too much
                $(document).on("dragend", this.pageDropHandler = function () {
                    _this.restoreEditableContentBlocks(containers);
                    _this.cleanupUIHints(containers);
                });
            }
            if (Object.isNullOrUndefined(this.onFrameDocumentDragOver)) {
                this.frameDocument.on("dragover", this.onFrameDocumentDragOver = function (evt) {
                    if (!_this.isDropable($(evt.target))) {
                        // Removes the placeholder if target doesn't support drop
                        _this.cleanupSortableHighlightMarker(containers);
                    }
                });
            }
            containers.on("dragover", function (evt) {
                if (_this.isSupportedDragObject) {
                    var block = !Object.isNullOrUndefined($(evt.target).attr("contenteditable"))
                        ? $(evt.target)
                        : $(evt.target).closest(Editor.CommonUtils.getAttrSelector("contenteditable"));
                    if (block.length > 0 &&
                        Object.isNullOrUndefined(block.attr(Editor.CommonConstants.makeEditableAttrName)) &&
                        block.attr("contenteditable") === "true") {
                        block.attr(Editor.CommonConstants.makeEditableAttrName, String.Empty);
                        Editor.CommonUtils.setNonEditable(block);
                    }
                    _this.addSortableHighlightMarker.apply(_this, [evt]);
                }
            });
            containers.on("drop", function (evt) {
                _this.replaceSortableHighlightMarkerWithElement.apply(_this, [evt]);
                _this.isSupportedDragObject = false;
            });
            this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.designerDragStart, this.onDesignerDragStart = function () { _this.isSupportedDragObject = true; });
            this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.designerDragEnd, this.onDesignerDragEnd = function () { _this.isSupportedDragObject = false; });
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.controllerReady, new Editor.ControllerReadyEventArgs(this.getName()));
        };
        ContainerDroppableController.prototype.cleanupContainers = function (containers) {
            this.cleanupEditableDataAttr(containers.find(Editor.CommonUtils
                .getAttrSelector(Editor.CommonConstants.makeEditableAttrName)));
            Editor.CommonUtils.removeEditable(containers);
            this.cleanupUIHints(containers);
            if (String.isNullOrWhitespace(containers.attr("class"))) {
                containers.removeAttr("class");
            }
        };
        ContainerDroppableController.prototype.disposeContainers = function (containers) {
            containers.off("dragover drop");
            if (!Object.isNullOrUndefined(this.pageDropHandler)) {
                $(document).off("dragend", this.pageDropHandler);
                this.pageDropHandler = null;
            }
            if (!Object.isNullOrUndefined(this.onFrameDocumentDragOver)) {
                if (!Object.isNullOrUndefined(this.frameDocument)) {
                    this.frameDocument.off("dragover", this.onFrameDocumentDragOver);
                    this.frameDocument = null;
                }
                this.onFrameDocumentDragOver = null;
            }
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerDragStart, this.onDesignerDragStart);
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerDragEnd, this.onDesignerDragEnd);
        };
        ContainerDroppableController.prototype.dispose = function () {
            this.onFrameDocumentDragOver = null;
            this.onDesignerDragStart = null;
            this.onDesignerDragEnd = null;
            this.pageDropHandler = null;
            this.lastContainer = null;
            this.frameDocument = null;
            this.eventBroker = null;
        };
        ContainerDroppableController.prototype.addSortableHighlightMarker = function (event) {
            event.preventDefault();
            event.stopPropagation();
            var dragEvent = event.originalEvent;
            if (Math.abs(dragEvent.clientY - this.dragYPosition) < this.mousePositionDifference &&
                Math.abs(dragEvent.clientX - this.dragXPosition) < this.mousePositionDifference) {
                // Perf optimization: mouse position doesn't changed much
                return;
            }
            this.dragYPosition = dragEvent.clientY;
            this.dragXPosition = dragEvent.clientX;
            if (!this.isSupportedDragObject) {
                // Dragging something which is not a block
                return;
            }
            if ($(event.target).hasClass(Editor.CommonConstants.sortablePlaceholderClassName)) {
                // We are dragging over a placeholder - e.g. back and forth few pixels
                return;
            }
            // On a container - we need to display the highlighted placeholder if not already displayed (same container, same item index)
            var container = !Object.isNullOrUndefined($(event.target).attr(Editor.Contract.containerAttrName))
                ? $(event.target)
                : $(event.target).closest(Editor.CommonUtils.getAttrSelector(Editor.Contract.containerAttrName));
            var indexAtContainer = 0;
            var children = container.children(Editor.CommonUtils
                .getNotClassSelector(Editor.CommonConstants.sortablePlaceholderClassName));
            var scrollPosition = Editor.CommonUtils.getByClass(Editor.CommonConstants.designerContentEditorFrameClassName).contents()
                .scrollTop();
            var foundBlockBellowTheMousePointer = false;
            children.each(function (index, element) {
                indexAtContainer = index;
                // Comparison coordinates of the event with elements positions, considering scroll offset
                if (dragEvent.clientY < $(element).offset().top - scrollPosition + $(element).height() / 2) {
                    foundBlockBellowTheMousePointer = true;
                    return false;
                }
            });
            if (this.lastContainer === container && this.lastIndexAtContainer === indexAtContainer) {
                // Perf optimization: we don't need to repaint if nothing has changed
                return;
            }
            this.lastIndexAtContainer = indexAtContainer;
            this.lastContainer = container;
            // Parnts until to sneak a peek back in the parent hiearchy without adding dependency/knowledge about particular parents and types (e.g. presence of iframes and similar)
            $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.sortablePlaceholderClassName), container.parentsUntil("body html"))
                .remove();
            var marker = $("<div>+</div>");
            Editor.CommonUtils.setEditable(marker);
            marker.addClass(Editor.CommonConstants.sortablePlaceholderClassName);
            if (foundBlockBellowTheMousePointer) {
                marker.insertBefore(children[indexAtContainer]);
            }
            else {
                container.append(marker);
            }
        };
        ContainerDroppableController.prototype.replaceSortableHighlightMarkerWithElement = function (event) {
            event.preventDefault();
            event.stopPropagation();
            var container = $(event.target);
            var dragData = event.originalEvent.dataTransfer;
            if (!this.isSupportedDragObject) {
                // Defansive - an unknow element has been dropped (only blocks are supported)
                $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.sortablePlaceholderClassName), container.parentsUntil("body html"))
                    .replaceWith(String.Empty);
                return;
            }
            var block = $(dragData.getData("Text"));
            block.removeAttr("style");
            block.removeAttr("class");
            $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.sortablePlaceholderClassName), container.parentsUntil("body html"))
                .replaceWith(block);
            // Notify block added
            var eventArgs = new Editor.BlockAddedEventArgs(block);
            this.eventBroker.notify(Editor.EventConstants.blockAdded, eventArgs);
        };
        ContainerDroppableController.prototype.cleanupSortableHighlightMarker = function (containers) {
            $(containers).find(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.sortablePlaceholderClassName)).remove();
        };
        ContainerDroppableController.prototype.isDropable = function (target) {
            return target.closest(".ui-sortable").length > 0;
        };
        /**
         * Cleans up the UI hints - gridlines, drop-markers
         * @param containers The containers.
         */
        ContainerDroppableController.prototype.cleanupUIHints = function (containers) {
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerDragEnd);
            this.cleanupSortableHighlightMarker(containers);
        };
        /**
         * Restore content editable blocks from containers
         * @param containers The containers.
         */
        ContainerDroppableController.prototype.restoreEditableContentBlocks = function (containers) {
            var _this = this;
            var blocks = containers.find(Editor.CommonUtils.getAttrSelector(Editor.CommonConstants.makeEditableAttrName));
            blocks.each(function (indexBlock, block) {
                var $block = $(block);
                Editor.CommonUtils.setEditable($block);
                _this.cleanupEditableDataAttr($block);
            });
        };
        /**
         * Remove editable data attr
         * @param element The JQuery element.
         */
        ContainerDroppableController.prototype.cleanupEditableDataAttr = function (element) {
            if (!Object.isNullOrUndefined(element)) {
                element.removeAttr(Editor.CommonConstants.makeEditableAttrName);
            }
        };
        return ContainerDroppableController;
    }());
    Editor.ContainerDroppableController = ContainerDroppableController;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    /**
    * Class responsible for setting the sortable inside the containers - blocks can be sosorted inside and between the containers
    */
    var ContainerSortableController = /** @class */ (function () {
        function ContainerSortableController(eventBroker) {
            this.eventBroker = eventBroker;
        }
        ContainerSortableController.prototype.getName = function () {
            return "ContainerSortableController";
        };
        ContainerSortableController.prototype.setupContainers = function (containers) {
            var _this = this;
            var sortableDragHandlerSelector = "." + Editor.CommonConstants.sortableDragHandlerClassName;
            var itemsSelector = "> div";
            containers.sortable({
                cursor: Editor.CommonConstants.draggableCursor,
                cursorAt: { top: 5, left: 112 },
                connectWith: containers,
                placeholder: Editor.CommonConstants.sortablePlaceholderClassName,
                items: itemsSelector,
                helper: "clone",
                handle: sortableDragHandlerSelector,
                // using receive on .sortable instead of drop on .droppable
                // because the combo draggable / droppable / sortable triggers the drop event to fire twice (known jqueryui bug)
                update: function () {
                    _this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerDragEnd);
                    _this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentChanged);
                },
                start: function (event, ui) {
                    // Set width and height of the sortable container
                    ui.helper.width(Editor.CommonConstants.draggableHelperWidth);
                    ui.helper.height(Editor.CommonConstants.draggableHelperHeight);
                    _this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerDragStart, new Editor.DesignerDragStartEventArgs(ui.item));
                },
                stop: function () { return _this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerDragEnd); }
            });
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.controllerReady, new Editor.ControllerReadyEventArgs(this.getName()));
        };
        ContainerSortableController.prototype.cleanupContainers = function (containers) {
            containers.removeClass("ui-sortable");
            if (String.isNullOrWhitespace(containers.attr("class"))) {
                containers.removeAttr("class");
            }
        };
        ContainerSortableController.prototype.disposeContainers = function (containers) {
            containers.sortable("destroy");
        };
        ContainerSortableController.prototype.dispose = function () {
            this.eventBroker = null;
        };
        return ContainerSortableController;
    }());
    Editor.ContainerSortableController = ContainerSortableController;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
   * Class responsible for displaying UI/drag hints in the designer
   */
    var ContainerDragModeController = /** @class */ (function () {
        function ContainerDragModeController(eventBroker) {
            this.eventBroker = eventBroker;
        }
        ContainerDragModeController.prototype.getName = function () {
            return "ContainerDragModeController";
        };
        ContainerDragModeController.prototype.setupContainers = function (containers) {
            var _this = this;
            this.designerDragStartDelegate = this.eventBroker.subscribe(Editor.DesignerInternalEventConstants
                .designerDragStart, function () { _this.setupDragMode(containers); });
            this.designerDragEndDelegate = this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.designerDragEnd, function () { _this.cleanupDragMode(containers); });
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.controllerReady, new Editor.ControllerReadyEventArgs(this.getName()));
        };
        ContainerDragModeController.prototype.cleanupContainers = function (containers) {
            this.cleanupDragMode(containers);
        };
        ContainerDragModeController.prototype.disposeContainers = function (containers) {
            this.cleanupDragMode(containers);
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerDragStart, this.designerDragStartDelegate);
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerDragEnd, this.designerDragEndDelegate);
        };
        ContainerDragModeController.prototype.dispose = function () { };
        ContainerDragModeController.prototype.setupDragMode = function (containers) {
            $(containers).addClass(Editor.CommonConstants.designerContentEditorContainerInDragModeClassName);
        };
        ContainerDragModeController.prototype.cleanupDragMode = function (containers) {
            Editor.CommonUtils.removeClass($(containers), Editor.CommonConstants.designerContentEditorContainerInDragModeClassName);
        };
        return ContainerDragModeController;
    }());
    Editor.ContainerDragModeController = ContainerDragModeController;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
    * Class responsible for the adding placeholders as first element when editor is in add mode.
    */
    var ContainerAddModeController = /** @class */ (function () {
        function ContainerAddModeController(eventBroker, containerProvider) {
            this.eventBroker = eventBroker;
            this.containerProvider = containerProvider;
        }
        ContainerAddModeController.prototype.getName = function () {
            return "ContainerAddModeController";
        };
        ContainerAddModeController.prototype.setupContainers = function (containers) {
            var _this = this;
            if (Object.isNullOrUndefined(this.onDesignerAddStart)) {
                this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.designerAddStart, this.onDesignerAddStart = function (eventArgs) { return _this
                    .designerAddStart(eventArgs.block, eventArgs.movingExistingBlock); });
            }
            if (Object.isNullOrUndefined(this.onDesignerAddEnd)) {
                this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.designerAddEnd, this.onDesignerAddEnd = function () { return _this.cleanup(); });
            }
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.controllerReady, new Editor.ControllerReadyEventArgs(this.getName()));
        };
        ContainerAddModeController.prototype.cleanupContainers = function (containers) {
            this.cleanup();
        };
        ContainerAddModeController.prototype.disposeContainers = function (containers) {
            this.cleanup();
            if (!Object.isNullOrUndefined(this.onDesignerAddStart)) {
                this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerAddStart, this.onDesignerAddStart);
            }
            if (!Object.isNullOrUndefined(this.onDesignerAddEnd)) {
                this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerAddEnd, this.onDesignerAddEnd);
            }
            if (!Object.isNullOrUndefined(this.onDesignerAddCanceled)) {
                this.eventBroker.unsubscribe(Editor.TabControlEventConstants.tabsStateUpdated, this.onDesignerAddCanceled);
            }
            this.onDesignerAddStart = this.onDesignerAddEnd = this.onDesignerAddCanceled = null;
        };
        ContainerAddModeController.prototype.dispose = function () { };
        ContainerAddModeController.prototype.designerAddStart = function (block, movingExistingBlock) {
            var _this = this;
            var designerFrame = Editor.CommonUtils.getByClass(Editor.CommonConstants.designerContentEditorFrameClassName);
            if (Object.isNullOrUndefined(this.onDesignerAddCanceled)) {
                this.onDesignerAddCanceled = function () { _this.addCanceled(); };
                // Exit from the add mode by the mousedown event on drag handler
                designerFrame.contents().on("mousedown", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if ($(e.target).hasClass(Editor.CommonConstants.sortableDragHandlerClassName)) {
                        _this.onDesignerAddCanceled();
                    }
                });
                // Exit from the add mode by the click event if target is not ignored
                designerFrame.contents().on("click", function (e) {
                    if (!_this.isIgnoredTarget($(e.target))) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.onDesignerAddCanceled();
                    }
                });
                this.eventBroker.subscribe(Editor.TabControlEventConstants.tabsStateUpdated, this.onDesignerAddCanceled);
            }
        };
        ContainerAddModeController.prototype.cleanup = function () {
            var designerFrame = Editor.CommonUtils.getByClass(Editor.CommonConstants.designerContentEditorFrameClassName);
            Editor.CommonUtils.getByClass(Editor.CommonConstants.sortablePlaceholderClassName, designerFrame.contents()).remove();
            designerFrame.contents().off("mousedown click");
            if (!Object.isNullOrUndefined(this.onDesignerAddCanceled)) {
                this.eventBroker.unsubscribe(Editor.TabControlEventConstants.tabsStateUpdated, this.onDesignerAddCanceled);
                this.onDesignerAddCanceled = null;
            }
        };
        ContainerAddModeController.prototype.isIgnoredTarget = function (target) {
            // Ignore move block button (button__moveblockbtn or button__moveblockbtn_icon) and placeholders
            return target.hasClass(Editor.CommonConstants.selectedSortablePlaceholderClassName) ||
                (target.attr("class") && target.attr("class").indexOf("moveblockbtn") !== -1);
        };
        ContainerAddModeController.prototype.addCanceled = function () {
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerAddEnd);
        };
        return ContainerAddModeController;
    }());
    Editor.ContainerAddModeController = ContainerAddModeController;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /**
    * The base class for the event arguments for the internal events used by the event broker
    */
    var EventArgs = /** @class */ (function () {
        function EventArgs(sourceId) {
            this.sourceId = sourceId;
        }
        return EventArgs;
    }());
    Editor.EventArgs = EventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BlockAddedEventArgs = /** @class */ (function (_super) {
        __extends(BlockAddedEventArgs, _super);
        function BlockAddedEventArgs(block) {
            var _this = _super.call(this) || this;
            _this.block = block;
            return _this;
        }
        return BlockAddedEventArgs;
    }(Editor.EventArgs));
    Editor.BlockAddedEventArgs = BlockAddedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
    * Event args for the designer add start event.
    */
    var DesignerAddStartEventArgs = /** @class */ (function (_super) {
        __extends(DesignerAddStartEventArgs, _super);
        function DesignerAddStartEventArgs(block, movingExistingBlock) {
            var _this = _super.call(this, null) || this;
            _this.block = block;
            _this.movingExistingBlock = movingExistingBlock;
            return _this;
        }
        return DesignerAddStartEventArgs;
    }(Editor.EventArgs));
    Editor.DesignerAddStartEventArgs = DesignerAddStartEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BlockCleanupRequestedEventArgs = /** @class */ (function (_super) {
        __extends(BlockCleanupRequestedEventArgs, _super);
        function BlockCleanupRequestedEventArgs() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return BlockCleanupRequestedEventArgs;
    }(Editor.EventArgs));
    Editor.BlockCleanupRequestedEventArgs = BlockCleanupRequestedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var DesignerInternalEventConstants = /** @class */ (function () {
        function DesignerInternalEventConstants() {
        }
        DesignerInternalEventConstants.selectionChanged = "designer.selectionChanged";
        DesignerInternalEventConstants.contentChanged = "designer.contentChanged";
        DesignerInternalEventConstants.contentRefreshed = "designer.contentRefreshed";
        DesignerInternalEventConstants.contentBlockChanged = "designer.contentBlockChanged";
        DesignerInternalEventConstants.blockCleanupRequested = "designer.blockCleanupRequested";
        DesignerInternalEventConstants.blockLoaded = "designer.blockLoaded";
        DesignerInternalEventConstants.blockClicked = "designer.blockClicked";
        DesignerInternalEventConstants.ckEditorInstanceReadyEvent = "designer.ckEditorInstanceReady";
        DesignerInternalEventConstants.ckEditorFocus = "designer.ckEditorFocus";
        DesignerInternalEventConstants.designerFrameInitialized = "designer.designerInitialized";
        DesignerInternalEventConstants.designerFrameDisposed = "designer.designerDisposed";
        DesignerInternalEventConstants.designerReady = "designer.designerReady";
        DesignerInternalEventConstants.designerDragStart = "designer.dragStart";
        DesignerInternalEventConstants.designerDragEnd = "designer.dragEnd";
        DesignerInternalEventConstants.controllerReady = "designer.controllerReady";
        DesignerInternalEventConstants.designerAddStart = "designer.addStart";
        DesignerInternalEventConstants.designerAddEnd = "designer.addEnd";
        DesignerInternalEventConstants.designerNonEventPropagationStart = "designer.nonEventPropagationStart";
        DesignerInternalEventConstants.designerNonEventPropagationEnd = "designer.nonEventPropagationEnd";
        DesignerInternalEventConstants.designerToolbarPositionChanged = "designer.toolbarPositionChanged";
        DesignerInternalEventConstants.fullPageNonEventPropagationStart = "fullPage.nonEventPropagationStart";
        DesignerInternalEventConstants.fullPageNonEventPropagationEnd = "fullPage.nonEventPropagationEnd";
        // View related
        DesignerInternalEventConstants.stylesViewContentUpdated = "stylesViewContentUpdated";
        return DesignerInternalEventConstants;
    }());
    Editor.DesignerInternalEventConstants = DesignerInternalEventConstants;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var CkEditorInstanceReadyEventArgs = /** @class */ (function (_super) {
        __extends(CkEditorInstanceReadyEventArgs, _super);
        function CkEditorInstanceReadyEventArgs() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CkEditorInstanceReadyEventArgs;
    }(Editor.EventArgs));
    Editor.CkEditorInstanceReadyEventArgs = CkEditorInstanceReadyEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var CkEditorFocusEventArgs = /** @class */ (function (_super) {
        __extends(CkEditorFocusEventArgs, _super);
        function CkEditorFocusEventArgs() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CkEditorFocusEventArgs;
    }(Editor.EventArgs));
    Editor.CkEditorFocusEventArgs = CkEditorFocusEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    var ContentChangedEventArgs = /** @class */ (function (_super) {
        __extends(ContentChangedEventArgs, _super);
        function ContentChangedEventArgs(html, sourceId, originalSourceId, component) {
            var _this = _super.call(this, sourceId) || this;
            _this.html = html;
            _this.originalSourceId = String.isNullUndefinedOrWhitespace(originalSourceId) ? _this.sourceId : originalSourceId;
            _this.component = component;
            return _this;
        }
        return ContentChangedEventArgs;
    }(Editor.EventArgs));
    Editor.ContentChangedEventArgs = ContentChangedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var ImageAttributeChangedEventArgs = /** @class */ (function (_super) {
        __extends(ImageAttributeChangedEventArgs, _super);
        function ImageAttributeChangedEventArgs(imageElement, attributeName, attributeValue, sourceId) {
            var _this = _super.call(this, sourceId) || this;
            _this.imageElement = imageElement;
            _this.attributeName = attributeName.toLowerCase();
            _this.attributeValue = attributeValue;
            return _this;
        }
        return ImageAttributeChangedEventArgs;
    }(Editor.EventArgs));
    Editor.ImageAttributeChangedEventArgs = ImageAttributeChangedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var ToolbarShownEventArgs = /** @class */ (function (_super) {
        __extends(ToolbarShownEventArgs, _super);
        function ToolbarShownEventArgs(blockId) {
            var _this = _super.call(this, null) || this;
            _this.blockId = blockId;
            return _this;
        }
        return ToolbarShownEventArgs;
    }(Editor.EventArgs));
    Editor.ToolbarShownEventArgs = ToolbarShownEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var HrefAttributeChangedEventArgs = /** @class */ (function (_super) {
        __extends(HrefAttributeChangedEventArgs, _super);
        function HrefAttributeChangedEventArgs(element, href) {
            var _this = _super.call(this) || this;
            _this.element = element;
            _this.href = href;
            return _this;
        }
        return HrefAttributeChangedEventArgs;
    }(Editor.EventArgs));
    Editor.HrefAttributeChangedEventArgs = HrefAttributeChangedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var ControlRenderedEventArgs = /** @class */ (function (_super) {
        __extends(ControlRenderedEventArgs, _super);
        function ControlRenderedEventArgs(viewId, html) {
            var _this = _super.call(this) || this;
            _this.viewId = viewId;
            _this.html = html;
            return _this;
        }
        return ControlRenderedEventArgs;
    }(Editor.EventArgs));
    Editor.ControlRenderedEventArgs = ControlRenderedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var ControllerReadyEventArgs = /** @class */ (function (_super) {
        __extends(ControllerReadyEventArgs, _super);
        function ControllerReadyEventArgs(className) {
            var _this = _super.call(this) || this;
            _this.controllerName = className;
            return _this;
        }
        return ControllerReadyEventArgs;
    }(Editor.EventArgs));
    Editor.ControllerReadyEventArgs = ControllerReadyEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var SelectionChangedEventArgs = /** @class */ (function (_super) {
        __extends(SelectionChangedEventArgs, _super);
        function SelectionChangedEventArgs(blockDefinition, blockElement) {
            var _this = _super.call(this) || this;
            _this.blockDefinition = blockDefinition;
            _this.blockElement = blockElement;
            return _this;
        }
        return SelectionChangedEventArgs;
    }(Editor.EventArgs));
    Editor.SelectionChangedEventArgs = SelectionChangedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var KeyboardCommand = MktSvc.Controls.Common.KeyboardCommand;
    var KeyboardKeyCodes = MktSvc.Controls.Common.KeyboardKeyCodes;
    var KeyboardModifierType = MktSvc.Controls.Common.KeyboardModifierType;
    var KeyCodes = MktSvc.Controls.Common.KeyCodes;
    var MenuBarView = /** @class */ (function (_super) {
        __extends(MenuBarView, _super);
        function MenuBarView(menuBarContainerId, menuBarItems, keyboardCommandManager) {
            var _this = _super.call(this, menuBarContainerId) || this;
            _this.keyboardCommandManager = keyboardCommandManager;
            _this.menuBarItems = menuBarItems;
            return _this;
        }
        MenuBarView.prototype.init = function (eventBroker) {
            this.eventBroker = eventBroker;
            this.render();
            this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.zeroKey, [KeyboardModifierType.Alt, KeyboardModifierType.Control], function () {
                // Set focus on the first visible button
                Editor.CommonUtils.getByClass(Editor.CommonConstants.menuBarItemsCssClass).find("button:visible").eq(0).focus();
            }));
            this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.f11Key, [KeyboardModifierType.Alt], function () {
                $(Editor.CommonUtils.getByClass(Editor.CommonConstants.maximizeButtonCssClass)).click();
            }));
        };
        MenuBarView.prototype.activate = function () {
            if (!this.isActive) {
                _super.prototype.activate.call(this);
            }
        };
        MenuBarView.prototype.render = function () {
            var _this = this;
            var menuBarDivider = $("<div>").addClass(Editor.CommonConstants.menuBarDividerCssClass);
            this.getElement().append(menuBarDivider);
            this.menuBarContainer = $("<div>").addClass(Editor.CommonConstants.menuBarItemsCssClass);
            this.getElement().append(this.menuBarContainer);
            this.menuBarItems.each(function (item) {
                item.init(_this.eventBroker);
            });
            this.setupKeyboardNavigation();
            this.eventBroker.notify(Editor.EventConstants.controlRendered, new Editor.ControlRenderedEventArgs(this.id));
        };
        MenuBarView.prototype.setupKeyboardNavigation = function () {
            var _this = this;
            this.menuBarContainer.on("keydown", function (e) {
                var keyPressed = e.which || e.keyCode;
                switch (keyPressed) {
                    case KeyCodes.Left:
                        e.preventDefault();
                        e.stopPropagation();
                        _this.focusPrevItem();
                        break;
                    case KeyCodes.Right:
                        e.preventDefault();
                        e.stopPropagation();
                        _this.focusNextItem();
                        break;
                    default:
                        break;
                }
            });
        };
        MenuBarView.prototype.focusNextItem = function () {
            var menuBarButtons = $("." + Editor.CommonConstants.toolbarButtonCssClass);
            var focusIndex = this.getFocusedElementIndex(menuBarButtons);
            if (focusIndex !== -1 && focusIndex < menuBarButtons.length) {
                menuBarButtons.eq(focusIndex + 1).focus();
            }
        };
        MenuBarView.prototype.focusPrevItem = function () {
            var menuBarButtons = $("." + Editor.CommonConstants.toolbarButtonCssClass);
            var focusIndex = this.getFocusedElementIndex(menuBarButtons);
            if (focusIndex > 0) {
                menuBarButtons.eq(focusIndex - 1).focus();
            }
        };
        MenuBarView.prototype.getFocusedElementIndex = function (menuBarButtons) {
            var focusedElement = document.activeElement;
            for (var i = 0; i < menuBarButtons.length; i++) {
                if (menuBarButtons.eq(i).is(focusedElement)) {
                    return i;
                }
            }
            return -1;
        };
        MenuBarView.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.menuBarItems)) {
                this.menuBarItems.each(function (item) {
                    item.dispose();
                });
            }
            this.getElement().off();
            this.getElement().empty();
            this.keyboardCommandManager = null;
            this.menuBarContainer = null;
            this.menuBarItems = null;
        };
        return MenuBarView;
    }(Editor.Control));
    Editor.MenuBarView = MenuBarView;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var UndoButton = /** @class */ (function (_super) {
        __extends(UndoButton, _super);
        function UndoButton() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UndoButton.prototype.init = function (eventBroker) {
            _super.prototype.init.call(this, eventBroker);
            this.render();
        };
        UndoButton.prototype.activate = function () { };
        UndoButton.prototype.render = function () {
            var _this = this;
            var undoButtonImage = $("<span>").addClass(Editor.CommonConstants.undoButtonImageCssClass).addClass(Editor.CommonConstants.editorFontCssClass);
            this.undoButtonContainer = $("<button></button>")
                .addClass(Editor.CommonConstants.toolbarButtonCssClass)
                .addClass(Editor.CommonConstants.undoButtonCssClass)
                .attr("title", Editor.CommonUtils.getLocalizedString("[Undo]"))
                .attr("aria-label", Editor.CommonUtils.getLocalizedString("[Undo]"))
                .attr("type", Editor.CommonConstants.buttonType)
                .append(undoButtonImage);
            Editor.CommonUtils.getByClass(Editor.CommonConstants.menuBarItemsCssClass).append(this.undoButtonContainer);
            this.undoButtonContainer.on("click", function () { return _this.onClick(); });
        };
        UndoButton.prototype.onClick = function () {
            this.eventBroker.notify(MktSvcCommon.EventConstants.UndoExecuted);
        };
        UndoButton.prototype.deactivate = function () { };
        UndoButton.prototype.dispose = function () {
            this.undoButtonContainer.off("click");
            this.undoButtonContainer.remove();
        };
        return UndoButton;
    }(Editor.Control));
    Editor.UndoButton = UndoButton;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var RedoButton = /** @class */ (function (_super) {
        __extends(RedoButton, _super);
        function RedoButton() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RedoButton.prototype.init = function (eventBroker) {
            _super.prototype.init.call(this, eventBroker);
            this.render();
        };
        RedoButton.prototype.activate = function () { };
        RedoButton.prototype.render = function () {
            var _this = this;
            var redoButtonImage = $("<span>").addClass(Editor.CommonConstants.redoButtonImageCssClass).addClass(Editor.CommonConstants.editorFontCssClass);
            this.redoButtonContainer = $("<button></button>")
                .addClass(Editor.CommonConstants.toolbarButtonCssClass)
                .addClass(Editor.CommonConstants.redoButtonCssClass)
                .attr("title", Editor.CommonUtils.getLocalizedString("[Redo]"))
                .attr("aria-label", Editor.CommonUtils.getLocalizedString("[Redo]"))
                .attr("type", Editor.CommonConstants.buttonType)
                .append(redoButtonImage);
            Editor.CommonUtils.getByClass(Editor.CommonConstants.menuBarItemsCssClass).append(this.redoButtonContainer);
            this.redoButtonContainer.on("click", function () { return _this.onClick(); });
        };
        RedoButton.prototype.onClick = function () {
            this.eventBroker.notify(MktSvcCommon.EventConstants.RedoExecuted);
        };
        RedoButton.prototype.deactivate = function () { };
        RedoButton.prototype.dispose = function () {
            this.redoButtonContainer.off("click");
            this.redoButtonContainer.remove();
        };
        return RedoButton;
    }(Editor.Control));
    Editor.RedoButton = RedoButton;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var KeyCodes = MktSvc.Controls.Common.KeyCodes;
    var ToolsDropdown = /** @class */ (function (_super) {
        __extends(ToolsDropdown, _super);
        function ToolsDropdown(id, toolsDropdownButton, tools, toolBlockMapping) {
            var _this = _super.call(this, id) || this;
            _this.defaultValueText = "[Select to add a new block]";
            _this.disablePlusButton = function () {
                _this.plusButton[0].style.opacity = "0.4";
                _this.plusButton[0].style.cursor = "no-drop";
                _this.plusButton.prop("onclick", null).off("click");
            };
            _this.enablePlusButton = function () {
                _this.plusButton[0].style.opacity = "1.0";
                _this.plusButton[0].style.cursor = "pointer";
                _this.setupOnClick();
            };
            _this.toolsDropdownButton = toolsDropdownButton;
            _this.tools = tools;
            _this.toolBlockMapping = toolBlockMapping;
            _this.renderedTools = [];
            return _this;
        }
        ToolsDropdown.prototype.init = function (eventBroker) {
            var _this = this;
            _super.prototype.init.call(this, eventBroker);
            // Set default value after exit from the add mode
            this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.designerAddEnd, this.onDesignerAddEnd = function () { return _this.resetDropdown(); });
            // Hide tools dropdown if we are not on the designer tab
            this.eventBroker.subscribe(Editor.TabControlEventConstants.tabsStateUpdated, this.onTabsStateUpdated = function () { return _this.tabsStateUpdated(); });
            this.render();
            this.eventBroker.subscribe(Editor.EventConstants.elementsCannotBeInserted, this.disablePlusButton);
            this.eventBroker.subscribe(Editor.EventConstants.elementsCanBeInserted, this.enablePlusButton);
        };
        ToolsDropdown.prototype.activate = function () { };
        ToolsDropdown.prototype.render = function () {
            this.toolsDropdownContainer = $("<div>").addClass(Editor.CommonConstants.toolsDropdownCssClass);
            this.plusButton = this.createPlusButton();
            this.toolsList = this.createToolsList();
            this.toolsDropdownContainer.append(this.plusButton);
            this.toolsDropdownContainer.append(this.toolsList);
            this.toolsList.hide();
            // Toggle or untoggle the plus button
            this.setupOnClick();
            /* Hide tools List View Div once it loses focus */
            this.setupClosingOnFocusOut();
            // Keyboard navigation for the dropdown
            this.setupKeyboardNavigation();
            Editor.CommonUtils.getByClass(Editor.CommonConstants.menuBarItemsCssClass).append(this.toolsDropdownContainer);
        };
        ToolsDropdown.prototype.setupOnClick = function () {
            var _this = this;
            this.plusButton.on("click", function () {
                _this.toggleDropdownButton();
            });
        };
        ToolsDropdown.prototype.setupClosingOnFocusOut = function () {
            var _this = this;
            this.toolsList.on("mouseleave", function (e) {
                e.preventDefault();
                e.stopPropagation();
                _this.closeToolsList();
                _this.plusButton.focus();
            });
        };
        ToolsDropdown.prototype.setupKeyboardNavigation = function () {
            var _this = this;
            this.toolsDropdownContainer.on("keydown", function (e) {
                var keyPressed = e.which || e.keyCode;
                switch (keyPressed) {
                    case KeyCodes.Up:
                        if (Editor.CommonUtils.isVisible(_this.toolsList)) {
                            e.preventDefault();
                            e.stopPropagation();
                            _this.focusPrevListItem();
                        }
                        break;
                    case KeyCodes.Down:
                        if (Editor.CommonUtils.isVisible(_this.toolsList)) {
                            e.preventDefault();
                            e.stopPropagation();
                            _this.focusNextListItem();
                        }
                        break;
                    case KeyCodes.Enter:
                        // Open the add mode by the keyboard
                        e.preventDefault();
                        e.stopPropagation();
                        if (!Object.isNullOrUndefined(_this.currentItem)) {
                            var buttonItem = _this.currentItem.find("button");
                            _this.onToolItemChanged(buttonItem, _this.currentItem, buttonItem.attr("data-type"));
                            _this.closeToolsList();
                        }
                        else {
                            _this.toggleDropdownButton();
                        }
                        break;
                    case KeyCodes.Esc:
                        _this.closeToolsList();
                        _this.plusButton.focus();
                        break;
                    case KeyCodes.Tab:
                        // Only activate tab events when dropdown menu is shown
                        if (_this.plusButton.hasClass(Editor.CommonConstants.selectedToolsDropdownCssClass)) {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.shiftKey) {
                                _this.focusPrevListItem();
                            }
                            else {
                                _this.focusNextListItem();
                            }
                        }
                        break;
                }
            });
        };
        ToolsDropdown.prototype.focusNextListItem = function () {
            var nextItem;
            var toolsListItems = this.toolsList.children("li");
            var currentItem = this.toolsList.find("." + ToolsDropdown.focusedToolsListItemCssClass);
            if (currentItem.length === 0 || toolsListItems.last().hasClass(ToolsDropdown.focusedToolsListItemCssClass)) {
                nextItem = toolsListItems.first();
            }
            else {
                nextItem = currentItem.next();
            }
            this.focus(nextItem);
        };
        ToolsDropdown.prototype.focusPrevListItem = function () {
            var prevItem;
            var toolsListItems = this.toolsList.children("li");
            var currentItem = this.toolsList.find("." + ToolsDropdown.focusedToolsListItemCssClass);
            if (currentItem.length === 0 || toolsListItems.first().hasClass(ToolsDropdown.focusedToolsListItemCssClass)) {
                prevItem = toolsListItems.last();
            }
            else {
                prevItem = currentItem.prev();
            }
            this.focus(prevItem);
        };
        ToolsDropdown.prototype.focus = function (itemToFocus) {
            if (!Object.isNullOrUndefined(this.currentItem)) {
                this.currentItem.removeClass(ToolsDropdown.focusedToolsListItemCssClass);
            }
            itemToFocus.addClass(ToolsDropdown.focusedToolsListItemCssClass);
            this.currentItem = itemToFocus;
            itemToFocus.find("button").focus().focusin();
        };
        ToolsDropdown.prototype.onToolItemChanged = function (buttonItem, listItem, blockType) {
            var toolIndex = parseInt(buttonItem.attr("tool-index"));
            var block = this.getBlock(toolIndex, blockType);
            if (!Object.isNullOrUndefined(block)) {
                this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerAddStart, new Editor.DesignerAddStartEventArgs(block));
            }
            this.closeToolsList();
        };
        ToolsDropdown.prototype.toggleDropdownButton = function () {
            if (this.plusButton.hasClass(Editor.CommonConstants.selectedToolsDropdownCssClass)) {
                this.closeToolsList();
            }
            else {
                this.plusButton.addClass(Editor.CommonConstants.selectedToolsDropdownCssClass);
                this.plusButton.attr(Editor.AriaAttributeNames.ariaExpanded, "true");
                this.toolsList.show();
                this.focusNextListItem();
            }
        };
        ToolsDropdown.prototype.closeToolsList = function () {
            this.plusButton.removeClass(Editor.CommonConstants.selectedToolsDropdownCssClass);
            this.plusButton.attr(Editor.AriaAttributeNames.ariaExpanded, "false");
            this.toolsList.hide();
            this.resetDropdown();
        };
        ToolsDropdown.prototype.getBlock = function (toolIndex, toolType) {
            if (toolIndex >= this.renderedTools.length) {
                return null;
            }
            var selectedTool = this.renderedTools[toolIndex];
            if (Object.isNullOrUndefined(selectedTool)) {
                return null;
            }
            var blockDefinition = this.toolBlockMapping.get(toolType);
            if (Object.isNullOrUndefined(blockDefinition)) {
                return null;
            }
            var block = $("<div>").attr(Editor.Contract.blockTypeAttrName, blockDefinition.getType());
            var contentTransformation = selectedTool.getContentTransformation();
            block.append(contentTransformation);
            return block;
        };
        ToolsDropdown.prototype.resetDropdown = function () {
            if (!Object.isNullOrUndefined(this.currentItem)) {
                this.currentItem.removeClass(ToolsDropdown.focusedToolsListItemCssClass);
                this.currentItem = null;
            }
        };
        ToolsDropdown.prototype.createPlusButton = function () {
            var plusButton = $("<button>")
                .attr("id", UniqueId.generate(this.toolsDropdownButton.getLabel()))
                .attr("type", this.toolsDropdownButton.getType())
                .attr("aria-label", this.toolsDropdownButton.getTitle())
                .attr("title", this.toolsDropdownButton.getTitle())
                .addClass(Editor.CommonConstants.toolbarButtonCssClass)
                .addClass(this.toolsDropdownButton.getClass());
            ToolsDropdown.plusButtonAccasibilityAttributes.forEach(function (attribute) {
                plusButton.attr(attribute[0], attribute[1]);
            });
            var plusButtonSymbol = $("<span>").addClass(this.toolsDropdownButton.getButtonImageClass()).addClass(Editor.CommonConstants.editorFontCssClass);
            plusButton.append(plusButtonSymbol);
            return plusButton;
        };
        ToolsDropdown.prototype.createToolsList = function () {
            var _this = this;
            var toolsList = $("<ul>")
                .addClass(ToolsDropdown.toolsListCssClass)
                .attr("role", "menu")
                .append($("<span>")
                .addClass(ToolsDropdown.toolsListTitleCssClass)
                .text(Editor.CommonUtils.getLocalizedString(this.defaultValueText)));
            this.renderedTools = [];
            this.tools.items().forEach(function (tool, i) {
                var listItem = $("<li>")
                    .addClass(ToolsDropdown.toolsListItemCssClass)
                    .attr("role", "none");
                var buttonItem = $("<button>")
                    .attr("data-type", tool.getType())
                    .attr("type", Editor.CommonConstants.buttonType)
                    .attr("title", tool.getLabel())
                    .attr("tool-index", i.toString())
                    .attr("role", "menuitem")
                    .addClass(tool.getCssClass())
                    .text(tool.getLabel())
                    .on("click", function () {
                    _this.onToolItemChanged(buttonItem, listItem, tool.getType());
                });
                listItem.append(buttonItem);
                toolsList.append(listItem);
                _this.renderedTools.push(tool);
            });
            return toolsList;
        };
        ToolsDropdown.prototype.tabsStateUpdated = function () {
            if (Editor.CommonUtils.isVisible(Editor.CommonUtils.getByClass(Editor.CommonConstants.designerTabContentClassName))) {
                this.toolsDropdownContainer.show();
            }
            else {
                this.toolsDropdownContainer.hide();
            }
        };
        ToolsDropdown.prototype.deactivate = function () { };
        ToolsDropdown.prototype.dispose = function () {
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerAddEnd, this.onDesignerAddEnd);
            this.eventBroker.unsubscribe(Editor.TabControlEventConstants.tabsStateUpdated, this.onTabsStateUpdated);
            this.toolsDropdownContainer.remove();
        };
        ToolsDropdown.toolsListCssClass = "toolsList";
        ToolsDropdown.toolsListTitleCssClass = "toolsListTitle";
        ToolsDropdown.toolsListItemCssClass = "toolsListItem";
        ToolsDropdown.focusedToolsListItemCssClass = "focusedToolsListItem";
        ToolsDropdown.plusButtonAccasibilityAttributes = [[Editor.AriaAttributeNames.ariaExpanded, "false"], [Editor.AriaAttributeNames.hasPopup, "true"]];
        return ToolsDropdown;
    }(Editor.Control));
    Editor.ToolsDropdown = ToolsDropdown;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var EventBroker = MktSvc.Controls.Common.EventBroker;
    var ArrayQuery = MktSvc.Controls.Common.ArrayQuery;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var KeyboardCommandManager = MktSvc.Controls.Common.KeyboardCommandManager;
    var EditorControlFactory = /** @class */ (function () {
        function EditorControlFactory() {
        }
        EditorControlFactory.prototype.create = function (plugin, executionContext) {
            Editor.CommonUtils.localizationProvider = executionContext.getLocalizationProvider();
            var eventBroker = new EventBroker(executionContext.getLogger());
            var blockDefinition = new Editor.BlockDefinitionFactory().create(plugin);
            var keyboardCommandManager = new KeyboardCommandManager();
            var tools = new ArrayQuery(plugin.getTools());
            var toolBlockMapping = plugin.getToolBlockMapping();
            var sections = plugin.getSections ? new ArrayQuery(plugin.getSections()) : null;
            var sectionToToolsMapping = plugin.getSectionToolsMapping ? plugin.getSectionToolsMapping() : null;
            var accessibilityInstructionsPopup = new Editor.AccessibilityInstructionsPopup(executionContext.getLogger());
            var controlToTabItemConverter = new Editor.ControlToTabItemConverter(eventBroker);
            var focusManagerFactory = new Editor.FocusManagerFactory();
            var designerFocusManager = focusManagerFactory
                .create(eventBroker, Editor.EventConstants.onElementFocusedIn, Editor.EventConstants.onKeypressToFocusPreviousElementCalled);
            var designerContentEditor = new Editor.DesignerContentEditorFactory()
                .create(plugin, executionContext, eventBroker, designerFocusManager, keyboardCommandManager, blockDefinition);
            var keyboardAccessibilityManager = new Editor.KeyboardAccessibilityManager();
            var fullPageContentEditor = new Editor.FullPageContentEditorFactory()
                .create(plugin, executionContext, eventBroker, keyboardCommandManager);
            var toolboxView = new Editor.ToolboxView(UniqueId.generate("toolboxId"), tools, toolBlockMapping, keyboardAccessibilityManager, keyboardCommandManager, executionContext, sections, sectionToToolsMapping);
            var detailsView = new Editor.DetailsView(UniqueId.generate("detailsViewId"), plugin.getBlockDetailsViewMapping(), keyboardCommandManager);
            var browserPreviewView = new Editor.BrowserPreviewFactory()
                .create(UniqueId.generate("browserPreviewViewId"), true, keyboardCommandManager, executionContext);
            var menuBarView = new Editor.MenuBarView(UniqueId.generate("menuBarViewId"), new ArrayQuery([
                new Editor.UndoButton(UniqueId.generate("undoButtonId")),
                new Editor.RedoButton(UniqueId.generate("redoButtonId")),
                new Editor.ToolsDropdown(UniqueId.generate("toolsDropdownId"), new Editor.AddToolsDropdownButton(), tools, toolBlockMapping),
                new Editor.MaximizeButton(UniqueId.generate("maximizeButtonId"))
            ]), keyboardCommandManager);
            var detailsViewFactory = new Editor.DetailsViewControlFactory();
            var stylesView = new Editor.StylesView(UniqueId.generate("stylesViewId"), detailsViewFactory.create(), new Editor.MetadataFieldRendererFactory(plugin.getBlockDetailsViewMapping(), detailsViewFactory.create()), keyboardCommandManager);
            var htmlContentEditor = new Editor.HtmlContentEditorFactory().create(keyboardCommandManager, executionContext);
            var layoutRenderer = new Editor.LayoutRenderer();
            var designerEditorLayout = new Editor.LayoutConfiguration();
            designerEditorLayout.cssClass = Editor.CommonConstants.designerTabContentClassName;
            var fullPageEditorLayout = new Editor.LayoutConfiguration();
            fullPageEditorLayout.cssClass = Editor.CommonConstants.fullPageContentEditorcssClass;
            var previewLayout = new Editor.LayoutConfiguration();
            previewLayout.cssClass = Editor.CommonConstants.previewTabControlCssClass;
            var layout = new Editor.LayoutConfiguration();
            layout.cssClass = Editor.CommonConstants.editorContainerCssClass;
            var menuBarControlLayout = new Editor.LayoutConfiguration();
            menuBarControlLayout.cssClass = Editor.CommonConstants.menuBarControlCssClass;
            var designerTabButtonViewLayout = new Editor.ComponentLayoutConfiguration();
            designerTabButtonViewLayout.cssClass = Editor.CommonConstants.designerTabButtonViewCssClass;
            designerTabButtonViewLayout.id = UniqueId.generate("designerTabButtonView");
            var previewTabButtonViewLayout = new Editor.ComponentLayoutConfiguration();
            previewTabButtonViewLayout.cssClass = Editor.CommonConstants.previewTabButtonViewCssClass;
            previewTabButtonViewLayout.id = UniqueId.generate("previewTabButtonView");
            var menuBarLayout = new Editor.ComponentLayoutConfiguration();
            menuBarLayout.id = menuBarView.id;
            menuBarLayout.cssClass = Editor.CommonConstants.menuBarCssClass;
            var designerLayout = new Editor.ComponentLayoutConfiguration();
            designerLayout.id = designerContentEditor.id;
            designerLayout.cssClass = Editor.CommonConstants.designerControlCssClass;
            var designerTabView = new Editor.TabControl(UniqueId.generate("designerTabView"), new ArrayQuery([
                controlToTabItemConverter.convert(toolboxView, Editor.CommonUtils.getLocalizedString("[TOOLBOX]"), Editor.CommonConstants.toolboxTabContentClassName),
                controlToTabItemConverter.convert(detailsView, Editor.CommonUtils.getLocalizedString("[PROPERTIES]"), Editor.CommonConstants.detailsTabContentClassName),
                controlToTabItemConverter.convert(stylesView, Editor.CommonUtils.getLocalizedString("[STYLES]"), Editor.CommonConstants.stylesTabContentClassName)
            ]), executionContext, designerTabButtonViewLayout.id, null, false);
            var previewTabView = new Editor.TabControl(UniqueId.generate("previewTabView"), new ArrayQuery([
                controlToTabItemConverter.convert(browserPreviewView, Editor.CommonUtils.getLocalizedString("[BASICPREVIEW]"), Editor.CommonConstants.browserPreviewTabContentClassName)
            ]), executionContext, previewTabButtonViewLayout.id);
            var designerTabViewLayout = new Editor.ComponentLayoutConfiguration();
            designerTabViewLayout.cssClass = Editor.CommonConstants.designerTabViewCssClass;
            designerTabViewLayout.id = designerTabView.id;
            designerEditorLayout.components = new ArrayQuery([
                new ArrayQuery([designerLayout, designerTabButtonViewLayout, designerTabViewLayout])
            ]);
            var previewViewLayout = new Editor.ComponentLayoutConfiguration();
            previewViewLayout.id = previewTabView.id;
            previewViewLayout.cssClass = Editor.CommonConstants.previewViewClassName;
            previewLayout.components = new ArrayQuery([
                new ArrayQuery([previewTabButtonViewLayout]), new ArrayQuery([previewViewLayout])
            ]);
            var designerEditor = new Editor.ComposeControl(UniqueId.generate("designerContentEditor"), new ArrayQuery([designerContentEditor, designerTabView]), layoutRenderer, designerEditorLayout);
            var previewView = new Editor.ComposeControl(UniqueId.generate("previewView"), new ArrayQuery([previewTabView]), layoutRenderer, previewLayout);
            menuBarControlLayout.components = new ArrayQuery([new ArrayQuery([menuBarLayout])]);
            var menuBarControl = new Editor.ComposeControl(UniqueId.generate("menuBarControl"), new ArrayQuery([menuBarView]), layoutRenderer, menuBarControlLayout);
            var designerTab = new Editor.TabControlItem(Editor.CommonUtils.getLocalizedString("[DESIGNER]"), designerEditor.id, function () { return designerEditor.init(eventBroker); }, function () { return designerEditor.activate(); }, function () { return designerEditor.deactivate(); }, function () { return designerEditor.dispose(); }, Editor.CommonConstants.designerTabContentClassName);
            var fullPageTab = new Editor.TabControlItem(Editor.CommonUtils.getLocalizedString("[FULL PAGE]"), fullPageContentEditor.id, function () { return fullPageContentEditor.init(eventBroker); }, function () { return fullPageContentEditor.activate(); }, function () { return fullPageContentEditor.deactivate(); }, function () { return fullPageContentEditor.dispose(); }, Editor.CommonConstants.fullPageContentEditorcssClass);
            var tabVisibilityManager = new Editor.TabControlVisibilityManager(new MktSvc.Controls.Common.ArrayQuery([
                new Editor.DesignerTabItemVisibility(designerTab), new Editor.FullPageTabItemVisibility(fullPageTab)
            ]), eventBroker);
            var contentEditorTabControl = new Editor.TabControl(UniqueId.generate("contentEditorTab"), new ArrayQuery([
                designerTab,
                fullPageTab,
                controlToTabItemConverter.convert(htmlContentEditor, Editor.CommonUtils.getLocalizedString("[HTML]"), Editor.CommonConstants.htmlTabContentClassName),
                controlToTabItemConverter.convert(previewView, Editor.CommonUtils.getLocalizedString("[PREVIEW]"), Editor.CommonConstants.previewViewClassName)
            ]), executionContext, menuBarView.id, tabVisibilityManager);
            var conentEditorLayout = new Editor.ComponentLayoutConfiguration();
            conentEditorLayout.id = contentEditorTabControl.id;
            conentEditorLayout.cssClass = Editor.CommonConstants.contentEditorCssClass;
            layout.components = new ArrayQuery([
                new ArrayQuery([menuBarLayout]), new ArrayQuery([conentEditorLayout])
            ]);
            var documentContentModel = new Editor.DocumentContentModel(executionContext, new Editor.MetadataParser(executionContext), eventBroker, new ArrayQuery([
                new Editor.SetOrphanBlockContainerWrapContentModelProcessor(),
                new Editor.SetContainerIdContentModelProcessor(),
                new Editor.SetBlockIdContentModelProcessor(),
                new Editor.TableDecoratorContentModelProcessor(),
                new Editor.AddTextBreakContentModelProcessor()
            ]), new ArrayQuery([
                new Editor.RemoveContainerIdContentModelProcessor(),
                new Editor.RemoveBlockIdContentModelProcessor()
            ]));
            return new Editor.EditorControl(executionContext, layoutRenderer, layout, new ArrayQuery([contentEditorTabControl, menuBarControl]), eventBroker, documentContentModel, keyboardCommandManager, new Editor.UndoRedoManager(), accessibilityInstructionsPopup);
        };
        return EditorControlFactory;
    }());
    Editor.EditorControlFactory = EditorControlFactory;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BasicPluginFactory = /** @class */ (function () {
        function BasicPluginFactory() {
        }
        BasicPluginFactory.prototype.create = function (imagePicker) {
            return new Editor.BasicPlugin(imagePicker);
        };
        return BasicPluginFactory;
    }());
    Editor.BasicPluginFactory = BasicPluginFactory;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var LoadingModal = MktSvc.Controls.Common.LoadingModal;
    var BrowserPreviewFactory = /** @class */ (function () {
        function BrowserPreviewFactory() {
        }
        BrowserPreviewFactory.prototype.create = function (previewId, showHeader, keyboardCommandManager, executionContext, defaultIcon, isOffline, accessibilityInstructions) {
            Editor.CommonUtils.localizationProvider = executionContext.getLocalizationProvider();
            var loadingModal = new LoadingModal();
            if (isOffline) {
                return new Editor.OfflineBrowserPreviewView(previewId, executionContext);
            }
            return new Editor.BrowserPreviewView(previewId, showHeader, loadingModal, keyboardCommandManager, executionContext, null, defaultIcon, accessibilityInstructions);
        };
        return BrowserPreviewFactory;
    }());
    Editor.BrowserPreviewFactory = BrowserPreviewFactory;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var DetailsViewControlFactory = /** @class */ (function () {
        function DetailsViewControlFactory() {
        }
        DetailsViewControlFactory.prototype.create = function () {
            var sectionRenderer = new Editor.SectionRenderer();
            var inputFieldRenderer = new Editor.InputFieldRenderer();
            var lookupContainerRenderer = new Editor.LookupContainerRenderer();
            var inputColorFieldRenderer = new Editor.InputColorFieldRenderer(inputFieldRenderer);
            var dropdownListRenderer = new Editor.DropdownListRenderer();
            var linkFieldRenderer = new Editor.LinkFieldRenderer(inputFieldRenderer);
            var imageFieldRenderer = new Editor.InputImageFieldRenderer(inputFieldRenderer);
            var ignoreChangesWhileInputStrategy = new Editor.IgnoreChangesWhileInputStrategy();
            return new Editor.DetailsViewControl(sectionRenderer, inputFieldRenderer, inputColorFieldRenderer, lookupContainerRenderer, dropdownListRenderer, linkFieldRenderer, imageFieldRenderer, ignoreChangesWhileInputStrategy);
        };
        return DetailsViewControlFactory;
    }());
    Editor.DetailsViewControlFactory = DetailsViewControlFactory;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var DelayScheduler = MktSvc.Controls.Common.DelayScheduler;
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var KeyboardCommand = MktSvc.Controls.Common.KeyboardCommand;
    var KeyboardKeyCodes = MktSvc.Controls.Common.KeyboardKeyCodes;
    var KeyboardModifierType = MktSvc.Controls.Common.KeyboardModifierType;
    var HtmlContentEditor = /** @class */ (function (_super) {
        __extends(HtmlContentEditor, _super);
        /**
        * Creates the content editor.
        * @param containerId - An id of a container in which the content editor should be placed.
        * @param eventBroker - A content editor can raise events and subscribe to events using this class.
        */
        function HtmlContentEditor(containerId, loadingModal, localeProvider, keyboardCommandManager, executionContext, htmlChangedEventName, monacoCustomSettings) {
            if (htmlChangedEventName === void 0) { htmlChangedEventName = Editor.EventConstants.contentModelUpdated; }
            if (monacoCustomSettings === void 0) { monacoCustomSettings = null; }
            var _this = _super.call(this, containerId) || this;
            _this.html = String.Empty;
            _this.monacoVsPath = "Monaco/vs";
            _this.monacoExtendedCss = "css/monaco.extend.css";
            _this.decorations = [];
            _this.iframe = null;
            _this.defaultTheme = "vs";
            _this.highContrastTheme = "hc-black";
            _this.placeholderKeyCode = 229;
            _this.contentChangedDelay = 2000;
            _this.warningDisplayed = false;
            _this.dataProtectedHighlightTag = "div";
            _this.onContentModelUpdated = function (eventArgs) {
                var newContent = eventArgs.html;
                if (_this.html !== newContent && eventArgs.originalSourceId !== _this.id && eventArgs.sourceId !== _this.id) {
                    _this.setContent(newContent);
                }
            };
            _this.onEditorVisibilityChanged = function () {
                _this.resizeEditor();
            };
            _this.onMaximizeExecuted = function () {
                $(window).one("animationstart", _this.onAnimationStart);
                $(window).one("animationend", _this.onAnimationEnd);
                _this.resizeTimer.schedule();
            };
            _this.onAnimationStart = function (e) {
                if ($(e.target).find("#" + _this.id).length) {
                    _this.resizeTimer.stop(true);
                }
            };
            _this.onAnimationEnd = function (e) {
                if ($(e.target).find("#" + _this.id).length) {
                    _this.resizeTimer.stop(true);
                    _this.resizeEditor();
                }
            };
            _this.keyboardCommandManager = keyboardCommandManager;
            _this.executionContext = executionContext;
            _this.basePath = _this.executionContext.getLibsPath();
            _this.localeProvider = localeProvider;
            _this.loadingModal = loadingModal;
            _this.htmlChangedEventName = htmlChangedEventName;
            _this.settings = monacoCustomSettings;
            var attributes = [Editor.Contract.dataProtectedAttrName + "=\"true\"", Editor.Contract.blockTypeAttrName];
            _this.htmlContentHightlightParser = new Editor.HtmlContentHighlightParser(_this.dataProtectedHighlightTag, attributes);
            return _this;
        }
        /**
         * Initializes the designer editor.
         * @param containerId - The id of the conainer in which the desinger editor will be rendered.
         */
        HtmlContentEditor.prototype.init = function (eventBroker) {
            var _this = this;
            if (this.executionContext.getCustomizations().HTMLEditor) {
                this.eventBroker = eventBroker;
                this.eventBroker.subscribe(this.htmlChangedEventName, this.onContentModelUpdated);
                this.eventBroker.subscribe(Editor.EventConstants.editorVisibilityChanged, this.onEditorVisibilityChanged);
                this.eventBroker.subscribe(Editor.EventConstants.maximizeExecuted, this.onMaximizeExecuted);
                this.changeTimer = new DelayScheduler(this.eventBroker);
                this.changeTimer.init(function () {
                    var currentValue = Object.isNullOrUndefined(_this.editor) ? String.Empty : _this.editor.getValue();
                    if (_this.html !== currentValue) {
                        _this.html = currentValue;
                        _this.broadcastContentChanged();
                    }
                }, this.contentChangedDelay);
                this.resizeTimer = new DelayScheduler(this.eventBroker);
                this.resizeTimer.init(function () {
                    $(window).off("animationstart", _this.onAnimationStart);
                    $(window).off("animationend", _this.onAnimationEnd);
                    _this.resizeEditor();
                });
                this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.twoKey, [KeyboardModifierType.Alt], function () {
                    $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.tabButtonPreClassName +
                        Editor.CommonConstants.htmlTabContentClassName)).focus().click();
                }));
            }
        };
        HtmlContentEditor.prototype.activate = function () {
            _super.prototype.activate.call(this);
            this.render();
            Editor.AccessibilityInstructionsPopup.accessibilityInstructions = Editor.EditorAccessibilityInstructions.baseControlAccessibilityInstructions;
        };
        HtmlContentEditor.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            this.changeTimer.stop();
        };
        /**
         * Sets the new editor content
         * @param content - The content to set in the editor
         */
        HtmlContentEditor.prototype.setContent = function (content) {
            if (this.changeTimer.isRunning()) {
                return;
            }
            this.html = content;
            if (!this.isActive) {
                return;
            }
            this.render();
        };
        HtmlContentEditor.prototype.mapToMonacoRange = function (offsetRange) {
            var model = this.editor.getModel();
            var start = model.getPositionAt(offsetRange.startPos);
            var end = model.getPositionAt(offsetRange.endPos);
            return new this.iframe.contentWindow.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column);
        };
        HtmlContentEditor.prototype.offsetToHighlights = function (offsets) {
            var _this = this;
            var options = { inlineClassName: "protectedInlineDecoration" };
            var ranges = offsets.map(function (value) {
                return {
                    options: options,
                    range: _this.mapToMonacoRange(value)
                };
            });
            this.decorations = this.editor.deltaDecorations(this.decorations, ranges);
        };
        HtmlContentEditor.prototype.clearHighlights = function () {
            this.decorations = this.editor.deltaDecorations(this.decorations, [{ range: new this.iframe.contentWindow.monaco.Range(1, 1, 1, 1), options: {} }]);
        };
        HtmlContentEditor.prototype.highlightContent = function (html) {
            var offsets = this.htmlContentHightlightParser.searchHighlights(html);
            if (offsets.length > 0) {
                this.offsetToHighlights(offsets);
                this.setWarningMessage(true);
            }
            else {
                this.clearHighlights();
                this.setWarningMessage(false);
            }
        };
        /**
         * Gets the content rendered in the ui.
         */
        HtmlContentEditor.prototype.getContent = function () {
            return this.html;
        };
        HtmlContentEditor.prototype.setWarningMessage = function (display) {
            if (display && !this.warningDisplayed) {
                $("#" + Editor.CommonConstants.htmlWarningMessageId).show();
                $("#" + Editor.CommonConstants.htmlWarningMessageId).children("div").text(Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.htmlWarningMessageLabel));
                this.warningDisplayed = true;
                this.resizeEditor();
            }
            else if (!display && this.warningDisplayed) {
                $("#" + Editor.CommonConstants.htmlWarningMessageId).hide();
                $("#" + Editor.CommonConstants.htmlWarningMessageId).children("div").text();
                this.warningDisplayed = false;
                this.resizeEditor();
            }
        };
        HtmlContentEditor.prototype.render = function () {
            if (!this.executionContext.getCustomizations().HTMLEditor) {
                var element = this.getElement();
                element.empty();
                var disabledMessage = $("<div>")
                    .text(Editor.CommonUtils.getLocalizedString("No html"))
                    .addClass(Editor.CommonConstants.htmlEditorNotSupportedMessageClassName);
                element.append(disabledMessage);
            }
            else if (Object.isNullOrUndefined(this.editor) && !this.monacoEditorIsLoading) {
                this.initializeMonacoStructure();
            }
            else if (!Object.isNullOrUndefined(this.editor)) {
                this.editor.setValue(this.html);
                this.resizeEditor();
                this.highlightContent(this.html);
                this.eventBroker.notify(Editor.EventConstants.controlRendered, new Editor.ControlRenderedEventArgs(this.id));
                this.eventBroker.notify(Editor.HtmlContentEditorInternalEventConstants.monacoEditorValueSet, new Editor.ControlRenderedEventArgs(this.id));
            }
        };
        HtmlContentEditor.prototype.initializeMonacoStructure = function () {
            var _this = this;
            var element = this.getElement();
            element.empty();
            this.iframe = this.createIFrameForEditor(element);
            this.monacoEditorIsLoading = true;
            this.loadingModal.init(element, this.eventBroker);
            this.loadingModal.show();
            if (!Object.isNullOrUndefined(this.basePath)) {
                var monacoLoaderScript = Editor.CommonUtils.createScriptElementFromUrl("html-editor-dependency-monaco", this.basePath + "/" + this.monacoVsPath + "/loader.js", this.iframe.contentDocument);
                monacoLoaderScript.onload = function () {
                    _this.executionContext.tryExecute(function () {
                        _this.iframe.contentWindow.require.config({
                            paths: {
                                vs: String.Format("{0}/{1}", _this.basePath, _this.monacoVsPath)
                            },
                            "vs/nls": {
                                availableLanguages: {
                                    "*": _this.localeProvider.getLanguageCode()
                                }
                            }
                        });
                        _this.createMonaco();
                    }, "Render the Html editor", true);
                };
                var monacoLoaderCss = Editor.CommonUtils.createLinkElementFromUrl("monaco-extend-style", this.executionContext.getBasePath() + "/" + this.monacoExtendedCss, this.iframe.contentDocument);
                this.iframe.contentDocument.head.appendChild(monacoLoaderScript);
                this.iframe.contentDocument.head.appendChild(monacoLoaderCss);
                this.keyboardCommandManager.registerCommandsInIframe(this.iframe);
            }
            var warningMessage = $("\n                <div>\n                    <span class=\"CCFSymbolFont fontIconSize\" draggable=\"false\" role=\"presentation\"></span>\n                    <div role=\"status\" aria-live=\"polite\"></div>\n                </div>");
            warningMessage.hide();
            warningMessage.attr("id", Editor.CommonConstants.htmlWarningMessageId);
            element.prepend(warningMessage);
            this.eventBroker.notify(Editor.EventConstants.controlRendered, new Editor.ControlRenderedEventArgs(this.id));
        };
        HtmlContentEditor.prototype.createMonaco = function () {
            var _this = this;
            var editorDimensions = this.getEditorDimensions(this.iframe);
            var div = $("<div />");
            div.attr("style", "width: 100%; height: 100%; min-height: " + editorDimensions.height + "px; overflow: hidden;");
            this.iframe.contentWindow.document.body.appendChild(div[0]);
            this.iframe.contentWindow.require(["vs/editor/editor.main"], function () {
                _this.executionContext.tryExecute(function () {
                    _this.editor = _this.iframe.contentWindow.monaco.editor.create(div[0], _this.getMonacoSettings());
                    _this.editor.layout(editorDimensions);
                    _this.editor.onDidChangeModelContent(function () { _this.changeTimer.schedule(); });
                    _this.highlightContent(_this.editor.getModel().getValue());
                    _this.monacoEditorIsLoading = false;
                    _this.loadingModal.hide();
                    // Workaround for the issue https://github.com/Microsoft/monaco-editor/issues/563 - unable to remove text on android
                    $(_this.iframe.contentWindow.document).on("keyup", function (event) {
                        if (event.keyCode === _this.placeholderKeyCode || event.which === _this.placeholderKeyCode) {
                            var initialValue_1 = event.target.value;
                            $(event.target).one("input", function (event) {
                                var currentValue = event.target.value;
                                // Use null/undefined verification, because empty string is acceptable value
                                if (!Object.isNullOrUndefined(initialValue_1) && !Object.isNullOrUndefined(currentValue) && currentValue.length < initialValue_1.length) {
                                    // Trigger native event with correct key code for monaco editor
                                    var keyEvent = _this.iframe.contentWindow.document.createEvent("Event");
                                    keyEvent.initEvent("keydown", true, true);
                                    keyEvent["keyCode"] = keyEvent["keyChar"] = keyEvent["which"] = KeyboardKeyCodes.backspaceKey;
                                    event.target.dispatchEvent(keyEvent);
                                }
                            });
                        }
                    });
                    // Workaround for the issue https://github.com/Microsoft/monaco-editor/issues/643 - Can't remove/add symbols inside the editor in IFrame (Firefox 57+)
                    if (Editor.CommonUtils.isFirefox()) {
                        $(_this.iframe.contentWindow.document).on("click", function () {
                            var activeElement = $(document.activeElement);
                            if (!activeElement.is($(_this.iframe))) {
                                activeElement.blur();
                                $(_this.iframe).focus();
                            }
                        });
                    }
                    _this.eventBroker.notify(Editor.HtmlContentEditorInternalEventConstants.monacoEditorCreated, new Editor.MonacoEditorCreatedEventArgs(_this.editor));
                }, "Create the Monaco editor", true);
            });
        };
        HtmlContentEditor.prototype.createIFrameForEditor = function (container) {
            var iframe = document.createElement("iframe");
            var $iframe = $(iframe);
            $iframe.addClass(Editor.CommonConstants.htmlContentEditorFrame)
                .addClass(Editor.CommonConstants.layoutFrameClassName)
                .attr("role", "presentation");
            container.append(iframe);
            var idocument = iframe.contentDocument;
            idocument.open();
            idocument.write("<!DOCTYPE html>");
            idocument.write('<html lang="' + this.executionContext.getLocalizationProvider().getLanguageName() + '">');
            idocument.write("<head></head>");
            idocument.write('<body style="margin-top: 0; margin-bottom: 0; overflow: hidden;"></body>');
            idocument.close();
            return iframe;
        };
        HtmlContentEditor.prototype.resizeEditor = function () {
            if (!Object.isNullOrUndefined(this.editor) && !Object.isNullOrUndefined(this.iframe) && Editor.CommonUtils.isVisible($(this.iframe))) {
                this.editor.layout(this.getEditorDimensions(this.iframe));
            }
        };
        HtmlContentEditor.prototype.getEditorDimensions = function (iframe) {
            var editorPadding = 20;
            var warningPadding = 5;
            var warningOffset = this.warningDisplayed ? $("#" + Editor.CommonConstants.htmlWarningMessageId).height() + warningPadding : 0;
            return {
                height: $(iframe).parent().height() - editorPadding - warningOffset,
                width: $(iframe).parent().width() - editorPadding
            };
        };
        HtmlContentEditor.prototype.broadcastContentChanged = function () {
            var eventArgs = new Editor.ContentChangedEventArgs(this.html, this.id, null, Editor.CommonConstants.htmlEditorComponentName);
            this.highlightContent(this.html);
            this.eventBroker.notify(Editor.EventConstants.contentChanged, eventArgs);
        };
        HtmlContentEditor.prototype.getMonacoSettings = function () {
            var monacoSettings = {
                value: this.html,
                language: "html",
                wrappingColumn: 0,
                scrollBeyondLastLine: false,
                theme: Editor.CommonUtils.isHighContrastModeEnabled() ? this.highContrastTheme : this.defaultTheme,
                minimap: {
                    enabled: false
                }
            };
            if (!Object.isNullOrUndefined(this.settings)) {
                for (var setting in this.settings) {
                    monacoSettings[setting] = this.settings[setting];
                }
            }
            return monacoSettings;
        };
        HtmlContentEditor.prototype.dispose = function () {
            var _this = this;
            this.executionContext.tryExecute(function () {
                _this.changeTimer.stop();
                _this.resizeTimer.stop();
                if (_this.editor) {
                    _this.loadingModal.dispose();
                    _this.loadingModal = null;
                    _this.editor.dispose();
                    _this.editor = null;
                }
                _this.getElement().empty();
                _this.monacoEditorIsLoading = false;
                if (_this.changeTimer) {
                    _this.changeTimer.dispose();
                    _this.changeTimer = null;
                }
                if (_this.resizeTimer) {
                    _this.resizeTimer.dispose();
                    _this.resizeTimer = null;
                }
                _this.keyboardCommandManager.unregisterCommandsInIframe(_this.iframe);
                $(_this.iframe).remove();
                _this.iframe = null;
                _this.keyboardCommandManager = null;
                _this.eventBroker.unsubscribe(Editor.EventConstants.maximizeExecuted, _this.onMaximizeExecuted);
                _this.eventBroker.unsubscribe(Editor.EventConstants.editorVisibilityChanged, _this.onEditorVisibilityChanged);
                _this.eventBroker.unsubscribe(Editor.EventConstants.contentModelInitialized, _this.onContentModelUpdated);
                _this.eventBroker = null;
            }, "Dispose the Html editor");
        };
        return HtmlContentEditor;
    }(Editor.Control));
    Editor.HtmlContentEditor = HtmlContentEditor;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var HtmlContentHighlightParser = /** @class */ (function () {
        function HtmlContentHighlightParser(tag, attributes) {
            this.fixTagPos = 2;
            this.openTag = "<" + tag;
            this.blockSize = this.openTag.length;
            this.closedTag = "</" + tag.substring(0, tag.length - 1);
            this.attributes = attributes;
            this.dicSequences = {};
        }
        HtmlContentHighlightParser.prototype.findClosingTagForHighlight = function (str, pos) {
            var count = 1;
            for (var i = pos + this.blockSize; i < str.length; i++) {
                var chr = str.substring(i, i + this.blockSize);
                if (this.openTag === chr) {
                    count++;
                }
                else if (this.closedTag === chr) {
                    count--;
                }
                if (count === 0) {
                    return {
                        endPos: i + this.blockSize,
                        startPos: pos
                    };
                }
            }
            return null;
        };
        HtmlContentHighlightParser.prototype.searchHighlights = function (html) {
            var offsets = [];
            var offsetRange;
            var word;
            for (var i = 0; i < html.length; i++) {
                word = html.substring(i, i + this.blockSize);
                if (this.openTag === word && this.tagContainsAttribute(html, i + this.blockSize)) {
                    offsetRange = this.findClosingTagForHighlight(html, i);
                    i = offsetRange.endPos;
                    // fix element position in 2, because it has been removed at the begin.
                    offsetRange.endPos += this.fixTagPos;
                    offsets.push(offsetRange);
                }
            }
            return offsets;
        };
        HtmlContentHighlightParser.prototype.normalizeString = function (str) {
            return str.toLocaleLowerCase().replace(/'/g, "\"");
        };
        HtmlContentHighlightParser.prototype.tagContainsAttribute = function (html, pos) {
            var closeTagPos = html.indexOf(">", pos);
            if (closeTagPos === -1) {
                return false;
            }
            var tagSubstring = this.normalizeString(html.substring(pos, closeTagPos));
            if (!this.dicSequences[tagSubstring]) {
                this.dicSequences[tagSubstring] = this.validateSubstring(tagSubstring);
            }
            return this.dicSequences[tagSubstring];
        };
        HtmlContentHighlightParser.prototype.validateSubstring = function (tagSubstring) {
            for (var i = 0; i < this.attributes.length; i++) {
                var attributePos = tagSubstring.indexOf(this.attributes[i]);
                if (attributePos === -1) {
                    return false;
                }
            }
            return true;
        };
        return HtmlContentHighlightParser;
    }());
    Editor.HtmlContentHighlightParser = HtmlContentHighlightParser;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var HtmlNotSupportedView = /** @class */ (function (_super) {
        __extends(HtmlNotSupportedView, _super);
        function HtmlNotSupportedView(containerId) {
            var _this = _super.call(this, containerId) || this;
            _this.htmlEditorErrorMessage = "HTML mode not supported.";
            _this.id = containerId;
            return _this;
        }
        HtmlNotSupportedView.prototype.init = function () {
        };
        HtmlNotSupportedView.prototype.activate = function () {
            _super.prototype.activate.call(this);
            this.render();
            Editor.AccessibilityInstructionsPopup.accessibilityInstructions = Editor.EditorAccessibilityInstructions.baseControlAccessibilityInstructions;
        };
        HtmlNotSupportedView.prototype.dispose = function () {
            this.getElement().empty();
        };
        HtmlNotSupportedView.prototype.render = function () {
            if (this.isActive) {
                var element = this.getElement().empty();
                var offlineErrorMessageContainer = $("<p>")
                    .text(Editor.CommonUtils.getLocalizedString(this.htmlEditorErrorMessage))
                    .addClass(Editor.CommonConstants.htmlEditorNotSupportedMessageClassName);
                element.append(offlineErrorMessageContainer);
            }
        };
        return HtmlNotSupportedView;
    }(Editor.Control));
    Editor.HtmlNotSupportedView = HtmlNotSupportedView;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BasicTextInlineToolbar = /** @class */ (function () {
        function BasicTextInlineToolbar() {
        }
        BasicTextInlineToolbar.prototype.getName = function () {
            return "BasicTextInlineToolbar";
        };
        BasicTextInlineToolbar.prototype.getConfig = function () {
            return [
                ["Cut", "Copy", "Paste", "PasteFromWord", "PasteText"],
                ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"],
                ["Find", "Replace"],
                ["SelectAll"],
                ["BidiLtr", "BidiRtl"],
                ["Link", "Unlink", "Anchor"],
                ["NumberedList", "BulletedList"],
                ["HorizontalRule"],
                "/",
                ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript"],
                ["RemoveFormat"],
                ["Styles", "Font", "FontSize"],
                ["TextColor", "BGColor"],
                ["SpecialChar"],
                ["moveBlockBtn", "cloneBlockBtn", "deleteBlockBtn"]
            ];
        };
        return BasicTextInlineToolbar;
    }());
    Editor.BasicTextInlineToolbar = BasicTextInlineToolbar;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BasicButtonInlineToolbar = /** @class */ (function () {
        function BasicButtonInlineToolbar() {
        }
        BasicButtonInlineToolbar.prototype.getName = function () {
            return "BasicButtonInlineToolbar";
        };
        BasicButtonInlineToolbar.prototype.getConfig = function () {
            return [
                ["Font", "Styles", "FontSize"],
                ["TextColor", "BGColor"],
                ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"],
                ["BidiLtr", "BidiRtl"],
                ["moveBlockBtn", "cloneBlockBtn", "deleteBlockBtn"]
            ];
        };
        return BasicButtonInlineToolbar;
    }());
    Editor.BasicButtonInlineToolbar = BasicButtonInlineToolbar;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BasicImageInlineToolbar = /** @class */ (function () {
        function BasicImageInlineToolbar() {
        }
        BasicImageInlineToolbar.prototype.getName = function () {
            return "BasicImageToolbar";
        };
        BasicImageInlineToolbar.prototype.getConfig = function () {
            return [
                ["imgGalleryBtn"],
                ["moveBlockBtn", "cloneBlockBtn", "deleteBlockBtn"]
            ];
        };
        return BasicImageInlineToolbar;
    }());
    Editor.BasicImageInlineToolbar = BasicImageInlineToolbar;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BasicDividerInlineToolbar = /** @class */ (function () {
        function BasicDividerInlineToolbar() {
        }
        BasicDividerInlineToolbar.prototype.getName = function () {
            return "BasicDividerToolbar";
        };
        BasicDividerInlineToolbar.prototype.getConfig = function () {
            return [
                ["dividerHeightCombo"],
                ["dividerAlignLeftBtn", "dividerAlignCenterBtn", "dividerAlignRightBtn"],
                ["dividerBorderStyleCombo"],
                ["moveBlockBtn", "cloneBlockBtn", "deleteBlockBtn"]
            ];
        };
        return BasicDividerInlineToolbar;
    }());
    Editor.BasicDividerInlineToolbar = BasicDividerInlineToolbar;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var ProtectedDataBlockInlineToolbar = /** @class */ (function () {
        function ProtectedDataBlockInlineToolbar() {
        }
        ProtectedDataBlockInlineToolbar.prototype.getName = function () {
            return "ProtectedDataBlockInlineToolbar";
        };
        ProtectedDataBlockInlineToolbar.prototype.getConfig = function () {
            return [["deleteBlockBtn"]];
        };
        return ProtectedDataBlockInlineToolbar;
    }());
    Editor.ProtectedDataBlockInlineToolbar = ProtectedDataBlockInlineToolbar;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var ImageBlock = /** @class */ (function () {
        function ImageBlock(imagePlaceholderHelper) {
            this.inlineToolbar = new Editor.BasicImageInlineToolbar();
            if (Object.isNullOrUndefined(imagePlaceholderHelper)) {
                imagePlaceholderHelper = new Editor.ImagePlaceholderHelper(); // tslint:disable-line
            }
            this.imagePlaceholderHelper = imagePlaceholderHelper;
        }
        ImageBlock.prototype.getType = function () {
            return ImageBlock.type;
        };
        ImageBlock.prototype.usePlainText = function () {
            return false;
        };
        ImageBlock.prototype.isEditable = function () {
            return false;
        };
        ImageBlock.prototype.getInlineToolbar = function () {
            return this.inlineToolbar;
        };
        ImageBlock.prototype.setup = function (eventBroker) {
            var _this = this;
            this.eventBroker = eventBroker;
            if (Object.isNullOrUndefined(this.onImageSourceChanged)) {
                this.eventBroker.subscribe(Editor.EventConstants.imageAttributeChanged, this.onImageSourceChanged = function (eventArgs) { return _this.updateImageSource(eventArgs); });
            }
        };
        ImageBlock.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.eventBroker)) {
                this.eventBroker.unsubscribe(Editor.EventConstants.imageAttributeChanged, this.onImageSourceChanged);
                this.onImageSourceChanged = null;
            }
        };
        ImageBlock.prototype.isConfigured = function (block) {
            return this.imagePlaceholderHelper.isImageConfigured(this.getSource(block));
        };
        ImageBlock.prototype.decorate = function (block) {
            if (block.attr(Editor.Contract.blockTypeAttrName) === this.getType()) {
                var image = this.getImage(block);
                this.decorateDataSrcAttribute(image);
                this.decorateBlockOverlay(image);
                this.setAriaLabel(block);
            }
        };
        ImageBlock.prototype.setFinalContent = function (block) {
            if (this.imagePlaceholderHelper.isPlaceholderNeeded(this.getSource(block))) {
                Editor.CommonUtils.removeBlockOverlay(block);
            }
            this.getImage(block).removeAttr(Editor.CommonConstants.designerImageSourceAttributeName);
            block.removeAttr("aria-label");
        };
        ImageBlock.prototype.updateImageSource = function (eventArgs) {
            if (eventArgs.attributeName === Editor.CommonConstants.designerImageSourceAttributeName) {
                eventArgs.imageElement.attr("src", eventArgs.attributeValue);
                this.decorateDataSrcAttribute(eventArgs.imageElement);
                this.decorateBlockOverlay(eventArgs.imageElement);
                this.setAriaLabel(eventArgs.imageElement.closest("[" + Editor.Contract.blockTypeAttrName + "]"));
            }
        };
        ImageBlock.prototype.setAriaLabel = function (block) {
            var txt = "[" + (!this.isConfigured(block) ? "Unconfigured " : String.Empty) + block.attr(Editor.Contract.blockTypeAttrName) + " block]";
            var translatedText = Editor.CommonUtils.getLocalizedString(txt);
            var element = Editor.BlockProvider.getEditableElement(block);
            Editor.CommonUtils.setAriaAttribute(block, "aria-label", translatedText);
            Editor.CommonUtils.setAriaAttribute(element, "aria-label", translatedText);
            Editor.CommonUtils.setAriaAttribute(element, "title", translatedText);
        };
        ImageBlock.prototype.decorateDataSrcAttribute = function (image) {
            image.attr(Editor.CommonConstants.designerImageSourceAttributeName, image.attr("src"));
        };
        ImageBlock.prototype.getImage = function (block) {
            return block.find("img").not("." + Editor.CommonConstants.unconfiguredOverlayIconCssClassName);
        };
        ImageBlock.prototype.getBlock = function (image) {
            return new Editor.BlockProvider().getClosestBlock(image);
        };
        ImageBlock.prototype.getSource = function (block) {
            return this.getImage(block).attr("src");
        };
        ImageBlock.prototype.decorateBlockOverlay = function (image) {
            var block = this.getBlock(image);
            var element = image.parent();
            Editor.CommonUtils.removeBlockOverlay(block);
            if (this.imagePlaceholderHelper.isPlaceholderNeeded(this.getSource(block))) {
                Editor.CommonUtils.overlayBlockElement(element, image, this.imagePlaceholderHelper.getImagePlaceholder(this.getSource(block)));
            }
        };
        ImageBlock.type = "Image";
        return ImageBlock;
    }());
    Editor.ImageBlock = ImageBlock;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var TextBlock = /** @class */ (function () {
        function TextBlock(inlineToolbar, imagePlaceholderHelper) {
            if (Object.isNullOrUndefined(inlineToolbar)) {
                inlineToolbar = new Editor.BasicTextInlineToolbar(); // tslint:disable-line
            }
            this.inlineToolbar = inlineToolbar;
            if (Object.isNullOrUndefined(imagePlaceholderHelper)) {
                imagePlaceholderHelper = new Editor.ImagePlaceholderHelper(); // tslint:disable-line
            }
            this.imagePlaceholderHelper = imagePlaceholderHelper;
        }
        TextBlock.prototype.getType = function () {
            return TextBlock.type;
        };
        TextBlock.prototype.usePlainText = function () {
            return false;
        };
        TextBlock.prototype.isEditable = function () {
            return true;
        };
        TextBlock.prototype.getInlineToolbar = function () {
            return this.inlineToolbar;
        };
        TextBlock.prototype.setup = function (eventBroker) {
            var _this = this;
            this.eventBroker = eventBroker;
            if (Object.isNullOrUndefined(this.onImageSourceChanged)) {
                this.eventBroker.subscribe(Editor.EventConstants.imageAttributeChanged, this.onImageSourceChanged = function (eventArgs) { return _this.updateImageSource(eventArgs); });
            }
            if (Object.isNullOrUndefined(this.onSelectionChanged)) {
                this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.selectionChanged, this.onSelectionChanged = function (eventArgs) { return _this.updateAriaLabels(eventArgs); });
            }
        };
        TextBlock.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.eventBroker)) {
                this.eventBroker.unsubscribe(Editor.EventConstants.imageAttributeChanged, this.onImageSourceChanged);
                this.onImageSourceChanged = null;
                this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.selectionChanged, this.onSelectionChanged);
                this.onSelectionChanged = null;
            }
        };
        TextBlock.prototype.isConfigured = function (block) {
            return Editor.CommonUtils.getByClass(Editor.CommonConstants.designerUnconfiguredContentOverlayCssClassName, block).length === 0;
        };
        TextBlock.prototype.decorate = function (block) {
            var _this = this;
            var translatedLabel = Editor.CommonUtils.getLocalizedString("[" + block.attr(Editor.Contract.blockTypeAttrName) + " block]");
            Editor.CommonUtils.setAriaAttribute(block, "aria-label", translatedLabel);
            block.find("img").each(function (index, element) {
                var image = $(element);
                image.attr(Editor.CommonConstants.designerImageSourceAttributeName, image.attr("src"));
                _this.decorateImageOverlay(image, image.attr("src"));
            });
        };
        TextBlock.prototype.updateAriaLabels = function (eventArgs) {
            if (eventArgs.blockDefinition.getType() === this.getType()) {
                var wrapper = Editor.BlockProvider.getEditableElement(eventArgs.blockElement);
                wrapper.attr("aria-label", eventArgs.blockElement.attr("aria-label") + " " + eventArgs.blockElement.find("p").text().substr(0, 50)); // tslint:disable-line
            }
        };
        TextBlock.prototype.updateImageSource = function (eventArgs) {
            if (eventArgs.attributeName === Editor.CommonConstants.designerTextBlockImageSourceAttributeName) {
                eventArgs.imageElement.attr(Editor.CommonConstants.designerImageSourceAttributeName, eventArgs.attributeValue);
                this.decorateImageOverlay(eventArgs.imageElement, eventArgs.attributeValue);
            }
        };
        TextBlock.prototype.decorateImageOverlay = function (image, imageSrc) {
            if (this.imagePlaceholderHelper.isPlaceholderNeeded(imageSrc)) {
                Editor.CommonUtils.overlayImageElement(image, this.imagePlaceholderHelper.getImagePlaceholder(imageSrc));
            }
            else {
                Editor.CommonUtils.removeImageOverlay(image);
            }
        };
        TextBlock.prototype.setFinalContent = function (block) {
            var images = block.find("img");
            if (!this.isConfigured(block)) {
                var unconfiguredImages = images.filter(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.designerUnconfiguredContentOverlayCssClassName));
                unconfiguredImages.each(function (index, element) {
                    var image = $(element);
                    Editor.CommonUtils.removeImageOverlay(image);
                });
            }
            images.removeAttr(Editor.CommonConstants.designerImageSourceAttributeName);
            block.removeAttr("aria-label");
        };
        TextBlock.type = "Text";
        return TextBlock;
    }());
    Editor.TextBlock = TextBlock;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var ButtonBlock = /** @class */ (function () {
        function ButtonBlock() {
            this.inlineToolbar = new Editor.BasicButtonInlineToolbar();
        }
        ButtonBlock.prototype.getType = function () {
            return "Button";
        };
        ButtonBlock.prototype.usePlainText = function () {
            return true;
        };
        ButtonBlock.prototype.isEditable = function () {
            return true;
        };
        ButtonBlock.prototype.getInlineToolbar = function () {
            return this.inlineToolbar;
        };
        ButtonBlock.prototype.setup = function (eventBroker) {
            var _this = this;
            this.eventBroker = eventBroker;
            if (Object.isNullOrUndefined(this.onTargetLinkUpdated)) {
                this.eventBroker.subscribe(this.getType() + "_" + Editor.EventConstants.hrefAttributeChanged, this.onTargetLinkUpdated = function (eventArgs) { return _this.buttonHrefChanged(eventArgs); });
            }
        };
        ButtonBlock.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.onTargetLinkUpdated)) {
                this.eventBroker.unsubscribe(this.getType() + "_" + Editor.EventConstants.hrefAttributeChanged, this.onTargetLinkUpdated);
                this.onTargetLinkUpdated = null;
            }
        };
        ButtonBlock.prototype.decorate = function (block) {
            this.decorateBlockOverlay(block);
            this.setAriaLabel(block);
        };
        ButtonBlock.prototype.decorateBlockOverlay = function (block) {
            var linkElement = this.getLinkElement(block);
            var linkElementParent = linkElement.parent();
            Editor.CommonUtils.removeBlockOverlay(block);
            if (!this.isConfigured(block)) {
                Editor.CommonUtils.overlayBlockElement(linkElementParent, linkElement, Editor.CommonUtils.getButtonBlockPlaceholder());
                block.find("." + Editor.CommonConstants.designerUnconfiguredContentOverlayCssClassName).attr(Editor.DetailsViewConstants.alignAttribute, this.getButtonAlignment(block));
            }
        };
        ButtonBlock.prototype.setAriaLabel = function (block) {
            var txt = "[" + (!this.isConfigured(block) ? "Unconfigured " : String.Empty) + block.attr(Editor.Contract.blockTypeAttrName) + " block]";
            var translatedText = Editor.CommonUtils.getLocalizedString(txt);
            var element = Editor.BlockProvider.getEditableElement(block);
            Editor.CommonUtils.setAriaAttribute(block, "aria-label", translatedText);
            Editor.CommonUtils.setAriaAttribute(element, "aria-label", translatedText);
            Editor.CommonUtils.setAriaAttribute(element, "title", translatedText);
        };
        ButtonBlock.prototype.isConfigured = function (block) {
            var href = this.getTargetLink(block);
            return !String.isNullUndefinedOrWhitespace(href) && href !== "#";
        };
        ButtonBlock.prototype.setFinalContent = function (block) {
            Editor.CommonUtils.removeBlockOverlay(block);
            block.removeAttr("aria-label");
        };
        ButtonBlock.prototype.buttonHrefChanged = function (eventArgs) {
            this.decorate(this.getBlock(eventArgs.element));
            this.setAriaLabel(eventArgs.element.closest("[" + Editor.Contract.blockTypeAttrName + "]"));
        };
        ButtonBlock.prototype.getTargetLink = function (block) {
            return this.getLinkElement(block).attr("href");
        };
        ButtonBlock.prototype.getLinkElement = function (block) {
            return block.find("a");
        };
        ButtonBlock.prototype.getBlock = function (button) {
            return new Editor.BlockProvider().getClosestBlock(button);
        };
        ButtonBlock.prototype.getButtonAlignment = function (block) {
            // Gets styles using JS, because JQuery returns values in pixels.
            var anchorElement = block.find("a").get(0);
            if (!Object.isNullOrUndefined(anchorElement)) {
                var marginLeftValue = anchorElement.style.marginLeft;
                var marginRightValue = anchorElement.style.marginRight;
                if (marginLeftValue === "0px" && marginRightValue === "auto") {
                    return "Left";
                }
                if (marginLeftValue === "auto" && marginRightValue === "0px") {
                    return "Right";
                }
                if (marginLeftValue === "auto" && marginRightValue === "auto") {
                    return "Center";
                }
            }
            return null;
        };
        return ButtonBlock;
    }());
    Editor.ButtonBlock = ButtonBlock;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var DividerBlock = /** @class */ (function () {
        function DividerBlock() {
            this.inlineToolbar = new Editor.BasicDividerInlineToolbar();
        }
        DividerBlock.prototype.getType = function () {
            return "Divider";
        };
        DividerBlock.prototype.usePlainText = function () {
            return false;
        };
        DividerBlock.prototype.isEditable = function () {
            return false;
        };
        DividerBlock.prototype.getInlineToolbar = function () {
            return this.inlineToolbar;
        };
        DividerBlock.prototype.setup = function (eventBroker) {
            this.eventBroker = eventBroker;
        };
        DividerBlock.prototype.dispose = function () {
        };
        DividerBlock.prototype.isConfigured = function (block) {
            return true;
        };
        DividerBlock.prototype.decorate = function (block) {
            var translatedLabel = Editor.CommonUtils.getLocalizedString("[" + block.attr(Editor.Contract.blockTypeAttrName) + " block]");
            Editor.CommonUtils.setAriaAttribute(block, "aria-label", translatedLabel);
        };
        DividerBlock.prototype.setFinalContent = function (block) {
            block.removeAttr("aria-label");
        };
        return DividerBlock;
    }());
    Editor.DividerBlock = DividerBlock;
})(Editor || (Editor = {}));
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
     * Command to set alignment for the selected divider block.
     */
    var DividerAlignCommand = /** @class */ (function () {
        /**
         * Initializes a new instance of the DividerAlignCommand class.
         * @param align The alignment of the divider, that must be set using the command.
         * @param commandName The name of the command.
         * @param buttonsName The names of the align buttons.
         * @param activeButtonName The name of the pressed button.
         */
        function DividerAlignCommand(align, commandName, groupButtonsNames, buttonName, defaultButton, defaultAlign) {
            this.align = align;
            this.commandName = commandName;
            this.groupButtonsNames = groupButtonsNames;
            this.buttonName = buttonName;
            this.defaultButton = defaultButton;
            this.defaultAlign = defaultAlign;
        }
        /**
        * Gets the name of the command.
        */
        DividerAlignCommand.prototype.getName = function () {
            return this.commandName;
        };
        /**
         * Enabled if editor is in read only mode.
         */
        DividerAlignCommand.prototype.enabledOnReadOnly = function () {
            return true;
        };
        /**
         * Configure the command.
         * @param eventBroker An instance of event broker.
         */
        DividerAlignCommand.prototype.setup = function (eventBroker) {
            this.eventBroker = eventBroker;
        };
        /**
         * Executes the command and sets center align for the currently selected block.
         * @param selectedBlock The currently selected block.
         * @param wrappedBlock The top-wrapping element.
         * @param selectedHtml The selected html, if any.
         */
        DividerAlignCommand.prototype.exec = function (selectedBlock, wrappedBlock, selectedHtml) {
            if (Object.isNullOrUndefined(selectedBlock)) {
                return false;
            }
            if (Object.isNullOrUndefined(this.eventBroker)) {
                return false;
            }
            var currentAlign = this.align;
            var toolbar = new Editor.InlineToolbar(selectedBlock.children().attr("id"));
            var groupButtons = [];
            this.groupButtonsNames.forEach(function (buttonName) {
                groupButtons.push(toolbar.getButton(buttonName));
            });
            var activeButton = toolbar.getButton(this.buttonName);
            // Setting default value when pressed again on the active button
            if (activeButton.isSelected() && currentAlign !== this.defaultAlign) {
                currentAlign = this.defaultAlign;
                activeButton = toolbar.getButton(this.defaultButton);
            }
            // Disable all buttons
            groupButtons.forEach(function (button) {
                button.turnOff();
            });
            var paragraph = selectedBlock.find("p");
            var dividerWrapper = selectedBlock.find(".dividerWrapper");
            // Set divider center alignment
            paragraph.css("margin-left", "auto");
            paragraph.css("margin-right", "auto");
            // Set active style for the active button
            activeButton.turnOn();
            // Use align for the Outlook
            dividerWrapper.attr("align", currentAlign);
            if (currentAlign !== "center") {
                // Set divider alignment
                paragraph.css("margin-" + currentAlign, "0");
            }
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentChanged);
            return true;
        };
        /**
       * Disposes the object - removes the html from the page, empty the  objects and detach the events
       */
        DividerAlignCommand.prototype.dispose = function () {
        };
        /*
         * Cleans up the html elements that where added to the page
         */
        DividerAlignCommand.prototype.cleanup = function (blockElements) {
        };
        return DividerAlignCommand;
    }());
    Editor.DividerAlignCommand = DividerAlignCommand;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Editor;
(function (Editor) {
    /**
    * This class contains the constant values used in html to define the template model (where are the blocks, containers, etc)
    * All templates have to have these attributes added in the html
    */
    var Contract = /** @class */ (function () {
        function Contract() {
        }
        /**
        * The block identifier. The value of the attribute is the block type (text, image, etc.).
        */
        Contract.blockTypeAttrName = "data-editorblocktype";
        /**
        * The container identifier. The blocks can be dropped only inside the containers.
        */
        Contract.containerAttrName = "data-container";
        /**
        * The data identifier. The unique identifier of tab buttons.
        */
        Contract.dataIdAttrName = "data-id";
        /**
        * Attribute to control whether the block should appear as readonly by
        * default or not.
        */
        Contract.dataProtectedAttrName = "data-protected";
        /**
        * Attribute to identify sub blocks used by Content Blocks
        */
        Contract.subBlockAttrName = "data-sub-block";
        /**
        * Attribute to identify the type of a Content Block
        */
        Contract.blockDatatypeAttrName = "data-block-datatype";
        /* STYLES */
        /**
        * The type of the meta tag for the style variable
        */
        Contract.styleMetadataTypeAttr = "xrm/designer/setting";
        /**
        * The attribute name for variable name
        */
        Contract.metadataNameAttr = "name";
        /**
        * The attribute name for variable data type
        */
        Contract.metadataDatatypeAttr = "datatype";
        /**
        * The attribute name for variable data type
        */
        Contract.metadataLabelAttr = "label";
        /**
        * The attribute name for variable value
        */
        Contract.metadataValueAttr = "value";
        /**
        * The attribute name for group value
        */
        Contract.metadataGroupAttr = "group";
        /**
        * The attribute name for group value
        */
        Contract.styleMetadataGroupType = "style";
        /**
        * The attribute name for variable value format
        */
        Contract.metadataFormatAttr = "format";
        /**
        * The color data type of the style variable
        */
        Contract.styleMetadataColorDataType = "color";
        /**
        * The picture data type of the style variable
        */
        Contract.styleMetadataPictureDataType = "picture";
        /**
        * The input data type of the style variable
        */
        Contract.styleMetadataNumberDataType = "number";
        /**
         * The data type of the font specification which can be used in CKEditor
         */
        Contract.styleMetadataFontDataType = "font";
        /**
        * The test data type of the style variable
        */
        Contract.styleMetadataTestDataType = "text";
        /**
        * The document version name
        */
        Contract.metadataDocumentVersionName = "version";
        /**
         * The document version type
         */
        Contract.metadataDocumentTypeName = "type";
        /**
         * The document version type value to show designer view
         */
        Contract.metadataDocumentTypeDesignerValue = "marketing-designer-content-editor-document";
        /**
         * Data-protected attribute name
         */
        Contract.dataProtectedAttribute = "data-protected";
        return Contract;
    }());
    Editor.Contract = Contract;
})(Editor || (Editor = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="commonreferences.ts" />
var Editor;
(function (Editor) {
    var EventConstants = /** @class */ (function () {
        function EventConstants() {
        }
        EventConstants.contentModelInitialized = "contentModelInitialized";
        EventConstants.contentModelUpdated = "contentModelUpdated";
        EventConstants.contentChanged = "contentChanged";
        EventConstants.contentResolved = "contentResolved";
        EventConstants.contentFinalized = "contentFinalized";
        EventConstants.elementsCanBeInserted = "elementsCanBeInserted";
        EventConstants.elementsCannotBeInserted = "elementsCannotBeInserted";
        EventConstants.controlRendered = "controlRendered";
        EventConstants.browserPreviewReady = "browserPreviewReady";
        EventConstants.blockAdded = "blockAdded";
        EventConstants.blockMoved = "blockMoved";
        EventConstants.blockDeleted = "blockDeleted";
        EventConstants.imageAttributeChanged = "imageAttributeChanged";
        EventConstants.imageInputChanged = "imageInputChanged";
        EventConstants.hrefAttributeChanged = "hrefAttributeChanged";
        EventConstants.imageGalleryCommandExecuted = "imageGalleryCommandExecuted";
        EventConstants.contentBlockAttributeChanged = "contentBlockAttributeChanged";
        EventConstants.toolbarShown = "toolbarShown";
        EventConstants.maximizeExecuted = "maximizeExecuted";
        EventConstants.previewSizeChanged = "previewSizeChanged";
        EventConstants.exitFullScreenButtonClicked = "exitFullScreenButtonClicked";
        EventConstants.fullPageEditorContentChanged = "fullPageEditorContentChanged";
        EventConstants.standardCkEditorInitialized = "standardCkEditorInitialized";
        EventConstants.sectionToolsPublishStarted = "sectionToolsPublishStarted";
        EventConstants.sectionToolsPublishCompleted = "sectionToolsPublishCompleted";
        EventConstants.toolPublished = "toolPublished";
        EventConstants.fullPageEditorRendered = "fullPageEditorRendered";
        EventConstants.basicPreviewModeSwitched = "basicPreviewModeSwitched";
        EventConstants.onElementFocusedIn = "onElementFocusedIn";
        EventConstants.onKeypressToFocusPreviousElementCalled = "onKeypressToFocusPreviousElementCalled";
        EventConstants.onToolboxAccessibleContainerRendered = "onToolboxAccessibleContainerRendered";
        EventConstants.onToolboxAccessibleItemRendered = "onToolboxAccessibleItemRendered";
        EventConstants.onPreviewAccessibleContainerRendered = "onPreviewAccessibleContainerRendered";
        EventConstants.onPreviewAccessibleItemRendered = "onPreviewAccessibleItemRendered";
        EventConstants.editorVisibilityChanged = "editorVisibilityChanged";
        EventConstants.contentRefreshed = "contentRefreshed";
        EventConstants.contentModelProcessCompleted = "contentModelProcessCompleted";
        EventConstants.litmusStatusChanged = "litmusStatusChanged";
        EventConstants.litmusUnavailable = "litmusUnavailable";
        EventConstants.litmusTrialOrg = "litmusTrialOrg";
        EventConstants.litmusDisabled = "litmusDisabled";
        EventConstants.imagePopupRendered = "imagePopupRendered";
        EventConstants.videoSelectionChanged = "videoSelectionChanged";
        return EventConstants;
    }());
    Editor.EventConstants = EventConstants;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var KeyCodes = MktSvc.Controls.Common.KeyCodes;
    /**
    * A wrapper class for the ck editor api setup.
    */
    var CkEditorProxy = /** @class */ (function () {
        function CkEditorProxy(executionContext, localeProvider, fontsProvider, customCkEditorConfiguration) {
            this.ckEditorBasePath = "ckeditor";
            this.ckEditorScriptId = "designer-dependency-ckeditor";
            this.cdnBasePath = executionContext.getLibsPath();
            this.localeProvider = localeProvider;
            this.fontsProvider = fontsProvider;
            this.executionContext = executionContext;
            this.customCkEditorConfiguration = customCkEditorConfiguration;
        }
        /**
        * Initlializes the static ck editor configuration.
        */
        CkEditorProxy.prototype.init = function (parentIframe, callback, documentContentModel) {
            var _this = this;
            this.ckEditorInitialization = $.Deferred();
            // Register custom GETURL function, which removes timestamp parameter
            parentIframe.contentWindow.CKEDITOR_GETURL = function (resource) {
                if (resource.indexOf(":/") === -1 && resource.indexOf("/") !== 0) {
                    resource = _this.cdnBasePath + "/" + _this.ckEditorBasePath + "/" + resource; // tslint:disable-line
                }
                if (resource.indexOf("?t=") !== -1) {
                    resource = resource.substring(0, resource.indexOf("?t=")); // tslint:disable-line
                }
                return resource;
            };
            // Init the scripts
            var ckEditorScript = Editor.CommonUtils.createScriptElementFromUrl(this.ckEditorScriptId, String.Format("{0}/{1}/{2}", this.cdnBasePath, this.ckEditorBasePath, "ckeditor.js"), parentIframe.contentDocument);
            ckEditorScript.onload = function () {
                _this.executionContext.tryExecute(function () {
                    _this.contentWindow = parentIframe.contentWindow;
                    var ckeditor = _this.getCkEditor();
                    if (ckeditor) {
                        window.CKEDITOR = ckeditor;
                        CKEDITOR.disableAutoInline = true;
                        CKEDITOR.config.fillEmptyBlocks = false;
                        CKEDITOR.config.basicEntities = true;
                        CKEDITOR.config.language = _this.localeProvider.getLanguageCode();
                        CKEDITOR.config.removePlugins = CkEditorProxy.removePlugins;
                        CKEDITOR.config.extraPlugins = CkEditorProxy.extraPlugins;
                        CKEDITOR.config.title = false;
                        CKEDITOR.config.keystrokes = [];
                        var fonts = CKEDITOR.config.font_names.split(";");
                        fonts = fonts.concat(CkEditorProxy.extraFonts).sort();
                        CKEDITOR.config.font_names = fonts.join(";");
                        // Setup content styles
                        if (Object.isNullOrUndefined(CKEDITOR.stylesSet.get(CkEditorProxy.styleSetName))) {
                            CKEDITOR.stylesSet.add(CkEditorProxy.styleSetName, new Editor.CkEditorContentStyleSetFactory().createStyleSet());
                        }
                        CKEDITOR.config.stylesSet = CkEditorProxy.styleSetName;
                        // Add custom skin styles without timestamp and with accessibility fixes
                        $(parentIframe).contents().find("head").append(_this.getCustomCkEditorSkinStylesElement());
                        // Set up additional fonts
                        if (!Object.isNullOrUndefined(documentContentModel)) {
                            var additionalFontsString = _this.fontsProvider
                                .getAdditionalFontsString(documentContentModel.getStyleMetaEntries()).items()
                                .join(";")
                                .trim();
                            if (additionalFontsString) {
                                CKEDITOR.config.font_names =
                                    additionalFontsString + ";" + CKEDITOR.config.font_names;
                            }
                        }
                        if (_this.customCkEditorConfiguration) {
                            var ckeditorSettings = _this.customCkEditorConfiguration.ckeditorSettings;
                            if (ckeditorSettings) {
                                for (var property in ckeditorSettings) {
                                    if (ckeditorSettings.hasOwnProperty(property)) {
                                        CKEDITOR[property] = ckeditorSettings[property];
                                    }
                                }
                            }
                            var globalConfiguration = _this.customCkEditorConfiguration.globalConfiguration;
                            if (globalConfiguration) {
                                for (var property in globalConfiguration) {
                                    if (globalConfiguration.hasOwnProperty(property)) {
                                        CKEDITOR.config[property] = globalConfiguration[property];
                                    }
                                }
                            }
                        }
                        _this.registerAccessibilityFixes($(parentIframe));
                        // Done
                        ckEditorScript.onload = null;
                        ckEditorScript = null;
                        _this.ckEditorInitialization.resolve();
                        callback();
                    }
                }, "Configure the static ckeditor", true);
            };
            parentIframe.contentDocument.head.appendChild(ckEditorScript);
        };
        /**
        * Returns promise which identify that ckeditor was initialized
        */
        CkEditorProxy.prototype.getCkEditorInitializedPromise = function () {
            return this.ckEditorInitialization ? this.ckEditorInitialization.promise() : (this.ckEditorInitialization = $.Deferred()).promise();
        };
        /**
        * Cleans up the specified element from CK Editor dependencies.
        */
        CkEditorProxy.prototype.cleanup = function (content) {
            var _this = this;
            // Cleanup the temp styles and scripts
            Editor.CommonUtils.getBySelector(Editor.CommonUtils.getAttrSelector(Editor.CkEditorConstants.ckEditorSharedResourceAttribute), content).remove();
            Editor.CommonUtils.getBySelector(Editor.CommonUtils.getAttrSelector("data-cke-temp"), content).remove();
            Editor.CommonUtils.getBySelector(Editor.CommonUtils.getAttrSelector('class^="cke"'), content).remove();
            Editor.CommonUtils.getBySelector("script", content).each(function (index, value) {
                // Delete scripts coming from bellow the base cdn path
                var $script = $(value);
                var scriptSource = $script.attr("src");
                if (scriptSource && scriptSource.indexOf(_this.ckEditorBasePath) >= 0) {
                    $script.remove();
                }
            });
            Editor.CommonUtils.getBySelector("link", content).each(function (index, value) {
                // Delete links coming from bellow the base cdn path
                var $link = $(value);
                var linkSource = $link.attr("href");
                if (linkSource && linkSource.indexOf(_this.ckEditorBasePath) >= 0) {
                    $link.remove();
                }
            });
            Editor.CommonUtils.getBySelector("style", content).each(function (index, value) {
                var $style = $(value);
                if ($style.html().indexOf(".cke") >= 0) {
                    $style.remove();
                }
            });
        };
        /**
         * Dispose of all shared resources.
         */
        CkEditorProxy.prototype.dispose = function () {
            // Most probably even unloaded by this point of time
            if (!Object.isNullOrUndefined(this.contentWindow)) {
                Editor.CommonUtils.getById("designer-dependency-ckeditor", $(this.contentWindow.document)).remove();
                this.contentWindow = null;
            }
            if (!Object.isNullOrUndefined(this.pluginAdapter)) {
                this.pluginAdapter.dispose();
                this.pluginAdapter = null;
            }
            if (!Object.isNullOrUndefined(this.ckEditorInitialization)) {
                this.ckEditorInitialization.reject();
            }
        };
        /**
        * Removed the ckeditor from the page.
        * @param editorId - The editor id that should be removed.
        */
        CkEditorProxy.prototype.destroyEditor = function (editorId) {
            var _this = this;
            this.executionContext.tryExecute(function () {
                var instance = _this.getCkEditorInstance(editorId);
                if (instance) {
                    if (instance.focusManager) {
                        instance.focusManager.hasFocus = false;
                    }
                    instance.destroy();
                }
            }, "Destroy the ckeditor");
        };
        /**
        * Removed all ckeditor instances from the page.
        */
        CkEditorProxy.prototype.destroyAllEditors = function () {
            var _this = this;
            this.executionContext.tryExecute(function () {
                var instances = _this.getCkEditor().instances;
                for (var editorId in instances) {
                    if (instances.hasOwnProperty(editorId)) {
                        _this.destroyEditor(editorId);
                    }
                }
            }, "Destroy all ckeditor instances");
        };
        CkEditorProxy.prototype.setupToolbarConfiguration = function (toolbarConfig) {
            var basicConfig = {};
            basicConfig["toolbar"] = toolbarConfig.getName();
            basicConfig["toolbar_" + toolbarConfig.getName()] = toolbarConfig.getConfig();
            basicConfig["allowedContent"] = true;
            return basicConfig;
        };
        /**
        * Get the content of the editor. The conent is cleaned up - does not contain any ck editor attributes
        * @param editor - The editor instance
        */
        CkEditorProxy.prototype.getContent = function (editor) {
            var data = String.Empty;
            if (!Object.isNullOrUndefined(editor)) {
                this.executionContext.tryExecute(function () {
                    data = editor.getData();
                }, "Get ckeditor content");
            }
            return data;
        };
        /**
        * Set the content of the editor.
        * @param content - The data, that will setted in the editor
        * @param editor - The editor instance
        */
        CkEditorProxy.prototype.setContent = function (content, editor, callback) {
            this.executionContext.tryExecute(function () {
                if (!Object.isNullOrUndefined(editor)) {
                    editor.setData(content, {
                        callback: function () {
                            editor.updateElement();
                            if (Editor.CommonUtils.isFunction(callback)) {
                                callback();
                            }
                        }
                    });
                }
            }, "Set ckeditor content");
        };
        /**
        * Set attributes on the CK Editor element
        * @param editorId - The editor id
        */
        CkEditorProxy.prototype.setRequiredAttributes = function (editor) {
            // This should actually be set by the ckeditor itself, but does not because we use ckeditor inside an iframe.
            var ckEditorElement = this.getCkEditorElement(editor);
            if (!Object.isNullOrUndefined(ckEditorElement)) {
                ckEditorElement.setAttribute("tabIndex", "0");
                // Remove contenteditable attribute from inputs and textarea inside the editor to prevent ckeditor issues in Chrome.
                $(ckEditorElement).find("input").removeAttr(Editor.CommonConstants.contentEditableAttrName);
                $(ckEditorElement).find("textarea").removeAttr(Editor.CommonConstants.contentEditableAttrName);
            }
        };
        /**
        * Set the block to read only mode
        * @param editorId - The editor id
        */
        CkEditorProxy.prototype.setReadOnly = function (editorId) {
            var _this = this;
            this.executionContext.tryExecute(function () {
                var instance = _this.getCkEditorInstance(editorId);
                if (!Object.isNullOrUndefined(instance)) {
                    instance.setReadOnly();
                }
            }, "Set ckeditor readonly mode");
        };
        /**
         * Register accessibility fixes for CKeditor.
         * @param parentIframe Iframe that contains CKeditor.
         */
        CkEditorProxy.prototype.registerAccessibilityFixes = function (parentIframe) {
            var _this = this;
            // Register accessibility fixes for ckeditor dialogs
            this.getCkEditor().on("dialogDefinition", function (ev) {
                _this.executionContext.tryExecute(function () {
                    // Take the dialog attributes from the event data
                    var dialogDefinition = ev.data.definition;
                    var dialog = dialogDefinition.dialog;
                    var dialogName = ev.data.name;
                    // Apply fixes for role attribute
                    $(dialog.parts.title.$).attr("role", "heading");
                    if (dialog.parts.close) {
                        setTimeout(function () {
                            // Add close "x" button into dialog focusable collection
                            dialog.addFocusable(dialog.parts.close);
                            // Remove default keydown listener before adding custom listener
                            var ckeditorNativeEvents = dialog.parts.close.getCustomData(Editor.CkEditorConstants.ckEditorNativeListeners);
                            dialog.parts.close.$.removeEventListener("keydown", ckeditorNativeEvents["keydown"]);
                            // Trigger native js event to prevent ckeditor errors
                            $(dialog.parts.close.$).on("keydown", function (event) {
                                if (event.keyCode === KeyCodes.Enter || event.keyCode === KeyCodes.Space) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    dialog.parts.close.$.click();
                                }
                            });
                        }, 0);
                    }
                    if (dialogName === "paste") {
                        // Save original handler before overriding
                        var originalHandler_1 = dialogDefinition.onShow;
                        // Use function and .call to execute original handler with correct context
                        dialogDefinition.onShow = function () {
                            originalHandler_1.call(this);
                            var focusableElement = $(dialog.parts.contents.$).find(Editor.CkEditorConstants.ckEditorDialogTextAreaSelector);
                            var edatableArea = focusableElement.find(Editor.CkEditorConstants.ckEditorDialogPasteFrameSelector);
                            edatableArea.one("load", function () {
                                edatableArea.contents().find("body").off("keydown");
                                // Register custom listener for shift+tab shortcut
                                edatableArea.contents().find("body").on("keydown", function (event) {
                                    if (event.keyCode === KeyCodes.Tab && event.shiftKey) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        var focusList = dialog._.focusList;
                                        // Retrieve index of currently focused element from CKEditor focusList
                                        var currentIndex = focusList
                                            .map(function (element) { return element.domId; })
                                            .indexOf(Editor.CommonUtils.getId(focusableElement));
                                        // Calculate index of previous focusable element and set focus manually
                                        var nextIndex = currentIndex <= 0
                                            ? focusList.length - 1
                                            : (currentIndex - 1);
                                        focusList[nextIndex].focus();
                                    }
                                });
                            });
                        };
                    }
                }, "Apply accessibility fixes to ckeditor dialog");
            });
            // Register accessibility fixes for ckeditor buttons
            this.getCkEditor().on(Editor.CkEditorConstants.ckEditorInstanceReadyInternalEventName, function (args) {
                if (args.editor && args.editor.name) {
                    var toolbarContainer = parentIframe.contents().find("#cke_" + args.editor.name);
                    var ckeditorButtons = toolbarContainer.find(Editor.CkEditorConstants.ckEditorButtonSelector);
                    var ckeditorComboButtons = toolbarContainer.find(Editor.CkEditorConstants.ckEditorComboButtonSelector);
                    ckeditorButtons.each(function (index, button) {
                        if (String.isNullUndefinedOrWhitespace($(button).attr("name"))) {
                            var buttonName = $(button).find(Editor.CkEditorConstants.ckEditorButtonLabelSelector).text();
                            $(button).attr("name", buttonName);
                        }
                        var attrOnFocus = $(button).attr("onfocus");
                        if (attrOnFocus && Editor.CommonUtils.isIOS()) {
                            $(button).removeAttr("onfocus");
                            $(button).attr("onfocus", "keepFocus($(button));" + attrOnFocus);
                        }
                    });
                    ckeditorComboButtons.each(function (index, comboButton) {
                        if (String.isNullUndefinedOrWhitespace($(comboButton).attr("name"))) {
                            var comboButtonName = $(comboButton).attr("title");
                            $(comboButton).attr("name", comboButtonName);
                        }
                    });
                }
            });
        };
        /**
        * Keep focus on ipad with voiceover on
        */
        CkEditorProxy.prototype.keepFocus = function (elem) {
            setTimeout(function () {
                if (!elem.is(":focus")) {
                    elem.focus();
                }
            }, 0);
        };
        /**
        * Upserts an image in the specific editor
        * @param editorId - The editor id
        * @param selectedHtml - The selected html - either empty or the image to update
        * @param imageData - The image data that should be upserted
        */
        CkEditorProxy.prototype.upsertImage = function (editor, selectedHtml, imageData, callback, hasAdditionalProperties) {
            var _this = this;
            if (hasAdditionalProperties === void 0) { hasAdditionalProperties = false; }
            var img = selectedHtml.is("img") ? selectedHtml : selectedHtml.find("img");
            this.executionContext.tryExecute(function () {
                var ckEditorImageElement;
                if (img.length === 0) {
                    ckEditorImageElement = editor.document.createElement("img");
                }
                else {
                    ckEditorImageElement = new CKEDITOR.dom.element(img.get(0));
                }
                _this.setCkEditorElementAttribute(ckEditorImageElement, "src", imageData.src);
                _this.setCkEditorElementAttribute(ckEditorImageElement, "alt", imageData.alt);
                if (hasAdditionalProperties) {
                    _this.setCkEditorElementStyle(ckEditorImageElement, "width", imageData.width);
                    _this.setCkEditorElementStyle(ckEditorImageElement, "height", imageData.height);
                    _this.setCkEditorElementAttribute(ckEditorImageElement, "vSpace", imageData.vSpace);
                    _this.setCkEditorElementAttribute(ckEditorImageElement, "hSpace", imageData.hSpace);
                    _this.setCkEditorElementAlignment(ckEditorImageElement, imageData.alignment.toLowerCase());
                }
                editor.insertElement(ckEditorImageElement);
                _this.setEditorFocus(editor);
                editor.getSelection().selectElement(ckEditorImageElement);
                callback($(ckEditorImageElement.$));
            }, "Upsert the image", false, function () {
                _this.setEditorFocus(editor);
                callback(img);
            });
        };
        CkEditorProxy.prototype.setCkEditorElementStyle = function (element, style, value) {
            if (!Object.isNullOrUndefined(style) && !Object.isNullOrUndefined(value)) {
                element.setStyle(style, value);
            }
        };
        CkEditorProxy.prototype.setCkEditorElementAttribute = function (element, attribute, value) {
            if (!Object.isNullOrUndefined(attribute) && !Object.isNullOrUndefined(value)) {
                element.setAttribute(attribute, value);
            }
        };
        CkEditorProxy.prototype.setCkEditorElementAlignment = function (element, alignment) {
            if (!String.isNullUndefinedOrWhitespace(alignment)) {
                // Set alignment for outlook
                this.setCkEditorElementAttribute(element, "align", alignment);
                // Set alignment for browsers
                this.setCkEditorElementStyle(element, "margin-left", "auto");
                this.setCkEditorElementStyle(element, "margin-right", "auto");
                this.setCkEditorElementStyle(element, "float", "none");
                if (alignment !== "center") {
                    this.setCkEditorElementStyle(element, "float", alignment);
                    this.setCkEditorElementStyle(element, "margin-" + alignment, "0");
                }
            }
        };
        /**
        * Gets a link from the selected text in the specific editor
        * @param editor - The ck editor
        */
        CkEditorProxy.prototype.getSelectedLink = function (editor) {
            var _this = this;
            var link = $();
            this.executionContext.tryExecute(function () {
                var selectedLink = _this.getCkEditor().plugins.link.getSelectedLink(editor);
                if (selectedLink != null && selectedLink.hasAttribute("href")) {
                    editor.getSelection().selectElement(selectedLink);
                    link = $(selectedLink.$);
                }
            }, "Get selected link");
            return link;
        };
        /**
        * Upserts a link in the specific editor
        * @param editorId - The editor id
        * @param linkData - The link data that should be upserted
        */
        CkEditorProxy.prototype.upsertLink = function (editor, linkData) {
            var _this = this;
            this.executionContext.tryExecute(function () {
                var selectedLink = _this.getCkEditor().plugins.link.getSelectedLink(editor);
                var selectedRange = editor.getSelection().getRanges()[0];
                if (selectedLink == null) {
                    // If there is nothing selected we will insert the text node to the document (the text is the same as the url) and select it.
                    if (selectedRange.collapsed) {
                        var text = new CKEDITOR.dom.text(linkData.href, editor.document);
                        selectedRange.insertNode(text);
                        selectedRange.selectNodeContents(text);
                    }
                    // We will upgrade the selected text to be a link
                    var linkStyle = new CKEDITOR.style({ element: "a", attributes: linkData.getAttributes() });
                    linkStyle.type = CKEDITOR.STYLE_INLINE;
                    linkStyle.applyToRange(selectedRange, editor);
                    selectedRange.select();
                }
                else {
                    selectedLink.setAttribute("href", linkData.href);
                    selectedLink.setAttribute(Editor.CkEditorConstants.ckEditorHrefAttribute, linkData.href);
                }
                _this.setEditorFocus(editor);
            }, "Upsert the link", false, function () {
                _this.setEditorFocus(editor);
            });
        };
        /**
        * Registers the new image command
        * @param imageCommandName - The name of the new command
        */
        CkEditorProxy.prototype.registerImageCommand = function (imageCommandName) {
            var _this = this;
            this.executionContext.tryExecute(function () {
                if (Object.isNullOrUndefined(_this.getCkEditor().plugins.get(imageCommandName))) {
                    _this.getCkEditor().config.extraPlugins = CKEDITOR.config.extraPlugins + "," + imageCommandName;
                    _this.getCkEditor().plugins.add(imageCommandName, {
                        init: function (editor) {
                            editor.on("doubleclick", function (eventInfo) {
                                _this.executionContext.tryExecute(function () {
                                    var ckEditorElement = eventInfo.data.element;
                                    if (!Object.isNullOrUndefined(ckEditorElement.find("img")) &&
                                        !ckEditorElement.data("cke-realelement") &&
                                        !ckEditorElement.isReadOnly()) {
                                        _this.preventCkEditorDefaultDialogToShow(eventInfo);
                                        // Opens the image popup for an image block, instead of opening the CkEditor standard popup
                                        if (ckEditorElement.is("img")) {
                                            eventInfo.editor.execCommand(imageCommandName);
                                        }
                                    }
                                }, "Execute image command on doubleclick");
                            });
                        }
                    });
                }
            }, "Register image command");
        };
        /**
        * Registers the new link command
        * @param linkCommandName - The name of the new command
        */
        CkEditorProxy.prototype.registerLinkCommand = function (linkCommandName) {
            var _this = this;
            this.executionContext.tryExecute(function () {
                if (Object.isNullOrUndefined(_this.getCkEditor().plugins.get(linkCommandName))) {
                    _this.getCkEditor().config.extraPlugins = CKEDITOR.config.extraPlugins + "," + linkCommandName;
                    _this.getCkEditor().plugins.add(linkCommandName, {
                        init: function (editor) {
                            editor.setKeystroke(CKEDITOR.CTRL + 76, linkCommandName); // tslint:disable-line
                            editor.on("doubleclick", function (eventInfo) {
                                _this.executionContext.tryExecute(function () {
                                    var ckEditorElement = eventInfo.data.element;
                                    if (!Object.isNullOrUndefined(ckEditorElement.find("a")) &&
                                        !ckEditorElement.data("cke-realelement") &&
                                        !ckEditorElement.isReadOnly()) {
                                        _this.preventCkEditorDefaultDialogToShow(eventInfo);
                                        // Opens the link popup for a button, instead of opening the CkEditor standard popup
                                        if (ckEditorElement.is("a")) {
                                            eventInfo.editor.execCommand(linkCommandName);
                                        }
                                    }
                                }, "Execute link command on doubleclick");
                            });
                        }
                    });
                }
            }, "Register link command");
        };
        CkEditorProxy.prototype.preventCkEditorDefaultDialogToShow = function (eventInfo) {
            eventInfo.data.dialog = null;
        };
        /**
         * Set the focus on the block
         * @param editorId - The editor id
         * @param callback - The callback
         */
        CkEditorProxy.prototype.setEditorFocus = function (editor, callback) {
            var _this = this;
            this.executionContext.tryExecute(function () {
                if (Object.isNullOrUndefined(editor)) {
                    return;
                }
                if (editor && editor.focusManager && !editor.focusManager.hasFocus) {
                    if (editor.status !== Editor.CkEditorConstants.ckEditorLoadedStatus && editor.status !== Editor.CkEditorConstants.ckEditorReadyStatus) {
                        // Wait while ckeditor loaded
                        editor.on(Editor.CkEditorConstants.ckEditorInstanceReadyInternalEventName, function () {
                            // Add zero delay, because toolbar may be not load completely
                            setTimeout(function () {
                                _this.executionContext.tryExecute(function () {
                                    if (editor.editable()) {
                                        _this.getCkEditor().currentInstance = editor;
                                        editor.focus();
                                    }
                                    if (Editor.CommonUtils.isFunction(callback)) {
                                        callback();
                                    }
                                }, "Set editor focus on instance ready", false, function () {
                                    if (Editor.CommonUtils.isFunction(callback)) {
                                        callback();
                                    }
                                });
                            }, 0);
                        });
                    }
                    else {
                        if (editor.editable()) {
                            _this.getCkEditor().currentInstance = editor;
                            editor.focusManager.focus();
                            editor.focus();
                        }
                        if (Editor.CommonUtils.isFunction(callback)) {
                            callback();
                        }
                    }
                }
                else {
                    if (Editor.CommonUtils.isFunction(callback)) {
                        callback();
                    }
                }
            }, "Set editor focus", false, function () {
                if (Editor.CommonUtils.isFunction(callback)) {
                    callback();
                }
            });
        };
        /**
        * Get the JQuery CK Editor Element
        * @param editorId - The editor id
        */
        CkEditorProxy.prototype.getCkEditorElement = function (editor) {
            var ckEditorElement = null;
            this.executionContext.tryExecute(function () {
                ckEditorElement = editor.element.$;
            }, "Get ckeditor html element", true);
            return ckEditorElement;
        };
        /**
         * Get the CKEditor instance by editorId.
         * @param editorId id of the editor element.
         */
        CkEditorProxy.prototype.getCkEditorInstance = function (editorId) {
            var _this = this;
            var ckeditorInstance = null;
            this.executionContext.tryExecute(function () {
                ckeditorInstance = (_this.getCkEditor() || CKEDITOR).instances[editorId];
            }, "Get ckeditor instance", true);
            return ckeditorInstance;
        };
        /**
         * Get the CKEditor id from container.
         * @param container The container with an editor.
         */
        CkEditorProxy.prototype.getCkEditorId = function (container) {
            return Editor.CommonUtils.getId(container.find(Editor.CommonUtils.getAttrSelector(Editor.CommonConstants.ckEditorAttrName)));
        };
        /**
         * Register custom plugins with ckeditor.
         * @param plugins array of custom plugins to register.
         */
        CkEditorProxy.prototype.registerPlugin = function (plugin, eventBroker, getSelectedElement) {
            var _this = this;
            this.executionContext.tryExecute(function () {
                var name = UniqueId.generate();
                _this.pluginAdapter = new Editor.CKEditorPluginAdapter(CKEDITOR, plugin, eventBroker, getSelectedElement, Editor.BlockProvider.getLastElementBeforeContainer, _this.executionContext);
                _this.getCkEditor().plugins.add(name, _this.pluginAdapter);
                _this.getCkEditor().config.extraPlugins += name + ",";
                var buttons = plugin.getToolbarButtons();
                $.each(buttons, function (index, value) {
                    _this.registerToolbarStyles(value);
                });
            }, "Register custom plugins", true);
        };
        CkEditorProxy.prototype.setImageAttribute = function (imageElement, attributeValue) {
            imageElement.attr(Editor.CkEditorConstants.ckEditorImageSrcAttribute, attributeValue);
        };
        CkEditorProxy.prototype.setHrefAttribute = function (element, href) {
            if (!Object.isNullOrUndefined(element)) {
                element.attr(Editor.CkEditorConstants.ckEditorHrefAttribute, href);
            }
        };
        /**
         * Set CkEditor toolbar to blur
         * @param eventArgs DesignerDragStartEventArgs object that refers a block
         */
        CkEditorProxy.prototype.setToolbarBlur = function (eventArgs) {
            var _this = this;
            this.executionContext.tryExecute(function () {
                if (!Object.isNullOrUndefined(eventArgs.block)) {
                    var ckeditorElement = Editor.BlockProvider.getEditableElement(eventArgs.block);
                    if (ckeditorElement.length) {
                        var ckEditor = _this.getCkEditorInstance(Editor.CommonUtils.getId(ckeditorElement));
                        if (!Object.isNullOrUndefined(ckEditor)) {
                            CKEDITOR.focusManager(ckEditor).blur(true);
                        }
                    }
                }
            }, "Set ckeditor toolbar to blur");
        };
        /**
         * Create style for button icon and inject it into the body of the document.
         * Added to body to ensure it gets priority over ckeditor clear styles.
         * @param button the button to register.
         */
        CkEditorProxy.prototype.registerToolbarStyles = function (button) {
            var id = "btnStyle_" + button.getName();
            var styleTag = Editor.CommonUtils.getById(id, $(this.contentWindow.document.body));
            if (styleTag.length > 0) {
                return;
            }
            var ruleid = ".cke_button__" + button.getName().toLowerCase() + "_icon";
            var css = '{ background-image: url("' + button.getIconSrc() + '"); }';
            // Changing to head will not override some of the default CKEditor styles
            var body = $(this.contentWindow.document.body);
            $("<style>").prop("type", "text/css").attr("id", id).attr(Editor.CkEditorConstants.ckEditorSharedResourceAttribute, "yes").html(ruleid + " " + css).appendTo(body);
        };
        CkEditorProxy.prototype.getCustomCkEditorSkinStylesElement = function () {
            var baseSkinUrl = this.cdnBasePath + "/" + this.ckEditorBasePath + "/skins/moono-lisa";
            return $("<style>").attr("id", Editor.DesignerContentEditorStyles.ckEditorSkinStylesId)
                .text(String.Format(Editor.DesignerContentEditorStyles.ckEditorSkinStyles, baseSkinUrl));
        };
        /**
         * The CKEDITOR initialized dynamically after the screen is loaded.
         */
        CkEditorProxy.prototype.getCkEditor = function () {
            return this.contentWindow ? this.contentWindow.CKEDITOR : null;
        };
        CkEditorProxy.prototype.getWindow = function () {
            return this.contentWindow;
        };
        /**
        * Gets the child editable element which has the cursor
        * @param editorId - The editor id
        */
        CkEditorProxy.prototype.getChildEditableElementId = function (editorId) {
            var _this = this;
            var modifiedElementId = null;
            this.executionContext.tryExecute(function () {
                var ckEditorInstance = _this.getCkEditorInstance(editorId);
                if (!Object.isNullOrUndefined(ckEditorInstance) &&
                    !Object.isNullOrUndefined(ckEditorInstance.elementPath())) {
                    modifiedElementId = _this.getCkEditorInstance(editorId).elementPath().elements[0].$.id;
                }
            }, "Get the child editable element", true);
            return modifiedElementId;
        };
        CkEditorProxy.prototype.onCkEditorInitialized = function (id, callback) {
            var _this = this;
            var ckeditor = this.getCkEditor() || CKEDITOR;
            ckeditor.on(Editor.CkEditorConstants.ckEditorInstanceReadyInternalEventName, function (args) {
                var eventArgs = new Editor.CkEditorInstanceReadyEventArgs();
                eventArgs.sourceId = id;
                var editor = args.editor;
                if (!(editor && editor.name)) {
                    return;
                }
                // Enable fix for scrolling if current environment is IOS
                if (Editor.CommonUtils.isIOS() && editor.editable()) {
                    if (editor.editable().isInline()) {
                        // Apply fixes after initialization for inline editors
                        _this.registerIOSScrollFixes(editor);
                    }
                    else {
                        // Apply fixes on contentDom event for standard editor
                        args.editor.on(Editor.CkEditorConstants.ckEditorContentDomInternalEventName, function () {
                            _this.registerIOSScrollFixes(editor);
                        });
                    }
                }
                eventArgs.ckEditorInstanceName = editor.name;
                callback(editor, eventArgs);
            });
        };
        CkEditorProxy.prototype.registerIOSScrollFixes = function (editor) {
            var _this = this;
            var editable = editor.editable();
            editable.on(Editor.CkEditorConstants.ckEditorInputInternalEventName, function () {
                _this.fixIOSScroll(editor);
            });
        };
        CkEditorProxy.prototype.fixIOSScroll = function (editor) {
            this.executionContext.tryExecute(function () {
                var ckEditorSelection = editor.getSelection();
                if (ckEditorSelection) {
                    var ckEditorRange = ckEditorSelection.getRanges()[0];
                    var selection_1 = ckEditorSelection.getNative();
                    if (!(ckEditorRange &&
                        ckEditorRange.startContainer &&
                        ckEditorRange.startContainer.$ &&
                        ckEditorRange.endContainer &&
                        ckEditorRange.endContainer.$)) {
                        return;
                    }
                    // Create new range with same parameters as initial
                    var range_1 = document.createRange();
                    range_1.setStart(ckEditorRange.startContainer.$, ckEditorRange.startOffset);
                    range_1.setEnd(ckEditorRange.endContainer.$, ckEditorRange.endOffset);
                    // Remove old range to prevent scrolling issue
                    selection_1.removeAllRanges();
                    setTimeout(function () {
                        // Add range to restore caret position
                        selection_1.addRange(range_1);
                        if (!editor.editable().isInline()) {
                            // Trigger change event manually to save changes on input
                            editor.fire(Editor.CkEditorConstants.ckEditorChangeInternalEventName);
                        }
                    }, 0);
                }
            }, "Fix IOS scrolling issue when typing");
        };
        /**
         * Sets the enter mode of the CkEditor according to the element type
         * @param element - The element
         */
        CkEditorProxy.prototype.setEnterMode = function (element) {
            var enterMode = CKEDITOR.ENTER_P;
            Editor.CkEditorEnterModeExceptions.enterBrTagList.forEach(function (tag) {
                if (element.children().is(tag)) {
                    enterMode = CKEDITOR.ENTER_BR;
                }
            });
            CKEDITOR.config.enterMode = enterMode;
            CKEDITOR.config.title = element.attr("aria-label");
        };
        CkEditorProxy.removePlugins = "showborders,codemirror,magicline,liststyle,tabletools,scayt,contextmenu,a11yhelp";
        CkEditorProxy.extraPlugins = String.Empty;
        CkEditorProxy.extraFonts = [
            "Segoe UI/Segoe UI,Frutiger,Helvetica Neue,Arial,sans-serif"
        ];
        CkEditorProxy.styleSetName = "editorStyleSet";
        return CkEditorProxy;
    }());
    Editor.CkEditorProxy = CkEditorProxy;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    /**
    * A wrapper class for the ckeditor api. The CKEDITOR can only be used inside this class.
    */
    var InlineCkEditorProxy = /** @class */ (function () {
        function InlineCkEditorProxy(eventBroker, ckEditorHelper, plugin, executionContext, customCkEditorConfiguration) {
            var _this = this;
            this.ckeditorSharedResourceAttribute = "ckEditorSharedResource";
            this.ckeditorFocusInternalEventName = "focus";
            this.ckeditorDropEventName = "drop";
            this.id = UniqueId.generate("inlineCkEditorProxy");
            /**
            * Handler of the designer internal 'Selection Changed' event
            */
            this.onSelectionChanged = function (eventArgs) {
                _this.selectedBlockElement = eventArgs.blockElement;
                _this.setEditorFocus(Editor.CommonUtils.getEditorIdFromBlock(eventArgs.blockElement));
            };
            /**
            * Handler of the 'Image Attribute Changed' event
            */
            this.onImageAttributeChanged = function (eventArgs) {
                if (eventArgs.attributeName === Editor.CommonConstants.designerImageSourceAttributeName && eventArgs.imageElement) {
                    _this.ckEditorHelper.setImageAttribute(eventArgs.imageElement, eventArgs.attributeValue);
                }
            };
            /**
            * Handler of the 'HREF Attribute Changed' event
            */
            this.onHrefAttributeChanged = function (eventArgs) {
                _this.ckEditorHelper.setHrefAttribute(eventArgs.element, eventArgs.href);
            };
            /**
            * Handler of the 'Designer Drag Start' event
            */
            this.onDesignerDragStart = function (eventArgs) {
                if (!Object.isNullOrUndefined(eventArgs)) {
                    _this.ckEditorHelper.setToolbarBlur(eventArgs);
                }
            };
            this.onContentModelInitialized = function (eventArgs) {
                _this.documentContentModel = eventArgs.documentContentModel;
            };
            this.resizeEditor = function (height) { };
            this.plugin = plugin;
            this.eventBroker = eventBroker;
            this.ckEditorHelper = ckEditorHelper;
            this.executionContext = executionContext;
            this.customCkEditorConfiguration = customCkEditorConfiguration;
            this.eventBroker.subscribe(Editor.EventConstants.contentModelInitialized, this.onContentModelInitialized);
        }
        /**
        * Returns the instance id.
        */
        InlineCkEditorProxy.prototype.instanceId = function () {
            return this.id;
        };
        /**
        * Initlializes the static ckeditor configuration.
        */
        InlineCkEditorProxy.prototype.init = function (designerFrame, callback) {
            var _this = this;
            this.ckEditorHelper.init(designerFrame, function () {
                _this.executionContext.tryExecute(function () {
                    _this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.selectionChanged, _this.onSelectionChanged);
                    _this.eventBroker.subscribe(Editor.EventConstants.imageAttributeChanged, _this.onImageAttributeChanged);
                    _this.eventBroker.subscribe(Editor.EventConstants.hrefAttributeChanged, _this.onHrefAttributeChanged);
                    _this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.designerDragStart, _this.onDesignerDragStart);
                    _this.registerPlugins();
                    _this.notifyOnCkEditorInstanceInitialized();
                    callback();
                }, "Initialize the inline ckeditor proxy", true);
            }, this.documentContentModel);
        };
        /**
        * Returns promise which identify that ckeditor was initialized
        */
        InlineCkEditorProxy.prototype.getCkEditorInitializedPromise = function () {
            return this.ckEditorHelper.getCkEditorInitializedPromise();
        };
        /**
        * Registers the custom plugins.
        */
        InlineCkEditorProxy.prototype.registerPlugins = function () {
            var _this = this;
            this.ckEditorHelper.registerPlugin(this.plugin, this.eventBroker, function () { return _this.selectedBlockElement; });
        };
        /**
        * Cleans up the specified element from ckeditor dependencies.
        */
        InlineCkEditorProxy.prototype.cleanup = function (content) {
            this.ckEditorHelper.cleanup(content);
        };
        /**
        * Creates the ckeditor inside the html element with the specific editor id.
        * The editor will have inline toolbar.
        * @param editor - The container in which the ckeditor will be created - this id will be also used as the ckeditor editor id.
        */
        InlineCkEditorProxy.prototype.createEditor = function (editor, toolbarConfig) {
            var _this = this;
            var editorInstance = null;
            this.executionContext.tryExecute(function () {
                _this.ckEditorHelper.setEnterMode(editor);
                if (_this.ckEditorHelper.getCkEditor()) {
                    var basicConfig = _this.ckEditorHelper.setupToolbarConfiguration(toolbarConfig);
                    if (_this.customCkEditorConfiguration) {
                        var instanceConfiguration = _this.customCkEditorConfiguration.instanceConfiguration;
                        if (instanceConfiguration) {
                            for (var property in instanceConfiguration) {
                                if (instanceConfiguration.hasOwnProperty(property)) {
                                    basicConfig[property] = instanceConfiguration[property];
                                }
                            }
                        }
                    }
                    editorInstance = _this.ckEditorHelper.getCkEditor().inline(editor.get(0), basicConfig);
                }
            }, "Create inline editor");
            return editorInstance;
        };
        /**
        * Notify when ckeditor instance is initialized.
        */
        InlineCkEditorProxy.prototype.notifyOnCkEditorInstanceInitialized = function () {
            var _this = this;
            var callback = function (editor, eventArgs) {
                editor.on(_this.ckeditorFocusInternalEventName, function (args) {
                    var eventArgs = new Editor.CkEditorFocusEventArgs(); // tslint:disable-line
                    if (args.editor && args.editor.name) {
                        eventArgs.ckEditorInstanceName = args.editor.name;
                        eventArgs.sourceId = _this.instanceId();
                        _this.eventBroker.notify(Editor.DesignerInternalEventConstants.ckEditorFocus, eventArgs);
                    }
                });
                // Disable drop event between different inline editors to prevent ckeditor errors
                editor.on(_this.ckeditorDropEventName, function (evt) {
                    if (evt.data.dataTransfer.sourceEditor && evt.data.dataTransfer.sourceEditor.name !== evt.editor.name) {
                        evt.cancel();
                    }
                });
                _this.eventBroker.notify(Editor.DesignerInternalEventConstants.ckEditorInstanceReadyEvent, eventArgs);
            };
            this.ckEditorHelper.onCkEditorInitialized(this.instanceId(), callback);
        };
        /**
        * Removed the ckeditor from the page.
        * @param editorId - The editor id that should be removed.
        */
        InlineCkEditorProxy.prototype.destroyEditor = function (editorId) {
            this.ckEditorHelper.destroyEditor(editorId);
        };
        /**
        * Removed all ckeditor instances from the page.
        */
        InlineCkEditorProxy.prototype.destroyAllEditors = function () {
            this.ckEditorHelper.destroyAllEditors();
        };
        /**
        * Dispose of all shared resources.
        */
        InlineCkEditorProxy.prototype.dispose = function () {
            this.eventBroker.unsubscribe(Editor.EventConstants.contentModelInitialized, this.onContentModelInitialized);
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.selectionChanged, this.onSelectionChanged);
            this.eventBroker.unsubscribe(Editor.EventConstants.imageAttributeChanged, this.onImageAttributeChanged);
            this.eventBroker.unsubscribe(Editor.EventConstants.hrefAttributeChanged, this.onHrefAttributeChanged);
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerDragStart, this.onDesignerDragStart);
            this.ckEditorHelper.dispose();
        };
        /**
        * Get the content of the editor by its id. The conent is cleaned up - does not contain any ckeditor attributes
        * @param editorId - The editor id
        */
        InlineCkEditorProxy.prototype.getContent = function (editorId) {
            return this.ckEditorHelper.getContent(this.ckEditorHelper.getCkEditorInstance(editorId));
        };
        /**
        * Set the content of the editor by its id. The conent is cleaned up - does not contain any ckeditor attributes
        * @param content - The data, that will setted in the editor
        * @param editorId - The editor id
        * @param callback - The callback
        */
        InlineCkEditorProxy.prototype.setContent = function (content, editorId, callback) {
            return this.ckEditorHelper.setContent(content, this.ckEditorHelper.getCkEditorInstance(editorId), callback);
        };
        /**
        * Set attributes on the ckeditor element
        * @param editorId - The editor id
        */
        InlineCkEditorProxy.prototype.setRequiredAttributes = function (editorId) {
            this.ckEditorHelper.setRequiredAttributes(this.ckEditorHelper.getCkEditorInstance(editorId));
        };
        /**
        * Set the block to read only mode
        * @param editorId - The editor id
        */
        InlineCkEditorProxy.prototype.setReadOnly = function (editorId) {
            this.ckEditorHelper.getCkEditorInstance(editorId).setReadOnly();
        };
        /**
        * Upserts an image in the specific editor
        * @param editorId - The editor id
        * @param selectedHtml - The selected html - either empty or the image to update
        * @param imageData - The image data that should be upserted
        */
        InlineCkEditorProxy.prototype.upsertImage = function (editorId, selectedHtml, imageData, hasAdditionalProperties) {
            var _this = this;
            if (hasAdditionalProperties === void 0) { hasAdditionalProperties = false; }
            this.ckEditorHelper.upsertImage(this.ckEditorHelper.getCkEditorInstance(editorId), selectedHtml, imageData, function (image) {
                _this.eventBroker.notify(Editor.EventConstants.imageAttributeChanged, new Editor.ImageAttributeChangedEventArgs(image, "src", imageData.src, null));
                _this.eventBroker.notify(Editor.EventConstants.imageAttributeChanged, new Editor.ImageAttributeChangedEventArgs(image, "alt", imageData.alt, null));
                _this.ckEditorHelper.setImageAttribute(image, imageData.src);
                _this.notifyContentChanged();
            }, hasAdditionalProperties);
        };
        /**
        * Gets a link from the selected text in the specific editor
        * @param editorId - The editor id
        */
        InlineCkEditorProxy.prototype.getSelectedLink = function (editorId) {
            return this.ckEditorHelper.getSelectedLink(this.ckEditorHelper.getCkEditorInstance(editorId));
        };
        /**
        * Upserts a link in the specific editor
        * @param editorId - The editor id
        * @param linkData - The link data that should be upserted
        */
        InlineCkEditorProxy.prototype.upsertLink = function (editorId, linkData) {
            this.ckEditorHelper.upsertLink(this.ckEditorHelper.getCkEditorInstance(editorId), linkData);
        };
        /**
        * Registers the new image command
        * @param imageCommandName - The name of the new command
        */
        InlineCkEditorProxy.prototype.registerImageCommand = function (imageCommandName) {
            this.ckEditorHelper.registerImageCommand(imageCommandName);
        };
        /**
        * Registers the new link command
        * @param linkCommandName - The name of the new command
        */
        InlineCkEditorProxy.prototype.registerLinkCommand = function (linkCommandName) {
            this.ckEditorHelper.registerLinkCommand(linkCommandName);
        };
        /**
        * Set the focus on the block
        * @param editorId - The editor id
        * @param callback - The callback
        */
        InlineCkEditorProxy.prototype.setEditorFocus = function (editorId, callback) {
            this.ckEditorHelper.setEditorFocus(this.ckEditorHelper.getCkEditorInstance(editorId), callback);
        };
        /**
        * Get the JQuery ckeditor Element
        * @param editorId - The editor id
        */
        InlineCkEditorProxy.prototype.getCkEditorElement = function (editorId) {
            return this.ckEditorHelper.getCkEditorElement(this.ckEditorHelper.getCkEditorInstance(editorId));
        };
        /**
        * Get the CKEditor instance by editorId.
        * @param editorId id of the editor element.
        */
        InlineCkEditorProxy.prototype.getCkEditorInstance = function (editorId) {
            return this.ckEditorHelper.getCkEditorInstance(editorId);
        };
        /**
        * Get the CKEditor id from container.
        * @param container The container with an editor.
        */
        InlineCkEditorProxy.prototype.getCkEditorId = function (container) {
            return this.ckEditorHelper.getCkEditorId(container);
        };
        InlineCkEditorProxy.prototype.notifyContentChanged = function () {
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentChanged);
        };
        /**
        * Gets the child editable element which has the cursor
        * @param editorId - The editor id
        */
        InlineCkEditorProxy.prototype.getChildEditableElementId = function (editorId) {
            return this.ckEditorHelper.getChildEditableElementId(editorId);
        };
        return InlineCkEditorProxy;
    }());
    Editor.InlineCkEditorProxy = InlineCkEditorProxy;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    /**
    * A wrapper class for the ckeditor api. The CKEDITOR can only be used inside this class.
    */
    var StandardCkEditorProxy = /** @class */ (function () {
        function StandardCkEditorProxy(eventBroker, ckEditorHelper, plugin, executionContext, customCkEditorConfiguration) {
            this.id = UniqueId.generate("standardCkEditorProxy");
            this.plugin = null;
            this.editor = null;
            this.ckEditorTopToolbarClassName = "cke_top";
            this.ckEditorBottomToolbarClassName = "cke_bottom";
            this.ckEditorContentsPartClassName = "cke_contents";
            this.eventBroker = eventBroker;
            this.ckEditorHelper = ckEditorHelper;
            this.plugin = plugin;
            this.executionContext = executionContext;
            this.customCkEditorConfiguration = customCkEditorConfiguration;
        }
        /**
        * Returns the instance id.
        */
        StandardCkEditorProxy.prototype.instanceId = function () {
            return this.id;
        };
        /**
        * Initlializes the static ckeditor configuration.
        */
        StandardCkEditorProxy.prototype.init = function (designerFrame, callback) {
            var _this = this;
            this.designerFrame = $(designerFrame);
            // Check the get selection part
            this.ckEditorHelper.init(designerFrame, function () {
                _this.executionContext.tryExecute(function () {
                    _this.registerPlugins();
                    _this.onCkEditorInitialized();
                    callback();
                }, "Initialize the standard ckeditor proxy", true);
            });
        };
        /**
        * Returns promise which identify that ckeditor was initialized
        */
        StandardCkEditorProxy.prototype.getCkEditorInitializedPromise = function () {
            return this.ckEditorHelper.getCkEditorInitializedPromise();
        };
        /**
        * Registers the custom plugins.
        */
        StandardCkEditorProxy.prototype.registerPlugins = function () {
            var _this = this;
            this.ckEditorHelper.registerPlugin(this.plugin, this.eventBroker, function () { return _this.getSelectedElement(); });
            this.plugin.getCommands().forEach(function (command) {
                command.setup(_this.eventBroker);
                if (command instanceof Editor.CkEditorCommand) {
                    var ckEditorCommand = (command);
                    ckEditorCommand.setupCkEditor(_this);
                }
            });
        };
        /**
        * Notify when ckeditor instance is initialized.
        */
        StandardCkEditorProxy.prototype.onCkEditorInitialized = function () {
            var _this = this;
            var callback = function (_, eventArgs) {
                _this.resizeEditor();
                _this.eventBroker.notify(Editor.EventConstants.standardCkEditorInitialized, eventArgs);
            };
            this.ckEditorHelper.onCkEditorInitialized(this.instanceId(), callback);
        };
        /**
        * Cleans up the specified element from ckeditor dependencies.
        */
        StandardCkEditorProxy.prototype.cleanup = function (content) {
            this.ckEditorHelper.cleanup(content);
        };
        /**
        * Creates the ckeditor inside the html element with the specific editor id.
        * The editor will have inline toolbar.
        * @param editor - The container in which the ckeditor will be created - this id will be also used as the ckeditor editor id.
        */
        StandardCkEditorProxy.prototype.createEditor = function (editor, toolbarConfig) {
            var _this = this;
            var basicConfig = {};
            basicConfig["toolbar"] = toolbarConfig.getName();
            basicConfig["toolbar_" + toolbarConfig.getName()] = toolbarConfig.getConfig().filter(function (value) { return value !== "/"; });
            basicConfig["allowedContent"] = true;
            basicConfig["fullPage"] = true;
            basicConfig["resize_enabled"] = false;
            basicConfig["title"] = false;
            CKEDITOR.config.basicEntities = true;
            CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR;
            if (this.customCkEditorConfiguration) {
                var instanceConfiguration = this.customCkEditorConfiguration.instanceConfiguration;
                if (instanceConfiguration) {
                    for (var property in instanceConfiguration) {
                        if (instanceConfiguration.hasOwnProperty(property)) {
                            basicConfig[property] = instanceConfiguration[property];
                        }
                    }
                }
            }
            this.editor = this.ckEditorHelper.getCkEditor().replace(Editor.CommonUtils.getId(editor), basicConfig);
            this.editor.on("change", function () {
                _this.notifyContentChanged();
            });
            return this.editor;
        };
        /**
        * Removes the ckeditor from the page.
        * @param editorId - The editor id that should be removed.
        */
        StandardCkEditorProxy.prototype.destroyEditor = function (editorId) {
            this.ckEditorHelper.destroyEditor(editorId);
        };
        /**
        * Removes all ckeditor instances from the page.
        */
        StandardCkEditorProxy.prototype.destroyAllEditors = function () {
            this.ckEditorHelper.destroyAllEditors();
        };
        /**
        * Dispose of all shared resources.
        */
        StandardCkEditorProxy.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.editor)) {
                this.editor.destroy();
                this.editor = null;
            }
            this.ckEditorHelper.dispose();
            this.designerFrame = null;
        };
        /**
        * Get the content of the editor. The conent is cleaned up - does not contain any ckeditor attributes
        */
        StandardCkEditorProxy.prototype.getContent = function () {
            return this.ckEditorHelper.getContent(this.editor);
        };
        /**
        * Set the content of the editor.
        */
        StandardCkEditorProxy.prototype.setContent = function (content, editorId, callback) {
            this.ckEditorHelper.setContent(content, this.editor, callback);
        };
        /**
        * Set attributes on the ckeditor element
        * @param editorId - The editor id
        */
        StandardCkEditorProxy.prototype.setRequiredAttributes = function (editorId) {
            this.ckEditorHelper.setRequiredAttributes(this.ckEditorHelper.getCkEditorInstance(editorId));
        };
        /**
        * Set the block to read only mode
        * @param editorId - The editor id
        */
        StandardCkEditorProxy.prototype.setReadOnly = function (editorId) {
            this.ckEditorHelper.getCkEditorInstance(editorId).setReadOnly();
        };
        /**
        * Upserts an image in the specific editor
        * @param editorId - The editor id
        * @param selectedHtml - The selected html - either empty or the image to update
        * @param imageData - The image data that should be upserted
        */
        StandardCkEditorProxy.prototype.upsertImage = function (editorId, selectedHtml, imageData, hasAdditionalProperties) {
            var _this = this;
            if (hasAdditionalProperties === void 0) { hasAdditionalProperties = false; }
            this.ckEditorHelper.upsertImage(this.editor, selectedHtml, imageData, function (image) {
                _this.eventBroker.notify(Editor.EventConstants.imageAttributeChanged, new Editor.ImageAttributeChangedEventArgs(image, "src", imageData.src, null));
                _this.ckEditorHelper.setImageAttribute(image, imageData.src);
                _this.notifyContentChanged();
            }, hasAdditionalProperties);
        };
        /**
        * Gets a link from the selected text in the specific editor
        * @param editorId - The editor id
        */
        StandardCkEditorProxy.prototype.getSelectedLink = function (editorId) {
            return this.ckEditorHelper.getSelectedLink(this.editor);
        };
        /**
        * Upserts a link in the specific editor
        * @param editorId - The editor id
        * @param linkData - The link data that should be upserted
        */
        StandardCkEditorProxy.prototype.upsertLink = function (editorId, linkData) {
            this.ckEditorHelper.upsertLink(this.editor, linkData);
        };
        /**
        * Registers the new image command
        * @param imageCommandName - The name of the new command
        */
        StandardCkEditorProxy.prototype.registerImageCommand = function (imageCommandName) {
            this.ckEditorHelper.registerImageCommand(imageCommandName);
        };
        /**
        * Registers the new link command
        * @param linkCommandName - The name of the new command
        */
        StandardCkEditorProxy.prototype.registerLinkCommand = function (linkCommandName) {
            this.ckEditorHelper.registerLinkCommand(linkCommandName);
        };
        /**
        * Set the focus on the block
        * @param editorId - The editor id
        */
        StandardCkEditorProxy.prototype.setEditorFocus = function (editorId, callback) {
            this.ckEditorHelper.setEditorFocus(this.editor, callback);
        };
        StandardCkEditorProxy.prototype.notifyContentChanged = function () {
            this.eventBroker.notify(Editor.EventConstants.fullPageEditorContentChanged);
        };
        /**
        * Get the JQuery ckeditor Element
        * @param editorId - The editor id
        */
        StandardCkEditorProxy.prototype.getCkEditorElement = function (editorId) {
            return this.ckEditorHelper.getCkEditorElement(this.editor);
        };
        /**
        * Get the CKEditor id from container.
        * @param container The container with an editor.
        */
        StandardCkEditorProxy.prototype.getCkEditorId = function (container) {
            return this.ckEditorHelper.getCkEditorId(container);
        };
        /**
        * Get the CKEditor instance by editorId.
        * @param editorId id of the editor element.
        */
        StandardCkEditorProxy.prototype.getCkEditorInstance = function (editorId) {
            return this.ckEditorHelper.getCkEditorInstance(editorId);
        };
        /**
        * Gets the child editable element which has the cursor
        * @param editorId - The editor id
        * @param defaultIdPrefix - The default prefix for id
        */
        StandardCkEditorProxy.prototype.getChildEditableElementId = function (editorId, defaultIdPrefix) {
            var modifiedElementId = null;
            if (!Object.isNullOrUndefined(this.editor.elementPath()) &&
                !Object.isNullOrUndefined(this.editor.elementPath().elements) &&
                this.editor.elementPath().elements.length) {
                var modifiedElements = this.editor.elementPath().elements;
                var lastModifiedElement = $(modifiedElements[modifiedElements.length - 1].$);
                // Set id for the body element to prevent issues with saving changes if the id is empty
                if (lastModifiedElement.is("body") && Object.isNullOrUndefined(lastModifiedElement.attr("id"))) {
                    modifiedElementId = UniqueId.generate(defaultIdPrefix ? defaultIdPrefix : String.Empty);
                    lastModifiedElement.attr("id", modifiedElementId);
                }
                modifiedElements.some(function (element) {
                    modifiedElementId = element.$.id;
                    return !String.isNullOrEmpty(modifiedElementId);
                });
            }
            return modifiedElementId;
        };
        StandardCkEditorProxy.prototype.getSelectedElement = function () {
            var _this = this;
            var selectedElement = $();
            this.executionContext.tryExecute(function () {
                var selection = _this.editor.document.$.getSelection();
                if (selection.rangeCount > 0) {
                    selectedElement = $(selection.getRangeAt(0).commonAncestorContainer);
                    // If the node type is Text node return the it's parent
                    if (selectedElement[0].nodeType === Node.TEXT_NODE) {
                        selectedElement = selectedElement.parent();
                    }
                }
            }, "Get selected element");
            return selectedElement;
        };
        /**
        * Changes editor height in accordance with toolbars height
        * @param - Positive height value, excluding toolbar height.
        */
        StandardCkEditorProxy.prototype.resizeEditor = function (height) {
            if ($(this.designerFrame).is(":visible")) {
                var toolbarsHeight = Editor.CommonUtils.getByClass(this.ckEditorTopToolbarClassName, this.designerFrame.contents()).outerHeight() +
                    Editor.CommonUtils.getByClass(this.ckEditorBottomToolbarClassName, this.designerFrame.contents()).outerHeight();
                var editorHeight = height > 0 ? height : this.designerFrame.contents().innerHeight();
                Editor.CommonUtils.getByClass(this.ckEditorContentsPartClassName, this.designerFrame.contents()).height(editorHeight - toolbarsHeight - 20); // tslint:disable-line
            }
        };
        return StandardCkEditorProxy;
    }());
    Editor.StandardCkEditorProxy = StandardCkEditorProxy;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /**
    * Class to extend/override default ckeditor config.
    */
    var CustomCkEditorConfiguration = /** @class */ (function () {
        /**
         * Custom configuration to extend/override default ckeditor config.
         * @param instanceConfiguration configuration for ckeditor instance, e.g. editorInstance.config.title.
         * @param globalConfiguration global configuration for CKEDITOR, e.g. CKEDITOR.config.extraPlugins.
         * @param ckeditorSettings global CKEDITOR settings, e.g. CKEDITOR.stylesSet.
         */
        function CustomCkEditorConfiguration(instanceConfiguration, // tslint:disable-line
            globalConfiguration, // tslint:disable-line
            ckeditorSettings) {
            this.instanceConfiguration = instanceConfiguration;
            this.globalConfiguration = globalConfiguration;
            this.ckeditorSettings = ckeditorSettings;
        }
        return CustomCkEditorConfiguration;
    }());
    Editor.CustomCkEditorConfiguration = CustomCkEditorConfiguration;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var ComponentLayoutConfiguration = /** @class */ (function () {
        function ComponentLayoutConfiguration() {
        }
        return ComponentLayoutConfiguration;
    }());
    Editor.ComponentLayoutConfiguration = ComponentLayoutConfiguration;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /**
    * Data class that provides the information on how the default layout for the editor control should look like
    */
    var LayoutConfiguration = /** @class */ (function () {
        function LayoutConfiguration() {
        }
        return LayoutConfiguration;
    }());
    Editor.LayoutConfiguration = LayoutConfiguration;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Dictionary = MktSvc.Controls.Common.Dictionary;
    var BasicPlugin = /** @class */ (function () {
        function BasicPlugin(imagePicker) {
            this.textTool = new Editor.TextTool();
            this.imageTool = new Editor.ImageTool();
            this.buttonTool = new Editor.ButtonTool();
            this.dividerTool = new Editor.DividerTool();
            this.textBlock = new Editor.TextBlock();
            this.imageBlock = new Editor.ImageBlock();
            this.buttonBlock = new Editor.ButtonBlock();
            this.dividerBlock = new Editor.DividerBlock();
            this.buttonDetailsViewFactory = new Editor.ButtonDetailsViewFactory();
            var imageGalleryCommand = new Editor.ImageGalleryCommand(imagePicker, new Editor.PopupRenderer());
            this.tools = [this.textTool, this.imageTool, this.dividerTool, this.buttonTool];
            this.toolBlockMapping = new Dictionary();
            this.toolBlockMapping.addOrUpdate(this.textTool.getType(), this.textBlock);
            this.toolBlockMapping.addOrUpdate(this.imageTool.getType(), this.imageBlock);
            this.toolBlockMapping.addOrUpdate(this.buttonTool.getType(), this.buttonBlock);
            this.toolBlockMapping.addOrUpdate(this.dividerBlock.getType(), this.dividerBlock);
            this.blockDetailsViewMapping = new Dictionary();
            var detailsViewControlFactory = new Editor.DetailsViewControlFactory();
            this.blockDetailsViewMapping.addOrUpdate(this.dividerBlock.getType(), new Editor.DividerDetailsView(detailsViewControlFactory.create()));
            this.blockDetailsViewMapping.addOrUpdate(this.imageBlock.getType(), new Editor.ImageDetailsView(detailsViewControlFactory.create(), this.imageBlock));
            this.blockDetailsViewMapping.addOrUpdate(this.buttonBlock.getType(), this.buttonDetailsViewFactory.create(detailsViewControlFactory.create()));
            this.metadataStylesRendererMapping = new MktSvc.Controls.Common.Dictionary();
            var cloneBlockCommand = new Editor.CloneBlockCommand();
            var deleteBlockCommand = new Editor.DeleteBlockCommand();
            var imageBlockCommand = new Editor.ImageGalleryCommand(imagePicker, new Editor.PopupRenderer());
            var dividerAlignButtonsName = [
                Editor.DividerAlignLeftButton.buttonName,
                Editor.DividerAlignCenterButton.buttonName,
                Editor.DividerAlignRightButton.buttonName
            ];
            var dividerAlignLeftCommand = new Editor.DividerAlignCommand("left", "dividerAlignLeftCommand", dividerAlignButtonsName, Editor.DividerAlignLeftButton.buttonName, Editor.DividerAlignCenterButton.buttonName, "center");
            var dividerAlignCenterCommand = new Editor.DividerAlignCommand("center", "dividerAlignCenterCommand", dividerAlignButtonsName, Editor.DividerAlignCenterButton.buttonName, Editor.DividerAlignCenterButton.buttonName, "center");
            var dividerAlignRightCommand = new Editor.DividerAlignCommand("right", "dividerAlignRightCommand", dividerAlignButtonsName, Editor.DividerAlignRightButton.buttonName, Editor.DividerAlignCenterButton.buttonName, "center");
            var dividerheightComand = new Editor.SetDividerHeightCommand();
            var dividerBorderStyleComand = new Editor.SetDividerBorderStyleCommand();
            var moveBlockCommand = new Editor.MoveBlockCommand();
            this.commands = [cloneBlockCommand, deleteBlockCommand, imageGalleryCommand, dividerAlignLeftCommand, dividerAlignCenterCommand, dividerAlignRightCommand, dividerheightComand, dividerBorderStyleComand, moveBlockCommand];
            this.toolbarButtons = [new Editor.CloneBlockButton(cloneBlockCommand),
                new Editor.DeleteBlockButton(deleteBlockCommand),
                new Editor.ImageGalleryButton(imageBlockCommand),
                new Editor.DividerAlignLeftButton(dividerAlignLeftCommand),
                new Editor.DividerAlignCenterButton(dividerAlignCenterCommand),
                new Editor.DividerAlignRightButton(dividerAlignRightCommand),
                new Editor.MoveBlockButton(moveBlockCommand)];
            this.toolbarCombos = [new Editor.DividerHeightCombo(dividerheightComand), new Editor.DividerBorderStyleCombo(dividerBorderStyleComand)];
        }
        BasicPlugin.prototype.getTools = function () {
            return this.tools;
        };
        BasicPlugin.prototype.getToolBlockMapping = function () {
            return this.toolBlockMapping;
        };
        BasicPlugin.prototype.getBlockDetailsViewMapping = function () {
            return this.blockDetailsViewMapping;
        };
        BasicPlugin.prototype.getCommands = function () {
            return this.commands;
        };
        BasicPlugin.prototype.getToolbarButtons = function () {
            return this.toolbarButtons;
        };
        BasicPlugin.prototype.getToolbarCombos = function () {
            return this.toolbarCombos;
        };
        BasicPlugin.prototype.getMetadataStylesRendererMapping = function () {
            return this.metadataStylesRendererMapping;
        };
        return BasicPlugin;
    }());
    Editor.BasicPlugin = BasicPlugin;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var DelayScheduler = MktSvc.Controls.Common.DelayScheduler;
    var KeyboardCommand = MktSvc.Controls.Common.KeyboardCommand;
    var KeyboardKeyCodes = MktSvc.Controls.Common.KeyboardKeyCodes;
    var KeyboardModifierType = MktSvc.Controls.Common.KeyboardModifierType;
    /**
    * Content editor class is responsible for setting the html content and initializing all blocks and containers.
    * This class raises:
    *   - content changed event
    *   - selection changed event
    */
    var DesignerContentEditor = /** @class */ (function (_super) {
        __extends(DesignerContentEditor, _super);
        /**
        * Creates the content editor.
        * @param containerId - An id of a container in which the content editor should be placed.
        * @param eventBroker - A content editor can raise events and subscribe to events using this class.
        * @param blockControllers - A list of block controllers that know how to setup, clean and destroy blocks.
        * @param containerControllers - A list of container controllers that know how to setup, clean and destroy containers.
        * @param blockProvider - A a list of blocks in the content can be get with it.
        * @param containerProvider - A a list of containers in the content can be get with it.
        * @param focusManager - An element focus manager
        * @param keyboardCommandManager - The keyboard command manager
        * @param executionContext - The execution context
        */
        function DesignerContentEditor(containerId, blockControllers, containerControllers, blockProvider, blockDefinition, containerProvider, focusManager, keyboardCommandManager, executionContext, accessibilityInstructions) {
            var _this = _super.call(this, containerId) || this;
            _this.blockControllers = blockControllers;
            _this.containerControllers = containerControllers;
            _this.blockProvider = blockProvider;
            _this.blockDefinition = blockDefinition;
            _this.containerProvider = containerProvider;
            _this.focusManager = focusManager;
            _this.keyboardCommandManager = keyboardCommandManager;
            _this.executionContext = executionContext;
            _this.accessibilityInstructions = accessibilityInstructions;
            _this.resizeTimerDelay = 3500;
            _this.isFullscreen = false;
            _this.isDirty = true;
            _this.onMaximizeExecuted = function (eventArgs) {
                _this.isFullscreen = eventArgs.isFullscreen;
                _this.resizeTimer.schedule();
            };
            _this.onContentModelInitialized = function (eventArgs) {
                _this.documentContentModel = eventArgs.documentContentModel;
            };
            _this.onContentModelUpdated = function () {
                _this.documentContentModel.isDesignerContent() ? _this.keyboardCommandManager.registerCommand(_this.keyboardCommand) : _this.keyboardCommandManager.unregisterCommand(_this.keyboardCommand);
            };
            _this.contentSanitizer = executionContext.getContentSanitizer();
            return _this;
        }
        /**
        * Initializes the designer editor.
        * @param eventBroker - The event broker.
        */
        DesignerContentEditor.prototype.init = function (eventBroker) {
            var _this = this;
            this.eventBroker = eventBroker;
            this.onBlockCleanupRequestedHandler = this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.blockCleanupRequested, function (eventArgs) {
                _this.onBlockCleanupRequested.apply(_this, [eventArgs]);
            });
            this.onBlockAddedHandler = this.eventBroker.subscribe(Editor.EventConstants.blockAdded, function (eventArgs) {
                _this.onBlockAdded.apply(_this, [eventArgs]);
                _this.broadcastContentChanged();
            });
            this.onBlockMovedHandler = this.eventBroker.subscribe(Editor.EventConstants.blockMoved, function (eventArgs) {
                _this.onBlockMoved.call(_this, eventArgs);
                _this.broadcastContentChanged();
            });
            this.onContentBlockChangedHandler = this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.contentBlockChanged, function (eventArgs) { _this.broadcastContentChanged(eventArgs); });
            this.onBlockDeletedHandler = this.eventBroker.subscribe(Editor.EventConstants.blockDeleted, function (eventArgs) {
                _this.onBlockDeleted.apply(_this, [eventArgs]);
                _this.broadcastContentChanged();
            });
            this.onContentChangedHandler = this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.contentChanged, function (eventArgs) {
                _this.broadcastContentChanged(eventArgs);
            });
            this.onContentRefreshedHandler = this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.contentRefreshed, function () { _this.broadcastContentRefreshed(); });
            this.onContentResolvedHandler = this.eventBroker.subscribe(Editor.EventConstants.contentResolved, function (eventArgs) { _this.setContent(eventArgs); });
            this.eventBroker.subscribe(Editor.EventConstants.contentModelInitialized, this.onContentModelInitialized);
            this.eventBroker.subscribe(Editor.EventConstants.maximizeExecuted, this.onMaximizeExecuted);
            this.focusManager.init();
            this.keyboardCommand = new KeyboardCommand(KeyboardKeyCodes.oneKey, [KeyboardModifierType.Alt], function () {
                if (_this.documentContentModel.isDesignerContent()) {
                    $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.tabButtonPreClassName +
                        Editor.CommonConstants.designerTabContentClassName)).focus().click();
                }
            });
            this.resizeTimer = new DelayScheduler(this.eventBroker);
            this.resizeTimer.init(function () {
                _this.setMaxHeightOnDesignerTabContent();
            }, this.resizeTimerDelay);
            this.eventBroker.subscribe(Editor.EventConstants.contentModelUpdated, this.onContentModelUpdated);
        };
        /**
        * Activates the view - the view becomes visible
        */
        DesignerContentEditor.prototype.activate = function () {
            _super.prototype.activate.call(this);
            this.render();
            Editor.AccessibilityInstructionsPopup.accessibilityInstructions = this.accessibilityInstructions ||
                Editor.EditorAccessibilityInstructions.baseDesignerAccessibilityInstructions;
        };
        /**
         * Sets the new editor content
         */
        DesignerContentEditor.prototype.setContent = function (eventArgs) {
            if (this.html === eventArgs.html || eventArgs.sourceId === this.id || eventArgs.originalSourceId === this.id) {
                return;
            }
            this.html = eventArgs.html;
            this.isDirty = true;
            if (!this.isActive) {
                return;
            }
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.controllerReady, this.onControllerReady);
            this.onControllerReady = null;
            this.render();
        };
        DesignerContentEditor.prototype.render = function () {
            var _this = this;
            if (this.isDirty) {
                this.contentSanitizer.init(function () {
                    var editor = _this.getElement();
                    // Dispose the previous content controllers - e.g. ckEditor toolbars setup in the previous render.... othervise, we'll leak memory
                    _this.disposeDesignerIframe();
                    // Render the html content under an iframe
                    var iframe = document.createElement("iframe");
                    var $iframe = $(iframe);
                    $iframe
                        .addClass(Editor.CommonConstants.designerContentEditorFrameClassName)
                        .addClass(Editor.CommonConstants.layoutFrameClassName)
                        .attr("id", Editor.CommonConstants.designerContentEditorFrameId)
                        .attr("title", _this.executionContext.getLocalizationProvider().getLocalizedString("[Designer canvas]"));
                    var designerIframeWrapper = $("<div>").addClass(Editor.CommonConstants.designerContentEditorFrameWrapperClassName);
                    designerIframeWrapper.append($iframe);
                    // Add IOS specific classes and use separate layout for IOS
                    if (Editor.CommonUtils.isIOS()) {
                        designerIframeWrapper.addClass(Editor.CommonConstants.iosScrollClassName);
                        var designerContainer = $("<div>")
                            .addClass(Editor.CommonConstants.designerIosContainerClassName)
                            .addClass(Editor.CommonConstants.iosScrollClassName)
                            .append(designerIframeWrapper);
                        editor.append(designerContainer);
                    }
                    else {
                        editor.append(designerIframeWrapper);
                    }
                    _this.initialHeight = editor.outerHeight(true);
                    if (!_this.onWindowSizeChanged) {
                        // Use arrow function to save current scope
                        $(window).on("resize", _this.onWindowSizeChanged = function () {
                            if (!_this.isFullscreen && _this.getElement().is(":visible")) {
                                _this.initialHeight = _this.getElement().outerHeight(true);
                                _this.setMaxHeightOnDesignerTabContent();
                            }
                        });
                    }
                    var safeDocument = Editor.CommonUtils.getNewContentDocument(Editor.CommonUtils.getWithDoctype("<body></body>"));
                    Editor.CommonUtils.writeFrameContent(iframe, Editor.CommonUtils.getDocumentContent(safeDocument, DesignerContentEditor.safeDocumentDoctype));
                    _this.contentSanitizer.getSanitizedContent(Editor.CommonUtils.getWithDoctype(_this.html), function (sanitized) {
                        _this.executionContext.tryExecute(function () {
                            $(iframe.contentDocument.body).append($(sanitized).children());
                            $(iframe.contentDocument).attr("lang", _this.executionContext.getLocalizationProvider().getLanguageName());
                            $(sanitized).remove();
                            // Init the content controllers
                            var blocks = _this.blockProvider.getBlocks($iframe.contents());
                            var containers = _this.containerProvider.getContainers($iframe.contents());
                            _this.subscribeToControllersReady();
                            _this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerFrameInitialized);
                            _this.containerControllers.each(function (controller) {
                                _this.executionContext.tryExecute(function () {
                                    controller.setupContainers(containers);
                                }, controller.getName() + " setup container", true);
                            });
                            _this.blockControllers.each(function (controller) {
                                _this.executionContext.tryExecute(function () {
                                    controller.setupBlocks(blocks);
                                }, controller.getName() + " setup blocks", true);
                            });
                            // Copy the required designer resources/styles
                            var iframeContents = $iframe.contents();
                            if (Editor.CommonUtils.isIOS()) {
                                iframeContents.find("html").addClass(Editor.CommonConstants.iosScrollClassName);
                                iframeContents.find("body").addClass(Editor.CommonConstants.iosScrollClassName);
                                _this.resizeIFrame(iframe);
                            }
                            Editor.CommonUtils.appendElementToHead(iframeContents, _this.getDesignerStylesElement());
                            Editor.CommonUtils.appendElementToHead(iframeContents, _this.getCustomCkEditorStylesElement());
                            // Notify with view rendered
                            _this.isDirty = false;
                            _this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.xKey, [KeyboardModifierType.Alt], function () {
                                if (_this.isActive && !$(document.activeElement).hasClass(Editor.CommonConstants.designerContentEditorFrameClassName)) {
                                    _this.eventBroker.notify(Editor.EventConstants.onKeypressToFocusPreviousElementCalled);
                                }
                            }));
                            _this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.escapeKeyCode, [], function () {
                                if (Editor.CommonUtils.getByClass(Editor.CommonConstants.selectedSortablePlaceholderClassName, Editor.CommonUtils.getByClass(Editor.CommonConstants.designerContentEditorFrameClassName).contents()).length) {
                                    _this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerAddEnd);
                                }
                            }));
                            _this.keyboardCommandManager.registerCommandsInIframe(iframe);
                        }, "Initialize the designer content editor", true);
                    });
                });
            }
            else {
                this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerReady);
            }
            this.setMaxHeightOnDesignerTabContent();
            this.eventBroker.notify(Editor.EventConstants.controlRendered, new Editor.ControlRenderedEventArgs(this.id));
        };
        DesignerContentEditor.prototype.resizeIFrame = function (iframe) {
            var _this = this;
            if (iframe && iframe.contentDocument) {
                this.applyIFrameHeight(iframe);
            }
            $(iframe).contents().find("img").each(function (index, imageElement) {
                var image = $(imageElement);
                image.off("load");
                image.on("load", function () {
                    _this.applyIFrameHeight(iframe);
                });
            });
        };
        DesignerContentEditor.prototype.resetIFrameHeight = function (iframe) {
            $(iframe).height(String.Empty);
            $(iframe).contents().find("html").height(String.Empty);
            $(iframe).contents().find("body").height(String.Empty);
        };
        DesignerContentEditor.prototype.applyIFrameHeight = function (iframe) {
            var scrollPosition = $("." + Editor.CommonConstants.designerContentEditorFrameWrapperClassName).scrollTop();
            // Reset old height to calculate new value correctly
            this.resetIFrameHeight(iframe);
            var containerHeight = $("." + Editor.CommonConstants.designerControlCssClass).height();
            var containerWidth = $("." + Editor.CommonConstants.designerControlCssClass).width();
            $("." + Editor.CommonConstants.designerIosContainerClassName).height(containerHeight).width(containerWidth);
            var contentHeight = $(iframe).contents().height();
            // Restore scroll position
            $("." + Editor.CommonConstants.designerContentEditorFrameWrapperClassName).scrollTop(scrollPosition);
            var designerFrameOffset = $(iframe).outerHeight() - $(iframe).innerHeight();
            var frameContainerHeight = $("." + Editor.CommonConstants.designerControlCssClass + ":visible").height() - designerFrameOffset;
            if (frameContainerHeight < contentHeight) {
                $(iframe).height(contentHeight);
                $(iframe).contents().find("html").height(contentHeight);
                $(iframe).contents().find("body").height(contentHeight);
            }
            else {
                $(iframe).height(frameContainerHeight);
                $(iframe).contents().find("html").height(contentHeight);
                $(iframe).contents().find("body").height(contentHeight);
            }
        };
        DesignerContentEditor.prototype.disposeDesignerIframe = function () {
            var _this = this;
            // Dispose the previous content controllers - e.g. ckEditor toolbars setup in the previous render.... othervise, we'll leak memory
            var frame = this.getElement().find(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.designerContentEditorFrameClassName)).first();
            // Cleanup the content render the toolbar
            if (frame.length > 0) {
                var blocks_1 = this.blockProvider.getBlocks(frame.contents());
                this.blockControllers.each(function (controller) {
                    _this.executionContext.tryExecute(function () {
                        controller.disposeBlocks(blocks_1);
                    }, controller.getName() + " dispose blocks");
                });
                var containers_1 = this.containerProvider.getContainers(frame.contents());
                this.containerControllers.each(function (controller) {
                    _this.executionContext.tryExecute(function () {
                        controller.disposeContainers(containers_1);
                    }, controller.getName() + " dispose containers");
                });
                this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerFrameDisposed);
                this.keyboardCommandManager.unregisterCommandsInIframe(frame[0]);
                frame.off();
                frame.remove();
                Editor.CommonUtils.getByClass(Editor.CommonConstants.designerIosContainerClassName).remove();
                Editor.CommonUtils.getByClass(Editor.CommonConstants.designerContentEditorFrameWrapperClassName).remove();
            }
        };
        DesignerContentEditor.prototype.onControllerReadyCallback = function (unreadyBlockElements, eventArgs) {
            var index = unreadyBlockElements.indexOf(eventArgs.controllerName);
            if (index !== -1) {
                unreadyBlockElements.splice(index, 1);
            }
            if (unreadyBlockElements.length === 0) {
                this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerReady);
            }
        };
        DesignerContentEditor.prototype.subscribeToControllersReady = function () {
            var _this = this;
            this.controllerNames = [];
            this.containerControllers.each(function (controller) {
                _this.controllerNames.push(controller.getName());
            });
            this.blockControllers.each(function (controller) {
                _this.controllerNames.push(controller.getName());
            });
            if (Object.isNullOrUndefined(this.onControllerReady)) {
                this.onControllerReady = this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.controllerReady, function (eventArgs) {
                    _this.onControllerReadyCallback.apply(_this, [_this.controllerNames, eventArgs]);
                });
            }
        };
        DesignerContentEditor.prototype.broadcastContentChanged = function (originalEventArgs) {
            var eventArgs = new Editor.ContentChangedEventArgs(this.getContent(), this.id, originalEventArgs != null ? originalEventArgs.sourceId : null, Editor.CommonConstants.designerEditorComponentName);
            if (Editor.CommonUtils.isIOS()) {
                this.resizeIFrame($("." + Editor.CommonConstants.designerContentEditorFrameClassName).get(0));
            }
            this.eventBroker.notify(Editor.EventConstants.contentChanged, eventArgs);
        };
        DesignerContentEditor.prototype.broadcastContentRefreshed = function () {
            var eventArgs = new Editor.EventArgs(this.id);
            this.eventBroker.notify(Editor.EventConstants.contentRefreshed, eventArgs);
        };
        /**
        * Gets the editor content
        */
        DesignerContentEditor.prototype.getContent = function () {
            var _this = this;
            var iframe = Editor.CommonUtils.getByClass(Editor.CommonConstants.designerContentEditorFrameClassName)[0];
            if (Object.isNullOrUndefined(iframe)) {
                return String.Empty;
            }
            // Merge the data with the content from the content model
            var tempResolvedDocument = Editor.CommonUtils.getNewContentDocument(this.html);
            Editor.CommonUtils.walkTree($(iframe).contents().children().find("body"), function (nodeInDesigner) {
                var nodeId = nodeInDesigner.attr("id");
                var isDataContainer = !String.isNullUndefinedOrWhitespace(nodeInDesigner.attr(Editor.Contract.containerAttrName));
                var isDataBlock = !String.isNullUndefinedOrWhitespace(nodeInDesigner.attr(Editor.Contract.blockTypeAttrName));
                if (!String.isNullUndefinedOrWhitespace(nodeId) && (isDataBlock || isDataContainer)) {
                    // This is a node which has been set up, so, try to find it in the resolved document and merge the content
                    var nodeInResolvedDocument = Editor.CommonUtils.getById(nodeId, $(tempResolvedDocument).contents());
                    if (nodeInResolvedDocument.length > 0) {
                        nodeInResolvedDocument.html(nodeInDesigner.html());
                    }
                }
            });
            // Cleanup the blocks, containers
            var containers = this.containerProvider.getContainers($(tempResolvedDocument).contents());
            var blocks = this.blockProvider.getBlocks($(tempResolvedDocument).contents());
            this.blockControllers.each(function (controller) {
                _this.executionContext.tryExecute(function () {
                    controller.cleanupBlocks(blocks);
                }, controller.getName() + " cleanup blocks", true);
            });
            this.containerControllers.each(function (controller) {
                _this.executionContext.tryExecute(function () {
                    controller.cleanupContainers(containers);
                }, controller.getName() + " cleanup containers", true);
            });
            return Editor.CommonUtils.getDocumentContent(tempResolvedDocument, Object.isNullOrUndefined(this.documentContentModel) ? String.Empty : this.documentContentModel.getDoctype());
        };
        DesignerContentEditor.prototype.dispose = function () {
            var _this = this;
            this.executionContext.tryExecute(function () {
                _this.disposeDesignerIframe();
                _this.blockControllers.each(function (controller) {
                    _this.executionContext.tryExecute(function () {
                        controller.dispose();
                    }, "Dispose the " + controller.getName());
                });
                _this.containerControllers.each(function (controller) {
                    _this.executionContext.tryExecute(function () {
                        controller.dispose();
                    }, "Dispose the " + controller.getName());
                });
                if (_this.onWindowSizeChanged) {
                    $(window).off("resize", _this.onWindowSizeChanged);
                }
                if (_this.resizeTimer) {
                    _this.resizeTimer.stop(true);
                    _this.resizeTimer.dispose();
                }
                _this.onWindowSizeChanged = null;
                _this.unsubscribeFromEvent(Editor.EventConstants.contentModelInitialized, _this.onContentModelInitialized);
                _this.unsubscribeFromEvent(Editor.EventConstants.blockAdded, _this.onBlockAddedHandler);
                _this.unsubscribeFromEvent(Editor.EventConstants.blockMoved, _this.onBlockMovedHandler);
                _this.unsubscribeFromEvent(Editor.EventConstants.blockDeleted, _this.onBlockDeletedHandler);
                _this.unsubscribeFromEvent(Editor.EventConstants.contentResolved, _this.onContentResolvedHandler);
                _this.unsubscribeFromEvent(Editor.EventConstants.contentModelUpdated, _this.onContentModelUpdated);
                _this.unsubscribeFromEvent(Editor.DesignerInternalEventConstants.contentBlockChanged, _this.onContentBlockChangedHandler);
                _this.unsubscribeFromEvent(Editor.DesignerInternalEventConstants.blockCleanupRequested, _this.onBlockCleanupRequestedHandler);
                _this.unsubscribeFromEvent(Editor.DesignerInternalEventConstants.contentChanged, _this.onContentChangedHandler);
                _this.unsubscribeFromEvent(Editor.DesignerInternalEventConstants.controllerReady, _this.onControllerReady);
                _this.unsubscribeFromEvent(Editor.EventConstants.maximizeExecuted, _this.onMaximizeExecuted);
                _this.focusManager.dispose();
                _this.contentSanitizer.dispose();
                _this.documentContentModel = null;
            }, "Dispose the designer content editor");
        };
        DesignerContentEditor.prototype.unsubscribeFromEvent = function (eventName, delegate) {
            if (!Object.isNullOrUndefined(delegate)) {
                this.eventBroker.unsubscribe(eventName, delegate);
                delegate = null; // tslint:disable-line
            }
        };
        DesignerContentEditor.prototype.onBlockCleanupRequested = function (blockCreatedEventArgs) {
            var _this = this;
            var block = blockCreatedEventArgs.block;
            this.blockControllers.each(function (controller) {
                _this.executionContext.tryExecute(function () {
                    controller.cleanupBlocks(block);
                }, controller.getName() + " cleanup block", true);
            });
            blockCreatedEventArgs.onAfterBlockCleanup(block);
        };
        DesignerContentEditor.prototype.onBlockAdded = function (blockAddedEventArgs) {
            var _this = this;
            var block = blockAddedEventArgs.block;
            this.blockControllers.each(function (controller) {
                _this.executionContext.tryExecute(function () {
                    controller.setupBlocks(blockAddedEventArgs.block);
                }, controller.getName() + " setup blocks", true);
            });
            block.focusin();
        };
        DesignerContentEditor.prototype.onBlockMoved = function (blockMovedEventArgs) {
            // Same solution as in CkEditorProxy, the zero timeout is required or else the element
            // will lose its focus later on in the event chain and the toolbox will not appear.
            setTimeout(function () {
                Editor.BlockProvider.getEditableElement(blockMovedEventArgs.block).focus();
            }, 0);
        };
        DesignerContentEditor.prototype.onBlockDeleted = function (blockDeletedEventArgs) {
            var _this = this;
            this.blockControllers.each(function (controller) {
                _this.executionContext.tryExecute(function () {
                    controller.disposeBlocks(blockDeletedEventArgs.block);
                }, controller.getName() + " dispose blocks");
            });
        };
        /**
         * Custom Control Framework doesn't allow us to load additional resources; we need the styles hardcoded into the product.
         */
        DesignerContentEditor.prototype.getDesignerStylesElement = function () {
            return $("<style>").attr("id", Editor.DesignerContentEditorStyles.designerStylesId).text(Editor.DesignerContentEditorStyles.designerStyles);
        };
        DesignerContentEditor.prototype.setMaxHeightOnDesignerTabContent = function () {
            var designerEditor = this.getElement();
            var designerTabView = designerEditor.siblings(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.designerTabViewCssClass));
            if (this.isFullscreen) {
                designerTabView.css("max-height", String.Empty);
            }
            else {
                var designerTabHeaderHeight = designerEditor.siblings(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.designerTabButtonViewCssClass)).outerHeight(true);
                if (designerTabHeaderHeight !== 0) {
                    designerTabView.css("max-height", this.initialHeight - designerTabHeaderHeight);
                }
            }
            if (Editor.CommonUtils.isIOS()) {
                this.resizeIFrame($("." + Editor.CommonConstants.designerContentEditorFrameClassName).get(0));
            }
        };
        DesignerContentEditor.prototype.getCustomCkEditorStylesElement = function () {
            return $("<style>").attr("id", Editor.DesignerContentEditorStyles.ckEditorStylesId).text(Editor.DesignerContentEditorStyles.ckEditorStyles);
        };
        DesignerContentEditor.safeDocumentDoctype = "<!DOCTYPE html>";
        return DesignerContentEditor;
    }(Editor.Control));
    Editor.DesignerContentEditor = DesignerContentEditor;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var LayoutRenderer = /** @class */ (function () {
        function LayoutRenderer() {
        }
        /**
        * Renders the containers for the editor components
        * @param containerId - The id of the conainer in which the editor will be rendered.
        * @param layoutConfiuration - The layout configuration for the editor.
        */
        LayoutRenderer.prototype.render = function (container, layoutConfiuration) {
            container.addClass(layoutConfiuration.cssClass);
            var tableLayout = $("<table></table>");
            tableLayout.attr("role", "presentation");
            var tableComponentsLayout = $("<tbody></tbody>");
            layoutConfiuration.components.each(function (rowComponent) {
                var rowContainer = $("<tr></tr>");
                rowComponent.each(function (cellComponent) {
                    var componentContainer = $("<td></td>");
                    componentContainer.addClass(cellComponent.cssClass);
                    Editor.CommonUtils.setId(componentContainer, cellComponent.id);
                    rowContainer.append(componentContainer);
                });
                tableComponentsLayout.append(rowContainer);
            });
            tableLayout.append(tableComponentsLayout);
            container.append(tableLayout);
        };
        LayoutRenderer.prototype.dispose = function () { };
        return LayoutRenderer;
    }());
    Editor.LayoutRenderer = LayoutRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="commonreferences.ts" />
var Editor;
(function (Editor) {
    var ComposeControl = /** @class */ (function (_super) {
        __extends(ComposeControl, _super);
        function ComposeControl(id, controls, layoutRenderer, layoutConfiguration) {
            var _this = _super.call(this, id) || this;
            _this.controls = controls;
            _this.layoutRenderer = layoutRenderer;
            _this.layoutConfiguration = layoutConfiguration;
            return _this;
        }
        /**
        * Initializes the view - renders the view and/or attach proper event to render/refresh the view content
        */
        ComposeControl.prototype.init = function (eventBroker) {
            this.layoutRenderer.render(Editor.CommonUtils.getById(this.id), this.layoutConfiguration);
            this.controls.each(function (control) { return control.init(eventBroker); });
        };
        /**
        * Activates the view - the view becomes visible
        */
        ComposeControl.prototype.activate = function () {
            _super.prototype.activate.call(this);
            this.controls.each(function (control) { return control.activate(); });
        };
        /**
        * Dectivates the view - the view becomes invisible
        */
        ComposeControl.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            this.controls.each(function (control) { return control.deactivate(); });
        };
        /**
        * Disposes the object - removes the html from the page, empty the  objects and detach the events
        */
        ComposeControl.prototype.dispose = function () {
            this.controls.each(function (control) { return control.dispose(); });
        };
        return ComposeControl;
    }(Editor.Control));
    Editor.ComposeControl = ComposeControl;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /** Represents data item for the tab control */
    var TabControlItem = /** @class */ (function () {
        /** Initializes a new instance of type TabControlItem
         * @param id - id of the tab
         * @param caption - caption of the tab
         * @param tabContentElementId - id for the content div
         * @param tabContentRenderAction - Tab render action
         * @param tabContentElementCssClass - class name for the tab content element
        */
        function TabControlItem(caption, tabContentElementId, tabContentInitAction, tabContentActivateAction, tabContentDeactivateAction, tabContentDisposeAction, tabContentElementStyle, tabContentElementDataId, enabledOnDefault) {
            if (enabledOnDefault === void 0) { enabledOnDefault = true; }
            this.tabContentElementId = tabContentElementId;
            this.tabContentActivateAction = tabContentActivateAction;
            this.tabContentElementStyle = tabContentElementStyle;
            this.tabContentElementDataId = tabContentElementDataId;
            this.tabContentDisposeAction = tabContentDisposeAction;
            this.tabContentDeactivateAction = tabContentDeactivateAction;
            this.tabContentInitAction = tabContentInitAction;
            this.caption = caption;
            this.enabled = enabledOnDefault;
        }
        /** Initializes the control. */
        TabControlItem.prototype.init = function () {
            this.tabContentInitAction();
        };
        /** Activates the control. */
        TabControlItem.prototype.activate = function () {
            this.tabContentActivateAction();
        };
        /** Enable the tab item */
        TabControlItem.prototype.enable = function () {
            this.enabled = true;
        };
        /** Disable the tab item */
        TabControlItem.prototype.disable = function () {
            this.enabled = false;
        };
        /** Get the enabled status */
        TabControlItem.prototype.isEnabled = function () {
            return this.enabled;
        };
        /** Deactivates the control. */
        TabControlItem.prototype.deactivate = function () {
            this.tabContentDeactivateAction();
        };
        /** Disposes the control. */
        TabControlItem.prototype.dispose = function () {
            this.tabContentDisposeAction();
        };
        return TabControlItem;
    }());
    Editor.TabControlItem = TabControlItem;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var KeyCodes = MktSvc.Controls.Common.KeyCodes;
    /** Represents the tab control on the right pane */
    var TabControl = /** @class */ (function (_super) {
        __extends(TabControl, _super);
        /** Initializes a new instance of type
        * @param element - parent element
        */
        function TabControl(elementId, tabItems, executionContext, tabButtonsContainerId, tabVisibilityManager, internalTabulationEnabled, onTabActivate) {
            if (internalTabulationEnabled === void 0) { internalTabulationEnabled = true; }
            if (onTabActivate === void 0) { onTabActivate = null; }
            var _this = _super.call(this, elementId) || this;
            _this.internalTabulationEnabled = internalTabulationEnabled;
            _this.onTabActivate = onTabActivate;
            /** Tab panels */
            _this.tabsPanels = [];
            _this.activateRenderedControlTab = function (eventArgs) {
                var panelId = eventArgs.viewId;
                if (_this.tabItems.where(function (t) { return t.tabContentElementId === panelId; }).count() === 0) {
                    return;
                }
                _this.activateTabById(panelId);
            };
            _this.updateTabVisibility = function () {
                _this.tabItems.each(function (tabItem) {
                    tabItem.isEnabled() ? _this.showTab(tabItem) : _this.hideTab(tabItem);
                });
                if (!_this.selectedTabIsVisible()) {
                    _this.activateTabById(_this.getFirstVisibleTab().tabContentElementId);
                }
            };
            _this.tabItems = tabItems;
            _this.executionContext = executionContext;
            if (!Object.isNullOrUndefined(tabButtonsContainerId)) {
                _this.tabButtonsContainerId = tabButtonsContainerId;
            }
            if (!Object.isNullOrUndefined(tabVisibilityManager)) {
                _this.tabVisibilityManager = tabVisibilityManager;
            }
            return _this;
        }
        /** Renders the tab control */
        TabControl.prototype.init = function (eventBroker) {
            var _this = this;
            if (!Object.isNullOrUndefined(this.tabVisibilityManager)) {
                this.tabVisibilityManager.init(this.updateTabVisibility);
            }
            this.eventBroker = eventBroker;
            this.renderContainer();
            this.initializeControl();
            this.tabs.on(TabControl.tabActivatedEventName, function (event, ui) {
                _this.activateSelectedTab(event, ui);
            });
            if (Editor.CommonUtils.isVisible(this.getElement())) {
                this.activateFirstTab();
            }
            eventBroker.subscribe(Editor.EventConstants.controlRendered, this.activateRenderedControlTab);
            if (!this.onFocusFirstElement) {
                eventBroker.subscribe(Editor.DesignerInternalEventConstants.designerReady, this.onFocusFirstElement = function () {
                    if (_this.executionContext.isFocused()) {
                        _this.focusFirstElement();
                    }
                });
            }
        };
        /**
        * Activates the view - the view becomes visible
        */
        TabControl.prototype.activate = function () {
            _super.prototype.activate.call(this);
            var selectedTabIndex = this.getSelectedTabIndex();
            this.tabItems.each(function (item, index) {
                if (index === selectedTabIndex) {
                    item.activate();
                }
                else {
                    item.deactivate();
                }
            });
        };
        /**
        * Dectivates the view - the view becomes invisible
        */
        TabControl.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            this.tabItems.each(function (item) {
                item.deactivate();
            });
        };
        /** Dispose */
        TabControl.prototype.dispose = function () {
            var _this = this;
            this.executionContext.tryExecute(function () {
                if (_this.eventBroker) {
                    _this.eventBroker.unsubscribe(Editor.EventConstants.controlRendered, _this.activateRenderedControlTab);
                    if (_this.onFocusFirstElement) {
                        _this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerReady, _this.onFocusFirstElement);
                    }
                }
                _this.onFocusFirstElement = null;
                _this.tabItems.each(function (tabItem) {
                    tabItem.dispose();
                });
                if (_this.tabs) {
                    _this.tabs.tabs("destroy");
                    _this.tabs.off();
                    if (_this.tabsContainer) {
                        _this.tabsContainer.removeData();
                        _this.tabsContainer.remove();
                        _this.tabsContainer = null;
                    }
                    if (_this.tabsPanels) {
                        for (var i = 0; i < _this.tabsPanels.length; i++) {
                            _this.tabsPanels[i].remove();
                            _this.tabsPanels[i] = null;
                        }
                        _this.tabsPanels = [];
                    }
                    _this.getElement().empty();
                    _this.tabs.remove();
                    _this.tabs = null;
                    _this.tabItems = null;
                }
            }, "Dispose the tabs");
        };
        /** the arrow key navigation should behave as the following:
           - by using arrow keys we only move throygh the tabs (without activating the tab that we focus on)
           - only when we press enter we activate the selected tab */
        TabControl.prototype.setupKeyboardNavigation = function (element) {
            var _this = this;
            element.on("keydown", function (e) {
                var keyPressed = e.which || e.keyCode;
                var nextElement;
                if (_this.internalTabulationEnabled && keyPressed === KeyCodes.Tab && e.shiftKey) {
                    nextElement = element.length === 0 ? _this.tabsContainer.children("li").last() : element.prevAll(":visible").first();
                    if (nextElement.length === 0) {
                        return;
                    }
                    else {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        _this.focusNextElement(nextElement);
                        return;
                    }
                }
                if (_this.internalTabulationEnabled && keyPressed === KeyCodes.Tab) {
                    nextElement = element.length === 0 ? _this.tabsContainer.children("li").first() : element.nextAll(":visible").first();
                    if (nextElement.length === 0) {
                        return;
                    }
                    else {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        _this.focusNextElement(nextElement);
                        return;
                    }
                }
                if (keyPressed === KeyCodes.Up || keyPressed === KeyCodes.Down || keyPressed === KeyCodes.Left || keyPressed === KeyCodes.Right) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                }
                if (keyPressed === KeyCodes.Up || keyPressed === KeyCodes.Left) {
                    nextElement = element.length === 0 ? _this.tabsContainer.children("li").last() : element.prevAll(":visible").first();
                    _this.focusNextElement(nextElement);
                    return;
                }
                if (keyPressed === KeyCodes.Right || keyPressed === KeyCodes.Down) {
                    nextElement = element.length === 0 ? _this.tabsContainer.children("li").first() : element.nextAll(":visible").first();
                    _this.focusNextElement(nextElement);
                    return;
                }
                if (keyPressed === KeyCodes.Enter) {
                    element.children(TabControl.designerTabContainerSelector).click();
                }
            });
        };
        TabControl.prototype.focusNextElement = function (nextElement) {
            if (Editor.CommonUtils.isEdge()) {
                nextElement.children("." + Editor.CommonConstants.designerTabContainer).focus();
            }
            else {
                nextElement.focus();
            }
        };
        TabControl.prototype.renderContainer = function () {
            var container = this.getElement();
            container.hide();
            this.tabsContainer = $("<ul>");
            this.tabsPanels = this.renderTabsPanel();
            container.append(this.tabsContainer);
            container.append(this.tabsPanels);
        };
        TabControl.prototype.initializeControl = function () {
            var _this = this;
            this.tabs = this.getElement().tabs();
            if (!Object.isNullOrUndefined(this.tabButtonsContainerId)) {
                // Moves the tabs container to the tabButtons container after initialization the tabs.
                Editor.CommonUtils.getById(this.tabButtonsContainerId).append(this.tabsContainer);
            }
            this.getElement().show();
            this.tabItems.each(function (tabItem) {
                if (!Object.isNullOrUndefined(_this.tabVisibilityManager)) {
                    _this.hideTab(tabItem);
                }
                tabItem.init();
            });
        };
        TabControl.prototype.activateSelectedTab = function (event, ui) {
            var activatedPanel = ui.newPanel;
            var panelId = activatedPanel.attr("id");
            // TODO: This is a quick around as the tabsactivate was fired twice for different tabs. We need a proper fix for it.
            if (this.tabItems.where(function (t) { return t.tabContentElementId === panelId; }).count() === 0) {
                return;
            }
            this.tabItems
                .each(function (tabItem) {
                if (tabItem.tabContentElementId === panelId) {
                    tabItem.activate();
                }
                else {
                    tabItem.deactivate();
                }
            });
            this.eventBroker.notify(Editor.TabControlEventConstants.tabsStateUpdated);
        };
        TabControl.prototype.activateTabById = function (id) {
            var _this = this;
            var index = this.getTabButton(id).index();
            if (index !== -1) {
                this.tabs.tabs({
                    activate: function (_, ui) {
                        if (_this.onTabActivate != null) {
                            _this.onTabActivate(ui.newPanel);
                        }
                    },
                    active: index,
                });
            }
        };
        TabControl.prototype.renderTabsPanel = function () {
            var _this = this;
            var tabsPanels = [];
            var tabItemRepresentations = [];
            this.tabItems.each(function (currentItem, index) {
                var tabItemRepresentation = $("<li/>");
                var anchor = $("<a/>");
                anchor.attr("href", "#" + currentItem.tabContentElementId);
                if (currentItem.tabContentElementDataId && currentItem.tabContentElementDataId !== "") {
                    anchor.attr(Editor.Contract.dataIdAttrName, currentItem.tabContentElementDataId);
                }
                // We hide the anchor tag because giving it focus causes
                // Windows Narrator to treat it as a URL (correctly), which is
                // undesirable because it reads out the entire URL.
                anchor.addClass(Editor.CommonConstants.designerTabAnchor);
                var fauxTab = $("<div/>");
                fauxTab.attr("role", "tab");
                // On IE, we give the inner div the focus to prevent issues
                // with narrator blocking the OnEnter event when the li element
                // is focused. This is required to allow the div to
                // recieve focus.
                fauxTab.attr("tabindex", "-1");
                fauxTab.addClass(Editor.CommonConstants.designerTabContainer);
                fauxTab.click(function (event) {
                    _this.activateTabById(currentItem.tabContentElementId);
                });
                var span = $("<span/>");
                span.addClass(Editor.CommonConstants.designerTabPaneLabel + " ellipsis");
                fauxTab.append(span);
                tabItemRepresentation.append(fauxTab);
                tabItemRepresentation.append(anchor);
                if (index == 0) {
                    fauxTab.attr("aria-selected", "true");
                    tabItemRepresentation.attr("aria-selected", "true");
                }
                tabItemRepresentation.find("." + Editor.CommonConstants.designerTabPaneLabel)
                    .attr("title", currentItem.caption).text(currentItem.caption);
                tabItemRepresentation.on("click", function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    tabItemRepresentations.forEach(function (tabItemRep) {
                        tabItemRep.attr("aria-selected", "false");
                        tabItemRep.children("." + Editor.CommonConstants.designerTabContainer).attr("aria-selected", "false");
                    });
                    fauxTab.attr("aria-selected", "true");
                    tabItemRepresentation.attr("aria-selected", "true");
                });
                tabItemRepresentations.push(tabItemRepresentation);
                _this.setupKeyboardNavigation(tabItemRepresentation);
                _this.tabsContainer.append(tabItemRepresentation);
                var divContainer = $('<div id="' + currentItem.tabContentElementId + '"></div>');
                if (currentItem.tabContentElementStyle) {
                    tabItemRepresentation.find("div").addClass(Editor.CommonConstants.tabButtonPreClassName + currentItem.tabContentElementStyle);
                    divContainer.addClass(currentItem.tabContentElementStyle);
                }
                tabsPanels.push(divContainer);
            });
            return tabsPanels;
        };
        TabControl.prototype.activateFirstTab = function () {
            var firstTab = this.tabItems.firstOrDefault();
            if (!Object.isNullOrUndefined(firstTab)) {
                firstTab.activate();
            }
        };
        TabControl.prototype.showTab = function (tabItem) {
            var tabButton = this.getTabButton(tabItem.tabContentElementId);
            var index = tabButton.index();
            if (index !== -1) {
                if (index === this.getSelectedTabIndex()) {
                    Editor.CommonUtils.getById(tabItem.tabContentElementId).show();
                }
                tabButton.show();
            }
        };
        TabControl.prototype.hideTab = function (tabItem) {
            var tabButton = this.getTabButton(tabItem.tabContentElementId);
            var index = tabButton.index();
            if (index !== -1) {
                Editor.CommonUtils.getById(tabItem.tabContentElementId).hide();
                tabButton.hide();
            }
        };
        TabControl.prototype.getTabButton = function (id) {
            return $(String.Format("[aria-controls={0}]", id));
        };
        TabControl.prototype.getSelectedTabIndex = function () {
            return this.tabs.tabs("option", "active");
        };
        TabControl.prototype.selectedTabIsVisible = function () {
            return this.tabItems.items()[this.getSelectedTabIndex()].isEnabled();
        };
        TabControl.prototype.getTabIndex = function (id) {
            return this.getTabButton(id).index();
        };
        TabControl.prototype.getFirstVisibleTab = function () {
            var visibleTabs = [];
            this.tabItems.each(function (tabItem) {
                if (tabItem.isEnabled()) {
                    visibleTabs.push(tabItem);
                }
            });
            return visibleTabs[0];
        };
        TabControl.prototype.focusFirstElement = function () {
            // Focus on first visible tab
            var firstVisibleElement = this.tabsContainer.find("li:visible:first a");
            // If first visible element exist and current tabs is menu bar tabs then focus the first element
            if (firstVisibleElement.length !== 0 && this.tabsContainer.parent().is(".menuBar")) {
                $(firstVisibleElement).focus();
                this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerReady, this.onFocusFirstElement);
                this.onFocusFirstElement = null;
            }
        };
        TabControl.tabActivatedEventName = "tabsactivate";
        TabControl.designerTabContainerSelector = "." + Editor.CommonConstants.designerTabContainer;
        return TabControl;
    }(Editor.Control));
    Editor.TabControl = TabControl;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    /** Data class for the image element */
    var ImageData = /** @class */ (function () {
        function ImageData() {
        }
        return ImageData;
    }());
    Editor.ImageData = ImageData;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    /** Data class for the link element */
    var LinkData = /** @class */ (function () {
        function LinkData() {
        }
        LinkData.prototype.getAttributes = function () {
            return {
                href: this.href,
                target: this.target
            };
        };
        return LinkData;
    }());
    Editor.LinkData = LinkData;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var DelayScheduler = MktSvc.Controls.Common.DelayScheduler;
    var KeyboardCommand = MktSvc.Controls.Common.KeyboardCommand;
    var KeyboardKeyCodes = MktSvc.Controls.Common.KeyboardKeyCodes;
    var KeyboardModifierType = MktSvc.Controls.Common.KeyboardModifierType;
    /**
    * Editor control class that is responsible for putting all components together (views - property, styles, toolbox, content editor).
    */
    var EditorControl = /** @class */ (function () {
        function EditorControl(executionContext, layoutRenderer, layoutConfiguration, controls, eventBroker, editorContentModel, keyboardCommandManager, undoRedoManager, accessibilityInstructionsPopup, externalFocusElements) {
            var _this = this;
            this.isFullscreen = false;
            this.externalFocusElements = ["#closeButton"];
            this.onMaximizeExecuted = function (eventArgs) {
                _this.isFullscreen = eventArgs.isFullscreen;
            };
            this.controls = controls;
            this.layoutRenderer = layoutRenderer;
            this.layoutConfiguration = layoutConfiguration;
            this.eventBroker = eventBroker;
            this.undoRedoManager = undoRedoManager;
            this.editorContentModel = editorContentModel;
            this.keyboardCommandManager = keyboardCommandManager;
            this.executionContext = executionContext;
            this.accessibilityInstructionsPopup = accessibilityInstructionsPopup;
            Editor.CommonUtils.localizationProvider = executionContext.getLocalizationProvider();
            DelayScheduler.defaultSchedulerDelay = executionContext.getDelaySchedulerTime();
            if (externalFocusElements) {
                this.externalFocusElements = this.externalFocusElements.concat(externalFocusElements);
            }
        }
        EditorControl.prototype.init = function (container) {
            var _this = this;
            this.container = container;
            this.keyboardCommandManager.init(container);
            this.layoutRenderer.render(container, this.layoutConfiguration);
            this.controls.each(function (control) { return control.init(_this.eventBroker); });
            this.editorContentModel.init();
            this.undoRedoManager.init(this);
            this.regsterGlobalShortcuts();
            this.registerGlobalKeyEvent();
            this.eventBroker.subscribe(Editor.EventConstants.maximizeExecuted, this.onMaximizeExecuted);
            if (Editor.CommonUtils.isIOS() && Object.isNullOrUndefined(this.onEditorVisibilityChanged)) {
                this.eventBroker.subscribe(Editor.EventConstants.editorVisibilityChanged, this.onEditorVisibilityChanged = function (eventArgs) {
                    if (eventArgs.isVisible) {
                        // Trigger click on IOS to prevent issue with page reloading after clicking on JQueryUI tab elements.
                        _this.container.click();
                        _this.eventBroker.unsubscribe(Editor.EventConstants.editorVisibilityChanged, _this.onEditorVisibilityChanged);
                    }
                });
            }
        };
        EditorControl.prototype.setContent = function (content, sourceId) {
            var _this = this;
            this.editorContentModel.setContent(content, sourceId, "editorControl", function (isContentChanged) {
                if (isContentChanged) {
                    var eventArgs = new Editor.ContentChangedEventArgs(content, sourceId);
                    _this.eventBroker.notify(Editor.EventConstants.contentChanged, eventArgs);
                }
            });
        };
        EditorControl.prototype.getContent = function () {
            return this.editorContentModel.getContent();
        };
        EditorControl.prototype.getEventBroker = function () {
            return this.eventBroker;
        };
        EditorControl.prototype.regsterGlobalShortcuts = function () {
            var _this = this;
            this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.zeroKey, [KeyboardModifierType.Alt], function () {
                _this.accessibilityInstructionsPopup.show();
            }));
        };
        EditorControl.prototype.registerGlobalKeyEvent = function () {
            var _this = this;
            if (!this.onKeyUpEventFired) {
                $(document).on("keyup", this.onKeyUpEventFired = function (event) {
                    // Set focus inside control if editor in full screen mode and active element outside the editor control
                    if (_this.isFullscreen &&
                        event.keyCode === MktSvc.Controls.Common.KeyCodes.Tab &&
                        !_this.isActiveElementInsideControl() &&
                        !_this.externalFocusElements.some(function (selector) { return $(document.activeElement).is(selector); })) {
                        if (event.shiftKey) {
                            _this.getTabbableElements().last().focus();
                        }
                        else {
                            _this.getTabbableElements().first().focus();
                        }
                    }
                });
            }
        };
        EditorControl.prototype.isActiveElementInsideControl = function () {
            return this.container.has(document.activeElement).length > 0;
        };
        EditorControl.prototype.getTabbableElements = function () {
            return this.container.find(":tabbable");
        };
        EditorControl.prototype.dispose = function () {
            var _this = this;
            this.executionContext.tryExecute(function () {
                if (_this.onEditorVisibilityChanged) {
                    _this.eventBroker.unsubscribe(Editor.EventConstants.editorVisibilityChanged, _this.onEditorVisibilityChanged);
                }
                if (_this.onKeyUpEventFired) {
                    $(document).off("keyup", _this.onKeyUpEventFired);
                }
                _this.eventBroker.unsubscribe(Editor.EventConstants.maximizeExecuted, _this.onMaximizeExecuted);
                _this.accessibilityInstructionsPopup.dispose();
                _this.layoutRenderer.dispose();
                _this.controls.each(function (control) { return control.dispose(); });
                _this.undoRedoManager.dispose();
                _this.editorContentModel.dispose();
                _this.keyboardCommandManager.dispose();
                _this.eventBroker.dispose();
            }, "Dispose the editor control");
            this.executionContext.dispose();
            if (this.container) {
                this.container.empty();
            }
            this.container = null;
            this.controls = null;
            this.layoutRenderer = null;
            this.layoutConfiguration = null;
            this.undoRedoManager = null;
            this.editorContentModel = null;
            this.keyboardCommandManager = null;
            this.eventBroker = null;
            this.executionContext = null;
            this.onEditorVisibilityChanged = null;
            this.onKeyUpEventFired = null;
        };
        EditorControl.editorContolInitCollection = "Editor Init";
        return EditorControl;
    }());
    Editor.EditorControl = EditorControl;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var OfflineNotSupportedPreviewView = /** @class */ (function (_super) {
        __extends(OfflineNotSupportedPreviewView, _super);
        function OfflineNotSupportedPreviewView(previewContainerId) {
            var _this = _super.call(this, previewContainerId) || this;
            _this.id = previewContainerId;
            return _this;
        }
        OfflineNotSupportedPreviewView.prototype.init = function () {
        };
        OfflineNotSupportedPreviewView.prototype.activate = function () {
            _super.prototype.activate.call(this);
            this.render();
        };
        OfflineNotSupportedPreviewView.prototype.dispose = function () {
            this.getElement().empty();
        };
        OfflineNotSupportedPreviewView.prototype.render = function () {
            if (this.isActive) {
                var element = this.getElement().empty();
                var offlineErrorMessageContainer = $("<p>").text(Editor.CommonUtils.getOfflineLocalizedString(OfflineNotSupportedPreviewView.offlineErrorMessage)).addClass(Editor.CommonConstants.editorReadonlyTitleClassName);
                element.append(offlineErrorMessageContainer);
            }
        };
        OfflineNotSupportedPreviewView.offlineErrorMessage = "[OfflineErrorMessage]";
        return OfflineNotSupportedPreviewView;
    }(Editor.Control));
    Editor.OfflineNotSupportedPreviewView = OfflineNotSupportedPreviewView;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var OfflineBrowserPreviewView = /** @class */ (function (_super) {
        __extends(OfflineBrowserPreviewView, _super);
        function OfflineBrowserPreviewView(previewContainerId, executionContext) {
            var _this = _super.call(this, previewContainerId) || this;
            _this.isDirty = true;
            _this.previewResizePostMessageDelay = 100;
            _this.contentChangedHandler = function (eventArgs) {
                if (_this.html === eventArgs.html) {
                    return;
                }
                _this.getElement().empty();
                _this.setContent(eventArgs.html);
            };
            _this.id = previewContainerId;
            _this.executionContext = executionContext;
            _this.contentSanitizer = executionContext.getContentSanitizer();
            return _this;
        }
        OfflineBrowserPreviewView.prototype.init = function (eventBroker) {
            this.eventBroker = eventBroker;
            this.eventBroker.subscribe(Editor.EventConstants.contentResolved, this.contentChangedHandler);
        };
        OfflineBrowserPreviewView.prototype.activate = function () {
            _super.prototype.activate.call(this);
            this.render();
        };
        OfflineBrowserPreviewView.prototype.dispose = function () {
            if (this.eventBroker) {
                this.eventBroker.unsubscribe(Editor.EventConstants.contentResolved, this.contentChangedHandler);
            }
            $(window).off("resize", this.setPreviewContentSize);
            $(this.iframe).off();
            $(this.iframe).remove();
            this.iframe = null;
            this.getElement().empty();
        };
        OfflineBrowserPreviewView.prototype.setContent = function (html) {
            this.html = html;
            this.refreshView();
        };
        OfflineBrowserPreviewView.prototype.render = function () {
            if (this.isActive && this.isDirty) {
                this.setupContent(this.html);
            }
        };
        OfflineBrowserPreviewView.prototype.onContentSetupCompleted = function () {
            this.isDirty = false;
            this.eventBroker.notify(Editor.EventConstants.controlRendered, new Editor.ControlRenderedEventArgs(this.id));
        };
        OfflineBrowserPreviewView.prototype.setupContent = function (content) {
            var _this = this;
            var element = this.getElement().empty();
            var iframe = document.createElement("iframe");
            $(iframe).addClass(Editor.BrowserPreviewConstants.browserPreviewFrameClassName)
                .addClass(Editor.BrowserPreviewConstants.tabletPortraitPreviewCssClass);
            var frameContainer = $("<div>").addClass(Editor.BrowserPreviewConstants.browserPreviewFrameContainerCssClass)
                .addClass(Editor.BrowserPreviewConstants.tabletPortraitPreviewCssClass)
                .addClass(Editor.BrowserPreviewConstants.lightweightMode);
            var frameBorder = $("<div>").addClass(Editor.BrowserPreviewConstants.browserPreviewFrameBorderClassName)
                .addClass(Editor.BrowserPreviewConstants.tabletPortraitPreviewCssClass);
            Editor.CommonUtils.setTabIndex(frameBorder, 0);
            if (Editor.CommonUtils.isIOS()) {
                frameContainer.addClass(Editor.CommonConstants.iosScrollClassName);
            }
            var previewContent = $("<div>").addClass(Editor.BrowserPreviewConstants.browserPreviewContentCssClass);
            var contentWarning = $("<span>")
                .addClass(Editor.BrowserPreviewConstants.browserPreviewContentTitleCssClass)
                .addClass(Editor.BrowserPreviewConstants.browserPreviewContentTitleWarningCssClass)
                .text(Editor.CommonUtils.getOfflineLocalizedString(OfflineBrowserPreviewView.offlineWarningMessage));
            frameContainer.append(frameBorder);
            previewContent.append(contentWarning);
            previewContent.append(frameContainer);
            element.append(previewContent);
            frameBorder.append($(iframe));
            $(window).on("resize", this.setPreviewContentSize);
            this.setPreviewContentSize();
            var isRtl = this.executionContext.getLocalizationProvider().isRtl();
            this.contentSanitizer.init(function () {
                _this.contentSanitizer.getSanitizedContent(content, function (sanitized) {
                    var contentFrame = Editor.CommonUtils.getByClass(Editor.BrowserPreviewConstants.browserPreviewFrameClassName).get(0);
                    if (contentFrame) {
                        Editor.CommonUtils.writeFrameContent(contentFrame, sanitized.html());
                        contentFrame.tabIndex = -1;
                        $(sanitized).remove();
                        if (isRtl) {
                            Editor.CommonUtils.getBySelector("html", $(iframe).contents()).attr("dir", "rtl");
                        }
                        setTimeout(function () {
                            if (_this.iframe && _this.iframe.contentDocument && _this.iframe.contentDocument.body) {
                                var contentHeight = _this.iframe.contentDocument.body.getClientRects()[0].top +
                                    _this.iframe.contentDocument.body.getClientRects()[0].bottom;
                                _this.resizeIframe(contentHeight);
                            }
                        }, _this.previewResizePostMessageDelay);
                        // Timeout needed for IE and Edge, because sometimes "load" event fired when content height is not calculated
                        $(_this.iframe).contents().find("img").each(function (index, image) {
                            $(image).one("load", function () {
                                var contentHeight = _this.iframe.contentDocument.body.getClientRects()[0].top + _this.iframe.contentDocument.body.getClientRects()[0].bottom;
                                _this.resizeIframe(contentHeight);
                            });
                        });
                        _this.onContentSetupCompleted();
                    }
                });
            });
        };
        OfflineBrowserPreviewView.prototype.setPreviewContentSize = function () {
            var frameContainer = $("." + Editor.BrowserPreviewConstants.browserPreviewFrameContainerCssClass + ":visible");
            var contentTitle = $("." + Editor.BrowserPreviewConstants.browserPreviewContentTitleCssClass + ":visible");
            if (frameContainer.length) {
                // Change title width manually (required for IE)
                contentTitle.width(frameContainer.width() - 50); // tslint:disable-line
            }
        };
        OfflineBrowserPreviewView.prototype.resizeIframe = function (contentHeight) {
            if (contentHeight === $(this.iframe).height()) {
                return;
            }
            var browserPreviewFrameBorder = $("." + Editor.BrowserPreviewConstants.browserPreviewFrameBorderClassName + ":visible");
            // PreviewFrameBorder padding + PreviewFrameBorder border height + iframe border height
            var previewFrameOffset = (browserPreviewFrameBorder.innerHeight() - browserPreviewFrameBorder.height()) +
                (browserPreviewFrameBorder.outerHeight() - browserPreviewFrameBorder.innerHeight()) +
                ($(this.iframe).outerHeight() - $(this.iframe).innerHeight());
            var frameContainerHeight = $("." + Editor.BrowserPreviewConstants.browserPreviewFrameContainerCssClass + ":visible").height() - previewFrameOffset;
            if (frameContainerHeight < contentHeight) {
                $(this.iframe).height(contentHeight);
            }
            else {
                $(this.iframe).height(frameContainerHeight);
            }
        };
        OfflineBrowserPreviewView.prototype.refreshView = function () {
            this.isDirty = true;
            if (this.isActive) {
                this.render();
            }
        };
        OfflineBrowserPreviewView.offlineWarningMessage = "[OfflineWarningMessage]";
        return OfflineBrowserPreviewView;
    }(Editor.Control));
    Editor.OfflineBrowserPreviewView = OfflineBrowserPreviewView;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var HeaderItemDescription = /** @class */ (function () {
        function HeaderItemDescription(title, icons) {
            this.titleDescription = title;
            this.icons = icons;
        }
        return HeaderItemDescription;
    }());
    Editor.HeaderItemDescription = HeaderItemDescription;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var IconDescription = /** @class */ (function () {
        function IconDescription(src, cssClass, cssClassForIframe, altTextForImage, title) {
            this.src = src;
            this.cssClass = cssClass;
            this.cssClassForIframe = cssClassForIframe;
            this.altTextForImage = altTextForImage;
            this.title = title;
        }
        return IconDescription;
    }());
    Editor.IconDescription = IconDescription;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var TitleDescription = /** @class */ (function () {
        function TitleDescription(title, cssClass) {
            this.title = title;
            this.cssClass = cssClass;
        }
        return TitleDescription;
    }());
    Editor.TitleDescription = TitleDescription;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var KeyboardCommand = MktSvc.Controls.Common.KeyboardCommand;
    var KeyboardKeyCodes = MktSvc.Controls.Common.KeyboardKeyCodes;
    var KeyboardModifierType = MktSvc.Controls.Common.KeyboardModifierType;
    var BrowserPreviewView = /** @class */ (function (_super) {
        __extends(BrowserPreviewView, _super);
        function BrowserPreviewView(previewContainerId, showHeader, loadingModal, keyboardCommandManager, executionContext, basicPreviewProvider, defaultIcon, accessibilityInstructions) {
            var _this = _super.call(this, previewContainerId) || this;
            _this.enterKeyCode = 13;
            _this.isDirty = true;
            _this.sandboxAttributes = "allow-scripts";
            _this.linkSandboxAttribute = "allow-popups";
            _this.setRtlMessage = "setRtl";
            _this.getHeightMessage = "getHeight";
            _this.setHeightMessage = "setHeight";
            _this.setContentMessage = "setContent";
            _this.enableLinksMessage = "enableLinks";
            _this.previewResizePostMessageDelay = 100;
            _this.onIconSelected = function (iconDescription, allPreviewCssClasses) {
                _this.changeBrowserPreviewIframeCssClasses(iconDescription.cssClassForIframe, allPreviewCssClasses);
                _this.changeActiveIcon(iconDescription.cssClass);
                _this.changeIFrameHeight();
                _this.eventBroker.notify(Editor.EventConstants.basicPreviewModeSwitched);
            };
            _this.contentChangedHandler = function (eventArgs) {
                if (eventArgs.sourceId === Editor.BrowserPreviewConstants.lightweightMode) {
                    _this.getElement().empty();
                    _this.setContent(eventArgs.html);
                    return;
                }
                if (!_this.documentContentModel) {
                    return;
                }
                var contentDocument = Editor.CommonUtils.getNewContentDocument(eventArgs.html);
                // Executes post processors for preview manually, because we have some restrictions after sanitizing
                _this.documentContentModel.runPostProcessors(contentDocument, Editor.CommonConstants.browserPreviewComponentName).done(function () {
                    var content = Editor.CommonUtils.getDocumentContent(contentDocument);
                    if (_this.html === content) {
                        return;
                    }
                    _this.getElement().empty();
                    _this.setContent(content);
                });
            };
            _this.refreshView = function () {
                _this.isDirty = true;
                if (_this.isActive) {
                    _this.loadingModal.addLoadingModal();
                    _this.render();
                }
            };
            _this.onContentModelInitialized = function (eventArgs) {
                _this.documentContentModel = eventArgs.documentContentModel;
            };
            _this.defaultIcon = defaultIcon || new Editor.IconDescription(Editor.BrowserPreviewConstants.tabletPortraitIcon, Editor.BrowserPreviewConstants.tabletPortraitPreviewIconCssClass, Editor.BrowserPreviewConstants.tabletPortraitPreviewCssClass, Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.tabletPortraitPreviewIconAltText), Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.tabletPortraitPreviewIconTitle));
            _this.id = previewContainerId;
            _this.showHeader = showHeader;
            _this.loadingModal = loadingModal;
            _this.keyboardCommandManager = keyboardCommandManager;
            _this.basicPreviewProvider = basicPreviewProvider;
            _this.executionContext = executionContext;
            _this.contentSanitizer = executionContext.getContentSanitizer();
            _this.accessibilityInstructions = accessibilityInstructions;
            return _this;
        }
        BrowserPreviewView.prototype.init = function (eventBroker) {
            this.eventBroker = eventBroker;
            this.eventBroker.subscribe(Editor.EventConstants.contentModelInitialized, this.onContentModelInitialized);
            this.eventBroker.subscribe(Editor.EventConstants.contentResolved, this.contentChangedHandler);
            this.registerKeyboardShortcuts();
            if (!Object.isNullOrUndefined(this.basicPreviewProvider)) {
                this.basicPreviewProvider.init(eventBroker, this.refreshView);
            }
            this.loadingModal.init(this.getElement(), this.eventBroker);
            this.activeIcon = this.defaultIcon;
        };
        BrowserPreviewView.prototype.activate = function () {
            var _this = this;
            this.loadingModal.addLoadingModal();
            _super.prototype.activate.call(this);
            if (!Object.isNullOrUndefined(this.basicPreviewProvider)) {
                this.basicPreviewProvider.getProviderReadyPromise().done(function () {
                    _this.loadingModal.hide();
                    _this.render();
                });
            }
            else {
                this.render();
            }
            Editor.AccessibilityInstructionsPopup.accessibilityInstructions = this.accessibilityInstructions ||
                Editor.EditorAccessibilityInstructions.basePreviewAccessibilityInstructions;
        };
        BrowserPreviewView.prototype.dispose = function () {
            if (this.eventBroker) {
                this.eventBroker.unsubscribe(Editor.EventConstants.contentResolved, this.contentChangedHandler);
                this.eventBroker.unsubscribe(Editor.EventConstants.contentModelInitialized, this.onContentModelInitialized);
            }
            if (this.basicPreviewProvider) {
                this.basicPreviewProvider.dispose();
            }
            if (this.onWindowSizeChanged) {
                $(window).off("resize", this.onWindowSizeChanged);
            }
            if (this.onMessageReceived) {
                window.removeEventListener("message", this.onMessageReceived);
                this.onMessageReceived = null;
            }
            this.onWindowSizeChanged = null;
            $(this.iframe).off();
            $(this.iframe).remove();
            this.iframe = null;
            this.loadingModal.dispose();
            this.getElement().empty();
        };
        BrowserPreviewView.prototype.setContent = function (html) {
            this.html = html;
            this.refreshView();
        };
        BrowserPreviewView.prototype.render = function () {
            var _this = this;
            if (this.isActive && this.isDirty) {
                if (!MktSvc.Controls.Common.Object.isNullOrUndefined(this.basicPreviewProvider)) {
                    this.basicPreviewProvider.resolveMessageTemplate(this.html, function (resolvedMessage) {
                        _this.setupContent(resolvedMessage, function () { return _this.onContentSetupCompleted(); });
                    });
                }
                else {
                    this.setupContent(this.html, function () { return _this.onContentSetupCompleted(); });
                }
            }
        };
        BrowserPreviewView.prototype.onContentSetupCompleted = function () {
            this.isDirty = false;
            this.eventBroker.notify(Editor.EventConstants.controlRendered, new Editor.ControlRenderedEventArgs(this.id));
            this.eventBroker.notify(Editor.EventConstants.browserPreviewReady, new Editor.ControlRenderedEventArgs(this.id));
        };
        BrowserPreviewView.prototype.setupContent = function (content, onContentSetupCompleted) {
            var _this = this;
            var element = this.getElement().empty();
            this.iframe = document.createElement("iframe");
            var $iframe = $(this.iframe);
            $iframe.find("html").attr("lang", this.executionContext.getLocalizationProvider().getLanguageName());
            $iframe.addClass(Editor.BrowserPreviewConstants.browserPreviewFrameClassName)
                .addClass(this.activeIcon.cssClassForIframe);
            var frameContainer = $("<div>").addClass(Editor.BrowserPreviewConstants.browserPreviewFrameContainerCssClass)
                .addClass(this.activeIcon.cssClassForIframe)
                .addClass(this.showHeader
                ? Editor.BrowserPreviewConstants.editorMode
                : Editor.BrowserPreviewConstants.lightweightMode);
            var frameBorder = $("<div>").addClass(Editor.BrowserPreviewConstants.browserPreviewFrameBorderClassName)
                .addClass(this.activeIcon.cssClassForIframe);
            Editor.CommonUtils.setTabIndex(frameBorder, 0);
            if (Editor.CommonUtils.isIOS()) {
                frameContainer.addClass(Editor.CommonConstants.iosScrollClassName);
            }
            if (this.showHeader) {
                element.append(this.createHeaderElements());
            }
            var previewContent = $("<div>").addClass(Editor.BrowserPreviewConstants.browserPreviewContentCssClass);
            var warningText = Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.browserPreviewContentTitle);
            if (this.executionContext.shouldLinksBeEnabled()) {
                warningText = warningText + " " + Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.browserPreviewLinkWarning);
            }
            var contentWarning = $("<span>")
                .addClass(Editor.BrowserPreviewConstants.browserPreviewContentTitleCssClass)
                .text(warningText);
            frameContainer.append(frameBorder);
            previewContent.append(contentWarning);
            previewContent.append(frameContainer);
            element.append(previewContent);
            if (!this.onWindowSizeChanged) {
                // Use arrow function to save current scope
                $(window).on("resize", this.onWindowSizeChanged = function () { _this.setPreviewContentSize(); });
            }
            this.setPreviewContentSize();
            // We should not apply content if it's null or undefined. Empty content is valid.
            if (Object.isNullOrUndefined(content)) {
                return;
            }
            if (this.executionContext.shouldPreviewBeSanitized()) {
                // Sanitize content before sending to frame
                this.contentSanitizer.init(function () {
                    _this.contentSanitizer.getSanitizedContent(content, function (sanitized) {
                        var sanitizedContent = sanitized.html();
                        _this.applyContent(sanitizedContent, frameBorder, onContentSetupCompleted);
                    });
                });
            }
            else {
                this.applyContent(content, frameBorder, onContentSetupCompleted);
            }
        };
        BrowserPreviewView.prototype.applyContent = function (content, frameBorder, onContentSetupCompleted) {
            var _this = this;
            var isRtl = this.executionContext.getLocalizationProvider().isRtl();
            if (this.executionContext.isSandboxed()) {
                if (String.isNullUndefinedOrWhitespace(this.executionContext.getBasePath())) {
                    this.executionContext.getLogger().log(MktSvc.Controls.Common.TraceLevel.Error, "Editor.BrowserPreviewView.pathNotSet", new MktSvc.Controls.Common.Dictionary({ Message: "Cdn Path is null or undefined" }));
                }
                else {
                    var basePath_1 = this.executionContext.getBasePath();
                    $(this.iframe).on("load", function () {
                        _this.iframe.contentWindow.postMessage(new Editor.BrowserPreviewMessage(_this.enableLinksMessage, _this.executionContext.shouldLinksBeEnabled().toString()), "*"); // tslint:disable-line
                        _this.iframe.contentWindow.postMessage(new Editor.BrowserPreviewMessage(_this.setContentMessage, content), "*");
                        if (isRtl) {
                            _this.iframe.contentWindow.postMessage(new Editor.BrowserPreviewMessage(_this.setRtlMessage, String.Empty), "*");
                        }
                        if (!_this.onMessageReceived) {
                            window.addEventListener("message", _this.onMessageReceived = function (event) {
                                // Origin should be null (or iframe domain in IE/Edge) because IFrame is sandboxed
                                if (event.origin === "null" || event.origin === Editor.CommonUtils.getDomainFromUrl(basePath_1)) {
                                    if (!event.data || !event.data.message) {
                                        return;
                                    }
                                    var data = event.data;
                                    if (data && data.message === _this.setHeightMessage && data.content) {
                                        // Encode data to prevent possible security issues
                                        var contentHeight = parseFloat(MktSvcCommon.HtmlEncode.encode(data.content));
                                        _this.resizeIframe(contentHeight);
                                    }
                                }
                            });
                        }
                        _this.changeIFrameHeight();
                        onContentSetupCompleted();
                    });
                    var sandboxAttributes = this.sandboxAttributes;
                    if (this.executionContext.shouldLinksBeEnabled()) {
                        sandboxAttributes = sandboxAttributes + " " + this.linkSandboxAttribute;
                    }
                    this.iframe.sandbox = sandboxAttributes;
                    this.iframe.src = basePath_1 + "/Preview/browserPreivewFrame.html";
                    this.iframe.tabIndex = -1;
                    frameBorder.append($(this.iframe));
                }
            }
            else {
                $(this.iframe).on("load", function () {
                    Editor.CommonUtils.writeFrameContent(_this.iframe, content);
                    _this.iframe.tabIndex = -1;
                    if (isRtl) {
                        Editor.CommonUtils.getBySelector("html", $(_this.iframe).contents()).attr("dir", "rtl");
                    }
                    _this.changeIFrameHeight();
                    onContentSetupCompleted();
                });
                frameBorder.append($(this.iframe));
            }
        };
        BrowserPreviewView.prototype.changeIFrameHeight = function () {
            var _this = this;
            if (this.executionContext.isSandboxed()) {
                // Timeout needed for IE and Edge, because sometimes "load" event fired when content height is not calculated
                setTimeout(function () {
                    if (_this.iframe && _this.iframe.contentWindow) {
                        _this.iframe.contentWindow.postMessage(new Editor.BrowserPreviewMessage(_this.getHeightMessage, String.Empty), "*");
                    }
                }, this.previewResizePostMessageDelay);
            }
            else {
                // Timeout needed for IE and Edge, because sometimes "load" event fired when content height is not calculated
                setTimeout(function () {
                    if (_this.iframe && _this.iframe.contentDocument && _this.iframe.contentDocument.body) {
                        var contentHeight = _this.iframe.contentDocument.body.getClientRects()[0].top +
                            _this.iframe.contentDocument.body.getClientRects()[0].bottom;
                        _this.resizeIframe(contentHeight);
                    }
                }, this.previewResizePostMessageDelay);
                // Resize frame when images are loaded
                $(this.iframe).contents().find("img").each(function (index, image) {
                    $(image).one("load", function () {
                        var contentHeight = _this.iframe.contentDocument.body.getClientRects()[0].top + _this.iframe.contentDocument.body.getClientRects()[0].bottom;
                        _this.resizeIframe(contentHeight);
                    });
                });
            }
        };
        BrowserPreviewView.prototype.resizeIframe = function (contentHeight) {
            var browserPreviewFrameBorder = $("." + Editor.BrowserPreviewConstants.browserPreviewFrameBorderClassName + ":visible");
            // PreviewFrameBorder padding + PreviewFrameBorder border height + iframe border height
            var previewFrameOffset = (browserPreviewFrameBorder.innerHeight() - browserPreviewFrameBorder.height()) +
                (browserPreviewFrameBorder.outerHeight() - browserPreviewFrameBorder.innerHeight()) +
                ($(this.iframe).outerHeight() - $(this.iframe).innerHeight());
            var frameContainerHeight = $("." + Editor.BrowserPreviewConstants.browserPreviewFrameContainerCssClass + ":visible").height() - previewFrameOffset;
            // If content height less than frame container size then set 100% height for iframe
            if (frameContainerHeight < contentHeight) {
                // Prevent unnecessary updates
                if (contentHeight !== $(this.iframe).height()) {
                    $(this.iframe).height(contentHeight);
                }
            }
            else {
                $(this.iframe).height(frameContainerHeight);
            }
            this.eventBroker.notify(Editor.EventConstants.previewSizeChanged);
        };
        BrowserPreviewView.prototype.changeBrowserPreviewIframeCssClasses = function (cssClassesToAdd, cssClassesToRemove) {
            this.getElement().find(Editor.CommonUtils.getClassSelector(Editor.BrowserPreviewConstants.browserPreviewFrameClassName)).removeClass(cssClassesToRemove).addClass(cssClassesToAdd);
            this.getElement().find(Editor.CommonUtils.getClassSelector(Editor.BrowserPreviewConstants.browserPreviewFrameBorderClassName)).removeClass(cssClassesToRemove).addClass(cssClassesToAdd);
            this.getElement().find(Editor.CommonUtils.getClassSelector(Editor.BrowserPreviewConstants.browserPreviewFrameContainerCssClass)).removeClass(cssClassesToRemove).addClass(cssClassesToAdd);
        };
        BrowserPreviewView.prototype.setPreviewContentSize = function () {
            var frameContainer = $("." + Editor.BrowserPreviewConstants.browserPreviewFrameContainerCssClass + ":visible");
            var contentTitle = $("." + Editor.BrowserPreviewConstants.browserPreviewContentTitleCssClass + ":visible");
            if (frameContainer.length) {
                // Change title width manually (required for IE)
                contentTitle.width(frameContainer.width() - 50); // tslint:disable-line
                if (this.showHeader) {
                    // Change size in accordance with positions including paddings
                    var framePosition = frameContainer.position().top + (frameContainer.innerHeight() - frameContainer.height());
                    frameContainer.css("height", "calc(100% - " + framePosition + "px)");
                }
            }
        };
        BrowserPreviewView.prototype.changeActiveIcon = function (activeIconCssClass) {
            var allIcons = this.getElement().find(Editor.CommonUtils.getClassSelector(Editor.BrowserPreviewConstants.headerIconCssClass));
            //update aria-label for current selection
            var oldActiveButton = allIcons.filter(Editor.CommonUtils.getClassSelector(Editor.BrowserPreviewConstants.activeCssClass));
            var unselectedAriaLabel = String.Format("{0}. {1} {2}", oldActiveButton.parent().attr("title"), Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.ariaNotSelected), Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.ariaOptionToActivate));
            oldActiveButton.parent().attr("aria-label", unselectedAriaLabel);
            // Deactivate all the icons
            allIcons.removeClass(Editor.BrowserPreviewConstants.activeCssClass);
            // Activate only specified icon
            var newActiveButton = allIcons.filter(Editor.CommonUtils.getClassSelector(activeIconCssClass)).addClass(Editor.BrowserPreviewConstants.activeCssClass);
            var selectedAriaLabel = String.Format("{0}. {1}", newActiveButton.parent().attr("title"), Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.ariaSelected));
            newActiveButton.parent().attr("aria-label", selectedAriaLabel);
        };
        BrowserPreviewView.prototype.createHeaderElements = function () {
            var headerDescription = this.getHeaderPreviewTypesDescription();
            return this.createHeaderColumn(headerDescription);
        };
        BrowserPreviewView.prototype.createHeaderColumn = function (headerDescriptions) {
            var _this = this;
            var allPreviewCssClasses = this.getAllPreviewTypeCssClassesForIframe(headerDescriptions);
            var headerColumn = headerDescriptions.map(function (headerItemDescription) {
                var headerTitle = $("<span>")
                    .addClass(Editor.BrowserPreviewConstants.headerTitleCssClass)
                    .addClass(headerItemDescription.titleDescription.cssClass)
                    .text(headerItemDescription.titleDescription.title);
                var iconButtons = headerItemDescription.icons.map(function (iconDescription) {
                    var icon = $("<span>")
                        .addClass(Editor.BrowserPreviewConstants.headerIconCssClass)
                        .addClass(iconDescription.cssClass)
                        .addClass(Editor.CommonConstants.editorFontCssClass)
                        .attr("alt", iconDescription.altTextForImage);
                    var buttonContainer = $("<button>").addClass(Editor.BrowserPreviewConstants.previewButtonContainerCssClass)
                        .attr("title", iconDescription.title)
                        .attr("type", Editor.CommonConstants.buttonType)
                        .keypress(function (e) {
                        if (e.which === _this.enterKeyCode) {
                            _this.onIconSelected(iconDescription, allPreviewCssClasses);
                            _this.activeIcon = iconDescription;
                        }
                    })
                        .on("click", function () {
                        _this.onIconSelected(iconDescription, allPreviewCssClasses);
                        _this.activeIcon = iconDescription;
                    })
                        .append(icon);
                    var ariaLabel = String.Format("{0}. {1} {2}", iconDescription.title, Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.ariaNotSelected), Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.ariaOptionToActivate));
                    Editor.CommonUtils.setAriaAttribute(buttonContainer, "aria-label", ariaLabel);
                    return buttonContainer;
                }).reduce(function (iconButtonsJQuery, iconButton) { return iconButtonsJQuery.add(iconButton); });
                // Buttons under the same title
                var iconButtonsGroup = $("<div>").addClass(Editor.BrowserPreviewConstants.headerIconButtonsContainerCssClass).append(iconButtons);
                return headerTitle.add(iconButtonsGroup);
            }).reduce(function (headerItems, headerItem) { return headerItems.add(_this.createDivider()).add(headerItem); });
            // Activating 'tablet portrait preview' icon by default;
            var selectedAriaLabel = String.Format("{0}. {1}", this.activeIcon.title, Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.ariaSelected));
            headerColumn.find(Editor.CommonUtils.getClassSelector(this.activeIcon.cssClass)).addClass(Editor.BrowserPreviewConstants.activeCssClass);
            headerColumn.find(Editor.CommonUtils.getClassSelector(this.activeIcon.cssClass)).attr("aria-label", selectedAriaLabel);
            return $("<div>").addClass(Editor.BrowserPreviewConstants.headerCssClass).append(headerColumn);
        };
        BrowserPreviewView.prototype.createDivider = function () {
            // Gets divider
            return $("<div>").addClass(Editor.BrowserPreviewConstants.headerDividerCssClass);
        };
        BrowserPreviewView.prototype.getAllPreviewTypeCssClassesForIframe = function (headerDescription) {
            // Gets all possible preview type css classes, which can be applied to the iframe, as space-separated string
            return headerDescription
                .map(function (description) { return description.icons; })
                .reduce(function (icons, iconArray) { return icons.concat(iconArray); })
                .map(function (icon) { return icon.cssClassForIframe; })
                .join(" ");
        };
        BrowserPreviewView.prototype.getHeaderPreviewTypesDescription = function () {
            return [
                new Editor.HeaderItemDescription(new Editor.TitleDescription(Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.desktopTitle), Editor.BrowserPreviewConstants.desktopTitleCssClass), [
                    new Editor.IconDescription(Editor.BrowserPreviewConstants.desktopIcon, Editor.BrowserPreviewConstants.desktopPreviewIconCssClass, Editor.BrowserPreviewConstants.desktopPreviewCssClass, Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.desktopPreviewIconAltText), Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.desktopPreviewIconTitle))
                ]),
                new Editor.HeaderItemDescription(new Editor.TitleDescription(Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.tabletTitle), Editor.BrowserPreviewConstants.tabletTitleCssClass), [
                    new Editor.IconDescription(Editor.BrowserPreviewConstants.tabletPortraitIcon, Editor.BrowserPreviewConstants.tabletPortraitPreviewIconCssClass, Editor.BrowserPreviewConstants.tabletPortraitPreviewCssClass, Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.tabletPortraitPreviewIconAltText), Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.tabletPortraitPreviewIconTitle)),
                    new Editor.IconDescription(Editor.BrowserPreviewConstants.tabletLandscapeIcon, Editor.BrowserPreviewConstants.tabletLandscapePreviewIconCssClass, Editor.BrowserPreviewConstants.tabletLandscapePreviewCssClass, Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.tabletLandscapePreviewIconAltText), Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.tabletLandscapePreviewIconTitle))
                ]),
                new Editor.HeaderItemDescription(new Editor.TitleDescription(Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.mobileTitle), Editor.BrowserPreviewConstants.mobileTitleCssClass), [
                    new Editor.IconDescription(Editor.BrowserPreviewConstants.mobilePortraitIcon, Editor.BrowserPreviewConstants.mobilePortraitPreviewIconCssClass, Editor.BrowserPreviewConstants.mobilePortraitPreviewCssClass, Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.mobilePortraitPreviewIconAltText), Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.mobilePortraitPreviewIconTitle)),
                    new Editor.IconDescription(Editor.BrowserPreviewConstants.mobileLandscapeIcon, Editor.BrowserPreviewConstants.mobileLandscapePreviewIconCssClass, Editor.BrowserPreviewConstants.mobileLandscapePreviewCssClass, Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.mobileLandscapePreviewIconAltText), Editor.CommonUtils.getLocalizedString(Editor.BrowserPreviewConstants.mobileLandscapePreviewIconTitle))
                ])
            ];
        };
        BrowserPreviewView.prototype.registerKeyboardShortcuts = function () {
            this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.bKey, [KeyboardModifierType.Alt], function () {
                $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.tabButtonPreClassName + Editor.CommonConstants.browserPreviewTabContentClassName)).focus().click();
            }));
            this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.threeKey, [KeyboardModifierType.Alt], function () {
                $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.tabButtonPreClassName + Editor.CommonConstants.previewViewClassName)).focus().click();
            }));
            this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.oneKey, [KeyboardModifierType.Alt, KeyboardModifierType.Control], function () {
                $(Editor.CommonUtils.getClassSelector(Editor.BrowserPreviewConstants.desktopPreviewIconCssClass)).focus().click();
            }));
            this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.twoKey, [KeyboardModifierType.Alt, KeyboardModifierType.Control], function () {
                $(Editor.CommonUtils.getClassSelector(Editor.BrowserPreviewConstants.tabletPortraitPreviewIconCssClass)).focus().click();
            }));
            this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.threeKey, [KeyboardModifierType.Alt, KeyboardModifierType.Control], function () {
                $(Editor.CommonUtils.getClassSelector(Editor.BrowserPreviewConstants.tabletLandscapePreviewIconCssClass)).focus().click();
            }));
            this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.fourKey, [KeyboardModifierType.Alt, KeyboardModifierType.Control], function () {
                $(Editor.CommonUtils.getClassSelector(Editor.BrowserPreviewConstants.mobilePortraitPreviewIconCssClass)).focus().click();
            }));
            this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.fiveKey, [KeyboardModifierType.Alt, KeyboardModifierType.Control], function () {
                $(Editor.CommonUtils.getClassSelector(Editor.BrowserPreviewConstants.mobileLandscapePreviewIconCssClass)).focus().click();
            }));
        };
        return BrowserPreviewView;
    }(Editor.Control));
    Editor.BrowserPreviewView = BrowserPreviewView;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var KeyboardCommand = MktSvc.Controls.Common.KeyboardCommand;
    var KeyboardKeyCodes = MktSvc.Controls.Common.KeyboardKeyCodes;
    var KeyboardModifierType = MktSvc.Controls.Common.KeyboardModifierType;
    var DetailsView = /** @class */ (function (_super) {
        __extends(DetailsView, _super);
        function DetailsView(detailsContainerId, blockDetailsViewMapping, keyboardCommandManager) {
            var _this = _super.call(this, detailsContainerId) || this;
            _this.onSelectionChanged = function (eventArgs) {
                _this.setupDetailsView(eventArgs);
                if (!Object.isNullOrUndefined(_this.blockDetailsView)) {
                    // Supported element selected, so, activate the view
                    _this.activate();
                }
            };
            _this.onContentChanged = function (eventArgs) {
                // Render the content in case the view is activated
                if (_this.selectedBlock) {
                    if (Editor.CommonUtils.getById(Editor.CommonUtils.getId(_this.selectedBlock)).length === 0) {
                        _this.cleanDetailsViewContent();
                    }
                    else {
                        _this.selectedBlock = Editor.CommonUtils.getById(Editor.CommonUtils.getId(_this.selectedBlock));
                        if (_this.isActive) {
                            _this.render(eventArgs.originalSourceId);
                        }
                    }
                }
            };
            _this.blockDetailsViewMapping = blockDetailsViewMapping;
            _this.keyboardCommandManager = keyboardCommandManager;
            return _this;
        }
        /**
        * Initializes the property view - attaches to the on selection change event to rerender the property view on the the block selection change
        */
        DetailsView.prototype.init = function (eventBroker) {
            this.eventBroker = eventBroker;
            this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.selectionChanged, this.onSelectionChanged);
            this.eventBroker.subscribe(Editor.EventConstants.contentChanged, this.onContentChanged);
            this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.fiveKey, [KeyboardModifierType.Alt], function () {
                $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.tabButtonPreClassName +
                    Editor.CommonConstants.detailsTabContentClassName)).parent().focus();
                $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.tabButtonPreClassName +
                    Editor.CommonConstants.detailsTabContentClassName)).click();
            }));
        };
        DetailsView.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.blockDetailsView)) {
                this.blockDetailsView.dispose();
                this.blockDetailsView = null;
            }
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.selectionChanged, this.onSelectionChanged);
            this.eventBroker.unsubscribe(Editor.EventConstants.contentChanged, this.onContentChanged);
            this.blockDetailsViewMapping = null;
            this.keyboardCommandManager = null;
            this.selectedBlock = null;
            this.eventBroker = null;
        };
        DetailsView.prototype.activate = function () {
            if (!this.isActive) {
                _super.prototype.activate.call(this);
            }
            if (!Object.isNullOrUndefined(this.selectedBlock) &&
                Editor.CommonUtils.getById(Editor.CommonUtils.getId(this.selectedBlock)).length) {
                this.render();
            }
            else {
                this.cleanDetailsViewContent();
            }
        };
        DetailsView.prototype.setupDetailsView = function (selectionChangedEventArgs) {
            this.cleanDetailsViewContent();
            var blockDefinition = selectionChangedEventArgs.blockDefinition;
            this.blockDetailsView = this.blockDetailsViewMapping.get(blockDefinition.getType());
            this.selectedBlock = selectionChangedEventArgs.blockElement;
        };
        DetailsView.prototype.checkIfBlockIsProtected = function (selectedBlock, blockDetailsView) {
            var dataEditorBlockType = selectedBlock.closest("[" + Editor.Contract.blockTypeAttrName + "]");
            var dataProtectedAttributeValue = dataEditorBlockType.attr(Editor.Contract.dataProtectedAttribute);
            var isProtected = dataEditorBlockType.length > 0 && dataProtectedAttributeValue && dataProtectedAttributeValue.toLowerCase() === "true";
            if (isProtected) {
                var container = $("#" + blockDetailsView.containerId);
                var itemsToBlock = container.find("." + Editor.DetailsViewConstants.inputItemField + ":not(." + Editor.DetailsViewConstants.neverProtected + ")");
                itemsToBlock.addClass("" + Editor.DetailsViewConstants.disabled);
                itemsToBlock.find("input,select,button").prop("disabled", true);
                var disabledEls = container.find("." + Editor.DetailsViewConstants.disabled);
                if (disabledEls.length > 0) {
                    var propertiesTile = container.find("." + Editor.DetailsViewConstants.headingLabelClassName);
                    propertiesTile.toArray().forEach(function (element) {
                        $(element).html($(element).html() + " (" + Editor.CommonUtils.getLocalizedString("[PROTECTED]") + ")");
                    });
                }
                var richDivs = container.find("[contenteditable='true']");
                richDivs.removeAttr("contenteditable");
                richDivs.addClass("" + Editor.DetailsViewConstants.richEditDisabled);
            }
        };
        DetailsView.prototype.render = function (originalSourceId) {
            if (!Object.isNullOrUndefined(this.blockDetailsView) && !Object.isNullOrUndefined(this.selectedBlock)) {
                if (originalSourceId !== this.id && originalSourceId !== Editor.CommonUtils.getId(this.selectedBlock)) {
                    this.blockDetailsView.init(this.eventBroker, this.id);
                    this.blockDetailsView.render(this.selectedBlock);
                    this.checkIfBlockIsProtected(this.selectedBlock, this.blockDetailsView);
                    this.eventBroker.notify(Editor.EventConstants.controlRendered, new Editor.ControlRenderedEventArgs(this.id));
                }
            }
        };
        DetailsView.prototype.cleanDetailsViewContent = function () {
            if (!Object.isNullOrUndefined(this.blockDetailsView)) {
                this.blockDetailsView.dispose();
            }
            this.blockDetailsView = this.selectedBlock = null;
        };
        return DetailsView;
    }(Editor.Control));
    Editor.DetailsView = DetailsView;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var ArrayQuery = MktSvc.Controls.Common.ArrayQuery;
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var Dictionary = MktSvc.Controls.Common.Dictionary;
    var TraceLevel = MktSvc.Controls.Common.TraceLevel;
    var KeyboardCommand = MktSvc.Controls.Common.KeyboardCommand;
    var KeyboardKeyCodes = MktSvc.Controls.Common.KeyboardKeyCodes;
    var KeyboardModifierType = MktSvc.Controls.Common.KeyboardModifierType;
    var KeyCodes = MktSvc.Controls.Common.KeyCodes;
    var ToolboxView = /** @class */ (function (_super) {
        __extends(ToolboxView, _super);
        function ToolboxView(toolboxId, tools, toolBlockMapping, keyboardAccessibilityManager, keyboardCommandManager, executionContext, sections, sectionToToolsMapping) {
            var _this = _super.call(this, toolboxId) || this;
            _this.toolboxId = toolboxId;
            _this.tools = tools;
            _this.toolBlockMapping = toolBlockMapping;
            _this.keyboardAccessibilityManager = keyboardAccessibilityManager;
            _this.keyboardCommandManager = keyboardCommandManager;
            _this.executionContext = executionContext;
            _this.sections = sections;
            _this.clickDragstartEvent = "click dragstart";
            _this.accessibleItemList = new Array();
            _this.disableToolboxAccessibility = function () {
                $(_this.draggableSelector).toArray().forEach(function (el) {
                    el.draggable = "false";
                    el.style.cursor = "no-drop";
                    el.style.opacity = "0.4";
                });
                $("#" + Editor.CommonConstants.contentBlockSectionSubtitleId).show();
                Editor.CommonUtils.getBySelector(_this.draggableSelector).off(_this.clickDragstartEvent);
            };
            _this.enableToolboxAccessibility = function () {
                _this.render();
            };
            _this.draggableSelector = String.Format("#{0} .{1}", toolboxId, Editor.CommonConstants.toolboxItemClassName);
            _this.renderedToolIdToToolMapping = new Dictionary();
            _this.ensureDefaultSection();
            _this.setToolSectionMapping(sectionToToolsMapping);
            _this.keyboardCommandManager = keyboardCommandManager;
            return _this;
        }
        /**
         * Ensure that the default section is added to the toolbox.
         * If is defined in the sections parameter then will be added as defined in the corresponding order, else the default section is added
         * using the default name and label at the beginning of the list.
         */
        ToolboxView.prototype.ensureDefaultSection = function () {
            this.sections = this.sections || new ArrayQuery([]);
            this.defaultSection = this.sections.firstOrDefault(function (section) { return section.getName() === Editor.CommonConstants.toolboxDefaultSectionName; });
            if (!this.defaultSection) {
                this.defaultSection = new Editor.Section(Editor.CommonConstants.toolboxDefaultSectionName, Editor.CommonConstants.toolboxDefaultSectionLabel);
                this.sections = this.sections.clone().addAt(this.defaultSection, 0);
            }
        };
        /**
         * Set a map between tools and sections based on the map between sections and tools.
         * This is in order to be efficient while adding a new tool.
         * Thus this enable obtaining the section based on a tool.
         * @param sectionToToolsMapping Mapping between sections and tools.
         */
        ToolboxView.prototype.setToolSectionMapping = function (sectionToToolsMapping) {
            var _this = this;
            this.toolSectionMapping = new Dictionary();
            if (sectionToToolsMapping) {
                sectionToToolsMapping.getKeys().items().forEach(function (sectionName) {
                    sectionToToolsMapping.get(sectionName).forEach(function (toolType) {
                        _this.toolSectionMapping.addOrUpdate(toolType, sectionName);
                    });
                });
            }
        };
        ToolboxView.prototype.init = function (eventBroker) {
            this.eventBroker = eventBroker;
            //accessibility
            this.keyboardAccessibilityManager.initialize(this);
            this.eventBroker.subscribe(Editor.EventConstants.onToolboxAccessibleContainerRendered, this.keyboardAccessibilityManager.onContainerRenderedHandler);
            this.eventBroker.subscribe(Editor.EventConstants.onToolboxAccessibleItemRendered, this.keyboardAccessibilityManager.onItemRenderedHandler);
            this.eventBroker.subscribe(Editor.EventConstants.elementsCannotBeInserted, this.disableToolboxAccessibility);
            this.eventBroker.subscribe(Editor.EventConstants.elementsCanBeInserted, this.enableToolboxAccessibility);
            this.render();
            this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.fourKey, [KeyboardModifierType.Alt], function () {
                $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.tabButtonPreClassName +
                    Editor.CommonConstants.toolboxTabContentClassName)).parent().focus();
                $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.tabButtonPreClassName +
                    Editor.CommonConstants.toolboxTabContentClassName)).click();
            }));
        };
        ToolboxView.prototype.activate = function () {
            _super.prototype.activate.call(this);
        };
        /**
        * implementation of IAccessibleCollection
        */
        ToolboxView.prototype.getAllAccessibleItems = function () {
            return this.accessibleItemList;
        };
        ToolboxView.prototype.getSelectedAccesibleItem = function () {
            var selectedElement = document.activeElement;
            if ($(selectedElement).hasClass(ToolboxView.toolItemCellCssClass)) {
                return selectedElement;
            }
            else {
                return null;
            }
        };
        ToolboxView.prototype.dispose = function () {
            this.eventBroker.unsubscribe(Editor.EventConstants.sectionToolsPublishStarted, this.sectionToolsPublishStartedEventHandler);
            this.eventBroker.unsubscribe(Editor.EventConstants.sectionToolsPublishCompleted, this.sectionToolsPublishEndedEventHandler);
            this.eventBroker.unsubscribe(Editor.EventConstants.toolPublished, this.toolPublishedEventHandler);
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.designerAddEnd, this.designerAddEndEventHandler);
            this.eventBroker.unsubscribe(Editor.EventConstants.onToolboxAccessibleContainerRendered, this.keyboardAccessibilityManager.onContainerRenderedHandler);
            this.eventBroker.unsubscribe(Editor.EventConstants.onToolboxAccessibleItemRendered, this.keyboardAccessibilityManager.onItemRenderedHandler);
            Editor.CommonUtils.getBySelector(this.draggableSelector).off(this.clickDragstartEvent);
            this.renderedToolIdToToolMapping = null;
            this.keyboardAccessibilityManager = null;
            this.keyboardCommandManager = null;
            this.sections = null;
            this.accessibleItemList = null;
        };
        ToolboxView.prototype.render = function () {
            Editor.CommonUtils.getById(this.toolboxId).empty().append(this.renderToolbox());
            this.setupSectionToolsPublishStartedEvent();
            this.setupSectionToolsPublishEndedEvent();
            this.setupToolPublishedEvent();
            this.eventBroker.notify(Editor.EventConstants.controlRendered, new Editor.ControlRenderedEventArgs(this.id));
        };
        ToolboxView.prototype.setupSectionToolsPublishStartedEvent = function () {
            var _this = this;
            this.sectionToolsPublishStartedEventHandler = function (eventArgs) {
                _this.setSectionIsLoading(eventArgs.getSectionName(), true);
            };
            this.eventBroker.subscribe(Editor.EventConstants.sectionToolsPublishStarted, this.sectionToolsPublishStartedEventHandler);
        };
        ToolboxView.prototype.setupSectionToolsPublishEndedEvent = function () {
            var _this = this;
            this.sectionToolsPublishEndedEventHandler = function (eventArgs) {
                _this.setSectionIsLoading(eventArgs.getSectionName(), false);
            };
            this.eventBroker.subscribe(Editor.EventConstants.sectionToolsPublishCompleted, this.sectionToolsPublishEndedEventHandler);
        };
        ToolboxView.prototype.setupToolPublishedEvent = function () {
            var _this = this;
            this.toolPublishedEventHandler = function (eventArgs) {
                var tool = eventArgs.getTool();
                var sectionName = eventArgs.getSectionName() || _this.defaultSection.getName();
                if (_this.sections.where(function (section) { return section.getName() === sectionName; }).count() === 0) {
                    sectionName = _this.defaultSection.getName();
                }
                _this.toolSectionMapping.addOrUpdate(tool.getType(), sectionName);
                _this.renderTool(tool);
                _this.tools.add(tool);
            };
            this.eventBroker.subscribe(Editor.EventConstants.toolPublished, this.toolPublishedEventHandler);
        };
        ToolboxView.prototype.renderToolbox = function () {
            this.toolboxContainer = $("<div></div>")
                .addClass(Editor.CommonConstants.contentViewBlocksClassName)
                .addClass(Editor.CommonUtils.getLangDirectionClass());
            this.renderAllSections();
            this.renderTools();
            this.eventBroker.notify(Editor.EventConstants.onToolboxAccessibleContainerRendered, new Editor.ContainerRenderedEventArgs(this.toolboxContainer));
            return this.toolboxContainer;
        };
        ToolboxView.prototype.renderTools = function () {
            var _this = this;
            // add tools to container
            this.tools.items().forEach(function (tool) {
                _this.renderTool(tool);
            });
        };
        ToolboxView.prototype.renderTool = function (tool) {
            var sectionName = this.toolSectionMapping.get(tool.getType());
            var section;
            section = sectionName ? this.sections.firstOrDefault(function (section) { return section.getName() === sectionName; }) : this.defaultSection; // tslint:disable-line
            // if the tool is associated with an invalid section then add the tool to the default section and log the error.
            if (Object.isNullOrUndefined(section)) {
                var errorMessage = "No toolbox section name '" + sectionName + "' was found for tool '" + tool.getType() + "'.";
                this.executionContext.getLogger().log(TraceLevel.Error, "Editor.ToolboxView.renderTool", new Dictionary({ Message: errorMessage, SectionName: sectionName, ToolType: tool.getType() }));
                section = this.defaultSection;
            }
            this.renderToolInSection(tool, section);
            return true;
        };
        ToolboxView.prototype.renderToolInSection = function (tool, section) {
            var sectionContainer = this.getOrRenderSection(section);
            var imgContainer = $("<span>")
                .addClass(ToolboxView.toolItemIconCssClass)
                .addClass(Editor.CommonConstants.iconContainerCssClass)
                .attr("draggable", "false"); // Prevents dragging of the icon only instead of the whole block
            var img = $("<span>")
                .addClass(Editor.CommonConstants.editorFontCssClass)
                .addClass(tool.getCssClass())
                .addClass(Editor.CommonConstants.fontIconSizeCssClass)
                .attr("draggable", "false"); // Prevents dragging of the icon only instead of the whole block
            imgContainer.append(img);
            var toolName = $("<span>")
                .addClass(ToolboxView.toolItemLabelCssClass)
                .text(tool.getLabel())
                .addClass(Editor.CommonUtils.getLangDirectionClass());
            var renderedToolId = UniqueId.generate();
            var toolBoxDraggableContainer = $("<div>")
                .addClass(Editor.CommonConstants.toolboxItemClassName)
                .attr("data-" + Editor.CommonConstants.toolboxItemTypeDataAttr, tool.getType())
                .attr("data-" + Editor.CommonConstants.toolboxItemIdDataAttr, renderedToolId);
            var toolBoxIcon = $("<button>")
                .addClass(Editor.CommonConstants.toolboxItemButtonCssClassName)
                .attr("type", Editor.CommonConstants.buttonType)
                .attr("title", tool.getTitle())
                .append(imgContainer, toolName);
            toolBoxDraggableContainer.append(toolBoxIcon);
            var toolCell = $("<div>")
                .attr("title", tool.getLabel())
                .addClass(ToolboxView.toolItemCellCssClass)
                .css("width", (100 / ToolboxView.buttonsPerRow) + "%") // tslint:disable-line
                .append(toolBoxDraggableContainer);
            var toolsCount = this.getSectionToolsCount(section.getName());
            var toolsRowContainer = sectionContainer.find("." + ToolboxView.toolItemRowCssClass + ":last");
            if (toolsRowContainer.length === 0 || toolsCount % ToolboxView.buttonsPerRow === 0) {
                toolsRowContainer = $("<div>").addClass(ToolboxView.toolItemRowCssClass);
                sectionContainer.find("." + Editor.CommonConstants.contentBlockItemsCssClass).append(toolsRowContainer);
            }
            if (toolsCount === 0) {
                this.setSectionIsEmpty(section.getName(), false);
            }
            toolsRowContainer.append(toolCell);
            this.setupEventsOnTools(toolBoxDraggableContainer);
            this.renderedToolIdToToolMapping.addOrUpdate(renderedToolId, tool);
            //accessibility
            var accessibleItemOnClickHandler = function () { toolBoxIcon.click(); };
            var accessibleItem = new Editor.ToolboxAccessibleItem(toolBoxIcon, accessibleItemOnClickHandler);
            this.accessibleItemList.push(accessibleItem);
            this.eventBroker.notify(Editor.EventConstants.onToolboxAccessibleItemRendered, new Editor.ElementRenderedEventArgs(accessibleItem));
        };
        ToolboxView.prototype.getOrRenderSection = function (section) {
            var sectionContainer = this.getSectionContainer(section.getName());
            if (sectionContainer.length > 0) {
                return sectionContainer;
            }
            sectionContainer = this.renderSection(section);
            return sectionContainer;
        };
        ToolboxView.prototype.renderAllSections = function () {
            var _this = this;
            this.sections.items().forEach(function (section) { return _this.renderSection(section); });
        };
        ToolboxView.prototype.renderSection = function (section) {
            var treeView = $("<div></div>").addClass(Editor.CommonConstants.treeViewCssClass);
            var toolCellContainer = $("<div>").addClass(Editor.CommonConstants.contentBlockItemsCssClass);
            treeView.append(toolCellContainer);
            // The icon which shows if the table of the attribute editors is collapsed or not
            var toggleImg = $("<span></span>").addClass(Editor.CommonConstants.extrasToggleCssClass).addClass(Editor.CommonConstants.editorFontCssClass);
            // Section title
            var treeViewTitle = $("<button></button>")
                .attr("type", Editor.CommonConstants.buttonType)
                .addClass(Editor.CommonConstants.propertiesTitleButtonCssClass)
                .attr("aria-expanded", "true");
            //Section subtitle
            var treeViewSubTitle = $("<div id=\"" + Editor.CommonConstants.contentBlockSectionSubtitleId + "\"\n                                             class=\"" + Editor.CommonConstants.contentBlockSectionSubtitleCssClass + "\"\n                                             role=\"alert\"\n                                             style=\"display:none\">\n                                            <span class=\"CCFSymbolFont fontIconSize\" draggable=\"false\"></span>\n                                            <div>\n                                                " + Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.contentBlockCantInsertMoreBlocks) + "\n                                            </div>\n                                        </div>");
            var treeViewLabel = $("<p></p>")
                .addClass(Editor.CommonConstants.propertiesTitleCssClass)
                .text(section.getLabel());
            treeViewTitle.append(treeViewLabel);
            var propertiesHeader = toggleImg.add(treeViewTitle)
                .on("click", function () {
                treeView.toggle();
                toggleImg.toggleClass(Editor.CommonConstants.collapsedCssClass);
                treeViewTitle.attr("aria-expanded") === "true" ? treeViewTitle.attr("aria-expanded", "false") : treeViewTitle.attr("aria-expanded", "true");
            });
            treeViewTitle.on("keypress", function (e) {
                if (e.keyCode === KeyCodes.Enter) {
                    propertiesHeader.click();
                }
            });
            var sectionContainer = $("<div></div>")
                .addClass(Editor.CommonConstants.contentBlockSectionCssClass)
                .addClass(Editor.CommonUtils.getLangDirectionClass())
                .attr("data-" + Editor.CommonConstants.toolboxSectionNameDataAttr, section.getName())
                .append(treeViewSubTitle)
                .append(propertiesHeader)
                .append(treeView);
            this.toolboxContainer.append(sectionContainer);
            this.setSectionIsEmpty(section.getName(), true);
            return sectionContainer;
        };
        ToolboxView.prototype.setSectionIsEmpty = function (sectionName, isEmpty) {
            var sectionContainer = this.getSectionContainer(sectionName);
            if (sectionContainer.length === 0) {
                sectionContainer = this.getSectionContainer(Editor.CommonConstants.toolboxDefaultSectionName);
            }
            var treeView = sectionContainer.find("." + Editor.CommonConstants.treeViewCssClass);
            sectionContainer.removeClass(Editor.CommonConstants.contentBlockSectionEmptyCssClass);
            treeView.find("." + Editor.CommonConstants.contentBlockSectionEmptyMessageCssClass).remove();
            if (isEmpty) {
                sectionContainer.addClass(Editor.CommonConstants.contentBlockSectionEmptyCssClass);
                var sectionEmptyMessage = $("<div></div>")
                    .addClass(Editor.CommonConstants.contentBlockSectionEmptyMessageCssClass)
                    .text(Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.contentBlockSectionEmptyMessage));
                treeView.append(sectionEmptyMessage);
            }
        };
        ToolboxView.prototype.setSectionIsLoading = function (sectionName, isLoading) {
            var sectionContainer = this.getSectionContainer(sectionName);
            if (sectionContainer.length === 0) {
                sectionContainer = this.getSectionContainer(Editor.CommonConstants.toolboxDefaultSectionName);
            }
            var treeView = sectionContainer.find("." + Editor.CommonConstants.treeViewCssClass);
            sectionContainer.removeClass(Editor.CommonConstants.contentBlockSectionLoadingCssClass);
            treeView.find("." + Editor.CommonConstants.contentBlockSectionLoadingMessageCssClass).remove();
            if (isLoading) {
                sectionContainer.addClass(Editor.CommonConstants.contentBlockSectionLoadingCssClass);
                var sectionLoadingMessage = $("<div></div>")
                    .addClass(Editor.CommonConstants.contentBlockSectionLoadingMessageCssClass)
                    .text(Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.contentBlockSectionLoadingMessage));
                treeView.append(sectionLoadingMessage);
            }
            else {
                var toolsCount = this.getSectionToolsCount(sectionName);
                this.setSectionIsEmpty(sectionName, toolsCount === 0);
            }
        };
        ToolboxView.prototype.getSectionToolsCount = function (sectionName) {
            return this.getSectionContainer(sectionName).find("." + ToolboxView.toolItemCellCssClass).length;
        };
        ToolboxView.prototype.getSectionContainer = function (sectionName) {
            return this.toolboxContainer.find("." + Editor.CommonConstants.contentBlockSectionCssClass + "[data-" + Editor.CommonConstants.toolboxSectionNameDataAttr + "=\"" + sectionName + "\"]");
        };
        ToolboxView.prototype.getToolById = function (toolId) {
            return this.renderedToolIdToToolMapping.get(toolId);
        };
        ToolboxView.prototype.setupEventsOnTools = function (draggableToolItems) {
            var _this = this;
            draggableToolItems.attr("draggable", "true");
            draggableToolItems.on("dragstart", function (event) {
                // Stop event propagation because in the web client there is event listener
                // for the dragstart event (on the document) in the MicrosoftAjax.js with a preventDefault.
                event.stopPropagation();
                var dragEventDataTransfer = event.originalEvent.dataTransfer;
                // Set identification that this object is draggable
                _this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerDragStart);
                var block = _this.getBlockFromToolEvent(event);
                if (block.length) {
                    dragEventDataTransfer.setData("Text", block.get(0).outerHTML);
                }
            });
            this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.designerAddEnd, this.designerAddEndEventHandler = function () { return _this.removeSelectionsOnTools(); });
            draggableToolItems.on("click", function (event) {
                var tool = $(event.target).hasClass(Editor.CommonConstants.toolboxItemClassName)
                    ? $(event.target)
                    : $(event.target).closest(_this.draggableSelector);
                if (!tool.hasClass(Editor.CommonConstants.toolboxSelectedToolItemClassName)) {
                    // Remove old selections
                    _this.removeSelectionsOnTools();
                    // Add selection
                    tool.addClass(Editor.CommonConstants.toolboxSelectedToolItemClassName);
                    var block = _this.getBlockFromToolEvent(event);
                    if (block.length) {
                        // Activate add mode
                        _this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerAddStart, new Editor.DesignerAddStartEventArgs(block));
                    }
                }
                else {
                    // Exit from the add mode
                    _this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerAddEnd);
                }
            });
        };
        ToolboxView.prototype.removeSelectionsOnTools = function () {
            Editor.CommonUtils.getByClass(Editor.CommonConstants.toolboxItemClassName).removeClass(Editor.CommonConstants.toolboxSelectedToolItemClassName);
        };
        ToolboxView.prototype.getBlockFromToolEvent = function (event) {
            var tool = $(event.target).hasClass(Editor.CommonConstants.toolboxItemClassName)
                ? $(event.target)
                : $(event.target).closest(this.draggableSelector);
            return this.getBlockFromTool.apply(this, [tool]);
        };
        /**
         * Gets the block from the toolbox item.
         * TODO: the draggable object is the actual content transformation. We might want to change it to a thumbnail.
         * @param item - toolbox item with data attribute
         */
        ToolboxView.prototype.getBlockFromTool = function (item) {
            var selectedTool = this.getToolById(item.data(Editor.CommonConstants.toolboxItemIdDataAttr).toString());
            if (Object.isNullOrUndefined(selectedTool)) {
                return $();
            }
            var blockDefinition = this.toolBlockMapping.get(selectedTool.getType());
            if (Object.isNullOrUndefined(blockDefinition)) {
                return $();
            }
            var blockType = blockDefinition.getType();
            var block = $("<div>");
            block.attr(Editor.Contract.blockTypeAttrName, blockType);
            var contentTransformation = selectedTool.getContentTransformation();
            block.append(contentTransformation);
            return block;
        };
        ToolboxView.toolItemCellCssClass = "toolItemCell";
        ToolboxView.toolItemRowCssClass = "toolItemRow";
        ToolboxView.toolItemLabelCssClass = "toolItemLabel";
        ToolboxView.toolItemIconCssClass = "toolItemIcon";
        ToolboxView.buttonsPerRow = 2;
        return ToolboxView;
    }(Editor.Control));
    Editor.ToolboxView = ToolboxView;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var ImageTool = /** @class */ (function () {
        function ImageTool() {
        }
        ImageTool.prototype.getContentTransformation = function () {
            return '<div class="imageWrapper"><img src="" /></div>';
        };
        ImageTool.prototype.getLabel = function () {
            return Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.imageToolLabel);
        };
        ImageTool.prototype.getType = function () {
            return Editor.CommonConstants.imageToolType;
        };
        ImageTool.prototype.getTitle = function () {
            return Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.imageToolTitle);
        };
        ImageTool.prototype.getCssClass = function () {
            return "imageTool";
        };
        return ImageTool;
    }());
    Editor.ImageTool = ImageTool;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var ButtonTool = /** @class */ (function () {
        function ButtonTool() {
        }
        ButtonTool.prototype.getLabel = function () {
            return Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.buttonToolLabel);
        };
        ButtonTool.prototype.getType = function () {
            return Editor.CommonConstants.buttonToolType;
        };
        ButtonTool.prototype.getContentTransformation = function () {
            return '<a href="' + Editor.CommonConstants.buttonEmptyHref + '" style="display: block">Click me</a>';
        };
        ButtonTool.prototype.getTitle = function () {
            return Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.buttonToolTitle);
        };
        ButtonTool.prototype.getCssClass = function () {
            return "buttonTool";
        };
        return ButtonTool;
    }());
    Editor.ButtonTool = ButtonTool;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var TextTool = /** @class */ (function () {
        function TextTool() {
        }
        TextTool.prototype.getLabel = function () {
            return Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.textToolLabel);
        };
        TextTool.prototype.getType = function () {
            return Editor.CommonConstants.textToolType;
        };
        TextTool.prototype.getContentTransformation = function () {
            return "<p>" + Editor.CommonUtils.getLocalizedString("Please input your text here...") + "</p>";
        };
        TextTool.prototype.getTitle = function () {
            return Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.textToolTitle);
        };
        TextTool.prototype.getCssClass = function () {
            return "textTool";
        };
        return TextTool;
    }());
    Editor.TextTool = TextTool;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var DividerTool = /** @class */ (function () {
        function DividerTool() {
        }
        DividerTool.prototype.getLabel = function () {
            return Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.dividerToolLabel);
        };
        DividerTool.prototype.getType = function () {
            return Editor.CommonConstants.dividerToolType;
        };
        DividerTool.prototype.getContentTransformation = function () {
            // Use additional dividerWrapper div for the correct alignment in the all Outlook versions.
            return '<div class="dividerWrapper" align="center"><table style="padding: 0px; margin: 0px; width: 100%" aria-role="presentation"><tbody><tr style="padding: 0px;"><td style="margin:0px; padding-left: 0px; padding-right: 0px; padding-top: 5px; padding-bottom: 5px; vertical-align:top;"><p style="margin: 0px; padding: 0px; border-bottom-width: 3px; border-bottom-style: solid; border-bottom-color: rgb(0, 0, 0); line-height: 0px; width: 100%;"><span>&nbsp;</span></p></td></tr></tbody></table></div>';
        };
        DividerTool.prototype.getTitle = function () {
            return Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.dividerToolTitle);
        };
        DividerTool.prototype.getCssClass = function () {
            return "dividerTool";
        };
        return DividerTool;
    }());
    Editor.DividerTool = DividerTool;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
     * Adapter between IPlugin and CKEDITOR.plugins.IPluginDefinition.
     */
    var CKEditorPluginAdapter = /** @class */ (function () {
        /**
         * Initializes a new instance of the CKEditorCommandAdapter class.
         * @param _CKEDITOR CKEDITOR.
         * @param plugin plugin to wrap.
         * @param eventBroker event broker used.
         * @param getElement function to get the currently selected element.
         * @param getWrappedBlockFunction function to get the top-wrapping element, for the selected element.
         * @param logger the logger.
         */
        function CKEditorPluginAdapter(_CKEDITOR, plugin, eventBroker, getElement, getWrappedBlockFunction, executionContext) {
            this.ckEditorKeyboardAdapter = new Editor.CkEditorKeyboardAdapter();
            this._CKEDITOR = _CKEDITOR;
            this.plugin = plugin;
            this.eventBroker = eventBroker;
            this.getElementFunction = getElement;
            this.getWrappedBlockFunction = getWrappedBlockFunction;
            this.executionContext = executionContext;
        }
        /**
         * Initialize the editor. This is called from CKEditor.
         * @param editor an instance of CKEditor.editor.
         */
        CKEditorPluginAdapter.prototype.init = function (editor) {
            var _this = this;
            this.executionContext.tryExecute(function () {
                // register commands
                $.each(_this.plugin.getCommands(), function (index, command) {
                    _this.registerCommand(command, editor);
                });
                // register buttons
                $.each(_this.plugin.getToolbarButtons(), function (index, button) {
                    _this.registerButton(button, editor);
                });
                // register combos
                $.each(_this.plugin.getToolbarCombos(), function (index, combo) {
                    _this.registerCombo(combo, editor);
                });
            }, "Initialize the ckeditor", true);
        };
        CKEditorPluginAdapter.prototype.dispose = function () {
            var _this = this;
            this.executionContext.tryExecute(function () {
                // Dispose
                $.each(_this.plugin.getCommands(), function (index, command) { command.dispose(); });
            }, "Dispose the ckeditor commands");
            this.getWrappedBlockFunction = null;
            this.ckEditorKeyboardAdapter = null;
            this.getElementFunction = null;
            this.eventBroker = null;
            this.plugin = null;
        };
        /**
         * Register a command with ckeditor.
         * @param command a command instance.
         * @param editor a CKEditor instance.
         */
        CKEditorPluginAdapter.prototype.registerCommand = function (command, editor) {
            editor.addCommand(command.getName(), new Editor.CKEditorCommandAdapter(command, this.getElementFunction, this.getWrappedBlockFunction, this.executionContext));
        };
        /**
         * Register a toolbar button with CKEditor.
         * @param button an instance of IButton.
         * @param editor an instance of CKEditor.
         */
        CKEditorPluginAdapter.prototype.registerButton = function (button, editor) {
            editor.ui.addButton(button.getName(), new Editor.CKEditorButtonAdapter(button));
            // Adding the keyboard shortcut for the button
            var keyCommand = button.getKeyboardShortcut();
            if (!Object.isNullOrUndefined(keyCommand)) {
                editor.setKeystroke(this.ckEditorKeyboardAdapter.getCkEditorKeyCode(keyCommand), button.getCommand().getName());
            }
        };
        /**
         * Register a toolbar combo with CKEditor.
         * @param combo an instance of ICombo.
         * @param editor an instance of CKEditor.
         */
        CKEditorPluginAdapter.prototype.registerCombo = function (combo, editor) {
            editor.ui.addRichCombo(combo.getName(), new Editor.CKEditorComboAdapter(this._CKEDITOR.skin.getPath("editor"), combo, editor, this.executionContext));
        };
        return CKEditorPluginAdapter;
    }());
    Editor.CKEditorPluginAdapter = CKEditorPluginAdapter;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
     * Adapter between IButton and CKEDITOR.dialog.definition.button
     */
    var CKEditorButtonAdapter = /** @class */ (function () {
        /**
         * Initializes a new instance of the CKEditorCommandAdapter.
         * @param button an instance of ICommand.
         */
        function CKEditorButtonAdapter(button) {
            this.button = button;
            this.label = Editor.CommonUtils.getLocalizedString(button.getLabel());
            this.command = button.getCommand().getName();
            this.iconSrc = button.getIconSrc();
        }
        /**
         * Gets the name of the command.
         */
        CKEditorButtonAdapter.prototype.getName = function () {
            return this.button.getName();
        };
        return CKEditorButtonAdapter;
    }());
    Editor.CKEditorButtonAdapter = CKEditorButtonAdapter;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
     * Adapter between ICombo and CKEDITOR.dialog.definition.richCombo
     */
    var CKEditorComboAdapter = /** @class */ (function () {
        /**
         * Initializes a new instance of the CKEditorCommandAdapter.
         * @param editorSkinPath the ckeditor skin path.
         * @param combo an instance of ICommand.
         * @param editor the Ckeditor instance.
         * @param logger the logger.
         */
        function CKEditorComboAdapter(editorSkinPath, combo, editor, executionContext) {
            var _this = this;
            this.multiSelect = false;
            this.saveEditorState = "saveSnapshot";
            this.combo = combo;
            this.editor = editor;
            this.executionContext = executionContext;
            this.executionContext.tryExecute(function () {
                _this.readOnly = _this.combo.getCommand().enabledOnReadOnly() ? 1 : 0;
                // Set the styles of the combo
                var styles = [editorSkinPath];
                if (Array.isArray(_this.editor.config.contentsCss)) {
                    _this.editor.config.contentsCss.forEach(function (style) {
                        styles.push(style);
                    });
                }
                else {
                    styles.push(_this.editor.config.contentsCss);
                }
                _this.panel = { css: styles };
                _this.label = Editor.CommonUtils.getLocalizedString(_this.combo.getLabel());
                _this.command = combo.getCommand().getName();
            }, "Initialize ckeditor combo", true);
        }
        // Define the richCombo function.
        CKEditorComboAdapter.prototype.startGroup = function (name) { };
        CKEditorComboAdapter.prototype.add = function (value, html, text) { };
        CKEditorComboAdapter.prototype.setValue = function (value, text) { };
        /**
         * Configures combo items.
         */
        CKEditorComboAdapter.prototype.init = function () {
            var _this = this;
            this.content = this.combo.getItems();
            this.startGroup(Editor.CommonUtils.getLocalizedString(this.combo.getGroup()));
            $.each(this.content, function (index, item) {
                var textValue = Editor.CommonUtils.getLocalizedString(item.text);
                _this.executionContext.tryExecute(function () {
                    // value, html, text
                    _this.add(item.value, textValue, textValue);
                }, "Add ckeditor combo elements");
            });
        };
        /**
         * Sets action by clicking on the combo item.
         * @param value of the combo item.
         */
        CKEditorComboAdapter.prototype.onClick = function (value) {
            var _this = this;
            var selectedItem = this.content.filter(function (item) {
                if (item.value == value) {
                    return true;
                }
            })[0];
            var textValue = Editor.CommonUtils.getLocalizedString(selectedItem.text);
            this.label = textValue;
            this.executionContext.tryExecute(function () {
                _this.setValue(selectedItem.value, textValue);
                _this.editor.focus();
                // execute command
                _this.combo.getCommand().exec($(_this.editor.element.$), null, null, value);
                // We need to save the state to display the selected value in the dropdown
                _this.editor.focus();
                _this.editor.fire(_this.saveEditorState);
            }, "Set ckeditor combo value", true, function () { _this.editor.focus(); });
        };
        /**
         * Gets the name of the command.
         */
        CKEditorComboAdapter.prototype.getName = function () {
            return this.combo.getName();
        };
        return CKEditorComboAdapter;
    }());
    Editor.CKEditorComboAdapter = CKEditorComboAdapter;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var Dictionary = MktSvc.Controls.Common.Dictionary;
    /**
     * Adapter between ICommand and CKEDITOR.commandDefinition.
     */
    var CKEditorCommandAdapter = /** @class */ (function () {
        /**
         * Initializes a new instance of the CKEditorCommandAdapter.
         * @param command an instance of ICommand.
         * @param getElementFunction function to get the currently selected element.
         * @param getWrappedBlockFunction function to get the top-wrapping element for the selected element.
         * @param logger the logger.
         */
        function CKEditorCommandAdapter(command, getElementFunction, getWrappedBlockFunction, executionContext) {
            this.readOnly = command.enabledOnReadOnly() ? 1 : 0;
            this.command = command;
            this.getElementFunction = getElementFunction;
            this.getWrappedBlockFunction = getWrappedBlockFunction;
            this.executionContext = executionContext;
        }
        /**
         * Gets the name of the command.
         */
        CKEditorCommandAdapter.prototype.getName = function () {
            return this.command.getName();
        };
        /**
         * Command executed from CKEditor.
         * Maps between the CKEditor version and ICommand.execute.
         * @param editor an instance of CKEditor.Editor.
         * @param data data, if any.
         */
        CKEditorCommandAdapter.prototype.exec = function (editor, data) {
            var _this = this;
            var result = false;
            this.executionContext.tryExecute(function () {
                var selectedBlock = _this.getElementFunction();
                var containerBlock = _this.getWrappedBlockFunction(selectedBlock);
                var selectedHtmlObject = editor.getSelectedHtml();
                var selectedHtml = Object.isNullOrUndefined(selectedHtmlObject) ? $() : $(selectedHtmlObject.$);
                // Selected HTML jQuery object needs to be normalized (IE and FX wrap selection into DocumentFragment and jQuery doesn't 'find' inside it)
                var normalizedSelectedHtml = !Object.isNullOrUndefined(selectedHtml.prop) &&
                    selectedHtml.prop("nodeName") === "#document-fragment"
                    ? selectedHtml.contents()
                    : selectedHtml;
                result = _this.command.exec(selectedBlock, containerBlock, normalizedSelectedHtml);
            }, "Execute CKEditor command", false, null, new Dictionary({ CommandName: this.getName() }));
            return result;
        };
        return CKEditorCommandAdapter;
    }());
    Editor.CKEditorCommandAdapter = CKEditorCommandAdapter;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="contextexecution/iexecutioncontext.ts" />
/// <reference path="contextexecution/defaultexecutioncontext.ts" />
/// <reference path="designereditor/ckeditorcommand.ts" />
/// <reference path="popups/ipopuprenderer.ts" />
/// <reference path="popups/popuprenderer.ts" />
/// <reference path="IControl.ts" />
/// <reference path="Control.ts" />
/// <reference path="Utils\CommonUtils.ts" />
/// <reference path="Utils\BrowserQuirks.ts" />
/// <reference path="CommonConstants.ts" />
/// <reference path="Popups\AccessibilityInstructionsPopup.ts" />
/// <reference path="Accessibility\AccessibilityInstructionsDialog\IAccessibilityDialogElement.ts" />
/// <reference path="Accessibility\AccessibilityInstructionsDialog\EditorAccessibilityInstructions.ts" />
/// <reference path="Accessibility\AriaAttributeNames.ts" />
/// <reference path="DesignerEditor\BlockControllers\BlockProvider.ts" />
/// <reference path="DesignerEditor\BlockControllers\BlockDefinition.ts" />
/// <reference path="DesignerEditor\BlockControllers\BlockDefinitionFactory.ts" />
/// <reference path="DesignerEditor\BlockControllers\BlockDraggableController.ts" />
/// <reference path="DesignerEditor\BlockControllers\BlockEditableControler.ts" />
/// <reference path="DesignerEditor\BlockControllers\BlockIdController.ts" />
/// <reference path="DesignerEditor\BlockControllers\BlockInlineToolbarController.ts" />
/// <reference path="DesignerEditor\BlockControllers\BlockLoadedController.ts" />
/// <reference path="DesignerEditor\BlockControllers\BlockClickedController.ts" />
/// <reference path="DesignerEditor\BlockControllers\BlockAddModeController.ts" />
/// <reference path="Configuration\BlockDetailsView\DetailsViewConstants.ts" />
/// <reference path="Configuration\BlockDetailsView\IBlockDetailsView.ts" />
/// <reference path="Configuration\BlockDetailsView\DividerDetailsView.ts" />
/// <reference path="Configuration\BlockDetailsView\ButtonDetailsView.ts" />
/// <reference path="Configuration\BlockDetailsView\ImageDetailsView.ts" />
/// <reference path="Configuration\BlockDetailsView\DetailsViewControl.ts" />
/// <reference path="Configuration\BlockDetailsView\IDetailsViewControl.ts" />
/// <reference path="Configuration\BlockDetailsView\Renderers\ISectionRenderer.ts" />
/// <reference path="Configuration\BlockDetailsView\Renderers\SectionRenderer.ts" />
/// <reference path="Configuration\BlockDetailsView\Renderers\IInputFieldRenderer.ts" />
/// <reference path="Configuration\BlockDetailsView\Renderers\InputFieldRenderer.ts" />
/// <reference path="DesignerEditor\BlockControllers\IBlockController.ts" />
/// <reference path="DesignerEditor\BlockControllers\BlockDroppableController.ts" />
/// <reference path="Configuration\Blocks\IBlock.ts" />
/// <reference path="DesignerEditor\ContainerControllers\ContainerProvider.ts" />
/// <reference path="DesignerEditor\ContainerControllers\ContainerDroppableController.ts" />
/// <reference path="DesignerEditor\ContainerControllers\ContainerSortableController.ts" />
/// <reference path="designereditor\containercontrollers\ContainerDragModeController.ts" />
/// <reference path="DesignerEditor\ContainerControllers\ContainerAddModeController.ts" />
/// <reference path="DesignerEditor\ContainerControllers\IContainerController.ts" />
/// <reference path="EventArgs\EventArgs.ts" />
/// <reference path="DesignerEditor\EventArgs\BlockAddedEventArgs.ts" />
/// <reference path="DesignerEditor\EventArgs\DesignerAddStartEventArgs.ts" />
/// <reference path="DesignerEditor\EventArgs\BlockCleanupRequestedEventArgs.ts" />
/// <reference path="DesignerEditor\DesignerInternalEventConstants.ts" />
/// <reference path="DesignerEditor\EventArgs\CKEditorInstanceReadyEventArgs.ts" />
/// <reference path="DesignerEditor\EventArgs\CkEditorFocusEventArgs.ts" />
/// <reference path="EventArgs\ContentChangedEventArgs.ts" />
/// <reference path="EventArgs\ImageAttributeChangedEventArgs.ts" />
/// <reference path="EventArgs\ToolbarShownEventArgs.ts"/>
/// <reference path="EventArgs\HrefAttributeChangedEventArgs.ts" />
/// <reference path="EventArgs\ControlRenderedEventArgs.ts" />
/// <reference path="EventArgs\ControllerReadyEventArgs.ts" />
/// <reference path="DesignerEditor\EventArgs\SelectionChangedEventArgs.ts" />
/// <reference path="DesignerEditor\MenuBar\MenuBarView.ts" />
/// <reference path="DesignerEditor\MenuBar\UndoButton.ts"/>
/// <reference path="DesignerEditor\MenuBar\RedoButton.ts"/>
/// <reference path="DesignerEditor\MenuBar\ToolsDropdown.ts"/>
/// <reference path="Factory\EditorControlFactory.ts" />
/// <reference path="Factory\BasicPluginFactory.ts" />
/// <reference path="Factory\BrowserPreviewFactory.ts" />
/// <reference path="Factory\DetailsViewControlFactory.ts" />
/// <reference path="Layout\ILayoutRenderer.ts" />
/// <reference path="HtmlEditor\HtmlContentEditor.ts" />
/// <reference path="HtmlEditor\HtmlContentHighlightParser.ts" />
/// <reference path="HtmlEditor\IHtmlContentHighlightRangeModel.ts" />
/// <reference path="HtmlEditor\HtmlNotSupportedView.ts" />
/// <reference path="Configuration\InlineToolbars\BasicTextInlineToolbar.ts" />
/// <reference path="Configuration\InlineToolbars\BasicButtonInlineToolbar.ts" />
/// <reference path="Configuration\InlineToolbars\BasicImageInlineToolbar.ts" />
/// <reference path="Configuration\InlineToolbars\BasicDividerInlineToolbar.ts" />
/// <reference path="Configuration\InlineToolbars\ProtectedDataBlockInlineToolbar.ts" />
/// <reference path="Configuration\Blocks\ImageBlock.ts" />
/// <reference path="Configuration\Blocks\TextBlock.ts" />
/// <reference path="Configuration\Blocks\ButtonBlock.ts" />
/// <reference path="Configuration\Blocks\DividerBlock.ts" />
/// <reference path="Configuration\Command\DividerAlignCommand.ts" />
/// <reference path="DocumentContentModel\Contract.ts" />
/// <reference path="EventConstants.ts" />
/// <reference path="DesignerEditor\CkEditorProxy.ts" />
/// <reference path="DesignerEditor\InlineCkEditorProxy.ts" />
/// <reference path="DesignerEditor\StandardCkEditorProxy.ts" />
/// <reference path="DesignerEditor\ICkEditorProxy.ts" />
/// <reference path="DesignerEditor\CustomCkEditorConfiguration.ts" />
/// <reference path="IDisposable.ts" />
/// <reference path="Layout\ComponentLayoutConfiguration.ts" />
/// <reference path="Layout\LayoutConfiguration.ts" />
/// <reference path="Configuration\plugins\BasicPlugin.ts" />
/// <reference path="DesignerEditor\DesignerContentEditor.ts" />
/// <reference path="Layout\LayoutRenderer.ts" />
/// <reference path="ComposeControl.ts" />
/// <reference path="TabControl\TabControlItem.ts" />
/// <reference path="TabControl\TabControl.ts" />
/// <reference path="elementdata\imagedata.ts" />
/// <reference path="elementdata\linkdata.ts" />
/// <reference path="EditorControl.ts" />
/// <reference path="Configuration\plugins\IPlugin.ts" />
/// <reference path="Preview\OfflineNotSupportedPreviewView.ts" />
/// <reference path="Preview\BrowserPreview\OfflineBrowserPreviewView.ts" />
/// <reference path="Preview\BrowserPreview\PreviewHeaderItemDescription.ts" />
/// <reference path="Preview\BrowserPreview\PreviewIconDescription.ts" />
/// <reference path="Preview\BrowserPreview\PreviewTitleDescription.ts" />
/// <reference path="Preview\BrowserPreview\BrowserPreviewView.ts" />
/// <reference path="DesignerEditor\DetailsView.ts" />
/// <reference path="DesignerEditor\IDetailsViewModel.ts" />
/// <reference path="DesignerEditor\ToolboxView.ts" />
/// <reference path="Configuration\Tool\ImageTool.ts" />
/// <reference path="Configuration\Tool\ButtonTool.ts" />
/// <reference path="Configuration\Tool\TextTool.ts" />
/// <reference path="Configuration\Tool\DividerTool.ts" />
/// <reference path="Configuration\Tool\ITool.ts" />
/// <reference path="Configuration\Adapters\CKEditorPluginAdapter.ts" />
/// <reference path="Configuration\Adapters\CKEditorButtonAdapter.ts" />
/// <reference path="Configuration\Adapters\CKEditorComboAdapter.ts" />
/// <reference path="Configuration\Adapters\CKEditorCommandAdapter.ts" />
/// <reference path="typings\ckeditor.d.ts" />
/// <reference path="..\..\..\client\OpenSource\typings\jquery\jquery.d.ts" />
/// <reference path="..\..\..\client\OpenSource\typings\jqueryui.TypeScript.DefinitelyTyped\jqueryui.d.ts" />
/// <reference path="typings\monaco.d.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var VideoDetailsView = /** @class */ (function () {
        function VideoDetailsView(detailsViewControl, provider, lookupViewId) {
            this.detailsViewControl = detailsViewControl;
            this.provider = provider;
            this.lookupViewId = lookupViewId;
        }
        VideoDetailsView.prototype.init = function (eventBroker, containerId) {
            this.eventBroker = eventBroker;
            this.containerId = containerId;
            this.detailsViewControl.init(this.containerId, this.eventBroker);
        };
        VideoDetailsView.prototype.dispose = function () {
            this.detailsViewControl.dispose();
            this.eventBroker = null;
            this.clearContainer();
        };
        VideoDetailsView.prototype.render = function (selectedBlock) {
            var _this = this;
            this.clearContainer();
            var videoWrapper = selectedBlock.find("." + Editor.CommonConstants.videoWrapperClass);
            var videoId = videoWrapper.attr(Editor.CommonConstants.videoIdAttrName);
            var videoName = videoWrapper.attr(Editor.CommonConstants.videoNameAttrName);
            var initialValue = null;
            if (videoId && videoName) {
                initialValue = { Id: videoId, Name: videoName };
            }
            var mainSection = this.detailsViewControl.createSection(Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.videoSectionTitle));
            var lookupContainerId = Editor.DetailsViewConstants.videoLookupContainerId + Editor.CommonConstants.videoToolType;
            this.detailsViewControl.createLookupContainer(mainSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.srcLabel), Editor.DetailsViewConstants.videoLookupCssClass, lookupContainerId);
            var lookupContainer = Editor.CommonUtils.getById(lookupContainerId);
            this.provider.getLookupField().loadLookup(lookupContainer, Editor.VideoBlockProvider.EntityName, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.videoSectionTitle), this.lookupViewId, function (lookupValue) {
                _this.onVideoSelected(selectedBlock, lookupValue);
            }, initialValue);
            this.eventBroker.notify(Editor.EventConstants.controlRendered, new Editor.ControlRenderedEventArgs(this.containerId));
        };
        VideoDetailsView.prototype.onVideoSelected = function (selectedBlock, lookupValue) {
            var _this = this;
            if (lookupValue != null) {
                var videoId = lookupValue.id ? lookupValue.id : lookupValue.Id;
                if (videoId != null) {
                    this.provider
                        .getExecutionContext()
                        .getConfigurationProvider()
                        .getEntityData(Editor.VideoBlockProvider.EntityName, videoId, function (result) { return _this.onVideoRetrieved(selectedBlock, result); });
                }
            }
        };
        VideoDetailsView.prototype.onVideoRetrieved = function (selectedBlock, videoEntity) {
            if (!MktSvc.Controls.Common.Object.isNullOrUndefined(videoEntity)) {
                var eventArgs = new Editor.VideoSelectionChangedEventArgs(selectedBlock, videoEntity.msdyncrm_videoid, videoEntity.msdyncrm_name, videoEntity.msdyncrm_videourl, videoEntity.msdyncrm_videothumbnailurl, videoEntity.msdyncrm_videoembedcode);
                this.eventBroker.notify(Editor.EventConstants.videoSelectionChanged, eventArgs);
                this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentBlockChanged, new Editor.BlockChangedEventArgs(this.containerId, selectedBlock));
            }
        };
        VideoDetailsView.prototype.clearContainer = function () {
            Editor.CommonUtils.getById(this.containerId).empty();
        };
        return VideoDetailsView;
    }());
    Editor.VideoDetailsView = VideoDetailsView;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var VideoBlock = /** @class */ (function () {
        function VideoBlock(isEmbedCodeSupported) {
            this.inlineToolbar = new Editor.BasicVideoInlineToolbar();
            this.isEmbedCodeSupported = isEmbedCodeSupported;
        }
        VideoBlock.prototype.getType = function () {
            return Editor.CommonConstants.videoToolType;
        };
        VideoBlock.prototype.usePlainText = function () {
            return false;
        };
        VideoBlock.prototype.isEditable = function () {
            return false;
        };
        VideoBlock.prototype.getInlineToolbar = function () {
            return this.inlineToolbar;
        };
        VideoBlock.prototype.setup = function (eventBroker) {
            var _this = this;
            this.eventBroker = eventBroker;
            if (Object.isNullOrUndefined(this.onVideoSelectionChanged)) {
                this.eventBroker.subscribe(Editor.EventConstants.videoSelectionChanged, this.onVideoSelectionChanged =
                    function (e) { _this.videoSelectionChanged(e); });
            }
        };
        VideoBlock.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.onVideoSelectionChanged)) {
                this.eventBroker.unsubscribe(Editor.EventConstants.videoSelectionChanged, this.onVideoSelectionChanged);
                this.onVideoSelectionChanged = null;
            }
        };
        VideoBlock.prototype.decorate = function (block) {
            this.decorateBlockOverlay(block);
            this.setAriaLabel(block);
            if (this.isConfigured(block)) {
                var videoWrapper = this.getVideoWrapperBlock(block);
                var videoThumbnail = videoWrapper.attr(Editor.CommonConstants.videoThumbnailUrlAttrName);
                if (this.isEmbedCodeSupported) {
                    var embedCodeAttrValue = videoWrapper.attr(Editor.CommonConstants.videoEmbedCodeAttrName);
                    if (String.isNullOrEmpty(embedCodeAttrValue)) {
                        var iframeHtml = videoWrapper.find("iframe").prop("outerHTML");
                        videoWrapper.attr(Editor.CommonConstants.videoEmbedCodeAttrName, iframeHtml);
                    }
                }
                videoWrapper.empty();
                videoWrapper.append($("<img>").attr("src", videoThumbnail));
            }
        };
        VideoBlock.prototype.decorateBlockOverlay = function (block) {
            var videoWrapper = this.getVideoWrapperBlock(block);
            var parentBlock = videoWrapper.parent();
            Editor.CommonUtils.removeBlockOverlay(block);
            if (!this.isConfigured(block)) {
                Editor.CommonUtils.overlayBlockElement(parentBlock, videoWrapper, Editor.CommonUtils.getVideoPlaceholder());
            }
        };
        VideoBlock.prototype.setAriaLabel = function (block) {
            var txt = "[" + (!this.isConfigured(block) ? "Unconfigured " : String.Empty) + block.attr(Editor.Contract.blockTypeAttrName) + " block]";
            var translatedText = Editor.CommonUtils.getLocalizedString(txt);
            var element = Editor.BlockProvider.getEditableElement(block);
            Editor.CommonUtils.setAriaAttribute(block, "aria-label", translatedText);
            Editor.CommonUtils.setAriaAttribute(element, "aria-label", translatedText);
            Editor.CommonUtils.setAriaAttribute(element, "title", translatedText);
        };
        VideoBlock.prototype.isConfigured = function (block) {
            var videoWrapper = this.getVideoWrapperBlock(block);
            var videoId = videoWrapper.attr(Editor.CommonConstants.videoIdAttrName);
            var videoName = videoWrapper.attr(Editor.CommonConstants.videoNameAttrName);
            var videoUrl = videoWrapper.attr(Editor.CommonConstants.videoUrlAttrName);
            var videoThumbnail = videoWrapper.attr(Editor.CommonConstants.videoThumbnailUrlAttrName);
            if (!videoId || !videoName || !videoUrl || !videoThumbnail) {
                return false;
            }
            var videoEmbedCode = videoWrapper.attr(Editor.CommonConstants.videoEmbedCodeAttrName);
            if (this.isEmbedCodeSupported && String.isNullOrEmpty(videoEmbedCode)) {
                return false;
            }
            return true;
        };
        VideoBlock.prototype.setFinalContent = function (block) {
            Editor.CommonUtils.removeBlockOverlay(block);
            block.removeAttr("aria-label");
            var videoWrapper = this.getVideoWrapperBlock(block);
            var videoUrl = videoWrapper.attr(Editor.CommonConstants.videoUrlAttrName);
            var videoThumbnail = videoWrapper.attr(Editor.CommonConstants.videoThumbnailUrlAttrName);
            var videoEmbedCode = videoWrapper.attr(Editor.CommonConstants.videoEmbedCodeAttrName);
            videoWrapper.empty();
            if (this.isEmbedCodeSupported) {
                videoWrapper.html(videoEmbedCode);
            }
            else {
                var videoImage = $("<img/>").attr("src", videoThumbnail);
                var videoLink = $("<a/>").attr("href", videoUrl).append(videoImage);
                videoWrapper.append(videoLink);
            }
        };
        VideoBlock.prototype.videoSelectionChanged = function (eventArgs) {
            var videoWrapper = this.getVideoWrapperBlock(eventArgs.element);
            videoWrapper.empty();
            videoWrapper.append($("<img>").attr("src", eventArgs.videoThumbnailUrl));
            videoWrapper.attr(Editor.CommonConstants.videoIdAttrName, eventArgs.videoId);
            videoWrapper.attr(Editor.CommonConstants.videoNameAttrName, eventArgs.videoName);
            videoWrapper.attr(Editor.CommonConstants.videoUrlAttrName, eventArgs.videoUrl);
            videoWrapper.attr(Editor.CommonConstants.videoThumbnailUrlAttrName, eventArgs.videoThumbnailUrl);
            videoWrapper.attr(Editor.CommonConstants.videoEmbedCodeAttrName, eventArgs.videoEmbedCode);
            this.decorateBlockOverlay(eventArgs.element);
            this.setAriaLabel(eventArgs.element);
        };
        VideoBlock.prototype.getVideoWrapperBlock = function (block) {
            return block.find("." + Editor.CommonConstants.videoWrapperClass);
        };
        return VideoBlock;
    }());
    Editor.VideoBlock = VideoBlock;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BasicVideoInlineToolbar = /** @class */ (function () {
        function BasicVideoInlineToolbar() {
        }
        BasicVideoInlineToolbar.prototype.getName = function () {
            return "BasicVideoInlineToolbar";
        };
        BasicVideoInlineToolbar.prototype.getConfig = function () {
            return [["moveBlockBtn", "cloneBlockBtn", "deleteBlockBtn"]];
        };
        return BasicVideoInlineToolbar;
    }());
    Editor.BasicVideoInlineToolbar = BasicVideoInlineToolbar;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var VideoTool = /** @class */ (function () {
        function VideoTool() {
        }
        VideoTool.prototype.getLabel = function () {
            return Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.videoToolLabel);
        };
        VideoTool.prototype.getType = function () {
            return Editor.CommonConstants.videoToolType;
        };
        VideoTool.prototype.getContentTransformation = function () {
            return "<div class=\"" + Editor.CommonConstants.videoWrapperClass + "\"></div>";
        };
        VideoTool.prototype.getTitle = function () {
            return Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.videoToolTitle);
        };
        VideoTool.prototype.getCssClass = function () {
            return Editor.CommonConstants.videoToolCss;
        };
        return VideoTool;
    }());
    Editor.VideoTool = VideoTool;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var CkEditorConstants = /** @class */ (function () {
        function CkEditorConstants() {
        }
        CkEditorConstants.ckEditorImageSrcAttribute = "data-cke-saved-src";
        CkEditorConstants.ckEditorHrefAttribute = "data-cke-saved-href";
        CkEditorConstants.ckEditorSharedResourceAttribute = "ckEditorSharedResource";
        CkEditorConstants.ckEditorNativeListeners = "_cke_nativeListeners";
        CkEditorConstants.ckEditorDialogTextAreaSelector = "span.cke_dialog_ui_html";
        CkEditorConstants.ckEditorDialogPasteFrameSelector = ".cke_pasteframe";
        CkEditorConstants.ckEditorInstanceReadyInternalEventName = "instanceReady";
        CkEditorConstants.ckEditorContentDomInternalEventName = "contentDom";
        CkEditorConstants.ckEditorInputInternalEventName = "input";
        CkEditorConstants.ckEditorChangeInternalEventName = "change";
        CkEditorConstants.ckEditorFocusInternalEventName = "focus";
        CkEditorConstants.ckEditorLoadedStatus = "loaded";
        CkEditorConstants.ckEditorReadyStatus = "ready";
        CkEditorConstants.ckEditorButtonSelector = "a.cke_button";
        CkEditorConstants.ckEditorComboButtonSelector = "a.cke_combo_button";
        CkEditorConstants.ckEditorButtonLabelSelector = ".cke_button_label[id$='label']";
        return CkEditorConstants;
    }());
    Editor.CkEditorConstants = CkEditorConstants;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var VideoSelectionChangedEventArgs = /** @class */ (function (_super) {
        __extends(VideoSelectionChangedEventArgs, _super);
        function VideoSelectionChangedEventArgs(element, videoId, videoName, videoUrl, videoThumbnailUrl, videoEmbedCode) {
            var _this = _super.call(this) || this;
            _this.element = element;
            _this.videoId = videoId;
            _this.videoName = videoName;
            _this.videoUrl = videoUrl;
            _this.videoThumbnailUrl = videoThumbnailUrl;
            _this.videoEmbedCode = videoEmbedCode;
            return _this;
        }
        return VideoSelectionChangedEventArgs;
    }(Editor.EventArgs));
    Editor.VideoSelectionChangedEventArgs = VideoSelectionChangedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
var Editor;
(function (Editor) {
    var AriaRoleConstants;
    (function (AriaRoleConstants) {
        AriaRoleConstants.listbox = "listbox";
        AriaRoleConstants.option = "option";
        AriaRoleConstants.document = "document";
        AriaRoleConstants.presentation = "presentation";
        AriaRoleConstants.textbox = "textbox";
    })(AriaRoleConstants = Editor.AriaRoleConstants || (Editor.AriaRoleConstants = {}));
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
    * Manager for knowing which was the las selected element of a component, in order to be able to select it back
    */
    var FocusManager = /** @class */ (function () {
        function FocusManager(eventBroker, elementFocusedInEvConstant, elementToFocusEvConstant) {
            this.eventBroker = eventBroker;
            this.elementFocusedInEvConstant = elementFocusedInEvConstant;
            this.elementToFocusEvConstant = elementToFocusEvConstant;
        }
        FocusManager.prototype.init = function () {
            var _this = this;
            this.eventBroker.subscribe(this.elementFocusedInEvConstant, this.onSetLastFocusedElement = function (eventArgs) { return _this.setLastFocusedElement(eventArgs.element); });
            this.eventBroker.subscribe(this.elementToFocusEvConstant, this.onFocusLastElement = function () { return _this.focusLastElement(); });
        };
        FocusManager.prototype.dispose = function () {
            this.eventBroker.unsubscribe(this.elementFocusedInEvConstant, this.onSetLastFocusedElement);
            this.eventBroker.unsubscribe(this.elementToFocusEvConstant, this.onFocusLastElement);
            this.lastFocusedElement = null;
        };
        FocusManager.prototype.setLastFocusedElement = function (element) {
            this.lastFocusedElement = element;
        };
        FocusManager.prototype.focusLastElement = function () {
            if (!Object.isNullOrUndefined(this.lastFocusedElement)) {
                this.lastFocusedElement.focus();
            }
        };
        return FocusManager;
    }());
    Editor.FocusManager = FocusManager;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var FocusManagerFactory = /** @class */ (function () {
        function FocusManagerFactory() {
        }
        FocusManagerFactory.prototype.create = function (eventBroker, elementFocusedInEvConstant, elementToFocusEvConstant) {
            return new Editor.FocusManager(eventBroker, elementFocusedInEvConstant, elementToFocusEvConstant);
        };
        return FocusManagerFactory;
    }());
    Editor.FocusManagerFactory = FocusManagerFactory;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var KeyCodes = MktSvc.Controls.Common.KeyCodes;
    /**
     * The keyboard accessibility manager class
     */
    var KeyboardAccessibilityManager = /** @class */ (function () {
        function KeyboardAccessibilityManager() {
            var _this = this;
            this.onContainerRenderedHandler = function (containerRenderedEventArgs) {
                _this.listContainer = containerRenderedEventArgs.element;
                _this.itemsList = _this.accessibleContainer.getAllAccessibleItems();
                _this.listContainer.off("keydown.baseAccessibleList");
                _this.listContainer.on("keydown.baseAccessibleList", (function (event) { return _this.handlerInnerContainerKeyDown(event); }));
            };
            this.onItemRenderedHandler = function (itemRenderedEventArgs) {
                var itemControl = itemRenderedEventArgs.element;
                var itemInnerContainer = itemControl.getJQueryElement();
                itemInnerContainer.off("keydown.baseAccessibleList");
                itemInnerContainer.on("keydown.baseAccessibleList", (function (event) { return _this.handlerItemControlKeyDown(event, itemControl); }));
            };
        }
        /**
        * Initializes the accessible list control
        */
        KeyboardAccessibilityManager.prototype.initialize = function (accessibleContainer) {
            this.accessibleContainer = accessibleContainer;
        };
        /**
         * Disposes the object.
         */
        KeyboardAccessibilityManager.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.itemsList)) {
                this.itemsList.forEach(function (item) { item.getJQueryElement().off("keydown.baseAccessibleList"); });
            }
            if (!Object.isNullOrUndefined(this.listContainer)) {
                this.listContainer.off("keydown.baseAccessibleList");
            }
            this.accessibleContainer = null;
            this.itemsList = null;
            this.listContainer = null;
        };
        /**
         * Handles keyDown when inner container is focused.
         * @param e Event Object
         */
        KeyboardAccessibilityManager.prototype.handlerInnerContainerKeyDown = function (e) {
            if (e.keyCode !== KeyCodes.Left &&
                e.keyCode !== KeyCodes.Up &&
                e.keyCode !== KeyCodes.Right &&
                e.keyCode !== KeyCodes.Down) {
                return;
            }
            if (e.altKey || e.shiftKey || e.ctrlKey || this.itemsList.length === 0) {
                return;
            }
            // Prevents scrolling when user navigates between tools with arrow keys
            e.preventDefault();
            // Bubbled events from accessible items and their children elements should be ignored, because they are processed by handlerItemControlKeyDown
            var targetAndParents = $(e.target).parents().addBack();
            if (this.itemsList.some(function (accessibleItem) { return accessibleItem.getJQueryElement().is(targetAndParents); })) {
                return;
            }
            var selectedItem = this.accessibleContainer.getSelectedAccesibleItem();
            if (!Object.isNullOrUndefined(selectedItem)) {
                this.handlerItemControlKeyDown(e, selectedItem);
                return;
            }
            var nextItemIndex = 0;
            switch (e.keyCode) {
                case KeyCodes.Right:
                case KeyCodes.Down:
                    nextItemIndex = 0;
                    break;
                case KeyCodes.Left:
                case KeyCodes.Up:
                    nextItemIndex = this.itemsList.length - 1;
                    break;
            }
            var item = this.itemsList[nextItemIndex];
            item.focus();
        };
        /**
         * Handles keyDown when one of the items is focused.
         * @param e Event object
         * @param listItem The item
         */
        KeyboardAccessibilityManager.prototype.handlerItemControlKeyDown = function (e, item) {
            if (e.keyCode !== KeyCodes.Enter &&
                e.keyCode !== KeyCodes.Space &&
                e.keyCode !== KeyCodes.Left &&
                e.keyCode !== KeyCodes.Up &&
                e.keyCode !== KeyCodes.Right &&
                e.keyCode !== KeyCodes.Down) {
                return;
            }
            if (e.altKey || e.shiftKey || e.ctrlKey || !this.itemsList.length) {
                return;
            }
            var itemIndex = -1;
            // is not certain the objects implementing IAccessibleItem are equally reference-wise, so the comparision is made against the JQuery elements.
            this.itemsList.some(function (itemList, index) {
                if (item.getJQueryElement() === itemList.getJQueryElement()) {
                    itemIndex = index;
                    return true;
                }
            });
            var nextIndex = 0;
            switch (e.keyCode) {
                case KeyCodes.Space:
                case KeyCodes.Enter:
                    this.itemsList[itemIndex].click();
                    break;
                case KeyCodes.Right:
                    nextIndex = itemIndex + 1;
                    if (nextIndex >= this.itemsList.length) {
                        nextIndex = 0;
                    }
                    this.itemsList[nextIndex].focus();
                    break;
                case KeyCodes.Left:
                    nextIndex = itemIndex - 1;
                    if (nextIndex < 0) {
                        nextIndex = this.itemsList.length - 1;
                    }
                    this.itemsList[nextIndex].focus();
                    break;
                case KeyCodes.Up:
                case KeyCodes.Down:
                    var firstItem_1 = this.itemsList[0];
                    var itemsOnTheFirstRow_1 = 0;
                    this.itemsList.forEach(function (item) {
                        if (item.getJQueryElement().position().top === firstItem_1.getJQueryElement().position().top) {
                            itemsOnTheFirstRow_1++;
                        }
                    });
                    if (this.itemsList.length === itemsOnTheFirstRow_1) {
                        break;
                    }
                    nextIndex = e.keyCode === KeyCodes.Up ?
                        itemIndex - itemsOnTheFirstRow_1 :
                        itemIndex + itemsOnTheFirstRow_1;
                    if (nextIndex < 0) {
                        nextIndex = this.itemsList.length - 1;
                    }
                    else if (nextIndex >= this.itemsList.length) {
                        if (item.getJQueryElement().position().top === this.itemsList[this.itemsList.length - 1].getJQueryElement().position().top) {
                            nextIndex = 0;
                        }
                        else {
                            nextIndex = this.itemsList.length - 1;
                        }
                    }
                    this.itemsList[nextIndex].focus();
                    break;
            }
        };
        /**
        * Make the element focusable, by setting tabindex attribute to element.
        * @param element The JQuery element
        * @param index The value of the tabindex. Default 0.
        */
        KeyboardAccessibilityManager.prototype.SetTabIndex = function (element, tabIndexValue) {
            Editor.CommonUtils.setTabIndex(element, tabIndexValue === undefined ? 0 : tabIndexValue);
        };
        return KeyboardAccessibilityManager;
    }());
    Editor.KeyboardAccessibilityManager = KeyboardAccessibilityManager;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
var Editor;
(function (Editor) {
    /**
     * The implementation of accessible item interface
     */
    var ToolboxAccessibleItem = /** @class */ (function () {
        function ToolboxAccessibleItem(itemInnerContainer, onClickHandler) {
            this.itemInnerContainer = itemInnerContainer;
            this.onClickHandler = onClickHandler;
        }
        /**
         * Focus item
         */
        ToolboxAccessibleItem.prototype.focus = function () {
            this.itemInnerContainer.focus();
        };
        /**
         * Gets the JQuery element.
         */
        ToolboxAccessibleItem.prototype.getJQueryElement = function () {
            return this.itemInnerContainer;
        };
        /**
         * Click item
         */
        ToolboxAccessibleItem.prototype.click = function () {
            this.onClickHandler();
        };
        return ToolboxAccessibleItem;
    }());
    Editor.ToolboxAccessibleItem = ToolboxAccessibleItem;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var AddTextBreakContentModelProcessor = /** @class */ (function () {
        function AddTextBreakContentModelProcessor() {
            this.blockProvider = new Editor.BlockProvider();
        }
        /**
        * Performs a content upgrade/resolution setup on the editor content model.
        */
        AddTextBreakContentModelProcessor.prototype.process = function (documentContent, done) {
            var contents = $(documentContent).contents();
            this.blockProvider.getBlocksOfType(contents, Editor.TextBlock.type).find("p:empty").append("<br>");
            done();
        };
        /**
        * Returns the name of the content model processor.
        */
        AddTextBreakContentModelProcessor.prototype.getName = function () {
            return "AddTextBreakContentModelProcessor";
        };
        /**
        * Dispose.
        */
        AddTextBreakContentModelProcessor.prototype.dispose = function () { };
        return AddTextBreakContentModelProcessor;
    }());
    Editor.AddTextBreakContentModelProcessor = AddTextBreakContentModelProcessor;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Editor;
(function (Editor) {
    /**
     * Provide the method that adds enable
     * stop event propagation logic to inputs.
     */
    var IgnoreChangesWhileInputStrategy = /** @class */ (function () {
        function IgnoreChangesWhileInputStrategy() {
        }
        /**
         * Setup necessary parameters.
         * @param eventBroker event broker.
         */
        IgnoreChangesWhileInputStrategy.prototype.setup = function (eventBroker) {
            this.eventBroker = eventBroker;
        };
        /**
         * Adds stop event propagation logic to input.
         * @param inputElement input jquery element.
         */
        IgnoreChangesWhileInputStrategy.prototype.addStopEventPropogationWhileInput = function (inputElement) {
            var _this = this;
            inputElement.focusin(function (event) {
                _this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerNonEventPropagationStart, new Editor.EventArgs(Editor.CommonConstants.userDetailsViewSimpleInput));
            });
            inputElement.focusout(function (event) {
                _this.eventBroker.notify(Editor.DesignerInternalEventConstants.designerNonEventPropagationEnd, new Editor.EventArgs(Editor.CommonConstants.userDetailsViewSimpleInput));
            });
        };
        return IgnoreChangesWhileInputStrategy;
    }());
    Editor.IgnoreChangesWhileInputStrategy = IgnoreChangesWhileInputStrategy;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Editor;
(function (Editor) {
    'use strict';
    /*
    Gets the localized string
    */
    var OfflineMessages = /** @class */ (function () {
        function OfflineMessages() {
        }
        OfflineMessages.getLocalizedString = function (key, localeId) {
            var localLocaleId = (localeId in OfflineMessages.localeMapping) ? localeId : "1033";
            if (!(key in OfflineMessages.localeMapping[localLocaleId])) {
                return key;
            }
            return OfflineMessages.localeMapping[localLocaleId][key];
        };
        OfflineMessages.messages1025 = {
            "[OfflineErrorMessage]": "مصمم المحتوى غير متوفر دون الاتصال. الرجاء المحاولة مرة أخرى عندما تتصل بالإنترنت.",
            "[OfflineWarningMessage]": "بعض الميزات غير متوفرة أثناء العمل دون اتصال. الرجاء المحاولة مرة أخرى عندما تتصل بالإنترنت."
        };
        OfflineMessages.messages1026 = {
            "[OfflineErrorMessage]": "Дизайнерът на съдържание не е достъпен, докато сте офлайн. Опитайте отново, когато сте свързани.",
            "[OfflineWarningMessage]": "Някои функции не са достъпни офлайн. Опитайте отново, когато се свържете."
        };
        OfflineMessages.messages1027 = {
            "[OfflineErrorMessage]": "El dissenyador de contingut no està disponible fora de línia. Torneu-ho a provar quan tingueu connexió.",
            "[OfflineWarningMessage]": "Algunes característiques no estan disponibles fora de línia. Torneu-ho a provar quan tingueu connexió."
        };
        OfflineMessages.messages1028 = {
            "[OfflineErrorMessage]": "內容設計師無法離線使用。請於連線時再試一次。",
            "[OfflineWarningMessage]": "離線時無法使用部分功能。請於連線時再試一次。"
        };
        OfflineMessages.messages1029 = {
            "[OfflineErrorMessage]": "Návrhář obsahu není v offline režimu dostupný. Zkuste to prosím znovu, až budete připojeni.",
            "[OfflineWarningMessage]": "Některé funkce nejsou v offline režimu dostupné. Zkuste to prosím znovu, až budete připojeni."
        };
        OfflineMessages.messages1030 = {
            "[OfflineErrorMessage]": "Indholdsdesigneren kan ikke bruges offline. Prøv igen, når du atter er online.",
            "[OfflineWarningMessage]": "Nogle funktioner er ikke tilgængelige, når du er offline. Prøv igen, når du er online."
        };
        OfflineMessages.messages1031 = {
            "[OfflineErrorMessage]": "Der Inhaltsdesigner ist offline nicht verfügbar. Wiederholen Sie den Vorgang, wenn eine Onlineverbindung besteht.",
            "[OfflineWarningMessage]": "Einige Funktionen sind offline nicht verfügbar. Versuchen Sie es noch einmal, wenn eine Verbindung besteht."
        };
        OfflineMessages.messages1032 = {
            "[OfflineErrorMessage]": "Η σχεδίαση περιεχομένου δεν είναι διαθέσιμη χωρίς σύνδεση. Δοκιμάστε ξανά, όταν είστε συνδεδεμένοι.",
            "[OfflineWarningMessage]": "Ορισμένες δυνατότητες δεν είναι διαθέσιμες εκτός σύνδεσης. Προσπαθήστε ξανά όταν συνδεθείτε."
        };
        OfflineMessages.messages1033 = {
            "[OfflineErrorMessage]": "The content designer isn't available offline. Please try again when you're connected.",
            "[OfflineWarningMessage]": "Some features aren't available offline. Please try again when you're connected."
        };
        OfflineMessages.messages1035 = {
            "[OfflineErrorMessage]": "Sisällön suunnitteluohjelma ei ole käytettävissä offline-tilassa. Yritä uudelleen, kun yhteys on muodostettu.",
            "[OfflineWarningMessage]": "Joitakin ominaisuuksia ei voi käyttää offline-tilassa. Yritä uudelleen, kun yhteys on muodostettu."
        };
        OfflineMessages.messages1036 = {
            "[OfflineErrorMessage]": "Le concepteur de contenu n’est pas disponible hors connexion. Ressayez lorsque vous serez connecté.",
            "[OfflineWarningMessage]": "Certaines fonctionnalités ne sont pas disponibles hors ligne. Réessayez lorsque vous serez connecté."
        };
        OfflineMessages.messages1037 = {
            "[OfflineErrorMessage]": "‏‫מעצב התוכן אינו זמין כשאתה במצב לא מקוון. נסה שוב כשתהיה מחובר.‬",
            "[OfflineWarningMessage]": "תכונות מסוימות אינן זמינות כשאתה במצב לא מקוון. נסה שוב כשתהיה מחובר."
        };
        OfflineMessages.messages1038 = {
            "[OfflineErrorMessage]": "A tartalomtervező nem érhető el kapcsolat nélküli módban. Próbálja meg újra, miután csatlakozott.",
            "[OfflineWarningMessage]": "Egyes szolgáltatások nem érhetők el kapcsolat nélküli módban. Próbálja meg újra, miután csatlakozott!"
        };
        OfflineMessages.messages1040 = {
            "[OfflineErrorMessage]": "La finestra di progettazione del contenuto non è disponibile in modalità offline. Riprova quando sei connesso.",
            "[OfflineWarningMessage]": "Alcune funzionalità non sono disponibili in modalità offline. Riprova quando sei connesso."
        };
        OfflineMessages.messages1041 = {
            "[OfflineErrorMessage]": "コンテンツ デザイナーはオフラインで使用できません。接続しているときにやり直してください。",
            "[OfflineWarningMessage]": "一部の機能は、オフライン時には使用できません。接続しているときにもう一度お試しください。"
        };
        OfflineMessages.messages1042 = {
            "[OfflineErrorMessage]": "오프라인 상태에서는 콘텐츠 디자이너를 사용할 수 없습니다. 접속되면 다시 시도하십시오.",
            "[OfflineWarningMessage]": "일부 기능은 오프라인 상태에서는 사용할 수 없습니다. 접속되면 다시 시도하십시오."
        };
        OfflineMessages.messages1043 = {
            "[OfflineErrorMessage]": "De functie voor contentontwerp is niet offline beschikbaar. Probeer het opnieuw als u bent verbonden.",
            "[OfflineWarningMessage]": "Sommige functies zijn niet offline beschikbaar. Probeer het opnieuw als u verbonden bent."
        };
        OfflineMessages.messages1044 = {
            "[OfflineErrorMessage]": "Innholdsutforming er ikke tilgjengelig i frakoblet modus. Prøv på nytt når du er tilkoblet.",
            "[OfflineWarningMessage]": "Noen funksjoner er ikke tilgjengelige i frakoblet modus. Prøv på nytt når du er tilkoblet."
        };
        OfflineMessages.messages1045 = {
            "[OfflineErrorMessage]": "Projektant zawartości jest niedostępny w trybie offline. Spróbuj ponownie, gdy nawiążesz połączenie.",
            "[OfflineWarningMessage]": "Niektóre funkcje są niedostępne w trybie offline. Spróbuj ponownie, gdy nawiążesz połączenie."
        };
        OfflineMessages.messages1046 = {
            "[OfflineErrorMessage]": "O designer de conteúdo não está disponível offline. Tente novamente quando você estiver conectado.",
            "[OfflineWarningMessage]": "Alguns recursos do designer não estão disponíveis offline. Tente novamente quando estiver conectado."
        };
        OfflineMessages.messages1048 = {
            "[OfflineErrorMessage]": "Proiectantul de conținut nu este disponibil offline. Încercați din nou când sunteți conectat.",
            "[OfflineWarningMessage]": "Unele caracteristici nu sunt disponibile offline. Încercați din nou când sunteți conectat."
        };
        OfflineMessages.messages1049 = {
            "[OfflineErrorMessage]": "Конструктор содержимого недоступен в автономном режиме. Повторите попытку при наличии подключения.",
            "[OfflineWarningMessage]": "Некоторые функции недоступны при работе в автономном режиме. Повторите попытку при наличии подключения."
        };
        OfflineMessages.messages1050 = {
            "[OfflineErrorMessage]": "Dizajner sadržaja nije dostupan izvan mreže. Ponovno se povežite pa pokušajte ponovno.",
            "[OfflineWarningMessage]": "Neke značajke nisu dostupne izvan mreže. Ponovno se povežite pa pokušajte ponovno."
        };
        OfflineMessages.messages1051 = {
            "[OfflineErrorMessage]": "Návrhár obsahu nie je v režime offline k dispozícii. Skúste to znova po pripojení.",
            "[OfflineWarningMessage]": "Niektoré funkcie nie sú v režime offline k dispozícii. Skúste to znova po pripojení."
        };
        OfflineMessages.messages1053 = {
            "[OfflineErrorMessage]": "Innehållsverktyget är inte tillgängligt offline. Försök igen när du är ansluten.",
            "[OfflineWarningMessage]": "En del funktioner är inte tillgängliga offline. Försök igen när du är ansluten."
        };
        OfflineMessages.messages1054 = {
            "[OfflineErrorMessage]": "ไม่สามารถใช้ตัวออกแบบเนื้อหาขณะออฟไลน์ โปรดลองอีกครั้งเมื่อคุณเชื่อมต่อ",
            "[OfflineWarningMessage]": "ไม่สามารถใช้คุณลักษณะบางอย่างขณะออฟไลน์ โปรดลองอีกครั้งเมื่อคุณเชื่อมต่อ"
        };
        OfflineMessages.messages1055 = {
            "[OfflineErrorMessage]": "İçerik tasarımcısı çevrimdışı kullanılamaz. Lütfen bağlandığınızda yeniden deneyin.",
            "[OfflineWarningMessage]": "Bazı özellikler çevrimdışı olarak kullanılamaz. Lütfen bağlandığınızda yeniden deneyin."
        };
        OfflineMessages.messages1057 = {
            "[OfflineErrorMessage]": "Desainer konten tidak tersedia offline. Coba lagi setelah Anda tersambung.",
            "[OfflineWarningMessage]": "Fitur tertentu tidak tersedia secara offline. Coba lagi setelah Anda tersambung."
        };
        OfflineMessages.messages1058 = {
            "[OfflineErrorMessage]": "Конструктор вмісту недоступний в автономному режимі. Підключіться до Інтернету та повторіть спробу.",
            "[OfflineWarningMessage]": "Певні функції недоступні в автономному режимі. Підключіться до Інтернету та повторіть спробу."
        };
        OfflineMessages.messages1060 = {
            "[OfflineErrorMessage]": "Oblikovalnik vsebine ni na voljo brez povezave. Poskusite znova, ko vzpostavite povezavo.",
            "[OfflineWarningMessage]": "Nekatere funkcije niso na voljo brez povezave. Poskusite znova, ko vzpostavite povezavo."
        };
        OfflineMessages.messages1061 = {
            "[OfflineErrorMessage]": "Sisudisainerit ei saa ühenduseta kasutada. Proovige uuesti, kui olete ühendatud.",
            "[OfflineWarningMessage]": "Mõni funktsioon pole ühenduseta kättesaadav. Proovige uuesti, kui olete ühendatud."
        };
        OfflineMessages.messages1062 = {
            "[OfflineErrorMessage]": "Satura noformētājs nav pieejams bezsaistē. Lūdzu, mēģiniet vēlreiz, kad būs izveidots savienojums.",
            "[OfflineWarningMessage]": "Daži līdzekļi nav pieejami bezsaistē. Mēģiniet vēlreiz pēc savienojuma izveides."
        };
        OfflineMessages.messages1063 = {
            "[OfflineErrorMessage]": "Neprisijungę negalėsite naudoti turinio dizaino įrankio. Bandykite dar kartą, kai būsite prisijungę.",
            "[OfflineWarningMessage]": "Neprisijungę negalėsite naudoti kai kurių funkcijų. Bandykite dar kartą, kai būsite prisijungę."
        };
        OfflineMessages.messages1066 = {
            "[OfflineErrorMessage]": "Không thể sử dụng công cụ thiết kế nội dung ở chế độ ngoại tuyến. Vui lòng thử lại khi bạn đã kết nối.",
            "[OfflineWarningMessage]": "Không thể sử dụng một số tính năng ở chế độ ngoại tuyến. Vui lòng thử lại khi bạn đã kết nối."
        };
        OfflineMessages.messages1069 = {
            "[OfflineErrorMessage]": "Eduki diseinatzailea ez dago erabilgarri lineaz kanpo bazaude. Saiatu berriro Interneteko konexioa duzunean.",
            "[OfflineWarningMessage]": "Zenbait eginbide ez daude erabilgarri lineaz kanpo zaudenean. Saiatu berriro Internetera konektatuta zaudenean."
        };
        OfflineMessages.messages1081 = {
            "[OfflineErrorMessage]": "सामग्री डिज़ाइनर ऑफ़लाइन उपलब्ध नहीं है. कृपया कनेक्ट होने पर पुनः प्रयास करें.",
            "[OfflineWarningMessage]": "कुछ सुविधाएँ ऑफ़लाइन उपलब्ध नहीं हैं. कृपया कनेक्ट होने पर पुनः प्रयास करें."
        };
        OfflineMessages.messages1086 = {
            "[OfflineErrorMessage]": "Pereka kandungan tidak tersedia secara luar talian. Sila cuba lagi apabila anda kembali dalam talian.",
            "[OfflineWarningMessage]": "Beberapa ciri tidak akan tersedia sewaktu anda bekerja di luar talian. Sila cuba lagi apabila anda kembali dalam talian."
        };
        OfflineMessages.messages1087 = {
            "[OfflineErrorMessage]": "Мазмұн құрастырғыш офлайн режимде қолжетімді емес. Желіге қосылған кезіңізде әрекетті қайталаңыз.",
            "[OfflineWarningMessage]": "Кейбір мүмкіндіктер офлайн режимде қолжетімді емес. Желіге қосылған кезіңізде әрекетті қайталаңыз."
        };
        OfflineMessages.messages1110 = {
            "[OfflineErrorMessage]": "O deseñador de contidos non está dispoñible sen conexión. Ténteo de novo cando se conecte.",
            "[OfflineWarningMessage]": "Algunhas funcionalidades non están dispoñibles sen conexión. Ténteo de novo cando se conecte."
        };
        OfflineMessages.messages2052 = {
            "[OfflineErrorMessage]": "内容设计器在脱机状态时不可用。请在连接后重试。",
            "[OfflineWarningMessage]": "某些功能在脱机状态时不可用。请在连接后重试。"
        };
        OfflineMessages.messages2057 = {
            "[OfflineErrorMessage]": "The content designer isn't available offline. Please try again when you're connected.",
            "[OfflineWarningMessage]": "Some features aren't available offline. Please try again when you're connected."
        };
        OfflineMessages.messages2070 = {
            "[OfflineErrorMessage]": "O estruturador de conteúdos não está disponível offline. Tente novamente quando estiver ligado.",
            "[OfflineWarningMessage]": "Algumas funcionalidades não estão disponíveis offline. Tente novamente quando estiver ligado."
        };
        OfflineMessages.messages2074 = {
            "[OfflineErrorMessage]": "Dizajner sadržaja nije dostupan van mreže. Pokušajte ponovo kad se povežete.",
            "[OfflineWarningMessage]": "Neke funkcije nisu dostupne van mreže. Pokušajte ponovo kad se povežete."
        };
        OfflineMessages.messages3076 = {
            "[OfflineErrorMessage]": "內容設計師無法離線使用。請於連線時再試一次。",
            "[OfflineWarningMessage]": "離線時無法使用部分功能。請於連線時再試一次。"
        };
        OfflineMessages.messages3081 = {
            "[OfflineErrorMessage]": "The content designer isn't available offline. Please try again when you're connected.",
            "[OfflineWarningMessage]": "Some features aren't available offline. Please try again when you're connected."
        };
        OfflineMessages.messages3082 = {
            "[OfflineErrorMessage]": "El diseñador de contenido no está disponible sin conexión. Vuelva a intentarlo cuando esté conectado.",
            "[OfflineWarningMessage]": "Algunas características no están disponibles sin conexión. Vuelva a intentarlo cuando esté conectado."
        };
        OfflineMessages.messages3084 = {
            "[OfflineErrorMessage]": "Le concepteur de contenu n’est pas disponible hors connexion. Ressayez lorsque vous serez connecté.",
            "[OfflineWarningMessage]": "Certaines fonctionnalités ne sont pas disponibles hors ligne. Réessayez lorsque vous serez connecté."
        };
        OfflineMessages.messages3098 = {
            "[OfflineErrorMessage]": "Дизајнер садржаја није доступан ван мреже. Покушајте поново кад се повежете.",
            "[OfflineWarningMessage]": "Неке функције нису доступне ван мреже. Покушајте поново кад се повежете."
        };
        OfflineMessages.messages4105 = {
            "[OfflineErrorMessage]": "The content designer isn't available offline. Please try again when you're connected.",
            "[OfflineWarningMessage]": "Some features aren't available offline. Please try again when you're connected."
        };
        OfflineMessages.localeMapping = {
            "1025": OfflineMessages.messages1025,
            "1026": OfflineMessages.messages1026,
            "1027": OfflineMessages.messages1027,
            "1028": OfflineMessages.messages1028,
            "1029": OfflineMessages.messages1029,
            "1030": OfflineMessages.messages1030,
            "1031": OfflineMessages.messages1031,
            "1032": OfflineMessages.messages1032,
            "1033": OfflineMessages.messages1033,
            "1035": OfflineMessages.messages1035,
            "1036": OfflineMessages.messages1036,
            "1037": OfflineMessages.messages1037,
            "1038": OfflineMessages.messages1038,
            "1040": OfflineMessages.messages1040,
            "1041": OfflineMessages.messages1041,
            "1042": OfflineMessages.messages1042,
            "1043": OfflineMessages.messages1043,
            "1044": OfflineMessages.messages1044,
            "1045": OfflineMessages.messages1045,
            "1046": OfflineMessages.messages1046,
            "1048": OfflineMessages.messages1048,
            "1049": OfflineMessages.messages1049,
            "1050": OfflineMessages.messages1050,
            "1051": OfflineMessages.messages1051,
            "1053": OfflineMessages.messages1053,
            "1054": OfflineMessages.messages1054,
            "1055": OfflineMessages.messages1055,
            "1057": OfflineMessages.messages1057,
            "1058": OfflineMessages.messages1058,
            "1060": OfflineMessages.messages1060,
            "1061": OfflineMessages.messages1061,
            "1062": OfflineMessages.messages1062,
            "1063": OfflineMessages.messages1063,
            "1066": OfflineMessages.messages1066,
            "1069": OfflineMessages.messages1069,
            "1081": OfflineMessages.messages1081,
            "1086": OfflineMessages.messages1086,
            "1087": OfflineMessages.messages1087,
            "1110": OfflineMessages.messages1110,
            "2052": OfflineMessages.messages2052,
            "2057": OfflineMessages.messages2057,
            "2070": OfflineMessages.messages2070,
            "2074": OfflineMessages.messages2074,
            "3076": OfflineMessages.messages3076,
            "3081": OfflineMessages.messages3081,
            "3082": OfflineMessages.messages3082,
            "3084": OfflineMessages.messages3084,
            "3098": OfflineMessages.messages3098,
            "4105": OfflineMessages.messages4105,
        };
        return OfflineMessages;
    }());
    Editor.OfflineMessages = OfflineMessages;
})(Editor || (Editor = {}));
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
     * Renders the link popup
     */
    var LinkPopupRenderer = /** @class */ (function () {
        function LinkPopupRenderer(popupRenderer, detailsViewControl) {
            this.popupRenderer = popupRenderer;
            this.detailsViewControl = detailsViewControl;
        }
        LinkPopupRenderer.prototype.setup = function (eventBroker) {
            this.eventBroker = eventBroker;
            this.popupRenderer.setup(this.eventBroker);
        };
        /**
         * Renders the link popup.
         * @param linkData The data for the current link element.
         * @param wrappedBlock The on ok click callback.
         * @param cleanBlock The on cancel click callback.
         */
        LinkPopupRenderer.prototype.render = function (linkData, onOkClick, onCancelClick) {
            var _this = this;
            var onLinkPopupCancelClick = function () {
                _this.dispose();
                onCancelClick();
            };
            var onOkClickHandler = function () {
                _this.dispose();
                if (!MktSvc.Controls.Common.String.isNullUndefinedOrWhitespace(linkData.href)) {
                    onOkClick(linkData);
                }
                else {
                    onCancelClick();
                }
                return true;
            };
            var containerId = this.popupRenderer.render(Editor.CommonUtils.getLocalizedString("[Link]"), onOkClickHandler, onLinkPopupCancelClick, true);
            this.detailsViewControl.init(containerId, this.eventBroker);
            var section = this.detailsViewControl.createSection(Editor.CommonUtils.getLocalizedString("[" + Editor.DetailsViewConstants.linkSectionTitle + "]"));
            var linkField = this.detailsViewControl.createLinkField(section, Editor.CommonUtils.getLocalizedString("[Link]"), MktSvc.Controls.Common.String.Empty, MktSvc.Controls.Common.String.Empty, linkData.href, {
                for: LinkPopupRenderer.urlInputId,
                id: LinkPopupRenderer.urlInputId,
                "placeholder-text": Editor.CommonUtils.getLocalizedString("[Link]")
            }, function (inputElem) {
                linkData.href = Editor.CommonUtils.getLinkWithProtocol(inputElem.val());
            }, { hasFocus: true });
            // Use timeout to set focus on IOS
            setTimeout(function () {
                linkField.find("input").focus();
            }, 0);
            this.setupSaveOnEnter(onOkClickHandler);
            this.eventBroker.notify("linkPopupRendered");
        };
        LinkPopupRenderer.prototype.setupSaveOnEnter = function (onOkClickHandler) {
            var _this = this;
            var onAssistEditEnterKeyDownHandler = function () {
                onOkClickHandler();
                _this.popupRenderer.close();
            };
            this.enterKeyDownDelegate = this.eventBroker.subscribe(MktSvcCommon.AssistEdit.AssistEditEventConstants.assistEditEnterKeyDown, onAssistEditEnterKeyDownHandler);
        };
        /**
        * Disposes the object - removes the html from the page, empty the  objects and detach the events
        */
        LinkPopupRenderer.prototype.dispose = function () {
            this.eventBroker.unsubscribe(MktSvcCommon.AssistEdit.AssistEditEventConstants.assistEditEnterKeyDown, this.enterKeyDownDelegate);
            this.detailsViewControl.dispose();
            this.popupRenderer.dispose();
        };
        LinkPopupRenderer.urlInputId = "formEditor_linkpopup_urlInput";
        return LinkPopupRenderer;
    }());
    Editor.LinkPopupRenderer = LinkPopupRenderer;
})(Editor || (Editor = {}));
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var Dictionary = MktSvc.Controls.Common.Dictionary;
    /**
     * Renders the image popup
     */
    var ImagePopupRenderer = /** @class */ (function () {
        function ImagePopupRenderer(popupRenderer, detailsViewControl) {
            this.MINDIMENSION = 0;
            this.MAXDIMENSION = 10000;
            this.popupRenderer = popupRenderer;
            this.detailsViewControl = detailsViewControl;
        }
        ImagePopupRenderer.prototype.setup = function (eventBroker) {
            this.eventBroker = eventBroker;
            this.popupRenderer.setup(this.eventBroker);
        };
        /**
         * Renders the image popup.
         * @param imageData The data for the current image element.
         * @param wrappedBlock The on ok click callback.
         * @param cleanBlock The on cancel click callback.
         */
        ImagePopupRenderer.prototype.render = function (imageData, onOkClick, onCancelClick) {
            var _this = this;
            var containerId = this.popupRenderer.render(Editor.CommonUtils.getLocalizedString("[Image]"), function () {
                imageData.src = Object.isNullOrUndefined(imageData.src) ? String.Empty : imageData.src;
                imageData.alt = Object.isNullOrUndefined(imageData.alt) ? String.Empty : imageData.alt;
                imageData.alignment = String.isNullUndefinedOrWhitespace(imageData.alignment) ? "Left" : imageData.alignment;
                onOkClick(imageData);
                return true;
            }, function () {
                onCancelClick();
            }, true);
            Editor.CommonUtils.getById(containerId).empty();
            this.detailsViewControl.init(containerId, this.eventBroker);
            var mainSection = this.detailsViewControl.createSection(Editor.CommonUtils.getLocalizedString("[" + Editor.DetailsViewConstants.imageSectionTitle + "]"));
            var sourceField = this.detailsViewControl.createImageField(mainSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.srcLabel), Editor.DetailsViewConstants.inputTypeText, Editor.DetailsViewConstants.srcInputCssClass, imageData.src, {
                "placeholder-text": Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.srcLabel)
            }, function (inputElem) {
                imageData.src = inputElem.val();
            });
            this.detailsViewControl.createInputField(mainSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.altLabel), Editor.DetailsViewConstants.inputTypeText, Editor.DetailsViewConstants.altInputCssClass, imageData.alt, {
                placeholder: Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.altLabel)
            }, function (inputElem) {
                imageData.alt = inputElem.val();
            });
            this.detailsViewControl.createInputField(mainSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.buttonWidthLabel), Editor.DetailsViewConstants.inputTypeNumber, Editor.DetailsViewConstants.imageWidthInputCssClass, parseInt(imageData.width, 10).toString(), {
                placeholder: Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.buttonWidthLabel),
                min: this.MINDIMENSION,
                max: this.MAXDIMENSION
            }, function (inputElem) {
                imageData.width = _this.getValueWithMeasurementUnit(inputElem.val());
            });
            this.detailsViewControl.createInputField(mainSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.buttonHeightLabel), Editor.DetailsViewConstants.inputTypeNumber, Editor.DetailsViewConstants.imageHeightInputCssClass, parseInt(imageData.height, 10).toString(), {
                placeholder: Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.buttonHeightLabel),
                min: this.MINDIMENSION,
                max: this.MAXDIMENSION
            }, function (inputElem) {
                imageData.height = _this.getValueWithMeasurementUnit(inputElem.val());
            });
            this.detailsViewControl.createInputField(mainSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.hSpaceLabel), Editor.DetailsViewConstants.inputTypeNumber, Editor.DetailsViewConstants.imageHSpaceInputCssClass, imageData.hSpace, {
                placeholder: Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.hSpaceLabel),
                min: this.MINDIMENSION,
                max: this.MAXDIMENSION
            }, function (inputElem) {
                imageData.hSpace = inputElem.val();
            });
            this.detailsViewControl.createInputField(mainSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.vSpaceLabel), Editor.DetailsViewConstants.inputTypeNumber, Editor.DetailsViewConstants.imageVSpaceInputCssClass, imageData.vSpace, {
                placeholder: Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.vSpaceLabel),
                min: this.MINDIMENSION,
                max: this.MAXDIMENSION
            }, function (inputElem) {
                imageData.vSpace = inputElem.val();
            });
            this.detailsViewControl.createDropdownList(mainSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.buttonAlignmentLabel), new Dictionary({
                Left: Editor.CommonUtils.getLocalizedString("[Left]"),
                Center: Editor.CommonUtils.getLocalizedString("[Center]"),
                Right: Editor.CommonUtils.getLocalizedString("[Right]")
            }), Editor.DetailsViewConstants.imageAlignmentDropDownCssClass, String.isNullUndefinedOrWhitespace(imageData.alignment) ? "Left" : imageData.alignment, function (dropdownList) {
                imageData.alignment = dropdownList.val();
            });
            // Use timeout to set focus on IOS
            setTimeout(function () {
                sourceField.find("input").focus();
            }, 0);
            this.eventBroker.notify(Editor.EventConstants.imagePopupRendered);
        };
        ImagePopupRenderer.prototype.getValueWithMeasurementUnit = function (value) {
            return value + "px";
        };
        /**
        * Disposes the object - removes the html from the page, empty the  objects and detach the events
        */
        ImagePopupRenderer.prototype.dispose = function () {
            this.detailsViewControl.dispose();
            this.popupRenderer.dispose();
        };
        return ImagePopupRenderer;
    }());
    Editor.ImagePopupRenderer = ImagePopupRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var BrowserPreviewMessage = /** @class */ (function () {
        function BrowserPreviewMessage(message, content) {
            this.message = message;
            this.content = content;
        }
        return BrowserPreviewMessage;
    }());
    Editor.BrowserPreviewMessage = BrowserPreviewMessage;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="commonreferences.ts" />
var Editor;
(function (Editor) {
    var TestabilityConstants = /** @class */ (function () {
        function TestabilityConstants() {
        }
        TestabilityConstants.sortablePlaceholderId = "placeholder-tool-block";
        return TestabilityConstants;
    }());
    Editor.TestabilityConstants = TestabilityConstants;
})(Editor || (Editor = {}));
/// <reference path="../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var Dictionary = MktSvc.Controls.Common.Dictionary;
    /**
    * ButtonStylesDetailsViewRenderer
    */
    var ButtonStylesDetailsViewRenderer = /** @class */ (function () {
        function ButtonStylesDetailsViewRenderer(detailsViewControl) {
            this.detailsViewControl = detailsViewControl;
            // The IDs should be unchanged to be able to restore keyboard focus after rerendering(rebuilding DOM).
            this.buttonBackgroundColorInputId = UniqueId.generate(Editor.DetailsViewConstants.buttonBackgroundColorInputCssClass);
            this.buttonTextColorInputId = UniqueId.generate(Editor.DetailsViewConstants.buttonTextColorInputCssClass);
        }
        /**
        * Initializes form control
        */
        ButtonStylesDetailsViewRenderer.prototype.init = function (eventBroker, containerId) {
            this.eventBroker = eventBroker;
            this.containerId = containerId;
        };
        /**
        * Disposes the form control
        */
        ButtonStylesDetailsViewRenderer.prototype.dispose = function () {
            this.detailsViewControl.dispose();
        };
        /**
        * Renders the form control
        */
        ButtonStylesDetailsViewRenderer.prototype.render = function (selectedBlock) {
            var _this = this;
            var stylesSection = this.detailsViewControl
                .createSection(Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.stylesSectionTitle));
            this.detailsViewControl.createInputColorField(stylesSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.buttonBackgroundColorLabel), Editor.DetailsViewConstants.inputTypeText, Editor.DetailsViewConstants.buttonBackgroundColorInputCssClass, this.getBackgroundColor(selectedBlock), {
                id: this.buttonBackgroundColorInputId
            }, function (inputField) {
                _this.onBackgroundColorFieldUpdated(selectedBlock, inputField);
            });
            this.detailsViewControl.createInputColorField(stylesSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.buttonTextColorLabel), Editor.DetailsViewConstants.inputTypeText, Editor.DetailsViewConstants.buttonTextColorInputCssClass, this.getTextColor(selectedBlock), {
                id: this.buttonTextColorInputId
            }, function (inputField) {
                _this.onTextColorFieldUpdated(selectedBlock, inputField);
            });
            this.detailsViewControl.createDropdownList(stylesSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.buttonAlignmentLabel), new Dictionary({
                Left: Editor.CommonUtils.getLocalizedString("[Left]"),
                Center: Editor.CommonUtils.getLocalizedString("[Center]"),
                Right: Editor.CommonUtils.getLocalizedString("[Right]")
            }), Editor.DetailsViewConstants.buttonAlignmentDropDownCssClass, this.getButtonAlignment(selectedBlock), function (dropdownList) {
                _this.onButtonAlignmentUpdated(selectedBlock, dropdownList);
            });
            var sizeSection = this.detailsViewControl
                .createSection(Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.buttonSizeSectionTitle));
            this.detailsViewControl.createInputField(sizeSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.buttonWidthLabel), Editor.DetailsViewConstants.inputTypeNumber, Editor.DetailsViewConstants.buttonWidthInputCssClass, this.getButtonWidth(selectedBlock), {
                min: "1",
                max: "3840",
                role: "spinbutton",
                id: UniqueId.generate(Editor.DetailsViewConstants.buttonWidthInputCssClass)
            }, function (inputField) {
                _this.onWidthFieldUpdated(selectedBlock, inputField);
            });
            this.detailsViewControl.createInputField(sizeSection, Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.buttonHeightLabel), Editor.DetailsViewConstants.inputTypeNumber, Editor.DetailsViewConstants.buttonHeightInputCssClass, this.getButtonHeight(selectedBlock), {
                min: "1",
                max: "3840",
                role: "spinbutton",
                id: UniqueId.generate(Editor.DetailsViewConstants.buttonHeightInputCssClass)
            }, function (inputField) {
                _this.onHeightFieldUpdated(selectedBlock, inputField);
            });
        };
        ButtonStylesDetailsViewRenderer.prototype.getAnchor = function (block) {
            return block.find(Editor.DetailsViewConstants.anchorTag);
        };
        ButtonStylesDetailsViewRenderer.prototype.getBackgroundColor = function ($block) {
            var value = this.getAnchor($block).css(Editor.DetailsViewConstants.backgroundColorAttribute);
            if (Object.isNullOrUndefined(value)) {
                value = String.Empty;
            }
            return Editor.ColorUtils.rgbToHex(value);
        };
        ButtonStylesDetailsViewRenderer.prototype.onBackgroundColorFieldUpdated = function (selectedBlock, inputElement) {
            var color = inputElement.val();
            var $anchor = this.getAnchor(selectedBlock);
            $anchor.css(Editor.DetailsViewConstants.backgroundColorAttribute, color);
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentBlockChanged, new Editor.BlockChangedEventArgs(this.containerId, selectedBlock));
        };
        ButtonStylesDetailsViewRenderer.prototype.getTextColor = function ($block) {
            var value = this.getAnchor($block).css(Editor.DetailsViewConstants.textColorAttribute);
            if (Object.isNullOrUndefined(value)) {
                value = String.Empty;
            }
            return Editor.ColorUtils.rgbToHex(value);
        };
        ButtonStylesDetailsViewRenderer.prototype.onTextColorFieldUpdated = function (selectedBlock, inputElement) {
            var color = inputElement.val();
            var $anchor = this.getAnchor(selectedBlock);
            $anchor.css(Editor.DetailsViewConstants.textColorAttribute, color);
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentBlockChanged, new Editor.BlockChangedEventArgs(this.containerId, selectedBlock));
        };
        ButtonStylesDetailsViewRenderer.prototype.getButtonAlignment = function ($block) {
            // Gets styles using JS, because JQuery returns values in pixels.
            var anchorElement = this.getAnchor($block).get(0);
            if (!Object.isNullOrUndefined(anchorElement)) {
                var marginLeftValue = anchorElement.style.marginLeft;
                var marginRightValue = anchorElement.style.marginRight;
                if (marginLeftValue === "0px" && marginRightValue === "auto") {
                    return "Left";
                }
                if (marginLeftValue === "auto" && marginRightValue === "0px") {
                    return "Right";
                }
                if (marginLeftValue === "auto" && marginRightValue === "auto") {
                    return "Center";
                }
            }
            return String.Empty;
        };
        ButtonStylesDetailsViewRenderer.prototype.onButtonAlignmentUpdated = function (selectedBlock, dropdownList) {
            var alignment = dropdownList.val();
            var $anchor = this.getAnchor(selectedBlock);
            switch (alignment) {
                case "Left":
                    $anchor.css(Editor.DetailsViewConstants.marginLeftAttribute, "0px");
                    $anchor.css(Editor.DetailsViewConstants.marginRightAttribute, "auto");
                    break;
                case "Right":
                    $anchor.css(Editor.DetailsViewConstants.marginLeftAttribute, "auto");
                    $anchor.css(Editor.DetailsViewConstants.marginRightAttribute, "0px");
                    break;
                case "Center":
                    $anchor.css(Editor.DetailsViewConstants.marginLeftAttribute, "auto");
                    $anchor.css(Editor.DetailsViewConstants.marginRightAttribute, "auto");
                    break;
            }
            this.getUnconfiguredOverlay(selectedBlock).attr(Editor.DetailsViewConstants.alignAttribute, alignment);
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentBlockChanged, new Editor.BlockChangedEventArgs(this.containerId, selectedBlock));
        };
        ButtonStylesDetailsViewRenderer.prototype.getButtonWidth = function ($block) {
            var value = this.getAnchor($block).width().toString();
            return value;
        };
        ButtonStylesDetailsViewRenderer.prototype.onWidthFieldUpdated = function (selectedBlock, inputElement) {
            var width = inputElement.val();
            if (Object.isNullOrUndefined(width) || width < 1) {
                width = String.Empty;
            }
            var $anchor = this.getAnchor(selectedBlock);
            $anchor.width(width);
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentBlockChanged, new Editor.BlockChangedEventArgs(this.containerId, selectedBlock));
        };
        ButtonStylesDetailsViewRenderer.prototype.getButtonHeight = function ($block) {
            var value = this.getAnchor($block).height().toString();
            return value;
        };
        ButtonStylesDetailsViewRenderer.prototype.onHeightFieldUpdated = function (selectedBlock, inputElement) {
            var height = inputElement.val();
            if (Object.isNullOrUndefined(height) || height < 1) {
                height = String.Empty;
            }
            var $anchor = this.getAnchor(selectedBlock);
            // Used the line-height for the centered text vertically
            $anchor.css(Editor.DetailsViewConstants.lineHeightAttribute, height + "px");
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentBlockChanged, new Editor.BlockChangedEventArgs(this.containerId, selectedBlock));
        };
        ButtonStylesDetailsViewRenderer.prototype.getUnconfiguredOverlay = function (selectedBlock) {
            return selectedBlock.find("." + Editor.CommonConstants.designerUnconfiguredContentOverlayCssClassName);
        };
        return ButtonStylesDetailsViewRenderer;
    }());
    Editor.ButtonStylesDetailsViewRenderer = ButtonStylesDetailsViewRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /**
    * Button Details View
    */
    var ButtonDetailsViewFactory = /** @class */ (function () {
        function ButtonDetailsViewFactory() {
        }
        ButtonDetailsViewFactory.prototype.create = function (detailsViewControl) {
            var buttonCommonDetailsView = new Editor.ButtonStylesDetailsViewRenderer(detailsViewControl);
            return new Editor.ButtonDetailsView(Editor.CommonUtils.getLocalizedString(Editor.CommonConstants.buttonToolLabel), buttonCommonDetailsView, detailsViewControl);
        };
        return ButtonDetailsViewFactory;
    }());
    Editor.ButtonDetailsViewFactory = ButtonDetailsViewFactory;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var DetailsViewHelper = /** @class */ (function () {
        function DetailsViewHelper() {
        }
        DetailsViewHelper.createProperty = function (label, input) {
            label.addClass(Editor.DetailsViewConstants.propertyNameCssClass)
                .addClass(Editor.DetailsViewConstants.inputItemField);
            input.addClass(Editor.DetailsViewConstants.inputAttributeClassName);
            return DetailsViewHelper.createItemContainer()
                .append(label)
                .append(DetailsViewHelper.createItemField().append(input));
        };
        DetailsViewHelper.createItemContainer = function () {
            return $("<div>").addClass(Editor.DetailsViewConstants.inputControlContainerClassName);
        };
        DetailsViewHelper.createItemField = function () {
            return $("<div>").addClass(Editor.DetailsViewConstants.inputItemField);
        };
        return DetailsViewHelper;
    }());
    Editor.DetailsViewHelper = DetailsViewHelper;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Dictionary = MktSvc.Controls.Common.Dictionary;
    /**
    * Input Image Field Renderer Class
    */
    var InputBrowseImageFieldRenderer = /** @class */ (function () {
        function InputBrowseImageFieldRenderer(inputFieldRenderer, buttonRenderer, galleryButtonFactory) {
            this.inputFieldRenderer = inputFieldRenderer;
            this.buttonRenderer = buttonRenderer;
            this.galleryButtonFactory = galleryButtonFactory;
            this.galleryButtonDisposeDictionary = new Dictionary();
        }
        InputBrowseImageFieldRenderer.prototype.setup = function (eventBroker) {
            this.eventBroker = eventBroker;
        };
        /**
        * Render the image field
        */
        InputBrowseImageFieldRenderer.prototype.render = function (label, type, className, value, attributes, onFieldUpdated, config) {
            var inputImageClassName = className + " " + Editor.DetailsViewConstants.inputImageCssClass;
            var inputField = this.inputFieldRenderer.render(label, type, inputImageClassName, value, attributes, onFieldUpdated, config);
            var inputItemField = inputField.find(Editor.CommonUtils.getClassSelector(Editor.DetailsViewConstants.inputItemField)).last();
            this.renderImageGalleryButton(inputItemField);
            return inputField;
        };
        InputBrowseImageFieldRenderer.prototype.dispose = function () {
        };
        InputBrowseImageFieldRenderer.prototype.renderImageGalleryButton = function (inputItemField) {
            var _this = this;
            var galleryPickerId = MktSvc.Controls.Common.UniqueId.generate();
            var imageSelectedHandler = function (eventArgs) {
                if (galleryPickerId === eventArgs.sourceId) {
                    _this.inputFieldRenderer.updateValue(eventArgs.imageUrl, inputItemField);
                    _this.cleanGalleryButton(galleryPickerId);
                }
            };
            // Create the gallery button
            var galleryButton = this.galleryButtonFactory.create(galleryPickerId);
            var buttonElement = this.buttonRenderer.renderButton(galleryButton)
                .addClass(Editor.DetailsViewConstants.imgGalleryCssClass)
                .appendTo(inputItemField)
                .on("click", function () {
                // Setup
                galleryButton.getCommand().setup(_this.eventBroker);
                var imageSelectedDelegate = _this.eventBroker.subscribe(MktSvcCommon.EventConstants.GalleryImageSelected, function (args) {
                    // Show jquery-ui dialog after closing image picker
                    _this.getActiveDialog().show();
                    imageSelectedHandler(args);
                });
                var galleryPopupClosedDelegate = _this.eventBroker.subscribe(MktSvcCommon.EventConstants.GalleryPopupClosed, function () {
                    // Show jquery-ui dialog after closing image picker
                    _this.getActiveDialog().show();
                });
                _this.galleryButtonDisposeDictionary.addOrUpdate(galleryPickerId, function () {
                    _this.eventBroker.unsubscribe(MktSvcCommon.EventConstants.GalleryImageSelected, imageSelectedDelegate);
                    _this.eventBroker.unsubscribe(MktSvcCommon.EventConstants.GalleryPopupClosed, galleryPopupClosedDelegate);
                    galleryButton.getCommand().dispose();
                });
                // Hide active jquery-ui dialog
                _this.getActiveDialog().hide();
                galleryButton.getCommand().exec(inputItemField, null, null, null);
                return false;
            });
            inputItemField.on("remove", function () { _this.cleanGalleryButton(galleryPickerId); });
            return buttonElement;
        };
        InputBrowseImageFieldRenderer.prototype.getActiveDialog = function () {
            return $("." + Editor.CommonConstants.popupCssClassName).add("." + Editor.CommonConstants.overlayCssClassName);
        };
        InputBrowseImageFieldRenderer.prototype.cleanGalleryButton = function (galleryPickerId) {
            if (this.galleryButtonDisposeDictionary.hasKey(galleryPickerId)) {
                this.galleryButtonDisposeDictionary.get(galleryPickerId)();
                this.galleryButtonDisposeDictionary.remove(galleryPickerId);
            }
        };
        return InputBrowseImageFieldRenderer;
    }());
    Editor.InputBrowseImageFieldRenderer = InputBrowseImageFieldRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /**
    * Input Color Field Renderer Class
    */
    var LinkFieldRenderer = /** @class */ (function () {
        function LinkFieldRenderer(inputFieldRenderer) {
            this.inputFieldRenderer = inputFieldRenderer;
            this.linkValueUpdatedEventName = "linkValueUpdated";
        }
        /**
        * Setup the renderer
        */
        LinkFieldRenderer.prototype.setup = function (eventBroker) { };
        /**
        * Update the input value of the specified container
        */
        LinkFieldRenderer.prototype.updateValue = function (value, fieldContainer) {
            var input = fieldContainer.find(Editor.DetailsViewConstants.inputTag);
            if (input.length > 0) {
                input.val(value);
                input.trigger(this.linkValueUpdatedEventName);
            }
        };
        /**
        * Render the form section
        */
        LinkFieldRenderer.prototype.render = function (label, type, className, value, attributes, onFieldUpdated, config) {
            var inputField = this.inputFieldRenderer.render(label, type, className, value, attributes, onFieldUpdated);
            var initialValue = value;
            inputField.find(Editor.DetailsViewConstants.inputTag).on(this.linkValueUpdatedEventName, function (event) {
                // Call onFieldUpdated on input change
                var currentValue = $(event.target).val();
                if (initialValue !== currentValue) {
                    initialValue = currentValue;
                    if (onFieldUpdated) {
                        onFieldUpdated($(event.target));
                    }
                }
            });
            return inputField;
        };
        /**
        * Dispose the renderer
        */
        LinkFieldRenderer.prototype.dispose = function () { };
        return LinkFieldRenderer;
    }());
    Editor.LinkFieldRenderer = LinkFieldRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /**
    * Input Image Field Renderer Class
    */
    var InputImageFieldRenderer = /** @class */ (function () {
        function InputImageFieldRenderer(inputFieldRenderer) {
            this.inputFieldRenderer = inputFieldRenderer;
        }
        InputImageFieldRenderer.prototype.setup = function (eventBroker) {
        };
        /**
        * Render the image field
        */
        InputImageFieldRenderer.prototype.render = function (label, type, className, value, attributes, onFieldUpdated) {
            return this.inputFieldRenderer.render(label, type, className, value, attributes, onFieldUpdated);
        };
        InputImageFieldRenderer.prototype.dispose = function () {
        };
        return InputImageFieldRenderer;
    }());
    Editor.InputImageFieldRenderer = InputImageFieldRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
    * Input Color Field Renderer Class
    */
    var InputColorFieldRenderer = /** @class */ (function () {
        function InputColorFieldRenderer(inputFieldRenderer) {
            this.inputFieldRenderer = inputFieldRenderer;
        }
        /**
        * Render the form section
        */
        InputColorFieldRenderer.prototype.render = function (label, type, className, value, attributes, onFieldUpdated) {
            var _this = this;
            var colorPicker;
            var inputElement;
            var coloredRectangle;
            var inputContainer = this.inputFieldRenderer.render(label, type, Editor.DetailsViewConstants.inputColorCssClass + " " + className, value, attributes, function () {
                _this.update(inputElement.val(), inputElement, coloredRectangle, colorPicker, onFieldUpdated);
            }, Editor.CommonConstants.colorFieldAriaLabel);
            inputElement = inputContainer.find(Editor.DetailsViewConstants.inputTag);
            coloredRectangle = this.renderColorFilledRectangle(inputElement, value);
            if (Editor.BrowserFeatureSupport.html5ColorPickerSupported) {
                colorPicker = this.renderColorPicker(coloredRectangle, label, value);
                colorPicker.on("change", function () {
                    _this.update(colorPicker.val(), inputElement, coloredRectangle, colorPicker, onFieldUpdated);
                });
                colorPicker.focus(function () {
                    coloredRectangle.addClass(Editor.DetailsViewConstants.colorPickerFocusedCssClass);
                });
                colorPicker.focusout(function () {
                    coloredRectangle.removeClass(Editor.DetailsViewConstants.colorPickerFocusedCssClass);
                });
            }
            return inputContainer;
        };
        InputColorFieldRenderer.prototype.renderColorFilledRectangle = function (inputElement, initialValue) {
            var coloredRectangle = $("<div>")
                .addClass(Editor.DetailsViewConstants.colorFilledRectangleCssClass)
                .insertAfter(inputElement);
            this.setColorFilledRectangle(coloredRectangle, initialValue);
            return coloredRectangle;
        };
        InputColorFieldRenderer.prototype.renderColorPicker = function (coloredRectangle, label, initialValue) {
            var colorPicker = $('<input type="color">')
                .addClass(Editor.DetailsViewConstants.colorPickerInputCssClassName)
                .insertAfter(coloredRectangle);
            colorPicker.attr("aria-label", label);
            this.setColorPicker(colorPicker, initialValue);
            return colorPicker;
        };
        InputColorFieldRenderer.prototype.update = function (newColorValue, inputElement, coloredRectangle, colorPicker, onFieldUpdated) {
            inputElement.val(newColorValue);
            this.setColorFilledRectangle(coloredRectangle, newColorValue);
            if (!Object.isNullOrUndefined(colorPicker)) {
                this.setColorPicker(colorPicker, newColorValue);
            }
            if (!Object.isNullOrUndefined(onFieldUpdated)) {
                onFieldUpdated(inputElement);
            }
            // If the DOM is rebuilt we need to query the inputElement again, since the old inputElement references an unnattached element.
            var inputElementRebuilt = $("#" + inputElement.attr("id"));
            inputElementRebuilt.focus();
        };
        InputColorFieldRenderer.prototype.setColorFilledRectangle = function (coloredRectangle, newColorValue) {
            coloredRectangle.css(Editor.DetailsViewConstants.backgroundColorAttribute, newColorValue);
        };
        InputColorFieldRenderer.prototype.setColorPicker = function (colorPicker, newColorValue) {
            colorPicker.val(Editor.ColorUtils.toHex(newColorValue));
        };
        return InputColorFieldRenderer;
    }());
    Editor.InputColorFieldRenderer = InputColorFieldRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    /**
    * Dropdown list Renderer Class
    */
    var DropdownListRenderer = /** @class */ (function () {
        function DropdownListRenderer() {
        }
        /**
        * Render the form section
        */
        DropdownListRenderer.prototype.render = function (label, options, className, value) {
            var dropdownContainer = $("<div>", { class: Editor.DetailsViewConstants.inputControlContainerClassName });
            var selectId = UniqueId.generate(className);
            this.renderDropdownLabel(dropdownContainer, label, className, selectId);
            this.renderDropdownList(dropdownContainer, options, className, value, selectId);
            return dropdownContainer;
        };
        DropdownListRenderer.prototype.renderDropdownLabel = function (dropdownContainer, label, inputCssClass, selectId) {
            var $label = $("<label>", { class: Editor.DetailsViewConstants.inputItemField + " " + Editor.DetailsViewConstants.propertyNameCssClass, for: selectId }).text(label);
            dropdownContainer.append($label);
        };
        DropdownListRenderer.prototype.renderDropdownList = function (dropdownContainer, options, className, value, id) {
            var $select = $("<select />");
            $select.attr("id", id);
            $select.addClass(Editor.DetailsViewConstants.inputAttributeClassName + " " + className);
            options.getKeys().each(function (key) {
                var option = $("<option></option>");
                option.val(key);
                option.text(options.get(key));
                $select.append(option);
            });
            $select.val(value);
            var dropdownElementContainer = $("<div>", { class: Editor.DetailsViewConstants.inputItemField });
            dropdownElementContainer.append($select);
            dropdownContainer.append(dropdownElementContainer);
        };
        return DropdownListRenderer;
    }());
    Editor.DropdownListRenderer = DropdownListRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    var ContentBlockDetailsView = /** @class */ (function () {
        function ContentBlockDetailsView(viewId, detailsViewControl, provider, toolBlockMapping, blockDetailsViewMapping) {
            this.viewId = viewId;
            this.detailsViewControl = detailsViewControl;
            this.provider = provider;
            this.toolBlockMapping = toolBlockMapping;
            this.blockDetailsViewMapping = blockDetailsViewMapping;
            this.field = "msdyncrm_finalizedhtml";
        }
        ContentBlockDetailsView.prototype.init = function (eventBroker, containerId) {
            this.eventBroker = eventBroker;
            this.containerId = containerId;
            this.detailsViewControl.init(this.containerId, this.eventBroker);
        };
        ContentBlockDetailsView.prototype.dispose = function () {
            this.detailsViewControl.dispose();
            if (this.subproperties) {
                this.subproperties.dispose();
            }
        };
        ContentBlockDetailsView.prototype.render = function (selectedBlock) {
            var _this = this;
            this.clearContainer();
            var linkSection = this.detailsViewControl.createSection(Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.contentBlockTool));
            var lookupId = selectedBlock.attr(Editor.DetailsViewConstants.lookupIdAttribute);
            var lookupName = selectedBlock.attr(Editor.DetailsViewConstants.lookupNameAttribute);
            var contentBlockName = Editor.ContentBlockProvider.EntityName;
            var lookupValue = null;
            if (!String.isNullUndefinedOrWhitespace(lookupId)) {
                lookupValue = {
                    Id: lookupId,
                    LogicalName: contentBlockName,
                    Name: lookupName
                };
            }
            var containerId = Editor.CommonConstants.contentBlockLookupContainerId + Editor.CommonConstants.contentBlockToolType;
            var lookupCaption = Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.contentBlockSource);
            this.detailsViewControl.createLookupContainer(linkSection, lookupCaption, Editor.CommonConstants.contentBlockLinkInputCssClass, containerId);
            var container = Editor.CommonUtils.getById(containerId);
            this.provider.getLookupField().loadLookup(container, contentBlockName, lookupCaption, this.viewId, function (value) {
                var id = value ? (value.Id || value.id) : null;
                if (!String.isNullUndefinedOrWhitespace(id)) {
                    _this.onLinkFieldUpdated(selectedBlock, id, value.Name);
                }
            }, lookupValue);
            container.parent().addClass(Editor.DetailsViewConstants.neverProtected);
            this.renderSubproperties(selectedBlock);
        };
        ContentBlockDetailsView.prototype.renderSubproperties = function (selectedBlock) {
            if (selectedBlock.attr(Editor.Contract.blockDatatypeAttrName) !== Editor.CommonConstants.contentBlockToolType) {
                var subpropertiesType = selectedBlock.attr(Editor.Contract.blockDatatypeAttrName);
                if (subpropertiesType) {
                    this.subproperties = this.blockDetailsViewMapping.get(subpropertiesType);
                    if (this.subproperties) {
                        var subcontainerId = "" + this.containerId + subpropertiesType + Editor.CommonConstants.toolboxSectionNameDataAttr;
                        $("<div/>", {
                            id: subcontainerId
                        }).appendTo($("#" + this.containerId));
                        this.subproperties.init(this.eventBroker, subcontainerId);
                        this.subproperties.render(selectedBlock.find("[" + Editor.Contract.subBlockAttrName + "='true']"));
                    }
                }
            }
            this.eventBroker.notify(Editor.EventConstants.controlRendered, new Editor.ControlRenderedEventArgs(this.containerId));
        };
        ContentBlockDetailsView.prototype.getContentBlockId = function ($block) {
            var contentBlockId = $block.attr(Editor.DetailsViewConstants.lookupIdAttribute);
            return String.isNullOrEmpty(contentBlockId) ? String.Empty : contentBlockId;
        };
        ContentBlockDetailsView.prototype.onLinkFieldUpdated = function (selectedBlock, contentBlockId, lookupName) {
            var _this = this;
            this.provider
                .getExecutionContext()
                .getConfigurationProvider()
                .getEntityData(Editor.ContentBlockProvider.EntityName, contentBlockId, function (result) {
                var eventArgs = new Editor.ContentBlockAttributeChangedEventArgs(selectedBlock, result.msdyncrm_finalizedhtml, contentBlockId, lookupName);
                _this.eventBroker.notify(Editor.EventConstants.contentBlockAttributeChanged, eventArgs);
                _this.eventBroker.notify(Editor.EventConstants.hrefAttributeChanged, eventArgs);
                _this.eventBroker.notify(selectedBlock.attr(Editor.Contract.blockTypeAttrName) + "_" + Editor.EventConstants.hrefAttributeChanged, eventArgs);
                _this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentBlockChanged, new Editor.BlockChangedEventArgs(_this.containerId, selectedBlock));
            });
        };
        ContentBlockDetailsView.prototype.clearContainer = function () {
            Editor.CommonUtils.getById(this.containerId).empty();
        };
        ContentBlockDetailsView.prototype.isConfigured = function (block) {
            var href = this.getContentBlockId(block);
            return !String.isNullUndefinedOrWhitespace(href);
        };
        return ContentBlockDetailsView;
    }());
    Editor.ContentBlockDetailsView = ContentBlockDetailsView;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /**
    * Input Field Renderer Class
    */
    var LookupContainerRenderer = /** @class */ (function () {
        function LookupContainerRenderer() {
        }
        /**
        * Render the form section
        */
        LookupContainerRenderer.prototype.render = function (label, className, id) {
            var inputContainer = $("<div>", { class: Editor.DetailsViewConstants.inputControlContainerClassName });
            this.renderLookupLabel(inputContainer, label);
            this.renderLookupContainer(inputContainer, id, className);
            return inputContainer;
        };
        LookupContainerRenderer.prototype.renderLookupLabel = function (inputContainer, label) {
            var $label = $("<label>", { class: Editor.DetailsViewConstants.inputItemField + " " + Editor.DetailsViewConstants.propertyNameCssClass }).text(label);
            inputContainer.append($label);
        };
        LookupContainerRenderer.prototype.renderLookupContainer = function (inputContainer, id, className) {
            var container = $("<div />");
            container.attr("id", id);
            container.addClass(Editor.DetailsViewConstants.inputAttributeClassName + " " + className);
            var inputElementContainer = $("<div>", { class: Editor.DetailsViewConstants.inputItemField });
            inputElementContainer.append(container);
            inputContainer.append(inputElementContainer);
        };
        return LookupContainerRenderer;
    }());
    Editor.LookupContainerRenderer = LookupContainerRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
    * Class used for rendering jQuery buttons using IButton implementations
    */
    var ButtonRenderer = /** @class */ (function () {
        function ButtonRenderer() {
        }
        /**
         * Renders a jQuery element with class and background image extracted from the IButton implementation
         */
        ButtonRenderer.prototype.renderButton = function (button) {
            return $("<button/>")
                .addClass(button.getName())
                .attr("title", Editor.CommonUtils.getLocalizedString(button.getLabel()))
                .attr("type", Editor.CommonConstants.buttonType)
                .css("background-image", 'url("' + MktSvcCommon.HtmlEncode.encode(button.getIconSrc()) + '")');
        };
        return ButtonRenderer;
    }());
    Editor.ButtonRenderer = ButtonRenderer;
})(Editor || (Editor = {}));
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
     * Plugin to align divider to center in CKEditor.
     */
    var DividerAlignCenterButton = /** @class */ (function () {
        /**
         * Initializes a new instance of the DividerAlignCenterButton class.
         */
        function DividerAlignCenterButton(command) {
            this.command = command;
        }
        /**
         * Gets the name of the button.
         */
        DividerAlignCenterButton.prototype.getName = function () {
            return DividerAlignCenterButton.buttonName;
        };
        /**
         * Gets the label used with the button.
         */
        DividerAlignCenterButton.prototype.getLabel = function () {
            return "[Align Center]";
        };
        /**
         * Get the command associated with the button
         */
        DividerAlignCenterButton.prototype.getCommand = function () {
            return this.command;
        };
        /**
         * Gets the source of the icon base64 encoded
         */
        DividerAlignCenterButton.prototype.getIconSrc = function () {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAQAAABjX+2PAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfgBgMHAQayUmmdAAAApklEQVQY06WQrQ7CQBCEvysLQZ4Cg0AgIEGieAseGsszIBpIqkoVLeQG0R96TYrhxuzt5L6dW/jnuK6aR/1A1b+uE00bmRBl3bbWPwFq6jcpl76tAYznd+oWjah+fcBIeilF4EnGDQMFih/fUiJ/3FNGesjLg4EL5PjdzBq8eHHH5XHyLOJWrsNvOAPJYHAAlgaYX0x6S2lXU9RwBdKx5A5krEbs6wcyZEaBNz8cjAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wNi0wM1QwNzowMTowNi0wNDowMBTGlrgAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTYtMDYtMDNUMDc6MDE6MDYtMDQ6MDBlmy4EAAAAAElFTkSuQmCC";
        };
        /**
         * Gets the keyboard shortcut for the button.
         */
        DividerAlignCenterButton.prototype.getKeyboardShortcut = function () {
            return null;
        };
        DividerAlignCenterButton.buttonName = "dividerAlignCenterBtn";
        return DividerAlignCenterButton;
    }());
    Editor.DividerAlignCenterButton = DividerAlignCenterButton;
})(Editor || (Editor = {}));
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
     * Plugin to align divider to left in CKEditor.
     */
    var DividerAlignLeftButton = /** @class */ (function () {
        /**
         * Initializes a new instance of the DividerAlignLeftButton class.
         */
        function DividerAlignLeftButton(command) {
            this.command = command;
        }
        /**
         * Gets the name of the button.
         */
        DividerAlignLeftButton.prototype.getName = function () {
            return DividerAlignLeftButton.buttonName;
        };
        /**
         * Gets the label used with the button.
         */
        DividerAlignLeftButton.prototype.getLabel = function () {
            return "[Align Left]";
        };
        /**
         * Get the command associated with the button
         */
        DividerAlignLeftButton.prototype.getCommand = function () {
            return this.command;
        };
        /**
         * Gets the source of the icon base64 encoded
         */
        DividerAlignLeftButton.prototype.getIconSrc = function () {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAQAAAB+puRPAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfgBgMFKRVoNVKHAAAAfUlEQVQoz7XRMQrCQBCF4W9hVSxEBLX2Ct7/DLmGTcDCKhplLRKUURNB8JXzlv3nZ/h7EigfZn0y7K1lCa2j6v11OYfR7BsidBl2Nj2iy02jdhhCRFSGNH0tyzxYrGxNHmWrlpoRi2gyZkHqESyCBVydnjuUy/Aduh+Wfs8dd/kYRlCIrXcAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDYtMDNUMDU6NDE6MjEtMDQ6MDBDwWmCAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTA2LTAzVDA1OjQxOjIxLTA0OjAwMpzRPgAAAABJRU5ErkJggg==";
        };
        /**
         * Gets the keyboard shortcut for the button.
         */
        DividerAlignLeftButton.prototype.getKeyboardShortcut = function () {
            return null;
        };
        DividerAlignLeftButton.buttonName = "dividerAlignLeftBtn";
        return DividerAlignLeftButton;
    }());
    Editor.DividerAlignLeftButton = DividerAlignLeftButton;
})(Editor || (Editor = {}));
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
     * Plugin to align divider to right in CKEditor.
     */
    var DividerAlignRightButton = /** @class */ (function () {
        /**
         * Initializes a new instance of the DividerAlignRightButton class.
         */
        function DividerAlignRightButton(command) {
            this.command = command;
        }
        /**
         * Gets the name of the button.
         */
        DividerAlignRightButton.prototype.getName = function () {
            return DividerAlignRightButton.buttonName;
        };
        /**
         * Gets the label used with the button.
         */
        DividerAlignRightButton.prototype.getLabel = function () {
            return "[Align Right]";
        };
        /**
         * Get the command associated with the button
         */
        DividerAlignRightButton.prototype.getCommand = function () {
            return this.command;
        };
        /**
         * Gets the source of the icon base64 encoded
         */
        DividerAlignRightButton.prototype.getIconSrc = function () {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAQAAAB+puRPAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfgBgMHAh6KE6IIAAAAf0lEQVQoz7WRPQqEQAxGn7iilQuCjdfw/mfwCta6sIWFqAOxUJzJzNgIpgv58r38wOuReLn41Y+ut1RkgGD40YUOsiiD3Aq0dYhoqClInVEMI71FaOsIQgpI5hjCGbKSmuzKNgb+WhBiLCK+g7tF6V1MMEzAKZD1/g9H45fnsQPdyxwmlPvPHAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wNi0wM1QwNzowMjozMC0wNDowMBKuH2IAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTYtMDYtMDNUMDc6MDI6MzAtMDQ6MDBj86feAAAAAElFTkSuQmCC";
        };
        /**
         * Gets the keyboard shortcut for the button.
         */
        DividerAlignRightButton.prototype.getKeyboardShortcut = function () {
            return null;
        };
        DividerAlignRightButton.buttonName = "dividerAlignRightBtn";
        return DividerAlignRightButton;
    }());
    Editor.DividerAlignRightButton = DividerAlignRightButton;
})(Editor || (Editor = {}));
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var KeyboardCommand = MktSvc.Controls.Common.KeyboardCommand;
    var KeyboardKeyCodes = MktSvc.Controls.Common.KeyboardKeyCodes;
    var KeyboardModifierType = MktSvc.Controls.Common.KeyboardModifierType;
    /**
     * Plugin to move a block in CKEditor.
     */
    var MoveBlockButton = /** @class */ (function () {
        /**
         * Initializes a new instance of the MoveBlockButton class.
         */
        function MoveBlockButton(command) {
            this.command = command;
        }
        /**
         * Gets the name of the button.
         */
        MoveBlockButton.prototype.getName = function () {
            return "moveBlockBtn";
        };
        /**
         * Gets the label used with the button.
         */
        MoveBlockButton.prototype.getLabel = function () {
            return "[Move Block]";
        };
        /**
         * Get the command associated with the button
         */
        MoveBlockButton.prototype.getCommand = function () {
            return this.command;
        };
        /**
         * Gets the source of the icon base64 encoded
         */
        MoveBlockButton.prototype.getIconSrc = function () {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAAF6SURBVDhPhZHNS8NAEMXzt/oBiqkgiodEiLQa/CoUawRJL6WXXDz34KkHjwXb0lspVaw2jYcGL00qPPetJIZsxMKvTN7M7s680QD8yWg0xuv0TYTFeVIokn5/iGq1DvOoAl6UzycUit3uE1y3KUJgtfqC47gYjyf8VGoVgZR2DzEYDDEPPjCdvqPXG0DXD0RKrVUE0m4/oNXyYFk2NjZLMu50HkVKrU0Dts2XeTjRrGMbW9t76ffl1bXiifyjYZyZbfO1JJm/QNf34fsBypULTJ5fpC5XRbf548xsWyIOe9496jd3MpYIPY5jRFGMU7uKQNRr3DPbots0jDPzVcLDhllOv9fWd7BcRgjDT3HmBItF+NMau3BuXen2fyNwnWfnNcxmvtRlgjDBVWXdzl/QaDRhGGX48yDV0guy0G2+xpnZNmMeztcRRSCmWZFu0zDOzO74cr6OKAKhJ1wV3aZhnDnbdhZFSOCeuSq6nRhWRKGYwD1zVXn9F2jfTdAByZ8nSAIAAAAASUVORK5CYII=";
        };
        /**
         * Gets the keyboard shortcut for the button.
         */
        MoveBlockButton.prototype.getKeyboardShortcut = function () {
            return new KeyboardCommand(KeyboardKeyCodes.mKey, [KeyboardModifierType.Alt]);
        };
        return MoveBlockButton;
    }());
    Editor.MoveBlockButton = MoveBlockButton;
})(Editor || (Editor = {}));
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
     * Command to clone the selected block.
     */
    var MoveBlockCommand = /** @class */ (function () {
        function MoveBlockCommand() {
        }
        /**
         * Gets the name of the command.
         */
        MoveBlockCommand.prototype.getName = function () {
            return MoveBlockCommand.getName();
        };
        /**
         * Enabled if editor is in read only mode.
         */
        MoveBlockCommand.prototype.enabledOnReadOnly = function () {
            return true;
        };
        /**
         * Gets the name of the command.
         */
        MoveBlockCommand.getName = function () {
            return "moveBlockCommand";
        };
        /**
         * Configure the command.
         * @param eventBroker An instance of event broker.
         */
        MoveBlockCommand.prototype.setup = function (eventBroker) {
            this.eventBroker = eventBroker;
        };
        /**
         * Executes the command and clones the currently selected block.
         * @param selectedBlock The currently selected block.
         * @param wrappedBlock The top-wrapping element.
         * @param cleanBlock The clean block, without any wrappers.
         * @param selectedHtml The selected html, if any.
         */
        MoveBlockCommand.prototype.exec = function (selectedBlock, wrappedBlock, selectedHtml) {
            if (Object.isNullOrUndefined(selectedBlock)) {
                return false;
            }
            if (Object.isNullOrUndefined(this.eventBroker)) {
                return false;
            }
            var eventArgs = new Editor.DesignerAddStartEventArgs(wrappedBlock, true);
            this.eventBroker.notify((Editor.DesignerInternalEventConstants.designerAddStart), eventArgs);
            return true;
        };
        /**
        * Disposes the object - removes the html from the page, empty the  objects and detach the events
        */
        MoveBlockCommand.prototype.dispose = function () {
        };
        /*
         * Cleans up the html elements that where added to the page
         */
        MoveBlockCommand.prototype.cleanup = function (blockElements) {
        };
        return MoveBlockCommand;
    }());
    Editor.MoveBlockCommand = MoveBlockCommand;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    var ImagePlaceholderHelper = /** @class */ (function () {
        function ImagePlaceholderHelper() {
            this.cleanedUpImage = "about:blank";
            this.imagePlaceholder = Editor.CommonUtils.getLocalizedImagePlaceholder();
        }
        /**
         * Identify that the image is configured
         * @param src The image source Url
         */
        ImagePlaceholderHelper.prototype.isImageConfigured = function (src) {
            return src !== this.imagePlaceholder && !String.isNullUndefinedOrWhitespace(src) && src !== this.cleanedUpImage;
        };
        /**
        * Identify that the placeholder needed for the current image
        * @param src The image source Url
        */
        ImagePlaceholderHelper.prototype.isPlaceholderNeeded = function (src) {
            return !this.isImageConfigured(src);
        };
        /**
         * Returns the image placeholder
         */
        ImagePlaceholderHelper.prototype.getImagePlaceholder = function (src) {
            return this.imagePlaceholder;
        };
        return ImagePlaceholderHelper;
    }());
    Editor.ImagePlaceholderHelper = ImagePlaceholderHelper;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BasicFullPageToolbar = /** @class */ (function () {
        function BasicFullPageToolbar() {
        }
        BasicFullPageToolbar.prototype.getName = function () {
            return "BasicFullPageToolbar";
        };
        BasicFullPageToolbar.prototype.getConfig = function () {
            return [
                ["Cut", "Copy", "Paste", "PasteFromWord", "PasteText"],
                ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"],
                ["Find", "Replace"],
                ["SelectAll"],
                ["BidiLtr", "BidiRtl"],
                ["Link", "Unlink", "Anchor"],
                ["NumberedList", "BulletedList"],
                ["HorizontalRule"],
                "/",
                ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript"],
                ["RemoveFormat"],
                ["Styles", "Font", "FontSize"],
                ["TextColor", "BGColor"],
                ["SpecialChar"]
            ];
        };
        return BasicFullPageToolbar;
    }());
    Editor.BasicFullPageToolbar = BasicFullPageToolbar;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var FullPageTabItemVisibility = /** @class */ (function () {
        function FullPageTabItemVisibility(designerTabItem) {
            this.tabItem = designerTabItem;
        }
        FullPageTabItemVisibility.prototype.isTabEnabled = function (contentModel) {
            return !contentModel.isDesignerContent();
        };
        FullPageTabItemVisibility.prototype.getTabItem = function () {
            return this.tabItem;
        };
        return FullPageTabItemVisibility;
    }());
    Editor.FullPageTabItemVisibility = FullPageTabItemVisibility;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var DesignerTabItemVisibility = /** @class */ (function () {
        function DesignerTabItemVisibility(designerTabItem) {
            this.tabItem = designerTabItem;
        }
        DesignerTabItemVisibility.prototype.isTabEnabled = function (contentModel) {
            return contentModel.isDesignerContent();
        };
        DesignerTabItemVisibility.prototype.getTabItem = function () {
            return this.tabItem;
        };
        return DesignerTabItemVisibility;
    }());
    Editor.DesignerTabItemVisibility = DesignerTabItemVisibility;
})(Editor || (Editor = {}));
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    /**
     * The toolbar class.
     */
    var StandardToolbar = /** @class */ (function () {
        /**
         * Initializes a new instance of the standard toolbar class.
         */
        function StandardToolbar() {
            var editor = Editor.CommonUtils.getByClass(Editor.CommonConstants.fullPageContentEditorFrameClassName);
            this.editorContents = editor.contents();
        }
        /**
         * Gets the buttons from the current toolbar by selector.
         * @param selector buttons selector.
         */
        StandardToolbar.prototype.getButton = function (buttonName) {
            return new Editor.ToolbarButton(this.getButtonElement(buttonName));
        };
        /**
         * Gets the Jquery buttons from the current toolbar by selector.
         * @param selector buttons selector.
         */
        StandardToolbar.prototype.getButtonElement = function (buttonName) {
            return this.editorContents.find(String.Format(".cke_button__{0}", buttonName.toLocaleLowerCase()));
        };
        return StandardToolbar;
    }());
    Editor.StandardToolbar = StandardToolbar;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
     * ToolboxView section.
     * Holds multiple tools.
     */
    var Section = /** @class */ (function () {
        function Section(name, label) {
            this.name = name;
            this.label = label;
        }
        /**
         * Gets the section name.
         */
        Section.prototype.getName = function () {
            return this.name;
        };
        /**
         * Gets the section label.
         */
        Section.prototype.getLabel = function () {
            return Editor.CommonUtils.getLocalizedString(this.label);
        };
        return Section;
    }());
    Editor.Section = Section;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="commonreferences.ts" />
var Editor;
(function (Editor) {
    var ArrayQuery = ControlsCommon.Utils.ArrayQuery;
    /**
    * This class contains the default contract values for Content Sanitizer
    */
    var ContentSanitizerContract = /** @class */ (function () {
        function ContentSanitizerContract() {
        }
        ContentSanitizerContract.supportedAttributes = new ArrayQuery([
            Editor.Contract.blockTypeAttrName,
            Editor.Contract.containerAttrName,
            Editor.CommonConstants.dataTrackAttributeName,
            Editor.CommonConstants.dataTrackIdAttributeName,
            "data-form-block-id",
            "data-formControlsPrefix",
            "data-for",
            "data-requiredErrorMessage",
            "data-captchaObjectName",
            "data-makeeditable",
            "data-type",
            "data-entity-id",
            "data-lookup-name",
            "data-lookup-id",
            Editor.Contract.subBlockAttrName,
            Editor.Contract.blockDatatypeAttrName,
            Editor.Contract.dataProtectedAttrName,
            Editor.CommonConstants.videoIdAttrName,
            Editor.CommonConstants.videoNameAttrName,
            Editor.CommonConstants.videoUrlAttrName,
            Editor.CommonConstants.videoThumbnailUrlAttrName,
            Editor.CommonConstants.videoEmbedCodeAttrName
        ]);
        return ContentSanitizerContract;
    }());
    Editor.ContentSanitizerContract = ContentSanitizerContract;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
     * Control Tabbing Manager is responsible for handling tabbing into editor control.
     * The client environment assigns positive tab indices to the controls to impose the control tabbing order.
     * As a side effect, it prevents tabbing through the editor's elements after a user has tabbed into editor control (because the elements do not have positive indices and browser skips them).
     * To fix the issue, the manager redirects the incoming tabbing to the control container (which has positive tab index) to the first tabbable element of the editor.
     * It also redirects the shift tabbing out the first tabbable element of the editor to the control that immediately precedes the editor in the tabbing chain.
     */
    var ControlTabbingManager = /** @class */ (function () {
        function ControlTabbingManager() {
            var _this = this;
            this.onControlFocused = function (event) {
                // Switching focus to the first editor's tabbable element
                _this.getFirstTabbableEditorElement(_this.controlContainer).focus();
                event.preventDefault();
            };
            this.onContainerKeyDown = function (event) {
                // Check if Shift+Tab is pressed when the editor's first tabbable element is selected
                if (event.which === 9 && event.shiftKey && _this.getFirstTabbableEditorElement(_this.controlContainer).is(event.target)) {
                    // Looking for the element with positive tabindex which immediately precedes the container in the tabbing chain
                    var elementsWithPositiveTabIndex = $(_this.controlContainer.get(0).ownerDocument.body).find('[tabindex]:not([tabindex="0"]):not([tabindex^="-"])').toArray().map($);
                    var preceedingFocusElement = elementsWithPositiveTabIndex.reduce(function (closestPreceedingElement, candidateElement) {
                        var candidateElementTabIndex = Number(candidateElement.attr("tabindex"));
                        return (candidateElementTabIndex >= Number(closestPreceedingElement.attr("tabindex")) && candidateElementTabIndex < _this.assignedTabIndex) ? candidateElement : closestPreceedingElement;
                    });
                    // Focus this preceeding element if it exists
                    if (!_this.controlContainer.is(preceedingFocusElement)) {
                        preceedingFocusElement.focus();
                        event.preventDefault();
                    }
                }
            };
        }
        ControlTabbingManager.prototype.init = function (controlContainer, assignedTabIndex) {
            if (assignedTabIndex > 0) {
                this.assignedTabIndex = assignedTabIndex;
                // Setup focus handling to transfer focus to the editor's first editor's tabbable element
                this.controlContainer = $(controlContainer)
                    .attr("tabindex", assignedTabIndex)
                    .on("focus", this.onControlFocused)
                    .on("keydown", this.onContainerKeyDown);
            }
        };
        ControlTabbingManager.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.controlContainer)) {
                this.controlContainer.off("focus", this.onControlFocused).off("keydown", this.onContainerKeyDown);
            }
            this.controlContainer = this.assignedTabIndex = null;
        };
        ControlTabbingManager.prototype.getFirstTabbableEditorElement = function (controlContainer) {
            return controlContainer.find(":tabbable:first");
        };
        return ControlTabbingManager;
    }());
    Editor.ControlTabbingManager = ControlTabbingManager;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var KeyCodes = MktSvc.Controls.Common.KeyCodes;
    /**
    * Class responsible for adding tabindex=-1 for each a inside a block.
    */
    var BlockTabbableController = /** @class */ (function () {
        function BlockTabbableController(eventBroker, blockProvider) {
            this.eventBroker = eventBroker;
            this.blockProvider = blockProvider;
        }
        BlockTabbableController.prototype.getName = function () {
            return "BlockTabbableController";
        };
        BlockTabbableController.prototype.setupBlocks = function (blockElements) {
            var _this = this;
            this.onBlockChangedHandler = this.eventBroker.subscribe(Editor.DesignerInternalEventConstants.contentBlockChanged, function (eventArgs) { _this.processBlock(eventArgs.block); });
            blockElements.each(function (index, block) {
                _this.processBlock($(block));
                $(block).on("keydown", function (e) {
                    var key = e.which || e.keyCode;
                    if (!e.shiftKey && key === KeyCodes.Tab) {
                        var designerFrame = Editor.CommonUtils.getByClass(Editor.CommonConstants.designerContentEditorFrameClassName);
                        var lastBlock = _this.blockProvider.getBlocks(designerFrame.contents()).last();
                        if ($(block).is(lastBlock)) {
                            e.preventDefault();
                            $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.tabButtonPreClassName +
                                Editor.CommonConstants.toolboxTabContentClassName)).parent().focus();
                            $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.tabButtonPreClassName +
                                Editor.CommonConstants.toolboxTabContentClassName)).click();
                        }
                    }
                });
            });
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.controllerReady, new Editor.ControllerReadyEventArgs(this.getName()));
        };
        BlockTabbableController.prototype.cleanupBlocks = function (blockElements) {
            blockElements.each(function (index, block) {
                $(block).find("a").removeAttr("tabindex");
                $(block).find("img").removeAttr("tabindex");
            });
        };
        BlockTabbableController.prototype.disposeBlocks = function (blockElements) {
            if (!Object.isNullOrUndefined(blockElements)) {
                blockElements.off("keydown");
            }
        };
        BlockTabbableController.prototype.dispose = function () {
            this.eventBroker.unsubscribe(Editor.DesignerInternalEventConstants.contentBlockChanged, this.onBlockChangedHandler);
        };
        BlockTabbableController.prototype.processBlock = function (block) {
            $(block).find("a").attr("tabindex", "-1");
            var blockType = $(block.closest("[" + Editor.Contract.blockTypeAttrName + "]")).attr(Editor.Contract.blockTypeAttrName);
            if (blockType === Editor.CommonConstants.textToolType) {
                $(block).find("img").attr("tabindex", "-1");
            }
        };
        return BlockTabbableController;
    }());
    Editor.BlockTabbableController = BlockTabbableController;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var KeyboardModifierType = MktSvc.Controls.Common.KeyboardModifierType;
    var CkEditorKeyboardAdapter = /** @class */ (function () {
        function CkEditorKeyboardAdapter() {
        }
        CkEditorKeyboardAdapter.prototype.getCkEditorKeyCode = function (keyboardCommand) {
            return keyboardCommand.modifiers.map(function (modifier) {
                switch (modifier) {
                    case KeyboardModifierType.Alt:
                        return CKEDITOR.ALT;
                    case KeyboardModifierType.Control:
                        return CKEDITOR.CTRL;
                    case KeyboardModifierType.Shift:
                        return CKEDITOR.SHIFT;
                    default:
                        throw new Error("Unknown keyboard modifier - " + modifier);
                }
            }).reduce(function (keyCode, modifierCode) { return keyCode + modifierCode; }, keyboardCommand.inputKeyCode);
        };
        return CkEditorKeyboardAdapter;
    }());
    Editor.CkEditorKeyboardAdapter = CkEditorKeyboardAdapter;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    /**
    * Class responsible for setting the sortable inside the containers - blocks can be sosorted inside and between the containers
    */
    var ContainerIdController = /** @class */ (function () {
        function ContainerIdController(eventBroker) {
            this.eventBroker = eventBroker;
        }
        ContainerIdController.prototype.getName = function () {
            return "ContainerIdController";
        };
        ContainerIdController.prototype.setupContainers = function (containers) {
            containers.each(function (index, container) {
                if (String.isNullOrWhitespace(Editor.CommonUtils.getId($(container)))) {
                    var id = UniqueId.generate("container");
                    Editor.CommonUtils.setId($(container), id);
                }
            });
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.controllerReady, new Editor.ControllerReadyEventArgs(this.getName()));
        };
        ContainerIdController.prototype.cleanupContainers = function (containers) {
            containers.removeAttr("id");
        };
        ContainerIdController.prototype.disposeContainers = function (containers) {
        };
        ContainerIdController.prototype.dispose = function () {
            this.eventBroker = null;
        };
        return ContainerIdController;
    }());
    Editor.ContainerIdController = ContainerIdController;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var DataTrackingAttributeContentProcessor = /** @class */ (function () {
        function DataTrackingAttributeContentProcessor() {
        }
        /**
        * Performs a content upgrade/resolution setup on the editor content model.
        */
        DataTrackingAttributeContentProcessor.prototype.process = function (documentContent, done) {
            var contents = $(documentContent).contents();
            var aTags = contents.find("a");
            aTags.each(function (index, element) {
                var $element = $(element);
                // Normalize the value of tracking attribute
                $element.attr(Editor.CommonConstants.dataTrackAttributeName, Editor.CommonUtils.getNormalizedTrackAttributeValue($element));
            });
            done();
        };
        /**
        * Returns the name of the content model processor.
        */
        DataTrackingAttributeContentProcessor.prototype.getName = function () {
            return "DataTrackingAttributeContentProcessor";
        };
        /**
        * Dispose.
        */
        DataTrackingAttributeContentProcessor.prototype.dispose = function () {
        };
        return DataTrackingAttributeContentProcessor;
    }());
    Editor.DataTrackingAttributeContentProcessor = DataTrackingAttributeContentProcessor;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var LinkContentProcessor = /** @class */ (function () {
        function LinkContentProcessor() {
        }
        /**
        * Performs a content upgrade/resolution setup on the editor content model.
        */
        LinkContentProcessor.prototype.process = function (documentContent, done) {
            var contents = $(documentContent).contents();
            var aTags = contents.find("a");
            aTags.each(function (index, element) {
                var $element = $(element);
                // Add default protocol if current link does not contain protocols
                $element.attr("href", Editor.CommonUtils.getLinkWithProtocol($element.attr("href")));
            });
            done();
        };
        /**
        * Returns the name of the content model processor.
        */
        LinkContentProcessor.prototype.getName = function () {
            return "LinkContentProcessor";
        };
        /**
        * Dispose.
        */
        LinkContentProcessor.prototype.dispose = function () {
        };
        return LinkContentProcessor;
    }());
    Editor.LinkContentProcessor = LinkContentProcessor;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var HandleChangesFromHtmlContentModelProcessor = /** @class */ (function () {
        function HandleChangesFromHtmlContentModelProcessor() {
            this.containerProvider = new Editor.ContainerProvider();
            this.contentChangedByHtmlMetaAttrName = "html-editor";
        }
        /**
        * Performs a content upgrade/resolution setup on the editor content model.
        */
        HandleChangesFromHtmlContentModelProcessor.prototype.process = function (documentContent, done, executionContext, eventBroker, component) {
            var contentsHead = $(documentContent).contents().find("head");
            var isMetaInContent = contentsHead.find("meta[name=" + this.contentChangedByHtmlMetaAttrName + "]").length > 0;
            if (component === Editor.CommonConstants.htmlEditorComponentName || this.isContentChangedByHtml || isMetaInContent) {
                this.isContentChangedByHtml = true;
                if (!isMetaInContent) {
                    var metaAttr = $("<meta>").attr("name", this.contentChangedByHtmlMetaAttrName);
                    contentsHead.append(metaAttr);
                }
            }
            done();
        };
        /**
        * Returns the name of the content model processor.
        */
        HandleChangesFromHtmlContentModelProcessor.prototype.getName = function () {
            return "HandleChangesFromHtmlContentModelProcessor";
        };
        /**
        * Dispose.
        */
        HandleChangesFromHtmlContentModelProcessor.prototype.dispose = function () { };
        return HandleChangesFromHtmlContentModelProcessor;
    }());
    Editor.HandleChangesFromHtmlContentModelProcessor = HandleChangesFromHtmlContentModelProcessor;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var TableDecoratorContentModelProcessor = /** @class */ (function () {
        function TableDecoratorContentModelProcessor() {
        }
        /**
        * Performs a content upgrade/resolution setup on the editor content model.
        */
        TableDecoratorContentModelProcessor.prototype.process = function (documentContent, done) {
            var contents = $(documentContent).contents();
            var tables = Editor.CommonUtils.getBySelector("table, th", contents);
            tables.each(function (index, table) {
                var block = $(table).find(Editor.CommonUtils.getAttrSelector(Editor.Contract.blockTypeAttrName));
                var container = $(table).find(Editor.CommonUtils.getAttrSelector(Editor.Contract.containerAttrName));
                /* If table contains a block or container, we decorate it */
                if (container.length !== 0 || block.length !== 0) {
                    $(table).attr("aria-role", "presentation");
                }
            });
            done();
        };
        /**
        * Returns the name of the content model processor.
        */
        TableDecoratorContentModelProcessor.prototype.getName = function () {
            return "TableDecoratorContentModelProcessor";
        };
        /**
        * Dispose.
        */
        TableDecoratorContentModelProcessor.prototype.dispose = function () { };
        return TableDecoratorContentModelProcessor;
    }());
    Editor.TableDecoratorContentModelProcessor = TableDecoratorContentModelProcessor;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var SetOrphanBlockContainerWrapContentModelProcessor = /** @class */ (function () {
        function SetOrphanBlockContainerWrapContentModelProcessor() {
            this.blockProvider = new Editor.BlockProvider();
        }
        /**
        * Performs a content upgrade/resolution setup on the editor content model.
        */
        SetOrphanBlockContainerWrapContentModelProcessor.prototype.process = function (documentContent, done) {
            var contents = $(documentContent).contents();
            var blocks = this.blockProvider.getBlocks(contents);
            blocks.each(function (i, block) {
                var $block = $(block);
                var container = $block.closest(Editor.CommonUtils.getAttrSelector(Editor.Contract.containerAttrName));
                /* If block doesn't have a container, wrap it in one */
                if (container.length === 0) {
                    var wrapperContainer = $("<div>").attr(Editor.Contract.containerAttrName, "true");
                    $(block).wrap(wrapperContainer);
                }
            });
            done();
        };
        /**
        * Returns the name of the content model processor.
        */
        SetOrphanBlockContainerWrapContentModelProcessor.prototype.getName = function () {
            return "SetOrphanBlockContainerWrapContentModelProcessor";
        };
        /**
        * Dispose.
        */
        SetOrphanBlockContainerWrapContentModelProcessor.prototype.dispose = function () { };
        return SetOrphanBlockContainerWrapContentModelProcessor;
    }());
    Editor.SetOrphanBlockContainerWrapContentModelProcessor = SetOrphanBlockContainerWrapContentModelProcessor;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BlockMovedEventArgs = /** @class */ (function (_super) {
        __extends(BlockMovedEventArgs, _super);
        function BlockMovedEventArgs(block) {
            var _this = _super.call(this) || this;
            _this.block = block;
            return _this;
        }
        return BlockMovedEventArgs;
    }(Editor.EventArgs));
    Editor.BlockMovedEventArgs = BlockMovedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var FullPageEditorRenderedEventArgs = /** @class */ (function (_super) {
        __extends(FullPageEditorRenderedEventArgs, _super);
        function FullPageEditorRenderedEventArgs(editorId) {
            var _this = _super.call(this) || this;
            _this.editorId = editorId;
            return _this;
        }
        return FullPageEditorRenderedEventArgs;
    }(Editor.EventArgs));
    Editor.FullPageEditorRenderedEventArgs = FullPageEditorRenderedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var FullScreenChangedEventArgs = /** @class */ (function (_super) {
        __extends(FullScreenChangedEventArgs, _super);
        function FullScreenChangedEventArgs(isFullscreen) {
            var _this = _super.call(this) || this;
            _this.isFullscreen = isFullscreen;
            return _this;
        }
        return FullScreenChangedEventArgs;
    }(Editor.EventArgs));
    Editor.FullScreenChangedEventArgs = FullScreenChangedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var VisibilityChangedEventArgs = /** @class */ (function (_super) {
        __extends(VisibilityChangedEventArgs, _super);
        function VisibilityChangedEventArgs(isVisible) {
            var _this = _super.call(this) || this;
            _this.isVisible = isVisible;
            return _this;
        }
        return VisibilityChangedEventArgs;
    }(Editor.EventArgs));
    Editor.VisibilityChangedEventArgs = VisibilityChangedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var AddToolsDropdownButton = /** @class */ (function () {
        function AddToolsDropdownButton() {
            this.localizedTitle = Editor.CommonUtils.getLocalizedString("[Add]");
            this.addButtonImageCssClass = "addButtonImage";
            this.addButtonCssClass = "addButton";
            this.addButtonLabelCssClass = "addButtonLabel";
        }
        AddToolsDropdownButton.prototype.getLabel = function () {
            return this.localizedTitle;
        };
        AddToolsDropdownButton.prototype.getType = function () {
            return Editor.CommonConstants.buttonType;
        };
        AddToolsDropdownButton.prototype.getClass = function () {
            return this.addButtonCssClass;
        };
        AddToolsDropdownButton.prototype.getButtonImageClass = function () {
            return this.addButtonImageCssClass;
        };
        AddToolsDropdownButton.prototype.getButtonLabelClass = function () {
            return this.addButtonLabelCssClass;
        };
        AddToolsDropdownButton.prototype.getTitle = function () {
            return this.localizedTitle;
        };
        return AddToolsDropdownButton;
    }());
    Editor.AddToolsDropdownButton = AddToolsDropdownButton;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var KeyCodes = MktSvc.Controls.Common.KeyCodes;
    var MaximizeButton = /** @class */ (function (_super) {
        __extends(MaximizeButton, _super);
        function MaximizeButton() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isFullscreen = false;
            _this.minimizeTitle = "[Minimize]";
            _this.maximizeTitle = "[Full Screen]";
            _this.onClick = function () {
                _this.updateFullscreenState(!_this.isFullscreen);
            };
            _this.closeButtonClicked = function () {
                _this.updateFullscreenState(false);
            };
            _this.escKeyHandler = function (event) {
                if (event.which === KeyCodes.Esc) {
                    _this.updateFullscreenState(false);
                }
            };
            return _this;
        }
        MaximizeButton.prototype.init = function (eventBroker) {
            _super.prototype.init.call(this, eventBroker);
            this.render();
        };
        MaximizeButton.prototype.activate = function () { };
        MaximizeButton.prototype.render = function () {
            var maximizeButtonImage = $("<span>").addClass(Editor.CommonConstants.maximizeButtonImageCssClass).addClass(Editor.CommonConstants.editorFontCssClass);
            this.maximizeButtonContainer = $("<button></button>")
                .addClass(Editor.CommonConstants.toolbarButtonCssClass)
                .addClass(Editor.CommonConstants.maximizeButtonCssClass)
                .attr("title", Editor.CommonUtils.getLocalizedString(this.maximizeTitle))
                .attr("aria-label", Editor.CommonUtils.getLocalizedString(this.maximizeTitle))
                .attr("aria-pressed", this.isFullscreen.toString())
                .attr("type", Editor.CommonConstants.buttonType)
                .append(maximizeButtonImage);
            Editor.CommonUtils.getByClass(Editor.CommonConstants.menuBarItemsCssClass).append(this.maximizeButtonContainer);
            this.maximizeButtonContainer.on("click", this.onClick);
            this.eventBroker.subscribe(Editor.EventConstants.exitFullScreenButtonClicked, this.closeButtonClicked);
        };
        MaximizeButton.prototype.updateFullscreenState = function (isFullscreen) {
            if (this.isFullscreen === isFullscreen) {
                return;
            }
            this.isFullscreen = isFullscreen;
            this.updateButtonStyles();
            this.eventBroker.notify(Editor.EventConstants.maximizeExecuted, new Editor.FullScreenChangedEventArgs(this.isFullscreen));
            //TODO: Workaround in order to exit fullscreen mode until UClient implements generic Esc to exit fullscreen
            if (this.isFullscreen) {
                $(document).on("keyup", this.escKeyHandler);
            }
            else {
                $(document).off("keyup", this.escKeyHandler);
            }
        };
        MaximizeButton.prototype.updateButtonStyles = function () {
            var title = this.maximizeButtonContainer.hasClass(Editor.CommonConstants.maximizeActiveCssClass) ? this.maximizeTitle : this.minimizeTitle;
            this.maximizeButtonContainer.toggleClass(Editor.CommonConstants.maximizeActiveCssClass, this.isFullscreen);
            this.maximizeButtonContainer.attr("aria-pressed", this.isFullscreen.toString());
            this.maximizeButtonContainer.attr("title", Editor.CommonUtils.getLocalizedString(title));
            Editor.CommonUtils.setAriaAttribute(this.maximizeButtonContainer, "aria-label", Editor.CommonUtils.getLocalizedString(title));
        };
        MaximizeButton.prototype.deactivate = function () { };
        MaximizeButton.prototype.dispose = function () {
            $(document).off("keyup", this.escKeyHandler);
            this.maximizeButtonContainer.off("click");
            this.maximizeButtonContainer.remove();
            this.eventBroker.unsubscribe(Editor.EventConstants.exitFullScreenButtonClicked, this.closeButtonClicked);
        };
        return MaximizeButton;
    }(Editor.Control));
    Editor.MaximizeButton = MaximizeButton;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var TraceLevel = MktSvc.Controls.Common.TraceLevel;
    var Dictionary = MktSvc.Controls.Common.Dictionary;
    /**
    * Class for the representing well-formed HTML document in the content editor.
    */
    var BaseEditorContentModel = /** @class */ (function () {
        /**
         * Constructor.
         * @param eventBroker The event broker instance.
         */
        function BaseEditorContentModel(executionContext, metadataParser, eventBroker, documentPreProcessors, documentPostProcessors) {
            var _this = this;
            /* The html content */
            this.html = String.Empty;
            /* The doctype of the html content */
            this.doctypeString = String.Empty;
            this.id = UniqueId.generate();
            this.initialized = false;
            this.editorBlockSelector = "div[" + Editor.Contract.blockTypeAttrName + "]";
            this.unlimitedNumberOfBlocks = 0;
            this.executionContext = executionContext;
            this.eventBroker = eventBroker;
            this.metadataParser = metadataParser;
            this.documentPreProcessors = documentPreProcessors;
            this.documentPostProcessors = documentPostProcessors;
            this.contentChangedHandler = this.eventBroker.subscribe(Editor.EventConstants.contentChanged, function (eventArgs) {
                var html = !Object.isNullOrUndefined(eventArgs) && !Object.isNullOrUndefined(eventArgs.html) ? eventArgs.html : String.Empty;
                var source = !Object.isNullOrUndefined(eventArgs) && !Object.isNullOrUndefined(eventArgs.sourceId) ? eventArgs.sourceId : String.Empty;
                _this.setContent(html, source, eventArgs.component);
            });
        }
        /**
        * Intializes the document model instance on the specified container.
        */
        BaseEditorContentModel.prototype.init = function () {
            // Initialize the document container and subscribe to the content changed events
            this.initialized = true;
            var eventArgs = new Editor.DocumentContentModelInitializedEventArgs(this.id);
            eventArgs.documentContentModel = this;
            this.eventBroker.notify(Editor.EventConstants.contentModelInitialized, eventArgs);
        };
        /**
         * Sets the editor content.
         * @param content - The content.
         * @param sourceId - The source id.
         * @param component - The component, which triggered setting the content.
         * @param callback - The callback. isContentChanged parameter indicates that no updates required, e.g. setting the same content again.
         */
        BaseEditorContentModel.prototype.setContent = function (content, sourceId, component, callback) {
            var _this = this;
            this.html = content;
            this.doctypeString = Editor.CommonUtils.getDocTypeFromString(this.html);
            if (this.initialized) {
                // Update the source document and notify
                this.sourceDocument = Editor.CommonUtils.getNewContentDocument(this.html);
                this.onContentModelUpdated(sourceId);
                this.designerResolvedDocument = Editor.CommonUtils.getNewContentDocument(this.html);
                this.runPreProcessors(this.designerResolvedDocument, component).done(function () {
                    _this.onPreProcessorsProcessed(sourceId);
                    _this.finalizedDocument = Editor.CommonUtils.getNewContentDocument(Editor.CommonUtils.getDocumentContent(_this.designerResolvedDocument, _this.doctypeString));
                    _this.runPostProcessors(_this.finalizedDocument, component).done(function () {
                        _this.onPostProcessorsProcessed(sourceId);
                    });
                });
                var maxNumberOfBlocks_1 = this.executionContext.getMaximumNumberOfBlocksOnCanvas();
                if (maxNumberOfBlocks_1 !== this.unlimitedNumberOfBlocks) {
                    this.executionContext.getContentSanitizer().getSanitizedContent(this.html, function (output) {
                        var numberOfBlocksInHtml = output.find(_this.editorBlockSelector).length;
                        if (numberOfBlocksInHtml >= maxNumberOfBlocks_1) {
                            _this.eventBroker.notify(Editor.EventConstants.elementsCannotBeInserted);
                        }
                        else {
                            _this.eventBroker.notify(Editor.EventConstants.elementsCanBeInserted);
                        }
                    });
                }
                if (Editor.CommonUtils.isFunction(callback)) {
                    callback(true);
                }
            }
            else {
                // No update required
                if (Editor.CommonUtils.isFunction(callback)) {
                    callback(false);
                }
            }
        };
        /**
         * Executes pre-processor for content.
         * @param contentDocument - The document with content that should be processed.
         * @param component - The component, which triggered execution.
         * @returns - JQueryPromise that will be resolved when the content is processed.
         */
        BaseEditorContentModel.prototype.runPreProcessors = function (contentDocument, component) {
            var preProcessingDeferred = $.Deferred();
            // Run content preprocessors (e.g. schema upgrade or runtime-id setup) and notify
            this.runProcessor(contentDocument, this.documentPreProcessors, component, preProcessingDeferred);
            return preProcessingDeferred.promise();
        };
        /**
         * Executes post-processor for content.
         * @param contentDocument - The document with content that should be processed.
         * @param component - The component, which triggered execution.
         * @returns - JQueryPromise that will be resolved when the content is processed.
         */
        BaseEditorContentModel.prototype.runPostProcessors = function (contentDocument, component) {
            var postProcessingDeferred = $.Deferred();
            this.runProcessor(contentDocument, this.documentPostProcessors, component, postProcessingDeferred);
            return postProcessingDeferred.promise();
        };
        /**
        * Gets the document version.
        */
        BaseEditorContentModel.prototype.getContentVersion = function () {
            return this.metadataParser.getValue(Editor.Contract.metadataDocumentVersionName, this.getContentNode());
        };
        /**
        * Gets the document type.
        */
        BaseEditorContentModel.prototype.getContentType = function () {
            return this.metadataParser.getValue(Editor.Contract.metadataDocumentTypeName, this.getContentNode());
        };
        /**
        * Gets the document content.
        */
        BaseEditorContentModel.prototype.getContent = function () {
            return this.html;
        };
        /**
        * Extracts the content from document.
        */
        BaseEditorContentModel.prototype.extractContentFromDocument = function (document) {
            if (document) {
                return Editor.CommonUtils.getDocumentContent(document, this.doctypeString);
            }
            return String.Empty;
        };
        /**
        * Gets the document content.
        */
        BaseEditorContentModel.prototype.getResolvedContent = function () {
            if (this.designerResolvedDocument) {
                return Editor.CommonUtils.getDocumentContent(this.designerResolvedDocument, this.doctypeString);
            }
            return String.Empty;
        };
        /**
        * Gets the document content.
        */
        BaseEditorContentModel.prototype.getFinalizedContent = function () {
            if (this.finalizedDocument) {
                return Editor.CommonUtils.getDocumentContent(this.finalizedDocument, this.doctypeString);
            }
            return String.Empty;
        };
        /**
        * Gets the document content.
        */
        BaseEditorContentModel.prototype.getContentNode = function () {
            return this.sourceDocument;
        };
        /**
        * Gets the resolved document content.
        */
        BaseEditorContentModel.prototype.getResolvedContentNode = function () {
            return this.designerResolvedDocument;
        };
        /**
        * Gets the finalized document content.
        */
        BaseEditorContentModel.prototype.getFinalizedContentNode = function () {
            return this.finalizedDocument;
        };
        /**
         * Gets the current doctype of the content
         */
        BaseEditorContentModel.prototype.getDoctype = function () {
            return this.doctypeString;
        };
        /**
        * Gets the style meta entries
        */
        BaseEditorContentModel.prototype.getStyleMetaEntries = function () {
            return this.metadataParser.getStyleMetaEntries(this.getContentNode());
        };
        BaseEditorContentModel.prototype.updateStyleMetaValue = function (metaStyle, newValue) {
            this.metadataParser.updateStyleMetaValue(this.getContentNode(), metaStyle, newValue);
        };
        BaseEditorContentModel.prototype.isDesignerContent = function () {
            return this.getContentType() === Editor.Contract.metadataDocumentTypeDesignerValue;
        };
        /**
        * Disposes the object - removes the html from the page, empty the  objects and detach the events
        */
        BaseEditorContentModel.prototype.dispose = function () {
            this.eventBroker.unsubscribe(Editor.EventConstants.contentChanged, this.contentChangedHandler);
            this.documentPreProcessors.each(function (processor) {
                processor.dispose();
            });
            this.documentPostProcessors.each(function (processor) {
                processor.dispose();
            });
            this.eventBroker = null;
            this.documentPreProcessors = null;
            this.documentPostProcessors = null;
            this.sourceDocument = null;
            this.designerResolvedDocument = null;
            this.finalizedDocument = null;
        };
        BaseEditorContentModel.prototype.runProcessor = function (contentDocument, processors, component, deferred) {
            var _this = this;
            var processedCount = 0;
            var onProcessed = function (processorName, failure) {
                if (_this.eventBroker) {
                    _this.eventBroker.notify(Editor.EventConstants.contentModelProcessCompleted, new Editor.ContentModelProcessorCompletedEventArgs(processorName, failure));
                    if (failure) {
                        _this.executionContext.getLogger().log(TraceLevel.Error, "Editor.BaseEditorContentModel.runProcessor", new Dictionary({ Processor: processorName, Message: "Failed to process content successfully" }));
                    }
                    else {
                        _this.executionContext.getLogger().log(TraceLevel.Verbose, "Editor.BaseEditorContentModel.runProcessorFinished", new Dictionary({ Processor: processorName, Message: "Finished content processing" }));
                    }
                    processedCount++;
                    if (processedCount === processors.count()) {
                        deferred.resolve();
                    }
                }
            };
            processors.each(function (processor) {
                _this.executionContext.getLogger().log(TraceLevel.Verbose, "Editor.BaseEditorContentModel.runProcessorProcessing", new Dictionary({ Processor: processor.getName(), Message: "Executing content processing" }));
                _this.executionContext.tryExecute(function () {
                    processor.process(contentDocument, function (failure) { return onProcessed(processor.getName(), failure); }, _this.executionContext, _this.eventBroker, component);
                }, "Run the " + processor.getName() + " processor", false, function () {
                    onProcessed(processor.getName(), true);
                });
            });
        };
        BaseEditorContentModel.prototype.onContentModelUpdated = function (sourceId) {
            this.eventBroker.notify(Editor.EventConstants.contentModelUpdated, new Editor.ContentChangedEventArgs(this.getContent(), this.id, sourceId));
        };
        BaseEditorContentModel.prototype.onPreProcessorsProcessed = function (sourceId) {
            this.eventBroker.notify(Editor.EventConstants.contentResolved, new Editor.ContentChangedEventArgs(this.getResolvedContent(), this.id, sourceId));
        };
        BaseEditorContentModel.prototype.onPostProcessorsProcessed = function (sourceId) {
            this.eventBroker.notify(Editor.EventConstants.contentFinalized, new Editor.ContentChangedEventArgs(this.getFinalizedContent(), this.id, sourceId));
        };
        return BaseEditorContentModel;
    }());
    Editor.BaseEditorContentModel = BaseEditorContentModel;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    var Object = MktSvc.Controls.Common.Object;
    /**
    * Class for the representing a HTML fragment in the content editor. The editor generaly expects to have a document,
    * so, this class would actually just delegate the content to a full document content model and set/get the content under the body.
    */
    var FragmentContentModel = /** @class */ (function (_super) {
        __extends(FragmentContentModel, _super);
        function FragmentContentModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Sets the editor content.
         * @param content - The content.
         * @param sourceId - The source id.
         * @param component - The component, which triggered setting the content.
         * @param callback - The callback. isContentChanged parameter indicates that no updates required, e.g. setting the same content again.
         */
        FragmentContentModel.prototype.setContent = function (content, sourceId, component, callback) {
            var fragmentContent = this.getFragmentContent(Editor.CommonUtils.getNewContentDocument(content));
            // Compare content without new line symbols which comes from html editor
            if (String.isNullOrWhitespace(this.getContent()) || this.getContent() !== fragmentContent) {
                _super.prototype.setContent.call(this, fragmentContent, sourceId, component, callback);
            }
            else {
                if (Editor.CommonUtils.isFunction(callback)) {
                    // No update required
                    callback(false);
                }
            }
        };
        /**
        * Gets the source content.
        */
        FragmentContentModel.prototype.getContent = function () {
            return this.getFragmentContent(this.getContentNode());
        };
        /**
        * Extracts the content from document.
        */
        FragmentContentModel.prototype.extractContentFromDocument = function (document) {
            return this.getFragmentContent(document);
        };
        /**
        * Gets the resolved content.
        */
        FragmentContentModel.prototype.getResolvedContent = function () {
            return this.getFragmentContent(this.getResolvedContentNode());
        };
        /**
        * Gets the finalized content.
        */
        FragmentContentModel.prototype.getFinalizedContent = function () {
            return this.getFragmentContent(this.getFinalizedContentNode());
        };
        /**
         * Just an utility method to get the body.
         */
        FragmentContentModel.prototype.getFragmentContent = function (document) {
            if (!Object.isNullOrUndefined(document)) {
                // Remove empty title tag, which added by CkEditor
                var title = $(document).contents().find("head").find("title");
                if (title.length && String.isNullOrWhitespace(title.html())) {
                    title.remove();
                }
                var fragment = ($(document).contents().find("head").html()
                    ? $(document).contents().find("head").html().trim()
                    : String.Empty) +
                    ($(document).contents().find("body").html()
                        ? $(document).contents().find("body").html()
                        : String.Empty);
                if (Editor.CommonUtils.isInternetExplorer()) {
                    // parsing the DOM in IE adds certain meta tags to the
                    // document body which we need to remove.
                    return this.removeIEMetaTag(fragment);
                }
                else {
                    return fragment;
                }
            }
            return String.Empty;
        };
        FragmentContentModel.prototype.removeIEMetaTag = function (content) {
            return content.replace(/<(?:META|meta) http-equiv="X-UA-Compatible" content="IE=[0-9.]+">/g, "")
                .replace(/<(?:META|meta) content="IE=[0-9.]+" http-equiv="X-UA-Compatible">/g, "");
        };
        return FragmentContentModel;
    }(Editor.BaseEditorContentModel));
    Editor.FragmentContentModel = FragmentContentModel;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
    * Class for the representing well-formed HTML document in the content editor.
    */
    var DocumentContentModel = /** @class */ (function (_super) {
        __extends(DocumentContentModel, _super);
        function DocumentContentModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Sets the document content.
         * @param content - The content.
         * @param sourceId - The source id.
         * @param component - The component, which triggered setting the content.
         * @param callback - The callback. isContentChanged parameter indicates that no updates required, e.g. setting the same content again.
         */
        DocumentContentModel.prototype.setContent = function (content, sourceId, component, callback) {
            if (this.html !== content) {
                _super.prototype.setContent.call(this, content, sourceId, component, callback);
            }
            else {
                // No update required
                if (Editor.CommonUtils.isFunction(callback)) {
                    callback(false);
                }
            }
        };
        return DocumentContentModel;
    }(Editor.BaseEditorContentModel));
    Editor.DocumentContentModel = DocumentContentModel;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var ContentModelProcessorCompletedEventArgs = /** @class */ (function (_super) {
        __extends(ContentModelProcessorCompletedEventArgs, _super);
        function ContentModelProcessorCompletedEventArgs(processName, processFailed) {
            var _this = _super.call(this) || this;
            _this.processName = processName;
            _this.processFailed = processFailed;
            return _this;
        }
        return ContentModelProcessorCompletedEventArgs;
    }(Editor.EventArgs));
    Editor.ContentModelProcessorCompletedEventArgs = ContentModelProcessorCompletedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var BasicImageGalleryCommandFactory = /** @class */ (function () {
        function BasicImageGalleryCommandFactory() {
        }
        /**
         * Creates a basic image gallery command plugin
         */
        BasicImageGalleryCommandFactory.prototype.create = function () {
            return new Editor.ImageGalleryCommand(new Editor.RandomImagePicker(), new Editor.PopupRenderer());
        };
        return BasicImageGalleryCommandFactory;
    }());
    Editor.BasicImageGalleryCommandFactory = BasicImageGalleryCommandFactory;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var GalleryButtonFactory = /** @class */ (function () {
        function GalleryButtonFactory(imagePickerFactory) {
            this.imagePickerFactory = imagePickerFactory;
        }
        GalleryButtonFactory.prototype.create = function (imagePickerId) {
            var imagePicker = this.imagePickerFactory.create(imagePickerId);
            var imagePickerCommand = new Editor.ImageGalleryCommand(imagePicker, new Editor.PopupRenderer());
            return new Editor.ImageGalleryButton(imagePickerCommand);
        };
        return GalleryButtonFactory;
    }());
    Editor.GalleryButtonFactory = GalleryButtonFactory;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var LoadingModal = MktSvc.Controls.Common.LoadingModal;
    var HtmlContentEditorFactory = /** @class */ (function () {
        function HtmlContentEditorFactory() {
        }
        HtmlContentEditorFactory.prototype.create = function (keyboardCommandManager, executionContext) {
            return new Editor.HtmlContentEditor(UniqueId.generate("htmlEditorId"), new LoadingModal(), new Editor.MonacoLocaleProvider(executionContext.getLocalizationProvider().getLocaleId()), keyboardCommandManager, executionContext);
        };
        return HtmlContentEditorFactory;
    }());
    Editor.HtmlContentEditorFactory = HtmlContentEditorFactory;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    /*
    Gets the localized string
    */
    var MonacoLocaleProvider = /** @class */ (function () {
        function MonacoLocaleProvider(microsoftLocaleId) {
            this.defaultCode = "1033";
            this.mapping = {
                1026: "bg",
                1027: "ca",
                1028: "zh-tw",
                1029: "cs",
                1030: "da",
                1031: "de",
                1032: "el",
                1033: "",
                1035: "fi",
                1036: "fr",
                1038: "hu",
                1040: "it",
                1041: "ja",
                1042: "ko",
                1043: "nl",
                1044: "nb",
                1045: "pl",
                1046: "pt-br",
                1048: "ro",
                1049: "ru",
                1050: "hr",
                1051: "sk",
                1053: "sv",
                1054: "th",
                1055: "tr",
                1057: "id",
                1058: "uk",
                1060: "sl",
                1061: "et",
                1062: "lv",
                1063: "lt",
                1066: "vi",
                1069: "eu",
                1081: "hi",
                1086: "ms",
                1087: "kk",
                1110: "gl",
                2052: "zh-cn",
                2070: "pt",
                2074: "sr-latn",
                3076: "zh-hk",
                3082: "es",
                3098: "sr"
            };
            this.microsoftLocaleId = microsoftLocaleId;
        }
        MonacoLocaleProvider.prototype.getLanguageCode = function () {
            return this.microsoftLocaleId in this.mapping ? this.mapping[this.microsoftLocaleId] : this.mapping[this.defaultCode];
        };
        MonacoLocaleProvider.prototype.getLanguageDirection = function () {
            return "ltr";
        };
        return MonacoLocaleProvider;
    }());
    Editor.MonacoLocaleProvider = MonacoLocaleProvider;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    /*
    Gets the localized string
    */
    var CkEditorLocaleProvider = /** @class */ (function () {
        function CkEditorLocaleProvider(microsoftLocaleId, isRtl) {
            this.defaultCode = "1033";
            this.mapping = {
                1025: "ar",
                1026: "bg",
                1027: "ca",
                1028: "zh",
                1029: "cs",
                1030: "da",
                1031: "de",
                1032: "el",
                1033: "en",
                1035: "fi",
                1036: "fr",
                1037: "he",
                1038: "hu",
                1040: "it",
                1041: "ja",
                1042: "ko",
                1043: "nl",
                1044: "nb",
                1045: "pl",
                1046: "pt-br",
                1048: "ro",
                1049: "ru",
                1050: "hr",
                1051: "sk",
                1053: "sv",
                1054: "th",
                1055: "tr",
                1057: "id",
                1058: "uk",
                1060: "sl",
                1061: "et",
                1062: "lv",
                1063: "lt",
                1066: "vi",
                1069: "eu",
                1081: "hi",
                1086: "ms",
                1087: "kk",
                1110: "gl",
                2052: "zh-cn",
                2070: "pt",
                2074: "sr-latn",
                3076: "zh-hk",
                3082: "es",
                3098: "sr"
            };
            this.microsoftLocaleId = microsoftLocaleId;
            this.isRtl = isRtl;
        }
        CkEditorLocaleProvider.prototype.getLanguageCode = function () {
            return this.microsoftLocaleId in this.mapping ? this.mapping[this.microsoftLocaleId] : this.mapping[this.defaultCode];
        };
        CkEditorLocaleProvider.prototype.getLanguageDirection = function () {
            return this.isRtl ? "rtl" : "ltr";
        };
        return CkEditorLocaleProvider;
    }());
    Editor.CkEditorLocaleProvider = CkEditorLocaleProvider;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BlockChangedEventArgs = /** @class */ (function (_super) {
        __extends(BlockChangedEventArgs, _super);
        function BlockChangedEventArgs(sourceId, $block) {
            var _this = _super.call(this, sourceId) || this;
            _this.block = $block;
            return _this;
        }
        return BlockChangedEventArgs;
    }(Editor.EventArgs));
    Editor.BlockChangedEventArgs = BlockChangedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var DocumentContentModelInitializedEventArgs = /** @class */ (function (_super) {
        __extends(DocumentContentModelInitializedEventArgs, _super);
        function DocumentContentModelInitializedEventArgs() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DocumentContentModelInitializedEventArgs;
    }(Editor.EventArgs));
    Editor.DocumentContentModelInitializedEventArgs = DocumentContentModelInitializedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var RemoveContainerIdContentModelProcessor = /** @class */ (function () {
        function RemoveContainerIdContentModelProcessor() {
            this.containerProvider = new Editor.ContainerProvider();
        }
        /**
        * Performs a content upgrade/resolution setup on the editor content model.
        */
        RemoveContainerIdContentModelProcessor.prototype.process = function (documentContent, done) {
            var contents = $(documentContent).contents();
            this.containerProvider.getContainers(contents).removeAttr("id");
            done();
        };
        /**
        * Returns the name of the content model processor.
        */
        RemoveContainerIdContentModelProcessor.prototype.getName = function () {
            return "RemoveContainerIdContentModelProcessor";
        };
        /**
        * Dispose.
        */
        RemoveContainerIdContentModelProcessor.prototype.dispose = function () { };
        return RemoveContainerIdContentModelProcessor;
    }());
    Editor.RemoveContainerIdContentModelProcessor = RemoveContainerIdContentModelProcessor;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var RemoveBlockIdContentModelProcessor = /** @class */ (function () {
        function RemoveBlockIdContentModelProcessor() {
            this.blockProvider = new Editor.BlockProvider();
        }
        /**
        * Performs a content upgrade/resolution setup on the editor content model.
        */
        RemoveBlockIdContentModelProcessor.prototype.process = function (documentContent, done) {
            var contents = $(documentContent).contents();
            this.blockProvider.getBlocks(contents).removeAttr("id");
            done();
        };
        /**
        * Returns the name of the content model processor.
        */
        RemoveBlockIdContentModelProcessor.prototype.getName = function () {
            return "RemoveBlockIdContentModelProcessor";
        };
        /**
        * Dispose.
        */
        RemoveBlockIdContentModelProcessor.prototype.dispose = function () { };
        return RemoveBlockIdContentModelProcessor;
    }());
    Editor.RemoveBlockIdContentModelProcessor = RemoveBlockIdContentModelProcessor;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var SetContainerIdContentModelProcessor = /** @class */ (function () {
        function SetContainerIdContentModelProcessor() {
            this.containerProvider = new Editor.ContainerProvider();
        }
        /**
        * Performs a content upgrade/resolution setup on the editor content model.
        */
        SetContainerIdContentModelProcessor.prototype.process = function (documentContent, done) {
            var contents = $(documentContent).contents();
            var containers = this.containerProvider.getContainers(contents);
            containers.each(function (i, container) {
                if (String.isNullUndefinedOrWhitespace(Editor.CommonUtils.getId($(container)))) {
                    var id = UniqueId.generate("container");
                    Editor.CommonUtils.setId($(container), id);
                }
            });
            done();
        };
        /**
        * Returns the name of the content model processor.
        */
        SetContainerIdContentModelProcessor.prototype.getName = function () {
            return "SetContainerIdContentModelProcessor";
        };
        /**
        * Dispose.
        */
        SetContainerIdContentModelProcessor.prototype.dispose = function () { };
        return SetContainerIdContentModelProcessor;
    }());
    Editor.SetContainerIdContentModelProcessor = SetContainerIdContentModelProcessor;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var SetBlockIdContentModelProcessor = /** @class */ (function () {
        function SetBlockIdContentModelProcessor() {
            this.blockProvider = new Editor.BlockProvider();
        }
        /**
        * Performs a content upgrade/resolution setup on the editor content model.
        */
        SetBlockIdContentModelProcessor.prototype.process = function (documentContent, done) {
            var contents = $(documentContent).contents();
            var blocks = this.blockProvider.getBlocks(contents);
            blocks.each(function (i, block) {
                if (String.isNullUndefinedOrWhitespace(Editor.CommonUtils.getId($(block)))) {
                    var id = UniqueId.generate("block");
                    Editor.CommonUtils.setId($(block), id);
                }
            });
            done();
        };
        /**
        * Returns the name of the content model processor.
        */
        SetBlockIdContentModelProcessor.prototype.getName = function () {
            return "SetBlockIdContentModelProcessor";
        };
        /**
        * Dispose.
        */
        SetBlockIdContentModelProcessor.prototype.dispose = function () { };
        return SetBlockIdContentModelProcessor;
    }());
    Editor.SetBlockIdContentModelProcessor = SetBlockIdContentModelProcessor;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var CkEditorContentStyleSetFactory = /** @class */ (function () {
        function CkEditorContentStyleSetFactory() {
        }
        CkEditorContentStyleSetFactory.prototype.createStyleSet = function () {
            return [
                /* Block Styles */
                { name: "Italic Title", element: "h2", styles: { "font-style": "italic" } },
                { name: "Subtitle", element: "h3", styles: { color: "#aaa", "font-style": "italic" } },
                {
                    name: "Special Container",
                    element: "div",
                    styles: {
                        padding: "5px 10px",
                        background: "#eee",
                        border: "1px solid #ccc"
                    }
                },
                /* Inline Styles */
                { name: "Big", element: "big" },
                { name: "Small", element: "small" },
                { name: "Typewriter", element: "tt" },
                { name: "Computer Code", element: "code" },
                { name: "Keyboard Phrase", element: "kbd" },
                { name: "Sample Text", element: "samp" },
                { name: "Variable", element: "var" },
                { name: "Deleted Text", element: "del" },
                { name: "Inserted Text", element: "ins" },
                { name: "Cited Work", element: "cite" },
                { name: "Inline Quotation", element: "q" },
                { name: "Language: RTL", element: "span", attributes: { dir: "rtl" } },
                { name: "Language: LTR", element: "span", attributes: { dir: "ltr" } },
                /* Object Styles */
                {
                    name: "Compact table",
                    element: "table",
                    attributes: {
                        cellpadding: "5",
                        cellspacing: "0",
                        border: "1",
                        bordercolor: "#ccc"
                    },
                    styles: {
                        "border-collapse": "collapse"
                    }
                },
                {
                    name: "Borderless Table",
                    element: "table",
                    styles: { "border-style": "hidden", "background-color": "#E6E6FA" }
                },
                { name: "Square Bulleted List", element: "ul", styles: { "list-style-type": "square" } }
            ];
        };
        return CkEditorContentStyleSetFactory;
    }());
    Editor.CkEditorContentStyleSetFactory = CkEditorContentStyleSetFactory;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /**
    * A class containing exceptions from the CkEditor ENTER_P mode.
    */
    var CkEditorEnterModeExceptions = /** @class */ (function () {
        function CkEditorEnterModeExceptions() {
        }
        /**
         * Contains a list of Html tags that require to use the CkEditor ENTER_BR mode,
         * in order to avoid having these elements wrapped in a <p> tag.
         */
        CkEditorEnterModeExceptions.enterBrTagList = ["div", "a", "img"];
        return CkEditorEnterModeExceptions;
    }());
    Editor.CkEditorEnterModeExceptions = CkEditorEnterModeExceptions;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var ContainerRenderedEventArgs = /** @class */ (function (_super) {
        __extends(ContainerRenderedEventArgs, _super);
        function ContainerRenderedEventArgs(element) {
            var _this = _super.call(this) || this;
            _this.element = element;
            return _this;
        }
        return ContainerRenderedEventArgs;
    }(Editor.EventArgs));
    Editor.ContainerRenderedEventArgs = ContainerRenderedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
    * Event args for the designer drag start event.
    */
    var DesignerDragStartEventArgs = /** @class */ (function (_super) {
        __extends(DesignerDragStartEventArgs, _super);
        function DesignerDragStartEventArgs(block) {
            var _this = _super.call(this, null) || this;
            _this.block = block;
            return _this;
        }
        return DesignerDragStartEventArgs;
    }(Editor.EventArgs));
    Editor.DesignerDragStartEventArgs = DesignerDragStartEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var ElementFocusedEventArgs = /** @class */ (function (_super) {
        __extends(ElementFocusedEventArgs, _super);
        function ElementFocusedEventArgs(element) {
            var _this = _super.call(this) || this;
            _this.element = element;
            return _this;
        }
        return ElementFocusedEventArgs;
    }(Editor.EventArgs));
    Editor.ElementFocusedEventArgs = ElementFocusedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var ElementRenderedEventArgs = /** @class */ (function (_super) {
        __extends(ElementRenderedEventArgs, _super);
        function ElementRenderedEventArgs(element) {
            var _this = _super.call(this) || this;
            _this.element = element;
            return _this;
        }
        return ElementRenderedEventArgs;
    }(Editor.EventArgs));
    Editor.ElementRenderedEventArgs = ElementRenderedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
     * Arguments associated to event sectionToolsPublishCompleted in order to notify that tool publishing has ended for a specific section.
     */
    var SectionToolsPublishCompletedEventArgs = /** @class */ (function (_super) {
        __extends(SectionToolsPublishCompletedEventArgs, _super);
        function SectionToolsPublishCompletedEventArgs(sectionName) {
            var _this = _super.call(this) || this;
            _this.sectionName = sectionName;
            return _this;
        }
        /**
         * Gets the section name.
         */
        SectionToolsPublishCompletedEventArgs.prototype.getSectionName = function () {
            return this.sectionName;
        };
        return SectionToolsPublishCompletedEventArgs;
    }(Editor.EventArgs));
    Editor.SectionToolsPublishCompletedEventArgs = SectionToolsPublishCompletedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
     * Arguments associated to event sectionToolsPublishStarted in order to notify that tool publishing has started for a specific section.
     */
    var SectionToolsPublishStartedEventArgs = /** @class */ (function (_super) {
        __extends(SectionToolsPublishStartedEventArgs, _super);
        function SectionToolsPublishStartedEventArgs(sectionName) {
            var _this = _super.call(this) || this;
            _this.sectionName = sectionName;
            return _this;
        }
        /**
         * Gets the section name.
         */
        SectionToolsPublishStartedEventArgs.prototype.getSectionName = function () {
            return this.sectionName;
        };
        return SectionToolsPublishStartedEventArgs;
    }(Editor.EventArgs));
    Editor.SectionToolsPublishStartedEventArgs = SectionToolsPublishStartedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
     * Tool published event args used to notify ToolboxView in order to add new tools and blocks dynamically.
     */
    var ToolPublishedEventArgs = /** @class */ (function (_super) {
        __extends(ToolPublishedEventArgs, _super);
        function ToolPublishedEventArgs(tool, sectionName) {
            var _this = _super.call(this) || this;
            _this.tool = tool;
            _this.sectionName = sectionName;
            return _this;
        }
        /**
         * Gets the tool.
         */
        ToolPublishedEventArgs.prototype.getTool = function () {
            return this.tool;
        };
        /**
         * Gets the section name.
         */
        ToolPublishedEventArgs.prototype.getSectionName = function () {
            return this.sectionName;
        };
        return ToolPublishedEventArgs;
    }(Editor.EventArgs));
    Editor.ToolPublishedEventArgs = ToolPublishedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var DelayScheduler = MktSvc.Controls.Common.DelayScheduler;
    var ArrayQuery = MktSvc.Controls.Common.ArrayQuery;
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var KeyboardCommand = MktSvc.Controls.Common.KeyboardCommand;
    var KeyCodes = MktSvc.Controls.Common.KeyCodes;
    var KeyboardKeyCodes = MktSvc.Controls.Common.KeyboardKeyCodes;
    var KeyboardModifierType = MktSvc.Controls.Common.KeyboardModifierType;
    /**
    * Content editor class is responsible for setting the html content and initializing all blocks and containers.
    * This class raises:
    *   - content changed event
    *   - selection changed event
    */
    var FullPageContentEditor = /** @class */ (function (_super) {
        __extends(FullPageContentEditor, _super);
        /**
        * Creates the content editor.
        * @param containerId - An id of a container in which the content editor should be placed.
        */
        function FullPageContentEditor(containerId, ckEditorProxy, keyboardCommandManager, executionContext, fullPageToolbarConfig, imagePlaceholderHelper, accessibilityInstructions) {
            var _this = _super.call(this, containerId) || this;
            _this.minHeight = 540;
            _this.fullPageSuffix = "FullPage_";
            _this.ckEditorProxy = null;
            _this.iframe = null;
            _this.innerIFrame = null;
            _this.fullPageToolbarConfig = new Editor.BasicFullPageToolbar();
            _this.modifiedElementIds = [];
            _this.firefoxKeydownEventDelay = 300;
            _this.onContentModelInitialized = function (eventArgs) {
                _this.documentContentModel = eventArgs.documentContentModel;
            };
            _this.onContentModelUpdated = function (eventArgs) {
                _this.documentContentModel.isDesignerContent() ? _this.keyboardCommandManager.unregisterCommand(_this.keyboardCommand) : _this.keyboardCommandManager.registerCommand(_this.keyboardCommand);
                _this.setContent(eventArgs);
            };
            _this.onMaximizeExecuted = function (eventArgs) {
                _this.isFullScreen = eventArgs.isFullscreen;
                $(window).one("animationstart", _this.onAnimationStart);
                $(window).one("animationend", _this.onAnimationEnd);
                _this.resizeTimer.schedule();
            };
            _this.onAnimationStart = function (event) {
                if ($(event.target).find("#" + _this.id).length) {
                    _this.resizeTimer.stop(true);
                }
            };
            _this.onAnimationEnd = function (event) {
                if ($(event.target).find("#" + _this.id).length) {
                    _this.resizeTimer.stop(true);
                    _this.resizeEditor();
                }
            };
            _this.ckEditorProxy = ckEditorProxy;
            if (!Object.isNullOrUndefined(fullPageToolbarConfig)) {
                _this.fullPageToolbarConfig = fullPageToolbarConfig;
            }
            if (Object.isNullOrUndefined(imagePlaceholderHelper)) {
                imagePlaceholderHelper = new Editor.ImagePlaceholderHelper(); // tslint:disable-line
            }
            _this.imagePlaceholderHelper = imagePlaceholderHelper;
            _this.keyboardCommandManager = keyboardCommandManager;
            _this.executionContext = executionContext;
            _this.accessibilityInstructions = accessibilityInstructions;
            return _this;
        }
        /**
        * Initializes the designer editor.
        * @param eventBroker - The event broker.
        */
        FullPageContentEditor.prototype.init = function (eventBroker) {
            var _this = this;
            this.eventBroker = eventBroker;
            this.eventBroker.subscribe(Editor.EventConstants.contentModelInitialized, this.onContentModelInitialized);
            this.eventBroker.subscribe(Editor.EventConstants.maximizeExecuted, this.onMaximizeExecuted);
            this.changeTimer = new DelayScheduler(this.eventBroker, Editor.DesignerInternalEventConstants.fullPageNonEventPropagationStart, Editor.DesignerInternalEventConstants.fullPageNonEventPropagationEnd);
            this.changeTimer.init(function () { return _this.broadcastContentChanged(); });
            this.eventBroker.subscribe(Editor.EventConstants.fullPageEditorContentChanged, function () {
                var modifiedElementId = _this.ckEditorProxy.getChildEditableElementId(null, _this.fullPageSuffix);
                if (!String.isNullUndefinedOrWhitespace(modifiedElementId)) {
                    if (_this.modifiedElementIds.indexOf(modifiedElementId) === -1) {
                        _this.modifiedElementIds.push(modifiedElementId);
                    }
                    _this.changeTimer.schedule();
                }
            });
            this.resizeTimer = new DelayScheduler(this.eventBroker);
            this.resizeTimer.init(function () {
                $(window).off("animationstart", _this.onAnimationStart);
                $(window).off("animationend", _this.onAnimationEnd);
                _this.resizeEditor();
            });
            this.keyboardCommand = new KeyboardCommand(KeyboardKeyCodes.oneKey, [KeyboardModifierType.Alt], function () {
                if (!_this.documentContentModel.isDesignerContent()) {
                    $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.tabButtonPreClassName +
                        Editor.CommonConstants.fullPageContentEditorcssClass)).focus().click();
                }
            });
            this.eventBroker.subscribe(Editor.EventConstants.contentModelUpdated, this.onContentModelUpdated);
            if (Object.isNullOrUndefined(this.onImageSourceChanged)) {
                this.eventBroker.subscribe(Editor.EventConstants.imageAttributeChanged, this.onImageSourceChanged = function (eventArgs) { return _this.updateImageSource(eventArgs); });
            }
        };
        /**
        * Activates the view - the view becomes visible
        */
        FullPageContentEditor.prototype.activate = function () {
            _super.prototype.activate.call(this);
            this.render();
            this.resizeEditor();
            Editor.AccessibilityInstructionsPopup.accessibilityInstructions = this.accessibilityInstructions ||
                Editor.EditorAccessibilityInstructions.baseFullPageAccessibilityInstructions;
            if (Editor.CommonUtils.isIOS() && this.iframe) {
                $(this.iframe).contents().find("html").show();
            }
        };
        /**
        * Dectivates the view - the view becomes invisible
        */
        FullPageContentEditor.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            this.changeTimer.stop();
            if (Editor.CommonUtils.isIOS() && this.iframe) {
                $(this.iframe).contents().find("html").hide();
            }
        };
        /**
         * Sets the new editor content
         * @param eventArgs - The ContentChangedEventArgs.
         */
        FullPageContentEditor.prototype.setContent = function (eventArgs) {
            if (this.changeTimer.isRunning()) {
                return;
            }
            if (eventArgs.sourceId === this.id || eventArgs.originalSourceId === this.id) {
                return;
            }
            if (eventArgs.html === this.sourceHtml) {
                return;
            }
            this.sourceHtml = eventArgs.html;
            if (!this.isActive) {
                return;
            }
            this.render();
        };
        FullPageContentEditor.prototype.render = function () {
            var _this = this;
            if (Object.isNullOrUndefined(this.iframe)) {
                this.fullPageEditorIsLoading = true;
                // Render the html content under an iframe
                var iframeId_1 = UniqueId.generate("foreignContentEditor");
                this.setupEditorIframe(iframeId_1);
                this.ckEditorProxy.init(this.iframe, function () {
                    var ckEditor = _this.ckEditorProxy.createEditor(Editor.CommonUtils.getById(iframeId_1, $($(_this.iframe)).contents()), _this.fullPageToolbarConfig);
                    _this.onCkEditorInitialized = _this.eventBroker.subscribe(Editor.EventConstants.standardCkEditorInitialized, function (eventArgs) {
                        _this.ckEditorProxy.registerPlugins();
                        _this.keyboardCommandManager.registerCommandsInIframe(_this.iframe);
                        _this.innerIFrame = $(_this.iframe).contents().find("iframe").get(0);
                        $(_this.innerIFrame).attr("role", "presentation");
                        // Fix for the issue with focus in some browsers except Firefox: customers need to press 'tab' key twice to set focus inside editor
                        $(_this.iframe).on("focus", function () {
                            _this.ckEditorProxy.setEditorFocus(eventArgs.ckEditorInstanceName);
                        });
                        // Workaround for the issue with focus in Firefox 57+: customers can't navigate inside editor content via keyboard
                        if (Editor.CommonUtils.isFirefox()) {
                            var editorInternalFrameDocument_1 = _this.innerIFrame.contentDocument;
                            var selectionManager_1 = new MktSvcCommon.SelectionManager();
                            selectionManager_1.setup(editorInternalFrameDocument_1);
                            $(_this.iframe).contents().on("focus", function () {
                                _this.ckEditorProxy.setEditorFocus(eventArgs.ckEditorInstanceName, function () {
                                    // Set caret position inside first nested element without child elements
                                    var editableElement = $(editorInternalFrameDocument_1).find("body").find(":not(:has(*))").get(0);
                                    if (editableElement) {
                                        selectionManager_1.setCaretPosition(editableElement, 0);
                                    }
                                });
                            });
                            $(_this.innerIFrame).on("load", function () {
                                // Use delay for Firefox because even if CkEditorInitialized fired internal ckeditor might be not ready
                                setTimeout(function () {
                                    $(_this.innerIFrame).contents().on("keydown", function (e) {
                                        var keyPressed = e.which || e.keyCode;
                                        if (keyPressed === KeyCodes.Tab && e.shiftKey) {
                                            e.preventDefault();
                                            $("." + Editor.CommonConstants.menuBarCssClass + " :tabbable:last").focus();
                                        }
                                    });
                                }, _this.firefoxKeydownEventDelay);
                            });
                        }
                        _this.elementId = ckEditor.element.getId();
                        _this.updateContent();
                        Editor.CommonUtils.appendElementToHead($(_this.iframe).contents(), _this.getCustomCkEditorStylesElement());
                        _this.eventBroker.notify(Editor.EventConstants.controlRendered, new Editor.ControlRenderedEventArgs(_this.id));
                        _this.fullPageEditorIsLoading = false;
                    });
                });
            }
            else if (!this.fullPageEditorIsLoading) {
                this.ckEditorProxy.registerPlugins();
                this.updateContent();
            }
        };
        FullPageContentEditor.prototype.setupEditorIframe = function (id) {
            this.iframe = document.createElement("iframe");
            var $iframe = $(this.iframe);
            $iframe.attr("title", this.executionContext.getLocalizationProvider().getLocalizedString("[FULL PAGE]"));
            $iframe.addClass(Editor.CommonConstants.fullPageContentEditorFrameClassName);
            // Cleanup the content render the toolbar
            var $editor = this.getElement();
            $editor.empty();
            $editor[0].appendChild(this.iframe);
            this.initialHeight = this.isFullScreen ? this.minHeight : $iframe.height();
            this.iframe.contentWindow.document.open();
            this.iframe.contentWindow.document.write(String.Format('{0}<html lang="{1}"><head></head><body tabindex="-1"><textarea style="display:none" id={2} contenteditable="true">' +
                this.getFullPageHtmlDocument().outerHTML +
                "</textarea></body></html>", FullPageContentEditor.safeDocumentDoctype, this.executionContext.getLocalizationProvider().getLanguageName(), id));
            this.iframe.contentWindow.document.close();
        };
        FullPageContentEditor.prototype.updateContent = function () {
            var _this = this;
            // Set data in the editor and update textarea.
            var contentDocument = this.getFullPageHtmlDocument();
            // Add image placeholders if needed
            $(contentDocument).find("img").each(function (index, element) {
                var image = $(element);
                image.attr(Editor.CommonConstants.designerImageSourceAttributeName, image.attr("src"));
                _this.decorateImageOverlay(image, image.attr("src"));
            });
            this.ckEditorProxy.setContent(contentDocument.outerHTML, null, function () {
                // Prevent updates right after setting the content
                _this.cancelPendingOperations();
                $(_this.innerIFrame).ready(function () {
                    $(_this.innerIFrame.contentDocument).off("keydown");
                    _this.keyboardCommandManager.registerCommandsInIframe(_this.innerIFrame);
                });
                _this.eventBroker.notify(Editor.EventConstants.fullPageEditorRendered, new Editor.FullPageEditorRenderedEventArgs(_this.elementId));
            });
        };
        FullPageContentEditor.prototype.broadcastContentChanged = function () {
            var tempResolvedDocument = Editor.CommonUtils.getNewContentDocument(this.ckEditorProxy.getContent());
            // Remove image placeholders from final content
            var images = $(tempResolvedDocument).find("img");
            var unconfiguredImages = images.filter(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.designerUnconfiguredContentOverlayCssClassName));
            unconfiguredImages.each(function (index, element) {
                var image = $(element);
                Editor.CommonUtils.removeImageOverlay(image);
            });
            images.removeAttr(Editor.CommonConstants.designerImageSourceAttributeName);
            this.mergeUpdatedNodes(tempResolvedDocument);
            this.removeFullPageSuffixFromIds(tempResolvedDocument);
            this.modifiedElementIds = [];
            this.sourceHtml = Object.isNullOrUndefined(this.documentContentModel)
                ? Editor.CommonUtils.getDocumentContent(tempResolvedDocument)
                : this.documentContentModel.extractContentFromDocument(tempResolvedDocument);
            this.eventBroker.notify(Editor.EventConstants.contentChanged, new Editor.ContentChangedEventArgs(this.sourceHtml, this.id, null, Editor.CommonConstants.fullPageEditorComponentName));
        };
        FullPageContentEditor.prototype.dispose = function () {
            var _this = this;
            this.executionContext.tryExecute(function () {
                if (!Object.isNullOrUndefined(_this.eventBroker)) {
                    _this.eventBroker.unsubscribe(Editor.EventConstants.contentModelInitialized, _this.onContentModelInitialized);
                    _this.eventBroker.unsubscribe(Editor.EventConstants.standardCkEditorInitialized, _this.onCkEditorInitialized);
                    _this.eventBroker.unsubscribe(Editor.EventConstants.contentModelUpdated, _this.onContentModelUpdated);
                    _this.eventBroker.unsubscribe(Editor.EventConstants.maximizeExecuted, _this.onMaximizeExecuted);
                    _this.eventBroker.unsubscribe(Editor.EventConstants.imageAttributeChanged, _this.onImageSourceChanged);
                    _this.onImageSourceChanged = null;
                }
                if (!Object.isNullOrUndefined(_this.keyboardCommandManager)) {
                    _this.keyboardCommandManager.unregisterCommandsInIframe(_this.innerIFrame);
                    _this.keyboardCommandManager.unregisterCommandsInIframe(_this.iframe);
                }
                _this.cancelPendingOperations();
                _this.ckEditorProxy.dispose();
                _this.documentContentModel = null;
                _this.keyboardCommandManager = null;
                _this.modifiedElementIds = null;
                _this.eventBroker = null;
                _this.elementId = null;
                $(_this.innerIFrame).off();
                $(_this.innerIFrame).remove();
                $(_this.iframe).off();
                $(_this.iframe).remove();
                _this.fullPageEditorIsLoading = false;
                _this.getElement().empty();
                if (!Object.isNullOrUndefined(_this.changeTimer)) {
                    _this.changeTimer.dispose();
                }
                if (!Object.isNullOrUndefined(_this.resizeTimer)) {
                    _this.resizeTimer.stop(true);
                    _this.resizeTimer.dispose();
                }
            }, "Dispose the full page content editor");
        };
        FullPageContentEditor.prototype.cancelPendingOperations = function () {
            // Cancel all scheduled operations
            this.changeTimer.stop(true);
        };
        FullPageContentEditor.prototype.updateImageSource = function (eventArgs) {
            if (eventArgs.attributeName === Editor.CommonConstants.designerTextBlockImageSourceAttributeName) {
                eventArgs.imageElement.attr(Editor.CommonConstants.designerImageSourceAttributeName, eventArgs.attributeValue);
                this.decorateImageOverlay(eventArgs.imageElement, eventArgs.attributeValue);
            }
        };
        FullPageContentEditor.prototype.decorateImageOverlay = function (image, imageSrc) {
            if (this.imagePlaceholderHelper.isPlaceholderNeeded(imageSrc)) {
                Editor.CommonUtils.overlayImageElement(image, this.imagePlaceholderHelper.getImagePlaceholder(imageSrc));
            }
            else {
                Editor.CommonUtils.removeImageOverlay(image);
            }
        };
        FullPageContentEditor.prototype.mergeUpdatedNodes = function (tempResolvedDocument) {
            var updatedHtml = tempResolvedDocument.documentElement.outerHTML;
            var updatedHtmlDocument = $((Editor.CommonUtils.getNewContentDocument(updatedHtml)).documentElement);
            new ArrayQuery(this.modifiedElementIds).each(function (nodeId) {
                var node = updatedHtmlDocument.find("#" + nodeId);
                var nodeInResolvedDocument = Editor.CommonUtils.getById(nodeId, $(tempResolvedDocument).contents());
                if (nodeInResolvedDocument.length) {
                    nodeInResolvedDocument.get(0).outerHTML = node.get(0) ? node.get(0).outerHTML : String.Empty;
                }
            });
        };
        FullPageContentEditor.prototype.getFullPageHtmlDocument = function () {
            var _this = this;
            var safeDocument = Editor.CommonUtils.getNewContentDocument(Editor.CommonUtils.getWithDoctype(this.sourceHtml));
            $(safeDocument).find("html").attr("lang", this.executionContext.getLocalizationProvider().getLanguageName());
            Editor.CommonUtils.walkTree($(safeDocument.documentElement), function (node) {
                var suffix = MktSvc.Controls.Common.UniqueId.generate(_this.fullPageSuffix);
                var nodeId = node.attr("id");
                if (String.isNullUndefinedOrWhitespace(nodeId)) {
                    nodeId = String.Empty;
                }
                var id = nodeId + suffix;
                node.attr("id", id);
            });
            return safeDocument.documentElement;
        };
        FullPageContentEditor.prototype.removeFullPageSuffixFromIds = function (tempResolvedDocument) {
            var _this = this;
            Editor.CommonUtils.walkTree($((tempResolvedDocument).documentElement), function (node) {
                var nodeId = node.attr("id");
                if (!String.isNullUndefinedOrWhitespace(nodeId)) {
                    var fullPageIdPosition = nodeId.indexOf(_this.fullPageSuffix, 0);
                    if (fullPageIdPosition !== -1) {
                        var originalNodeId = nodeId.substring(0, fullPageIdPosition);
                        if (String.isNullOrEmpty(originalNodeId)) {
                            node.removeAttr("id");
                        }
                        else {
                            node.attr("id", originalNodeId);
                        }
                    }
                }
            });
        };
        FullPageContentEditor.prototype.resizeEditor = function () {
            this.ckEditorProxy.resizeEditor(this.isFullScreen ? -1 : this.initialHeight);
        };
        FullPageContentEditor.prototype.getCustomCkEditorStylesElement = function () {
            return $("<style>").attr("id", Editor.DesignerContentEditorStyles.ckEditorStylesId).text(Editor.DesignerContentEditorStyles.ckEditorStyles);
        };
        FullPageContentEditor.safeDocumentDoctype = "<!DOCTYPE html>";
        return FullPageContentEditor;
    }(Editor.Control));
    Editor.FullPageContentEditor = FullPageContentEditor;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var ArrayQuery = MktSvc.Controls.Common.ArrayQuery;
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var DesignerContentEditorFactory = /** @class */ (function () {
        function DesignerContentEditorFactory() {
        }
        DesignerContentEditorFactory.prototype.create = function (plugin, executionContext, eventBroker, designerFocusManager, keyboardCommandManager, blockDefinition, accessibilityInstructions, customCkEditorConfiguration) {
            var blockProvider = new Editor.BlockProvider();
            blockDefinition = blockDefinition || new Editor.BlockDefinitionFactory().create(plugin); // tslint:disable-line
            var containerProvider = new Editor.ContainerProvider();
            var fontsProvider = new Editor.AdditionalFontsProvider(executionContext);
            var ckEditorHelper = new Editor.CkEditorProxy(executionContext, new Editor.CkEditorLocaleProvider(executionContext.getLocalizationProvider().getLocaleId(), executionContext.getLocalizationProvider().isRtl()), fontsProvider, customCkEditorConfiguration);
            var designerCkEditorProxy = new Editor.InlineCkEditorProxy(eventBroker, ckEditorHelper, plugin, executionContext, customCkEditorConfiguration);
            var blockControllers = new ArrayQuery([
                new Editor.BlockIdController(eventBroker),
                new Editor.BlockEditableController(blockProvider, eventBroker),
                new Editor.BlockDroppableController(eventBroker),
                new Editor.BlockDraggableController(eventBroker),
                new Editor.BlockInlineToolbarController(eventBroker, blockProvider, blockDefinition, designerCkEditorProxy, plugin.getCommands()),
                new Editor.BlockLoadedController(eventBroker, blockDefinition),
                new Editor.BlockClickedController(eventBroker),
                new Editor.BlockTabbableController(eventBroker, blockProvider),
                new Editor.BlockAddModeController(eventBroker, blockProvider)
            ]);
            var containerControllers = new ArrayQuery([
                new Editor.ContainerIdController(eventBroker),
                new Editor.ContainerDroppableController(eventBroker),
                new Editor.ContainerSortableController(eventBroker),
                new Editor.ContainerDragModeController(eventBroker),
                new Editor.ContainerAddModeController(eventBroker, containerProvider)
            ]);
            return new Editor.DesignerContentEditor(UniqueId.generate("designerEditorId"), blockControllers, containerControllers, blockProvider, blockDefinition, containerProvider, designerFocusManager, keyboardCommandManager, executionContext, accessibilityInstructions);
        };
        return DesignerContentEditorFactory;
    }());
    Editor.DesignerContentEditorFactory = DesignerContentEditorFactory;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var ControlToTabItemConverter = /** @class */ (function () {
        function ControlToTabItemConverter(eventBroker) {
            this.eventBroker = eventBroker;
        }
        ControlToTabItemConverter.prototype.convert = function (control, tabLabel, tabContentCssClassName, tabContentDataId) {
            var _this = this;
            return new Editor.TabControlItem(tabLabel, control.id, function () { return control.init(_this.eventBroker); }, function () { return control.activate(); }, function () { return control.deactivate(); }, function () { return control.dispose(); }, tabContentCssClassName, tabContentDataId);
        };
        return ControlToTabItemConverter;
    }());
    Editor.ControlToTabItemConverter = ControlToTabItemConverter;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    var UniqueId = MktSvc.Controls.Common.UniqueId;
    var FullPageContentEditorFactory = /** @class */ (function () {
        function FullPageContentEditorFactory() {
        }
        FullPageContentEditorFactory.prototype.create = function (plugin, executionContext, eventBroker, keyboardCommandManager, toolbarConfig, imagePlaceholderHelper, accessibilityInstructions, customCkEditorConfiguration) {
            var fontsProvider = new Editor.AdditionalFontsProvider(executionContext);
            var ckEditorHelper = new Editor.CkEditorProxy(executionContext, new Editor.CkEditorLocaleProvider(executionContext.getLocalizationProvider().getLocaleId(), executionContext.getLocalizationProvider().isRtl()), fontsProvider, customCkEditorConfiguration);
            var foreignContentCkEditorProxy = new Editor.StandardCkEditorProxy(eventBroker, ckEditorHelper, plugin, executionContext, customCkEditorConfiguration);
            return new Editor.FullPageContentEditor(UniqueId.generate("fullPageEditorId"), foreignContentCkEditorProxy, keyboardCommandManager, executionContext, toolbarConfig, imagePlaceholderHelper, accessibilityInstructions);
        };
        return FullPageContentEditorFactory;
    }());
    Editor.FullPageContentEditorFactory = FullPageContentEditorFactory;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
     * Button renderer factory
     */
    var ButtonRendererFactory = /** @class */ (function () {
        function ButtonRendererFactory() {
        }
        ButtonRendererFactory.prototype.create = function () {
            return new Editor.ButtonRenderer();
        };
        return ButtonRendererFactory;
    }());
    Editor.ButtonRendererFactory = ButtonRendererFactory;
})(Editor || (Editor = {}));
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
     * Plugin to change element border in CKEditor.
     */
    var DividerBorderStyleCombo = /** @class */ (function () {
        /**
         * Initializes a new instance of the BorderCombo class.
         */
        function DividerBorderStyleCombo(command) {
            this.command = command;
        }
        /**
         * Gets the name of the combo.
         */
        DividerBorderStyleCombo.prototype.getName = function () {
            return "dividerBorderStyleCombo";
        };
        /**
         * Gets the label used with the combo.
         */
        DividerBorderStyleCombo.prototype.getLabel = function () {
            return "[Border]";
        };
        /**
         * Gets the label used with the item group in the combo.
         */
        DividerBorderStyleCombo.prototype.getGroup = function () {
            return "[Set border]";
        };
        /**
         * Gets the command associated with the combo.
         */
        DividerBorderStyleCombo.prototype.getCommand = function () {
            return this.command;
        };
        /**
         * Gets the combo items.
         */
        DividerBorderStyleCombo.prototype.getItems = function () {
            return new Array({ value: "Solid", text: "[Solid]" }, { value: "Dotted", text: "[Dotted]" }, { value: "Dashed", text: "[Dashed]" }, { value: "Double", text: "[Double]" }, { value: "None", text: "[None]" }); // tslint:disable-line
        };
        return DividerBorderStyleCombo;
    }());
    Editor.DividerBorderStyleCombo = DividerBorderStyleCombo;
})(Editor || (Editor = {}));
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
     * Plugin to change element height in CKEditor.
     */
    var DividerHeightCombo = /** @class */ (function () {
        /**
         * Initializes a new instance of the DividerHeightCombo class.
         */
        function DividerHeightCombo(command) {
            this.numberOfItems = 20;
            this.command = command;
        }
        /**
         * Gets the name of the combo.
         */
        DividerHeightCombo.prototype.getName = function () {
            return "dividerHeightCombo";
        };
        /**
         * Gets the label used with the combo.
         */
        DividerHeightCombo.prototype.getLabel = function () {
            return "[Height]";
        };
        /**
         * Gets the label used with the item group in the combo.
         */
        DividerHeightCombo.prototype.getGroup = function () {
            return "[Set height]";
        };
        /**
         * Gets the command associated with the combo.
         */
        DividerHeightCombo.prototype.getCommand = function () {
            return this.command;
        };
        /**
         * Gets the combo items.
         */
        DividerHeightCombo.prototype.getItems = function () {
            var items = new Array(); // tslint:disable-line
            for (var i = 1; i <= this.numberOfItems; i++) {
                items.push({ value: i.toString(), text: i.toString() });
            }
            return items;
        };
        return DividerHeightCombo;
    }());
    Editor.DividerHeightCombo = DividerHeightCombo;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
     * Command to set border of the selected divider block.
     */
    var SetDividerBorderStyleCommand = /** @class */ (function () {
        function SetDividerBorderStyleCommand() {
        }
        /**
         * Gets the name of the command.
         */
        SetDividerBorderStyleCommand.prototype.getName = function () {
            return SetDividerBorderStyleCommand.getName();
        };
        /**
         * Enabled if editor is in read only mode.
         */
        SetDividerBorderStyleCommand.prototype.enabledOnReadOnly = function () {
            return true;
        };
        /**
         * Gets the name of the command.
         */
        SetDividerBorderStyleCommand.getName = function () {
            return "borderStyleCommand";
        };
        /**
         * Configure the command.
         * @param eventBroker An instance of event broker.
         */
        SetDividerBorderStyleCommand.prototype.setup = function (eventBroker) {
            this.eventBroker = eventBroker;
        };
        /**
         * Executes the command and clones the currently selected block.
         * @param selectedBlock The currently selected block.
         * @param wrappedBlock The top-wrapping element.
         * @param cleanBlock The clean block, without any wrappers.
         * @param selectedHtml The selected html, if any.
         */
        SetDividerBorderStyleCommand.prototype.exec = function (selectedBlock, wrappedBlock, selectedHtml, selectedValue) {
            if (Object.isNullOrUndefined(selectedBlock)) {
                return false;
            }
            if (Object.isNullOrUndefined(this.eventBroker)) {
                return false;
            }
            selectedBlock.find("p").css("border-bottom-style", selectedValue);
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentChanged);
            return true;
        };
        /**
        * Disposes the object - removes the html from the page, empty the  objects and detach the events
        */
        SetDividerBorderStyleCommand.prototype.dispose = function () {
        };
        /*
         * Cleans up the html elements that where added to the page
         */
        SetDividerBorderStyleCommand.prototype.cleanup = function (blockElements) {
        };
        return SetDividerBorderStyleCommand;
    }());
    Editor.SetDividerBorderStyleCommand = SetDividerBorderStyleCommand;
})(Editor || (Editor = {}));
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
     * Command to set height of the selected divider block.
     */
    var SetDividerHeightCommand = /** @class */ (function () {
        function SetDividerHeightCommand() {
        }
        /**
         * Gets the name of the command.
         */
        SetDividerHeightCommand.prototype.getName = function () {
            return SetDividerHeightCommand.getName();
        };
        /**
         * Enabled if editor is in read only mode.
         */
        SetDividerHeightCommand.prototype.enabledOnReadOnly = function () {
            return true;
        };
        /**
         * Gets the name of the command.
         */
        SetDividerHeightCommand.getName = function () {
            return "heightCommand";
        };
        /**
         * Configure the command with the event broker.
         * @param eventBroker An instance of event broker.
         */
        SetDividerHeightCommand.prototype.setup = function (eventBroker) {
            this.eventBroker = eventBroker;
        };
        /**
         * Executes the command and clones the currently selected block.
         * @param selectedBlock The currently selected block.
         * @param wrappedBlock The top-wrapping element.
         * @param cleanBlock The clean block, without any wrappers.
         * @param selectedHtml The selected html, if any.
         */
        SetDividerHeightCommand.prototype.exec = function (selectedBlock, wrappedBlock, selectedHtml, selectedValue) {
            if (Object.isNullOrUndefined(selectedBlock)) {
                return false;
            }
            if (Object.isNullOrUndefined(this.eventBroker)) {
                return false;
            }
            selectedBlock.find("p").css("border-bottom-width", selectedValue + "px");
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentChanged);
            return true;
        };
        /**
        * Disposes the object - removes the html from the page, empty the  objects and detach the events
        */
        SetDividerHeightCommand.prototype.dispose = function () {
        };
        /*
         * Cleans up the html elements that where added to the page
         */
        SetDividerHeightCommand.prototype.cleanup = function (blockElements) {
        };
        return SetDividerHeightCommand;
    }());
    Editor.SetDividerHeightCommand = SetDividerHeightCommand;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    /**
     * The toolbar class.
     */
    var InlineToolbar = /** @class */ (function () {
        /**
         * Initializes a new instance of the toolbar class.
         * @param blockId Id, that link the current block and the toolbar.
         */
        function InlineToolbar(blockId) {
            var editor = Editor.CommonUtils.getByClass(Editor.CommonConstants.designerContentEditorFrameClassName);
            this.toolbar = editor.contents().find(String.Format("#cke_{0}", blockId));
        }
        /**
         * Gets the buttons from the current toolbar by selector.
         * @param selector buttons selector.
         */
        InlineToolbar.prototype.getButton = function (buttonName) {
            return new Editor.ToolbarButton(this.getButtonElement(buttonName));
        };
        /**
         * Gets the Jquery buttons from the current toolbar by selector.
         * @param selector buttons selector.
         */
        InlineToolbar.prototype.getButtonElement = function (buttonName) {
            return this.toolbar.find(String.Format(".cke_button__{0}", buttonName.toLocaleLowerCase()));
        };
        return InlineToolbar;
    }());
    Editor.InlineToolbar = InlineToolbar;
})(Editor || (Editor = {}));
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
     * The toolbar button class.
     */
    var ToolbarButton = /** @class */ (function () {
        /**
       * Initializes a new instance of the toolbar button class.
       * @param button The button element.
       */
        function ToolbarButton(button, buttonCssOnClass, buttonCssOffClass) {
            this.buttonCssOnClass = "cke_button_on";
            this.buttonCssOffClass = "cke_button_off";
            if (!Object.isNullOrUndefined(buttonCssOnClass)) {
                this.buttonCssOnClass = buttonCssOnClass;
            }
            if (!Object.isNullOrUndefined(buttonCssOffClass)) {
                this.buttonCssOffClass = buttonCssOffClass;
            }
            this.button = button;
        }
        /**
         * Gets the current status of the button.
         */
        ToolbarButton.prototype.isSelected = function () {
            return this.button.hasClass(this.buttonCssOnClass);
        };
        /**
         * Sets active status of the button.
         */
        ToolbarButton.prototype.turnOn = function () {
            if (!this.isSelected()) {
                this.button.removeClass(this.buttonCssOffClass);
                this.button.addClass(this.buttonCssOnClass);
            }
        };
        /**
         * Sets inactive status of the button.
         */
        ToolbarButton.prototype.turnOff = function () {
            if (this.isSelected()) {
                this.button.removeClass(this.buttonCssOnClass);
                this.button.addClass(this.buttonCssOffClass);
            }
        };
        /**
        * Gets the button element.
        */
        ToolbarButton.prototype.getButton = function () {
            return this.button;
        };
        return ToolbarButton;
    }());
    Editor.ToolbarButton = ToolbarButton;
})(Editor || (Editor = {}));
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var KeyboardCommand = MktSvc.Controls.Common.KeyboardCommand;
    var KeyboardKeyCodes = MktSvc.Controls.Common.KeyboardKeyCodes;
    var KeyboardModifierType = MktSvc.Controls.Common.KeyboardModifierType;
    /**
     * Plugin to clone a block in CKEditor.
     */
    var CloneBlockButton = /** @class */ (function () {
        /**
         * Initializes a new instance of the CloneBlockButton class.
         */
        function CloneBlockButton(command) {
            this.command = command;
        }
        /**
         * Gets the name of the button.
         */
        CloneBlockButton.prototype.getName = function () {
            return "cloneBlockBtn";
        };
        /**
         * Gets the label used with the button.
         */
        CloneBlockButton.prototype.getLabel = function () {
            return "[Clone Block]";
        };
        /**
         * Get the command associated with the button
         */
        CloneBlockButton.prototype.getCommand = function () {
            return this.command;
        };
        /**
         * Gets the source of the icon base64 encoded
         */
        CloneBlockButton.prototype.getIconSrc = function () {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEQAACxEBf2RfkQAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC42/Ixj3wAAAG5JREFUOE+1jMEJwDAMAzNSl8pe3bAjuHag5YrikBD6OCOsQ8XMtmin1moDTudwLvwaswNBd0QGIhPKjoyEszIQPCOvvzrQHObhAKHDLGUGHWYpM+gwS5lBh1nKDDrMUmbQYf6UM/wzsEP3OY+VG3Syl/7fyVvFAAAAAElFTkSuQmCC";
        };
        /**
         * Gets the keyboard shortcut for the button.
         */
        CloneBlockButton.prototype.getKeyboardShortcut = function () {
            return new KeyboardCommand(KeyboardKeyCodes.cKey, [KeyboardModifierType.Alt, KeyboardModifierType.Shift]);
        };
        return CloneBlockButton;
    }());
    Editor.CloneBlockButton = CloneBlockButton;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    /**
     * Plugin to open the image gallery in CKEditor.
     */
    var ImageGalleryButton = /** @class */ (function () {
        /**
         * Initializes a new instance of the ImageGalleryButton class.
         */
        function ImageGalleryButton(command) {
            this.command = command;
        }
        /**
         * Gets the name of the button.
         */
        ImageGalleryButton.prototype.getName = function () {
            return "imgGalleryBtn";
        };
        /**
         * Gets the label used with the button.
         */
        ImageGalleryButton.prototype.getLabel = function () {
            return "[Image Gallery]";
        };
        /**
         * Get the command associated with the button
         */
        ImageGalleryButton.prototype.getCommand = function () {
            return this.command;
        };
        /**
         * Gets the source of the icon base64 encoded
         */
        ImageGalleryButton.prototype.getIconSrc = function () {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC45bDN+TgAAAVVJREFUOE+lkj1Lw1AUhoNSEMU6q6OC4CJCf4GLCFJdMiVYCPkiEBQcHQKCk3/BRd0VxE1wFHEUO4ijIFWQDgpSFOJzmhMUbFLFAw839z3veZObxPB9P/0NnuctGb1Km+OswwXcgYR84Kvr2Fdpc0y3P4rerXqEjuu6i9rKShtlAatBEKwJXD+Dqa2s+gV8L3y7UNNtVmUB3HWSc+/DA7ThJAzDeW1nVRTgOM4oA03owDkc43tlfSR4Tm3FAWgb8M7Aummag6IxuML+Bf0gSZKB3FgUIOdt8SQTKhmWZVUJuISLRqMx1BWLAjBtoctnW1DJ4PwzaPf0TlkrXbEkYAq9LQOQsN9kvYGUUE9txQFSGJcZvFaP8ARvcAbZjDZ6BkjRq0RRNM0LnLVte4TAbTT5rY/iOK7mATU5Xz/wXTFYhx2QL3SYB/wFU59kj+uWkabpP0iNT82hN14/Ux1SAAAAAElFTkSuQmCC";
        };
        /**
         * Gets the keyboard shortcut for the button.
         */
        ImageGalleryButton.prototype.getKeyboardShortcut = function () {
            return null;
        };
        return ImageGalleryButton;
    }());
    Editor.ImageGalleryButton = ImageGalleryButton;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
     * Command to clone the selected block.
     */
    var CloneBlockCommand = /** @class */ (function () {
        function CloneBlockCommand() {
        }
        /**
         * Gets the name of the command.
         */
        CloneBlockCommand.prototype.getName = function () {
            return CloneBlockCommand.getName();
        };
        /**
         * Enabled if editor is in read only mode.
         */
        CloneBlockCommand.prototype.enabledOnReadOnly = function () {
            return true;
        };
        /**
         * Gets the name of the command.
         */
        CloneBlockCommand.getName = function () {
            return "cloneElementCommand";
        };
        /**
         * Configure the command.
         * @param eventBroker An instance of event broker.
         */
        CloneBlockCommand.prototype.setup = function (eventBroker) {
            this.eventBroker = eventBroker;
        };
        /**
         * Executes the command and clones the currently selected block.
         * @param selectedBlock The currently selected block.
         * @param wrappedBlock The top-wrapping element.
         * @param cleanBlock The clean block, without any wrappers.
         * @param selectedHtml The selected html, if any.
         */
        CloneBlockCommand.prototype.exec = function (selectedBlock, wrappedBlock, selectedHtml) {
            var _this = this;
            if (Object.isNullOrUndefined(selectedBlock)) {
                return false;
            }
            if (Object.isNullOrUndefined(this.eventBroker)) {
                return false;
            }
            var eventArgs = new Editor.BlockCleanupRequestedEventArgs();
            eventArgs.block = selectedBlock.clone(false, false);
            eventArgs.onAfterBlockCleanup = function (cleanBlock) {
                cleanBlock.insertAfter(wrappedBlock);
                _this.eventBroker.notify(Editor.EventConstants.blockAdded, eventArgs);
            };
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.blockCleanupRequested, eventArgs);
            return true;
        };
        /**
        * Disposes the object - removes the html from the page, empty the  objects and detach the events
        */
        CloneBlockCommand.prototype.dispose = function () {
        };
        /*
         * Cleans up the html elements that where added to the page
         */
        CloneBlockCommand.prototype.cleanup = function (blockElements) {
        };
        return CloneBlockCommand;
    }());
    Editor.CloneBlockCommand = CloneBlockCommand;
})(Editor || (Editor = {}));
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
     * Command to open the image gallery.
     */
    var ImageGalleryCommand = /** @class */ (function () {
        function ImageGalleryCommand(imagePicker, popupRenderer) {
            this.imagePicker = imagePicker;
        }
        /**
         * Gets the name of the command.
         */
        ImageGalleryCommand.prototype.getName = function () {
            return ImageGalleryCommand.getName();
        };
        /**
         * Enabled if editor is in read only mode.
         */
        ImageGalleryCommand.prototype.enabledOnReadOnly = function () {
            return true;
        };
        /**
         * Gets the name of the command.
         */
        ImageGalleryCommand.getName = function () {
            return "imageGalleryCommand";
        };
        /**
         * Configure the command.
         * @param eventBroker An instance of event broker.
         */
        ImageGalleryCommand.prototype.setup = function (eventBroker) {
            var _this = this;
            this.eventBroker = eventBroker;
            this.imagePicker.setup(this.eventBroker);
            this.galleryImageSelectedDelegate = this.eventBroker.subscribe(MktSvcCommon.EventConstants.GalleryImageSelected, function (eventArgs) {
                if (eventArgs.sourceId === _this.imagePicker.getId()) {
                    _this.changeImageSource(eventArgs);
                }
            });
        };
        /**
         * Executes the command and opens the image gallery.
         * @param selectedBlock The currently selected block.
         * @param wrappedBlock The top-wrapping element.
         * @param cleanBlock The clean block, without any wrappers.
         * @param selectedHtml The selected html, if any.
         */
        ImageGalleryCommand.prototype.exec = function (selectedBlock, wrappedBlock, selectedHtml) {
            if (Object.isNullOrUndefined(selectedBlock)) {
                return false;
            }
            if (Object.isNullOrUndefined(this.eventBroker)) {
                return false;
            }
            this.selectedItem = selectedBlock;
            this.eventBroker.notify(Editor.EventConstants.imageGalleryCommandExecuted);
            this.imagePicker.open();
            return true;
        };
        /**
        * Disposes the object - removes the html from the page, empty the  objects and detach the events
        */
        ImageGalleryCommand.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.eventBroker)) {
                this.eventBroker.unsubscribe(MktSvcCommon.EventConstants.GalleryImageSelected, this.galleryImageSelectedDelegate);
            }
        };
        /*
         * Cleans up the html elements that where added to the page
         */
        ImageGalleryCommand.prototype.cleanup = function (blockElements) {
        };
        /**
         * Changes the image source of the selected image block to the one selected from the picker
         * @param eventArgs Arguments containing the image URL selected from the picker
         */
        ImageGalleryCommand.prototype.changeImageSource = function (eventArgs) {
            // TODO TFS#6413720 - [Technical debt] How to make sure we are not vulnerable when setting/loading image sources
            var currentImg = this.selectedItem.find("img");
            var imageInput = this.selectedItem.find(Editor.CommonUtils.getClassSelector(Editor.DetailsViewConstants.inputImageCssClass));
            if (currentImg.length > 0) {
                currentImg.attr(Editor.CommonConstants.designerImageSourceAttributeName, eventArgs.imageUrl);
                this.eventBroker.notify(Editor.EventConstants.imageAttributeChanged, new Editor.ImageAttributeChangedEventArgs(currentImg, Editor.CommonConstants.designerImageSourceAttributeName, // tslint:disable-line
                eventArgs.imageUrl, // tslint:disable-line
                null)); // tslint:disable-line
                // Close the image picker popup
                this.imagePicker.dispose();
                this.eventBroker.notify(Editor.DesignerInternalEventConstants.contentChanged);
                return;
            }
            // If we opened image picker for image field in popup
            if (imageInput.length) {
                imageInput.val(eventArgs.imageUrl);
                // Trigger focus out event to call logic with callback for input field
                imageInput.focusout();
                this.eventBroker.notify(Editor.EventConstants.imageInputChanged);
            }
            // Close the image picker popup
            this.imagePicker.dispose();
        };
        return ImageGalleryCommand;
    }());
    Editor.ImageGalleryCommand = ImageGalleryCommand;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /**
    * Editor class containing all the css styles used by the content editor.
    */
    var DesignerContentEditorStyles = /** @class */ (function () {
        function DesignerContentEditorStyles() {
        }
        /**
        * The id used for the style of content editor.
        */
        DesignerContentEditorStyles.designerStylesId = "designerStyles";
        /**
        * The id used for the style element with custom CKEditor styles.
        */
        DesignerContentEditorStyles.ckEditorStylesId = "ckEditorStyles";
        /**
        * The id used for the style element with custom CKEditor skin styles.
        */
        DesignerContentEditorStyles.ckEditorSkinStylesId = "ckEditorSkinStyles";
        /**
        * The style used for the content editor.
        */
        DesignerContentEditorStyles.designerStyles = "\n[data-editorBlockType]:hover {\n    outline: 1px solid #8CBFE5;\n    border-radius:4px;\n    cursor:default;\n}\n\n.editorAccessibilityButton {\n    width: 100%;\n    height: 100%;\n    position: relative;\n    top: 0;\n    left: 0;\n    z-index: -1;\n}\n\n.containerDragMode {\n    outline: 1px dotted #ddd;\n    min-height:5px;\n}\n\n.selectedDataContainer {\n    outline: 1px solid #8CBFE5;\n}\n\n.sort-highlight {\n    min-height: 15px !important;\n    display: inline-block !important;\n    width: 98% !important;\n    background-color: #95DCEF !important;\n    color: #000000 !important;\n    margin: 1% !important;\n    text-align: center !important;\n    cursor: pointer !important;\n}\n\n.regular-sort-highlight {\n    opacity: 0.6 !important;\n}\n\n.selected-sort-highlight {\n    border: 1px dotted grey !important;\n    opacity: 1 !important;\n}\n\n.handleWrapper {\n    position:relative;\n    width:100%;\n    margin-bottom:1px;\n}\n\n.handleWrapper .handle {\n    display:none;\n}\n\n.grab {\n    display: inline;\n    position: absolute;\n    margin-top: -10px;\n    right: 5px;\n    cursor: move;\n    font-size:22px;\n    color:#0072C6;\n    z-index:5;\n}\n\n[data-container] [contenteditable]:focus {\n    outline: 0 transparent;\n}\n\n.designer-unconfiguredcontent-overlay {\n    width:100%;\n}\n\n.unconfigured-overlay-icon {\n    width: 100%;\n    max-width: 125px;\n}\n\n.designer-content-editor-hidden {\n    display:none !important;\n}\n\n.iosScroll {\n    overflow: auto;\n    -webkit-overflow-scrolling: touch;\n}\n";
        /**
         * The custom CKEditor styles
         */
        DesignerContentEditorStyles.ckEditorStyles = "\n/* CKEditor dialog title */\n.cke_dialog_body .cke_dialog_title {\n    background-color: rgb(255,255,255);\n    border-bottom: none;\n    font-family: \"Segoe UI Regular\",\"Segoe UI\";\n    font-feature-settings: \"kern\";\n    font-kerning: normal;\n    font-size: 30px;\n    font-style: normal;\n    font-weight: 400;\n    color: #267CD7;\n    padding-bottom: 0px;\n    padding-top: 6px;\n}\n\n/* CKEditor dialog body */\n.cke_dialog_body .cke_dialog_contents_body {\n    border-bottom: none;\n}\n\n/* CKEditor dialog footer */\n.cke_dialog_contents .cke_dialog_footer {\n    background-color: rgb(255,255,255);\n    border-top: none;\n    padding-left: 10px;\n    padding-right: 10px;\n}\n\n/* CKEditor footer designer - should not be displayed */\n.cke_dialog_contents .cke_dialog_footer .cke_resizer {\n    display: none;\n}\n\n/* CKEditor footer buttons block */\ntable.cke_dialog_footer_buttons {\n    position: relative;\n    bottom: 3px;\n    margin-right: 0;\n}\n\n/* CKEditor footer buttons */\n.cke_dialog_footer_buttons a.cke_dialog_ui_button {\n    border-radius: 0px;\n    min-width: 90px;\n}\n\n/* CKEditor footer buttons text */\n.cke_dialog_footer_buttons a.cke_dialog_ui_button .cke_dialog_ui_button {\n    font-family:'Segoe UI Regular', 'Segoe UI';\n    font-size: 14px;\n    font-style: normal;\n    font-feature-settings: \"kern\";\n    font-kerning: normal;\n    font-weight: 400;\n}\n\n/* CKEditor footer OK button */\n.cke_dialog_ui_button.cke_dialog_ui_button_ok,\n.cke_dialog_ui_button.cke_dialog_ui_button_ok:hover,\n.cke_dialog_ui_button.cke_dialog_ui_button_ok:focus\n{\n    border-color: #216AB7;\n    background-color: #216AB7;\n}\n\n/* CKEditor footer Cancel button */\n.cke_dialog_ui_button.cke_dialog_ui_button_cancel,\n.cke_dialog_ui_button.cke_dialog_ui_button_cancel:hover,\n.cke_dialog_ui_button.cke_dialog_ui_button_cancel:focus\n{\n    border-color: #BBBBBB;\n    background-color: #FFFFFF;\n}\n\n/* CKEditor footer OK button text */\n.cke_dialog_ui_button.cke_dialog_ui_button_ok .cke_dialog_ui_button {\n    color: #FFFFFF;\n}\n\n/* CKEditor footer Cancel button text */\n.cke_dialog_ui_button.cke_dialog_ui_button_cancel .cke_dialog_ui_button {\n    color: rgb(80, 80, 80)\n}\n\n/* CKEditor paste iframe (for paste dialogs) */\n.cke_dialog .cke_dialog_ui_html iframe.cke_pasteframe {\n    border-radius: 0px;\n    width: 100%;\n    box-sizing: border-box;\n}\n\n/* Fix opportunity to set focus(special characters dialog) */\nspan.cke_dialog_ui_html{\n    display:block\n}\n\n/* CKEditor dialog close button */\n.cke_dialog .cke_dialog_body .cke_dialog_close_button,\n.cke_dialog .cke_dialog_body .cke_dialog_close_button:hover {\n    opacity: 1;\n    top: 22px;\n    right: 22px;\n}\n\n/* CKEditor dialog contents text, legends and labels */\n.cke_dialog_body table.cke_dialog_contents .cke_dialog_ui_html,\n.cke_dialog_page_contents .cke_dialog_ui_labeled_label,\n.cke_dialog_contents .cke_dialog_ui_fieldset legend,\n.cke_dialog_contents .cke_dialog_ui_fieldset label {\n    font-family: \"Segoe UI Regular\",\"Segoe UI\";\n    font-feature-settings: \"kern\";\n    font-kerning: normal;\n    font-size: 13px;\n    font-style: normal;\n    font-weight: 400;\n    color: rgb(80, 80, 80);\n}\n\n/* CKEditor dialog contents */\n.cke_dialog_body .cke_dialog_contents_body {\n    padding-top: 0px;\n    padding-bottom: 0px;\n}\n\n/* CKEditor dialog tabs */\n.cke_dialog_tabs .cke_dialog_tab,\n.cke_dialog_tabs .cke_dialog_tab:hover {\n    font-family: \"Segoe UI Regular\",\"Segoe UI\";\n    font-feature-settings: \"kern\";\n    font-kerning: normal;\n    font-size: 13px;\n    font-style: normal;\n    font-weight: 400;\n    border-radius: 0px;\n    color: rgb(80, 80, 80);\n}\n\n/* CKEditor dialog body buttons */\n.cke_dialog_contents_body .cke_dialog_ui_button {\n    font-family: \"Segoe UI Regular\",\"Segoe UI\";\n    font-feature-settings: \"kern\";\n    font-kerning: normal;\n    font-size: 13px;\n    font-style: normal;\n    font-weight: 400;\n    border-radius: 0px;\n    color: rgb(80, 80, 80);\n    background-color: #FFFFFF;\n}\n\n/* CKEditor dialog body inputs */\n.cke_dialog_contents_body .cke_dialog_ui_input_text {\n    font-family: \"Segoe UI Regular\",\"Segoe UI\";\n    font-feature-settings: \"kern\";\n    font-kerning: normal;\n    font-style: normal;\n    font-weight: 400;\n    border-radius: 0px;\n}\n\n/* CKEditor dialog body focused inputs */\n.cke_dialog_contents_body .cke_dialog_ui_input_text:focus {\n    border-width: 1px;\n}\n\n.cke_dialog .cke_dialog_body {\n    box-shadow: 3px 3px 5px #888888;\n}\n\n.cke_dialog .cke_dialog_body .cke_dialog_title {\n    padding: 30px 20px 20px 20px;\n}\n\n.cke_dialog .cke_dialog_body .cke_dialog_close_button {\n    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AcTDR4qLT7wGQAAAVZJREFUOMuNU0Fqw0AMHGnX4HwlLwgklxYCxYdCoJBD6e96bCA5lEKhPfWSByTPyLULtqReLHvr2KU62asZaaTZpaqq4GFmV9/M/OufiJAH448YgseCp0BT57lKIpouMEUaNmFm7roR0RcAU9W7kV1UAKzFOLlXkFKCmS3NDMz8FkK49SIhhBtVfTUzmNkypdQr8A5lWYKZn7yriHzEGOcxxrmIfGZKHsuy7NRFVUVbGWb2HGP8bprmxczQNM0pHyPG+CAiO1emqr0CDxHZFUWxcqLni6JY5WTPj94DIrrk7hARiOjy33uwruv6PLyVdV2fAaxHbeyqMd8DeHdyCGERQlhke3hvMY7vR0gpQUQO2bY3InIUkSMzbzJ3Dm4jALCqdjYCOLXkraru29mhqntm3rack9uoqqCqqrptExFSSl7sKjznWCJCHD7T2Wx29QbynJM9/wO7NtviVH40xgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wNy0xOVQxMzozMDo0MiswMjowMBiQd3gAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTYtMDctMTlUMTM6MzA6NDIrMDI6MDBpzc/EAAAAAElFTkSuQmCC');\n}\n\n.cke_dialog .cke_dialog_body .cke_dialog_contents .cke_dialog_contents_body {\n    padding: 0px 20px 30px 20px;\n}\n\n.cke_dialog .cke_dialog_body .cke_dialog_contents .cke_dialog_footer {\n    background-color: #dddddd;\n    padding: 10px 20px 10px 0px;\n}\n\n.cke_dialog .cke_dialog_body .cke_dialog_contents .cke_dialog_footer .cke_dialog_footer_buttons {\n    margin: 0px;\n    bottom: 0px;\n}\n\n.cke_float .cke_top {\n    border: 1px solid #d1d1d1;\n    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.3);\n}\n";
        /**
        * The custom CKEditor skin styles
        */
        DesignerContentEditorStyles.ckEditorSkinStyles = "\n.cke_browser_ios .cke_contents\n{\n    overflow: auto !important;\n    -webkit-overflow-scrolling: touch !important;\n}\n\n.cke_button_icon.cke_button__about_icon {\n    background: url({0}/icons.png) no-repeat 0 -0px !important;\n}\n\n.cke_button_icon.cke_button__bold_icon {\n    background: url({0}/icons.png) no-repeat 0 -24px !important;\n}\n\n.cke_button_icon.cke_button__italic_icon {\n    background: url({0}/icons.png) no-repeat 0 -48px !important;\n}\n\n.cke_button_icon.cke_button__strike_icon {\n    background: url({0}/icons.png) no-repeat 0 -72px !important;\n}\n\n.cke_button_icon.cke_button__subscript_icon {\n    background: url({0}/icons.png) no-repeat 0 -96px !important;\n}\n\n.cke_button_icon.cke_button__superscript_icon {\n    background: url({0}/icons.png) no-repeat 0 -120px !important;\n}\n\n.cke_button_icon.cke_button__underline_icon {\n    background: url({0}/icons.png) no-repeat 0 -144px !important;\n}\n\n.cke_button_icon.cke_button__bidiltr_icon {\n    background: url({0}/icons.png) no-repeat 0 -168px !important;\n}\n\n.cke_button_icon.cke_button__bidirtl_icon {\n    background: url({0}/icons.png) no-repeat 0 -192px !important;\n}\n\n.cke_button_icon.cke_button__blockquote_icon {\n    background: url({0}/icons.png) no-repeat 0 -216px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__copy_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__copy_icon {\n    background: url({0}/icons.png) no-repeat 0 -240px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__copy_icon {\n    background: url({0}/icons.png) no-repeat 0 -264px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__cut_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__cut_icon {\n    background: url({0}/icons.png) no-repeat 0 -288px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__cut_icon {\n    background: url({0}/icons.png) no-repeat 0 -312px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__paste_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__paste_icon {\n    background: url({0}/icons.png) no-repeat 0 -336px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__paste_icon {\n    background: url({0}/icons.png) no-repeat 0 -360px !important;\n}\n\n.cke_button_icon.cke_button__bgcolor_icon {\n    background: url({0}/icons.png) no-repeat 0 -384px !important;\n}\n\n.cke_button_icon.cke_button__textcolor_icon {\n    background: url({0}/icons.png) no-repeat 0 -408px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__templates_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__templates_icon {\n    background: url({0}/icons.png) no-repeat 0 -432px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__templates_icon {\n    background: url({0}/icons.png) no-repeat 0 -456px !important;\n}\n\n.cke_button_icon.cke_button__copyformatting_icon {\n    background: url({0}/icons.png) no-repeat 0 -480px !important;\n}\n\n.cke_button_icon.cke_button__creatediv_icon {\n    background: url({0}/icons.png) no-repeat 0 -504px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__find_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__find_icon {\n    background: url({0}/icons.png) no-repeat 0 -528px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__find_icon {\n    background: url({0}/icons.png) no-repeat 0 -552px !important;\n}\n\n.cke_button_icon.cke_button__replace_icon {\n    background: url({0}/icons.png) no-repeat 0 -576px !important;\n}\n\n.cke_button_icon.cke_button__flash_icon {\n    background: url({0}/icons.png) no-repeat 0 -600px !important;\n}\n\n.cke_button_icon.cke_button__button_icon {\n    background: url({0}/icons.png) no-repeat 0 -624px !important;\n}\n\n.cke_button_icon.cke_button__checkbox_icon {\n    background: url({0}/icons.png) no-repeat 0 -648px !important;\n}\n\n.cke_button_icon.cke_button__form_icon {\n    background: url({0}/icons.png) no-repeat 0 -672px !important;\n}\n\n.cke_button_icon.cke_button__hiddenfield_icon {\n    background: url({0}/icons.png) no-repeat 0 -696px !important;\n}\n\n.cke_button_icon.cke_button__imagebutton_icon {\n    background: url({0}/icons.png) no-repeat 0 -720px !important;\n}\n\n.cke_button_icon.cke_button__radio_icon {\n    background: url({0}/icons.png) no-repeat 0 -744px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__select_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__select_icon {\n    background: url({0}/icons.png) no-repeat 0 -768px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__select_icon {\n    background: url({0}/icons.png) no-repeat 0 -792px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__textarea_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__textarea_icon {\n    background: url({0}/icons.png) no-repeat 0 -816px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__textarea_icon {\n    background: url({0}/icons.png) no-repeat 0 -840px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__textfield_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__textfield_icon {\n    background: url({0}/icons.png) no-repeat 0 -864px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__textfield_icon {\n    background: url({0}/icons.png) no-repeat 0 -888px !important;\n}\n\n.cke_button_icon.cke_button__horizontalrule_icon {\n    background: url({0}/icons.png) no-repeat 0 -912px !important;\n}\n\n.cke_button_icon.cke_button__iframe_icon {\n    background: url({0}/icons.png) no-repeat 0 -936px !important;\n}\n\n.cke_button_icon.cke_button__image_icon {\n    background: url({0}/icons.png) no-repeat 0 -960px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__indent_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__indent_icon {\n    background: url({0}/icons.png) no-repeat 0 -984px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__indent_icon {\n    background: url({0}/icons.png) no-repeat 0 -1008px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__outdent_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__outdent_icon {\n    background: url({0}/icons.png) no-repeat 0 -1032px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__outdent_icon {\n    background: url({0}/icons.png) no-repeat 0 -1056px !important;\n}\n\n.cke_button_icon.cke_button__smiley_icon {\n    background: url({0}/icons.png) no-repeat 0 -1080px !important;\n}\n\n.cke_button_icon.cke_button__justifyblock_icon {\n    background: url({0}/icons.png) no-repeat 0 -1104px !important;\n}\n\n.cke_button_icon.cke_button__justifycenter_icon {\n    background: url({0}/icons.png) no-repeat 0 -1128px !important;\n}\n\n.cke_button_icon.cke_button__justifyleft_icon {\n    background: url({0}/icons.png) no-repeat 0 -1152px !important;\n}\n\n.cke_button_icon.cke_button__justifyright_icon {\n    background: url({0}/icons.png) no-repeat 0 -1176px !important;\n}\n\n.cke_button_icon.cke_button__language_icon {\n    background: url({0}/icons.png) no-repeat 0 -1200px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__anchor_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__anchor_icon {\n    background: url({0}/icons.png) no-repeat 0 -1224px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__anchor_icon {\n    background: url({0}/icons.png) no-repeat 0 -1248px !important;\n}\n\n.cke_button_icon.cke_button__link_icon {\n    background: url({0}/icons.png) no-repeat 0 -1272px !important;\n}\n\n.cke_button_icon.cke_button__unlink_icon {\n    background: url({0}/icons.png) no-repeat 0 -1296px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__bulletedlist_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__bulletedlist_icon {\n    background: url({0}/icons.png) no-repeat 0 -1320px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__bulletedlist_icon {\n    background: url({0}/icons.png) no-repeat 0 -1344px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__numberedlist_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__numberedlist_icon {\n    background: url({0}/icons.png) no-repeat 0 -1368px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__numberedlist_icon {\n    background: url({0}/icons.png) no-repeat 0 -1392px !important;\n}\n\n.cke_button_icon.cke_button__maximize_icon {\n    background: url({0}/icons.png) no-repeat 0 -1416px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__newpage_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__newpage_icon {\n    background: url({0}/icons.png) no-repeat 0 -1440px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__newpage_icon {\n    background: url({0}/icons.png) no-repeat 0 -1464px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__pagebreak_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__pagebreak_icon {\n    background: url({0}/icons.png) no-repeat 0 -1488px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__pagebreak_icon {\n    background: url({0}/icons.png) no-repeat 0 -1512px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__pastetext_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__pastetext_icon {\n    background: url({0}/icons.png) no-repeat 0 -1536px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__pastetext_icon {\n    background: url({0}/icons.png) no-repeat 0 -1560px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__pastefromword_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__pastefromword_icon {\n    background: url({0}/icons.png) no-repeat 0 -1584px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__pastefromword_icon {\n    background: url({0}/icons.png) no-repeat 0 -1608px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__preview_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__preview_icon {\n    background: url({0}/icons.png) no-repeat 0 -1632px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__preview_icon {\n    background: url({0}/icons.png) no-repeat 0 -1656px !important;\n}\n\n.cke_button_icon.cke_button__print_icon {\n    background: url({0}/icons.png) no-repeat 0 -1680px !important;\n}\n\n.cke_button_icon.cke_button__removeformat_icon {\n    background: url({0}/icons.png) no-repeat 0 -1704px !important;\n}\n\n.cke_button_icon.cke_button__save_icon {\n    background: url({0}/icons.png) no-repeat 0 -1728px !important;\n}\n\n.cke_button_icon.cke_button__selectall_icon {\n    background: url({0}/icons.png) no-repeat 0 -1752px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__showblocks_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__showblocks_icon {\n    background: url({0}/icons.png) no-repeat 0 -1776px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__showblocks_icon {\n    background: url({0}/icons.png) no-repeat 0 -1800px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__source_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__source_icon {\n    background: url({0}/icons.png) no-repeat 0 -1824px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__source_icon {\n    background: url({0}/icons.png) no-repeat 0 -1848px !important;\n}\n\n.cke_button_icon.cke_button__specialchar_icon {\n    background: url({0}/icons.png) no-repeat 0 -1872px !important;\n}\n\n.cke_button_icon.cke_button__scayt_icon {\n    background: url({0}/icons.png) no-repeat 0 -1896px !important;\n}\n\n.cke_button_icon.cke_button__table_icon {\n    background: url({0}/icons.png) no-repeat 0 -1920px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__redo_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__redo_icon {\n    background: url({0}/icons.png) no-repeat 0 -1944px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__redo_icon {\n    background: url({0}/icons.png) no-repeat 0 -1968px !important;\n}\n\n.cke_rtl .cke_button_icon.cke_button__undo_icon,\n.cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__undo_icon {\n    background: url({0}/icons.png) no-repeat 0 -1992px !important;\n}\n\n.cke_ltr .cke_button_icon.cke_button__undo_icon {\n    background: url({0}/icons.png) no-repeat 0 -2016px !important;\n}\n\n.cke_button_icon.cke_button__spellchecker_icon {\n    background: url({0}/icons.png) no-repeat 0 -2040px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__about_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -0px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__bold_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -24px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__italic_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -48px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__strike_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -72px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__subscript_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -96px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__superscript_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -120px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__underline_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -144px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__bidiltr_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -168px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__bidirtl_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -192px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__blockquote_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -216px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__copy_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__copy_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -240px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__copy_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__copy_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -264px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__cut_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__cut_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -288px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__cut_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__cut_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -312px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__paste_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__paste_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -336px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__paste_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__paste_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -360px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__bgcolor_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -384px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__textcolor_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -408px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__templates_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__templates_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -432px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__templates_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__templates_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -456px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__copyformatting_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -480px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__creatediv_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -504px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__find_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__find_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -528px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__find_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__find_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -552px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__replace_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -576px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__flash_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -600px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__button_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -624px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__checkbox_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -648px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__form_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -672px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__hiddenfield_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -696px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__imagebutton_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -720px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__radio_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -744px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__select_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__select_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -768px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__select_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__select_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -792px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__textarea_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__textarea_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -816px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__textarea_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__textarea_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -840px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__textfield_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__textfield_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -864px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__textfield_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__textfield_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -888px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__horizontalrule_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -912px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__iframe_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -936px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__image_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -960px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__indent_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__indent_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -984px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__indent_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__indent_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1008px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__outdent_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__outdent_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1032px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__outdent_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__outdent_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1056px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__smiley_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1080px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__justifyblock_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1104px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__justifycenter_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1128px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__justifyleft_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1152px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__justifyright_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1176px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__language_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1200px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__anchor_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__anchor_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1224px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__anchor_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__anchor_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1248px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__link_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1272px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__unlink_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1296px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__bulletedlist_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__bulletedlist_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1320px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__bulletedlist_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__bulletedlist_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1344px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__numberedlist_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__numberedlist_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1368px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__numberedlist_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__numberedlist_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1392px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__maximize_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1416px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__newpage_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__newpage_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1440px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__newpage_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__newpage_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1464px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__pagebreak_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__pagebreak_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1488px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__pagebreak_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__pagebreak_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1512px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__pastetext_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__pastetext_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1536px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__pastetext_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__pastetext_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1560px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__pastefromword_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__pastefromword_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1584px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__pastefromword_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__pastefromword_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1608px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__preview_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__preview_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1632px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__preview_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__preview_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1656px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__print_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1680px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__removeformat_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1704px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__save_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1728px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__selectall_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1752px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__showblocks_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__showblocks_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1776px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__showblocks_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__showblocks_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1800px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__source_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__source_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1824px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__source_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__source_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1848px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__specialchar_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1872px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__scayt_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1896px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__table_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1920px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__redo_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__redo_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1944px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__redo_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__redo_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1968px !important;\n    background-size: 16px !important;\n}\n\n.cke_rtl.cke_hidpi .cke_button_icon.cke_button__undo_icon,\n.cke_hidpi .cke_mixed_dir_content .cke_rtl .cke_button_icon.cke_button__undo_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -1992px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_ltr .cke_button_icon.cke_button__undo_icon,\n.cke_ltr.cke_hidpi .cke_button_icon.cke_button__undo_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -2016px !important;\n    background-size: 16px !important;\n}\n\n.cke_hidpi .cke_button_icon.cke_button__spellchecker_icon {\n    background: url({0}/icons_hidpi.png) no-repeat 0 -2040px !important;\n    background-size: 16px !important;\n}\n\n.cke_button_on:focus {\n    outline: 1px solid lightgrey;\n}\n\n.cke_dialog_close_button:focus {\n    outline: #3961C6 1px solid !important;\n}\n";
        return DesignerContentEditorStyles;
    }());
    Editor.DesignerContentEditorStyles = DesignerContentEditorStyles;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BlockClickedEventArgs = /** @class */ (function (_super) {
        __extends(BlockClickedEventArgs, _super);
        function BlockClickedEventArgs() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return BlockClickedEventArgs;
    }(Editor.EventArgs));
    Editor.BlockClickedEventArgs = BlockClickedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BlockLoadedEventArgs = /** @class */ (function (_super) {
        __extends(BlockLoadedEventArgs, _super);
        function BlockLoadedEventArgs(block, sourceId) {
            var _this = _super.call(this, sourceId) || this;
            _this.block = block;
            return _this;
        }
        return BlockLoadedEventArgs;
    }(Editor.EventArgs));
    Editor.BlockLoadedEventArgs = BlockLoadedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var DesignerInternalContentChangedEventArgs = /** @class */ (function (_super) {
        __extends(DesignerInternalContentChangedEventArgs, _super);
        function DesignerInternalContentChangedEventArgs(sourceId) {
            return _super.call(this, sourceId) || this;
        }
        return DesignerInternalContentChangedEventArgs;
    }(Editor.EventArgs));
    Editor.DesignerInternalContentChangedEventArgs = DesignerInternalContentChangedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BlockDeletedEventArgs = /** @class */ (function (_super) {
        __extends(BlockDeletedEventArgs, _super);
        function BlockDeletedEventArgs() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return BlockDeletedEventArgs;
    }(Editor.EventArgs));
    Editor.BlockDeletedEventArgs = BlockDeletedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var ContentBlockAttributeChangedEventArgs = /** @class */ (function (_super) {
        __extends(ContentBlockAttributeChangedEventArgs, _super);
        function ContentBlockAttributeChangedEventArgs(contentBlockElement, finalizedHtml, entityId, entityName) {
            var _this = _super.call(this) || this;
            _this.contentBlockElement = contentBlockElement;
            _this.finalizedHtml = finalizedHtml;
            _this.entityId = entityId;
            _this.entityName = entityName;
            return _this;
        }
        return ContentBlockAttributeChangedEventArgs;
    }(Editor.EventArgs));
    Editor.ContentBlockAttributeChangedEventArgs = ContentBlockAttributeChangedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var MonacoEditorCreatedEventArgs = /** @class */ (function (_super) {
        __extends(MonacoEditorCreatedEventArgs, _super);
        function MonacoEditorCreatedEventArgs(editor) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            return _this;
        }
        return MonacoEditorCreatedEventArgs;
    }(Editor.EventArgs));
    Editor.MonacoEditorCreatedEventArgs = MonacoEditorCreatedEventArgs;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var HtmlContentEditorInternalEventConstants = /** @class */ (function () {
        function HtmlContentEditorInternalEventConstants() {
        }
        HtmlContentEditorInternalEventConstants.monacoEditorCreated = "htmlContentEditor.monacoEditorCreated";
        HtmlContentEditorInternalEventConstants.monacoEditorValueSet = "monacoEditorValueUpdated";
        return HtmlContentEditorInternalEventConstants;
    }());
    Editor.HtmlContentEditorInternalEventConstants = HtmlContentEditorInternalEventConstants;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var BrowserPreviewConstants = /** @class */ (function () {
        function BrowserPreviewConstants() {
        }
        BrowserPreviewConstants.desktopTitle = "[Desktop]";
        BrowserPreviewConstants.tabletTitle = "[Tablet]";
        BrowserPreviewConstants.mobileTitle = "[Mobile]";
        BrowserPreviewConstants.desktopPreviewCssClass = "desktopPreview";
        BrowserPreviewConstants.tabletPortraitPreviewCssClass = "tabletPortraitPreview";
        BrowserPreviewConstants.tabletLandscapePreviewCssClass = "tabletLandscapePreview";
        BrowserPreviewConstants.mobilePortraitPreviewCssClass = "mobilePortraitPreview";
        BrowserPreviewConstants.mobileLandscapePreviewCssClass = "mobileLandscapePreview";
        BrowserPreviewConstants.desktopPreviewIconCssClass = "desktopPreviewIcon";
        BrowserPreviewConstants.tabletPortraitPreviewIconCssClass = "tabletPortraitPreviewIcon";
        BrowserPreviewConstants.tabletLandscapePreviewIconCssClass = "tabletLandscapePreviewIcon";
        BrowserPreviewConstants.mobilePortraitPreviewIconCssClass = "mobilePortraitPreviewIcon";
        BrowserPreviewConstants.mobileLandscapePreviewIconCssClass = "mobileLandscapePreviewIcon";
        BrowserPreviewConstants.desktopPreviewIconAltText = "[Desktop Preview]";
        BrowserPreviewConstants.tabletPortraitPreviewIconAltText = "[Tablet Portrait Preview]";
        BrowserPreviewConstants.tabletLandscapePreviewIconAltText = "[Tablet Landscape Preview]";
        BrowserPreviewConstants.mobilePortraitPreviewIconAltText = "[Mobile Portrait Preview]";
        BrowserPreviewConstants.mobileLandscapePreviewIconAltText = "[Mobile Landscape Preview]";
        BrowserPreviewConstants.desktopPreviewIconTitle = "[Desktop Preview]";
        BrowserPreviewConstants.tabletPortraitPreviewIconTitle = "[Tablet Portrait Preview]";
        BrowserPreviewConstants.tabletLandscapePreviewIconTitle = "[Tablet Landscape Preview]";
        BrowserPreviewConstants.mobilePortraitPreviewIconTitle = "[Mobile Portrait Preview]";
        BrowserPreviewConstants.mobileLandscapePreviewIconTitle = "[Mobile Landscape Preview]";
        BrowserPreviewConstants.browserPreviewContentTitle = "[User or external content rendered below]";
        BrowserPreviewConstants.browserPreviewLinkWarning = "[External links below]";
        BrowserPreviewConstants.browserPreviewContentTitleCssClass = "browserPreviewContentTitle";
        BrowserPreviewConstants.browserPreviewContentTitleWarningCssClass = "browserPreviewContentTitleWarning";
        BrowserPreviewConstants.browserPreviewContentCssClass = "browserPreviewContent";
        BrowserPreviewConstants.desktopTitleCssClass = "desktopTitle";
        BrowserPreviewConstants.tabletTitleCssClass = "tabletTitle";
        BrowserPreviewConstants.mobileTitleCssClass = "mobileTitle";
        BrowserPreviewConstants.activeCssClass = "active";
        BrowserPreviewConstants.browserPreviewFrameClassName = "browserPreviewFrame";
        BrowserPreviewConstants.browserPreviewFrameContainerCssClass = "browserPreviewFrameContainer";
        BrowserPreviewConstants.browserPreviewFrameBorderClassName = "browserPreviewFrameBorder";
        BrowserPreviewConstants.editorMode = "editorMode";
        BrowserPreviewConstants.lightweightMode = "lightweightMode";
        BrowserPreviewConstants.headerCssClass = "browserPreviewHeader";
        BrowserPreviewConstants.headerIconButtonsContainerCssClass = "browserPreviewHeaderIconButtonsGroup";
        BrowserPreviewConstants.headerIconCssClass = "browserPreviewIcon";
        BrowserPreviewConstants.headerTitleCssClass = "browserPreviewTitle";
        BrowserPreviewConstants.headerDividerCssClass = "browserPreviewDivider";
        BrowserPreviewConstants.previewButtonContainerCssClass = "previewButtonContainer";
        BrowserPreviewConstants.desktopIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAkCAYAAAApbHJOAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNy8wOS8xNLgEYzwAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAACI0lEQVRYhe3Zv2sUQRQH8M+ciQR/IGpvZyFopYWCYpqAdRCrFBamsLCSiJVdChvRwkZL7bRKY5FKK8kfkEIQBAsVBBWSkHgxYzG73N7dnh65S+4W9guP2dl5N/P97sy8g/dCjFEnQghwCcs4jCZCl+P+I2ISm7iGt2X8Gz1+fAS3JEEx8wtjYA3sYAq3cbSM/EQPUQ2cyJ4/YiWbaJS7FbGB8ziDkzhQ5thLFGxn7VKM8e5Q6Q2AEMKiJKop7VoXeh2/4tjUkHkNismsza9EF/4lKsc4BIgi/su5H1GVQy2qKqhFVQW1qKqgFlUV1KKqglpUVVCLqgpqUVVBLaoq6CUqamVqfu0Tl37xM2tLM0n0TpFtYT17vhhCmDceeb9NXMn661m/xDPGLsMpfM4milIOcGcMbLvA6QtOl/EPnbnoEMIU3mA6e/VOOqaTRo8m/uBq1n+PmRjjWtGpTNQLzElfYwEv86G9ZNsncrKzeCpxehVjvNHu1X7sFrXSuQ9xsGx7R21SLHgg7do2HreNFxznpAT8bzwbNfE+xT2Rgtom5tvuVAhhGktSaaSJVXyXSjm7OSINHMPzGOOjTocQwn3cxI9dzJ9jA8dxVrrva5iNMS7DDD5oRZU8ygwaqSK+4h7O4ULWLuBbYa1Bo2G+VsQnXIfX0tmMe2A7Wv95uW11EBn2eisTUkUu4nK26LCiXNSq/uVll+Lu5OPDWuuQVBy88xeWMBjDkBnq5QAAAABJRU5ErkJggg==";
        BrowserPreviewConstants.tabletPortraitIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAfCAYAAAASsGZ+AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNy8wOS8xNLgEYzwAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAABDUlEQVRIie3WO0sDQRQF4G+SID4qSSfpbFL5jy3FH6CNraBolZSCtmJhZ6XkMRaZXceQwK5ZlCweuMzu2bn3zLkDy4U+7hAxaTAiRhjARUY2HVOMAp5xhDeMLRD8HIXACQ4L8jGR1xBj3KD+Ij/VuEp1Jz1fp+4WApsKJXTSGjoZGUL49t6UiCaLLqNsx9aLlNh6kf921UJ72vUrTso/+dY7ac/Ft0fk7+5kFmOcN1h7Wjz0MnIvhDC0sLnOYUAXM1k7ljBPcZAnPeE4ffhI3Kq5K2IX79m6bl/ETnagcu6qEucY4rRGzqSD/TW2V+E2xviAmxo5PbhUfRZ+xRleKu6fSqNvH/c17NeJMQafukOvoGFlOPUAAAAASUVORK5CYII=";
        BrowserPreviewConstants.tabletLandscapeIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAZCAYAAADJ9/UkAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNy8wOS8xNLgEYzwAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAABCklEQVRIie3WO04DMRSF4e8mFDxKamjYABIboGMJlBQshA2wBrITJBoQNKBsghIJiYfIJKYYCyaTQRRMXKBc6WjG9tX8tuW5PrCDeyRUmC5RVeaMsQsPjc5SqjCO3IAn3GGQlRpjfnhPiI7cZk6FLRxi2MoxyYlXkFLqXdjDS3sHBo1JRNYyYtj17TZ8WTH4DV48VvB/D0+tZzF4YAMXOMVjSfgQ7zhPKY1wCWuF4FOs4ywirnFUEp7whuMslD1wqwq3gs+d9q/KE9Hf7ZrNxMyi01n41SKDe9uRiJj5tmXzY43OZ7Wr7HQdf4ipurTu61jUDT6Uda8T3Aa2McIBXntedTsSNtV2/eQTkdzLYNJlu7AAAAAASUVORK5CYII=";
        BrowserPreviewConstants.mobilePortraitIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAZCAYAAADuWXTMAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNy8wOS8xNLgEYzwAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAA7ElEQVQ4je3UPUoEQRAF4K/Hdf030dBQT6AH8k7G3mAjT2CyiCsihouGpoKIoMz+tMH2QDPMjJMKW1DQVfXe66KhH5zgCRGzHhlxhyN4xjw1++YMNyEV8IFHhJT1WKLAOQ7xJlO7jTHqyhSThJ8WmfKg4bZ6FNhI55CTm1atxyDHFR3AXmusyWvyPyDP/wLHGEssqjr/hjshhLNMNKR55TILbGKrIuROskSZiW3jC/v4SbiAYRJ/od2nrnCK65b5tOvBxjHGV9y3zPfgQbN7vmNkZYz1WYlRwHFa7QLf2TsMcYBPK6ut+rsY4/IXtTt0+9qSD30AAAAASUVORK5CYII=";
        BrowserPreviewConstants.mobileLandscapeIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAPCAYAAAARZmTlAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNy8wOS8xNLgEYzwAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAA90lEQVQ4jbXUPU4DMRAF4G9CUBRBCR0tUEAFN+AgtLSciAsgCk4ABUWQEKKkoaeMQKLJElOso7XCNuwuT5pixj/P73nswA6ucIIvhP5I2MIjzmGGRR4YOha4iZzAB16x0VHNNyY4xqiovytU3KWUZILNv0Zee6i2vFTzNi4YlxERqZ696KAEKo0zK0Qpa6Q/SqtXZGmIjUsEpupuvcBcbWdzJ4iUkq6BI3xiP+fXmI9/naUfKmzjMiIecJZJB1VyoKW7yjtZ74ouWLbUorSrfiQRfb6VtrVpjBXRKe5z3oWoUnfWZK0+hWfNIxo6KtzCHl7+ieQJuz95n93WFSrOpgAAAABJRU5ErkJggg==";
        BrowserPreviewConstants.ariaSelected = "Selected.";
        BrowserPreviewConstants.ariaNotSelected = "Not selected.";
        BrowserPreviewConstants.ariaOptionToActivate = "Press enter or space to activate.";
        return BrowserPreviewConstants;
    }());
    Editor.BrowserPreviewConstants = BrowserPreviewConstants;
})(Editor || (Editor = {}));
/// <reference path="../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /**
    * Additional Fonts Styles View Property contract
    */
    var AdditionalFontsContract = /** @class */ (function () {
        function AdditionalFontsContract() {
        }
        AdditionalFontsContract.entryName = "additional-fonts";
        AdditionalFontsContract.entryDataType = Editor.Contract.styleMetadataFontDataType;
        return AdditionalFontsContract;
    }());
    Editor.AdditionalFontsContract = AdditionalFontsContract;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var ArrayQuery = MktSvc.Controls.Common.ArrayQuery;
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    /**
    * Provides the array of the CKEditor-compatible strings which contain font specifications taken from the HTML content inside iframe
    */
    var AdditionalFontsProvider = /** @class */ (function () {
        function AdditionalFontsProvider(executionContext) {
            this.executionContext = executionContext;
        }
        AdditionalFontsProvider.prototype.getAdditionalFontsString = function (metaEntries) {
            var _this = this;
            var fonts = new ArrayQuery([]);
            this.executionContext.tryExecute(function () {
                fonts = metaEntries
                    .where(function (entry) { return entry.name === Editor.AdditionalFontsContract.entryName &&
                    entry.dataType.toLowerCase() === Editor.AdditionalFontsContract.entryDataType.toLowerCase() &&
                    !Object.isNullOrUndefined(entry.value); })
                    .select(function (entry) { return _this.sanitizeUserFontDataString(entry.value); })
                    .where(function (fontSpecString) { return !String.isNullOrWhitespace(fontSpecString); });
            }, "Get additional fonts");
            return fonts;
        };
        /**
         * Extracts and sanitizes editor font specifications from the string
         */
        AdditionalFontsProvider.prototype.sanitizeUserFontDataString = function (fontData) {
            var _this = this;
            return fontData.split(";") // splitting the font data string into the separate font declarations.
                .map(function (fontSpecAsString) {
                var separatedDisplayNameAndFontList = fontSpecAsString.split("/").map(function (s) { return s.trim(); }).filter(function (s) { return s !== ""; });
                var displayName;
                var fontsList;
                switch (separatedDisplayNameAndFontList.length) {
                    case 0:
                        // Font specification contains no meaningful symbols, skipping
                        return null;
                    case 1:
                        // display name is not specified
                        fontsList = _this.getFilteredFontNamesList(separatedDisplayNameAndFontList[0]);
                        displayName = null;
                        break;
                    case 2:// tslint:disable-line
                        // display name is specified
                        displayName = separatedDisplayNameAndFontList[0];
                        fontsList = _this.getFilteredFontNamesList(separatedDisplayNameAndFontList[1]);
                        break;
                    default:
                        // Multiple /-es between meaningful symbols are invalid, skipping
                        return null;
                }
                if (fontsList.length > 0) {
                    var fontsListString = fontsList.join(", ");
                    if (Object.isNullOrUndefined(displayName)) {
                        // If display name was not specifies, then the whole font list should be used as display name (to be consistent with CKEditor)
                        displayName = fontsListString;
                    }
                    return displayName + "/" + fontsListString;
                }
                else {
                    // Fonts list is empty or contains only commas, skipping
                    return null;
                }
            }).filter(function (sanitizedFontSpecAsString) { return !Object.isNullOrUndefined(sanitizedFontSpecAsString); }).join(";").trim();
        };
        /**
         * Parses the string with comma-separated list of font names (primary font and fallback fonts) and returns them as array.
         */
        AdditionalFontsProvider.prototype.getFilteredFontNamesList = function (fontListAsString) {
            return fontListAsString.split(",")
                .map(function (fontName) { return fontName.trim(); })
                .filter(function (fontName) { return fontName !== ""; });
        };
        return AdditionalFontsProvider;
    }());
    Editor.AdditionalFontsProvider = AdditionalFontsProvider;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var ArrayQuery = MktSvc.Controls.Common.ArrayQuery;
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var MetadataParser = /** @class */ (function () {
        function MetadataParser(executionContext) {
            this.executionContext = executionContext;
        }
        MetadataParser.prototype.getValue = function (name, document) {
            var _this = this;
            var value = null;
            this.executionContext.tryExecute(function () {
                var metaEntries = _this.getStyleMetaEntries(document);
                var metaEntry = metaEntries.firstOrDefault(function (item) {
                    return item.name === name;
                });
                if (!Object.isNullOrUndefined(metaEntry) && !String.isNullOrEmpty(metaEntry.value)) {
                    value = metaEntry.value;
                }
            }, "Get metadata value");
            return value;
        };
        MetadataParser.prototype.getStyleMetaEntries = function (document) {
            var _this = this;
            var metaStyles = new ArrayQuery([]);
            Editor.CommonUtils.getBySelector("meta[type=\"" + Editor.Contract.styleMetadataTypeAttr + "\"]", $(document).contents()).each(function (index, meta) {
                var variableName = $(meta).attr(Editor.Contract.metadataNameAttr);
                var variableValue = $(meta).attr(Editor.Contract.metadataValueAttr);
                var variableType = $(meta).attr(Editor.Contract.metadataDatatypeAttr);
                var variableLabel = $(meta).attr(Editor.Contract.metadataLabelAttr);
                var variableFormat = $(meta).attr(Editor.Contract.metadataFormatAttr);
                var variableGroup = $(meta).attr(Editor.Contract.metadataGroupAttr);
                metaStyles.add(new Editor.MetaStyle(variableValue, variableName, variableLabel, variableType, _this.isReferencedInDocument($(document), variableName, variableFormat), variableFormat, variableGroup));
            });
            return metaStyles;
        };
        MetadataParser.prototype.updateStyleMetaValue = function (contentDocument, metaStyle, newValue) {
            var _this = this;
            this.executionContext.tryExecute(function () {
                metaStyle.value = newValue;
                var $document = $(contentDocument);
                Editor.CommonUtils.getBySelector("meta[name=\"" + metaStyle.name + "\"]", $document.contents()).attr("value", newValue);
                // regex for: /* @VariableName */ variable value /* @VariableName */
                // for example: /* @outer-background-color */ red /* @outer-background-color */
                var formattedValue = Object.isNullOrUndefined(metaStyle.format) ||
                    String.isNullOrWhitespace(metaStyle.format)
                    ? newValue
                    : String.Format(metaStyle.format, newValue);
                var newStyle = "/* @" + metaStyle.name + " */ " + formattedValue + " /* @" + metaStyle.name + " */";
                $document.contents().find("style").contents().each(function (index, domElem) {
                    if (domElem && domElem.textContent) {
                        domElem.textContent = String.Replace(domElem.textContent, _this.getMatchExpression(metaStyle.name), newStyle);
                    }
                });
                _this.getReferencesInElements($document, metaStyle.name).each(function (mr) {
                    // Replace existing attribute value to support values like this /*@VariableName*/?someparameter=1
                    var value = mr.attributeValue.match(_this.getInlineMatchExpression(metaStyle.name))
                        ? String.Replace(mr.attributeValue, _this.getInlineMatchExpression(metaStyle.name), formattedValue)
                        : formattedValue;
                    mr.element.attr(mr.attributeName, value);
                });
            }, "Update style meta value");
        };
        /**
         * Style variable is referenced in case it occurs in the CSS or in the HTML reference attributes.
         * @param iframe The iframe.
         * @param metaStyle The style.
         */
        MetadataParser.prototype.isReferencedInDocument = function (iframe, styleName, styleFormat) {
            var _this = this;
            var metaInStyles = false;
            var styleContents = iframe.contents().find("style").contents();
            styleContents.each(function (index, domElem) {
                if (domElem && domElem.textContent && domElem.textContent.match(_this.getMatchExpression(styleName))) {
                    metaInStyles = true;
                    // Stop the loop
                    return false;
                }
                // Continue execution
                return true;
            });
            return metaInStyles || this.getReferencesInElements(iframe, styleName).count() > 0;
        };
        /**
         * Returns the expression to match a style/variable in the styles.
         * @param metaStyle The style/variable
         */
        MetadataParser.prototype.getMatchExpression = function (styleName) {
            return "/\\*([\\s])*@" + styleName + "([\\s])*\\*/[^;]*/\\*([\\s])*@" + styleName + "([\\s])*\\*/";
        };
        /**
         * Returns the expression to match a style/variable in the document.
         * @param metaStyle The style/variable
         */
        MetadataParser.prototype.getInlineMatchExpression = function (styleName) {
            return "/\\*([\\s])*@" + styleName + "([\\s])*\\*\\/";
        };
        /**
         * Returns all elements that reference a style/variable.
         * @param iframe The iframe.
         * @param metaStyle The style
         */
        MetadataParser.prototype.getReferencesInElements = function (iframe, styleName) {
            var _this = this;
            var references = new ArrayQuery([]);
            Editor.CommonUtils.getBySelector("*[property-reference*=" + styleName + "]", iframe.contents().children()).each(function (i, e) {
                var propertyReferences = $(e).attr("property-reference").split(";");
                propertyReferences.forEach(function (value) {
                    var attributeName = value.split(":")[0];
                    var attributeValue = value.split(":")[1];
                    if (!String.isNullOrWhitespace(attributeValue) &&
                        (attributeValue.trim() === "@" + styleName.trim() || attributeValue.trim().match(_this.getInlineMatchExpression(styleName)))) {
                        references.add(new Editor.MetaStyleReference(attributeName.trim(), attributeValue.trim(), $(e)));
                    }
                });
            });
            return references;
        };
        return MetadataParser;
    }());
    Editor.MetadataParser = MetadataParser;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var MetaStyleReference = /** @class */ (function () {
        function MetaStyleReference(attributeName, attributeValue, element) {
            this.attributeName = attributeName;
            this.attributeValue = attributeValue;
            this.element = element;
        }
        return MetaStyleReference;
    }());
    Editor.MetaStyleReference = MetaStyleReference;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    var MetaStyle = /** @class */ (function () {
        function MetaStyle(value, name, label, dataType, isUsed, format, group) {
            this.isReferenced = false;
            this.format = String.Empty;
            this.group = String.Empty;
            this.value = value;
            this.name = name;
            this.label = label;
            this.dataType = dataType;
            this.isReferenced = isUsed;
            this.format = String.isNullOrWhitespace(format) ? this.format : format;
            this.group = String.isNullOrWhitespace(group) ? this.group : group;
        }
        return MetaStyle;
    }());
    Editor.MetaStyle = MetaStyle;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /*
    * Factory for IMetadataFieldStrategy implementations
    */
    var MetadataFieldRendererFactory = /** @class */ (function () {
        function MetadataFieldRendererFactory(metadataStylesRendererMapping, detailsViewControl) {
            this.metadataStylesRendererMapping = metadataStylesRendererMapping;
            this.detailsViewControl = detailsViewControl;
            this.defaultMetaStyleRenderer = new Editor.MetadataTextFieldRenderer(this.detailsViewControl);
            this.setDefaultRendererMapping();
        }
        /*
        * Create an IMetadataFieldRenderer implementation
        */
        MetadataFieldRendererFactory.prototype.create = function (metadataStyleContract) {
            var metadataFieldRenderer = this.defaultMetaStyleRenderer;
            if (this.metadataStylesRendererMapping.hasKey(metadataStyleContract)) {
                metadataFieldRenderer = this.metadataStylesRendererMapping.get(metadataStyleContract);
            }
            return metadataFieldRenderer;
        };
        MetadataFieldRendererFactory.prototype.setDefaultRendererMapping = function () {
            if (!this.metadataStylesRendererMapping.hasKey(Editor.Contract.styleMetadataColorDataType)) {
                this.metadataStylesRendererMapping.addOrUpdate(Editor.Contract.styleMetadataColorDataType, new Editor.MetadataColorFieldRenderer(this.detailsViewControl));
            }
            if (!this.metadataStylesRendererMapping.hasKey(Editor.Contract.styleMetadataPictureDataType)) {
                this.metadataStylesRendererMapping.addOrUpdate(Editor.Contract.styleMetadataPictureDataType, new Editor.MetadataImageFieldRenderer(this.detailsViewControl));
            }
            if (!this.metadataStylesRendererMapping.hasKey(Editor.Contract.styleMetadataNumberDataType)) {
                this.metadataStylesRendererMapping.addOrUpdate(Editor.Contract.styleMetadataNumberDataType, this.defaultMetaStyleRenderer);
            }
        };
        return MetadataFieldRendererFactory;
    }());
    Editor.MetadataFieldRendererFactory = MetadataFieldRendererFactory;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    /*
    * Creates an input text field
    */
    var MetadataTextFieldRenderer = /** @class */ (function () {
        function MetadataTextFieldRenderer(detailsViewControl) {
            this.detailsViewControl = detailsViewControl;
        }
        /*
        * Creates an input text field
        */
        MetadataTextFieldRenderer.prototype.render = function (styleSection, metaEntry, onFieldUpdate) {
            var dataType = Editor.DetailsViewConstants.inputTypeText;
            var attributes = { id: metaEntry.name };
            if (metaEntry.dataType === Editor.Contract.styleMetadataNumberDataType) {
                dataType = Editor.DetailsViewConstants.inputTypeNumber;
                attributes["min"] = 0;
            }
            this.detailsViewControl.createInputField(styleSection, Editor.CommonUtils.getLocalizedString("[" + metaEntry.label + "]"), dataType, String.Empty, metaEntry.value, attributes, onFieldUpdate);
        };
        return MetadataTextFieldRenderer;
    }());
    Editor.MetadataTextFieldRenderer = MetadataTextFieldRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /*
    * Creates an input image field
    */
    var MetadataImageFieldRenderer = /** @class */ (function () {
        function MetadataImageFieldRenderer(detailsViewControl) {
            this.detailsViewControl = detailsViewControl;
        }
        /*
        * Creates an input image field
        */
        MetadataImageFieldRenderer.prototype.render = function (styleSection, metaEntry, onFieldUpdate) {
            this.detailsViewControl.createImageField(styleSection, Editor.CommonUtils.getLocalizedString("[" + metaEntry.label + "]"), Editor.DetailsViewConstants.inputTypeText, Editor.DetailsViewConstants.srcInputCssClass, metaEntry.value, { id: metaEntry.name }, onFieldUpdate, { hasFocus: false });
        };
        return MetadataImageFieldRenderer;
    }());
    Editor.MetadataImageFieldRenderer = MetadataImageFieldRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    /*
    * Creates an input color field
    */
    var MetadataColorFieldRenderer = /** @class */ (function () {
        function MetadataColorFieldRenderer(detailsViewControl) {
            this.detailsViewControl = detailsViewControl;
        }
        /*
        * Create an input color field
        */
        MetadataColorFieldRenderer.prototype.render = function (styleSection, metaEntry, onFieldUpdate) {
            this.detailsViewControl.createInputColorField(styleSection, Editor.CommonUtils.getLocalizedString("[" + metaEntry.label + "]"), Editor.DetailsViewConstants.inputTypeText, String.Empty, metaEntry.value, { id: metaEntry.name }, onFieldUpdate);
        };
        return MetadataColorFieldRenderer;
    }());
    Editor.MetadataColorFieldRenderer = MetadataColorFieldRenderer;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../CommonReferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var KeyboardCommand = MktSvc.Controls.Common.KeyboardCommand;
    var KeyboardKeyCodes = MktSvc.Controls.Common.KeyboardKeyCodes;
    var KeyboardModifierType = MktSvc.Controls.Common.KeyboardModifierType;
    var StylesView = /** @class */ (function (_super) {
        __extends(StylesView, _super);
        function StylesView(containerId, detailsViewControl, metadataFieldRendererFactory, keyboardCommandManager) {
            var _this = _super.call(this, containerId) || this;
            _this.contentChangedHandler = function (eventArgs) {
                if (eventArgs.sourceId !== _this.id) {
                    _this.setContent(eventArgs.html);
                }
                else {
                    // Restore scroll position
                    if (_this.previousScrollPosition) {
                        if (Editor.CommonUtils.isIOS()) {
                            $("." + Editor.CommonConstants.designerContentEditorFrameWrapperClassName).scrollTop(_this.previousScrollPosition);
                        }
                        else {
                            $("." + Editor.CommonConstants.designerContentEditorFrameClassName).contents().scrollTop(_this.previousScrollPosition);
                        }
                        _this.previousScrollPosition = 0;
                    }
                }
            };
            _this.onContentModelInitialized = function (eventArgs) {
                _this.documentContentModel = eventArgs.documentContentModel;
            };
            _this.id = containerId;
            _this.detailsViewControl = detailsViewControl;
            _this.keyboardCommandManager = keyboardCommandManager;
            _this.metadataFieldRendererFactory = metadataFieldRendererFactory;
            return _this;
        }
        StylesView.prototype.init = function (eventBroker) {
            this.eventBroker = eventBroker;
            this.detailsViewControl.init(this.id, eventBroker);
            this.eventBroker.subscribe(Editor.EventConstants.contentChanged, this.contentChangedHandler);
            this.eventBroker.subscribe(Editor.EventConstants.contentModelInitialized, this.onContentModelInitialized);
            this.keyboardCommandManager.registerCommand(new KeyboardCommand(KeyboardKeyCodes.sixKey, [KeyboardModifierType.Alt], function () {
                $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.tabButtonPreClassName +
                    Editor.CommonConstants.stylesTabContentClassName)).parent().focus();
                $(Editor.CommonUtils.getClassSelector(Editor.CommonConstants.tabButtonPreClassName +
                    Editor.CommonConstants.stylesTabContentClassName)).click();
            }));
        };
        StylesView.prototype.activate = function () {
            _super.prototype.activate.call(this);
            this.render();
        };
        StylesView.prototype.dispose = function () {
            this.eventBroker.unsubscribe(Editor.EventConstants.contentChanged, this.contentChangedHandler);
            this.eventBroker.unsubscribe(Editor.EventConstants.contentModelInitialized, this.onContentModelInitialized);
            this.detailsViewControl.dispose();
            this.getElement().empty();
            this.previousScrollPosition = null;
            this.keyboardCommandManager = null;
            this.documentContentModel = null;
            this.detailsViewControl = null;
            this.eventBroker = null;
        };
        StylesView.prototype.setContent = function (html) {
            this.html = html;
            if (this.isActive) {
                this.render();
            }
            this.eventBroker.notify(Editor.DesignerInternalEventConstants.stylesViewContentUpdated, new Editor.ContentChangedEventArgs(this.html, this.id));
        };
        StylesView.prototype.render = function () {
            var _this = this;
            if (Object.isNullOrUndefined(this.documentContentModel)) {
                return;
            }
            this.getElement().empty();
            var styleSection = this.detailsViewControl.createSection(Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.stylesSectionTitle));
            var metaEntries = this.documentContentModel.getStyleMetaEntries();
            var contentDocument = this.documentContentModel.getContentNode();
            var hasMetaEntries = false;
            metaEntries.each(function (metaEntry) {
                // Only show variables used/referenced in the HTML
                var onFieldUpdate = function (inputField) {
                    var newValue = inputField.val();
                    _this.documentContentModel.updateStyleMetaValue(metaEntry, newValue);
                    _this.html = Editor.CommonUtils.getDocumentContent(_this.documentContentModel.getContentNode(), _this.documentContentModel.getDoctype());
                    // Save scroll position before notifying that content was changed
                    if (Editor.CommonUtils.isIOS()) {
                        _this.previousScrollPosition = $("." + Editor.CommonConstants.designerContentEditorFrameWrapperClassName).scrollTop();
                    }
                    else {
                        _this.previousScrollPosition = $("." + Editor.CommonConstants.designerContentEditorFrameClassName).contents().scrollTop();
                    }
                    _this.eventBroker.notify(Editor.EventConstants.contentChanged, new Editor.ContentChangedEventArgs(_this.html, _this.id));
                };
                if (metaEntry.isReferenced &&
                    !Object.isNullOrUndefined(metaEntry.dataType) &&
                    !Object.isNullOrUndefined(metaEntry.value)) {
                    var metadataFieldRenderer = _this.metadataFieldRendererFactory.create(metaEntry.dataType);
                    metadataFieldRenderer.render(styleSection, metaEntry, onFieldUpdate);
                    hasMetaEntries = true;
                }
            });
            if (!hasMetaEntries) {
                var emptyViewMessage = Editor.CommonUtils.getLocalizedString("[Empty Styles View Message]");
                var emptyWatermark = $("<div>").addClass(Editor.DetailsViewConstants.emptyWatermarkClassName).text(emptyViewMessage);
                this.getElement().append(emptyWatermark);
            }
            this.getElement().find("." + Editor.DetailsViewConstants.sectionContainerClassName).toggle(hasMetaEntries);
            this.eventBroker.notify(Editor.EventConstants.controlRendered, new Editor.ControlRenderedEventArgs(this.id, Editor.CommonUtils.getDocumentContent(contentDocument, this.documentContentModel.getDoctype()))); // tslint:disable-line
        };
        return StylesView;
    }(Editor.Control));
    Editor.StylesView = StylesView;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /** Manages visibility of tab items */
    var TabControlVisibilityManager = /** @class */ (function () {
        /** Initializes a new instance of type
        * @param tabItemsVisibility - tab items visibility
        */
        function TabControlVisibilityManager(tabItemsVisibility, eventBroker) {
            var _this = this;
            this.contentResolvedHandler = function () {
                _this.tabItemsVisibility.each(function (tabItemVisibility) {
                    var tabItem = tabItemVisibility.getTabItem();
                    if (tabItemVisibility.isTabEnabled(_this.documentContentModel)) {
                        tabItem.enable();
                    }
                    else {
                        tabItem.disable();
                    }
                });
                _this.onVisibilityUpdated();
            };
            this.onContentModelInitialized = function (eventArgs) {
                _this.documentContentModel = eventArgs.documentContentModel;
            };
            this.tabItemsVisibility = tabItemsVisibility;
            this.eventBroker = eventBroker;
        }
        TabControlVisibilityManager.prototype.init = function (onVisibilityUpdated) {
            this.onVisibilityUpdated = onVisibilityUpdated;
            this.eventBroker.subscribe(Editor.EventConstants.contentModelInitialized, this.onContentModelInitialized);
            this.eventBroker.subscribe(Editor.EventConstants.contentResolved, this.contentResolvedHandler);
        };
        TabControlVisibilityManager.prototype.dispose = function () {
            this.eventBroker.unsubscribe(Editor.EventConstants.contentModelInitialized, this.onContentModelInitialized);
            this.eventBroker.unsubscribe(Editor.EventConstants.contentResolved, this.contentResolvedHandler);
            this.documentContentModel = null;
            this.tabItemsVisibility = null;
        };
        return TabControlVisibilityManager;
    }());
    Editor.TabControlVisibilityManager = TabControlVisibilityManager;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var TabControlEventConstants = /** @class */ (function () {
        function TabControlEventConstants() {
        }
        TabControlEventConstants.tabsStateUpdated = "tabcontrol.tabsStateUpdated";
        return TabControlEventConstants;
    }());
    Editor.TabControlEventConstants = TabControlEventConstants;
})(Editor || (Editor = {}));
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var KeyboardCommand = MktSvc.Controls.Common.KeyboardCommand;
    var KeyboardKeyCodes = MktSvc.Controls.Common.KeyboardKeyCodes;
    var KeyboardModifierType = MktSvc.Controls.Common.KeyboardModifierType;
    /**
     * Plugin to delete the currently selected block.
     */
    var DeleteBlockButton = /** @class */ (function () {
        /**
         * Initializes a new instance of the DeleteBlockButton class.
         */
        function DeleteBlockButton(command) {
            this.command = command;
        }
        /**
         * Gets the name of the button.
         */
        DeleteBlockButton.prototype.getName = function () {
            return "deleteBlockBtn";
        };
        /**
         * Gets the label used with the button.
         */
        DeleteBlockButton.prototype.getLabel = function () {
            return "[Delete Block]";
        };
        /**
         * Get the command associated with the button
         */
        DeleteBlockButton.prototype.getCommand = function () {
            return this.command;
        };
        /**
         * Gets the source of the icon base64 encoded
         */
        DeleteBlockButton.prototype.getIconSrc = function () {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEQAACxEBf2RfkQAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC42/Ixj3wAAAHlJREFUOE+1k9ENgCAMRBnBkVym+49QPeLV0jRWMJK80DO+80NoqtpEZMM+Ax3/QGeg96mgLxasMoTsSxne+a1gv0izd9KCtxnYACohZmADqISYwfArKyFmYAOohJiBDaASYgY2AL5Q0UWu1QJCsV/Nc+eBeeQu0HYAkd+Ad00/Q7UAAAAASUVORK5CYII=";
        };
        /**
         * Gets the keyboard shortcut for the button.
         */
        DeleteBlockButton.prototype.getKeyboardShortcut = function () {
            return new KeyboardCommand(KeyboardKeyCodes.dKey, [KeyboardModifierType.Alt, KeyboardModifierType.Shift]);
        };
        return DeleteBlockButton;
    }());
    Editor.DeleteBlockButton = DeleteBlockButton;
})(Editor || (Editor = {}));
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    /**
     * Command to delete a selected block.
     */
    var DeleteBlockCommand = /** @class */ (function (_super) {
        __extends(DeleteBlockCommand, _super);
        function DeleteBlockCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Gets the name of the command.
         */
        DeleteBlockCommand.prototype.getName = function () {
            return DeleteBlockCommand.getName();
        };
        /**
         * Enabled if editor is in read only mode.
         */
        DeleteBlockCommand.prototype.enabledOnReadOnly = function () {
            return true;
        };
        /**
         * Gets the name of the command.
         */
        DeleteBlockCommand.getName = function () {
            return "deleteBlockCommand";
        };
        /**
         * Configure the command.
         * @param eventBroker An instance of event broker.
         */
        DeleteBlockCommand.prototype.setup = function (eventBroker) {
            this.eventBroker = eventBroker;
        };
        /**
         * Executes the command and deletes the currently selected block.
         * @param selectedBlock The currently selected block.
         * @param wrappedBlock The top-wrapping element.
         * @param cleanBlock The clean block, without any wrappers.
         * @param selectedHtml The selected html, if any.
         */
        DeleteBlockCommand.prototype.exec = function (selectedBlock, wrappedBlock, selectedHtml) {
            if (Object.isNullOrUndefined(selectedBlock)) {
                return false;
            }
            if (Object.isNullOrUndefined(this.eventBroker)) {
                return false;
            }
            var editorId = this.ckEditorProxy.getCkEditorId(selectedBlock);
            this.ckEditorProxy.destroyEditor(editorId);
            wrappedBlock.remove();
            var eventArgs = new Editor.BlockDeletedEventArgs();
            eventArgs.block = selectedBlock;
            this.eventBroker.notify(Editor.EventConstants.blockDeleted, eventArgs);
            return true;
        };
        /**
       * Disposes the object - removes the html from the page, empty the  objects and detach the events
       */
        DeleteBlockCommand.prototype.dispose = function () {
        };
        /*
         * Cleans up the html elements that where added to the page
         */
        DeleteBlockCommand.prototype.cleanup = function (blockElements) {
        };
        return DeleteBlockCommand;
    }(Editor.CkEditorCommand));
    Editor.DeleteBlockCommand = DeleteBlockCommand;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var BasicContentBlockInlineToolbar = /** @class */ (function () {
        function BasicContentBlockInlineToolbar() {
        }
        BasicContentBlockInlineToolbar.prototype.getName = function () {
            return "BasicContentBlockToolbar";
        };
        BasicContentBlockInlineToolbar.prototype.getConfig = function () {
            return [["deleteBlockBtn"]];
        };
        return BasicContentBlockInlineToolbar;
    }());
    Editor.BasicContentBlockInlineToolbar = BasicContentBlockInlineToolbar;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    var ContentBlock = /** @class */ (function () {
        function ContentBlock(executionContext, toolBlockMapping) {
            this.executionContext = executionContext;
            this.toolBlockMapping = toolBlockMapping;
            this.inlineToolbar = new Editor.BasicContentBlockInlineToolbar();
            this.contentBlockPlaceholder = Editor.CommonUtils.getContentBlockPlaceholder();
            this.cleanedUpContentBlock = "about:blank";
        }
        ContentBlock.prototype.getType = function () {
            return Editor.CommonConstants.contentBlockToolType;
        };
        ContentBlock.prototype.usePlainText = function () {
            return false;
        };
        ContentBlock.prototype.isEditable = function () {
            return false;
        };
        ContentBlock.prototype.getInlineToolbar = function () {
            return this.inlineToolbar;
        };
        ContentBlock.prototype.setup = function (eventBroker) {
            var _this = this;
            this.eventBroker = eventBroker;
            this.eventBroker.subscribe(Editor.EventConstants.contentBlockAttributeChanged, this.onContentBlockSourceChanged = function (eventArgs) { return _this.updateContentBlockSource(eventArgs); });
        };
        ContentBlock.prototype.dispose = function () {
            if (!Object.isNullOrUndefined(this.eventBroker)) {
                this.eventBroker.unsubscribe(Editor.EventConstants.contentBlockAttributeChanged, this.onContentBlockSourceChanged);
                this.onContentBlockSourceChanged = null;
            }
        };
        ContentBlock.prototype.isConfigured = function (block) {
            return this.isContentBlockConfigured(this.getSource(block));
        };
        ContentBlock.prototype.decorate = function (block) {
            if (block.attr(Editor.Contract.blockTypeAttrName) === this.getType()) {
                var contentBlock = this.getContentBlock(block);
                this.decorateBlockOverlay(contentBlock);
                this.setAriaLabel(block);
                this.decorateSubblockOnCanvas(block.find("." + Editor.DetailsViewConstants.contentBlockWrapper), block[0].outerHTML);
            }
        };
        ContentBlock.prototype.setFinalContent = function (block) {
            if (this.isPlaceholderNeeded(this.getSource(block))) {
                Editor.CommonUtils.removeBlockOverlay(block);
            }
            block.removeAttr("aria-label");
        };
        ContentBlock.prototype.updateContentBlockSource = function (eventArgs) {
            var _this = this;
            if (eventArgs.contentBlockElement) {
                eventArgs.contentBlockElement.find("." + Editor.DetailsViewConstants.contentBlockWrapper).first().empty();
                if (eventArgs.finalizedHtml) {
                    this.sanitizeContentBlock(eventArgs.finalizedHtml).done(function (sanitizedContent) {
                        var attr;
                        var attributes = Array.prototype.slice.call(sanitizedContent[0].attributes);
                        while (attr = attributes.pop()) {
                            eventArgs.contentBlockElement[0].setAttribute(attr.nodeName, attr.nodeValue);
                        }
                        var blockInCanvas = eventArgs.contentBlockElement.find("." + Editor.DetailsViewConstants.contentBlockWrapper).first();
                        blockInCanvas.append(sanitizedContent.children().clone());
                        _this.decorateSubblockOnCanvas(blockInCanvas, sanitizedContent[0].outerHTML);
                        var contentBlockElem = blockInCanvas.closest("[" + Editor.Contract.blockTypeAttrName + "='" + Editor.CommonConstants.contentBlockToolType + "']");
                        _this.setAriaLabel(contentBlockElem);
                        contentBlockElem.attr(Editor.DetailsViewConstants.lookupIdAttribute, eventArgs.entityId);
                        contentBlockElem.attr(Editor.DetailsViewConstants.lookupNameAttribute, eventArgs.entityName);
                    });
                }
            }
        };
        ContentBlock.prototype.sanitizeContentBlock = function (html) {
            var sanitizationPromise = $.Deferred();
            this.executionContext.getContentSanitizer().getSanitizedContent(html, function (output) {
                sanitizationPromise.resolve(output.children().first());
            });
            return sanitizationPromise;
        };
        ContentBlock.prototype.decorateSubblockOnCanvas = function (blockInCanvas, predecoratedNewHtml) {
            var subblockType = $(predecoratedNewHtml).attr(Editor.Contract.blockDatatypeAttrName);
            if (subblockType) {
                var subblock = $(predecoratedNewHtml).find("[" + Editor.Contract.subBlockAttrName + "='true']");
                subblock.attr(Editor.Contract.blockTypeAttrName, subblockType);
                var abstractBlock = this.toolBlockMapping.get(subblockType);
                if (abstractBlock) {
                    abstractBlock.decorate(subblock);
                }
                subblock.removeAttr(Editor.Contract.blockTypeAttrName);
                blockInCanvas.find("[" + Editor.Contract.subBlockAttrName + "='true']").replaceWith(subblock);
            }
        };
        ContentBlock.prototype.setAriaLabel = function (block) {
            var txt = "[" + (!this.isConfigured(block) ? "Unconfigured " : String.Empty) + block.attr(Editor.Contract.blockTypeAttrName) + " block tool]";
            var translatedText = Editor.CommonUtils.getLocalizedString(txt);
            var element = Editor.BlockProvider.getEditableElement(block);
            Editor.CommonUtils.setAriaAttribute(block, "aria-label", translatedText);
            Editor.CommonUtils.setAriaAttribute(element, "aria-label", translatedText);
            Editor.CommonUtils.setAriaAttribute(element, "title", translatedText);
        };
        ContentBlock.prototype.getContentBlock = function (block) {
            return block.find("img").not("." + Editor.CommonConstants.unconfiguredOverlayIconCssClassName);
        };
        ContentBlock.prototype.getBlock = function (contentBlock) {
            return new Editor.BlockProvider().getClosestBlock(contentBlock);
        };
        ContentBlock.prototype.getSource = function (block) {
            return this.getContentBlock(block).attr("src");
        };
        ContentBlock.prototype.decorateBlockOverlay = function (contentBlock) {
            var block = this.getBlock(contentBlock);
            var element = contentBlock.parent();
            Editor.CommonUtils.removeBlockOverlay(block);
            if (this.isPlaceholderNeeded(this.getSource(block))) {
                Editor.CommonUtils.overlayBlockElement(element, contentBlock, this.getContentBlockPlaceholder(this.getSource(block)));
            }
        };
        ContentBlock.prototype.isContentBlockConfigured = function (src) {
            return !String.isNullUndefinedOrWhitespace(src) && src !== this.contentBlockPlaceholder && src !== this.cleanedUpContentBlock;
        };
        ContentBlock.prototype.isPlaceholderNeeded = function (src) {
            return !this.isContentBlockConfigured(src);
        };
        ContentBlock.prototype.getContentBlockPlaceholder = function (src) {
            return this.contentBlockPlaceholder;
        };
        return ContentBlock;
    }());
    Editor.ContentBlock = ContentBlock;
})(Editor || (Editor = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Editor;
(function (Editor) {
    var EditorCustomization = /** @class */ (function () {
        function EditorCustomization() {
            this.HTMLEditor = true;
        }
        return EditorCustomization;
    }());
    Editor.EditorCustomization = EditorCustomization;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var String = MktSvc.Controls.Common.String;
    /**
    * Caretaker for the editor mememntos - a linear list of the editor content.
    */
    var UndoRedoManager = /** @class */ (function (_super) {
        __extends(UndoRedoManager, _super);
        function UndoRedoManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UndoRedoManager.prototype.init = function (control) {
            var _this = this;
            _super.prototype.init.call(this, control);
            this.onContentChanged = function (eventArgs) {
                if (eventArgs.sourceId === _this.Id) {
                    return;
                }
                _this.saveState(eventArgs.html);
            };
            this.control.getEventBroker().subscribe(Editor.EventConstants.contentChanged, this.onContentChanged);
            this.savedStates = new Array();
            this.currentStateIndex = -1;
            this.saveState(this.control.getContent());
        };
        UndoRedoManager.prototype.isStateValidForSave = function (state) {
            return !(String.isNullOrWhitespace(state) || this.savedStates.length > 0 && this.savedStates[this.currentStateIndex] === state);
        };
        UndoRedoManager.prototype.restoreState = function (state) {
            if (!String.isNullOrWhitespace(state)) {
                this.control.setContent(state, this.Id);
            }
        };
        UndoRedoManager.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.control.getEventBroker().unsubscribe(Editor.EventConstants.contentChanged, this.onContentChanged);
        };
        return UndoRedoManager;
    }(MktSvcCommon.UndoRedo.UndoRedoManagerBase));
    Editor.UndoRedoManager = UndoRedoManager;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    /**
     * Browser feature support constants
     */
    var BrowserFeatureSupport = /** @class */ (function () {
        function BrowserFeatureSupport() {
        }
        BrowserFeatureSupport.html5ColorPickerSupported = (function () {
            // Testing whether browser supports HTML5 color picker
            var testInput = document.createElement("input");
            testInput.setAttribute("type", "color");
            return testInput.type.toLowerCase() === "color";
        })();
        return BrowserFeatureSupport;
    }());
    Editor.BrowserFeatureSupport = BrowserFeatureSupport;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var Object = MktSvc.Controls.Common.Object;
    var String = MktSvc.Controls.Common.String;
    /**
     * Common utility methods
     */
    var ColorUtils = /** @class */ (function () {
        function ColorUtils() {
        }
        /**
        * Converts rgb(a) value to the hex value.
        * @param rgbColor rgb(a) color value.
        */
        ColorUtils.rgbToHex = function (rgbColor) {
            if (Object.isNullOrUndefined(rgbColor)) {
                return String.Empty;
            }
            var rgb = rgbColor.replace(/\s/g, String.Empty).match(/^rgba?\((\d+),(\d+),(\d+)/i);
            if (rgb && rgb.length === 4) {
                var result = "#";
                for (var i = 1; i < rgb.length; i++) {
                    result += ("0" + parseInt(rgb[i]).toString(16)).slice(-2); // tslint:disable-line
                }
                return result;
            }
            return rgbColor;
        };
        /**
         * Converts color from any representation supported by browser to hex without alpha
         * @param color color string specification (hex, rgb, hsl, name)
        */
        ColorUtils.toHex = function (color) {
            // When fillStyle property of the canvas context is set to color string, it immediately converts the color value to hex representation.
            ColorUtils.converterCanvasContext.fillStyle = color;
            return ColorUtils.converterCanvasContext.fillStyle;
        };
        ColorUtils.converterCanvasContext = document.createElement("canvas").getContext("2d");
        return ColorUtils;
    }());
    Editor.ColorUtils = ColorUtils;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Editor;
(function (Editor) {
    var VideoBlockProvider = /** @class */ (function () {
        function VideoBlockProvider(lookupField, executionContext) {
            this.lookupField = lookupField;
            this.executionContext = executionContext;
        }
        VideoBlockProvider.prototype.getLookupField = function () {
            return this.lookupField;
        };
        VideoBlockProvider.prototype.getLogger = function () {
            return this.getExecutionContext().getLogger();
        };
        VideoBlockProvider.prototype.getExecutionContext = function () {
            return this.executionContext;
        };
        VideoBlockProvider.EntityName = "msdyncrm_video";
        return VideoBlockProvider;
    }());
    Editor.VideoBlockProvider = VideoBlockProvider;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts" />
var Editor;
(function (Editor) {
    var RandomImagePicker = /** @class */ (function () {
        /**
         * Initializes a new instance of ImagePickerCustomControl
         */
        function RandomImagePicker() {
            this.imagePickerId = MktSvc.Controls.Common.UniqueId.generate();
        }
        /**
         * Configure the ImagePickerCustomControl with the event broker.
         * @param emailEventBroker The email Event Broker
         */
        RandomImagePicker.prototype.setup = function (emailEventBroker) {
            this.emailEventBroker = emailEventBroker;
        };
        /**
         * Selects a new image.
         */
        RandomImagePicker.prototype.open = function (containerId) {
            this.galleryControlCallback(this.getNewImageSource());
        };
        RandomImagePicker.prototype.getId = function () {
            return this.imagePickerId;
        };
        RandomImagePicker.prototype.dispose = function () {
        };
        /**
         * The callback that notifies Email Editor the image from the gallery was selected
         * @param imageUrl The image URL returned by the image picker
         */
        RandomImagePicker.prototype.galleryControlCallback = function (imageUrl) {
            var eventArgs = new MktSvcCommon.EventArgs.GalleryImageSelectedEventArgs(this.imagePickerId);
            eventArgs.imageUrl = imageUrl;
            this.emailEventBroker.notify(MktSvcCommon.EventConstants.GalleryImageSelected, eventArgs);
        };
        RandomImagePicker.prototype.getNewImageSource = function () {
            var imgSources = ["https://c.s-microsoft.com/da-dk/CMSImages/MMD_Lumia950Hol_1127_540x304_EN_US.jpg?version=1cf993b2-dcfb-fde5-9910-40d857d2bab5",
                "https://c.s-microsoft.com/en-gb/CMSImages/WinPCs_3rdParty_1201_540x304_EN_US.jpg?version=cbda645e-081d-2a1e-4259-13b337738575",
                "https://c.s-microsoft.com/da-dk/CMSImages/OFC_OutlookRefreshBG_1201_540x304_EN_US.jpg?version=6b0ffa34-7f6a-678e-8e3f-797cfbbd7254",
                "https://c.s-microsoft.com/da-dk/CMSImages/Apps_Edge_0729_540x304_EN_US.jpg?version=d8aba226-9774-3d28-4191-0730f4b8df9f"];
            this.lastSelectedImageIndex = this.getRandomIndexWithoutTheSpecified(imgSources.length - 1, this.lastSelectedImageIndex);
            return imgSources[this.lastSelectedImageIndex];
        };
        RandomImagePicker.prototype.getRandomIndexWithoutTheSpecified = function (maxLength, indexToBeExcluded) {
            var randomIndex = Math.floor(Math.random() * maxLength);
            if (randomIndex === indexToBeExcluded) {
                return this.getRandomIndexWithoutTheSpecified(maxLength, indexToBeExcluded);
            }
            return randomIndex;
        };
        return RandomImagePicker;
    }());
    Editor.RandomImagePicker = RandomImagePicker;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Editor;
(function (Editor) {
    var ContentBlockProvider = /** @class */ (function () {
        function ContentBlockProvider(lookupField, executionContext) {
            this.lookupField = lookupField;
            this.executionContext = executionContext;
        }
        ContentBlockProvider.prototype.getLookupField = function () {
            return this.lookupField;
        };
        ContentBlockProvider.prototype.getLogger = function () {
            return this.getExecutionContext().getLogger();
        };
        ContentBlockProvider.prototype.getExecutionContext = function () {
            return this.executionContext;
        };
        ContentBlockProvider.EntityName = "msdyncrm_contentblock";
        return ContentBlockProvider;
    }());
    Editor.ContentBlockProvider = ContentBlockProvider;
})(Editor || (Editor = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../commonreferences.ts" />
var Editor;
(function (Editor) {
    var ContentBlockTool = /** @class */ (function () {
        function ContentBlockTool() {
        }
        ContentBlockTool.prototype.getLabel = function () {
            return Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.contentBlockTool);
        };
        ContentBlockTool.prototype.getType = function () {
            return Editor.CommonConstants.contentBlockToolType;
        };
        ContentBlockTool.prototype.getContentTransformation = function () {
            return "<div class=\"" + Editor.DetailsViewConstants.contentBlockWrapper + "\"><img src=\"\" /></div>";
        };
        ContentBlockTool.prototype.getTitle = function () {
            return Editor.CommonUtils.getLocalizedString(Editor.DetailsViewConstants.contentBlockTool);
        };
        ContentBlockTool.prototype.getCssClass = function () {
            return Editor.DetailsViewConstants.contentBlockToolCss;
        };
        return ContentBlockTool;
    }());
    Editor.ContentBlockTool = ContentBlockTool;
})(Editor || (Editor = {}));
//# sourceMappingURL=Editor.js.map