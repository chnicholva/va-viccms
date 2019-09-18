Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Kuru elementu vēlaties konfigurēt?", 
	    "data": [
			{ 
			    "title": "Viesotās vadīklas", 
			    "descr": "Izveidojiet un pārvaldiet viesotās vadīklas. Viesotās vadīklas ir galvenie elementi, kas tiek izmantoti lietojumprogrammu veidošanai, izmantojot risinājumu Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Rīkjoslas", 
			    "descr": "Izveidojiet un pārvaldiet risinājumam Unified Service Desk paredzētas rīkjoslas un pogas. Rīkjoslās ir ietvertas pogas ar attēliem un tekstu, un pogas tiek izmantotas darbību izpildei.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Darbību izsaukumi", 
			    "descr": "Izveidojiet un pārvaldiet risinājumam Unified Service Desk paredzētus darbību izsaukumus. Darbību izsaukumus var pievienot rīkjoslas pogām, notikumiem, loga navigācijas kārtulām un aģenta skriptiem.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Notikumi", 
			    "descr": "Izveidojiet un pārvaldiet notikumus. Notikumi ir paziņojumi, kurus aktivizē viesotā vadīkla, lai norādītu lietojumprogrammai, ka kaut kas notiek.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Entītiju meklējumi", 
			    "descr": "Izveidojiet un pārvaldiet entītiju meklējumus. Entītiju meklējumi nosūta vaicājumus uz CRM tīmekļa pakalpojumiem, lai atgrieztu datus.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Loga navigācijas kārtulas", 
			    "descr": "Izveidojiet un pārvaldiet loga navigācijas kārtulas. Loga navigācijas kārtulas definē dažādu vadīklu saziņu risinājumā Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Sesijas rindas", 
			    "descr": "Izveidojiet un pārvaldiet sesijas rindas. Sesijas rindas definē sesijas nosaukumu un sesijas pārskata informāciju risinājumā Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Aģenta skripti", 
		       "descr": "Izveidojiet un pārvaldiet aģenta skriptu uzdevumus un atbildes. Aģenta skriptēšana sniedz norādes aģentiem par to, kas jāsaka zvanu laikā un kādas ir nākamās darbības procesā.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Skriptleti", 
		       "descr": "Izveidojiet un pārvaldiet risinājumam Unified Service Desk paredzētus skriptletus. Skriptleti ir JavaScript fragmenti, kas tiek izpildīti risinājuma Unified Service Desk kontekstā.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Veidlapas", 
		       "descr": "Izveidojiet un pārvaldiet veidlapas, kurās tiek glabātas deklaratīvās veidlapas definīcijas.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Opcijas", 
		       "descr": "Izveidojiet un pārvaldiet Unified Service Desk opcijas. Opcijas ir nosaukumu un vērtību pāri, kurus var izmantot komponenti.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Lietotāju iestatījumi", 
		       "descr": "Izveidojiet un pārvaldiet Unified Service Desk lietotāju iestatījumus.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Pielāgošanas fails", 
		       "descr": "Izveidojiet un pārvaldiet saspiesto (.zip) failu, kurā ietverti pielāgošanas faili, kas nepieciešami pielāgotai konfigurācijai risinājumā Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfigurācija", 
		       "descr": "Izveidojiet un pārvaldiet konfigurācijas Unified Service Desk aktīviem, kas var būt saistīti ar dažādiem lietotājiem.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Audita un diagnostikas iestatījumi", 
		       "descr": "Izveidojiet un pārvaldiet Unified Service Desk audita un diagnostikas iestatījumus.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Pievienot", 
	    "doneButton": "Gatavs", 
	    "attachButtonAltText": "Pievienojiet saspiesto (.zip) failu, kurā ietverti pielāgošanas faili.", 
	    "doneButtonAltText": "Augšupielādējiet saspiesto (.zip) failu, kurā ietverti pielāgošanas faili.", 
	    "deleteButtonAltText": "Noņemiet saspiesto (.zip) failu.", 
	    "deleteAttachmentTitle": "Dzēst pievienoto failu", 
	    "fileValidationTitle": "Nederīgs FileType", 
	    "fileValidation": "Faila formāts nav derīgs. Varat pievienot tikai saspiestu (.zip) failu. Saspiediet pielāgošanas failus vienā .zip failā un pēc tam mēģiniet pievienot vēlreiz.\r\nUnified Service Desk izgūs failus no .zip faila, lai ielādētu saturu, kad tiek startēta klienta programma.", 
	    "fileLabel": "FAILS", 
	    "deleteConfirmation": "Vai tiešām vēlaties dzēst pievienoto failu?", 
	    "attachmentFailure": "Faila augšupielāde neizdevās. Mēģiniet vēlreiz, atlasot augšupielādējamo saspiesto (.zip) failu." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Atlasot šo kā noklusējumu, tiks pārlabotas visas iepriekš iestatītās konfigurācijas. Vai vēlaties turpināt?", 
	    "OK": "Turpināt", 
	    "Cancel": "Atcelt", 
	    "title": "Vai vēlaties iestatīt šo konfigurāciju kā noklusējumu?", 
	    "ErrorTitle": "Šo konfigurāciju nevar iestatīt kā noklusējumu.", 
	    "ErrorMessage": "Tikai aktīvās konfigurācijas var iestatīt kā noklusējumu. Aktivizējiet šo konfigurāciju un pēc tam mēģiniet vēlreiz.", 
	    "SetDefaultErrorMessage": "Atlasītā konfigurācija jau ir noklusējuma konfigurācija.", 
	    "inactiveCloneTitle": "Nevar klonēt ierakstu", 
	    "inactiveCloneAlert": "Nevar klonēt neaktīvu konfigurācijas ierakstu. Aktivizējiet konfigurācijas ierakstu un mēģiniet vēlreiz.", 
	    "cloningError": "Klonējot ierakstu, radās kļūda:", 
	    "okButton": "Labi", 
	    "cloneTitle": "Klonēt pastāvošu konfigurāciju", 
	    "cloneMessage": "Izveidojiet jaunu šīs konfigurācijas kopiju.\r\nTiks klonētas lauku vērtības un saistīto ierakstu atsauces no sākotnējās konfigurācijas.\r\nAr sākotnējo konfigurāciju saistītie lietotāji klonēti netiks.", 
	    "cloneButton": "Klonēt", 
	    "cloneCancel": "Atcelt", 
	    "copy": " - Kopēt" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Pieejamās vērtības", 
	    "selectedValues": "Atlasītās vērtības" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
