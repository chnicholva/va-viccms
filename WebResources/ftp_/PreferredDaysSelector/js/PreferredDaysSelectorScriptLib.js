/// <reference path='../../triipcrm_/TR_KU_V2015_2_902/js/jquery.min.js' />

//PreferredDaysSelectorScriptLib.js
//Contains variables and functions used by the PreferredDaysSelector.html page

function pds_formLoad() {
    try {
        var pds_container = $('#pds_checkboxList');

        //Converts option list to checkbox list. 
        var pds_dropdownOptions = parent.Xrm.Page.getAttribute("preferredappointmentdaycode").getOptions();
        var pds_selectedValue = parent.Xrm.Page.getAttribute("tri_preferredday").getValue();

        $(pds_dropdownOptions).each(function (i, e) {
            var pds_optionText = $(this)[0].text;
            var pds_optionValue = $(this)[0].value;
            var pds_isChecked = false;

            if (pds_optionText != '') {
                if (pds_selectedValue != null && pds_selectedValue.indexOf(pds_optionText) != -1) { pds_isChecked = true; }
                $('<input />', { type: 'checkbox', id: 'cb' + pds_optionValue, value: pds_optionText, checked: pds_isChecked }).appendTo(pds_container);
                $('<label />', { 'for': 'cb' + pds_optionValue, text: pds_optionText, title: pds_optionText }).appendTo(pds_container);
                $('<br />').appendTo(pds_container);

                //Add click event
                $('#cb'+pds_optionValue).click(function () {
                    var pds_selectedOption = parent.Xrm.Page.getAttribute("tri_preferredday").getValue();
                    if (this.checked) {
                        if (pds_selectedOption == null) {
                            pds_selectedOption = pds_optionText;
                        }
                        else {
                            pds_selectedOption = pds_selectedOption + ';' + pds_optionText;
                        }
                    }
                    else {
                        var pds_tempSelected = pds_optionText + ";";
                        if (pds_selectedOption.indexOf(pds_tempSelected) != -1) {
                            pds_selectedOption = pds_selectedOption.replace(pds_tempSelected, "");
                        }
                        else {
                            var pds_tempSelected2 = ";" + pds_optionText;
                            if (pds_selectedOption.indexOf(pds_tempSelected2) != -1) {
                                pds_selectedOption = pds_selectedOption.replace(pds_tempSelected2, "");
                            }
                            else {
                                pds_selectedOption = pds_selectedOption.replace(pds_optionText, "");
                            }
                        }
                    }
                    parent.Xrm.Page.getAttribute("tri_preferredday").setValue(pds_selectedOption);
                })
            }
        });
    }
    catch (err) {
        alert('Preferred Days Selector Web Resource Function Error(pds_formLoad): ' + err.message);
    }
}