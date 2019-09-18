/// <reference path="../../JScript/VCCM.MHVHelper.js" />
/// <reference path="../../JScript/VCCM.USDHelper.js" />

var track_popUpData = null,
    _selectedMedDataItem = null;

var testPrescriptionData = { "ErrorOccurred": false, "ErrorMessage": null, "Status": null, "DebugInfo": null, "Data": [{ "Mhv": { "PrescriptionList": [{ "IsRefillable": false, "IsTrackable": true, "PrescriptionId": "4661695", "RefillStatus": "submitted", "RefillRemaining": "3", "RefillSubmitDate": "Tue, 27 Feb 2018 16:57:41 EST", "DispensedDate": "Fri, 23 Feb 2018 00:00:00 EST", "Quantity": "120", "FacilityName": "SLC4", "StationNumber": "991", "PrescriptionNumber": "3636178", "PrescriptionName": "ACETAMINOPHEN 500MG TAB" }], "ErrorOccured": false, "ErrorMessage": null }, "FacilityCode": "991", "FacilityName": "SLC4 TEST LAB", "Fills": [{ "DaysSupplyDispensed": "30", "DispenseDate": "20180223", "QuantityDispensed": "120", "ReleaseDate": "20180223", "Routing": "M" }], "Dosages": [{ "Dose": "500 MG", "RelativeStart": "0", "RelativeStop": "527040", "RouteName": "PO", "Units": "MG", "ScheduleName": "Q6H PRN" }], "LastFilled": "20180223", "LastFilledDate": "0001-01-01T00:00:00", "LocalId": "5520457;O", "MedStatus": "urn:sct:55561003", "MedStatusName": "active", "MedType": "urn:sct:73639000", "Name": "ACETAMINOPHEN 500MG TAB", "Orders": [{ "DaysSupply": "30", "FillCost": ".6", "FillsAllowed": "3", "FillsRemaining": "3", "OrderUid": "urn:va:order:F0E0:943623:17420603", "Ordered": "201801051210", "PharmacistName": "VCCMPHYSICIANONE,FIRST", "PharmacistUid": "urn:va:user:F0E0:59920", "Predecessor": null, "PrescriptionId": "3636178", "ProviderName": "VCCMPHYSICIANONE,FIRST", "ProviderUid": "urn:va:user:F0E0:59920", "QuantityOrdered": "120", "VaRouting": "M" }], "OverallStart": "20180223", "OverallStop": "20190224", "PatientInstruction": "NOT MORE THAN FOUR (4) GRAMS of ACETAMINOPHEN PER DAY (8 TABLETS). COMMENT 01/5/18", "ProductFormName": "TAB", "Products": [], "QualifiedName": "ACETAMINOPHEN 500MG TAB", "Sig": "TAKE ONE TABLET BY MOUTH EVERY SIX (6) HOURS, IF NEEDED NOT MORE THAN FOUR (4) GRAMS OF ACETAMINOPHEN PER DAY (8 TABLETS). COMMENT 01/5/18", "Stopped": "20190224", "Type": "Prescription", "Uid": "urn:va:med:F0E0:943623:17420603", "VaStatus": "ACTIVE", "VaType": "O" }, { "Mhv": { "PrescriptionList": [{ "IsRefillable": false, "IsTrackable": false, "PrescriptionId": "4661696", "RefillStatus": "submitted", "RefillRemaining": "2", "RefillSubmitDate": "Tue, 27 Feb 2018 16:57:41 EST", "DispensedDate": null, "Quantity": "1", "FacilityName": "SLC4", "StationNumber": "991", "PrescriptionNumber": "3636179", "PrescriptionName": "INSULIN SYRINGE 0.5ML LOW DOSE 29G 0.5IN" }], "ErrorOccured": false, "ErrorMessage": null }, "FacilityCode": "660", "FacilityName": "SALT LAKE CITY HCS", "Fills": [{ "DaysSupplyDispensed": "1", "DispenseDate": "20180223", "QuantityDispensed": "1", "ReleaseDate": "", "Routing": "W" }], "Dosages": [{ "Dose": "", "RelativeStart": "0", "RelativeStop": "527040", "RouteName": "SC", "Units": "", "ScheduleName": "2XWEEK" }], "LastFilled": "20180223", "LastFilledDate": "0001-01-01T00:00:00", "LocalId": "5520458;O", "MedStatus": "urn:sct:55561003", "MedStatusName": "active", "MedType": "urn:sct:73639000", "Name": "BD INSULIN 0.5ML 29G 0.5in SYRINGE/NDL", "Orders": [{ "DaysSupply": "1", "FillCost": ".04", "FillsAllowed": "2", "FillsRemaining": "2", "OrderUid": "urn:va:order:F0E0:943623:17420608", "Ordered": "201801051551", "PharmacistName": "VCCMPHYSICIANONE,FIRST", "PharmacistUid": "urn:va:user:F0E0:59920", "Predecessor": null, "PrescriptionId": "3636179", "ProviderName": "VCCMPHYSICIANONE,FIRST", "ProviderUid": "urn:va:user:F0E0:59920", "QuantityOrdered": "1", "VaRouting": "W" }], "OverallStart": "20180223", "OverallStop": "20190224", "PatientInstruction": "", "ProductFormName": "SYRINGE/NDL", "Products": [], "QualifiedName": "BD INSULIN 0.5ML 29G 0.5in SYRINGE/NDL", "Sig": "USE SYRINGE AND NEEDLE(S) UNDER THE SKIN TWO (2) TIMES PER WEEK", "Stopped": "20190224", "Type": "Prescription", "Uid": "urn:va:med:F0E0:943623:17420608", "VaStatus": "ACTIVE", "VaType": "O" }, { "Mhv": { "PrescriptionList": [], "ErrorOccured": false, "ErrorMessage": null }, "FacilityCode": "660", "FacilityName": "SALT LAKE CITY HCS", "Fills": [], "Dosages": [{ "Dose": "850 MG", "RelativeStart": "0", "RelativeStop": "43200", "RouteName": "PO", "Units": "MG", "ScheduleName": "BID W/FOOD (2XDAILY)" }], "LastFilled": null, "LastFilledDate": "0001-01-01T00:00:00", "LocalId": "2394313S;O", "MedStatus": "urn:sct:73425007", "MedStatusName": "not active", "MedType": "urn:sct:73639000", "Name": "METFORMIN HCL 850MG TAB,ORAL", "Orders": [{ "DaysSupply": "30", "FillCost": null, "FillsAllowed": "1", "FillsRemaining": null, "OrderUid": "urn:va:order:F0E0:943623:17420609", "Ordered": "201801051602", "PharmacistName": null, "PharmacistUid": null, "Predecessor": null, "PrescriptionId": null, "ProviderName": "VCCMPHYSICIANONE,FIRST", "ProviderUid": "urn:va:user:F0E0:59920", "QuantityOrdered": "60", "VaRouting": "W" }], "OverallStart": null, "OverallStop": null, "PatientInstruction": "", "ProductFormName": "TAB,ORAL", "Products": [], "QualifiedName": "METFORMIN HCL 850MG TAB,ORAL", "Sig": "TAKE ONE TABLET BY MOUTH TWO (2) TIMES PER DAY, WITH FOOD", "Stopped": null, "Type": "Prescription", "Uid": "urn:va:med:F0E0:943623:17420609", "VaStatus": "PENDING", "VaType": "O" }, { "Mhv": { "PrescriptionList": [{ "IsRefillable": false, "IsTrackable": true, "PrescriptionId": "4661694", "RefillStatus": "submitted", "RefillRemaining": "4", "RefillSubmitDate": "Tue, 27 Feb 2018 16:57:41 EST", "DispensedDate": "Fri, 23 Feb 2018 00:00:00 EST", "Quantity": "160", "FacilityName": "SLC4", "StationNumber": "991", "PrescriptionNumber": "3636177", "PrescriptionName": "ACETAMINOPHEN 160MG/5ML ALC-F LIQUID" }], "ErrorOccured": false, "ErrorMessage": null }, "FacilityCode": "660", "FacilityName": "SALT LAKE CITY HCS", "Fills": [{ "DaysSupplyDispensed": "15", "DispenseDate": "20180205", "QuantityDispensed": "160", "ReleaseDate": "20180223", "Routing": "M" }, { "DaysSupplyDispensed": "15", "DispenseDate": "20180223", "QuantityDispensed": "160", "ReleaseDate": "", "Routing": "M" }], "Dosages": [{ "Dose": "", "RelativeStart": "0", "RelativeStop": "527040", "RouteName": "PO", "Units": "", "ScheduleName": "Q6H" }], "LastFilled": "20180223", "LastFilledDate": "0001-01-01T00:00:00", "LocalId": "5520456;O", "MedStatus": "urn:sct:55561003", "MedStatusName": "active", "MedType": "urn:sct:73639000", "Name": "ACETAMINOPHEN 160MG/5ML LIQUID,ORAL", "Orders": [{ "DaysSupply": "15", "FillCost": "2.08", "FillsAllowed": "5", "FillsRemaining": "4", "OrderUid": "urn:va:order:F0E0:943623:17420693", "Ordered": "201802231441", "PharmacistName": "EDWARDS,DARIAN A", "PharmacistUid": "urn:va:user:F0E0:59953", "Predecessor": null, "PrescriptionId": "3636177", "ProviderName": "VCCMPHYSICIANTWO,SECOND", "ProviderUid": "urn:va:user:F0E0:59921", "QuantityOrdered": "160", "VaRouting": "M" }], "OverallStart": "20180205", "OverallStop": "20190206", "PatientInstruction": "NOT MORE THAN FOUR (4) GRAMS OF ACETAMINOPHEN PER DAY", "ProductFormName": "LIQUID,ORAL", "Products": [], "QualifiedName": "ACETAMINOPHEN 160MG/5ML LIQUID,ORAL", "Sig": "TAKE 1/2 TEASPOONFUL (80 MGS/2.5 MLS) BY MOUTH, DRINK ENTIRE AMOUNT EVERY SIX (6) HOURS NOT MORE THAN FOUR (4) GRAMS OF ACETAMINOPHEN PER DAY", "Stopped": "20190206", "Type": "Prescription", "Uid": "urn:va:med:F0E0:943623:17420693", "VaStatus": "ACTIVE", "VaType": "O" }, { "Mhv": { "PrescriptionList": [{ "IsRefillable": false, "IsTrackable": false, "PrescriptionId": "4661693", "RefillStatus": "submitted", "RefillRemaining": "11", "RefillSubmitDate": "Tue, 27 Feb 2018 16:57:41 EST", "DispensedDate": "Fri, 02 Feb 2018 00:00:00 EST", "Quantity": "5", "FacilityName": "SLC4", "StationNumber": "991", "PrescriptionNumber": "3636176", "PrescriptionName": "LISINOPRIL 5MG TAB" }], "ErrorOccured": false, "ErrorMessage": null }, "FacilityCode": "660", "FacilityName": "SALT LAKE CITY HCS", "Fills": [{ "DaysSupplyDispensed": "10", "DispenseDate": "20180202", "QuantityDispensed": "5", "ReleaseDate": "20180202", "Routing": "M" }], "Dosages": [{ "Dose": "2.5 MG", "RelativeStart": "0", "RelativeStop": "508320", "RouteName": "PO", "Units": "MG", "ScheduleName": "QDAY" }], "LastFilled": "20180202", "LastFilledDate": "0001-01-01T00:00:00", "LocalId": "5520455;O", "MedStatus": "urn:sct:55561003", "MedStatusName": "active", "MedType": "urn:sct:73639000", "Name": "LISINOPRIL 5MG TAB", "Orders": [{ "DaysSupply": "10", "FillCost": ".255", "FillsAllowed": "11", "FillsRemaining": "11", "OrderUid": "urn:va:order:F0E0:943623:17420692", "Ordered": "201802231436", "PharmacistName": "EDWARDS,DARIAN A", "PharmacistUid": "urn:va:user:F0E0:59953", "Predecessor": null, "PrescriptionId": "3636176", "ProviderName": "VCCMPHYSICIANTWO,SECOND", "ProviderUid": "urn:va:user:F0E0:59921", "QuantityOrdered": "5", "VaRouting": "M" }], "OverallStart": "20180202", "OverallStop": "20190121", "PatientInstruction": "", "ProductFormName": "TAB", "Products": [], "QualifiedName": "LISINOPRIL 5MG TAB", "Sig": "TAKE ONE-HALF TABLET BY MOUTH EVERY DAY", "Stopped": "20190121", "Type": "Prescription", "Uid": "urn:va:med:F0E0:943623:17420692", "VaStatus": "ACTIVE", "VaType": "O" }, { "Mhv": { "PrescriptionList": [], "ErrorOccured": false, "ErrorMessage": null }, "FacilityCode": "660", "FacilityName": "SALT LAKE CITY HCS", "Fills": [], "Dosages": [{ "Dose": "150 MG", "RelativeStart": "0", "RelativeStop": "0", "RouteName": "PO", "Units": "MG", "ScheduleName": "BID (2XDAILY)" }], "LastFilled": null, "LastFilledDate": "0001-01-01T00:00:00", "LocalId": "1N;O", "MedStatus": "urn:sct:55561003", "MedStatusName": "active", "MedType": "urn:sct:329505003", "Name": "RANITIDINE HCL 150MG TAB", "Orders": [{ "DaysSupply": null, "FillCost": null, "FillsAllowed": null, "FillsRemaining": null, "OrderUid": "urn:va:order:F0E0:943623:17420465", "Ordered": "201706261122", "PharmacistName": null, "PharmacistUid": null, "Predecessor": null, "PrescriptionId": null, "ProviderName": "VCCMPHYSICIANTWO,SECOND", "ProviderUid": "urn:va:user:F0E0:59921", "QuantityOrdered": null, "VaRouting": null }], "OverallStart": null, "OverallStop": null, "PatientInstruction": null, "ProductFormName": "TAB", "Products": [], "QualifiedName": "RANITIDINE HCL 150MG TAB", "Sig": "TAKE ONE TABLET BY MOUTH TWO (2) TIMES A DAY", "Stopped": null, "Type": "OTC", "Uid": "urn:va:med:F0E0:943623:17420465", "VaStatus": "ACTIVE", "VaType": "N" }, { "Mhv": { "PrescriptionList": [{ "IsRefillable": false, "IsTrackable": false, "PrescriptionId": "4659991", "RefillStatus": "refillinprocess", "RefillRemaining": "1", "RefillSubmitDate": "Thu, 22 Feb 2018 15:59:49 EST", "DispensedDate": "Thu, 25 Jan 2018 00:00:00 EST", "Quantity": "30", "FacilityName": "SLC4", "StationNumber": "991", "PrescriptionNumber": "3636131", "PrescriptionName": "TRETINOIN 0.01% TOP GEL" }], "ErrorOccured": false, "ErrorMessage": null }, "FacilityCode": "660", "FacilityName": "SALT LAKE CITY HCS", "Fills": [{ "DaysSupplyDispensed": "90", "DispenseDate": "20170626", "QuantityDispensed": "30", "ReleaseDate": "20180125", "Routing": "W" }, { "DaysSupplyDispensed": "90", "DispenseDate": "20180125", "QuantityDispensed": "30", "ReleaseDate": "", "Routing": "M" }, { "DaysSupplyDispensed": "90", "DispenseDate": "20180415", "QuantityDispensed": "30", "ReleaseDate": "", "Routing": "M" }], "Dosages": [{ "Dose": "", "RelativeStart": "0", "RelativeStop": "43200", "RouteName": "", "Units": "", "ScheduleName": "QHS(BEDTIME)" }], "LastFilled": "20180415", "LastFilledDate": "0001-01-01T00:00:00", "LocalId": "5520406;O", "MedStatus": "urn:sct:55561003", "MedStatusName": "active", "MedType": "urn:sct:73639000", "Name": "TRETINOIN 0.01% 15GM GEL,TOP", "Orders": [{ "DaysSupply": "90", "FillCost": "20.73", "FillsAllowed": "3", "FillsRemaining": "1", "OrderUid": "urn:va:order:F0E0:943623:17420464", "Ordered": "201706261113", "PharmacistName": "DAVIS,NANCY E", "PharmacistUid": "urn:va:user:F0E0:59919", "Predecessor": null, "PrescriptionId": "3636131", "ProviderName": "VCCMPHYSICIANTWO,SECOND", "ProviderUid": "urn:va:user:F0E0:59921", "QuantityOrdered": "30", "VaRouting": "W" }], "OverallStart": "20170626", "OverallStop": "20180627", "PatientInstruction": "TAKE AS DIRECTED BY PHYSICIAN", "ProductFormName": "GEL,TOP", "Products": [], "QualifiedName": "TRETINOIN 0.01% 15GM GEL,TOP", "Sig": "APPLY APPLICATION(S) TO THE AFFECTED AREA AT BEDTIME FOR 30 DAYS TAKE AS DIRECTED BY PHYSICIAN", "Stopped": "20180627", "Type": "Prescription", "Uid": "urn:va:med:F0E0:943623:17420464", "VaStatus": "ACTIVE", "VaType": "O" }, { "Mhv": { "PrescriptionList": [{ "IsRefillable": false, "IsTrackable": false, "PrescriptionId": "4659992", "RefillStatus": "submitted", "RefillRemaining": "3", "RefillSubmitDate": "Tue, 27 Feb 2018 16:57:41 EST", "DispensedDate": null, "Quantity": "22", "FacilityName": "SLC4", "StationNumber": "991", "PrescriptionNumber": "3636130", "PrescriptionName": "ZOLMITRIPTAN 2.5MG TAB PKG 6" }], "ErrorOccured": false, "ErrorMessage": null }, "FacilityCode": "660", "FacilityName": "SALT LAKE CITY HCS", "Fills": [{ "DaysSupplyDispensed": "90", "DispenseDate": "20170626", "QuantityDispensed": "22", "ReleaseDate": "", "Routing": "W" }], "Dosages": [{ "Dose": "2.5 MG", "RelativeStart": "0", "RelativeStop": "43200", "RouteName": "PO", "Units": "MG", "ScheduleName": "5XWEEK" }], "LastFilled": "20170626", "LastFilledDate": "0001-01-01T00:00:00", "LocalId": "5520405;O", "MedStatus": "urn:sct:55561003", "MedStatusName": "active", "MedType": "urn:sct:73639000", "Name": "ZOLMITRIPTAN 2.5MG TAB", "Orders": [{ "DaysSupply": "90", "FillCost": "417.12", "FillsAllowed": "3", "FillsRemaining": "3", "OrderUid": "urn:va:order:F0E0:943623:17420463", "Ordered": "201706261110", "PharmacistName": "DAVIS,NANCY E", "PharmacistUid": "urn:va:user:F0E0:59919", "Predecessor": null, "PrescriptionId": "3636130", "ProviderName": "VCCMPHYSICIANTWO,SECOND", "ProviderUid": "urn:va:user:F0E0:59921", "QuantityOrdered": "22", "VaRouting": "W" }], "OverallStart": "20170626", "OverallStop": "20180627", "PatientInstruction": "MAY BE REPEATED AFTER TWO (2) HOURS, BUT NO MORE THEN FOUR (4) DOSES WITHIN 24 HOUR PERIOD.", "ProductFormName": "TAB", "Products": [], "QualifiedName": "ZOLMITRIPTAN 2.5MG TAB", "Sig": "TAKE ONE TABLET BY MOUTH FIVE (5) TIMES PER WEEK FOR 30 DAYS MAY BE REPEATED AFTER TWO (2) HOURS, BUT NO MORE THEN FOUR (4) DOSES WITHIN 24 HOUR PERIOD.", "Stopped": "20180627", "Type": "Prescription", "Uid": "urn:va:med:F0E0:943623:17420463", "VaStatus": "ACTIVE", "VaType": "O" }, { "Mhv": { "PrescriptionList": [{ "IsRefillable": false, "IsTrackable": false, "PrescriptionId": "4659990", "RefillStatus": "refillinprocess", "RefillRemaining": "1", "RefillSubmitDate": "", "DispensedDate": "Thu, 25 Jan 2018 00:00:00 EST", "Quantity": "30", "FacilityName": "SLC4", "StationNumber": "991", "PrescriptionNumber": "3636129", "PrescriptionName": "METFORMIN HCL 500MG SA TAB" }], "ErrorOccured": false, "ErrorMessage": null }, "FacilityCode": "660", "FacilityName": "SALT LAKE CITY HCS", "Fills": [{ "DaysSupplyDispensed": "90", "DispenseDate": "20170626", "QuantityDispensed": "30", "ReleaseDate": "20180125", "Routing": "W" }, { "DaysSupplyDispensed": "90", "DispenseDate": "20180125", "QuantityDispensed": "30", "ReleaseDate": "", "Routing": "M" }, { "DaysSupplyDispensed": "90", "DispenseDate": "20180415", "QuantityDispensed": "30", "ReleaseDate": "", "Routing": "M" }], "Dosages": [{ "Dose": "", "RelativeStart": "0", "RelativeStop": "43200", "RouteName": "PO", "Units": "", "ScheduleName": "QPM(EVENING)" }], "LastFilled": "20180415", "LastFilledDate": "0001-01-01T00:00:00", "LocalId": "5520404;O", "MedStatus": "urn:sct:55561003", "MedStatusName": "active", "MedType": "urn:sct:73639000", "Name": "METFORMIN HCL 500MG TAB,SA", "Orders": [{ "DaysSupply": "90", "FillCost": "1.71", "FillsAllowed": "3", "FillsRemaining": "1", "OrderUid": "urn:va:order:F0E0:943623:17420462", "Ordered": "201706261107", "PharmacistName": "DAVIS,NANCY E", "PharmacistUid": "urn:va:user:F0E0:59919", "Predecessor": null, "PrescriptionId": "3636129", "ProviderName": "VCCMPHYSICIANTWO,SECOND", "ProviderUid": "urn:va:user:F0E0:59921", "QuantityOrdered": "30", "VaRouting": "W" }], "OverallStart": "20170626", "OverallStop": "20180627", "PatientInstruction": "TAKE WITH EVENING MEAL", "ProductFormName": "TAB,SA", "Products": [], "QualifiedName": "METFORMIN HCL 500MG TAB,SA", "Sig": "TAKE 1 BY MOUTH EVERY EVENING FOR 30 DAYS TAKE WITH EVENING MEAL", "Stopped": "20180627", "Type": "Prescription", "Uid": "urn:va:med:F0E0:943623:17420462", "VaStatus": "ACTIVE", "VaType": "O" }, { "Mhv": { "PrescriptionList": [], "ErrorOccured": false, "ErrorMessage": null }, "FacilityCode": "660", "FacilityName": "SALT LAKE CITY HCS", "Fills": [{ "DaysSupplyDispensed": "30", "DispenseDate": "20170615", "QuantityDispensed": "15", "ReleaseDate": "", "Routing": "W" }, { "DaysSupplyDispensed": "30", "DispenseDate": "20180125", "QuantityDispensed": "15", "ReleaseDate": "", "Routing": "M" }], "Dosages": [{ "Dose": "50 MG", "RelativeStart": "0", "RelativeStop": "43200", "RouteName": "PO", "Units": "MG", "ScheduleName": "QDAY" }], "LastFilled": "20180214", "LastFilledDate": "0001-01-01T00:00:00", "LocalId": "5520395;O", "MedStatus": "urn:sct:73425007", "MedStatusName": "not active", "MedType": "urn:sct:73639000", "Name": "LOSARTAN POTASSIUM 100MG TAB", "Orders": [{ "DaysSupply": "30", "FillCost": "3.6", "FillsAllowed": "11", "FillsRemaining": "10", "OrderUid": "urn:va:order:F0E0:943623:17420448", "Ordered": "201706150914", "PharmacistName": "DAVIS,NANCY E", "PharmacistUid": "urn:va:user:F0E0:59919", "Predecessor": null, "PrescriptionId": "3636120", "ProviderName": "VCCMPHYSICIANONE,FIRST", "ProviderUid": "urn:va:user:F0E0:59920", "QuantityOrdered": "15", "VaRouting": "W" }], "OverallStart": "20170615", "OverallStop": "20180616", "PatientInstruction": "TAKE AS DIRECTED ", "ProductFormName": "TAB", "Products": [], "QualifiedName": "LOSARTAN POTASSIUM 100MG TAB", "Sig": "TAKE ONE-HALF TABLET BY MOUTH EVERY DAY FOR 30 DAYS TAKE AS DIRECTED", "Stopped": "201802231453", "Type": "Prescription", "Uid": "urn:va:med:F0E0:943623:17420448", "VaStatus": "DISCONTINUED", "VaType": "O" }, { "Mhv": { "PrescriptionList": [], "ErrorOccured": false, "ErrorMessage": null }, "FacilityCode": "660", "FacilityName": "SALT LAKE CITY HCS", "Fills": [{ "DaysSupplyDispensed": "30", "DispenseDate": "20170615", "QuantityDispensed": "30", "ReleaseDate": "", "Routing": "W" }], "Dosages": [{ "Dose": "", "RelativeStart": "0", "RelativeStop": "15840", "RouteName": "PO", "Units": "", "ScheduleName": "QPM(EVENING)" }], "LastFilled": "20170615", "LastFilledDate": "0001-01-01T00:00:00", "LocalId": "5520394;O", "MedStatus": "urn:sct:73425007", "MedStatusName": "not active", "MedType": "urn:sct:73639000", "Name": "METFORMIN HCL 500MG TAB,SA", "Orders": [{ "DaysSupply": "30", "FillCost": "1.71", "FillsAllowed": "11", "FillsRemaining": "11", "OrderUid": "urn:va:order:F0E0:943623:17420447", "Ordered": "201706150911", "PharmacistName": "DAVIS,NANCY E", "PharmacistUid": "urn:va:user:F0E0:59919", "Predecessor": null, "PrescriptionId": "3636119", "ProviderName": "VCCMPHYSICIANONE,FIRST", "ProviderUid": "urn:va:user:F0E0:59920", "QuantityOrdered": "30", "VaRouting": "W" }], "OverallStart": "20170615", "OverallStop": "20180616", "PatientInstruction": "TAKE WITH EVENING MEAL", "ProductFormName": "TAB,SA", "Products": [], "QualifiedName": "METFORMIN HCL 500MG TAB,SA", "Sig": "TAKE AS DIRECTED BY MOUTH EVERY EVENING TAKE WITH EVENING MEAL", "Stopped": "20170626", "Type": "Prescription", "Uid": "urn:va:med:F0E0:943623:17420447", "VaStatus": "DISCONTINUED", "VaType": "O" }] };
var configData = null,
    _settings = null,
    _veteran = null;
    //_medsFromCRM = [];
var gridColumns = [
    { field: "IsRefillable", VA: "isRefillable", VAPath: "Mhv.PrescriptionList[0].IsRefillable", type: "boolean", hidden: true },
    { field: "RefillButton",
        VAPath: null,
        title: " ",
        type: "button",
        template: function(pDataItem){
            return "<input type='button' value='Refill'"
                + (pDataItem.IsRefillable ?  " title='Submit a refill for this prescription to MyHealtheVet.'" : " title='This prescription is not refillable at this time.'")
                + " class='CrmButton' onclick='refillButtonClick(this);' "
                + (pDataItem.IsRefillable ? "" : "disabled='disabled'")
                + "/>";
        },
        headerTeamplate: "",
        groupable: false,
        sortable: false,
        filterable: false
    },
    { field: "IsTrackable", VA: "isTrackable", VAPath: "Mhv.PrescriptionList[0].IsTrackable", type: "boolean", hidden: true },
    {
        field: "TrackButton",
        VAPath: null,
        title: " ",
        type: "button",
        template: function (pDataItem) {
            return "<input type='button' value='Track'"
                + (pDataItem.IsTrackable ? " title='Track the submitted refill for this prescription.'" : " title='This prescription is not trackable at this time.'")
                + " class='CrmButton' onclick='trackButtonClick(this);' "
                + (pDataItem.IsTrackable ? "" : "disabled='disabled'")
                + "/>";
        },
        headerTeamplate: "",
        groupable: false,
        sortable: false,
        filterable: false
    },
    { field: "PrescriptionId", VA: "prescriptionId", VAPath: "Mhv.PrescriptionList[0].PrescriptionId", hidden: true, type: "string" },/*this is the internal ID?, not the same as the rxnumber*/
    { field: "PrescriptionNumber", title: "Rx Number", VA: "prescriptionNumber", VAPath: "Mhv.PrescriptionList[0].PrescriptionNumber", showInPopup: true, popupOrder: 1, type:"string" },
    {
        field: "Name",
        title: "Med Name",
        VA: "prescriptionName",
        VAPath: "Mhv.PrescriptionList[0].PrescriptionName",
        template: function (pDataItem) {
            return "<a href='#' onclick='return infoAnchorClick(this);'><i class='glyphicon glyphicon-info-sign'></i></a> " + pDataItem.Name;
        },
        showInPopup: true,
        popupOrder: 2,
        type: "string"
    },
    {
        field: "RefillStatus",
        title: "Refill Status",
        VA: "refillStatus",
        VAPath: "Mhv.PrescriptionList[0].RefillStatus",
        template: function (pDataItem) {
            return "<span " +
                        "style='cursor:" + VCCM.MHVHelper.GetRefillStatusCursor(pDataItem.RefillStatus) + "' " +
                        "title='" + VCCM.MHVHelper.GetRefillStatusTooltip(pDataItem.RefillStatus) + "'" +
                    "'>" +
                        VCCM.MHVHelper.GetRefillStatusLabel(pDataItem.RefillStatus)
                    "</span>";
            
        },
        type: "string"
    },
    {
        field: "FillsRemaining",
        title: "Refills Left",
        VA: "refillRemaining",
        VAPath: "Mhv.PrescriptionList[0].RefillRemaining",
        template: function (pDataItem) {
            return "<span " +
                        "style='cursor:" + VCCM.MHVHelper.GetRefillStatusCursor(pDataItem.RefillStatus) + "' " +
                        "title='" + VCCM.MHVHelper.GetRefillStatusTooltip(pDataItem.RefillStatus) + "'" +
                    "'>" +
                        pDataItem.FillsRemaining +
                    "</span>";
        },
        type: "number"
    },
    {
        field: "RefillSubmitDate",
        title: "Refill Submitted On",
        VA: "refillSubmitDate",
        VAPath: "Mhv.PrescriptionList[0].RefillSubmitDate",
        template: function (pDataItem) {
            return !!pDataItem.RefillSubmitDate ? (new Date(pDataItem.RefillSubmitDate)).toLocaleDateString() : "";
        },
        type: "datetime"
    },
    {
        field: "LastOrdered",
        title: "Dispensed Date",
        VA: "dispensedDate",
        VAPath: "Mhv.PrescriptionList[0].DispensedDate",
        template: function (pDataItem) {
            return !!pDataItem.LastOrdered ? (new Date(pDataItem.LastOrdered)).toLocaleDateString() : "";
        },
        showInPopup: true,
        popupOrder: 3,
        type: "datetime",
        hidden: true 
    },
    { field: "Quantity", title: "Quantity", VA: "quantity", VAPath: "Mhv.PrescriptionList[0].Quantity", showInPopup: true, popupOrder: 7, type: "number" },
    { field: "FacilityName", title: "Facility", VA: "facilityName", VAPath: "Mhv.PrescriptionList[0].FacilityName", hidden: true, type: "string" },
    { field: "StationNumber", title: "Station Number", VA: "stationNumber", VAPath: "Mhv.PrescriptionList[0].StationNumber", hidden: true, type: "string" },
    { field: "ConcatenatedFacility", title: "Facility", template: function (pDataItem) { return pDataItem.StationNumber + "-" + pDataItem.FacilityName; }, type: "string" },
    { field: "PatientInstruction", title: "Instructions", hidden: true, VA: "PatientInstruction", VAPath: "PatientInstruction", showInPopup: true, popupOrder: 4, type: "string" },
    { field: "ProviderName", title: "Provider Name", hidden: true, VA: "ProviderName", VAPath: "Orders[0].ProviderName", showInPopup: true, popupOrder: 5, type: "string" },
    { field: "DaysSupply", title: "Days Supply", hidden: true, VA: "DaysSupply", VAPath: "Orders[0].DaysSupply", showInPopup: true, popupOrder: 6, type: "number" }
];

$(document).ready(function () {
    doPageLoad();
});

function doPageLoad() {
    showLoadingMessage("Loading prescriptions from MyHealtheVet...");

    //load test data in AWS environment
    if (location.href.indexOf("https://internalcrmhec.crmdevcloud.com/VCCMDEV") > -1) {
        setTimeout(
            function () {
                $("#testDataMessageDiv").show();
                processCombinedMedicationResponse(testPrescriptionData);
            },
            500
        );
    }
    else {
        try {
            configData = parseDataParametersFromUrl(location.search);
            findActiveSettings(findMHVSessionToken, queryMHVMedicationAPI);
        }
        catch (err) {
            //Display Error....
            alert("Document ready error: " + err.message);
        }
    }
}

function findActiveSettings(pCallbackFunction, pCallbackFunction2) {
    //get the Active Settings record from either the parent request form or directly from CRM
    if (!!_settings) {
        if (typeof pCallbackFunction == "function") { pCallbackFunction(pCallbackFunction2); }
    }
    else {
        if (!!parent._retrievedSettings) {
            _settings = parent._retrievedSettings;
            if (typeof pCallbackFunction == "function") { pCallbackFunction(pCallbackFunction2); }
        }
        else {
            var queryString = "$select=*&$filter=mcs_name eq 'Active Settings'";
            try{
                SDK.REST.retrieveMultipleRecords(
                    "mcs_setting",
                    queryString,
                    function (retrievedRecords) {
                        if (typeof retrievedRecords != "undefined" && !!retrievedRecords && retrievedRecords.length == 1) _settings = retrievedRecords[0];
                    },
                    errorHandler,
                    function () {
                        if (!!_settings) {
                            if (typeof pCallbackFunction == "function") { pCallbackFunction(pCallbackFunction2); }
                        }
                    }
                );
            }
            catch (e) {
                showErrorMessage("Error retrieving Active Settings: " + e.message);
            }
        }
    }
}
function findMHVSessionToken(pCallbackFunction, pPassthroughObject) {
    if (!!parent._MHVID) {
        var mhvIdArray = parent._MHVID.split(","); //request form _MHVID variable will be single ID if we've already processed the full list of available MHVIDs, otherwise, it could be a list of one ore more comma-separated IDs
        if (!!_settings && !!_settings.ftp_DACURL && !!_settings.ftp_MHVSessionAPIURL) {
            var passthroughObject = !!pPassthroughObject ? pPassthroughObject : {};
            //this retrieves token and saves it to cookie.
            VCCM.MHVHelper.GetSessionToken(
                _settings.ftp_DACURL + _settings.ftp_MHVSessionAPIURL,
                mhvIdArray,
                pCallbackFunction,
                passthroughObject,
                function (e) {
                    showErrorMessage("The MHV Session API did not return a session token for this veteran's MHV correlation ID.");
                }
            );
        }
        else {
            showErrorMessage("Configuration error: Check the MHV Active Session API value on the Active Settings record.");
        }
    }
    else {
        handleNoAccount();
    }
}
function handleNoAccount() {
    //cannot query any MHV APIs w/o an MHV ID or an MHV session token,
    //which is captured and copied to USD Replacement parameters at end of Veteran Alerts page,
    //and then made available to Request form (here, 'parent') via the form_onLoadWithParameters function
    if (!!!parent._ICN || parent._ICN == "MISSING") {
        $("#noMHVAccountMessage").text("This veteran was not found in MVI, so you cannot submit or track prescription refills via USD.");
        $("#MHVSignupButton").hide();
    }
    showDiv("#noMHVAccountContainer"); //so, prompt for MHV account signup.
}

function btnRefreshGrid_click(pButton) {
    showLoadingMessage("Loading prescriptions from MyHealtheVet...");
    setTimeout(
        function () {
            findMHVSessionToken(queryMHVMedicationAPI);
        },
        1000
    );
}
function queryMHVMedicationAPI(pMHVObject, pPassthroughObject) {
    if (!!_settings && !!_settings.ftp_DACURL && !!_settings.ftp_MedicationCombinedAPIURL) {
        showLoadingMessage("Loading prescriptions from MyHealtheVet...");
        VCCM.MHVHelper.RetrieveCombinedMedicationList(
        //VCCM.MHVHelper.RetrieveActivePrescriptions(
            _settings.ftp_DACURL + _settings.ftp_MedicationCombinedAPIURL,
            pMHVObject.Token,
            parent._ICN,
            "3.0",
            "FtPCRM",
            function (pResponse) {
                if (!!pResponse) {
                    processCombinedMedicationResponse(pResponse);
                }
                else {
                    showErrorMessage("No respone from MHV Active Prescriptions API.");
                }
            },
            function (e) {
                showErrorMessage("Error querying MHV Active Prescriptions API: " + e.message);
            }
        );
    }
    else {
        showErrorMessage("Configuration error: Check the Medication Combined API URL value on the Active Settings record.");
    }
}
function processCombinedMedicationResponse(pResponse) {
    if (pResponse.ErrorOccurred == false) {
        medsFromMHV = [];
        //combined medication api response schema: Response { Data: [ { Mhv: { PrescriptionList: [] } } ] }
        var retrievedMedications = getDeepProperty("Data", pResponse);
        if (!!retrievedMedications && Array.isArray(retrievedMedications) && retrievedMedications.length > 0) {
            for (var i = 0; i < retrievedMedications.length; i++) {
                var thisMedicationFromAPI = retrievedMedications[i];
                var thisMedicationsMHVPrescriptionList = getDeepProperty("Mhv.PrescriptionList", thisMedicationFromAPI);
                if (!!thisMedicationsMHVPrescriptionList && Array.isArray(thisMedicationsMHVPrescriptionList) && thisMedicationsMHVPrescriptionList.length > 0) {
                    var newMedObj = { PopupFields: [] };
                    for (var j = 0; j < gridColumns.length; j++) {
                        if (gridColumns[j].type != "button") {
                            var columnValue = getDeepProperty(gridColumns[j].VAPath, thisMedicationFromAPI);
                            newMedObj[gridColumns[j].field] = columnValue;
                            if (gridColumns[j].showInPopup == true) {
                                newMedObj.PopupFields[gridColumns[j].popupOrder - 1] = { Label: gridColumns[j].title, Value: columnValue, type: gridColumns[j].type };
                            }
                        }
                    }
                    medsFromMHV.push(newMedObj);
                }
            }
        }
        renderMedications(medsFromMHV);
    }
    else {
        showErrorMessage("Error querying Medication Combined API: " + pResponse.ErrorMessage);
    }
}
function renderMedications(pData) {
    try{
        if (!!pData && Array.isArray(pData)) {
            var medicationGrid = $("#medicationGridDiv").kendoGrid({
                columns: gridColumns,
                sortable: true,
                editable: false,
                resizable: true,
                navigatable: true,
                noRecords: {
                    template: "No refillable medications found in MHV."
                },
                scrollable: false,
                pageable: {
                    pageSize: 4
                },
                dataSource: pData,
                dataBound: function (e) {
                    //tbd
                }
            });
            showDiv("#MedicationPickerContainer");
        }
        else {
            showErrorMessage("Error rendering medications on grid: Empty data array for Kendo grid.");
        }
    }
    catch (e) {
        showErrorMessage("Error rendering medications on grid: " + e.message);
    }
}

function MHVSignupButtonClick() {
    //alert("As of 1/18/18, MHV Registration is not yet implemented!");
    VCCM.USDHelper.CopyDataToReplacementParameters("MHV", ["RegistrationAPIURL=" + _settings.ftp_DACURL + _settings.ftp_MHVRegistrationAPIURL], false);
    VCCM.USDHelper.OpenUSDURL("http://event?eventname=MHVRegistrationButtonClicked");
}

function refillButtonClick(pButton) {
    var thisRow = $(pButton).closest("tr");
    var medicationGrid = $('#medicationGridDiv').data('kendoGrid');
    var medDataItem = medicationGrid.dataItem(thisRow);

    findMHVSessionToken(submitRefill, medDataItem);
}
function submitRefill(pMHVObject, pMedDataItem) {
    if (!!pMedDataItem.PrescriptionId) {
        if (!!_settings && !!_settings.ftp_DACURL && !!_settings.ftp_MHVRefillAPIURL) {
            if (!!pMHVObject && !!pMHVObject.Token) {
                parent.Xrm.Page.ui.setFormNotification("Submitting prescription refill to MyHealtheVet...", "INFO", "refill_" + pMedDataItem.PrescriptionId);
                VCCM.MHVHelper.SubmitPrescriptionRefill(
                    _settings.ftp_DACURL + _settings.ftp_MHVRefillAPIURL,
                    pMHVObject.Token,
                    pMedDataItem.PrescriptionId.toString(),
                    function (pResponse) {
                        if (!!pResponse) {
                            var msg = "Submitted refill for " + pMedDataItem.Name + ". MyHealtheVet updates refill data overnight, so this prescription's status and count of remaining refills may not change until tomorrow at the earliest.";
                            parent.Xrm.Utility.alertDialog(msg, function () {
                                parent.Xrm.Page.ui.setFormNotification(msg, "INFO", "refill_" + pMedDataItem.PrescriptionId);
                            });
                        }
                        else {
                            alert("No respone from MHV Refill API.");
                        }
                    },
                    function (e) {
                        alert("Error submitting refill: " + e.message);
                    }
                );
            }
            else {
                alert("No MHV Session Token is available to submit this prescription to MyHealtheVet for refill");
            }
        }
        else {
            alert("Configuration error: Check the MHV Refill API value on the Active Settings record.");
        }
    }
    else {
        alert("Missing prescription ID.");
    }
}

function trackButtonClick(pButton) {
    var thisRow = $(pButton).closest("tr");
    var medicationGrid = $('#medicationGridDiv').data('kendoGrid');
    var medDataItem = medicationGrid.dataItem(thisRow);

    findMHVSessionToken(getTrackingInfo, medDataItem);
}
function getTrackingInfo(pMHVObject, pMedDataItem) {
    if (!!pMedDataItem.PrescriptionId) {
        if (!!_settings && !!_settings.ftp_DACURL && !!_settings.ftp_MHVTrackingAPIURL) {
            if (!!pMHVObject && !!pMHVObject.Token) {
                VCCM.MHVHelper.TrackPrescription(
                    _settings.ftp_DACURL + _settings.ftp_MHVTrackingAPIURL,
                    pMHVObject.Token,
                    pMedDataItem.PrescriptionId.toString(),
                    function (pResponse) {
                        if (!!pResponse) {
                            var track_context = GetGlobalContext();
                            var track_serverUrl = track_context.getClientUrl();
                            track_popUpData = pResponse;
                            //construct pop-up
                            var kendoTrackingPopUp = $("#trackingPopUp");
                            var kendoPopUpTitle = "Track Prescription";
                            var kendoPopUpUrl = track_serverUrl +  "/WebResources/ftp_/Request/MHVPrescriptionTracker.html";
                            if (typeof kendoTrackingPopUp != 'undefined' && kendoTrackingPopUp != null) {
                                kendoTrackingPopUp.kendoWindow({
                                    width: "60%",
                                    modal: true,
                                    height: "40%",
                                    iframe: true,
                                    resizable: true,
                                    title: kendoPopUpTitle,
                                    content: kendoPopUpUrl,
                                    visible: false,
                                    position: {
                                        top: "10px",
                                        left: "100px"
                                    }
                                });
                                var trackingPopUpWindow = $("#trackingPopUp").data('kendoWindow');
                                trackingPopUpWindow.open();
                            }
                        }
                        else {
                            alert("No respone from MHV Tracking API.");
                        }
                    },
                    function (e) {
                        alert("Error from MHV Tracking API: " + e.message);
                    }
                );
            }
            else {
                alert("No MHV Session Token is available to track this prescription's refill in MyHealtheVet.");
            }
        }
        else {
            alert("Configuration error: Check the MHV Tracking API value on the Active Settings record.");
        }
    }
    else {
        alert("Missing prescription ID.");
    }
}

function infoAnchorClick(pElement) {
    var thisRow = $(pElement).closest("tr");
    var medicationGrid = $('#medicationGridDiv').data('kendoGrid');
    var medDataItem = medicationGrid.dataItem(thisRow);
    _selectedMedDataItem = medDataItem;
    //construct pop-up
    var infoPopupDiv = $("#infoPopup");
    if (typeof infoPopupDiv != 'undefined' && infoPopupDiv != null) {
        infoPopupDiv.kendoWindow({
            modal: true,
            //minWidth: 275,
            //minHeight: 400,
            width: "50%",            
            height: "80%",
            iframe: true,
            draggable: true,
            resizable: true,
            title: "Additional Info",
            content: VCCM.MHVHelper._getServerUrl() + "/WebResources/ftp_/Request/MHVMedicationRefillGridInfoPopup.html",
            visible: false,
            position: {
                top: "5%",
                left: "25%"
            }
        });
        var infoPopup = $("#infoPopup").data('kendoWindow');
        infoPopup.open();

        $(document).on("click", ".k-overlay", function () {
            infoPopup.close();
        });
    }
    return false;
}


/*helper functions*/
function parseDataParametersFromUrl(pQueryString) {
    //example query string (unencoded): contactid={32CA1B55-DC81-E611-9445-0050568D743D}&fullname=TIFINKLE, ANDREW&sensitivity=true&IsUSD=true
    var fullParameterArray = pQueryString.substr(1).split("&");

    //clean up the URL query string and split each member into a key/value pair
    for (var i in fullParameterArray) {
        fullParameterArray[i] = fullParameterArray[i].replace(/\+/g, " ").split("=");
    }

    var fullObject = {};
    for (var i in fullParameterArray) {
        var thisParameterName = fullParameterArray[i][0];
        var thisParameterValue = fullParameterArray[i][1];
        fullObject[thisParameterName] = thisParameterValue;
        if (thisParameterName.toLowerCase() == "data") {
            var dataObject = {};
            var customDataArray = decodeURIComponent(thisParameterValue).split("&");
            for (var j in customDataArray) {
                customDataArray[j] = customDataArray[j].replace(/\+/g, " ").split("=");
                dataObject[customDataArray[j][0]] = customDataArray[j][1];
            }
            fullObject[thisParameterName] = dataObject;
        }
    }
    return fullObject;
}
function errorHandler(error) {
    alert(error.message);
}
function getDeepProperty(pPath, pObject) {
    if (!!pPath) {
        var pathAsArray = pPath.split(".");
        var returnObj = !!pObject ? pObject : window[pathAsArray.shift()];
        if (typeof returnObj != "undefined") {
            while (!!returnObj && pathAsArray.length > 0) {
                var nextLevel = pathAsArray.shift();
                var isArrayQuery = nextLevel.indexOf("[") > -1 && nextLevel.indexOf("]") == nextLevel.indexOf("[") + 2;
                var nextLevelName = !isArrayQuery ? nextLevel : nextLevel.split("[")[0];
                var nextLevelArrayMember = !isArrayQuery ? null : parseInt((nextLevel.split("[")[1]).substr(0, (nextLevel.split("[")[1].length)));

                returnObj = isArrayQuery ? returnObj[nextLevelName][nextLevelArrayMember] : returnObj[nextLevelName];

            }
            return returnObj;
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
function ArrayIndexOfObjectByAttribute(pArray, pAttr, pValue) {
    for (var i = 0; i < pArray.length; i += 1) {
        if (pArray[i][pAttr] === pValue) {
            return i;
        }
    }
    return -1;
}
function getDeepProperty(pPath, pObject) {
    if (!!pPath) {
        var pathAsArray = pPath.split(".");
        var returnObj = !!pObject ? pObject : window[pathAsArray.shift()];
        if (typeof returnObj != "undefined") {
            while (!!returnObj && pathAsArray.length > 0) {
                var nextLevel = pathAsArray.shift();
                var isArrayQuery = nextLevel.indexOf("[") > -1 && nextLevel.indexOf("]") == nextLevel.indexOf("[") + 2;
                var nextLevelName = !isArrayQuery ? nextLevel : nextLevel.split("[")[0];
                var nextLevelArrayMember = !isArrayQuery ? null : parseInt((nextLevel.split("[")[1]).substr(0,(nextLevel.split("[")[1].length)));

                returnObj = isArrayQuery ? returnObj[nextLevelName][nextLevelArrayMember] : returnObj[nextLevelName];
                
            }
            return returnObj;
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
function showLoadingMessage(pMessage) {
    $("#progressText").html(pMessage);
    showDiv("#loadingGifDiv");
}
function showErrorMessage(pMessage) {
    $("#errorText").html(pMessage);
    showDiv("#errorContainer");
}
function showDiv(pDivToShow) {
    var knownDivs = [
		"#loadingGifDiv",
		"#errorContainer",
		"#MedicationPickerContainer",
        "#newRecordMessageContainer",
        "#noMHVAccountContainer"
    ];
    for (var d = 0; d < knownDivs.length; d++) {
        if (knownDivs[d] == pDivToShow) {
            $(knownDivs[d]).show();
        }
        else {
            $(knownDivs[d]).hide();
        }
    }
}