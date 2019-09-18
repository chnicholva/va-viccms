function doPageLoad() {
    if (!!parent._selectedMedDataItem && !!parent._selectedMedDataItem.PopupFields) {
        var table = document.getElementById("popupTable");
        if (!!table) {
            table.innerHTML = "";
            parent._selectedMedDataItem.PopupFields.forEach(
                function (x, i) {
                    if (x != undefined && typeof x != "undefined") {
                        var newRow = table.insertRow(i);
                        var value = x.Value;
                        if (!!x.type && x.type == "datetime") {
                            value = (new Date(x.Value)).toLocaleDateString();
                        }
                        newRow.innerHTML = "<td class='titleColumn'><b>" + x.Label + "</b></td><td class='valueColumn'>" + value + "</td>";
                    }
                }
            );
        }
    }
}