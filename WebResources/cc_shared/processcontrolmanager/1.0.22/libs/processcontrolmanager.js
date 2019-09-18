/** @license Copyright (c) Microsoft Corporation. All rights reserved. */
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var ContextManager = (function () {
            function ContextManager() {
                this._breadCrumbSavedState = {};
                this._stageSavedState = {};
                this._hasBreadCrumbChanged = false;
                this._hasStageChanged = false;
            }
            ContextManager.prototype.context = function (any, controlMode) {
                if (any === void 0) { any = true; }
                if (controlMode === void 0) { controlMode = Containers.ControlMode.stage; }
                var context = null;
                switch (controlMode) {
                    case Containers.ControlMode.stage:
                        context = this._processStageContext;
                        break;
                    case Containers.ControlMode.breadCrumb:
                        context = this._breadCrumbContext;
                        break;
                }
                if (any && !context) {
                    if (controlMode === Containers.ControlMode.stage) {
                        return this._breadCrumbContext;
                    }
                    else {
                        return this._processStageContext;
                    }
                }
                return context;
            };
            ContextManager.prototype.setContext = function (context, controlMode, businessProcessFlowWrapper) {
                if (controlMode === Containers.ControlMode.breadCrumb) {
                    this._breadCrumbContext = context;
                }
                else if (controlMode === Containers.ControlMode.stage) {
                    this._processStageContext = context;
                }
                if (!MscrmCommon.ControlUtils.Object.isNullOrUndefined(businessProcessFlowWrapper)) {
                    this._updateSavedState(context, controlMode, businessProcessFlowWrapper);
                }
            };
            ContextManager.prototype._updateSavedState = function (context, controlMode, businessProcessFlowWrapper) {
                var currentState = controlMode === Containers.ControlMode.breadCrumb ? this._breadCrumbSavedState : this._stageSavedState;
                var newState = {
                    entityId: businessProcessFlowWrapper.currentEntity.Id,
                    processId: businessProcessFlowWrapper.id,
                    processInstanceId: businessProcessFlowWrapper.instanceId,
                    selectedStage: businessProcessFlowWrapper.selectedStageId,
                    displayState: businessProcessFlowWrapper.displayState,
                };
                var mergedState = Object.assign({}, currentState, newState);
                if ((currentState.entityId &&
                    mergedState.entityId &&
                    mergedState.entityId.toString() !== currentState.entityId.toString()) ||
                    (currentState.processId &&
                        mergedState.processId &&
                        mergedState.processId.guid !== currentState.processId.guid) ||
                    (currentState.processInstanceId &&
                        mergedState.processInstanceId &&
                        mergedState.processInstanceId.guid !== currentState.processInstanceId.guid) ||
                    mergedState.displayState !== currentState.displayState ||
                    (currentState.selectedStage &&
                        mergedState.selectedStage &&
                        mergedState.selectedStage.guid !== currentState.selectedStage.guid)) {
                    if (controlMode === Containers.ControlMode.breadCrumb) {
                        this._hasBreadCrumbChanged = true;
                        this._breadCrumbSavedState = mergedState;
                    }
                    else {
                        this._hasStageChanged = true;
                        this._stageSavedState = mergedState;
                    }
                }
                else {
                    if (controlMode === Containers.ControlMode.breadCrumb) {
                        this._hasBreadCrumbChanged = false;
                    }
                    else {
                        this._hasStageChanged = false;
                    }
                }
            };
            ContextManager.prototype.getUniqueId = function (controlMode, key) {
                switch (controlMode) {
                    case Containers.ControlMode.breadCrumb:
                        if (this._breadCrumbContext) {
                            return this._breadCrumbContext.accessibility.getUniqueId(key);
                        }
                        break;
                    case Containers.ControlMode.stage:
                        if (this._processStageContext) {
                            return this._processStageContext.accessibility.getUniqueId(key);
                        }
                        break;
                }
                return null;
            };
            ContextManager.prototype.hasChanged = function (controlMode) {
                if (controlMode === Containers.ControlMode.breadCrumb) {
                    return this._hasBreadCrumbChanged;
                }
                else {
                    return this._hasStageChanged;
                }
            };
            ContextManager.navigationButtonKey = "headerNavigationButton";
            return ContextManager;
        }());
        Containers.ContextManager = ContextManager;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var actionStepType = "action";
        var BPFCUSTOMCONTROL_FCB = "EnableBPFNonDefaultCustomControls";
        var ProcessControlManager = (function () {
            function ProcessControlManager() {
                this._crossEntityFlyoutDisplayState = Containers.DisplayState.collapsed;
            }
            ProcessControlManager.prototype._getStageWithId = function (stageId) {
                var stages = this._businessProcessFlowWrapper.stages;
                for (var _i = 0, stages_1 = stages; _i < stages_1.length; _i++) {
                    var stage = stages_1[_i];
                    if (Guid.equals(stage.id, stageId)) {
                        return stage;
                    }
                }
                return null;
            };
            Object.defineProperty(ProcessControlManager, "Instance", {
                get: function () {
                    if (!ProcessControlManager._instance) {
                        ProcessControlManager._instance = new ProcessControlManager();
                    }
                    return ProcessControlManager._instance;
                },
                enumerable: true,
                configurable: true
            });
            ProcessControlManager.prototype.init = function (businessProcessFlowWrapper, context, controlMode) {
                this._context = context;
                this._businessProcessFlowWrapper = businessProcessFlowWrapper;
                if (!this._contextManager) {
                    this._contextManager = new Containers.ContextManager();
                }
                this._contextManager.setContext(context, controlMode, businessProcessFlowWrapper);
            };
            Object.defineProperty(ProcessControlManager.prototype, "contextManager", {
                get: function () {
                    return this._contextManager;
                },
                enumerable: true,
                configurable: true
            });
            ProcessControlManager.prototype.getBusinessProcessFlowWrapper = function () {
                return this._businessProcessFlowWrapper;
            };
            ProcessControlManager.prototype.getCurrentEntity = function () {
                return this._businessProcessFlowWrapper.currentEntity;
            };
            ProcessControlManager.prototype.getStageIds = function () {
                var stageIds = [];
                var stages = this._businessProcessFlowWrapper.stages;
                if (!stages) {
                    return stageIds;
                }
                for (var _i = 0, stages_2 = stages; _i < stages_2.length; _i++) {
                    var stage = stages_2[_i];
                    stageIds.push(stage.id);
                }
                return stageIds;
            };
            ProcessControlManager.prototype.getStageIndex = function (stageId) {
                var stageStartIndex = 0;
                var stageNumber = stageStartIndex;
                var stages = this._businessProcessFlowWrapper.stages;
                for (var _i = 0, stages_3 = stages; _i < stages_3.length; _i++) {
                    var stage = stages_3[_i];
                    stageNumber++;
                    if (stage.id.guid == stageId.guid) {
                        return stageNumber;
                    }
                }
                return stageStartIndex;
            };
            ProcessControlManager.prototype.getStageName = function (stageId) {
                return this._getStageWithId(stageId).name;
            };
            ProcessControlManager.prototype.getStageStatus = function (stageId) {
                return BusinessProcessFlowStageStatus[this._getStageWithId(stageId).status];
            };
            ProcessControlManager.prototype.getStageStatusText = function (stageId) {
                if (this.getStageStatus(stageId) === BusinessProcessFlowStageStatus[BusinessProcessFlowStageStatus.Completed]) {
                    return Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.Completed);
                }
                else {
                    return Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.Inactive);
                }
            };
            ProcessControlManager.prototype.getStageEntityName = function (stageId) {
                return this._getStageWithId(stageId).entityName;
            };
            ProcessControlManager.prototype.getStageEntityDisplayName = function (stageId) {
                return this._getStageWithId(stageId).entityDisplayName;
            };
            ProcessControlManager.prototype.getStageRelatedEntityReference = function (stageId) {
                return this._getStageWithId(stageId).relatedEntityReference;
            };
            ProcessControlManager.prototype.getStageSteps = function (stageId) {
                return this._getStageWithId(stageId).steps;
            };
            ProcessControlManager.prototype.getStepIdsAndProperties = function (stageId) {
                var stepIdsAndProperties = [];
                var stageSteps = this._getStageWithId(stageId).steps;
                var isSomeStepInFocus = false;
                for (var _i = 0, stageSteps_1 = stageSteps; _i < stageSteps_1.length; _i++) {
                    var step = stageSteps_1[_i];
                    var fieldName = step.attributeName;
                    if (MscrmCommon.ControlUtils.String.isNullOrEmpty(fieldName) &&
                        step.stepType.toLowerCase() !== actionStepType) {
                        continue;
                    }
                    var isRequiredStepCompleted = true;
                    if (this.stageValidationResult && !this.stageValidationResult.isValid) {
                        if (this.stageValidationResult.emptySteps.length !== 0) {
                            isRequiredStepCompleted = step.isRequired
                                ? this.stageValidationResult.emptySteps.indexOf(step.attributeName) === -1
                                : true;
                        }
                        if (this.stageValidationResult.errorSteps.length !== 0) {
                            isRequiredStepCompleted =
                                isRequiredStepCompleted || this.stageValidationResult.emptySteps.indexOf(step.attributeName) === -1;
                        }
                    }
                    var properties = this._getPropertiesByEntityFieldNameAndLabel(step, !isRequiredStepCompleted);
                    if (!properties) {
                        return null;
                    }
                    if (this.stageValidationResult &&
                        !this.stageValidationResult.isValid &&
                        !isSomeStepInFocus &&
                        !this.isStageLocked(stageId)) {
                        properties.controlstates.hasFocus = !isRequiredStepCompleted;
                        isSomeStepInFocus = !isRequiredStepCompleted;
                    }
                    else if (!isSomeStepInFocus && !this.isStageLocked(stageId)) {
                        properties.controlstates.hasFocus = true;
                        isSomeStepInFocus = true;
                    }
                    var businessProcessStepIdKey = step.stepId.guid + "step";
                    var idPropertyObject = {};
                    idPropertyObject[step.stepId.guid] = properties;
                    idPropertyObject[businessProcessStepIdKey] = step.stepType;
                    idPropertyObject[step.attributeName] = step.attributeName;
                    stepIdsAndProperties.push(idPropertyObject);
                }
                if (this.stageValidationResult) {
                    this.stageValidationResult = null;
                }
                return stepIdsAndProperties;
            };
            ProcessControlManager.prototype._getPropertiesByEntityFieldNameAndLabel = function (step, isStepInStageGatingError) {
                var stepParameters = {
                    value: {
                        Usage: 0,
                        Static: false,
                        Type: step.attributeType,
                        Value: step.attributeName,
                        Primary: true,
                    },
                    controlMode: {
                        Usage: 1,
                        Static: true,
                        Type: "Enum",
                        Value: 2,
                        Primary: false,
                    },
                    deviceSizeMode: {
                        raw: 0,
                    },
                    businessProcessFlowRequired: {
                        Usage: 1,
                        Static: true,
                        Type: "TwoOptions",
                        Value: step.isRequired,
                        Primary: false,
                    },
                    isEmpty: {
                        Usage: 1,
                        Static: true,
                        Type: "TwoOptions",
                        Value: true,
                        Primary: false,
                    },
                    showStageGatingError: {
                        Usage: 1,
                        Static: true,
                        Type: "TwoOptions",
                        Value: isStepInStageGatingError,
                        Primary: false,
                    },
                    displayMode: {
                        Usage: 1,
                        Static: true,
                        Type: "Enum",
                        Value: 2,
                        Primary: false,
                    },
                    labelMode: {
                        Usage: 1,
                        Static: true,
                        Type: "Enum",
                        Value: 0,
                        Primary: false,
                    },
                };
                var stepValueSpecification = {
                    Usage: 1,
                    Static: true,
                    Type: "SingleLine.Text",
                    Primary: false,
                    Value: JSON.stringify({
                        Usage: 0,
                        Static: false,
                        Type: step.attributeType,
                        Value: step.attributeName,
                        Primary: true,
                        ViewId: step.viewId,
                        ExtraFilters: step.extraFilters,
                        EnableViewPicker: true,
                        AllowFilterOff: false,
                        DisableQuickFind: false,
                    }),
                };
                var stepControlStates = {
                    hasFocus: false,
                    isControlDisabled: false,
                    showLabel: true,
                    label: step.name,
                };
                var stepDescriptor = {
                    Id: step.controlName,
                    Label: step.name,
                    Name: step.controlName,
                    DomId: step.controlName,
                    ShowLabel: true,
                    Visible: step.isVisible,
                    ClassId: null,
                    Disabled: step.isControlDisabled,
                    UniqueId: step.stepId.guid,
                    Parameters: null,
                };
                if (this._context.utils.isFeatureEnabled(BPFCUSTOMCONTROL_FCB)) {
                    var controlConfiguration = {
                        FormFactor: 2,
                        CustomControlId: "MscrmControls.Containers.FieldSectionItem",
                        Name: "CustomControlFramework.MscrmControls.Containers.FieldSectionItem",
                        Version: "1.0.0",
                        Parameters: stepParameters,
                    };
                    var properties_1 = null;
                    if (step.nonDefaultConfiguration) {
                        var nonDefaultStepParameters = Object.assign({}, stepParameters, {
                            deviceSizeMode: {
                                Usage: 1,
                                Static: true,
                                Type: "WholeNumber.None",
                                Value: 2,
                                Primary: false,
                            },
                        });
                        var nonDefaultControlConfiguration = Object.assign({}, controlConfiguration, {
                            Parameters: nonDefaultStepParameters,
                        });
                        properties_1 = {
                            configuration: nonDefaultControlConfiguration,
                            controlstates: stepControlStates,
                            descriptor: stepDescriptor,
                        };
                        properties_1.configuration.Children = {
                            fieldControl: step.nonDefaultConfiguration,
                        };
                    }
                    else {
                        properties_1 = {
                            configuration: controlConfiguration,
                            controlstates: stepControlStates,
                            descriptor: stepDescriptor,
                        };
                    }
                    if (step.viewId) {
                        properties_1.configuration.Parameters.valueSpecification = stepValueSpecification;
                    }
                    return properties_1;
                }
                var properties = {
                    parameters: stepParameters,
                    controlstates: stepControlStates,
                    descriptor: stepDescriptor,
                };
                if (step.viewId) {
                    properties.parameters.valueSpecification = stepValueSpecification;
                }
                return properties;
            };
            ProcessControlManager.prototype.getBPFId = function () {
                return this._businessProcessFlowWrapper.id;
            };
            ProcessControlManager.prototype.getBPFName = function () {
                return this._businessProcessFlowWrapper.name;
            };
            ProcessControlManager.prototype.getBPFInstanceId = function () {
                return this._businessProcessFlowWrapper.instanceId;
            };
            ProcessControlManager.prototype.getBPFInstanceName = function () {
                return this._businessProcessFlowWrapper.instanceName;
            };
            ProcessControlManager.prototype.getBPFState = function () {
                return this._businessProcessFlowWrapper.state;
            };
            ProcessControlManager.prototype.getBPFStatus = function () {
                return this._businessProcessFlowWrapper.status;
            };
            ProcessControlManager.prototype.isBusinessProcessCompleted = function () {
                return this._businessProcessFlowWrapper.status === 2;
            };
            ProcessControlManager.prototype.isBusinessProcessActive = function () {
                return this._businessProcessFlowWrapper.processState === 1;
            };
            ProcessControlManager.prototype.isStageForCurrentEntity = function (stageId) {
                return this._getStageWithId(stageId).entityName === this._businessProcessFlowWrapper.currentEntity.LogicalName;
            };
            ProcessControlManager.prototype.isSelectedStage = function (stageId) {
                return stageId.guid === this._businessProcessFlowWrapper.selectedStageId.guid;
            };
            ProcessControlManager.prototype.isFirstStage = function (stageId) {
                if (this._businessProcessFlowWrapper.stages.length == 0) {
                    return false;
                }
                return stageId.guid === this._businessProcessFlowWrapper.stages[0].id.guid;
            };
            ProcessControlManager.prototype.isLastStage = function (stageId) {
                var stages = this._businessProcessFlowWrapper.stages;
                if (stages.length == 0) {
                    return false;
                }
                return stageId.guid === stages[stages.length - 1].id.guid;
            };
            ProcessControlManager.prototype.isActiveStage = function (stageId) {
                return stageId.guid === this._businessProcessFlowWrapper.activeStageId.guid;
            };
            ProcessControlManager.prototype.getActiveStageId = function () {
                return this._businessProcessFlowWrapper.activeStageId;
            };
            ProcessControlManager.prototype.getActivePath = function () {
                return this._businessProcessFlowWrapper.activePath;
            };
            ProcessControlManager.prototype.isStageComplete = function (stageId) {
                return this._getStageWithId(stageId).status === 2;
            };
            ProcessControlManager.prototype.isStageLocked = function (stageId) {
                var stage = this._getStageWithId(stageId);
                if (!stage) {
                    return true;
                }
                var relatedEntityReference = this.getStageRelatedEntityReference(stageId);
                if (!this.isStageForCurrentEntity(stageId) &&
                    (!relatedEntityReference || relatedEntityReference.Id.toString() === Guid.EMPTY.toString())) {
                    return true;
                }
                if (!this._isStageOnActivePath(stageId)) {
                    return true;
                }
                return false;
            };
            ProcessControlManager.prototype.isBusinessProcessAborted = function () {
                return this._businessProcessFlowWrapper.status === 3;
            };
            ProcessControlManager.prototype.isBusinessProcessDisabled = function () {
                return (this._businessProcessFlowWrapper.status === 3 ||
                    this._businessProcessFlowWrapper.processState === 0);
            };
            ProcessControlManager.prototype.completeProcess = function () {
                return this._businessProcessFlowWrapper.delegates.completeProcess();
            };
            ProcessControlManager.prototype.moveToNextStage = function () {
                var nextStage = this.getNextStage();
                return this._businessProcessFlowWrapper.delegates.moveNext().then(function (response) {
                    if (!MscrmCommon.ControlUtils.Object.isNullOrUndefined(nextStage) &&
                        !MscrmCommon.ControlUtils.Object.isNullOrUndefined(nextStage.id)) {
                        Containers.StyleHelper.scrollIntoView(nextStage.id);
                    }
                });
            };
            ProcessControlManager.prototype.moveToPreviousStage = function () {
                var previousStage = this.getPreviousStage();
                return this._businessProcessFlowWrapper.delegates.movePrevious().then(function (response) {
                    if (!MscrmCommon.ControlUtils.Object.isNullOrUndefined(previousStage) &&
                        !MscrmCommon.ControlUtils.Object.isNullOrUndefined(previousStage.id)) {
                        Containers.StyleHelper.scrollIntoView(previousStage.id);
                    }
                });
            };
            ProcessControlManager.prototype.validateRequiredFields = function () {
                this.stageValidationResult = this._businessProcessFlowWrapper.delegates.validateRequiredFieldsForNavigation();
                if (this.stageValidationResult && !this.stageValidationResult.isValid) {
                    this.contextManager
                        .context()
                        .utils.setNotification(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.RequiredStepWarningMesage), this.getActiveStageId().guid);
                    this.contextManager.context().utils.requestRender();
                    return false;
                }
                return true;
            };
            ProcessControlManager.prototype.waitForOngoingWork = function () {
                return this._businessProcessFlowWrapper.delegates.waitForOngoingWork();
            };
            ProcessControlManager.prototype.setActiveStage = function (stageId) {
                return this._businessProcessFlowWrapper.delegates.setActiveStage(stageId);
            };
            ProcessControlManager.prototype.triggerActionStepClick = function (controlId) {
                return this._businessProcessFlowWrapper.delegates.triggerActionStepClick(controlId);
            };
            ProcessControlManager.prototype.triggerFlowStepClick = function (flowStepId, controlId) {
                return this._businessProcessFlowWrapper.delegates.triggerFlowStepClick(flowStepId, controlId);
            };
            ProcessControlManager.prototype.setSelectedStage = function (stageId, isUserSelectedStage) {
                if (isUserSelectedStage === void 0) { isUserSelectedStage = false; }
                this._businessProcessFlowWrapper.delegates.setSelectedStage(stageId, isUserSelectedStage);
            };
            ProcessControlManager.prototype.getSelectedStageId = function () {
                return this._businessProcessFlowWrapper.selectedStageId;
            };
            ProcessControlManager.prototype.getActionLog = function (stepId) {
                if (!!this._businessProcessFlowWrapper.actionLogs) {
                    return this._businessProcessFlowWrapper.actionLogs[stepId.toString()];
                }
                return null;
            };
            ProcessControlManager.prototype.setDisplayState = function (displayState) {
                if (displayState === Containers.DisplayState.collapsed) {
                    this.setCrossEntityDisplayState(Containers.DisplayState.collapsed);
                }
                this._businessProcessFlowWrapper.delegates.setDisplayState(Containers.DisplayState[displayState]);
            };
            ProcessControlManager.prototype.getDisplayState = function () {
                return Containers.DisplayState[this._businessProcessFlowWrapper.displayState];
            };
            ProcessControlManager.prototype.isVisible = function () {
                return this._businessProcessFlowWrapper.isVisible;
            };
            ProcessControlManager.prototype.getIsFormHeaderCollapsed = function () {
                return this._businessProcessFlowWrapper.isFormHeaderCollapsed;
            };
            ProcessControlManager.prototype.getNextOrPreviousSelectedStageId = function (isNext, selectedStageId) {
                var stages = this._businessProcessFlowWrapper.stages;
                if (stages.length == 0) {
                    return false;
                }
                var noOfStages = stages.length;
                for (var index = 0; index < noOfStages; ++index) {
                    if (Guid.equals(stages[index].id, selectedStageId)) {
                        if (isNext) {
                            if (index + 1 < noOfStages) {
                                return stages[++index].id;
                            }
                            else {
                                return stages[index].id;
                            }
                        }
                        else {
                            if (index - 1 >= 0) {
                                return stages[--index].id;
                            }
                            else {
                                return stages[index].id;
                            }
                        }
                    }
                }
                return this.getActiveStageId();
            };
            ProcessControlManager.prototype.getProcessStages = function () {
                return this._businessProcessFlowWrapper.stages;
            };
            ProcessControlManager.prototype.isCurrentSelectedStage = function (stageId) {
                return Guid.equals(this._businessProcessFlowWrapper.selectedStageId, stageId);
            };
            ProcessControlManager.prototype.setCrossEntityDisplayState = function (displayState) {
                this._crossEntityFlyoutDisplayState = displayState;
            };
            ProcessControlManager.prototype.isCrossEntityFlyoutOpen = function () {
                if (this._crossEntityFlyoutDisplayState) {
                    return this._crossEntityFlyoutDisplayState === Containers.DisplayState.floating;
                }
                return false;
            };
            ProcessControlManager.prototype.getForwardNavigationEntitiesPromise = function () {
                var currentEntityId = this.getCurrentEntity().Id.toString();
                var referencedEntityLogicalName = this.getCurrentEntity().LogicalName;
                var nextStage = this.getNextStage();
                if (nextStage) {
                    var referencingEntityAttributeName = this._getStageWithId(nextStage.id).referencingAttributeName;
                    var referencingEntityLogicalName = nextStage.entityName;
                    return this._businessProcessFlowWrapper.delegates.getForwardNavigationEntities(currentEntityId, referencedEntityLogicalName, referencingEntityLogicalName, referencingEntityAttributeName);
                }
            };
            ProcessControlManager.prototype.getNavigateToNextEntityPromise = function (nextEntity) {
                var processId = this.getBPFId();
                var processInstanceId = this.getBPFInstanceId();
                return this._businessProcessFlowWrapper.delegates.navigateToNextEntity(this.getCurrentEntity(), nextEntity, processId, processInstanceId);
            };
            ProcessControlManager.prototype.getNextStage = function () {
                var activePath = this._businessProcessFlowWrapper.activePath;
                var activeStageId = this.getActiveStageId();
                var activeStageIndex = activePath.length;
                for (var index = 0; index < activePath.length; ++index) {
                    var stageId = activePath[index];
                    if (Guid.equals(stageId, activeStageId)) {
                        activeStageIndex = index;
                    }
                    if (index === activeStageIndex && activeStageIndex < activePath.length - 1) {
                        return this._getStageWithId(activePath[++activeStageIndex]);
                    }
                }
                return null;
            };
            ProcessControlManager.prototype.getPreviousStage = function () {
                var activePath = this._businessProcessFlowWrapper.activePath;
                var activeStageId = this.getActiveStageId();
                var activeStageIndex = activePath.length;
                for (var index = 0; index < activePath.length; ++index) {
                    var stageId = activePath[index];
                    if (Guid.equals(stageId, activeStageId)) {
                        activeStageIndex = index;
                    }
                    if (index === activeStageIndex && activeStageIndex > 0) {
                        return this._getStageWithId(activePath[--activeStageIndex]);
                    }
                }
                return null;
            };
            ProcessControlManager.prototype._isStageOnActivePath = function (stageId) {
                for (var _i = 0, _a = this._businessProcessFlowWrapper.activePath; _i < _a.length; _i++) {
                    var stage = _a[_i];
                    if (Guid.equals(stage, stageId)) {
                        return true;
                    }
                }
                return false;
            };
            ProcessControlManager.prototype.isMobileMode = function () {
                return (this.contextManager.context().client.getFormFactor() === 3 ||
                    window.innerWidth <= parseInt(this.contextManager.context().theming.breakpoints.dimensions));
            };
            ProcessControlManager.prototype.isTabletMode = function () {
                return (this.contextManager.context().client.getFormFactor() === 2 || window.innerWidth <= 850);
            };
            ProcessControlManager.prototype.getActiveStageActiveFor = function (isShort) {
                if (isShort === void 0) { isShort = false; }
                var milliSeconds = this._businessProcessFlowWrapper.delegates.getActiveStageActiveFor();
                if (isShort) {
                    return this._getHumanTimeFormatFromMilliseconds(milliSeconds, true);
                }
                return this.getActiveForStatus(this._getHumanTimeFormatFromMilliseconds(milliSeconds, false));
            };
            ProcessControlManager.prototype.getBpfInstanceActiveFor = function () {
                var milliSeconds = this._businessProcessFlowWrapper.delegates.getBpfInstanceActiveFor();
                if (ProcessControlManager.Instance.isBusinessProcessCompleted() ||
                    ProcessControlManager.Instance.isBusinessProcessAborted()) {
                    return this.getBpfInstanceCompletedIn();
                }
                return this.getActiveForStatus(this._getHumanTimeFormatFromMilliseconds(milliSeconds, false));
            };
            ProcessControlManager.prototype.getActiveForStatus = function (time) {
                if (time === null) {
                    return Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.ActiveForLessThanOneMinute);
                }
                else {
                    return MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.ActiveDurationIn), time);
                }
            };
            ProcessControlManager.prototype.getBpfInstanceCompletedIn = function () {
                var milliSeconds = this._businessProcessFlowWrapper.delegates.getBpfInstanceCompletedIn();
                var time = this._getHumanTimeFormatFromMilliseconds(milliSeconds, false);
                if (ProcessControlManager.Instance.isBusinessProcessAborted()) {
                    if (time === null) {
                        return MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.AbortedAfterLessThanOneMinute));
                    }
                    return MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.AbortedIn), time);
                }
                if (time === null) {
                    return MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.CompletedInLessThanOneMinute));
                }
                return MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.CompletedIn), time);
            };
            ProcessControlManager.prototype.setNarratorNotification = function (message) {
                this._alertMessage = message;
                var id = this.contextManager.getUniqueId(Containers.ControlMode.breadCrumb, Containers.StyleHelper.processControlAlertContainer);
                var element = document.getElementById(id);
                element.innerText = this._alertMessage;
            };
            ProcessControlManager.prototype.isCrossEntityNavigation = function (isMoveNext) {
                var currentStageRelatedEntityReference = ProcessControlManager.Instance.getStageRelatedEntityReference(ProcessControlManager.Instance.getActiveStageId());
                var nextStage = isMoveNext ? this.getNextStage().id : this.getPreviousStage().id;
                var nextStageRelatedEntityReference = this.getStageRelatedEntityReference(nextStage);
                return (currentStageRelatedEntityReference &&
                    nextStageRelatedEntityReference &&
                    currentStageRelatedEntityReference.LogicalName !== nextStageRelatedEntityReference.LogicalName);
            };
            ProcessControlManager.prototype._getHumanTimeFormatFromMilliseconds = function (milliseconds, isShort) {
                var message = "";
                var minutes = Math.floor(milliseconds / (1000 * 60));
                var hours = Math.floor(milliseconds / (1000 * 60 * 60));
                var days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
                var months = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 30));
                var years = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 365));
                var minuteString = minutes != 1
                    ? Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.Minutes)
                    : Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.Minute);
                var hourString = hours != 1
                    ? Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.Hours)
                    : Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.Hour);
                var dayString = days != 1
                    ? Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.Days)
                    : Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.Day);
                var monthString = Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.Months);
                var yearString = Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.Years);
                if (minutes <= 0) {
                    message = isShort
                        ? MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.DurationLessThanOneMinute), "<")
                        : null;
                }
                else if (minutes > 0 && minutes <= 60) {
                    message = isShort
                        ? MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.DurationInMinutes), minutes)
                        : MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.HumanTimeFormat), minutes, minuteString);
                }
                else if (hours >= 1 && hours <= 72) {
                    message = isShort
                        ? MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.DurationInHours), hours)
                        : MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.HumanTimeFormat), hours, hourString);
                }
                else if (days >= 3 && days <= 90) {
                    message = isShort
                        ? MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.DurationInDays), days)
                        : MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.HumanTimeFormat), days, dayString);
                }
                else if (months >= 3 && months <= 36) {
                    message = isShort
                        ? MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.DurationInMonths), months)
                        : MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.HumanTimeFormat), months, monthString);
                }
                else {
                    message = isShort
                        ? MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.DurationInYears), years)
                        : MscrmCommon.ControlUtils.String.Format(Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.HumanTimeFormat), years, yearString);
                }
                return message;
            };
            ProcessControlManager.prototype.getBpfNavigationBehavior = function () {
                return (this._businessProcessFlowWrapper.delegates.getBpfNavigationBehavior());
            };
            ProcessControlManager.prototype.getCurrentStage = function () {
                return this._businessProcessFlowWrapper.delegates.getActiveStage();
            };
            ProcessControlManager.prototype.getTelemetryParams = function () {
                var eventParams = [];
                try {
                    if (!this._businessProcessFlowWrapper) {
                        var BusinessprocessWrapper = {
                            name: "BusinessprocessWrapper",
                            value: "Not available",
                        };
                        eventParams.push(BusinessprocessWrapper);
                        return eventParams;
                    }
                    var currentEntity = this._businessProcessFlowWrapper.currentEntity && this._businessProcessFlowWrapper.currentEntity.LogicalName
                        ? this._businessProcessFlowWrapper.currentEntity.LogicalName
                        : null;
                    var currentEntityId = this._businessProcessFlowWrapper.currentEntity && this._businessProcessFlowWrapper.currentEntity.Id
                        ? this._businessProcessFlowWrapper.currentEntity.Id
                        : Guid.EMPTY.guid;
                    var processId = this._businessProcessFlowWrapper.id
                        ? this._businessProcessFlowWrapper.id
                        : Guid.EMPTY.guid;
                    var processInstanceId = this._businessProcessFlowWrapper.instanceId
                        ? this._businessProcessFlowWrapper.instanceId
                        : Guid.EMPTY.guid;
                    var isCustomControlsPresent = this._businessProcessFlowWrapper.isCustomControlsPresent
                        ? this._businessProcessFlowWrapper.isCustomControlsPresent
                        : false;
                    var ProcessId = {
                        name: "ProcessId",
                        value: Guid.toString(processId),
                    };
                    var ProcessInstanceId = {
                        name: "ProcessInstanceId",
                        value: Guid.toString(processInstanceId),
                    };
                    var CurrentFormEntityType = {
                        name: "CurrentFormEntityType",
                        value: currentEntity,
                    };
                    var CurrentFormEntityId = {
                        name: "CurrentFormEntityId",
                        value: Guid.toString(currentEntityId),
                    };
                    var IsCustomControlsPresent = {
                        name: "IsCustomControlPresent",
                        value: isCustomControlsPresent,
                    };
                    eventParams.push(ProcessId);
                    eventParams.push(ProcessInstanceId);
                    eventParams.push(CurrentFormEntityType);
                    eventParams.push(CurrentFormEntityId);
                    eventParams.push(IsCustomControlsPresent);
                }
                catch (error) { }
                return eventParams;
            };
            ProcessControlManager._instance = null;
            return ProcessControlManager;
        }());
        Containers.ProcessControlManager = ProcessControlManager;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var AccessibilityHelper = (function () {
            function AccessibilityHelper() {
            }
            AccessibilityHelper.determineFirstFocusableAndEditableElementInSubtree = function (element) {
                return AccessibilityHelper._determineFirstFocusableAndEditableElementInSubtree(element);
            };
            AccessibilityHelper._elementIsFocusableByTab = function (element) {
                return AccessibilityHelper._isFocusable(element, true);
            };
            AccessibilityHelper._elementIsEditable = function (element) {
                return (element.tagName.toLowerCase() === "input" ||
                    element.tagName.toLowerCase() === "textarea" ||
                    element.contentEditable === "true");
            };
            AccessibilityHelper._isFocusable = function (element, byTabFocusable) {
                if (byTabFocusable === void 0) { byTabFocusable = false; }
                var canReceiveFocus = false;
                var tabIndex = element.getAttribute("tabindex");
                var minTabIndex = byTabFocusable ? 0 : -1;
                if (["input", "iframe", "button", "select", "textarea"].indexOf(element.tagName.toLowerCase()) >= 0 ||
                    (["a", "area"].indexOf(element.tagName.toLowerCase()) >= 0 && element.getAttribute("href")) ||
                    element.contentEditable === "true" ||
                    (tabIndex != null && !isNaN(+tabIndex) && Number(tabIndex) >= minTabIndex)) {
                    canReceiveFocus = true;
                }
                if (!AccessibilityHelper._elementIsVisible(element) || AccessibilityHelper._elementIsDisabled(element)) {
                    canReceiveFocus = false;
                }
                return canReceiveFocus;
            };
            AccessibilityHelper._elementIsVisible = function (element) {
                return (!element.hidden &&
                    (element.offsetWidth || element.offsetHeight || element.getClientRects().length) &&
                    (!element.style || (element.style.visibility !== "hidden" && element.style.visibility !== "collapse")));
            };
            AccessibilityHelper._elementIsDisabled = function (element) {
                return element.hasAttribute("disabled");
            };
            AccessibilityHelper._determineFirstFocusableAndEditableElementInSubtree = function (element, firstEditableElement, firstFocusableElement) {
                if (firstEditableElement === void 0) { firstEditableElement = null; }
                if (firstFocusableElement === void 0) { firstFocusableElement = null; }
                if (element) {
                    if (AccessibilityHelper._elementIsFocusableByTab(element)) {
                        if (AccessibilityHelper._elementIsEditable(element) && !firstEditableElement) {
                            firstEditableElement = element;
                        }
                        if (!firstFocusableElement) {
                            firstFocusableElement = element;
                        }
                    }
                    for (var i = 0; i < element.children.length && (!firstEditableElement || !firstFocusableElement); i++) {
                        var childElement = element.children.item(i);
                        var _a = AccessibilityHelper._determineFirstFocusableAndEditableElementInSubtree(childElement, firstEditableElement, firstFocusableElement), focusableElement = _a.focusableElement, editableElement = _a.editableElement;
                        if (!firstEditableElement) {
                            firstEditableElement = editableElement;
                        }
                        if (!firstFocusableElement) {
                            firstFocusableElement = focusableElement;
                        }
                    }
                }
                return { focusableElement: firstFocusableElement, editableElement: firstEditableElement };
            };
            AccessibilityHelper.addDockedNotification = false;
            return AccessibilityHelper;
        }());
        Containers.AccessibilityHelper = AccessibilityHelper;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var BusinessProcessFlowInstanceState;
(function (BusinessProcessFlowInstanceState) {
    BusinessProcessFlowInstanceState[BusinessProcessFlowInstanceState["Active"] = 0] = "Active";
    BusinessProcessFlowInstanceState[BusinessProcessFlowInstanceState["Inactive"] = 1] = "Inactive";
})(BusinessProcessFlowInstanceState || (BusinessProcessFlowInstanceState = {}));
var BusinessProcessFlowInstanceStatus;
(function (BusinessProcessFlowInstanceStatus) {
    BusinessProcessFlowInstanceStatus[BusinessProcessFlowInstanceStatus["Active"] = 1] = "Active";
    BusinessProcessFlowInstanceStatus[BusinessProcessFlowInstanceStatus["Finished"] = 2] = "Finished";
    BusinessProcessFlowInstanceStatus[BusinessProcessFlowInstanceStatus["Aborted"] = 3] = "Aborted";
})(BusinessProcessFlowInstanceStatus || (BusinessProcessFlowInstanceStatus = {}));
var BusinessProcessFlowStageStatus;
(function (BusinessProcessFlowStageStatus) {
    BusinessProcessFlowStageStatus[BusinessProcessFlowStageStatus["Active"] = 0] = "Active";
    BusinessProcessFlowStageStatus[BusinessProcessFlowStageStatus["Inactive"] = 1] = "Inactive";
    BusinessProcessFlowStageStatus[BusinessProcessFlowStageStatus["Completed"] = 2] = "Completed";
})(BusinessProcessFlowStageStatus || (BusinessProcessFlowStageStatus = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var ControlMode;
        (function (ControlMode) {
            ControlMode[ControlMode["breadCrumb"] = 0] = "breadCrumb";
            ControlMode[ControlMode["stage"] = 1] = "stage";
        })(ControlMode = Containers.ControlMode || (Containers.ControlMode = {}));
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var DisplayState;
        (function (DisplayState) {
            DisplayState[DisplayState["collapsed"] = 0] = "collapsed";
            DisplayState[DisplayState["expanded"] = 1] = "expanded";
            DisplayState[DisplayState["floating"] = 2] = "floating";
        })(DisplayState = Containers.DisplayState || (Containers.DisplayState = {}));
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var FlyoutTabbingHelper = (function () {
            function FlyoutTabbingHelper() {
            }
            FlyoutTabbingHelper.addCircularTabbing = function (event, elementId) {
                var element = event.target;
                var container = document.getElementById(elementId);
                if (!container) {
                    return;
                }
                var tabbableElements = container.querySelectorAll("[tabindex='0'], textarea:enabled, button:enabled, object:enabled");
                if (!tabbableElements || tabbableElements.length === 0) {
                    return;
                }
                var nextFocusElement = null;
                if (event.shiftKey) {
                    if (element.id === tabbableElements[0].id) {
                        nextFocusElement = tabbableElements[tabbableElements.length - 1];
                    }
                }
                else {
                    if (element.id === tabbableElements[tabbableElements.length - 1].id) {
                        nextFocusElement = tabbableElements[0];
                    }
                }
                if (nextFocusElement) {
                    nextFocusElement.focus();
                    event.preventDefault();
                }
            };
            return FlyoutTabbingHelper;
        }());
        Containers.FlyoutTabbingHelper = FlyoutTabbingHelper;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var ProcessControlIconSymbol;
        (function (ProcessControlIconSymbol) {
            ProcessControlIconSymbol[ProcessControlIconSymbol["Dock"] = 1] = "Dock";
            ProcessControlIconSymbol[ProcessControlIconSymbol["Previous"] = 2] = "Previous";
            ProcessControlIconSymbol[ProcessControlIconSymbol["Next"] = 3] = "Next";
            ProcessControlIconSymbol[ProcessControlIconSymbol["Close"] = 4] = "Close";
            ProcessControlIconSymbol[ProcessControlIconSymbol["Flag"] = 5] = "Flag";
            ProcessControlIconSymbol[ProcessControlIconSymbol["CheckMark"] = 6] = "CheckMark";
            ProcessControlIconSymbol[ProcessControlIconSymbol["Locked"] = 7] = "Locked";
            ProcessControlIconSymbol[ProcessControlIconSymbol["ActiveStageIndicatorLeft"] = 8] = "ActiveStageIndicatorLeft";
            ProcessControlIconSymbol[ProcessControlIconSymbol["ActiveStageIndicatorRight"] = 9] = "ActiveStageIndicatorRight";
            ProcessControlIconSymbol[ProcessControlIconSymbol["CreateNew"] = 10] = "CreateNew";
            ProcessControlIconSymbol[ProcessControlIconSymbol["Completed"] = 11] = "Completed";
            ProcessControlIconSymbol[ProcessControlIconSymbol["None"] = 12] = "None";
            ProcessControlIconSymbol[ProcessControlIconSymbol["Failure"] = 13] = "Failure";
        })(ProcessControlIconSymbol = Containers.ProcessControlIconSymbol || (Containers.ProcessControlIconSymbol = {}));
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var ResourceStrings = (function () {
            function ResourceStrings() {
            }
            ResourceStrings.getResourceString = function (resource) {
                var context = Containers.ProcessControlManager.Instance.contextManager.context(false, Containers.ControlMode.breadCrumb);
                if (!context) {
                    return resource;
                }
                return context.resources.getString(resource);
            };
            ResourceStrings.AbandonedStage = "ProcessControl_AbandonedStage";
            ResourceStrings.AbortedAfterLessThanOneMinute = "ProcessControl_Progress_AbortedAfterLessThanOneMinute";
            ResourceStrings.AbortedIn = "ProcessControl_Progress_AbortedInTime";
            ResourceStrings.ActiveForLessThanOneMinute = "ProcessControl_Progress_ActiveForLessThanOneMinute";
            ResourceStrings.ActiveDurationIn = "ProcessControl_Progress_ActiveDurationIn";
            ResourceStrings.Advance = "ProcessControl_Advance";
            ResourceStrings.Back = "ProcessControl_Back";
            ResourceStrings.BusinessProcessFlow = "BusinessProcessFlow";
            ResourceStrings.BusinessProcessFlowShortcut = "BusinessProcessFlowShortcut";
            ResourceStrings.InactiveProcess = "ProcessControl_Warnings_ProcessIsNotActive";
            ResourceStrings.Close = "ProcessControl_Close";
            ResourceStrings.Completed = "ProcessControl_CompletedStage";
            ResourceStrings.CompletedIn = "ProcessControl_Progress_CompletedInTime";
            ResourceStrings.CompletedInLessThanOneMinute = "ProcessControl_Progress_CompletedInLessThanOneMinute";
            ResourceStrings.CreateNew = "ProcessControl_CreateNew";
            ResourceStrings.Day = "ProcessControl_Progress_Day";
            ResourceStrings.Days = "ProcessControl_Progress_Days";
            ResourceStrings.DurationInDays = "ProcessControl_Progress_DurationInDays";
            ResourceStrings.DurationInHours = "ProcessControl_Progress_DurationInHours";
            ResourceStrings.DurationInMinutes = "ProcessControl_Progress_DurationInMinutes";
            ResourceStrings.DurationInMonths = "ProcessControl_Progress_DurationInMonths";
            ResourceStrings.DurationInWeeks = "ProcessControl_Progress_DurationInWeeks";
            ResourceStrings.DurationInYears = "ProcessControl_Progress_DurationInYears";
            ResourceStrings.DurationLessThanOneMinute = "ProcessControl_Progress_DurationLessThanOneMinute";
            ResourceStrings.Finish = "ProcessControl_Finish";
            ResourceStrings.Finished = "ProcessControl_Finished";
            ResourceStrings.Hour = "ProcessControl_Progress_Hour";
            ResourceStrings.Hours = "ProcessControl_Progress_Hours";
            ResourceStrings.HumanTimeFormat = "ProcessControl_Progress_HumanTimeFormat";
            ResourceStrings.Inactive = "ProcessControl_InactiveStage";
            ResourceStrings.Locked = "ProcessControl_LockedStage";
            ResourceStrings.Minute = "ProcessControl_Progress_Minute";
            ResourceStrings.Minutes = "ProcessControl_Progress_Minutes";
            ResourceStrings.Months = "ProcessControl_Progress_Months";
            ResourceStrings.MoveToTheLeft = "ProcessControl_MoveToTheLeft";
            ResourceStrings.MoveToTheRight = "ProcessControl_MoveToTheRight";
            ResourceStrings.DisabledTextForNavigationButtons = "ProcessControl_Disabled";
            ResourceStrings.NoRecordsFound = "Sales_ProcessControl_NoRecords";
            ResourceStrings.NarratorNotification = "ProcessControl_NarratorNotification";
            ResourceStrings.Pin = "ProcessControl_Pin";
            ResourceStrings.RequiredStepWarningMesage = "ProcessControl_RequiredStepWarningBar";
            ResourceStrings.SelectChild = "Sales_ProcessControl_SelectChild";
            ResourceStrings.SetActive = "ProcessControl_SetActive";
            ResourceStrings.Stage = "Sales_ProcessControl_Stage";
            ResourceStrings.StageFlyoutDocked = "StageFlyoutDocked";
            ResourceStrings.StageStatusTitleTemplate = "StageStatusTitleTemplate";
            ResourceStrings.Weeks = "ProcessControl_Progress_Weeks";
            ResourceStrings.Years = "ProcessControl_Progress_Years";
            ResourceStrings.ProcessingActionStepData = "Processing_ActionStep_Data";
            ResourceStrings.ActionStepExecute = "ActionStep_Execute";
            ResourceStrings.ProcessingFlowStepData = "Processing_FlowStep_Data";
            ResourceStrings.FlowStepExecute = "FlowStep_Execute";
            return ResourceStrings;
        }());
        Containers.ResourceStrings = ResourceStrings;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var crossEntityFlyoutHeight = 180;
        var CrossEntityFlyout = (function () {
            function CrossEntityFlyout() {
                this._flyoutContainer = new Containers.CrossEntityFlyoutContainer();
            }
            CrossEntityFlyout.prototype.render = function (relativeToElementId) {
                var crossEntityFlyoutDirection = Containers.StyleHelper.isEnoughSpaceAvailableForFlyout("nextButtonContainer", Containers.ControlMode.stage, crossEntityFlyoutHeight)
                    ? 3
                    : 2;
                this._manageFocus();
                return Containers.ProcessControlManager.Instance.contextManager.context().factory.createElement("FLYOUT", {
                    id: "" + CrossEntityFlyout.crossEntityFlyoutContainerKey,
                    key: "" + CrossEntityFlyout.crossEntityFlyoutContainerKey,
                    flyoutStyle: {
                        boxShadow: Containers.ProcessControlManager.Instance.contextManager.context().theming.shadows.shadow01,
                    },
                    flyoutDirection: crossEntityFlyoutDirection,
                    positionType: "relative",
                    relativeToElementId: relativeToElementId,
                    size: {
                        width: Containers.StyleHelper.getCrossEntityFlyoutWidth(),
                        height: crossEntityFlyoutHeight,
                    },
                }, this._flyoutContainer.render(relativeToElementId));
            };
            CrossEntityFlyout.prototype._manageFocus = function () {
                window.setTimeout(function () {
                    var id = Containers.ProcessControlManager.Instance.contextManager.getUniqueId(Containers.ControlMode.stage, CrossEntityFlyout.crossEntityFlyoutContainerKey);
                    var element = document.getElementById(id);
                    if (element) {
                        var tabbableElements = element.querySelectorAll("[tabindex='0']");
                        if (!tabbableElements || tabbableElements.length === 0) {
                            return;
                        }
                        tabbableElements[0].focus();
                    }
                }, 100);
            };
            CrossEntityFlyout.crossEntityFlyoutContainerKey = "processCrossEntityFlyout";
            return CrossEntityFlyout;
        }());
        Containers.CrossEntityFlyout = CrossEntityFlyout;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var processCrossEntityFlyoutcontainerName = "processCrossEntityFlyoutContainer";
        var CrossEntityFlyoutContainer = (function () {
            function CrossEntityFlyoutContainer() {
                this._flyoutHeaderContainer = new Containers.CrossEntityFlyoutHeaderContainer();
                this._flyoutItemsContainer = new Containers.CrossEntityFlyoutItemsContainer();
                this._flyoutFooterContainer = new Containers.CrossEntityFlyoutFooterContainer();
            }
            CrossEntityFlyoutContainer.prototype.render = function (relativeToElementId) {
                this._relativeToElementId = relativeToElementId;
                return Containers.ProcessControlManager.Instance.contextManager.context().factory.createElement("CONTAINER", {
                    key: "" + processCrossEntityFlyoutcontainerName,
                    id: "" + processCrossEntityFlyoutcontainerName,
                    onKeyDown: this._keyDownHandler.bind(this),
                    style: {
                        backgroundColor: Containers.StyleHelper.getShade(Shades.WhiteBackGround),
                        flexDirection: "column",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        overflowX: "hidden",
                        borderColor: Containers.StyleHelper.getShade(Shades.Grey2),
                        width: Containers.StyleHelper.getCrossEntityFlyoutWidth(),
                        maxWidth: Containers.StyleHelper.getCrossEntityFlyoutWidth(),
                    },
                }, [
                    this._flyoutHeaderContainer.render(),
                    this._flyoutItemsContainer.render(),
                    this._flyoutFooterContainer.render(),
                ]);
            };
            CrossEntityFlyoutContainer.prototype._keyDownHandler = function (event) {
                switch (event.keyCode) {
                    case 27:
                        this._closeCrossEntityFlyoutHandler();
                        break;
                    case 9:
                        Containers.FlyoutTabbingHelper.addCircularTabbing(event, Containers.ProcessControlManager.Instance.contextManager.getUniqueId(Containers.ControlMode.stage, Containers.CrossEntityFlyout.crossEntityFlyoutContainerKey));
                        break;
                }
            };
            CrossEntityFlyoutContainer.prototype._closeCrossEntityFlyoutHandler = function () {
                var _this = this;
                Containers.ProcessControlManager.Instance.setCrossEntityDisplayState(Containers.DisplayState.collapsed);
                Containers.ProcessControlManager.Instance.contextManager.context().utils.requestRender();
                window.setTimeout(function () {
                    var id = Containers.ProcessControlManager.Instance.contextManager.getUniqueId(Containers.ControlMode.stage, _this._relativeToElementId);
                    var element = document.getElementById(id);
                    if (element) {
                        element.focus();
                    }
                }, 100);
            };
            return CrossEntityFlyoutContainer;
        }());
        Containers.CrossEntityFlyoutContainer = CrossEntityFlyoutContainer;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var PROCESS_CROSS_ENTITY_FLYOUT_FOOTER_CONTAINER_NAME = "processCrossEntityFlyoutFooterContainer";
        var CreateNewContainerKey = "CreateNewContainer";
        var CreateNewIcon = "CreateNewIcon";
        var CancelContainerKey = "CancelContainer";
        var CrossEntityFlyoutFooterContainer = (function () {
            function CrossEntityFlyoutFooterContainer() {
                this.flyoutCreateIcon = new Containers.ProcessControlIcon();
            }
            CrossEntityFlyoutFooterContainer.prototype.render = function () {
                return Containers.ProcessControlManager.Instance.contextManager.context().factory.createElement("CONTAINER", {
                    id: "" + PROCESS_CROSS_ENTITY_FLYOUT_FOOTER_CONTAINER_NAME,
                    key: "" + PROCESS_CROSS_ENTITY_FLYOUT_FOOTER_CONTAINER_NAME,
                    style: {
                        flexDirection: "row",
                        color: Containers.StyleHelper.getShade(Shades.MainThemeDark),
                        justifyContent: Containers.ProcessControlManager.Instance.forwardNavigationEntitiesData.showCreate === false
                            ? "flex-end"
                            : "space-between",
                        padding: "5px",
                    },
                }, [this._renderCreateNew(), this._renderCancel()]);
            };
            CrossEntityFlyoutFooterContainer.prototype._renderCancel = function () {
                return Containers.ProcessControlManager.Instance.contextManager.context().factory.createElement("BUTTON", {
                    key: CancelContainerKey,
                    id: CancelContainerKey,
                    tabIndex: 0,
                    role: "button",
                    accessibilityLabel: Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.Close),
                    style: {
                        cursor: "pointer",
                        color: "inherit",
                        backgroundColor: "inherit",
                        border: "none",
                    },
                    onClick: function (event) {
                        Containers.ProcessControlManager.Instance.setCrossEntityDisplayState(Containers.DisplayState.collapsed);
                        Containers.ProcessControlManager.Instance.contextManager.context().utils.requestRender();
                    },
                    onKeyDown: function (event) {
                        var element = event.currentTarget;
                        switch (event.keyCode) {
                            case 13:
                                element.click();
                                break;
                        }
                    },
                }, Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.Close));
            };
            CrossEntityFlyoutFooterContainer.prototype._renderCreateNew = function () {
                var _this = this;
                var description = Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.CreateNew);
                if (!description || description.trim().length === 0) {
                    return null;
                }
                var currentStage = Containers.ProcessControlManager.Instance.getCurrentStage();
                var allowCreateNew = Containers.ProcessControlManager.Instance.getBpfNavigationBehavior().allowCreateNew
                    ? Containers.ProcessControlManager.Instance.getBpfNavigationBehavior().allowCreateNew(currentStage)
                    : true;
                if (Containers.ProcessControlManager.Instance.forwardNavigationEntitiesData.showCreate === false ||
                    allowCreateNew === false) {
                    return null;
                }
                var createNewIconStyle = {
                    padding: Containers.ProcessControlManager.Instance.contextManager.context().client.isRTL ? "2px 0 0 5px" : "2px 5px 0 0",
                };
                return Containers.ProcessControlManager.Instance.contextManager.context().factory.createElement("BUTTON", {
                    key: CreateNewContainerKey,
                    id: CreateNewContainerKey,
                    tabIndex: 0,
                    role: "button",
                    accessibilityLabel: description,
                    style: {
                        cursor: "pointer",
                        color: "inherit",
                        backgroundColor: "inherit",
                        border: "none",
                    },
                    onClick: function (event) {
                        _this._createNewClickHandler();
                    },
                    onKeyDown: function (event) {
                        var element = event.currentTarget;
                        switch (event.keyCode) {
                            case 13:
                                element.click();
                                break;
                        }
                    },
                }, [
                    this.flyoutCreateIcon.render(CreateNewIcon, Containers.ProcessControlIconSymbol.CreateNew, function () { }, createNewIconStyle),
                    description,
                ]);
            };
            CrossEntityFlyoutFooterContainer.prototype._createNewClickHandler = function () {
                var nextStage = Containers.ProcessControlManager.Instance.getNextStage();
                if (!nextStage || !nextStage.id) {
                    return;
                }
                var nextEntityLogicalName = nextStage.entityName;
                var nextStageId = nextStage.id.guid.toString();
                var processInstanceId = Containers.ProcessControlManager.Instance.getBPFInstanceId().guid.toString();
                var processId = Containers.ProcessControlManager.Instance.getBPFId().guid.toString();
                var currentEntity = Containers.ProcessControlManager.Instance.getCurrentEntity();
                var quickCreateFormOptions = {
                    entityName: nextEntityLogicalName,
                    useQuickCreateForm: true,
                    isCrossEntityNavigate: true,
                    createFromEntity: {
                        id: currentEntity.Id.toString(),
                        entityType: currentEntity.LogicalName,
                        name: currentEntity.Name,
                    },
                };
                var parameters = {
                    processId: processId,
                    processInstanceId: processInstanceId,
                    nextStageId: nextStageId,
                };
                Containers.ProcessControlManager.Instance.setDisplayState(Containers.DisplayState.collapsed);
                Containers.ProcessControlManager.Instance.contextManager
                    .context()
                    .navigation.openForm(quickCreateFormOptions, parameters)
                    .then(function (response) {
                    if (!response ||
                        !response.savedEntityReference ||
                        response.savedEntityReference.length === 0 ||
                        !response.savedEntityReference[0].id ||
                        Guid.equals(Guid.tryParseOrNull(response.savedEntityReference[0].id), Guid.EMPTY)) {
                        return;
                    }
                    var entity = Containers.ProcessControlManager.Instance.getCurrentEntity();
                    if (currentEntity.Id.toString() !== entity.Id.toString()) {
                        return;
                    }
                    var nextEntity = {
                        Id: response.savedEntityReference[0].id,
                        LogicalName: response.savedEntityReference[0].entityType,
                        Name: response.savedEntityReference[0].name,
                    };
                    Containers.ProcessControlManager.Instance.getNavigateToNextEntityPromise(nextEntity).then(function (response) {
                        var formOptions = {
                            entityName: nextEntity.LogicalName,
                            entityId: nextEntity.Id.toString(),
                        };
                        var parameters = {
                            processId: processId,
                            processInstanceId: processInstanceId,
                        };
                        Containers.ProcessControlManager.Instance.contextManager.context().navigation.openForm(formOptions, parameters);
                    });
                }, null);
            };
            return CrossEntityFlyoutFooterContainer;
        }());
        Containers.CrossEntityFlyoutFooterContainer = CrossEntityFlyoutFooterContainer;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var PROCESS_CONTROL_CROSS_ENTITY_FLYOUT_HEADER_CONTAINER_NAME = "processCrossEntityFlyoutHeaderContainer";
        var CrossEntityFlyoutHeaderContainer = (function () {
            function CrossEntityFlyoutHeaderContainer() {
            }
            CrossEntityFlyoutHeaderContainer.prototype.render = function () {
                var title = Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.SelectChild) + " " + Containers.ProcessControlManager.Instance.forwardNavigationEntitiesData.entityDisplayName;
                return Containers.ProcessControlManager.Instance.contextManager.context().factory.createElement("CONTAINER", {
                    id: "" + PROCESS_CONTROL_CROSS_ENTITY_FLYOUT_HEADER_CONTAINER_NAME,
                    key: "" + PROCESS_CONTROL_CROSS_ENTITY_FLYOUT_HEADER_CONTAINER_NAME,
                    style: {
                        flexDirection: "row",
                        margin: "5px",
                    },
                }, [this._renderFlyoutTitle(title)]);
            };
            CrossEntityFlyoutHeaderContainer.prototype._renderFlyoutTitle = function (title) {
                if (!title || title.trim().length === 0) {
                    return null;
                }
                var flyoutTitleLabelName = "processCrossEntityFlyoutTitleLabel";
                var flyoutTitleLabel = new Containers.ProcessHeaderNameLabel();
                return flyoutTitleLabel.render(flyoutTitleLabelName, title, {
                    id: flyoutTitleLabelName,
                    key: flyoutTitleLabelName,
                    style: {
                        color: Containers.StyleHelper.getShade(Shades.Grey7),
                        fontSize: "1em",
                        fontWeight: "600",
                        width: "90%",
                        margin: "0px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        minHeight: "20px",
                    },
                });
            };
            return CrossEntityFlyoutHeaderContainer;
        }());
        Containers.CrossEntityFlyoutHeaderContainer = CrossEntityFlyoutHeaderContainer;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var crossEntityItemContainer = "processCrossEntityItemContainer";
        var crossEntityItem = "processCrossEntityItem";
        var CrossEntityItem = (function () {
            function CrossEntityItem() {
            }
            CrossEntityItem.prototype.render = function (navigationEntity, idNumber) {
                var label = Containers.ProcessControlManager.Instance.contextManager.context().factory.createElement("LABEL", {
                    id: "" + crossEntityItem,
                    key: "" + crossEntityItem,
                    style: {
                        width: "inherit",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        cursor: "inherit",
                        verticalAlign: "baseline",
                    },
                }, navigationEntity.primaryField);
                var iconProps = {
                    style: {
                        color: Containers.StyleHelper.getShade(Shades.Grey7),
                        fontSize: "16px",
                        verticalAlign: "sub",
                        paddingLeft: Containers.ProcessControlManager.Instance.contextManager.context().theming.measures.measure050,
                        paddingRight: Containers.ProcessControlManager.Instance.contextManager.context().theming.measures.measure100,
                    },
                    type: navigationEntity.entityLogicalName,
                };
                var icon = Containers.ProcessControlManager.Instance.contextManager
                    .context()
                    .factory.createElement("ENTITYICON", iconProps);
                return Containers.ProcessControlManager.Instance.contextManager.context().factory.createElement("LISTITEM", {
                    key: crossEntityItemContainer + "_" + idNumber,
                    id: crossEntityItemContainer + "_" + idNumber,
                    style: {
                        cursor: "pointer",
                        width: "100%",
                        paddingTop: "0.5em",
                        paddingBottom: "0.5em",
                        height: "auto",
                        minHeight: "20px",
                        textOverflow: "ellipsis",
                        overflowX: "hidden",
                        color: Containers.StyleHelper.getShade(Shades.Grey5),
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        ":hover": {
                            backgroundColor: Containers.StyleHelper.getShade(Shades.Grey1),
                        },
                        ":focus": {
                            backgroundColor: Containers.StyleHelper.getShade(Shades.Grey3),
                        },
                    },
                    accessibilityLabel: navigationEntity.primaryField,
                    tabIndex: 0,
                    onClick: this._clickHandler.bind(this, navigationEntity),
                    role: "option",
                    onKeyDown: function (event) {
                        var element = event.currentTarget;
                        switch (event.keyCode) {
                            case 13:
                                element.click();
                                break;
                        }
                    },
                }, Containers.ProcessControlManager.Instance.contextManager.context().client.isRTL ? [label, icon] : [icon, label]);
            };
            CrossEntityItem.prototype._clickHandler = function (navigationEntity) {
                var navigationEntityReference = {
                    Id: navigationEntity.id.guid,
                    LogicalName: navigationEntity.entityLogicalName,
                    Name: navigationEntity.entityLogicalName,
                };
                Containers.ProcessControlManager.Instance.getNavigateToNextEntityPromise(navigationEntityReference).then(function (response) {
                    Containers.ProcessControlManager.Instance.setCrossEntityDisplayState(Containers.DisplayState.collapsed);
                    var formOptions = {
                        entityName: navigationEntityReference.LogicalName,
                        entityId: navigationEntityReference.Id.toString(),
                    };
                    Containers.ProcessControlManager.Instance.contextManager.context().navigation.openForm(formOptions);
                });
            };
            return CrossEntityItem;
        }());
        Containers.CrossEntityItem = CrossEntityItem;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var CrossEntityFlyoutItemsContainerKey = "processCrossEntityFlyoutItems";
        var NoRecordsFoundKey = "NoRecordsFoundKey";
        var NoRecordsFoundKeyContainer = "NoRecordsFoundKeyContainer";
        var CrossEntityFlyoutItemsContainer = (function () {
            function CrossEntityFlyoutItemsContainer() {
            }
            CrossEntityFlyoutItemsContainer.prototype.render = function () {
                var crossEntityItems = [];
                Containers.ProcessControlManager.Instance.forwardNavigationEntitiesData.navigationEntities.forEach(function (currentNavigationEntity, index) {
                    crossEntityItems.push(new Containers.CrossEntityItem().render(currentNavigationEntity, index));
                });
                if (crossEntityItems.length > 0) {
                    return Containers.ProcessControlManager.Instance.contextManager.context().factory.createElement("SCROLLCONTAINER", {
                        id: "" + CrossEntityFlyoutItemsContainerKey,
                        key: "" + CrossEntityFlyoutItemsContainerKey,
                        style: this._getStyle(CrossEntityFlyoutItemsContainerKey),
                    }, crossEntityItems);
                }
                else {
                    var label = Containers.ProcessControlManager.Instance.contextManager.context().factory.createElement("LABEL", {
                        id: "" + NoRecordsFoundKey,
                        key: "" + NoRecordsFoundKey,
                        style: this._getStyle(NoRecordsFoundKey),
                    }, Containers.ResourceStrings.getResourceString(Containers.ResourceStrings.NoRecordsFound));
                    return Containers.ProcessControlManager.Instance.contextManager.context().factory.createElement("CONTAINER", {
                        id: "" + NoRecordsFoundKeyContainer,
                        key: "" + NoRecordsFoundKeyContainer,
                        style: this._getStyle(NoRecordsFoundKeyContainer),
                    }, label);
                }
            };
            CrossEntityFlyoutItemsContainer.prototype._getStyle = function (key) {
                var style = {};
                if (key === CrossEntityFlyoutItemsContainerKey) {
                    style.height = "10.5em";
                    style.borderStyle = "solid";
                    style.borderBottomWidth = "1px";
                    style.borderBottomColor = Containers.StyleHelper.getShade(Shades.Grey2);
                    style.overflowY = "auto";
                    style.flexDirection = "column";
                    style.justifyContent = "flex-start";
                    style.flexWrap = "nowrap";
                    style.listStyleType = "none";
                }
                else if (key === NoRecordsFoundKey) {
                    style.width = Containers.StyleHelper.getCrossEntityFlyoutWidth() - 12;
                    style.overflow = "hidden";
                    style.textOverflow = "ellipsis";
                }
                else if (key === NoRecordsFoundKeyContainer) {
                    style.borderBottomStyle = "solid";
                    style.padding = "5px";
                    style.borderBottomWidth = "1px";
                    style.borderBottomColor = Containers.StyleHelper.getShade(Shades.Grey2);
                    style.borderStyle = "solid";
                    style.height = "10.5em";
                }
                return style;
            };
            return CrossEntityFlyoutItemsContainer;
        }());
        Containers.CrossEntityFlyoutItemsContainer = CrossEntityFlyoutItemsContainer;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var ProcessControlIcon = (function () {
            function ProcessControlIcon() {
                this._iconsMap = {
                    1: {
                        symbol: "\uE93A",
                    },
                    2: {
                        symbol: "\uE973",
                    },
                    3: {
                        symbol: "\uE974",
                    },
                    4: {
                        symbol: "\uE711",
                    },
                    5: {
                        symbol: "\uE7C1",
                    },
                    6: {
                        symbol: "\uE73E",
                    },
                    7: {
                        symbol: "\uE72E",
                    },
                    8: {
                        symbol: "\uF08D",
                    },
                    9: {
                        symbol: "\uF08F",
                    },
                    10: {
                        symbol: "\uE710",
                    },
                    11: {
                        symbol: "\uE8FB",
                    },
                    12: {
                        symbol: "",
                    },
                    13: {
                        symbol: "\uEA39",
                    },
                };
            }
            ProcessControlIcon.prototype.render = function (name, iconSymbol, onClick, style, role, title) {
                if (style === void 0) { style = null; }
                if (role === void 0) { role = ""; }
                if (title === void 0) { title = ""; }
                var properties = {
                    id: "" + name + iconSymbol,
                    key: "" + name + iconSymbol,
                    type: iconSymbol,
                    title: title,
                    role: role,
                    style: {
                        fontSize: "1.125em",
                        fontWeight: "normal",
                    },
                    onClick: onClick,
                };
                if (style) {
                    properties.style = Object.assign({}, properties.style, style);
                }
                properties.style.fontFamily = "Dyn CRM Symbol, Segoe MDL2 Assets";
                properties.style.cursor = "inherit";
                return Containers.ProcessControlManager.Instance.contextManager
                    .context()
                    .factory.createElement("LABEL", properties, this._iconsMap[iconSymbol].symbol);
            };
            return ProcessControlIcon;
        }());
        Containers.ProcessControlIcon = ProcessControlIcon;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var ProcessHeaderNameLabel = (function () {
            function ProcessHeaderNameLabel() {
            }
            ProcessHeaderNameLabel.prototype.render = function (name, label, properties) {
                if (properties) {
                    return Containers.ProcessControlManager.Instance.contextManager
                        .context()
                        .factory.createElement("LABEL", properties, label);
                }
                else {
                    var defaultProperties = {
                        key: name,
                        id: name,
                    };
                    return Containers.ProcessControlManager.Instance.contextManager
                        .context()
                        .factory.createElement("LABEL", defaultProperties, label);
                }
            };
            return ProcessHeaderNameLabel;
        }());
        Containers.ProcessHeaderNameLabel = ProcessHeaderNameLabel;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var Shades;
(function (Shades) {
    Shades[Shades["WhiteBackGround"] = 0] = "WhiteBackGround";
    Shades[Shades["MainThemeColor3"] = 1] = "MainThemeColor3";
    Shades[Shades["MainThemeColor3Text"] = 2] = "MainThemeColor3Text";
    Shades[Shades["MainThemeLight"] = 3] = "MainThemeLight";
    Shades[Shades["MainThemeLightText"] = 4] = "MainThemeLightText";
    Shades[Shades["MainThemeDark"] = 5] = "MainThemeDark";
    Shades[Shades["MainThemeDarkText"] = 6] = "MainThemeDarkText";
    Shades[Shades["AccentLight"] = 7] = "AccentLight";
    Shades[Shades["AccentLightText"] = 8] = "AccentLightText";
    Shades[Shades["AccentDark"] = 9] = "AccentDark";
    Shades[Shades["AccentDarkText"] = 10] = "AccentDarkText";
    Shades[Shades["Green"] = 11] = "Green";
    Shades[Shades["Grey1"] = 12] = "Grey1";
    Shades[Shades["Grey2"] = 13] = "Grey2";
    Shades[Shades["Grey3"] = 14] = "Grey3";
    Shades[Shades["Grey4"] = 15] = "Grey4";
    Shades[Shades["Grey5"] = 16] = "Grey5";
    Shades[Shades["Grey6"] = 17] = "Grey6";
    Shades[Shades["Grey7"] = 18] = "Grey7";
    Shades[Shades["Black"] = 19] = "Black";
    Shades[Shades["Red"] = 20] = "Red";
    Shades[Shades["Transparent"] = 21] = "Transparent";
})(Shades || (Shades = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var StyleHelper = (function () {
            function StyleHelper() {
            }
            Object.defineProperty(StyleHelper, "statusFontFamily", {
                get: function () {
                    return Containers.ProcessControlManager.Instance.contextManager.context().theming.fontfamilies.semilight;
                },
                enumerable: true,
                configurable: true
            });
            StyleHelper.getStatusFontSize = function () {
                return Containers.ProcessControlManager.Instance.isMobileMode() ? "0.85em" : "1em";
            };
            StyleHelper.getprocessNameFontSize = function () {
                return Containers.ProcessControlManager.Instance.isMobileMode() ? "1.125em" : "1em";
            };
            StyleHelper.getShade = function (shade) {
                var context = Containers.ProcessControlManager.Instance.contextManager.context();
                switch (shade) {
                    case Shades.WhiteBackGround:
                        return context.theming.colors.whitebackground;
                    case Shades.AccentLight:
                        return context.theming.colors.accent.accent2.fill;
                    case Shades.AccentLightText:
                        return context.theming.colors.accent.accent2.text;
                    case Shades.AccentDark:
                        return context.theming.colors.accent.accent1.fill;
                    case Shades.AccentDarkText:
                        return context.theming.colors.accent.accent1.text;
                    case Shades.MainThemeColor3:
                        return context.theming.colors.maintheme.maincolor3.fill;
                    case Shades.MainThemeColor3Text:
                        return context.theming.colors.maintheme.maincolor3.text;
                    case Shades.MainThemeLight:
                        return context.theming.colors.maintheme.maincolor2.fill;
                    case Shades.MainThemeLightText:
                        return context.theming.colors.maintheme.maincolor2.text;
                    case Shades.MainThemeDark:
                        return context.theming.colors.maintheme.maincolor1.fill;
                    case Shades.MainThemeDarkText:
                        return context.theming.colors.maintheme.maincolor1.text;
                    case Shades.Green:
                        return context.theming.colors.basecolor.green.green4;
                    case Shades.Grey1:
                        return context.theming.colors.grays.gray01;
                    case Shades.Grey2:
                        return context.theming.colors.grays.gray02;
                    case Shades.Grey3:
                        return context.theming.colors.grays.gray03;
                    case Shades.Grey4:
                        return context.theming.colors.grays.gray04;
                    case Shades.Grey5:
                        return context.theming.colors.grays.gray05;
                    case Shades.Grey6:
                        return context.theming.colors.grays.gray06;
                    case Shades.Grey7:
                        return context.theming.colors.grays.gray07;
                    case Shades.Black:
                        return context.theming.colors.base.black;
                    case Shades.Red:
                        return context.theming.colors.basecolor.red.red2;
                    case Shades.Transparent:
                        return "transparent";
                    default:
                        return context.theming.colors.whitebackground;
                }
            };
            StyleHelper.setCrossEntityFlyoutWidth = function (width) {
                this._crossEntityFlyoutWidth = width;
            };
            StyleHelper.getCrossEntityFlyoutWidth = function () {
                return this._crossEntityFlyoutWidth;
            };
            StyleHelper.getFontSize = function () {
                var bodyElem = document.getElementsByTagName("body");
                var fontSize = 0;
                if (bodyElem && bodyElem.length > 0) {
                    var fontProp = window.getComputedStyle(bodyElem[0], null).getPropertyValue("font-size");
                    fontSize = parseFloat(fontProp) || 0;
                }
                return fontSize;
            };
            StyleHelper.getFlyoutContainerId = function (stageId) {
                return this.headerStageFlyoutContainer + "_" + stageId.guid;
            };
            StyleHelper.isEnoughSpaceAvailableForFlyout = function (elementId, controlMode, flyoutHeight) {
                var heightAvailable;
                var stageButtonContainer = (document.getElementById(Containers.ProcessControlManager.Instance.contextManager.getUniqueId(controlMode, elementId)));
                if (stageButtonContainer) {
                    var stageButtonTopPosition = stageButtonContainer.getBoundingClientRect().top;
                    var stageButtonHeight = stageButtonContainer.offsetHeight;
                    heightAvailable = window.innerHeight - stageButtonTopPosition - stageButtonHeight;
                    return heightAvailable > flyoutHeight;
                }
                return false;
            };
            StyleHelper.getProcessStageListItemId = function (stageId) {
                return "processHeaderStage_" + stageId;
            };
            StyleHelper.scrollIntoView = function (stageId) {
                var breadCrumbContext = Containers.ProcessControlManager.Instance.contextManager.context(false, Containers.ControlMode.breadCrumb);
                var firstElement = document.getElementById(breadCrumbContext.accessibility.getUniqueId(StyleHelper.getProcessStageListItemId(Containers.ProcessControlManager.Instance.getStageIds()[0].guid)));
                var nextElement = document.getElementById(breadCrumbContext.accessibility.getUniqueId(StyleHelper.getProcessStageListItemId(stageId.guid)));
                if (!breadCrumbContext || !firstElement || !nextElement) {
                    return;
                }
                var firstElementClientRect = firstElement.getClientRects();
                var nextElementClientRect = nextElement.getClientRects();
                if (!firstElementClientRect ||
                    firstElementClientRect.length == 0 ||
                    !nextElementClientRect ||
                    nextElementClientRect.length === 0) {
                    return;
                }
                var defaultTop = firstElementClientRect[0].top;
                var newTop = nextElementClientRect[0].top;
                var diff = Math.abs(defaultTop - newTop);
                if (diff !== Math.abs(StyleHelper.top) && Math.abs(diff - Math.abs(StyleHelper.top)) > 5) {
                    StyleHelper.top = diff < 3 ? 0 : defaultTop - newTop;
                    breadCrumbContext.utils.requestRender();
                }
            };
            StyleHelper.addTabIndexes = function (stageId) {
                var breadCrumbContext = Containers.ProcessControlManager.Instance.contextManager.context(false, Containers.ControlMode.breadCrumb);
                if (!breadCrumbContext) {
                    return;
                }
                var firstElement = document.getElementById(breadCrumbContext.accessibility.getUniqueId("processHeaderStage_" + Containers.ProcessControlManager.Instance.getStageIds()[0].guid));
                var defaultElement = document.getElementById(breadCrumbContext.accessibility.getUniqueId("processHeaderStage_" + stageId.guid));
                if (!firstElement || !defaultElement) {
                    return;
                }
                var defaultTopClientRect = firstElement.getClientRects();
                var newTopClientRect = defaultElement.getClientRects();
                if (!defaultTopClientRect ||
                    defaultTopClientRect.length === 0 ||
                    !newTopClientRect ||
                    newTopClientRect.length === 0) {
                    return;
                }
                var defaultTop = defaultTopClientRect[0].top + 2;
                var newTop = newTopClientRect[0].top;
                var diff = Math.abs(defaultTop - newTop);
                var list = document.getElementById(breadCrumbContext.accessibility.getUniqueId(StyleHelper.headerStageContainerName));
                if (!list || !list.children) {
                    return;
                }
                for (var i = 0; i < list.children.length; i++) {
                    var element = list.children.item(i);
                    var elemDiff = Math.abs(element.getClientRects()[0].top - defaultTop);
                    if (elemDiff === diff || Math.abs(elemDiff - diff) < 5) {
                        element.setAttribute("tabIndex", "0");
                        element.removeAttribute("disabled");
                        element.removeAttribute("aria-hidden");
                    }
                    else {
                        element.setAttribute("tabIndex", "-1");
                        element.setAttribute("disabled", "disabled");
                        element.setAttribute("aria-hidden", "true");
                    }
                }
            };
            StyleHelper.removeTabIndexes = function () {
                var breadCrumbContext = Containers.ProcessControlManager.Instance.contextManager.context(false, Containers.ControlMode.breadCrumb);
                if (!breadCrumbContext) {
                    return;
                }
                var list = document.getElementById(breadCrumbContext.accessibility.getUniqueId(StyleHelper.headerStageContainerName));
                if (!list || !list.children) {
                    return;
                }
                for (var i = 0; i < list.children.length; i++) {
                    var element = list.children.item(i);
                    element.removeAttribute("tabIndex");
                }
            };
            StyleHelper.lineHeight = "31px";
            StyleHelper.processHeaderDataContainerPadding = 1;
            StyleHelper.ProcessNameContainerWidth = 200;
            StyleHelper.processControlHeight = 3;
            StyleHelper.processHeaderStageContent = "processHeaderStageContent";
            StyleHelper.headerStageContainerName = "headerStageContainer";
            StyleHelper.headerStageFlyoutContainer = "processHeaderStageFlyoutContainer";
            StyleHelper.stageDockContainer = "stageDockContainer";
            StyleHelper.processControlAlertContainer = "processControlAlertContainer";
            StyleHelper.borderWidth = 1;
            StyleHelper._crossEntityFlyoutWidth = null;
            StyleHelper.top = 0;
            return StyleHelper;
        }());
        Containers.StyleHelper = StyleHelper;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
