function itemClicked(commandProperties)
{
debugger;
// Determine which button was clicked in the menu 

//alert(commandProperties.SourceControlId+ ' clicked'); 

	var vlc_ViaLoginCookie = vlcx_getCookie("viasessionlink");
	var vlc_ViaLoginData = null;

	if (vlc_ViaLoginCookie != "")
		vlc_ViaLoginData = JSON.parse(vlc_ViaLoginCookie);	
	
	//loop thru cookies until we get a match on siteid
	if (vlc_ViaLoginData != null){
		if (vlc_ViaLoginData.length > 0){
			for(var i = 0; i < vlc_ViaLoginData.length; i++){
				if (vlc_ViaLoginData[i].siteCode == commandProperties.SourceControlId){
					//forward this obj
					//alert(vlc_ViaLoginData[i].siteCode);
					vcmn_ribbonButtonSaveToVistA(vlc_ViaLoginData[i]);
				}
			}
		}			
	}
}

 

function populateDynamicMenu(commandProperties) {
        //debugger;
        dynamicXML = " ";
 

//working with a string storing JSON
    var text = '{ "name": "John", "facility": "Franklins BBQ"}';
                 
    var obj = JSON.parse(text);
    var value = 1;

 
	var vlc_ViaLoginCookie = vlcx_getCookie("viasessionlink");
	var vlc_ViaLoginData = null;

	if (vlc_ViaLoginCookie != "")
		vlc_ViaLoginData = JSON.parse(vlc_ViaLoginCookie);		
 
	if (vlc_ViaLoginData == null){
		//alert
		return;
	}
	
	if (vlc_ViaLoginData.length == 0){
		//alert
		return;
	}

dynamicXML += "<Menu>";

	for(var i = 0; i < vlc_ViaLoginData.length; i++){
		var code = vlc_ViaLoginData[i].siteCode;
     dynamicXML += "<MenuSection Id='vccm.vistaNote.Save.MenuSection." + code + 
        "' Sequence='10'><Controls Id='vccm.vistaNote.Save.Control." + code + 
        "'><Button Id='" + code + 
        "' Command='vccm.ftp_progressnote.VistaNote.itemClicked' CommandValueId='"+code+ 
        "' Sequence='30' LabelText='" + vlc_ViaLoginData[i].siteName+"' /></Controls></MenuSection>"; 		
	}
dynamicXML += "</Menu>";
/*
     dynamicXML += "<Menu><MenuSection Id='vccm.vistaNote.Save.MenuSection." + value + 
        "' Sequence='10'><Controls Id='vccm.vistaNote.Save.Control." + value + 
        "'><Button Id='vccm.vistaNote." + value + 
        "' Command='vccm.ftp_progressnote.VistaNote.itemClicked' CommandValueId='"+value+ 
        "' Sequence='30' LabelText='" + vlc_ViaLoginData[0].siteName+"' /></Controls></MenuSection></Menu>"; 
 */
      commandProperties["PopulationXML"] = '' + dynamicXML +'';

}

function vlcx_getCookie(cname) {
//debugger;
    try {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }
        return "";
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_getCookie): ' + err.message);
    }	
/*
    try {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }
        return "";
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_getCookie): ' + err.message);
    }
*/
}