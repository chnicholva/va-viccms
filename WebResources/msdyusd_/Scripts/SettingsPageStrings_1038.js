Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Melyik elemet kívánja konfigurálni?", 
	    "data": [
			{ 
			    "title": "Központi vezérlők", 
			    "descr": "Központi vezérlők létrehozása és kezelése. A központi vezérlők a Unified Service Desk használatával létrehozott alkalmazások elsődleges elemei.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Eszköztárak", 
			    "descr": "Eszköztárak és gombok létrehozása és kezelése a Unified Service Desk számára. Az eszköztárak ábrával és szöveggel ellátott gombokat tartalmaznak, a gombok a műveletek végrehajtására szolgálnak.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Művelethívások", 
			    "descr": "Művelethívások létrehozása és kezelése a Unified Service Desk számára. A művelethívások hozzáadhatók eszköztárgombokhoz, eseményekhez, ablaknavigációs szabályokhoz és ügynököknek szóló forgatókönyvekben.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Események", 
			    "descr": "Események létrehozása és kezelése. Az események olyan értesítések, amelyeket egy központi vezérlő ad ki az alkalmazásnak azt jelezve, hogy valami történik.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Entitáskeresések", 
			    "descr": "Entitáskeresések létrehozása és kezelése. Az entitáskeresések lekérdezik a CRM webszolgáltatásait, és adatokat adnak vissza.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Ablaknavigációs szabályok", 
			    "descr": "Ablaknavigációs szabályok létrehozása és kezelése. Az ablaknavigációs szabályok határozzák meg a különböző vezérlők közötti tevékenységeket a Unified Service Desk megoldásban.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Munkamenetsorok", 
			    "descr": "Munkamenetsorok létrehozása és kezelése. A munkamenetsorok határozzák meg a munkamenet nevét és a munkamenet áttekintő adatait a Unified Service Desk megoldásban.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Forgatókönyvek az ügynököknek", 
		       "descr": "Ügynököknek szóló forgatókönyvek és válaszok létrehozása. A forgatókönyvek segítséget nyújtanak az ügynököknek, tartalmazzák a hívások során elmondandó szövegeket, valamint a folyamat következő lépéseit.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Szkriptletek", 
		       "descr": "Szkriptletek létrehozása és kezelése a Unified Service Desk számára. A szkriptletek JavaScript-kódrészletek, amelyek a Unified Service Desk környezetében hajthatók végre.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Űrlapok", 
		       "descr": "Űrlapok létrehozása és kezelése a deklaratív űrlap-definíciók tárolásához.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Beállítások", 
		       "descr": "Beállítások létrehozása és kezelése a Unified Service Desk számára. A beállítások névből és értékből álló párok, amelyeke az összetevők használnak.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Felhasználói beállítások", 
		       "descr": "Felhasználói beállítások létrehozása és tárolása a Unified Service Desk számára.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Testreszabási fájl", 
		       "descr": "Hozza létre, és kezelje a Unified Service Desk egyedi konfigurációjához szükséges testreszabási fájlokat tartalmazó tömörített (.zip formátumú) fájlt.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfiguráció", 
		       "descr": "Konfigurációk létrehozása és kezelése a Unified Service Desk eszközei számára. A konfigurációk különböző felhasználókhoz rendelhetők hozzá.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Naplózási és diagnosztikai beállítások", 
		       "descr": "Naplózási és diagnosztikai beállítások létrehozása és kezelése a Unified Service Desk számára.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Csatolás", 
	    "doneButton": "Kész", 
	    "attachButtonAltText": "Csatolja a testreszabási fájlokat tartalmazó tömörített (.zip) fájlt.", 
	    "doneButtonAltText": "Töltse fel a testreszabási fájlokat tartalmazó tömörített (.zip) fájlt.", 
	    "deleteButtonAltText": "Távolítsa el a tömörített (.zip) fájlt.", 
	    "deleteAttachmentTitle": "A csatolt fájl törlése", 
	    "fileValidationTitle": "Érvénytelen FileType", 
	    "fileValidation": "A formátum nem érvényes. Csak tömörített (.zip) fájl csatolható. Tömörítse .zip fájlba a testre szabási fájlokat, és úgy próbálja újra csatolni őket.\r\nA Unified Service Desk az ügyfélalkalmazás indulásakor a tartalmak betöltéséhez kitömöríti a .zip fájlban lévő fájlokat.", 
	    "fileLabel": "FÁJL", 
	    "deleteConfirmation": "Biztosan törli a csatolt fájlt?", 
	    "attachmentFailure": "A fájl feltöltése nem sikerült. Tömörített (.zip) fájlt jelöljön ki feltöltésre, és próbálkozzon újra." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Ha ezt választja alapértelmezettként, felülbírál minden korábban beállított konfigurációt. Folytatja?", 
	    "OK": "Folytatás", 
	    "Cancel": "Mégse", 
	    "title": "Beállítja a konfigurációt alapértelmezettként?", 
	    "ErrorTitle": "Ez a konfiguráció nem állítható be alapértelmezettként.", 
	    "ErrorMessage": "Csak aktív konfiguráció állítható be alapértelmezettként. Aktiválja ezt a konfigurációt, majd próbálkozzon újra.", 
	    "SetDefaultErrorMessage": "Már a kijelölt konfiguráció az alapértelmezett.", 
	    "inactiveCloneTitle": "Nem klónozható a rekord", 
	    "inactiveCloneAlert": "Inaktív konfigurációs rekord nem klónozható. Aktiválja a konfigurációs rekordot, majd próbálkozzon újra.", 
	    "cloningError": "Hiba történt a rekord klónozása során:", 
	    "okButton": "OK", 
	    "cloneTitle": "Meglévő konfiguráció klónozása", 
	    "cloneMessage": "Készítsen új másolatot a konfigurációról.\r\nA rendszer klónozza az eredeti konfiguráció mezőértékeit és kapcsolódó rekordreferenciáit.\r\nAz eredeti konfigurációval társított felhasználók klónozására nem kerül sor.", 
	    "cloneButton": "Klónozás", 
	    "cloneCancel": "Mégse", 
	    "copy": " – Másolás" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Választható értékek", 
	    "selectedValues": "Kiválasztott értékek" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
