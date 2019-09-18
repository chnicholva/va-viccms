
function SelectValuesJsWindowOnLoad()
{
    /*
    //to retrieve the entity attributes metadata
	SDK.Metadata.RetrieveEntity("Attributes",
			 Xrm.Internal.getEntityName(Mscrm.InternalUtilities.EntityTypeCode.SystemUser),
			 null,
			 false,
			 function (entityMetadata)
			 {
				 successRetrieveEntity(Xrm.Internal.getEntityName(Mscrm.InternalUtilities.EntityTypeCode.SystemUser), entityMetadata);
			 },
			 errorRetrieveEntity);
    */
}

function successRetrieveEntity(entityLogicalName, entityMetadata)
{
    /*
	var oNodes = entityMetadata.Attributes;
	var iLen = oNodes.length;
	aSize = 2;

	//filter the selected nodes xml based on select/option nodes.
	var oSelectedNodes = [];
	if (!Mscrm.InternalUtilities.JSTypes.isNull(window.parent.Xrm.Page.getAttribute("msdyusd_userschemasettings").getValue()))
	{
		var oSelectedNodes = XUI.Xml.SelectNodes(XUI.Xml.LoadXml(window.parent.Xrm.Page.getAttribute("msdyusd_userschemasettings").getValue()), "/select/option", null);
	}

	var sValuesAry = new Array(aSize);
	sValuesAry[0] = new Array();
	sValuesAry[1] = new Array();

	var sSelectedAry = new Array(aSize);
	sSelectedAry[0] = new Array();
	sSelectedAry[1] = new Array();

	var count = 0;
	var selectedCount = 0;

    //to populate the available system user entity attributes.
	for (var i = 0; i < iLen; i++)
	{
	    //As the sdk method retrieves all the attributes of the systemuser entity,
	    //we are not populating the logical attributes of the entity.
	    if (Boolean.parse(oNodes[i].IsLogical) == false)
	    {
	        sValuesAry[1][count] = oNodes[i].DisplayName.LocalizedLabels[0].Label;
	        sValuesAry[0][count] = oNodes[i].LogicalName;
	        count++;
	    }
	}

	//to populate the selected attributes.
	for (var j = 0; j < oSelectedNodes.length; j++)
	{
		for (var i = 0; i < iLen; i++)
		{
			if (oSelectedNodes[j].getAttribute('value') == oNodes[i].LogicalName && Boolean.parse(oNodes[i].IsLogical) == false)
			{
				sSelectedAry[1][selectedCount] = oNodes[i].DisplayName.LocalizedLabels[0].Label;
				sSelectedAry[0][selectedCount] = oNodes[i].LogicalName;
				selectedCount++;
			}
		}
	}

	Quicksort(sValuesAry[1], 0, sValuesAry[0].length - 1, sValuesAry[0]);

    //to hide the loading icon
	setDisplayProperty("loadingContainer", "none");

    //to display the available and selected attribute tables 
	drawFieldSelect(sValuesAry, sSelectedAry);
    */
}

function errorRetrieveEntity(error)
{
    /*
    Xrm.Utility.alertDialog(error.message, null);
    */
}

//$addHandler(window, "load", SelectValuesJsWindowOnLoad);
