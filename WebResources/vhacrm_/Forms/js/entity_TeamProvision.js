function team_OnChange() {
    var teamid = Xrm.Page.getAttribute("vhacrm_teamid").getValue();

    if (teamid) {
        SDK.REST.retrieveRecord(
			teamid[0].id.toString(),
            "Team",
			"Name,AdministratorId,BusinessUnitId,TeamType,EMailAddress",
			null,
			function (data) {
			    Xrm.Page.getAttribute("vhacrm_name").setValue(data.Name);
			    Xrm.Page.getAttribute("vhacrm_emailaddress_text").setValue(data.EMailAddress);
				Xrm.Page.getAttribute("vhacrm_teamtype_code").setValue(data.TeamType.Value);
				
				var admin = [];
				admin[0] = {};
				admin[0].id = data.AdministratorId.Id;
				admin[0].name = data.AdministratorId.Name;
				admin[0].entityType = data.AdministratorId.LogicalName;			
			    Xrm.Page.getAttribute("vhacrm_systemuserid").setValue(admin);
				
				var businessunit = [];
				businessunit[0] = {};
				businessunit[0].id = data.BusinessUnitId.Id;
				businessunit[0].name = data.BusinessUnitId.Name;
				businessunit[0].entityType = data.BusinessUnitId.LogicalName;				
			    Xrm.Page.getAttribute("vhacrm_businessunitid").setValue(businessunit);
			},
			function (error) {
			    //do nothing
			    alert(error);
			}
		);
    }
}