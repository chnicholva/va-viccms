Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Kterou položku chcete konfigurovat?", 
	    "data": [
			{ 
			    "title": "Hostované ovládací prvky", 
			    "descr": "Můžete vytvářet a spravovat hostované ovládací prvky. Hostované ovládací prvky jsou primární prvky sloužící k vytváření aplikací využívajících Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Panely nástrojů", 
			    "descr": "Můžete vytvářet a spravovat panely nástrojů a tlačítka pro Unified Service Desk. Panely nástrojů obsahují tlačítka s obrázky a texty a tlačítka se používají k provádění akcí.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Volání akcí", 
			    "descr": "Můžete vytvářet a spravovat volání akcí pro Unified Service Desk. Volání akcí se dají přidat k tlačítkům na panelech nástrojů, událostem, pravidlům navigace v okně a skriptům agenta.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Události", 
			    "descr": "Můžete vytvářet a spravovat události. Události jsou oznámení o aktivaci hostovaného ovládacího prvku, která aplikaci sdělují, že se něco děje.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Hledání entit", 
			    "descr": "Můžete vytvářet a spravovat hledání entit. Hledání entit umožňují dotazovat webové služby CRM a vracet data.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Pravidla navigace v okně", 
			    "descr": "Můžete vytvářet a spravovat pravidla navigace v okně. Tato pravidla definují interakci mezi různými ovládacími prvky Unified Service Desku.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Řádky relace", 
			    "descr": "Můžete vytvářet a spravovat řádky relace. Řádky relace definují název a přehledové informace relace v Unified Service Desku.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Skripty agenta", 
		       "descr": "Můžete vytvářet a spravovat úkoly a odpovědi ve skriptech agenta. Skripty agentovi napovídají, co by měl říkat při hovorech a jaké jsou následující kroky v procesu.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Skriptlety", 
		       "descr": "Můžete vytvářet a spravovat skriptlety pro Unified Service Desk. Skriptlety jsou fragmenty javascriptového kódu, které se spouštějí v kontextu Unified Service Desku.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formuláře", 
		       "descr": "Můžete vytvářet a spravovat formuláře, které slouží k ukládání deklarativních definic formulářů.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Možnosti", 
		       "descr": "Můžete vytvářet a spravovat možnosti pro Unified Service Desk. Možnosti jsou dvojice název/hodnota, které můžou být využívané součástmi.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Uživatelská nastavení", 
		       "descr": "Můžete vytvářet a spravovat uživatelská nastavení pro Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Soubor vlastního nastavení", 
		       "descr": "Vytvořte a spravujte komprimovaný soubor (.zip), který obsahuje soubory vlastního nastavení potřebné pro vlastní konfiguraci Unified Service Desku.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfigurace", 
		       "descr": "Můžete vytvářet a spravovat konfigurace pro prostředky Unified Service Desku, které se dají přidružit k různým uživatelům.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Nastavení auditu a diagnostiky", 
		       "descr": "Vytvořte a spravujte nastavení auditu a diagnostiky pro Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Připojit", 
	    "doneButton": "Hotovo", 
	    "attachButtonAltText": "Připojte komprimovaný soubor (.zip), který obsahuje soubory vlastního nastavení.", 
	    "doneButtonAltText": "Nahrajte komprimovaný soubor (.zip), který obsahuje soubory vlastního nastavení.", 
	    "deleteButtonAltText": "Odeberte komprimovaný soubor (.zip).", 
	    "deleteAttachmentTitle": "Odstranit připojený soubor", 
	    "fileValidationTitle": "Neplatný typ souboru", 
	    "fileValidation": "Tento formát souboru není platný. Můžete připojit jenom zkomprimovaný soubor (.zip). Zkomprimujte soubory vlastního nastavení do souboru .zip a pak je zkuste znovu připojit.\r\nUnified Service Desk rozbalí soubory ze souboru .zip a obsah se načte při spuštění klientské aplikace.", 
	    "fileLabel": "SOUBOR", 
	    "deleteConfirmation": "Určitě chcete odstranit připojený soubor?", 
	    "attachmentFailure": "Soubor se nepovedlo nahrát. Vyberte komprimovaný soubor (.zip), který chcete nahrát, a zkuste to znovu." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Pokud tuto konfiguraci vyberete jako výchozí, přepíše se dřív nastavená konfigurace. Chcete pokračovat?", 
	    "OK": "Pokračovat", 
	    "Cancel": "Zrušit", 
	    "title": "Chcete tuto konfiguraci nastavit jako výchozí?", 
	    "ErrorTitle": "Tato konfigurace se nedá nastavit jako výchozí.", 
	    "ErrorMessage": "Jako výchozí se dají nastavit jenom aktivní konfigurace. Aktivujte tuto konfiguraci a pak to zkuste znovu.", 
	    "SetDefaultErrorMessage": "Vybraná konfigurace už je výchozí.", 
	    "inactiveCloneTitle": "Záznam nejde naklonovat", 
	    "inactiveCloneAlert": "Neaktivní záznam konfigurace nejde naklonovat. Aktivujte tento záznam konfigurace a zkuste to znovu.", 
	    "cloningError": "Při klonování záznamu se stala chyba:", 
	    "okButton": "OK", 
	    "cloneTitle": "Klonovat existující konfiguraci", 
	    "cloneMessage": "Vytvořte novou kopii této konfigurace.\r\nNaklonují se hodnoty polí a odkazy na související záznamy z původní konfigurace.\r\nUživatelé přidružení k původní konfiguraci se nenaklonují.", 
	    "cloneButton": "Klonovat", 
	    "cloneCancel": "Zrušit", 
	    "copy": " – kopie" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Dostupné hodnoty", 
	    "selectedValues": "Vybrané hodnoty" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
