/// <reference path="../../JScript/SDK.REST.js" />
var configData = null;
var noteGrid;
var columns = [
    {
        field: "Selected",
        title: " ",
        type: "boolean",
        template: "<img class='checkmark' src='/_imgs/grid/checkbox_light.png' onclick='checkmark_click(this);' title='Select this comment for inclusion in a progress note'/>",
        headerTemplate: "<img src='/_imgs/grid/actions_delete_16.png' onclick='headerCheckmark_click();' title='Clear comment selection(s)' id='headerCheckmark' />",
        groupable: false,
        sortable: false,
        filterable: false,
        width: 60
    },
    {
        title: " ",
        type: "button",
        template: function (pDataItem) {
            var isEditable = false;
            isEditable = !!pDataItem && !!pDataItem.CreatedOn && pDataItem.CreatedOn > parent._loadedOn && !!pDataItem.CreatedBy && guidsMatch(pDataItem.CreatedBy.Id, parent.Xrm.Page.context.getUserId());
            return isEditable ? "<button id='edit_" + pDataItem.AnnotationId + "' class='CrmButton' onclick='btnEditRow_click(this);' title='Edit this CRM comment'>EDIT</button>" : "";
        },
        headerTemplate: "<button id='btnCreate' class='CrmButton' title='Add a new CRM comment to this record.' onclick='btnCreate_click();'>NEW COMMENT</button>",
        groupable: false,
        sortable: false,
        filterable: false,
        width: 120
    },
    { field: "AnnotationId", CRM: "AnnotationId", hidden: true },
    { field: "ObjectTypeCode", CRM: "ObjectTypeCode", hidden: true },
    { field: "ObjectId", CRM: "ObjectId", hidden: true },
    { field: "CreatedBy", CRM: "CreatedBy", hidden: true },
    { field: "OwnerId", CRM: "OwnerId", hidden: true },
    { field: "CreatedOn", CRM: "CreatedOn", hidden: true },
    {
        field: "ModifiedOn",
        title: "Modified On",
        CRM: "ModifiedOn",
        editable: false,
        template: function (pDataItem) { return !!pDataItem.ModifiedOn ? pDataItem.ModifiedOn.toLocaleDateString() + ", " + pDataItem.ModifiedOn.toLocaleTimeString() : ""; },
        width: 100
    },
    {
        field: "ModifiedBy",
        title: "Modified By",
        CRM: "ModifiedBy",
        editable: false,
        template: function (pDataItem) { return !!pDataItem.ModifiedBy ? pDataItem.ModifiedBy.Name : ""; },
        width: 100
    },
    
    { field: "Subject", title: "Comment Title", CRM: "Subject", editable: true, width: 180 },
    { field: "NoteText", title: "Comment Text", CRM: "NoteText", editable: true, width: 340 }
];

$(document).ready(function () {
    if (!!!parent._loadedOn) { parent._loadedOn = new Date(); }
    doPageLoad();
});

function doPageLoad() {
    showLoadingMessage("Loading CRM comments...");
    try {
        configData = parseDataParametersFromUrl(location.search);
        //configData = { typename: "", type: "", id: "", data: { enableSelectionForProgressNotes: "" } };
        retrieveNotesForRecord();
    }
    catch (err) {
        //Display Error....
        console.error(err.message);
        alert("Document ready error: " + err.message);
        showErrorMessage(err.message);
    }
}

function retrieveNotesForRecord() {
    try{
        if (!!configData.type) {
            if (!!!configData.id) {
                //try to find record ID from parent CRM form
                configData.id = parent.Xrm.Page.data.entity.getId();
            }
            if (!!configData.id) {
                var queryColumns = [];
                columns.forEach(function (c, i) { if (!!c.CRM) { queryColumns.push(c.CRM); } });
                var queryString = "$select=" + queryColumns.join() + "&$filter=(ObjectId/Id eq guid'" + configData.id + "' and ObjectTypeCode eq '" + configData.typename + "')&$orderby=ModifiedOn desc";
                var retrievedNotes = [];
                SDK.REST.retrieveMultipleRecords(
                    "Annotation",
                    queryString,
                    function (retrievedRecords) {
                        if (typeof retrievedRecords != "undefined" && !!retrievedRecords && retrievedRecords.length > 0) retrievedNotes = retrievedNotes.concat(retrievedRecords);
                    },
                    errorHandler,
                    function () {
                        renderNotes(retrievedNotes);
                    }
                );
            }
            else {
                showDiv("#newRecordMessageContainer");
            }
        }
        else {
            throw new Error("Configuration error: you must pass record object-type code and unique identifier as parameters to this web resource.");
        }
    }
    catch (err) {
        throw err;
    }
}

function renderNotes(pData) {
    try {
        if (!!pData && Array.isArray(pData)) {
            destroyNotesGrid();
            var noteGridDiv = $("<div id='notesGridDiv'></div>").appendTo("#notesGridDivParentDiv");

            /*
                Toggle the ability to select notes for inclusion in a progress note, based on url parameter passed to this web resource
            */
            if (getDeepProperty("data.enableSelectionForProgressNotes", configData) != "true") {
                //remove the "Selected" column
                var selectedColumnIndex = ArrayIndexOfObjectByAttribute(columns, "field", "Selected");
                if (!!selectedColumnIndex && selectedColumnIndex > -1) {
                    columns.splice(selectedColumnIndex, 1);
                }
                $("#btnApplySelectedNotes").hide();
            }

            noteGrid = $("#notesGridDiv").kendoGrid({
                columns: columns,
                sortable: { initialDirection: "desc" },
                resizable: true,
                navigatable: true,
                noRecords: {
                    template: "No comments found."
                },
                scrollable: true,
                height: 300,
                pageable: {
                    pageSize: 5//,
                    //pageSizes: [5, 10, 20, 40, "all"]
                },
                filterable: false,//{ mode: "row"},
                dataSource: pData,
                editable: false,
                dataBound: function (e) {
                    console.log("begin grid.dataBound event handler.");
                    try {
                        var view = this.dataSource.view();
                        for (var i = 0; i < view.length; i++) {
                            if (view[i].Selected == true) {
                                var thisRow = this.tbody.find("tr[data-uid='" + view[i].uid + "']");
                                thisRow.addClass("k-state-selected");
                                $(thisRow).find("img").attr("src", "/_imgs/grid/checkbox.png");
                            }
                        }

                        //attach to single-click event of rows to mimic clicking the row's 'Checkmark' selector
                        this.element.on('click', 'tbody tr[data-uid]', function (ce) {
                            //ce.currentTarget should be the <tr> element that is the parent of the clicked <td> or <img> element
                            //console.log(ce.target);
                            //console.log(ce.currentTarget);

                            var clickedElement = ce.target;
                            var checkmarkForRow = $(ce.currentTarget).find(".checkmark")[0];

                            if (!!clickedElement && !!checkmarkForRow) {
                                if (clickedElement.outerHTML.indexOf("<button") == 0 && clickedElement.innerHTML == "EDIT") {
                                    //don't select row when user clicks the EDIT button
                                    return;
                                }
                                if (clickedElement == checkmarkForRow) {
                                    //user clicked checkmark
                                    //the checkmark_click function will have already fired, so end this function.
                                    return;
                                }
                                checkmark_click(checkmarkForRow);
                            }

                            //checkmark for row
                            //$(ce.currentTarget).find(".checkmark");

                            //data item for row
                            //$('#notesGridDiv').data('kendoGrid').dataItem($(ce.currentTarget))
                            //console.log($('#notesGridDiv').data('kendoGrid').dataItem($(ce.currentTarget)));
                        });

                        //attach to double-click event of rows to mimic clicking the row's 'Edit' button
                        this.element.on('dblclick', 'tbody tr[data-uid]', function (e) {
                            btnEditRow_click(e.target);
                        });
                    }
                    catch (e) {
                        console.error(e.message);
                        alert("grid dataBound error: " + e.message);
                    }
                },
                cancel: function (cancelEvent) {
                    console.log("begin grid.cancel event handler.");
                },
                navigate: function (navigateEvent) {
                    console.log("begin grid.navigate event handler.");
                }
            });

            var gridButtonsDiv = $(
                "<div id='GridButtonsDiv'>" +
                    "<input id='btnRefreshGrid' type='button' class='CrmButton' value='Refresh Comments' title='Click to refresh the comments linked to this record.' onclick='btnRefreshGrid_click();' />" +
                    "<input id='btnApplySelectedNotes' type='button' class='CrmButton' value='Apply Selected Comments' title='Click to add the selected comment(s) to the Progress Note.' onclick='btnApplySelectedNotes_click();' disabled='disabled' />" +
                "</div>").appendTo(".k-pager-wrap");
            showDiv("#NotesGridContainer");
        }
    }
    catch (err) {
        alert("Error rendering comments on grid: " + err.message);
        showErrorMessage("Error rendering comments on grid: " + err.message);
    }
}
function btnRefreshGrid_click() {
    doPageLoad();
}
function btnCreate_click() {
    try {
        generatePopupEditor({ Subject: "", NoteText: "" });
    }
    catch (err) {
        console.error(err.message);
        alert("Error opening new comment dialog: " + err.message);
    }
}
function btnEditRow_click(pClickedElement) {
    try {
        var thisRow = $(pClickedElement).closest("tr");
        if (!!thisRow) {
            var noteDataItem = $('#notesGridDiv').data('kendoGrid').dataItem(thisRow);
            generatePopupEditor(noteDataItem, noteDataItem.Subject);
        }
        else {
            throw new Error("Could not find row.");
        }
    }
    catch (err) {
        console.error(err.message);
        alert("Error opening comment edit dialog: " + err.message);
    }
}

function generatePopupEditor(pRecord, pPopupTitle) {
    if (!!pRecord) {
        if (!!parent._loadedOn) {
            try{
                //note is editable when its brand new, or if it was created by the current user and created(modified) since this form opened
                var recordIsEditable = false;
                recordIsEditable = (!!!pRecord.CreatedOn && !!!pRecord.CreatedBy) || (!!pRecord.CreatedBy && guidsMatch(pRecord.CreatedBy.Id, parent.Xrm.Page.context.getUserId()) && !!pRecord.CreatedOn && pRecord.CreatedOn > parent._loadedOn);
                var noteId = pRecord.AnnotationId ? pRecord.AnnotationId : "";
                var subjectValue = !!pRecord.Subject ? pRecord.Subject : "";
                var noteTextValue = !!pRecord.NoteText ? pRecord.NoteText : "";
                var modifiedByString = !!pRecord.ModifiedBy ? pRecord.ModifiedBy.Name : "";
                var modifiedOnString = !!pRecord.ModifiedOn ? pRecord.ModifiedOn.toLocaleDateString() + ", " + pRecord.ModifiedOn.toLocaleTimeString() : "";


                var editorPopupDiv = $("<div id='editorPopup'></div>").appendTo("#notesGridDiv");
                $("#editorPopup").kendoWindow({
                    modal: true,
                    actions: ["Close"],
                    draggable: true,
                    resizable: true,
                    minWidth: 500,
                    maxWidth: 1000,
                    minHeight: 225,
                    maxHeight: 500,
                    title: "Request Comment",
                    visible: false,
                    position: {
                        top: "5%",
                        left: "25%"
                    },
                    activate: function () {
                        if (!!noteTextValue) {
                            $("#dialogNoteText").focus().val("").val(noteTextValue);
                        }
                    }
                });
                var editorPopup = $("#editorPopup").data("kendoWindow");
                var newContent = "";            
                if (!recordIsEditable) {
                    //content for read-only note
                    newContent =
                        "<table class='dialogTable'>" +
                            //"<tr><td>Modified By:</td><td class='readOnlyValue'>" + modifiedByString + "</td></tr>" +
                            //"<tr><td>Modified On:</td><td class='readOnlyValue'>" + modifiedOnString + "</td></tr>" +
                            //"<tr><td>Comment Title:</td><td class='readOnlyValue'>" + subjectValue + "</td></tr>" +
                            //"<tr><td style='vertical-align:text-top;'>Comment Text:</td><td class='readOnlyValue'>" + noteTextValue.replace(/\n/g, "<br/>") + "</td></tr>" +
                            "<tr><td><b>Comment Text</b></td></tr>" +
                            "<tr><td class='readOnlyValue'>" + noteTextValue.replace(/\n/g, "<br/>") + "</td></tr>" +
                        "</table>" +
                        "<table>" +
                            "<tr><td><button class='CrmButton' onclick='dialogCancelClick(this);'>Close</button></td></tr>" +
                        "</table>";
                }
                else {
                    //content for editable note
                    newContent =
                        "<input type='hidden' id='dialogAnnotationId' value='" + noteId + "'/>" +
                        //"<input type='hidden' id='dialogOnLoadData' value='" + subjectValue + "_" + noteTextValue + "'/>" +
                        "<input type='hidden' id='dialogOnLoadData' value='" + noteTextValue + "'/>" +
                        "<input type='hidden' id='dialogSubject' value='Request Comment'/>" + 
                        "<table>" +
                            //"<tr>" +
                            //    "<td>Comment Title<span class='requiredAsterisk'>*</span></td>" +
                            //    "<td><input id='dialogSubject' placeholder='Comment title...' value='" + subjectValue + "'/></td>" +
                            //"</tr>" +
                            //"<tr>" +
                            //    "<td>Comment Text<span class='requiredAsterisk'>*</span></td>" +
                            //    "<td><textarea id='dialogNoteText' class='popupTextArea' cols='40' rows='6' placeholder='Comment text...'>" + noteTextValue + "</textarea></td>" +
                            //"</tr>" +
                            "<tr><td><b>Comment Text</b><span class='requiredAsterisk'>*</span></td></tr>" +
                            "<tr>" +
                                "<td><textarea id='dialogNoteText' class='popupTextArea' cols='60' rows='8' placeholder='Comment text...'>" + noteTextValue + "</textarea></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td><button class='CrmButton' onclick='dialogSaveClick(this);' title='Save this comment in CRM'>Save</button>  <button class='CrmButton' onclick='dialogCancelClick(this);'>Cancel</button></td>" +
                            "</tr>" +
                        "</table>";
                }
                editorPopup.content(newContent);
                editorPopup.center().open();
                editorPopup.title(!!subjectValue ? subjectValue : "New Request Comment");

                $(document).on("click", ".k-overlay", function () {
                    dialogCancelClick();
                });
            }
            catch (err) {
                throw err;
            }
        }
        else {
            throw new Error("Missing parent._loadedOn timestamp.");
        }
    }
    else {
        throw new Error("Missing record for dialog.");
    }
}
function dialogSaveClick(pButton) {
    try{
        var id = $("#dialogAnnotationId").val();
        var onLoadData = $("#dialogOnLoadData").val();
        var subject = $("#dialogSubject").val()
        var noteText = $("#dialogNoteText").val();
        if (!!subject && !!noteText) {
            //if (onLoadData != (subject + "_" + noteText)) {
            if (onLoadData != (noteText)) {
                //fields are dirty, want to create or update.
                if (!!id) {
                    var updateObject = {
                        Subject: subject,
                        NoteText: noteText,
                    };
                    updateNote(updateObject, id);
                }
                else {
                    var newRecordObject = {
                        Subject: subject,
                        NoteText: noteText,
                        ObjectId: {
                            Id: parent.Xrm.Page.data.entity.getId(),
                            Name: parent.Xrm.Page.data.entity.getPrimaryAttributeValue(),
                            LogicalName: parent.Xrm.Page.data.entity.getEntityName()
                        }
                    };
                    createNote(newRecordObject);
                }
            }
            else {
                console.log("No changes made in dialog. Did not create or update comment.");
                dialogCancelClick();
            }
        }
        else {
            console.log("Comment Title or Comment Text are empty. Did not create or update comment.");
            //prompt for missing data??
            //they can click cancel if they really don't want to enter a comment text.
            $(".requiredAsterisk").show();
        }
    }
    catch (err) {
        console.error(err.message);
        alert(err.message);
    }
}
function dialogCancelClick(pButton) {
    var dialog = $("#editorPopup").data("kendoWindow").close();
    setTimeout(function () { dialog.destroy(); }, 10);
}

function createNote(pNewRecordObject) {
    try{
        SDK.REST.createRecord(
            pNewRecordObject,
            "Annotation",
            function (pResponse) {
                //alert("created note: " + pNewRecordObject.Subject);
                console.log("created comment: ");
                console.log(pResponse);
                $("#editorPopup").data('kendoWindow').destroy();
                doPageLoad();
            },
            function (err) {
                console.error(err.message);
                alert("Error creating comment: " + err.message);
            }
        );
    }
    catch (err) {
        throw err;
    }
}
function updateNote(pUpdateRecordObject, pRecordId) {
    try{
        if (!!pUpdateRecordObject && (!!pUpdateRecordObject.Subject || !!pUpdateRecordObject.NoteText) && !!pRecordId) {
            SDK.REST.updateRecord(
                pRecordId,
                pUpdateRecordObject,
                "Annotation",
                function () {
                    //alert("updated comment: " + pUpdateRecordObject.Subject);
                    console.log("updated comment: " + pRecordId);
                    $("#editorPopup").data('kendoWindow').destroy();
                    doPageLoad();
                },
                function (err) {
                    console.error(err.message);
                    alert("Error updating comment: " + err.message);
                }
            );
        }
    }
    catch (err) {
        throw err;
    }
}

function headerCheckmark_click() {
    try{
        $(".checkmark").each(function (i, thisCheckmark) { captureNoteSelection(thisCheckmark, false); }); //clear all checkmarks on current page of grid
        $('#notesGridDiv').data('kendoGrid').dataSource.data().forEach(function (thisNote, i) { thisNote.Selected = false; }); //set selection of all data items to false (via the kendo dataSource)
        $("#btnApplySelectedNotes").attr("disabled", "disabled");
    }
    catch (err) {
        console.error("Error clearing comment selections: " + err.message);
        alert("Error clearing comment selections: " + err.message);
    }
}
function checkmark_click(pCheckmark) {
    try {
        var wasCheckedWhenClicked = $('#notesGridDiv').data('kendoGrid').dataItem($(pCheckmark).closest("tr")).Selected == true;
        captureNoteSelection(pCheckmark, !wasCheckedWhenClicked);
    }
    catch (err) {
        console.error("Error selecting comment: " + err.message);
        alert("Error selecting comment: " + err.message);
    }
}

function captureNoteSelection(pCheckmark, pSelect) {
    try{
        var thisRow = $(pCheckmark).closest("tr");
        var notesGrid = $('#notesGridDiv').data('kendoGrid');
        var noteDataItem = notesGrid.dataItem(thisRow);
        noteDataItem.Selected = pSelect;

        if (pSelect) {
            //add the appropriate kendo class to highlight the row
            thisRow.addClass("k-state-selected");
            pCheckmark.setAttribute("src", "/_imgs/grid/checkbox.png");
        }
        else {
            //remove the appropriate kendo class that highlights the row
            thisRow.removeClass("k-state-selected");
            pCheckmark.setAttribute("src", "/_imgs/grid/checkbox_light.png");
        }

        //enable/disable btnApplySelectedNotes button
        var rows = notesGrid.dataSource.data();
        var atLeastOneRowSelected = false;
        for (var i = 0; i < rows.length && atLeastOneRowSelected == false; i++) {
            atLeastOneRowSelected = rows[i].Selected == true;
        }
        if (atLeastOneRowSelected) {
            $("#btnApplySelectedNotes").removeAttr("disabled");
        }
        else {
            $("#btnApplySelectedNotes").attr("disabled", "disabled");
        }
    }
    catch (err) {
        throw err;
    }
}
function btnApplySelectedNotes_click() {
    try {
        //Ignore button click if entity form is read only
        if (parent.Xrm.Page.ui.getFormType() >= 3) {
            throw new Error("Did not apply selected comments(s) to progress note. This request is read-only.");
        }
        var builtString = "";
        var noteCount = 0;

        $('#notesGridDiv').data('kendoGrid').dataSource.data().forEach(function (thisNote, i) {
            if (thisNote.Selected == true) {
                if (!!thisNote.CreatedOn) {
                    if (builtString != "") { builtString = builtString + "\n"; }
                    builtString = builtString + thisNote.CreatedOn.toString() + "\n";
                }
                if (!!thisNote.CreatedBy) {
                    builtString = builtString + "Created By: " + thisNote.CreatedBy.Name + "\n";
                }
                if (!!thisNote.Subject) {
                    builtString = builtString + "Comment Title: " + thisNote.Subject + "\n";
                }
                if (!!thisNote.NoteText) {
                    builtString = builtString + thisNote.NoteText + "\n";
                }
                noteCount++;
            }
        });

        if (builtString != "") {
            var noteDetailAttr = parent.Xrm.Page.getAttribute('ftp_notedetail');
            if (!!noteDetailAttr) {
                var previousValue = parent.Xrm.Page.getAttribute('ftp_notedetail').getValue();
                noteDetailAttr.setValue(builtString + (!!previousValue ? "\n" + previousValue : ""));
                noteDetailAttr.setSubmitMode('always');
                alert("Applied " + noteCount + " selected comment(s) to your progress note!");
                noteDetailAttr.fireOnChange();
                headerCheckmark_click();
            }
            else {
                throw new Error("Could not apply " + noteCount + " selected comments(s) to progress note. The 'ftp_notedetail' attribute is missing from the form.");
            }
        }
    }
    catch (err) {
        console.error(err.message);
        alert(err.message);
    }
}

function destroyNotesGrid() {
    var notesGridDiv = $("#notesGridDiv");
    if (!!notesGridDiv && notesGridDiv.length == 1) {
        if (!!notesGridDiv.data("kendoGrid")) {
            $("#notesGridDiv").data("kendoGrid").destroy();
        }
        $("#notesGridDiv").empty();
        $("#notesGridDiv").remove();
    }
    kendo.destroy("#notesGridDivParentDiv");
}

/*helper functions*/
function guidsMatch(pGuid1, pGuid2) {
    var guid1 = pGuid1.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
    var guid2 = pGuid2.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
    return guid1 == guid2;
}
function parseDataParametersFromUrl(pQueryString) {
    //example query string (unencoded): contactid={32CA1B55-DC81-E611-9445-0050568D743D}&fullname=TIFINKLE, ANDREW&sensitivity=true&IsUSD=true
    var fullParameterArray = pQueryString.substr(1).split("&");

    //clean up the URL query string and split each member into a key/value pair
    for (var i in fullParameterArray) {
        fullParameterArray[i] = fullParameterArray[i].replace(/\+/g, " ").split("=");
    }

    var fullObject = {};
    for (var i in fullParameterArray) {
        var thisParameterName = fullParameterArray[i][0];
        var thisParameterValue = fullParameterArray[i][1];
        fullObject[thisParameterName] = thisParameterValue;
        if (thisParameterName.toLowerCase() == "data") {
            var dataObject = {};
            var customDataArray = decodeURIComponent(thisParameterValue).split("&");
            for (var j in customDataArray) {
                customDataArray[j] = customDataArray[j].replace(/\+/g, " ").split("=");
                dataObject[customDataArray[j][0]] = customDataArray[j][1];
            }
            fullObject[thisParameterName] = dataObject;
        }
    }
    return fullObject;
}
function errorHandler(err) {
    //console.error(err.message);
    //alert(err.message);
    throw err;
}
function ArrayIndexOfObjectByAttribute(pArray, pAttr, pValue) {
    for (var i = 0; i < pArray.length; i += 1) {
        if (pArray[i][pAttr] === pValue) {
            return i;
        }
    }
    return -1;
}
function getDeepProperty(pPath, pObject) {
    if (!!pPath) {
        var pathAsArray = pPath.split(".");
        var returnObj = !!pObject ? pObject : window[pathAsArray.shift()];
        if (typeof returnObj != "undefined") {
            while (!!returnObj && pathAsArray.length > 0) {
                var nextLevel = pathAsArray.shift();
                var isArrayQuery = nextLevel.indexOf("[") > -1 && nextLevel.indexOf("]") == nextLevel.indexOf("[") + 2;
                var nextLevelName = !isArrayQuery ? nextLevel : nextLevel.split("[")[0];
                var nextLevelArrayMember = !isArrayQuery ? null : parseInt((nextLevel.split("[")[1]).substr(0, (nextLevel.split("[")[1].length)));

                returnObj = isArrayQuery ? returnObj[nextLevelName][nextLevelArrayMember] : returnObj[nextLevelName];

            }
            return returnObj;
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
function showLoadingMessage(pMessage) {
    $("#progressText").html(pMessage);
    showDiv("#loadingGifDiv");
}
function showErrorMessage(pMessage) {
    $("#errorText").html(pMessage);
    showDiv("#errorContainer");
}
function showDiv(pDivToShow) {
    var knownDivs = [
        "testDataMessageDiv",
		"#loadingGifDiv",
		"#errorContainer",
		"#NotesGridContainer",
        "#newRecordMessageContainer",
    ];
    for (var d = 0; d < knownDivs.length; d++) {
        if (knownDivs[d] == pDivToShow) {
            $(knownDivs[d]).show();
        }
        else {
            $(knownDivs[d]).hide();
        }
    }
}