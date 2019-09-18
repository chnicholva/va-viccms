// ---------------------------------------------------------------------------
// <copyright file="TelemetryInterfaces.ts" company="Microsoft">
//     Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// ---------------------------------------------------------------------------
var AppCommon;
(function (AppCommon) {
    /** Class definition for event parameter */
    var EventParameter = (function () {
        function EventParameter(name, value) {
            this.name = name;
            this.value = value;
        }
        EventParameter.prototype.Name = function () {
            return this.name;
        };
        EventParameter.prototype.Value = function () {
            return this.value;
        };
        return EventParameter;
    }());
    AppCommon.EventParameter = EventParameter;
})(AppCommon || (AppCommon = {}));
// ---------------------------------------------------------------------------
// <copyright file="Utility.ts" company="Microsoft">
//     Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// ---------------------------------------------------------------------------
var AppCommon;
(function (AppCommon) {
    var Utility = (function () {
        function Utility() {
        }
        // Generate new GUID
        Utility.newGuid = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        // Get current timestamp
        Utility.GetTimeStamp = function () {
            var date = new Date();
            return date.getUTCFullYear() + '-' +
                ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
                ('00' + date.getUTCDate()).slice(-2) + ' ' +
                ('00' + date.getUTCHours()).slice(-2) + ':' +
                ('00' + date.getUTCMinutes()).slice(-2) + ':' +
                ('00' + date.getUTCSeconds()).slice(-2);
        };
        return Utility;
    }());
    AppCommon.Utility = Utility;
})(AppCommon || (AppCommon = {}));
// ---------------------------------------------------------------------------
// <copyright file="TelemetryEvent.ts" company="Microsoft">
//     Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// ---------------------------------------------------------------------------
/// <reference path="TelemetryInterfaces.ts" />
/// <reference path="Utility.ts" />
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var AppCommon;
(function (AppCommon) {
    var TelemetryEvent = (function () {
        function TelemetryEvent(activityId, eventName) {
            this.activityId = activityId;
            if (this.activityId == null || this.activityId == "") {
                this.activityId = this.GetCurrentActivityId();
            }
            this.eventName = eventName;
            this.eventParameters = [];
            this.AddEventParameter("Module", "Sales");
        }
        TelemetryEvent.prototype.AddEventParameter = function (name, value) {
            this.eventParameters.push(new AppCommon.EventParameter(name, value));
        };
        TelemetryEvent.prototype.ToJson = function () {
            var jsonObject = {};
            jsonObject["ActivityId"] = this.activityId;
            jsonObject["EventName"] = this.eventName;
            var eventValues = {};
            for (var param = 0; param < this.eventParameters.length; param++) {
                eventValues[this.eventParameters[param].Name()] = this.eventParameters[param].Value();
            }
            jsonObject["EventValues"] = eventValues;
            return jsonObject;
        };
        TelemetryEvent.prototype.GetCurrentActivityId = function () {
            if (Xrm.Page.applicationContext && Xrm.Page.applicationContext.EventManager && Xrm.Page.applicationContext.EventManager.getActivityId) {
                return Xrm.Page.applicationContext.EventManager.getActivityId();
            }
            return TelemetryEvent.defaultActivityId;
        };
        TelemetryEvent.prototype.ActivityId = function () { return this.activityId; };
        TelemetryEvent.prototype.SolutionName = function () { return this.solutionName; };
        TelemetryEvent.prototype.EventName = function () { return this.eventName; };
        TelemetryEvent.prototype.EventParameters = function () { return this.eventParameters; };
        return TelemetryEvent;
    }());
    TelemetryEvent.defaultActivityId = AppCommon.Utility.newGuid();
    AppCommon.TelemetryEvent = TelemetryEvent;
})(AppCommon || (AppCommon = {}));
// ---------------------------------------------------------------------------
// <copyright file="TelemetryReporter.ts" company="Microsoft">
//     Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// ---------------------------------------------------------------------------
///<reference path="../../../../references/external/TypeDefinitions/jquery.d.ts" />
/// <reference path="TelemetryEvent.ts" />
var AppCommon;
(function (AppCommon) {
    var TelemetryReporter = (function () {
        function TelemetryReporter() {
            this.eventStartMarkers = {};
        }
        /// <summary>
        /// Add telemetry event to queue. Post event immediately if configured accordingly.
        /// </summary>
        /// <param name="event">Event data</param>
        TelemetryReporter.prototype.AddTelemetryEvent = function (event) {
            if (!TelemetryReporter.DISABLE_XRM_REPORTING && Xrm.Reporting && Xrm.Reporting.reportEvent) {
                Xrm.Reporting.reportEvent(event);
            }
        };
        /// <summary>
        /// Post Start Marker for a function
        /// </summary>
        /// <param name="eventName">eventName</param>
        /// <param name="webResourceName">webResourceName</param>
        /// <param name="functionName">function whose execution is being logged</param>
        /// <param name="currentId">The ID of the entity record being operated upon immediately</param>
        /// <param name="parentId">The ID of the entity record from which the current operation originated from. Applicable only for transition operations.</param>
        TelemetryReporter.prototype.PostStartMarker = function (eventName, webResourceName, functionName, currentId, parentId) {
            var telemetryevent = this.CreateTelemetryEvent(eventName, webResourceName, functionName, null, currentId, parentId);
            var eventKey = webResourceName + "_" + functionName;
            this.eventStartMarkers[eventKey] = window.performance.now();
            this.AddTelemetryEvent(telemetryevent);
        };
        /// <summary>
        /// Post End Marker for a function
        /// </summary>
        /// <param name="eventName">eventName</param>
        /// <param name="webResourceName">webResourceName</param>
        /// <param name="functionName">function whose execution is being logged</param>
        /// <param name="currentId">The ID of the entity record being operated upon immediately</param>
        /// <param name="parentId">The ID of the entity record from which the current operation originated from. Applicable only for transition operations.</param>
        /// <param name="async">Flag for async operations</param>
        TelemetryReporter.prototype.PostEndMarker = function (eventName, webResourceName, functionName, currentId, parentId, isAsync) {
            if (isAsync === void 0) { isAsync = false; }
            var endMarker = window.performance.now();
            var telemetryevent = this.CreateTelemetryEvent(eventName, webResourceName, functionName, null, currentId, parentId, isAsync);
            var eventKey = webResourceName + "_" + functionName;
            var startMarker = this.eventStartMarkers[eventKey];
            if (startMarker != null && !isNaN(startMarker)) {
                var executionTime = Math.round(endMarker - startMarker);
                telemetryevent.AddEventParameter("executionTime", executionTime);
            }
            this.AddTelemetryEvent(telemetryevent);
        };
        /// <summary>
        /// Creates a Telemetry event with the given parameters and adds it to the queue.
        /// </summary>
        /// <param name="eventName">eventName</param>
        /// <param name="webResourceName">webResourceName</param>
        /// <param name="functionName">function whose execution is being logged</param>
        /// <param name="executionTime">execution time</param>
        /// <param name="currentId">The ID of the entity record being operated upon immediately</param>
        /// <param name="parentId">The ID of the entity record from which the current operation originated from. Applicable only for transition operations.</param>
        /// <param name="async">Flag for async operations</param>
        TelemetryReporter.prototype.CreateTelemetryEvent = function (eventName, webResourceName, functionName, executionTime, currentId, parentId, isAsync) {
            if (isAsync === void 0) { isAsync = false; }
            var telemetryevent = new AppCommon.TelemetryEvent("", eventName);
            telemetryevent.AddEventParameter("webResourceName", webResourceName);
            telemetryevent.AddEventParameter("functionName", functionName);
            if (executionTime != null && !isNaN(executionTime)) {
                telemetryevent.AddEventParameter("executionTime", (executionTime));
            }
            telemetryevent.AddEventParameter("async", isAsync);
            telemetryevent.AddEventParameter("currentId", currentId);
            if (parentId && parentId != "") {
                telemetryevent.AddEventParameter("parentId", parentId);
            }
            if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.context)) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.context.organizationSettings)) {
                    if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.context.organizationSettings.organizationId)) {
                        telemetryevent.AddEventParameter("organizationId", "{" + Xrm.Page.context.organizationSettings.organizationId.toUpperCase() + "}");
                    }
                }
                if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.context.userSettings)) {
                    if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.context.userSettings.userId)) {
                        telemetryevent.AddEventParameter("userId", Xrm.Page.context.userSettings.userId);
                    }
                }
            }
            return telemetryevent;
        };
        /// <summary>
        /// Return TelemetryReporter instance.
        /// </summary>
        TelemetryReporter.Instance = function () {
            if (ClientUtility.DataUtil.isNullOrUndefined(TelemetryReporter.instance)) {
                TelemetryReporter.instance = new TelemetryReporter();
            }
            return TelemetryReporter.instance;
        };
        return TelemetryReporter;
    }());
    TelemetryReporter.DISABLE_XRM_REPORTING = false;
    AppCommon.TelemetryReporter = TelemetryReporter;
})(AppCommon || (AppCommon = {}));
