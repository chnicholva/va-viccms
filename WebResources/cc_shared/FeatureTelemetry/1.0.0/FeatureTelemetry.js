var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../TypeDefinitions/AppCommon/Telemetry/TelemetryLibrary.d.ts" />
var AppCommon;
(function (AppCommon) {
    var ProductGridEvent = (function (_super) {
        __extends(ProductGridEvent, _super);
        function ProductGridEvent(organizationId, eventContext, formFactor, productId, objectTypeCode) {
            var _this = _super.call(this, null, "ProductGridEvent") || this;
            _this.orgId = organizationId;
            _this.productId = productId;
            _this.objectTypeCode = objectTypeCode;
            _this.formFactor = formFactor;
            _this.eventContext = eventContext;
            _this.AddEventParameter("OrgId", organizationId);
            _this.AddEventParameter("EventContext", eventContext);
            _this.AddEventParameter("FormFactor", formFactor);
            _this.AddEventParameter("OQOIProductId", productId);
            _this.AddEventParameter("ObjectTypeCode", objectTypeCode);
            return _this;
        }
        ProductGridEvent.prototype.OrgId = function () {
            return this.orgId;
        };
        ProductGridEvent.prototype.OQOIProductId = function () {
            return this.productId;
        };
        ProductGridEvent.prototype.ObjectTypeCode = function () {
            return this.objectTypeCode;
        };
        ProductGridEvent.prototype.FormFactor = function () {
            return this.formFactor;
        };
        ProductGridEvent.prototype.EventContext = function () {
            return this.eventContext;
        };
        return ProductGridEvent;
    }(AppCommon.TelemetryEvent));
    AppCommon.ProductGridEvent = ProductGridEvent;
    var ProductGridEventContext = (function () {
        function ProductGridEventContext() {
        }
        Object.defineProperty(ProductGridEventContext, "AddProduct", {
            get: function () { return "AddProduct"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProductGridEventContext, "EditProperties", {
            get: function () { return "EditProperties"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProductGridEventContext, "Suggestions", {
            get: function () { return "Suggestions"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProductGridEventContext, "AddSuggestedProductClassic", {
            get: function () { return "AddSuggestedProductClassic"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProductGridEventContext, "AddSuggestedProductAI", {
            get: function () { return "AddSuggestedProductAI"; },
            enumerable: true,
            configurable: true
        });
        return ProductGridEventContext;
    }());
    AppCommon.ProductGridEventContext = ProductGridEventContext;
    var ProductGridEventWriter = (function () {
        function ProductGridEventWriter() {
        }
        ProductGridEventWriter.WriteEvent = function (parentEntityName, eventContext, productId) {
            if (!ClientUtility.DataUtil.isNullOrUndefined(window.Xrm.Page.context) &&
                !ClientUtility.DataUtil.isNullOrUndefined(window.Xrm.Page.context.organizationSettings) &&
                !ClientUtility.DataUtil.isNullOrUndefined(window.Xrm.Page.context.organizationSettings.organizationId) &&
                !ClientUtility.DataUtil.isNullOrUndefined(window.Xrm.Internal)) {
                var orgId = window.Xrm.Page.context.organizationSettings.organizationId;
                var formFactor = window.Xrm.Page.context.client.getFormFactor().toString();
                var objectTypeCode = window.Xrm.Internal.getEntityCode(parentEntityName);
                var event_1 = new ProductGridEvent(orgId, eventContext, formFactor, productId, objectTypeCode);
                if (ProductGridEventWriter.AppCommonNullCheck()) {
                    AppCommon.TelemetryReporter.Instance().AddTelemetryEvent(event_1);
                }
            }
        };
        return ProductGridEventWriter;
    }());
    ProductGridEventWriter.AppCommonNullCheck = function () {
        return ((typeof (AppCommon) !== 'undefined') &&
            (AppCommon != null && AppCommon != undefined) &&
            (AppCommon.TelemetryReporter != null && AppCommon.TelemetryReporter != undefined) &&
            (AppCommon.TelemetryReporter.Instance() != null && AppCommon.TelemetryReporter.Instance() != undefined));
    };
    AppCommon.ProductGridEventWriter = ProductGridEventWriter;
})(AppCommon || (AppCommon = {}));
///<reference path="ProductGrid/ProductGridEvent.ts" /> 
