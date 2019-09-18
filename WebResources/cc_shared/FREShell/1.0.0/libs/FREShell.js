/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="..\..\..\..\TypeDefinitions\mscrm.d.ts"/>
var MscrmControls;
(function (MscrmControls) {
    var AppCommon;
    (function (AppCommon) {
        var AdvancedSettingCommonStyle = (function () {
            function AdvancedSettingCommonStyle(context) {
                this._fREBodyContainer = {};
                this._fRESectionContainer = {};
                this._fREHeaderContainer = {};
                this._fREheaderIconContainer = {};
                this._fREHeaderAreaLabelStyle = {};
                this._fREHeaderSubareaLabelStyle = {};
                this._fREHeaderLeft = {};
                this._fREHeaderCenterContainer = {};
                this._fREHeaderRightContainer = {};
                this._fREHeaderRightButtonLabel = {};
                this._fREHeaderRightButtonStyle = {};
                this._fREHeaderSeparatorContainer = {};
                this._fREAreaLabel = {};
                this._fRESubareaLabel = {};
                this._fRESectionLabel = {};
                this._fREFieldLabel = {};
                this._fRERequiredFREFieldLabel = {};
                this._fREGridHeaderLabel = {};
                this._fREGridContainer = {};
                this._fREPrimaryButton = {};
                this._fRESecondaryButton = {};
                this._designerIframeStyle = {};
                this._freShellContainerColumnWithSingleLabel = {};
                this._freShellContainerColumn = {};
                this._freShellIconContainer = {};
                this._freShellContainerRight = {};
                this._selectControlStyle = {};
                this._freRightButtonIconContainer = {};
                this._freContentContainer = {};
                this._freTabContainer = {};
                this._freTabContainerName = {};
                this._fREHeaderTransparentContainer = {};
                this._fREContainerStyleForNonSelectedTab = {};
                this._fREButton = {};
                this._context = context;
                this._fREBodyContainer = null;
                this._fRESectionContainer = null;
                this._fREHeaderContainer = null;
                this._fREheaderIconContainer = null;
                this._fREHeaderAreaLabelStyle = null;
                this._fREHeaderSubareaLabelStyle = null;
                this._fREHeaderLeft = null;
                this._fREHeaderCenterContainer = null;
                this._fREHeaderRightContainer = null;
                this._fREHeaderRightButtonLabel = null;
                this._fREHeaderRightButtonStyle = null;
                this._fREHeaderSeparatorContainer = null;
                this._fREAreaLabel = null;
                this._fRESubareaLabel = null;
                this._fRESectionLabel = null;
                this._fREFieldLabel = null;
                this._fRERequiredFREFieldLabel = null;
                this._fREGridHeaderLabel = null;
                this._fREGridContainer = null;
                this._fREPrimaryButton = null;
                this._fRESecondaryButton = null;
                this._designerIframeStyle = null;
                this._freShellContainerColumnWithSingleLabel = null;
                this._freShellContainerColumn = null;
                this._freShellIconContainer = null;
                this._freShellContainerRight = null;
                this._freContentContainer = null;
                this._freTabContainer = null;
                this._freTabContainerName = null;
                this._fREHeaderTransparentContainer = null;
                this._fREContainerStyleForNonSelectedTab = null;
                this._fREButton = null;
            }
            AdvancedSettingCommonStyle.prototype.FREBodyContainer = function () {
                if (this._context.utils.isNullOrUndefined(this._fREBodyContainer)) {
                    this._fREBodyContainer = {};
                    this._fREBodyContainer["background"] = this._context.theming.colors.basecolor.white;
                    this._fREBodyContainer["display"] = "flex";
                    this._fREBodyContainer["flexDirection"] = "column";
                    this._fREBodyContainer["flex"] = "1";
                    this._fREBodyContainer["maxWidth"] = "100%";
                    this._fREBodyContainer["minWidth"] = "600px";
                    this._fREBodyContainer["minHeight"] = "500px";
                    this._fREBodyContainer["position"] = "relative";
                }
                return this._fREBodyContainer;
            };
            AdvancedSettingCommonStyle.prototype.FRESectionContainer = function () {
                if (this._context.utils.isNullOrUndefined(this._fRESectionContainer)) {
                    this._fRESectionContainer = {};
                    this._fRESectionContainer["display"] = "flex";
                    this._fRESectionContainer["flexDirection"] = "column";
                    this._fRESectionContainer["justifyContent"] = "flex-start";
                    this._fRESectionContainer["flex"] = "1";
                    this._fRESectionContainer["width"] = "100%";
                }
                return this._fRESectionContainer;
            };
            AdvancedSettingCommonStyle.prototype.FREHeaderContainer = function () {
                if (this._context.utils.isNullOrUndefined(this._fREHeaderContainer)) {
                    this._fREHeaderContainer = {};
                    this._fREHeaderContainer["display"] = "flex";
                    this._fREHeaderContainer["flexDirection"] = "row";
                    this._fREHeaderContainer["flex"] = "0 0 50px";
                    this._fREHeaderContainer["justifyContent"] = "space-between";
                    this._fREHeaderContainer["background"] = this._context.theming.colors.basecolor.grey.grey1;
                    this._fREHeaderContainer["height"] = "50px";
                    this._fREHeaderContainer["minHeight"] = "50px";
                    this._fREHeaderContainer["alignItems"] = "center";
                    this._fREHeaderContainer["borderBottom"] = this._context.theming.borders.border02;
                }
                return this._fREHeaderContainer;
            };
            AdvancedSettingCommonStyle.prototype.FREHeaderTransparentContainer = function () {
                if (this._context.utils.isNullOrUndefined(this._fREHeaderTransparentContainer)) {
                    this._fREHeaderTransparentContainer = {};
                    this._fREHeaderTransparentContainer["display"] = "flex";
                    this._fREHeaderTransparentContainer["flexDirection"] = "row";
                    this._fREHeaderTransparentContainer["flex"] = "0 0 50px";
                    this._fREHeaderTransparentContainer["justifyContent"] = "flex-end";
                    this._fREHeaderTransparentContainer["background"] = "transparent";
                    this._fREHeaderTransparentContainer["height"] = "50px";
                    this._fREHeaderTransparentContainer["minHeight"] = "50px";
                    this._fREHeaderTransparentContainer["alignItems"] = "center";
                    this._fREHeaderTransparentContainer["position"] = "absolute";
                    this._fREHeaderTransparentContainer["right"] = "0px";
                    this._fREHeaderTransparentContainer["top"] = "0px";
                }
                return this._fREHeaderTransparentContainer;
            };
            AdvancedSettingCommonStyle.prototype.FREShellIconContainer = function () {
                if (this._context.utils.isNullOrUndefined(this._freShellIconContainer)) {
                    this._freShellIconContainer = {};
                    this._freShellIconContainer["display"] = "flex";
                    this._freShellIconContainer["justifyContent"] = "center";
                    this._freShellIconContainer["marginTop"] = this._context.theming.measures.measure050;
                    this._freShellIconContainer["marginBottom"] = this._context.theming.measures.measure050;
                    this._freShellIconContainer["marginLeft"] = this._context.theming.measures.measure075;
                    this._freShellIconContainer["marginRight"] = this._context.theming.measures.measure075;
                    this._freShellIconContainer["flexDirection"] = "column";
                }
                return this._freShellIconContainer;
            };
            AdvancedSettingCommonStyle.prototype.FREHeaderAreaLabelStyle = function () {
                if (this._context.utils.isNullOrUndefined(this._fREHeaderAreaLabelStyle)) {
                    this._fREHeaderAreaLabelStyle = {};
                    this._fREHeaderAreaLabelStyle["fontSize"] = this._context.theming.fontsizes.font085;
                    this._fREHeaderAreaLabelStyle["fontFamily"] = this._context.theming.fontfamilies.regular;
                    this._fREHeaderAreaLabelStyle["color"] = this._context.theming.colors.basecolor.grey.grey5;
                    this._fREHeaderAreaLabelStyle["lineHeight"] = "1.19rem";
                    this._fREHeaderAreaLabelStyle["whiteSpace"] = "nowrap";
                }
                return this._fREHeaderAreaLabelStyle;
            };
            AdvancedSettingCommonStyle.prototype.FREHeaderSubareaLabelStyle = function () {
                if (this._context.utils.isNullOrUndefined(this._fREHeaderSubareaLabelStyle)) {
                    this._fREHeaderSubareaLabelStyle = {};
                    this._fREHeaderSubareaLabelStyle["fontSize"] = this._context.theming.fontsizes.font100;
                    this._fREHeaderSubareaLabelStyle["fontFamily"] = this._context.theming.fontfamilies.semibold;
                    this._fREHeaderSubareaLabelStyle["color"] = this._context.theming.colors.basecolor.grey.grey7;
                    this._fREHeaderSubareaLabelStyle["lineHeight"] = "1.4rem";
                    this._fREHeaderSubareaLabelStyle["whiteSpace"] = "nowrap";
                }
                return this._fREHeaderSubareaLabelStyle;
            };
            AdvancedSettingCommonStyle.prototype.FREHeaderLeft = function () {
                if (this._context.utils.isNullOrUndefined(this._fREHeaderLeft)) {
                    this._fREHeaderLeft = {};
                    this._fREHeaderLeft["display"] = "flex";
                    this._fREHeaderLeft["flexDirection"] = "row";
                    this._fREHeaderLeft["justifyContent"] = "center";
                }
                return this._fREHeaderLeft;
            };
            AdvancedSettingCommonStyle.prototype.FREHeaderRightContainer = function () {
                if (this._context.utils.isNullOrUndefined(this._fREHeaderRightContainer)) {
                    this._fREHeaderRightContainer = {};
                    this._fREHeaderRightContainer["display"] = "flex";
                    this._fREHeaderRightContainer["alignItems"] = "center";
                    this._fREHeaderRightContainer["margin"] = this._context.theming.measures.measure075;
                }
                return this._fREHeaderRightContainer;
            };
            AdvancedSettingCommonStyle.prototype.FREHeaderRightButtonStyle = function () {
                if (this._context.utils.isNullOrUndefined(this._fREHeaderRightButtonStyle)) {
                    this._fREHeaderRightButtonStyle = {};
                    this._fREHeaderRightButtonStyle["display"] = "flex";
                    this._fREHeaderRightButtonStyle["justifyContent"] = "center";
                    this._fREHeaderRightButtonStyle["alignItems"] = "center";
                    this._fREHeaderRightButtonStyle["alignSelf"] = "center";
                    this._fREHeaderRightButtonStyle["border"] = "none";
                    this._fREHeaderRightButtonStyle["backgroundColor"] = "transparent";
                    this._fREHeaderRightButtonStyle["cursor"] = "pointer";
                    this._fREHeaderRightButtonStyle["padding"] = "2px";
                    this._fREHeaderRightButtonStyle["marginLeft"] = this._context.theming.measures.measure075;
                    this._fREHeaderRightButtonStyle["marginRight"] = this._context.theming.measures.measure075;
                    this._fREHeaderRightButtonStyle["fontFamily"] = this._context.theming.fontfamilies.regular;
                    this._fREHeaderRightButtonStyle["fontSize"] = this._context.theming.fontsizes.font100;
                    this._fREHeaderRightButtonStyle["color"] = "#0063B1";
                    this._fREHeaderRightButtonStyle["lineHeight"] = "1.4rem";
                    this._fREHeaderRightButtonStyle["whiteSpace"] = "nowrap";
                    // hover
                    var _fREHeaderRightButtonStyleHover = {};
                    _fREHeaderRightButtonStyleHover["fontFamily"] = this._context.theming.fontfamilies.semibold;
                    // focus
                    var _fREHeaderRightButtonStyleFocus = {};
                    _fREHeaderRightButtonStyleFocus["fontFamily"] = this._context.theming.fontfamilies.semibold;
                    _fREHeaderRightButtonStyleFocus["border"] = "1px solid #666666";
                    _fREHeaderRightButtonStyleFocus["outline"] = "none";
                    // disabled
                    var _fREHeaderRightButtonStyleDisabled = {};
                    _fREHeaderRightButtonStyleDisabled["color"] = this._context.theming.colors.basecolor.grey.grey5;
                    _fREHeaderRightButtonStyleDisabled["fontFamily"] = this._context.theming.fontfamilies.regular;
                    this._fREHeaderRightButtonStyle[":hover"] = _fREHeaderRightButtonStyleHover;
                    this._fREHeaderRightButtonStyle[":focus"] = _fREHeaderRightButtonStyleFocus;
                    this._fREHeaderRightButtonStyle[":disabled"] = _fREHeaderRightButtonStyleDisabled;
                }
                return this._fREHeaderRightButtonStyle;
            };
            AdvancedSettingCommonStyle.prototype.FREHeaderSeparatorContainer = function () {
                if (this._context.utils.isNullOrUndefined(this._fREHeaderSeparatorContainer)) {
                    this._fREHeaderSeparatorContainer = {};
                    this._fREHeaderSeparatorContainer["borderRight"] = this._context.theming.borders.border02;
                    this._fREHeaderSeparatorContainer["width"] = "1px";
                    this._fREHeaderSeparatorContainer["height"] = "2.1rem";
                    this._fREHeaderSeparatorContainer["alignSelf"] = "center";
                }
                return this._fREHeaderSeparatorContainer;
            };
            AdvancedSettingCommonStyle.prototype.FRESectionLabel = function () {
                if (this._context.utils.isNullOrUndefined(this._fRESectionLabel)) {
                    this._fRESectionLabel = {};
                    this._fRESectionLabel["fontFamily"] = this._context.theming.fontfamilies.semibold;
                    this._fRESectionLabel["fontSize"] = this._context.theming.fontsizes.font100;
                    this._fRESectionLabel["lineHeight"] = "1.4rem";
                    this._fRESectionLabel["color"] = this._context.theming.colors.basecolor.grey.grey7;
                }
                return this._fRESectionLabel;
            };
            AdvancedSettingCommonStyle.prototype.FREFieldLabel = function () {
                if (this._context.utils.isNullOrUndefined(this._fREFieldLabel)) {
                    this._fREFieldLabel = {};
                    this._fREFieldLabel["fontFamily"] = this._context.theming.fontfamilies.regular;
                    this._fREFieldLabel["fontSize"] = this._context.theming.fontsizes.font100;
                    this._fREFieldLabel["lineHeight"] = "1.4rem";
                    this._fREFieldLabel["color"] = this._context.theming.colors.basecolor.grey.grey7;
                }
                return this._fREFieldLabel;
            };
            AdvancedSettingCommonStyle.prototype.FRERequiredFREFieldLabel = function () {
                if (this._context.utils.isNullOrUndefined(this._fRERequiredFREFieldLabel)) {
                    // after
                    var _fRERequiredFREFieldLabelAfter = {};
                    _fRERequiredFREFieldLabelAfter["content"] = "*";
                    _fRERequiredFREFieldLabelAfter["color"] = this._context.theming.colors.basecolor.red;
                    this._fRERequiredFREFieldLabel = {};
                    this._fRERequiredFREFieldLabel[":after"] = _fRERequiredFREFieldLabelAfter;
                }
                return this._fRERequiredFREFieldLabel;
            };
            AdvancedSettingCommonStyle.prototype.FREGridHeaderLabel = function () {
                if (this._context.utils.isNullOrUndefined(this._fREGridHeaderLabel)) {
                    this._fREGridHeaderLabel = {};
                    this._fREGridHeaderLabel["fontFamily"] = this._context.theming.fontfamilies.semibold;
                    this._fREGridHeaderLabel["fontSize"] = "1.14rem";
                    this._fREGridHeaderLabel["color"] = "#4A4A4A";
                    this._fREGridHeaderLabel["lineHeight"] = "1.57rem";
                    this._fREGridHeaderLabel["marginLeft"] = this._context.theming.measures.measure075;
                    this._fREGridHeaderLabel["marginRight"] = this._context.theming.measures.measure075;
                    this._fREGridHeaderLabel["marginTop"] = this._context.theming.measures.measure075;
                }
                return this._fREGridHeaderLabel;
            };
            AdvancedSettingCommonStyle.prototype.FREGridContainer = function () {
                if (this._context.utils.isNullOrUndefined(this._fREGridContainer)) {
                    this._fREGridContainer = {};
                    this._fREGridContainer["margin"] = this._context.theming.measures.measure075;
                    this._fREGridContainer["maxWidth"] = "100%";
                    this._fREGridContainer["display"] = "flex";
                    this._fREGridContainer["flex"] = "1";
                }
                return this._fREGridContainer;
            };
            AdvancedSettingCommonStyle.prototype.FREPrimaryButton = function () {
                if (this._context.utils.isNullOrUndefined(this._fREPrimaryButton)) {
                    this._fREPrimaryButton = JSON.parse(JSON.stringify(this.FREButton()));
                    this._fREPrimaryButton["color"] = this._context.theming.colors.basecolor.white;
                    this._fREPrimaryButton["backgroundColor"] = "#0063B1";
                    // hover
                    var _fREPrimaryButtonHover = {};
                    _fREPrimaryButtonHover["backgroundColor"] = "#71AFE5";
                    _fREPrimaryButtonHover["border"] = "1px solid #71AFE5";
                    // focus
                    var _fREPrimaryButtonFocus = {};
                    _fREPrimaryButtonFocus["backgroundColor"] = "#0063B1";
                    _fREPrimaryButtonFocus["border"] = "1px solid #CCCCCC";
                    _fREPrimaryButtonFocus["outline"] = "none";
                    // disabled
                    var _fREPrimaryButtonDisabled = {};
                    _fREPrimaryButtonDisabled["backgroundColor"] = "#767676";
                    _fREPrimaryButtonDisabled["border"] = "1px solid #767676";
                    this._fREPrimaryButton[":hover"] = _fREPrimaryButtonHover;
                    this._fREPrimaryButton[":focus"] = _fREPrimaryButtonFocus;
                    this._fREPrimaryButton[":disabled"] = _fREPrimaryButtonDisabled;
                }
                return this._fREPrimaryButton;
            };
            AdvancedSettingCommonStyle.prototype.FRESecondaryButton = function () {
                if (this._context.utils.isNullOrUndefined(this._fRESecondaryButton)) {
                    this._fRESecondaryButton = JSON.parse(JSON.stringify(this.FREButton()));
                    this._fRESecondaryButton["color"] = "#0063B1";
                    this._fRESecondaryButton["backgroundColor"] = this._context.theming.colors.basecolor.white;
                    // hover
                    var _fRESecondaryButtonHover = {};
                    _fRESecondaryButtonHover["backgroundColor"] = "#71AFE5";
                    _fRESecondaryButtonHover["border"] = "1px solid #0063B1";
                    _fRESecondaryButtonHover["color"] = this._context.theming.colors.basecolor.white;
                    // focus
                    var _fRESecondaryButtonFocus = {};
                    _fRESecondaryButtonFocus["backgroundColor"] = this._context.theming.colors.basecolor.white;
                    _fRESecondaryButtonFocus["border"] = "1px solid #0063B1";
                    _fRESecondaryButtonFocus["outline"] = "1px solid #CCCCCC";
                    _fRESecondaryButtonFocus["color"] = "#0063B1";
                    // disabled
                    var _fRESecondaryButtonDisabled = {};
                    _fRESecondaryButtonDisabled["backgroundColor"] = this._context.theming.colors.basecolor.white;
                    _fRESecondaryButtonDisabled["border"] = "1px solid #767676";
                    _fRESecondaryButtonDisabled["color"] = "#767676";
                    this._fRESecondaryButton[":hover"] = _fRESecondaryButtonHover;
                    this._fRESecondaryButton[":focus"] = _fRESecondaryButtonFocus;
                    this._fRESecondaryButton[":disabled"] = _fRESecondaryButtonDisabled;
                }
                return this._fRESecondaryButton;
            };
            AdvancedSettingCommonStyle.prototype.DesignerIframeStyle = function () {
                if (this._context.utils.isNullOrUndefined(this._designerIframeStyle)) {
                    this._designerIframeStyle = {};
                    this._designerIframeStyle["background"] = this._context.theming.colors.basecolor.white;
                    this._designerIframeStyle["position"] = "fixed";
                    this._designerIframeStyle["left"] = this.getWidthOfAppSideBar() + "px";
                    this._designerIframeStyle["top"] = this.getWidthOfAppHeader() + "px";
                    this._designerIframeStyle["right"] = "0px";
                    this._designerIframeStyle["bottom"] = "0px";
                    this._designerIframeStyle["height"] = "0%";
                    this._designerIframeStyle["width"] = "0%";
                    this._designerIframeStyle["border"] = "none";
                    this._designerIframeStyle["flex"] = "1 1 auto";
                    this._designerIframeStyle["display"] = "none";
                }
                return this._designerIframeStyle;
            };
            AdvancedSettingCommonStyle.prototype.FREShellContainerColumnWithSingleLabel = function () {
                if (this._context.utils.isNullOrUndefined(this._freShellContainerColumnWithSingleLabel)) {
                    this._freShellContainerColumnWithSingleLabel = {};
                    this._freShellContainerColumnWithSingleLabel["display"] = "flex";
                    this._freShellContainerColumnWithSingleLabel["flexDirection"] = "column";
                    this._freShellContainerColumnWithSingleLabel["alignSelf"] = "center";
                    this._freShellContainerColumnWithSingleLabel["justifyContent"] = "center";
                }
                return this._freShellContainerColumnWithSingleLabel;
            };
            AdvancedSettingCommonStyle.prototype.FREShellContainerColumn = function () {
                if (this._context.utils.isNullOrUndefined(this._freShellContainerColumn)) {
                    this._freShellContainerColumn = {};
                    this._freShellContainerColumn["display"] = "flex";
                    this._freShellContainerColumn["flexDirection"] = "column";
                    this._freShellContainerColumn["justifyContent"] = "center";
                }
                return this._freShellContainerColumn;
            };
            AdvancedSettingCommonStyle.prototype.FREShellContainerRight = function () {
                if (this._context.utils.isNullOrUndefined(this._freShellContainerRight)) {
                    this._freShellContainerRight = {};
                    this._freShellContainerRight["display"] = "flex";
                }
                return this._freShellContainerRight;
            };
            AdvancedSettingCommonStyle.prototype.selectStyle = function () {
                var _a = this._context.theming, noneborderstyle = _a.noneborderstyle, textbox = _a.textbox;
                var backgroundColor = textbox.backgroundcolor;
                var color = textbox.contentcolor;
                var selectStyle = {};
                selectStyle["appearance"] = "normal";
                selectStyle["width"] = "100%";
                selectStyle["height"] = "30px";
                selectStyle["paddingLeft"] = textbox.horizontalpadding;
                selectStyle["paddingRight"] = textbox.horizontalpadding;
                selectStyle["fontSize"] = textbox.fontsize;
                selectStyle["fontWeight"] = textbox.fontweight;
                selectStyle["boxShadow"] = "0 0 0 1px #cccccc inset";
                selectStyle["backgroundColor"] = this._context.theming.colors.basecolor.white;
                selectStyle["color"] = color;
                var optionStyle = {
                    backgroundColor: backgroundColor,
                    color: color
                };
                this._selectControlStyle = { selectStyle: selectStyle, optionStyle: optionStyle };
                return this._selectControlStyle;
            };
            AdvancedSettingCommonStyle.prototype.FRERightButtonIconContainer = function () {
                this._freRightButtonIconContainer = {};
                this._freRightButtonIconContainer["display"] = "flex";
                this._freRightButtonIconContainer["justifyContent"] = "center";
                this._freRightButtonIconContainer["alignItems"] = "center";
                this._freRightButtonIconContainer["backgroundColor"] = "transparent";
                this._freRightButtonIconContainer["margin"] = this._context.theming.measures.measure025;
                return this._freRightButtonIconContainer;
            };
            AdvancedSettingCommonStyle.prototype.FREContentContainer = function () {
                this._freContentContainer = {};
                this._freContentContainer["display"] = "flex";
                this._freContentContainer["flex"] = "1";
                this._freContentContainer["backgroundColor"] = "#FFFFFF";
                this._freContentContainer["maxWidth"] = "100%";
                this._freContentContainer["border"] = "1px solid #CCCCCC";
                this._freContentContainer["border-top"] = "none";
                return this._freContentContainer;
            };
            AdvancedSettingCommonStyle.prototype.FREDesignerWidth = function () {
                var width = "100%";
                var topWindowWidth = this.getTopWindowInnerWidth();
                if (topWindowWidth > 0) {
                    width = topWindowWidth - this.getWidthOfAppSideBar() + "px";
                }
                return width;
            };
            AdvancedSettingCommonStyle.prototype.FREDesignerHeight = function () {
                var height = "100%";
                var topWindowHeight = this.getTopWindowInnerHeight();
                if (topWindowHeight > 0) {
                    height = topWindowHeight - this.getWidthOfAppHeader() + "px";
                }
                return height;
            };
            //the desinger left position :  start leaving left side sitemap
            AdvancedSettingCommonStyle.prototype.getWidthOfAppHeader = function () {
                return 48;
            };
            //the desinger top position :  start leaving top appheader
            AdvancedSettingCommonStyle.prototype.getWidthOfAppSideBar = function () {
                return 48;
            };
            AdvancedSettingCommonStyle.prototype.getTopWindowInnerWidth = function () {
                if (window && window.top && window.top.innerWidth) {
                    return window.top.innerWidth;
                }
                else {
                    return 0;
                }
            };
            AdvancedSettingCommonStyle.prototype.getTopWindowInnerHeight = function () {
                if (window && window.top && window.top.innerHeight) {
                    return window.top.innerHeight;
                }
                else {
                    return 0;
                }
            };
            /**
             * Style for Tab Container like Click to Call, Exchange and Document Storage
             */
            AdvancedSettingCommonStyle.prototype.FRETabContainerStyle = function () {
                if (this._context.utils.isNullOrUndefined(this._freTabContainer)) {
                    this._freTabContainer = JSON.parse(JSON.stringify(this.FREContainerStyleForNonSelectedTab()));
                    this._freTabContainer["boxShadow"] = "1px 1px 2px 1px rgba(0, 0, 0, 0.2)";
                }
                return this._freTabContainer;
            };
            /**
             * Style for Name in Tab Container
             */
            AdvancedSettingCommonStyle.prototype.FRETabContainerNameStyle = function () {
                this._freTabContainerName = {};
                this._freTabContainerName["fontFamily"] = this._context.theming.fontfamilies.regular;
                this._freTabContainerName["fontSize"] = this._context.theming.fontsizes.font100;
                this._freTabContainerName["color"] = this._context.theming.colors.basecolor.grey.grey7;
                this._freTabContainerName["marginLeft"] = "0rem";
                return this._freTabContainerName;
            };
            /**
             * Style for Non-Selected Tab
             */
            AdvancedSettingCommonStyle.prototype.FREContainerStyleForNonSelectedTab = function () {
                var _focusProperties = {};
                _focusProperties["border"] = this._context.theming.borders.border02;
                _focusProperties["outline"] = "none";
                this._fREContainerStyleForNonSelectedTab = {};
                this._fREContainerStyleForNonSelectedTab["width"] = "15rem";
                this._fREContainerStyleForNonSelectedTab["height"] = this._context.theming.measures.measure400;
                this._fREContainerStyleForNonSelectedTab["borderRadius"] = "2px";
                this._fREContainerStyleForNonSelectedTab["backgroundColor"] = this._context.theming.colors.basecolor.white;
                this._fREContainerStyleForNonSelectedTab["border"] = this._context.theming.borders.border02;
                this._fREContainerStyleForNonSelectedTab["Xaxis"] = "1px";
                this._fREContainerStyleForNonSelectedTab["Yaxis"] = "1px";
                this._fREContainerStyleForNonSelectedTab["blur"] = "2px";
                this._fREContainerStyleForNonSelectedTab["spread"] = "0px";
                this._fREContainerStyleForNonSelectedTab["alignItems"] = "center";
                this._fREContainerStyleForNonSelectedTab["marginTop"] = this._context.theming.measures.measure075;
                this._fREContainerStyleForNonSelectedTab["marginLeft"] = this._context.theming.measures.measure075;
                this._fREContainerStyleForNonSelectedTab["marginRight"] = this._context.theming.measures.measure075;
                this._fREContainerStyleForNonSelectedTab["marginBottom"] = this._context.theming.measures.measure050;
                this._fREContainerStyleForNonSelectedTab[":focus"] = _focusProperties;
                return this._fREContainerStyleForNonSelectedTab;
            };
            AdvancedSettingCommonStyle.prototype.FREButton = function () {
                this._fREButton = {};
                this._fREButton["height"] = "30px";
                this._fREButton["paddingLeft"] = this._context.theming.measures.measure150;
                this._fREButton["paddingRight"] = this._context.theming.measures.measure150;
                this._fREButton["fontSize"] = this._context.theming.fontsizes.font100;
                this._fREButton["fontFamily"] = this._context.theming.fontfamilies.regular;
                this._fREButton["lineHeight"] = "1.4rem";
                this._fREButton["letterSpacing"] = "0rem";
                this._fREButton["cursor"] = "pointer";
                this._fREButton["border"] = "none";
                this._fREButton["borderRadius"] = "0rem";
                this._fREButton["margin"] = "auto";
                this._fREButton["border"] = "1px solid #0063B1";
                return this._fREButton;
            };
            return AdvancedSettingCommonStyle;
        }());
        AppCommon.AdvancedSettingCommonStyle = AdvancedSettingCommonStyle;
    })(AppCommon = MscrmControls.AppCommon || (MscrmControls.AppCommon = {}));
})(MscrmControls || (MscrmControls = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
var MscrmControls;
(function (MscrmControls) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var FREShell = (function () {
            function FREShell(context, PageTitle) {
                this._tempSuffix = "_temp";
                this._applyStyles = null;
                if (this.IsNullOrUndefined(context)) {
                    throw new Error("Context cannot be null or undefined");
                }
                // Set The Page Title
                if (PageTitle != null && PageTitle != "") {
                    window.document.title = PageTitle;
                }
                this._context = context;
                // start the stopWatch
                this.startPerformanceStopWatch();
            }
            FREShell.prototype.getVirtualComponents = function (childControls) {
                // For applying styles
                if (this._context.utils.isNullOrUndefined(this._applyStyles)) {
                    this._applyStyles = new AppCommon.AdvancedSettingCommonStyle(this._context);
                }
                return this.getVirtualComponentsInternal(this._context, childControls);
            };
            FREShell.prototype.startPerformanceStopWatch = function () {
                if (this.IsNullOrUndefined(this._stopWatch)) {
                    var stopWatchId = "Load";
                    this._stopWatch = this._context.utils.createPerformanceStopwatch(stopWatchId);
                    if (!this.IsNullOrUndefined(this._stopWatch)) {
                        this._stopWatch.start();
                    }
                }
            };
            FREShell.prototype.stopPerformanceStopWatch = function () {
                if (!this.IsNullOrUndefined(this._stopWatch)) {
                    this._stopWatch.stop();
                    if (this._stopWatch.stopMarker) {
                        console.log(this._stopWatch.stopMarker.toString());
                    }
                    this._stopWatch = null;
                }
                else {
                }
            };
            /**
             * Creates a virtual component hierarchy for the FRE page.
             * @params context The "Input Bag"
             * @params parameters The child components needed to be put in shell
             */
            FREShell.prototype.getVirtualComponentsInternal = function (context, parameters) {
                /*
                |----FREBodyContainer
                    |----FREHeaderContainer
                        |----FREHeaderLeftContainer
                             |----FREHeaderIconImageHighContrast
                             |----FREHeaderSubAreaLabel
                        |----FREHeaderRightContainer
                    |----FREContentContainer
                */
                //Create another container for holding child components
                var FREBodyContainer = this.createBodyContainer(parameters);
                return FREBodyContainer;
            };
            FREShell.prototype.createBodyContainer = function (params) {
                return this._context.factory.createElement("CONTAINER", {
                    id: this.makeUnique("FREBodyContainer"),
                    key: this.makeUnique("FREBodyContainer"),
                    style: this.IsNullOrUndefined(params.bodyContainerStyle) ? this._applyStyles.FREBodyContainer() : params.bodyContainerStyle
                }, (params.addHeaderRightButtonLastInDom) ? [this.createFREHeaderContainer(params), this.createContentContainer(params), this.createFREHeaderTransparentContainer(params)] : [this.createFREHeaderContainer(params), this.createContentContainer(params)]);
            };
            FREShell.prototype.createFREHeaderContainer = function (params) {
                return this._context.factory.createElement("CONTAINER", {
                    id: this.makeUnique("FREHeaderContainer"),
                    key: this.makeUnique("FREHeaderContainer"),
                    style: this._applyStyles.FREHeaderContainer()
                }, (params.addHeaderRightButtonLastInDom) ? [this.createLeftContainer(params)] : [this.createLeftContainer(params), this.createRightContainer(params)]);
            };
            FREShell.prototype.createFREHeaderTransparentContainer = function (params) {
                return this._context.factory.createElement("CONTAINER", {
                    id: this.makeUnique("FREHeaderTransparentContainer"),
                    key: this.makeUnique("FREHeaderTransparentContainer"),
                    style: this._applyStyles.FREHeaderTransparentContainer()
                }, [this.createRightContainer(params)]);
            };
            FREShell.prototype.createLeftContainer = function (params) {
                if (params.headerLeftContainerChild != null) {
                    return this._context.factory.createElement("CONTAINER", {
                        id: this.makeUnique("FREHeaderLeftContainer"),
                        key: this.makeUnique("FREHeaderLeftContainer"),
                    }, params.headerLeftContainerChild);
                }
                //if iconimagepath is set then render image else icon 
                if (!this.IsNullOrUndefined(params.normalIconImagePath)
                    && !this.IsNullOrUndefined(params.highContrastIconImagePath)) {
                    var headerIconImage = void 0;
                    if (this._context.accessibility.isHighContrastEnabled) {
                        headerIconImage = this._context.factory.createElement("IMG", {
                            id: this.makeUnique("FREHeaderIconImageHighContrast"),
                            key: this.makeUnique("FREHeaderIconImageHighContrast"),
                            source: params.highContrastIconImagePath,
                            altText: params.subAreaLabel,
                            style: this._applyStyles.FREShellIconContainer()
                        }, []);
                    }
                    else {
                        headerIconImage = this._context.factory.createElement("IMG", {
                            id: this.makeUnique("FREHeaderIconImageNormal"),
                            key: this.makeUnique("FREHeaderIconImageNormal"),
                            source: params.normalIconImagePath,
                            altText: params.subAreaLabel,
                            style: this._applyStyles.FREShellIconContainer()
                        }, []);
                    }
                    return this._context.factory.createElement("CONTAINER", {
                        id: this.makeUnique("FREHeaderLeftContainer"),
                        key: this.makeUnique("FREHeaderLeftContainer"),
                        style: this._applyStyles.FREHeaderLeft()
                    }, [headerIconImage, this.createAreaSubAreaContainer(params)]);
                }
                else {
                    var iconContainer = this._context.factory.createElement("CONTAINER", {
                        id: this.makeUnique("FREHeaderIconContainer"),
                        key: this.makeUnique("FREHeaderIconContainer"),
                        style: this._applyStyles.FREShellIconContainer()
                    }, this.IsNullOrUndefined(params.icon) ? null : params.icon);
                    return this._context.factory.createElement("CONTAINER", {
                        id: this.makeUnique("FREHeaderLeftContainer"),
                        key: this.makeUnique("FREHeaderLeftContainer"),
                        style: this._applyStyles.FREHeaderLeft()
                    }, [iconContainer, this.createAreaSubAreaContainer(params)]);
                }
            };
            FREShell.prototype.createAreaSubAreaContainer = function (params) {
                var areaLabel = this._context.factory.createElement("LABEL", {
                    id: this.makeUnique("FREHeaderAreaLabel"),
                    key: this.makeUnique("FREHeaderAreaLabel"),
                    role: "heading",
                    style: this._applyStyles.FREHeaderAreaLabelStyle()
                }, params.areaLabel || AppCommon.Constants.DefaultAreaLabel);
                var subAreaLabel = this._context.factory.createElement("LABEL", {
                    id: this.makeUnique("FREHeaderSubAreaLabel"),
                    key: this.makeUnique("FREHeaderSubAreaLabel"),
                    role: "heading",
                    style: this._applyStyles.FREHeaderSubareaLabelStyle()
                }, params.subAreaLabel || AppCommon.Constants.DefaultSubAreaLabel);
                return this._context.factory.createElement("CONTAINER", {
                    id: this.makeUnique("FREHeaderAreaSubAreaContainer"),
                    key: this.makeUnique("FREHeaderAreaSubAreaContainer"),
                    style: (params.areaLabel == "") ? this._applyStyles.FREShellContainerColumnWithSingleLabel() : this._applyStyles.FREShellContainerColumn()
                }, [areaLabel, subAreaLabel]);
            };
            FREShell.prototype.createRightContainer = function (params) {
                if (params.headerRightContainerChild != null) {
                    return this._context.factory.createElement("CONTAINER", {
                        id: this.makeUnique("FREHeaderRightContainer"),
                        key: this.makeUnique("FREHeaderRightContainer"),
                        style: this._applyStyles.FREShellContainerRight()
                    }, params.headerRightContainerChild);
                }
            };
            FREShell.prototype.createContentContainer = function (params) {
                return this._context.factory.createElement("CONTAINER", {
                    id: this.makeUnique("FREContentContainer"),
                    key: this.makeUnique("FREContentContainer"),
                    style: this.IsNullOrUndefined(params.contentContainerStyle) ? this._applyStyles.FREContentContainer() : params.contentContainerStyle
                }, params.contentContainerChild);
            };
            FREShell.prototype.IsNullOrUndefined = function (object) {
                return object === null || object === undefined;
            };
            FREShell.prototype.makeUnique = function (key) {
                return key + this._tempSuffix;
            };
            return FREShell;
        }());
        AppCommon.FREShell = FREShell;
    })(AppCommon = MscrmControls.AppCommon || (MscrmControls.AppCommon = {}));
})(MscrmControls || (MscrmControls = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="inputsoutputs.g.ts" />
/// <reference path="FREShell.ts" /> 
var MscrmControls;
(function (MscrmControls) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var Constants = (function () {
            function Constants() {
            }
            return Constants;
        }());
        Constants.DefaultMainHeading = "";
        Constants.DefaultAreaLabel = "";
        Constants.DefaultSubAreaLabel = "";
        AppCommon.Constants = Constants;
    })(AppCommon = MscrmControls.AppCommon || (MscrmControls.AppCommon = {}));
})(MscrmControls || (MscrmControls = {}));
/// <reference path="../../../../../TypeDefinitions/mscrm.d.ts" />
var ODataContract;
(function (ODataContract) {
    var ODataUpdateRequest = (function () {
        function ODataUpdateRequest(etn, id, payload) {
            this.etn = etn;
            this.id = id;
            this.payload = payload;
        }
        ODataUpdateRequest.prototype.getMetadata = function () {
            return {
                boundParameter: undefined,
                parameterTypes: {},
                operationName: "Update",
                operationType: 2,
            };
        };
        return ODataUpdateRequest;
    }());
    ODataContract.ODataUpdateRequest = ODataUpdateRequest;
})(ODataContract || (ODataContract = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="CommonReferences.ts" />
/// <reference path="../FREShell/libs/frecommon-lib.d.ts" /> 
