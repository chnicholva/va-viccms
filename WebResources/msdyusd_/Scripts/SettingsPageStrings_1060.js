Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Kateri element želite konfigurirati?", 
	    "data": [
			{ 
			    "title": "Gostujoči kontrolniki", 
			    "descr": "Ustvarite in upravljajte gostujoče kontrolnike. Gostujoči kontrolniki so osnovni elementi, ki se uporabljajo za ustvarjanje aplikacij s programom Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Orodne vrstice", 
			    "descr": "Ustvarite ter upravljajte orodne vrstice in gumbe za program Unified Service Desk. Orodne vrstice vključujejo gumbe s slikami in besedilom, ki se uporabljajo za izvajanje dejanj.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Pozivi k dejanju", 
			    "descr": "Ustvarite in upravljajte pozive k dejanju za program Unified Service Desk. Pozive k dejanju lahko dodate gumbom v orodni vrstici, dogodkom, pravilom krmarjenja v oknu in skriptom posrednika.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Dogodki", 
			    "descr": "Ustvarite in upravljajte dogodke. Dogodki so obvestila, ki jih sproži gostujoči kontrolnik, da obvesti program o dogajanju.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Iskanja po entitetah", 
			    "descr": "Ustvarite in upravljajte iskanja po entitetah. Iskanja po entitetah pošiljajo poizvedbe spletnim storitvam CRM za vrnitev podatkov.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Pravila krmarjenja v oknu", 
			    "descr": "Ustvarite in upravljajte pravila za krmarjenje v oknu. Pravila za krmarjenje v oknu določajo interakcijo med različnimi kontrolniki v programu Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Vrstice sej", 
			    "descr": "Ustvarite in upravljajte vrstice sej. Vrstice sej določajo informacije o imenih in pregledih sej v programu Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Skripti posrednika", 
		       "descr": "Ustvarite ter upravljajte opravila in odgovore skriptov posrednika. Skriptno izvajanje posrednika zagotavlja vodila za posrednike glede tega, kako naj odgovarjajo na klice in kateri so naslednji koraki v procesu.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "ScriptLets", 
		       "descr": "Ustvarite in upravljajte miniskripte za program Unified Service Desk. Miniskripti so izrezki jezika JavaScript, ki se izvedejo v kontekstu programa Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Obrazci", 
		       "descr": "Ustvarite in upravljajte obrazce, ki hranijo deklarativne definicije obrazca.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Možnosti", 
		       "descr": "Ustvarite in upravljajte možnosti za program Unified Service Desk. Možnosti so pari imenskih vrednosti, ki jih lahko uporabljajo komponente.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Uporabniške nastavitve", 
		       "descr": "Ustvarite in upravljajte uporabniške nastavitve za program Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Datoteka za prilagajanje", 
		       "descr": "Ustvarite in upravljajte stisnjeno datoteko (.zip), v kateri so datoteke za prilagajanje, potrebne za konfiguracijo po meri v programu Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfiguracija", 
		       "descr": "Ustvarite in upravljajte konfiguracije za sredstva Unified Service Desk, ki jih je mogoče povezati z različnimi uporabniki.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Nastavitve spremljanja sprememb in diagnostike", 
		       "descr": "Ustvarite in upravljajte nastavitve spremljanja sprememb in diagnostike za program Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Priloži", 
	    "doneButton": "Dokončano", 
	    "attachButtonAltText": "Priložite stisnjeno datoteko (.zip), ki vsebuje datoteke za prilagajanje.", 
	    "doneButtonAltText": "Naložite stisnjeno datoteko (.zip), ki vsebuje datoteke za prilagajanje.", 
	    "deleteButtonAltText": "Odstranite stisnjeno datoteko (.zip).", 
	    "deleteAttachmentTitle": "Odstrani priloženo datoteko", 
	    "fileValidationTitle": "Neveljavna vrsta FileType", 
	    "fileValidation": "Oblika zapisa datoteke ni veljavna. Priložite lahko samo stisnjeno datoteko (.zip). Stisnite datoteke za prilagoditev v datoteko .zip in jo nato poskusite znova priložiti.\r\nRešitev Unified Service Desk izvleče datoteke iz datoteke .zip in naloži vsebino, ko se odjemalski program zažene.", 
	    "fileLabel": "DATOTEKA", 
	    "deleteConfirmation": "Ali ste prepričani, da želite izbrisati priloženo datoteko?", 
	    "attachmentFailure": "Datoteke ni bilo mogoče naložiti. Poskusite znova in izberite stisnjeno datoteko (.zip), ki jo želite naložiti." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Če izberete to konfiguracijo kot privzeto, preglasite prej nastavljeno konfiguracij. Ali želite nadaljevati?", 
	    "OK": "Nadaljuj", 
	    "Cancel": "Prekliči", 
	    "title": "Ali želite nastaviti to konfiguracijo kot privzeto?", 
	    "ErrorTitle": "Te konfiguracije ni mogoče nastaviti kot privzete.", 
	    "ErrorMessage": "Samo aktivne konfiguracije lahko nastavite kot privzete. Aktivirajte to konfiguracijo in nato poskusite znova.", 
	    "SetDefaultErrorMessage": "Izbrana konfiguracija je že privzeta.", 
	    "inactiveCloneTitle": "Zapisa ni mogoče klonirati", 
	    "inactiveCloneAlert": "Nedejavnega zapisa konfiguracije ne morete klonirati. Aktivirajte zapis konfiguracije in poskusite znova.", 
	    "cloningError": "Med kloniranjem zapisa je prišlo do napake:", 
	    "okButton": "V redu", 
	    "cloneTitle": "Kloniraj obstoječo konfiguracijo", 
	    "cloneMessage": "Ustvarite novo kopijo te konfiguracije.\r\nVrednosti polj in sklici na sorodne zapise iz izvirne konfiguracije bodo klonirani.\r\nUporabniki, povezani z izvirno konfiguracijo, ne bodo klonirani.", 
	    "cloneButton": "Kloniraj", 
	    "cloneCancel": "Prekliči", 
	    "copy": " – kopija" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Vrednosti, ki so na voljo", 
	    "selectedValues": "Izbrane vrednosti" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
