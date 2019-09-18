/// <reference path='../../triipcrm_/TR_KU_V2015_2_902/js/jquery.min.js' />

//SecondaryDiagnosisGridScriptLib.js
//Contains variables and functions used by the SecondaryDiagnosisGrid.html page

//Static Variables
var sdg_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var sdg_soapEndPoint = '/XRMServices/2011/Organization.svc/web';
var sdg_context = GetGlobalContext();
var sdg_serverUrl = sdg_context.getClientUrl();
var sdg_userId = sdg_context.getUserId();
var sdg_diagSectionArray = ["All Sections"];
var sdg_diagAreaArray = [{ value: "00", text: "All Areas" }];

function sdg_formLoad() {
    try {
        //Create Kendo Diagnosis Grid
        sdg_initFormLoad();

        //Determine the status of the parent record, if open, build grid
        if (parent.Xrm.Page.ui.getFormType() > 2) {
            //The form is disabled, disable the grid control and exit
            document.getElementById('ku_diagnosisgrid').disabled = true;
            return false;
        }
    }
    catch (err) {
        alert('Secondary Diagnosis Grid Web Resource Function Error(sdg_formLoad): ' + err.message);
    }
}

function sdg_ResizeGrid() {
    try {
        //Resize Grid
        var sdg_diagnosisGrid = $("#ku_diagnosisgrid").data("kendoGrid");
        if (typeof sdg_diagnosisGrid != 'undefined' && sdg_diagnosisGrid != null) {
            sdg_diagnosisGrid.resize();
        }
    }
    catch (err) {
        alert('Secondary Diagnosis Grid Web Resource Function Error(sdg_ResizeGrid): ' + err.message);
        return null;
    }
}

function sdg_executeCrmOdataGetRequest(sdg_jsonQuery, sdg_aSync, sdg_aSyncCallback, sdg_skipCount, sdg_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*sdg_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*sdg_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*sdg_aSyncCallback* - specify the name of the return function to call upon completion (required if sdg_aSync = true.  Otherwise '')
    //*sdg_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*sdg_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var sdg_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: sdg_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                sdg_entityData = data;
                if (sdg_aSync == true) {
                    sdg_aSyncCallback(sdg_entityData, sdg_skipCount, sdg_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in sdg_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + sdg_jsonQuery);
            },
            async: sdg_aSync,
            cache: false
        });
        return sdg_entityData;
    }
    catch (err) {
        alert('An error occured in the sdg_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function sdg_getMultipleEntityDataAsync(sdg_entitySetName, sdg_attributeSet, sdg_conditionalFilter, sdg_sortAttribute, sdg_sortDirection, sdg_skipCount, sdg_aSyncCallback, sdg_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*sdg_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*sdg_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*sdg_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*sdg_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*sdg_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*sdg_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*sdg_aSyncCallback* - is the name of the function to call when returning the result
    //*sdg_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var sdg_jsonQuery = sdg_serverUrl + sdg_crmOdataEndPoint + '/' + sdg_entitySetName + '?$select=' + sdg_attributeSet + '&$filter=' + sdg_conditionalFilter + '&$orderby=' + sdg_sortAttribute + ' ' + sdg_sortDirection + '&$skip=' + sdg_skipCount;
        sdg_executeCrmOdataGetRequest(sdg_jsonQuery, true, sdg_aSyncCallback, sdg_skipCount, sdg_optionArray);
    }
    catch (err) {
        alert('An error occured in the sdg_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}

function sdg_getSingleEntityDataSync(sdg_entitySetName, sdg_attributeSet, sdg_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*sdg_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*sdg_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*sdg_entityId* - is the Guid for the entity record

    try {
        var sdg_entityIdNoBracket = sdg_entityId.replace(/({|})/g, '');
        var sdg_selectString = '(guid' + "'" + sdg_entityIdNoBracket + "'" + ')?$select=' + sdg_attributeSet;
        var sdg_jsonQuery = sdg_serverUrl + sdg_crmOdataEndPoint + '/' + sdg_entitySetName + sdg_selectString;
        var sdg_entityData = sdg_executeCrmOdataGetRequest(sdg_jsonQuery, false, '', 0, null);
        return sdg_entityData;
    }
    catch (err) {
        alert('An error occured in the sdg_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}

function sdg_initFormLoad() {
    try {
        //Define FetchXML to get record count for the diagnosis code entity for use in grid display
        var sdg_crmDiagnosisCodeCountFetch = '<fetch aggregate="true" mapping="logical">' +
        '<entity name="ftp_diagnosiscode">' +
        '<attribute name="ftp_diagnosiscodeid" alias="crmentitycount" aggregate="countcolumn" />' +
        '<filter>' +
        '<condition attribute="statecode" operator="eq" value="0" />' +
        '</filter></entity></fetch>';

        //Get the diagnosis code record count and create the grid when complete
        var sdg_crmdiagnosiscodefetchrequest = sdg_createCrmFetchRequest(sdg_crmDiagnosisCodeCountFetch);
        sdg_executeCrmSoapPostAction(sdg_crmdiagnosiscodefetchrequest, sdg_serverUrl, sdg_soapEndPoint, sdg_createDiagnosisGrid);

        //Define FetchXML to get unique values for the diagnosis code section attribute for use in filter dropdown
        var sdg_crmSectionFetch = '<fetch mapping="logical" distinct="true">' +
        '<entity name="ftp_diagnosiscode">' +
        '<attribute name="ftp_section" />' +
        '<filter>' +
        '<condition attribute="statecode" operator="eq" value="0" />' +
        '</filter></entity></fetch>';

        var sdg_crmsectionfetchrequest = sdg_createCrmFetchRequest(sdg_crmSectionFetch);
        sdg_executeCrmSoapPostAction(sdg_crmsectionfetchrequest, sdg_serverUrl, sdg_soapEndPoint, sdg_configureSection);

        //Define FetchXML to get unique values for the diagnosis code area attribute for use in filter dropdown
        var sdg_crmAreaFetch = '<fetch mapping="logical" distinct="true">' +
        '<entity name="ftp_diagnosiscode">' +
        '<attribute name="ftp_area" />' +
        '<filter>' +
        '<condition attribute="statecode" operator="eq" value="0" />' +
        '</filter></entity></fetch>';

        var sdg_crmareafetchrequest = sdg_createCrmFetchRequest(sdg_crmAreaFetch);
        sdg_executeCrmSoapPostAction(sdg_crmareafetchrequest, sdg_serverUrl, sdg_soapEndPoint, sdg_configureArea);
    }
    catch (err) {
        alert('Secondary Diagnosis Grid Web Resource Function Error(sdg_initFormLoad): ' + err.message);
    }
}

function sdg_createDiagnosisGrid(sdg_xmlString) {
    //Create the grid using the record count xml from the soap call
    try {
        //Set default recordcount value
        var sdg_crmRecordCount = "0";
        //Check for FetchXml failure, if fail exit process.
        if (sdg_xmlString != "FAIL9999") {
            //Get the record count from the XML string (convert text xml to parsable jquery xml)
            var $sdg_xmldata = $($.parseXML(sdg_xmlString));
            var sdg_entityNode = "";
            var sdg_countNode = "0";
            sdg_crmlogicalentity = $sdg_xmldata.find("a\\:EntityLogicalName, EntityLogicalName").text();
            if (sdg_crmlogicalentity == "ftp_diagnosiscode") {
                sdg_entityNode = $sdg_xmldata.find("a\\:EntityLogicalName, EntityLogicalName").text(),
                sdg_countNode = $sdg_xmldata.find("a\\:Value, Value").text();
                sdg_crmRecordCount = sdg_countNode;
            }
            else {
                //Non matching entity type, exit process
                return false;
            }
        }
        else {
            //Reached Max Records
            sdg_crmRecordCount = 50000;
        }

        //Define CRM DataSet Properties to create a CRM REST based datasource for the grid
        var sdg_crmEntitySetName = "ftp_diagnosiscodeSet";
        var sdg_crmEntityAttributeSelection = "ftp_diagnosiscodeId, ftp_name, ftp_description, ftp_section, ftp_area";
        var sdg_crmEntityPrimaryKey = "ftp_diagnosiscodeId";
        var sdg_crmEntitySortAttribute = "ftp_section,ftp_name";
        var sdg_crmEntitySortDirection = "asc";
        var sdg_crmEntityFilter = "statecode/Value eq 0";  //To return Active Records only

        //Check if display checked only is ON
        var sdg_checkedOnly = document.getElementById("chkCheckedOnly");
        if (sdg_checkedOnly.checked == true) {
            //Get the checked items from CRM.
            var sdg_selectedDiagnosisGuids = parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosisids").getValue();
            sdg_crmEntityFilter = sdg_crmEntityFilter + " and (ftp_diagnosiscodeId eq (guid'00000000-0000-0000-0000-000000000000')";
            if (sdg_selectedDiagnosisGuids != null && sdg_selectedDiagnosisGuids != '') {
                var sdg_selectedArray = sdg_selectedDiagnosisGuids.split('~~');
                var sdg_selectedArrayRecordCount = sdg_selectedArray.length;
                for (var i = 0; i < sdg_selectedArrayRecordCount; i++) {
                    var sdg_selectedGuid = sdg_selectedArray[i];
                    if (sdg_selectedGuid != null && sdg_selectedGuid != "") {
                        //Add to search criteria
                        sdg_crmEntityFilter = sdg_crmEntityFilter + " or ftp_diagnosiscodeId eq (guid'" + sdg_selectedGuid.toUpperCase() + "')";
                    }
                }
            }
            //Close guid 'or' condition
            sdg_crmEntityFilter = sdg_crmEntityFilter + ")";
        }
        else {
            //Get the selected Section options
            var sdg_sectionOptions = document.getElementById("selSection");
            var sdg_sectionText = "All Sections";
            if (sdg_sectionOptions) {
                if (sdg_sectionOptions.options[sdg_sectionOptions.selectedIndex]) {
                    sdg_sectionText = sdg_sectionOptions.options[sdg_sectionOptions.selectedIndex].text;
                }
            }
            if (sdg_sectionText != null && sdg_sectionText != "" && sdg_sectionText != "All Sections") {
                sdg_crmEntityFilter = sdg_crmEntityFilter + " and ftp_section eq '" + sdg_sectionText + "'";
            }

            //Get the selected Area options
            var sdg_areaOptions = document.getElementById("selArea");
            var sdg_areaText = "All Areas";
            var sdg_areaId = "";
            if (sdg_areaOptions) {
                if (sdg_areaOptions.options[sdg_areaOptions.selectedIndex]) {
                    sdg_areaText = sdg_areaOptions.options[sdg_areaOptions.selectedIndex].text;
                    sdg_areaId = sdg_areaOptions.options[sdg_areaOptions.selectedIndex].value;
                }
            }

            if (sdg_areaText != null && sdg_areaText != "" && sdg_areaText != "All Areas") {
                sdg_crmEntityFilter = sdg_crmEntityFilter + " and ftp_area/Id eq (guid'" + sdg_areaId + "')";
            }

            //Get the search text entered
            var sdg_searchString = (document.getElementById('searchtext').value).replace("'", "''");  //NOTE, replace has to do with using search strings with '  for example O'Neill
            if (sdg_searchString.length > 0) {
                sdg_crmEntityFilter = sdg_crmEntityFilter + " and " + "(substringof('" + sdg_searchString + "', ftp_description) eq true)";
            }
        }

        var sdg_crmEntityAttributeDef = [];
        sdg_crmEntityAttributeDef.push({ field: "ftp_diagnosiscodeId", type: "string" });
        sdg_crmEntityAttributeDef.push({ field: "ftp_name", type: "string" });
        sdg_crmEntityAttributeDef.push({ field: "ftp_description", type: "string" });
        sdg_crmEntityAttributeDef.push({ field: "ftp_section", type: "string" });
        sdg_crmEntityAttributeDef.push({ field: "ftp_area.Name", type: "string" });

        var sdg_crmEntityColumns = [];
        sdg_crmEntityColumns.push({ field: "ftp_diagnosiscodeId", title: "ID", width: "200px" });
        sdg_crmEntityColumns.push({ field: "ftp_name", title: "Code", width: "200px" });
        sdg_crmEntityColumns.push({ field: "ftp_description", title: "Description", width: "100px" });
        sdg_crmEntityColumns.push({ field: "ftp_section", title: "Section", width: "200px" });
        sdg_crmEntityColumns.push({ field: "ftp_area.Name", title: "Area", width: "200px" });

        var sdg_dataPageSize = 50;  //Cannot exceed 50 per CRM REST web service limit, unless reconfigured

        var sdg_crmDiagnosisCodeDataSource = sdg_crmEntityReadDataSource(sdg_serverUrl, sdg_crmOdataEndPoint, sdg_crmEntitySetName, sdg_crmEntityAttributeSelection, sdg_crmEntityPrimaryKey, sdg_crmEntitySortAttribute, sdg_crmEntitySortDirection, sdg_crmEntityAttributeDef, sdg_crmEntityColumns, sdg_dataPageSize, sdg_crmRecordCount, sdg_crmEntityFilter);

        //Define Diagnosis Entity Grid Widget
        var sdg_grid = $("#ku_diagnosisgrid").kendoGrid({
            dataSource: sdg_crmDiagnosisCodeDataSource,
            sortable: false,
            height: 220,
            columns: [
                { field: 'ftp_diagnosiscodeId', title: 'ID', type: 'string', hidden: true },
                { field: "Selected", title: " ", type: "boolean", template: "<input type='checkbox' class='checkbox' />", groupable: false, sortable: false, filterable: false, width: 40 },
                { field: 'ftp_name', title: 'Code', type: 'string', hidden: false, width: 80 },
                { field: 'ftp_description', title: 'Description', type: 'string', hidden: false, width: 320 },
                { field: 'ftp_section', title: 'Section', type: 'String', hidden: false, width: 200 },
                { field: 'ftp_area.Name', title: 'Area', type: 'String', hidden: false, width: 200 }
            ],
            editable: false,
            filterable: false,
            pageable: true,
            groupable: false,
            navigatable: true,
            selectable: false,
            dataBound: function () {
                sdg_grid.table.find("tr").find("td:first input")
                    .change(function (e) {
                        if (!$(this).prop('checked')) {
                            sdg_grid.clearSelection();
                        }
                    });

                //Mark Previously selected rows as checked
                sdg_SetCheckedRecords();
            }
        }).data("kendoGrid");

        var sdg_diagnosisGrid = $('#ku_diagnosisgrid').data('kendoGrid');
        //Bind click event to the checkbox
        sdg_diagnosisGrid.table.on("click", ".checkbox", sdg_selectCheckboxRow);

        //Get User Configuration
        var sdg_userData = sdg_getSingleEntityDataSync('SystemUserSet', 'msdyusd_USDConfigurationId', sdg_userId);
        if (sdg_userData != null) {
            if (sdg_userData.d.msdyusd_USDConfigurationId != null) {
                if (sdg_userData.d.msdyusd_USDConfigurationId.Name != null) {
                    //Check for TAN Configuration
                    if (sdg_userData.d.msdyusd_USDConfigurationId.Name == 'TAN Configuration') {
                        //Hide Secondary Diagnosis Grid
                        document.getElementById("tblSecondaryDiagnosis").style.display = "none";
                        //Hide Secondary Diagnosis Control
                        parent.Xrm.Page.getControl("ftp_selectedsecondarydiagnosiscodes").setVisible(false);
                    }
                }
            }
        }
    }
    catch (err) {
        alert('Secondary Diagnosis Grid Web Resource Function Error(sdg_createDiagnosisGrid): ' + err.message);
        return null;
    }
}

function sdg_configureSection(sdg_xmlString) {
    //Create the Section Array to select from
    try {
        //Check for FetchXml failure, if fail exit process.
        if (sdg_xmlString == "FAIL9999") { return false; }
        //Get the record count from the XML string (convert text xml to parsable jquery xml)
        var $sdg_xmldata = $($.parseXML(sdg_xmlString));

        var $sdg_crmentities = null;
        $sdg_crmentities = $sdg_xmldata.find("a\\:Entities, Entities");

        //Get each entity record
        $sdg_crmentities.find("a\\:Entity, Entity").each(function () {
            $(this).find("a\\:KeyValuePairOfstringanyType").each(function () {
                var sdg_xmlElement = $(this);
                var sdg_sectionkey = sdg_xmlElement.find("b\\:key").text();
                var sdg_sectionvalue = sdg_xmlElement.find("b\\:value").text();
                //Add to Section array
                if (sdg_sectionvalue != null && sdg_sectionvalue != '') {
                    var sdg_sectionExist = sdg_diagSectionArray.indexOf(sdg_sectionvalue);
                    if (sdg_sectionExist == -1) {
                        //Add item to array, since it does not exist
                        sdg_diagSectionArray.push(sdg_sectionvalue);
                    }
                }
            });
        });
        //Define Section Filter Options from Array
        for (i = 0; i < sdg_diagSectionArray.length; i++) {
            //Add to optionset
            var sdg_newOption = document.createElement("option");
            sdg_newOption.text = sdg_diagSectionArray[i];
            document.getElementById("selSection").add(sdg_newOption);
        }
    }
    catch (err) {
        alert('Secondary Diagnosis Grid Web Resource Function Error(sdg_configureSection): ' + err.message);
        return null;
    }
}

function sdg_configureArea(sdg_xmlString) {
    //Create the Area Array to select from
    try {
        //Check for FetchXml failure, if fail exit process.
        if (sdg_xmlString == "FAIL9999") { return false; }
        //Get the record count from the XML string (convert text xml to parsable jquery xml)
        var $sdg_xmldata = $($.parseXML(sdg_xmlString));
        $sdg_crmentities = $sdg_xmldata.find("a\\:Entities, Entities");

        //Get each entity record
        $sdg_crmentities.find("a\\:Entity, Entity").each(function () {
            $(this).find("a\\:KeyValuePairOfstringanyType").each(function () {
                var sdg_xmlElement = $(this);
                var sdg_areakey = sdg_xmlElement.find("b\\:key").text();
                var sdg_areavalue = sdg_xmlElement.find("b\\:value");
                var sdg_areaname = sdg_areavalue.find("a\\:Name").text();
                var sdg_areaid = sdg_areavalue.find("a\\:Id").text();

                //Add to Area array
                if (sdg_areaname != null && sdg_areaname != '' && sdg_areaid != null && sdg_areaid != '') {
                    sdg_diagAreaArray.push({ value: sdg_areaid, text: sdg_areaname });
                }
            });
        });
        //Define Area Filter Options from Array
        for (i = 0; i < sdg_diagAreaArray.length; i++) {
            //Add to optionset
            var sdg_newOption = document.createElement("option");
            sdg_newOption.value = sdg_diagAreaArray[i].value;
            sdg_newOption.text = sdg_diagAreaArray[i].text;
            document.getElementById("selArea").add(sdg_newOption);
        }
    }
    catch (err) {
        alert('Secondary Diagnosis Grid Web Resource Function Error(sdg_configureArea): ' + err.message);
        return null;
    }
}

function sdg_ApplyGridFilters() {
    try {
        //Clear out the existing grid
        var sdg_grid = $("#ku_diagnosisgrid").data("kendoGrid");
        if (typeof sdg_grid != 'undefined' && sdg_grid != null) {
            sdg_grid.destroy();
        }

        //Get the selected Section options
        var sdg_sectionOptions = document.getElementById("selSection");
        var sdg_sectionText = sdg_sectionOptions.options[sdg_sectionOptions.selectedIndex].text;

        //Get the selected Area options
        var sdg_areaOptions = document.getElementById("selArea");
        var sdg_areaText = sdg_areaOptions.options[sdg_areaOptions.selectedIndex].text;
        var sdg_areaId = sdg_areaOptions.options[sdg_areaOptions.selectedIndex].value;

        //Get the search text entered
        var sdg_searchString = (document.getElementById('searchtext').value).replace("'", "''");  //NOTE, replace has to do with using search strings with '  for example O'Neill
        //Set primary condition
        var sdg_xmlFilter = '<condition attribute="statecode" operator="eq" value="0" />';

        //Check if display checked only is ON
        var sdg_checkedOnly = document.getElementById("chkCheckedOnly");
        if (sdg_checkedOnly.checked == true) {
            //Get the checked items from CRM.
            var sdg_selectedDiagnosisGuids = parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosisids").getValue();
            sdg_xmlFilter = sdg_xmlFilter + '<condition attribute="ftp_diagnosiscodeid" operator="in">';
            sdg_xmlFilter = sdg_xmlFilter + '<value uiname="" uitype="ftp_diagnosiscode">{00000000-0000-0000-0000-000000000000}</value>';
            if (sdg_selectedDiagnosisGuids != null && sdg_selectedDiagnosisGuids != '') {
                var sdg_selectedArray = sdg_selectedDiagnosisGuids.split('~~');
                var sdg_selectedArrayRecordCount = sdg_selectedArray.length;
                for (var i = 0; i < sdg_selectedArrayRecordCount; i++) {
                    var sdg_selectedGuid = sdg_selectedArray[i];
                    if (sdg_selectedGuid != null && sdg_selectedGuid != "") {
                        //Add to search criteria
                        sdg_xmlFilter = sdg_xmlFilter + '<value uiname="" uitype="ftp_diagnosiscode">{' + sdg_selectedGuid.toUpperCase() + '}</value>';
                    }
                }
            }
            sdg_xmlFilter = sdg_xmlFilter + '</condition>';
        }
        else {
            //Construct Filter to Apply
            if (sdg_sectionText != null && sdg_sectionText != "" && sdg_sectionText != "All Sections") {
                sdg_xmlFilter = sdg_xmlFilter + '<condition attribute="ftp_section" operator="eq" value="' + sdg_sectionText + '" />';
            }
            if (sdg_areaText != null && sdg_areaText != "" && sdg_areaText != "All Areas") {
                sdg_xmlFilter = sdg_xmlFilter + '<condition attribute="ftp_area" operator="eq" uiname="' + sdg_areaText + '" uitype="team" value="{' + sdg_areaId.toUpperCase() + '}" />';
            }
            if (sdg_searchString.length > 0) {
                sdg_xmlFilter = sdg_xmlFilter + '<condition attribute="ftp_description" operator="like" value="%' + sdg_searchString + '%" />';
            }
        }

        //Construct XML Fetch
        var sdg_crmDiagnosisCodeCountFetch = '<fetch aggregate="true" mapping="logical">' +
        '<entity name="ftp_diagnosiscode">' +
        '<attribute name="ftp_diagnosiscodeid" alias="crmentitycount" aggregate="countcolumn" />' +
        '<filter type="and">' +
        sdg_xmlFilter +
        '</filter></entity></fetch>';

        //Get the diagnosis code record count and create the grid when complete
        var sdg_crmdiagnosiscodefetchrequest = sdg_createCrmFetchRequest(sdg_crmDiagnosisCodeCountFetch);
        sdg_executeCrmSoapPostAction(sdg_crmdiagnosiscodefetchrequest, sdg_serverUrl, sdg_soapEndPoint, sdg_createDiagnosisGrid);

    }
    catch (err) {
        alert('Secondary Diagnosis Grid Web Resource Function Error(sdg_ApplyGridFilters): ' + err.message);
        return null;
    }
}

function sdg_selectCheckboxRow() {
    try {
        var sdg_checked = this.checked;
        var sdg_row = $(this).closest("tr");
        var sdg_diagnosisGrid = $('#ku_diagnosisgrid').data('kendoGrid');
        var sdg_dataItem = sdg_diagnosisGrid.dataItem(sdg_row);

        if (sdg_checked) {
            //-select the row
            sdg_row.addClass("k-state-selected");
            //Get current selected string
            var sdg_diagCodeString = parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosiscodes").getValue();
            var sdg_diagCodeSelectString = sdg_dataItem.ftp_name + "^" + sdg_dataItem.ftp_description;

            //Check if the checked item already exist in the current code string, if not add it
            if (sdg_diagCodeString != null && sdg_diagCodeString != "") {
                var n = sdg_diagCodeString.indexOf(sdg_diagCodeSelectString);
                if (n == -1) { //Not Found
                    parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosiscodes").setValue(sdg_diagCodeString + ";" + sdg_diagCodeSelectString);
                    parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosiscodes").setSubmitMode('always');
                }
            }
            else {
                //Just add it
                parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosiscodes").setValue(sdg_diagCodeSelectString);
                parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosiscodes").setSubmitMode('always');
            }
            var sdg_diagGuidString = parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosisids").getValue();
            var sdg_diagGuidSelectString = sdg_dataItem.id;

            //Check if the checked item already exist in the current guid string, if not add it
            if (sdg_diagGuidString != null && sdg_diagGuidString != "") {
                var n = sdg_diagGuidString.indexOf(sdg_diagGuidSelectString);
                if (n == -1) { //Not Found
                    parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosisids").setValue(sdg_diagGuidString + "~~" + sdg_diagGuidSelectString);
                    parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosisids").setSubmitMode('always');
                }
            }
            else {
                //Just add it
                parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosisids").setValue(sdg_diagGuidSelectString);
                parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosisids").setSubmitMode('always');
            }
        } else {
            //-remove selection
            sdg_row.removeClass("k-state-selected");
            //Get current selected code string
            var sdg_diagCodeString = parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosiscodes").getValue();
            if (sdg_diagCodeString != null && sdg_diagCodeString != "") {
                var sdg_diagCodeSelectString = sdg_dataItem.ftp_name + "^" + sdg_dataItem.ftp_description;
                //Determine if it exists in current string
                var n = sdg_diagCodeString.indexOf(";" + sdg_diagCodeSelectString);
                if (n != -1) {
                    //Remove the string with ; first
                    sdg_diagCodeString = sdg_diagCodeString.replace(";" + sdg_diagCodeSelectString, "");
                }
                var n = sdg_diagCodeString.indexOf(sdg_diagCodeSelectString + ";");
                if (n != -1) {
                    //Remove the string with ; last
                    sdg_diagCodeString = sdg_diagCodeString.replace(sdg_diagCodeSelectString + ";", "");
                }
                var n = sdg_diagCodeString.indexOf(sdg_diagCodeSelectString);
                if (n != -1) {
                    //Remove the string if there is no ;
                    sdg_diagCodeString = sdg_diagCodeString.replace(sdg_diagCodeSelectString, "");
                }
                parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosiscodes").setValue(sdg_diagCodeString);
                parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosiscodes").setSubmitMode('always');
            }

            //Get current selected guid string
            var sdg_diagGuidString = parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosisids").getValue();
            if (sdg_diagGuidString != null && sdg_diagGuidString != "") {
                var sdg_diagGuidSelectString = sdg_dataItem.id;
                //Determine if it exists in current string
                var n = sdg_diagGuidString.indexOf("~~" + sdg_diagGuidSelectString);
                if (n != -1) {
                    //Remove the string with ~~ first
                    sdg_diagGuidString = sdg_diagGuidString.replace("~~" + sdg_diagCodeSelectString, "");
                }
                var n = sdg_diagGuidString.indexOf(sdg_diagGuidSelectString + "~~");
                if (n != -1) {
                    //Remove the string with ~~ last
                    sdg_diagGuidString = sdg_diagGuidString.replace(sdg_diagGuidSelectString + "~~", "");
                }
                var n = sdg_diagGuidString.indexOf(sdg_diagGuidSelectString);
                if (n != -1) {
                    //Remove the string if there is no ~~
                    sdg_diagGuidString = sdg_diagGuidString.replace(sdg_diagGuidSelectString, "");
                }
                parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosisids").setValue(sdg_diagGuidString);
                parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosisids").setSubmitMode('always');
            }
        }

        //Resize Grid
        sdg_ResizeGrid();
    }
    catch (err) {
        alert('Secondary Diagnosis Grid Web Resource Function Error(sdg_selectCheckboxRow): ' + err.message);
        return null;
    }
}

function sdg_SetCheckedRecords() {
    try {
        //Get previously checked items from CRM.
        var sdg_selectedDiagnosisGuids = parent.Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosisids").getValue();
        var sdg_diagnosisGrid = $("#ku_diagnosisgrid").data("kendoGrid");
        if (sdg_selectedDiagnosisGuids != null && sdg_selectedDiagnosisGuids != '') {
            var sdg_selectedArray = sdg_selectedDiagnosisGuids.split('~~');
            var sdg_selectedArrayRecordCount = sdg_selectedArray.length;
            for (var i = 0; i < sdg_selectedArrayRecordCount; i++) {
                var sdg_selectedGuid = sdg_selectedArray[i];
                var sdg_rowModel = sdg_diagnosisGrid.dataSource.get(sdg_selectedGuid); // get method of the Kendo UI DataSource object
                if (sdg_rowModel != null && sdg_rowModel != undefined) {
                    var sdg_modelUID = sdg_rowModel.get("uid"); // get method of the Kendo UI Model object
                    var sdg_tableRow = $("[data-uid='" + sdg_modelUID + "']"); // the data-uid attribute is applied to the desired table row element.
                    //Set previously checked rows as selected and checked 
                    sdg_tableRow.addClass("k-state-selected")
                        .find(".checkbox")
                        .attr("checked", "checked");
                }
            }
        }
    }
    catch (err) {
        alert('Secondary Diagnosis Grid Web Resource Function Error(sdg_SetCheckedRecords): ' + err.message);
        return null;
    }
}

function sdg_createCrmFetchRequest(sdg_crmFetchXML) {
    //This function is used to construct a CRM FetchXML request
    //CrmFetchXML is a properly constructed FetchXML string
    try {
        var sdg_crmfetchrequest = '<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">';
        sdg_crmfetchrequest += '<s:Body>';
        sdg_crmfetchrequest += '<Execute xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services">' +
        '<request i:type="b:RetrieveMultipleRequest" ' +
        ' xmlns:b="http://schemas.microsoft.com/xrm/2011/Contracts" ' +
        ' xmlns:i="http://www.w3.org/2001/XMLSchema-instance">' +
        '<b:Parameters xmlns:c="http://schemas.datacontract.org/2004/07/System.Collections.Generic">' +
        '<b:KeyValuePairOfstringanyType>' +
        '<c:key>Query</c:key>' +
        '<c:value i:type="b:FetchExpression">' +
        '<b:Query>';
        sdg_crmfetchrequest += CrmEncodeDecode.CrmXmlEncode(sdg_crmFetchXML);  //This requires "ClientGlobalContext.js.aspx"
        sdg_crmfetchrequest += '</b:Query>' +
        '</c:value>' +
        '</b:KeyValuePairOfstringanyType>' +
        '</b:Parameters>' +
        '<b:RequestId i:nil="true"/>' +
        '<b:RequestName>RetrieveMultiple</b:RequestName>' +
        '</request>' +
        '</Execute>';
        sdg_crmfetchrequest += '</s:Body></s:Envelope>';
        return sdg_crmfetchrequest;
    }
    catch (err) {
        alert('An error occured in the sdg_createCrmFetchRequest) Error Detail: ' + err.message);
    }
}

function sdg_executeCrmSoapPostAction(CrmFetchRequest, serverUrl, SOAP_ENDPOINT, async_callback) {
    //This function is used to execute a CrmFetchRequest and return the result in the format specified
    //CrmFetchRequest is a properly constructed CRM SOAP Fetch Request
    //serverUrl is the CRM web server URL
    //SOAP_ENDPOINT is the SOAP web service partial URL
    //async_callback is the function to call back when the async process is complete
    try {
        $.ajax({
            type: "POST",
            dataType: "xml",
            contentType: "text/xml; charset=utf-8",
            processData: false,
            url: serverUrl + SOAP_ENDPOINT,
            data: CrmFetchRequest,
            cache: false,
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "SOAPAction",
                    "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute"
                );
            }
        }).done(function (data) {
            //Convert jQuery XML result as text XML to pass to callback function
            xmlString = (new XMLSerializer()).serializeToString(data);
            //Return the value to the callback function
            async_callback(xmlString);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //Display Failure message
            //alert("CRM SOAP Request failed: " + textStatus + "\n" + errorThrown);
            async_callback("FAIL9999"); //'FAIL9999' text used to indicate failure back to callback function
        });
    }
    catch (err) {
        alert("Script Failure: Function(sdg_executeCrmSoapPostAction) Error Detail: " + err.message);
    }
}

function sdg_crmEntityReadDataSource(serverUrl, ODATA_ENDPOINT, CrmEntitySetName, CrmEntityAttributeSelection, CrmEntityPrimaryKey, CrmEntitySortAttribute, CrmEntitySortDirection, CrmEntityAttributeDef, CrmEntityColumns, DataPageSize, CrmRecordCount, CrmEntityFilter) {
    //This function constructs a CRM Entity REST web service data source with read capability (no edit)
    //serverUrl is the CRM web server URL
    //ODATA_ENDPOINT is the REST web service partial URL
    //CrmEntitySetName is the name of the entity set e.g 'ContactSet'
    //CrmEntityAttributeSelection is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //CrmEntityPrimaryKey is a string containing the name of the primary key attribute e.g. 'ContactId'
    //CrmEntitySortAttribute is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //CrmEntitySortDirection is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //CrmEntityAttributeDef is an array containing a list of the attributes and their respective data types for use by Kendo UI grid rendering
    //CrmEntityColumns is an array containing a list of the attribute column order, column header and column size for use by Kendo UI grid rendering
    //DataPageSize is the number of records displayed on a grid page, per CRM REST limits this is a maximum value of 50
    //CrmRecordCount is the maximum number of records that will be returned by the REST query and is used for paging logic. This value is obtain by a FetchXml query
    //CrmEntityFilter is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    try {
        CrmDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: serverUrl + ODATA_ENDPOINT + "/" + CrmEntitySetName,
                    dataType: 'json',
                    cache: false
                },
                parameterMap: function (options) {
                    var parameter = {
                        $top: options.take,
                        $skip: options.skip,
                        $select: CrmEntityAttributeSelection,
                        $orderby: options.sort[0].field + ' ' + options.sort[0].dir,
                        $filter: CrmEntityFilter
                    };
                    return parameter;
                }
            },
            schema: {
                model: {
                    id: CrmEntityPrimaryKey,
                    fields: function () { return CrmEntityAttributeDef; }
                },
                total: function (data) {
                    //Set the total record count
                    return CrmRecordCount;
                },
                parse: function (data) {
                    return data.d.results;
                },
                type: "json"
            },
            serverPaging: true,
            pageSize: DataPageSize,
            serverSorting: true,
            sort: { field: CrmEntitySortAttribute, dir: CrmEntitySortDirection }
        });
        return CrmDataSource;
    }
    catch (err) {
        alert("Script Failure: Function(sdg_crmEntityReadDataSource) Error Detail: " + err.message);
    }
}

function sdg_searchKeyPress(event) {
    try {
        //Determine if 'enter' key was pressed if so initiate search
        var sdg_keypressed = event.which || event.keyCode;
        if (sdg_keypressed == 13) { sdg_ApplyGridFilters(); }
    }
    catch (err) {
        //Display Error
        alert('Secondary Diagnosis Grid Web Resource Function Error(sdg_searchKeyPress) Error Detail: ' + err);
    }
}
