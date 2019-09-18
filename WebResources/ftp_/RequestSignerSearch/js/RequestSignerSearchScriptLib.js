/// <reference path='../../triipcrm_/TR_KU_V2015_2_902/js/jquery.min.js' />
/// <reference path='../../triipcrm_/TR_KU_V2015_2_902/js/kendo.all.min.js' />

//RequestSignerSearchScriptLib.js
//Contains variables and functions used by the RequestSignerSearch.html page

//Static Variables
var rss_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var rss_context = GetGlobalContext();
var rss_serverUrl = rss_context.getClientUrl();

//Get user data
var rss_crmUserId = rss_context.getUserId();
var rss_userSiteId = '';
var rss_userData = rss_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', rss_crmUserId);
if (rss_userData != null) {
    if (rss_userData.d.ftp_FacilitySiteId != null) { rss_userSiteId = rss_userData.d.ftp_FacilitySiteId.Id; }
}

function rss_formLoad() {
    try {
        //Proceed to grid data load....
        rss_createLookupControl();
        rss_createSelectedControl();

        //Set focus to cancel button if SIGNERS TAB SECTION is Visible
        if (parent.Xrm.Page.ui.tabs.get('Tab_RequestSignerSearch').getVisible() == true) {
            document.getElementById('btnCancel').focus();
        }
    }
    catch (err) {
        alert('Request Signer Search Web Resource Function Error(rss_formLoad): ' + err.message);
    }
}

function rss_selectAddGridRow(arg) {
    try {
        var rss_selectedRows = this.select();
        var rss_selectedDataItems = [];
        var rss_recordID = null;
        var rss_recordType = null;
        var rss_recordIconURL = null;
        var rss_recordName = null;
        for (var i = 0; i < rss_selectedRows.length; i++) {
            rss_gridDataItem = this.dataItem(rss_selectedRows[i]);
            rss_recordID = rss_gridDataItem.ID
            rss_recordType = rss_gridDataItem.Type;
            rss_recordIconURL = rss_gridDataItem.IconURL;
            rss_recordName = rss_gridDataItem.Name;
        }
        
        var rss_entitySearchGrid = $('#ku_lookupgrid').data('kendoGrid');
        var rss_entitySelectedGrid = $('#ku_selectedgrid').data('kendoGrid');

        if (rss_recordID != null) {
            //Add to selected grid
            //Determine if it already exist, if so cancel add...
            if (rss_entitySelectedGrid.dataSource.get(rss_recordID) == null) {
                rss_entitySelectedGrid.dataSource.pushCreate({
                    ID: rss_recordID,
                    Type: rss_recordType,
                    IconURL: rss_recordIconURL,
                    Name: rss_recordName
                });
            }
            //Remove row from lookup grid
            rss_entitySearchGrid.dataSource.remove(rss_gridDataItem);
        }
    }
    catch (err) {
        alert('Request Signer Search Script Failure: Function(rss_selectAddGridRow): ' + err.message);
    }
}

function rss_selectRemoveGridRow(arg) {
    try {
        //Disable select if disabled
        if (document.getElementById('btnSelect').disabled == true) { return false; }

        var rss_selectedRows = this.select();
        var rss_selectedDataItems = [];
        var rss_recordID = null;
        var rss_recordType = null;
        var rss_recordIconURL = null;
        var rss_recordName = null;
        for (var i = 0; i < rss_selectedRows.length; i++) {
            rss_gridDataItem = this.dataItem(rss_selectedRows[i]);
            rss_recordID = rss_gridDataItem.ID
            rss_recordType = rss_gridDataItem.Type;
            rss_recordIconURL = rss_gridDataItem.IconURL;
            rss_recordName = rss_gridDataItem.Name;
        }

        if (rss_recordType == 'IUSR') {
            alert("An FYI activity has already been created for " + rss_recordName + ", so this user cannot be removed!");
            return false;
        }

        var rss_entitySearchGrid = $('#ku_lookupgrid').data('kendoGrid');
        var rss_entitySelectedGrid = $('#ku_selectedgrid').data('kendoGrid');

        if (rss_recordID != null) {
            //Add to lookup grid
            //Determine if it already exist in lookup grid, if so remove from selected but don't add to lookup
            if (rss_entitySearchGrid.dataSource.get(rss_recordID) == null) {
                rss_entitySearchGrid.dataSource.pushCreate({
                    ID: rss_recordID,
                    Type: rss_recordType,
                    IconURL: rss_recordIconURL,
                    Name: rss_recordName
                });
            }
            //Remove row from selected grid
            rss_entitySelectedGrid.dataSource.remove(rss_gridDataItem);
        }
    }
    catch (err) {
        alert('Request Signer Search Script Failure: Function(rss_selectRemoveGridRow): ' + err.message);
    }
}

function rss_clickAddGridRow(e) {
    try {
        var rss_gridDataItem = this.dataItem($(e.currentTarget).closest('tr'));
        var rss_recordID = rss_gridDataItem.ID;
        var rss_recordType = rss_gridDataItem.Type;
        var rss_recordIconURL = rss_gridDataItem.IconURL;
        var rss_recordName = rss_gridDataItem.Name;

        var rss_entitySearchGrid = $('#ku_lookupgrid').data('kendoGrid');
        var rss_entitySelectedGrid = $('#ku_selectedgrid').data('kendoGrid');

        if (rss_recordID != null) {
            //Add to selected grid
            //Determine if it already exist, if so cancel add...
            if (rss_entitySelectedGrid.dataSource.get(rss_recordID) == null) {
                rss_entitySelectedGrid.dataSource.pushCreate({
                    ID: rss_recordID,
                    Type: rss_recordType,
                    IconURL: rss_recordIconURL,
                    Name: rss_recordName
                });
            }
            //Remove row from lookup grid
            rss_entitySearchGrid.dataSource.remove(rss_gridDataItem);
        }
    }
    catch (err) {
        alert('Request Signer Search Script Failure: Function(rss_clickAddGridRow): ' + err.message);
    }
}

function rss_clickRemoveGridRow(e) {
    try {
        //Disable select if disabled
        if (document.getElementById('btnSelect').disabled == true) { return false; }

        var rss_gridDataItem = this.dataItem($(e.currentTarget).closest('tr'));
        var rss_recordID = rss_gridDataItem.ID;
        var rss_recordType = rss_gridDataItem.Type;
        var rss_recordIconURL = rss_gridDataItem.IconURL;
        var rss_recordName = rss_gridDataItem.Name;

        if (rss_recordType == 'IUSR') {
            alert("An FYI activity has already been created for " + rss_recordName + ", so this user cannot be removed!");
            return false;
        }

        var rss_entitySearchGrid = $('#ku_lookupgrid').data('kendoGrid');
        var rss_entitySelectedGrid = $('#ku_selectedgrid').data('kendoGrid');

        if (rss_recordID != null) {
            //Add to lookup grid
            //Determine if it already exist in lookup grid, if so remove from selected but don't add to lookup
            if (rss_entitySearchGrid.dataSource.get(rss_recordID) == null) {
                rss_entitySearchGrid.dataSource.pushCreate({
                    ID: rss_recordID,
                    Type: rss_recordType,
                    IconURL: rss_recordIconURL,
                    Name: rss_recordName
                });
            }
            //Remove row from selected grid
            rss_entitySelectedGrid.dataSource.remove(rss_gridDataItem);
        }
    }
    catch (err) {
        alert('Request Signer Search Script Failure: Function(rss_clickRemoveGridRow): ' + err.message);
    }
}

function rss_createLookupControl() {
    try {
        var rss_addButtonText = " Add ";
        $('#ku_lookupgrid').kendoGrid({
            columns: [
                { field: 'ID', type: 'string', hidden: true },
                { field: 'Type', type: 'string', hidden: true },
                { field: 'IconURL', type: 'string', hidden: true },
                {
                    template: "<div class='entity-icon'" +
                          "style='background-image: url(#:data.IconURL#);' title='#: Type # - #: Name #'></div>" +
                          "<div title='#: Type # - #: Name #' class='entity-label'>#: Name #</div>",
                    field: 'Name', title: 'Name', type: 'string'
                },
                { command: { text: rss_addButtonText, click: rss_clickAddGridRow }, title: ' ', width: '110px' }
            ],
            dataSource: {
                schema: {
                    model: {
                        id: 'ID'
                    }
                }
            },  
            groupable: false,
            sortable: false,
            editable: false,
            height: 300,
            resizable: true,
            navigatable: true,
            selectable: "row",
            noRecords: true,
            change: rss_selectAddGridRow
        });
    }
    catch (err) {
        alert('Request Signer Search Script Failure: Function(rss_createLookupControl) Error Detail: ' + err.message);
        return null;
    }
}

function rss_createSelectedControl() {
    try {
        var rss_removeButtonText = " Remove ";
        $('#ku_selectedgrid').kendoGrid({
            columns: [
                { field: 'ID', type: 'string', hidden: true },
                { field: 'Type', type: 'string', hidden: true },
                { field: 'IconURL', type: 'string', hidden: true },
                {
                    template: "<div class='entity-icon'" +
                          "style='background-image: url(#:data.IconURL#);' title='#: Type # - #: Name #'></div>" +
                          "<div title='#: Type # - #: Name #' class='entity-label'>#: Name #</div>",
                    field: 'Name', title: 'Name', type: 'string'
                },
                { command: { text: rss_removeButtonText, click: rss_clickRemoveGridRow }, title: ' ', width: '110px' }
            ],
            dataSource: {
                schema: {
                    model: {
                        id: 'ID'
                    }
                }
            },
            groupable: false,
            sortable: false,
            editable: false,
            height: 300,
            resizable: true,
            navigatable: true,
            selectable: "row",
            noRecords: true,
            change: rss_selectRemoveGridRow
        });

        //Initalize the selected control with values from CRM if they exist
        var rss_selectedUsersAndTeams = parent.Xrm.Page.getAttribute('ftp_fyiselectedusersandteams').getValue();
        if (rss_selectedUsersAndTeams != null && rss_selectedUsersAndTeams != '') {
            rss_populateSelectedGrid(rss_selectedUsersAndTeams);
        }
        else {
            if (parent.Xrm.Page.getAttribute('statuscode').getValue() == 5 || parent.Xrm.Page.ui.getFormType() == 3) {
                //Disable controls when not active request
                document.getElementById('myfacilityusers').disabled = true;
                document.getElementById('searchtext').disabled = true;
                document.getElementById('searchbuttonid').disabled = true;
                document.getElementById('btnSelect').disabled = true;
                //Change title of the cancel button
                document.getElementById('btnCancel').value = 'Close Search';
                document.getElementById('btnCancel').title = 'Click here to close the search form.';
            }
        }
    }
    catch (err) {
        alert('Request Signer Search Script Failure: Function(rss_createSelectedControl) Error Detail: ' + err.message);
        return null;
    }
}

function rss_populateSelectedGrid(rss_selectedUsersAndTeams) {
    try {
        var rss_selectedArray = rss_selectedUsersAndTeams.split('~~');
        var rss_selectedArrayRecordCount = rss_selectedArray.length;
        var rss_entitySelectedGrid = $('#ku_selectedgrid').data('kendoGrid');

        if (parent.Xrm.Page.getAttribute('statuscode').getValue() == 5 || parent.Xrm.Page.ui.getFormType() == 3) {
            //Disable controls when not active request
            document.getElementById('myfacilityusers').disabled = true;
            document.getElementById('searchtext').disabled = true;
            document.getElementById('searchbuttonid').disabled = true;
            document.getElementById('btnSelect').disabled = true;
            //Change title of the cancel button
            document.getElementById('btnCancel').value = 'Close Search';
            document.getElementById('btnCancel').title = 'Click here to close the search form.';
            //Hide the grid's remove button column
            rss_entitySelectedGrid.hideColumn(4);
        }

        //If the previously selected items items are of type FYI, redo to new method
        if (rss_selectedArray[0] == 'FYI') {
            rss_selectedUsersAndTeams = rss_selectedUsersAndTeams.replace('FYI', 'NEW');
            rss_selectedUsersAndTeams = rss_selectedUsersAndTeams.replace(/USER/g, 'IUSR');
            rss_selectedArray = rss_selectedUsersAndTeams.split('~~');
        }

        //Add previously selected users
        for (var i = 1; i < rss_selectedArrayRecordCount; i++) {
            var rss_recordID = (rss_selectedArray[i]).substring(4);
            var rss_recordType = (rss_selectedArray[i]).substring(0, 4);
            var rss_recordName = '';
            if (rss_recordType == 'USER' || rss_recordType == 'IUSR') {
                //Get User Name
                var rss_userData = rss_getSingleEntityDataSync('SystemUserSet', 'FullName', rss_recordID);
                if (rss_userData != null) {
                    if (rss_userData.d.FullName != null) { rss_recordName = rss_userData.d.FullName; }
                }
            }

            var rss_recordIconURL='';
            if (rss_recordType == 'USER' || rss_recordType == 'IUSR') { rss_recordIconURL = 'img/ico_user.gif'; }
            //Insert in selected grid
            rss_entitySelectedGrid.dataSource.pushCreate({
                ID: rss_recordID,
                Type: rss_recordType,
                IconURL: rss_recordIconURL,
                Name: rss_recordName
            });
        }
    }
    catch (err) {
        alert('Request Signer Search Script Failure: Function(rss_populateSelectedGrid) Error Detail: ' + err.message);
        return null;
    }
}

function rss_searchLookupEntity() {
	debugger;
    try {
        //Populate SystemUser Lookup Grid
        var rss_entitySearchGrid = $('#ku_lookupgrid').data('kendoGrid');
        rss_getCrmSystemUserData(0, rss_entitySearchGrid);
    }
    catch (err) {
        //Display Error
        alert('Request Signer Search Script Failure Function(rss_searchLookupEntity) Error Detail: ' + err);
    }
}

function rss_getCrmSystemUserData(rss_skipCount, rss_systemuserSelectorControl) {
	debugger;
    try {
        //Stop Processing if more than 500 Users have beeen retrieved
        if (rss_skipCount >= 500) { return false; }
        //Clear grid content if rss_skipCount is zero
        if (rss_skipCount == 0) { rss_systemuserSelectorControl.dataSource.data([]); }

        //Add standard conditions
        var rss_conditionalFilter = "(IsDisabled eq false and FullName ne 'SYSTEM' and FullName ne 'INTEGRATION' and FullName ne 'Support User')";

        //Add filtering by facility
        var rss_facilityFilter = '';
        var rss_myFacilityUsers = document.getElementById('myfacilityusers').checked;
        if (rss_userSiteId != null && rss_userSiteId != '') {
            if (rss_myFacilityUsers == true && rss_userSiteId.length > 25) {
                rss_facilityFilter = " and (ftp_FacilitySiteId/Id eq guid'" + rss_userSiteId + "') ";
            }
        }
        rss_conditionalFilter = rss_conditionalFilter + rss_facilityFilter;

        //Determine Search String 
        var rss_searchString = (document.getElementById('searchtext').value).replace("'", "''");  //NOTE, replace has to do with using search strings with '  for example O'Neill

        if (rss_searchString.length > 0) {
            if (rss_searchString.substring(0, 1) == '*') {
                rss_searchString = "substringof('" + rss_searchString.substring(1);
                rss_conditionalFilter = rss_conditionalFilter + " and " + "(" + rss_searchString + "', InternalEMailAddress) eq true" +
                    " or " + rss_searchString + "', FirstName) eq true" +
                    " or " + rss_searchString + "', LastName) eq true" +
                    " or " + rss_searchString + "', FullName) eq true" +
                    ")";
            }
            else {
                rss_conditionalFilter = rss_conditionalFilter + " and " + "(startswith(InternalEMailAddress, '" + rss_searchString + "') eq true" +
                    " or startswith(FirstName, '" + rss_searchString + "') eq true" +
                    " or startswith(LastName, '" + rss_searchString + "') eq true" +
                    " or startswith(FullName, '" + rss_searchString + "') eq true" +
                    ")";
            }
        }
        rss_getMultipleEntityDataAsync('SystemUserSet', 'SystemUserId, FullName', rss_conditionalFilter, 'LastName', 'asc', rss_skipCount, rss_getCrmSystemUserData_response, rss_systemuserSelectorControl);
    }
    catch (err) {
        alert('Request Signer Search Script Failure Function(rss_getCrmSystemUserData) Error Detail: ' + err.message);
        return null;
    }
}

function rss_getCrmSystemUserData_response(rss_systemuserData, rss_lastSkip, rss_systemuserSelectorControl) {
	debugger;
    try {
        //rss_lastSkip is the starting point in the result (use if more than 50 records)
        for (var i = 0; i <= rss_systemuserData.d.results.length - 1; i++) {
            var rss_systemuserid = null;
            var rss_fullname = null;

            //Get info
            if (rss_systemuserData.d.results[i].SystemUserId != null) { rss_systemuserid = rss_systemuserData.d.results[i].SystemUserId; }
            if (rss_systemuserData.d.results[i].FullName != null) { rss_fullname = rss_systemuserData.d.results[i].FullName; }

            //Add to the grid
            rss_systemuserSelectorControl.dataSource.pushCreate({
                ID: rss_systemuserid,
                Type: 'USER',
                IconURL: 'img/ico_user.gif',
                Name: rss_fullname
            });
        }
        if (rss_systemuserData.d.__next != null) {
            rss_getCrmSystemUserData(rss_lastSkip + 50, rss_systemuserSelectorControl);
        }

        }
        catch (err) {
            alert('Request Signer Search Script Failure Function(rss_getCrmSystemUserData) Error Detail: ' + err.message);
            return null;
        }
    }

function rss_searchKeyPress(event) {
	debugger;
    try {
        //Determine if 'enter' key was pressed if so initiate search
        var rss_keypressed = event.which || event.keyCode;
        if (rss_keypressed == 13) { rss_searchLookupEntity(); }
    }
    catch (err) {
        //Display Error
        alert('Request Signer Signer Search Script Failure Function(rss_searchKeyPress) Error Detail: ' + err);
    }
}

function rss_applyRequestSigners() {
    try {
        //Write the selected user and team string...
        var rss_selectedUsersAndTeams = '';
        var rss_entitySelectedGrid = $('#ku_selectedgrid').data('kendoGrid');
        var rss_newUserRecords = 0;
        //Determine if records have been selected
        var rss_totalSelectedRecords = rss_entitySelectedGrid.dataSource.total();
        if (rss_totalSelectedRecords > 0) {
            //Add each record to the selected record string to be stored in CRM
            rss_selectedUsersAndTeams = 'NEW';
            var rss_gridData = rss_entitySelectedGrid.dataSource.data();
            var rss_totalNumGridRows = rss_gridData.length;

            for (var i = 0; i < rss_totalNumGridRows; i++) {
                var rss_currentGridDataRow = rss_gridData[i];
                rss_selectedUsersAndTeams = rss_selectedUsersAndTeams + '~~' + rss_currentGridDataRow.Type + rss_currentGridDataRow.ID;
                if (rss_currentGridDataRow.Type == "USER") { rss_newUserRecords = rss_newUserRecords + 1;}
            }
        }

        //Write to CRM field
        parent.Xrm.Page.getAttribute('ftp_fyiselectedusersandteams').setValue(rss_selectedUsersAndTeams);
        //Enforce save of values in read only field
        parent.Xrm.Page.getAttribute('ftp_fyiselectedusersandteams').setSubmitMode('always');

        //Set focus to the main top tab and hide current tab
        parent.Xrm.Page.ui.tabs.get('Tab_Summary').setFocus();
        parent.Xrm.Page.ui.tabs.get('Tab_RequestSignerSearch').setVisible(false);

        if (rss_totalSelectedRecords > 0) { 
            //Prompt the user to create FYI records
            var rss_confirmFyiCreate = confirm('Would you like to create the FYI Activity Record(s) now?\nThis action cannot be cancelled!');
            if (rss_confirmFyiCreate == false) {
                return false;
            }
            //Check for new users added that FYI records has not already been created for
            if (rss_newUserRecords == 0) {
                alert("There are no new users selected, FYI Activity Record(s) will not be created!");
                return false;
            }
            //Process the selected records by creating the FYI activity records
            rss_createFyiRecords();
        }
    }
    catch (err) {
        alert('Request Signer Search Script Failure: Function(rss_applyRequestSigners) Error Detail: ' + err.message);
        return null;
    }
}

function rss_cancelRequestSigners() {
    try {
        //Set focus to the main top tab and hide current tab
        parent.Xrm.Page.ui.tabs.get('Tab_Summary').setFocus();
        parent.Xrm.Page.ui.tabs.get('Tab_RequestSignerSearch').setVisible(false);
    }
    catch (err) {
        alert('Request Signer Search Script Failure: Function(rss_cancelRequestSigners) Error Detail: ' + err.message);
        return null;
    }
}

function rss_createFyiRecords() {
    try {
        //Write the selected user FYI Activity records
        var rss_entitySelectedGrid = $('#ku_selectedgrid').data('kendoGrid');
        //Determine if records have been selected
        var rss_totalSelectedRecords = rss_entitySelectedGrid.dataSource.total();
        if (rss_totalSelectedRecords > 0) {
            var rss_gridData = rss_entitySelectedGrid.dataSource.data();
            var rss_totalNumGridRows = rss_gridData.length;
            var rss_processedUsersAndTeams = 'FYI';

            for (var i = 0; i < rss_totalNumGridRows; i++) {
                var rss_currentGridDataRow = rss_gridData[i];
                parent.Xrm.Page.ui.setFormNotification('Creating FYI activity ' + (i+1) + ' of ' + rss_totalNumGridRows, 'INFO', 'FYI_CREATE');

                var rss_fyiActivity = new Object();
                rss_fyiActivity.Subject = 'FYI - ' + parent.Xrm.Page.getAttribute('title').getValue();
                if (rss_currentGridDataRow.Type == 'USER' || rss_currentGridDataRow.Type == 'IUSR') {
                    rss_fyiActivity.OwnerId = { Id: rss_currentGridDataRow.ID, LogicalName: 'systemuser', Name: '' };
                }
                else {
                    rss_fyiActivity.OwnerId = { Id: rss_currentGridDataRow.ID, LogicalName: 'team', Name: '' };
                }
                rss_fyiActivity.RegardingObjectId = { Id: parent.Xrm.Page.data.entity.getId(), LogicalName: 'incident', Name: '' };
                rss_fyiActivity.tri_Notes = parent.Xrm.Page.getAttribute('description').getValue();

                rss_fyiActivity.ftp_request_id = { Id: parent.Xrm.Page.data.entity.getId(), LogicalName: 'incident', Name: '' };

                var rss_RegardingEntityOwnerId = parent.Xrm.Page.getAttribute('ownerid').getValue()[0].id;
                var rss_RegardingEntityOwnerTypeName = parent.Xrm.Page.getAttribute('ownerid').getValue()[0].entityType;
                rss_fyiActivity.tri_fyi_activity_parties = [{
                    PartyId: { Id: rss_RegardingEntityOwnerId, LogicalName: rss_RegardingEntityOwnerTypeName },
                    ParticipationTypeMask: { Value: 1 }
                }];

                if (rss_currentGridDataRow.Type != 'IUSR') {
                    //Only process new records
                    var rss_jsonEntityData = JSON.stringify(rss_fyiActivity);
                    var rss_entitySetName = 'tri_fyiSet'
                    var rss_jsonQuery = rss_serverUrl + rss_crmOdataEndPoint + '/' + rss_entitySetName;
                    var rss_fyiActivityId = rss_executeCrmOdataPostRequest(rss_jsonQuery, false, rss_jsonEntityData, 'CREATE', 'ActivityId');

                    if (rss_fyiActivityId != null && rss_fyiActivityId != 'FAIL') {
                        //Create associated Activity Party Record
                        //5/15/18 kknab, moved activity party creation into same operation as FYI record creation
                        /*
                        var rss_RegardingEntityId = parent.Xrm.Page.getAttribute('ownerid').getValue()[0].id;
                        var rss_RegardingEntityTypeName = parent.Xrm.Page.getAttribute('ownerid').getValue()[0].entityType;

                        
                        var rss_activityParty = new Object();
                        rss_activityParty.PartyId = {
                            Id: rss_RegardingEntityId,
                            LogicalName: rss_RegardingEntityTypeName
                        };
                        rss_activityParty.ActivityId = {
                            Id: rss_fyiActivityId,
                            LogicalName: 'tri_fyi'
                        };

                        //Set ParticipationTypeMask value per CRM SDK
                        //1-Sender, 2-Recipient, 3-CC Recipient, 4-BCC Recipient, 5-Required attendee, 6-Optional attendee, 7-Organizer, 8-Regarding,
                        //9-Owner, 10-Resource, 11-Customer
                        var rss_participantType = 1;
                        rss_activityParty.ParticipationTypeMask = { Value: rss_participantType };

                        var rss_jsonEntityData = JSON.stringify(rss_activityParty);
                        var rss_entitySetName = 'ActivityPartySet'
                        var rss_jsonQuery = rss_serverUrl + rss_crmOdataEndPoint + '/' + rss_entitySetName;
                        if (rss_RegardingEntityTypeName == 'systemuser') {
                            var rss_ActivityPartyId = rss_executeCrmOdataPostRequest(rss_jsonQuery, false, rss_jsonEntityData, 'CREATE', 'ActivityPartyId');
                        }
                        */

                        //Add to processed records string
                        rss_processedUsersAndTeams = rss_processedUsersAndTeams + '~~' + rss_currentGridDataRow.Type + rss_currentGridDataRow.ID;
                    }
                }
                else {
                    //Rewrite old records
                    rss_processedUsersAndTeams = rss_processedUsersAndTeams + '~~' + rss_currentGridDataRow.Type + rss_currentGridDataRow.ID;
                }
            }

            //Write to CRM field
            parent.Xrm.Page.getAttribute('ftp_fyiselectedusersandteams').setValue(rss_processedUsersAndTeams);
            //Enforce save of values in read only field
            parent.Xrm.Page.getAttribute('ftp_fyiselectedusersandteams').setSubmitMode('always');
            //Save the current CRM data
            parent.Xrm.Page.data.entity.save();
        }
        setTimeout(function () {
            parent.Xrm.Page.ui.clearFormNotification('FYI_CREATE');
        }, 3000);
    }
    catch (err) {
        alert('Request Signer Search Script Failure: Function(rss_createFyiRecords) Error Detail: ' + err.message);
        parent.Xrm.Page.ui.clearFormNotification('FYI_CREATE');
        return null;
    }
}

function rss_executeCrmOdataGetRequest(rss_jsonQuery, rss_aSync, rss_aSyncCallback, rss_skipCount, rss_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*rss_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*rss_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*rss_aSyncCallback* - specify the name of the return function to call upon completion (required if rss_aSync = true.  Otherwise '')
    //*rss_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*rss_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var rss_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: rss_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                rss_entityData = data;
                if (rss_aSync == true) {
                    rss_aSyncCallback(rss_entityData, rss_skipCount, rss_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in rss_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + rss_jsonQuery);
            },
            async: rss_aSync,
            cache: false
        });
        return rss_entityData;
    }
    catch (err) {
        alert('An error occured in the rss_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function rss_executeCrmOdataPostRequest(rss_jsonQuery, rss_aSync, rss_jsonEntityData, rss_recordAction, rss_crmGuidFieldName) {
    //This function executes a CRM Odata web service call to create/update a Crm Record
    //*rss_jsonQuery* - the complete query (url) to be executed
    //*rss_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*rss_jsonEntityData* - the crm entity data record to be created/updated
    //*rss_recordAction* - the action to be performed in CAPS 'CREATE', 'UPDATE, 'DELETE'
    //*rss_crmGuidFieldName* - the name of the unique identifier field that has the Guid/Id for the crm record created

    try {
        var rss_crmEntityId = 'FAIL';

        $.ajax({
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: rss_jsonQuery,
            data: rss_jsonEntityData,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
                if (rss_recordAction == 'UPDATE') { XMLHttpRequest.setRequestHeader('X-HTTP-Method', 'MERGE'); }
                if (rss_recordAction == 'DELETE') { XMLHttpRequest.setRequestHeader('X-HTTP-Method', 'DELETE'); }
            },
            success: function (data, textStatus, XmlHttpRequest) {
                if (rss_recordAction == 'CREATE') { rss_crmEntityId = data.d[rss_crmGuidFieldName].toString(); }
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                alert('Ajax Error in rss_executeCrmOdataPostRequest: ' + errorThrown);
                rss_crmEntityId = 'FAIL';
            },
            async: rss_aSync
        });
        if (rss_recordAction == 'CREATE') { return rss_crmEntityId; }
    }
    catch (err) {
        alert('An error occured in the rss_executeCrmOdataPostRequest function.  Error Detail Message: ' + err);
    }
}

function rss_getMultipleEntityDataAsync(rss_entitySetName, rss_attributeSet, rss_conditionalFilter, rss_sortAttribute, rss_sortDirection, rss_skipCount, rss_aSyncCallback, rss_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*rss_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*rss_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*rss_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*rss_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*rss_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*rss_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*rss_aSyncCallback* - is the name of the function to call when returning the result
    //*rss_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var rss_jsonQuery = rss_serverUrl + rss_crmOdataEndPoint + '/' + rss_entitySetName + '?$select=' + rss_attributeSet + '&$filter=' + rss_conditionalFilter + '&$orderby=' + rss_sortAttribute + ' ' + rss_sortDirection + '&$skip=' + rss_skipCount;
        rss_executeCrmOdataGetRequest(rss_jsonQuery, true, rss_aSyncCallback, rss_skipCount, rss_optionArray);
    }
    catch (err) {
        alert('An error occured in the rss_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}

function rss_getSingleEntityDataSync(rss_entitySetName, rss_attributeSet, rss_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*rss_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*rss_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*rss_entityId* - is the Guid for the entity record

    try {
        var rss_entityIdNoBracket = rss_entityId.replace(/({|})/g, '');
        var rss_selectString = '(guid' + "'" + rss_entityIdNoBracket + "'" + ')?$select=' + rss_attributeSet;
        var rss_jsonQuery = rss_serverUrl + rss_crmOdataEndPoint + '/' + rss_entitySetName + rss_selectString;
        var rss_entityData = rss_executeCrmOdataGetRequest(rss_jsonQuery, false, '', 0, null);
        return rss_entityData;
    }
    catch (err) {
        alert('An error occured in the rss_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}