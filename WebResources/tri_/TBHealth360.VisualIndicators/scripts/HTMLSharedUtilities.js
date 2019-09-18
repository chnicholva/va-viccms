//global array to hold querystring data parameters
var _dataparams = [];

//function to extract the encoded parameters from the "data" parameter in the querystring
function parseDataParams() {
    if (location.search != "") {
        var splitqs = location.search.substr(1).split("&");
        for (var j = 0; j < splitqs.length; j++) {
            var kvp = splitqs[j].replace(/\+/g, " ").split("=");
            if (kvp[0].toUpperCase() == "DATA") {
                if (kvp[1] != "") {
                    var rawdatakvps = decodeURIComponent(kvp[1]).split("&");
                    for (var i = 0; i < rawdatakvps.length; i++) {
                        _dataparams[i] = rawdatakvps[i].replace(/\+/g, " ").split("=");
                    }
                }
                break;
            }
        }
    }
}

//function to return a parameter value by name from the global _dataparams array
function getParamVal(paramname) {
    for (var i = 0; i < _dataparams.length; i++) {
        if (paramname.toUpperCase() == _dataparams[i][0].toUpperCase()) {
            var parameter = _dataparams[i][1];
            return parameter.replace('}', '').replace('{', '');
        }
    }
}

function getDateString(inputDate) {
    var workingDate = new Date(inputDate);
    var dteYear = workingDate.getFullYear();
    var dteMonth = (workingDate.getMonth() + 1);
    var dteDay = workingDate.getDate();

    return (dteMonth + "/" + dteDay + "/" + dteYear);
}

function getDateTimeString(inputDate) {
    var workingDate = new Date(inputDate);
    var dteYear = workingDate.getFullYear();
    var dteMonth = (workingDate.getMonth() + 1);
    var dteDay = workingDate.getDate();
    var dteHours = workingDate.getHours();
    var period = " AM";
    if (dteHours > 11) {
        dteHours -= 12;
        period = " PM";
    }

    var dteMinutes = workingDate.getMinutes();
    if (dteMinutes < 10) {
        return (dteMonth + "/" + dteDay + "/" + dteYear + " " + dteHours + ":0" + dteMinutes + period);
    } else {
        return (dteMonth + "/" + dteDay + "/" + dteYear + " " + dteHours + ":" + dteMinutes + period);
    }
}