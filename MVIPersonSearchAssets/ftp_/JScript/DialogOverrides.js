function assignSelectedRecord(e) {
    debugger
    var i = {
        width: 460,
        height: 250,
        position: 1
    };
    var a = {};
    a["entity_name"] = "incident";
    a["selected_records_count"] = "1";
    a["entity_id"] = e;
    a["show_assign_to_me_option"] = !0;
    Xrm.Navigation.openDialog("AssignQueue", i, a).then(function (e) {
        Xrm.Page.data.refresh().then(function () {
            Xrm.Page.ui.refreshRibbon();
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
}