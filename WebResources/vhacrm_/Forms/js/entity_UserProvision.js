function user_OnChange() {
    var userid = Xrm.Page.getAttribute("vhacrm_systemuserid").getValue();

    if (userid) {
        SDK.REST.retrieveRecord(
			userid[0].id.toString(),
            "SystemUser",
			"FirstName,LastName,DomainName,InternalEMailAddress",
			null,
			function (data) {
			    Xrm.Page.getAttribute("vhacrm_firstname_text").setValue(data.FirstName);
			    Xrm.Page.getAttribute("vhacrm_lastname_text").setValue(data.LastName);
			    Xrm.Page.getAttribute("vhacrm_name").setValue(data.DomainName);
			    Xrm.Page.getAttribute("vhacrm_emailaddress_text").setValue(data.InternalEMailAddress);
			},
			function (error) {
			    //do nothing
			    alert(error);
			}
		);
    }
}