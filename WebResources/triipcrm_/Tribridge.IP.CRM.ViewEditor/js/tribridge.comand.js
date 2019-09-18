/// <reference path="XrmServiceToolkit.js" />

if (typeof Tribridge == "undefined")
    Tribridge = {};
if (typeof Tribridge.ViewEditor == "undefined")
    Tribridge.ViewEditor = {};
if (typeof Tribridge.ViewEditor.Command == "undefined")
    Tribridge.ViewEditor.Command = {};


Tribridge.ViewEditor.Command.isGrid = false;
Tribridge.ViewEditor.Command.Entity = "";
Tribridge.ViewEditor.Command.ViewName = "";
Tribridge.ViewEditor.Command.ReadonlyCols = [];
Tribridge.ViewEditor.Command.RequiredCols = [];
Tribridge.ViewEditor.Command.RestrictedViews = [];
Tribridge.ViewEditor.Command.AllowedViews = [];
Tribridge.ViewEditor.Command.CurrentView = "";


// Appears to be called from the Ribbon Button
// Function is Called each time View is changed and each time you switch between Editable and CRM
Tribridge.ViewEditor.Command.Verify = function (entity) {
    var functionName = "Tribridge.ViewEditor.Command.Verify";
    var entityName = "triipcrm_viewconfigurationSet";
    var enable = false;
    try {
        ////load the jquery js files
        LoadWebResource('triipcrm_/Tribridge.IP.CRM.ViewEditor/js/jquery.js');

        //Tribridge.ViewEditor.Command.SetViewName();
        //var odataSelect = Tribridge.ViewEditor.GetServerUrl() + "/XRMServices/2011/OrganizationData.svc/triipcrm_vieweditorsettingsSet";
        var odataSelect = Tribridge.ViewEditor.GetServerUrl() + "/XRMServices/2011/OrganizationData.svc/triipcrm_viewconfigurationSet";
        var passthrough = [];
        var enable = false;
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: odataSelect,
            async: false,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {

                var ents = data.d.results;

                var ar = [];
                for (i = 0; i < ents.length; i++) {
                    //ar.push(ents[i].triipcrm_name);
                    ar.push(ents[i].triipcrm_PrimaryEntity);
                }

                var i = ar.indexOf(entity);

                enable = i < 0 ? false : true;
            }
        });
        
        return enable;
    } catch (e) {
        throwError(e, functionName);
    }
}

///////////////////////////////////////////////////////////////////////////////
/////// This function is used to load resources required for json
//////////////////////////////////////////////////////////////////////////////
function LoadWebResource(resource) {

    var httpRequest;

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        httpRequest = new XMLHttpRequest();
    }
    else {
        // code for IE6, IE5
        httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    }

    httpRequest.open("GET", GetServerUrl() + "/webresources/" + resource, false);
    //httpRequest.open("GET", Xrm.Page.context.getServerUrl() + "/webresources/" + resource, false);
    httpRequest.send(null);
    try {
        eval(httpRequest.responseText);
    }
    catch (e) {
        alert("LoadWebResource >> Error loading " + resource + ":\n" + e.description);
    }
}

/// Get server URL
function GetServerUrl() {
    var functionName = "Tribridge.ViewEditor.GetServerUrl";

    try {
        var pathArray = window.location.pathname.split('/');
        //var serverUrl = window.location.protocol + "//" + window.location.host + "/" + pathArray[1];
        var serverUrl = window.location.protocol + "//" + window.location.host;

        if (typeof Xrm != 'undefined') {
            if (typeof Xrm.Page.context == "object") {
                if (typeof Xrm.Page.context.getClientUrl != 'undefined') {
                    serverUrl = Xrm.Page.context.getClientUrl();
                } else if (typeof Xrm.Page.context.getServerUrl != 'undefined') {
                    serverUrl = Xrm.Page.context.getServerUrl();
                } else {
                    serverUrl = document.location.protocol + "//" + document.location.host + "/" + Xrm.Page.context.getOrgUniqueName();
                }
            }
            else { throw new Error("Unable to access the server URL"); }
        }

        if (serverUrl.match(/\/$/)) {
            serverUrl = serverUrl.substring(0, serverUrl.length - 1);
        }

        return serverUrl;
    } catch (e) {
        throwError(e, functionName);
    }
}

function onEnableFetchQueryComplete(result) {
    var functionName = "onEnableFetchQueryComplete";
    try {

    } catch (e) {
        throwError(e, functionName);
    }
}

/*function to get the CRM URL
*/
function getCRMUrl() {
    var funcitonName = "getCRMUrl";
    var crmURL = "";
    try {
        try {
            //get CRM client URL
            crmURL = Xrm.Page.context.getClientUrl();

        } catch (e) {
            //return server url
            return Xrm.Page.context.getServerUrl();
        }
        //add '/' symbol
        if (!(crmURL.charAt(crmURL.length - 1) == '/')) {
            crmURL += '/';
        }
    } catch (e) {
        throwError(funcitonName, e);
    }
    return crmURL;
}

//This function validates the fields and their attributes 
function isValid(attributes) {
    var functionName = "isValid";
    try {
        if (attributes != null && attributes != "undefined" && attributes != "") {
            return true;
        }
        else {
            return false;
        }
    } catch (e) {
        throwError(e, functionName);
    }
}

// Appears to be called from the Ribbon Button
Tribridge.ViewEditor.Command.InsertGrid = function (entity) {
    var functionName = "Tribridge.ViewEditor.Command.InsertGrid";
    try {
       // var windowWidth = window.innerWidth
       //|| document.documentElement.clientWidth
       //|| document.body.clientWidth;

        var windowWidth = screen.width - 25;
        var windowHeight = screen.height - 120;

        var left = 2;
        var top = 2;

        ////set window width
        //var windowWidth = 1350;//"610";
        ////set window height
        //var windowHeight = 677;//560//"520";

        Tribridge.ViewEditor.Command.Entity = entity;

        //set url and querystring parameter
        var url = getCRMUrl() + "WebResources/triipcrm_/Tribridge.IP.CRM.ViewEditor/BuildGrid.html?Type=" + entity;

        //open url in window
        //window.open(url, null, "width=" + windowWidth + ", height=" + windowHeight + ", resizable=no, location=yes, left=0, top=0, scrollbars=yes", null);
        window.open(url, null, "width=" + windowWidth + ", height=" + windowHeight + ", resizable=no, location=yes, left=" + left + ", top=" + top + ", scrollbars=yes", null);

    } catch (e) {
        throwError(e, functionName);
    }
}



Tribridge.ViewEditor.GetServerUrl = function () {
    var functionName = "Tribridge.ViewEditor.GetServerUrl";

    try {
        var pathArray = window.location.pathname.split('/');
        //var serverUrl = window.location.protocol + "//" + window.location.host + "/" + pathArray[1];
        var serverUrl = window.location.protocol + "//" + window.location.host;

        if (typeof Xrm != 'undefined') {
            if (typeof Xrm.Page.context == "object") {
                if (typeof Xrm.Page.context.getClientUrl != 'undefined') {
                    serverUrl = Xrm.Page.context.getClientUrl();
                } else if (typeof Xrm.Page.context.getServerUrl != 'undefined') {
                    serverUrl = Xrm.Page.context.getServerUrl();
                } else {
                    serverUrl = document.location.protocol + "//" + document.location.host + "/" + Xrm.Page.context.getOrgUniqueName();
                }
            }
            else { throw new Error("Unable to access the server URL"); }
        }

        if (serverUrl.match(/\/$/)) {
            serverUrl = serverUrl.substring(0, serverUrl.length - 1);
        }

        return serverUrl;
    } catch (e) {
        throwError(e, functionName);
    }
}

// Function determines if View is included in the list of Allowed Views
Tribridge.ViewEditor.Command.IsIncludedInAllow = function (viewName) {
    var functionName = "Tribridge.ViewEditor.Command.IsIncludedInAllow";
    try {
        // Check to see if it is allowed
        var isAllowed = Tribridge.ViewEditor.Command.AllowedViews.indexOf(viewName) < 0 ? false : true;
        if (isAllowed == false) {
            // Remove the spaces and try again
            isAllowed = Tribridge.ViewEditor.Command.AllowedViews.indexOf(viewName.replace(" ", "")) < 0 ? false : true;
        }

        return isAllowed;
    } catch (e) {
        throwError(e, functionName);
    }
}

// Set View Name to the Current View
Tribridge.ViewEditor.Command.SetViewName = function () {
    var functionName = "Tribridge.ViewEditor.Command.SetViewName";
    try {
        var view = $("#crmGrid_SavedNewQuerySelector span").text();
        Tribridge.ViewEditor.Command.ViewName = view;
    } catch (e) {
        throwError(e, functionName);
    }
}

// Function Changes the Screen back to the CRM View
Tribridge.ViewEditor.Command.ResetToCRMViewDisplay = function () {
    var functionName = "Tribridge.ViewEditor.Command.ResetToCRMViewDisplay";
    try {
        $("#homepageTableCell div").first().show();
        $("#homepageTableCell").find("#ViewEditor").first().remove();
        document.getElementById("crmGrid").control.refresh();
    } catch (e) {
        throwError(e, functionName);
    }
}


//Generic function for throwing an error
function throwError(error, functionName) {
    try {
        HideLoading();
        Xrm.Utility.alertDialog(functionName + "Error: " + (error.description || error.message));
    } catch (e) {
        alert(functionName + "Error: " + (error.message || error.description));
    }
}