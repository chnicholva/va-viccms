Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Millist üksust soovite konfigureerida?", 
	    "data": [
			{ 
			    "title": "Hostitud juhtelemendid", 
			    "descr": "Looge ja hallake hostitud juhtelemente. Hostitud juhtelemendid on peamised elemendid, mida kasutatakse rakenduste loomiseks lahendusega Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Tööriistaribad", 
			    "descr": "Looge ja hallake lahenduse Unified Service Desk tööriistaribasid ning nuppe. Tööriistaribad sisaldavad piltide ja tekstiga nuppe, nuppe kasutatakse toimingute käivitamiseks.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Toimingu kutsumised", 
			    "descr": "Looge ja hallake lahenduse Unified Service Desk toimingu kutsumisi. Toimingu kutsumisi saab lisada tööriistariba nuppudele, sündmustele, akna navigeerimisreeglitele ja agendiskriptidele.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Sündmused", 
			    "descr": "Looge ja hallake sündmusi. Sündmused on teatised, mille hostitud juhtelement käivitab näitamaks rakendusele, et midagi toimub.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Olemi otsingud", 
			    "descr": "Looge ja hallake olemi otsinguid. Olemi otsingud esitavad CRM-i veebiteenustele andmete tagastamiseks päringu.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Akna navigeerimisreeglid", 
			    "descr": "Looge ja hallake akna navigeerimisreegleid. Akna navigeerimisreeglid määratlevad lahenduses Unified Service Desk erinevate juhtelementide vahelise suhte.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Seansi read", 
			    "descr": "Looge ja hallake seansi ridu. Seansi read määratlevad lahenduses Unified Service Desk seansi nime ja seansi ülevaateteabe.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Agendi skriptid", 
		       "descr": "Looge ja hallake agendi skripti tööülesandeid ja vastuseid. Agendiskriptid pakuvad agentidele suuniseid selle kohta, mida nad peaksid telefonikõnedes ütlema ja mis on protsessi järgmised etapid.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Skriptletid", 
		       "descr": "Looge ja hallake lahenduse Unified Service Desk skriptlete. Skriptletid on JavaScripti koodilõigud, mis käivitatakse lahenduse Unified Service Desk kontekstis.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Vormid", 
		       "descr": "Looge ja hallake vorme, mis talletavad deklaratiivse vormi määratlusi.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Suvandid", 
		       "descr": "Looge ja hallake lahenduse Unified Service Desk suvandeid. Suvandid on nimeväärtuste paarid, mida komponendid saavad kasutada.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Kasutajasätted", 
		       "descr": "Looge ja hallake lahenduse Unified Service Desk kasutajasätteid.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Kohandamisfail", 
		       "descr": "Saate luua ja hallata (.zip) faili, mis sisaldab Unified Service Deski kohandatud konfigureerimiseks vajalikke kohandamisfaile.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfiguratsioon", 
		       "descr": "Looge ja hallake lahenduse Unified Service Desk erinevate kasutajatega seostatavate varade konfiguratsioone.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Auditeerimise  diagnostika sätted", 
		       "descr": "Saate luua ja hallata lahenduse Unified Service Desk auditeerimise  diagnostika sätteid.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Manustamine", 
	    "doneButton": "Valmis", 
	    "attachButtonAltText": "Saate manustada tihendatud (.zip) faili, mis sisaldab kohandamisfaile.", 
	    "doneButtonAltText": "Saate laadida üles tihendatud (.zip) faili, mis sisaldab kohandamisfaile.", 
	    "deleteButtonAltText": "Saate tihendatud (.zip) faili eemaldada.", 
	    "deleteAttachmentTitle": "Saate manustatud faili kustutada", 
	    "fileValidationTitle": "Kehtetu FileType", 
	    "fileValidation": "Faili vorming ei sobi. Saate manustada ainult tihendatud (zip) faili. Tihendage kohandamisfailid zip-faili ja proovige siis uuesti manustada.\r\nUnified Service Desk ekstraktib failid zip-failist, laadides sisu klientrakenduse käivitamisel.", 
	    "fileLabel": "FAIL", 
	    "deleteConfirmation": "Kas soovite kindlasti manustatud faili kustutada?", 
	    "attachmentFailure": "Faili üleslaadimine nurjus. Proovige uuesti, valides üleslaadimiseks tihendatud (.zip) faili." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Kui valite selle vaikesätteks, alistatakse kõik eelnevalt määratud konfiguratsioonid. Kas soovite jätkata?", 
	    "OK": "Jätkamine", 
	    "Cancel": "Tühistamine", 
	    "title": "Kas soovite määrata selle konfiguratsiooni vaikesätteks?", 
	    "ErrorTitle": "Seda konfiguratsiooni ei saa vaikesätteks määrata.", 
	    "ErrorMessage": "Ainult aktiivseid konfiguratsioone saab vaikesätteks määrata. Aktiveerige see konfiguratsioon ja proovige siis uuesti.", 
	    "SetDefaultErrorMessage": "Valitud konfiguratsioon on juba vaikesäte.", 
	    "inactiveCloneTitle": "Kirjet ei saa kloonida", 
	    "inactiveCloneAlert": "Passiivset konfiguratsioonikirjet ei saa kloonida. Aktiveerige konfiguratsioonikirje ja proovige uuesti.", 
	    "cloningError": "Kirje kloonimisel ilmnes tõrge:", 
	    "okButton": "OK", 
	    "cloneTitle": "Olemasoleva konfiguratsiooni kloonimine", 
	    "cloneMessage": "Konfiguratsioonist uue eksemplari loomine.\r\nAlgse konfiguratsiooni väljaväärtused ja seotud kirjeviited kloonitakse.\r\nAlgse konfiguratsiooniga seostatud kasutajaid ei kloonita.", 
	    "cloneButton": "Kloonimine", 
	    "cloneCancel": "Tühistamine", 
	    "copy": " - Kopeerimine" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Saadaolevad väärtused", 
	    "selectedValues": "Valitud väärtused" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
