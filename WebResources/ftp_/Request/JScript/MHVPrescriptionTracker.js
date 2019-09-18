//MHVPrescriptionTracker.js
/// <reference path="../../JScript/VCCM.USDHelper.js" />

var track_jsonSampleData_02 = 
    [{
        "prescriptionName": "AMANTADINE HCL 100MG CAP", "prescriptionNumber": "3636132", "facilityName": "SLC4",
        "rxInfoPhoneNumber": "(484)555-0987", "ndcNumber": "00004012501", "lastUpdatedtime": "Thu, 25 Jan 2018 04:30:15 EST",
        "trackingInfo": [
            {
                "shippedDate": "Thu, 25 Jan 2018 00:00:00 EST", "deliveryService": "USPS", "trackingNumber": "8883592183273123",
                "otherPrescriptionListIncluded": []
            },
            {
                "shippedDate": "Wed, 10 Jan 2018 00:00:00 EST", "deliveryService": "UPS", "trackingNumber": "1Z44456712098445634",
                "otherPrescriptionListIncluded": []
            },
            {
                "shippedDate": "Fri, 12 Jan 2018 00:00:00 EST", "deliveryService": "FedEx", "trackingNumber": "168766712098445634",
                "otherPrescriptionListIncluded": []
            },
            {
                "shippedDate": "Mon, 8 Jan 2018 00:00:00 EST", "deliveryService": "DHL", "trackingNumber": "970177103737",
                "otherPrescriptionListIncluded": []
            }
        ]
    }];

function track_PageLoad() {
    try {
        var track_objPrescriptionData = null;
        //Use temporary JSON sample data for dev testing
        //track_objPrescriptionData = track_jsonSampleData_02;

        //Get data from parent page
        if (typeof parent.track_popUpData != 'undefined' && parent.track_popUpData != null) {
            track_objPrescriptionData = parent.track_popUpData.Data[0];
        }
        //Reference to grid
        var track_grid = document.getElementById("presTrackGrid");

        //Loop through JSON Result
        var track_gridRowCounter = 0;
        if (typeof track_objPrescriptionData != 'undefined' && track_objPrescriptionData != null) {
            var track_trackingInfo = track_objPrescriptionData.trackingInfo;
            if (typeof track_trackingInfo != 'undefined' && track_trackingInfo != null) {
                //Get each tracking record
                for (var i = 0; i < track_trackingInfo.length; i++) {
                    var track_shippedDate = track_trackingInfo[i].shippedDate;
                    track_shippedDate = new Date(track_shippedDate);
                    track_shippedDate = track_shippedDate.getMonth() + 1 + "/" + track_shippedDate.getDate() + "/" + track_shippedDate.getFullYear();
                    var track_deliveryService = track_trackingInfo[i].deliveryService;
                    var track_trackingNumber = track_trackingInfo[i].trackingNumber;

                    track_gridRowCounter = track_gridRowCounter + 1;
                    var track_row = track_grid.insertRow(track_gridRowCounter);
                    var track_cell1 = track_row.insertCell(0);
                    var track_cell2 = track_row.insertCell(1);
                    var track_cell3 = track_row.insertCell(2);
                    var track_cell4 = track_row.insertCell(3);
                    //Hide the last tracking column
                    track_cell4.style.display = 'none';

                    track_cell1.innerHTML = track_deliveryService;
                    track_cell2.innerHTML = track_shippedDate;

                    if (track_deliveryService == "UPS") {
                        track_cell3.innerHTML = "<a href='' target='_blank' onclick='return track_openTracker(" + track_gridRowCounter + ");'>" + track_trackingNumber + "</a>";
                        track_cell4.innerHTML = track_trackingNumber;
                    }
                    else if (track_deliveryService == "USPS") {
                        track_cell3.innerHTML = "<a href='' target='_blank' onclick='return track_openTracker(" + track_gridRowCounter + ");'>" + track_trackingNumber + "</a>";
                        track_cell4.innerHTML = track_trackingNumber;
                    }
                    else if (track_deliveryService == "FedEx") {
                        track_cell3.innerHTML = "<a href='' target='_blank' onclick='return track_openTracker(" + track_gridRowCounter + ");'>" + track_trackingNumber + "</a>";
                        track_cell4.innerHTML = track_trackingNumber;
                    }
                    else {
                        track_cell3.innerHTML = track_trackingNumber;
                        track_cell4.innerHTML = track_trackingNumber;
                    }
                }
            }
        }
    }
    catch (e) {
        alert("Error loading Prescription Tracker (function: track_PageLoad) Error" + e);
    }
}

function track_openTracker(track_trackingID) {
    try {
        //Construct Tracking URL
        var track_grid = document.getElementById("presTrackGrid");
        var track_row = track_grid.rows[parseInt(track_trackingID)];
        var track_trackIdVal = track_row.cells[3].innerHTML.toString();
        var track_trackCarrier = track_row.cells[0].innerHTML.toString();

        if (track_trackCarrier == "UPS") {
            var track_trackingURL = "http://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=" + track_trackIdVal;
            //window.open(track_trackingURL);
            VCCM.USDHelper.CallUSDAction("Shared Global Manager", "LaunchURL", track_trackingURL);
        }
        else if (track_trackCarrier == "USPS") {
            var track_trackingURL = "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=" + track_trackIdVal;
            //window.open(track_trackingURL);
            VCCM.USDHelper.CallUSDAction("Shared Global Manager", "LaunchURL", track_trackingURL);
        }
        else if (track_trackCarrier == "FedEx") {
            var track_trackingURL = "https://www.fedex.com/Tracking?action=track&tracknumbers=" + track_trackIdVal;
            //window.open(track_trackingURL);
            VCCM.USDHelper.CallUSDAction("Shared Global Manager", "LaunchURL", track_trackingURL);
        }
        //Cancel original table href navigation
        return false;
    }
    catch (e) {
        alert("Error loading carrier's tracking shipment page (function: track_openTracker) Error" + e);
    }
}
