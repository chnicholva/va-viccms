var _bFieldSelectPrimaryField = false; 	// first item pair of Selected array is primary

var _iFieldSelectHeight = 200;
var _bFieldSelectShowUp = true;
var _bFieldSelectShowDown = true;
var _disableAddButtonFlag = false;
var _disableRemoveButtonFlag = false;
var availableValuesText = "";
var selectedValuesText = "";
var populateAvilableValues = true;

var _iUsedAry;
// list of ints keep track of selected items so we can reinsert in correct place.
var _objList;
var _rtnObjList;

// drawFieldSelect draws the field selector object for visually manipulating lists of id's
//	
function drawFieldSelect(sAvailAry, sSelectedAry) {
	var encodedHeight = CrmEncodeDecode.CrmHtmlAttributeEncode(_iFieldSelectHeight);
	// for FieldSelect Avaliable values left title and the fieldSelect Selected values right Title
	var getResourceStrings = USD.Resources.AuditAndDiagnosticsSettingPage;
	if (!IsNull(getResourceStrings)) {
		availableValuesText = getResourceStrings.availableValues;
		selectedValuesText = getResourceStrings.selectedValues;
	}

	if ($get('divFieldSelect') != null) {
		$get('divFieldSelect').innerHTML =
		"<table cellspacing='5' cellpadding='0' style='table-layout:fixed;width:100%;-moz-user-select: none;'>"
		+ "<col width='*'><col width='50px'><col width='*'><col width='50px'><tr>"
		+ "<td><b class='label'>" + CrmEncodeDecode.CrmHtmlEncode(availableValuesText) + "</b></td>"
		+ "<td>&nbsp;</td>"
		+ "<td><b class='label'>" + CrmEncodeDecode.CrmHtmlEncode(selectedValuesText) + "</b></td>"
		+ "</tr><tr>"
		+ "<td><div id='objList' class='divList' style='height:" + encodedHeight + "px;' tabIndex=0 onfocus='handleListFocus(new Sys.UI.DomEvent(event))' onkeydown='handleListKey(new Sys.UI.DomEvent(event))' hidefocus='true'></div></td>"
		+ "<td align='center'>"
			+ "<button id='btnRight' type='button' onclick='MoveRight();' class='ms-usd-RefreshDialog-Button' style='min-width: 40px;'>" + CrmEncodeDecode.CrmHtmlEncode(">>") + "</button>"
			+ "<p><button id='btnLeft' type='button' onclick='MoveLeft();' class='ms-usd-RefreshDialog-Button' style='min-width: 40px;'>" + CrmEncodeDecode.CrmHtmlEncode("<<") + "</button>"
		+ "</td>"
		+ "<td><div id='rtnObjList' class='divList' style='height:" + encodedHeight + "px;' tabIndex=0 onfocus='handleListFocus(new Sys.UI.DomEvent(event))' onkeydown='handleListKey(new Sys.UI.DomEvent(event))' hidefocus='true'></div></td>"
		+ "<td align='center'>"
			+ "<button id='btnUp' type='button' onclick='MoveUp();' class='ms-usd-RefreshDialog-Button' style='min-width: 40px;'>" + "&#923;" + "</button>"
			+ "<p><button id='btnDown' type='button' class='ms-usd-RefreshDialog-Button' style='min-width: 40px;' onclick='MoveDown();'>" + CrmEncodeDecode.CrmHtmlEncode("V") + "</button>"
		+ "</td>"
		+ "</tr></table>";
	}

	_objList = $get('objList');
	_rtnObjList = $get('rtnObjList');
	_objList.innerHTML = "<table cellpadding='2' cellspacing='0' style='width:100%;-moz-user-select: none;'></table>";

	var iAvailLen = sAvailAry[0].length;

	for (var i = 0; i < iAvailLen; i++) {		
			CreateNewRow(i, sAvailAry[0][i], sAvailAry[0][i], sAvailAry[1][i], _objList, false);
	}

	// Now construct the list on the RHS.
	// We can't short-circuit our algo because we don't know if the lists passed in
	// are in (alphabetically) sorted order.
	//
	_rtnObjList.innerHTML = "<table cellpadding='2' cellspacing='0' style='width:100%;-moz-user-select: none;'></table>";

	var iSelectedLen;

	if (sSelectedAry) {
		iSelectedLen = sSelectedAry[0].length;
	}
	else {
		iSelectedLen = 0;
	}

	//Disable Add/Remove buttons
	EnableDisableButtons(true, true);

	// initialize global array
	//	
	_iUsedAry = new Array(iAvailLen);
	for (var i = 0; i < iAvailLen; i++) {
		_iUsedAry[i] = 0;
	}

	for (var j = 0; j < iSelectedLen; j++) {
		var bFound = false;

		for (i = 0; i < iAvailLen; i++) {
			if (sAvailAry[0][i] == sSelectedAry[0][j]) {
				var iOffset = 0;
				for (var k = 0; k < i; k++) {
					iOffset += _iUsedAry[k];
				}

				// _objList here is originally created at beginning of this function, based on data in sAvailAry, 
				// but the same object is also manipulated by MoveRight() function when a match is found.
				// the root cause of this bug is that the two list are out of sync for the bug repro condition.
				// added condition that only the name in the list matches the value in aVailAry, then we consider a match is found.
				var row = XUI.Html.DomUtils.GetFirstChild(_objList).rows[i - iOffset];
				if (sAvailAry[0][i] == row.name) {
					row.selected = 1;
					MoveRight();
					bFound = true;
					_iUsedAry[i] = 1;
					break;
				}
			}
		}

		if ((0 == j) && _bFieldSelectPrimaryField) {
			XUI.Html.DomUtils.GetFirstChild(_rtnObjList).rows[0].disabled = true;
		}

		if (bFound != true) {
			// throw dev warning; item in second list is not in first list!
			//alert("Error: (drawFieldSelect)  Item " + sSelectedAry[0][j] + " not in left list");
			break;
		}
	}
	populateAvilableValues = false;

	//To enable/disable buttons based on page state.
	if (IsFormTypeDisabled()) {
		EnableDisableUserSettings(true);
	}
	else {
		EnableDisableUserSettings(false);
	}
}

//when focus is set to the list the appropriate list item must be selected
function handleListFocus(e) {
	var oTable = XUI.Html.DomUtils.GetFirstChild(e.target);
	if (IsNull(oTable.lastSelected) && oTable.rows.length > 0) {
		HandleSelectRow(oTable.rows[0], false, false);
	}
}

//handle the UP/DOWN arrow and the SPACE key press on the list
function handleListKey(e) {
	var o = e.target;
	while (o.tagName != "DIV") {
		o = o.parentNode;
	}
	var oList = o;
	var oTable = XUI.Html.DomUtils.GetFirstChild(o);
	o = oTable.lastSelected;
	switch (e.keyCode) {
		case KEY_DOWN:
			if (o) {
				var oNextSibling = XUI.Html.DomUtils.GetNextSibling(o);
				if (oNextSibling) {
					//if the ctrl key is pressed and the next sibling is selected then unselect this row and make the next row the lastselected row
					if (e.ctrlKey && oNextSibling.selected == 1) {
						HandleSelectRow(o, e.ctrlKey, e.shiftKey);
						oTable.lastSelected = oNextSibling;
						XUI.Html.DomUtils.GetFirstChild(oNextSibling).className = "currSel";
					}
					else {
						HandleSelectRow(oNextSibling, e.ctrlKey, e.shiftKey);
					}

					ScrollListDown(oList, oNextSibling);

					e.preventDefault();
					e.stopPropagation();
				}
			}
			break;

		case KEY_UP:
			if (o) {
				var oPrevSibling = XUI.Html.DomUtils.GetPrevSibling(o);
				if (oPrevSibling) {
					if (e.ctrlKey && oPrevSibling.selected == 1) {
						HandleSelectRow(o, e.ctrlKey, e.shiftKey);
						oTable.lastSelected = oPrevSibling;
						XUI.Html.DomUtils.GetFirstChild(oPrevSibling).className = "currSel";
					}
					else {
						HandleSelectRow(oPrevSibling, e.ctrlKey, e.shiftKey);
					}

					ScrollListUp(oList, oPrevSibling);

					e.preventDefault();
					e.stopPropagation();
				}
			}
			break;

		case KEY_SPACE:
			if (o) {
				//find the next item that has to be selected once all the selected items are moved over
				var i = o.rowIndex + 1, oSel = null;
				while (i < oTable.rows.length) {
					if (oTable.rows[i].selected == 0) {
						oSel = oTable.rows[i];
						break;
					}
					i++;
				}
				i = o.rowIndex - 1;
				while (!oSel && i >= 0) {
					if (oTable.rows[i].selected == 0) {
						oSel = oTable.rows[i];
						break;
					}
					i--;
				}

				//move the selected row(s) over to the other list
				MoveToOtherList(e);

				// Restore focus on target list as focused row removed from current list.
				oList.focus();

				if (oSel) {
					HandleSelectRow(oSel, false, false);
				}
				e.preventDefault();
				e.stopPropagation();
			}
			break;
	}
}

function ScrollListDown(oList, oRow) {
	// Scroll list if row position is below the visible part of the list;
	// we cannot use scrollIntoView() for this, because it will scroll also in horizontal direction, it causes bugs (110090) in RTL builds.
	var position = oRow.offsetTop + oRow.offsetHeight + 2;
	var listHeight = oList.offsetHeight;
	if (oList.scrollTop < position - listHeight)
		oList.scrollTop = position - listHeight;
}

function ScrollListUp(oList, oRow) {
	// Scroll list if row position is above the visible part of the list;
	// we cannot use scrollIntoView() for this, because it will scroll also in horizontal direction, it causes bugs (110090) in RTL builds.
	var position = oRow.offsetTop;
	if (oList.scrollTop > position)
		oList.scrollTop = position;
}

// CreateNewRow creates a table row to be added to the passed in list
// iIndex is the absolute index when the LHS has all elements
// sName is the inernal name of the row object
// sDisplay is the display name of the row object
// oDestList is the list into which we are inserting a new row
// bReinsert is set to true if we are inserting into back into the LHS.
// 
function CreateNewRow(iIndex, sId, sName, sDisplay, oDestList, bReinsert, sStatecode) {
	var oTable = XUI.Html.DomUtils.GetFirstChild(oDestList);
	var oRow;
	var oCell;

	// Some lower-numbered cells may have been removed; so let's check 
	// to see if our insertion loc should be less than the id.
	//
	if (bReinsert) {

		var iLenDestList = _iUsedAry.length;  // set to original list length
		var iNewLoc = 0;

		for (var i = iIndex; -1 < i; i--) {
			var iOffset = 0;
			for (var k = 0; k < i; k++) {
				iOffset += _iUsedAry[k];
			}
			_iUsedAry[i] = 0;
			var iNewIndex = i - iOffset;

			if ((0 == iNewIndex) || (parseInt(oTable.rows[iNewIndex - 1].cells[0].getAttribute("index"), 10) < iIndex)) {
				iNewLoc = parseInt(iNewIndex, 10);
				break;
			}
		}
		oRow = oTable.insertRow([iNewLoc]);
		oCell = oRow.insertCell(-1);
	}
	else {
		if ((oDestList == _rtnObjList) || (-1 == iIndex)) {
			oRow = oTable.insertRow(-1);
			_iUsedAry[iIndex] = 1;
		}
		else {
			oRow = oTable.insertRow([iIndex]);
		}

		oCell = oRow.insertCell(-1);
	}

	oCell.id = sId;
	oCell.setAttribute("index", iIndex);

	oCell.className = "sel";
	//Title is a plain text and not the html markup. it do not need encoding. Since it is a plain text so encoding is required where the value of title is used not the title itself.
	oCell.title = sDisplay;
	
	oCell.innerHTML = "<nobr class='sel-nobr'>" + sDisplay + "</nobr>";

	oRow.name = sName;
	oRow.selected = 0;

	$addHandler(oRow, "click", selectRow);
	$addHandler(oRow, "dblclick", MoveToOtherList);
}

function GetListName(o) {
	var oId = o.getAttribute('id');

	while ((oId != 'objList') && (oId != 'rtnObjList')) {
		o = o.parentNode;
		oId = o.getAttribute('id');
	}

	return oId;
}

function MoveToOtherList(e) {
	// Find out which list we are in, then call corresponding MoveLeft or MoveRight
	if (!IsFormTypeDisabled()) {
		if (GetListName(e.target) == 'objList') {
			MoveRight();
		}
		else {
			MoveLeft();
		}
	}
}

function MoveLeft() {
	if (!IsFormTypeDisabled()) {
		var rtnObjListFirstChild = XUI.Html.DomUtils.GetFirstChild(_rtnObjList);
		var oRows = rtnObjListFirstChild.rows;
		var iLen = oRows.length;

		for (var i = 0; i < iLen; i++) {
			if (1 == oRows[i].selected) {

				CreateNewRow(oRows[i].cells[0].getAttribute("index"), oRows[i].cells[0].getAttribute("id"), oRows[i].name, XUI.Html.GetText(oRows[i]), _objList, true);

				// delete row and reset source-list indexes (due to remove)
				rtnObjListFirstChild.deleteRow(i);
				i--;
				iLen--;
				rtnObjListFirstChild.lastSelected = null;
			}
		}
		EnableDisableMoveRight();

		// Disable Remove button after all Selected Attributes is been removed
		if (_disableRemoveButtonFlag == true) {
			EnableDisableButtons(true, true);
		}
		UpdateUserSettingsValue();
	}
}

function MoveRight() {
	if (populateAvilableValues || (!populateAvilableValues && !IsFormTypeDisabled())) {
		var objListFirstChild = XUI.Html.DomUtils.GetFirstChild(_objList);
		var oRows = objListFirstChild.rows;
		var iLen = oRows.length;
		var moveItemRight = true;
		var selectedItemCount = 0;

		for (var i = 0; i < iLen; i++) {
			if (1 == oRows[i].selected) {
				selectedItemCount++;
			}
		}

		moveItemRight = EnableDisableMoveRight(selectedItemCount);

		if (!moveItemRight)
			return;

		for (var i = 0; i < iLen; i++) {
			if (1 == oRows[i].selected) {
				CreateNewRow(oRows[i].cells[0].getAttribute("index"), oRows[i].cells[0].getAttribute("id"), oRows[i].name, XUI.Html.GetText(oRows[i]), _rtnObjList, false);

				// delete row and reset source-list indexes (due to remove)
				objListFirstChild.deleteRow(i);
				i--;
				iLen--;
				objListFirstChild.lastSelected = null;
			}
		}
		EnableDisableMoveRight();

		// Disable Add button after all Available Attributes is been selected
		if (_disableAddButtonFlag == true) {
			EnableDisableButtons(true, true);
		}
		UpdateUserSettingsValue();
	}
}

function EnableDisableMoveRight(itemCount) {
	var rtnObjListFirstChild = XUI.Html.DomUtils.GetFirstChild(_rtnObjList);
	var oRightRows = 0;
	var iRightLen = 0;
	var isMultiSelectionAllowed = true;
	var moveItem = true;

	if (rtnObjListFirstChild != undefined && rtnObjListFirstChild != null) {
		oRightRows = rtnObjListFirstChild.rows;
		if (oRightRows != undefined && oRightRows != null) {
			iRightLen = oRightRows.length;
		}
	}
	var oArgs = getDialogArguments();
	if (oArgs != undefined && oArgs != null) {
		var multipleselection = oArgs.IsMultipleSelectionAllowed;
		if (multipleselection != undefined && multipleselection != null) {
			isMultiSelectionAllowed = multipleselection.toLowerCase() == "true" ? true : false;
		}
	}
	var rightButton = document.getElementById("btnRight");
	if (isMultiSelectionAllowed != undefined && isMultiSelectionAllowed != null && !isMultiSelectionAllowed) {
		if (itemCount != undefined && itemCount != null && itemCount > 1) {
			moveItem = false;
			return;
		}
		if (iRightLen >= 1) {
			moveItem = false;
			rightButton.disabled = true;
		}
		else {
			rightButton.disabled = false;
		}
	}
	else {
		rightButton.disabled = false;
	}

	return moveItem;
}

function unSelectRows(oDiv) {
	if (!IsFormTypeDisabled()) {
		var oRows = XUI.Html.DomUtils.GetFirstChild(oDiv).rows;
		var iLen = oRows.length;

		for (var i = 0; i < iLen; i++) {
			oRows[i].selected = 0;
			oRows[i].style.backgroundColor = "#ffffff";
		}
	}
}

function selectRow(e) {
	if (!IsFormTypeDisabled()) {
		HandleSelectRow(e.target, e.ctrlKey, e.shiftKey);
		e.preventDefault();
		e.stopPropagation();
	}
}

function HandleSelectRow(o, ctrlKey, shiftKey) {
	if (!IsFormTypeDisabled()) {
		while (o.tagName != "TR") {
			o = o.parentNode;
		}

		// Check which list was clicked
		var bIsRtnObjList = ('rtnObjList' == GetListName(o));
		var oTable = XUI.Html.DomUtils.GetFirstChild(bIsRtnObjList ? _rtnObjList : _objList);

		if (!ctrlKey && !shiftKey) {
			unSelectRows(o.parentNode.parentNode.parentNode);
		}

		if (shiftKey && oTable.lastSelected) {
			i = Math.min(oTable.lastSelected.rowIndex, o.rowIndex);
			for (; i <= Math.max(oTable.lastSelected.rowIndex, o.rowIndex) ; i++) {
				oTable.rows[i].selected = 1;
				oTable.rows[i].style.backgroundColor = "";
				oTable.rows[i].className = "ms-usd-Settings-Selected";
			}
		}
		else {
			o.selected = (o.selected == 1) ? 0 : 1;
			o.style.backgroundColor = "";
			o.className = "ms-usd-Settings-Selected";
		}

		if (o.selected = (o.selected == 1)) {
			if (bIsRtnObjList) {
				EnableDisableButtons(true, false);
				if (oTable.rows.length == 1) {
					_disableRemoveButtonFlag = true;
				}
			}
			else {
				EnableDisableButtons(false, true);
				if (oTable.rows.length == 1) {
					_disableAddButtonFlag = true;
				}
			}
		}

		var oTable = o;
		while (oTable.tagName != "TABLE") {
			oTable = oTable.parentNode;
		}
		if (oTable.lastSelected) {
			XUI.Html.DomUtils.GetFirstChild(oTable.lastSelected).className = "sel";
		}
		XUI.Html.DomUtils.GetFirstChild(o).className = o.selected == 1 ? "currSel" : "sel";
		oTable.lastSelected = o;

		// If multiselection, we disable the MoveUp and MoveDown buttons
		var isMultiSelection = IsMultiSelection(_rtnObjList);
		if (_bFieldSelectShowUp) {
			$get("btnUp").disabled = isMultiSelection;
		}
		if (_bFieldSelectShowDown) {
			$get("btnDown").disabled = isMultiSelection;
		}
	}
}

// IsMultiSelection returns true if more than one item in the list is selected.
function IsMultiSelection(oList) {
	var oTable = XUI.Html.DomUtils.GetFirstChild(oList);
	var oRows = oTable.rows;
	var iLen = oRows.length;
	var iSelectedCount = 0;

	for (var i = 0; i < iLen; i++) {
		if (oRows[i].selected == 1) {
			iSelectedCount++;
		}
	}

	return iSelectedCount > 1;
}
// MoveUp and MoveDown:  We are not supporting multi-select moves.
//

// MoveUp moves an item in the RH list up by one row
//
function MoveUp() {
	if (!IsFormTypeDisabled()) {
		var oTable = XUI.Html.DomUtils.GetFirstChild(_rtnObjList);
		var oRows = oTable.rows;
		var iLen = oRows.length;
		var iFirstIndex = ((true == _bFieldSelectPrimaryField) ? 2 : 1)

		for (var i = iFirstIndex; i < iLen; i++) {
			if (1 == oRows[i].selected) {
				var row = oRows[i];
				var parent = row.parentNode;
				parent.removeChild(row);
				parent.insertBefore(row, oRows[i - 1]);

				ScrollListUp(_rtnObjList, oTable.rows[i - 1]);

				break;
			}
		}
		UpdateUserSettingsValue();
	}
}

// MoveDown moves an item in the RH list down by one row
//
function MoveDown() {
	if (!IsFormTypeDisabled()) {
		var oTable = XUI.Html.DomUtils.GetFirstChild(_rtnObjList);
		var oRows = oTable.rows;
		var iLen = oRows.length;

		for (var i = (iLen - 2) ; 0 <= i; i--) {
			if (1 == oRows[i].selected) {
				var row = oRows[i + 1];
				var parent = row.parentNode;
				parent.removeChild(row);
				parent.insertBefore(row, oRows[i]);

				ScrollListDown(_rtnObjList, oTable.rows[i + 1]);

				break;
			}
		}
		UpdateUserSettingsValue();
	}
}

// To update the attribute value so that the autosave will be fired if the attributes are moved.
function UpdateUserSettingsValue() {
	var oTable = XUI.Html.DomUtils.GetFirstChild(_rtnObjList);
	var oRows = oTable.rows;
	var iLen = oRows.length;

	//build the selected attribute xml string to store.
	var xmlstring = "<select>\n";
	for (var i = 0; i < iLen; i++) {
		xmlstring += "<option value='" + CrmEncodeDecode.CrmXmlEncode(oRows[i].name) + "'></option>";
	}
	xmlstring += "</select>";

	window.parent.Xrm.Page.getAttribute("msdyusd_userschemasettings").setValue(xmlstring);
}

// Partition rearranges the subarray A[p..r] in place.
// Used by the Quicksort algorithm.
//
function Partition(A1, p, r, A2, A3) {
	var x = A1[p];
	var i = p;
	var j = r;

	while (true) {
		while (A1[j].localeCompare(x) > 0) {
			j--;
		}
		while (A1[i].localeCompare(x) < 0) {
			i++;
		}

		if (i < j) {
			//check for duplicates
			if (x.localeCompare(A1[j]) == 0) {
				j--;
			}
			else {
				// exchange the values in the i and j location
				var tmp = A1[i];
				A1[i] = A1[j];
				A1[j] = tmp;

				// now exchange the values in the second dimension of the array
				tmp = A2[i];
				A2[i] = A2[j];
				A2[j] = tmp;

			}
		}
		else {
			return j;
		}
	}
}


// Quicksort sorts a two-dimensional array in place in an average O(n lg n) time.
// This is client-side code, so we should be able to have space for a recursive call.
// Sort order is based on the first dimension of the array
// Based off of Quicksort described by Cormen/Leiserson/Rivest pp153-155
//
// A1 - first dimension of the array
// p  - pivot value.  (Initial call usually uses first element of array).
// r  - last index of A1
//
function Quicksort(A1, p, r, A2, A3) {
	var q;

	if (p < r) {
		q = Partition(A1, p, r, A2, A3);
		Quicksort(A1, p, q, A2, A3);
		Quicksort(A1, q + 1, r, A2, A3);
	}
}

function EnableDisableButtons(btnRightFlag, btnLeftFlag) {
	if (!IsNull($get("btnRight"))) {
		$get("btnRight").disabled = btnRightFlag;
	}
	if (!IsNull($get("btnLeft"))) {
		$get("btnLeft").disabled = btnLeftFlag;
	}
}

function EnableDisableUserSettings(disableFlag) {
	if (!IsNull($get("rtnObjList"))) {
		$get("rtnObjList").disabled = disableFlag;
	}
	if (!IsNull($get("objList"))) {
		$get("objList").disabled = disableFlag;
	}    
	if (!IsNull($get("btnUp"))) {
		$get("btnUp").disabled = disableFlag;
	}
	if (!IsNull($get("btnDown"))) {
		$get("btnDown").disabled = disableFlag;
	}
	if (!IsNull($get("btnRight"))) {
		$get("btnRight").disabled = disableFlag;
	}
	if (!IsNull($get("btnLeft"))) {
		$get("btnLeft").disabled = disableFlag;
	}
}

function IsFormTypeDisabled() {
	if (!IsNull(window.parent) && !IsNull(window.parent.Xrm.Page.ui.getFormType()) && window.parent.Xrm.Page.ui.getFormType() == Xrm.FormType.disabled) {
		return true;
	}
	else {
		return false;
	}
}