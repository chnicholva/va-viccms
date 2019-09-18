Type.registerNamespace("USD");

USD.IsUSDSettingsPage = function () {
	try {
		var cp = $find('crmContentPanel');
		if (cp != null) {
			var contentUrl = cp.get_contentUrl();
			return contentUrl.get_path().endsWith('USDMain.html');
		}
	}
	catch (e) { }

	return false;
}

USD.LoadFileUpLoadControl = function () {
	USD.LoadIFrame("IFRAME_CustomizationFiles", "WebResources/msdyusd_/CustomizationFiles.html");

	//If the form is not saved user should not be allowed to click attach or done button
	var parentId = null;
	if (Xrm.Internal.isTurboForm()) {
		parentId = window.parent.Xrm.Page.data.entity.getId();
	}
	else {
		parentId = Xrm.Page.data.entity.getId();
	}
	if (parentId != null && parentId != "") {
		var iframeObject = USD.GetIframeObject("IFRAME_CustomizationFiles");
		if (iframeObject != null) {
			var attachButton = iframeObject.getElementById("attachButton");
			var doneButton = iframeObject.getElementById("doneButton");
			if (attachButton != null && doneButton != null) {
				attachButton.disabled = false;
				doneButton.disabled = false;
			}
		}
	}
}

USD.LoadUserSettings = function () {
	USD.LoadIFrame("IFRAME_userschemasettings", "WebResources/msdyusd_/UserSchemaSettings.html");
}

USD.LoadIFrame = function (iframeid, url) {
	try {
		var prefix = CrmEncodeDecode.CrmUrlEncode(window.parent.WEB_RESOURCE_ORG_VERSION_NUMBER);
		url = Xrm.Page.context.getClientUrl() + "/" + prefix + "/" + url;
		var iframeCustomizationFile = Xrm.Page.ui.controls.get(iframeid);
		if (iframeCustomizationFile != null) {
			iframeCustomizationFile.setSrc(url);
		}
	}
	catch (e) {
	}
}

USD.GetIframeObject = function (iframeName) {
	var iframeObject = null;
	if (!Xrm.Internal.isTurboForm()) {
		if (window.frames[iframeName] != null) {
			iframeObject = window.frames[iframeName];
		}
	}
	else {
		if (window.parent.frames[iframeName] != null) {
			iframeObject = window.parent.frames[iframeName];
		}
	}
	if (iframeObject != null) {
		if (iframeObject.contentDocument) {
			iframeObject = iframeObject.contentDocument;
		}
		else if (iframeObject.document) {
			iframeObject = iframeObject.document;
		}
	}
	return iframeObject;
}

USD.SaveUserSettings = function () {
	try {
		var iframeObject = USD.GetIframeObject("IFRAME_userschemasettings");
		if (iframeObject != null) {
			var oRows = XUI.Html.DomUtils.GetFirstChild(iframeObject.getElementById('rtnObjList')).rows;
			var iLen = oRows.length;

			//build the selected attribute xml string to store.
			var xmlstring = "<select>\n";
			for (var i = 0; i < iLen; i++) {
				xmlstring += "<option value='" + CrmEncodeDecode.CrmXmlEncode(oRows[i].name) + "'></option>";
			}
			xmlstring += "</select>";

			Xrm.Page.getAttribute("msdyusd_userschemasettings").setValue(xmlstring);
		}
	}
	catch (e) {
	}
}

USD.DeactivateAuditAndDiagnostics = function (entityId, entityName) {
	Mscrm.CommandBarActions.deactivate(entityId, entityName);
	USD.EnableDisableSchemaSettings(true);
}

USD.ActivateAuditAndDiagnostics = function (entityId, entityName) {
	Mscrm.CommandBarActions.activate(entityId, entityName);
	USD.EnableDisableSchemaSettings(false);
}

USD.EnableDisableSchemaSettings = function (disable) {
	var iframeObject = USD.GetIframeObject("IFRAME_userschemasettings");
	if (!IsNull(iframeObject.getElementById('rtnObjList'))) {
		iframeObject.getElementById('rtnObjList').disabled = disable;
	}
	if (!IsNull(iframeObject.getElementById('objList'))) {
		iframeObject.getElementById('objList').disabled = disable;
	}
	if (!IsNull(iframeObject.getElementById('btnRight'))) {
		iframeObject.getElementById('btnRight').disabled = disable;
	}
	if (!IsNull(iframeObject.getElementById('btnLeft'))) {
		iframeObject.getElementById('btnLeft').disabled = disable;
	}
	if (!IsNull(iframeObject.getElementById('btnUp'))) {
		iframeObject.getElementById('btnUp').disabled = disable;
	}
	if (!IsNull(iframeObject.getElementById('btnDown'))) {
		iframeObject.getElementById('btnDown').disabled = disable;
	}
}

//To enable Add to configuration button on Ribbon
USD.IsAssociatedWithConfiguration = function (SelectedEntitiesList) {
	try {
		if (SelectedEntitiesList.length != 0) {
			var ReturnValue = USD.EntityAssociationInfo(SelectedEntitiesList[0].TypeName);
			if (ReturnValue != null)
				return true;
		}
	} catch (e) {

	}
	return false;
}

//To get the realtionship name based on Entity
USD.EntityAssociationInfo = function (SelectedEntity) {
	try {

		if (SelectedEntity != null) {

			switch (SelectedEntity) {
				case "msdyusd_agentscriptaction":
					return "msdyusd_configuration_actioncalls";
				case "msdyusd_task":
					return "msdyusd_configuration_agentscript"
				case "msdyusd_entitysearch":
					return "msdyusd_configuration_entitysearch";
				case "msdyusd_uiievent":
					return "msdyusd_configuration_event"
				case "msdyusd_form":
					return "msdyusd_configuration_form";
				case "uii_hostedapplication":
					return "msdyusd_configuration_hostedcontrol";
				case "uii_option":
					return "msdyusd_configuration_option";
				case "msdyusd_scriptlet":
					return "msdyusd_configuration_scriptlet";
				case "msdyusd_sessioninformation":
					return "msdyusd_configuration_sessionlines";
				case "msdyusd_toolbarstrip":
					return "msdyusd_configuration_toolbar";
				case "msdyusd_windowroute":
					return "msdyusd_configuration_windowroute";
				case "msdyusd_customizationfiles":
					return "msdyusd_customizationfiles_configuration";
				default:
					return null;
			}
		}

	} catch (e) {

	}
	return null;
}

//Associate the selected entities to Config entity
USD.CrmAddtoConfiguration = function (Selectedcntrlsref) {
	try {
		if (Selectedcntrlsref != null) {

			for (var length = Selectedcntrlsref.length, i = 0; i < length; i++) {
				Selectedcntrlsref[i]["LogicalName"] = Selectedcntrlsref[i].TypeName;
			}

			var Parameters = [Selectedcntrlsref];

			var LookupTypes = Xrm.Internal.getEntityCode('msdyusd_configuration');
			var Callbackfunction = Mscrm.Utilities.createCallbackFunctionObject("CallbackForAddtoConfig", USD, Parameters, false);
			var LookupStyle = Mscrm.FormInputControl.LookupUIBehavior.singleLookupStyle;

			LookupObjects(null, LookupStyle, LookupTypes, false, null, null, 1, 1, false, LookupTypes,
				"", "", null, null, null, "", "", null, "0", "0", "0", null, "",
				Callbackfunction, "", "");
		}
	}
	catch (e) { }
}

//callback function for LookUpObjects (Look up dialog method)
USD.CallbackForAddtoConfig = function (LookupItmes, SelectedEntities) {
	try {
		if (LookupItmes != null) {

			var LookupControlItems = LookupItmes.items;
			LookupControlItems[0]["Id"] = LookupControlItems[0].id;
			LookupControlItems[0]["Name"] = LookupControlItems[0].name;
			LookupControlItems[0]["LogicalName"] = LookupControlItems[0].typename;

			USD.DeserializeValues(LookupControlItems);
			var LookpEntity = LookupControlItems[0];

			var Relationship = USD.EntityAssociationInfo(SelectedEntities[0].LogicalName);
			USD.AssociateEntities(Relationship, SelectedEntities, LookpEntity);
		}
	}

	catch (e) { }
}

//To Deserialize selected Config entity values
USD.DeserializeValues = function (Items) {
	try {
		if (Items != null) {
			for (var Length = Items.length,
				i = 0; i < Length; i++) {
				var Item = Items[i],
					Values = Item.values;
				if (!IsNull(Values) && typeof Values === Mscrm.TypeNames.stringType)
					Item.values = Sys.Serialization.JavaScriptSerializer.deserialize(Values);
				var keyValues = Item.keyValues;
				if (!IsNull(keyValues) && typeof keyValues === Mscrm.TypeNames.stringType)
					Item.keyValues = Sys.Serialization.JavaScriptSerializer.deserialize(keyValues)
			}
		}
	}
	catch (e) { }
}

//Associate the selected entities to Config entity based
USD.AssociateEntities = function (Relationship, SelectedEntities, LookpEntity) {
	try {
		if (Relationship != null && SelectedEntities != null && LookpEntity != null) {

			Sdk.jQ.setJQueryVariable($);
			var associaterequest = new Sdk.Collection(Sdk.AssociateRequest);
			var entityCollection = new Sdk.Collection(Sdk.EntityReference);;
			var targetEntity = new Sdk.EntityReference(LookpEntity["LogicalName"], LookpEntity["Id"].slice(1, -1), LookpEntity["Name"]);

			for (var length = SelectedEntities.length, i = 0; i < length; i++) {

				entityCollection.add(new Sdk.EntityReference(SelectedEntities[i]["LogicalName"], SelectedEntities[i]["Id"].slice(1, -1), SelectedEntities[i]["Name"]));
				var entityRefCollection = new Sdk.EntityReferenceCollection(entityCollection);

				associaterequest.add(new Sdk.AssociateRequest(targetEntity, Relationship, entityRefCollection));
				entityCollection.clear();
			}

			var emSettings = new Sdk.ExecuteMultipleSettings(true, false);
			var req = new Sdk.ExecuteMultipleRequest(associaterequest, emSettings);

			Sdk.jQ.execute(req);
		}

	}
	catch (e) {

	}
}
