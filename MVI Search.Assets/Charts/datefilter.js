$("#btnReload").on("click", function () {

    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    window.parent.reloadChartSource("&startDate=" + startDate + "&endDate=" + endDate);
});

$("#startDate").keydown(function (e) {
    if (e.keyCode === 13) {
        $("#btnReload").click();
    }
});

$("#endDate").keydown(function (e) {
    if (e.keyCode === 13) {
        $("#btnReload").click();
    }
});

$("#startDate").on("change", function () {
    EnableDisableReloadButton();
});

$("#endDate").on("change", function () {
    EnableDisableReloadButton();
});

function EnableDisableReloadButton() {
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();

    if (startDate.length === 10 && endDate.length === 10) {
        document.getElementById("btnReload").disabled = false;
    }
    else {
        document.getElementById("btnReload").disabled = true;
    }
}