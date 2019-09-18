Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Zein elementu konfiguratu nahi duzu?", 
	    "data": [
			{ 
			    "title": "Ostatatutako kontrolak", 
			    "descr": "Sortu eta kudeatu ostatatutako kontrolak. Unified Service Desk erabilita aplikazioak sortzeko elementu nagusiak dira horiek.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Tresna-barrak", 
			    "descr": "Sortu eta kudeatu Unified Service Desk zerbitzuaren tresna-barrak eta botoiak. Tresna-barrek irudiak eta testua duten botoiak dituzte, eta botoiak ekintzak gauzatzeko erabiltzen dira.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Ekintza-deiak", 
			    "descr": "Sortu eta kudeatuUnified Service Desk zerbitzuaren ekintza-deiak. Tresna-barrako botoietan, gertaeretan, leihoetako nabigazio-arauetan eta agente-scriptetan gehi daitezke ekintza-deiak.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Gertaerak", 
			    "descr": "Sortu eta kudeatu gertaerak. Ostatatutako kontrolek bidaltzen dituzten jakinarazpenak dira gertaerak, eta aplikazioari zerbait gertatzen ari denaren berri ematen diote.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Entitate-bilaketak", 
			    "descr": "Sortu eta kudeatu entitate-bilaketak. Entitate-bilaketek datuak itzultzeko eskatzen diete CRM web-zerbitzuei.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Leihoaren nabigazio-arauak", 
			    "descr": "Sortu eta kudeatu leihoetako nabigazio-arauak. Unified Service Desk zerbitzuaren kontrolen arteko interakzioa zehazten dute leihoetako nabigazio-arauek.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Saio-lineak", 
			    "descr": "Sortu eta kudeatu saioen lerroak. Saioaren izena eta laburpena zehazten dituzte saioen lerroek Unified Service Desk zerbitzuan.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Agente-scriptak", 
		       "descr": "Sortu eta kudeatu agente-scripten zereginak eta erantzunak. Agente-scriptgintzari esker, agenteei argibideak eskaintzen zaizkie deietan zer esan eta prozesuaren hurrengo urratsak zein diren jakiteko.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlets", 
		       "descr": "Sortu eta kudeatu Unified Service Desk zerbitzuaren scriptletak. JavaScript kodearen zatiak dira horiek, Unified Service Desk zerbitzuan exekutatzen direnak.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Inprimakiak", 
		       "descr": "Sortu eta kudeatu inprimaki-definizio deklaratiboak gordetzen dituzten inprimakiak.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Aukerak", 
		       "descr": "Sortu eta kudeatu Unified Service Desk zerbitzuaren aukerak. Osagaiek erabil ditzaketen balio bikoteak dira aukerak.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Erabiltzaile-ezarpenak", 
		       "descr": "Sortu eta kudeatu Unified Service Desk zerbitzuaren erabiltzaile-ezarpenak.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Pertsonalizazio-fitxategia", 
		       "descr": "Sortu eta kudeatu Unified Service Desk-en konfigurazio pertsonalizatua egiteko beharrezko pertsonalizazio-fitxategiak dituen fitxategi konprimatua (.zip).", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfigurazioa", 
		       "descr": "Sortu eta kudeatu hainbat erabiltzailerekin erlaziona daitezkeen Unified Service Desk zerbitzuaren aktiboen konfigurazioak.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Auditoretzaren eta diagnostikoen ezarpenak", 
		       "descr": "Sortu eta kudeatu Unified Service Desk-en auditoretzaren eta diagnostikoen ezarpenak.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Erantsi", 
	    "doneButton": "Eginda", 
	    "attachButtonAltText": "Erantsi pertsonalizazio-fitxategiak dituen fitxategi konprimatua (.zip).", 
	    "doneButtonAltText": "Kargatu pertsonalizazio-fitxategiak dituen fitxategi konprimatua (.zip).", 
	    "deleteButtonAltText": "Kendu fitxategi konprimatua (.zip).", 
	    "deleteAttachmentTitle": "Ezabatu erantsitako fitxategia", 
	    "fileValidationTitle": "FileType baliogabea", 
	    "fileValidation": "Fitxategi-formatua ez da baliozkoa. Fitxategi konprimatuak (.zip) soilik erants ditzakezu. Konprimatu pertsonalizazio-fitxategiak .zip fitxategi batean, eta saiatu berriro.\r\nUnified Service Desk-ek .zip fitxategiko fitxategiak atera eta edukiak kargatuko ditu bezero-aplikazioa abiarazten denean.", 
	    "fileLabel": "FITXATEGIA", 
	    "deleteConfirmation": "Ziur erantsitako fitxategia ezabatu nahi duzula?", 
	    "attachmentFailure": "Ezin izan da fitxategia kargatu. Hautatu kargatzeko fitxategi konprimatu bat (.zip), eta saiatu berriro." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Lehenetsi gisa hautatzen baduzu, aurretik ezarritako konfigurazioa gainidatziko da. Jarraitu nahi duzu?", 
	    "OK": "Jarraitu", 
	    "Cancel": "Utzi", 
	    "title": "Konfigurazioa lehenetsi gisa ezarri nahi duzu?", 
	    "ErrorTitle": "Ezin da konfigurazio hau ezarri lehenetsi gisa.", 
	    "ErrorMessage": "Konfigurazio aktiboak soilik ezar daitezke lehenetsi gisa. Aktibatu konfigurazioa, eta saiatu berriro.", 
	    "SetDefaultErrorMessage": "Hautatutako konfigurazioa bada lehenetsia.", 
	    "inactiveCloneTitle": "Ezin da erregistroa klonatu", 
	    "inactiveCloneAlert": "Ezin dituzu konfigurazio-erregistro inaktiboak klonatu. Aktibatu konfigurazio-erregistroa, eta saiatu berriro.", 
	    "cloningError": "Errore bat gertatu da erregistroa klonatzean:", 
	    "okButton": "Ados", 
	    "cloneTitle": "Klonatu konfigurazioa", 
	    "cloneMessage": "Sortu konfigurazioaren kopia bat.\r\nJatorrizko konfigurazioaren eremu-balioak eta erlazionatutako erregistro-erreferentziak klonatuko dira.\r\nEz dira jatorrizko konfigurazioarekin erlazionatutako erabiltzaileak klonatuko.", 
	    "cloneButton": "Klonatu", 
	    "cloneCancel": "Utzi", 
	    "copy": " - Kopiatu" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Balio erabilgarriak", 
	    "selectedValues": "Hautatutako balioak" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
