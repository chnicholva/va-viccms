/*
 MSCRMBarChart JS v0.0.1 (2016-07-27)

 (@Author :) 2016 Amit Patange

 License: Opensource license
 Document Type : Javascript 
*/
Type.registerNamespace("Mscrm");

var getSeriesLength = function (facetPrefix) {
	var tickMarks = document.getElementsByClassName("slider_tick_active");

	var count = 0;

	for (var i = 0; i < tickMarks.length; i++) {
		if (tickMarks[i].id.indexOf(facetPrefix) >= 0) {
			count++;
		}
	}
	return count - 1;
}

var getLeftConstant = function (leftMargin, rightMargin, space, seriesLength) {
	var facetDivWidth = document.getElementById("FacetDiv").clientWidth;

	var currentLeft = leftMargin;

	var startTickLeft = currentLeft - (space / 2);

	var totalSpace = leftMargin + rightMargin + (space * (seriesLength - 1));

	var barWidth = (facetDivWidth - totalSpace) / seriesLength;

	var period = barWidth + space;

	return period;
};

jQuery.fn.barChart = function (target) {
	var th = this;
	var g = {
		d: document, //document object
		t: target, //target custom function
		c: th,//containerDiv
		u: target.chart.uniqueid,
		displayName: target.chart.displayname,
		w: window,
		leftConstant: null,
		seriesLength: target.features.barchart === false ? target.series[0].data.length - 1 : target.series[0].data.length,
		_BarChartTextToDisplay: target.xAxis.barChartTextToDisplay,
		_Categories: target.xAxis.categories,
		appendTextDisplay: target.xAxis.appendtextdisplay,
		finalTextToAppend: "",
		cl: target.chart.callback,
		isBarChartEnabled: target.features.barchart,
		isSliderControlEnabled: target.features.slider,
		CalContainerWidth: null,
		innerCssWidth: 0,
		handle1Left: 10,
		setPoints: target.setpoints.enable,
		setPointsX1: target.setpoints.start,
		setPointsX2: target.setpoints.end,
		objecttypecode: target.chart.objecttypecode,
		secondTimeClickEvent: false,
		sliderWidthFixed: target.features.sliderwidthfixed,
		IsReturnTypeAsIndex: target.features.IsReturnTypeAsIndex,
		IsNextVersionOfSlider: target.features.isNextVersionOfSlider,
		direction: target.features.direction.toUpperCase(),
		overridebarchartarraymaxnumber: target.features.overridebarchartarraymaxnumber,
		KeyValue: null,
		isPressed: false,
		sliderWidth: 10,
		mouseDownAbsolutePosition: 0,
		mouseDownPosition: 0,
		localizedStrings: target.features.localizedStrings,
		Initialize: function () {
			if (g.IsNextVersionOfSlider) { g.seriesLength = g.seriesLength - 1; }
			g.CalContainerWidth = document.getElementById("FacetDiv").clientWidth;
			main._BarHighlightArray = g.prepareBarHighlightArray();
		},
		OverrideGlobalgForSlider: function () {
			if (g.sliderWidthFixed) {
				if (g.seriesLength === 1) {
					throw new Error('You can not provide single value for Bar Chart Slider. Provided values must be more than one.');
				}
				return true;
			}

			return false;
		},
		prepareBarHighlightArray: function () {
			var barHLightArray = [];
			var k = 0;
			var j = g.seriesLength;
			var upperBound = g.isBarChartEnabled === false ? g.seriesLength + 1 : g.seriesLength;
			for (var i = 0; i <= upperBound; i++) {

				var internalBarArray = [];
				if (i == 0 || i == upperBound) {
					internalBarArray[0] = k;
					internalBarArray[1] = 0;
					internalBarArray[2] = 0;
					barHLightArray.push(internalBarArray);
				} else {
					internalBarArray[0] = k;
					internalBarArray[1] = i;
					internalBarArray[2] = j;
					barHLightArray.push(internalBarArray);
				}
				k = k + g.leftConstant;
				j--;
			}
			return barHLightArray;
		},
		IsRTLSelected: function (lang) {
			if (g.direction == "RTL") {
				return true;
			}

			return false;
		},
	};

	var leftMargin = 5; // left margin of first bar
	var rightMargin = 5; // right margin of last bar
	var space = 10; // space between two bars

	var facetDivWidth = document.getElementById("FacetDiv").clientWidth;

	var currentLeft = leftMargin;

	var startTickLeft = currentLeft - (space / 2);

	var totalSpace = leftMargin + rightMargin + (space * (g.seriesLength - 1));

	var barWidth = (facetDivWidth - totalSpace) / g.seriesLength;

	var period = barWidth + space;

	g.leftConstant = period;

	var outerRailHorizontalTop = 12;
	var outerRailHorizontalHeight = 1;

	var sliderWidth = g.sliderWidth;
	var sliderHeight = 10;

	var leftSlider_left = startTickLeft - (sliderWidth / 2);
	var leftSlider_left_outer = startTickLeft - (sliderWidth / 2) -7.5;
	var leftSlider_top = 6.5;

	var rightSlider_left = leftSlider_left + (g.seriesLength * (space + barWidth));
	var rightSlider_left_outer = leftSlider_left + (g.seriesLength * (space + barWidth)) - 7.5;
	var rightSlider_top = leftSlider_top;

	var main = {
		_MouseDownForRightBar: false,
		_MouseDownForLeftBar: false,
		_BarHighlightArray: null,
		_ExecuteWebApiMethodOnModifiedDate: [],
		_RememberHandlesLastPosition: [],
		prepareHTML: function () {
			var elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6";
			var currentElement = [["class", "ms-ref-refiner"], ["name", "Group"], ["style", "display:block;"], ["id", elementId]];
			main.createHTML("div", currentElement, g.c[0].id);

			currentElement = [["id", g.u + "_Container"]];
			var containerElement = main.createHTML("div", currentElement, elementId);

			elementId = g.u + "_Container";
			currentElement = [["class", "ms-ref-uparrow"], ["id", g.u + "refinerExpandCollapseArrow"]];
			main.createHTML("div", currentElement, elementId);

			elementId = g.u + "_Container";
			currentElement = [["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6_SliderLoadContainer"]];
			main.createHTML("div", currentElement, elementId);

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6_SliderLoadContainer";
			currentElement = [["class", "ms-ref-unselSec"], ["style", "display:block"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6s1"]];
			main.createHTML("span", currentElement, elementId);

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6s1";
			currentElement = [["class", "histogram_container"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6HistogramContainer"]];
			main.createHTML("div", currentElement, elementId);

			//calcualte height and left for each bar. in this case left is g.leftConstant+ and cal height
			var heightArray = main.CalcualteBarHeight(g.t.series[0].data);

			for (var i = 0; i < g.seriesLength; i++) {

				// histogram bar tooltip
				const titleCategories = (i === 0 || i === g.seriesLength - 1) ? g.t.xAxis.categories[i] : g.t.xAxis.categories[i] + " - " + g.t.xAxis.categories[i + 1];
				const title = titleCategories + " (" + g.t.series[0].data[i] + ")";

				const ariaLabel = g.displayName + " "+ MscrmCommon.ControlUtils.String.Format(g.localizedStrings.RELEVANCE_SEARCH_SEARCH_SELECTOR, g.t.xAxis.categories[i], g.t.series[0].data[i]) +" "+ title.replace("-", g.localizedStrings.TO);

				//single bar html starts here
				elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6HistogramContainer";
				currentElement = [["class", "histogram_bar_link"], ["id", g.u + "_histogram_bar_link" + i], ["aria-label", ariaLabel], ["title", title], ["href", "#"], ["onclick", "event.preventDefault()"], ["style", "bottom:0px; left:" + currentLeft + "px; width:" + barWidth + "px"]];
				main.createHTML("a", currentElement, elementId);

				elementId = g.u + "_histogram_bar_link" + i;
				currentElement = [["class", "histogram_bar_background"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6_HistogramBgBar" + i]];
				main.createHTML("div", currentElement, elementId);

				elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6_HistogramBgBar" + i;
				currentElement = [["class", "histogram_bar_active"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6_HistogramActiveBar" + i], ["style", "height:" + heightArray[i] + "px; margin-top:0px"]];
				main.createHTML("div", currentElement, elementId);
				//i,i,i+1,p,p+g.leftConstant,g.leftConstant,p
				//InvokeBarClickEvent : 
				//barElementId : The selected histogram bar
				//tickLeftElementId : left element of the slider 
				//tickRightElementId : right element of the slider
				//handle1Value : position value for first slider
				//handle2Value : position value for second slider
				//innerWidthValue : width of the slider bar between the two sliders.
				//innerLeftValue : left position for the slider bar
				$("#" + elementId).on("click", { barElementId: i, tickLeftElementId: i, tickRightElementId: i + 1, handle1Value: currentLeft - sliderWidth, handle2Value: currentLeft - sliderWidth + g.leftConstant, innerWidthValue: g.leftConstant, innerLeftValue: currentLeft - (sliderWidth / 2) }, function (event) {
					main.InvokeBarClickEvent(event.data.barElementId, event.data.tickLeftElementId, event.data.tickRightElementId, event.data.handle1Value, event.data.handle2Value, event.data.innerWidthValue, event.data.innerLeftValue);
				});
				currentLeft += barWidth + space;
				//single bar html ends here

			}//for loop ends here.

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6s1";
			currentElement = [["class", "ms-textSmall slider_extent_label_section"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderContainer_ExtentLabelSection"], ["style", "margin-top:" + 8 + "px;"]];
			main.createHTML("div", currentElement, elementId);

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderContainer_ExtentLabelSection";
			currentElement = [["class", "slider_extent_label_left"], ["id", g.u + "ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderContainer_ExtentLabelMax"]];
			e = main.createHTML("div", currentElement, elementId);
			e.innerHTML = g.t.xAxis.start;

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderContainer_ExtentLabelSection";
			currentElement = [["class", "slider_extent_label_right"], ["id", g.u + "ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderContainer_ExtentLabelMax"]];
			e = main.createHTML("div", currentElement, elementId);
			e.innerHTML = g.t.xAxis.end;
			
			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6s1";
			currentElement = [["class", "slideronly_container"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderContainer"]];
			main.createHTML("div", currentElement, elementId);

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderContainer";
			currentElement = [["style", "display:block;position:relative"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviourRailSection"]];
			main.createHTML("div", currentElement, elementId); -1

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviourRailSection";
			currentElement = [["class", "ajax__multi_slider_default"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviourRailSection_ajax__multi_slider_default"]];
			main.createHTML("div", currentElement, elementId);

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviourRailSection_ajax__multi_slider_default";
			currentElement = [["class", "ajax__multi_slider_default outer_rail_horizontal"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_outer"], ["tabindex", "-1"], ["style", "outline:none;"]];
			main.createHTML("div", currentElement, elementId);

			var rangeLabelLower = MscrmCommon.ControlUtils.String.Format(g.localizedStrings.RELEVANCE_SEARCH_SLIDER_SELECTOR, g.localizedStrings.RELEVANCE_SEARCH_LEFTSLIDER_SEARCH_SELECTOR, (document.getElementById(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6RangeLabel") ? document.getElementById(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6RangeLabel").innerHTML : ""));
			var rangeLabelUpper = MscrmCommon.ControlUtils.String.Format(g.localizedStrings.RELEVANCE_SEARCH_SLIDER_SELECTOR, g.localizedStrings.RELEVANCE_SEARCH_RIGHTSLIDER_SEARCH_SELECTOR, (document.getElementById(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6RangeLabel") ? document.getElementById(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6RangeLabel").innerHTML : ""));

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_outer";
			currentElement = [["class", "ajax__multi_slider_default handle_horizontal_left handle_noforcepressed"], ["aria-hidden", "true"], ["tabindex", "-1"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_FIXED_0"], ["style", "overflow:hidden; left:" + leftSlider_left + "px; top: " + 6.5 + "px /*0px */; height: " + 10 + "px; width: " + 10 + "px; border-radius: 50%; cursor:pointer; background-color: #CCCCCC;"]];
			main.createHTML("a", currentElement, elementId);

			//new outer element to increase the touch are for slider on left
			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_outer";
			currentElement = [["class", "ajax__multi_slider_default handle_horizontal_left handle_noforcepressed"], ["aria-hidden", "true"], ["tabindex", "-1"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_0"], ["style", "overflow:hidden; left:" + leftSlider_left + "px; /*0px */; height: " + 25 + "px; width: " + 25 + "px;background-color:transparent; border-radius: 50%; cursor:pointer; border: 0px solid #FFFFFF;"]];
			main.createHTML("a", currentElement, elementId);

			currentElement = [["class", "ajax__multi_slider_default handle_horizontal_left handle_noforcepressed"], ["role", "slider"], ["aria-valuemin", 0], ["aria-valuemax", g.t.xAxis.barChartTextToDisplay.length - 1], ["aria-valuenow", 0], ["aria-valuetext", rangeLabelLower.replace("-", g.localizedStrings.TO)], ["tabindex", "0"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00"], ["style", "overflow:hidden; left:" + leftSlider_left + "px; top: " + 6.5 + "px /*0px */; height: " + 10 + "px; width: " + 10 + "px; border-radius: 50%; cursor:pointer; border: 1px solid #FFFFFF;"]];
			main.createHTML("a", currentElement, elementId);

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_0";
			currentElement = [];
			main.createHTML("div", currentElement, elementId);

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_outer";currentElement = [["class", "ajax__multi_slider_default handle_horizontal_left handle_noforcepressed"], ["aria-hidden", "true"], ["tabindex", "-1"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_FIXED_1"], ["style", "overflow:hidden;cursor:pointer; top: " + 6.5 + "px /*0px */; height: " + 10 + "px; width: " + 10 + "px; border-radius: 50%; left:" + rightSlider_left + "px; background-color: #CCCCCC;"]];
			main.createHTML("a", currentElement, elementId);

			//new outer element to increase the touch are for slider on right

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_outer";currentElement = [["class", "ajax__multi_slider_default handle_horizontal_left handle_noforcepressed"],["aria-hidden", "true"], ["tabindex", "-1"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_1"], ["style", "overflow:hidden;cursor:pointer; top: " + (Math.abs(rightSlider_top) - 5) + "px /*0px */; height: " + (Math.abs(sliderHeight) + 15) + "px; width: " + (Math.abs(sliderWidth) + 15) + "px; border-radius: 50%; left:" + (Math.abs(rightSlider_left) + 10) + "px;background-color:transparent;border: 0px solid #FFFFFF;"]];
			main.createHTML("a", currentElement, elementId);

			currentElement = [["class", "ajax__multi_slider_default handle_horizontal_left handle_noforcepressed"], ["role", "slider"], ["aria-valuemin", 0], ["aria-valuemax", g.t.xAxis.barChartTextToDisplay.length - 1], ["aria-valuenow", g.t.xAxis.barChartTextToDisplay.length - 1], ["aria-valuetext", rangeLabelUpper.replace("-", g.localizedStrings.TO)], ["tabindex", "0"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11"], ["style", "overflow:hidden;cursor:pointer; top: " + rightSlider_top + "px /*0px */; height: " + sliderHeight + "px; width: " + sliderWidth + "px; border-radius: 50%; left:" + rightSlider_left + "px; border: 1px solid #FFFFFF;"]];
			main.createHTML("a", currentElement, elementId);

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_0";
			currentElement = [];
			main.createHTML("div", currentElement, elementId);

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_outer";
			currentElement = [["class", "ajax__multi_slider_default inner_rail_horizontal"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_inner"], ["style", "outline:none; left:0px;"], ["tabindex", "-1"]]; // width:" + (g.CalContainerWidth - g.innerCssWidth) + "px"]
			main.createHTML("a", currentElement, elementId);

			var currentTickLeft = startTickLeft;
			var currentTargetLeft = currentTickLeft - ((barWidth + space) / 2);

			var targetWidth = barWidth + space;

			for (var i = 0; i <= g.seriesLength; i++) {
				//tick and target elements to track points on slider...
				elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviourRailSection";
				currentElement = [["class", "slider_tick_active"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6Boundary_Tick_" + i], ["style", "left:" + currentTickLeft + "px"], ["title", ""]];
				main.createHTML("div", currentElement, elementId);


				currentElement = [["class", "slider_tick_targetbox"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6Boundary_TickTouchTarget_" + i], ["style", "left:" + currentTargetLeft + "px; width:" + targetWidth + "px"], ["title", ""]];
				main.createHTML("div", currentElement, elementId);

				currentTickLeft += barWidth + space;
				currentTargetLeft = currentTickLeft - ((barWidth + space) / 2);

			}//for loop ends here

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6_SliderLoadContainer";
			currentElement = [["class", "handle_label_section ms-ref-allSec"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6LabelSection"]];
			if (g.IsRTLSelected()) {
				var rtlCss = ["style", "direction:rtl"]
				currentElement.push(rtlCss);
			}
			main.createHTML("div", currentElement, elementId);

			elementId = g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6LabelSection";
			currentElement = [["class", "handle_label"], ["id", g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6RangeLabel"]];
			e = main.createHTML("span", currentElement, elementId);
			e.innerHTML = g.localizedStrings.FACET_ALL;//Mscrm.ExternalSearch.getBarChartAllTextToDisplay();

		},
		createHTML: function (elementType, attr, parentIs) {
			var e = g.d.createElement(elementType);
			for (var i = 0; i < attr.length; i++) {
				e.setAttribute(attr[i][0], attr[i][1]);
			}
			document.getElementById(parentIs).appendChild(e);
			return e;
		},
		CalcualteBarHeight: function (arr) {
			var percents = [];
			var max = g.overridebarchartarraymaxnumber;
			var tMax = Math.max.apply(Math, arr); // eg. picks out 6926 
			/* First Condition (in below if): Runs for slider only. Second condition (in below if) : This condition protects from being applied a lower max number 
				if it founds max number in bar chart sent array greater than g.overridebarchartarraymaxnumber. */
			if (g.overridebarchartarraymaxnumber == null || g.overridebarchartarraymaxnumber < tMax) {
				max = tMax
			}
			for (var i = 0; i < arr.length; i++) {
				percents.push(Math.round(arr[i] / max * 50.0));
			}

			return percents;
		},
		CalculateContainerWidth: function (len) {
			return len * 32;
		},
		InvokeBarClickEvent: function (p, q, r, s, t, u, v) {
			if (target.series[0].data[p] != 0) {
				main.RememberHandlesLastPosition();
				//Initialize the bar click events in loop for every container once at loading.
				main.SetBarAndTickClickEventForSingleBar(p, q, r, s, t, u, v);
				g.secondTimeClickEvent = true;
				main.UpdateRangeBarTextAtBottom(true);
			}
		},
		SetBarAndTickClickEventForSingleBar: function (barElementId1, tickElementId1, tickElementId2, handle1Value, handle2Value, innerWidth, innerLeft) {
			main.UnsetAndDehighLightTracksAndBars();
			//Move slider bar to selected postion
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_0").css("left", handle1Value + "px");
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00").css("left", handle1Value + "px");
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_FIXED_0").css("left", (handle2Value) + "px");
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_1").css("left", handle2Value + "px");
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11").css("left", handle2Value + "px");
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_FIXED_1").css("left", (handle2Value) + "px");
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_inner").css({ "width": innerWidth + "px", "left": innerLeft + "px" });

			//change bar top color to gray
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6_HistogramActiveBar" + barElementId1).css("border-color", "#333333");

			//Change slider color
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6Boundary_Tick_" + tickElementId1).css({ "background-color": "#FFFFFF" /* "#2a8dd4" */, "border": "1px solid #FFFFFF /* #2a8dd4 */" });
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6Boundary_Tick_" + tickElementId2).css({ "background-color": "#FFFFFF" /* "#2a8dd4" */, "border": "1px solid #FFFFFF /* #2a8dd4*/" });
		},
		UpdateRangeBarTextAtBottom: function (isSubmit) {

			var textToUpdate;

			var lf = main.FindClosest((parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00").css('left'), 10))) + g.sliderWidth / 2;
			var l = Math.round(lf / g.leftConstant);
			if (l === -0) {
				l = 0;
			}

			var rt = main.FindClosest((parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11").css('left'), 10))) + g.sliderWidth / 2;
			var r = Math.round(rt / g.leftConstant);

			if (g.isBarChartEnabled) {
				g.finalTextToAppend = g.appendTextDisplay;
			}
			else
			{
				if (l === 0) {
					g.finalTextToAppend = "< ";
				}
				else if (r === g.seriesLength) {
					g.finalTextToAppend = "> ";
				}
			}

			//override l values because we are having numeric sliders to main consistancy increment by 1.
			if (g.IsNextVersionOfSlider) { r = r + 1; }

			// left slider is left most
			if (l === 0) {
				if (g.isBarChartEnabled && r === g.seriesLength) {
					textToUpdate = g.localizedStrings.FACET_ALL;
				}
				else {
					textToUpdate = g.finalTextToAppend + " " + g._BarChartTextToDisplay[r];
				}
			}
			// right slider is right most
			else if (r === g.seriesLength) {
				textToUpdate = g.finalTextToAppend + " " + g._BarChartTextToDisplay[l];
			}
			// if neither slider is at ends
			else {
				textToUpdate = g._BarChartTextToDisplay[l] + " - " + g._BarChartTextToDisplay[r];
			}

			if (!g.isBarChartEnabled) {
				textToUpdate = g._BarChartTextToDisplay[l] + " - " + g._BarChartTextToDisplay[r];
			}

			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6RangeLabel").html(textToUpdate);

			// updating aria-valuenow attribute to read correct current position
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00").attr("aria-valuenow", l);
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11").attr("aria-valuenow", r - 1);

			main._ExecuteWebApiMethodOnModifiedDate.length = 0;

			if (!g.IsReturnTypeAsIndex) {
				if (!g.isBarChartEnabled) {
					var l = lf / g.leftConstant;
					var r = rt / g.leftConstant;
					main._ExecuteWebApiMethodOnModifiedDate.push(g._Categories[l]);
					main._ExecuteWebApiMethodOnModifiedDate.push(g._Categories[r]);
				}
				else {
					main._ExecuteWebApiMethodOnModifiedDate.push(g._BarChartTextToDisplay[lf / g.leftConstant]);
					main._ExecuteWebApiMethodOnModifiedDate.push(g._BarChartTextToDisplay[rt / g.leftConstant]);
				}
			}
			else {
				main._ExecuteWebApiMethodOnModifiedDate.push(lf / g.leftConstant);
				main._ExecuteWebApiMethodOnModifiedDate.push(rt / g.leftConstant);
			}
			if (isSubmit) {
				main.SendReponseBackToParentPage();
			}

			return textToUpdate;
		},
		UnsetAndDehighLightTracksAndBars: function () {
			//left side handle loop
			for (var i = 0; i < g.seriesLength; i++) {
				$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6Boundary_Tick_" + i).css({ "background-color": "#ababab", "border": "1px solid #ababab" });
			}
			//To Unset last Tick html element.
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6Boundary_Tick_" + i).css({ "background-color": "#ababab", "border": "1px solid #ababab" });
		},
		DragBothSliders: function () {
			main.DraggableRangeSliderForBarChartFroLeftToRight();
			main.DraggableRangeSliderForBarChartFromRightToLeft();
		},
		DraggableRangeSliderForBarChartFroLeftToRight: function () {
			var leftRangeBar = $("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_0");

			leftRangeBar.on('mousedown touchstart',function (e) {
				e.preventDefault();
				g.mouseDownPosition = main.getPointerEvent(e).pageX;
				g.mouseDownAbsolutePosition = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_0").css('left'), 10);
				main.RememberHandlesLastPosition();
				g.secondTimeClickEvent = true;
				main._MouseDownForRightBar = false;
				main._MouseDownForLeftBar = true;
				$(document).on('mousemove touchmove',(main.mouseL))
					.on('mouseup touchend touchcancel',function (e) {
					main._MouseDownForLeftBar = false;
					e.stopPropagation();
					e.stopImmediatePropagation();
					e.cancelBubble = true;
					$(document).unbind('mouseup touchend touchcancel');
					var currentPosition = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_0").css('left'), 10) -12.5;
					var isSubmit = Math.round(Math.abs(currentPosition - g.mouseDownAbsolutePosition) / g.leftConstant) > 0 ? true : false;
					main.SetRangeBarPositionToTrackPoints(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_0", main.FindClosestOuter(currentPosition), 'LHSH', isSubmit);
				});
			});

			leftRangeBar = $("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00");

			leftRangeBar.on('mousedown touchstart', function (e) {
				e.preventDefault();
				g.mouseDownPosition = main.getPointerEvent(e).pageX;
				g.mouseDownAbsolutePosition = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00").css('left'), 10);
				main.RememberHandlesLastPosition();
				g.secondTimeClickEvent = true;
				main._MouseDownForRightBar = false;
				main._MouseDownForLeftBar = true;
				$(document).on('mousemove touchmove', (main.mouseL))
					.on('mouseup touchend touchcancel', function (e) {
						main._MouseDownForLeftBar = false;
						e.stopPropagation();
						e.stopImmediatePropagation();
						e.cancelBubble = true;
						$(document).unbind('mouseup touchend touchcancel');
						var currentPosition = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00").css('left'), 10);
						var isSubmit = Math.round(Math.abs(currentPosition - g.mouseDownAbsolutePosition) / g.leftConstant) > 0 ? true : false;
						main.SetRangeBarPositionToTrackPoints(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00", main.FindClosest(currentPosition), 'LHSH', isSubmit);
					});
			});
		},
		getPointerEvent: function(event){
			return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
		},
		mouseL: function (e) {
			if (main._MouseDownForLeftBar) {
				main.LeftMostRangeBarMove(main.getPointerEvent(e).pageX - g.mouseDownPosition);
			} else { e.stopPropagation(); e.cancelBubble = true; }
		},
		LeftMostRangeBarMove: function (shiftLeft) {
			var rightBarCssPosition = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_1").css('left'), 10);
			if (rightBarCssPosition >= g.mouseDownAbsolutePosition + shiftLeft + g.leftConstant && g.mouseDownAbsolutePosition + shiftLeft >= 0 - g.sliderWidth / 2) {
				$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_0").css("left", (g.mouseDownAbsolutePosition + shiftLeft)+ "px");
				$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00").css("left", g.mouseDownAbsolutePosition + shiftLeft + "px");
			}
		},
		DraggableRangeSliderForBarChartFromRightToLeft: function () {
			var rightRangeBar = $("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_1");

			rightRangeBar.on('mousedown touchstart',function (e) {
				g.mouseDownPosition = main.getPointerEvent(e).pageX;
				g.mouseDownAbsolutePosition = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_1").css('left'), 10);
				main.RememberHandlesLastPosition();
				g.secondTimeClickEvent = true;
				main._MouseDownForLeftBar = false;
				main._MouseDownForRightBar = true;
				$(document).on('mousemove touchmove',(main.mouseR))
					.on('mouseup touchend touchcancel',function (e) {
					main._MouseDownForRightBar = false;
					e.stopPropagation();
					e.stopImmediatePropagation();
					e.cancelBubble = true;
					$(document).unbind('mouseup touchend touchcancel');
					var currentPosition = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_1").css('left'), 10) - 12.5;
					var isSubmit = Math.round(Math.abs(currentPosition - g.mouseDownAbsolutePosition) / g.leftConstant) > 0 ? true : false;
					main.SetRangeBarPositionToTrackPoints(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_1", main.FindClosestOuter(currentPosition), 'RHSH', isSubmit);
				});
			});

			rightRangeBar = $("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11");

			rightRangeBar.on('mousedown touchstart', function (e) {
				g.mouseDownPosition = main.getPointerEvent(e).pageX;
				g.mouseDownAbsolutePosition = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11").css('left'), 10);
				main.RememberHandlesLastPosition();
				g.secondTimeClickEvent = true;
				main._MouseDownForLeftBar = false;
				main._MouseDownForRightBar = true;
				$(document).on('mousemove touchmove', (main.mouseR))
					.on('mouseup touchend touchcancel', function (e) {
						main._MouseDownForRightBar = false;
						e.stopPropagation();
						e.stopImmediatePropagation();
						e.cancelBubble = true;
						$(document).unbind('mouseup touchend touchcancel');
						var currentPosition = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11").css('left'), 10);
						var isSubmit = Math.round(Math.abs(currentPosition - g.mouseDownAbsolutePosition) / g.leftConstant) > 0 ? true : false;
						main.SetRangeBarPositionToTrackPoints(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11", main.FindClosest(currentPosition), 'RHSH', isSubmit);
					});
			});
		},
		mouseR: function (e) {
			if (main._MouseDownForRightBar) {
				main.RightMostRangeBarMove(main.getPointerEvent(e).pageX - g.mouseDownPosition);
			}
			else { e.stopPropagation(); e.cancelBubble = true; }
			g.handle1Left = 10;
		},
		RightMostRangeBarMove: function (shiftLeft) {
			var LeftBarCssPosition = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_0").css('left'), 10);

			if (LeftBarCssPosition <= g.mouseDownAbsolutePosition + shiftLeft - g.leftConstant && g.mouseDownAbsolutePosition + shiftLeft <= 0 - sliderWidth / 2 + g.seriesLength * g.leftConstant) {
				$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_1").css("left", g.mouseDownAbsolutePosition + shiftLeft + "px");
				$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11").css("left", g.mouseDownAbsolutePosition + shiftLeft + "px");
			}
		},
		RememberHandlesLastPosition: function () {
			var leftHandlecurrentPosition = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_0").css('left'), 10);
			var rightHandlecurrentPosition = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_1").css('left'), 10);

			var handlesLastPosition_0 = Math.round(main.FindClosest(leftHandlecurrentPosition) / g.leftConstant);
			var handlesLastPosition_1 = Math.round(main.FindClosest(rightHandlecurrentPosition) / g.leftConstant);

			main._RememberHandlesLastPosition[0] = handlesLastPosition_0 === -0 ? 0 : handlesLastPosition_0;
			main._RememberHandlesLastPosition[1] = handlesLastPosition_1 === -0 ? 0 : handlesLastPosition_1;
			return main._RememberHandlesLastPosition;
		},
		SetAndPerformKeyActions: function () {
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00").keydown(function (e) {
				switch (e.keyCode) {
					case 37:
					case 38:
					case 39:
					case 40:
					case 13:
						if (!e.handled && !g.isPressed) {
							g.KeyValue = e.keyCode;
							g.isPressed = true;
							main.CallKeyEvents();
							e.stopPropagation();
							e.handled = true;
						}
						break;
				}
			});

			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11").keydown(function (e) {
				switch (e.keyCode) {
					case 37:
					case 38:
					case 39:
					case 40:
					case 13:
						if (!e.handled && !g.isPressed) {
							g.KeyValue = e.keyCode;
							g.isPressed = true;
							main.CallKeyEvents();
							e.stopPropagation();
							e.handled = true;
						}
						break;
				}
			});

			$(document).keydown(function (e) {
				switch (e.keyCode) {
					case 13:
						if (!e.handled && !g.isPressed) {
							g.KeyValue = e.keyCode;
							g.isPressed = true;
							main.RepositionsBarsOn13();
							e.stopPropagation();
							e.handled = true;
						}
						break;
				}
			});

			$(document).keyup(function (e) {
				switch (e.keyCode) {
					case 37:
					case 38:
					case 39:
					case 40:
						g.isKeyDown = false;
						break;
				}
			});
		},
		CallKeyEvents: function () {
			var currentFocusId = $(':focus');
			if (currentFocusId.length > 0) {
				var lt = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00").css('left'), 10);
				var rt = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11").css('left'), 10);

				g.seriesLength = getSeriesLength(g.u);
				g.leftConstant = getLeftConstant(5, 5, 10, g.seriesLength);

				if (currentFocusId[0].id == g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00") {
					var newLabel = "";

					if ((g.KeyValue == 38 || g.KeyValue == 39) && main.FindClosest(lt + g.leftConstant) < main.FindClosest(rt)) { lt = lt + g.leftConstant; }
					else if ((g.KeyValue == 40 || g.KeyValue == 37) && main.FindClosest(lt - g.leftConstant) < main.FindClosest(rt)) { lt = lt - g.leftConstant; }
					else if (g.KeyValue == 13) {
						main.SendReponseBackToParentPage();
					}
					if (lt < rt && main.FindClosest(lt) < main.FindClosest(rt)) {
						g.secondTimeClickEvent = true;
						main.RememberHandlesLastPosition();
						newLabel = main.SetRangeBarPositionToTrackPoints(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00", main.FindClosest(lt), 'LHSH', false);
						
						if (main.FindClosest(lt) == main.FindClosest(parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_FIXED_0").css('left'), 10))) {
							var handle = document.getElementById(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00");
							handle.style.height = sliderHeight + "px";
							handle.style.width = sliderHeight + "px";
							handle.style.borderColor = "#CCCCCC";
							handle.style.borderRadius = "50%";
							handle.style.top = leftSlider_top + "px";
						}
						else {
							var handle = document.getElementById(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00");
							handle.style.height = "3px";
							handle.style.width = "1px";
							handle.style.borderColor = "#FFFFFF";
							handle.style.borderRadius = "0%";
							handle.style.left = (main.FindClosest(lt) + g.sliderWidth / 2) + "px";
							handle.style.top = (leftSlider_top + 4) + "px";
						}
					}
					newLabel = newLabel.toString().replace("-", g.localizedStrings.TO).toLowerCase();

					var currentSliderElement_other = document.getElementById(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11");
					currentSliderElement_other.setAttribute("aria-valuetext", newLabel);

					var currentSliderElement = document.getElementById(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00");
					currentSliderElement.setAttribute("aria-label", g.localizedStrings.RELEVANCE_SEARCH_LEFTSLIDER_SEARCH_SELECTOR);
					currentSliderElement.setAttribute("aria-valuenow", main.FindClosest(lt) / g.leftConstant);
					currentSliderElement.setAttribute("aria-valuetext", newLabel);

					currentSliderElement.focus();
				}

				else if (currentFocusId[0].id == g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11") {
					var newLabel = "";

					if ((g.KeyValue == 38 || g.KeyValue == 39) && main.FindClosest(lt) < main.FindClosest(rt + g.leftConstant)) { rt = rt + g.leftConstant; }
					else if ((g.KeyValue == 40 || g.KeyValue == 37) && main.FindClosest(lt) < main.FindClosest(rt - g.leftConstant)) { rt = rt - g.leftConstant; }
					else if (g.KeyValue == 13) {
						main.SendReponseBackToParentPage();
					}
					if (lt < rt && main.FindClosest(lt) < main.FindClosest(rt)) {
						g.secondTimeClickEvent = true;
						main.RememberHandlesLastPosition();
						newLabel = main.SetRangeBarPositionToTrackPoints(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11", main.FindClosest(rt), 'RHSH', false);
						
						if (main.FindClosest(rt) == main.FindClosest(parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_FIXED_1").css('left'), 10))) {
							var handle = document.getElementById(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11");
							handle.style.height = sliderHeight + "px";
							handle.style.width = sliderHeight + "px";
							handle.style.borderColor = "#CCCCCC";
							handle.style.borderRadius = "50%";
							handle.style.top = leftSlider_top + "px";
						}
						else {
							var handle = document.getElementById(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11");
							handle.style.height = "3px";
							handle.style.width = "1px";
							handle.style.borderColor = "#FFFFFF";
							handle.style.borderRadius = "0%";
							handle.style.left = (main.FindClosest(rt) + g.sliderWidth / 2) + "px";
							handle.style.top = (leftSlider_top + 4) + "px";
						}
					}
					newLabel = newLabel.toString().replace("-", g.localizedStrings.TO).toLowerCase();

					var currentSliderElement_other = document.getElementById(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00");
					currentSliderElement_other.setAttribute("aria-valuetext", newLabel);

					var currentSliderElement = document.getElementById(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11");

					currentSliderElement.setAttribute("aria-label", g.localizedStrings.RELEVANCE_SEARCH_RIGHTSLIDER_SEARCH_SELECTOR);
					currentSliderElement.setAttribute("aria-valuenow", main.FindClosest(lt) / g.leftConstant);
					currentSliderElement.setAttribute("aria-valuetext", newLabel);

					currentSliderElement.focus();
				}
			}

			g.isPressed = false;

		},
		RepositionsBarsOn13: function () {
			var currentFocusId = $(':focus');
			var barElementSubId = "histogram_bar_link";

			if (currentFocusId.length > 0) {
				if (currentFocusId[0].id.indexOf(barElementSubId) !== -1) {
					g.secondTimeClickEvent = true;
					var x = currentFocusId[0].id.split("_");
					var activeBar = x[3].replace(/\D/g, '');
					main.RememberHandlesLastPosition();
					var d = document.getElementById(x[0] + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6_HistogramActiveBar" + activeBar);
					d.click();
				}
			}
		},
		SetRangeBarPositionToTrackPoints: function (elementId, positionToFix, handle, isSubmit) {
			$("#" + elementId).css("left", positionToFix + "px");
			//To set and unset range slider bar color.
			main.SetSliderColorToSelectedBars();
			//Highlight tracks and bars
			main.SetHighLightTracksAndBars();
			//Update the RangeBar text At bottom.
			return main.UpdateRangeBarTextAtBottom(isSubmit);
		},
		SetSliderColorToSelectedBars: function () {
			var lf = main.FindClosest(parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00").css('left'), 10));
			var rt = main.FindClosest(parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11").css('left'), 10));
			var wd = Math.round((rt - lf) / g.leftConstant) * g.leftConstant;
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_inner").css({ "left": lf + (g.sliderWidth / 2) + "px", "width": wd + "px" });
		},
		SetHighLightTracksAndBars: function () {
			var lf = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00").css('left'), 10);
			var rt = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11").css('left'), 10);

			//Resetting all colors
			main.UnsetAndDehighLightTracksAndBars();
			main.ResetHighLightTracksAndBars();

			var leftBoundIndex = Math.round(lf / g.leftConstant);
			if (leftBoundIndex === -0) {
				leftBoundIndex = 0;
			}

			var rightBoundIndex = Math.round(rt / g.leftConstant);

			//left side handle loop
			for (var i = 0; i < leftBoundIndex; i++) {
				$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6Boundary_Tick_" + i).css({ "background-color": "#ababab", "border": "1px solid #ababab" });

				var currentHistogramBar = $("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6_HistogramActiveBar" + i);
				currentHistogramBar.css({ "background-color": "#ababab", "border": "1px solid #ababab" });
				currentHistogramBar.mouseover(function () {
					$(this).css("background-color", "#ababab");
				}, function () {
					$(this).css("background-color", "#ababab");
				});
			}

			for (var i = leftBoundIndex; i < rightBoundIndex; i++) {
				var currentHistogramBar = $("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6_HistogramActiveBar" + i);
				currentHistogramBar.css({ "background-color": "#00CED3", "border-top": "2px solid #FFFFFF", "border-left": "none", "border-right": "none", "border-bottom": "none" });
				currentHistogramBar.hover(function () {
					$(this).css("background-color", "#00CED3");
				}, function () {
					$(this).css("background-color", "#00CED3");
				});
			}

			//Right side handle loop
			for (var i = rightBoundIndex; i < g.seriesLength; i++) {
				$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6Boundary_Tick_" + i).css({ "background-color": "#ababab", "border": "1px solid #ababab" });

				var currentHistogramBar = $("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6_HistogramActiveBar" + i);
				currentHistogramBar.css({ "background-color": "#ababab", "border": "1px solid #ababab" });
				currentHistogramBar.hover(function () {
					$(this).css("background-color", "#ababab");
				}, function () {
					$(this).css("background-color", "#ababab");
				});
			}
		},
		ResetHighLightTracksAndBars: function () {
			//left side handle loop
			for (var i = 0; i < g.seriesLength; i++) {
				$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6Boundary_Tick_" + i).css({ "background-color": "#FFFFFF", /* "#2a8dd4" */ "border": "1px solid #FFFFFF /* #2a8dd4 */" });
			}
		},
		UnsetAndDehighLightTracksAndBars: function () {
			//left side handle loop
			for (var i = 0; i < g.seriesLength; i++) {
				$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6Boundary_Tick_" + i).css({ "background-color": "#ababab", "border": "1px solid #ababab" });
			}
			//To Unset 5th Tick html element.
			$("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6Boundary_Tick_" + i).css({ "background-color": "#ababab", "border": "1px solid #ababab" });
		},
		FindClosest: function (num) {
			var arr = [];
			var a = leftSlider_left;
			for (var i = 0; i <= g.seriesLength; i++) {
				arr.push(a);
				a = a + g.leftConstant;
			}
			var curr = arr[0];
			var diff = Math.abs(num - curr);
			for (var val = 0; val < arr.length; val++) {
				var newdiff = Math.abs(num - arr[val]);
				if (newdiff < diff) {
					diff = newdiff;
					curr = arr[val];
				}
			}
			return curr;
		},
		FindClosestOuter: function (num) {
			var arr = [];
			var a = leftSlider_left_outer;
			for (var i = 0; i <= g.seriesLength; i++) {
				arr.push(a);
				a = a + g.leftConstant;
			}
			var curr = arr[0];
			var diff = Math.abs(num - curr);
			for (var val = 0; val < arr.length; val++) {
				var newdiff = Math.abs(num - arr[val]);
				if (newdiff < diff) {
					diff = newdiff;
					curr = arr[val];
				}
			}
			return curr;
		},
		UpdateClosureSettings: function () {
			if (!g.isBarChartEnabled) {
				main.FinalClosureSettings();
			}
		},
		FinalClosureSettings: function () {
			var currentAttribute = [["style", "display:none"]];

			var elementId = "#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6HistogramContainer";
			main.setHTMLAttribute(elementId, currentAttribute);

			var elementId = "#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderContainer_ExtentLabelSection";
			main.setHTMLAttribute(elementId, currentAttribute);
		},
		setHTMLAttribute: function (elementId, attArray) {
			for (var i = 0; i < attArray.length; i++) {
				$(elementId).attr(attArray[i][0], attArray[i][1]);
			}
		},
		GetCurrentEnabledBars: function () {
			return main._ExecuteWebApiMethodOnModifiedDate;
		},
		SetSpecifiedBars: function (recieveBarsArr) {
			var currentPosition = main._BarHighlightArray[recieveBarsArr[0]][0];
			main.SetRangeBarPositionToTrackPoints(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_0", main.FindClosestOuter((currentPosition-12.5)), 'LHSH', false);
			main.SetRangeBarPositionToTrackPoints(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00", main.FindClosest(currentPosition), 'LHSH', false);
			main.SetRangeBarPositionToTrackPoints(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_FIXED_0", main.FindClosest(currentPosition), 'RHSH', false);
			var currentPosition = main._BarHighlightArray[recieveBarsArr[1]][0];
			main.SetRangeBarPositionToTrackPoints(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_1", main.FindClosestOuter((currentPosition - 12.5)), 'RHSH', false);
			main.SetRangeBarPositionToTrackPoints(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11", main.FindClosest(currentPosition), 'RHSH', false);
			main.SetRangeBarPositionToTrackPoints(g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_FIXED_1", main.FindClosest(currentPosition), 'RHSH', false);
			barChartLeftSliderBucketTracker = false;
			return true;
		},
		FinalCall: function () {
			if (g.setPoints) {
				var a = [g.setPointsX1, g.setPointsX2];
				main.SetSpecifiedBars(a);
			}
		},
		SendReponseBackToParentPage: function () {
			if (g.secondTimeClickEvent) {
				var recieveBarResponseData = [];
				recieveBarResponseData.length = 0;
				var isResultsRefresh = true;
				var isResultsRefreshWhenNoChange = true;
				if (g.isBarChartEnabled) {
					isResultsRefresh = main.ShouldResultRefreshWhenResultCountIsZero();
					isResultsRefreshWhenNoChange = main.ShouldRefreshWhenNoChangeInData();
				}
				var containerId = document.getElementById(g.u).children[1].id;
				var a = ["", g.cl, g.isBarChartEnabled, isResultsRefresh, containerId, isResultsRefreshWhenNoChange];
				recieveBarResponseData.push(a);

				var lt = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00").css('left'), 10);
				var rt = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_11").css('left'), 10);
				
				var value1 = Math.round(lt / g.leftConstant);
				var value2 = Math.round(rt / g.leftConstant);
				recieveBarResponseData.push([value1, value2]);

				// Push the slider selected values
				recieveBarResponseData.push([g._Categories[value1], g._Categories[value2]]);

				//Push the slider end values
				recieveBarResponseData.push([g._Categories[0], g._Categories[g._Categories.length - 1]]);

				var lf = parseInt($("#" + g.u + "_ctl00_PlaceHolderLeftNavBar_ctl00_csr6SliderBehaviour_handle_00").css('left'), 10);
				$(document).unbind('mouseup');
				var customEvent = document.createEvent("CustomEvent");
				customEvent.initCustomEvent("BarChartClick", true, false, {
					'recieveBarResponseData': recieveBarResponseData
				})

				$("#" + g.c[0].id).trigger({ type: "BarChartClick", facetDetails: recieveBarResponseData[0], indexData: recieveBarResponseData[1], rangeData: recieveBarResponseData[2], sliderEnds: recieveBarResponseData[3] });

			}
		},
		ShouldResultRefreshWhenResultCountIsZero: function () {
			var k = main.GetCurrentEnabledBars();
			var refreshState = false;
			for (var i = k[0]; i < k[1]; i++) {
				if (target.series[0].data[i] != 0) {
					refreshState = true;
					break;
				}
			}
			return refreshState;
		},
		ShouldRefreshWhenNoChangeInData: function () {
			var refreshState = false;
			var k = main.GetCurrentEnabledBars();
			var r = main._RememberHandlesLastPosition;
			var lowX, highX, lowY, highY;
			if (JSON.stringify(k) == JSON.stringify(r)) {
				return refreshState;
			}
			lowX = r[0]; highX = k[0];
			lowY = r[1]; highY = k[1];
			if (k[0] < r[0]) {
				lowX = k[0];
				highX = r[0];
			}
			if (k[1] < r[1]) {
				lowY = k[1];
				highY = r[1];
			}

			for (var i = lowX; i < highX; i++) {
				if (target.series[0].data[i] != 0) {
					refreshState = true;
					break;
				}
			}

			// To avoid further checking for refreshstate to true.
			if (refreshState) return refreshState;

			for (var i = lowY; i < highY; i++) {
				if (target.series[0].data[i] != 0) {
					refreshState = true;
					break;
				}
			}
			return refreshState;
		},
	};
	var Universal = {
		Initialize: function () {
			g.Initialize();
			main.prepareHTML();
			main.DragBothSliders();
			main.UpdateClosureSettings();
			main.FinalCall();
			main.SetAndPerformKeyActions();
		},
	}.Initialize();
	return main;
};