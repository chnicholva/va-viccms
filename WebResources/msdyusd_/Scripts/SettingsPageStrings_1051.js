Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Ktorú položku chcete konfigurovať?", 
	    "data": [
			{ 
			    "title": "Ovládacie prvky na hostiteľskom systéme", 
			    "descr": "Vytvárajte a spravujte ovládacie prvky na hostiteľskom systéme. Ovládacie prvky na hostiteľskom systéme sú základné prvky používané na tvorbu aplikácií pomocou riešenia Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Panely s nástrojmi", 
			    "descr": "Vytvárajte a spravujte panely s nástrojmi a tlačidlá pre riešenie Unified Service Desk. Panely s nástrojmi obsahujú tlačidlá s obrázkami a textom, tlačidlá sa používajú na vykonanie akcií.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Volania akcie", 
			    "descr": "Vytvárajte a spravujte volania akcie pre riešenie Unified Service Desk. Volania akcie možno pridať k tlačidlám na paneli s nástrojmi, udalostiam, pravidlám navigácie v okne a agentským skriptom.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Udalosti", 
			    "descr": "Vytvárajte a spravujte udalosti. Udalosti sú oznámenia, ktoré spúšťa ovládací prvok na hostiteľskom systéme, aby upozornil aplikáciu na určitú činnosť.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Vyhľadávania v entitách", 
			    "descr": "Vytvárajte a spravujte vyhľadávania v entitách. Vyhľadávania v entitách dotazujú webové služby systému CRM, aby vrátili údaje.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Pravidlá navigácie v okne", 
			    "descr": "Vytvárajte a spravujte pravidlá navigácie v okne. Pravidlá navigácie v okne definujú interakciu medzi rôznymi ovládacími prvkami v riešení Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Riadky relácie", 
			    "descr": "Vytvárajte a spravujte riadky relácie. Riadky relácie definujú názov relácie a prehľadové informácie o relácii v riešení Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Agentské skripty", 
		       "descr": "Vytvárajte a spravujte úlohy a odpovede agentských skriptov. Agentské skriptovanie poskytuje sprievodcu agentom v súvislosti s tým, čo hovoriť pri telefonátoch a aké sú ďalšie kroky v rámci procesu.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Skriptlety", 
		       "descr": "Vytvárajte a spravujte skriptlety pre riešenie Unified Service Desk. Skriptlety sú zlomky jazyka JavaScript, ktoré sa spúšťajú v kontexte riešenia Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formuláre", 
		       "descr": "Vytvárajte a spravujte formuláre, v ktorých sú uložené deklaratívne definície formulára.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Možnosti", 
		       "descr": "Vytvárajte a spravujte možnosti pre riešenie Unified Service Desk. Možnosti sú páry názov/hodnota, ktoré môžu využívať komponenty.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Používateľské nastavenia", 
		       "descr": "Vytvárajte a spravujte používateľské nastavenia pre riešenie Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Súbor prispôsobenia", 
		       "descr": "Vytvorte a spravujte komprimovaný súbor (.zip), ktorý obsahuje súbory prispôsobenia potrebné na vlastnú konfiguráciu v aplikácii Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfigurácia", 
		       "descr": "Vytvárajte a spravujte konfigurácie pre prostriedky riešenia Unified Service Desk, ktoré možno priradiť k rôznym používateľom.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Nastavenia auditu a diagnostiky", 
		       "descr": "Vytvorte a spravujte nastavenia auditu a diagnostiky pre aplikáciu Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Priložiť", 
	    "doneButton": "Hotovo", 
	    "attachButtonAltText": "Priložte komprimovaný súbor (.zip), ktorý obsahuje súbory prispôsobenia.", 
	    "doneButtonAltText": "Odovzdajte komprimovaný súbor (.zip), ktorý obsahuje súbory prispôsobenia.", 
	    "deleteButtonAltText": "Odstráňte komprimovaný súbor (.zip).", 
	    "deleteAttachmentTitle": "Odstráňte priložený súbor", 
	    "fileValidationTitle": "Neplatný typ FileType", 
	    "fileValidation": "Formát súboru nie je platný. Môžete priložiť iba komprimovaný súbor (.zip). Skomprimujte súbory prispôsobenia do súboru .zip a potom skúste zopakovať priloženie.\r\nSlužba Unified Service Desk pri spustení klientskej aplikácie extrahuje súbory na načítanie obsahu zo súboru .zip.", 
	    "fileLabel": "SÚBOR", 
	    "deleteConfirmation": "Naozaj chcete odstrániť priložený súbor?", 
	    "attachmentFailure": "Odovzdanie súboru zlyhalo. Skúste to znova výberom komprimovaného súboru (.zip), ktorý chcete odovzdať." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Ak zvolíte túto konfiguráciu ako predvolenú, predtým nastavená konfigurácia sa prepíše. Chcete pokračovať?", 
	    "OK": "Pokračovať", 
	    "Cancel": "Zrušiť", 
	    "title": "Chcete nastaviť túto konfiguráciu ako predvolenú?", 
	    "ErrorTitle": "Táto konfigurácia sa nedá nastaviť ako predvolená.", 
	    "ErrorMessage": "Ako predvolené sa dajú nastaviť iba aktívne konfigurácie. Aktivujte túto konfiguráciu a potom to skúste znova.", 
	    "SetDefaultErrorMessage": "Vybratá konfigurácia je už predvolená.", 
	    "inactiveCloneTitle": "Záznam sa nedá klonovať", 
	    "inactiveCloneAlert": "Neaktívny záznam konfigurácie sa nedá klonovať. Aktivujte tento záznam konfigurácie a skúste to znova.", 
	    "cloningError": "Počas klonovania záznamu sa vyskytla chyba:", 
	    "okButton": "OK", 
	    "cloneTitle": "Klonovať existujúcu konfiguráciu", 
	    "cloneMessage": "Vytvorte novú kópiu tejto konfigurácie.\r\nBudú sa klonovať hodnoty poľa a súvisiace odkazy na záznam z pôvodnej konfigurácie.\r\nPoužívatelia priradení k pôvodnej konfigurácii sa nebudú klonovať.", 
	    "cloneButton": "Klonovať", 
	    "cloneCancel": "Zrušiť", 
	    "copy": " – Kopírovať" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Dostupné hodnoty", 
	    "selectedValues": "Vybraté hodnoty" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
