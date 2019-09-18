function launchSignerSearch() {
    try {
        //Refresh the web resource URL
        var SignerSearchWRUrl = Xrm.Page.getControl("WebResource_SignerSearch").getSrc();
        Xrm.Page.getControl("WebResource_SignerSearch").setSrc(SignerSearchWRUrl);
        //Prep the tab
        if (Xrm.Page.ui.tabs.get("Tab_SignersSearch").getVisible() == false) {;
            Xrm.Page.ui.tabs.get("Tab_SignersSearch").setVisible(true);
        }
        if (Xrm.Page.ui.tabs.get("Tab_SignersSearch").getDisplayState() != "expanded") {
            Xrm.Page.ui.tabs.get("Tab_SignersSearch").setDisplayState("expanded");
        }
        //Set focus to the signers tab
        Xrm.Page.ui.tabs.get("Tab_SignersSearch").setFocus();
    }
    catch (err) {
        alert("Error launching Signer Search control: " + err.message);
    }
}

function vcmn_initViaDropdownControls() {
    //Initialize VIA DropDown Controls
    //Function is triggered by The VistA Login Control and onchange of Facility attribute
    try {
        //Xrm.Page.getControl("WebResource_HospitalLocation").setSrc(Xrm.Page.getControl("WebResource_HospitalLocation").getSrc());
        //Xrm.Page.getControl("WebResource_LocalNotesTitle").setSrc(Xrm.Page.getControl("WebResource_LocalNotesTitle").getSrc());
        //Xrm.Page.getControl("WebResource_ViaWorkloadLookup").setSrc(Xrm.Page.getControl("WebResource_ViaWorkloadLookup").getSrc());
        //Xrm.Page.getControl("WebResource_ProgressNoteSignerSearch").setSrc(Xrm.Page.getControl("WebResource_ProgressNoteSignerSearch").getSrc());
		Xrm.Page.getControl("WebResource_AddendumSignerSearch").setSrc(Xrm.Page.getControl("WebResource_AddendumSignerSearch").getSrc());
    }
    catch (err) {
        alert('Additional Signers VIA Login Function Error(vcmn_initViaDropdownControls): ' + err.message);
    }
}

function vadi_executeVistaAddendumIntegration(vadi_originalNoteId, vadi_noteDescription, vadi_eSignatureCode) {
	//adapt this to use for additional signers entity
	return;
    try {
        //Reformat Note Description as needed to handle long lines of text (WordWrap)
        var vadi_NoteText = vadi_noteDescription;
        var vadi_RevisedNoteText = "";

        //Do Breakdown of lines
        var vadi_TextLines = vadi_NoteText.split('\n');
        if (vadi_TextLines.length > 0) {
            //Reformat text
            for (var i = 0; i < vadi_TextLines.length; i++) {
                //Test for a long line
                if (vadi_TextLines[i].length > vadi_WordWrapLimit) {
                    //Break down line
                    var vadi_NewString = vadi_wordWrap(vadi_TextLines[i], vadi_WordWrapLimit, '\n');
                    //Add revised text back
                    vadi_RevisedNoteText = vadi_RevisedNoteText + vadi_NewString + "\n";  //Add back the CR/LF used to split on
                }
                else {
                    //Add text to new note
                    vadi_RevisedNoteText = vadi_RevisedNoteText + vadi_TextLines[i] + "\n"; //Add back the CR/LF used to split on
                }
            }
        }
        if (vadi_RevisedNoteText != "" && vadi_RevisedNoteText != null) {
            vadi_noteDescription = vadi_RevisedNoteText;
        }

        //Add list of additional signer names to Note Text if they exists
        if (vadi_AddlSignersNameArray != null && vadi_AddlSignersIenArray != null) {
            //Create text strings from additional signers array
            var vadi_SignerNames = "\nAdditional Note Signers\n" + "-----------------------------\n";
            for (var i = 0; i <= vadi_AddlSignersNameArray.length - 1; i++) {
                if (i >= 1) {
                    var vadi_singleSignerName = vadi_AddlSignersNameArray[i].split("___");
                    vadi_SignerNames = vadi_SignerNames + vadi_singleSignerName[1] + "\n";
                }
            }
            //Add to Note Description
            vadi_noteDescription = vadi_noteDescription + vadi_SignerNames;
        }

        var vadi_userSiteId = "";
        var vadi_UserSiteNo = "";
        var vadi_duz = "";
        var vadi_providername = "";

        var vadi_userData = vadi_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', Xrm.Page.context.getUserId());
        if (vadi_userData != null) {
            if (vadi_userData.d.ftp_FacilitySiteId != null) {
                vadi_userSiteId = vadi_userData.d.ftp_FacilitySiteId.Id;
            }
        }

        //Lookup the Facility/Site #
        if (vadi_userSiteId != null && vadi_userSiteId != '') {
            var vadi_facilityData = vadi_getSingleEntityDataSync('ftp_facilitySet', 'ftp_facilitycode', vadi_userSiteId);
            if (vadi_facilityData != null) {
                if (vadi_facilityData.d.ftp_facilitycode != null) { vadi_UserSiteNo = vadi_facilityData.d.ftp_facilitycode; }
            }
        }

        //Check if VIA Login cookie exist (not expired)
        var vadi_ViaLoginCookie = vadi_getCookie("viasessionlink");
        if (vadi_ViaLoginCookie != null && vadi_ViaLoginCookie != '') {
            var vadi_cookiearray = vadi_ViaLoginCookie.split("~~~~", 2);
            vadi_duz = vadi_cookiearray[0];
            vadi_providername = vadi_cookiearray[1];
        }

        //Create the VIA Addendum Record
        var vadi_viaAddendum = new Object();
        vadi_viaAddendum.ProviderName = vadi_providername;
        vadi_viaAddendum.Duz = vadi_duz;
        vadi_viaAddendum.LoginSiteCode = vadi_UserSiteNo;
        vadi_viaAddendum.Target = vadi_originalNoteId;
        vadi_viaAddendum.AddendumNote = vadi_noteDescription;

        $.ajax({
            type: "POST",
            url: vadi_CreateAddendumUrl,
            data: JSON.stringify(vadi_viaAddendum),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var vadi_newdata = data.Data;
                vadi_requestResponse = vadi_newdata;
                vadi_executeVistaAddendumIntegration_response(null, vadi_requestResponse, vadi_noteDescription, vadi_eSignatureCode);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
                vadi_executeVistaAddendumIntegration_response(errorThrown, null, vadi_noteDescription, vadi_eSignatureCode);
            },
            async: false,
            cache: false
        });

    }
    catch (err) {
        alert('Addendum Ribbon Function Error(vadi_executeVistaAddendumIntegration): ' + err.message);
        Xrm.Page.ui.clearFormNotification("SAVEVISTA");
    }
}

function vadi_executeVistaAddendumIntegration_response(vadi_errorThrown, vadi_requestResponse, vadi_noteDescription, vadi_eSignatureCode) {
	//adapt this to use for additional signers entity
	return;
    try {
        //Process Integration Request Response
        if (vadi_errorThrown != null) {
            //Write Error
            Xrm.Page.getAttribute('ftp_integrationstatus').setValue('ERROR');
            Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_integrationerror').setValue(String(vadi_errorThrown));
            Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
            Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_addendumnoteid').setValue('');
            Xrm.Page.getAttribute('ftp_addendumnoteid').setSubmitMode('always');
            alert('The addendum creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
            Xrm.Page.getControl('ftp_integrationerror').setFocus();
            Xrm.Page.data.entity.save();
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }
        else {
            //Write web service response Success or Failure
            if (vadi_requestResponse[0].Fault == null) {
                //Verify that a Note Id was created for the addendum and that it is a number (not error message)
                if (isNaN(vadi_requestResponse[0].Text) == false) {
                    //Call Additional Signers & Finalize Addendum function
                    vadi_finalizeAddendumCreation("OK", vadi_requestResponse[0].Text, vadi_noteDescription, vadi_eSignatureCode)
                }
                else {
                    //Write Failure entry since the NoteId is not a number
                    Xrm.Page.getAttribute('ftp_integrationstatus').setValue('ERROR');
                    Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationerror').setValue(vadi_requestResponse[0].Text);
                    Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
                    Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_addendumnoteid').setValue('');
                    Xrm.Page.getAttribute('ftp_addendumnoteid').setSubmitMode('always');
                    alert('The addendum creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
                    Xrm.Page.getControl('ftp_integrationerror').setFocus();
                    Xrm.Page.data.entity.save();
                    Xrm.Page.ui.clearFormNotification("SAVEVISTA");
                    return false;
                }
            }
            else {
                //Write Failure entry
                Xrm.Page.getAttribute('ftp_integrationstatus').setValue('ERROR');
                Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_integrationerror').setValue(vadi_requestResponse[0].Fault.Message);
                Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
                Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_addendumnoteid').setValue('');
                Xrm.Page.getAttribute('ftp_addendumnoteid').setSubmitMode('always');
                alert('The addendum creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
                Xrm.Page.getControl('ftp_integrationerror').setFocus();
                Xrm.Page.data.entity.save();
                Xrm.Page.ui.clearFormNotification("SAVEVISTA");
                return false;
            }
        }
    }
    catch (err) {
        alert('Addendum Ribbon Function Error(vadi_executeVistaAddendumIntegration_response): ' + err.message);
        Xrm.Page.ui.clearFormNotification("SAVEVISTA");
    }
}

function vadi_finalizeAddendumCreation(vadi_integrationStatus, vadi_integrationNoteId, vadi_noteDescription, vadi_eSignatureCode) {
	//adapt this to use for additional signers entity
	return;
    //The Addendum was sucessfully created in Vista/CPRS, add additional signers if needed
    try {
        //Determine if additional signers exists
        if (vadi_AddlSignersNameArray != null && vadi_AddlSignersIenArray != null) {
            //Get the current CRM User's assigned site/facility
            var vadi_userSiteId = "";
            var vadi_UserSiteNo = "";
            var vadi_duz = "";
            var vadi_providername = "";

            var vadi_userData = vadi_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', Xrm.Page.context.getUserId());
            if (vadi_userData != null) {
                if (vadi_userData.d.ftp_FacilitySiteId != null) {
                    vadi_userSiteId = vadi_userData.d.ftp_FacilitySiteId.Id;
                }
            }

            //Lookup the Facility/Site #
            if (vadi_userSiteId != null && vadi_userSiteId != '') {
                var vadi_facilityData = vadi_getSingleEntityDataSync('ftp_facilitySet', 'ftp_facilitycode', vadi_userSiteId);
                if (vadi_facilityData != null) {
                    if (vadi_facilityData.d.ftp_facilitycode != null) { vadi_UserSiteNo = vadi_facilityData.d.ftp_facilitycode; }
                }
            }

            //Check if VIA Login cookie exist (not expired)
            var vadi_ViaLoginCookie = vadi_getCookie("viasessionlink");
            if (vadi_ViaLoginCookie != null && vadi_ViaLoginCookie != '') {
                var vadi_cookiearray = vadi_ViaLoginCookie.split("~~~~", 2);
                vadi_duz = vadi_cookiearray[0];
                vadi_providername = vadi_cookiearray[1];
            }

            //Create text strings from additional signers array
            var vadi_SignerIEN = "";
            for (var i = 0; i <= vadi_AddlSignersIenArray.length - 1; i++) {
                if (i == 1) { vadi_SignerIEN = vadi_AddlSignersIenArray[i]; }
                if (i > 1) { vadi_SignerIEN = vadi_SignerIEN + " " + vadi_AddlSignersIenArray[i]; }
            }

			/*THIS IS THE IMPORTANT PART*/
            //Create the Additional Signers
            var vadi_viaSigners = new Object();
            vadi_viaSigners.ProviderName = vadi_providername;
            vadi_viaSigners.Duz = vadi_duz;
            vadi_viaSigners.LoginSiteCode = vadi_UserSiteNo;
            vadi_viaSigners.Target = vadi_integrationNoteId;
            vadi_viaSigners.SupplementalParameters = vadi_SignerIEN;

            $.ajax({
                type: "POST",
                url: vadi_AddSignersUrl,
                data: JSON.stringify(vadi_viaSigners),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    vadi_viaSignersResponse = JSON.stringify(data.Data);
                    //Test for Failure
                    if (vadi_viaSignersResponse.ErrorOccurred == true) {
                        alert("Error: Unable to add the additional signers selected to this addendum.\n\nPlease review the addendum and signers in your Vista/CPRS application!");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //System Error
                    alert("Error: Unable to add the additional signers selected to this addendum.\n\nPlease review the addendum and signers in your Vista/CPRS application!");
                },
                async: false,
                cache: false
            });

            if (vadi_localStorageVarName != "" && vadi_localStorageVarName != null) {
                //Clear existing session storage variable.
                localStorage.removeItem(vadi_localStorageVarName);
            }
        }

        //**NOTE: THE SECTION BELOW IS TEMPORARILY DISABLED DUE TO THE SIGN NOTE SERVICE FAILING WITH ADDENDUMS....

        /*
        //Add primary signer's e-signature
        if (vadi_eSignatureCode != null && vadi_eSignatureCode != '') {
            //****
            //Get the current CRM User's assigned site/facility
            var vadi_userSiteId = "";
            var vadi_UserSiteNo = "";
            var vadi_duz = "";
            var vadi_providername = "";

            var vadi_userData = vadi_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', Xrm.Page.context.getUserId());
            if (vadi_userData != null) {
                if (vadi_userData.d.ftp_FacilitySiteId != null) {
                    vadi_userSiteId = vadi_userData.d.ftp_FacilitySiteId.Id;
                }
            }

            //Lookup the Facility/Site #
            if (vadi_userSiteId != null && vadi_userSiteId != '') {
                var vadi_facilityData = vadi_getSingleEntityDataSync('ftp_facilitySet', 'ftp_facilitycode', vadi_userSiteId);
                if (vadi_facilityData != null) {
                    if (vadi_facilityData.d.ftp_facilitycode != null) { vadi_UserSiteNo = vadi_facilityData.d.ftp_facilitycode; }
                }
            }

            //Check if VIA Login cookie exist (not expired)
            var vadi_ViaLoginCookie = vadi_getCookie("viasessionlink");
            if (vadi_ViaLoginCookie != null && vadi_ViaLoginCookie != '') {
                var vadi_cookiearray = vadi_ViaLoginCookie.split("~~~~", 2);
                vadi_duz = vadi_cookiearray[0];
                vadi_providername = vadi_cookiearray[1];
            }


            //****

            var vadi_viaSignAddendum = new Object();
            vadi_viaSignAddendum.ProviderName = vadi_providername;
            vadi_viaSignAddendum.Duz = vadi_duz;
            vadi_viaSignAddendum.LoginSiteCode = vadi_UserSiteNo;
            vadi_viaSignAddendum.NoteIEN = vadi_integrationNoteId;
            vadi_viaSignAddendum.ESig = vadi_eSignatureCode;

            $.ajax({
                type: "POST",
                url: vadi_SignNoteUrl,
                data: JSON.stringify(vadi_viaSignAddendum),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    vadi_viaSignAddendumResponse = JSON.stringify(data.Data);
                    //Test for Failure
                    if (vadi_viaSignAddendumResponse.ErrorOccurred == true) {
                        alert("Error: Unable to sign the addendum using the e-Signature provided.\n\nPlease review the addendum and signers in your Vista/CPRS application!");

                        alert("MORE DETAILS: " + vadi_viaSignAddendumResponse.ErrorMessage);

                    }
                    else {
                        //Update esign fields on form

                        alert("NO ESIGN ERROR..");

                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //System Error
                    alert("Error: Unable to sign the addendum using the e-Signature provided.\n\nPlease review the addendum and signers in your Vista/CPRS application!");
                },
                async: false,
                cache: false
            });
        }
        */

        //Perform standard form updates to signify completion
        //Write Success entry
        Xrm.Page.getAttribute('description').setValue(vadi_noteDescription);
        Xrm.Page.getAttribute('description').setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_integrationstatus').setValue(vadi_integrationStatus);
        Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_integrationerror').setValue(null);
        Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
        Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_addendumnoteid').setValue(vadi_integrationNoteId);
        Xrm.Page.getAttribute('ftp_addendumnoteid').setSubmitMode('always');
        Xrm.Page.getControl('ftp_integrationstatus').setFocus();
        alert('The addendum creation in VistA/CPRS was successful, this addendum will now be marked as completed. \n\nPlease exit this addendum record after clicking OK to this prompt!');
        Xrm.Page.ui.clearFormNotification("SAVEVISTA");
        Xrm.Page.data.entity.save();
    }
    catch (err) {
        alert('Addendum Ribbon Function Error(vadi_finalizeAddendumCreation): ' + err.message);
        Xrm.Page.ui.clearFormNotification("SAVEVISTA");
    }
}